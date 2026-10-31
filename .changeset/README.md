# Changesets

Cada cambio que afecta a los paquetes publicados (`@jotis-me/tokens`, `@jotis-me/icons`, `@jotis-me/react`) lleva un changeset: un fichero Markdown que dice qué paquetes cambian, de qué tipo (`patch`, `minor`, `major`) y qué ha cambiado, en castellano y para quien usa los paquetes.

```sh
bunx changeset          # crea uno, preguntando paquetes, tipo y texto
bun run version-packages  # aplica los pendientes: versiones y CHANGELOG.md
```

Los tres paquetes van en modo `fixed`: siempre comparten versión, así "la web documenta la versión X" vale para todos. Los paquetes privados (la web y los ejemplos) no se versionan.

La publicación no se hace a mano: al fusionar el PR de versión que abre CI, cada paquete se empaqueta con `bun pm pack` y se publica el `.tgz` con `npm publish --provenance` (ver design §11).
