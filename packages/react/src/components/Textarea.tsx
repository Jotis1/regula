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
	/**
	 * Tamaño del Figma (`Textarea input field`, `1238:278`): `md` (texto de 16 px, caja de 128) o `sm` (texto de 14 px,
	 * pista de 12 y caja de 110).
	 * @default "md"
	 */
	size?: "sm" | "md";
}

/** Campo de texto multilínea con la misma etiqueta, pista y estados que `Input`. */
export function Textarea({
	label,
	labelAside,
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
	size,
	...rest
}: TextareaProps) {
	const sm = size === "sm";
	const autoId = useId();
	const id = givenId ?? autoId;
	if (tags !== undefined || defaultTags !== undefined) {
		return (
			<TagInput
				multiline
				id={id}
				label={label}
				labelAside={labelAside}
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
		<FieldShell
			id={id}
			label={label}
			labelAside={labelAside}
			required={required}
			hint={hint}
			error={error}
			className={className}
			size={sm ? "sm" : undefined}
		>
			<div className={cx(controlClasses(undefined, error, disabled), sm ? "px-3 py-3" : "px-3.5 py-3")}>
				<textarea
					id={id}
					rows={rows}
					required={required}
					disabled={disabled}
					{...describedBy(id, { hint, error })}
					{...rest}
					className={cx(
						nativeClasses(sm ? "sm" : undefined),
						sm ? "min-h-[86px] resize-y" : "min-h-[104px] resize-y",
					)}
				/>
			</div>
		</FieldShell>
	);
}
