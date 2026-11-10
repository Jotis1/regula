import { type TextareaHTMLAttributes, useId } from "react";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	nativeClasses,
} from "../internal/field.js";
import { TagInput } from "./TagInput.js";

export interface TextareaProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
	/**
	 * Etiquetas (controlado). Con `tags` o `defaultTags` el campo se convierte en uno de etiquetas de varias líneas, como
	 * `TagInput`: Enter o coma convierten lo escrito en etiqueta y Retroceso quita la última. Ya no hay texto libre, así
	 * que `rows`, `value` y `defaultValue` no se usan.
	 */
	tags?: string[];
	/** Etiquetas al principio (no controlado). */
	defaultTags?: string[];
	/** Se llama con la lista de etiquetas cada vez que cambia. */
	onTagsChange?: (tags: string[]) => void;
	/**
	 * Dónde van las etiquetas: `inside` (por defecto), delante del texto dentro del campo, o `outside`, debajo.
	 * @default "inside"
	 */
	tagPlacement?: "inside" | "outside";
	/** Nombre accesible de la X de cada etiqueta. Por defecto, "Quitar" seguido de la etiqueta. */
	removeTagLabel?: (tag: string) => string;
}

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
	tags,
	defaultTags,
	onTagsChange,
	tagPlacement,
	removeTagLabel,
	...rest
}: TextareaProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	if (tags !== undefined || defaultTags !== undefined) {
		return (
			<TagInput
				multiline
				id={id}
				label={label}
				required={required}
				hint={hint}
				error={error}
				disabled={disabled}
				className={className}
				value={tags}
				defaultValue={defaultTags}
				onChange={onTagsChange}
				placement={tagPlacement}
				placeholder={rest.placeholder}
				name={rest.name}
				removeLabel={removeTagLabel}
			/>
		);
	}
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
