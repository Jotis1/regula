// `/tokens.json` (spec mcp-server): the tokens of the package, flat, with their value per theme when it changes.
import source from "@jotis-me/tokens/tokens.json";
import { describe, expect, it } from "vitest";
import { TOKEN_CATEGORIES, type TokensSource, tokensJson } from "../src/lib/tokens-json";

const json = tokensJson(source as unknown as TokensSource, "1.2.3");
const byName = (name: string) => json.tokens.find((t) => t.name === name);

describe("tokensJson", () => {
	it("trae la versión y todas las categorías", () => {
		expect(json.version).toBe("1.2.3");
		for (const category of TOKEN_CATEGORIES)
			expect(
				json.tokens.some((t) => t.category === category),
				category,
			).toBe(true);
	});

	it("text-secondary trae su valor en claro y en oscuro", () => {
		const token = byName("text-secondary");
		expect(token?.category).toBe("color");
		expect(token?.value).toMatchObject({
			light: expect.stringMatching(/^#/),
			dark: expect.stringMatching(/^#/),
		});
		expect(token?.usage).toEqual(expect.stringMatching(/\S/));
	});

	it("spacing-none trae un valor único", () => {
		expect(byName("spacing-none")).toMatchObject({ category: "spacing", value: "0px" });
	});

	it("los estilos de texto llevan sus partes y su familia", () => {
		expect(byName("display-2xl-semibold")).toMatchObject({
			category: "type",
			value: { fontSize: "72px", lineHeight: "90px", fontWeight: 600 },
			font: expect.stringContaining("Bricolage Grotesque"),
		});
	});

	it("los nombres no se repiten", () => {
		const names = json.tokens.map((t) => t.name);
		expect(new Set(names).size).toBe(names.length);
	});
});
