"use client";

import type { ReactNode } from "react";
import { Switch } from "react-aria-components";
import { type ChoiceSize, ChoiceText, choiceLabel } from "../internal/choice.js";
import { cx } from "../internal/cx.js";

export interface ToggleProps {
	/** Etiqueta junto al interruptor. */
	label?: ReactNode;
	/** Texto de apoyo bajo la etiqueta. */
	hint?: ReactNode;
	/**
	 * Nodo tras el texto de la etiqueta, empujado a la derecha y fuera del interruptor: un clic en él no lo activa.
	 * Con él, `className` va a la fila entera.
	 */
	labelAside?: ReactNode;
	/** Nombre accesible si no hay `label` visible. Con `label`, manda sobre él. */
	"aria-label"?: string;
	/** Id del elemento que nombra el interruptor. */
	"aria-labelledby"?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	/**
	 * Pista de 36×20 (`sm`) o 44×24 (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
	/**
	 * `slim`: pista de 32×16 (`sm`) o 40×20 (`md`) sin relleno, con el tirador a su misma altura y con borde.
	 * @default "default"
	 */
	variant?: "default" | "slim";
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	className?: string;
}

// Variante fina del Figma (`_Toggle base`, Type=Slim): pista sin relleno con borde `border-secondary` mientras está
// apagada, y tirador a su misma altura con borde `toggle-border` (encendido, `toggle-slim-border_pressed`).
const SLIM_TRACK =
	"relative flex-none rounded-full bg-tertiary shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-colors duration-150 group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-selected:group-data-hovered:bg-brand-solid_hover group-data-focus-visible:shadow-[inset_0_0_0_1px_var(--border-secondary),var(--focus-ring-shadow)] group-data-selected:group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50";
const SLIM_HANDLE =
	"block rounded-full bg-fg-white shadow-[var(--shadow-sm),inset_0_0_0_1px_var(--toggle-border)] transition-transform duration-150 group-data-selected:shadow-[var(--shadow-sm),inset_0_0_0_1px_var(--toggle-slim-border_pressed)] motion-reduce:transition-none";

/** Interruptor (`role="switch"`) para ajustes que se aplican al momento, sin botón de guardar. */
export function Toggle({
	label,
	hint,
	labelAside,
	checked,
	defaultChecked,
	onChange,
	size = "sm",
	variant = "default",
	disabled,
	name,
	className,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledby,
}: ToggleProps) {
	const md = size === "md";
	const slim = variant === "slim";
	const aside = labelAside != null && labelAside !== false;
	const toggle = (
		<Switch
			isSelected={checked}
			defaultSelected={defaultChecked}
			onChange={onChange}
			isDisabled={disabled}
			name={name}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
			className={cx(choiceLabel(size), !aside && className)}
		>
			<span
				aria-hidden="true"
				className={
					slim
						? cx(SLIM_TRACK, md ? "h-5 w-10" : "h-4 w-8")
						: cx(
								"relative flex-none rounded-full bg-tertiary p-0.5 transition-colors duration-150 group-data-selected:bg-brand-solid group-data-selected:group-data-hovered:bg-brand-solid_hover group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50",
								md ? "h-6 w-11" : "h-5 w-9",
							)
				}
			>
				<span
					className={
						slim
							? cx(
									SLIM_HANDLE,
									md
										? "size-5 group-data-selected:translate-x-5"
										: "size-4 group-data-selected:translate-x-4",
								)
							: cx(
									"block rounded-full bg-fg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none",
									md
										? "size-5 group-data-selected:translate-x-5"
										: "size-4 group-data-selected:translate-x-4",
								)
					}
				/>
			</span>
			<ChoiceText label={label} hint={hint} size={size} className="group-data-disabled:opacity-50" />
		</Switch>
	);
	if (!aside) return toggle;
	// El nodo va fuera del `<label>` del interruptor: sus botones no lo activan al pulsarlos
	return (
		<div className={cx("flex items-start", md ? "gap-3" : "gap-2", className)}>
			{toggle}
			<div className="ml-auto flex flex-none items-center gap-2">{labelAside}</div>
		</div>
	);
}
