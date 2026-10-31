---

name: Message
description: "Mensaje de una conversación, recibido (con avatar, a la izquierda) o enviado (a la derecha)."
interactive: false
---

**Props.** `author`, `avatar` (props de `Avatar`), `time`, `sent`, `typing` (puntos de "escribiendo"), `online`, `footer`, contenido en `children`.

**Visual.** Burbuja `text-md-regular`, padding 8/12. Recibido: `bg-secondary`, esquina superior izquierda recta. Enviado: `bg-primary`, esquina superior derecha recta. Ambos con borde `border-secondary`. Nombre `text-sm-medium` en `text-secondary`, hora `text-xs` en `text-tertiary`.

**Uso.** Es el chat de Emptor. Respuestas de la IA cortas, en párrafos; nada de listas eternas dentro de una burbuja.

**Detalles.** Funciona sin JavaScript. Los puntos de "escribiendo" se anuncian como "Escribiendo" y solo se animan si el sistema no pide reducir el movimiento.
