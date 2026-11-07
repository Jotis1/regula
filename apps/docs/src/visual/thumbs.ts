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

/** Lo que se ajusta a mano de la vista previa de un componente. Todo es opcional. */
export interface Framing {
	/** Zona del ejemplo que se enseña, si no es el ejemplo entero. */
	zone?: Zone;
	/**
	 * Escala del lienzo de un componente que se ajusta solo al ancho de su contenedor con un efecto (`StreamStage`:
	 * StreamScene y ChannelBanner). Sin JavaScript no llega a medir y el lienzo queda invisible, así que la vista previa
	 * lo muestra con esta escala fija: el ancho que tiene en el ejemplo entre el ancho de su lienzo.
	 */
	stageScale?: number;
}

/** Ajustes por componente. El que no aparece enseña el ejemplo entero. */
export const THUMBS: Record<string, Framing> = {
	// Un componente pequeño en un rincón de su ejemplo: solo ese rincón, con el margen que tenía su foto recortada
	Button: { zone: { x: 0, y: 0, width: 600, height: 200 } },
	// Dos escenas por fila en un ejemplo de 800 con 16px de margen y 16px de hueco: (768 - 16) / 2 = 376, de 1920
	StreamScene: { stageScale: 376 / 1920 },
	// Un banner a todo el ancho del ejemplo (768), de 1200
	ChannelBanner: { stageScale: 768 / 1200 },
};

export interface Thumb {
	zone: Zone;
	/** Escala fija del lienzo de Stream que no se mide sin JavaScript (véase `Framing`). */
	stageScale?: number;
	/** Escala del ejemplo, sin pasar de 1. */
	scale: number;
	/** Desplazamiento del ejemplo ya escalado dentro del escenario, que deja la zona centrada. */
	left: number;
	top: number;
}

/** Zona, escala y desplazamiento de la vista previa de un componente del catálogo. */
export function thumbOf(name: string): Thumb {
	const zone = THUMBS[name]?.zone ?? whole(name);
	const scale = Math.min(PREVIEW_BOX.width / zone.width, PREVIEW_BOX.height / zone.height, 1);
	return {
		zone,
		stageScale: THUMBS[name]?.stageScale,
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
