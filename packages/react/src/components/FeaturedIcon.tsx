import { CheckCircle } from "@untitledui/icons";
import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";
import type { StatusColor } from "./Badge.js";

export type FeaturedIconSize = "sm" | "md" | "lg" | "xl";
export type FeaturedIconVariant = "light" | "gradient" | "dark" | "modern" | "modern-neue" | "outline";

export interface FeaturedIconProps {
	/** Por defecto, `check-circle`. */
	icon?: IconProp;
	/** Tiene que coincidir con el significado del contenedor: un modal de borrado lleva `error`. */
	color?: StatusColor;
	/** Lado: `sm` 32 · `md` 40 · `lg` 48 · `xl` 56. */
	size?: FeaturedIconSize;
	/**
	 * `light` círculo tintado · `gradient` círculo sólido con dos anillos tintados alrededor · `dark` cuadrado del color
	 * sólido con el icono en blanco · `modern` cuadrado blanco esqueumórfico · `modern-neue` cuadrado blanco dentro de un
	 * marco, con sombra · `outline` anillos concéntricos (Figma `Featured icon`, `1102:5338`).
	 */
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

// Gradiente: anillo exterior al 50 y anillo interior al 100 de la escala utility; en el centro, el sólido
const GRADIENT: Record<StatusColor, string> = {
	brand: "bg-[radial-gradient(circle,var(--utility-brand-100)_0_62%,var(--utility-brand-50)_63%)] [&>span]:bg-brand-solid",
	gray: "bg-[radial-gradient(circle,var(--utility-neutral-100)_0_62%,var(--utility-neutral-50)_63%)] [&>span]:bg-secondary-solid",
	error: "bg-[radial-gradient(circle,var(--utility-red-100)_0_62%,var(--utility-red-50)_63%)] [&>span]:bg-error-solid",
	warning:
		"bg-[radial-gradient(circle,var(--utility-yellow-100)_0_62%,var(--utility-yellow-50)_63%)] [&>span]:bg-warning-solid",
	success:
		"bg-[radial-gradient(circle,var(--utility-green-100)_0_62%,var(--utility-green-50)_63%)] [&>span]:bg-success-solid",
};
const GRADIENT_INNER: Record<FeaturedIconSize, string> = {
	sm: "size-5",
	md: "size-6",
	lg: "size-8",
	xl: "size-9",
};
const DARK: Record<StatusColor, string> = {
	brand: "bg-brand-solid",
	gray: "bg-secondary-solid",
	error: "bg-error-solid",
	warning: "bg-warning-solid",
	success: "bg-success-solid",
};
// Dark: el borde claro y el brillo interior esqueumórfico del Figma sobre el color sólido
const DARK_FRAME =
	"text-fg-white shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--alpha-white-10),inset_0_-2px_0_var(--alpha-black-10)]";
const DARK_RADIUS: Record<FeaturedIconSize, string> = {
	sm: "rounded-md",
	md: "rounded-lg",
	lg: "rounded-[10px]",
	xl: "rounded-xl",
};
// Modern neue: marco blanco con filo y, dentro, un cuadrado blanco con sombra
const NEUE_INNER: Record<FeaturedIconSize, string> = {
	sm: "size-7 rounded-md",
	md: "size-9 rounded-lg",
	lg: "size-10 rounded-[9px]",
	xl: "size-12 rounded-[10px]",
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
	icon = CheckCircle,
	color = "brand",
	size = "md",
	variant = "light",
	className,
}: FeaturedIconProps) {
	if (variant === "gradient")
		return (
			<span
				aria-hidden="true"
				className={cx(
					"inline-flex shrink-0 items-center justify-center rounded-full",
					SIZE[size],
					GRADIENT[color],
					className,
				)}
			>
				<span
					className={cx(
						"inline-flex items-center justify-center rounded-full text-fg-white",
						GRADIENT_INNER[size],
					)}
				>
					{iconSlot(icon, ICON_SIZE[size] - 4)}
				</span>
			</span>
		);
	if (variant === "modern-neue")
		return (
			<span
				aria-hidden="true"
				className={cx(
					"inline-flex shrink-0 items-center justify-center bg-primary_alt shadow-[inset_0_0_0_1px_var(--border-primary)]",
					SIZE[size],
					MODERN_RADIUS[size] === "rounded-xl" ? "rounded-[14px]" : "rounded-xl",
					className,
				)}
			>
				<span
					className={cx(
						"inline-flex items-center justify-center bg-primary_alt text-fg-secondary shadow-[var(--shadow-sm),inset_0_0_0_1px_var(--border-secondary_alt),inset_0_-2px_2px_var(--alpha-black-10)]",
						NEUE_INNER[size],
					)}
				>
					{iconSlot(icon, ICON_SIZE[size])}
				</span>
			</span>
		);
	return (
		<span
			aria-hidden="true"
			className={cx(
				"inline-flex shrink-0 items-center justify-center",
				variant !== "dark" && "rounded-full",
				SIZE[size],
				variant === "light" && LIGHT[color],
				variant === "outline" && [OUTLINE_RINGS, OUTLINE[color]],
				variant === "modern" && [MODERN, MODERN_RADIUS[size]],
				variant === "dark" && [DARK[color], DARK_FRAME, DARK_RADIUS[size]],
				className,
			)}
		>
			{iconSlot(icon, ICON_SIZE[size])}
		</span>
	);
}
