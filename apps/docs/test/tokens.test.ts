import { loadRenderers } from "astro:container";
import { getContainerRenderer } from "@astrojs/react";
import { colors, radius, shadows, spacing } from "@jotis-me/tokens";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import TokenExplorer from "../src/components/TokenExplorer.astro";
import { tokenMatches, tokenStatus } from "../src/lib/token-explorer";
import {
	colorGroups,
	explorerFamilies,
	radiusRows,
	shadowRows,
	spacingRows,
	utilityFor,
} from "../src/lib/tokens";

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

describe("explorador de tokens de color", () => {
	const families = explorerFamilies(colors);

	it("reparte todos los colores del paquete en sus familias, cada uno una vez", () => {
		expect(families.map((f) => f.label)).toEqual([
			"Texto",
			"Fondos",
			"Bordes",
			"Iconos",
			"Utility",
			"Alfa",
			"Componentes",
		]);
		const names = families.flatMap((f) => f.tokens.map((t) => t.name));
		expect(names.sort()).toEqual(Object.keys(colors).sort());
		for (const f of families) expect(f.tokens.length).toBeGreaterThan(0);
	});

	it("se encuentra por nombre, valor o uso, sin tildes ni mayúsculas", () => {
		const hits = (term: string) =>
			families.flatMap((f) => f.tokens.filter((t) => tokenMatches(t.search, term)).map((t) => t.name));
		expect(hits("placeholder")).toEqual(["text-placeholder"]);
		expect(hits("  PLACEHOLDER ")).toEqual(["text-placeholder"]);
		expect(hits(colors["bg-brand-solid"].light)).toContain("bg-brand-solid");
		expect(hits("pagina")).toContain("bg-primary");
		expect(hits("")).toHaveLength(Object.keys(colors).length);
		expect(hits("zzzz")).toEqual([]);
	});

	it("mide el contraste solo de texto e iconos, y marca el bajo", () => {
		const token = (name: string) => families.flatMap((f) => f.tokens).find((t) => t.name === name);
		expect(token("text-primary")?.ratios?.light).toEqual({ label: "17,9:1", low: false });
		expect(token("text-warning-primary")?.ratios?.light).toEqual({ label: "2,9:1", low: true });
		expect(token("fg-quaternary")?.ratios?.dark).toEqual({ label: "2,5:1", low: true });
		expect(token("bg-primary")?.ratios).toBeUndefined();
	});

	it("anuncia el recuento de la familia y de lo filtrado", () => {
		expect(tokenStatus(23, 23, "Texto", "")).toBe("23 tokens de Texto");
		expect(tokenStatus(1, 1, "Texto", "")).toBe("1 token de Texto");
		expect(tokenStatus(1, 23, "Texto", "placeholder")).toBe("1 de 23 tokens de Texto con «placeholder»");
		expect(tokenStatus(0, 23, "Texto", "zzzz")).toBe("Ningún token de Texto con «zzzz»");
	});

	describe("lo que pinta el servidor", () => {
		let html = "";
		beforeAll(async () => {
			const renderers = await loadRenderers([getContainerRenderer()]);
			const container = await AstroContainer.create({ renderers });
			html = await container.renderToString(TokenExplorer);
		});
		const count = (re: RegExp) => html.match(re)?.length ?? 0;
		const total = Object.keys(colors).length;

		it("cada token va en una fila de tabla y en una tarjeta, con TokenSwatch y sin islas", () => {
			expect(count(/data-layout="row"/g)).toBe(total);
			expect(count(/data-layout="card"/g)).toBe(total);
			expect(count(/data-token-search="/g)).toBe(total);
			expect(html).not.toContain("<astro-island");
		});

		it("solo la primera familia va a la vista; las pestañas son enlaces a cada una", () => {
			expect(count(/<section[^>]*data-token-family=/g)).toBe(families.length);
			// El atributo, no la clase `data-collapsed:hidden` que llevan todas
			const sections = html.match(/<section[^>]*data-token-family=[^>]*>/g) ?? [];
			const open = sections.filter((s) => !/\sdata-collapsed(=|\s|>)/.test(s));
			expect(open).toHaveLength(1);
			expect(open[0]).toContain('id="tokens-text"');
			for (const f of families) expect(html).toContain(`href="#tokens-${f.id}"`);
			expect(html).toMatch(/<a[^>]*href="#tokens-text"[^>]*aria-current="location"/);
		});

		it("el recuento se anuncia y el estado vacío trae «Limpiar búsqueda», escondido", () => {
			expect(html).toMatch(/<p[^>]*role="status"[^>]*aria-live="polite"[^>]*>23 tokens de Texto</);
			expect(html).toMatch(/<div[^>]*data-tokens-empty[^>]*hidden/);
			expect(html).toMatch(/<button[^>]*data-tokens-clear[^>]*>[\s\S]*?Limpiar búsqueda/);
		});

		it("sin JavaScript se leen todas las familias y no aparece el filtro", () => {
			expect(html).toMatch(
				/<noscript>[\s\S]*\[data-token-family\][\s\S]*\[data-tokens-js\][\s\S]*<\/noscript>/,
			);
		});
	});
});
