import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { CheckIcon, type CheckIconColor, type CheckIconType } from "./CheckIcon.js";

export type CheckItemSize = "sm" | "md" | "lg";

export interface CheckItemProps {
	/** El texto: lo que incluye el plan, el paso hecho. */
	children: ReactNode;
	/** Estilo del check (ver `CheckIcon`). @default "default" */
	type?: CheckIconType;
	/** @default "brand" */
	color?: CheckIconColor;
	/**
	 * `sm` check de 20 y `text-sm` · `md` 24 y `text-md` · `lg` 28 y `text-lg` (Figma `Check item text`, `1345:1610`).
	 * En un contenedor estrecho baja un paso, como el Figma en móvil.
	 * @default "md"
	 */
	size?: CheckItemSize;
	/** Elemento que pinta: `li` dentro de una lista (`<ul>`), o `div` suelto. @default "li" */
	as?: "li" | "div";
	className?: string;
}

const TEXT: Record<CheckItemSize, string> = {
	sm: "text-sm",
	md: "text-md @max-sm:text-sm",
	lg: "text-lg @max-sm:text-md",
};

/** Una línea con su check: lo que incluye un plan, una ventaja, un paso hecho. Va en una lista. */
export function CheckItem({
	children,
	type = "default",
	color = "brand",
	size = "md",
	as = "li",
	className,
}: CheckItemProps) {
	const Tag = as;
	return (
		<Tag
			className={cx("flex list-none items-start gap-3 font-body text-tertiary", TEXT[size], className)}
		>
			<CheckIcon type={type} color={color} size={size} />
			<span className="min-w-0 pt-px">{children}</span>
		</Tag>
	);
}
