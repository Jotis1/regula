import { type CSSProperties, type ReactElement, useId } from "react";
import { cx } from "../internal/cx.js";

export type BackgroundPatternName = "grid" | "grid-dot" | "grid-check" | "circles" | "squares";
export type BackgroundPatternMask =
	| "radial"
	| "radial-down"
	| "radial-up"
	| "linear-down"
	| "linear-up"
	| "none";

export interface BackgroundPatternProps {
	/**
	 * `grid` rejilla · `grid-dot` puntos cada 32px · `grid-check` rejilla con casillas · `circles` y `squares`
	 * concéntricos.
	 * @default "grid"
	 */
	pattern?: BackgroundPatternName;
	/**
	 * Celda de 80/96/96px en las rejillas; lado de 336/480/768px en los concéntricos.
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg";
	/**
	 * Desvanecido hacia los bordes.
	 * @default "radial"
	 */
	mask?: BackgroundPatternMask;
	/** Ancho del área de la rejilla en px. @default 1536 */
	width?: number;
	/** Alto del área de la rejilla en px. @default 960 */
	height?: number;
	/** Reparto de las casillas en `grid-check`. @default 7 */
	seed?: number;
	className?: string;
	style?: CSSProperties;
}

const CONCENTRIC = { sm: 336, md: 480, lg: 768 } as const;
const GRID_CELL = { sm: 80, md: 96, lg: 96 } as const;

// Máscaras con negro y transparente: solo cuenta el alfa, no es un color de la interfaz.
const MASK: Record<Exclude<BackgroundPatternMask, "none">, string> = {
	radial: "radial-gradient(closest-side, black, transparent)",
	"radial-down": "radial-gradient(ellipse 60% 100% at 50% 0, black, transparent)",
	"radial-up": "radial-gradient(ellipse 60% 100% at 50% 100%, black, transparent)",
	"linear-down": "linear-gradient(black, transparent)",
	"linear-up": "linear-gradient(transparent, black)",
};

const LINE = {
	stroke: "var(--border-secondary)",
	strokeWidth: 1,
	fill: "none",
	vectorEffect: "non-scaling-stroke",
} as const;

/**
 * Fondo decorativo detrás de cabeceras, estados vacíos o tarjetas de bienvenida. Ocupa todo su contenedor
 * (`absolute inset-0`): el padre necesita `relative` y el contenido, su propio `relative` para quedar encima.
 * Lleva `aria-hidden`.
 */
export function BackgroundPattern({
	pattern = "grid",
	size = "md",
	mask = "radial",
	width = 1536,
	height = 960,
	seed = 7,
	className,
	style,
}: BackgroundPatternProps) {
	const pid = `jm-bgp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
	let w: number;
	let h: number;
	const kids: ReactElement[] = [];

	if (pattern === "circles" || pattern === "squares") {
		w = h = CONCENTRIC[size];
		const scale = w / 480;
		const c = w / 2;
		for (const d of [96, 160, 224, 288, 352, 416, 480]) {
			const r = (d * scale) / 2 - 0.5;
			kids.push(
				pattern === "circles" ? (
					<circle key={d} cx={c} cy={c} r={r} {...LINE} />
				) : (
					<rect key={d} x={c - r} y={c - r} width={r * 2} height={r * 2} rx={2} {...LINE} />
				),
			);
		}
	} else {
		const cell = pattern === "grid-dot" ? 32 : GRID_CELL[size];
		const cols = Math.ceil(width / cell);
		const rows = Math.ceil(height / cell);
		w = cols * cell;
		h = rows * cell;
		if (pattern === "grid-dot") {
			kids.push(
				<defs key="defs">
					<pattern id={pid} width={cell} height={cell} patternUnits="userSpaceOnUse">
						<circle cx={cell / 2} cy={cell / 2} r={1.5} fill="var(--utility-neutral-300)" />
					</pattern>
				</defs>,
				<rect key="dots" width={w} height={h} fill={`url(#${pid})`} />,
			);
		} else {
			if (pattern === "grid-check") {
				// Reparto determinista, cargado hacia el centro para que la máscara no lo esconda
				let s = seed;
				const rnd = () => {
					s = (s * 16807) % 2147483647;
					return s / 2147483647;
				};
				const n = Math.round(cols * rows * 0.09);
				for (let i = 0; i < n; i++) {
					const x = Math.floor(cols / 2 + ((rnd() + rnd() - 1) * cols) / 2);
					const y = Math.floor(rows / 2 + ((rnd() + rnd() - 1) * rows) / 2);
					kids.push(
						<rect
							key={`c${i}`}
							x={x * cell}
							y={y * cell}
							width={cell}
							height={cell}
							fill="var(--bg-secondary)"
						/>,
					);
				}
			}
			let d = "";
			for (let gx = 0; gx <= cols; gx++) d += `M${gx * cell + 0.5} 0V${h}`;
			for (let gy = 0; gy <= rows; gy++) d += `M0 ${gy * cell + 0.5}H${w}`;
			kids.push(<path key="grid" d={d} {...LINE} />);
		}
	}

	const maskImage = mask !== "none" ? MASK[mask] : undefined;
	return (
		<div
			aria-hidden="true"
			className={cx("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
			style={maskImage ? { maskImage, WebkitMaskImage: maskImage, ...style } : style}
		>
			<svg
				aria-hidden="true"
				width={w}
				height={h}
				viewBox={`0 0 ${w} ${h}`}
				className="absolute top-1/2 left-1/2 block max-w-none -translate-1/2"
			>
				{kids}
			</svg>
		</div>
	);
}
