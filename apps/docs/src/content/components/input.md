---

name: Input
description: "Campo de texto de una línea con etiqueta, pista y error, en tres alturas."
interactive: false
astroNote: "Sin directiva funciona como campo nativo dentro de un `<form>`, también con `prefix` y los desplegables. El botón de la contraseña y `onChange` necesitan una isla: ponlo en un `.tsx` con `client:load`."
---

**Props.** `label`, `required` (asterisco en `text-brand-tertiary`, rojo en error), `hint`, `error` (texto o `true`), `icon` (inicial, 20px en `fg-quaternary`), `trailing` (icono final), `size` (`sm` 36px · `md` 40 · `lg` 44), `type` (los nativos y `card`), `cardLogos`, `trailingButton`, y cualquier atributo de `<input>` (`type`, `placeholder`, `value`, `onChange`, `disabled`…).

**Texto delante y desplegables.** `prefix` pone un texto fijo delante del valor (`https://`), en `text-tertiary` y separado por un borde `border-primary`; no forma parte del valor. `leadingSelect` y `trailingSelect` meten un desplegable nativo delante (prefijo telefónico) o detrás (divisa), sin separador: `{ options, value, defaultValue, onChange, label, name }`. Su valor va aparte del texto y `label` es obligatorio, porque es el nombre accesible del desplegable.

**Tarjeta de pago.** Con `type="card"` el campo es numérico (`inputmode="numeric"`, `autocomplete="cc-number"`), deja solo los dígitos (hasta 19) y los agrupa de cuatro en cuatro; `onChange` recibe el valor ya agrupado. Delante enseña el logo de la red detectada por los primeros dígitos (Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay y Maestro) en una caja de 34×24: los logos llegan en `cardLogos` como nodos (los de `@jotis-me/assets/payments`) porque el paquete no los importa; sin el de la red, no se pinta ninguno. Amex se agrupa también de cuatro en cuatro, no en 4-6-5.

**Botón detrás.** `trailingButton={{ label, icon?, onClick? }}` pone un botón pegado al campo por la derecha, con el borde compartido (`border-primary`) y el foco de 2px en `border-brand` dentro de su caja. Se llega con Tab tras el campo.

**Fecha y hora.** `type="datetime-local"` es el campo nativo (se escribe por tramos y funciona el teclado y el selector de cada navegador), con el calendario de 20px delante: el botón `pickerLabel` («Elegir fecha») abre el selector nativo. El indicador nativo se oculta para no repetirlo.

**Archivo.** `type="file"` pinta el nombre del archivo (o «Ningún archivo seleccionado», `noFileLabel`) y el botón «Elegir archivo» (`chooseFileLabel`) pegado a la derecha. El campo nativo va oculto pero enfocable: con el teclado se abre con Espacio o Enter; el botón es para el ratón y no entra en el orden de Tab. Con `multiple`, los nombres van separados por comas.

**Contraseña.** Con `type="password"` aparece detrás un botón con el ojo para mostrar u ocultar lo escrito («Mostrar contraseña» / «Ocultar contraseña», con `aria-pressed`). Cambia los textos con `revealLabels={{ show, hide }}` y quítalo con `revealable={false}`. Al pulsarlo, el texto no se pierde y el foco se queda en el botón.

**Estados.** Reposo: borde `border-primary` + `shadow-xs`. Foco: borde de 2px `border-brand`. Error: borde `border-error_subtle`, en foco `border-error`, icono de alerta y mensaje en `text-error-primary`. Deshabilitado: 50% de opacidad.

**Reglas.** Etiqueta siempre visible (el borde del campo es suave, la etiqueta es lo que lo identifica). El placeholder es un ejemplo, nunca la etiqueta. El valor se escribe a 16px en `md`/`lg` para que iOS no haga zoom. Los desplegables son para listas cortas, como `Select`; para elegir varias cosas, `MultiSelect`.

**Foco.** Con el foco el borde pasa a 2px `border-brand`, como dice la ficha; con ratón y con teclado es el mismo, sin anillo exterior (en el Figma solo se dibuja el borde). El error se enlaza al campo con `aria-invalid` y `aria-describedby`.
