import type { SVGProps } from "react";
import { icons } from "./data/icons.js";

export type IconName = keyof typeof icons;

/** Los nombres de los iconos del set: los de la guía original, en su orden, y los que se han añadido después. */
export const iconNames = Object.keys(icons) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "children"> {
	name: IconName;
	/** Lado en px. 20 en controles, 16 en botones xs y menús, 24 en navegación. */
	size?: number;
	strokeWidth?: number;
	/** Nombre accesible. Sin él, el icono es decorativo y queda oculto a lectores de pantalla. */
	title?: string;
	/** Giro continuo para cargas; se detiene si el sistema pide menos movimiento. */
	spin?: boolean;
}

const SPIN_CSS =
	"@keyframes jm-icon-spin{to{transform:rotate(360deg)}}.jm-icon-spin{animation:jm-icon-spin 1s linear infinite;transform-origin:center}@media (prefers-reduced-motion:reduce){.jm-icon-spin{animation:none}}";

/** Icono de línea del set (24×24, trazo de 2px redondeado) que toma el color del texto. */
export function Icon({ name, size = 20, strokeWidth = 2, title, spin, className, ...rest }: IconProps) {
	const paths: readonly string[] = icons[name] ?? [];
	const classes = [spin ? "jm-icon-spin" : "", className ?? ""].filter(Boolean).join(" ") || undefined;
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: con `title` lleva <title>; sin él es decorativo y va con aria-hidden
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden={title ? undefined : true}
			role={title ? "img" : undefined}
			focusable="false"
			className={classes}
			{...rest}
		>
			{title ? <title>{title}</title> : null}
			{spin ? <style>{SPIN_CSS}</style> : null}
			{paths.map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

/** El icono como SVG independiente con `currentColor`, para Astro o HTML sin React. */
export function iconSvg(name: IconName, size = 24): string {
	const paths = icons[name].map((d) => `<path d="${d}"/>`).join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
