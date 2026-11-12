import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Table, type TableCellType, type TableColumn } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { full: string; bare: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/table-before.json"), "utf8"),
);

type Row = { id: string; c: string; f: string; i: string };
const legacyRows: Row[] = [
	{ id: "a", c: "Alquiler", f: "1 oct", i: "650 €" },
	{ id: "b", c: "Luz", f: "5 oct", i: "48 €" },
];

describe("Table: la de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<Table<Row>
					title="Movimientos"
					count="2"
					description="Octubre"
					actions={<button type="button">Exportar</button>}
					footer={<p>pie</p>}
					columns={[
						{ key: "c", label: "Concepto", primary: true },
						{ key: "f", label: "Fecha" },
						{ key: "i", label: "Importe", align: "right", render: (r) => <b>{r.i}</b> },
					]}
					rows={legacyRows}
				/>,
			),
		).toBe(BEFORE.full);
		expect(
			renderToStaticMarkup(
				<Table<Row> size="sm" columns={[{ key: "c", label: "Concepto" }]} rows={legacyRows} />,
			),
		).toBe(BEFORE.bare);
	});
});

type Person = { id: string; name: string; role: string; seats: number };
const people: Person[] = [
	{ id: "p1", name: "Olivia", role: "Diseño", seats: 3 },
	{ id: "p2", name: "Ana", role: "Producto", seats: 10 },
	{ id: "p3", name: "Bruno", role: "Datos", seats: 1 },
];
const cols: TableColumn<Person>[] = [
	{ key: "name", label: "Nombre", sortable: true, primary: true },
	{ key: "role", label: "Rol", help: "Lo que hace en el equipo" },
	{ key: "seats", label: "Plazas", sortable: true, align: "right" },
];
const names = () =>
	screen
		.getAllByRole("row")
		.slice(1)
		.map((r) => within(r).getAllByRole("cell").at(-3)?.textContent);

describe("Table: ordenar", () => {
	it("pulsar una cabecera ordena de forma ascendente, lo anuncia con aria-sort y avisa con columna y sentido", async () => {
		const onSortChange = vi.fn();
		render(<Table<Person> title="Equipo" columns={cols} rows={people} onSortChange={onSortChange} />);
		const header = screen.getByRole("columnheader", { name: /Nombre/ });
		expect(header.getAttribute("aria-sort")).toBe("none");
		await userEvent.click(within(header).getByRole("button"));
		expect(header.getAttribute("aria-sort")).toBe("ascending");
		expect(onSortChange).toHaveBeenLastCalledWith({ key: "name", direction: "ascending" });
		expect(names()).toEqual(["Ana", "Bruno", "Olivia"]);
		// Con el teclado: Enter sobre el botón de la cabecera da la vuelta
		within(header).getByRole("button").focus();
		await userEvent.keyboard("{Enter}");
		expect(header.getAttribute("aria-sort")).toBe("descending");
		expect(names()).toEqual(["Olivia", "Bruno", "Ana"]);
	});

	it("ordena los números como números", async () => {
		render(
			<Table<Person>
				columns={cols}
				rows={people}
				defaultSort={{ key: "seats", direction: "ascending" }}
			/>,
		);
		expect(names()).toEqual(["Bruno", "Olivia", "Ana"]);
		expect(screen.getByRole("columnheader", { name: /Plazas/ }).getAttribute("aria-sort")).toBe(
			"ascending",
		);
		// La columna sin orden no lleva aria-sort
		expect(screen.getByRole("columnheader", { name: /Rol/ }).hasAttribute("aria-sort")).toBe(false);
	});

	it("la ayuda de la cabecera es un HelpIcon con su texto", () => {
		render(<Table<Person> columns={cols} rows={people} />);
		expect(screen.getByRole("button", { name: "Ayuda: Lo que hace en el equipo" })).toBeTruthy();
	});
});

describe("Table: selección", () => {
	it("la casilla de la cabecera marca todas las filas visibles y queda marcada", async () => {
		const onSelectionChange = vi.fn();
		render(
			<Table<Person>
				columns={cols}
				rows={people}
				selection="checkbox"
				onSelectionChange={onSelectionChange}
			/>,
		);
		const all = screen.getByRole("checkbox", { name: "Seleccionar todas las filas" }) as HTMLInputElement;
		await userEvent.click(all);
		expect(onSelectionChange).toHaveBeenLastCalledWith(["p1", "p2", "p3"]);
		expect(all.checked).toBe(true);
		for (const i of [0, 1, 2])
			expect(
				(screen.getByRole("checkbox", { name: `Seleccionar la fila ${i + 1}` }) as HTMLInputElement)
					.checked,
			).toBe(true);
		await userEvent.click(all);
		expect(onSelectionChange).toHaveBeenLastCalledWith([]);
	});

	it("una fila suelta deja la cabecera a medias y se marca con Espacio", async () => {
		render(<Table<Person> columns={cols} rows={people} selection="checkbox" />);
		const row = screen.getByRole("checkbox", { name: "Seleccionar la fila 2" }) as HTMLInputElement;
		row.focus();
		await userEvent.keyboard(" ");
		expect(row.checked).toBe(true);
		const all = screen.getByRole("checkbox", { name: "Seleccionar todas las filas" }) as HTMLInputElement;
		expect(all.checked).toBe(false);
		expect(all.indeterminate).toBe(true);
	});

	it("radio elige una sola fila e interruptor marca cada una", async () => {
		const onRadio = vi.fn();
		const { unmount } = render(
			<Table<Person> columns={cols} rows={people} selection="radio" onSelectionChange={onRadio} />,
		);
		await userEvent.click(screen.getByRole("radio", { name: "Seleccionar la fila 1" }));
		await userEvent.click(screen.getByRole("radio", { name: "Seleccionar la fila 3" }));
		expect(onRadio).toHaveBeenLastCalledWith(["p3"]);
		unmount();
		const onToggle = vi.fn();
		render(
			<Table<Person> columns={cols} rows={people} selection="toggle" onSelectionChange={onToggle} />,
		);
		await userEvent.click(screen.getByRole("switch", { name: "Seleccionar la fila 2" }));
		expect(onToggle).toHaveBeenLastCalledWith(["p2"]);
	});

	it("striped pinta las filas alternas", () => {
		render(<Table<Person> columns={cols} rows={people} striped />);
		const rows = screen.getAllByRole("row").slice(1);
		expect(rows[1]?.className).toContain("bg-secondary");
		expect(rows[0]?.className).not.toContain("bg-secondary");
	});
});

type Cells = Record<string, unknown> & { id: string };
const cell: Cells = {
	id: "x",
	text: { title: "Olivia Rhye", subtitle: "olivia@jotis.me" },
	avatar: { name: "Olivia Rhye", subtitle: "@olivia", avatar: { initials: "OR" } },
	file: { name: "Requisitos.pdf", size: "200 KB", icon: <svg data-testid="pdf" /> },
	payment: {
		logo: <svg data-testid="visa" />,
		label: "Visa terminada en 1234",
		detail: "Caduca el 06/2028",
	},
	badge: { label: "Activo", color: "success", dot: true },
	badges: { labels: ["Diseño", "Producto", "Marketing", "Ventas", "Datos"] },
	trend: { value: "1.800 €", change: "20%", direction: "down" },
	"avatar-group": {
		label: "10 usuarios",
		avatars: Array.from({ length: 8 }, (_, i) => ({ initials: `U${i}` })),
	},
	select: {
		value: "en-curso",
		label: "Estado",
		options: [
			{ value: "en-curso", label: "En curso", dot: "brand" },
			{ value: "hecho", label: "Hecho", dot: "success" },
		],
	},
	progress: 60,
	rating: 4.5,
	actions: [{ label: "Borrar" }, { label: "Editar" }],
	"action-icons": [
		{ icon: "copy-01", label: "Copiar" },
		{ icon: "trash-01", label: "Borrar" },
	],
	menu: { label: "Más opciones" },
};
const TYPES = Object.keys(cell).filter((k) => k !== "id") as TableCellType[];

describe("Table: tipos de celda", () => {
	it("hay catorce plantillas (la tendencia sube o baja) y cada una pinta lo suyo", async () => {
		expect(TYPES).toHaveLength(14);
		const onSelect = vi.fn();
		(cell.select as { onChange?: (v: string) => void }).onChange = onSelect;
		render(<Table<Cells> columns={TYPES.map((t) => ({ key: t, label: t, type: t }))} rows={[cell]} />);
		expect(screen.getByText("olivia@jotis.me")).toBeTruthy();
		expect(screen.getByText("@olivia")).toBeTruthy();
		expect(screen.getByTestId("pdf")).toBeTruthy();
		expect(screen.getByTestId("visa")).toBeTruthy();
		expect(screen.getByText("Activo")).toBeTruthy();
		expect(screen.getByText("+2")).toBeTruthy();
		expect(screen.getByText(/Baja/)).toBeTruthy();
		expect(screen.getByText("+3")).toBeTruthy();
		await userEvent.selectOptions(screen.getByRole("combobox", { name: "Estado" }), "hecho");
		expect(onSelect).toHaveBeenCalledWith("hecho");
		expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("60");
		expect(screen.getByRole("img", { name: "4,5 de 5" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Editar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Copiar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Más opciones" })).toBeTruthy();
	});

	it("es accesible con todas las celdas, orden, ayuda y selección en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Table<Cells>
				title="Todo"
				selection="checkbox"
				striped
				columns={TYPES.map((t, i) => ({
					key: t,
					label: t,
					type: t,
					sortable: i === 0,
					help: i === 1 ? "Ayuda" : undefined,
				}))}
				rows={[cell, { ...cell, id: "y" }]}
			/>,
		);
	});
});
