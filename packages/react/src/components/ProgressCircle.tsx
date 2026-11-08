import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type ProgressCircleSize = "xxs" | "xs" | "sm" | "md" | "lg";
export type ProgressCircleShape = "circle" | "half";

export interface ProgressCircleProps {
	/** De 0 a 100. Fuera de ese rango se recorta. */
	value: number;
	/**
	 * Diámetro: `xxs` 64 · `xs` 160 · `sm` 200 · `md` 240 · `lg` 280. El semicírculo tiene el mismo ancho y algo más de la
	 * mitad de alto.
	 * @default "md"
	 */
	size?: ProgressCircleSize;
	/**
	 * Círculo entero (empieza arriba) o semicírculo (de izquierda a derecha).
	 * @default "circle"
	 */
	shape?: ProgressCircleShape;
	/** Qué progresa («Usuarios activos»): sobre el valor, o debajo en `xxs`. También da nombre a la barra. */
	label?: ReactNode;
	/** Texto del valor. Por defecto, el porcentaje redondeado («40%»). */
	valueText?: string;
	/** Nombre de la barra si no hay `label` o no es texto. */
	"aria-label"?: string;
	className?: string;
}

// Medidas del nodo 1084:2717 del Figma: el grosor del trazo es una décima del diámetro (6px en `xxs`)
const SIZE: Record<ProgressCircleSize, number> = { xxs: 64, xs: 160, sm: 200, md: 240, lg: 280 };
const STROKE: Record<ProgressCircleSize, number> = { xxs: 6, xs: 16, sm: 20, md: 24, lg: 28 };
// Cuánto baja el bloque «etiqueta y valor» del centro en el semicírculo (en `xxs` el valor va dentro, sin etiqueta)
const HALF_SHIFT: Record<ProgressCircleSize, number> = { xxs: -2.5, xs: 17, sm: 23, md: 30, lg: 33 };
const VALUE: Record<ProgressCircleSize, string> = {
	xxs: "text-sm font-semibold",
	xs: "text-display-xs",
	sm: "text-display-sm",
	md: "text-display-md tracking-[-0.02em]",
	lg: "text-display-lg tracking-[-0.02em]",
};
const LABEL: Record<ProgressCircleSize, string> = {
	xxs: "text-xs",
	xs: "text-xs",
	sm: "text-xs",
	md: "text-sm",
	lg: "text-sm",
};

/** Progreso en círculo o semicírculo con su valor y una etiqueta, de 64 a 280px. Se pinta en el servidor. */
export function ProgressCircle({
	value,
	size = "md",
	shape = "circle",
	label,
	valueText,
	"aria-label": ariaLabel,
	className,
}: ProgressCircleProps) {
	const v = Math.max(0, Math.min(100, value || 0));
	const d = SIZE[size];
	const sw = STROKE[size];
	const r = d / 2 - sw / 2;
	const half = shape === "half";
	const height = half ? d / 2 + sw / 2 : d;
	const text = valueText ?? `${Math.round(v)}%`;
	const name = ariaLabel ?? (typeof label === "string" ? label : undefined);
	const small = size === "xxs";
	// El círculo arranca arriba y gira a la derecha; el semicírculo, de izquierda a derecha por encima
	const track = half ? `M ${sw / 2} ${d / 2} A ${r} ${r} 0 0 1 ${d - sw / 2} ${d / 2}` : undefined;
	const draw = (stroke: string, dash?: string) => {
		const common = {
			fill: "none",
			strokeWidth: sw,
			strokeLinecap: "round" as const,
			pathLength: 100,
			strokeDasharray: dash,
			className: stroke,
		};
		return half ? (
			<path d={track} {...common} />
		) : (
			<circle cx={d / 2} cy={d / 2} r={r} transform={`rotate(-90 ${d / 2} ${d / 2})`} {...common} />
		);
	};

	return (
		<div
			role="progressbar"
			aria-valuenow={v}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext={valueText}
			aria-label={name}
			className={cx(
				"relative inline-flex font-body",
				small && "flex-col items-center gap-1",
				className,
			)}
		>
			<div className="relative flex-none" style={{ width: d, height }}>
				<svg
					width={d}
					height={height}
					viewBox={`0 0 ${d} ${height}`}
					aria-hidden="true"
					className="block"
				>
					{draw("stroke-[var(--border-secondary)]")}
					{v > 0 ? draw("stroke-[var(--fg-brand-primary)]", `${v} 100`) : null}
				</svg>
				<div
					aria-hidden="true"
					className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
					style={{ top: half ? `calc(50% + ${HALF_SHIFT[size]}px)` : "50%" }}
				>
					{!small && label != null ? (
						<span className={cx("whitespace-nowrap font-medium text-tertiary", LABEL[size])}>
							{label}
						</span>
					) : null}
					<span
						className={cx(
							"font-semibold text-primary",
							small ? "font-body" : "font-display",
							VALUE[size],
						)}
					>
						{text}
					</span>
				</div>
			</div>
			{small && label != null ? (
				<span
					aria-hidden="true"
					className={cx("whitespace-nowrap font-medium text-tertiary", LABEL[size])}
				>
					{label}
				</span>
			) : null}
		</div>
	);
}
