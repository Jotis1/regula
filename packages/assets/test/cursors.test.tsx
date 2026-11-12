import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it } from "vitest";
import { cursorSlug } from "../scripts/import-cursors.ts";
import { CursorDefault, CursorHandGrab, CursorMacosDefault, cursorNames } from "../src/cursors.js";

const pkg = join(import.meta.dirname, "..");
const assets = join(pkg, "assets/cursors");
const files = readdirSync(assets).filter((f) => f.endsWith(".svg"));
const read = (f: string) => readFileSync(join(assets, f), "utf8");
const size = (f: string) => {
	const m = read(f).match(/ width="([\d.]+)" height="([\d.]+)" viewBox="(\S+) (\S+) ([\d.]+) ([\d.]+)"/);
	return { w: Number(m?.[1]), h: Number(m?.[2]), vw: Number(m?.[5]), vh: Number(m?.[6]) };
};

describe("cursores (assets/cursors)", () => {
	it("29 clásicos y 21 de macOS 26", () => {
		expect(files).toHaveLength(50);
		expect(files.filter((f) => f.startsWith("macos-"))).toHaveLength(21);
	});

	it("nombra en kebab-case y distingue los de macOS 26", () => {
		for (const f of files) expect(f, f).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/);
		expect(cursorSlug("Hand grab")).toBe("hand-grab");
		expect(cursorSlug("Default")).toBe("default");
		expect(cursorSlug("Default (macOS 26)")).toBe("macos-default");
		expect(cursorSlug("Resize (north-south) (macOS 26)")).toBe("macos-resize-north-south");
		expect(cursorSlug("Hand (pointing) (macOS 26)")).toBe("macos-hand-pointing");
		for (const needed of [
			"default",
			"text-cursor",
			"hand-point",
			"hand-grab",
			"zoom-in",
			"help",
			"macos-beachball",
		])
			expect(files, needed).toContain(`${needed}.svg`);
	});

	it("los clásicos miden 20×20 y los de macOS 26 crecen donde la flecha sobresale, sin pasar de 40", () => {
		const problems: string[] = [];
		for (const f of files) {
			const { w, h, vw, vh } = size(f);
			if (w !== vw || h !== vh) problems.push(`${f}: tamaño ${w}×${h} y viewBox ${vw}×${vh}`);
			if (!f.startsWith("macos-") && (w !== 20 || h !== 20))
				problems.push(`${f}: ${w}×${h}, se esperaba 20×20`);
			if (w < 20 || h < 20 || w > 40 || h > 40) problems.push(`${f}: ${w}×${h} fuera de 20..40`);
		}
		expect(problems).toEqual([]);
	});

	it("solo dibujo y sombra: nada de imágenes, foreignObject ni enlaces externos, y ids con prefijo", () => {
		const problems: string[] = [];
		for (const f of files) {
			const svg = read(f);
			if (/<(image|foreignObject|script|style)\b/i.test(svg))
				problems.push(`${f}: elemento no permitido`);
			if (/https?:\/\/(?!www\.w3\.org)/.test(svg)) problems.push(`${f}: enlace externo`);
			const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1] as string);
			if (new Set(ids).size !== ids.length) problems.push(`${f}: ids repetidos`);
			for (const id of ids) if (!id.startsWith("c-")) problems.push(`${f}: id «${id}» sin prefijo`);
		}
		expect(problems).toEqual([]);
	});
});

describe("componentes de cursor", () => {
	it("cursorNames lista los mismos ficheros", () => {
		expect([...cursorNames].sort()).toEqual(files.map((f) => f.replace(/\.svg$/, "")).sort());
	});

	it("es decorativo por defecto y se mide por su alto", () => {
		const svg = render(<CursorDefault />).container.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("height")).toBe("20");
		expect(svg?.getAttribute("width")).toBe("20");
		const mac = render(<CursorMacosDefault size={54} />).container.querySelector("svg");
		expect(mac?.getAttribute("height")).toBe("54");
		expect(Number(mac?.getAttribute("width"))).toBeLessThan(54);
	});

	it("con title es una imagen con ese nombre", () => {
		render(<CursorHandGrab title="Arrastrando" />);
		expect(screen.getByRole("img", { name: "Arrastrando" })).toBeTruthy();
	});
});

describe("publicación", () => {
	const dist = join(pkg, "dist");
	const dir = mkdtempSync(join(tmpdir(), "cursors-bundle-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("dist/cursors tiene los mismos SVG", () => {
		expect(existsSync(join(dist, "cursors")), "hace falta `bun run build` antes").toBe(true);
		expect(readdirSync(join(dist, "cursors")).sort()).toEqual([...files].sort());
	});

	it("al empaquetar solo CursorHandGrab no entra ningún otro cursor", () => {
		const built = join(dist, "cursors.js");
		expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
		const entry = join(dir, "entry.js");
		writeFileSync(
			entry,
			`import { CursorHandGrab } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default CursorHandGrab;\n`,
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
		const firstPath = (f: string) => read(f).match(/<path[^>]* d="([^"]+)"/)?.[1] as string;
		expect(code).toContain(firstPath("hand-grab.svg"));
		const leaked = files
			.filter((f) => f !== "hand-grab.svg")
			.filter((f) => {
				const d = firstPath(f);
				return d && d.length > 60 && code.includes(d);
			});
		expect(leaked).toEqual([]);
	});
});
