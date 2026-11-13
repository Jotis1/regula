// Ejemplo de CompareSlider: una misma pantalla en oscuro (abajo) y en claro (arriba), hecha con `dark-mode` y
// `light-mode` de @jotis-me/tokens. Los dos temas van en capas hermanas: un `dark-mode` dentro de un `light-mode` no está
// soportado, así que nunca se anida el oscuro dentro del claro.

import { Badge, Button, CompareSlider, ProgressBar } from "@jotis-me/react";
import { TrendDown01 } from "@untitledui/icons";

/** La pantalla de ejemplo: gasto del mes con su presupuesto, en el tema que se pida. */
export function PantallaGastos({ mode }: { mode: "light" | "dark" }) {
	return (
		<div
			className={`${mode}-mode flex h-full flex-col justify-center gap-4 bg-primary p-6 font-body text-primary`}
		>
			<div className="flex items-center justify-between gap-3">
				<span className="text-sm font-medium text-tertiary">Gasto de octubre</span>
				<Badge color="success" icon={TrendDown01}>
					6 % menos
				</Badge>
			</div>
			<p className="font-display text-display-md font-semibold text-primary">1.284,50 €</p>
			<ProgressBar value={62} aria-label="Presupuesto usado" />
			<div className="flex gap-3">
				<Button size="sm">Ver detalle</Button>
				<Button size="sm" hierarchy="secondary">
					Exportar
				</Button>
			</div>
		</div>
	);
}

export function CompareSliderExample() {
	return (
		<div className="flex flex-col gap-6">
			<CompareSlider
				label="Tema de la pantalla"
				before={<PantallaGastos mode="dark" />}
				after={<PantallaGastos mode="light" />}
				beforeLabel="Oscuro"
				afterLabel="Claro"
				height={300}
			/>
			<CompareSlider
				label="Antes y después"
				before={<PantallaGastos mode="dark" />}
				after={<PantallaGastos mode="light" />}
				defaultValue={30}
				height={290}
			/>
		</div>
	);
}
