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

const TICK = { fontSize: 12, fill: "var(--text-tertiary)" } as const;

/** Rejilla en `border-tertiary` (cinco líneas desde cero) y etiquetas de los ejes en `text-xs` `text-tertiary`. */
export function Axes({
	plot: { w, h, pad },
	top,
	labels,
	format,
}: {
	plot: Plot;
	top: number;
	labels: string[];
	format?: (v: number) => string;
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
					y={h - 6}
					textAnchor="middle"
					{...TICK}
				>
					{l}
				</text>
			))}
		</g>
	);
}

/** "Gastos · Oct: 1.284 €" para el `<title>` de cada punto o barra. */
export const pointTitle = (name: string | undefined, label: string, value: string | number) =>
	`${name ? `${name} · ` : ""}${label}: ${value}`;
