# regula.jotis.me

La web de documentación del sistema (Astro). Se construye con `bun run build` y se prueba con `bunx playwright test`, que levanta `astro preview` en el puerto 4321.

Todo corre en Chromium. Lo que depende de cómo cada navegador entrega el teclado, el pegado o el autocompletado va en `e2e/cross-browser/` y corre también en Firefox y WebKit (proyectos de `playwright.config.ts`). En local hay que instalarlos una vez: `bunx playwright install firefox webkit`. Para correr solo Chromium: `--project=chromium`.

## Paridad visual y capturas aprobadas

Cada componente del catálogo tiene un ejemplo en `src/visual/registry.ts` (`visualExamples`), con el alto de su tarjeta (`CARD_HEIGHTS`) y, si se pinta siempre en oscuro, su entrada en `DARK_PREVIEWS`. La web lo sirve en `/visual/<componente>/`, y `e2e/visual.spec.ts` lo compara en claro y en oscuro con su **captura aprobada**: `e2e/visual/approved/<Nombre>-<light|dark>.png`. Las 74 originales se capturaron de la guía; desde entonces, la referencia es la captura aprobada, no la guía.

En el PR que crea o cambia una captura el test pasa siempre, porque compara el ejemplo consigo mismo. **Lo que aprueba es la revisión de la PNG en el diff del PR.**

### Capturar

Siempre en Windows, como el job de navegador de CI: el suavizado del texto cambia entre sistemas.

- **En local** (Windows), con la web construida:

  ```sh
  bunx turbo run build
  cd apps/docs
  bun run scripts/capture-approved.ts Button Badge      # escribe en e2e/visual/approved/
  bun run scripts/capture-approved.ts Button --out tmp  # escribe en otra carpeta, sin tocar las aprobadas
  ```

  Si no hay una vista previa en marcha en el puerto 4321, el script la arranca y la para al terminar.

- **En CI**: Actions → CI → «Run workflow» con los nombres separados por espacios. El job «Capturas aprobadas» corre en `windows-latest` y sube las PNG como artifact `capturas-aprobadas`.

### Componente nuevo

1. Ejemplo en el registro (`visualExamples`), con su alto en `CARD_HEIGHTS`.
2. Su página en `src/content/components/` y su grupo en `src/lib/catalog.ts`.
3. Su muestra para la card del índice en `src/visual/thumbnails.tsx` (ver abajo).
4. Revisarlo en la vista previa del deploy (claro y oscuro, con interacción).
5. Capturar y meter sus dos PNG en el mismo PR. El build de la web no las necesita, pero el test de catálogo y el visual fallan si falta alguna de estas piezas.

## Cards del índice (`/components/`)

Cada card enseña en vivo la muestra de su componente: lo más característico (un botón, un campo, unas filas de tabla…), con sus propios datos y no el ejemplo del registro, que junta todas las variantes. Las muestras están en `src/visual/thumbnails.tsx` (`THUMBNAILS[nombre]` = `{ render, scale? }`) y las pinta `src/components/LivePreview.astro`:

- **En el servidor y sin JavaScript:** sin directiva `client:*`. Por eso una capa que se abre va en línea (`defaultOpen`, `contained`, `inline`), ya que un portal no se pinta en el servidor. Lo que un componente hace en un efecto tampoco ocurre: a `StreamScene` y `ChannelBanner` se les pasa una `scale` fija.
- **Escenario de 288×180:** la muestra va centrada a su tamaño natural, y `scale` (menor que 1) la encoge si es más grande. Fondo de cuadros sutil (`bg-secondary` sobre `bg-primary`). Las de `DARK_PREVIEWS` van siempre en oscuro.
- **Decorativa:** `inert`, `aria-hidden` y fuera del buscador. El enlace de la card cubre toda la card, también la vista previa.
- **Sin muestra:** la card enseña el ejemplo entero encogido (`src/visual/thumbs.ts`). El test `test/thumbs.test.ts` exige una muestra por componente, y `e2e/components.spec.ts` comprueba que ninguna sale vacía ni repite ids.

Las capturas aprobadas son solo para la paridad visual: el build no las lee (`test/build-without-approved.test.ts`).

### Cambio de aspecto de un componente que ya tiene captura (también de los 74 originales)

Se recaptura con el mismo script y se sustituyen sus dos PNG. El PR explica el motivo (variante nueva del Figma, corrección…) y la revisión compara la PNG anterior con la nueva en el diff. Sustituir una captura que salió de la guía es válido.
