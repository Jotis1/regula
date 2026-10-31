import { type ReactNode, type SelectHTMLAttributes, useId } from "react";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	type FieldSize,
	nativeClasses,
} from "../internal/field.js";
import { Icon, type IconName } from "./Icon.js";

export type SelectOption = string | { value: string; label: ReactNode };

export interface SelectProps extends FieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	/** Lista corta (hasta ~12). Con más o con búsqueda, usa otro componente. */
	options: SelectOption[];
	/** Primera opción, no seleccionable, mientras no haya valor. */
	placeholder?: string;
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconName;
}

/** Desplegable nativo con el aspecto de `Input` y un chevron, para una lista corta. */
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
				<select
					id={id}
					required={required}
					disabled={disabled}
					defaultValue={rest.value === undefined && placeholder ? "" : undefined}
					{...describedBy(id, { hint, error })}
					{...rest}
					className={cx(nativeClasses(size), "cursor-pointer appearance-none")}
				>
					{placeholder ? (
						<option value="" disabled>
							{placeholder}
						</option>
					) : null}
					{options.map((o) => {
						const { value, label } = typeof o === "string" ? { value: o, label: o } : o;
						return (
							<option key={value} value={value}>
								{label}
							</option>
						);
					})}
				</select>
				<span className="pointer-events-none inline-flex">
					<Icon name="chevron-down" size={20} />
				</span>
			</div>
		</FieldShell>
	);
}
