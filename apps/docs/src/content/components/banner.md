---

name: Banner
description: "Aviso de ancho de página o flotante para anunciar algo a toda la app: novedades, mantenimiento, captación de correo, cuenta atrás."
interactive: true
astroNote: "La cuenta atrás, el formulario de correo y `onClose` necesitan JavaScript: úsalo en una isla `.tsx` con `client:load`."
---

**Props.** `title`, `description`, `icon` (icono destacado de 48px: `modern` en el tema por defecto y `light` en `brand`), `actions`, `email` ({`placeholder`, `buttonLabel`, `hint`, `onSubmit(value)`}: campo de 360px con botón), `countdown` (fecha objetivo; `now` congela el reloj para capturas), `theme` (`default` · `brand`), `layout` (`floating` · `full`), `slim` (una línea, centrada, sin icono), `onClose`.

**Visual.** `default`: `bg-secondary`, borde `border-secondary_alt`, título `text-secondary` semibold 14, apoyo `text-tertiary`. `brand`: `bg-brand-section_subtle`, borde `border-brand_alt`, título `text-primary_on-brand`, apoyo `text-tertiary_on-brand`. Flotante con `radius-xl` y `shadow-lg`, padding 12; `full` pegado al borde superior, sin radio.

**Reglas.** Uno a la vez. Siempre descartable salvo que el aviso bloquee algo de verdad. Para un problema dentro de una vista, `Alert`; para una invitación dentro de la página, `InlineCTA`. En móvil (hasta 720px) el banner se apila y oculta el icono.

**El icono.** La ficha de la guía dice 40px `modern`, pero sus vistas previas lo pintan a 48px y con `light` en el tema de marca. Aquí se sigue a las vistas previas.

**Cuenta atrás en `brand`.** Las unidades (días, horas…) van en `text-primary_on-brand` y no en `text-tertiary_on-brand` como en la guía: sobre la celda de la cuenta atrás este último se queda en 4,4:1, por debajo del 4,5:1 que pide un texto de 11px.

**Accesibilidad.** Es una región con nombre (el título, o `aria-label`). La cuenta atrás es un `timer` cuyo nombre dice el tiempo entero ("3 días, 2 horas, 29 min, 45 seg"). El correo es un campo `email` obligatorio. La X se llama "Cerrar aviso" (se cambia con `closeLabel`).
