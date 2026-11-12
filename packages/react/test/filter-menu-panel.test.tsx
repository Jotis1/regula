import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterMenu, FilterPanel, type FilterRule } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const fields = [
	{ value: "status", label: "Estado" },
	{ value: "email", label: "Correo" },
	{
		value: "team",
		label: "Equipo",
		options: [
			{ value: "eng", label: "Ingeniería", supporting: "12 usuarios" },
			{ value: "design", label: "Diseño", supporting: "10 usuarios" },
		],
	},
];
const operators = [
	{ value: "is", label: "Es" },
	{ value: "contains", label: "Contiene" },
];
const applied: FilterRule[] = [
	{ field: "status", operator: "is", value: "Activo" },
	{ field: "email", operator: "contains", value: "gmail" },
	{ field: "team", operator: "is", value: ["design"] },
];

describe("FilterMenu", () => {
	it("el disparador cuenta los filtros aplicados", () => {
		render(
			<>
				<FilterMenu fields={fields} operators={operators} />
				<FilterMenu fields={fields} operators={operators} defaultValue={applied} />
			</>,
		);
		expect(screen.getByRole("button", { name: "Filtros" })).toBeTruthy();
		const active = screen.getByRole("button", { name: /^Filtros\s*3\s*filtros activos$/ });
		expect(active.textContent).toContain("3");
		expect(active.className).toContain("bg-secondary");
	});

	it("sin filtros lo dice; añadir, rellenar y aplicar cuenta solo las filas completas", async () => {
		const onApply = vi.fn();
		render(<FilterMenu fields={fields} operators={operators} onApply={onApply} />);
		const trigger = screen.getByRole("button", { name: "Filtros" });
		await userEvent.click(trigger);
		const dialog = await screen.findByRole("dialog", { name: "Filtros" });
		expect(within(dialog).getByText("No hay filtros")).toBeTruthy();
		await userEvent.click(within(dialog).getByRole("button", { name: "Añadir filtro" }));
		await userEvent.selectOptions(
			within(dialog).getByRole("combobox", { name: "Campo del filtro 1" }),
			"status",
		);
		await userEvent.type(within(dialog).getByRole("textbox", { name: "Valor del filtro 1" }), "Activo");
		// Una segunda fila a medias no se aplica
		await userEvent.click(within(dialog).getByRole("button", { name: "Añadir filtro" }));
		await userEvent.click(within(dialog).getByRole("button", { name: "Aplicar filtros" }));
		expect(onApply).toHaveBeenLastCalledWith([{ field: "status", operator: "is", value: "Activo" }]);
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		expect(screen.getByRole("button", { name: /^Filtros\s*1\s*filtro activo$/ })).toBeTruthy();
	});

	it("«Limpiar todo» quita los filtros y deja el disparador sin recuento", async () => {
		const onApply = vi.fn();
		render(<FilterMenu fields={fields} operators={operators} defaultValue={applied} onApply={onApply} />);
		await userEvent.click(screen.getByRole("button", { name: /^Filtros\s*3\s*filtros activos$/ }));
		const dialog = await screen.findByRole("dialog", { name: "Filtros" });
		expect(within(dialog).getAllByRole("listitem")).toHaveLength(3);
		expect(within(dialog).getByRole("button", { name: /Valor del filtro 3/ }).textContent).toContain(
			"1 elegido10 usuarios",
		);
		await userEvent.click(within(dialog).getByRole("button", { name: "Limpiar todo" }));
		expect(onApply).toHaveBeenLastCalledWith([]);
		await waitFor(() => expect(screen.getByRole("button", { name: "Filtros" })).toBeTruthy());
	});
});

describe("FilterPanel", () => {
	it("filas en dos líneas, aplicar y limpiar", async () => {
		const onApply = vi.fn();
		const ui = (
			<FilterPanel
				fields={fields}
				operators={operators}
				defaultValue={applied.slice(0, 2)}
				onApply={onApply}
			/>
		);
		render(ui);
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		await userEvent.click(screen.getByRole("button", { name: "Quitar el filtro 2" }));
		await userEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
		expect(onApply).toHaveBeenLastCalledWith([applied[0]]);
		await userEvent.click(screen.getByRole("button", { name: "Limpiar todo" }));
		expect(onApply).toHaveBeenLastCalledWith([]);
		expect(screen.getByText("No hay filtros")).toBeTruthy();
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(
			<FilterPanel fields={fields} operators={operators} defaultValue={applied} />,
		);
	});
});
