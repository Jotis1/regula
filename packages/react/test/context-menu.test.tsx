import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu, type ContextMenuItem } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const simple = (onCut = vi.fn()): ContextMenuItem[] => [
	{ label: "Cortar", shortcut: "⌘X", onSelect: onCut },
	{ label: "Copiar", shortcut: "⌘C" },
	{ divider: true },
	{
		label: "Más herramientas",
		icon: "settings-02",
		items: [{ label: "Guardar como" }, { label: "Desarrollador" }],
	},
];

function Controlled() {
	const [selected, setSelected] = useState(["a"]);
	return (
		<ContextMenu
			items={[
				{
					section: "Opciones",
					selection: "multiple",
					selected,
					onSelectionChange: setSelected,
					items: [
						{ value: "a", label: "Alfa" },
						{ value: "b", label: "Beta" },
					],
				},
			]}
		>
			<div data-testid="zona">Zona</div>
		</ContextMenu>
	);
}

const area = () => screen.getByTestId("zona");

const renderMenu = (items: ContextMenuItem[] = simple()) =>
	render(
		<ContextMenu items={items} aria-label="Acciones">
			<div data-testid="zona" style={{ width: 300, height: 200 }}>
				Zona
			</div>
		</ContextMenu>,
	);

describe("ContextMenu", () => {
	it("el botón derecho cancela el menú del navegador, abre el nuestro y pone el foco en la primera opción", async () => {
		renderMenu();
		expect(screen.queryByRole("menu")).toBeNull();
		const notCancelled = fireEvent.contextMenu(area(), { clientX: 40, clientY: 50 });
		expect(notCancelled).toBe(false); // preventDefault: el navegador no abre el suyo
		const menu = await screen.findByRole("menu", { name: "Acciones" });
		const items = within(menu).getAllByRole("menuitem");
		expect(items.map((i) => i.textContent)).toEqual(["Cortar⌘X", "Copiar⌘C", "Más herramientas"]);
		await waitFor(() => expect(document.activeElement).toBe(items[0]));
	});

	it("elegir una acción la ejecuta y cierra el menú", async () => {
		const onCut = vi.fn();
		renderMenu(simple(onCut));
		fireEvent.contextMenu(area());
		await userEvent.click(await screen.findByRole("menuitem", { name: /Cortar/ }));
		expect(onCut).toHaveBeenCalledOnce();
		await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
	});

	it("Mayús+F10 y la tecla de menú lo abren con teclado", async () => {
		renderMenu();
		area().focus();
		fireEvent.keyDown(area(), { key: "F10", shiftKey: true });
		expect(await screen.findByRole("menu")).toBeTruthy();
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
		fireEvent.keyDown(area(), { key: "ContextMenu" });
		expect(await screen.findByRole("menu")).toBeTruthy();
	});

	it("Escape cierra y devuelve el foco a la zona", async () => {
		renderMenu();
		fireEvent.contextMenu(area());
		await screen.findByRole("menu");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
		await waitFor(() => expect(document.activeElement?.contains(area())).toBe(true));
	});

	it("→ abre el submenú y ← lo cierra", async () => {
		renderMenu();
		fireEvent.contextMenu(area());
		const parent = await screen.findByRole("menuitem", { name: "Más herramientas" });
		expect(parent.getAttribute("aria-haspopup")).toBe("menu");
		parent.focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(await screen.findByRole("menuitem", { name: "Guardar como" })).toBeTruthy();
		await userEvent.keyboard("{ArrowLeft}");
		await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Guardar como" })).toBeNull());
		expect(screen.getByRole("menu", { name: "Acciones" })).toBeTruthy();
	});

	it("los grupos con elección: check para varias y punto para una, anunciados como opciones marcadas", async () => {
		const onMany = vi.fn();
		const onOne = vi.fn();
		render(
			<ContextMenu
				aria-label="Ver"
				items={[
					{
						section: "Barras",
						selection: "multiple",
						selected: ["marcadores"],
						onSelectionChange: onMany,
						items: [
							{ value: "marcadores", label: "Mostrar marcadores" },
							{ value: "urls", label: "Mostrar URL completas" },
						],
					},
					{ divider: true },
					{
						section: "Perfil",
						selection: "single",
						selected: "olivia",
						onSelectionChange: onOne,
						items: [
							{ value: "olivia", label: "Olivia Rhye" },
							{ value: "sienna", label: "Sienna Hewitt" },
						],
					},
				]}
			>
				<div data-testid="zona">Zona</div>
			</ContextMenu>,
		);
		fireEvent.contextMenu(area());
		const checks = await screen.findAllByRole("menuitemcheckbox");
		expect(checks.map((c) => c.getAttribute("aria-checked"))).toEqual(["true", "false"]);
		expect(checks[0]?.querySelector("svg")).not.toBeNull();
		expect(checks[1]?.querySelector("svg")).toBeNull();
		const radios = screen.getAllByRole("menuitemradio");
		expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["true", "false"]);
		expect(radios[0]?.querySelector(".bg-fg-success-primary")).not.toBeNull();
		expect(screen.getAllByRole("group").map((g) => g.getAttribute("aria-label"))).toEqual([
			"Barras",
			"Perfil",
		]);
		await userEvent.click(checks[1] as HTMLElement);
		expect(onMany).toHaveBeenLastCalledWith(["marcadores", "urls"]);
		// Elegir en un grupo de varias no cierra el menú
		expect(screen.getByRole("menu")).toBeTruthy();
		await userEvent.click(screen.getAllByRole("menuitemradio")[1] as HTMLElement);
		expect(onOne).toHaveBeenLastCalledWith("sienna");
	});

	it("un grupo controlado cambia su marca al cambiar `selected`", async () => {
		render(<Controlled />);
		fireEvent.contextMenu(area());
		const [alfa, beta] = await screen.findAllByRole("menuitemcheckbox");
		await userEvent.click(beta as HTMLElement);
		await waitFor(() => expect(beta?.getAttribute("aria-checked")).toBe("true"));
		expect(alfa?.getAttribute("aria-checked")).toBe("true");
	});

	it("comparte el aspecto de las opciones con Dropdown", async () => {
		renderMenu([{ label: "Eliminar", danger: true }]);
		fireEvent.contextMenu(area());
		const item = await screen.findByRole("menuitem", { name: "Eliminar" });
		expect(item.className).toContain("text-error-primary");
		expect(item.className).toContain("data-focused:bg-primary_hover");
		expect(screen.getByRole("menu").parentElement?.className).toContain("bg-primary_alt");
	});

	it("defaultOpen pinta el menú en línea, sin foco, y se cierra al elegir", async () => {
		const onCut = vi.fn();
		render(
			<ContextMenu items={simple(onCut)} defaultOpen aria-label="Acciones">
				<div data-testid="zona">Zona</div>
			</ContextMenu>,
		);
		const item = screen.getByRole("menuitem", { name: /Cortar/ });
		expect(document.activeElement).not.toBe(item);
		await userEvent.click(item);
		expect(onCut).toHaveBeenCalledOnce();
		await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
	});

	it("se pinta en el servidor: solo la zona, con el menú cerrado", () => {
		const html = renderToString(
			<ContextMenu items={simple()}>
				<div>Zona</div>
			</ContextMenu>,
		);
		expect(html).toContain("Zona");
		expect(html).not.toContain('role="menu"');
	});

	it("axe en claro y oscuro, con el menú en línea", async () => {
		await expectAccessibleInThemes(
			<ContextMenu items={simple()} defaultOpen aria-label="Acciones">
				<div style={{ height: 240 }}>Zona</div>
			</ContextMenu>,
		);
	});
});
