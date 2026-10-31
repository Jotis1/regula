"use client";

import { type InputHTMLAttributes, type ReactNode, useEffect, useId, useRef } from "react";
import { type ChoiceSize, ChoiceText, choiceBox, choiceLabel, hiddenInput } from "../internal/choice.js";
import { cx } from "../internal/cx.js";
import { Icon } from "./Icon.js";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
	/** Etiqueta junto a la casilla. */
	label?: ReactNode;
	/** Texto de apoyo bajo la etiqueta. */
	hint?: ReactNode;
	/** Selección parcial: guion en lugar de check y `aria-checked="mixed"`. */
	indeterminate?: boolean;
	/**
	 * Caja de 16px (`sm`) o 20px (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
}

/** Casilla para activar opciones independientes, con etiqueta y texto de apoyo. */
export function Checkbox({
	label,
	hint,
	indeterminate,
	size = "sm",
	id: givenId,
	className,
	...rest
}: CheckboxProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (ref.current) ref.current.indeterminate = !!indeterminate;
	}, [indeterminate]);
	const markSize = size === "md" ? 14 : 12;
	return (
		<label htmlFor={id} className={cx(choiceLabel(size), className)}>
			<input
				ref={ref}
				id={id}
				type="checkbox"
				aria-checked={indeterminate ? "mixed" : undefined}
				{...rest}
				className={hiddenInput}
			/>
			<span
				aria-hidden="true"
				className={cx(
					choiceBox(size, false),
					"peer-checked:bg-brand-solid peer-checked:shadow-none peer-focus-visible:shadow-focus-ring peer-disabled:opacity-50",
					indeterminate && "bg-brand-solid shadow-none",
				)}
			>
				{indeterminate ? (
					<Icon name="minus" size={markSize} strokeWidth={1.67} />
				) : (
					<span className="hidden group-has-[:checked]:inline-flex">
						<Icon name="check" size={markSize} strokeWidth={1.67} />
					</span>
				)}
			</span>
			<ChoiceText label={label} hint={hint} size={size} className="peer-disabled:opacity-50" />
		</label>
	);
}
