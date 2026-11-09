import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Icon } from "./Icon.js";

export type BadgeGroupColor = "gray" | "brand" | "error" | "warning" | "success";
export type BadgeGroupType = "pill" | "modern";
export type BadgeGroupSize = "md" | "lg";

interface Base {
	/** Texto del badge de dentro: una o dos palabras («Nuevo», «Versión 4.0»). */
	badge: ReactNode;
	/** El mensaje, en una línea. */
	children: ReactNode;
	/**
	 * Color de la escala utility. En `modern` solo colorea el punto.
	 * @default "brand"
	 */
	color?: BadgeGroupColor;
	/**
	 * `pill` del color, redonda · `modern` blanca con sombra y un punto de color.
	 * @default "pill"
	 */
	type?: BadgeGroupType;
	/**
	 * Lado del badge: delante o detrás del mensaje.
	 * @default "leading"
	 */
	badgePosition?: "leading" | "trailing";
	/**
	 * `md` texto de 12 · `lg` texto de 14.
	 * @default "md"
	 */
	size?: BadgeGroupSize;
	className?: string;
}

type AsStatic = { href?: undefined; onClick?: undefined };
type AsButton = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
	href?: undefined;
	onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};
type AsLink = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & { href: string };

export type BadgeGroupProps = Base & (AsStatic | AsButton | AsLink);

interface Palette {
	/** Contenedor del `pill`: fondo, texto, filo y el fondo al pasar por encima. */
	pill: string;
	hover: string;
	/** Badge de dentro del `pill`. */
	badge: string;
	/** Punto del `modern`. */
	dot: string;
}

// Clases enteras, no compuestas: Tailwind solo genera las que encuentra escritas.
const COLOR: Record<BadgeGroupColor, Palette> = {
	gray: {
		pill: "bg-utility-neutral-50 text-utility-neutral-700 inset-ring-utility-neutral-200",
		hover: "hover:bg-utility-neutral-100",
		badge: "text-utility-neutral-700 inset-ring-utility-neutral-200",
		dot: "bg-utility-neutral-500",
	},
	brand: {
		pill: "bg-utility-brand-50 text-utility-brand-700 inset-ring-utility-brand-200",
		hover: "hover:bg-utility-brand-100",
		badge: "text-utility-brand-700 inset-ring-utility-brand-200",
		dot: "bg-utility-brand-500",
	},
	error: {
		pill: "bg-utility-red-50 text-utility-red-700 inset-ring-utility-red-200",
		hover: "hover:bg-utility-red-100",
		badge: "text-utility-red-700 inset-ring-utility-red-200",
		dot: "bg-utility-red-500",
	},
	warning: {
		pill: "bg-utility-yellow-50 text-utility-yellow-700 inset-ring-utility-yellow-200",
		hover: "hover:bg-utility-yellow-100",
		badge: "text-utility-yellow-700 inset-ring-utility-yellow-200",
		dot: "bg-utility-yellow-500",
	},
	success: {
		pill: "bg-utility-green-50 text-utility-green-700 inset-ring-utility-green-200",
		hover: "hover:bg-utility-green-100",
		badge: "text-utility-green-700 inset-ring-utility-green-200",
		dot: "bg-utility-green-500",
	},
};

// Rellenos del Figma (nodo 1046:8088): el lado del badge va más ceñido que el del mensaje
const PAD: Record<"leading" | "trailing", Record<BadgeGroupSize, string>> = {
	leading: { md: "py-1 pl-1 pr-2", lg: "py-1 pl-1 pr-2.5" },
	trailing: { md: "py-1 pl-2.5 pr-1", lg: "py-1 pl-3 pr-1" },
};
const BADGE_PAD: Record<BadgeGroupSize, string> = { md: "px-2 py-0.5", lg: "px-2.5 py-0.5" };

/**
 * Un badge dentro de otro con un mensaje: avisa de una novedad o de un estado y, con `href` u `onClick`, lleva a
 * verla. Con acción termina en una flecha.
 */
export function BadgeGroup({
	badge,
	children,
	color = "brand",
	type = "pill",
	badgePosition = "leading",
	size = "md",
	className,
	...rest
}: BadgeGroupProps) {
	const palette = COLOR[color];
	const modern = type === "modern";
	const leading = badgePosition === "leading";
	const interactive = rest.href !== undefined || rest.onClick !== undefined;
	const arrow = (px: number) => (interactive ? <Icon name="arrow-right" size={px} /> : null);
	const dot = <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", palette.dot)} />;

	const inner = (
		<span
			className={cx(
				"inline-flex shrink-0 items-center gap-1 bg-primary inset-ring",
				modern
					? "rounded-sm text-secondary inset-ring-primary shadow-xs"
					: cx("rounded-full", palette.badge),
				BADGE_PAD[size],
				!leading && interactive && (size === "md" ? "pr-1.5" : "pr-2"),
				modern && leading && "pl-1.5",
			)}
		>
			{modern && leading ? dot : null}
			{badge}
			{leading ? null : arrow(12)}
		</span>
	);
	const message = (
		<span className="inline-flex min-w-0 items-center gap-1.5">
			{modern && !leading ? dot : null}
			<span className="truncate">{children}</span>
			{leading ? arrow(16) : null}
		</span>
	);

	const classes = cx(
		"inline-flex max-w-full items-center gap-2 whitespace-nowrap font-body font-medium no-underline inset-ring",
		size === "md" ? "text-xs" : "text-sm",
		modern
			? "rounded-lg bg-primary text-secondary inset-ring-primary shadow-xs"
			: cx("rounded-full", palette.pill),
		PAD[badgePosition][size],
		interactive &&
			"cursor-pointer transition-colors duration-100 ease-linear focus-visible:shadow-focus-ring focus-visible:outline-none",
		interactive && (modern ? "hover:bg-secondary" : palette.hover),
		className,
	);
	// El espacio separa badge y mensaje al leerlos («Nuevo Hemos publicado…»); en flex no se ve
	const content = leading ? (
		<>
			{inner} {message}
		</>
	) : (
		<>
			{message} {inner}
		</>
	);

	if (rest.href !== undefined)
		return (
			<a {...(rest as AsLink)} className={classes}>
				{content}
			</a>
		);
	if (rest.onClick !== undefined)
		return (
			<button type="button" {...(rest as AsButton)} className={cx(classes, "border-0")}>
				{content}
			</button>
		);
	return <div className={classes}>{content}</div>;
}
