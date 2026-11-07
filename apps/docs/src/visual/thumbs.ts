// Escenario de la vista previa de cada card de /components/ (design D2). Módulo sin React ni Astro: lo leen la card y
// un test.
//
// Cada card enseña la muestra del componente (thumbnails.tsx). Si un componente aún no tiene muestra, enseña su
// ejemplo entero: pintado a su ancho de diseño (VIEWPORT_WIDTH) y encogido con `transform: scale()` hasta caber en el
// escenario, como el `Scaled` de Scaena. Así el build no falla por una muestra que falta.

import { CARD_HEIGHTS, VIEWPORT_WIDTH } from "./cards";

/** Escenario de la vista previa, en px: 16/10, cabe en la card más estrecha (una columna a 390px). */
export const PREVIEW_BOX = { width: 288, height: 180 } as const;

export interface Fit {
	/** Escala del ejemplo entero, sin pasar de 1. */
	scale: number;
	/** Desplazamiento del ejemplo ya escalado dentro del escenario, que lo deja centrado. */
	left: number;
	top: number;
}

/** Escala y desplazamiento del ejemplo entero de un componente para caber centrado en el escenario. */
export function thumbOf(name: string): Fit {
	const height = CARD_HEIGHTS[name];
	if (height === undefined)
		throw new Error(`${name} no tiene alto en CARD_HEIGHTS: no se puede encuadrar su vista previa`);
	const scale = Math.min(PREVIEW_BOX.width / VIEWPORT_WIDTH, PREVIEW_BOX.height / height, 1);
	return {
		scale,
		left: (PREVIEW_BOX.width - VIEWPORT_WIDTH * scale) / 2,
		top: (PREVIEW_BOX.height - height * scale) / 2,
	};
}
