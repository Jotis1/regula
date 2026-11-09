import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { HelpIcon } from "./HelpIcon.js";

export type SectionLabelSize = "sm" | "md";

export interface SectionLabelProps {
	/** Nombre de la sección: «Equipo», «Notificaciones». */
	title: ReactNode;
	/** Una línea que explica qué se ajusta aquí. */
	description?: ReactNode;
	/** Marca la sección como obligatoria: asterisco de marca y «obligatorio» para lectores de pantalla. */
	required?: boolean;
	/** Texto del icono de ayuda junto al título. Sin él, no hay icono. */
	help?: ReactNode;
	/** Acciones bajo el texto, normalmente `Button` `link-gray` y `link-color` de tamaño `sm`. */
	actions?: ReactNode;
	/**
	 * `sm` título y apoyo de 14 · `md` de 16.
	 * @default "sm"
	 */
	size?: SectionLabelSize;
	/**
	 * Nivel del encabezado del título.
	 * @default "h3"
	 */
	as?: "h2" | "h3" | "h4";
	className?: string;
}

/**
 * Título de una sección de ajustes, con su texto de apoyo, y si hace falta la marca de obligatorio, un icono de ayuda
 * y acciones debajo. Va en la columna de la izquierda, junto a los campos de la sección.
 */
export function SectionLabel({
	title,
	description,
	required,
	help,
	actions,
	size = "sm",
	as: Heading = "h3",
	className,
}: SectionLabelProps) {
	const md = size === "md";
	return (
		<div className={cx("flex flex-col items-start gap-3 font-body", className)}>
			<div className="flex flex-col">
				<div className={cx("flex items-center", md ? "gap-1" : "gap-0.5")}>
					<Heading className={cx("m-0 font-semibold text-secondary", md ? "text-md" : "text-sm")}>
						{title}
						{required ? (
							<>
								<span
									aria-hidden="true"
									className={cx("text-sm text-brand-tertiary", md ? "ml-1" : "ml-0.5")}
								>
									*
								</span>
								<span className="sr-only"> ({defaultStrings.required})</span>
							</>
						) : null}
					</Heading>
					{help ? (
						<HelpIcon
							title={help}
							label={typeof title === "string" ? defaultStrings.help(title) : undefined}
							className="ml-0.5"
						/>
					) : null}
				</div>
				{description ? (
					<p className={cx("m-0 text-tertiary", md ? "text-md" : "text-sm")}>{description}</p>
				) : null}
			</div>
			{actions ? <div className="flex items-start gap-2">{actions}</div> : null}
		</div>
	);
}
