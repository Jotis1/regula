// «Build sin capturas» (spec docs-site, change live-component-previews): la web se construye sin leer las capturas
// aprobadas de la paridad visual (e2e/visual/approved/). Ningún módulo de src/ puede nombrar esa carpeta: así un
// componente nuevo se construye aunque aún no tenga sus PNG (el test de catálogo y el visual siguen exigiéndolas).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const src = join(import.meta.dirname, "../src");
/** Una ruta a la carpeta de capturas (`e2e/visual/approved`, `"approved"` en un `join`) o su constante. */
const READS_APPROVED =
	/e2e[\\/]+visual[\\/]+approved|["'`]approved["'`]|APPROVED_DIR|approvedPath|readApproved/;

function* files(dir: string): Generator<string> {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) yield* files(path);
		else if (/\.(?:[cm]?[jt]sx?|astro|mdx?)$/.test(entry)) yield path;
	}
}

describe("build sin capturas aprobadas", () => {
	it("ningún módulo de src/ lee e2e/visual/approved/", () => {
		const offenders: string[] = [];
		for (const file of files(src)) {
			readFileSync(file, "utf8")
				.split("\n")
				.forEach((line, i) => {
					if (READS_APPROVED.test(line)) offenders.push(`${relative(src, file)}:${i + 1}`);
				});
		}
		expect(offenders).toEqual([]);
	});

	it("el patrón detecta las formas de leerlas", () => {
		expect(READS_APPROVED.test(`join(process.cwd(), "e2e/visual/approved")`)).toBe(true);
		expect(READS_APPROVED.test(`join(dir, "approved", name)`)).toBe(true);
		expect(READS_APPROVED.test(`import { APPROVED_DIR } from "../e2e/visual/compare"`)).toBe(true);
		expect(READS_APPROVED.test("// la captura aprobada de la paridad visual")).toBe(false);
	});
});
