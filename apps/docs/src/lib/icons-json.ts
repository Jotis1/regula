// The public JSON `/icons.json` (spec mcp-server, «Datos públicos en JSON»): every entry of every gallery with how it
// is imported. It does not carry the SVG drawings: `url` opens the gallery with the icon chosen.
import { componentName, fileIconTag, type GalleryEntry, type GalleryKind, importPath } from "./gallery";

export const GALLERIES: readonly GalleryKind[] = ["icons", "flags", "files", "payments", "cursors"];

export function iconsJson(galleries: Record<GalleryKind, GalleryEntry[]>, version: string, site: string) {
	const entries = GALLERIES.flatMap((kind) =>
		galleries[kind].map((e) => {
			const variants = e.variants.map((v) => {
				const component = componentName(kind, v.slug);
				return {
					key: v.key,
					component,
					usage: kind === "files" ? fileIconTag(e.name, v.key) : `<${component} />`,
				};
			});
			const components = [...new Set(variants.map((v) => v.component))];
			const page = kind === "icons" ? "/icons/" : `/icons/${kind}/`;
			return {
				gallery: kind,
				name: e.name,
				title: e.title ?? null,
				groups: e.groups,
				variants,
				import: `import { ${components.join(", ")} } from "${importPath(kind)}";`,
				url: new URL(`${page}?icon=${encodeURIComponent(e.name)}`, site).href,
			};
		}),
	);
	return { version, galleries: GALLERIES, entries };
}
