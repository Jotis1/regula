import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import type { IconName } from "./Icon.js";

export interface EmptyStateProps {
	/**
	 * Icono destacado (`FeaturedIcon` modern gris de 48px).
	 * @default "search-lg"
	 */
	icon?: IconName;
	/** Qué pasa: "Sin resultados", "Aún no hay gastos". */
	title: ReactNode;
	/** Por qué está vacío y qué hacer. Nada de "¡Ups!". */
	description?: ReactNode;
	/** La siguiente acción: normalmente un `Button` secundario y uno primario. */
	actions?: ReactNode;
	className?: string;
}

/** Lo que se ve cuando una lista, tabla o búsqueda no tiene contenido: qué pasa y qué hacer. */
export function EmptyState({ icon = "search-lg", title, description, actions, className }: EmptyStateProps) {
	return (
		<div className={cx("flex flex-col items-center gap-4 px-4 py-8 text-center font-body", className)}>
			<FeaturedIcon icon={icon} color="gray" size="lg" variant="modern" />
			<div>
				<h3 className="m-0 text-md font-semibold text-primary">{title}</h3>
				{description ? (
					<p className="mt-1 mb-0 max-w-[352px] text-sm text-tertiary">{description}</p>
				) : null}
			</div>
			{actions ? (
				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">{actions}</div>
			) : null}
		</div>
	);
}
