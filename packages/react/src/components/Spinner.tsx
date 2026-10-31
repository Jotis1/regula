import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
	/** Diámetro: `sm` 32 · `md` 48 · `lg` 56 · `xl` 64. */
	size?: SpinnerSize;
	/** Texto bajo el círculo. Por defecto, "Cargando…"; `false` lo deja solo para lectores de pantalla. */
	label?: ReactNode | false;
	className?: string;
}

const PX: Record<SpinnerSize, number> = { sm: 32, md: 48, lg: 56, xl: 64 };

/** Indicador de carga circular para esperas de más de un segundo sin forma conocida. */
export function Spinner({ size = "md", label, className }: SpinnerProps) {
	const px = PX[size];
	const stroke = px <= 32 ? 4 : 6;
	const r = (px - stroke) / 2;
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
				<circle
					cx={px / 2}
					cy={px / 2}
					r={r}
					fill="none"
					strokeWidth={stroke}
					className="stroke-(color:--bg-tertiary)"
				/>
				<circle
					cx={px / 2}
					cy={px / 2}
					r={r}
					fill="none"
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={`${circumference * 0.25} ${circumference}`}
					className="stroke-fg-brand-primary"
				/>
			</svg>
			{label === false ? (
				<span className="sr-only">{defaultStrings.loading}</span>
			) : (
				<span className="text-sm font-medium text-secondary">{label ?? defaultStrings.loading}</span>
			)}
		</div>
	);
}
