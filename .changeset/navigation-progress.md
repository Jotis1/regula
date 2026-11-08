---
"@jotis-me/react": minor
---

Navegación y progreso del Figma, fase 2: siete componentes nuevos y el catálogo pasa de 84 a 91.

**Cambio que rompe: `Select`.** Deja de ser el menú nativo del navegador y pasa a ser el del Figma, una lista bajo el campo hecha con el `Select` de React Aria. Su `onChange` ya no recibe el evento del `<select>`, sino el valor elegido: donde leías `event.target.value`, pasa a leer el argumento (`onChange={(valor) => …}`). El resto (`value`, `defaultValue`, `name`, `disabled`, `placeholder`, `size`) sigue igual, y el valor sigue viajando en un formulario con `name`.

Componentes nuevos:

- `ProgressSteps`: los pasos de un proceso (completo, actual, pendiente) en cinco tipos (`icons-centered`, `icons-text`, `text-line`, `minimal`, `minimal-connected`), con marcadores de check, número o icono, tamaños `sm` y `md` y orientación horizontal o vertical.
- `ProgressCircle`: progreso en círculo o semicírculo, con su valor y una etiqueta, de `xxs` a `lg`. Se pinta en el servidor.
- `PaginationDots`: puntos o rayas que dicen en qué página estás, en `md` y `lg`, con o sin marco; con `onChange` llevan a otra página.
- `Carousel`: pasa diapositivas con flechas, puntos, ← y → y deslizando el dedo; las diapositivas ocultas quedan inertes.
- `HeaderNav`: la cabecera de una app en cuatro tipos (`simple`, `dual-tier`, `tabs` y `centered`), con su menú móvil, que abre un panel desde la izquierda.
- `ContextMenu`: menú del botón derecho (o de Mayús+F10 y la tecla de menú) sobre una zona, con atajos, iconos, grupos con check o punto y submenús.
- `HelpIcon`: el icono de ayuda de 16px que abre un tooltip al pasar el ratón o enfocarlo.

Y variantes nuevas, sin cambiar lo que ya había:

- `Select` e `Input` (`leadingSelect` y `trailingSelect`): opciones con texto de apoyo, icono, avatar o punto delante y un check en la elegida.
- `Tabs`: `orientation="vertical"` (por debajo de `lg` pasa a un desplegable) y los tipos `button-minimal` y `line`.
- `Tooltip`: `placement` (arriba, abajo, izquierda o derecha) y `arrow` (centrada, al principio, al final o sin flecha).
- `Slideout`: `side="left"` para abrirlo desde la izquierda.
- Los campos con foco (`Input`, `Select`, `Textarea`, `NumberInput`, `TagInput`, `MultiSelect`, `VerificationCodeInput`) llevan solo el borde de 2px de marca, sin el anillo exterior que se sumaba con teclado y se veía como un borde doble.
