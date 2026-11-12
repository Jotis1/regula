import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Download01 } from "@untitledui/icons";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
	ActivityFeed,
	Badge,
	Button,
	MetricCard,
	Pagination,
	Table,
	type TableColumn,
} from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

type Row = { id?: string; c: string; f: string; ok: boolean; i: string };
const columns: TableColumn<Row>[] = [
	{ key: "c", label: "Concepto", primary: true },
	{ key: "f", label: "Fecha" },
	{
		key: "e",
		label: "Estado",
		render: (r) => (
			<Badge color={r.ok ? "success" : "warning"} dot size="sm">
				{r.ok ? "Pagado" : "Pendiente"}
			</Badge>
		),
	},
	{ key: "i", label: "Importe", align: "right" },
];
const rows: Row[] = [
	{ c: "Alquiler", f: "01 oct", ok: true, i: "650,00 €" },
	{ c: "Seguro del coche", f: "15 oct", ok: false, i: "210,00 €" },
];
const table = (
	<Table
		title="Movimientos"
		count="240"
		description="Octubre de 2026."
		actions={
			<Button hierarchy="secondary" iconLeading={Download01} size="sm">
				Exportar
			</Button>
		}
		columns={columns}
		rows={rows}
		footer={<Pagination total={24} />}
	/>
);

describe("Table", () => {
	it("cabecera con título, total y descripción; la tabla se llama como el título", () => {
		render(table);
		const t = screen.getByRole("table", { name: /Movimientos/ });
		expect(screen.getByRole("heading", { level: 3, name: /Movimientos/ }).textContent).toBe(
			"Movimientos240",
		);
		expect(screen.getByText("Octubre de 2026.")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Exportar" })).toBeTruthy();
		expect(
			within(t)
				.getAllByRole("columnheader")
				.map((h) => h.textContent),
		).toEqual(["Concepto", "Fecha", "Estado", "Importe"]);
		expect(screen.getByRole("navigation", { name: "Paginación" })).toBeTruthy();
	});

	it("columna principal en text-primary, números a la derecha y render por celda", () => {
		render(table);
		const [first] = screen.getAllByRole("row").slice(1);
		const cells = within(first as HTMLElement).getAllByRole("cell");
		expect(cells[0]?.className).toContain("text-primary");
		expect(cells[1]?.className).toContain("text-tertiary");
		expect(cells[2]?.textContent).toBe("Pagado");
		expect(cells[3]?.className).toContain("text-right");
		expect(screen.getByRole("columnheader", { name: "Importe" }).className).toContain("text-right");
		expect(screen.getByRole("columnheader", { name: "Concepto" }).className).toContain("bg-secondary");
	});

	it("filas de 72px por defecto y 56px en sm; la zona desplazable se alcanza con teclado", async () => {
		const { rerender } = render(<Table columns={columns} rows={rows} />);
		expect(screen.getAllByRole("cell")[0]?.className).toContain("h-18");
		rerender(<Table columns={columns} rows={rows} size="sm" />);
		expect(screen.getAllByRole("cell")[0]?.className).toContain("h-14");
		await userEvent.tab();
		expect(document.activeElement?.className).toContain("overflow-x-auto");
	});

	it("se pinta en servidor sin directiva, con su render", () => {
		const html = renderToString(table);
		expect(html).toContain("Pendiente");
		expect(html).toContain("650,00 €");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(table);
	});
});

describe("MetricCard", () => {
	it("cifra en Bricolage 36/44, tendencia con flecha y texto para lectores de pantalla", () => {
		render(
			<MetricCard
				label="Gasto del mes"
				value="1.284 €"
				change="12%"
				trend="down"
				period="vs. septiembre"
			/>,
		);
		const value = screen.getByText("1.284 €");
		for (const c of ["font-display", "text-display-md", "font-semibold"])
			expect(value.className).toContain(c);
		const trend = screen.getByText("12%").closest("span") as HTMLElement;
		expect(trend.className).toContain("text-error-primary");
		expect(trend.querySelector("svg")).toBeTruthy();
		expect(trend.textContent).toBe("Baja 12%");
		expect(screen.getByText("vs. septiembre")).toBeTruthy();
	});

	it("sube por defecto en success; el menú es un botón con nombre o un nodo propio", async () => {
		const onMenu = vi.fn();
		const { rerender } = render(
			<MetricCard label="Ahorro" value="420 €" change="8%" menu onMenu={onMenu} />,
		);
		expect((screen.getByText("8%").closest("span") as HTMLElement).className).toContain(
			"text-success-primary",
		);
		await userEvent.click(screen.getByRole("button", { name: "Más opciones" }));
		expect(onMenu).toHaveBeenCalledOnce();
		rerender(<MetricCard label="Ahorro" value="420 €" menu={<button type="button">Propio</button>} />);
		expect(screen.getByRole("button", { name: "Propio" })).toBeTruthy();
		expect(screen.queryByText("8%")).toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<MetricCard
					label="Gasto del mes"
					value="1.284 €"
					change="12%"
					trend="down"
					period="vs. septiembre"
					menu
				/>
				<MetricCard label="Ahorro" value="420 €" change="8%" period="vs. septiembre" />
			</div>,
		);
	});
});

describe("ActivityFeed", () => {
	const items = [
		{
			author: "Pecunia",
			avatar: { initials: "Pe" },
			time: "Hace 2 min",
			text: (
				<>
					Importado <strong>extracto-octubre.csv</strong> con 84 movimientos.
				</>
			),
			unread: true,
		},
		{ author: "Vinculum", time: "Ayer", text: "3 contactos fusionados.", online: true },
	];

	it("lista ordenada con autor, hora, texto, punto de sin leer y separadores", () => {
		render(<ActivityFeed items={items} />);
		const list = screen.getByRole("list");
		expect(list.tagName).toBe("OL");
		expect(list.className).toContain("[&>li+li]:border-t");
		const [first, second] = screen.getAllByRole("listitem");
		expect(within(first as HTMLElement).getByText("Sin leer").className).toContain("sr-only");
		expect(within(first as HTMLElement).getByText("extracto-octubre.csv").tagName).toBe("STRONG");
		expect(within(second as HTMLElement).queryByText("Sin leer")).toBeNull();
		// Sin avatar: iniciales del autor
		expect(within(second as HTMLElement).getByText("Vi")).toBeTruthy();
	});

	it("connector: línea entre avatares en vez de separadores (no tras el último)", () => {
		const { container } = render(<ActivityFeed connector items={items} />);
		expect(screen.getByRole("list").className).toContain("gap-0");
		expect(container.querySelectorAll('span[aria-hidden="true"].w-0\\.5')).toHaveLength(1);
	});

	it("se pinta en servidor sin directiva", () => {
		expect(renderToString(<ActivityFeed items={items} />)).toContain("3 contactos fusionados.");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<ActivityFeed items={items} />);
	});
});
