import { cx } from "../internal/cx.js";

export interface ProgressBarProps {
	/** De 0 a 100. */
	value: number;
	/** Porcentaje a la derecha (por defecto), debajo o sin texto. */
	label?: "right" | "bottom" | false;
	/** Qué progresa: "Presupuesto usado", "Subida". */
	"aria-label"?: string;
	className?: string;
}

/** Barra de progreso de 8px con el porcentaje a la derecha o debajo. */
export function ProgressBar({
	value,
	label = "right",
	"aria-label": ariaLabel,
	className,
}: ProgressBarProps) {
	const v = Math.max(0, Math.min(100, value || 0));
	const bottom = label === "bottom";
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
				{/* Un mínimo del 3 % para que el 0 siga pareciendo una barra */}
				<div
					className="h-full rounded-full bg-fg-brand-primary"
					style={{ width: `${Math.max(v, 3)}%` }}
				/>
			</div>
			{label ? <span>{v}%</span> : null}
		</div>
	);
}
