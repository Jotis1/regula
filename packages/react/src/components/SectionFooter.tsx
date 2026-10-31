import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";

export interface SectionFooterProps {
	/** A la izquierda: un enlace, un `ButtonGroup`… */
	start?: ReactNode;
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/** Añade el padding de tarjeta (24px a los lados, 16px abajo). */
	card?: boolean;
	className?: string;
}

/** Pie de sección o de tarjeta con línea superior: un enlace o grupo a la izquierda y las acciones a la derecha. */
export function SectionFooter({ start, actions, card, className }: SectionFooterProps) {
	return (
		<div className={cx("flex flex-col gap-4 font-body", className)}>
			<Line />
			<div className={cx("flex flex-wrap items-center gap-4", card && "px-6 pb-4")}>
				{start ?? null}
				<div className="ml-auto flex flex-wrap items-center gap-3">{actions ?? null}</div>
			</div>
		</div>
	);
}
