import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FilterBar, type FilterBarType, type FilterCondition, TreeView } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const FB: { full: string; bare: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/filter-bar-before.json"), "utf8"),
);
const TV: { html: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/tree-view-before.json"), "utf8"),
);
const ids = (html: string) => html.replace(/_R_[a-z0-9]+_/g, "_R_").replace(/react-aria\d+-\d+/g, "ra");

describe("FilterBar y TreeView: los de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(
			ids(
				renderToStaticMarkup(
					<FilterBar
						segments={[
							{ value: "t", label: "Todo" },
							{ value: "g", label: "Gastos" },
						]}
						defaultSegment="t"
						search
						searchPlaceholder="Buscar movimientos"
						activeFilters={[{ label: "Hogar" }, "Importe > 50 €"]}
						onRemoveFilter={() => {}}
						onClear={() => {}}
						extra={<span>extra</span>}
					/>,
				),
			),
		).toBe(FB.full);
		expect(ids(renderToStaticMarkup(<FilterBar />))).toBe(FB.bare);
		const items = [
			{ id: "a", label: "Proyectos", children: [{ id: "a1", label: "Brief", meta: "2 KB" }] },
			{ id: "b", label: "Notas" },
		];
		expect(
			ids(
				renderToStaticMarkup(
					<TreeView aria-label="Archivos" items={items} defaultOpen={["a"]} defaultSelected="a1" />,
				),
			),
		).toBe(TV.html);
	});
});

const segments = [
	{ value: "todo", label: "Ver todo" },
	{ value: "activos", label: "Activos" },
];
const fields = [
	{ value: "estado", label: "Estado" },
	{ value: "correo", label: "Correo" },
];
const operators = [
	{ value: "es", label: "Es igual a" },
	{ value: "contiene", label: "Contiene" },
];

describe("FilterBar: los ocho tipos", () => {
	it.each<FilterBarType>([
		"simple",
		"tabs-search",
		"tabs-date",
		"date",
		"dropdowns",
		"dropdowns-date",
		"advanced",
	])("%s se pinta y es accesible en claro y oscuro", async (type) => {
		await expectAccessibleInThemes(
			<FilterBar
				type={type}
				segments={segments}
				dates={<button type="button">1 ene – 7 ene</button>}
				extra={<button type="button">Hoy</button>}
				fields={[{ label: "Estado", control: <select aria-label="Estado" /> }]}
				conditions={[{ field: "estado", operator: "es", value: "Activo" }]}
				conditionFields={fields}
				conditionOperators={operators}
				onClear={() => {}}
				onOpenFilters={() => {}}
			/>,
		);
	});

	it("tabs-search: vistas, búsqueda y Filtros; simple: búsqueda, fechas y Filtros", () => {
		const { unmount } = render(
			<FilterBar type="tabs-search" segments={segments} onOpenFilters={() => {}} />,
		);
		expect(screen.getByRole("button", { name: "Ver todo" })).toBeTruthy();
		expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Filtros" })).toBeTruthy();
		unmount();
		render(<FilterBar type="simple" dates={<button type="button">Fechas</button>} />);
		expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Fechas" })).toBeTruthy();
	});

	it("dropdowns pinta cada campo con su etiqueta y «Limpiar todo» avisa", async () => {
		const onClear = vi.fn();
		render(
			<FilterBar
				type="dropdowns"
				fields={[
					{ label: "Estado", control: <select aria-label="Estado" /> },
					{ label: "Categoría", control: <select aria-label="Categoría" /> },
				]}
				onClear={onClear}
			/>,
		);
		expect(screen.getByText("Categoría")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Limpiar todo" }));
		expect(onClear).toHaveBeenCalled();
	});

	it("dropdowns-date suma fechas, «Más filtros» y la lupa", async () => {
		const onOpenSearch = vi.fn();
		render(
			<FilterBar
				type="dropdowns-date"
				dates={<button type="button">Fechas</button>}
				onOpenSearch={onOpenSearch}
			/>,
		);
		expect(screen.getByRole("button", { name: "Más filtros" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
		expect(onOpenSearch).toHaveBeenCalled();
	});

	it("advanced: añadir, editar y quitar condiciones avisa con la lista", async () => {
		const onConditionsChange = vi.fn();
		const { rerender } = render(
			<FilterBar
				type="advanced"
				conditions={[]}
				conditionFields={fields}
				conditionOperators={operators}
				onConditionsChange={onConditionsChange}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Añadir un filtro" }));
		expect(onConditionsChange).toHaveBeenLastCalledWith([{ field: "estado", operator: "es", value: "" }]);
		const one: FilterCondition[] = [{ field: "estado", operator: "es", value: "" }];
		rerender(
			<FilterBar
				type="advanced"
				conditions={one}
				conditionFields={fields}
				conditionOperators={operators}
				onConditionsChange={onConditionsChange}
				onClear={() => {}}
			/>,
		);
		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: "Operador del filtro 1" }),
			"contiene",
		);
		expect(onConditionsChange).toHaveBeenLastCalledWith([
			{ field: "estado", operator: "contiene", value: "" },
		]);
		await userEvent.type(screen.getByRole("textbox", { name: "Valor del filtro 1" }), "g");
		expect(onConditionsChange).toHaveBeenLastCalledWith([
			{ field: "estado", operator: "es", value: "g" },
		]);
		await userEvent.click(screen.getByRole("button", { name: "Quitar el filtro 1" }));
		expect(onConditionsChange).toHaveBeenLastCalledWith([]);
		expect(screen.getAllByRole("button", { name: "Limpiar todo" }).length).toBeGreaterThan(0);
	});
});

const tree = [
	{
		id: "org",
		label: "Organización",
		children: [
			{
				id: "diseno",
				label: "Diseño",
				children: [
					{ id: "sienna", label: "Sienna" },
					{ id: "ammar", label: "Ammar" },
				],
			},
			{ id: "ingenieria", label: "Ingeniería" },
		],
	},
	{ id: "ajustes", label: "Ajustes" },
];

describe("TreeView: tamaño y avanzado", () => {
	it("size md sube el alto y la letra de las filas", () => {
		render(<TreeView aria-label="Árbol" size="md" items={tree} />);
		expect(screen.getAllByRole("row")[0]?.className).toContain("text-md");
	});

	it("advanced: marcar una carpeta marca sus hojas, una hoja deja la carpeta a medias y avisa con las hojas", async () => {
		const onCheckedChange = vi.fn();
		render(
			<TreeView
				aria-label="Equipo"
				type="advanced"
				items={tree}
				defaultOpen={["org", "diseno"]}
				onCheckedChange={onCheckedChange}
			/>,
		);
		const boxes = () => screen.getAllByRole("checkbox") as HTMLInputElement[];
		// Organización, Diseño, Sienna, Ammar, Ingeniería, Ajustes
		expect(boxes()).toHaveLength(6);
		await userEvent.click(boxes()[1] as HTMLElement);
		expect(onCheckedChange).toHaveBeenLastCalledWith(["sienna", "ammar"]);
		expect(boxes()[1]?.checked).toBe(true);
		expect(boxes()[2]?.checked).toBe(true);
		// Organización queda a medias (falta Ingeniería)
		expect(boxes()[0]?.indeterminate || boxes()[0]?.getAttribute("aria-checked") === "mixed").toBe(true);
		await userEvent.click(boxes()[3] as HTMLElement);
		expect(onCheckedChange).toHaveBeenLastCalledWith(["sienna"]);
		expect(boxes()[1]?.checked).toBe(false);
	});

	it("advanced: la flecha abre y cierra sin marcar", async () => {
		const onCheckedChange = vi.fn();
		render(
			<TreeView aria-label="Equipo" type="advanced" items={tree} onCheckedChange={onCheckedChange} />,
		);
		expect(screen.queryByText("Diseño")).toBeNull();
		const rows = screen.getAllByRole("row");
		const chevron = rows[0]?.querySelector("button") as HTMLElement;
		await userEvent.click(chevron);
		expect(screen.getByText("Diseño")).toBeTruthy();
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	it("advanced es accesible en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<TreeView
				aria-label="Equipo"
				type="advanced"
				size="md"
				items={tree}
				defaultOpen={["org"]}
				defaultChecked={["sienna"]}
			/>,
		);
	});
});
