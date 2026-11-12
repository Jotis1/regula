---

name: Badge
description: "Etiqueta de estado o categoría de una o dos palabras, junto a un nombre o en una celda de tabla."
interactive: false
astroNote: "Con `onRemove` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `color` (`gray` · `brand` · `success` · `warning` · `error` · `slate` · `sky` · `blue` · `indigo` · `purple` · `pink` · `orange`), `type` (`pill` redonda · `badge` `radius-md` · `modern` blanca con sombra), `size` (`sm` 22px · `md` 24 · `lg` 28), `dot`, `icon` (12px delante), `flag` (bandera de 16px delante, como `<FlagEs />` de `@untitledui/country-flags`), `avatar` (16px delante: URL de una foto o un nodo), `iconTrailing` (12px detrás), `iconOnly` + `label` (solo el icono; `label` es obligatorio y lo leen los lectores de pantalla), `onRemove`.

**Rellenos.** Con bandera o avatar delante, con solo un icono detrás y con solo icono, el badge usa los rellenos de su variante del Figma (`Badge`, `1046:3819`): el hueco del lado del dibujo es más estrecho que el del texto.

**Colores.** Usan la escala utility: fondo `-50`, borde `-200`, texto `-700`, punto `-500`. El estado no debe depender solo del color: la palabra ("Pagado", "Vencido") es obligatoria.

**No.** Nada de frases. Si necesitas más de tres palabras es un `Alert` o un texto de apoyo.

**Diferencia con la vista previa de la guía.** En la vista previa, el badge `modern` sale con el fondo y el texto de su color porque en la hoja de estilos de la guía la regla de color pisa a la de `modern`. Aquí se sigue la ficha: `modern` es blanca (`bg-primary`, `text-secondary`) con sombra, y solo el punto lleva el color.
