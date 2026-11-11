---
"@jotis-me/react": minor
---

Cobertura completa del Figma «Yoruverse UI v8.0»: 27 componentes nuevos y las variantes que faltaban en los existentes. El catálogo pasa a 121 componentes en 12 grupos, con el grupo nuevo «Web de marketing». Todo es retrocompatible: sin las props nuevas, cada componente pinta el mismo HTML que antes.

**Componentes nuevos**

- Identidad y valoraciones: `AvatarProfilePhoto`, `CheckIcon`, `CheckItem`, `Rating` (relleno parcial, «4,5 de 5») y `RatingBadge`.
- Botones de redes y tiendas: `SocialButton` (Google, Facebook, Apple, X, Figma y Dribbble, en tres temas), `SocialButtonGroup` y `AppStoreBadge` (Google Play, App Store, Mac App Store, Galaxy Store y AppGallery).
- Gráficas: `ActivityGauge`, `RadarChart` y `ChartMarker`, que también se puede usar en `LineChart` y `BarChart` con `marker`.
- Color y filtros: `ColorPickerDropdown` (seis disparadores que abren el selector en un popover), `FilterMenu` (constructor de condiciones) y `FilterPanel` (filtros en un panel lateral).
- Fondos y dispositivos: `BackgroundOverlay`, `ScreenMockup` (3:2 en seis tamaños y moderno), `LaptopMockup` y `PhoneMockup`.
- Web de marketing: `MarketingNav` (navegación con menús de varios tipos y versión flotante), `Footer`, `BlogPostCard`, `SubscribeCard`, `PricingCard` (diez tipos), `JobPostCard`, `Accordion` (con teclado), `TeamMemberCard` (siete tipos) y `Testimonial`.

**Variantes nuevas en componentes existentes**

- `Avatar`: insignias de verificado, número y empresa, y estado. `AvatarGroup`: botón de añadir. `Badge`: bandera, avatar, X y solo icono. `Tag`: bandera, avatar, punto, contador y casilla.
- `ButtonGroup`: iconos, solo icono y punto. `CloseButton`: fondo oscuro. `Button` e `iconOnly` aceptan un icono ya pintado.
- `Dropdown`: buscador, integraciones y los selectores de cuenta. `Input`: tarjeta de pago, botón detrás, fecha y hora y archivo. `Textarea`: etiquetas dentro o fuera y `size="sm"`. `Select`: búsqueda, iconos, avatares, puntos y etiquetas. `RadioGroup`: los seis tipos del Figma. `ProgressBar` y `Slider`: etiquetas y rango. `TextEditor`: barra flotante y tamaños. `VideoPlayer`: tres tamaños.
- `ActivityFeed`: divisores (`connector` sigue como alias) y tipo mensajes. `Notification`: los nueve tipos. `SidebarNav`: dos niveles, estrecha, secciones, tarjetas destacadas (`SidebarCards`) y cuenta. `Breadcrumbs`: divisor y cuatro tipos. `Pagination`: seis tipos con `align`, y forma.
- `CalendarView`: vistas de semana y día. `LineChart` y `BarChart`: leyenda y marcador. `ColorPicker`: los doce tipos y los modelos Hex, RGB, CSS, HSL y HSB. `DatePicker`: rango, fecha sola y horas.
- `ContentDivider`, `FileUpload`, `InlineCTA`, `Message`, `MessageInput`, `MetricCard`, `PageHeader`, `SectionHeader`, `Table` (celdas, orden, selección), `FilterBar`, `TreeView`, `Tabs`, `CodeSnippet`, `BackgroundPattern`, `CreditCard` (trece temas), `BrowserFrame`, `FeaturedIcon` y `Carousel` (`arrowStyle`): las variantes del Figma.
- `Modal`: `align`, `media`, `footerStart` y `dividers`. `Slideout`: `icon` y `footerStart`. Con ellos, la web monta los 51 tipos de Modal y los 23 de Slideout del Figma como composiciones para copiar.

Las props de icono aceptan el nombre de un icono del núcleo o cualquier icono de `@jotis-me/icons` ya pintado, sin cargar el set entero.
