---

name: ActivityGauge
description: "Anillos de actividad: hasta tres avances concéntricos con una cifra en el centro."
interactive: false
---

**Props.** `data` [{`name`, `value`, `max`? (100), `color`?}] (hasta tres anillos, de fuera adentro), `size` (`xs` 160 · `sm` 200 · `md` 240, por defecto · `lg` 280), `label` y `value` (texto y cifra del centro), `legend` (`"bottom"`, `"right"` o `false`, por defecto), `format(value, max)` (por defecto, «72 %») y `aria-label`.

**Visual.** La del Figma (`Activity gauge`, `1078:155`): anillos de 8, 12, 16 o 18 px según el tamaño, con 4 a 6 px entre ellos, pista `bg-tertiary` y el avance con los extremos redondos desde arriba, en el sentido de las agujas del reloj. Colores por defecto `utility-brand-700`, `-600` y `-400`. En el centro, el texto en `text-tertiary` y la cifra en Bricolage (`text-xl` en `xs`).

**Uso.** Para dos o tres avances que se comparan de un vistazo (uso por dispositivo, objetivos). Para el reparto de un total, `PieChart`; para un solo avance, `ProgressCircle`.

**Accesibilidad.** El dibujo es una imagen con nombre (`aria-label`, por defecto «Gráfica de actividad») y los valores van en una tabla solo para lectores, con el mismo nombre: «Móvil, 72 %». El color no es lo único: la leyenda nombra cada anillo. Funciona sin JavaScript.
