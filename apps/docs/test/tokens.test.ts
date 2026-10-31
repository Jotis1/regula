import { colors, radius, shadows, spacing } from "@jotis-me/tokens";
import { describe, expect, it } from "vitest";
import { colorGroups, radiusRows, shadowRows, spacingRows, utilityFor } from "../src/lib/tokens";

describe("tablas de tokens", () => {
	it("lista todos los colores del paquete, cada uno una vez", () => {
		const rows = colorGroups(colors).flatMap((g) => g.rows.map((r) => r.name));
		expect(rows.sort()).toEqual(Object.keys(colors).sort());
	});

	it("un token nuevo aparece en su grupo sin tocar la web", () => {
		const groups = colorGroups({
			...colors,
			"bg-prueba": { light: "#123456", dark: "#654321", usage: "Token de prueba." },
		});
		const fondos = groups.find((g) => g.title === "Fondos");
		expect(fondos?.rows.find((r) => r.name === "bg-prueba")).toMatchObject({
			utility: "bg-prueba",
			light: "#123456",
			dark: "#654321",
		});
	});

	it("ordena: semánticos primero, utility por tono y componentes al final", () => {
		const titles = colorGroups(colors).map((g) => g.title);
		expect(titles.slice(0, 6)).toEqual(["Texto", "Fondos", "Bordes", "Iconos", "Foco", "Transparencias"]);
		expect(titles.at(-1)).toBe("Componentes");
		expect(titles).toContain("Utility · brand");
	});

	it("da la utilidad de Tailwind de cada token", () => {
		expect(utilityFor("bg-brand-solid")).toBe("bg-brand-solid");
		expect(utilityFor("fg-quaternary")).toBe("text-fg-quaternary");
		expect(utilityFor("alpha-white-10")).toBe("bg-alpha-white/10");
		expect(utilityFor("utility-brand-50")).toBe("bg-utility-brand-50");
		expect(spacingRows(spacing).find((r) => r.name === "spacing-3xl")?.utility).toBe("p-6");
		expect(radiusRows(radius).find((r) => r.name === "radius-lg")?.utility).toBe("rounded-lg");
		expect(shadowRows(shadows).find((r) => r.name === "focus-ring-shadow")?.utility).toBe(
			"shadow-focus-ring",
		);
	});
});
