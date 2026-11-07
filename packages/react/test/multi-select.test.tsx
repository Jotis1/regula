import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect } from "../src/index.js";
import { danglingAriaRefsOnServer, expectAccessibleInThemes } from "./helpers.js";

const TEAMS = [
	{ value: "ing", label: "Ingeniería", supporting: "12 usuarios" },
	{ value: "dis", label: "Diseño", supporting: "10 usuarios" },
	{ value: "pro", label: "Producto", supporting: "6 usuarios" },
	{ value: "mkt", label: "Márketing", supporting: "8 usuarios" },
];

// Con la lista abierta, React Aria oculta el resto de la página a la tecnología de apoyo: `hidden` lo sigue encontrando.
const field = () => screen.getByRole("button", { name: "Equipos", hidden: true });
const option = (name: string) => screen.getByRole("option", { name: new RegExp(name) });

describe("MultiSelect", () => {
	it("placeholder sin nada elegido", () => {
		render(<MultiSelect label="Equipos" options={TEAMS} placeholder="Elige equipos" />);
		expect(field().textContent).toContain("Elige equipos");
		expect(screen.getByText("Elige equipos").className).toContain("text-placeholder");
	});

	it("resumen por defecto «n elegidos» y supporting en text-tertiary", () => {
		render(
			<MultiSelect
				label="Equipos"
				options={TEAMS}
				defaultValue={["ing", "dis"]}
				summarySupporting={() => "22 usuarios"}
			/>,
		);
		expect(field().textContent).toContain("2 elegidos");
		expect(screen.getByText("22 usuarios").className).toContain("text-tertiary");
	});

	it("abrir con Enter, buscar sin tildes y elegir con flechas y Enter: casilla marcada, lista abierta y resumen", async () => {
		const onChange = vi.fn();
		render(
			<MultiSelect label="Equipos" options={TEAMS} placeholder="Elige equipos" onChange={onChange} />,
		);
		field().focus();
		await userEvent.keyboard("{Enter}");
		const search = await screen.findByRole("searchbox", { name: "Buscar" });
		await waitFor(() => expect(document.activeElement).toBe(search));
		await userEvent.keyboard("mar");
		expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Márketing8 usuarios"]);
		await userEvent.keyboard("{ArrowDown}{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(["mkt"]);
		expect(option("Márketing").getAttribute("aria-selected")).toBe("true");
		expect((search as HTMLInputElement).value).toBe("mar");
		expect(screen.getByRole("dialog")).toBeTruthy();
		expect(field().textContent).toContain("1 elegido");
	});

	it("sin resultados: textos en castellano y «Borrar búsqueda» vacía el buscador", async () => {
		render(<MultiSelect label="Equipos" options={TEAMS} />);
		await userEvent.click(field());
		const search = await screen.findByRole("searchbox");
		await userEvent.type(search, "zzz");
		expect(screen.getByText("Sin resultados")).toBeTruthy();
		expect(screen.getByText("Prueba con otra palabra.")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Borrar búsqueda" }));
		expect((search as HTMLInputElement).value).toBe("");
		expect(screen.getAllByRole("option")).toHaveLength(4);
	});

	it("textos sustituibles", async () => {
		render(
			<MultiSelect
				label="Equipos"
				options={TEAMS}
				searchLabel="Filtrar"
				emptyTitle="Nada por aquí"
				clearSearchLabel="Limpiar"
				resetLabel="Ninguno"
				selectAllLabel="Todos"
			/>,
		);
		await userEvent.click(field());
		await userEvent.type(await screen.findByRole("searchbox", { name: "Filtrar" }), "zzz");
		expect(screen.getByText("Nada por aquí")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Limpiar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Ninguno" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Todos" })).toBeTruthy();
	});

	it("«Elegir todo» y «Restablecer»", async () => {
		const onChange = vi.fn();
		render(
			<MultiSelect
				label="Equipos"
				options={TEAMS}
				defaultValue={["dis"]}
				placeholder="Elige equipos"
				onChange={onChange}
			/>,
		);
		await userEvent.click(field());
		const dialog = await screen.findByRole("dialog");
		await userEvent.click(within(dialog).getByRole("button", { name: "Elegir todo" }));
		expect(onChange).toHaveBeenLastCalledWith(["ing", "dis", "pro", "mkt"]);
		expect(field().textContent).toContain("4 elegidos");
		await userEvent.click(within(dialog).getByRole("button", { name: "Restablecer" }));
		expect(onChange).toHaveBeenLastCalledWith([]);
		expect(field().textContent).toContain("Elige equipos");
	});

	it("Escape cierra sin perder la selección y el foco vuelve al campo", async () => {
		render(<MultiSelect label="Equipos" options={TEAMS} defaultValue={["ing", "dis"]} />);
		field().focus();
		await userEvent.keyboard("{Enter}");
		await screen.findByRole("dialog");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		expect(field().textContent).toContain("2 elegidos");
		await waitFor(() => expect(document.activeElement).toBe(field()));
	});

	it("abierto de inicio: en línea, sin diálogo ni foco", () => {
		render(<MultiSelect label="Equipos" options={TEAMS} defaultOpen />);
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(screen.getAllByRole("option")).toHaveLength(4);
		expect(document.activeElement).toBe(document.body);
	});

	it("error enlazado, deshabilitado y name con los valores", () => {
		const { container } = render(
			<MultiSelect
				label="Equipos"
				options={TEAMS}
				error="Elige al menos uno."
				name="equipos"
				defaultValue={["ing", "pro"]}
			/>,
		);
		expect(document.getElementById(field().getAttribute("aria-describedby") ?? "")?.textContent).toBe(
			"Elige al menos uno.",
		);
		expect((container.querySelector('input[type="hidden"]') as HTMLInputElement).value).toBe("ing,pro");
	});

	it("mismo alto que Input en lg", () => {
		render(<MultiSelect label="Equipos" options={TEAMS} size="lg" />);
		expect(field().className).toContain("min-h-11");
	});

	it("se renderiza en servidor sin referencias rotas", () => {
		const html = renderToString(<MultiSelect label="Equipos" options={TEAMS} hint="Pista" />);
		expect(danglingAriaRefsOnServer(html)).toEqual([]);
		const open = renderToString(<MultiSelect label="Equipos" options={TEAMS} defaultOpen />);
		expect(open).toContain("Ingeniería");
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<MultiSelect label="Equipos" options={TEAMS} defaultValue={["ing"]} hint="Pista" />
				<MultiSelect label="Abierto" options={TEAMS} defaultOpen />
			</div>,
		);
	});
});
