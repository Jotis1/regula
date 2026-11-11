import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import type { SocialButtonSize } from "./SocialButton.js";

export interface SocialButtonGroupProps {
	/** Los `SocialButton`: con texto en columna, con `iconOnly` en fila. */
	children: ReactNode;
	/**
	 * `column` botones a todo el ancho, uno debajo de otro · `row` botones de solo logo, del mismo ancho.
	 * @default "column"
	 */
	layout?: "column" | "row";
	/**
	 * El de los botones: separa 10 px (`md`) o 12 px (`lg`) en columna, como el Figma.
	 * @default "md"
	 */
	size?: SocialButtonSize;
	/** Nombre del grupo para lectores («Entrar con»). */
	label?: string;
	className?: string;
}

/**
 * Grupo de botones de redes (Figma `Social button group`, `1256:132638`): en columna, a todo el ancho, o en fila,
 * solo con los logos y repartidos a partes iguales.
 */
export function SocialButtonGroup({
	children,
	layout = "column",
	size = "md",
	label,
	className,
}: SocialButtonGroupProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: un grupo de botones, no de campos: <fieldset> pediría <legend> y sus estilos
		<div
			role="group"
			aria-label={label}
			className={cx(
				"flex w-full",
				layout === "column"
					? ["flex-col [&>*]:w-full", size === "md" ? "gap-2.5" : "gap-3"]
					: "flex-row gap-3 [&>*]:flex-1",
				className,
			)}
		>
			{children}
		</div>
	);
}
