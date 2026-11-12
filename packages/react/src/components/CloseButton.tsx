import type { ButtonHTMLAttributes } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	/** Nombre accesible. Por defecto, "Cerrar". */
	label?: string;
	/** Tamaño: `sm` (36 px, por defecto), `md` (40) o `lg` (44, con X de 24). */
	size?: "sm" | "md" | "lg";
	/** Para fondos oscuros o de color: X clara y fondo blanco translúcido al pasar por encima. */
	onDark?: boolean;
}

const sizes = {
	sm: { box: "size-9", icon: 20 },
	md: { box: "size-10", icon: 20 },
	lg: { box: "size-11", icon: 24 },
} as const;

/** Botón cuadrado con la X, para cerrar modales, alertas y notificaciones. */
export function CloseButton({
	label = defaultStrings.close,
	size = "sm",
	onDark = false,
	className,
	...rest
}: CloseButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			{...rest}
			className={cx(
				"inline-flex",
				sizes[size].box,
				"shrink-0 cursor-pointer items-center justify-center rounded-lg bg-transparent p-2",
				onDark ? "text-fg-white/70" : "text-fg-quaternary",
				"transition-colors duration-100",
				onDark
					? "hover:bg-fg-white/20 hover:text-fg-white"
					: "hover:bg-primary_hover hover:text-fg-quaternary_hover",
				"focus-visible:shadow-focus-ring focus-visible:outline-none",
				className,
			)}
		>
			<Icon name="x-close" size={sizes[size].icon} />
		</button>
	);
}
