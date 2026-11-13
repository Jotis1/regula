// Datos de las galerías de /icons/ (change adopt-untitled-ui-icons): iconos de línea, banderas y tipos de archivo de Untitled UI,
// y pagos y cursores de @jotis-me/assets. Las entradas salen de los paquetes: un recurso que el paquete quite, rompe aquí.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import * as cursors from "@jotis-me/assets/cursors";
import * as payments from "@jotis-me/assets/payments";
import * as flags from "@untitledui/country-flags";
import { FileIcon } from "@untitledui/file-icons";
import * as lineIcons from "@untitledui/icons";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { logoCode } from "../src/components/LogoGallery";
import categoriesByName from "../src/data/icon-categories.json";
import {
	buildEntries,
	CATEGORY_LABELS,
	CURSOR_CATEGORIES,
	componentName,
	countLogos,
	decodeCategories,
	decodeTitles,
	decodeUrls,
	encodeCategories,
	encodeTitles,
	encodeUrls,
	FILE_CATEGORIES,
	FILE_GROUP,
	fileIconTag,
	groupOptions,
	hasSvgModule,
	ICON_CATEGORIES,
	ICON_SETS,
	importPath,
	kebab,
	pascal,
	searchQuery,
	searchText,
	setTabs,
	svgModule,
} from "../src/lib/gallery";
import { FLAGS, ICON_NAMES } from "../src/lib/untitled";

const assetsPkg = join(import.meta.dirname, "../../../packages/assets");
const url = (kind: string, slug: string) => `/icons/svg/${kind}/${slug}.svg`;
const asUrls = (kind: string, slugs: string[]) =>
	Object.fromEntries(slugs.map((s) => [url(kind, s), url(kind, s)]));
const assetUrls = (dir: string) =>
	Object.fromEntries(
		readdirSync(join(assetsPkg, "dist", dir))
			.filter((f) => f.endsWith(".svg"))
			.map((f) => [`/dist/${dir}/${f}`, `/_astro/${f}`]),
	);

// Las categorías del Figma van por nombre con guiones; los iconos de Untitled UI, por nombre de componente
const categories: Record<string, string[]> = Object.fromEntries(
	Object.entries(categoriesByName as Record<string, string[]>).map(([k, names]) => [k, names.map(pascal)]),
);
const icons = () => buildEntries("icons", asUrls("icons", ICON_NAMES), categories);
const flagEntries = () =>
	buildEntries(
		"flags",
		asUrls(
			"flags",
			FLAGS.map((f) => f.code),
		),
		undefined,
		Object.fromEntries(FLAGS.map((f) => [f.code, f.title])),
	);
const files = () =>
	buildEntries(
		"files",
		asUrls(
			"files",
			Object.keys(FILE_GROUP).flatMap((t) => [t, `${t}-gray`, `${t}-solid`]),
		),
	);

describe("entradas de las galerías", () => {
	it("iconos: los del paquete, uno por nombre de componente, casi todos con categoría", () => {
		const entries = icons();
		expect(entries).toHaveLength(Object.keys(lineIcons).length);
		expect(entries.length).toBeGreaterThan(1100);
		expect(entries.every((e) => e.variants.length === 1)).toBe(true);
		expect(entries.find((e) => e.name === "Calendar")?.groups).toEqual(["time"]);
		// Los iconos que Untitled UI añadió después del Figma no tienen categoría, pero se ven y se buscan
		expect(entries.filter((e) => e.groups.length === 0).length).toBeLessThan(40);
	});

	it("banderas: las 234 en círculo, con el país en castellano", () => {
		const entries = flagEntries();
		expect(entries).toHaveLength(Object.keys(flags).filter((k) => /^Flag[A-Z]/.test(k)).length);
		for (const e of entries) expect(e.variants.map((v) => v.key)).toEqual(["circle"]);
		expect(entries.find((e) => e.name === "es")?.title).toBe("España");
		expect(entries.find((e) => e.name === "jp")?.title).toBe("Japón");
	});

	it("archivos: cada tipo con default, gray y solid, en su categoría", () => {
		const entries = files();
		expect(entries).toHaveLength(Object.keys(FILE_GROUP).length);
		for (const t of entries) expect(t.variants.map((v) => v.key)).toEqual(["default", "gray", "solid"]);
		expect(entries.find((e) => e.name === "fig")?.groups).toEqual(["design"]);
		expect(entries.find((e) => e.name === "pdf")?.groups).toEqual(["document"]);
		expect(entries.find((e) => e.name === "video-01")?.groups).toEqual(["media"]);
	});

	it("pagos: 56 métodos en sm y md", () => {
		const entries = buildEntries("payments", assetUrls("payments"));
		expect(entries).toHaveLength(56);
		for (const e of entries) expect(e.variants.map((v) => v.key)).toEqual(["sm", "md"]);
	});

	it("cursores: 50, clásicos y de macOS 26", () => {
		const entries = buildEntries("cursors", assetUrls("cursors"));
		expect(entries).toHaveLength(50);
		expect(entries.filter((e) => e.groups.includes("macos"))).toHaveLength(21);
		expect(entries.filter((e) => e.groups.includes("classic"))).toHaveLength(29);
	});
});

describe("nombres que coinciden con el paquete", () => {
	it("cada icono de línea y cada bandera es un componente que exporta su paquete", () => {
		const missing: string[] = [];
		for (const e of icons())
			if (typeof (lineIcons as Record<string, unknown>)[e.name] !== "function") missing.push(e.name);
		for (const e of flagEntries()) {
			const name = componentName("flags", e.name);
			const c = (flags as Record<string, unknown>)[name];
			if (!c) missing.push(name);
		}
		expect(missing).toEqual([]);
		expect(importPath("icons")).toBe("@untitledui/icons");
		expect(importPath("flags")).toBe("@untitledui/country-flags");
		expect(importPath("files")).toBe("@untitledui/file-icons");
	});

	it("cada tipo de archivo se pinta en sus tres variantes con FileIcon", () => {
		for (const type of Object.keys(FILE_GROUP))
			for (const variant of ["default", "gray", "solid"] as const) {
				const svg = renderToStaticMarkup(createElement(FileIcon, { type, variant }));
				expect(svg, `${type} ${variant}`).toMatch(/^<svg /);
			}
	});

	it("cada pago y cada cursor es un componente que exporta @jotis-me/assets", () => {
		const missing: string[] = [];
		for (const [kind, mod] of [
			["payments", payments],
			["cursors", cursors],
		] as const)
			for (const e of buildEntries(kind, assetUrls(kind)))
				for (const v of e.variants) {
					const name = componentName(kind, v.slug);
					if (typeof (mod as Record<string, unknown>)[name] !== "function") missing.push(name);
				}
		expect(missing).toEqual([]);
	});

	it("solo pagos y cursores tienen SVG importable, y su ruta existe en dist", () => {
		expect(hasSvgModule("icons")).toBe(false);
		expect(hasSvgModule("flags")).toBe(false);
		expect(hasSvgModule("files")).toBe(false);
		for (const kind of ["payments", "cursors"] as const) {
			expect(hasSvgModule(kind)).toBe(true);
			const first = buildEntries(kind, assetUrls(kind))[0]?.variants[0]?.slug as string;
			const file = svgModule(kind, first).replace("@jotis-me/assets/", "");
			expect(readdirSync(join(assetsPkg, "dist", file.split("/")[0] as string))).toContain(
				file.split("/")[1],
			);
		}
	});

	it("los iconos de archivo se escriben con un solo componente", () => {
		expect(fileIconTag("pdf", "default")).toBe('<FileIcon type="pdf" />');
		expect(fileIconTag("pdf", "gray", " size={40}")).toBe(
			'<FileIcon type="pdf" variant="gray" size={40} />',
		);
	});
});

describe("búsqueda", () => {
	it("acepta el nombre del componente y con guiones, sin mayúsculas", () => {
		const search = (q: string) =>
			icons()
				.filter((e) => searchText(e).includes(searchQuery(q)))
				.map((e) => e.name);
		expect(search("cal")).toContain("Calendar");
		expect(search("search-lg")).toContain("SearchLg");
		expect(search("SEARCHLG")).toContain("SearchLg");
		expect(search("rocket-02")).toContain("Rocket02");
		expect(kebab("AlignTopArrow01")).toBe("align-top-arrow-01");
	});

	it("las banderas se buscan por su nombre en castellano, con o sin tildes, y por su código", () => {
		const search = (q: string) =>
			flagEntries()
				.filter((e) => searchText(e).includes(searchQuery(q)))
				.map((e) => e.name);
		expect(search("españa")).toContain("es");
		expect(search("espana")).toContain("es");
		expect(search("japón")).toContain("jp");
		expect(search("jp")).toContain("jp");
	});
});

describe("filtro por categoría", () => {
	it("solo ofrece las categorías con elementos y cuenta cada una", () => {
		const opts = groupOptions(icons(), ICON_CATEGORIES);
		expect(opts).toHaveLength(19);
		expect(opts.find((o) => o.value === "general")?.label).toMatch(/^General \(\d+\)$/);
		expect(groupOptions(files(), FILE_CATEGORIES).map((o) => o.value)).toEqual([
			"generic",
			"document",
			"image",
			"media",
			"design",
			"development",
			"archive",
		]);
		expect(
			groupOptions(buildEntries("cursors", assetUrls("cursors")), CURSOR_CATEGORIES).map(
				(o) => o.label,
			),
		).toEqual(["Clásicos (29)", "macOS 26 (21)"]);
	});
});

describe("props compactas de la isla", () => {
	it("las URL, las categorías y los títulos ida y vuelta dan las mismas entradas", () => {
		const byUrl = icons();
		const rebuilt = buildEntries(
			"icons",
			decodeUrls(encodeUrls(asUrls("icons", ICON_NAMES))),
			decodeCategories(encodeCategories(categories)),
		);
		expect(rebuilt).toEqual(byUrl);
		const titles = Object.fromEntries(FLAGS.map((f) => [f.code, f.title]));
		expect(decodeTitles(encodeTitles(titles))).toEqual(titles);
	});

	it("el nombre sale del fichero aunque Vite le añada un hash o un `?no-inline`", () => {
		const hashed = buildEntries("payments", {
			"/_astro/visa-md.D8x2k.svg": "/_astro/visa-md.D8x2k.svg",
			"/@fs/C:/x/dist/payments/visa-sm.svg?no-inline": "/@fs/C:/x/dist/payments/visa-sm.svg?no-inline",
		});
		expect(hashed).toHaveLength(1);
		expect(hashed[0]?.name).toBe("visa");
		expect(hashed[0]?.variants.map((v) => v.slug)).toEqual(["visa-sm", "visa-md"]);
	});

	it("el prefijo común de las URL se quita del texto y se recupera entero", () => {
		const dev = {
			"/x/SearchLg.svg": "/icons/svg/icons/SearchLg.svg",
			"/x/Plus.svg": "/icons/svg/icons/Plus.svg",
		};
		const text = encodeUrls(dev);
		expect(text.split("\n")[0]).toBe("/icons/svg/icons/");
		expect(decodeUrls(text)).toEqual({
			SearchLg: "/icons/svg/icons/SearchLg.svg",
			Plus: "/icons/svg/icons/Plus.svg",
		});
	});

	it("viajan en pocos bytes: unos 40 por recurso", () => {
		const bytes = (s: string) => new TextEncoder().encode(s).length;
		expect(bytes(encodeUrls(asUrls("icons", ICON_NAMES)))).toBeLessThan(ICON_NAMES.length * 40);
		expect(bytes(encodeCategories(categories))).toBeLessThan(ICON_NAMES.length * 20);
	});
});

describe("el endpoint de SVG", () => {
	it("escribe un SVG con xmlns para cada icono, bandera y tipo de archivo (sin él no vale como imagen)", async () => {
		const { GET, getStaticPaths } = await import("../src/pages/icons/svg/[kind]/[slug].svg");
		const paths = (getStaticPaths as () => { params: { kind: string; slug: string } }[])();
		expect(paths).toHaveLength(ICON_NAMES.length + FLAGS.length + Object.keys(FILE_GROUP).length * 3);
		for (const { params } of [paths[0], paths[ICON_NAMES.length], paths.at(-1)] as typeof paths) {
			const res = await (GET as (a: unknown) => Promise<Response>)({ params });
			expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
			const svg = await res.text();
			expect(svg).toMatch(/^<svg /);
			expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
		}
	});
});

describe("navegación de sets (redesign-docs-site-v2, D7)", () => {
	const counts = { icons: 1181, logos: 282, flags: 234, payments: 56, files: 52, cursors: 50 };

	it("los seis sets conservan su URL y todos llevan `href`, para que `Tabs` los pinte como enlaces", () => {
		expect(ICON_SETS.map((s) => s.href)).toEqual([
			"/icons/",
			"/icons/logos/",
			"/icons/flags/",
			"/icons/payments/",
			"/icons/files/",
			"/icons/cursors/",
		]);
		const tabs = setTabs(counts);
		expect(tabs.every((t) => t.href.startsWith("/icons/"))).toBe(true);
		expect(tabs.find((t) => t.id === "flags")).toEqual({
			id: "flags",
			label: "Banderas",
			href: "/icons/flags/",
			count: 234,
		});
	});

	it("los logos se cuentan como en su galería: apps, integraciones y redes, sin contar los grises aparte", () => {
		const dir = join(assetsPkg, "dist/logos");
		const paths = readdirSync(dir).flatMap((set) =>
			readdirSync(join(dir, set)).map((f) => `/dist/logos/${set}/${f}`),
		);
		expect(countLogos(paths)).toBe(232 + 16 + 34);
		expect(
			countLogos([
				"/dist/logos/social/github.svg",
				"/dist/logos/social/github-gray.svg",
				"/dist/logos/app/github.svg",
				"/dist/logos/store/app-store.svg",
			]),
		).toBe(2);
	});

	it("cada categoría de una entrada tiene su nombre legible para la etiqueta del panel", () => {
		for (const [kind, entries] of [
			["icons", icons()],
			["files", files()],
		] as const)
			for (const e of entries)
				for (const g of e.groups) expect(CATEGORY_LABELS[kind]?.[g], `${kind}: ${g}`).toBeTruthy();
		expect(CATEGORY_LABELS.flags).toBeUndefined();
	});
});

describe("código del logo elegido", () => {
	it("importa el de color y, si lo hay, el gris, de @jotis-me/assets/logos", () => {
		const [react, astro] = logoCode(
			{ set: "social", name: "github", url: "/a.svg", gray: { url: "/b.svg", mono: true } },
			null,
		);
		expect(react?.code).toContain(
			'import { SocialGithubLogo, SocialGithubLogoGray } from "@jotis-me/assets/logos";',
		);
		expect(react?.code).toContain('<SocialGithubLogoGray size={24} title="github" />');
		expect(astro?.code).toContain('"@jotis-me/assets/logos/social/github.svg?raw"');
		const [solo] = logoCode({ set: "app", name: "figma", url: "/a.svg" }, null);
		expect(solo?.code).toContain('import { AppFigmaLogo } from "@jotis-me/assets/logos";');
	});
});
