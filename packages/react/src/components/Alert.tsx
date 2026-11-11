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
	icon?: IconName | ReactNode;
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

/** Piezas que solo usa `Notification`: lo que va en el sitio del icono, la hora junto al título y lo que va bajo el texto. */
export interface AlertBodyExtras {
	lead?: ReactNode;
	time?: ReactNode;
	extra?: ReactNode;
}

/** Clases y contenido comunes a Alert y Notification. */
export function alertBody({
	color = "gray",
	title,
	description,
	actions,
	onClose,
	closeLabel,
	icon,
	lead,
	time,
	extra,
}: AlertProps & AlertBodyExtras) {
	return (
		<>
			{lead === undefined ? (
				<FeaturedIcon icon={icon ?? ICON[color]} color={color} size="md" variant="outline" />
			) : (
				lead
			)}
			<div className={cx("flex flex-1 flex-col gap-3 pr-8", lead !== undefined && "min-w-0")}>
				<div>
					{time ? (
						<div className="flex items-baseline gap-2">
							<div className="text-sm font-semibold text-secondary">{title}</div>
							<div className="text-sm text-quaternary">{time}</div>
						</div>
					) : (
						<div className="text-sm font-semibold text-secondary">{title}</div>
					)}
					{description ? <div className="mt-1 text-sm text-tertiary">{description}</div> : null}
				</div>
				{extra}
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
