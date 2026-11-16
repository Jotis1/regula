// The entries of each gallery under /icons/: the SVG URLs and the data `buildEntries` groups. The gallery pages and the
// public `/icons.json` use the same functions, so they list the same icons (spec mcp-server, «Datos públicos en JSON»).
import categoriesByName from "../data/icon-categories.json";
import { buildEntries, FILE_GROUP, type GalleryEntry, type GalleryKind, pascal } from "./gallery";
import { FLAGS, ICON_NAMES } from "./untitled";

const payments = import.meta.glob<string>("../../../../packages/assets/dist/payments/*.svg", {
	query: "?no-inline",
	import: "default",
	eager: true,
});
const cursors = import.meta.glob<string>("../../../../packages/assets/dist/cursors/*.svg", {
	query: "?no-inline",
	import: "default",
	eager: true,
});

const served = (paths: string[]) => Object.fromEntries(paths.map((p) => [p, p]));

/** Path of each SVG to the URL the island loads it from. */
export function galleryUrls(kind: GalleryKind): Record<string, string> {
	switch (kind) {
		case "icons":
			return served(ICON_NAMES.map((n) => `/icons/svg/icons/${n}.svg`));
		case "flags":
			return served(FLAGS.map(({ code }) => `/icons/svg/flags/${code}.svg`));
		case "files":
			return served(
				Object.keys(FILE_GROUP).flatMap((type) =>
					["", "-gray", "-solid"].map((s) => `/icons/svg/files/${type}${s}.svg`),
				),
			);
		case "payments":
			return payments;
		case "cursors":
			return cursors;
	}
}

/** Categories of the line icons: category → component names (the Figma ones go by hyphenated name). */
export const iconCategories = (): Record<string, string[]> =>
	Object.fromEntries(
		Object.entries(categoriesByName as Record<string, string[]>).map(([k, names]) => [
			k,
			names.map(pascal),
		]),
	);

/** Flag code → country name in Spanish. */
export const flagTitles = (): Record<string, string> =>
	Object.fromEntries(FLAGS.map(({ code, title }) => [code, title]));

export function galleryEntries(kind: GalleryKind): GalleryEntry[] {
	return buildEntries(
		kind,
		galleryUrls(kind),
		kind === "icons" ? iconCategories() : undefined,
		kind === "flags" ? flagTitles() : undefined,
	);
}
