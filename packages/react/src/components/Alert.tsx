import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import type { StatusColor } from "./Badge.js";
import { CloseButton } from "./CloseButton.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import type { IconName } from "./Icon.js";

export interface AlertProps {
	/**
	 * El color va solo en el icono: el texto sigue en `text-secondary` / `text-tertiary`.
	 * @default "gray"
	 */
	color?: StatusColor;
	title: ReactNode;
	description?: ReactNode;
	/** Botones `link-gray` + `link-color`. */
	actions?: ReactNode;
	/** Muestra la X para descartarlo. */
	onClose?: () => void;
	/** Nombre de la X. @default "Descartar" */
	closeLabel?: string;
	/** Icono propio. Por defecto, uno según el color (`alert-circle` en error, `check-circle` en éxito…). */
	icon?: IconName;
	/**
	 * `floating`: tarjeta con borde y radio. `full`: a todo el ancho, sin radio y con línea inferior.
	 * @default "floating"
	 */
	variant?: "floating" | "full";
	className?: string;
}

const ICON: Record<StatusColor, IconName> = {
	gray: "info-circle",
	brand: "info-circle",
	error: "alert-circle",
	warning: "alert-triangle",
	success: "check-circle",
};

/** Clases y contenido comunes a Alert y Notification. */
export function alertBody({
	color = "gray",
	title,
	description,
	actions,
	onClose,
	closeLabel,
	icon,
}: AlertProps) {
	return (
		<>
			<FeaturedIcon icon={icon ?? ICON[color]} color={color} size="md" variant="outline" />
			<div className="flex flex-1 flex-col gap-3 pr-8">
				<div>
					<div className="text-sm font-semibold text-secondary">{title}</div>
					{description ? <div className="mt-1 text-sm text-tertiary">{description}</div> : null}
				</div>
				{actions ? <div className="flex gap-3">{actions}</div> : null}
			</div>
			{onClose ? (
				<CloseButton
					label={closeLabel ?? defaultStrings.dismiss}
					onClick={onClose}
					className="absolute top-2 right-2"
				/>
			) : null}
		</>
	);
}

export const ALERT_BASE = "relative flex gap-4 p-4 font-body bg-primary_alt";

/**
 * Aviso en la página sobre algo que afecta a lo que el usuario está viendo.
 * Los errores se anuncian como `alert`; el resto, como `status`.
 */
export function Alert(props: AlertProps) {
	const { color = "gray", variant = "floating", className } = props;
	return (
		<div
			role={color === "error" ? "alert" : "status"}
			className={cx(
				ALERT_BASE,
				variant === "full"
					? "rounded-none shadow-[inset_0_-1px_0_var(--border-primary)]"
					: "rounded-xl shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)]",
				className,
			)}
		>
			{alertBody(props)}
		</div>
	);
}
