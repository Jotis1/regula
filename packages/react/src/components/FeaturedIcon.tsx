import { cx } from "../internal/cx.js";
import type { StatusColor } from "./Badge.js";
import { Icon, type IconName } from "./Icon.js";

export type FeaturedIconSize = "sm" | "md" | "lg" | "xl";
export type FeaturedIconVariant = "light" | "modern" | "outline";

export interface FeaturedIconProps {
	/** Por defecto, `check-circle`. */
	icon?: IconName;
	/** Tiene que coincidir con el significado del contenedor: un modal de borrado lleva `error`. */
	color?: StatusColor;
	/** Lado: `sm` 32 · `md` 40 · `lg` 48 · `xl` 56. */
	size?: FeaturedIconSize;
	/** `light` círculo tintado · `modern` cuadrado blanco esqueumórfico · `outline` anillos concéntricos. */
	variant?: FeaturedIconVariant;
	className?: string;
}

const SIZE: Record<FeaturedIconSize, string> = { sm: "size-8", md: "size-10", lg: "size-12", xl: "size-14" };
const ICON_SIZE: Record<FeaturedIconSize, number> = { sm: 16, md: 20, lg: 24, xl: 28 };

const LIGHT: Record<StatusColor, string> = {
	brand: "bg-brand-secondary text-featured-icon-light-fg-brand",
	gray: "bg-tertiary text-featured-icon-light-fg-gray",
	error: "bg-error-secondary text-featured-icon-light-fg-error",
	warning: "bg-warning-secondary text-featured-icon-light-fg-warning",
	success: "bg-success-secondary text-featured-icon-light-fg-success",
};

// Los anillos heredan el color del icono: interior al 30 %, exterior al 10 %
const OUTLINE_RINGS =
	"relative before:absolute before:inset-1.5 before:rounded-full before:border-2 before:border-current before:opacity-30 before:content-[''] after:absolute after:inset-px after:rounded-full after:border-2 after:border-current after:opacity-10 after:content-['']";
const OUTLINE: Record<StatusColor, string> = {
	brand: "text-fg-brand-primary",
	gray: "text-fg-tertiary",
	error: "text-fg-error-primary",
	warning: "text-fg-warning-primary",
	success: "text-fg-success-primary",
};

const MODERN =
	"bg-primary text-fg-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]";
const MODERN_RADIUS: Record<FeaturedIconSize, string> = {
	sm: "rounded-md",
	md: "rounded-lg",
	lg: "rounded-lg",
	xl: "rounded-xl",
};

/** Icono dentro de una forma, para encabezar modales, alertas, estados vacíos y tarjetas. Es decorativo. */
export function FeaturedIcon({
	icon = "check-circle",
	color = "brand",
	size = "md",
	variant = "light",
	className,
}: FeaturedIconProps) {
	return (
		<span
			aria-hidden="true"
			className={cx(
				"inline-flex shrink-0 items-center justify-center rounded-full",
				SIZE[size],
				variant === "light" && LIGHT[color],
				variant === "outline" && [OUTLINE_RINGS, OUTLINE[color]],
				variant === "modern" && [MODERN, MODERN_RADIUS[size]],
				className,
			)}
		>
			<Icon name={icon} size={ICON_SIZE[size]} />
		</span>
	);
}
