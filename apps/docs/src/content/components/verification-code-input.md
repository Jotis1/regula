---

name: VerificationCodeInput
description: "Código de verificación de 4 o 6 dígitos, una casilla por dígito, con pegado y autocompletado."
interactive: true
astroNote: "Pasar de casilla en casilla, pegar y autocompletar necesitan JavaScript: úsalo en una isla con `client:load`. `onComplete` es una función, así que envuélvelo en un `.tsx`."
---

**Cuándo usarlo.** Códigos de un solo uso que llegan por correo o SMS, y PIN cortos. Para contraseñas, `Input` con `type="password"`.

**Props.** `label`, `required`, `hint`, `error` (como `Input`), `digits` (`4` o `6`, por defecto 6), `size` (casillas de 64, 80 o 96px: `sm`, `md`, `lg`), `value` / `defaultValue` (el código, sin huecos), `onChange(code)`, `onComplete(code)` (una vez cada vez que se rellena entero), `disabled`, `name`, `digitLabel(n, total)` («Dígito 1 de 6»), `autoFocus`.

**Comportamiento.** Escribir una cifra pasa a la casilla siguiente; Retroceso borra la cifra y, en una casilla vacía, borra la anterior y vuelve a ella; las flechas se mueven entre casillas. Pegar el código entero, o que el sistema lo autocomplete desde el SMS (`autocomplete="one-time-code"` en la primera casilla), rellena todas a la vez. Solo entran cifras.

**Aspecto.** Cifras en `font-display` medium (`display-lg`; `display-xl` en `lg`) y en `text-brand-tertiary_alt`, con el `0` de muestra en `text-placeholder`. Casilla en reposo con borde `border-primary`; con cifra o con el foco, 2px en `border-brand` (sin anillo exterior). Con 6 dígitos, un guion decorativo en `utility-neutral-300` separa los dos grupos de tres.

**Accesibilidad.** Las casillas van en un grupo que se llama como la etiqueta, y cada una se anuncia como «Dígito n de N». La etiqueta visible lleva a la primera casilla. El error se enlaza al grupo y marca cada casilla con `aria-invalid`.

**Reglas.** Di en la pista adónde se ha enviado el código. Verifica en `onComplete`, sin botón de enviar, y si falla, vacía el código y explica en `error` qué hacer.
