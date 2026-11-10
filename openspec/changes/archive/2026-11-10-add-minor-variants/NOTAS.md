# Notas de add-minor-variants

Diferencias con el Figma aceptadas al implementar, y decisiones que no estaban en design.md.

## Spinner
- `dot-circle` son dieciséis puntos (el nodo `1192:633`), no doce como decía el design al proponer.

## Logos
- El degradado cónico de `app/igtv` (Figma lo exporta como `<foreignObject>` con CSS) pasa a un degradado lineal con las mismas paradas.
- `mask-type:alpha` sale como atributo, no como `style`, para que lo entiendan los visores de SVG (los navegadores, los dos).
- De Social se toma solo `State=Default`; el `Hover` del Figma es el mismo gris.
- La galería va en `/icons/logos/` y no en pestañas dentro de `/icons/` (design D8 actualizado). Las marcas negras (GitHub, X, Apple, Next.js) se ven sobre una pastilla blanca (`bg-fg-white`) en los dos temas: el Figma no trae versión oscura.

## EmptyState
- Los dibujos de `sm` y `lg` son el de `md` del Figma a escala (0,88 y 1,28); en el Figma cada tamaño es una composición casi igual.
- Los grises pasan a variables del tema (`--bg-secondary`, `--bg-tertiary`, `--bg-quaternary`, `--border-primary`) y el blanco de las ilustraciones a `--bg-primary`. En oscuro, la nube y los documentos quedan oscuros sobre su círculo, con poco contraste: es lo que da el tema; el Figma no tiene versión oscura.
- La carpeta oscura (`#262626`) pasa a `--fg-secondary` (`#404040` en claro, algo más clara que el Figma; `#D4D4D4` en oscuro, para que se vea).
- Se quitan la textura de ruido de las carpetas (un PNG al 10–20 %) y el texto de la plantilla en la carpeta translúcida («UUI Projects™», «0 results»). La carpeta translúcida es blanco y negro con transparencia: se ve igual en los dos temas.
- El círculo de cristal de la ilustración y el círculo degradado del archivo se pintan en HTML (`bg-alpha-black-20` con `backdrop-blur-sm`; `bg-secondary` → `bg-quaternary`), no con el `<foreignObject>` del Figma.
- Los logos de la cabecera de integraciones van sobre pastillas blancas, como en el Figma, para que las marcas negras se vean en oscuro.
- Los ids de los dibujos son fijos (`em-cloud-0`…): dos `EmptyState` con la misma ilustración en una página comparten degradados. Solo se nota si los dos están en temas distintos en la misma página.
- `EmptyState` pasa de 22 a 40 kB gzip por los dibujos (la carpeta translúcida son 36 kB sin comprimir, con sus filtros); su límite en `size-budget.json` sube a 44 kB.
