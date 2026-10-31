import { Axes, type ChartSeries, nice, PAD, pointTitle, seriesColor } from "../internal/chart.js";
import { cx } from "../internal/cx.js";
import { ChartLegend } from "./ChartLegend.js";

export interface LineChartProps {
	/** Etiquetas del eje horizontal, una por punto. */
	labels: string[];
	/** Hasta 4 series. Sin `color`, la paleta de series en orden. */
	series: ChartSeries[];
	/** Formato de los valores en el eje y en el título de cada punto, como `(v) => formatCurrency(v)`. */
	format?: (v: number) => string;
	/**
	 * Relleno suave bajo la primera serie.
	 * @default true
	 */
	area?: boolean;
	/** Leyenda encima. Por defecto, sí con dos series o más. */
	legend?: boolean;
	/** Proporción del dibujo (se escala al ancho del contenedor). @default 640 */
	width?: number;
	/** @default 240 */
	height?: number;
	/** Qué cuenta la gráfica, para lectores de pantalla. @default "Gráfica de líneas" */
	"aria-label"?: string;
	className?: string;
}

/** Gráfica de líneas para la evolución de una o varias series en el tiempo. La escala empieza en cero. */
export function LineChart({
	labels,
	series,
	format,
	area = true,
	legend,
	width = 640,
	height = 240,
	className,
	...rest
}: LineChartProps) {
	const plot = { w: width, h: height, pad: PAD };
	const top = nice(Math.max(0, ...series.flatMap((s) => s.data)));
	const iw = width - PAD.l - PAD.r;
	const ih = height - PAD.t - PAD.b;
	const n = labels.length;
	const point = (v: number, i: number) =>
		[PAD.l + iw * ((i + 0.5) / n), PAD.t + ih * (1 - v / top)] as const;
	return (
		<figure className={cx("m-0 flex flex-col gap-4 font-body", className)}>
			{(legend ?? series.length > 1) ? <ChartLegend series={series} /> : null}
			<svg
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={rest["aria-label"] ?? "Gráfica de líneas"}
				className="h-auto w-full overflow-visible"
			>
				<Axes plot={plot} top={top} labels={labels} format={format} />
				{series.map((s, si) => {
					const pts = s.data.map(point);
					const c = seriesColor(si, s.color);
					const d = pts
						.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
						.join(" ");
					const first = pts[0];
					const last = pts[pts.length - 1];
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: el orden de las series es fijo
						<g key={si}>
							{si === 0 && area && first && last ? (
								<path
									d={`${d} L${last[0]} ${PAD.t + ih} L${first[0]} ${PAD.t + ih} Z`}
									fill={c}
									opacity={0.08}
								/>
							) : null}
							<path
								d={d}
								fill="none"
								stroke={c}
								strokeWidth={2}
								strokeLinejoin="round"
								strokeLinecap="round"
							/>
							{pts.map(([x, y], i) => (
								<circle
									// biome-ignore lint/suspicious/noArrayIndexKey: un punto por etiqueta, en orden
									key={i}
									cx={x}
									cy={y}
									r={3}
									fill="var(--bg-primary)"
									stroke={c}
									strokeWidth={2}
								>
									<title>
										{pointTitle(
											s.name,
											labels[i] ?? "",
											format ? format(s.data[i] ?? 0) : (s.data[i] ?? 0),
										)}
									</title>
								</circle>
							))}
						</g>
					);
				})}
			</svg>
		</figure>
	);
}
