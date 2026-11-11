import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityGauge, BarChart, ChartMarker, LineChart, RadarChart } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const rows = (table: HTMLElement) =>
	[...table.querySelectorAll("tbody tr")].map((tr) => [...tr.children].map((c) => c.textContent));

describe("ActivityGauge", () => {
	const data = [
		{ name: "Móvil", value: 72 },
		{ name: "Escritorio", value: 45 },
		{ name: "Tableta", value: 300, max: 1000 },
	];

	it("es una imagen con nombre y lleva los valores en una tabla para lectores", async () => {
		const ui = (
			<ActivityGauge
				data={data}
				label="Usuarios activos"
				value="1.000"
				legend="right"
				aria-label="Uso por dispositivo"
			/>
		);
		const { container } = render(ui);
		expect(screen.getByRole("img", { name: "Uso por dispositivo" })).toBeTruthy();
		const table = screen.getByRole("table", { name: "Uso por dispositivo" });
		expect(table.className).toContain("sr-only");
		expect(rows(table)).toEqual([
			["Móvil", "72 %"],
			["Escritorio", "45 %"],
			["Tableta", "30 %"],
		]);
		expect(screen.getByText("1.000").className).toContain("text-display-sm");
		expect(within(container.querySelector("ul") as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
		await expectAccessibleInThemes(ui);
	});

	it("cada anillo dibuja su fracción sobre la pista, empezando arriba", () => {
		const { container } = render(<ActivityGauge data={[{ name: "A", value: 25 }]} size="xs" />);
		const [track, arc] = [...container.querySelectorAll("circle")] as SVGCircleElement[];
		expect(track?.getAttribute("stroke")).toBe("var(--bg-tertiary)");
		expect(arc?.getAttribute("stroke-width")).toBe("8");
		const length = 2 * Math.PI * 76;
		expect(arc?.getAttribute("stroke-dasharray")).toBe(`${(length / 4).toFixed(2)} ${length.toFixed(2)}`);
		expect(arc?.getAttribute("transform")).toBe("rotate(-90 80 80)");
	});
});

describe("RadarChart", () => {
	const axes = ["Lun", "Mar", "Mié", "Jue", "Vie"];
	const series = [
		{ name: "Esta semana", data: [800, 600, 400, 900, 300] },
		{ name: "La anterior", data: [500, 700, 650, 200, 450] },
	];

	it("tabla para lectores con un eje por fila y una serie por columna", async () => {
		const ui = <RadarChart axes={axes} series={series} format={(v) => `${v} h`} />;
		render(ui);
		const table = screen.getByRole("table", { name: "Gráfica de radar" });
		expect([...table.querySelectorAll("thead th")].map((th) => th.textContent)).toEqual([
			"Eje",
			"Esta semana",
			"La anterior",
		]);
		expect(rows(table)[0]).toEqual(["Lun", "800 h", "500 h"]);
		await expectAccessibleInThemes(ui);
	});

	it("cinco niveles hasta un techo redondo, un polígono por serie y la leyenda debajo", () => {
		const { container } = render(<RadarChart axes={axes} series={series} />);
		const svg = screen.getByRole("img", { name: "Gráfica de radar" });
		// 5 de la rejilla y 2 de las series
		expect(svg.querySelectorAll("polygon")).toHaveLength(7);
		expect([...svg.querySelectorAll("text")].map((t) => t.textContent)).toEqual(
			expect.arrayContaining(["1000", "800", "200", "Lun", "Vie"]),
		);
		expect(container.querySelector("ul")?.textContent).toContain("La anterior");
	});
});

describe("ChartMarker", () => {
	it("la burbuja enseña el valor y la fecha; minimal, solo el valor", () => {
		render(
			<>
				<ChartMarker value="1.218" label="10 ene 2027" />
				<ChartMarker value="980" label="11 ene 2027" type="minimal" />
			</>,
		);
		expect(screen.getByText("1.218")).toBeTruthy();
		expect(screen.getByText("10 ene 2027")).toBeTruthy();
		expect(screen.queryByText("11 ene 2027")).toBeNull();
	});

	it("LineChart y BarChart lo pintan con marker en el punto y en la barra", () => {
		const labels = ["Ene", "Feb", "Mar"];
		const { container } = render(
			<>
				<LineChart
					labels={labels}
					series={[{ name: "Ventas", data: [10, 40, 20] }]}
					marker={{ index: 1 }}
					format={(v) => `${v} €`}
				/>
				<BarChart
					labels={labels}
					series={[{ data: [5, 8, 3] }, { data: [1, 2, 3] }]}
					marker={{ index: 0, type: "dash" }}
				/>
			</>,
		);
		const bubbles = [...container.querySelectorAll(".bg-primary-solid")].map((b) => b.textContent);
		// La línea, con el valor del punto y su etiqueta; la barra, con el total apilado
		expect(bubbles).toEqual(["40 €Feb", "6Ene"]);
		const lines = [...container.querySelectorAll("svg[role=img] line[stroke-width='2']")];
		expect(lines.length).toBeGreaterThanOrEqual(2);
		expect(lines.some((l) => l.getAttribute("stroke-dasharray") === "0 6")).toBe(true);
	});
});
