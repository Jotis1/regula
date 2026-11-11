import type { CSSProperties } from "react";
import { cx } from "../internal/cx.js";

export type RatingColor = "yellow" | "gray";
export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps {
	/** Valoración, de 0 a `max`. Cada estrella se rellena en pasos de 10 %: 4,5 son cuatro llenas y una a medias. */
	value: number;
	/**
	 * Número de estrellas (de 1 a 5).
	 * @default 5
	 */
	max?: number;
	/**
	 * Color del relleno: `yellow` (el amarillo de aviso) o `gray` (el del texto).
	 * @default "yellow"
	 */
	color?: RatingColor;
	/**
	 * Lado de cada estrella: `sm` 16 · `md` 20 · `lg` 24.
	 * @default "md"
	 */
	size?: RatingSize;
	/** Texto para lectores. @default «4,5 de 5» */
	label?: string;
	className?: string;
}

// La estrella del Figma (`Star icon`, `1232:9`), en una caja de 20
const STAR =
	"M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z";
const SIDE: Record<RatingSize, number> = { sm: 16, md: 20, lg: 24 };
const FILL: Record<RatingColor, string> = {
	yellow: "var(--fg-warning-secondary)",
	gray: "var(--fg-primary)",
};

/** «4,5 de 5»: el número con coma decimal, como se lee en castellano. */
export function ratingLabel(value: number, max = 5): string {
	return `${String(Math.round(value * 10) / 10).replace(".", ",")} de ${max}`;
}

/**
 * Valoración con estrellas (Figma `Star icon`, `1232:9`): cada una con relleno de 0 a 100 % en pasos de 10, en
 * amarillo o gris. Es una imagen con su valor: los lectores anuncian «4,5 de 5».
 */
export function Rating({ value, max = 5, color = "yellow", size = "md", label, className }: RatingProps) {
	const count = Math.max(1, Math.min(5, Math.round(max)));
	const v = Math.max(0, Math.min(count, value));
	const side = SIDE[size];
	return (
		<span
			role="img"
			aria-label={label ?? ratingLabel(v, count)}
			className={cx("inline-flex shrink-0", size === "sm" ? "gap-0.5" : "gap-1", className)}
		>
			{Array.from({ length: count }, (_, i) => {
				// Pasos de 10 %, como las once variantes del Figma
				const fill = Math.round(Math.max(0, Math.min(1, v - i)) * 10) * 10;
				const clip: CSSProperties | undefined =
					fill > 0 && fill < 100 ? { clipPath: `inset(0 ${100 - fill}% 0 0)` } : undefined;
				return (
					<svg
						// biome-ignore lint/suspicious/noArrayIndexKey: las estrellas no cambian de orden
						key={i}
						width={side}
						height={side}
						viewBox="0 0 20 20"
						aria-hidden="true"
						data-fill={fill}
						className="flex-none"
					>
						<path d={STAR} fill="var(--bg-tertiary)" />
						{fill > 0 ? <path d={STAR} fill={FILL[color]} style={clip} /> : null}
					</svg>
				);
			})}
		</span>
	);
}
