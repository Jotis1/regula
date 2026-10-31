# Importar la guía desde el artefacto de Claude

La guía original es el artefacto "Jotis.me" de Claude (slug `bb424412-8082-461e-a84f-b3704de675c1`). Las herramientas de artefactos solo dejan leer sus ficheros de texto de uno en uno, y lo que leen pasa por la conversación. Para no transcribir nada a mano, estos scripts sacan el contenido del registro de la sesión de Claude Code y lo verifican con los hashes del propio artefacto.

1. En una sesión de Claude Code: `list_files` del artefacto (da el sha256 de cada fichero) y `read_file` de cada fichero de texto que haga falta. Para los SVG de `assets/`, `read_asset` con el `blob` que indica `design-system.json`.
2. Extraer y verificar:

```sh
T=~/.claude/projects/<proyecto>/<sesión>.jsonl
R=~/.claude/projects/<proyecto>/<sesión>/tool-results
node scripts/import-artifact/extract-files.mjs "$T" "$R" reference --missing
node scripts/import-artifact/extract-assets.mjs "$T" "$R" reference --missing
```

Solo se escriben los ficheros cuyo sha256 coincide; `--missing` lista lo que falta por leer. El extractor de ficheros escribe el `README.md` del artefacto como `reference/README.md`: renómbralo a `GUIA.md` (el `README.md` de `reference/` es nuestro) y actualiza `reference/VERSION`.

Lo que no sale por esta vía: las fuentes (binarios; vienen de npm, ver `packages/tokens/scripts/build.ts`) y `components/lib/react*.js` (React 18.3.1 de npm, idéntico).
