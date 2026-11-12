---

name: CodeSnippet
description: "Bloque de código con números de línea, resaltado sencillo, pestañas y botón de copiar."
interactive: true
astroNote: "Sin directiva se ve el código; las pestañas y el botón de copiar necesitan `client:load`."
---

**Props.** `code` + `language`, o `tabs` [{`label`, `code`}], `lineNumbers` (por defecto sí en `horizontal`, no en `vertical`), `highlight` (números de línea, desde 1; también en cada pestaña), `variant` (`horizontal` · `vertical`), `maxHeight` (px) y `onExpand`.

**Variantes.** `horizontal` es la tarjeta con la columna de números a la izquierda. `vertical` es una tarjeta gris (`bg-secondary_alt`, `radius-3xl`) que enmarca el código en otra blanca con sombra grande; con `tabs`, estas pasan a una cabecera de texto con el botón de copiar (uno solo, que copia la pestaña activa). Con `maxHeight`, si el código no cabe se recorta con un degradado y «Ver más» lo despliega (`aria-expanded`); «Ver menos» lo recoge. Con `onExpand` sale el botón de ampliar junto al de copiar: qué amplía (un modal, una página) lo decide quien lo usa.

**Visual.** Tarjeta `radius-xl` con borde `border-secondary`; números en columna `bg-secondary` y `text-quaternary`; código en Geist Mono 14/20 (`code-sm`). Resaltado con los colores del archivo: comentarios `utility-green-600`, palabras clave `utility-pink-600`, nombres y propiedades `utility-blue-600`, el resto `text-primary`. En oscuro las escalas utility se invierten solas.

**Líneas destacadas (ampliación sobre la guía).** Con `highlight={[4, 5]}`, esas líneas llevan fondo `bg-brand-primary_alt` y una raya de 2px en `fg-brand-primary` a la izquierda; en oscuro los tokens cambian solos. Cada línea marcada es un elemento propio y, para lectores de pantalla, la primera de cada bloque de líneas seguidas lleva un texto oculto («línea destacada»), así que `[4, 5]` se anuncia una vez. Con `tabs`, cada pestaña puede llevar su `highlight`, que manda sobre el del bloque; los números que no son una línea del código se ignoran. Solo marca líneas enteras: no resalta trozos dentro de una línea.

**Límites.** El resaltado es deliberadamente simple (JS, TS, bash, Python básico). Para Ornatus con muchos lenguajes, conecta un resaltador de verdad y conserva estos colores.

**Accesibilidad.** Las pestañas se recorren con las flechas. El bloque recibe el foco, así que una línea larga se desplaza con el teclado. "Copiado" también se anuncia a lectores de pantalla.

**Diferencia con la vista previa de la guía.** En la vista previa, el código sale con el monospace del navegador porque su `<code>` no hereda la fuente del bloque. Aquí se sigue la ficha: Geist Mono 14/20.

**Contraste de los comentarios.** La ficha pide `utility-green-600`, pero en claro da 3,2:1 sobre blanco, por debajo del mínimo de 4,5:1. Los comentarios van un escalón más oscuros, en `utility-green-700` (4,95:1 en claro, 14:1 en oscuro).
