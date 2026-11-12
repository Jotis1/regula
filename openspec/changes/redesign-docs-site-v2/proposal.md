# Proposal

## Why

regula.jotis.me funciona, pero cada tipo de página se diseñó en un momento distinto y se nota. El ejemplo interactivo es una pared de controles en los componentes con muchas props, el índice es una rejilla larga de cards iguales, la portada explica mucho y enseña poco, y los fundamentos son texto y tablas correctas pero planas. El rediseño (lienzo «Regula - rediseño de la web» y su documento de dirección, 12 de noviembre de 2026, revisados y aprobados) lo ordena con una idea: cada página tiene un espécimen y una ficha. Primero se ve la cosa real; después se lee la regla que la explica.

## What Changes

- **Esqueleto común.** Todas las páginas abren con `PageHeader` y cada sección con `SectionHeader`, con el mismo espaciado (40 px hasta el primer bloque, 56 px entre secciones) y una columna de lectura de 720 px como máximo. «En esta página» es `Tabs` vertical de enlaces. La cabecera va a ancho completo (`HeaderNav` `fullWidth`).
- **Navegación lateral.** Pasa a `SidebarNav` con `disclosure="native"`, sin JavaScript, y enseña solo el árbol de la sección actual. Portada, iconos y 404 van sin lateral.
- **Página de componente.** El ejemplo interactivo pasa a tres zonas fijas: lienzo y código a la izquierda, inspector de 368 px con su propio desplazamiento a la derecha. Los controles van en grupos plegables (`Disclosure`), con «Lo esencial» abierto, y un filtro arriba cuando el componente tiene más de doce props. Los atajos van en un `Select`. Lo cambiado se ve en tres sitios: insignia y «Restablecer» en la fila (`labelAside`), recuento en el grupo y una tira de `Tag` bajo el lienzo; el código marca esas líneas. Un control que no aplica se desactiva con el motivo en su `hint`. «Cuándo usarlo» y «Evita» pasan a `ExampleCard` con el componente real. En móvil, el lienzo queda pegado arriba, el inspector en una columna y una barra inferior con «Copiar código»; la tabla de props pasa a lista plegable.
- **Portada.** La instalación con su comando sube a la primera pantalla. «Las cinco reglas» pasan a ser una historia: una pantalla de Pecunia que llega mal hecha y se arregla regla a regla (`ProgressSteps` navegable y `Spotlight`); en móvil, una tira deslizable (`Carousel` `strip`). «Así se ve» es una pantalla entera de Pecunia en claro y oscuro con una línea que se arrastra (`CompareSlider` y `light-mode`). El formulario de la cabecera usa el desplegable de divisa en el importe.
- **Índice de componentes.** Arriba, un mapa de los 16 grupos con una frase de para qué sirve cada uno. Buscador por nombre o por lo que hace y un `Select` de grupo. Cards a tres columnas.
- **Fundamentos.** Las reglas se enseñan con pares «esto sí, esto no» (`ExampleCard`). Las de tokens tienen un explorador con filtro y familias, con `TokenSwatch` en cada fila y una tarjeta por token en móvil. Contenido y tono enseña cada «en lugar de, mejor» con el componente real.
- **Iconos.** Las seis URL se mantienen y se enlazan con `Tabs` de enlaces. Filtros en una fila, rejilla de `IconTile` y panel del elegido fijo a la derecha; en móvil, en una hoja inferior (`Slideout` `bottom`).
- **Estados.** Carga con `Skeleton` en las muestras y `Spinner` en el lienzo; sin resultados con `EmptyState` y una salida; error al copiar con `Notification` de error, sin broma.
- **Texto.** Entran los textos nuevos aprobados con el rediseño: las frases de grupo del índice, los titulares y pasos de la portada y los textos de estado.
- Las URL no cambian. El historial y la instalación solo heredan el esqueleto común.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `docs-site`: cambian la estructura de la web, la navegación lateral, la portada, el ejemplo interactivo, el índice, la galería de iconos y la navegación dentro de la página, y se añaden el esqueleto común, las reglas con ejemplos, el explorador de tokens y los estados.

## Impact

- `apps/docs`: layouts (`Base`, `ComponentPage`, `FoundationPage`), `SiteHeader`, `SideNav`, `MobileMenu`, `Playground`, `PropsTable`, `TokenExplorer`, `TokenTables`, las galerías y las páginas de portada, índice e iconos. Capturas de las páginas que cambian, límites de `check:js` revisados y Lighthouse en las cuatro páginas auditadas.
- Depende de `unblock-docs-redesign`, `add-docs-variants` y `add-docs-pieces`, archivados y publicados antes.
- Sin cambios en los paquetes ni en el artefacto.
