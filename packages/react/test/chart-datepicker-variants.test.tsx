import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BarChart, DatePicker, LineChart } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: Record<"line" | "lineSingle" | "bar" | "barGrouped", string> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/charts-before.json"), "utf8"),
);

const labels = ["Ene", "Feb", "Mar", "Abr"];
const series = [
	{ name: "Ingresos", data: [10, 40, 25, 60] },
	{ name: "Gastos", data: [5, 20, 30, 15] },
];

describe("LineChart y BarChart: los de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(<LineChart labels={labels} series={series} format={(v) => `${v} €`} />),
		).toBe(BEFORE.line);
		expect(renderToStaticMarkup(<LineChart labels={labels} series={series.slice(0, 1)} />)).toBe(
			BEFORE.lineSingle,
		);
		expect(renderToStaticMarkup(<BarChart labels={labels} series={series} />)).toBe(BEFORE.bar);
		expect(
			renderToStaticMarkup(<BarChart labels={labels} series={series} stacked={false} legend={false} />),
		).toBe(BEFORE.barGrouped);
	});
});

describe("LineChart y BarChart: leyenda y títulos de los ejes", () => {
	it.each([
		["LineChart", LineChart],
		["BarChart", BarChart],
	] as const)(
		"%s: legend top y true son lo mismo, right la pone en columna a la derecha y false la quita",
		(_, Chart) => {
			const html = (legend: boolean | "top" | "right") =>
				renderToStaticMarkup(<Chart labels={labels} series={series} legend={legend} />);
			expect(html("top")).toBe(html(true));
			const right = html("right");
			expect(right).toContain("flex-row");
			expect(right).toContain("flex-col");
			// La leyenda va detrás del dibujo
			expect(right.indexOf("</svg>")).toBeLessThan(right.indexOf("<ul"));
			expect(html(false)).not.toContain("<ul");
			expect(html("top").indexOf("<ul")).toBeLessThan(html("top").indexOf("<svg"));
		},
	);

	it.each([
		["LineChart", LineChart],
		["BarChart", BarChart],
	] as const)(
		"%s: axisLabels pinta el título del eje vertical girado y el del horizontal bajo las etiquetas",
		(_, Chart) => {
			const { container } = render(
				<Chart labels={labels} series={series} axisLabels={{ x: "Mes", y: "Usuarios activos" }} />,
			);
			const texts = [...container.querySelectorAll("text")];
			const y = texts.find((t) => t.textContent === "Usuarios activos");
			const x = texts.find((t) => t.textContent === "Mes");
			expect(y?.getAttribute("transform")).toContain("rotate(-90)");
			expect(x?.getAttribute("y")).toBe("236");
			// Las etiquetas de los meses suben para dejarle sitio: 240 - 48 + 22
			expect(texts.find((t) => t.textContent === "Ene")?.getAttribute("y")).toBe("214");
		},
	);

	it("sin axisLabels no hay títulos y los ejes no se mueven", () => {
		const { container } = render(<LineChart labels={labels} series={series} />);
		expect(texts(container)).not.toContain("Mes");
		expect(
			[...container.querySelectorAll("text")].find((t) => t.textContent === "Ene")?.getAttribute("y"),
		).toBe("234");
	});

	it("es accesible con leyenda a la derecha y títulos", async () => {
		await expectAccessibleInThemes(
			<LineChart
				labels={labels}
				series={series}
				legend="right"
				axisLabels={{ x: "Mes", y: "Usuarios" }}
			/>,
		);
		await expectAccessibleInThemes(
			<BarChart
				labels={labels}
				series={series}
				legend="right"
				axisLabels={{ x: "Mes", y: "Usuarios" }}
			/>,
		);
	});
});

const texts = (c: HTMLElement) => [...c.querySelectorAll("text")].map((t) => t.textContent);

const TODAY = new Date(2026, 9, 29);
const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00"];
const cell = (n: number) =>
	within(screen.getByRole("grid")).getByText(String(n), {
		selector: "[role=button]:not([data-outside-month])",
	}) as HTMLElement;

describe("DatePicker: horas disponibles", () => {
	it("elegir día y «10:30» avisa con la fecha y la hora, y la hora queda marcada", async () => {
		const onApply = vi.fn();
		render(<DatePicker inline today={TODAY} times={TIMES} onApply={onApply} />);
		const apply = screen.getByRole("button", { name: "Aplicar" });
		await userEvent.click(cell(15));
		// Sin hora todavía no se puede aplicar
		expect(apply.hasAttribute("disabled")).toBe(true);
		const slot = screen.getByRole("button", { name: "10:30" });
		await userEvent.click(slot);
		expect(slot.getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByRole("button", { name: "10:00" }).getAttribute("aria-pressed")).toBe("false");
		await userEvent.click(apply);
		expect(onApply).toHaveBeenCalledTimes(1);
		const value = onApply.mock.calls[0]?.[0];
		expect(value.time).toBe("10:30");
		expect(value.start.getTime()).toBe(new Date(2026, 9, 15, 10, 30).getTime());
	});

	it("la lista de horas tiene nombre y el disparador enseña día y hora tras aplicar", async () => {
		render(<DatePicker defaultOpen today={TODAY} times={TIMES} />);
		expect(screen.getByRole("group", { name: "Horas disponibles" })).toBeTruthy();
		await userEvent.click(cell(15));
		await userEvent.click(screen.getByRole("button", { name: "09:30" }));
		await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
		expect(screen.getByRole("button", { name: /15 oct 2026, 09:30/ })).toBeTruthy();
	});

	it("cambiar de día conserva la hora elegida", async () => {
		render(<DatePicker inline today={TODAY} times={TIMES} />);
		await userEvent.click(cell(15));
		await userEvent.click(screen.getByRole("button", { name: "11:00" }));
		await userEvent.click(cell(16));
		expect(screen.getByRole("button", { name: "11:00" }).getAttribute("aria-pressed")).toBe("true");
	});

	it("sin times no hay lista y onApply no lleva hora", async () => {
		const onApply = vi.fn();
		render(<DatePicker inline today={TODAY} onApply={onApply} />);
		expect(screen.queryByRole("group", { name: "Horas disponibles" })).toBeNull();
		await userEvent.click(cell(15));
		await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
		expect(onApply.mock.calls[0]?.[0]).toEqual({ start: new Date(2026, 9, 15) });
	});
});

describe("DatePicker: presentación en modal", () => {
	it("se abre en un diálogo modal con el fondo, y Escape lo cierra devolviendo el foco", async () => {
		render(<DatePicker presentation="modal" today={TODAY} />);
		const trigger = screen.getByRole("button", { name: "Elegir fecha" });
		await userEvent.click(trigger);
		const dialog = await screen.findByRole("dialog", { name: "Selector de fecha" });
		expect(dialog.closest(".fixed")).toBeTruthy();
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(document.activeElement).toBe(trigger);
	});

	it("elegir día y aplicar en el modal funciona igual y lo cierra", async () => {
		const onApply = vi.fn();
		render(<DatePicker presentation="modal" defaultOpen today={TODAY} onApply={onApply} />);
		await userEvent.click(cell(20));
		await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
		expect(onApply).toHaveBeenCalledWith({ start: new Date(2026, 9, 20) });
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});

describe("DatePicker: pie con la hora", () => {
	it("el pie enseña el día y la hora elegidos", async () => {
		render(<DatePicker inline today={TODAY} times={TIMES} />);
		await userEvent.click(cell(15));
		await userEvent.click(screen.getByRole("button", { name: "10:30" }));
		expect(screen.getByText("15 oct 2026, 10:30")).toBeTruthy();
	});
});
