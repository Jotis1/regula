"use client";

import type { ReactNode } from "react";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { type ChoiceSize, ChoiceText, choiceBox, choiceLabel, radioDot } from "../internal/choice.js";
import { cx } from "../internal/cx.js";

export interface RadioGroupOption {
	value: string;
	label: ReactNode;
	hint?: ReactNode;
}

export interface RadioGroupProps {
	/** Hasta cinco opciones; con más, `Select`. */
	options: RadioGroupOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/**
	 * Círculos de 16px (`sm`) o 20px (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	/** Qué se elige, si no hay una etiqueta visible. */
	"aria-label"?: string;
	className?: string;
}

/** Grupo de opciones excluyentes con flechas para moverse entre ellas. */
export function RadioGroup({
	options,
	value,
	defaultValue,
	onChange,
	size = "sm",
	name,
	"aria-label": ariaLabel,
	className,
}: RadioGroupProps) {
	return (
		<AriaRadioGroup
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
			aria-label={ariaLabel}
			className={cx("flex flex-col gap-3", className)}
		>
			{options.map((o) => (
				<AriaRadio key={o.value} value={o.value} className={choiceLabel(size)}>
					<span
						aria-hidden="true"
						className={cx(
							choiceBox(size, true),
							"group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50",
						)}
					>
						<span className={cx(radioDot(size), "hidden group-data-selected:block")} />
					</span>
					<ChoiceText
						label={o.label}
						hint={o.hint}
						size={size}
						className="group-data-disabled:opacity-50"
					/>
				</AriaRadio>
			))}
		</AriaRadioGroup>
	);
}
