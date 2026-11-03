import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { installTabs } from "../src/lib/readme";

const readme = readFileSync(
	fileURLToPath(new URL("../../../packages/react/README.md", import.meta.url)),
	"utf8",
);

describe("instalación de la portada desde el README de @jotis-me/react", () => {
	it("saca Next.js y Astro con su comando y su hoja", () => {
		const [next, astro] = installTabs(readme);
		expect(next?.label).toBe("Next.js");
		expect(next?.code).toContain("bun add @jotis-me/react");
		expect(next?.code).toContain("/* app/globals.css */");
		expect(next?.code).toContain('@import "@jotis-me/react/styles.css";');
		expect(astro?.label).toBe("Astro");
		expect(astro?.code).toContain("bunx astro add react");
		expect(astro?.code).toContain("/* src/styles/global.css */");
	});

	it("solo nombra paquetes @jotis-me, no los inventados del diseño", () => {
		const code = installTabs(readme)
			.map((t) => t.code)
			.join("\n");
		expect(code).not.toContain("@jotis/regula");
		expect(code).not.toContain("untitledui");
	});

	it("avisa si el README deja de traer la instalación", () => {
		expect(() => installTabs("# Sin instalación\n")).toThrow(/no trae la instalación de Next\.js/);
	});

	it("con un README de ejemplo, toma el primer sh y la hoja con su ruta", () => {
		const sample = [
			"## Next.js",
			"```sh\nnpm i a\n```",
			"`x/y.css`:",
			'```css\n@import "a";\n```',
			"## Astro",
			"```sh\nnpm i b\n```",
			"`z.css`, importado:",
			'```css\n@import "b";\n```',
		].join("\n\n");
		expect(installTabs(sample)).toEqual([
			{ label: "Next.js", code: 'npm i a\n\n/* x/y.css */\n@import "a";' },
			{ label: "Astro", code: 'npm i b\n\n/* z.css */\n@import "b";' },
		]);
	});
});
