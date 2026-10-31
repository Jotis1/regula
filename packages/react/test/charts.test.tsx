import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BarChart, ChartLegend, formatNumber, LineChart, PieChart } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const PALETTE = [
	"var(--utility-brand-600)",
	"var(--utility-brand-400)",
	"var(--utility-brand-200)",
	"var(--utility-sky-500)",
	"var(--utility-pink-500)",
	"var(--utility-neutral-400)",
];
const labels = ["Ago", "Sep", "Oct"];
const three = [
	{ name: "Gastos", data: [1240, 1060, 1284] },
	{ name: "Presupuesto", data: [1100, 1200, 1200] },
	{ name: "Ahorro", data: [300, 420, 380] },
];
const euros = (v: number) => `${formatNumber(v)} €`;
const dots = (c: HTMLElement) =>
	[...c.querySelectorAll("li span[aria-hidden]")].map((s) => (s as HTMLElement).style.background);

describe("frontera servidor", () => {
	it.each(["LineChart", "BarChart", "PieChart", "ChartLegend"])('%s no lleva "use client"', (name) => {
		const code = readFileSync(join(import.meta.dirname, "../src/components", `${name}.tsx`), "utf8");
		expect(code).not.toMatch(/^\s*["']use client["']/);
	});

	it("se pintan en servidor, con format, sin avisos", () => {
		const error = vi.spyOn(console, "error").mockImplementation(() => {});
		const html = renderToString(
			<>
				<LineChart labels={labels} series={three} format={euros} />
				<BarChart labels={labels} series={three} />
				<PieChart data={[{ name: "Hogar", value: 700 }]} center="700 €" />
			</>,
		);
		expect(html).toContain("1.500 €");
		expect(html).toContain("700 €");
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});
});

describe("LineChart", () => {
	it("tres series sin legend: los tres primeros colores de la paleta y leyenda", () => {
		const { container } = render(<LineChart labels={labels} series={three} />);
		const lines = [...container.querySelectorAll('path[fill="none"]')].map((p) =>
			p.getAttribute("stroke"),
		);
		expect(lines).toEqual(PALETTE.slice(0, 3));
		expect(screen.getByRole("list")).toBeTruthy();
		expect(dots(container)).toEqual(PALETTE.slice(0, 3));
		expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
			"Gastos",
			"Presupuesto",
			"Ahorro",
		]);
	});

	it("leyenda por defecto desde dos series; legend la fuerza o la quita", () => {
		const { rerender } = render(<LineChart labels={labels} series={three.slice(0, 1)} />);
		expect(screen.queryByRole("list")).toBeNull();
		rerender(<LineChart labels={labels} series={three.slice(0, 2)} />);
		expect(screen.getByRole("list")).toBeTruthy();
		rerender(<LineChart labels={labels} series={three} legend={false} />);
		expect(screen.queryByRole("list")).toBeNull();
		rerender(<LineChart labels={labels} series={three.slice(0, 1)} legend />);
		expect(screen.getByRole("list")).toBeTruthy();
	});

	it("aria-label por defecto y propio; color propio de una serie", () => {
		const { container, rerender } = render(<LineChart labels={labels} series={three} />);
		expect(screen.getByRole("img", { name: "Gráfica de líneas" })).toBeTruthy();
		rerender(
			<LineChart
				aria-label="Gastos de agosto a octubre"
				labels={labels}
				series={[{ name: "Gastos", data: [1, 2, 3], color: "var(--utility-sky-500)" }]}
			/>,
		);
		expect(screen.getByRole("img", { name: "Gastos de agosto a octubre" })).toBeTruthy();
		expect(container.querySelector('path[fill="none"]')?.getAttribute("stroke")).toBe(
			"var(--utility-sky-500)",
		);
	});

	it("escala desde cero hasta un techo redondo, con format en el eje y en cada punto", () => {
		const { container } = render(<LineChart labels={labels} series={three} format={euros} />);
		const ticks = [...container.querySelectorAll('text[text-anchor="end"]')].map((t) => t.textContent);
		expect(ticks).toEqual(["0 €", "375 €", "750 €", "1.125 €", "1.500 €"]);
		expect(container.querySelector("circle title")?.textContent).toBe("Gastos · Ago: 1.240 €");
	});

	it("área solo bajo la primera serie, y se puede quitar", () => {
		const { container, rerender } = render(<LineChart labels={labels} series={three} />);
		expect(container.querySelectorAll('path[opacity="0.08"]')).toHaveLength(1);
		rerender(<LineChart labels={labels} series={three} area={false} />);
		expect(container.querySelectorAll('path[opacity="0.08"]')).toHaveLength(0);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<LineChart labels={labels} series={three} format={euros} />);
	});
});

describe("BarChart", () => {
	it("apiladas por defecto: una columna por etiqueta, esquinas solo arriba, colores en orden", () => {
		const { container } = render(<BarChart labels={labels} series={three} format={euros} />);
		expect(screen.getByRole("img", { name: "Gráfica de barras" })).toBeTruthy();
		const first = [...container.querySelectorAll("svg > g")].at(-3) as Element;
		const rects = [...first.querySelectorAll("rect")];
		expect(rects.map((r) => r.getAttribute("fill"))).toEqual(PALETTE.slice(0, 3));
		expect(rects.map((r) => r.getAttribute("rx"))).toEqual(["0", "0", "4"]);
		expect(new Set(rects.map((r) => r.getAttribute("x"))).size).toBe(1);
		expect(Number(rects[0]?.getAttribute("width"))).toBeLessThanOrEqual(32);
		expect(rects[0]?.querySelector("title")?.textContent).toBe("Gastos · Ago: 1.240 €");
		expect(screen.getByRole("list")).toBeTruthy();
	});

	it("agrupadas con stacked={false}", () => {
		const { container } = render(<BarChart labels={labels} series={three} stacked={false} />);
		const first = [...container.querySelectorAll("svg > g")].at(-3) as Element;
		const rects = [...first.querySelectorAll("rect")];
		expect(new Set(rects.map((r) => r.getAttribute("x"))).size).toBe(3);
		expect(rects.map((r) => r.getAttribute("rx"))).toEqual(["4", "4", "4"]);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<BarChart labels={labels} series={three} />);
	});
});

describe("PieChart", () => {
	const data = [
		{ name: "Hogar", value: 700 },
		{ name: "Ocio", value: 210 },
		{ name: "Transporte", value: 95 },
		{ name: "Suscripciones", value: 62 },
		{ name: "Otros", value: 217 },
	];

	it("una porción por dato con la paleta, centro y leyenda en columna siempre", () => {
		const { container } = render(<PieChart data={data} center="1.284 €" format={euros} />);
		expect(screen.getByRole("img", { name: "Gráfica circular" })).toBeTruthy();
		const slices = [...container.querySelectorAll("svg path")];
		expect(slices.map((p) => p.getAttribute("fill"))).toEqual(PALETTE.slice(0, 5));
		expect(slices[0]?.querySelector("title")?.textContent).toBe("Hogar: 700 €");
		expect(container.querySelector("svg text")?.textContent).toBe("1.284 €");
		expect(screen.getByRole("list").className).toContain("flex-col");
		expect(dots(container)).toEqual(PALETTE.slice(0, 5));
	});

	it("tarta con hole={0}, anillo con un solo dato y leyenda opcional", () => {
		const { container, rerender } = render(<PieChart data={data} hole={0} legend={false} />);
		expect(container.querySelector("svg path")?.getAttribute("d")).toContain("L100 100 Z");
		expect(screen.queryByRole("list")).toBeNull();
		rerender(<PieChart data={[{ name: "Todo", value: 1 }]} size={100} />);
		const ring = container.querySelector("svg circle") as SVGCircleElement;
		expect(ring.getAttribute("stroke-width")).toBe("20");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<PieChart data={data} center="1.284 €" aria-label="Gasto por categoría" />,
		);
	});
});

describe("ChartLegend", () => {
	it("punto de color y nombre; colores por posición o propios; en columna con vertical", () => {
		const { container, rerender } = render(
			<ChartLegend
				series={[{ name: "Gastos" }, { name: "Ahorro", color: "var(--utility-pink-500)" }]}
			/>,
		);
		expect(dots(container)).toEqual([PALETTE[0], "var(--utility-pink-500)"]);
		expect(screen.getByRole("list").className).toContain("flex-wrap");
		rerender(<ChartLegend vertical series={[{ name: "Gastos" }]} />);
		expect(screen.getByRole("list").className).toContain("flex-col");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ChartLegend series={[{ name: "Gastos" }, { name: "Presupuesto" }]} />,
		);
	});
});
