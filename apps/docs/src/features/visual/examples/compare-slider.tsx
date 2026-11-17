// Ejemplo de CompareSlider: una misma pantalla en oscuro (abajo) y en claro (arriba), hecha con `dark-mode` y
// `light-mode` de @jotis-me/tokens. Los dos temas van en capas hermanas: un `dark-mode` dentro de un `light-mode` no está
// soportado, así que nunca se anida el oscuro dentro del claro.

import { CompareSlider } from "@jotis-me/react";
import { ExpensesScreen } from "../../../components/ExpensesScreen";

export function CompareSliderExample() {
	return (
		<div className="flex flex-col gap-6">
			<CompareSlider
				label="Tema de la pantalla"
				before={<ExpensesScreen mode="dark" />}
				after={<ExpensesScreen mode="light" />}
				beforeLabel="Oscuro"
				afterLabel="Claro"
				height={300}
			/>
			<CompareSlider
				label="Antes y después"
				before={<ExpensesScreen mode="dark" />}
				after={<ExpensesScreen mode="light" />}
				defaultValue={30}
				height={290}
			/>
		</div>
	);
}
