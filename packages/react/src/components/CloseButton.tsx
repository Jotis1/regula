import type { ButtonHTMLAttributes } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	/** Nombre accesible. Por defecto, "Cerrar". */
	label?: string;
}

/** Botón cuadrado de 36px con la X, para cerrar modales, alertas y notificaciones. */
export function CloseButton({ label = defaultStrings.close, className, ...rest }: CloseButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			{...rest}
			className={cx(
				"inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
				className,
			)}
		>
			<Icon name="x-close" size={20} />
		</button>
	);
}
