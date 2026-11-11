# Notas de la implementación

## 1.1 Ancho del contenedor

- `Base.astro`: la barra lateral va sin contenedor; el contenido va en `div[data-container]` con `max-w-container` (1280) dentro de `main`, que conserva el padding de la guía. Cabecera y pie llevan `data-container` con el mismo ancho.
- La cabecera pasa a una barra de ancho completo con su contenido centrado en 1280, así que a 1440 px el contenido empieza 80 px más adentro. `e2e/header.spec.ts` (medidas a 1440) suma ese margen; el resto de lo que comprueba no cambia.
- No hay capturas aprobadas de páginas con cabecera o pie: el e2e completo en Chromium pasó sin rehacer ninguna. Fallos de carga ya conocidos (CopyTooltip, selector de archivo de Input) que pasan al repetirlos.
- Decisión sin consultar: la rama sale de `feat/figma-coverage` porque `complete-figma-coverage` aún no tiene PR; se rebasará sobre `main` cuando se fusione.
