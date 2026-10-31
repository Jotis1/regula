import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs.js";

export interface PageHeaderProps {
	/** Título de la página (`<h1>`), en Bricolage Grotesque 30/38 semibold. */
	title: ReactNode;
	/** Una frase en `text-tertiary` bajo el título. */
	description?: ReactNode;
	/** Ruta encima del título (`Breadcrumbs`). */
	breadcrumbs?: BreadcrumbItem[];
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/** Lo que va bajo el título, como unas `Tabs`. */
	children?: ReactNode;
	/**
	 * Línea inferior en `border-secondary`.
	 * @default true
	 */
	divider?: boolean;
	className?: string;
}

/** Cabecera de página de app: migas, título, descripción, acciones y línea inferior. */
export function PageHeader({
	title,
	description,
	breadcrumbs,
	actions,
	children,
	divider = true,
	className,
}: PageHeaderProps) {
	return (
		<header className={cx("flex flex-col gap-5 font-body", className)}>
			{breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="m-0 font-display text-display-sm font-semibold text-primary">{title}</h1>
					{description ? <p className="mt-1 mb-0 text-md text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
			{children ?? null}
			{divider ? <Line /> : null}
		</header>
	);
}
