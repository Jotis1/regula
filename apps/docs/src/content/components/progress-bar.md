---

name: ProgressBar
description: "Barra de progreso de 8px con el porcentaje a la derecha o debajo."
interactive: false
---

**Props.** `value` (0–100), `label` (`right` · `bottom` · `top-floating` · `bottom-floating` · `false`), `aria-label`. Pista `bg-quaternary`, relleno `fg-brand-primary`.

**Etiqueta flotante.** `top-floating` y `bottom-floating` ponen el porcentaje en una burbuja (`bg-primary_alt`, `shadow-lg`, 12px semibold) centrada en el final de la barra, encima o debajo. La barra no recorta la burbuja y reserva el hueco que ocupa. La burbuja es decorativa: el valor lo anuncia `aria-valuenow`.
