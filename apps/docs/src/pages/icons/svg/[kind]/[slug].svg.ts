// Los iconos de línea, las banderas y los iconos de archivo de Untitled UI como ficheros SVG: las galerías los cargan como
// imágenes perezosas (no hay código de iconos en sus islas). Se escriben en el build, no se guardan en el repo.
import { FileIcon } from "@untitledui/file-icons";
import type { APIRoute, GetStaticPaths } from "astro";
import {
	FILE_TYPES,
	FLAGS,
	flagComponent,
	ICON_NAMES,
	lineIconComponent,
	svgOf,
} from "../../../../lib/untitled";

export const getStaticPaths = (() => [
	...ICON_NAMES.map((slug) => ({ params: { kind: "icons", slug } })),
	...FLAGS.map(({ code }) => ({ params: { kind: "flags", slug: code } })),
	...Object.keys(FILE_TYPES).flatMap((type) =>
		["", "-gray", "-solid"].map((suffix) => ({ params: { kind: "files", slug: `${type}${suffix}` } })),
	),
]) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
	const { kind, slug = "" } = params;
	let svg = "";
	if (kind === "icons") svg = svgOf(lineIconComponent(slug), { size: 24 });
	else if (kind === "flags") svg = svgOf(flagComponent(slug), { size: 24 });
	else if (kind === "files") {
		const m = slug.match(/^(.*?)(?:-(gray|solid))?$/) as RegExpMatchArray;
		svg = svgOf(FileIcon, { type: m[1], variant: m[2] ?? "default", size: 40 });
	}
	return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
