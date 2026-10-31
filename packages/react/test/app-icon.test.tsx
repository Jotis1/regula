import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppIcon, type AppName, appIcons } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

// Tonos de la tabla de la guía que usan los tests (bundle.js, APPICON.hues)
const HUE = { indigo600: "#4f39f6", indigo950: "#1e1a4d", teal950: "#022f2e" };

const ref = join(import.meta.dirname, "../../../reference/assets/App icons");

/** Piezas de un SVG: relleno, trazo, comandos y números del trazado. */
function parse(svg: string) {
	return [...svg.matchAll(/<path ([^>]*)>/g)].map((m) => {
		const a = m[1] as string;
		const get = (k: string) => a.match(new RegExp(`(?:^| )${k}="([^"]*)"`))?.[1];
		const d = get("d") ?? "";
		return {
			fill: get("fill"),
			stroke: get("stroke"),
			cmds: d.replace(/[^A-Z]/g, ""),
			nums: (d.match(/-?\d*\.?\d+/g) ?? []).map(Number),
		};
	});
}

const variants = [
	["default", {}],
	["solid", { variant: "solid" }],
	["light", { variant: "light" }],
	["mono", { variant: "mono" }],
	["maskable", { shape: "square" }],
] as const;

describe("AppIcon frente a reference/assets/App icons", () => {
	for (const app of Object.keys(appIcons) as AppName[]) {
		for (const [file, opts] of variants) {
			it(`${app}-${file}`, () => {
				const expected = parse(readFileSync(join(ref, `${app}-${file}.svg`), "utf8"));
				const actual = parse(renderToStaticMarkup(<AppIcon app={app} size={128} {...opts} />));
				expect(actual.map((p) => p.fill)).toEqual(expected.map((p) => p.fill));
				expect(actual.map((p) => p.stroke)).toEqual(expected.map((p) => p.stroke));
				actual.forEach((p, i) => {
					const e = expected[i] as (typeof expected)[number];
					expect(p.cmds).toBe(e.cmds);
					expect(p.nums.length).toBe(e.nums.length);
					// La tabla de letras redondea a unidades enteras de la fuente: como mucho 0,04 sobre 128 (design.md §8)
					for (const [j, v] of p.nums.entries())
						expect(Math.abs(v - (e.nums[j] as number))).toBeLessThanOrEqual(0.05);
				});
			});
		}
	}
});

describe("AppIcon", () => {
	it("48px por defecto, imagen con el nombre de la app", () => {
		render(<AppIcon app="pecunia" />);
		const svg = screen.getByRole("img", { name: "Pecunia" });
		expect(svg.getAttribute("width")).toBe("48");
		expect(svg.getAttribute("viewBox")).toBe("0 0 128 128");
	});

	it("label sustituye el nombre accesible", () => {
		render(<AppIcon app="emptor" label="Abrir Emptor" />);
		expect(screen.getByRole("img", { name: "Abrir Emptor" })).toBeTruthy();
	});

	it("por debajo de 20px sale solid (fondo -600, letras blancas) salvo que pases variant", () => {
		const { container } = render(
			<>
				<AppIcon app="ornatus" size={16} />
				<AppIcon app="ornatus" size={16} variant="default" />
			</>,
		);
		const [small, forced] = [...container.querySelectorAll("svg")];
		expect(small?.querySelector("path")?.getAttribute("fill")).toBe(HUE.indigo600);
		expect(
			[...(small?.querySelectorAll("path") ?? [])].slice(1).map((p) => p.getAttribute("fill")),
		).toEqual(["#ffffff", "#ffffff"]);
		expect(forced?.querySelector("path")?.getAttribute("fill")).toBe(HUE.indigo950);
	});

	it("sin virgulilla por debajo de 32px; tilde la fuerza o la quita", () => {
		const tilde = (el: Element | undefined) => Boolean(el?.querySelector("path[stroke-width]"));
		const { container } = render(
			<>
				<AppIcon app="vinculum" size={24} />
				<AppIcon app="vinculum" size={32} />
				<AppIcon app="vinculum" size={24} tilde />
				<AppIcon app="vinculum" size={64} tilde={false} />
			</>,
		);
		const svgs = [...container.querySelectorAll("svg")];
		expect(svgs.map(tilde)).toEqual([false, true, true, false]);
	});

	it("app nueva con letters + hue", () => {
		const { container } = render(<AppIcon letters="Fa" hue="teal" />);
		expect(screen.getByRole("img", { name: "Fa" })).toBeTruthy();
		expect(container.querySelector("path")?.getAttribute("fill")).toBe(HUE.teal950);
	});

	it("light lleva el borde de 1px que no escala; square no lo lleva", () => {
		const { container } = render(
			<>
				<AppIcon app="ornatus" variant="light" />
				<AppIcon app="ornatus" variant="light" shape="square" />
			</>,
		);
		const [rounded, square] = [...container.querySelectorAll("svg")];
		expect(rounded?.querySelector('path[vector-effect="non-scaling-stroke"]')).toBeTruthy();
		expect(square?.querySelector('path[vector-effect="non-scaling-stroke"]')).toBeNull();
	});

	it("se renderiza en servidor y sin infracciones de axe", async () => {
		expect(renderToStaticMarkup(<AppIcon app="ornatus" />)).toContain('aria-label="Ornatus"');
		await expectAccessibleInThemes(
			<div>
				<AppIcon app="ornatus" />
				<AppIcon app="emptor" size={16} />
			</div>,
		);
	});
});
