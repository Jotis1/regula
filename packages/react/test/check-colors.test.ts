import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkDir, findRawColors } from "../scripts/check-colors.js";

describe("comprobación de colores", () => {
	it("encuentra hex y paleta cruda", () => {
		const found = findRawColors(
			`const a = "#4f39f6";\n<div className="bg-indigo-600 hover:text-gray-500/50 border-white" />\nstyle={{ color: "#fff" }}`,
		).map((f) => f.match);
		expect(found).toEqual(["#4f39f6", "bg-indigo-600", "hover:text-gray-500/50", "border-white", "#fff"]);
	});

	it("deja pasar los tokens semánticos y lo que no es color", () => {
		expect(
			findRawColors(
				`<div className="bg-brand-solid bg-utility-neutral-300 text-fg-quaternary border-secondary shadow-xs rounded-lg" />\n// ver #12 en la guía\nconst id = "&#160;";`,
			),
		).toEqual([]);
	});

	it("falla en un directorio con colores crudos y respeta las excepciones documentadas", () => {
		const dir = mkdtempSync(join(tmpdir(), "regula-colors-"));
		mkdirSync(join(dir, "components"));
		writeFileSync(
			join(dir, "components/Malo.tsx"),
			`export const M = () => <div className="bg-red-500" />;`,
		);
		writeFileSync(join(dir, "components/AppIcon.tsx"), `const bg = "#1e1a4d";`);
		const problems = checkDir(dir);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("components/Malo.tsx:1 paleta cruda «bg-red-500»");
	});

	it("el código actual del paquete está limpio", () => {
		expect(checkDir(join(import.meta.dirname, "../src"))).toEqual([]);
	});
});

describe("casos de la guía", () => {
	it("text-white es un token, no paleta cruda", () => {
		expect(findRawColors(`<b className="text-white hover:text-white" />`)).toEqual([]);
		expect(findRawColors(`<b className="bg-white" />`).map((f) => f.match)).toEqual(["bg-white"]);
	});

	it("también encuentra colores escritos como función", () => {
		expect(
			findRawColors(`const a = "rgb(255 255 255 / .12)"; const b = "oklch(0.5 0.2 270)";`).map(
				(f) => f.kind,
			),
		).toEqual(["función", "función"]);
	});

	it("admite una excepción de una línea solo si lleva motivo", () => {
		expect(
			findRawColors(
				`// color-fijo: brillo interior del botón primario (ficha de Button)\nconst a = "#ffffff1f";`,
			),
		).toEqual([]);
		expect(findRawColors(`// color-fijo:\nconst a = "#ffffff1f";`)).toHaveLength(1);
		expect(findRawColors(`// color-fijo: motivo\nconst a = 1;\nconst b = "#fff";`)).toHaveLength(1);
	});
});
