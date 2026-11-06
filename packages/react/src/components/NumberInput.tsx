"use client";

import { useId } from "react";
import { Input as AriaInput, Button, Group, I18nProvider, NumberField } from "react-aria-components";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	type FieldProps,
	FieldShell,
	type FieldSize,
	fieldPadding,
	fieldSeparator,
	nativeClasses,
} from "../internal/field.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export interface NumberInputProps extends FieldProps {
	value?: number;
	defaultValue?: number;
	/** Recibe el número, o `NaN` si el campo se vacía. */
	onChange?: (value: number) => void;
	min?: number;
	max?: number;
	/**
	 * Lo que suma o resta cada paso (botones, flechas, rueda).
	 * @default 1
	 */
	step?: number;
	/**
	 * `horizontal`: − y + a los lados. `vertical`: dos chevrons apilados detrás.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Formato del número (`es-ES`): decimales, divisa, porcentaje… */
	formatOptions?: Intl.NumberFormatOptions;
	placeholder?: string;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	/** Nombres de los botones. Por defecto, "Restar" y "Sumar". */
	decrementLabel?: string;
	incrementLabel?: string;
	id?: string;
	className?: string;
}

// Cada botón es tan ancho como alto es el campo (40×40 en `md`, como el Figma).
const SQUARE: Record<FieldSize, string> = { sm: "w-9", md: "w-10", lg: "w-11" };
const STEPPER =
	"flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-fg-quaternary outline-none transition-colors duration-100 data-hovered:bg-primary_hover data-hovered:text-fg-quaternary_hover data-pressed:bg-primary_hover data-disabled:cursor-not-allowed data-disabled:opacity-50";

/** Campo numérico con botones para restar y sumar, mínimo, máximo y paso, en formato `es-ES`. */
export function NumberInput({
	label,
	required,
	hint,
	error,
	value,
	defaultValue,
	onChange,
	min,
	max,
	step = 1,
	orientation = "horizontal",
	size = "md",
	formatOptions,
	placeholder,
	disabled,
	name,
	decrementLabel = defaultStrings.decrement,
	incrementLabel = defaultStrings.increment,
	id: givenId,
	className,
}: NumberInputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const message = typeof error === "string" && error ? error : hint;
	const vertical = orientation === "vertical";
	return (
		<FieldShell
			id={id}
			label={label}
			required={required}
			hint={hint}
			error={error}
			size={size}
			className={className}
		>
			<I18nProvider locale="es-ES">
				<NumberField
					value={value}
					defaultValue={defaultValue}
					onChange={onChange}
					minValue={min}
					maxValue={max}
					step={step}
					formatOptions={formatOptions}
					isDisabled={disabled}
					isRequired={required}
					isInvalid={!!error}
					name={name}
					id={id}
					aria-labelledby={label ? `${id}-label` : undefined}
				>
					<Group className={controlClasses(size, error, disabled, true)}>
						{vertical ? null : (
							<Button
								slot="decrement"
								aria-label={decrementLabel}
								className={cx(STEPPER, SQUARE[size], "self-stretch border-r border-primary")}
							>
								<Icon name="minus" size={20} />
							</Button>
						)}
						<div
							className={cx(
								"flex min-w-0 flex-1 items-center self-stretch",
								fieldPadding(size),
							)}
						>
							{/* La pista y el error los pinta FieldShell. En el HTML de servidor, React Aria añadiría a
							    aria-describedby los ids de su descripción y su error, que aquí no existen: este valor
							    manda sobre el suyo (vacío, sin pista). */}
							<AriaInput
								placeholder={placeholder}
								aria-describedby={message ? `${id}-hint` : ""}
								className={nativeClasses(size)}
							/>
						</div>
						{vertical ? (
							<div className={cx("flex w-7 flex-none flex-col self-stretch", fieldSeparator)}>
								<Button
									slot="increment"
									aria-label={incrementLabel}
									className={cx(STEPPER, "flex-1 border-b border-primary")}
								>
									<Icon name="chevron-up" size={12} />
								</Button>
								<Button
									slot="decrement"
									aria-label={decrementLabel}
									className={cx(STEPPER, "flex-1")}
								>
									<Icon name="chevron-down" size={12} />
								</Button>
							</div>
						) : (
							<Button
								slot="increment"
								aria-label={incrementLabel}
								className={cx(STEPPER, SQUARE[size], "self-stretch", fieldSeparator)}
							>
								<Icon name="plus" size={20} />
							</Button>
						)}
					</Group>
				</NumberField>
			</I18nProvider>
		</FieldShell>
	);
}
