# Notas de la implementación

## 1.1 Ancho del contenedor

- `Base.astro`: la barra lateral va sin contenedor; el contenido va en `div[data-container]` con `max-w-container` (1280) dentro de `main`, que conserva el padding de la guía. Cabecera y pie llevan `data-container` con el mismo ancho.
- La cabecera pasa a una barra de ancho completo con su contenido centrado en 1280, así que a 1440 px el contenido empieza 80 px más adentro. `e2e/header.spec.ts` (medidas a 1440) suma ese margen; el resto de lo que comprueba no cambia.
- No hay capturas aprobadas de páginas con cabecera o pie: el e2e completo en Chromium pasó sin rehacer ninguna. Fallos de carga ya conocidos (CopyTooltip, selector de archivo de Input) que pasan al repetirlos.
- Decisión sin consultar: la rama sale de `feat/figma-coverage` porque `complete-figma-coverage` aún no tiene PR; se rebasará sobre `main` cuando se fusione.

## 2.1 Recorte con fundido en las muestras

- `LivePreview.astro` ya no encoge ni tiene el respaldo del ejemplo entero (`thumbOf` y sus tests desaparecen: los 121 componentes tienen muestra y un test lo exige). El escenario (288×180) ancla la muestra según `crop` (`center` por defecto, `top`, `top-left`) y aplica una máscara con fundido de 24 px solo por los bordes por donde se recorta (`fadeMask`).
- `scale` queda como `@deprecated` en `Thumbnail` solo para las 55 muestras pendientes de 2.2: 54 con `scale` y `HeaderNav`, que se encoge con `ScaledPreview`. La lista (`SHRUNK_PENDING`, en `visual/thumbs.ts`) la comparten el test unitario y el e2e y debe quedar vacía en 2.2. La muestra de `ScaledPreview` queda fuera: es su demostración.
- La cuenta del resumen de la propuesta (60 muestras) era una estimación; las reales son 55.
