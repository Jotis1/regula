import { Axes, type ChartSeries, nice, PAD, pointTitle, seriesColor } from "../internal/chart.js";
import { cx } from "../internal/cx.js";
import { ChartLegend } from "./ChartLegend.js";

export interface BarChartProps {
	/** Etiquetas del eje horizontal, una por barra. */
	labels: string[];
	/** Sin `color`, la paleta de series en orden (como `LineChart`). */
	series: ChartSeries[];
	/**
	 * Barras apiladas; `false` para agrupadas.
	 * @default true
	 */
	stacked?: boolean;
	/** Formato de los valores en el eje y en el título de cada barra. */
	format?: (v: number) => string;
	/** Leyenda encima. Por defecto, sí con dos series o más. */
	legend?: boolean;
	/** Proporción del dibujo (se escala al ancho del contenedor). @default 640 */
	width?: number;
	/** @default 240 */
	height?: number;
	/** Qué cuenta la gráfica, para lectores de pantalla. @default "Gráfica de barras" */
	"aria-label"?: string;
	className?: string;
}

/** Gráfica de barras, apiladas por defecto, para comparar cantidades por periodo o categoría. */
export function BarChart({
	labels,
	series,
	stacked = true,
	format,
	legend,
	width = 640,
	height = 240,
	className,
	...rest
}: BarChartProps) {
	const plot = { w: width, h: height, pad: PAD };
	const totals = labels.map((_, i) =>
		stacked
			? series.reduce((a, s) => a + (s.data[i] ?? 0), 0)
			: Math.max(0, ...series.map((s) => s.data[i] ?? 0)),
	);
	const top = nice(Math.max(0, ...totals));
	const iw = width - PAD.l - PAD.r;
	const ih = height - PAD.t - PAD.b;
	const slot = iw / labels.length;
	const bw = Math.min(32, slot * 0.6);
	return (
		<figure className={cx("m-0 flex flex-col gap-4 font-body", className)}>
			{(legend ?? series.length > 1) ? <ChartLegend series={series} /> : null}
			<svg
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={rest["aria-label"] ?? "Gráfica de barras"}
				className="h-auto w-full overflow-visible"
			>
				<Axes plot={plot} top={top} labels={labels} format={format} />
				{labels.map((label, i) => {
					let acc = 0;
					const x0 = PAD.l + slot * i + (slot - bw) / 2;
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: una barra por etiqueta, en orden
						<g key={i}>
							{series.map((s, si) => {
								const v = s.data[i] ?? 0;
								const bh = (ih * v) / top;
								const x = stacked ? x0 : x0 + si * (bw / series.length);
								const w = stacked ? bw : bw / series.length - 2;
								const y = PAD.t + ih - (stacked ? acc + bh : bh);
								if (stacked) acc += bh;
								return (
									<rect
										// biome-ignore lint/suspicious/noArrayIndexKey: el orden de las series es fijo
										key={si}
										x={x}
										y={y}
										width={w}
										height={Math.max(bh, 0)}
										rx={stacked && si < series.length - 1 ? 0 : 4}
										fill={seriesColor(si, s.color)}
									>
										<title>{pointTitle(s.name, label, format ? format(v) : v)}</title>
									</rect>
								);
							})}
						</g>
					);
				})}
			</svg>
		</figure>
	);
}
