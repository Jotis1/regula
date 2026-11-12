import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export type StatusColor = "gray" | "brand" | "error" | "warning" | "success";
export type BadgeColor = StatusColor | "slate" | "sky" | "blue" | "indigo" | "purple" | "pink" | "orange";
export type BadgeType = "pill" | "badge" | "modern";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeBase {
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
	/** Bandera de 16px antes del texto, como `FlagSpainCircle` de `@jotis-me/icons/flags`. */
	flag?: ReactNode;
	/** Avatar de 16px antes del texto: la URL de una foto o un nodo. */
	avatar?: string | ReactNode;
	/** Icono de 12px después del texto. */
	iconTrailing?: IconName | ReactNode;
	/** Muestra una X para quitarlo. */
	onRemove?: () => void;
	/** Nombre accesible de la X. Por defecto, "Quitar". */
	removeLabel?: string;
	className?: string;
}

interface BadgeWithText extends BadgeBase {
	iconOnly?: undefined;
	label?: undefined;
	/** Una o dos palabras: el estado no puede depender solo del color. */
	children: ReactNode;
}

interface BadgeIconOnly extends BadgeBase {
	/** Solo el icono, de 12px, en un badge cuadrado (o redondo en `pill`) de 22, 24 o 28px. */
	iconOnly: IconName | NonNullable<ReactNode>;
	/** Lo que significa el icono, para lectores de pantalla. Obligatorio: no hay texto visible. */
	label: string;
	children?: undefined;
}

export type BadgeProps = BadgeWithText | BadgeIconOnly;

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

// Rellenos del Figma (Badge, 1046:3819) cuando delante va una bandera o un avatar de 16px, cuando solo hay un icono
// detrás y cuando solo hay un icono. `pill` y los dos tipos `badge` tienen los suyos.
type Variant = "lead" | "trail" | "only";
const FIGMA: Record<Variant, Record<"pill" | "badge", Record<BadgeSize, string>>> = {
	lead: {
		pill: { sm: "gap-1 pl-[3px] pr-2", md: "gap-1.5 pl-1 pr-2.5", lg: "gap-1.5 pl-1.5 pr-3" },
		badge: { sm: "gap-1 pl-1 pr-1.5", md: "gap-1.5 pl-1.5 pr-2", lg: "gap-1.5 pl-2 pr-2.5" },
	},
	trail: {
		pill: { sm: "gap-0.5 pl-2 pr-1.5", md: "gap-1 pl-2.5 pr-2", lg: "gap-1 pl-3 pr-2.5" },
		badge: { sm: "gap-0.5 pl-2 pr-1.5", md: "gap-1 pl-2 pr-1.5", lg: "gap-1 pl-2.5 pr-2" },
	},
	only: {
		pill: { sm: "p-[5px]", md: "p-1.5", lg: "p-2" },
		badge: { sm: "p-[5px]", md: "p-1.5", lg: "p-2" },
	},
};

// color-fijo: borde interior de 0,33px al 16 % negro del avatar del Figma, por encima de la foto
const AVATAR_EDGE =
	"after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_0.33px_#00000029]";

/** Etiqueta de estado o categoría de una o dos palabras. */
export function Badge({
	color = "gray",
	type = "pill",
	size = "md",
	dot,
	icon,
	flag,
	avatar,
	iconTrailing,
	iconOnly,
	label,
	onRemove,
	removeLabel = defaultStrings.remove,
	children,
	className,
}: BadgeProps) {
	const palette = COLOR[color];
	const modern = type === "modern";
	const lead = flag ?? avatar;
	const variant: Variant | undefined = iconOnly
		? "only"
		: lead
			? "lead"
			: iconTrailing && !dot && !icon && !onRemove
				? "trail"
				: undefined;
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
				variant && FIGMA[variant][type === "pill" ? "pill" : "badge"][size],
				className,
			)}
		>
			{dot ? (
				<span aria-hidden="true" className={cx("m-px size-1.5 shrink-0 rounded-full", palette.dot)} />
			) : null}
			{icon ? iconSlot(icon, 12) : null}
			{flag ? (
				<span aria-hidden="true" className="flex size-4 shrink-0 [&>*]:size-full">
					{flag}
				</span>
			) : avatar ? (
				<span
					aria-hidden="true"
					className={cx(
						"relative flex size-4 shrink-0 overflow-hidden rounded-full [&>*]:size-full",
						AVATAR_EDGE,
					)}
				>
					{typeof avatar === "string" ? (
						<img src={avatar} alt="" className="object-cover" />
					) : (
						avatar
					)}
				</span>
			) : null}
			{iconOnly ? (
				<>
					{iconSlot(iconOnly, 12)}
					<span className="sr-only">{label}</span>
				</>
			) : (
				children
			)}
			{iconTrailing ? iconSlot(iconTrailing, 12) : null}
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
