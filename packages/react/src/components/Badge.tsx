import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export type StatusColor = "gray" | "brand" | "error" | "warning" | "success";
export type BadgeColor = StatusColor | "slate" | "sky" | "blue" | "indigo" | "purple" | "pink" | "orange";
export type BadgeType = "pill" | "badge" | "modern";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
	/** Escala utility: fondo `-50`, borde `-200`, texto `-700`, punto `-500`. */
	color?: BadgeColor;
	/** `pill` redonda · `badge` con `radius-md` · `modern` blanca con sombra. */
	type?: BadgeType;
	/** Alto: `sm` 22 · `md` 24 · `lg` 28. */
	size?: BadgeSize;
	/** Punto de color antes del texto. */
	dot?: boolean;
	/** Icono de 12px antes del texto. */
	icon?: IconName | ReactNode;
	/** Muestra una X para quitarlo. */
	onRemove?: () => void;
	/** Nombre accesible de la X. Por defecto, "Quitar". */
	removeLabel?: string;
	/** Una o dos palabras: el estado no puede depender solo del color. */
	children: ReactNode;
	className?: string;
}

interface Palette {
	/** Fondo, texto y borde del badge. */
	badge: string;
	/** Fondo del punto. */
	dot: string;
	/** Color de la X y fondo al pasar por encima. */
	remove: string;
}

// Clases enteras, no compuestas: Tailwind solo genera las que encuentra escritas.
/** Clases por color (también para los chips de eventos de CalendarView). */
export const COLOR: Record<BadgeColor, Palette> = {
	gray: {
		badge: "bg-utility-neutral-50 text-utility-neutral-700 inset-ring-utility-neutral-200",
		dot: "bg-utility-neutral-500",
		remove: "text-utility-neutral-500 hover:bg-utility-neutral-200",
	},
	brand: {
		badge: "bg-utility-brand-50 text-utility-brand-700 inset-ring-utility-brand-200",
		dot: "bg-utility-brand-500",
		remove: "text-utility-brand-500 hover:bg-utility-brand-200",
	},
	error: {
		badge: "bg-utility-red-50 text-utility-red-700 inset-ring-utility-red-200",
		dot: "bg-utility-red-500",
		remove: "text-utility-red-500 hover:bg-utility-red-200",
	},
	warning: {
		badge: "bg-utility-yellow-50 text-utility-yellow-700 inset-ring-utility-yellow-200",
		dot: "bg-utility-yellow-500",
		remove: "text-utility-yellow-500 hover:bg-utility-yellow-200",
	},
	success: {
		badge: "bg-utility-green-50 text-utility-green-700 inset-ring-utility-green-200",
		dot: "bg-utility-green-500",
		remove: "text-utility-green-500 hover:bg-utility-green-200",
	},
	slate: {
		badge: "bg-utility-slate-50 text-utility-slate-700 inset-ring-utility-slate-200",
		dot: "bg-utility-slate-500",
		remove: "text-utility-slate-500 hover:bg-utility-slate-200",
	},
	sky: {
		badge: "bg-utility-sky-50 text-utility-sky-700 inset-ring-utility-sky-200",
		dot: "bg-utility-sky-500",
		remove: "text-utility-sky-500 hover:bg-utility-sky-200",
	},
	blue: {
		badge: "bg-utility-blue-50 text-utility-blue-700 inset-ring-utility-blue-200",
		dot: "bg-utility-blue-500",
		remove: "text-utility-blue-500 hover:bg-utility-blue-200",
	},
	indigo: {
		badge: "bg-utility-indigo-50 text-utility-indigo-700 inset-ring-utility-indigo-200",
		dot: "bg-utility-indigo-500",
		remove: "text-utility-indigo-500 hover:bg-utility-indigo-200",
	},
	purple: {
		badge: "bg-utility-purple-50 text-utility-purple-700 inset-ring-utility-purple-200",
		dot: "bg-utility-purple-500",
		remove: "text-utility-purple-500 hover:bg-utility-purple-200",
	},
	pink: {
		badge: "bg-utility-pink-50 text-utility-pink-700 inset-ring-utility-pink-200",
		dot: "bg-utility-pink-500",
		remove: "text-utility-pink-500 hover:bg-utility-pink-200",
	},
	orange: {
		badge: "bg-utility-orange-50 text-utility-orange-700 inset-ring-utility-orange-200",
		dot: "bg-utility-orange-500",
		remove: "text-utility-orange-500 hover:bg-utility-orange-200",
	},
};

// `modern` es blanca con sombra en todos los colores; el punto conserva el color
const MODERN = "bg-primary text-secondary inset-ring-primary shadow-xs";
const MODERN_REMOVE = "hover:bg-(--border-primary)";

const PADDING: Record<BadgeType, Record<BadgeSize, string>> = {
	pill: { sm: "px-2 py-0.5", md: "px-2.5 py-0.5", lg: "px-3 py-1" },
	badge: { sm: "px-1.5 py-0.5", md: "px-2 py-0.5", lg: "px-2.5 py-1 rounded-lg" },
	modern: { sm: "px-2 py-0.5", md: "px-2 py-0.5", lg: "px-2.5 py-1 rounded-lg" },
};

/** Etiqueta de estado o categoría de una o dos palabras. */
export function Badge({
	color = "gray",
	type = "pill",
	size = "md",
	dot,
	icon,
	onRemove,
	removeLabel = defaultStrings.remove,
	children,
	className,
}: BadgeProps) {
	const palette = COLOR[color];
	const modern = type === "modern";
	return (
		<span
			className={cx(
				"inline-flex items-center gap-1.5 whitespace-nowrap font-body text-sm font-medium inset-ring",
				type === "pill" ? "rounded-full" : "rounded-md",
				size === "sm" && "gap-1 text-xs",
				palette.badge,
				modern && MODERN,
				PADDING[type][size],
				dot && type === "pill" && "pl-2",
				className,
			)}
		>
			{dot ? (
				<span aria-hidden="true" className={cx("m-px size-1.5 shrink-0 rounded-full", palette.dot)} />
			) : null}
			{icon ? iconSlot(icon, 12) : null}
			{children}
			{onRemove ? (
				<button
					type="button"
					onClick={onRemove}
					aria-label={removeLabel}
					className={cx(
						"-my-0.5 -mr-1 -ml-0.5 inline-flex cursor-pointer rounded-sm bg-transparent p-0.5 transition-colors duration-100 focus-visible:shadow-focus-ring focus-visible:outline-none",
						palette.remove,
						modern && MODERN_REMOVE,
					)}
				>
					<Icon name="x-close" size={12} />
				</button>
			) : null}
		</span>
	);
}
