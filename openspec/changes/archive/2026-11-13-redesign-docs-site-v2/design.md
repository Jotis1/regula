# Design

## Context

- Referencia: el lienzo «Regula - rediseño de la web» (20 pantallas a 1.440 y 390 px, en claro y oscuro donde cambia algo más que el color) y su documento «dirección, faltas y cambios», que trae la dirección de diseño, la tabla de cambios por página y el texto nuevo, aprobado.
- La web ya monta su estructura con el paquete (`docs-site-with-own-components`), carga solo el JavaScript de lo que usa (`trim-docs-js`) y, desde `adopt-untitled-ui-icons`, enseña en cada card del índice una captura WebP de la muestra del componente, en claro y en oscuro (`ShowcaseImage`).
- El lienzo enseña las muestras del índice encogidas con `ScaledPreview`. Eso era solo para el boceto: en la web son las capturas, que ya vienen compuestas a 16:10 (D5).
- Este cambio se escribió contra las specs de la 0.7.0 y se ha puesto al día con `adopt-untitled-ui-icons`: capturas en las cards, iconos de `@untitledui/icons` como componente y los assets en `@jotis-me/assets`. Los atajos del ejemplo interactivo, que ese cambio quitó como fila de botones, vuelven aquí como un desplegable (D3).

## Goals / Non-Goals

**Goals:**
- Un solo esqueleto de página para toda la web, montado con componentes del paquete.
- El ejemplo interactivo usable con 20 props, en escritorio y en móvil.
- Ningún componente hecho a mano en la web: lo que faltaba entra antes por los tres cambios previos.

**Non-Goals:**
- Cambiar URL, la búsqueda (`CommandMenu` con Pagefind) o el selector de tema.
- Rediseñar el historial de cambios y la instalación más allá del esqueleto.

## Decisions

### D1. Esqueleto común
- `PageHeader` con migas, título, descripción y, en las de componente, la importación en un `Input` de solo lectura con `trailingButton` de copiar.
- Cada sección, `SectionHeader` `sm`. Espaciado: 40 px entre la cabecera y el primer bloque, 56 px entre secciones. Columna de lectura de 720 px; los especímenes, las tablas y el ejemplo interactivo van al ancho del contenido (1.280 px menos el índice).
- «En esta página» a la derecha, pegado arriba al desplazarse: `Tabs` vertical `line` con `href` de ancla. En móvil no se pinta.

### D2. Navegación lateral por sección
- `SidebarNav` `simple` con `disclosure="native"` y `search`. Su contenido depende de la sección: en Componentes, «Todos los componentes» y los doce grupos con su recuento; en Stream, la guía y sus cuatro grupos; en Fundamentos, las diez páginas; en Empezar, las dos.
- El filtro sigue siendo el script actual de `SideNav`, que oculta enlaces y abre los `<details>` con coincidencias.
- El menú móvil (`Slideout` a ancho completo) lleva el lateral de toda la web, no solo el de la sección, con los cinco bloques plegados salvo el actual.

### D3. Ejemplo interactivo
- **Composición:** cabecera con el título, el `Select` de atajos, el recuento de cambios y «Restablecer todo» (`Button` `secondary` `xs`, desactivado sin cambios). Debajo, una rejilla de dos columnas: a la izquierda el lienzo (damero, 336 px de alto mínimo), la tira de cambios y el `CodeSnippet`; a la derecha el inspector, de 368 px, con desplazamiento propio y el filtro pegado arriba.
- **Grupos:** el arranque de cada componente (`src/lib/starts/`) gana `groups`: una lista de grupos con su nombre y sus props. Sin `groups`, un grupo «Propiedades» con todas. El primer grupo va abierto; el resto, cerrado salvo que tenga cambios.
- **Filtro:** aparece con más de doce controles. Filtra por nombre de prop y abre los grupos con coincidencias.
- **Cambiado:** la fila de cada control usa `labelAside` con `Badge` `brand` «Cambiado» y un `Button` `link-gray` «Restablecer». El grupo lleva su recuento en `Badge`. Bajo el lienzo, una `Tag` por prop cambiada con su forma en código; quitar la etiqueta restablece la prop. `CodeSnippet` marca las líneas de esas props con `highlight`.
- **Atajos:** `Select` con `placeholder` «Empezar desde un atajo». Elegir uno pone sus props sobre los valores por defecto (no sobre los actuales) y queda elegido mientras esas props no cambien. `adopt-untitled-ui-icons` quitó la fila de botones «Tipos» y sus datos de los arranques; aquí vuelven como datos (`shortcuts` en el arranque, generados del mismo `test/fixtures/figma-types.json` que `starts/tipos-del-figma.ts`) y solo en el desplegable. El test que comprueba que cada tipo del Figma se alcanza con los controles se queda.
- **No aplica:** el control desactivado lleva su motivo en `hint`, que el campo ya enlaza con `aria-describedby`.
- **Móvil:** lienzo pegado arriba; debajo, el `Select` de atajos, la tira de cambios, los grupos en una columna y el código; una barra pegada abajo con el recuento, «Restablecer» y «Copiar código» como acción principal.
- **Props:** en escritorio, `Table`; por debajo de `lg`, una lista de `Disclosure`, uno por prop, con el tipo bajo el nombre y la descripción y el valor por defecto dentro.

### D4. Portada
- **Cabecera:** titular, entradilla con las cifras reales, `CodeSnippet` con la instalación en Next.js y Astro, `Button` `xl` «Seguir la instalación» como acción principal y el campo de búsqueda. A la derecha, el formulario «Nuevo gasto» de componentes reales dentro de `BrowserFrame`; el importe usa `trailingSelect` de divisa.
- **Las cinco reglas:** una pantalla de Pecunia que llega con cinco fallos y una lista de seis pasos (`ProgressSteps` vertical navegable con `children`): cada regla aplicada se queda puesta y `Spotlight` señala lo que acaba de cambiar. Controles: los pasos, «Anterior», `PaginationDots` y «Siguiente regla». En móvil, `Carousel` `strip` con un fotograma por paso.
- **Así se ve:** `CompareSlider` con la misma pantalla de Pecunia (cabecera, tres `MetricCard` y una `Table`) en `light-mode` y en `dark-mode`, con dos botones «Todo claro» y «Todo oscuro».
- **Mapa y suite:** `LinkCard` con su muestra hacia Fundamentos, Componentes, Stream e Iconos, y las seis apps con su `AppIcon`.

### D5. Índice de componentes
- `PageHeader` con el buscador (nombre, descripción y `COMPONENT_KEYWORDS`) y el `Select` de grupo, que lleva al ancla del grupo.
- «Qué necesitas hacer»: 16 `LinkCard` sin muestra, una por grupo, con su frase y su recuento.
- Grupos con `SectionHeader` y su frase; cards `LinkCard` a tres columnas (dos en móvil). Las muestras siguen el requisito «Captura de muestra en las cards del índice»: la imagen WebP del tema de la página, sin pintar el componente en vivo.

### D6. Fundamentos
- Cada página que enuncia reglas abre con dos o más `ExampleCard` en pares.
- Explorador de tokens: `Input` de filtro y `Tabs` `button-border` de familia (Texto, Fondos, Bordes, Iconos, Estados, Utility); una `Table` con `TokenSwatch` `row` por fila. En móvil, `TokenSwatch` `card`.
- Contenido y tono: cada fila de «En lugar de esto, esto otro» es un par de `ExampleCard` (`instead` y `better`) con el componente real (`EmptyState`, `Input` con error, `Alert`, `Button`).

### D7. Iconos
- `Tabs` `underline` con `href` hacia las seis URL actuales y su recuento.
- Una fila de filtros: buscador, `Select` de categoría, `ButtonGroup` de tamaño y el recuento en `aria-live`.
- Rejilla de `IconTile`; panel del elegido de 320 px pegado arriba a la derecha con el icono grande sobre damero, los tamaños y el `CodeSnippet`, y «Copiar el código» como acción principal. En móvil, el panel es un `Slideout` `bottom`.

### D8. Estados
- Carga: `Skeleton` en el hueco de cada captura del índice hasta que carga su imagen; `Spinner` con «Montando el ejemplo» en el lienzo del ejemplo interactivo.
- Sin resultados: `EmptyState` con el término buscado y una salida («Limpiar búsqueda»); en la búsqueda global, el `emptyText` de `CommandMenu`.
- Error al copiar: `Notification` `error` con qué ha pasado y cómo seguir, sin cierre automático.

## Risks / Trade-offs

- **Más componentes por página** → el JavaScript de la portada crece (`CompareSlider`, `ProgressSteps` navegable). Se revisan los límites de `check:js` en el mismo cambio y se anota cuánto suben.
- **Dos copias de la pantalla en «Así se ve»** → más HTML en la portada. Se mide con Lighthouse; si baja de 90, la copia oscura se pinta al entrar en pantalla.
- **Grupos de props escritos a mano** → cada arranque nuevo tiene que decidirlos. Sin `groups` hay un grupo único, así que nada se rompe; un test avisa de los componentes con más de doce props sin grupos.
