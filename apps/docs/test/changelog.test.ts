import { describe, expect, it } from "vitest";
import { mergeChangelogs, parseChangelog } from "../src/lib/changelog";

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
