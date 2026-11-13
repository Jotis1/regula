# Spec Delta

## ADDED Requirements

### Requirement: Cabecera a ancho completo
`HeaderNav` SHALL admitir `fullWidth`, con el que su contenido ocupa todo el ancho disponible con el relleno lateral de siempre, en lugar de centrarse en el contenedor de 1.280 px. Sin la prop, `HeaderNav` SHALL comportarse como hasta ahora.

#### Scenario: Ventana ancha
- **WHEN** se pinta `HeaderNav` con `fullWidth` en una ventana de 1.920 px
- **THEN** la marca empieza a 32 px del borde izquierdo y las acciones acaban a 32 px del derecho

### Requirement: Pestañas que navegan
Cuando todos los elementos de `Tabs` llevan `href`, `Tabs` SHALL pintarse como una navegación de enlaces con el mismo aspecto que las pestañas, sin `tablist`, con `aria-current` en el actual: `location` si su `href` es un ancla y `page` si no.

#### Scenario: Índice de la página
- **WHEN** se pinta `Tabs` en vertical con `type="line"`, tres elementos con `href` de ancla y el segundo como actual
- **THEN** es una `<nav>` con nombre y tres enlaces, el segundo con `aria-current="location"` y la raya de 2 px a su izquierda, y no hay ningún elemento con `role="tab"`

#### Scenario: Sin href
- **WHEN** se pinta `Tabs` sin `href` en sus elementos
- **THEN** el HTML es el mismo que antes de este cambio

#### Scenario: Enlaces en vertical y en móvil
- **WHEN** se pinta en vertical a 390 px un `Tabs` con `href` en todos sus elementos
- **THEN** sigue siendo la lista de enlaces, sin pasar al desplegable de las pestañas verticales

### Requirement: Carrusel en tira
`Carousel` SHALL admitir `type="strip"`, que enseña las diapositivas en una fila que se desplaza en horizontal, se detiene en cada una y deja ver parte de la siguiente, sin flechas y sin JavaScript para desplazarse.

#### Scenario: Deslizar
- **WHEN** a 390 px se pinta un `Carousel` con `type="strip"` y seis diapositivas, con el JavaScript desactivado
- **THEN** se ve la primera entera y parte de la segunda, la fila se desplaza con el dedo y se detiene en cada diapositiva, y no hay flechas

#### Scenario: Lista con nombre
- **WHEN** un lector de pantalla llega a la tira
- **THEN** la anuncia como lista con su nombre y seis elementos

### Requirement: Interruptor sin etiqueta visible
`Toggle` SHALL aceptar `aria-label` y `aria-labelledby` como nombre accesible del interruptor, también sin `label`.

#### Scenario: En una fila
- **WHEN** se pinta `Toggle` sin `label` y con `aria-label="Activar recordatorio"`
- **THEN** el interruptor tiene `role="switch"` y se llama «Activar recordatorio»

### Requirement: Acompañante de la etiqueta
Los campos con etiqueta (`Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput` y `TagInput`) y `Toggle` SHALL admitir `labelAside`, un nodo que se pinta al final de la fila de la etiqueta, fuera del elemento `<label>`.

#### Scenario: Cambiado y restablecer
- **WHEN** se pinta `Select` con `label="size"` y `labelAside` con un `Badge` «Cambiado» y un `Button` «Restablecer»
- **THEN** los dos van en la fila de la etiqueta, alineados a la derecha, y pulsar «Restablecer» no abre el desplegable

### Requirement: Líneas destacadas en el código
`CodeSnippet` SHALL admitir `highlight`, en el código o en cada pestaña: una lista de números de línea, desde 1, que se pintan con fondo y raya de marca y que se anuncian como destacadas a los lectores de pantalla.

#### Scenario: Líneas cambiadas
- **WHEN** se pinta `CodeSnippet` con un código de seis líneas y `highlight={[4, 5]}`
- **THEN** las líneas 4 y 5 llevan el fondo y la raya, y un lector oye una vez que están destacadas

### Requirement: Buscador con texto inicial
`CommandMenu` SHALL admitir `defaultQuery`, el texto con el que se abre su buscador, y SHALL avisar de él con `onQueryChange` al abrirse.

#### Scenario: Abrir con texto
- **WHEN** se abre `CommandMenu` con `defaultQuery="input"`
- **THEN** el buscador muestra «input», los resultados ya están filtrados y se llama a `onQueryChange("input")`

### Requirement: Hoja inferior
`Slideout` SHALL admitir `side="bottom"`, que lo pinta como una hoja que sube desde abajo, a todo el ancho, con el alto de su contenido hasta el 85 % de la pantalla y su cuerpo con desplazamiento propio. El foco, Escape, la X y el clic fuera SHALL funcionar como en los otros lados.

#### Scenario: Detalle en móvil
- **WHEN** a 390 px se abre un `Slideout` con `side="bottom"` y se pulsa Escape
- **THEN** la hoja ocupa el ancho de la pantalla pegada abajo con el foco dentro, y al cerrarse el foco vuelve a quien la abrió
