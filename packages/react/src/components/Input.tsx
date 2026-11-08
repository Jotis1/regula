"use client";

import { type InputHTMLAttributes, type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import {
	addonClasses,
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	type FieldSize,
	fieldPadding,
	fieldSeparator,
	nativeClasses,
} from "../internal/field.js";
import { OptionSelect, type SelectOption } from "../internal/option-select.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName } from "./Icon.js";

/** Desplegable dentro del campo: prefijo telefónico, divisa… Su valor va aparte del texto. */
export interface InputAddonSelect {
	/** Lista corta de opciones, como en `Select` (texto, o con apoyo, icono, avatar o punto). */
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Nombre accesible del desplegable (p. ej. "Prefijo"). Obligatorio: no tiene etiqueta visible. */
	label: string;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
}

export interface InputProps
	extends FieldProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44. En `md` y `lg` el valor va a 16px para que iOS no haga zoom.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconName;
	/** Icono final, 16px. Con error se sustituye por el de alerta. */
	trailing?: IconName;
	/** Texto fijo delante del valor (`https://`), en `text-tertiary` y separado por un borde. No forma parte del valor. */
	prefix?: ReactNode;
	/** Desplegable delante del valor, sin separador (prefijo telefónico). */
	leadingSelect?: InputAddonSelect;
	/** Desplegable detrás del valor, sin separador (divisa). */
	trailingSelect?: InputAddonSelect;
	/**
	 * Con `type="password"`, botón para mostrar u ocultar lo escrito.
	 * @default true
	 */
	revealable?: boolean;
	/** Nombres del botón de la contraseña. Por defecto, "Mostrar contraseña" y "Ocultar contraseña". */
	revealLabels?: { show: string; hide: string };
}

function AddonSelect({
	select,
	size,
	position,
	disabled,
}: {
	select: InputAddonSelect;
	size: FieldSize;
	position: "leading" | "trailing";
	disabled?: boolean;
}) {
	const { options, value, defaultValue, onChange, label, name } = select;
	return (
		<OptionSelect
			variant="addon"
			position={position}
			size={size}
			options={options}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
			disabled={disabled}
			aria-label={label}
		/>
	);
}

/** Campo de texto de una línea con etiqueta, pista y error, en tres alturas. */
export function Input({
	label,
	required,
	hint,
	error,
	size = "md",
	icon,
	trailing,
	prefix,
	leadingSelect,
	trailingSelect,
	revealable = true,
	revealLabels,
	id: givenId,
	className,
	disabled,
	type,
	...rest
}: InputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const [revealed, setRevealed] = useState(false);
	const password = type === "password" && revealable;
	const split = prefix != null || leadingSelect != null || trailingSelect != null;

	const field = (
		<>
			{icon ? <Icon name={icon} size={20} /> : null}
			<input
				id={id}
				type={password && revealed ? "text" : type}
				required={required}
				disabled={disabled}
				{...describedBy(id, { hint, error })}
				{...rest}
				className={nativeClasses(size)}
			/>
			{error ? (
				<span className="inline-flex text-fg-error-secondary">
					<Icon name="alert-circle" size={16} />
				</span>
			) : trailing && !password ? (
				<span className="inline-flex">
					<Icon name={trailing} size={16} />
				</span>
			) : null}
			{password ? (
				<button
					type="button"
					aria-pressed={revealed}
					aria-label={
						revealed
							? (revealLabels?.hide ?? defaultStrings.hidePassword)
							: (revealLabels?.show ?? defaultStrings.showPassword)
					}
					disabled={disabled}
					onClick={() => setRevealed((r) => !r)}
					className="inline-flex flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed"
				>
					<Icon name={revealed ? "eye-off" : "eye"} size={16} />
				</button>
			) : null}
		</>
	);

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
			{split ? (
				<div className={controlClasses(size, error, disabled, true)}>
					{leadingSelect ? (
						<AddonSelect
							select={leadingSelect}
							size={size}
							position="leading"
							disabled={disabled}
						/>
					) : null}
					{prefix != null ? <span className={addonClasses(size)}>{prefix}</span> : null}
					<div
						className={cx(
							"flex min-w-0 flex-1 items-center self-stretch",
							fieldPadding(size),
							prefix != null && fieldSeparator,
							leadingSelect && prefix == null && "pl-2.5",
							trailingSelect && "pr-0",
						)}
					>
						{field}
					</div>
					{trailingSelect ? (
						<AddonSelect
							select={trailingSelect}
							size={size}
							position="trailing"
							disabled={disabled}
						/>
					) : null}
				</div>
			) : (
				<div className={controlClasses(size, error, disabled)}>{field}</div>
			)}
		</FieldShell>
	);
}
