---

name: ActivityFeed
description: "Lista cronológica de lo que ha pasado: quién hizo qué y cuándo."
interactive: false
---

**Props.** `items` [{`author`, `avatar`, `time`, `handle`, `text` (admite `<strong>` para destacar el objeto), `supporting`, `content` (adjunto, etiquetas…), `unread`, `online`}], `divider` (`line` · `divider` · `connector` · `none`), `type` (`notifications` · `messages`), `size` (`md` · `sm`). `connector` sigue valiendo como alias de `divider="connector"`.

**Visual.** Avatar 40px, autor `text-sm-semibold` en `text-secondary`, hora `text-xs` en `text-tertiary`, texto en `text-tertiary`. Sin leer: punto `fg-success-secondary`.

**Uso.** Historial de cambios de un elemento (con `connector`) o centro de notificaciones (con separadores).

**Detalles.** Funciona sin JavaScript. Es una lista ordenada (`<ol>`). El punto de "sin leer" lleva ese texto para lectores de pantalla.

**Mensajes (`type="messages"`).** Autor en `text-sm-medium` con la hora al lado, el usuario (`handle`, «@lana») debajo y el texto en una burbuja con borde `border-secondary` y la esquina superior izquierda recta.

**Elementos de apoyo (`supporting`).** Bajo el texto, uno de tres:
- `{ type: "tags", tags }`: etiquetas `Tag`;
- `{ type: "file", name, size, icon }`: archivo con su nombre y tamaño. El icono llega como nodo, como `FileDocumentPdf` de `@jotis-me/icons/files`; sin él, `file-04`;
- `{ type: "text", text }`: un texto en un recuadro, como una respuesta.

**Apoyo en mensajes.** En `messages`, un elemento con `supporting` lo enseña en lugar de la burbuja.
