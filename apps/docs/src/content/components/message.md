---

name: Message
description: "Mensaje de una conversación, recibido o enviado, con los nueve tipos del Figma, reacciones, estado y panel de acciones."
interactive: false
---

**Props.** `author`, `avatar` (props de `Avatar`), `time`, `sent`, `typing` (puntos de "escribiendo"), `online`, `footer`, contenido en `children`. Del Figma: `type`, `reply`, `file`, `audio`, `media`, `link`, `reactions` / `onReact`, `status` / `onRetry`, `actions` y `labels`.

**Tipos.** Los nueve del Figma (`Message`, `1242:996`): `message`, `reply` (cita encima), `file` (icono, nombre y tamaño; con `href`, enlace), `audio` (reproducir, onda y duración), `image` (con nombre y tamaño debajo), `video` (`<video>` con controles o un nodo), `link-preview` (imagen y enlace), `link` (tarjeta con título y descripción) y `typing`. Sin `type`, el de siempre.

**Reacciones, estado y acciones.** `reactions` es una lista bajo la burbuja, cada una con su contador; con `onReact` son botones con `aria-pressed`. `status` en los enviados pone junto a la hora un check (enviado), dos checks de marca (leído) o el aviso de fallo; con `onRetry`, el aviso es un botón «No se ha enviado. Reintentar el envío». `actions` pinta la barra oscura del Figma con un botón de icono por acción (con su nombre).

**Visual.** Burbuja `text-md-regular`, padding 8/12. Recibido: `bg-secondary`, esquina superior izquierda recta. Enviado: `bg-primary`, esquina superior derecha recta. Ambos con borde `border-secondary`. Nombre `text-sm-medium` en `text-secondary`, hora `text-xs` en `text-tertiary`.

**Uso.** Es el chat de Emptor. Respuestas de la IA cortas, en párrafos; nada de listas eternas dentro de una burbuja.

**Detalles.** Funciona sin JavaScript; solo el reproductor de `audio` es una isla. Los puntos de "escribiendo" se anuncian como "Escribiendo" y solo se animan si el sistema no pide reducir el movimiento.
