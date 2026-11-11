---

name: Breadcrumbs
description: "Ruta de navegación encima del título de página, con divisor chevron o barra y los tipos texto, texto con línea, botón y cuentas."
interactive: false
---

**Props.** `items` [{`label`, `href`?, `icon`?, `avatar`?, `accounts`?, `defaultAccount`?, `onAccountChange`?}], `divider`, `type`. El primero puede ser solo un icono (`home-line`). El último es la página actual, en `text-brand-secondary`, sin enlace.

**Divisor.** `chevron` (por defecto) o `slash`. Los separadores quedan fuera del árbol accesible.

**Tipos.** Los del Figma (`Breadcrumbs`, `1122:153`):
- `text`: el de siempre.
- `text-line`: la ruta entre dos rayas `border-secondary`.
- `button`: cada elemento es un botón con fondo al pasar el ratón; la página actual lleva `bg-primary_hover`.
- `account`: elementos en `text-primary`, con `avatar` delante del texto (el logo de la empresa) y, si el elemento trae `accounts`, el `Dropdown` `account-breadcrumb` para cambiar de cuenta.

**Móvil.** El espacio entre elementos baja de 8 a 6 px (de 4 a 2 en `button`); la ruta no cambia.

**Accesibilidad.** Va en un `<nav>` llamado "Migas de pan" (se cambia con `aria-label`), la página actual lleva `aria-current="page"` y los separadores quedan fuera del árbol accesible. Si un elemento es solo icono, su `label` sigue ahí para lectores de pantalla.

**Sin enlace.** Un elemento sin `href` que no es el último se pinta como texto: la guía lo enlazaba a `#`, que no lleva a ninguna parte.
