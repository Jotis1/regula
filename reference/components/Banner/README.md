Aviso de ancho de página o flotante para anunciar algo a toda la app: novedades, mantenimiento, captación de correo, cuenta atrás.

**Props.** `title`, `description`, `icon` (icono destacado `modern`, 40px), `actions`, `email` ({`placeholder`, `buttonLabel`, `hint`, `onSubmit(value)`}: campo de 360px con botón), `countdown` (fecha objetivo; `now` congela el reloj para capturas), `theme` (`default` · `brand`), `layout` (`floating` · `full`), `slim` (una línea, centrada, sin icono), `onClose`.

**Visual.** `default`: `bg-secondary`, borde `border-secondary_alt`, título `text-secondary` semibold 14, apoyo `text-tertiary`. `brand`: `bg-brand-section_subtle`, borde `border-brand_alt`, título `text-primary_on-brand`, apoyo `text-tertiary_on-brand`. Flotante con `radius-xl` y `shadow-lg`, padding 12; `full` pegado al borde superior, sin radio.

**Reglas.** Uno a la vez. Siempre descartable salvo que el aviso bloquee algo de verdad. Para un problema dentro de una vista, `Alert`; para una invitación dentro de la página, `InlineCTA`. En móvil el banner se apila y oculta el icono.
