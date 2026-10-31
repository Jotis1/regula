---

name: Notification
description: "Aviso flotante y temporal (toast) tras una acción del usuario, de 320px de ancho."
interactive: true
astroNote: "`onClose` es una función y el cierre automático necesita JavaScript: úsalo dentro de una isla `.tsx` con `client:load`."
---

**Props.** Las de `Alert`. Sombra `shadow-lg` y borde `border-secondary_alt`. Se coloca abajo a la derecha, apilado, y se cierra solo a los ~6 s salvo que tenga acciones.

**Cierre automático.** Si tiene `onClose` y no tiene `actions`, llama a `onClose` a los 6 s. El tiempo se para mientras el ratón está encima o el foco dentro, para que dé tiempo a leerla. `autoClose` cambia los milisegundos o, con `false`, lo quita (ampliación sobre la guía).

**Colocación.** El componente es el aviso; colocarlo abajo a la derecha y apilar varios lo hace la app, por ejemplo con un contenedor `fixed bottom-4 right-4 flex flex-col gap-3`.

**Accesibilidad.** Como `Alert`: `status`, o `alert` si es un error. Con acciones no se cierra sola, porque el usuario necesita tiempo para elegir.
