import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import {
	type ChoiceSize,
	ChoiceText,
	choiceBox,
	choiceLabel,
	hiddenInput,
	radioDot,
} from "../internal/choice.js";
import { cx } from "../internal/cx.js";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
	/** Etiqueta junto al botón. */
	label?: ReactNode;
	/** Texto de apoyo bajo la etiqueta. */
	hint?: ReactNode;
	/**
	 * Círculo de 16px (`sm`) o 20px (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
}

/** Botón de opción suelto, con `<input type="radio">` nativo. En grupo, usa `RadioGroup`. */
export function Radio({ label, hint, size = "sm", id: givenId, className, ...rest }: RadioProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	return (
		<label htmlFor={id} className={cx(choiceLabel(size), className)}>
			<input id={id} type="radio" {...rest} className={hiddenInput} />
			<span
				aria-hidden="true"
				className={cx(
					choiceBox(size, true),
					"peer-checked:bg-brand-solid peer-checked:shadow-none peer-focus-visible:shadow-focus-ring peer-disabled:opacity-50",
				)}
			>
				<span className={cx(radioDot(size), "hidden group-has-[:checked]:block")} />
			</span>
			<ChoiceText label={label} hint={hint} size={size} className="peer-disabled:opacity-50" />
		</label>
	);
}
