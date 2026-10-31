import { seriesColor } from "../internal/chart.js";
import { cx } from "../internal/cx.js";

export interface ChartLegendProps {
	/** Series en el orden de la gráfica: sin `color`, el de su posición en la paleta. */
	series: { name?: string; color?: string }[];
	/** En columna (como junto a `PieChart`) en lugar de en fila. */
	vertical?: boolean;
	className?: string;
}

/** Leyenda de series con un punto de color y el nombre. */
export function ChartLegend({ series, vertical, className }: ChartLegendProps) {
	return (
		<ul
			className={cx(
				"m-0 flex list-none gap-x-3 gap-y-1 p-0 font-body",
				vertical ? "flex-col" : "flex-wrap",
				className,
			)}
		>
			{series.map((s, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: el orden de las series es fijo y los nombres pueden faltar
				<li key={i} className="inline-flex items-center gap-2 text-sm text-tertiary">
					<span
						aria-hidden="true"
						className="size-2 shrink-0 rounded-full"
						style={{ background: seriesColor(i, s.color) }}
					/>
					{s.name}
				</li>
			))}
		</ul>
	);
}
