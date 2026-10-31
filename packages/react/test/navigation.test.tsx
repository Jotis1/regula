import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { pageList } from "../src/components/Pagination.js";
import { Breadcrumbs, Pagination, Tabs } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const items = [
	{ id: "a", label: "Resumen" },
	{ id: "b", label: "Movimientos", count: 12 },
	{ id: "c", label: "Ajustes" },
];

describe("Tabs", () => {
	it("la primera está activa por defecto; las flechas, Inicio y Fin mueven el foco y la selección", async () => {
		const onChange = vi.fn();
		render(<Tabs aria-label="Secciones" items={items} onChange={onChange} />);
		const tabs = screen.getAllByRole("tab");
		expect(screen.getByRole("tablist", { name: "Secciones" })).toBeTruthy();
		expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
		// Roving tabindex: solo la activa entra en el orden de Tab
		await userEvent.tab();
		expect(document.activeElement).toBe(tabs[0]);
		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(tabs[1]);
		expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
		expect(onChange).toHaveBeenLastCalledWith("b");
		await userEvent.keyboard("{End}");
		expect(tabs[2]?.getAttribute("aria-selected")).toBe("true");
		await userEvent.keyboard("{ArrowRight}");
		expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
		await userEvent.keyboard("{End}{Home}");
		expect(document.activeElement).toBe(tabs[0]);
		expect(onChange.mock.calls.map((c) => c[0])).toEqual(["b", "c", "a", "c", "a"]);
	});

	it("clic cambia la pestaña; controlado solo avisa", async () => {
		const onChange = vi.fn();
		render(<Tabs items={items} value="a" onChange={onChange} />);
		await userEvent.click(screen.getByRole("tab", { name: "Ajustes" }));
		expect(onChange).toHaveBeenCalledWith("c");
		expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("aria-selected")).toBe("true");
	});

	it("contador neutro que pasa a marca en la pestaña activa", () => {
		render(<Tabs items={items} defaultValue="b" />);
		const tab = screen.getByRole("tab", { name: /Movimientos/ });
		const count = tab.querySelector("span") as HTMLElement;
		expect(count.textContent).toBe("12");
		for (const c of ["bg-utility-neutral-50", "group-data-selected:bg-utility-brand-50", "rounded-full"])
			expect(count.className).toContain(c);
		expect(tab.getAttribute("aria-selected")).toBe("true");
	});

	it("cuatro tipos y dos tamaños", () => {
		const { rerender } = render(<Tabs items={items} />);
		const list = () => screen.getByRole("tablist");
		const tab = () => screen.getAllByRole("tab")[0] as HTMLElement;
		expect(list().className).toContain("shadow-[inset_0_-1px_0_var(--border-secondary)]");
		expect(tab().className).toContain("data-selected:text-brand-secondary");
		expect(tab().className).toContain("h-auto");
		expect(tab().className).not.toContain("h-9");
		rerender(<Tabs items={items} type="button-brand" />);
		expect(tab().className).toContain("data-selected:bg-brand-primary_alt");
		expect(tab().className).toContain("h-9");
		rerender(<Tabs items={items} type="button-gray" size="md" />);
		expect(tab().className).toContain("data-selected:bg-primary_hover");
		expect(tab().className).toContain("h-11");
		expect(tab().className).toContain("text-md");
		rerender(<Tabs items={items} type="button-border" />);
		expect(list().className).toContain("bg-secondary_alt");
		expect(tab().className).toContain("data-selected:shadow-sm");
	});

	it("en servidor pinta la lista con la pestaña activa", () => {
		const html = renderToString(<Tabs aria-label="Secciones" items={items} defaultValue="c" />);
		expect(html).toContain('role="tablist"');
		expect(html).toMatch(/aria-selected="true"[^>]*>Ajustes|>Ajustes/);
		expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
	});

	it("sin children no hay aria-controls; con children pinta el panel activo enlazado", async () => {
		const { unmount } = render(<Tabs items={items} />);
		for (const t of screen.getAllByRole("tab")) expect(t.getAttribute("aria-controls")).toBeNull();
		unmount();
		render(
			<Tabs aria-label="Secciones" items={items}>
				{(id) => <p>Contenido {id}</p>}
			</Tabs>,
		);
		const panel = screen.getByRole("tabpanel");
		const tab = screen.getByRole("tab", { name: "Resumen" });
		expect(panel.textContent).toBe("Contenido a");
		expect(tab.getAttribute("aria-controls")).toBe(panel.id);
		expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
		await userEvent.click(screen.getByRole("tab", { name: "Ajustes" }));
		expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
		expect(screen.getByRole("tabpanel").textContent).toBe("Contenido c");
	});

	it("en servidor, con children, el HTML ya trae el panel activo", () => {
		const html = renderToString(
			<Tabs aria-label="Secciones" items={items} defaultValue="b">
				{(id) => <p>Contenido {id}</p>}
			</Tabs>,
		);
		expect(html).toContain('role="tabpanel"');
		expect(html).toContain("Contenido <!-- -->b");
	});

	it("axe en claro y oscuro con los cuatro tipos", async () => {
		await expectAccessibleInThemes(
			<div>
				<Tabs aria-label="Secciones" items={items} />
				<Tabs aria-label="Vista" type="button-brand" items={items} />
				<Tabs aria-label="Periodo" type="button-gray" items={items} />
				<Tabs aria-label="Modo" type="button-border" items={items} />
				<Tabs aria-label="Con panel" items={items}>
					{(id) => <p>Contenido {id}</p>}
				</Tabs>
			</div>,
		);
	});
});

describe("Breadcrumbs", () => {
	const crumbs = [
		{ label: "Inicio", icon: "home-line" as const, href: "/" },
		{ label: "Pecunia", href: "/pecunia/" },
		{ label: "Gastos de octubre" },
	];

	it("navegación con nombre, separadores ocultos y la última como página actual sin enlace", () => {
		render(<Breadcrumbs items={crumbs} />);
		const nav = screen.getByRole("navigation", { name: "Migas de pan" });
		const links = screen.getAllByRole("link");
		expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
			["Inicio", "/"],
			["Pecunia", "/pecunia/"],
		]);
		// El primero es solo icono, con el texto para lectores de pantalla
		expect(links[0]?.querySelector("svg")).toBeTruthy();
		expect(links[0]?.querySelector(".sr-only")?.textContent).toBe("Inicio");
		const current = nav.querySelector('[aria-current="page"]') as HTMLElement;
		expect(current.tagName).toBe("SPAN");
		expect(current.textContent).toBe("Gastos de octubre");
		expect(current.className).toContain("text-brand-secondary");
		expect(nav.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(2);
		expect(screen.getAllByRole("listitem")).toHaveLength(3);
	});

	it("sin href no hay enlace; el nombre se puede cambiar; sin directiva de cliente funciona en servidor", () => {
		const html = renderToString(
			<Breadcrumbs aria-label="Ruta" items={[{ label: "Pecunia" }, { label: "Gastos" }]} />,
		);
		expect(html).toContain('aria-label="Ruta"');
		expect(html).not.toContain("<a");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Breadcrumbs items={crumbs} />);
	});
});

describe("Pagination", () => {
	it("recorta con … a partir de 8 páginas", () => {
		expect(pageList(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(pageList(1, 10)).toEqual([1, 2, 3, "…", 8, 9, 10]);
		expect(pageList(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
		expect(pageList(9, 10)).toEqual([1, 2, 3, "…", 8, 9, 10]);
	});

	it("aria-current en la página actual; Anterior desactivado en la primera y Siguiente en la última", async () => {
		const onChange = vi.fn();
		render(<Pagination total={10} defaultPage={1} onChange={onChange} />);
		expect(screen.getByRole("navigation", { name: "Paginación" })).toBeTruthy();
		const prev = screen.getByRole("button", { name: "Anterior" }) as HTMLButtonElement;
		const next = screen.getByRole("button", { name: "Siguiente" }) as HTMLButtonElement;
		expect(prev.disabled).toBe(true);
		expect(screen.getByRole("button", { name: "Página 1" }).getAttribute("aria-current")).toBe("page");
		await userEvent.click(next);
		expect(onChange).toHaveBeenLastCalledWith(2);
		expect(screen.getByRole("button", { name: "Página 2" }).getAttribute("aria-current")).toBe("page");
		expect(screen.getByRole("button", { name: "Página 1" }).getAttribute("aria-current")).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: "Página 10" }));
		expect(next.disabled).toBe(true);
		expect(prev.disabled).toBe(false);
		// Pulsar la actual no avisa
		await userEvent.click(screen.getByRole("button", { name: "Página 10" }));
		expect(onChange.mock.calls.map((c) => c[0])).toEqual([2, 10]);
	});

	it("con teclado: Tab llega a los números y Enter o espacio cambian de página", async () => {
		const onChange = vi.fn();
		render(<Pagination total={5} defaultPage={3} onChange={onChange} />);
		await userEvent.tab(); // Anterior
		await userEvent.tab(); // 1
		expect(document.activeElement?.getAttribute("aria-label")).toBe("Página 1");
		await userEvent.keyboard("{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(1);
		await userEvent.tab();
		await userEvent.keyboard(" ");
		expect(onChange).toHaveBeenLastCalledWith(2);
		expect(document.activeElement?.getAttribute("aria-current")).toBe("page");
	});

	it("controlado y textos sustituibles", async () => {
		const onChange = vi.fn();
		render(
			<Pagination
				total={3}
				page={2}
				onChange={onChange}
				labels={{ previous: "Atrás", next: "Adelante", nav: "Páginas", page: (n) => `Ir a ${n}` }}
			/>,
		);
		screen.getByRole("navigation", { name: "Páginas" });
		await userEvent.click(screen.getByRole("button", { name: "Adelante" }));
		expect(onChange).toHaveBeenCalledWith(3);
		expect(screen.getByRole("button", { name: "Ir a 2" }).getAttribute("aria-current")).toBe("page");
		screen.getByRole("button", { name: "Atrás" });
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Pagination total={10} defaultPage={5} />);
	});
});
