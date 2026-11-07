// Encuadre de la vista previa de cada card de /components/ (design D2). Módulo sin React ni Astro: lo lee la card y
// lo prueba un test.
//
// El ejemplo se pinta a su ancho de diseño (VIEWPORT_WIDTH) y se encoge con `transform: scale()` dentro de un escenario
// de tamaño fijo, como el `Scaled` de Scaena. Se enseña el ejemplo entero salvo que `THUMBS` marque una zona más
// pequeña (un componente que ocupa un rincón de su ejemplo se vería diminuto).

import { CARD_HEIGHTS, VIEWPORT_WIDTH } from "./cards";

/** Escenario de la vista previa, en px: 16/10, cabe en la card más estrecha (una columna a 390px). */
export const PREVIEW_BOX = { width: 288, height: 180 } as const;

/** Zona del ejemplo que se enseña, en px del ejemplo (800 de ancho). */
export interface Zone {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Zona de los ejemplos que no se enseñan enteros. El resto usa el ejemplo completo. */
export const THUMBS: Record<string, Zone> = {};

export interface Thumb {
	zone: Zone;
	/** Escala del ejemplo, sin pasar de 1. */
	scale: number;
	/** Desplazamiento del ejemplo ya escalado dentro del escenario, que deja la zona centrada. */
	left: number;
	top: number;
}

/** Zona, escala y desplazamiento de la vista previa de un componente del catálogo. */
export function thumbOf(name: string): Thumb {
	const zone = THUMBS[name] ?? whole(name);
	const scale = Math.min(PREVIEW_BOX.width / zone.width, PREVIEW_BOX.height / zone.height, 1);
	return {
		zone,
		scale,
		left: (PREVIEW_BOX.width - zone.width * scale) / 2 - zone.x * scale,
		top: (PREVIEW_BOX.height - zone.height * scale) / 2 - zone.y * scale,
	};
}

function whole(name: string): Zone {
	const height = CARD_HEIGHTS[name];
	if (height === undefined)
		throw new Error(`${name} no tiene alto en CARD_HEIGHTS: no se puede encuadrar su vista previa`);
	return { x: 0, y: 0, width: VIEWPORT_WIDTH, height };
}
