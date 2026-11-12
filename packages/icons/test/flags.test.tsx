import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it } from "vitest";
import { flagSlug } from "../scripts/import-flags.ts";
import {
	FlagCanaryIslandsRectangle,
	FlagSpainCircle,
	FlagSpainRectangle,
	FlagSpainSquare,
	flagNames,
} from "../src/flags.js";
import * as main from "../src/index.js";

const pkg = join(import.meta.dirname, "..");
const assets = join(pkg, "assets/flags");
const files = readdirSync(assets).filter((f) => f.endsWith(".svg"));
const read = (f: string) => readFileSync(join(assets, f), "utf8");
const SHAPES = { circle: [20, 20], square: [20, 20], rectangle: [30, 20] } as const;

describe("banderas (assets/flags)", () => {
	it("261 países en círculo, cuadrado y rectángulo", () => {
		expect(files).toHaveLength(261 * 3);
		const byCountry = new Map<string, string[]>();
		for (const f of files) {
			const m = f.match(/^(.*)-(circle|square|rectangle)\.svg$/);
			expect(m, f).toBeTruthy();
			byCountry.set(m?.[1] as string, [...(byCountry.get(m?.[1] as string) ?? []), m?.[2] as string]);
		}
		expect(byCountry.size).toBe(261);
		for (const [country, shapes] of byCountry)
			expect(shapes.sort(), country).toEqual(["circle", "rectangle", "square"]);
	});

	it("nombra por el país o la región en kebab-case, sin repetir", () => {
		for (const f of files)
			expect(f, f).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*-(circle|square|rectangle)\.svg$/);
		for (const needed of [
			"spain",
			"scotland",
			"canary-islands",
			"portugal",
			"azores-islands",
			"italy",
			"sardinia",
			"moldova",
			"transnistria",
			"united-states-of-america",
		])
			expect(files, needed).toContain(`${needed}-circle.svg`);
	});

	it("flagSlug quita el código del Figma", () => {
		expect(flagSlug("Spain-ES")).toBe("spain");
		expect(flagSlug("Scotland-GB-SCT")).toBe("scotland");
		expect(flagSlug("Madeira-PT-30")).toBe("madeira");
		expect(flagSlug("Canary-Islands")).toBe("canary-islands");
		expect(flagSlug("Aland-Islands-AX")).toBe("aland-islands");
		expect(flagSlug("European-Union")).toBe("european-union");
	});

	it("cada SVG tiene el tamaño de su forma y su viewBox, sin ids ni nada que no sea dibujo", () => {
		const problems: string[] = [];
		for (const f of files) {
			const svg = read(f);
			const shape = f.match(/-(circle|square|rectangle)\.svg$/)?.[1] as keyof typeof SHAPES;
			const [w, h] = SHAPES[shape];
			const m = svg.match(
				/^<svg [^>]*width="([\d.]+)" height="([\d.]+)" viewBox="(\S+) (\S+) ([\d.]+) ([\d.]+)"/,
			);
			if (!m) problems.push(`${f}: cabecera inesperada`);
			else if (Number(m[1]) !== w || Number(m[2]) !== h || Number(m[5]) !== w || Number(m[6]) !== h)
				problems.push(`${f}: tamaño ${m[1]}×${m[2]}, viewBox ${m[5]}×${m[6]}, esperado ${w}×${h}`);
			if (/\sid="/.test(svg)) problems.push(`${f}: lleva ids`);
			if (/<(image|foreignObject|script|style)\b/i.test(svg))
				problems.push(`${f}: elemento no permitido`);
			if (/currentColor/.test(svg)) problems.push(`${f}: usa currentColor`);
		}
		expect(problems).toEqual([]);
	});
});

describe("componentes de banderas", () => {
	it("flagNames lista los mismos ficheros", () => {
		expect([...flagNames].sort()).toEqual(files.map((f) => f.replace(/\.svg$/, "")).sort());
	});

	it("es decorativa por defecto y se mide por su alto", () => {
		const { container } = render(<FlagSpainRectangle />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("role")).toBeNull();
		expect(svg?.getAttribute("height")).toBe("20");
		expect(svg?.getAttribute("width")).toBe("30");
		const big = render(<FlagSpainRectangle size={40} />).container.querySelector("svg");
		expect(big?.getAttribute("height")).toBe("40");
		expect(big?.getAttribute("width")).toBe("60");
	});

	it("con title es una imagen con ese nombre", () => {
		render(<FlagSpainCircle title="España" />);
		expect(screen.getByRole("img", { name: "España" })).toBeTruthy();
	});

	it("pinta las tres formas y las de una región sin código", () => {
		for (const C of [FlagSpainCircle, FlagSpainSquare, FlagSpainRectangle, FlagCanaryIslandsRectangle]) {
			const { container } = render(<C />);
			expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
		}
	});

	it("la entrada principal no exporta ninguna bandera", () => {
		expect(Object.keys(main).filter((k) => k.startsWith("Flag") || k === "flagNames")).toEqual([]);
	});
});

describe("publicación", () => {
	const dist = join(pkg, "dist");
	const dir = mkdtempSync(join(tmpdir(), "flags-bundle-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("dist/flags tiene los mismos SVG", () => {
		expect(existsSync(join(dist, "flags")), "hace falta `bun run build` antes").toBe(true);
		expect(readdirSync(join(dist, "flags")).sort()).toEqual([...files].sort());
	});

	it("al empaquetar solo FlagSpainCircle no entra ninguna otra bandera", () => {
		const built = join(dist, "flags.js");
		expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
		const entry = join(dir, "entry.js");
		writeFileSync(
			entry,
			`import { FlagSpainCircle } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default FlagSpainCircle;\n`,
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
		const own = read("spain-circle.svg").match(/<path d="([^"]+)"/)?.[1] as string;
		expect(code).toContain(own);
		const leaked = files
			.filter((f) => f !== "spain-circle.svg")
			.filter((f) => {
				const d = read(f).match(/<path d="([^"]+)"/g)?.[1];
				return d && d.length > 60 && code.includes(d.slice(9, -1));
			});
		expect(leaked).toEqual([]);
		expect(code.length).toBeLessThan(10_000);
	});
});
