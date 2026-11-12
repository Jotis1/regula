import { type ChartSeries, ChartTable, nice, SERIES } from "../internal/chart.js";
import { cx } from "../internal/cx.js";
import { ChartLegend } from "./ChartLegend.js";

export interface RadarChartProps {
	/** Los ejes, en el sentido de las agujas del reloj desde arriba: «Lun», «Mar»… */
	axes: string[];
	/** Hasta cinco series, con un valor por eje. Sin `color`, marca, cielo y rosa, como el Figma. */
	series: ChartSeries[];
	/** Valor del borde exterior. Por defecto, un techo redondo del mayor valor. */
	max?: number;
	/**
	 * Polígonos de la rejilla, con su valor en una pastilla sobre el eje de arriba.
	 * @default 5
	 */
	levels?: number;
	/**
	 * Leyenda: `"bottom"` debajo, `"right"` en columna a la derecha, `false` ninguna. Por defecto, debajo con dos series
	 * o más.
	 */
	legend?: false | "bottom" | "right";
	/** Formato de los valores en las pastillas y en la tabla para lectores. */
	format?: (v: number) => string;
	/** Qué cuenta la gráfica, para lectores de pantalla. @default "Gráfica de radar" */
	"aria-label"?: string;
	className?: string;
}

// El lienzo del Figma (`_Radar chart`): 392 × 372, centro a 7 px por debajo de la mitad y 152 de radio
const W = 392;
const H = 372;
const CX = W / 2;
const CY = H / 2 + 7;
const R = 152;
const ORDER = [SERIES[0], SERIES[3], SERIES[4], SERIES[1], SERIES[5]];
const colorOf = (i: number, color?: string) => color ?? ORDER[i % ORDER.length];

const at = (i: number, n: number, r: number) => {
	const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
	return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
};
const ring = (n: number, r: number) =>
	Array.from({ length: n }, (_, i) =>
		at(i, n, r)
			.map((v) => v.toFixed(1))
			.join(","),
	).join(" ");

/**
 * Gráfica de radar (Figma `Radar chart`, `1084:7362`): una serie por polígono sobre ejes que salen del centro, con la
 * rejilla y su escala. Es una imagen con nombre y lleva sus valores en una tabla para lectores.
 */
export function RadarChart({
	axes,
	series,
	max,
	levels = 5,
	legend,
	format,
	className,
	...rest
}: RadarChartProps) {
	const n = axes.length;
	const top = max ?? nice(Math.max(0, ...series.flatMap((s) => s.data)));
	const name = rest["aria-label"] ?? "Gráfica de radar";
	const side = legend === undefined ? (series.length > 1 ? "bottom" : false) : legend;
	const fmt = (v: number) => (format ? format(v) : String(Math.round(v)));
	return (
		<figure
			className={cx(
				"m-0 flex gap-4 font-body",
				side === "right" ? "flex-row items-start" : "flex-col items-center",
				className,
			)}
		>
			<svg
				viewBox={`0 0 ${W} ${H}`}
				role="img"
				aria-label={name}
				className="h-auto w-full max-w-[392px] min-w-0 flex-1 overflow-visible"
			>
				{Array.from({ length: levels }, (_, k) => (
					<polygon
						// biome-ignore lint/suspicious/noArrayIndexKey: un polígono por nivel, en orden
						key={k}
						points={ring(n, (R * (k + 1)) / levels)}
						fill="none"
						stroke="var(--border-tertiary)"
						strokeWidth={1}
					/>
				))}
				{axes.map((label, i) => {
					const [x, y] = at(i, n, R);
					const [lx, ly] = at(i, n, R + 18);
					const cos = (lx - CX) / (R + 18);
					const sin = (ly - CY) / (R + 18);
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: los ejes pueden repetir nombre; el orden es fijo
						<g key={i}>
							<line
								x1={CX}
								y1={CY}
								x2={x}
								y2={y}
								stroke="var(--border-tertiary)"
								strokeWidth={1}
							/>
							<text
								x={lx}
								y={ly + 4 + sin * 6}
								textAnchor={Math.abs(cos) < 0.15 ? "middle" : cos > 0 ? "start" : "end"}
								fontSize={14}
								fontWeight={500}
								fill="var(--text-tertiary)"
							>
								{label}
							</text>
						</g>
					);
				})}
				{Array.from({ length: levels }, (_, k) => {
					const v = (top * (levels - k)) / levels;
					const text = fmt(v);
					const w = text.length * 7 + 18;
					const y = CY - (R * (levels - k)) / levels;
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: una pastilla por nivel, en orden
						<g key={k}>
							<rect
								x={CX - w / 2}
								y={y - 10}
								width={w}
								height={22}
								rx={11}
								fill="var(--utility-neutral-50)"
								stroke="var(--border-secondary_alt)"
							/>
							<text
								x={CX}
								y={y + 5}
								textAnchor="middle"
								fontSize={12}
								fontWeight={500}
								fill="var(--utility-neutral-700)"
							>
								{text}
							</text>
						</g>
					);
				})}
				{series.map((s, si) => {
					const c = colorOf(si, s.color);
					const pts = axes
						.map((_, i) =>
							at(i, n, (R * Math.max(0, Math.min(top, s.data[i] ?? 0))) / (top || 1))
								.map((v) => v.toFixed(1))
								.join(","),
						)
						.join(" ");
					return (
						<polygon
							// biome-ignore lint/suspicious/noArrayIndexKey: el orden de las series es fijo
							key={si}
							points={pts}
							fill={c}
							fillOpacity={0.16}
							stroke={c}
							strokeWidth={2}
							strokeLinejoin="round"
						>
							{s.name ? <title>{s.name}</title> : null}
						</polygon>
					);
				})}
			</svg>
			{side ? (
				<ChartLegend
					vertical={side === "right"}
					series={series.map((s, i) => ({ name: s.name, color: colorOf(i, s.color) }))}
					className={side === "bottom" ? "justify-center" : "flex-none"}
				/>
			) : null}
			<ChartTable
				caption={name}
				columns={["Eje", ...series.map((s, i) => s.name ?? `Serie ${i + 1}`)]}
				rows={axes.map((label, i) => ({ label, values: series.map((s) => fmt(s.data[i] ?? 0)) }))}
			/>
		</figure>
	);
}
