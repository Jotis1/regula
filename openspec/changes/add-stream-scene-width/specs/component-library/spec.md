# Spec Delta

## ADDED Requirements

### Requirement: Escena de ancho configurable
`StreamScene` SHALL admitir `width`, el ancho lógico del lienzo en px, con 1080 de alto siempre. Sin `width`, o con un valor que no sea un entero de al menos 1920, el lienzo SHALL medir 1920. La cuadrícula y el pie SHALL ocupar todo el ancho, y el bloque central SHALL seguir centrado y al mismo tamaño.

#### Scenario: Ultrapanorámica
- **WHEN** se pinta `StreamScene` con `width={2580}` y `scale={4/3}`
- **THEN** ocupa 3440×1440 px, el pie empieza y acaba a 80 px lógicos de los bordes y el titular está centrado en el lienzo

#### Scenario: Valor no válido
- **WHEN** se pinta `StreamScene` con `width={1280}` o `width={2000.5}`
- **THEN** el lienzo mide 1920×1080, como sin `width`

#### Scenario: Sin width
- **WHEN** se pinta `StreamScene` sin `width`
- **THEN** el HTML es el mismo que antes de este cambio

### Requirement: Acciones en la fila móvil
`HeaderNav` SHALL admitir `mobileActions`, con el que `actions` se pinta también en la fila móvil, entre la marca y el botón de menú (o lo que dé `mobileBar`). Sin la prop, `HeaderNav` SHALL comportarse como hasta ahora.

#### Scenario: Botón de tema en móvil
- **WHEN** se pinta `HeaderNav` con `mobileActions` y un botón de tema en `actions` en una cabecera de 390 px
- **THEN** se ven la marca, el botón de tema y el botón de menú

## MODIFIED Requirements

### Requirement: Pasos navegables
`ProgressSteps` SHALL admitir `onChange` y `children`. Con `onChange`, cada paso SHALL ser un botón que llama a `onChange` con su índice, cuyo texto visible es solo el marcador y el título; la descripción SHALL ir fuera del botón, debajo, enlazada con `aria-describedby`. Con `children`, el componente SHALL pintar el contenido del paso actual y anunciar su cambio a los lectores de pantalla. Sin las props nuevas, `ProgressSteps` SHALL comportarse como hasta ahora.

#### Scenario: Pulsar un paso
- **WHEN** en un `ProgressSteps` de cuatro pasos con `onChange` y el primero como actual se pulsa el tercero
- **THEN** se llama a `onChange(2)`, y cada paso es un botón con el título del paso como nombre

#### Scenario: Descripción fuera del botón
- **WHEN** se pinta un `ProgressSteps` con `onChange` y pasos con descripción
- **THEN** ningún botón contiene la descripción, cada uno la tiene como descripción accesible y axe no marca `label-content-name-mismatch`

#### Scenario: Contenido del actual
- **WHEN** se pinta en vertical con `children={(i) => <p>Paso {i}</p>}` y el segundo como actual
- **THEN** el texto «Paso 1» va dentro del segundo elemento de la lista, bajo su título, en una región que se anuncia al cambiar

#### Scenario: Con teclado
- **WHEN** el usuario llega con Tab a un paso y pulsa Enter
- **THEN** el paso lleva el anillo de foco y se llama a `onChange` con su índice
