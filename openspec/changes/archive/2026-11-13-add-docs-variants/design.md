# Design

## Context

- `HeaderNav` centra su contenido con `mx-auto max-w-[1280px] px-8` (constante `WRAP`). La web pone el lateral fuera de ese ancho, así que la marca no se alinea con él en ventanas anchas.
- `Tabs` siempre es un `tablist` con `role="tab"`. «En esta página» y las pestañas de tipo de icono (seis URL) navegan: no son pestañas.
- `Carousel` pasa diapositivas de una en una con JavaScript, flechas y puntos.
- `Toggle` toma su nombre de `label`; sin `label` no tiene nombre accesible.
- Los campos comparten la fila de etiqueta de `internal/field.tsx` (`label`, `required`, `hint`, `error`).
- `CodeSnippet` resalta palabras clave, sin marcar líneas.
- `CommandMenu` empieza siempre con el buscador vacío (`useState("")`).
- `Slideout` sale de la derecha o de la izquierda (`side`).

## Goals / Non-Goals

**Goals:**
- Ocho variantes que no cambian el HTML de quien no las usa.
- Todas en el servidor salvo las que ya eran de cliente (`CommandMenu`, `Slideout`, `Carousel` `slides`).

**Non-Goals:**
- Gestos de arrastre en la hoja inferior.
- Resaltar trozos dentro de una línea.

## Decisions

### D1. `HeaderNav` a ancho completo
`fullWidth?: boolean`. Con él, `WRAP` pasa a `w-full px-8` en las dos filas y en la fila móvil. El panel móvil no cambia.

### D2. `Tabs` como enlaces
- `TabItem` gana `href?: string`. Si todos los elementos lo llevan, `Tabs` pinta una `<nav aria-label>` con una lista de enlaces; el actual (`value` o `defaultValue`) lleva `aria-current="page"`, o `"location"` si el `href` empieza por `#`.
- Mismo aspecto en todos los tipos y en vertical. Sin flechas de teclado: se recorre con Tab, como cualquier enlace.
- En vertical, por debajo de `lg`, no pasa a `Select`: una lista de enlaces se queda como lista. La ficha lo dice.
- Si solo algunos llevan `href`, se lanza un aviso en desarrollo y se pinta como `tablist`.

### D3. `Carousel` en tira
- `type?: "slides" | "strip"`. En `strip`, las diapositivas van en una lista con `overflow-x: auto`, `scroll-snap-type: x mandatory` y un ancho por diapositiva (`slideWidth`, 300 px por defecto), con 12 px entre ellas y el margen del contenedor para que asome la siguiente.
- Sin flechas ni JavaScript. Debajo, `PaginationDots` sin `onChange`, solo como indicación. Saber cuál se ve necesita JavaScript: sin hidratar, los puntos marcan la primera; con `client:visible`, un `IntersectionObserver` los mueve.
- Es una lista con nombre (`aria-label` obligatorio, como en `slides`). Las diapositivas no salen del árbol de accesibilidad: todas están en la página.

### D4. `Toggle` con `aria-label`
`ToggleProps` admite `aria-label` y `aria-labelledby`, que pasan al `input` con `role="switch"`. Con `label` y `aria-label`, manda `aria-label`, como en HTML.

### D5. Etiqueta con acompañante
- `FieldProps` gana `labelAside?: ReactNode`. Si hay `label`, la fila de la etiqueta pasa a `flex` con `labelAside` al final; si no hay `label`, `labelAside` se pinta solo en esa fila.
- `Toggle` lo pone tras el texto de su etiqueta, empujado a la derecha.
- Va fuera del `<label>`: puede llevar botones sin que un clic en ellos enfoque el campo.

### D6. `CodeSnippet` con líneas marcadas
- `highlight?: number[]` en las props y en cada `CodeSnippetTab`. Cada línea marcada lleva fondo `bg-brand-primary` y una raya de 2 px en `fg-brand-primary` a la izquierda; en oscuro, los tokens cambian solos.
- Para lectores de pantalla, la línea marcada lleva un texto oculto («línea destacada») una vez por bloque de líneas seguidas.

### D7. `CommandMenu` con texto inicial
`defaultQuery?: string`: valor inicial del buscador. Se llama a `onQueryChange` con él al abrir, para que una fuente externa pinte sus resultados.

### D8. `Slideout` desde abajo
- `side?: "right" | "left" | "bottom"`. En `bottom`: ancho completo, alto del contenido con un máximo del 85 % de la pantalla, esquinas superiores `radius-2xl`, asa decorativa de 36×4 px en `bg-quaternary` arriba y el cuerpo con su propio scroll.
- Entra con la misma transición que los otros lados, en vertical; con movimiento reducido, solo fundido.

## Risks / Trade-offs

- **`Tabs` con dos modos** → un componente que pinta HTML distinto según los datos puede confundir. Se acepta porque el aspecto es el mismo y la regla es simple: todos con `href`, enlaces.
- **Tira sin JavaScript** → los puntos no se mueven sin hidratar. Se acepta: son una indicación, no un control.
