// Un fichero por componente en src/playground/ (design D4 de docs-site-with-own-components): la isla carga el de su
// página y ninguno más. Tiene que haber uno por cada componente con punto de partida, y solo esos.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STARTS } from "../src/lib/playground";

const dir = join(import.meta.dirname, "../src/playground");
const files = readdirSync(dir)
	.filter((f) => f.endsWith(".tsx"))
	.map((f) => f.replace(/\.tsx$/, ""));

describe("src/playground", () => {
	it("tiene exactamente los componentes con punto de partida", () => {
		expect(files.sort()).toEqual(Object.keys(STARTS).sort());
	});

	it("cada fichero exporta su componente por defecto, importado de @jotis-me/react", () => {
		for (const name of files) {
			const src = readFileSync(join(dir, `${name}.tsx`), "utf8");
			expect(src, name).toMatch(/@jotis-me\/react/);
			expect(src, name).toMatch(/export default |as default/);
			// Ni el paquete entero ni otro componente: lo que se importa es lo suyo
			expect(src, name).not.toMatch(/import \* as/);
		}
	});

	it("cada módulo se carga y su exportación por defecto es un componente", async () => {
		for (const name of files) {
			const mod = (await import(`../src/playground/${name}.tsx`)) as { default: unknown };
			expect(["function", "object"], name).toContain(typeof mod.default);
		}
	});
});
