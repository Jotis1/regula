// Vista previa de FilterBar. Va en su propio fichero: `FilterBar` lleva `DatePicker`, y en `navigation.tsx` pesaba en
// las páginas de Tabs y del resto de navegación.

import { FilterBar } from "@jotis-me/react";

export function FilterBarExample() {
	return (
		<FilterBar
			segments={[
				{ value: "t", label: "Todo" },
				{ value: "g", label: "Gastos" },
				{ value: "i", label: "Ingresos" },
			]}
			defaultSegment="t"
			search
			searchPlaceholder="Buscar movimientos"
			activeFilters={[{ label: "Categoría: Hogar" }, { label: "Importe > 50 €" }]}
			onRemoveFilter={() => {}}
			onClear={() => {}}
		/>
	);
}
