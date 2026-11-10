import type { SVGProps } from "react";
import { coreIcons } from "./data/core.generated.js";
import { coreNames, type IconName } from "./data/core-names.js";
import { IconSvg } from "./icon-svg.js";

export type { IconName };

/**
 * Los nombres que acepta `Icon`: los 82 del núcleo. Todo el set del Figma (`allIconNames`) se pinta con su componente
 * suelto (`IconRocket02`), que lleva su propio dibujo y no pesa nada si no se importa.
 */
export const iconNames: readonly IconName[] = coreNames;

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

/** Icono de línea del núcleo (24×24, trazo de 2px redondeado) que toma el color del texto. */
export function Icon({ name, ...rest }: IconProps) {
	return <IconSvg paths={coreIcons[name] ?? []} {...rest} />;
}

/** El icono como SVG independiente con `currentColor`, para Astro o HTML sin React. */
export function iconSvg(name: IconName, size = 24): string {
	const paths = coreIcons[name].map((d) => `<path d="${d}"/>`).join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
