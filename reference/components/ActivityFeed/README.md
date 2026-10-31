Lista cronológica de lo que ha pasado: quién hizo qué y cuándo.

**Props.** `items` [{`author`, `avatar`, `time`, `text` (admite `<strong>` para destacar el objeto), `content` (adjunto, etiquetas…), `unread`, `online`}], `connector` (línea vertical entre avatares en lugar de separadores), `size` (`md` · `sm`).

**Visual.** Avatar 40px, autor `text-sm-semibold` en `text-secondary`, hora `text-xs` en `text-tertiary`, texto en `text-tertiary`. Sin leer: punto `fg-success-secondary`.

**Uso.** Historial de cambios de un elemento (con `connector`) o centro de notificaciones (con separadores).
