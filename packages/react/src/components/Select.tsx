"use client";

import { useId } from "react";
import { type FieldProps, FieldShell, type FieldSize } from "../internal/field.js";
import type { IconProp } from "../internal/icon.js";
import { OptionCombobox } from "../internal/option-combobox.js";
import { OptionSelect, type SelectOption } from "../internal/option-select.js";
import { MultiSelect } from "./MultiSelect.js";

export type { SelectOption };

interface SelectBaseProps extends FieldProps {
	/** Lista corta (hasta ~12). Con más, usa `searchable`. */
	options: SelectOption[];
	/** Lo que dice el campo sin nada elegido. Sin él, parte con la primera opción elegida. */
	placeholder?: string;
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconProp;
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

export interface SingleSelectProps extends SelectBaseProps {
	type?: "default";
	value?: string;
	defaultValue?: string;
	/** Recibe el valor de la opción elegida (no el evento). */
	onChange?: (value: string) => void;
	/**
	 * El campo es un cuadro de texto: al escribir, la lista solo enseña las opciones que contienen lo escrito, la primera
	 * queda marcada y Enter la elige. Sin `placeholder`, el campo dice «Buscar» y no parte con ninguna elegida.
	 */
	searchable?: boolean;
	/** Texto de la lista cuando la búsqueda no encuentra nada. Por defecto, «Sin resultados». */
	emptyLabel?: string;
}

export interface TagsSelectProps extends SelectBaseProps {
	/** Varias opciones elegidas, que el campo enseña como etiquetas. Con buscador dentro de la lista. */
	type: "tags";
	value?: string[];
	defaultValue?: string[];
	/** Recibe los valores elegidos. */
	onChange?: (values: string[]) => void;
}

export type SelectProps = SingleSelectProps | TagsSelectProps;

/** Desplegable de lista corta con el aspecto de `Input`: opciones con apoyo, icono, avatar o punto, y check en la elegida. */
export function Select(props: SelectProps) {
	const {
		label,
		labelAside,
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
	} = props;
	const autoId = useId();
	const id = givenId ?? autoId;

	if (props.type === "tags") {
		return (
			<MultiSelect
				display="tags"
				id={id}
				label={label}
				labelAside={labelAside}
				required={required}
				hint={hint}
				error={error}
				size={size}
				disabled={disabled}
				className={className}
				placeholder={placeholder}
				name={props.name}
				defaultOpen={props.defaultOpen}
				value={props.value}
				defaultValue={props.defaultValue}
				onChange={props.onChange}
				options={options.map((o) =>
					typeof o === "string"
						? o
						: {
								value: o.value,
								label: typeof o.label === "string" ? o.label : (o.textValue ?? o.value),
								supporting: o.supporting,
							},
				)}
			/>
		);
	}

	const {
		type: _type,
		searchable,
		emptyLabel,
		value,
		defaultValue,
		onChange,
		name,
		form,
		defaultOpen,
	} = props;
	const message = typeof error === "string" && error ? error : hint;
	const shared = {
		id,
		name,
		form,
		defaultOpen,
		value,
		defaultValue,
		onChange,
		options,
		placeholder,
		size,
		icon,
		disabled,
		required,
		invalid: Boolean(error),
		"aria-label": props["aria-label"],
		"aria-labelledby": label ? `${id}-label` : undefined,
		"aria-describedby": message ? `${id}-hint` : undefined,
	};
	return (
		<FieldShell
			id={id}
			label={label}
			labelAside={labelAside}
			required={required}
			hint={hint}
			error={error}
			size={size}
			className={className}
		>
			{searchable ? (
				<OptionCombobox {...shared} emptyLabel={emptyLabel} />
			) : (
				<OptionSelect {...shared} variant="field" />
			)}
		</FieldShell>
	);
}
