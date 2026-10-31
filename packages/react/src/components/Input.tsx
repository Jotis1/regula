import { type InputHTMLAttributes, useId } from "react";
import {
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	type FieldSize,
	nativeClasses,
} from "../internal/field.js";
import { Icon, type IconName } from "./Icon.js";

export interface InputProps extends FieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44. En `md` y `lg` el valor va a 16px para que iOS no haga zoom.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconName;
	/** Icono final, 16px. Con error se sustituye por el de alerta. */
	trailing?: IconName;
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
	id: givenId,
	className,
	disabled,
	...rest
}: InputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
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
			<div className={controlClasses(size, error, disabled)}>
				{icon ? <Icon name={icon} size={20} /> : null}
				<input
					id={id}
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
				) : trailing ? (
					<span className="inline-flex">
						<Icon name={trailing} size={16} />
					</span>
				) : null}
			</div>
		</FieldShell>
	);
}
