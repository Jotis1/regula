Bloque de código con números de línea, resaltado sencillo, pestañas y botón de copiar.

**Props.** `code` + `language`, o `tabs` [{`label`, `code`}], `lineNumbers` (por defecto sí).

**Visual.** Tarjeta `radius-xl` con borde `border-secondary`; números en columna `bg-secondary` y `text-quaternary`; código en Geist Mono 14/20 (`code-sm`). Resaltado con los colores del archivo: comentarios `utility-green-600`, palabras clave `utility-pink-600`, nombres y propiedades `utility-blue-600`, el resto `text-primary`. En oscuro las escalas utility se invierten solas.

**Límites.** El resaltado es deliberadamente simple (JS, TS, bash, Python básico). Para Ornatus con muchos lenguajes, conecta un resaltador de verdad y conserva estos colores.
