// Las fotos de las cards de /components/, recortadas en el build (src/lib/previews.ts): un fichero WebP por
// componente y tema.
import type { APIRoute } from "astro";
import { catalogComponents } from "../../../lib/catalog";
import { preview } from "../../../lib/previews";

export function getStaticPaths() {
	return catalogComponents().flatMap((name) =>
		(["light", "dark"] as const).map((theme) => ({
			params: { file: `${name}-${theme}` },
			props: { name, theme },
		})),
	);
}

export const GET: APIRoute = async ({ props }) => {
	const { data } = await preview(props.name, props.theme);
	return new Response(new Uint8Array(data), { headers: { "Content-Type": "image/webp" } });
};
