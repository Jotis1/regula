## MODIFIED Requirements

### Requirement: Chat seleccionable
`ChatBox` SHALL admitir `onSelect` y `selectedId`. Con `onSelect`, cada mensaje con `id` y sin `selectable: false` SHALL ser un botón que llama a `onSelect` con su mensaje, y el elegido SHALL marcarse con `aria-pressed` y a la vista, con el fondo y la raya de las líneas destacadas de `CodeSnippet`. Cada botón SHALL decir qué hace: con ratón, al pasar por encima o con el foco, una marca con la chincheta y «Destacar»; en táctil, la chincheta siempre; y el elegido, siempre, con «Destacado». Su nombre accesible SHALL empezar por la acción y decir de quién es el mensaje. Los textos SHALL poder cambiarse con `labels`. Sin `onSelect`, `ChatBox` MUST NOT tener botones.

#### Scenario: Elegir un mensaje
- **WHEN** en un `ChatBox` con `onSelect` se pulsa el mensaje de «lucia_88»
- **THEN** se llama a `onSelect` con ese mensaje

#### Scenario: Elegido a la vista
- **WHEN** `selectedId` es el de un mensaje
- **THEN** ese mensaje lleva `aria-pressed="true"`, fondo `bg-brand-primary_alt`, la raya de 2px en `fg-brand-primary` y la marca «Destacado», y los demás `aria-pressed="false"`

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
