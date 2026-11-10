# Notas de implementación

Decisiones y diferencias aceptadas que salen al implementar. Lo que cambia la spec o el design también se corrige allí.

## Iconos de línea

- **1.172, no 1.173.** El Figma tiene 1.173 componentes en los 19 marcos de la página «Icons», pero `colors` está en dos categorías (Images y Editor) con el mismo dibujo. Cuenta como un icono. Las cifras de proposal, design, specs y tasks se corrigieron.
- **Importación.** `packages/icons/scripts/import-icons.ts` recorta cada icono de los SVG que exporta `download_assets` (uno por marco). Las coordenadas están en el marco; el origen de cada icono sale de la rejilla (4 columnas cada 272 px desde x=64, filas cada 40 px desde y=156) y los trazos se trasladan a 0..24. Los 82 de antes conservan su dibujo (fixture `icon-drawings-original.json`). Los corazones del Figma traen `fill-rule`/`clip-rule` sin relleno: no pintan nada y se ignoran.
- **`as const` descartado.** Con 1.172 iconos, `typeof icons` como tupla literal da «union type too complex» en `tsc`. `src/data/icons.ts` usa `defineIcons({...})`: las claves siguen siendo una unión de nombres y los trazos son `readonly string[]`.

## Núcleo y set completo

- **Núcleo = los 82 de antes, sin añadir ninguno.** Se buscó en `packages/react/src` cualquier literal que coincida con un nombre del set completo: salieron 9 (`box`, `circle`, `divider`, `list`, `mouse`, `placeholder`, `square`, `transform`, `x`), todos falsos positivos (variantes, no iconos). Los componentes solo usan los 82, y el tipado de `IconName` lo garantiza.
- **`iconNames` pasa a ser el núcleo** (82, como antes) y `allIconNames` es el set completo. La web (`/icons/`, portada, buscador) y el artefacto siguen usando `iconNames` hasta las tasks 1.8 y 13.2.
- **El mapa completo no se publica.** `src/data/icons.ts` (580 kB) queda fuera de `tsconfig.build.json`: solo lo leen los scripts y los tests. `dist/data` lleva solo el núcleo.
- **Un componente por icono**, con su dibujo en línea y `@__PURE__`. Un import suelto empaquetado con `bun build` pesa menos de 20 kB y no contiene ningún otro dibujo (test).

## Props de icono con nodos

- Las props `icon` de los componentes aceptan `IconName | ReactNode` y se pintan con `iconSlot` (23 ficheros). Con un nombre, el HTML es el mismo que antes (test de equivalencia).
- **`Button iconOnly` se queda en `IconName`.** `ReactNode` incluye `undefined`, y rompería el discriminante entre botón con texto y botón de solo icono. Los iconos de cualquier set van en `iconLeading`/`iconTrailing`, que ya aceptaban nodos.
- `ButtonUtility icon` usa `IconName | NonNullable<ReactNode>` para seguir siendo obligatorio.
- Un icono pasado como nodo lleva el tamaño que le dé quien lo pasa (20 por defecto); el componente no lo fuerza.
