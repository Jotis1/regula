"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from "react";
import type { BubbleSide } from "../internal/bubble.js";
import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";
import { Tooltip } from "./Tooltip.js";

export type ButtonUtilityHierarchy = "secondary" | "tertiary";
export type ButtonUtilitySize = "xs" | "sm";

interface Base {
	/** Icono del botón: 16px en `xs`, 20px en `sm`. */
	icon: NonNullable<IconProp>;
	/** Nombre accesible y texto del tooltip. Obligatorio: el botón no lleva texto visible. */
	label: string;
	/**
	 * `secondary` con borde y sombra · `tertiary` sin fondo hasta pasar por encima.
	 * @default "secondary"
	 */
	hierarchy?: ButtonUtilityHierarchy;
	/**
	 * `xs` icono de 16 · `sm` icono de 20, los dos con 6px de relleno.
	 * @default "sm"
	 */
	size?: ButtonUtilitySize;
	/**
	 * Enseña `label` en un tooltip al pasar el ratón o al enfocarlo. `false` lo quita.
	 * @default true
	 */
	tooltip?: boolean;
	/**
	 * Lado del botón en el que sale el tooltip.
	 * @default "top"
	 */
	tooltipPlacement?: BubbleSide;
	/** Fuerza el tooltip visible (vistas previas y capturas). */
	tooltipOpen?: boolean;
	className?: string;
}

type AsButton = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
	href?: undefined;
};
type AsLink = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
	/** Con `href` se pinta como enlace `<a>` con el mismo aspecto. */
	href: string;
	disabled?: boolean;
};

export type ButtonUtilityProps = Base & (AsButton | AsLink);

const BASE =
	"relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm p-1.5 text-fg-quaternary no-underline transition-colors duration-100 ease-linear focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 not-disabled:not-aria-disabled:hover:bg-primary_hover not-disabled:not-aria-disabled:hover:text-fg-quaternary_hover";

const HIERARCHY: Record<ButtonUtilityHierarchy, string> = {
	// Borde de 1px como sombra interior, como `Button` secundario: no suma al tamaño
	secondary: "bg-primary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]",
	tertiary: "bg-transparent",
};

/**
 * Botón pequeño de solo icono para barras de herramientas (copiar, editar, borrar una fila). Dice qué hace en un
 * tooltip al pasar el ratón o al enfocarlo.
 */
export function ButtonUtility({
	icon,
	label,
	hierarchy = "secondary",
	size = "sm",
	tooltip = true,
	tooltipPlacement,
	tooltipOpen,
	className,
	...rest
}: ButtonUtilityProps) {
	const classes = cx(BASE, HIERARCHY[hierarchy], className);
	const glyph = iconSlot(icon, size === "xs" ? 16 : 20);
	let control: ReactElement;
	let inactive: boolean;
	if ("href" in rest && rest.href !== undefined) {
		const { disabled, ...anchor } = rest as AsLink;
		inactive = !!disabled;
		control = (
			<a
				{...anchor}
				aria-label={label}
				aria-disabled={inactive || undefined}
				tabIndex={inactive ? -1 : anchor.tabIndex}
				href={inactive ? undefined : anchor.href}
				className={classes}
			>
				{glyph}
			</a>
		);
	} else {
		const button = rest as AsButton;
		inactive = !!button.disabled;
		control = (
			<button type="button" {...button} aria-label={label} className={classes}>
				{glyph}
			</button>
		);
	}
	// Deshabilitado no dice nada: sin tooltip, como un botón que no responde
	if (!tooltip || inactive) return control;
	return (
		<Tooltip title={label} placement={tooltipPlacement} open={tooltipOpen}>
			{control}
		</Tooltip>
	);
}
