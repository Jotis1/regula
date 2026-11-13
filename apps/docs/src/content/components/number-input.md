---

name: NumberInput
description: "Campo numérico con botones para restar y sumar, mínimo, máximo y paso, en formato es-ES."
interactive: true
astroNote: "Los botones y las flechas necesitan JavaScript: úsalo en una isla con `client:load`. `onChange` es una función, así que envuélvelo en un `.tsx`."
---

**Cuándo usarlo.** Cantidades pequeñas que se ajustan de una en una o de un paso fijo: invitados, noches, horas. Para un rango continuo, `Slider`; para importes largos, `Input` con su prefijo o desplegable de divisa.

**Props.** `label`, `required`, `hint`, `error` (como `Input`), `labelAside` (nodo a la derecha de la etiqueta, fuera del `<label>`), `value` / `defaultValue`, `onChange(n)` (recibe `NaN` si se vacía), `min`, `max`, `step` (1 por defecto), `orientation` (`horizontal`: − y + a los lados, separados por un borde; `vertical`: dos chevrons apilados detrás), `size` (`sm` 36px · `md` 40 · `lg` 44), `formatOptions` (decimales, divisa, porcentaje), `placeholder`, `disabled`, `name`, `decrementLabel` / `incrementLabel` («Restar» y «Sumar»).

**Estados.** Los del marco de `Input`: borde `border-primary`, foco de 2px `border-brand` sin anillo exterior, error con `border-error_subtle` y mensaje en `text-error-primary`, deshabilitado al 50%. Los botones pasan a `bg-primary_hover` al pasar el ratón y se deshabilitan solos en el mínimo y en el máximo.

**Teclado.** Flechas arriba y abajo suman y restan el paso; Inicio y Fin van al mínimo y al máximo; Re Pág y Av Pág, diez pasos. Los botones no entran en el orden de tabulación: con teclado basta el campo.

**Formato.** Siempre en `es-ES`, sea cual sea el idioma del navegador: se escribe y se ve con coma decimal (`12,5`) y punto de miles (`1.080`).

**Reglas.** Etiqueta siempre visible. Pon `min` y `max` cuando existan de verdad: así el botón se deshabilita en el límite y no hace falta un error.
