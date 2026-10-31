Árbol de carpetas y archivos desplegable, con guías de nivel.

**Props.** `items` [{`id`, `label`, `icon`, `meta`, `children`}], `defaultOpen` (ids), `defaultSelected` / `selected`, `onSelect(item)`, `aria-label`.

**Visual.** Filas de 32px, `text-sm-semibold` en `text-tertiary`, iconos de 16px; seleccionada `bg-secondary_hover`. Sangría de 24px por nivel con línea `border-secondary`.

**Uso.** Navegación de documentos (Ornatus) o jerarquías de categorías. Más de cuatro niveles es mala señal.
