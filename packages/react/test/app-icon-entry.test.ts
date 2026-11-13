import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appIconSvg } from "../src/app-icon/index.js";

// `@jotis-me/react/app-icon` se usa sin React (Astro, scripts): ningún módulo de la entrada importa nada de fuera
describe("entrada @jotis-me/react/app-icon", () => {
	const dir = join(import.meta.dirname, "../src/app-icon");
	const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));

	it("sus módulos solo importan otros módulos de la propia entrada", () => {
		expect(files.length).toBeGreaterThan(1);
		for (const f of files) {
			const imports = [...readFileSync(join(dir, f), "utf8").matchAll(/from\s+"([^"]+)"/g)].map(
				(m) => m[1],
			);
			for (const spec of imports) expect(spec, `${f} importa ${spec}`).toMatch(/^\.\/[\w-]+\.js$/);
		}
	});

	it("la compilada tampoco carga React", () => {
		const built = join(import.meta.dirname, "../dist/app-icon");
		for (const f of readdirSync(built).filter((x) => x.endsWith(".js"))) {
			const code = readFileSync(join(built, f), "utf8");
			expect(code, f).not.toMatch(/from\s+"react|require\("react/);
		}
	});

	it("pinta el SVG de una app como texto", () => {
		expect(appIconSvg({ app: "pecunia", variant: "light" })).toMatch(/^<svg /);
	});
});
