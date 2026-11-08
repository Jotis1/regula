import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProgressCircle } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const arc = (container: HTMLElement) =>
	container.querySelector("svg [stroke-dasharray]") as SVGElement | null;

describe("ProgressCircle", () => {
	it("es una barra de progreso con valor y nombre; el texto visible no se lee dos veces", () => {
		render(<ProgressCircle value={40} label="Usuarios activos" />);
		const bar = screen.getByRole("progressbar", { name: "Usuarios activos" });
		expect(bar.getAttribute("aria-valuenow")).toBe("40");
		expect(bar.getAttribute("aria-valuemin")).toBe("0");
		expect(bar.getAttribute("aria-valuemax")).toBe("100");
		expect(bar.textContent).toContain("40%");
		expect(bar.querySelector("[aria-hidden=true] span")?.textContent).toBe("Usuarios activos");
	});

	it("`aria-label` da el nombre cuando no hay etiqueta de texto", () => {
		render(<ProgressCircle value={10} aria-label="Subida" />);
		expect(screen.getByRole("progressbar", { name: "Subida" })).toBeTruthy();
	});

	it("el arco cubre el valor: 40 de 100 del trazo, con extremos redondeados", () => {
		const { container } = render(<ProgressCircle value={40} aria-label="x" />);
		const a = arc(container);
		expect(a?.getAttribute("stroke-dasharray")).toBe("40 100");
		expect(a?.getAttribute("pathLength")).toBe("100");
		expect(a?.getAttribute("stroke-linecap")).toBe("round");
		// Empieza arriba
		expect(a?.getAttribute("transform")).toBe("rotate(-90 120 120)");
	});

	it("los valores fuera de 0–100 se recortan y el 0 no deja un punto", () => {
		const { container, rerender } = render(<ProgressCircle value={140} aria-label="x" />);
		expect(arc(container)?.getAttribute("stroke-dasharray")).toBe("100 100");
		expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
		rerender(<ProgressCircle value={-5} aria-label="x" />);
		expect(arc(container)).toBeNull();
		expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
	});

	it("los cinco tamaños miden lo del Figma, con el trazo de una décima", () => {
		for (const [size, d, sw] of [
			["xxs", 64, 6],
			["xs", 160, 16],
			["sm", 200, 20],
			["md", 240, 24],
			["lg", 280, 28],
		] as const) {
			const { container, unmount } = render(<ProgressCircle value={50} size={size} aria-label="x" />);
			const svg = container.querySelector("svg");
			expect(svg?.getAttribute("width")).toBe(String(d));
			expect(svg?.getAttribute("height")).toBe(String(d));
			expect(container.querySelector("circle")?.getAttribute("stroke-width")).toBe(String(sw));
			unmount();
		}
	});

	it("shape=half es un semicírculo: mismo ancho, alto de la mitad más medio trazo, y un arco", () => {
		const { container } = render(<ProgressCircle value={40} size="xs" shape="half" aria-label="x" />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("160");
		expect(svg?.getAttribute("height")).toBe("88");
		expect(container.querySelector("circle")).toBeNull();
		expect(container.querySelectorAll("path")).toHaveLength(2);
		expect(arc(container)?.getAttribute("stroke-dasharray")).toBe("40 100");
	});

	it("en xxs la etiqueta va debajo y el valor dentro; `valueText` sustituye el porcentaje", () => {
		render(<ProgressCircle value={40} size="xxs" label="Usuarios" valueText="40 de 100" />);
		const bar = screen.getByRole("progressbar");
		expect(bar.className).toContain("flex-col");
		expect(bar.getAttribute("aria-valuetext")).toBe("40 de 100");
		expect(bar.textContent).toContain("40 de 100");
		expect(bar.lastElementChild?.textContent).toBe("Usuarios");
	});

	it("se pinta en el servidor", () => {
		const html = renderToString(<ProgressCircle value={25} label="Cuota" />);
		expect(html).toContain('role="progressbar"');
		expect(html).toContain("25%");
		expect(html).toContain("25 100");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<ProgressCircle value={40} label="Usuarios activos" shape="half" />);
	});
});
