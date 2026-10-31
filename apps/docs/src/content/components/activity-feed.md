---

name: ActivityFeed
description: "Lista cronológica de lo que ha pasado: quién hizo qué y cuándo."
interactive: false
---

**Props.** `items` [{`author`, `avatar`, `time`, `text` (admite `<strong>` para destacar el objeto), `content` (adjunto, etiquetas…), `unread`, `online`}], `connector` (línea vertical entre avatares en lugar de separadores), `size` (`md` · `sm`).

**Visual.** Avatar 40px, autor `text-sm-semibold` en `text-secondary`, hora `text-xs` en `text-tertiary`, texto en `text-tertiary`. Sin leer: punto `fg-success-secondary`.

**Uso.** Historial de cambios de un elemento (con `connector`) o centro de notificaciones (con separadores).

**Detalles.** Funciona sin JavaScript. Es una lista ordenada (`<ol>`). El punto de "sin leer" lleva ese texto para lectores de pantalla.
