// Escenario de la vista previa de cada card de /components/ (design D2). Módulo sin React ni Astro: lo leen la card y
// un test. La muestra del componente (thumbnails.tsx) se pinta a su tamaño real; lo que no cabe se recorta.

/** Escenario de la vista previa, en px: 16/10, cabe en la card más estrecha (una columna a 390px). */
export const PREVIEW_BOX = { width: 288, height: 180 } as const;

/** Dónde se ancla una muestra que no cabe y por qué bordes se desvanece lo que se recorta. */
export type Crop = "center" | "top" | "top-left";

/** Ancho del fundido en el borde recortado, en px. */
export const FADE = 24;

/** Alineación de la muestra en el escenario según su ancla (clases de Tailwind). */
export const CROP_ALIGN: Record<Crop, string> = {
	center: "items-center justify-center",
	top: "items-start justify-center",
	"top-left": "items-start justify-start",
};

/**
 * Máscara del escenario: el fundido va solo en los bordes por donde se recorta. En una muestra que cabe no se nota,
 * porque no llega a ellos.
 */
export function fadeMask(crop: Crop): string {
	const edge = (dir: string) => `linear-gradient(${dir}, #000 calc(100% - ${FADE}px), transparent)`;
	const start = (dir: string) => `linear-gradient(${dir}, transparent, #000 ${FADE}px)`;
	const layers =
		crop === "top-left"
			? [edge("to right"), edge("to bottom")]
			: crop === "top"
				? [start("to right"), edge("to right"), edge("to bottom")]
				: [start("to right"), edge("to right"), start("to bottom"), edge("to bottom")];
	// Cada capa recorta a la anterior: se intersecan
	return layers.join(",");
}
