// Piezas del marcador de gráficas (Figma `Chart marker`, `8100:193259`): la línea con su punto, en SVG, y la burbuja
// con el valor. Las usan `ChartMarker` (suelto) y la prop `marker` de `LineChart` y `BarChart`.
import { type CSSProperties, type ReactNode, useId } from "react";
import { BUBBLE } from "./bubble.js";
import { cx } from "./cx.js";

export type ChartMarkerType = "line" | "dash" | "minimal";

/** La línea vertical de `top` a `bottom` en `x`, con el punto arriba (salvo `minimal`). Va dentro de un `<svg>`. */
export function MarkerLine({
	x,
	top,
	bottom,
	type,
	color,
}: {
	x: number;
	top: number;
	bottom: number;
	type: ChartMarkerType;
	color: string;
}) {
	const id = useId();
	// `line` y `dash` se desvanecen hacia abajo, como el Figma; `minimal` es una línea lisa
	const stroke = type === "minimal" ? color : `url(#${id})`;
	return (
		<g pointerEvents="none">
			{type === "minimal" ? null : (
				<defs>
					<linearGradient id={id} x1="0" y1={top} x2="0" y2={bottom} gradientUnits="userSpaceOnUse">
						<stop stopColor={color} />
						<stop offset="1" stopColor={color} stopOpacity="0" />
					</linearGradient>
				</defs>
			)}
			<line
				x1={x}
				x2={x}
				y1={type === "line" ? top + 6 : top}
				y2={bottom}
				stroke={stroke}
				strokeWidth={2}
				strokeLinecap="round"
				strokeDasharray={type === "dash" ? "0 6" : undefined}
			/>
			{type === "line" ? (
				<circle cx={x} cy={top} r={5} fill="var(--bg-primary)" stroke={color} strokeWidth={2} />
			) : type === "dash" ? (
				<circle cx={x} cy={top} r={3} fill={color} />
			) : null}
		</g>
	);
}

/** La burbuja oscura con el valor y, debajo, su etiqueta (la fecha); en `minimal`, solo el valor. */
export function MarkerBubble({
	value,
	label,
	type,
	className,
	style,
}: {
	value: ReactNode;
	label?: ReactNode;
	type: ChartMarkerType;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<span className={cx(BUBBLE, "pointer-events-none block px-3 py-2", className)} style={style}>
			<span className="block">{value}</span>
			{label && type !== "minimal" ? (
				<span className="mt-0.5 block font-medium text-tooltip-supporting-text">{label}</span>
			) : null}
		</span>
	);
}

/** Lo que aceptan `LineChart` y `BarChart` en `marker`. */
export interface ChartMarkerAt {
	/** Posición en el eje horizontal (el índice de su etiqueta). */
	index: number;
	/** En `LineChart`, la serie del punto marcado. @default 0 */
	series?: number;
	/** @default "line" */
	type?: ChartMarkerType;
	/** Valor de la burbuja; por defecto, el del punto (o el total de la barra) con `format`. */
	value?: ReactNode;
	/** Segunda línea de la burbuja; por defecto, la etiqueta del eje. */
	label?: ReactNode;
}

/**
 * El dibujo y la burbuja sobre un `<svg>` que se escala al ancho: la burbuja se coloca en porcentajes del `viewBox`
 * para seguir al punto a cualquier tamaño.
 */
export function MarkerOverlay({
	at,
	x,
	y,
	width,
	height,
	value,
	label,
}: {
	at: ChartMarkerAt;
	x: number;
	y: number;
	width: number;
	height: number;
	value: ReactNode;
	label?: ReactNode;
}) {
	const type = at.type ?? "line";
	return (
		<MarkerBubble
			value={at.value ?? value}
			label={at.label ?? label}
			type={type}
			className="absolute -translate-x-1/2 -translate-y-full"
			style={{ left: `${(x / width) * 100}%`, top: `calc(${(y / height) * 100}% - 14px)` }}
		/>
	);
}
