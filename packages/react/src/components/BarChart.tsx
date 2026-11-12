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
	axisLabels,
	width = 640,
	height = 240,
	marker,
	className,
	...rest
}: BarChartProps) {
	const pad = padFor(axisLabels);
	const plot = { w: width, h: height, pad };
	const side = legendSide(legend, series.length);
	const totals = labels.map((_, i) =>
		stacked
			? series.reduce((a, s) => a + (s.data[i] ?? 0), 0)
			: Math.max(0, ...series.map((s) => s.data[i] ?? 0)),
	);
	const top = nice(Math.max(0, ...totals));
	const iw = width - pad.l - pad.r;
	const ih = height - pad.t - pad.b;
	const slot = iw / labels.length;
	const bw = Math.min(32, slot * 0.6);
	const mi = marker ? Math.max(0, Math.min(labels.length - 1, marker.index)) : 0;
	const mv = totals[mi] ?? 0;
	const mark = marker
		? {
				x: pad.l + slot * mi + slot / 2,
				y: pad.t + ih - (ih * mv) / top,
				color:
					seriesColor(
						Math.max(0, Math.min(series.length - 1, marker.series ?? 0)),
						series[marker.series ?? 0]?.color,
					) ?? "currentColor",
				value: format ? format(mv) : mv,
			}
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
					aria-label={rest["aria-label"] ?? "Gráfica de barras"}
					className={marker ? "block h-auto w-full overflow-visible" : svgClass}
				>
					<Axes plot={plot} top={top} labels={labels} format={format} titles={axisLabels} />
					{labels.map((label, i) => {
						let acc = 0;
						const x0 = pad.l + slot * i + (slot - bw) / 2;
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: una barra por etiqueta, en orden
							<g key={i}>
								{series.map((s, si) => {
									const v = s.data[i] ?? 0;
									const bh = (ih * v) / top;
									const x = stacked ? x0 : x0 + si * (bw / series.length);
									const w = stacked ? bw : bw / series.length - 2;
									const y = pad.t + ih - (stacked ? acc + bh : bh);
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
