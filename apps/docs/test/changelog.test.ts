import { describe, expect, it } from "vitest";
import { changeBlocks, mergeChangelogs, parseChangelog } from "../src/lib/changelog";

// CHANGELOG de ejemplo con el formato de Changesets
const react = `# @jotis-me/react

## 0.2.0

### Minor Changes

- 1a2b3c4: Añade \`AppIcon\` de Regula.

  Segundo párrafo de la entrada.

### Patch Changes

- 9f8e7d6: Arregla el foco de \`Checkbox\`.
- Updated dependencies [1a2b3c4]
  - @jotis-me/tokens@0.2.0

## 0.1.0

### Minor Changes

- 0a0a0a0: Primera versión pública.
`;
const tokens = `# @jotis-me/tokens

## 0.2.0

### Minor Changes

- 1a2b3c4: Añade \`AppIcon\` de Regula.

  Segundo párrafo de la entrada.

## 0.1.0

### Minor Changes

- 0a0a0a0: Primera versión pública.
`;

describe("historial de cambios desde los CHANGELOG de los paquetes", () => {
	it("lee la versión, el tipo y el texto de cada entrada, sin el hash", () => {
		const { pkg, versions } = parseChangelog(react);
		expect(pkg).toBe("@jotis-me/react");
		expect(versions.map((v) => v.version)).toEqual(["0.2.0", "0.1.0"]);
		expect(versions[0]?.entries).toEqual([
			{
				pkgs: ["@jotis-me/react"],
				kind: "minor",
				text: "Añade `AppIcon` de Regula.\n\nSegundo párrafo de la entrada.",
			},
			{ pkgs: ["@jotis-me/react"], kind: "patch", text: "Arregla el foco de `Checkbox`." },
		]);
	});

	it("muestra cada versión una vez, la más nueva primero, con las entradas de los tres paquetes", () => {
		const merged = mergeChangelogs([tokens, react]);
		expect(merged.map((v) => v.version)).toEqual(["0.2.0", "0.1.0"]);
		expect(merged[0]?.entries).toHaveLength(2);
		const shared = merged[0]?.entries[0];
		expect(shared?.pkgs).toEqual(["@jotis-me/tokens", "@jotis-me/react"]);
	});

	it("ordena las versiones por número, no por texto", () => {
		const md = (v: string) => `# p\n\n## ${v}\n\n### Patch Changes\n\n- abcdef0: cambio ${v}\n`;
		expect(
			mergeChangelogs(["0.9.0", "0.10.0", "1.0.0-beta.1", "1.0.0"].map(md)).map((v) => v.version),
		).toEqual(["1.0.0", "1.0.0-beta.1", "0.10.0", "0.9.0"]);
	});

	it("sin CHANGELOG no hay versiones", () => {
		expect(mergeChangelogs([])).toEqual([]);
		expect(mergeChangelogs(["# @jotis-me/react\n"])).toEqual([]);
	});
});

// La entrada de la 0.4.0: un párrafo con su lista pegada, un párrafo entre las dos y otra lista
const v040 = [
	"# @jotis-me/react",
	"",
	"## 0.4.0",
	"",
	"### Minor Changes",
	"",
	"- ebf83b3: Formularios del Figma, fase 1. Cuatro componentes nuevos:",
	"  - `NumberInput`: campo numérico.",
	"  - `TagInput`: convierte lo escrito",
	"    en etiquetas.",
	"",
	"  Y variantes nuevas, sin cambiar lo que ya había:",
	"  - `Input`: `prefix` y desplegables.",
	'  - `Toggle`: `variant="slim"`.',
	"",
].join("\n");

describe("bloques de una entrada: párrafos y listas", () => {
	it("la entrada de la 0.4.0 sale como párrafo, lista, párrafo y lista, sin guiones sueltos", () => {
		const text = parseChangelog(v040).versions[0]?.entries[0]?.text ?? "";
		expect(changeBlocks(text)).toEqual([
			{ type: "p", text: "Formularios del Figma, fase 1. Cuatro componentes nuevos:" },
			{
				type: "ul",
				items: ["`NumberInput`: campo numérico.", "`TagInput`: convierte lo escrito en etiquetas."],
			},
			{ type: "p", text: "Y variantes nuevas, sin cambiar lo que ya había:" },
			{ type: "ul", items: ["`Input`: `prefix` y desplegables.", '`Toggle`: `variant="slim"`.'] },
		]);
	});

	it("un texto sin listas son sus párrafos, separados por líneas en blanco", () => {
		expect(changeBlocks("Uno.\n\nDos,\ncontinúa.")).toEqual([
			{ type: "p", text: "Uno." },
			{ type: "p", text: "Dos, continúa." },
		]);
	});
});
