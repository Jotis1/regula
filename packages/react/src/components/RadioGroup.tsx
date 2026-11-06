"use client";

import type { ReactNode } from "react";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { type ChoiceSize, ChoiceText, choiceBox, choiceLabel, radioDot } from "../internal/choice.js";
import { cx } from "../internal/cx.js";
import { Icon } from "./Icon.js";

export interface RadioGroupOption {
	value: string;
	label: ReactNode;
	hint?: ReactNode;
	/** Solo en tarjetas: apoyo en línea tras la etiqueta, en `text-tertiary` (p. ej. "10 €/mes"). */
	supporting?: ReactNode;
	/** Solo en tarjetas: lo que va delante del texto, de 32px: un `FeaturedIcon`, un `Avatar` o un logo de pago. */
	media?: ReactNode;
	/** Solo en tarjetas: opción deshabilitada. */
	disabled?: boolean;
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
	/**
	 * `card`: cada opción es una tarjeta con borde `border-secondary` que pasa a 2px `border-brand` al elegirla.
	 * @default "default"
	 */
	appearance?: "default" | "card";
	/**
	 * Solo en tarjetas: círculo (`radio`) o casilla con check (`checkbox`), arriba a la derecha.
	 * @default "radio"
	 */
	indicator?: "radio" | "checkbox";
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
	appearance = "default",
	indicator = "radio",
	"aria-label": ariaLabel,
	className,
}: RadioGroupProps) {
	if (appearance === "card") {
		return (
			<AriaRadioGroup
				value={value}
				defaultValue={defaultValue}
				onChange={onChange}
				name={name}
				aria-label={ariaLabel}
				className={cx("flex flex-col gap-3 font-body", className)}
			>
				{options.map((o) => (
					<AriaRadio
						key={o.value}
						value={o.value}
						isDisabled={o.disabled}
						className="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50"
					>
						<span className="flex min-w-0 flex-1 items-start gap-3">
							{o.media != null ? <span className="flex flex-none">{o.media}</span> : null}
							<span className="flex min-w-0 flex-col text-sm">
								<span className="flex flex-wrap gap-x-1">
									<span className="font-medium text-secondary">{o.label}</span>
									{o.supporting != null ? (
										<span className="font-normal text-tertiary">{o.supporting}</span>
									) : null}
								</span>
								{o.hint != null ? (
									<span className="font-normal text-tertiary">{o.hint}</span>
								) : null}
							</span>
						</span>
						<span
							aria-hidden="true"
							className={cx(
								choiceBox("sm", indicator === "radio"),
								"group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring",
							)}
						>
							{indicator === "radio" ? (
								<span className={cx(radioDot("sm"), "hidden group-data-selected:block")} />
							) : (
								<span className="hidden group-data-selected:inline-flex">
									<Icon name="check" size={12} strokeWidth={1.67} />
								</span>
							)}
						</span>
					</AriaRadio>
				))}
			</AriaRadioGroup>
		);
	}
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
