import type { ReactNode } from "react";
import { ChartTable } from "../internal/chart.js";
import { cx } from "../internal/cx.js";
import { ChartLegend } from "./ChartLegend.js";

export type ActivityGaugeSize = "xs" | "sm" | "md" | "lg";

export interface ActivityGaugeRing {
	/** Nombre en la leyenda y en la tabla para lectores. */
	name: string;
	value: number;
	/** El total del anillo. @default 100 */
	max?: number;
	/** Color propio (cualquier color CSS). Por defecto, la marca en tres tonos, de fuera adentro. */
	color?: string;
}

export interface ActivityGaugeProps {
	/** Hasta tres anillos, de fuera adentro. */
	data: ActivityGaugeRing[];
	/**
	 * Lado: `xs` 160 · `sm` 200 · `md` 240 · `lg` 280.
	 * @default "md"
	 */
	size?: ActivityGaugeSize;
	/** Texto pequeño del centro: «Usuarios activos». */
	label?: ReactNode;
	/** Cifra del centro: «1.000». */
	value?: ReactNode;
	/**
	 * Leyenda: `"bottom"` debajo, `"right"` en columna a la derecha, `false` ninguna.
	 * @default false
	 */
	legend?: false | "bottom" | "right";
	/** Formato del valor de cada anillo en la tabla para lectores. Por defecto, el porcentaje: «72 %». */
	format?: (value: number, max: number) => string;
	/** Qué cuenta la gráfica, para lectores de pantalla. @default "Gráfica de actividad" */
	"aria-label"?: string;
	className?: string;
}

// Lado, radios de los tres anillos (en su eje) y grosor, de las cuatro medidas del Figma
const GEO: Record<ActivityGaugeSize, { box: number; r: number[]; w: number }> = {
	xs: { box: 160, r: [76, 64, 52], w: 8 },
	sm: { box: 200, r: [94, 78, 62], w: 12 },
	md: { box: 240, r: [112, 92, 72], w: 16 },
	lg: { box: 280, r: [131, 107, 83], w: 18 },
};
const LABEL: Record<ActivityGaugeSize, string> = {
	xs: "text-xs",
	sm: "text-xs",
	md: "text-sm",
	lg: "text-sm",
};
const VALUE: Record<ActivityGaugeSize, string> = {
	xs: "text-xl",
	sm: "font-display text-display-xs",
	md: "font-display text-display-sm",
	lg: "font-display text-display-md tracking-[-0.02em]",
};
const RINGS = ["var(--utility-brand-700)", "var(--utility-brand-600)", "var(--utility-brand-400)"] as const;
const ringColor = (i: number, color?: string) => color ?? RINGS[i % RINGS.length];

const percent = (v: number, max: number) => `${Math.round((v / (max || 1)) * 100)} %`;

/**
 * Anillos de actividad (Figma `Activity gauge`, `1078:155`): hasta tres anillos concéntricos con su avance, una cifra en
 * el centro y la leyenda debajo o a la derecha. Es una imagen con nombre y lleva sus valores en una tabla para lectores.
 */
export function ActivityGauge({
	data,
	size = "md",
	label,
	value,
	legend = false,
	format = percent,
	className,
	...rest
}: ActivityGaugeProps) {
	const { box, r: radii, w } = GEO[size];
	const c = box / 2;
	const name = rest["aria-label"] ?? "Gráfica de actividad";
	const rings = data.slice(0, 3);
	return (
		<figure
			className={cx(
				"m-0 inline-flex gap-4 font-body",
				legend === "right" ? "flex-row items-start" : "flex-col items-center",
				className,
			)}
		>
			<div className="relative shrink-0" style={{ width: box, height: box }}>
				<svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} role="img" aria-label={name}>
					{rings.map((ring, i) => {
						const r = radii[i] ?? 0;
						const length = 2 * Math.PI * r;
						const frac = Math.max(0, Math.min(1, ring.value / (ring.max ?? 100)));
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: un anillo por posición, de fuera adentro
							<g key={i} data-ring={i}>
								<circle
									cx={c}
									cy={c}
									r={r}
									fill="none"
									stroke="var(--bg-tertiary)"
									strokeWidth={w}
								/>
								{frac > 0 ? (
									<circle
										cx={c}
										cy={c}
										r={r}
										fill="none"
										stroke={ringColor(i, ring.color)}
										strokeWidth={w}
										strokeLinecap="round"
										strokeDasharray={`${(frac * length).toFixed(2)} ${length.toFixed(2)}`}
										transform={`rotate(-90 ${c} ${c})`}
									/>
								) : null}
							</g>
						);
					})}
				</svg>
				{label || value ? (
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
						{label ? (
							<span className={cx("font-medium text-tertiary", LABEL[size])}>{label}</span>
						) : null}
						{value ? (
							<span className={cx("font-semibold text-primary", VALUE[size])}>{value}</span>
						) : null}
					</div>
				) : null}
			</div>
			{legend ? (
				<ChartLegend
					vertical={legend === "right"}
					series={rings.map((ring, i) => ({ name: ring.name, color: ringColor(i, ring.color) }))}
					className={legend === "bottom" ? "justify-center" : undefined}
				/>
			) : null}
			<ChartTable
				caption={name}
				columns={["Serie", "Valor"]}
				rows={rings.map((ring) => ({
					label: ring.name,
					values: [format(ring.value, ring.max ?? 100)],
				}))}
			/>
		</figure>
	);
}
