import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { describe, expect, it } from "vitest";
import { type AppName, appIcon, appIconSvg, apps, validateApps } from "../src/app-icon.js";

const ref = join(import.meta.dirname, "../../../reference/assets/App icons");

/** Piezas de un SVG: color de relleno, trazo y números de su trazado. */
function parse(svg: string) {
	return [...svg.matchAll(/<path ([^>]*)>/g)].map((m) => {
		const a = m[1] as string;
		const get = (k: string) => a.match(new RegExp(`(?:^| )${k}="([^"]*)"`))?.[1];
		return {
			fill: get("fill"),
			stroke: get("stroke"),
			cmds: (get("d") ?? "").replace(/[^A-Z]/g, ""),
			nums: ((get("d") ?? "").match(/-?\d*\.?\d+/g) ?? []).map(Number),
		};
	});
}

const variants = [
	["default", {}],
	["solid", { variant: "solid" as const }],
	["light", { variant: "light" as const }],
	["mono", { variant: "mono" as const }],
	["maskable", { shape: "square" as const }],
] as const;

describe("icono de app frente a los SVG de la guía", () => {
	for (const app of Object.keys(apps) as AppName[]) {
		for (const [file, opts] of variants) {
			it(`${app}-${file}`, () => {
				const expected = parse(readFileSync(join(ref, `${app}-${file}.svg`), "utf8"));
				const { parts } = appIcon({ app, size: 128, ...opts });
				expect(parts.map((p) => p.fill)).toEqual(expected.map((p) => p.fill));
				expect(parts.map((p) => p.stroke)).toEqual(expected.map((p) => p.stroke));
				parts.forEach((p, i) => {
					const e = expected[i] as (typeof expected)[number];
					expect(p.d.replace(/[^A-Z]/g, "")).toBe(e.cmds);
					const nums = (p.d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
					expect(nums.length).toBe(e.nums.length);
					// Los SVG de la guía salen de la fuente con unidades fraccionarias; la tabla de letras de bundle.js
					// las redondea a enteros. El margen es una unidad de la fuente (0,47 × 128 / 1000 ≈ 0,06 sobre 128):
					// Ornatus, Vinculum, Pecunia y Emptor llegan a 0,04 y la «R» y la «e» de Regula, a 0,06, sin
					// desplazamiento medio (ruido punto a punto). Invisible a cualquier tamaño; el test de píxeles de abajo
					// lo confirma.
					const fontUnit = (0.47 * 128) / 1000;
					for (const [j, v] of nums.entries())
						expect(Math.abs(v - (e.nums[j] as number))).toBeLessThanOrEqual(fontUnit);
				});
			});
		}
	}
});

describe("reglas de tamaño", () => {
	it("por debajo de 20px sale solid y sin virgulilla", () => {
		const { parts } = appIcon({ app: "ornatus", size: 16 });
		expect(parts[0]?.fill).toBe("#4f39f6");
		expect(parts.some((p) => p.stroke)).toBe(false);
	});
	it("la virgulilla solo aparece desde 32px", () => {
		expect(appIcon({ app: "pecunia", size: 24 }).parts.some((p) => p.strokeWidth)).toBe(false);
		expect(appIcon({ app: "pecunia", size: 32 }).parts.some((p) => p.strokeWidth)).toBe(true);
	});
	it("la virgulilla mide lo mismo en todas las apps", () => {
		const tilde = (app: AppName) => appIcon({ app, size: 128 }).parts.find((p) => p.strokeWidth)?.d;
		expect(tilde("ornatus")).toBe(tilde("emptor"));
	});
});

describe("registro de apps", () => {
	it("el registro de la suite es válido", () => {
		expect(validateApps(apps)).toEqual([]);
	});
	it("Regula está en el registro: Re, en chartreuse", () => {
		expect(apps.regula).toEqual({ name: "Regula", letters: "Re", hue: "chartreuse" });
	});
	it("acepta chartreuse, la paleta propia de la suite, aunque no sea de Tailwind", () => {
		const { regula: _, ...rest } = apps;
		expect(validateApps({ ...rest, nueva: { name: "Nueva", letters: "Nu", hue: "chartreuse" } })).toEqual(
			[],
		);
	});
	it.each([
		["red", "reservado para errores"],
		["yellow", "3:1"],
		["neutral", "gris"],
		["indigo", "mismo tono"],
		["chartreuse", "mismo tono"],
		["blue", "vecinos"],
		["teal", "vecinos"],
		// chartreuse va entre yellow y lime en el círculo de tonos: lime es vecino de Regula
		["lime", "vecinos"],
	])("rechaza el tono %s", (hue, msg) => {
		const problems = validateApps({ ...apps, nueva: { name: "Nueva", letters: "Nu", hue } });
		expect(problems.join("\n")).toContain(msg);
	});
	it("rechaza letras repetidas", () => {
		expect(
			validateApps({ ...apps, otra: { name: "Ornitus", letters: "Or", hue: "rose" } }).join("\n"),
		).toContain("mismas letras");
	});
});

describe("icono maskable", () => {
	// Zona segura de los iconos maskable: círculo centrado de radio 40 % del lado
	const inSafeZone = (d: string) => {
		const nums = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
		for (let i = 0; i + 1 < nums.length; i += 2) {
			const dx = (nums[i] as number) - 64;
			const dy = (nums[i + 1] as number) - 64;
			if (Math.hypot(dx, dy) > 0.4 * 128) return false;
		}
		return true;
	};
	for (const app of Object.keys(apps) as AppName[]) {
		it(`${app}: letras y virgulilla dentro de la zona segura y a sangre`, () => {
			const [tileShape, ...rest] = appIcon({ app, size: 128, shape: "square" }).parts;
			expect(tileShape?.d).toBe("M0 0H128V128H0Z");
			expect(rest.some((p) => p.strokeWidth)).toBe(true);
			for (const p of rest) expect(inSafeZone(p.d.replace(/[HV][^A-Z]*/g, ""))).toBe(true);
		});
	}
});

describe("icono de app rasterizado frente a la guía", () => {
	const raster = (svg: string) => new Resvg(svg, { fitTo: { mode: "width", value: 128 } }).render().pixels;
	for (const app of Object.keys(apps) as AppName[]) {
		for (const [file, opts] of variants) {
			it(`${app}-${file}: menos del 0,5 % de píxeles distintos`, () => {
				const a = raster(readFileSync(join(ref, `${app}-${file}.svg`), "utf8"));
				const b = raster(appIconSvg({ app, size: 128, ...opts }));
				let diff = 0;
				for (let i = 0; i < a.length; i += 4) {
					const d = Math.max(
						...[0, 1, 2, 3].map((c) => Math.abs((a[i + c] as number) - (b[i + c] as number))),
					);
					if (d > 32) diff++;
				}
				expect(diff / (a.length / 4)).toBeLessThan(0.005);
			});
		}
	}
});
