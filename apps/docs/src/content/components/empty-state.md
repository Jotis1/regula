---

name: EmptyState
description: "Lo que se ve cuando una lista, tabla o búsqueda no tiene contenido: qué pasa y qué hacer."
interactive: false
---

**Props.** `icon`, `title`, `description`, `actions`, `media` (cabecera: `icon` por defecto · `illustration` · `file` · `folder` · `folder-glass` · `users-radius` · `users-row` · `integrations`), `illustration` (`cloud` por defecto · `box` · `documents` · `credit-card`), `items` (avatares o logos de las cabeceras de usuarios e integraciones) y `size` (`sm` por defecto · `md` · `lg`). Icono `FeaturedIcon` modern gris, título `text-md-semibold` (`text-lg` en `md`, `text-xl` en `lg`), descripción `text-sm-regular` en `text-tertiary`, máximo 352px de ancho.

**Cabeceras.** La ilustración, el archivo y las carpetas son dibujos del Figma con los grises del tema, así que siguen el modo oscuro; el círculo de cristal de la ilustración lleva su icono (lupa, nube o aviso). Las de usuarios e integraciones pintan los `items` que les pases, desvanecidos hacia los lados, con `icon` en el centro: en tu app pueden ser fotos (`Avatar` con `src`) o logos de `@jotis-me/icons/logos`. Todas son decorativas (`aria-hidden`).

**Texto.** Di por qué está vacío y ofrece la siguiente acción. Nada de "¡Ups!".

**Ejemplos de la guía.** "Sin resultados" con "Ningún movimiento coincide con «León». Prueba con otro término o quita filtros.", y las acciones "Limpiar búsqueda" (secundaria) y "Nuevo movimiento" (primaria).

**Detalles.** Sin `icon`, la lupa (`search-lg`). El título es un `<h3>`.
