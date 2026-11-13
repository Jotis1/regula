import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const ANCLAS = [
	{ id: "uso", label: "Uso", href: "#uso" },
	{ id: "props", label: "Props", href: "#props" },
	{ id: "teclado", label: "Teclado", href: "#teclado" },
];
const SIN_HREF = [
	{ id: "a", label: "Resumen" },
	{ id: "b", label: "Movimientos", count: 12 },
];

afterEach(() => vi.restoreAllMocks());

describe("Tabs como enlaces", () => {
	it("índice de la página: nav con nombre, tres enlaces, el actual con aria-current=location y la raya de 2px", () => {
		render(
			<Tabs
				aria-label="En esta página"
				items={ANCLAS}
				orientation="vertical"
				type="line"
				defaultValue="props"
			/>,
		);
		const nav = screen.getByRole("navigation", { name: "En esta página" });
		const links = screen.getAllByRole("link");
		expect(nav.contains(links[0] as HTMLElement)).toBe(true);
		expect(links.map((l) => l.getAttribute("href"))).toEqual(["#uso", "#props", "#teclado"]);
		expect(links[1]?.getAttribute("aria-current")).toBe("location");
		expect(links[0]?.hasAttribute("aria-current")).toBe(false);
		expect(links[2]?.hasAttribute("aria-current")).toBe(false);
		expect(links[1]?.className).toContain(
			"aria-[current]:shadow-[inset_2px_0_0_var(--fg-brand-primary_alt)]",
		);
		expect(screen.queryByRole("tablist")).toBeNull();
		expect(screen.queryAllByRole("tab")).toHaveLength(0);
	});

	it("un href que no es ancla marca el actual con aria-current=page, y el primero lo es si no hay valor", () => {
		render(
			<Tabs
				aria-label="Secciones"
				items={[
					{ id: "a", label: "Inicio", href: "/" },
					{ id: "b", label: "Tipos", href: "/tipos/" },
				]}
			/>,
		);
		const [first, second] = screen.getAllByRole("link");
		expect(first?.getAttribute("aria-current")).toBe("page");
		expect(second?.hasAttribute("aria-current")).toBe(false);
	});

	it("el actual sigue a `value`", () => {
		render(<Tabs aria-label="Secciones" items={ANCLAS} value="teclado" />);
		expect(screen.getAllByRole("link")[2]?.getAttribute("aria-current")).toBe("location");
	});

	it("se recorre con Tab, sin flechas", async () => {
		const { userEvent } = await import("@testing-library/user-event");
		render(<Tabs aria-label="Secciones" items={ANCLAS} />);
		const links = screen.getAllByRole("link");
		await userEvent.tab();
		expect(document.activeElement).toBe(links[0]);
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(links[0]);
		await userEvent.tab();
		expect(document.activeElement).toBe(links[1]);
	});

	it("tiene el mismo aspecto en todos los tipos y en vertical", () => {
		for (const type of [
			"underline",
			"button-brand",
			"button-gray",
			"button-border",
			"button-minimal",
			"line",
		] as const) {
			const { unmount } = render(<Tabs aria-label="Secciones" items={ANCLAS} type={type} />);
			expect(screen.getAllByRole("link")[0]?.className).toContain("aria-[current]:");
			unmount();
		}
		render(<Tabs aria-label="Ajustes" items={ANCLAS} orientation="vertical" size="md" />);
		expect(screen.getAllByRole("link")[0]?.className).toContain("h-auto");
		expect(screen.getAllByRole("link")[0]?.className).toContain("w-full");
	});

	it("en vertical no pasa al desplegable: ni listbox ni botón de Select, y la lista no se oculta por debajo de lg", () => {
		const { container } = render(
			<Tabs aria-label="En esta página" items={ANCLAS} orientation="vertical" type="line" />,
		);
		expect(screen.queryByRole("button")).toBeNull();
		expect(container.querySelector("[aria-haspopup]")).toBeNull();
		expect(container.querySelector("ul")?.className).not.toContain("max-lg:hidden");
		expect(container.innerHTML).not.toContain("lg:hidden");
		expect(screen.getAllByRole("link")).toHaveLength(3);
	});

	it("sin href, el HTML es el de antes: tablist, pestañas y nada de nav", () => {
		const html = renderToStaticMarkup(<Tabs aria-label="Modo" items={SIN_HREF} />);
		expect(html).toContain('role="tablist"');
		expect(html).toContain('role="tab"');
		expect(html).not.toContain("<nav");
		expect(html).not.toContain("<a ");
	});

	it("mezcla de elementos con y sin href: avisa en desarrollo y pinta un tablist", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(
			<Tabs
				aria-label="Mezcla"
				items={[
					{ id: "a", label: "Uno", href: "#uno" },
					{ id: "b", label: "Dos" },
				]}
			/>,
		);
		expect(warn).toHaveBeenCalled();
		expect(String(warn.mock.calls[0]?.[0])).toContain("href");
		expect(screen.getByRole("tablist")).toBeTruthy();
		expect(screen.getAllByRole("tab")).toHaveLength(2);
		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it("en producción no avisa", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		vi.stubEnv("NODE_ENV", "production");
		render(
			<Tabs
				aria-label="Mezcla"
				items={[
					{ id: "a", label: "Uno", href: "#uno" },
					{ id: "b", label: "Dos" },
				]}
			/>,
		);
		vi.unstubAllEnvs();
		expect(warn).not.toHaveBeenCalled();
	});

	it("sin href no avisa", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<Tabs aria-label="Modo" items={SIN_HREF} />);
		expect(warn).not.toHaveBeenCalled();
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Tabs aria-label="En esta página" items={ANCLAS} orientation="vertical" type="line" />,
		);
	});
});
