---

name: DatePicker
description: "Selector de una fecha o de un rango, con presets opcionales y botones de aplicar y cancelar."
interactive: true
astroNote: "`onApply` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `range` (rango en lugar de una fecha), `defaultValue` ({`start`, `end`}), `onApply({start, end})`, `presets` [{`label`, `start`, `end`?}], `placeholder`, `open` / `defaultOpen`, `inline` (pinta el panel sin botón), `today`.

**Visual.** Disparador: botón secundario `sm` con icono de calendario. Panel `bg-primary`, `radius-2xl`, `shadow-xl`; presets a la izquierda (152px); celdas redondas de 40px, seleccionada `bg-brand-solid` con texto blanco, días intermedios `bg-secondary_hover`, hoy con punto `fg-brand-primary`. La semana empieza en lunes y los meses van en castellano.

**Reglas.** El cambio no se aplica hasta pulsar **Aplicar**: así se puede elegir un rango sin recargar la tabla dos veces. Para filtros de Pecunia, ofrece presets ("Este mes", "Mes pasado").

**Teclado.** Las flechas mueven el día (y cambian de mes al salir), Enter elige, Escape cierra sin aplicar y devuelve el foco al botón.

**Presets sin fin.** En un selector de rango, un preset sin `end` ("Hoy") es un rango de un solo día y se puede aplicar.

**Detalles.** `today` decide qué día lleva el punto (por defecto, la fecha del sistema). Mientras eliges un rango, tras el primer clic el pie sigue mostrando el rango anterior hasta el segundo; el calendario ya marca el día. Los textos se pueden cambiar con `labels`.
