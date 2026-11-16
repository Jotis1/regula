## MODIFIED Requirements

### Requirement: Chat seleccionable
`ChatBox` SHALL admitir `onSelect` y `selectedId`. Con `onSelect`, cada mensaje con `id` y sin `selectable: false` SHALL ser un botón que llama a `onSelect` con su mensaje, y el elegido SHALL marcarse con `aria-pressed` y a la vista, con la raya de las líneas destacadas de `CodeSnippet` sobre un fondo de marca. Cada botón SHALL decir qué hace: con ratón, al pasar por encima o con el foco, una marca con la chincheta y «Destacar»; en táctil, la chincheta siempre; y el elegido, siempre, con «Destacado». Su nombre accesible SHALL empezar por la acción y decir de quién es el mensaje. Los textos SHALL poder cambiarse con `labels`. Sin `onSelect`, `ChatBox` MUST NOT tener botones.

#### Scenario: Elegir un mensaje
- **WHEN** en un `ChatBox` con `onSelect` se pulsa el mensaje de «lucia_88»
- **THEN** se llama a `onSelect` con ese mensaje

#### Scenario: Elegido a la vista
- **WHEN** `selectedId` es el de un mensaje
- **THEN** ese mensaje lleva `aria-pressed="true"`, fondo de marca, la raya de 2px en `fg-brand-primary` y la marca «Destacado», y los demás `aria-pressed="false"`

#### Scenario: Qué hace el clic
- **WHEN** con ratón se pasa por encima de un mensaje seleccionable
- **THEN** sale a su derecha la chincheta con «Destacar», y el texto del mensaje no se mueve

#### Scenario: En táctil
- **WHEN** se pinta un `ChatBox` con `onSelect` en una pantalla sin hover
- **THEN** cada mensaje seleccionable enseña la chincheta sin texto, y el elegido la chincheta con «Destacado»

#### Scenario: Nombre del botón
- **WHEN** un lector de pantalla llega al mensaje de «lucia_88» «¿Has mirado detrás del cuadro?»
- **THEN** lo lee como «Destacar el mensaje de lucia_88: ¿Has mirado detrás del cuadro?»

#### Scenario: Otros textos
- **WHEN** se pasa `labels={{ select: "Responder", selected: "Respondiendo" }}`
- **THEN** la marca y el nombre accesible usan esos textos

#### Scenario: Mensaje no seleccionable
- **WHEN** un mensaje lleva `selectable: false` o no tiene `id`
- **THEN** no es un botón, no se puede elegir y no lleva marca

#### Scenario: Con teclado
- **WHEN** se llega con Tab a un mensaje y se pulsa Enter
- **THEN** el mensaje lleva el anillo de foco y la marca «Destacar», y se llama a `onSelect`

#### Scenario: Sin onSelect
- **WHEN** se pinta `ChatBox` sin `onSelect`
- **THEN** no hay ningún botón ni marca, y los mensajes se pintan como en el resto del chat

#### Scenario: Chat lleno
- **WHEN** un `ChatBox` con `onSelect` tiene más mensajes de los que caben
- **THEN** los de arriba se salen por arriba, enteros, y ningún mensaje se recorta por dentro

#### Scenario: Marca en la primera línea
- **WHEN** un mensaje seleccionable ocupa varias líneas
- **THEN** solo su primera línea deja sitio a la marca, y las demás ocupan todo el ancho

### Requirement: Líneas destacadas en el código
`CodeSnippet` SHALL admitir `highlight`, en el código o en cada pestaña: una lista de números de línea, desde 1, que se pintan con fondo y raya de marca y que se anuncian como destacadas a los lectores de pantalla. El fondo SHALL cubrir todo el ancho que se desplaza, de borde a borde del bloque, aunque la línea destacada u otra línea sea más larga que el bloque.

#### Scenario: Líneas cambiadas
- **WHEN** se pinta `CodeSnippet` con un código de seis líneas y `highlight={[4, 5]}`
- **THEN** las líneas 4 y 5 llevan el fondo y la raya, y un lector oye una vez que están destacadas

#### Scenario: Línea destacada más larga que el bloque
- **WHEN** una línea destacada no cabe en el bloque y se desplaza hasta el final
- **THEN** el fondo destacado llega hasta el borde derecho del área desplazada, sin dejar texto ni relleno fuera
