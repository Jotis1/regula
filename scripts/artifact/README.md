# Artefacto "Jotis.me"

Genera el artefacto "Jotis.me" de Claude (tipo Design System) desde el repo (design D6 y D7 de `openspec/changes/archive/2026-11-06-adopt-repo-as-source`). El repo es la fuente de verdad: el artefacto es una copia generada y de solo lectura (`"editing": "code"`).

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

Después de cada versión publicada de los paquetes, o cuando haga falta, se pide a Claude (Claude Code, con la herramienta Artifact) que sincronice el artefacto siguiendo estos pasos. Artefacto: https://claude.ai/artifact/Q8AXUzu86MzVrB9Ec3oKSY (slug `bb424412-8082-461e-a84f-b3704de675c1`).

Lo que la herramienta lee (`action: "read"` con `path` o `paths`) lo guarda en la carpeta de la sesión, `<scratchpad>/artifact-files/<slug>/`, con su ruta publicada (`project/…`). Los ficheros de trabajo (`published.json`, `asset-shas.json`, `blobs.json`) van **fuera de `dist-artifact/`**, en esa carpeta de la sesión, porque `artifact:build` vacía `dist-artifact/` cada vez. Pásale rutas absolutas: el generador corre con el directorio `scripts/artifact`.

1. **¿Va atrasado?** Lee el índice publicado (`read` con `path: "project/design-system.json"`) y compara el commit de su `lastChange.via` (`GitHub · Jotis1/regula@<sha>`) con el de la última versión (`git describe --tags --abbrev=0 --match "@jotis-me/react@*"`). Si no coinciden, di qué versiones se quedaron sin sincronizar (`git tag --merged HEAD --contains <sha> --list "@jotis-me/react@*"`) antes de seguir.
2. **Construye** desde el commit de la versión (árbol limpio): `bunx turbo run build` y después `bun run artifact:build` (borrador, sin `--published`).
3. **Guarda lo publicado**: copia el índice leído a `published.json`. Para `asset-shas.json`, `node scripts/artifact/tools/asset-shas.mjs <published.json> <asset-shas.json>`: si `packages/icons` no ha cambiado desde el commit del índice, da a cada blob el sha256 de su asset generado. Si ha cambiado, falla, y entonces hay que listar los assets (`list` con `scope: "assets"`, 50 por página) y decidir con el usuario. No sirve el `sha256` de ese listado tal cual: es el del fichero guardado, y en los trazos (Hand-drawn) no coincide con el del repo aunque el SVG sea el mismo.
4. **Genera con lo publicado**: `bun run artifact:build --published <published.json> --asset-shas <asset-shas.json>`. Cada asset reutiliza su blob si no ha cambiado. Si alguno es nuevo o distinto, falla con la lista de los que hay que subir.
5. **Sube los assets** de esa lista con `publish` + `asset: true` (`file_paths`, hasta 25 por llamada; fichero en `dist-artifact/project/assets/<Grupo>/<nombre>`) y guarda en `blobs.json` cada id: `{ "<Grupo>/<nombre>": "<id de /_blob/<id>>" }`. Vuelve a generar con `--blobs <blobs.json>`: ya no debe faltar ninguno (`uploads` vacío en `manifest.json`).
6. **Publica los ficheros cambiados**: lee de una vez todos los `project/…` publicados (`list` con `scope: "files"` y después `read` con `paths`, hasta 256) y ejecuta `node scripts/artifact/tools/changed-files.mjs <scratchpad>/artifact-files/<slug>`, que dice qué ficheros son nuevos, cuáles han cambiado y cuáles ya no salen del repo. Publica solo los nuevos y los cambiados, todos menos el índice, en **una** llamada: `publish` con `url`, `root` = la ruta absoluta de `dist-artifact`, `file_path` = la ruta absoluta de uno de ellos y `files` = el resto (`{"project/<ruta>": "project/<ruta>"}`; `index.d.ts` con `contentType: "text/plain"`). Los que ya no salen del repo (un componente retirado) se quitan con `"project/<ruta>": null` solo si el usuario lo confirma.
7. **El índice, el último**: vuelve a leer `project/design-system.json`. Si su sha256 es el de `published.json`, el que generaste vale tal cual: publícalo solo (`file_path` = `dist-artifact/project/design-system.json`, mismo `root`). Si ha cambiado, cópialo a `published.json`, genera otra vez (paso 4 con `--blobs`) y publica esa versión. Lleva `"editing": "code"` y `lastChange` con `via` `GitHub · Jotis1/regula@<sha>`. No regeneres si no hace falta: cada build pone otra marca de tiempo en `tokens.json` (`meta.synced`), y el `tokens.json` publicado debe ser el de la misma generación que el índice.
8. **Comprueba**: vuelve a leer los ficheros publicados y ejecuta otra vez `changed-files.mjs`, que no debe dar ni nuevos ni cambiados. La página dice que se cambia en el código y abre en solo lectura. `bun run test:e2e` (en `scripts/artifact`) monta cada vista previa con el bundle y React 18 y la compara con su captura aprobada, en claro y en oscuro.

**Si una publicación se rechaza** («You haven't viewed the latest version»), alguien ha publicado una versión nueva, a menudo el propio tipo, que actualiza sus ficheros (`artifact-type/…`, `index.html`). Haz un `read` del `url` sin `path`, mira con `list` + `scope: "files"` si cambió algo de `project/` y vuelve a enviar. `out_dir` no admite rutas cortas de Windows (`JUANCU~1`): usa la carpeta por defecto.

Si hay que volver atrás: republica los ficheros de `reference/` (versión `9fe2`) sin `"editing": "code"`. El repo no depende del artefacto en ningún paso.

## Por qué así

- **Sin red y sin publicar desde CI**: el tipo solo se escribe con las herramientas de artefactos de Claude; el generador deja todo listo y verificable en local y en CI.
- **El índice se fusiona, no se reescribe**: se conservan sus claves, sus grupos que no salen del repo (Logos) y el orden de sus tarjetas; solo cambian lo que sale del repo, `editing` y `lastChange`.
- **TypeScript 6 para los tipos**: `dts-bundle-generator` necesita la API de JavaScript de TypeScript, que el 7 de la raíz no tiene; `src/types.ts` le da el 6 de este paquete solo mientras corre.
