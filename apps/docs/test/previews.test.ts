import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { preview, previewUrl } from "../src/lib/previews";

describe("fotos de las cards de /components/", () => {
	it("cada componente del catálogo tiene su foto en claro y en oscuro", async () => {
		for (const name of catalogComponents())
			for (const theme of ["light", "dark"] as const) {
				const p = await preview(name, theme);
				expect(p.data.subarray(8, 12).toString(), `${name} ${theme}`).toBe("WEBP");
				expect(p.width).toBeLessThanOrEqual(720);
			}
	}, 60_000);

	it("quita el margen de la captura y rellena con su fondo", async () => {
		// La captura de ButtonGroup mide 800px de ancho con el grupo en medio: recortada es mucho más estrecha
		const light = await preview("ButtonGroup", "light");
		expect(light.width).toBeLessThan(500);
		expect(light.background).toBe("#ffffff");
		// Las de Stream van siempre en oscuro, también en la captura «clara»
		expect((await preview("StreamAlert", "light")).background).not.toBe("#ffffff");
	});

	it("la URL es la del endpoint estático", () => {
		expect(previewUrl("Button", "dark")).toBe("/components/previews/Button-dark.webp");
	});
});
