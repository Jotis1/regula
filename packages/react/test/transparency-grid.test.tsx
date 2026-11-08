import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, TransparencyGrid } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

// jsdom no tiene CSS real: los colores computados y los cuadros pintados se miran en Playwright (e2e de la web). Aquí,
// que las clases llevan los tokens del tema y no colores fijos, y que el componente no aporta nada a la accesibilidad.

describe("TransparencyGrid", () => {
	it("el damero usa los tokens de fondo, para que siga el tema, y no colores fijos", () => {
		const { container } = render(<TransparencyGrid>Contenido</TransparencyGrid>);
		const grid = container.firstElementChild as HTMLElement;
		expect(grid.className).toContain("bg-primary");
		expect(grid.className).toContain("var(--bg-secondary)");
		expect(grid.className).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
	});

	it("dos tamaños de cuadro: sm de 8px (por defecto) y md de 16px", () => {
		const { container: sm } = render(<TransparencyGrid />);
		const { container: md } = render(<TransparencyGrid size="md" />);
		const small = sm.firstElementChild as HTMLElement;
		const medium = md.firstElementChild as HTMLElement;
		expect(small.className).toContain("bg-[length:16px_16px]");
		expect(small.className).toContain("bg-[position:0_0,8px_8px]");
		expect(medium.className).toContain("bg-[length:32px_32px]");
		expect(medium.className).toContain("bg-[position:0_0,16px_16px]");
		expect(small.className).not.toContain("32px");
		expect(medium.className).not.toContain("bg-[length:16px_16px]");
	});

	it("acepta los atributos de un div y el className del consumidor", () => {
		const { container } = render(
			<TransparencyGrid
				aria-hidden="true"
				data-live-preview="Button"
				className="rounded-2xl p-6"
				style={{ width: 120 }}
			>
				x
			</TransparencyGrid>,
		);
		const grid = container.firstElementChild as HTMLElement;
		expect(grid.getAttribute("aria-hidden")).toBe("true");
		expect(grid.getAttribute("data-live-preview")).toBe("Button");
		expect(grid.className).toContain("rounded-2xl");
		expect(grid.className).toContain("p-6");
		expect(grid.style.width).toBe("120px");
	});

	it("es decorativo: sin papel ni nombre, y lo de dentro se anuncia como siempre", () => {
		const { container } = render(
			<TransparencyGrid>
				<Button>Grabar</Button>
			</TransparencyGrid>,
		);
		const grid = container.firstElementChild as HTMLElement;
		expect(grid.tagName).toBe("DIV");
		expect(grid.hasAttribute("role")).toBe(false);
		expect(grid.hasAttribute("aria-label")).toBe(false);
		expect(grid.hasAttribute("tabindex")).toBe(false);
		expect(screen.getByRole("button", { name: "Grabar" })).toBeTruthy();
	});

	it("se pinta en el servidor, sin JavaScript", () => {
		const html = renderToString(<TransparencyGrid size="md">dentro</TransparencyGrid>);
		expect(html).toContain("dentro");
		expect(html).toContain("var(--bg-secondary)");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<TransparencyGrid>
				<Button>Grabar</Button>
			</TransparencyGrid>,
		);
	});
});
