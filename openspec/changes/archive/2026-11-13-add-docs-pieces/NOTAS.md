# Notas de la implementación

- **`IconTile` (D6).** La elegida lleva el filo de 2 px y un fondo `bg-brand-primary_alt`. Con `bg-brand-primary` quedaba un bloque índigo macizo en oscuro. Con `href` y elegida, anuncia `aria-current="true"` en lugar de `aria-pressed`.
- **`ExampleCard` (D5).** El filo es un borde real (`border-secondary`), no una sombra interior: el damero la tapaba. El espécimen ocupa el alto que sobra, para que dos tarjetas en fila con pies de distinto largo queden iguales.
- **`Disclosure` (D4).** El chevron es `ChevronRight` y gira 90° al abrir, no el de `SidebarNav`.
- **`CompareSlider` (D2).** El deslizador va desactivado en el HTML del servidor y se activa al hidratar, para que sin JavaScript no haya un control que parezca funcionar. El teclado se gestiona a mano (flechas, Re Pág, Av Pág, Inicio y Fin) y la posición va en la variable `--compare-at`. El valor se anuncia como «55 % Después», como pide el diseño; el 55 % es lo que se ve de la capa de abajo.
- **`Spotlight` (D3).** Siempre pinta un envoltorio (`relative w-fit`), también sin `active`, para que activarlo no vuelva a montar el contenido. La nota lleva `role="status"` además de `aria-live`.
- **`TokenSwatch` (D7).** El filo de cada muestra usa los valores de `border-primary` (`#d4d4d4` y `#404040`), fijos en el componente y comparados con `@jotis-me/tokens` en un test. Su contraste con algunos rellenos es bajo: la información está en el hexadecimal. Props añadidas: `labels`; `utility` y `usage` son opcionales. Necesita un `CopyTooltip` montado en la página.
- **Páginas de prueba.** La del e2e de `CompareSlider` es `/visual/compare-slider-test/`: con el nombre del componente tapaba la página de su ejemplo.
- **Ejemplo interactivo.** Cada componente nuevo necesita además su fichero en `apps/docs/src/playground/` y su entrada en `visual/example-files.ts`, que el diseño no nombraba.
- **E2E.** Batería completa de `apps/docs` (Chromium más la selección de Firefox y WebKit): 1.372 pasan, incluida la paridad visual de los seis ejemplos nuevos.
