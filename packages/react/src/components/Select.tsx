"use client";

import { type ReactNode, useId } from "react";
import { type FieldProps, FieldShell, type FieldSize } from "../internal/field.js";
import { OptionSelect, type SelectOption } from "../internal/option-select.js";
import type { IconName } from "./Icon.js";

export type { SelectOption };

export interface SelectProps extends FieldProps {
	/** Lista corta (hasta ~12). Con más o con búsqueda, usa otro componente. */
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	/** Recibe el valor de la opción elegida (no el evento). */
	onChange?: (value: string) => void;
	/** Lo que dice el campo sin nada elegido. Sin él, parte con la primera opción elegida. */
	placeholder?: string;
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconName | ReactNode;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	form?: string;
	autoComplete?: string;
	/** Nombre accesible si no hay `label` visible. */
	"aria-label"?: string;
	/** Abierto de inicio, para vistas previas. */
	defaultOpen?: boolean;
	id?: string;
	className?: string;
}

/** Desplegable de lista corta con el aspecto de `Input`: opciones con apoyo, icono, avatar o punto, y check en la elegida. */
export function Select({
	label,
	required,
	hint,
	error,
	options,
	placeholder,
	size = "md",
	icon,
	id: givenId,
	className,
	disabled,
	...rest
}: SelectProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const message = typeof error === "string" && error ? error : hint;
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
			<OptionSelect
				{...rest}
				id={id}
				variant="field"
				options={options}
				placeholder={placeholder}
				size={size}
				icon={icon}
				disabled={disabled}
				required={required}
				invalid={Boolean(error)}
				aria-labelledby={label ? `${id}-label` : undefined}
				aria-describedby={message ? `${id}-hint` : undefined}
			/>
		</FieldShell>
	);
}
