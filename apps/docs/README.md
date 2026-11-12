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
3. Su muestra para la card del índice en `src/visual/showcases.tsx` y su captura (ver abajo).
4. Revisarlo en la vista previa del deploy (claro y oscuro, con interacción).
5. Capturar y meter sus dos PNG en el mismo PR. El build de la web no las necesita, pero el test de catálogo y el visual fallan si falta alguna de estas piezas.

## Cards del índice (`/components/`)

Cada card enseña una **captura WebP** de su componente: lo más característico (un botón, un campo, unas filas de tabla…), con sus propios datos y no el ejemplo del registro, que junta todas las variantes. No tiene que ser una representación 1:1: es un _showcase_. Las muestras están en `src/visual/showcases.tsx` (`SHOWCASES[nombre]` = `{ render }`); la web las pinta en `/showcase/<componente>/` (centradas y ajustadas solas a un marco de 640×400 sobre el damero) y `scripts/capture-showcases.ts` las fotografía:

```sh
bun run build                                  # la web construida
bun run capture:showcases Button Badge         # solo esos componentes (claro y oscuro)
bun run capture:showcases --all                # todo el catálogo
```

- **Dónde:** `src/assets/showcase/<slug>-<light|dark>.webp` (800×500, calidad 80, optimizadas con sharp). Van al repo: el build no necesita navegador. Los componentes de Stream (`DARK_PREVIEWS`) solo tienen la oscura.
- **Cuándo regenerarlas:** al cambiar el aspecto de un componente o su muestra, y al añadir un componente. No se comparan píxel a píxel (serían frágiles entre sistemas): `test/showcases.test.ts` solo exige que cada componente tenga las suyas y que ninguna pase de 45 kB ni todas juntas de 7 MB.
- **En el servidor y sin JavaScript de React:** la página de captura no lleva islas. Una capa que se abre va en línea (`defaultOpen`, `contained`, `inline`), ya que un portal no se pinta en el servidor. Lo que un componente hace en un efecto tampoco ocurre: a `StreamScene` y `ChannelBanner` se les pasa una `scale` fija.
- **La card** (`src/components/ShowcaseImage.astro`): dos `<img loading="lazy">` con su tamaño, una por tema (la del tema que no se ve no se descarga). Es decorativa (`inert`, `aria-hidden`, fuera del buscador) y el enlace de la card la cubre. Sin captura queda el damero vacío; `e2e/components.spec.ts` comprueba que todas cargan.
- **Mirar el resultado:** abre `/showcase/<slug>/` (y `?tema=oscuro`) en el `preview` para ver la muestra tal como la fotografía el script.

Las capturas aprobadas son solo para la paridad visual: el build no las lee (`test/build-without-approved.test.ts`).

### Cambio de aspecto de un componente que ya tiene captura (también de los 74 originales)

Se recaptura con el mismo script y se sustituyen sus dos PNG. El PR explica el motivo (variante nueva del Figma, corrección…) y la revisión compara la PNG anterior con la nueva en el diff. Sustituir una captura que salió de la guía es válido.
