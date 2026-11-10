# Proposal

## Why

El inventario del Figma «Yoruverse UI v8.0» hecho el 10 de noviembre de 2026 encontró 45 componentes de Regula con variantes que faltan y unos 35 que no existen. El usuario quiere que esta versión cubra el Figma entero, salvo las secciones de página. Hasta ahora cada fase dejaba fuera algo (vistas de semana y día del calendario, radar y gauge, color picker con degradado, mockups de dispositivos, banderas, iconos de archivo), y las apps tienen que construir esas piezas a mano.

## What Changes

Todo va en una sola PR y en este orden: cimientos de iconos, variantes de los componentes que ya existen, componentes base nuevos y componentes complejos nuevos.

- **Cimientos de iconos** en `@jotis-me/icons`:
  - Set de iconos de línea completo: de 82 a los 1.173 del Figma.
  - Entradas nuevas: banderas (260 países y regiones × círculo, cuadrado y rectángulo), métodos de pago (56 × `sm`/`md`), tipos de archivo (153), carpetas (8), emojis (18) y cursores (50).
- **Variantes en componentes que ya existen**, como en el Figma:
  - Identidad y etiquetas: `Avatar` (verificado, contador, avatar de empresa), `AvatarGroup` (botón de añadir), `AvatarLabel` (tamaños), `Badge` (bandera, avatar, icono detrás, solo icono), `Tag` (bandera, avatar, casilla).
  - Botones: `ButtonGroup` (tamaños, solo icono, punto), `CloseButton` (tamaños, fondo oscuro).
  - Formularios: `Dropdown` (búsqueda, integraciones, seis variantes de cuenta, disparador enlace), `Input` (pago, botón detrás, fecha y hora, archivo), `Textarea` (etiquetas), `ProgressBar` (etiquetas flotantes), `RadioGroup` (avatar, icono de pago, icono simple), `Select` (búsqueda, etiquetas), `Slider` (rango, etiquetas, tooltip), `TextEditor` (barra flotante, tamaños, barra simple y avanzada).
  - Medios y feeds: `VideoPlayer` (tamaños), `ActivityFeed` (divisores, mensajes, elementos de apoyo), `Notification` (imagen, avatar, progreso).
  - Navegación: `SidebarNav` (cinco tipos, tarjetas destacadas, tarjeta de cuenta), `Breadcrumbs` (barra, línea, botón, desplegables de cuenta), `Pagination` (diez tipos, forma circular).
  - Fechas y gráficas: `CalendarView` (vistas semana y día), `LineChart`/`BarChart` (posición de leyenda, ejes), `ColorPicker` (los doce tipos y los cinco modelos de color), `DatePicker` (horas disponibles, modal).
  - Contenido y estructura: `ContentDivider` (botones), `FileUpload` (progreso de relleno), `FilterBar` (ocho tipos), `InlineCTA` (siete tipos), `Message` (nueve tipos, reacciones, estado), `MessageInput` (con área de texto, avanzado), `MetricCard` (icono y gráfica), `PageHeader` (avatar y banner), `SectionHeader` (pestañas, búsqueda, grupo de botones), `Table` (tipos de celda, orden, acción inicial, filas alternas), `TreeView` (tamaños, avanzado).
  - Fondos y marcos: `BackgroundPattern` (tech grid), `CreditCard` (13 temas), `BrowserFrame` (minimal en color), `FeaturedIcon` (gradient, dark, modern neue).
  - Se comprueba que `Tabs` tiene ancho completo y que `CodeSnippet` tiene horizontal y vertical, y se completan si falta algo.
- **Componentes base nuevos** (8): `AvatarProfilePhoto`, `SocialButton`, `SocialButtonGroup`, `AppStoreBadge`, `CheckIcon`, `CheckItem`, `Rating` y `RatingBadge`.
- **Componentes complejos nuevos** (19):
  - Gráficas: `ActivityGauge`, `RadarChart` y `ChartMarker`.
  - Color y filtros: `ColorPickerDropdown`, `FilterMenu` y `FilterPanel`.
  - Fondos y mockups: `BackgroundOverlay`, `ScreenMockup` (3:2 y modern), `LaptopMockup` y `PhoneMockup`.
  - Piezas de marketing que no son secciones: `MarketingNav` (desplegable y a todo el ancho), `Footer`, `BlogPostCard`, `SubscribeCard`, `PricingCard`, `Accordion` (el FAQ item), `TeamMemberCard`, `Testimonial` y `JobPostCard`.
- **Composiciones en la web**:
  - Los ~49 tipos de `Modal`, los 23 de `Slideout` y el `Color picker modal` del Figma se montan como ejemplos en la web con componentes de Regula. No se exportan del paquete.
- **BREAKING** (`@jotis-me/icons`): `Icon` con `name` e `IconName` se quedan en un set núcleo (los 82 de hoy más los que usen los componentes). El set completo se publica como componentes sueltos (`IconXxx`, cada uno con su propio dibujo) y como SVG. Así un import de un icono no arrastra los 1.173. Los nombres que ya existían no cambian.
- El catálogo pasa de 94 a 121 componentes, cada uno con página, ficha, ejemplo, muestra y capturas aprobadas.
- **Fuera de alcance**:
  - Las secciones de página: todas las `… section` de Marketing, los page headers de Blog, Pricing y Contact, las páginas Log in, Sign up, Forgot password, Email verification y 404, y Email templates.
  - Las piezas internas de esas secciones (`_Feature text`, `_Feature tab`, `_Contact text`, `_Map location marker`, `_Metric item` de marketing, `Content item`, `_Pricing table cell`).
  - Las páginas de ejemplos de aplicación y de marketing, y Utility.
  - El logo «Logo/Logomark» de la plantilla: Regula tiene su propia marca.
  - Los logos de empresa (Company logo) y de prensa (Press logo) de la página «Logos» del Figma (decisión del usuario).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`:
  - El catálogo crece con 27 componentes.
  - Cada componente que gana variantes tiene un requisito nuevo.
  - Los `icon` de los componentes aceptan también un nodo con cualquier icono del set completo.
- `icon-set`:
  - El set completo pasa a 1.173 iconos y el núcleo con nombre queda aparte.
  - Entradas nuevas para banderas, pagos, tipos de archivo, carpetas, emojis y cursores.
- `docs-site`:
  - La galería de iconos cubre el set completo y los sets nuevos.
  - Modal y Slideout tienen página de composiciones.
- `design-system-artifact`: el artefacto lleva los grupos de assets nuevos.

## Impact

- `packages/icons`:
  - Importar los 1.091 iconos de línea que faltan y los sets nuevos desde el Figma con scripts, como en la fase 3.
  - Regenerar los componentes para que cada uno lleve su dibujo.
  - Entradas nuevas en `exports`.
  - Changeset `major` por el cambio de `IconName`. Mientras el paquete esté en 0.x se publica como `minor` y se declara como ruptura en el changelog.
  - El tarball crece mucho: se mide y se anota.
- `packages/react`:
  - 27 componentes nuevos y cambios retrocompatibles en unos 45, salvo los que se declaren como ruptura en design.md.
  - Textos en `defaultStrings`, tests y límites en `size-budget.json`.
  - Changeset `minor`.
  - `@jotis-me/react` no importa banderas, pagos, archivos, emojis, cursores ni logos: los recibe como nodos.
- `apps/docs`:
  - 27 páginas, nuevas capturas de los componentes con variantes nuevas, y las páginas de composiciones de Modal y Slideout.
  - La galería de iconos, con paginación o carga diferida para que no se pase del límite de JS ni de HTML.
  - Muchas capturas nuevas que mirar en claro y oscuro.
- Artefacto: 27 componentes más y miles de assets nuevos (iconos, banderas, pagos, archivos, emojis y cursores) en la sincronización tras publicar. Son unas 90 tandas de 25.
- Tamaño de la PR: es la más grande del proyecto. Cada pieza va en su propio commit y cada grupo de tasks se puede revisar por separado.
