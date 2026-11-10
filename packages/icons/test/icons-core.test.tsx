import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it } from "vitest";
import { icons } from "../src/data/icons.js";
import { allIconNames, Icon, IconRocket02, iconNames } from "../src/index.js";

const pkg = join(import.meta.dirname, "..");
const original: Record<string, string[]> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/icon-drawings-original.json"), "utf8"),
);

describe("núcleo y set completo", () => {
	it("el núcleo son los 82 de antes", () => {
		expect([...iconNames].sort()).toEqual(Object.keys(original).sort());
	});

	it("el set completo tiene los 1.172 iconos, núcleo incluido, y coincide con los datos", () => {
		expect(allIconNames).toHaveLength(1172);
		expect(new Set(allIconNames).size).toBe(1172);
		expect([...allIconNames].sort()).toEqual(Object.keys(icons).sort());
		expect(iconNames.filter((n) => !(allIconNames as readonly string[]).includes(n))).toEqual([]);
	});

	it("Icon solo acepta nombres del núcleo", () => {
		// @ts-expect-error `rocket-02` es del set completo, no del núcleo: se pinta con IconRocket02
		const core = <Icon name="rocket-02" />;
		expect(core).toBeTruthy();
		const ok = <Icon name="home-line" />;
		expect(ok).toBeTruthy();
	});

	it("un icono fuera del núcleo se pinta con su componente suelto, con su dibujo", () => {
		const { container } = render(<IconRocket02 size={32} className="text-fg-brand-primary" />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("32");
		expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
		expect(svg?.getAttribute("stroke")).toBe("currentColor");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect([...container.querySelectorAll("path")].map((p) => p.getAttribute("d"))).toEqual(
			icons["rocket-02"],
		);
	});

	it("el componente suelto se expone con title", () => {
		render(<IconRocket02 title="Lanzar" />);
		expect(screen.getByRole("img", { name: "Lanzar" })).toBeTruthy();
	});
});

describe("un import suelto no arrastra los demás", () => {
	const dir = mkdtempSync(join(tmpdir(), "icons-bundle-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("al empaquetar solo IconRocket02 no entra el dibujo de ningún otro icono, ni del núcleo", () => {
		const built = join(pkg, "dist/index.js");
		expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
		const entry = join(dir, "entry.js");
		writeFileSync(
			entry,
			`import { IconRocket02 } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default IconRocket02;\n`,
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
		const own = new Set(icons["rocket-02"]);
		for (const d of icons["rocket-02"]) expect(code).toContain(d);
		const leaked = Object.entries(icons)
			.filter(([name]) => name !== "rocket-02")
			.flatMap(([name, paths]) =>
				paths.filter((d) => d.length > 30 && !own.has(d) && code.includes(d)).map(() => name),
			);
		expect(leaked).toEqual([]);
		expect(code.length).toBeLessThan(20_000);
	});
});
