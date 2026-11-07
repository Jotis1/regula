# Spec Delta

## ADDED Requirements

### Requirement: Vista previa en vivo en las cards del índice
Cada card de `/components/` SHALL mostrar una muestra con lo más característico del componente, pintada con el propio componente y en el tema de la página, sobre un fondo de cuadros sutil que indica transparencia. Los de Stream SHALL ir siempre en oscuro. La vista previa SHALL pintarse en el servidor, sin JavaScript propio.

#### Scenario: Vista previa con el componente real
- **WHEN** se abre `/components/` y se mira la card de `ButtonGroup`
- **THEN** la card contiene un `ButtonGroup` pintado con el componente del paquete, sin imágenes, entero dentro del recuadro de la vista previa

#### Scenario: Una sola muestra, sobre cuadros
- **WHEN** se mira la card de `Button`
- **THEN** su vista previa enseña un botón característico, no todas las jerarquías y tamaños de su ejemplo, sobre un damero de cuadros en `bg-secondary` y `bg-primary` que cambia con el tema

#### Scenario: Sigue el tema
- **WHEN** se cambia la web a oscuro
- **THEN** las vistas previas de los componentes de aplicación pasan a oscuro sin recargar ni pedir nada, y las de Stream siguen en oscuro en los dos temas

#### Scenario: Sin JavaScript para las vistas previas
- **WHEN** se carga `/components/`
- **THEN** ninguna vista previa es una isla que se hidrate, y la página funciona igual con el JavaScript desactivado

### Requirement: Vista previa decorativa
La vista previa de una card SHALL ser decorativa: no SHALL recibir foco ni clics, no SHALL aparecer en el árbol de accesibilidad y no SHALL cambiar el nombre accesible de la card.

#### Scenario: Tab no entra en la vista previa
- **WHEN** el usuario recorre `/components/` con Tab
- **THEN** el foco pasa de una card a la siguiente sin detenerse en ningún botón, campo o enlace de las vistas previas

#### Scenario: Nombre de la card
- **WHEN** un lector de pantalla llega a la card de `ButtonGroup`
- **THEN** la anuncia como un enlace con el nombre del componente y su descripción, sin texto de la vista previa

#### Scenario: Clic en la vista previa
- **WHEN** el usuario hace clic sobre un botón dibujado en la vista previa
- **THEN** se abre la página del componente, igual que con un clic en cualquier otra parte de la card

### Requirement: Build sin capturas
El build de la web SHALL funcionar sin leer las capturas aprobadas de la paridad visual. Esas capturas SHALL seguir siendo la referencia de los tests visuales.

#### Scenario: Componente nuevo sin captura
- **WHEN** se añade un componente al catálogo con su ficha y su ejemplo, todavía sin sus PNG aprobadas, y se construye la web
- **THEN** el build termina sin errores y su card muestra la vista previa en vivo; el test de catálogo y el visual siguen fallando por la captura que falta
