---

name: Dropdown
description: "Menú de acciones que se abre desde un botón."
interactive: true
astroNote: "Los `onSelect` de los ítems son funciones y no cruzan de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label` o `trigger`, `items` [{`icon`, `label`, `shortcut`, `danger`, `onSelect`} o {`divider`: true}], `header` (p. ej. un `AvatarLabel`), `open` / `defaultOpen`. Panel `bg-primary_alt`, `radius-lg`, `shadow-lg`, mínimo 240px; ítems de 16px de icono con `radius-md`.

**Regla.** La acción destructiva va al final, tras un separador, con `danger`.

**Teclado.** Enter, espacio o ↓ abren el menú en el primer ítem y ↑ en el último; las flechas recorren, escribir salta al ítem que empieza así, Enter elige y Escape cierra. Al cerrar, el foco vuelve al botón. Con ratón, el foco entra en el menú y cada ítem se marca al pasar por encima.

**Abierto de inicio.** Con `defaultOpen` el panel se pinta en línea bajo el botón (como en esta página), sin llevarse el foco ni bloquear la página; elegir un ítem o pulsar el botón lo cierra. Abierto por el usuario, el panel flota sobre la página: se da la vuelta si no cabe debajo y se cierra al pulsar fuera.

**Ampliaciones sobre la guía.** `onOpenChange(open)` avisa al abrir y cerrar (sin él, `open` controlado no se podría cambiar) y `textValue` en un ítem da el texto para buscar con el teclado cuando `label` no es texto. Un `trigger` propio tiene que pasar `ref` y props al DOM, como hace `Button`.

**Detalles.** Los atajos solo se muestran: el componente no los registra.
