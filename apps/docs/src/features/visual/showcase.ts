// Marco de la captura de cada card de /components/ (change adopt-untitled-ui-icons). Módulo sin React ni Astro: lo leen la
// página de captura, el script que la fotografía, la card y los tests.

/** El marco de la captura, en px de CSS: 16/10, con el que se ve la card más ancha y la más estrecha. */
export const SHOWCASE_BOX = { width: 640, height: 400 } as const;

/** Parte del marco que ocupa la muestra al ajustarse: el resto es aire alrededor. */
export const SHOWCASE_FILL = 0.74;

/** Lo más que se agranda una muestra pequeña (un botón) y lo menos que se encoge una grande (una tabla). */
export const SHOWCASE_SCALE = { min: 0.3, max: 2.4 } as const;

/** Densidad de la captura: 2× para que el texto se lea nítido en pantallas densas. */
export const SHOWCASE_DENSITY = 2;

/** Lado de la imagen que se guarda, en px: la captura reducida; con la card más ancha (unos 380px de CSS) a 2× sobra. */
export const SHOWCASE_IMAGE = { width: 800, height: 500 } as const;

/** Calidad y esfuerzo de la compresión WebP. */
export const SHOWCASE_WEBP = { quality: 80, effort: 6 } as const;

/** Pesos máximos, en bytes: por imagen y de todas juntas (un test los vigila). */
export const SHOWCASE_MAX_BYTES = { each: 45 * 1024, total: 7 * 1024 * 1024 } as const;

export type ShowcaseTheme = "light" | "dark";

/** Nombre del fichero de la captura de un componente en un tema (`button-light.webp`). */
export const showcaseFile = (slug: string, theme: ShowcaseTheme) => `${slug}-${theme}.webp`;

/**
 * La escala con la que una muestra de `width`×`height` px ocupa `SHOWCASE_FILL` del marco, entre la mínima y la máxima.
 * La misma cuenta que hace la página de captura en el navegador.
 */
export function fitScale(width: number, height: number): number {
	const s = Math.min(
		(SHOWCASE_BOX.width * SHOWCASE_FILL) / width,
		(SHOWCASE_BOX.height * SHOWCASE_FILL) / height,
	);
	return Math.min(SHOWCASE_SCALE.max, Math.max(SHOWCASE_SCALE.min, s));
}
