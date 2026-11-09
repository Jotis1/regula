---
"@jotis-me/react": minor
---

Variantes menores del Figma, fase 3: tres componentes nuevos y el catálogo pasa de 91 a 94.

- `BadgeGroup`: un badge dentro de otro con un mensaje («Nuevo · Hemos publicado…»), delante o detrás, en `pill` o `modern`, cinco colores y `md`/`lg`. Con `href` u `onClick` es un enlace o un botón con flecha.
- `SectionLabel`: el título de una sección de ajustes, con marca de obligatorio, icono de ayuda, texto de apoyo y acciones debajo, en `sm` y `md`.
- `ButtonUtility`: botón pequeño de solo icono (`xs`, `sm`; `secondary`, `tertiary`) que dice qué hace en un tooltip.

Y en los que ya había, sin cambiar lo de antes:

- `Spinner` gana `variant`: `line-spinner` (arco largo, sin pista) y `dot-circle` (dieciséis puntos que se desvanecen).
- `EmptyState` gana `media` con las ocho cabeceras del Figma (ilustraciones de nube, caja, documentos y tarjeta; archivo; carpeta; carpeta translúcida; usuarios en círculos y en fila; integraciones, con los avatares o logos que le pases en `items`) y `size` (`sm`, `md`, `lg`). Sin las props nuevas se ve igual que antes. Pesa más: sus dibujos lo llevan de unos 22 a unos 40 kB en gzip.
