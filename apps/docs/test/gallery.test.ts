import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as icons from "@jotis-me/icons";
import * as cursors from "@jotis-me/icons/cursors";
import * as files from "@jotis-me/icons/files";
import * as flags from "@jotis-me/icons/flags";
import * as payments from "@jotis-me/icons/payments";
import { describe, expect, it } from "vitest";
import {
	buildEntries,
	CURSOR_CATEGORIES,
	componentName,
	decodeCategories,
	decodeUrls,
	encodeCategories,
	encodeUrls,
	FILE_CATEGORIES,
	type GalleryKind,
	groupOptions,
	ICON_CATEGORIES,
	importPath,
	svgModule,
} from "../src/lib/gallery";

const pkg = join(import.meta.dirname, "../../../packages/icons");
const dir: Record<GalleryKind, string> = {
	icons: "svg",
	flags: "flags",
	payments: "payments",
	files: "files",
	cursors: "cursors",
};
const urls = (kind: GalleryKind) =>
	Object.fromEntries(
		readdirSync(join(pkg, "dist", dir[kind]))
			.filter((f) => f.endsWith(".svg"))
			.map((f) => [`/dist/${dir[kind]}/${f}`, `/_astro/${f}`]),
	);
const categories: Record<string, string[]> = JSON.parse(
	readFileSync(join(pkg, "assets/icon-categories.json"), "utf8"),
);
const modules: Record<GalleryKind, Record<string, unknown>> = { icons, flags, payments, files, cursors };
const all = (kind: GalleryKind) => buildEntries(kind, urls(kind), kind === "icons" ? categories : undefined);

describe("entradas de las galerías", () => {
	it("iconos: 1.172, uno por nombre, con su categoría", () => {
		const entries = all("icons");
		expect(entries).toHaveLength(1172);
		expect(entries.every((e) => e.variants.length === 1)).toBe(true);
		expect(entries.find((e) => e.name === "calendar")?.groups).toEqual(["time"]);
		// «colors» está en dos categorías del Figma con el mismo dibujo
		expect(entries.find((e) => e.name === "colors")?.groups.sort()).toEqual(["editor", "images"]);
		expect(entries.every((e) => e.groups.length > 0)).toBe(true);
	});

	it("banderas: 261 países con círculo, cuadrado y rectángulo en ese orden", () => {
		const entries = all("flags");
		expect(entries).toHaveLength(261);
		for (const e of entries)
			expect(e.variants.map((v) => v.key)).toEqual(["circle", "square", "rectangle"]);
		expect(entries.find((e) => e.name === "spain")?.variants[0]?.slug).toBe("spain-circle");
	});

	it("pagos: 56 métodos en sm y md", () => {
		const entries = all("payments");
		expect(entries).toHaveLength(56);
		for (const e of entries) expect(e.variants.map((v) => v.key)).toEqual(["sm", "md"]);
	});

	it("archivos: 51 tipos con default, gray y solid, y 4 carpetas cerradas y abiertas", () => {
		const entries = all("files");
		const folders = entries.filter((e) => e.groups.includes("folder"));
		expect(folders.map((f) => f.name).sort()).toEqual([
			"folder-brand",
			"folder-gray",
			"folder-noise",
			"folder-transparent",
		]);
		for (const f of folders) expect(f.variants.map((v) => v.key)).toEqual(["closed", "open"]);
		const types = entries.filter((e) => !e.groups.includes("folder"));
		expect(types).toHaveLength(51);
		for (const t of types) expect(t.variants.map((v) => v.key)).toEqual(["default", "gray", "solid"]);
		expect(entries.find((e) => e.name === "design-fig")?.groups).toEqual(["design"]);
		expect(entries.find((e) => e.name === "generic-video-01")?.groups).toEqual(["generic"]);
	});

	it("cursores: 50, clásicos y de macOS 26", () => {
		const entries = all("cursors");
		expect(entries).toHaveLength(50);
		expect(entries.filter((e) => e.groups.includes("macos"))).toHaveLength(21);
		expect(entries.filter((e) => e.groups.includes("classic"))).toHaveLength(29);
	});
});

describe("nombres que coinciden con el paquete", () => {
	for (const kind of ["icons", "flags", "payments", "files", "cursors"] as const) {
		it(`cada variante de ${kind} es un componente que exporta ${importPath(kind)}`, () => {
			const missing: string[] = [];
			for (const e of all(kind))
				for (const v of e.variants) {
					const name = componentName(kind, v.slug);
					if (typeof modules[kind][name] !== "function") missing.push(name);
				}
			expect(missing).toEqual([]);
		});
	}

	it("la ruta del SVG existe en dist", () => {
		for (const kind of ["icons", "flags", "payments", "files", "cursors"] as const) {
			const first = all(kind)[0]?.variants[0]?.slug as string;
			const file = svgModule(kind, first).replace("@jotis-me/icons/", "");
			expect(readdirSync(join(pkg, "dist", file.split("/")[0] as string))).toContain(
				file.split("/")[1],
			);
		}
	});
});

describe("filtro por categoría", () => {
	it("solo ofrece las categorías con elementos y cuenta cada una", () => {
		const opts = groupOptions(all("icons"), ICON_CATEGORIES);
		expect(opts).toHaveLength(19);
		expect(opts.find((o) => o.value === "general")?.label).toBe("General (193)");
		expect(groupOptions(all("files"), FILE_CATEGORIES).map((o) => o.value)).toEqual([
			"generic",
			"document",
			"image",
			"media",
			"design",
			"development",
			"archive",
			"folder",
		]);
		expect(groupOptions(all("cursors"), CURSOR_CATEGORIES).map((o) => o.label)).toEqual([
			"Clásicos (29)",
			"macOS 26 (21)",
		]);
	});
});

describe("props compactas de la isla", () => {
	it("las URL y las categorías ida y vuelta dan las mismas entradas", () => {
		const byUrl = all("icons");
		const rebuilt = buildEntries(
			"icons",
			decodeUrls(encodeUrls(urls("icons"))),
			decodeCategories(encodeCategories(categories)),
		);
		expect(rebuilt).toEqual(byUrl);
	});

	it("el nombre sale del fichero aunque Vite le añada un hash o un `?no-inline`", () => {
		const hashed = buildEntries("flags", {
			"/_astro/spain-circle.D8x2k.svg": "/_astro/spain-circle.D8x2k.svg",
			"/@fs/C:/x/dist/flags/spain-square.svg?no-inline":
				"/@fs/C:/x/dist/flags/spain-square.svg?no-inline",
		});
		expect(hashed).toHaveLength(1);
		expect(hashed[0]?.name).toBe("spain");
		expect(hashed[0]?.variants.map((v) => v.slug)).toEqual(["spain-circle", "spain-square"]);
	});

	it("dos iconos con el mismo dibujo comparten URL (Vite junta los SVG idénticos) y siguen siendo dos entradas", () => {
		const shared = {
			"/dist/svg/alert-circle.svg": "/_astro/alert-circle.D8x2k.svg",
			"/dist/svg/alert-circle-copy.svg": "/_astro/alert-circle.D8x2k.svg",
			"/dist/svg/zap.svg": "/_astro/zap.QQ11aa.svg",
		};
		const entries = buildEntries("icons", decodeUrls(encodeUrls(shared)));
		expect(entries.map((e) => e.name)).toEqual(["alert-circle", "alert-circle-copy", "zap"]);
		expect(entries[1]?.variants[0]?.url).toBe("/_astro/alert-circle.D8x2k.svg");
	});

	it("el prefijo común de las URL se quita del texto y se recupera entero, también con ?no-inline", () => {
		const dev = {
			"/x/a.svg": "/@fs/C:/p/dist/svg/a.svg?no-inline",
			"/x/b.svg": "/@fs/C:/p/dist/svg/b.svg?no-inline",
		};
		const text = encodeUrls(dev);
		expect(text.split("\n")[0]).toBe("/@fs/C:/p/dist/svg/");
		expect(decodeUrls(text)).toEqual({
			a: "/@fs/C:/p/dist/svg/a.svg?no-inline",
			b: "/@fs/C:/p/dist/svg/b.svg?no-inline",
		});
	});

	it("viajan en pocos bytes: unos 60 por recurso", () => {
		const bytes = (s: string) => new TextEncoder().encode(s).length;
		const withHash = Object.fromEntries(
			Object.keys(urls("icons")).map((p) => [
				p,
				`/_astro/${p.split("/").pop()?.replace(".svg", ".D8x2kQ.svg")}`,
			]),
		);
		expect(bytes(encodeUrls(withHash))).toBeLessThan(1172 * 65);
		expect(bytes(encodeCategories(categories))).toBeLessThan(1172 * 20);
	});
});
