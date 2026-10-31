Selector de una fecha o de un rango, con presets opcionales y botones de aplicar y cancelar.

**Props.** `range` (rango en lugar de una fecha), `defaultValue` ({`start`, `end`}), `onApply({start, end})`, `presets` [{`label`, `start`, `end`?}], `placeholder`, `open` / `defaultOpen`, `inline` (pinta el panel sin botón), `today`.

**Visual.** Disparador: botón secundario `sm` con icono de calendario. Panel `bg-primary`, `radius-2xl`, `shadow-xl`; presets a la izquierda (152px); celdas redondas de 40px, seleccionada `bg-brand-solid` con texto blanco, días intermedios `bg-secondary_hover`, hoy con punto `fg-brand-primary`. La semana empieza en lunes y los meses van en castellano.

**Reglas.** El cambio no se aplica hasta pulsar **Aplicar**: así se puede elegir un rango sin recargar la tabla dos veces. Para filtros de Pecunia, ofrece presets ("Este mes", "Mes pasado").
