import type { ReactNode } from "react";
import { seriesColor } from "../internal/chart.js";
import { cx } from "../internal/cx.js";
import { ChartLegend } from "./ChartLegend.js";

export interface PieChartSlice {
	name: string;
	value: number;
	/** Sin `color`, la paleta de series en orden. */
	color?: string;
}

export interface PieChartProps {
	/** Cinco porciones como mucho: agrupa el resto en "Otros". */
	data: PieChartSlice[];
	/** Lado en px. @default 200 */
	size?: number;
	/**
	 * Hueco del dónut, de 0 (tarta) a 0,9.
	 * @default 0.6
	 */
	hole?: number;
	/** Texto en el hueco, como el total. */
	center?: ReactNode;
	/** Formato del valor en el título de cada porción. */
	format?: (v: number) => string;
	/**
	 * Leyenda a la derecha: el color solo no basta.
	 * @default true
	 */
	legend?: boolean;
	/** Qué cuenta la gráfica, para lectores de pantalla. @default "Gráfica circular" */
	"aria-label"?: string;
	className?: string;
}

/** Gráfica circular o de dónut para el reparto de un total. */
export function PieChart({
	data,
	size = 200,
	hole = 0.6,
	center,
	format,
	legend = true,
	className,
	...rest
}: PieChartProps) {
	const r = size / 2;
	const total = data.reduce((a, d) => a + d.value, 0) || 1;
	const arc = (a: number, b: number) => {
		const ri = r * hole;
		const large = b - a > Math.PI ? 1 : 0;
		const { cos, sin } = Math;
		const outer = `M${r + r * cos(a)} ${r + r * sin(a)} A${r} ${r} 0 ${large} 1 ${r + r * cos(b)} ${r + r * sin(b)}`;
		return ri
			? `${outer} L${r + ri * cos(b)} ${r + ri * sin(b)} A${ri} ${ri} 0 ${large} 0 ${r + ri * cos(a)} ${r + ri * sin(a)} Z`
			: `${outer} L${r} ${r} Z`;
	};
	let a0 = -Math.PI / 2;
	return (
		<figure className={cx("m-0 flex flex-row items-center gap-4 font-body", className)}>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				role="img"
				aria-label={rest["aria-label"] ?? "Gráfica circular"}
				className="flex-none overflow-visible"
			>
				{data.map((d, i) => {
					const step = (2 * Math.PI * d.value) / total;
					const a = a0;
					// Un hueco de 0,02 rad entre porciones
					const b = a0 + step - (data.length > 1 ? 0.02 : 0);
					a0 += step;
					const color = seriesColor(i, d.color);
					if (data.length === 1)
						return (
							<circle
								key={d.name}
								cx={r}
								cy={r}
								r={(r * (1 + hole)) / 2}
								fill="none"
								stroke={color}
								strokeWidth={r * (1 - hole)}
							>
								<title>{`${d.name}: ${format ? format(d.value) : d.value}`}</title>
							</circle>
						);
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: los nombres pueden repetirse; el orden es fijo
						<path key={i} d={arc(a, b)} fill={color}>
							<title>{`${d.name}: ${format ? format(d.value) : d.value}`}</title>
						</path>
					);
				})}
				{center ? (
					<text
						x={r}
						y={r + 8}
						textAnchor="middle"
						fontSize={24}
						fontWeight={600}
						className="font-display"
						fill="var(--text-primary)"
					>
						{center}
					</text>
				) : null}
			</svg>
			{legend ? <ChartLegend vertical series={data} /> : null}
		</figure>
	);
}
