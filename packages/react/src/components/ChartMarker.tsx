import type { ReactNode } from "react";
import { type ChartMarkerType, MarkerBubble, MarkerLine } from "../internal/chart-marker.js";
import { cx } from "../internal/cx.js";

export type { ChartMarkerAt, ChartMarkerType } from "../internal/chart-marker.js";

export interface ChartMarkerProps {
	/** Valor de la burbuja: «1.218». */
	value: ReactNode;
	/** Segunda línea de la burbuja (la fecha); `minimal` no la lleva. */
	label?: ReactNode;
	/**
	 * `line` punto hueco y línea que se desvanece · `dash` punto lleno y línea de puntos · `minimal` línea lisa sin punto
	 * y burbuja solo con el valor.
	 * @default "line"
	 */
	type?: ChartMarkerType;
	/** Alto de la línea en px. @default 200 */
	height?: number;
	/** Color de la línea y del punto. @default "var(--utility-brand-600)" */
	color?: string;
	/**
	 * Con la burbuja encima.
	 * @default true
	 */
	tooltip?: boolean;
	className?: string;
}

/**
 * Marcador de gráfica (Figma `Chart marker`, `8100:193259`): una línea vertical con su punto y la burbuja con el valor.
 * Suelto, para gráficas propias; en `LineChart` y `BarChart`, con su prop `marker`. Es decorativo: el valor también va
 * en la burbuja, que se lee como texto.
 */
export function ChartMarker({
	value,
	label,
	type = "line",
	height = 200,
	color = "var(--utility-brand-600)",
	tooltip = true,
	className,
}: ChartMarkerProps) {
	return (
		<span className={cx("relative inline-flex w-3 shrink-0 flex-col items-center font-body", className)}>
			{tooltip ? (
				<MarkerBubble
					value={value}
					label={label}
					type={type}
					className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2"
				/>
			) : null}
			<svg
				width="12"
				height={height}
				viewBox={`0 0 12 ${height}`}
				aria-hidden="true"
				className="overflow-visible"
			>
				<MarkerLine
					x={6}
					top={type === "minimal" ? 0 : 6}
					bottom={height}
					type={type}
					color={color}
				/>
			</svg>
		</span>
	);
}
