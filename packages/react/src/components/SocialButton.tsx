import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";

export type SocialProvider = "google" | "facebook" | "apple" | "x" | "figma" | "dribbble";
export type SocialButtonTheme = "brand" | "color" | "gray";
export type SocialButtonSize = "md" | "lg";

interface SocialButtonBase {
	/** La red: decide el texto por defecto y, con `theme="brand"`, el fondo. */
	provider: SocialProvider;
	/**
	 * El logo, de `@jotis-me/icons/logos` (el paquete no los importa). Con `brand`, los `…LogoGray` salen en blanco
	 * (salvo Google y Figma, que van en color); con `color`, los de color (Apple y X, los `…LogoGray`, que toman el
	 * color del texto); con `gray`, los `…LogoGray`.
	 */
	logo: ReactNode;
	/**
	 * `brand` fondo de la marca · `color` blanco con el logo en color · `gray` blanco con el logo en gris.
	 * @default "brand"
	 */
	theme?: SocialButtonTheme;
	/**
	 * Alto: `md` 40 (logo 16) · `lg` 44 (logo 20).
	 * @default "md"
	 */
	size?: SocialButtonSize;
	/** Solo el logo; el texto queda para lectores. */
	iconOnly?: boolean;
	/** Texto en lugar del de por defecto («Entrar con Google»); con `iconOnly`, el nombre para lectores. */
	children?: string;
	className?: string;
}

type AsButton = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
	href?: undefined;
};
type AsLink = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & { href: string };

export type SocialButtonProps = SocialButtonBase & (AsButton | AsLink);

// Fondos de marca del Figma (`Theme=Brand`), con su hover. Google va como `color`: su marca es el logo sobre blanco.
// color-fijo: negro de Apple, X y Figma (Figma `Social button`, `base/black`), también en oscuro
const BLACK = "bg-[#000000] not-disabled:hover:bg-[#000000]";
const BRAND: Record<SocialProvider, string | undefined> = {
	google: undefined,
	// color-fijo: azul de Facebook y su hover (Figma `Social button`), el mismo en los dos temas
	facebook: "bg-[#1877F2] not-disabled:hover:bg-[#0C63D4]",
	apple: BLACK,
	x: BLACK,
	figma: BLACK,
	// color-fijo: rosa de Dribbble y su hover (Figma `Social button`), el mismo en los dos temas
	dribbble: "bg-[#EA4C89] not-disabled:hover:bg-[#E62872]",
};

/**
 * Botón de entrar con una red (Figma `Social button`, `1256:130788`): Google, Facebook, Apple, X, Figma y Dribbble,
 * en `md` y `lg`, con texto o solo logo, en los temas marca, color y gris. Es un `Button`: con `href`, un enlace.
 */
export function SocialButton({
	provider,
	logo,
	theme = "brand",
	size = "md",
	iconOnly,
	children,
	className,
	...rest
}: SocialButtonProps) {
	const text = children ?? defaultStrings.signInWith[provider];
	const brand = theme === "brand" ? BRAND[provider] : undefined;
	const mark = (
		<span
			aria-hidden="true"
			className={cx(
				"flex shrink-0",
				size === "md" ? "[&>svg]:size-4" : "[&>svg]:size-5",
				brand ? "text-white" : theme === "gray" ? "text-fg-quaternary" : "text-fg-primary",
			)}
		>
			{logo}
		</span>
	);
	const classes = cx(
		size === "md" ? "gap-1.5" : "gap-2",
		iconOnly && "p-3",
		brand,
		// El logo pone su color: el gris de los iconos del secundario no lo pisa
		!brand && "[&_svg]:text-current",
		className,
	);
	const common = { hierarchy: brand ? "primary" : "secondary", size, className: classes } as const;
	return iconOnly ? (
		// biome-ignore lint/suspicious/noExplicitAny: las props de botón o de enlace pasan tal cual a Button
		<Button {...(rest as any)} {...common} iconOnly={mark} label={text} />
	) : (
		// biome-ignore lint/suspicious/noExplicitAny: las props de botón o de enlace pasan tal cual a Button
		<Button {...(rest as any)} {...common} iconLeading={mark}>
			{text}
		</Button>
	);
}
