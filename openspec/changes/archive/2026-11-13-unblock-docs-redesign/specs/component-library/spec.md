# Spec Delta

## ADDED Requirements

### Requirement: Submenús nativos de la navegación lateral
`SidebarNav` SHALL admitir `disclosure="native"`, con el que cada elemento con `children` de los tipos `simple`, `sections-dividers` y `sections-subheadings` SHALL pintarse como `<details>` con su `<summary>` y abrirse y cerrarse sin JavaScript, con el mismo aspecto que con `disclosure="script"`. SHALL estar abierto de inicio el elemento que lleva `defaultOpen` o el que contiene el activo. Sin la prop, `SidebarNav` SHALL comportarse como hasta ahora.

#### Scenario: Sin JavaScript
- **WHEN** se pinta en el servidor un `SidebarNav` con `disclosure="native"` y dos grupos, el segundo con el elemento activo, y se abre la página con el JavaScript desactivado
- **THEN** el segundo grupo se ve abierto con el activo marcado con `aria-current="page"`, y el primero se abre y se cierra al pulsar su título

#### Scenario: Sin la prop
- **WHEN** se pinta `SidebarNav` sin `disclosure`
- **THEN** el HTML es el mismo que antes de este cambio

#### Scenario: Tipos con segundo panel
- **WHEN** se pinta `SidebarNav` con `type="slim"` y `disclosure="native"`
- **THEN** se comporta como con `disclosure="script"`

### Requirement: Pasos navegables
`ProgressSteps` SHALL admitir `onChange` y `children`. Con `onChange`, cada paso SHALL ser un botón que llama a `onChange` con su índice; con `children`, el componente SHALL pintar el contenido del paso actual y anunciar su cambio a los lectores de pantalla. Sin las props nuevas, `ProgressSteps` SHALL comportarse como hasta ahora.

#### Scenario: Pulsar un paso
- **WHEN** en un `ProgressSteps` de cuatro pasos con `onChange` y el primero como actual se pulsa el tercero
- **THEN** se llama a `onChange(2)`, y cada paso es un botón con el título del paso como nombre

#### Scenario: Contenido del actual
- **WHEN** se pinta en vertical con `children={(i) => <p>Paso {i}</p>}` y el segundo como actual
- **THEN** el texto «Paso 1» va dentro del segundo elemento de la lista, bajo su título, en una región que se anuncia al cambiar

#### Scenario: Con teclado
- **WHEN** el usuario llega con Tab a un paso y pulsa Enter
- **THEN** el paso lleva el anillo de foco y se llama a `onChange` con su índice
