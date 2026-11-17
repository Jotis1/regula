// A sample screen in the theme it is given: the month spending against its budget. CompareSlider shows it in dark
// and light side by side, as sibling layers: a `dark-mode` inside a `light-mode` is not supported.
import { Badge, Button, ProgressBar } from "@jotis-me/react";
import { TrendDown01 } from "@untitledui/icons";

/** The sample screen, in the theme that `mode` asks for. */
export function ExpensesScreen({ mode }: { mode: "light" | "dark" }) {
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
