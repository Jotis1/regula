import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Button, Dropdown, FilterBar, SidebarNav } from "../src/index.js";
import { danglingAriaRefsOnServer, expectAccessibleInThemes } from "./helpers.js";

describe("SidebarNav", () => {
	const props = {
		brand: "jotis.me",
		search: true,
		items: [
			{ icon: "home-line" as const, label: "Inicio", href: "/", active: true },
			{ icon: "bar-chart-01" as const, label: "Panel", href: "/panel/", badge: 3 },
			{ icon: "currency-euro" as const, label: "Pecunia" },
		],
		footerItems: [{ icon: "settings-02" as const, label: "Ajustes", href: "/ajustes/" }],
		user: { initials: "AD", name: "Administrador", supporting: "admin@jotis.me" },
	};

	it("navegación con nombre, página actual, contador, pie y ficha con cerrar sesión", async () => {
		const onLogout = vi.fn();
		render(<SidebarNav {...props} onLogout={onLogout} />);
		const nav = screen.getByRole("navigation", { name: "Principal" });
		expect(nav.className).toContain("w-[296px]");
		expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
		const current = screen.getByRole("link", { name: "Inicio" });
		expect(current.getAttribute("aria-current")).toBe("page");
		expect(current.className).toContain("aria-[current=page]:bg-secondary_hover");
		expect(screen.getByRole("link", { name: /Panel/ }).textContent).toBe("Panel3");
		expect(screen.getByRole("link", { name: "Ajustes" }).getAttribute("href")).toBe("/ajustes/");
		// Sin href no se inventa un enlace
		expect(screen.queryByRole("link", { name: "Pecunia" })).toBeNull();
		expect(screen.getByText("Pecunia").tagName).toBe("SPAN");
		expect(screen.getByText("Administrador")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
		expect(onLogout).toHaveBeenCalledOnce();
	});

	it("se pinta en servidor y los textos se sustituyen", () => {
		const html = renderToString(
			<SidebarNav {...props} labels={{ nav: "Apps", search: "Busca", logout: "Salir" }} />,
		);
		expect(html).toContain('aria-label="Apps"');
		expect(html).toContain('placeholder="Busca"');
		expect(html).toContain("Salir");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<SidebarNav {...props} />);
	});
});

describe("Dropdown", () => {
	const make = (onSelect = vi.fn()) => [
		{ icon: "user-01" as const, label: "Ver perfil", shortcut: "⌘P", onSelect },
		{ icon: "settings-02" as const, label: "Ajustes", shortcut: "⌘S" },
		{ icon: "copy-01" as const, label: "Duplicar" },
		{ divider: true as const },
		{ icon: "trash-01" as const, label: "Eliminar", danger: true },
	];

	it("con clic el foco entra en el menú; con Enter, al primer ítem; las flechas recorren y Enter elige y cierra", async () => {
		const onSelect = vi.fn();
		render(<Dropdown label="Acciones" items={make(onSelect)} />);
		const trigger = screen.getByRole("button", { name: "Acciones" });
		expect(trigger.getAttribute("aria-haspopup")).toMatch(/^(true|menu)$/); // "true" equivale a "menu"
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		await userEvent.click(trigger);
		const menu = screen.getByRole("menu", { name: "Acciones" });
		const items = screen.getAllByRole("menuitem");
		expect(items).toHaveLength(4);
		// Con ratón, React Aria enfoca el menú; con teclado, el primer ítem
		expect(menu.contains(document.activeElement)).toBe(true);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(document.activeElement).toBe(trigger));
		await userEvent.keyboard("{Enter}");
		expect(document.activeElement).toBe(screen.getAllByRole("menuitem")[0]);
		expect(screen.getByRole("menu").querySelectorAll('[role="separator"]')).toHaveLength(1);
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement?.textContent).toBe(items[1]?.textContent);
		await userEvent.keyboard("{ArrowUp}{Enter}");
		expect(onSelect).toHaveBeenCalledOnce();
		expect(screen.queryByRole("menu")).toBeNull();
		// React Aria devuelve el foco en el siguiente fotograma
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("Escape cierra y devuelve el foco; flecha arriba en el botón abre en el último", async () => {
		render(<Dropdown label="Acciones" items={make()} />);
		const trigger = screen.getByRole("button", { name: "Acciones" });
		trigger.focus();
		await userEvent.keyboard("{ArrowUp}");
		const items = screen.getAllByRole("menuitem");
		expect(document.activeElement).toBe(items[3]);
		expect(trigger.getAttribute("aria-expanded")).toBe("true");
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("menu")).toBeNull();
		await waitFor(() => expect(document.activeElement).toBe(trigger));
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(screen.getAllByRole("menuitem")[0]);
	});

	it("defaultOpen pinta el menú sin llevarse el foco; danger, atajos y cabecera", () => {
		render(<Dropdown label="Acciones" defaultOpen header={<span>Administrador</span>} items={make()} />);
		expect(screen.getByRole("menu")).toBeTruthy();
		expect(document.activeElement).toBe(document.body);
		const del = screen.getByRole("menuitem", { name: "Eliminar" });
		expect(del.className).toContain("text-error-primary");
		expect(screen.getByRole("menuitem", { name: /Ver perfil/ }).querySelector("kbd")?.textContent).toBe(
			"⌘P",
		);
		expect(screen.getByText("Administrador")).toBeTruthy();
	});

	it("abierto de inicio va en línea bajo el botón; elegir ejecuta y cierra", async () => {
		const onSelect = vi.fn();
		render(<Dropdown label="Acciones" defaultOpen items={make(onSelect)} />);
		const panel = screen.getByRole("menu").parentElement as HTMLElement;
		expect(panel.className).toContain("absolute");
		expect(panel.className).toContain("top-[calc(100%+4px)]");
		await userEvent.click(screen.getByRole("menuitem", { name: /Ver perfil/ }));
		expect(onSelect).toHaveBeenCalledOnce();
		expect(screen.queryByRole("menu")).toBeNull();
	});

	it("el botón cierra el menú abierto de inicio", async () => {
		render(<Dropdown label="Acciones" defaultOpen items={make()} />);
		await userEvent.click(screen.getByRole("button", { name: "Acciones" }));
		expect(screen.queryByRole("menu")).toBeNull();
	});

	it("controlado: solo avisa; disparador propio", async () => {
		const onOpenChange = vi.fn();
		render(
			<Dropdown
				open={false}
				onOpenChange={onOpenChange}
				trigger={<Button hierarchy="tertiary" iconOnly="dots-vertical" label="Más" />}
				items={make()}
			/>,
		);
		const trigger = screen.getByRole("button", { name: "Más" });
		expect(trigger.getAttribute("aria-haspopup")).toMatch(/^(true|menu)$/); // "true" equivale a "menu"
		await userEvent.click(trigger);
		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole("menu")).toBeNull();
	});

	it("axe en claro y oscuro, abierto", async () => {
		await expectAccessibleInThemes(<Dropdown label="Acciones" defaultOpen items={make()} />);
	});

	it("abierto de inicio, el HTML de servidor no repite ids ni deja referencias rotas", () => {
		// Antes, el panel en línea iba dentro de MenuTrigger y cada opción recibía el id del botón
		const html = renderToString(
			<Dropdown label="Acciones" defaultOpen header={<span>Cabecera</span>} items={make()} />,
		);
		const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
		expect(danglingAriaRefsOnServer(html)).toEqual([]);
		expect(html).not.toMatch(/role="menuitem"[^>]*aria-haspopup/);
	});

	// Elección única (requisito «Menú con una opción elegida»): el selector de tema de la web
	const themes = [
		{ icon: "monitor-01" as const, label: "Sistema", value: "sistema" },
		{ icon: "sun" as const, label: "Claro", value: "claro" },
		{ icon: "moon-01" as const, label: "Oscuro", value: "oscuro" },
	];

	it("con elección, la opción elegida lleva check y se anuncia como menuitemradio marcada", async () => {
		render(<Dropdown label="Tema" selectedValue="claro" items={themes} />);
		await userEvent.click(screen.getByRole("button", { name: "Tema" }));
		const radios = screen.getAllByRole("menuitemradio");
		expect(radios.map((r) => r.textContent)).toEqual(["Sistema", "Claro", "Oscuro"]);
		expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
		expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
		// El check solo en la elegida: 3 iconos de opción + 1 check
		expect(radios.map((r) => r.querySelectorAll("svg").length)).toEqual([1, 2, 1]);
	});

	it("con elección, elegir otra con el teclado avisa con su valor, cierra y devuelve el foco al botón", async () => {
		const onSelectionChange = vi.fn();
		render(
			<Dropdown
				label="Tema"
				selectedValue="claro"
				onSelectionChange={onSelectionChange}
				items={themes}
			/>,
		);
		const trigger = screen.getByRole("button", { name: "Tema" });
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		await userEvent.keyboard("{ArrowDown}{Enter}");
		expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith("oscuro");
		expect(screen.queryByRole("menu")).toBeNull();
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("con elección, la marca sigue a selectedValue cada vez que se abre, lo decide quien lo usa", async () => {
		const { rerender } = render(<Dropdown label="Tema" selectedValue="claro" items={themes} />);
		await userEvent.click(screen.getByRole("button", { name: "Tema" }));
		await userEvent.click(screen.getByRole("menuitemradio", { name: "Oscuro" }));
		// El menú solo avisa: si quien lo usa no cambia el valor, al abrirlo de nuevo sigue marcada «Claro»
		await userEvent.click(screen.getByRole("button", { name: "Tema" }));
		expect(screen.getAllByRole("menuitemradio").map((r) => r.getAttribute("aria-checked"))).toEqual([
			"false",
			"true",
			"false",
		]);
		await userEvent.keyboard("{Escape}");
		rerender(<Dropdown label="Tema" selectedValue="oscuro" items={themes} />);
		await userEvent.click(screen.getByRole("button", { name: "Tema" }));
		expect(screen.getAllByRole("menuitemradio").map((r) => r.getAttribute("aria-checked"))).toEqual([
			"false",
			"false",
			"true",
		]);
	});

	it("sin elección, los elementos siguen siendo menuitem, sin check, y cada acción llama a su onSelect", async () => {
		const onSelect = vi.fn();
		render(<Dropdown label="Acciones" items={make(onSelect)} />);
		await userEvent.click(screen.getByRole("button", { name: "Acciones" }));
		expect(screen.getAllByRole("menuitem")).toHaveLength(4);
		expect(screen.queryAllByRole("menuitemradio")).toHaveLength(0);
		expect(screen.getByRole("menu").querySelector('[data-selected="true"]')).toBeNull();
		await userEvent.click(screen.getByRole("menuitem", { name: /Ver perfil/ }));
		expect(onSelect).toHaveBeenCalledOnce();
	});

	it("con elección abierta de inicio, el HTML de servidor marca la elegida y no deja referencias rotas", () => {
		const html = renderToString(
			<Dropdown label="Tema" defaultOpen selectedValue="oscuro" items={themes} />,
		);
		expect(html.match(/role="menuitemradio"/g)).toHaveLength(3);
		expect(html.match(/aria-checked="true"/g)).toHaveLength(1);
		expect(danglingAriaRefsOnServer(html)).toEqual([]);
	});
});

describe("FilterBar", () => {
	const segments = [
		{ value: "t", label: "Todo" },
		{ value: "g", label: "Gastos" },
	];

	it("vistas, buscador, botón con el número de filtros, tags que se quitan y limpiar todo", async () => {
		const onSearch = vi.fn();
		const onRemoveFilter = vi.fn();
		const onClear = vi.fn();
		const onSegment = vi.fn();
		render(
			<FilterBar
				segments={segments}
				defaultSegment="t"
				onSegment={onSegment}
				onSearch={onSearch}
				searchPlaceholder="Buscar movimientos"
				activeFilters={[{ label: "Categoría: Hogar" }, "Importe > 50 €"]}
				onRemoveFilter={onRemoveFilter}
				onClear={onClear}
			/>,
		);
		expect(screen.getByRole("group", { name: "Vista" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Gastos" }));
		expect(onSegment).toHaveBeenCalledWith("g");
		const box = screen.getByRole("textbox", { name: "Buscar" });
		expect(box.getAttribute("placeholder")).toBe("Buscar movimientos");
		await userEvent.type(box, "luz");
		expect(onSearch).toHaveBeenLastCalledWith("luz");
		expect(screen.getByRole("button", { name: "Filtros 2" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Quitar Importe > 50 €" }));
		expect(onRemoveFilter).toHaveBeenCalledWith(1);
		await userEvent.click(screen.getByRole("button", { name: "Limpiar todo" }));
		expect(onClear).toHaveBeenCalledOnce();
	});

	it("sin filtros: sin número ni fila de tags; sin buscador si no se pide", () => {
		render(<FilterBar />);
		expect(screen.getByRole("button", { name: "Filtros" })).toBeTruthy();
		expect(screen.queryByRole("textbox")).toBeNull();
		expect(screen.queryByRole("button", { name: "Limpiar todo" })).toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<FilterBar
				segments={segments}
				defaultSegment="t"
				search
				activeFilters={["Categoría: Hogar"]}
				onRemoveFilter={() => {}}
			/>,
		);
	});
});
