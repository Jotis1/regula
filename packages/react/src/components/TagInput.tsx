"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	type FieldSize,
	nativeClasses,
} from "../internal/field.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Tag } from "./Tag.js";

export interface TagInputProps extends FieldProps {
	value?: string[];
	defaultValue?: string[];
	onChange?: (tags: string[]) => void;
	/**
	 * `inside`: las etiquetas van en el campo, delante del texto, y el campo crece en alto.
	 * `outside`: van debajo del campo.
	 * @default "inside"
	 */
	placement?: "inside" | "outside";
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44, mientras las etiquetas quepan en una línea.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Por defecto, "Añadir etiqueta". */
	placeholder?: string;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario: las etiquetas van separadas por comas. */
	name?: string;
	/** Nombre accesible de la X de cada etiqueta. Por defecto, "Quitar" seguido de la etiqueta. */
	removeLabel?: (tag: string) => string;
	id?: string;
	className?: string;
}

/** Campo que convierte lo escrito en etiquetas al pulsar Enter o coma, sin repetidas ni vacías. */
export function TagInput({
	label,
	required,
	hint,
	error,
	value,
	defaultValue = [],
	onChange,
	placement = "inside",
	size = "md",
	placeholder = defaultStrings.addTag,
	disabled,
	name,
	removeLabel,
	id: givenId,
	className,
}: TagInputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const [tags, setTags] = useControllable(value, defaultValue, onChange);
	const [text, setText] = useState("");
	const input = useRef<HTMLInputElement>(null);
	const inside = placement === "inside";

	const add = () => {
		const tag = text.trim();
		setText("");
		if (tag && !tags.includes(tag)) setTags([...tags, tag]);
	};
	const remove = (tag: string) => {
		setTags(tags.filter((t) => t !== tag));
		input.current?.focus();
	};
	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			add();
		} else if (e.key === "Backspace" && text === "" && tags.length) {
			e.preventDefault();
			setTags(tags.slice(0, -1));
		}
	};

	const list = tags.length ? (
		<ul
			aria-label={typeof label === "string" ? label : undefined}
			aria-disabled={disabled || undefined}
			className={cx("m-0 flex list-none flex-wrap gap-1.5 p-0", !inside && "mt-0.5")}
		>
			{tags.map((tag) => (
				<li key={tag} className="flex">
					<Tag
						size="md"
						onRemove={disabled ? undefined : () => remove(tag)}
						removeLabel={removeLabel?.(tag)}
					>
						{tag}
					</Tag>
				</li>
			))}
		</ul>
	) : null;

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
			<div
				className={cx(
					controlClasses(size, error, disabled),
					inside && "flex-wrap gap-1.5",
					inside && tags.length && "pl-2",
				)}
			>
				{inside ? list : null}
				<input
					ref={input}
					id={id}
					value={text}
					placeholder={placeholder}
					disabled={disabled}
					required={required && tags.length === 0}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={onKeyDown}
					{...describedBy(id, { hint, error })}
					className={cx(nativeClasses(size), "min-w-24")}
				/>
				{name ? <input type="hidden" name={name} value={tags.join(",")} /> : null}
			</div>
			{inside ? null : list}
		</FieldShell>
	);
}
