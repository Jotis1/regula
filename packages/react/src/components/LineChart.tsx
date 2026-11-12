import type { ReactNode } from "react";
import {
	Axes,
	type AxisTitles,
	type ChartLegendPosition,
	type ChartSeries,
	legendSide,
	nice,
	padFor,
	pointTitle,
	seriesColor,
} from "../internal/chart.js";
import { type ChartMarkerAt, MarkerLine, MarkerOverlay } from "../internal/chart-marker.js";
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
	/**
	 * Leyenda: `true` o `"top"` encima, `"right"` en columna a la derecha, `false` ninguna. Por defecto, encima con dos
	 * series o más.
	 */
	legend?: ChartLegendPosition;
	/** Títulos de los ejes: `y` va girado a la izquierda y `x` bajo las etiquetas, como `Axis labels` del Figma. */
	axisLabels?: AxisTitles;
	/** Proporción del dibujo (se escala al ancho del contenedor). @default 640 */
	width?: number;
	/** @default 240 */
	height?: number;
	/**
	 * Marcador (Figma `Chart marker`): línea vertical en una posición, con su punto y la burbuja del valor. Sin él, la
	 * gráfica es la de siempre.
	 */
	marker?: ChartMarkerAt;
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
	axisLabels,
	width = 640,
	height = 240,
	marker,
	className,
	...rest
}: LineChartProps) {
	const pad = padFor(axisLabels);
	const plot = { w: width, h: height, pad };
	const side = legendSide(legend, series.length);
	const top = nice(Math.max(0, ...series.flatMap((s) => s.data)));
	const iw = width - pad.l - pad.r;
	const ih = height - pad.t - pad.b;
	const n = labels.length;
	const point = (v: number, i: number) =>
		[pad.l + iw * ((i + 0.5) / n), pad.t + ih * (1 - v / top)] as const;
	const mi = marker ? Math.max(0, Math.min(n - 1, marker.index)) : 0;
	const ms = marker ? Math.max(0, Math.min(series.length - 1, marker.series ?? 0)) : 0;
	const mv = series[ms]?.data[mi] ?? 0;
	const mark = marker
		? (() => {
				const [x, y] = point(mv, mi);
				return {
					x,
					y,
					color: seriesColor(ms, series[ms]?.color) ?? "currentColor",
					value: format ? format(mv) : mv,
				};
			})()
		: null;
	const svgClass =
		side === "right" ? "h-auto min-w-0 flex-1 overflow-visible" : "h-auto w-full overflow-visible";
	// Con marcador, el svg va en una caja con la burbuja encima; sin él, el HTML de siempre
	const wrap = (svg: ReactNode) =>
		marker && mark ? (
			<div className={cx("relative", side === "right" ? "min-w-0 flex-1" : "w-full")}>
				{svg}
				<MarkerOverlay
					at={marker}
					x={mark.x}
					y={mark.y}
					width={width}
					height={height}
					value={mark.value}
					label={labels[mi]}
				/>
			</div>
		) : (
			svg
		);
	return (
		<figure
			className={cx(
				side === "right"
					? "m-0 flex flex-row items-start gap-6 font-body"
					: "m-0 flex flex-col gap-4 font-body",
				className,
			)}
		>
			{side === "top" ? <ChartLegend series={series} /> : null}
			{wrap(
				<svg
					viewBox={`0 0 ${width} ${height}`}
					role="img"
					aria-label={rest["aria-label"] ?? "Gráfica de líneas"}
					className={marker ? "block h-auto w-full overflow-visible" : svgClass}
				>
					<Axes plot={plot} top={top} labels={labels} format={format} titles={axisLabels} />
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
										d={`${d} L${last[0]} ${pad.t + ih} L${first[0]} ${pad.t + ih} Z`}
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
					{mark ? (
						<MarkerLine
							x={mark.x}
							top={mark.y}
							bottom={pad.t + ih}
							type={marker?.type ?? "line"}
							color={mark.color}
						/>
					) : null}
				</svg>,
			)}
			{side === "right" ? <ChartLegend vertical series={series} className="flex-none" /> : null}
		</figure>
	);
}
