import type { ReactNode } from "react";

export interface ChartSeries {
	/** Nombre en la leyenda y en el título de cada punto. */
	name?: string;
	data: number[];
	/** Color propio (cualquier color CSS). Por defecto, el de su posición en la paleta de series. */
	color?: string;
}

/** Paleta de series de la guía, en orden: la marca primero, en degradado. */
export const SERIES = [
	"var(--utility-brand-600)",
	"var(--utility-brand-400)",
	"var(--utility-brand-200)",
	"var(--utility-sky-500)",
	"var(--utility-pink-500)",
	"var(--utility-neutral-400)",
] as const;

export const seriesColor = (i: number, color?: string) => color ?? SERIES[i % SERIES.length];

/** Techo "redondo" de la escala: 1, 1,2, 1,5, 2, 2,5, 3, 4, 5, 6, 8 o 10 por su potencia de diez. */
export function nice(max: number): number {
	if (max <= 0) return 1;
	const e = 10 ** Math.floor(Math.log10(max));
	const f = max / e;
	for (const s of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (f <= s) return s * e;
	return 10 * e;
}

export interface Plot {
	w: number;
	h: number;
	pad: { t: number; r: number; b: number; l: number };
}

export const PAD = { t: 12, r: 12, b: 28, l: 44 };

/** Títulos de los ejes (`axisLabels`): el del eje vertical va girado a la izquierda y el del horizontal bajo las etiquetas. */
export interface AxisTitles {
	x?: string;
	y?: string;
}

/** El margen del dibujo, con sitio para los títulos de los ejes si los hay. */
export const padFor = (titles?: AxisTitles) => ({
	...PAD,
	l: PAD.l + (titles?.y ? 20 : 0),
	b: PAD.b + (titles?.x ? 20 : 0),
});

/** `legend`: `true` y `"top"` la ponen encima; `"right"`, en columna a la derecha; `false`, ninguna. */
export type ChartLegendPosition = boolean | "top" | "right";

export const legendSide = (
	legend: ChartLegendPosition | undefined,
	series: number,
): "top" | "right" | null =>
	legend === "right"
		? "right"
		: legend === "top" || legend === true || (legend === undefined && series > 1)
			? "top"
			: null;

const TITLE = { fontSize: 12, fontWeight: 500, fill: "var(--text-tertiary)" } as const;
const TICK = { fontSize: 12, fill: "var(--text-tertiary)" } as const;

/** Rejilla en `border-tertiary` (cinco líneas desde cero) y etiquetas de los ejes en `text-xs` `text-tertiary`. */
export function Axes({
	plot: { w, h, pad },
	top,
	labels,
	format,
	titles,
}: {
	plot: Plot;
	top: number;
	labels: string[];
	format?: (v: number) => string;
	titles?: AxisTitles;
}): ReactNode {
	return (
		<g>
			{[0, 0.25, 0.5, 0.75, 1].map((t) => {
				const y = pad.t + (h - pad.t - pad.b) * (1 - t);
				return (
					<g key={t}>
						<line
							x1={pad.l}
							x2={w - pad.r}
							y1={y}
							y2={y}
							stroke="var(--border-tertiary)"
							strokeWidth={1}
						/>
						<text x={pad.l - 8} y={y + 4} textAnchor="end" {...TICK}>
							{format ? format(top * t) : Math.round(top * t)}
						</text>
					</g>
				);
			})}
			{labels.map((l, i) => (
				<text
					// biome-ignore lint/suspicious/noArrayIndexKey: las etiquetas del eje pueden repetirse
					key={i}
					x={pad.l + (w - pad.l - pad.r) * (labels.length === 1 ? 0.5 : (i + 0.5) / labels.length)}
					y={h - pad.b + 22}
					textAnchor="middle"
					{...TICK}
				>
					{l}
				</text>
			))}
			{titles?.y ? (
				<text
					transform={`translate(12 ${pad.t + (h - pad.t - pad.b) / 2}) rotate(-90)`}
					textAnchor="middle"
					{...TITLE}
				>
					{titles.y}
				</text>
			) : null}
			{titles?.x ? (
				<text x={pad.l + (w - pad.l - pad.r) / 2} y={h - 4} textAnchor="middle" {...TITLE}>
					{titles.x}
				</text>
			) : null}
		</g>
	);
}

/** "Gastos · Oct: 1.284 €" para el `<title>` de cada punto o barra. */
export const pointTitle = (name: string | undefined, label: string, value: string | number) =>
	`${name ? `${name} · ` : ""}${label}: ${value}`;

/**
 * Los datos de una gráfica en una tabla solo para lectores de pantalla: la gráfica es una imagen con nombre y aquí van
 * sus valores, fila a fila (`ActivityGauge`, `RadarChart`).
 */
export function ChartTable({
	caption,
	columns,
	rows,
}: {
	caption: string;
	/** Cabeceras: la primera es la de las filas. */
	columns: string[];
	/** Cada fila: su cabecera y sus valores ya formateados. */
	rows: { label: string; values: (string | number)[] }[];
}): ReactNode {
	return (
		<table className="sr-only">
			<caption>{caption}</caption>
			<thead>
				<tr>
					{columns.map((c, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: las cabeceras pueden repetirse; el orden es fijo
						<th key={i} scope="col">
							{c}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((r, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: las filas pueden repetir nombre; el orden es fijo
					<tr key={i}>
						<th scope="row">{r.label}</th>
						{r.values.map((v, j) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: una celda por columna, en orden
							<td key={j}>{v}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
