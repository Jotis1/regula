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
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	/**
	 * Pista de 36×20 (`sm`) o 44×24 (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	className?: string;
}

/** Interruptor (`role="switch"`) para ajustes que se aplican al momento, sin botón de guardar. */
export function Toggle({
	label,
	hint,
	checked,
	defaultChecked,
	onChange,
	size = "sm",
	disabled,
	name,
	className,
}: ToggleProps) {
	const md = size === "md";
	return (
		<Switch
			isSelected={checked}
			defaultSelected={defaultChecked}
			onChange={onChange}
			isDisabled={disabled}
			name={name}
			className={cx(choiceLabel(size), className)}
		>
			<span
				aria-hidden="true"
				className={cx(
					"relative flex-none rounded-full bg-tertiary p-0.5 transition-colors duration-150 group-data-selected:bg-brand-solid group-data-selected:group-data-hovered:bg-brand-solid_hover group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50",
					md ? "h-6 w-11" : "h-5 w-9",
				)}
			>
				<span
					className={cx(
						"block rounded-full bg-fg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none",
						md
							? "size-5 group-data-selected:translate-x-5"
							: "size-4 group-data-selected:translate-x-4",
					)}
				/>
			</span>
			<ChoiceText label={label} hint={hint} size={size} className="group-data-disabled:opacity-50" />
		</Switch>
	);
}
