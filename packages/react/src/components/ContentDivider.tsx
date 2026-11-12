import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export interface ContentDividerProps {
	/** Texto en el centro, como "o continúa con" o una fecha. */
	label?: ReactNode;
	/** El texto como título (`text-md` semibold en `text-primary`) en lugar de `text-sm` en `text-tertiary`. */
	heading?: boolean;
	/**
	 * `single` una línea · `dual` dos líneas · `fill` banda en `bg-secondary`.
	 * @default "single"
	 */
	variant?: "single" | "dual" | "fill";
	/** Un `Button` en el centro, como "Cargar más". Sustituye a `label`. */
	children?: ReactNode;
	/**
	 * Lo del centro como en el Figma: un `Button` («Añadir»), un `Button` solo icono o un `ButtonGroup` (anterior, añadir
	 * y siguiente, o «Ver todo / Activos / Inactivos»). Es lo mismo que `children`, con nombre; si llegan los dos, gana
	 * `actions`.
	 */
	actions?: ReactNode;
	className?: string;
}

const LINE: Record<NonNullable<ContentDividerProps["variant"]>, string> = {
	single: "border-t border-secondary",
	dual: "h-[5px] border-y border-secondary",
	fill: "h-8 bg-secondary",
};

/** Separador horizontal, solo o con texto o un botón en el centro. */
export function ContentDivider({
	label,
	heading,
	variant = "single",
	children,
	actions,
	className,
}: ContentDividerProps) {
	const action = actions ?? children;
	const mid = action ? (
		action
	) : label ? (
		<span
			className={cx(
				"whitespace-nowrap",
				heading ? "text-md font-semibold text-primary" : "text-sm font-medium text-tertiary",
				variant === "fill" && "inline-flex h-8 items-center bg-secondary px-2",
			)}
		>
			{label}
		</span>
	) : null;
	const line = <span aria-hidden="true" className={cx("flex-1", LINE[variant])} />;
	return (
		<div
			role={mid ? undefined : "separator"}
			className={cx("flex items-center font-body", variant === "fill" ? "gap-0" : "gap-2", className)}
		>
			{line}
			{mid}
			{mid ? line : null}
		</div>
	);
}
