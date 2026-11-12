import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer, type FooterColumn, type FooterType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const columns: FooterColumn[] = [
	{
		title: "Producto",
		links: [
			{ label: "Informes", href: "/informes" },
			{ label: "Precios", href: "/precios" },
		],
	},
	{ title: "Empresa", links: [{ label: "Quiénes somos", href: "/nosotros" }] },
	{ title: "Legal", links: [{ label: "Privacidad", href: "/privacidad" }] },
];
const base = {
	brand: <a href="/">Regula</a>,
	description: "Tu dinero, claro.",
	columns,
	links: [{ label: "Precios", href: "/precios" }],
	cta: {
		title: "Empieza hoy",
		description: "Gratis durante 30 días.",
		actions: <a href="/registro">Crear cuenta</a>,
	},
	aside: <p>Descarga la app</p>,
	copyright: "© 2027 Regula",
	legal: [{ label: "Términos", href: "/terminos" }],
	social: <a href="https://x.com/regula">X</a>,
};

describe("Footer", () => {
	it("los veinte tipos pintan un footer con su copyright", () => {
		const types: FooterType[] = [
			...Array.from({ length: 16 }, (_, i) => `large-${String(i + 1).padStart(2, "0")}` as FooterType),
			"small-01",
			"small-02",
			"small-03",
			"small-04",
		];
		for (const type of types) {
			const { container, unmount } = render(<Footer type={type} {...base} />);
			const footer = container.querySelector("footer") as HTMLElement;
			expect(footer, type).toBeTruthy();
			expect(within(footer).getByText("© 2027 Regula"), type).toBeTruthy();
			unmount();
		}
	});

	it("cada tipo pone sus piezas: columnas, llamada, bloque de la derecha y pie", () => {
		const { rerender } = render(<Footer type="large-01" {...base} />);
		expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
			"Producto",
			"Empresa",
			"Legal",
		]);
		expect(screen.queryByText("Descarga la app")).toBeNull();
		rerender(<Footer type="large-03" {...base} />);
		expect(screen.getByText("Descarga la app")).toBeTruthy();
		// Columnas con título oscuro y enlaces de marca
		expect(screen.getByRole("link", { name: "Informes" }).className).toContain("text-brand-secondary");
		rerender(<Footer type="large-09" {...base} />);
		expect(screen.getByRole("heading", { name: "Empieza hoy" })).toBeTruthy();
		rerender(<Footer type="large-04" {...base} />);
		expect(screen.getByRole("link", { name: "Términos" })).toBeTruthy();
		rerender(<Footer type="large-15" {...base} />);
		expect(screen.queryByRole("heading", { name: "Producto" })).toBeNull();
		expect(screen.getByRole("link", { name: "Precios" })).toBeTruthy();
	});

	it("tema de marca y columnas que se apilan de dos en dos en estrecho", async () => {
		const ui = <Footer type="large-02" theme="brand" {...base} />;
		const { container } = render(ui);
		expect(container.querySelector("footer")?.className).toContain("bg-brand-section");
		expect(screen.getByRole("link", { name: "Informes" }).className).toContain("text-secondary_on-brand");
		const grid = screen.getByRole("heading", { name: "Producto" }).closest(".grid") as HTMLElement;
		expect(grid.className).toContain("@max-3xl:!grid-cols-2");
		await expectAccessibleInThemes(ui);
	});
});
