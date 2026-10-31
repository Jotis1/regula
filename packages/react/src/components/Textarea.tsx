import { type TextareaHTMLAttributes, useId } from "react";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	nativeClasses,
} from "../internal/field.js";

export interface TextareaProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

/** Campo de texto multilínea con la misma etiqueta, pista y estados que `Input`. */
export function Textarea({
	label,
	required,
	hint,
	error,
	id: givenId,
	className,
	disabled,
	rows = 4,
	...rest
}: TextareaProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	return (
		<FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
			<div className={cx(controlClasses(undefined, error, disabled), "px-3.5 py-3")}>
				<textarea
					id={id}
					rows={rows}
					required={required}
					disabled={disabled}
					{...describedBy(id, { hint, error })}
					{...rest}
					className={cx(nativeClasses(), "min-h-[104px] resize-y")}
				/>
			</div>
		</FieldShell>
	);
}
