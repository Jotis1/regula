# Artefacto "Jotis.me"

Genera el artefacto "Jotis.me" de Claude (tipo Design System) desde el repo (design D6 y D7 de `openspec/changes/adopt-repo-as-source`). El repo es la fuente de verdad: el artefacto es una copia generada y de solo lectura (`"editing": "code"`).

```sh
bunx turbo run build          # el generador lee los paquetes ya construidos
bun run artifact:build        # → dist-artifact/project/ y dist-artifact/manifest.json
```

Sin red. Escribe:

- `project/`: el índice, `tokens.json` (con `meta.source` `github`), la guía (`README.md`, desde las páginas de fundamentos de la web), las fuentes, cada componente del catálogo con su ficha y su vista previa, la portada, el bundle (`@jotis-me/react` para React 18 en `window.Jotis`, con los ejemplos de la web en `Jotis.previews`), la hoja, los tipos, React 18 en `components/lib/` y los grupos de assets (iconos de app, iconos, trazos y patrones).
- `manifest.json`: ruta, tamaño y sha256 de cada fichero y de cada asset, y `uploads`, los assets que hay que subir antes de publicar el índice.

Sin `--published` el índice es un **borrador** (`draft: true`): sus assets no tienen blob y no se puede publicar tal cual. Sirve para los tests y para revisar.

Tests: `bun test ./test` (estructura, límites del tipo, tokens, fichas, índice y tipos, con la red bloqueada) y `bun run test:e2e` (bundle con React 18, hoja y cada vista previa frente a su captura aprobada; en Windows, como las capturas).

## Publicar

Después de cada versión publicada de los paquetes, o cuando haga falta, se pide a Claude (Claude Code, con las herramientas de artefactos) que sincronice el artefacto siguiendo estos pasos. Slug: `bb424412-8082-461e-a84f-b3704de675c1`.

1. **¿Va atrasado?** Lee el índice publicado (`read_file` de `project/design-system.json`) y compara el commit de su `lastChange.via` (`GitHub · Jotis1/regula@<sha>`) con el de la última versión (`git describe --tags --abbrev=0 --match "@jotis-me/react@*"`). Si no coinciden, di qué versiones se quedaron sin sincronizar (`git tag --merged HEAD --contains <sha> --list "@jotis-me/react@*"`) antes de seguir. En la primera sincronización, `lastChange` tiene que ser el de la `1793805785-9fe2` (Scaena, 2026-11-04): si no, alguien lo editó a mano y hay que mirarlo antes de pisarlo.
2. **Construye** desde el commit de la versión (árbol limpio): `bunx turbo run build`.
3. **Guarda lo publicado** en `dist-artifact/`:
   - `published.json`: el texto del índice, tal cual (sin la etiqueta que añade la herramienta).
   - `asset-shas.json`: de `list_assets`, `{ "<opaque_id>": "<source_sha256>" }`. Usa `source_sha256` (el de lo que se subió) y no `sha256`, que es el del fichero ya guardado y puede no coincidir.
4. **Genera con lo publicado**: `bun run artifact:build --published dist-artifact/published.json --asset-shas dist-artifact/asset-shas.json`. Cada asset reutiliza su blob si no ha cambiado. Si alguno es nuevo o distinto, falla con la lista de los que hay que subir.
5. **Sube los assets** de esa lista con `upload_asset` (fichero en `dist-artifact/project/assets/<Grupo>/<nombre>`) y guarda en `dist-artifact/blobs.json` cada id: `{ "<Grupo>/<nombre>": "<id de /_blob/<id>>" }`. Vuelve a generar con `--blobs dist-artifact/blobs.json`: ya no debe faltar ninguno (`uploads` vacío).
6. **Publica los ficheros cambiados**: compara `manifest.json` (`files`) con `list_files` por sha256 y envía con `publish_files` (`mode: "patch"`, `base_version` la de `list_files`) solo los que cambian, todos menos `project/design-system.json`, en llamadas de 255 como mucho. Los que estén publicados y ya no salgan del repo (un componente retirado) se listan y se quitan con `remove` solo si el usuario lo confirma.
7. **El índice, el último**: vuelve a leer `project/design-system.json`, guárdalo en `published.json`, genera otra vez (paso 4 con `--blobs`) y publica solo `project/design-system.json`. Lleva `"editing": "code"` y `lastChange` con `via` `GitHub · Jotis1/regula@<sha>`.
8. **Comprueba**: `list_files` coincide con `manifest.json`, la página dice que se cambia en el código y abre en solo lectura, y cinco vistas previas (Button, Input, Modal, AppIcon y StreamAlert) se ven como en la web en claro y en oscuro.

Si hay que volver atrás: republica los ficheros de `reference/` (versión `9fe2`) sin `"editing": "code"`. El repo no depende del artefacto en ningún paso.

## Por qué así

- **Sin red y sin publicar desde CI**: el tipo solo se escribe con las herramientas de artefactos de Claude; el generador deja todo listo y verificable en local y en CI.
- **El índice se fusiona, no se reescribe**: se conservan sus claves, sus grupos que no salen del repo (Logos) y el orden de sus tarjetas; solo cambian lo que sale del repo, `editing` y `lastChange`.
- **TypeScript 6 para los tipos**: `dts-bundle-generator` necesita la API de JavaScript de TypeScript, que el 7 de la raíz no tiene; `src/types.ts` le da el 6 de este paquete solo mientras corre.
