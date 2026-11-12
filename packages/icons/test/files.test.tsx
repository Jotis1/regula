import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it } from "vitest";
import { fileSlug, folderSlug, stripBackdropBlur, withXlink } from "../scripts/import-files.ts";
import {
	FileDocumentPdf,
	FileGenericFolderGray,
	FolderBrand,
	FolderBrandOpen,
	fileNames,
} from "../src/files.js";
import * as main from "../src/index.js";

const pkg = join(import.meta.dirname, "..");
const assets = join(pkg, "assets/files");
const files = readdirSync(assets).filter((f) => f.endsWith(".svg"));
const folders = files.filter((f) => f.startsWith("folder-"));
const types = files.filter((f) => !f.startsWith("folder-"));
const read = (f: string) => readFileSync(join(assets, f), "utf8");
const TEXTURED = [
	"folder-noise.svg",
	"folder-noise-open.svg",
	"folder-transparent.svg",
	"folder-transparent-open.svg",
];

describe("iconos de archivo y carpeta (assets/files)", () => {
	it("153 tipos de archivo y 8 carpetas", () => {
		expect(types).toHaveLength(153);
		expect(folders.sort()).toEqual(
			[
				"folder-brand-open.svg",
				"folder-brand.svg",
				"folder-gray-open.svg",
				"folder-gray.svg",
				"folder-noise-open.svg",
				"folder-noise.svg",
				"folder-transparent-open.svg",
				"folder-transparent.svg",
			].sort(),
		);
	});

	it("cada tipo de archivo está en default, gray y solid", () => {
		const base = new Map<string, string[]>();
		for (const f of types) {
			const m = f.match(/^(.*?)(?:-(gray|solid))?\.svg$/) as RegExpMatchArray;
			base.set(m[1] as string, [
				...(base.get(m[1] as string) ?? []),
				(m[2] as string | undefined) ?? "default",
			]);
		}
		expect(base.size).toBe(51);
		for (const [name, variants] of base)
			expect(variants.sort(), name).toEqual(["default", "gray", "solid"]);
		const byCategory: Record<string, number> = {};
		for (const name of base.keys()) {
			const cat = name.split("-")[0] as string;
			byCategory[cat] = (byCategory[cat] ?? 0) + 1;
		}
		expect(byCategory).toEqual({
			archive: 2,
			design: 5,
			development: 10,
			document: 9,
			generic: 10,
			image: 9,
			media: 6,
		});
	});

	it("nombra en kebab-case, sin repetir y sin los paréntesis del Figma", () => {
		for (const f of files) expect(f, f).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/);
		expect(fileSlug("Design / FIG (Figma)", "Gray")).toBe("design-fig-gray");
		expect(fileSlug("Design / AI (Illustrator)", "Default")).toBe("design-ai");
		expect(fileSlug("Simple / Video 01", "Default")).toBe("generic-video-01");
		expect(fileSlug("Default / Image", "Solid")).toBe("generic-image-solid");
		expect(fileSlug("Image / WebP", "Default")).toBe("image-webp");
		expect(folderSlug("Type=Brand, Open=True")).toBe("folder-brand-open");
		expect(folderSlug("Type=Noise, Open=False")).toBe("folder-noise");
	});

	it("tamaños: 40×40 los tipos de archivo, 48×48 las carpetas cerradas y 54×48 las abiertas", () => {
		const problems: string[] = [];
		for (const f of files) {
			const svg = read(f);
			const [w, h] = f.startsWith("folder-")
				? f.endsWith("-open.svg")
					? [54, 48]
					: [48, 48]
				: [40, 40];
			const m = svg.match(
				/ width="([\d.]+)" height="([\d.]+)" viewBox="(\S+) (\S+) ([\d.]+) ([\d.]+)"/,
			);
			if (!m) problems.push(`${f}: cabecera inesperada`);
			else if (Number(m[1]) !== w || Number(m[2]) !== h || Number(m[5]) !== w || Number(m[6]) !== h)
				problems.push(`${f}: tamaño ${m[1]}×${m[2]}, viewBox ${m[5]}×${m[6]}, esperado ${w}×${h}`);
		}
		expect(problems).toEqual([]);
	});

	it("solo las carpetas con textura llevan una imagen, embebida; nada de foreignObject ni de enlaces externos", () => {
		const problems: string[] = [];
		for (const f of files) {
			const svg = read(f);
			const images = svg.match(/<image\b/g)?.length ?? 0;
			if (TEXTURED.includes(f)) {
				if (images !== 1) problems.push(`${f}: ${images} imágenes, se esperaba 1`);
				if (!/href="data:image\/png;base64,/.test(svg))
					problems.push(`${f}: la imagen no está embebida`);
			} else if (images) problems.push(`${f}: lleva una imagen`);
			if (/<(foreignObject|script|style)\b/i.test(svg)) problems.push(`${f}: elemento no permitido`);
			if (/https?:\/\/(?!www\.w3\.org)/.test(svg)) problems.push(`${f}: enlace externo`);
			const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1] as string);
			if (new Set(ids).size !== ids.length) problems.push(`${f}: ids repetidos`);
		}
		expect(problems).toEqual([]);
	});

	it("stripBackdropBlur quita el desenfoque de fondo y su recorte", () => {
		const svg =
			'<svg><defs><clipPath id="c1"><path d="M0 0"/></clipPath></defs><foreignObject x="1"><div style="clip-path:url(#c1)"></div></foreignObject><path d="M1 1"/></svg>';
		expect(stripBackdropBlur(svg)).toBe('<svg><path d="M1 1"/></svg>');
	});

	it("withXlink declara el espacio de nombres solo si hace falta", () => {
		const a = '<svg xmlns="http://www.w3.org/2000/svg" width="1"><image xlink:href="data:x"/></svg>';
		expect(withXlink(a)).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
		const b = '<svg xmlns="http://www.w3.org/2000/svg" width="1"><path d="M0 0"/></svg>';
		expect(withXlink(b)).toBe(b);
	});
});

describe("componentes de archivo y carpeta", () => {
	it("fileNames lista los mismos ficheros", () => {
		expect([...fileNames].sort()).toEqual(files.map((f) => f.replace(/\.svg$/, "")).sort());
	});

	it("se miden por su alto y son decorativos por defecto", () => {
		const doc = render(<FileDocumentPdf />).container.querySelector("svg");
		expect(doc?.getAttribute("width")).toBe("40");
		expect(doc?.getAttribute("height")).toBe("40");
		expect(doc?.getAttribute("aria-hidden")).toBe("true");
		const closed = render(<FolderBrand />).container.querySelector("svg");
		expect(closed?.getAttribute("width")).toBe("48");
		const open = render(<FolderBrandOpen size={96} />).container.querySelector("svg");
		expect(open?.getAttribute("height")).toBe("96");
		expect(open?.getAttribute("width")).toBe("108");
	});

	it("con title es una imagen con ese nombre", () => {
		render(<FileGenericFolderGray title="Carpeta" />);
		expect(screen.getByRole("img", { name: "Carpeta" })).toBeTruthy();
	});

	it("la entrada principal no exporta ninguno", () => {
		expect(Object.keys(main).filter((k) => /^(File|Folder)/.test(k))).toEqual([]);
	});
});

describe("publicación", () => {
	const dist = join(pkg, "dist");
	const dir = mkdtempSync(join(tmpdir(), "files-bundle-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("dist/files tiene los mismos SVG", () => {
		expect(existsSync(join(dist, "files")), "hace falta `bun run build` antes").toBe(true);
		expect(readdirSync(join(dist, "files")).sort()).toEqual([...files].sort());
	});

	it("al empaquetar solo FileDocumentPdf no entra ningún otro icono", () => {
		const built = join(dist, "files.js");
		expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
		const entry = join(dir, "entry.js");
		writeFileSync(
			entry,
			`import { FileDocumentPdf } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default FileDocumentPdf;\n`,
		);
		const out = join(dir, "out.js");
		const run = spawnSync(
			"bun",
			[
				"build",
				entry,
				"--outfile",
				out,
				"--minify",
				"--external",
				"react",
				"--external",
				"react/jsx-runtime",
			],
			{ encoding: "utf8" },
		);
		expect(run.status, run.stderr).toBe(0);
		const code = readFileSync(out, "utf8");
		const firstPath = (f: string) => read(f).match(/<path d="([^"]+)"/)?.[1] as string;
		expect(code).toContain(firstPath("document-pdf.svg"));
		const leaked = files
			.filter((f) => f !== "document-pdf.svg")
			.filter((f) => {
				const d = firstPath(f);
				return d && d.length > 60 && code.includes(d);
			});
		expect(leaked).toEqual([]);
		expect(code.length).toBeLessThan(15_000);
	});
});
