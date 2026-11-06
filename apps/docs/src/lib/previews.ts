// Fotos de las cards de /components/ (decisión del usuario, 3 nov): la captura aprobada que usa la paridad visual
// (e2e/visual/approved/<Nombre>-<light|dark>.png), recortada en el build. Las capturas miden 800px
// de ancho con el componente en medio de mucho margen; se quita el margen (el color de la esquina, el fondo de la
// vista previa), se deja un borde igual alrededor y se pasa a WebP. El test de paridad asegura que nuestro
// componente se ve como la captura.

import { join } from "node:path";
import sharp from "sharp";

export type PreviewTheme = "light" | "dark";

// Desde la raíz de la web (donde corre `astro build`): en el build el módulo se empaqueta y `import.meta.url` ya
// no apunta a src/lib
const APPROVED = join(process.cwd(), "e2e/visual/approved");
/** Borde alrededor del componente recortado, en px de la captura. */
const PAD = 24;
/** Ancho máximo de la foto: el doble del de la card más ancha (~330px), para pantallas de alta densidad. */
const MAX_WIDTH = 720;

export interface Preview {
	data: Buffer;
	/** El fondo de la vista previa (el color de su esquina), para rellenar la card alrededor de la foto. */
	background: string;
	width: number;
	height: number;
}

const cache = new Map<string, Promise<Preview>>();

async function build(name: string, theme: PreviewTheme): Promise<Preview> {
	const source = sharp(join(APPROVED, `${name}-${theme}.png`));
	const { data: corner } = await source
		.clone()
		.extract({ left: 0, top: 0, width: 1, height: 1 })
		.raw()
		.toBuffer({ resolveWithObject: true });
	const background = { r: corner[0] ?? 255, g: corner[1] ?? 255, b: corner[2] ?? 255, alpha: 1 };
	const trimmed = await source.clone().trim({ background, threshold: 8 }).toBuffer();
	// En dos pasos: sharp aplica `resize` antes que `extend` aunque se encadenen al revés
	const padded = await sharp(trimmed)
		.extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background })
		.toBuffer();
	const { data, info } = await sharp(padded)
		.resize({ width: MAX_WIDTH, withoutEnlargement: true })
		.webp({ quality: 82 })
		.toBuffer({ resolveWithObject: true });
	const hex = (n: number) => n.toString(16).padStart(2, "0");
	return {
		data,
		background: `#${hex(background.r)}${hex(background.g)}${hex(background.b)}`,
		width: info.width,
		height: info.height,
	};
}

/** La foto recortada de un componente en un tema (se calcula una vez por build). */
export function preview(name: string, theme: PreviewTheme): Promise<Preview> {
	const key = `${name}-${theme}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const built = build(name, theme);
	cache.set(key, built);
	return built;
}

/** La URL de la foto: la sirve `src/pages/components/previews/[file].webp.ts`. */
export const previewUrl = (name: string, theme: PreviewTheme) => `/components/previews/${name}-${theme}.webp`;
