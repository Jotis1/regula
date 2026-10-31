Campo de texto de una línea con etiqueta, pista y error, en tres alturas.

**Props.** `label`, `required` (asterisco en `text-brand-tertiary`, rojo en error), `hint`, `error` (texto o `true`), `icon` (inicial, 20px en `fg-quaternary`), `trailing` (icono final), `size` (`sm` 36px · `md` 40 · `lg` 44), y cualquier atributo de `<input>` (`type`, `placeholder`, `value`, `onChange`, `disabled`…).

**Estados.** Reposo: borde `border-primary` + `shadow-xs`. Foco: borde de 2px `border-brand`. Error: borde `border-error_subtle`, en foco `border-error`, icono de alerta y mensaje en `text-error-primary`. Deshabilitado: 50% de opacidad.

**Reglas.** Etiqueta siempre visible (el borde del campo es suave, la etiqueta es lo que lo identifica). El placeholder es un ejemplo, nunca la etiqueta. El valor se escribe a 16px en `md`/`lg` para que iOS no haga zoom.
