"use client";

import type { ReactNode } from "react";
import type { BubbleAlign, BubbleSide } from "../internal/bubble.js";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";
import { Tooltip } from "./Tooltip.js";

export interface HelpIconProps {
	/** Primera línea del tooltip. Si es texto, también da nombre al botón («Ayuda: título»). */
	title: ReactNode;
	/** Segunda línea del tooltip, en `tooltip-supporting-text`. */
	text?: ReactNode;
	/**
	 * Lado del icono en el que sale el tooltip.
	 * @default "top"
	 */
	placement?: BubbleSide;
	/**
	 * Flecha del tooltip: `center`, `start`, `end` o `false`.
	 * @default "center"
	 */
	arrow?: BubbleAlign | false;
	/** Nombre del botón si `title` no es texto. Por defecto, «Ayuda: <título>». */
	label?: string;
	/** Fuerza el tooltip visible (vistas previas y capturas). */
	open?: boolean;
	className?: string;
}

/** Icono de ayuda de 16px que abre un tooltip al pasar el ratón o al enfocarlo, junto a una etiqueta o un campo. */
export function HelpIcon({ title, text, placement, arrow, label, open, className }: HelpIconProps) {
	const name = label ?? (typeof title === "string" ? defaultStrings.help(title) : defaultStrings.help(""));
	return (
		<Tooltip title={title} text={text} placement={placement} arrow={arrow} open={open}>
			<button
				type="button"
				aria-label={name}
				className={cx(
					"inline-flex cursor-help rounded-full border-0 bg-transparent p-0 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
					className,
				)}
			>
				<Icon name="help-circle" size={16} />
			</button>
		</Tooltip>
	);
}
