import { cx } from "../internal/cx.js";

export interface ProgressBarProps {
	/** De 0 a 100. */
	value: number;
	/**
	 * Porcentaje a la derecha (por defecto), debajo o sin texto. `top-floating` y `bottom-floating` lo ponen en una
	 * burbuja que sigue el final de la barra, encima o debajo.
	 */
	label?: "right" | "bottom" | "top-floating" | "bottom-floating" | false;
	/** Qué progresa: "Presupuesto usado", "Subida". */
	"aria-label"?: string;
	className?: string;
}

/** Barra de progreso de 8px con el porcentaje a la derecha, debajo o en una burbuja flotante. */
export function ProgressBar({
	value,
	label = "right",
	"aria-label": ariaLabel,
	className,
}: ProgressBarProps) {
	const v = Math.max(0, Math.min(100, value || 0));
	const bottom = label === "bottom";
	const floating = label === "top-floating" || label === "bottom-floating";
	// Un mínimo del 3 % para que el 0 siga pareciendo una barra
	const width = `${Math.max(v, 3)}%`;

	if (floating) {
		const top = label === "top-floating";
		return (
			// La burbuja sobresale de la barra: el hueco que ocupa se reserva con relleno para no pisar lo de al lado
			<div className={cx("w-full font-body", top ? "pt-[42px]" : "pb-[38px]", className)}>
				<div
					role="progressbar"
					aria-valuenow={v}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={ariaLabel}
					className="relative h-2 w-full rounded-full bg-quaternary"
				>
					<div className="h-full rounded-full bg-fg-brand-primary" style={{ width }} />
					{/* Decorativa: el valor ya lo dice `aria-valuenow` */}
					<span
						aria-hidden="true"
						className={cx(
							"absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-primary_alt px-3 py-2 text-xs font-semibold leading-[18px] text-secondary shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
							top ? "bottom-[calc(100%+12px)]" : "top-4",
						)}
						style={{ left: width }}
					>
						{v}%
					</span>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cx(
				"flex items-center gap-3 font-body text-sm font-medium text-secondary",
				bottom && "flex-col items-end gap-2",
				className,
			)}
		>
			<div
				role="progressbar"
				aria-valuenow={v}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={ariaLabel}
				className={cx(
					"h-2 w-full overflow-hidden rounded-full bg-quaternary",
					bottom ? "flex-none" : "flex-1",
				)}
			>
				<div className="h-full rounded-full bg-fg-brand-primary" style={{ width }} />
			</div>
			{label ? <span>{v}%</span> : null}
		</div>
	);
}
