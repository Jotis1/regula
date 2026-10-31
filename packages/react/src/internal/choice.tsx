import type { ReactNode } from "react";
import { cx } from "./cx.js";

export type ChoiceSize = "sm" | "md";

// Piezas comunes de Checkbox, Radio, RadioGroup y Toggle: etiqueta envolvente, caja y textos.
export const choiceLabel = (size: ChoiceSize) =>
	cx(
		"group relative inline-flex cursor-pointer items-start font-body has-[:disabled]:cursor-not-allowed data-disabled:cursor-not-allowed",
		size === "md" ? "gap-3" : "gap-2",
	);

/** El input real, invisible pero enfocable; la caja de al lado se pinta con `peer-*`. */
export const hiddenInput = "peer absolute size-px opacity-0";

/** Caja de 16 o 20px que baja 2px para alinearse con la primera línea. */
export const choiceBox = (size: ChoiceSize, radio: boolean) =>
	cx(
		"mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)]",
		size === "md" ? "size-5 rounded-md" : "size-4 rounded-sm",
		radio && "rounded-full",
	);

/** Punto blanco del radio marcado: 6px, 8px en `md`. */
export const radioDot = (size: ChoiceSize) =>
	cx("rounded-full bg-fg-white", size === "md" ? "size-2" : "size-1.5");

interface ChoiceTextProps {
	label?: ReactNode;
	hint?: ReactNode;
	size: ChoiceSize;
	className?: string;
}

/** Etiqueta (`text-secondary` medium) y apoyo (`text-tertiary`); 16px en `md`. */
export function ChoiceText({ label, hint, size, className }: ChoiceTextProps) {
	if (!label && !hint) return null;
	const text = size === "md" ? "text-md" : "text-sm";
	return (
		<span className={cx("flex flex-col", size === "md" && "gap-0.5", className)}>
			{label ? <span className={cx(text, "font-medium text-secondary")}>{label}</span> : null}
			{hint ? <span className={cx(text, "font-normal text-tertiary")}>{hint}</span> : null}
		</span>
	);
}
