import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "line-simple" | "line-spinner" | "dot-circle";

export interface SpinnerProps {
	/** Diámetro: `sm` 32 · `md` 48 · `lg` 56 · `xl` 64. */
	size?: SpinnerSize;
	/**
	 * `line-simple` arco de un cuarto sobre su pista · `line-spinner` arco largo sin pista · `dot-circle` dieciséis
	 * puntos que se desvanecen.
	 * @default "line-simple"
	 */
	variant?: SpinnerVariant;
	/** Texto bajo el círculo. Por defecto, "Cargando…"; `false` lo deja solo para lectores de pantalla. */
	label?: ReactNode | false;
	className?: string;
}

const PX: Record<SpinnerSize, number> = { sm: 32, md: 48, lg: 56, xl: 64 };
/** Puntos del `dot-circle` y la opacidad del último: se desvanecen como el degradado cónico del Figma. */
const DOTS = 16;
const LAST_DOT_OPACITY = 0.08;
/** Arco del `line-spinner`: del Figma (nodo 1196:283), unos 216° de la circunferencia. */
const LONG_ARC = 0.6;

/** Indicador de carga circular para esperas de más de un segundo sin forma conocida. */
export function Spinner({ size = "md", variant = "line-simple", label, className }: SpinnerProps) {
	const px = PX[size];
	const stroke = px <= 32 ? 4 : 6;
	const r = (px - stroke) / 2;
	const c = px / 2;
	const circumference = 2 * Math.PI * r;
	return (
		<div
			role="status"
			aria-live="polite"
			className={cx("inline-flex flex-col items-center gap-4 font-body", className)}
		>
			{/* Con menos movimiento sigue girando, pero tres veces más despacio: indica que algo pasa */}
			<svg
				width={px}
				height={px}
				viewBox={`0 0 ${px} ${px}`}
				aria-hidden="true"
				className="animate-spin motion-reduce:animate-[spin_3s_linear_infinite]"
			>
				{variant === "dot-circle" ? (
					Array.from({ length: DOTS }, (_, i) => {
						// Empieza arriba a la izquierda, como el Figma, y sigue en el sentido del reloj
						const angle = ((225 + (i * 360) / DOTS) * Math.PI) / 180;
						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
								key={i}
								cx={c + r * Math.cos(angle)}
								cy={c + r * Math.sin(angle)}
								r={stroke / 2}
								opacity={1 - ((1 - LAST_DOT_OPACITY) * i) / (DOTS - 1)}
								className="fill-fg-brand-primary"
							/>
						);
					})
				) : (
					<>
						{variant === "line-simple" && (
							<circle
								cx={c}
								cy={c}
								r={r}
								fill="none"
								strokeWidth={stroke}
								className="stroke-(color:--bg-tertiary)"
							/>
						)}
						<circle
							cx={c}
							cy={c}
							r={r}
							fill="none"
							strokeWidth={stroke}
							strokeLinecap="round"
							strokeDasharray={`${circumference * (variant === "line-spinner" ? LONG_ARC : 0.25)} ${circumference}`}
							className="stroke-fg-brand-primary"
						/>
					</>
				)}
			</svg>
			{label === false ? (
				<span className="sr-only">{defaultStrings.loading}</span>
			) : (
				<span className="text-sm font-medium text-secondary">{label ?? defaultStrings.loading}</span>
			)}
		</div>
	);
}
