import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
	/** Alto: `sm` 24 · `md` 24 con texto de 14 · `lg` 28. */
	size?: TagSize;
	/** Contador tras el texto. */
	count?: number;
	/** Punto verde antes del texto. */
	dot?: boolean;
	/** Muestra una X para quitarlo. */
	onRemove?: () => void;
	/** Nombre accesible de la X. Por defecto, "Quitar" seguido del texto. */
	removeLabel?: string;
	children: ReactNode;
	className?: string;
}

const SIZE: Record<TagSize, string> = {
	sm: "px-2 py-[3px] text-xs",
	md: "px-[9px] py-0.5 text-sm",
	lg: "px-2.5 py-1 text-sm",
};

/** Chip neutro que pone o quita el usuario: filtros aplicados, etiquetas, selecciones. */
export function Tag({ size = "sm", count, dot, onRemove, removeLabel, children, className }: TagProps) {
	const label =
		removeLabel ??
		(typeof children === "string" ? `${defaultStrings.remove} ${children}` : defaultStrings.remove);
	return (
		<span
			className={cx(
				"inline-flex items-center gap-[3px] whitespace-nowrap rounded-md bg-primary font-body font-medium text-secondary inset-ring inset-ring-primary",
				SIZE[size],
				className,
			)}
		>
			{dot ? (
				<span
					aria-hidden="true"
					className="m-px size-1.5 shrink-0 rounded-full bg-fg-success-secondary"
				/>
			) : null}
			{children}
			{count != null ? (
				<span className="rounded-[3px] bg-tertiary px-[5px] text-xs text-secondary">{count}</span>
			) : null}
			{onRemove ? (
				<button
					type="button"
					onClick={onRemove}
					aria-label={label}
					className="inline-flex cursor-pointer rounded-[3px] bg-transparent p-0.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
				>
					<Icon name="x-close" size={size === "sm" ? 12 : 14} />
				</button>
			) : null}
		</span>
	);
}
