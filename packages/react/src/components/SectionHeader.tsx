import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";

export interface SectionHeaderProps {
	/** Título de la sección (`<h2>`): `text-lg` semibold, `text-md` en `sm`. */
	title: ReactNode;
	/** Una frase en `text-tertiary` bajo el título. */
	description?: ReactNode;
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/**
	 * Tamaño del título.
	 * @default "md"
	 */
	size?: "sm" | "md";
	/**
	 * Línea inferior en `border-secondary`.
	 * @default true
	 */
	divider?: boolean;
	/** Lo que va bajo el título, como unas `Tabs` o una búsqueda. */
	children?: ReactNode;
	className?: string;
}

/** Cabecera de una sección dentro de una página: título, descripción, acciones y línea. */
export function SectionHeader({
	title,
	description,
	actions,
	size = "md",
	divider = true,
	children,
	className,
}: SectionHeaderProps) {
	return (
		<div className={cx("flex flex-col gap-5 font-body", className)}>
			<div className="flex flex-wrap items-start gap-4">
				<div className="min-w-0 flex-1">
					<h2
						className={cx(
							"m-0 font-semibold text-primary",
							size === "sm" ? "text-md" : "text-lg",
						)}
					>
						{title}
					</h2>
					{description ? <p className="mt-0.5 mb-0 text-sm text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
			{children ?? null}
			{divider ? <Line /> : null}
		</div>
	);
}
