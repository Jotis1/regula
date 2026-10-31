import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Icon, IconBarChart01, IconCalendar, iconNames } from "../src/index.js";

const guide = JSON.parse(
	readFileSync(join(import.meta.dirname, "../../../reference/design-system.json"), "utf8"),
);
const dist = join(import.meta.dirname, "../dist/svg");

describe("set de iconos", () => {
	it("tiene los mismos 81 nombres que la guía", () => {
		const expected = guide.assetGroups.Icons.order.map((f: string) => f.replace(/\.svg$/, ""));
		expect([...iconNames].sort()).toEqual([...expected].sort());
		expect(iconNames).toHaveLength(81);
	});

	it("publica un SVG por icono con currentColor, sin relleno ni color fijo", () => {
		const files = readdirSync(dist);
		expect(files).toHaveLength(81);
		for (const f of files) {
			const svg = readFileSync(join(dist, f), "utf8");
			expect(svg).toContain('viewBox="0 0 24 24"');
			expect(svg).toContain('stroke="currentColor"');
			expect(svg).toContain('stroke-width="2"');
			expect(svg).toContain('stroke-linecap="round"');
			expect(svg).toContain('fill="none"');
			expect(svg).not.toMatch(/#[0-9a-f]{3,8}\b/i);
			expect(svg.match(/fill="([^"]*)"/g)).toEqual(['fill="none"']);
		}
	});
});

describe("componente Icon", () => {
	it("es decorativo sin title", () => {
		const { container } = render(<Icon name="search-lg" />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("role")).toBeNull();
	});

	it("se expone como imagen con title", () => {
		render(<Icon name="search-lg" title="Buscar" />);
		expect(screen.getByRole("img", { name: "Buscar" })).toBeTruthy();
	});

	it("mide 20 por defecto y respeta size sin cambiar el viewBox", () => {
		const { container } = render(
			<>
				<Icon name="plus" />
				<Icon name="plus" size={16} />
			</>,
		);
		const [a, b] = container.querySelectorAll("svg");
		expect(a?.getAttribute("width")).toBe("20");
		expect(b?.getAttribute("width")).toBe("16");
		expect(b?.getAttribute("height")).toBe("16");
		expect(b?.getAttribute("viewBox")).toBe("0 0 24 24");
	});

	it("hereda el color con currentColor y admite strokeWidth", () => {
		const { container } = render(
			<Icon name="plus" strokeWidth={1.5} className="text-fg-brand-primary" />,
		);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("stroke")).toBe("currentColor");
		expect(svg?.getAttribute("stroke-width")).toBe("1.5");
		expect(svg?.getAttribute("class")).toBe("text-fg-brand-primary");
	});

	it("gira con spin y lleva la regla de movimiento reducido", () => {
		const { container } = render(<Icon name="loading-02" spin />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("class")).toContain("jm-icon-spin");
		expect(container.querySelector("style")?.textContent).toContain("prefers-reduced-motion:reduce");
	});

	it("tiene un componente por icono y se renderiza en servidor", () => {
		expect(renderToStaticMarkup(<IconCalendar size={24} />)).toContain('width="24"');
		expect(renderToStaticMarkup(<IconBarChart01 />)).toContain("<path");
	});
});
