import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumbs, Pagination, type PaginationType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { breadcrumbs: string; pagination: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/breadcrumbs-pagination-before.json"), "utf8"),
);

const trail = [
	{ label: "Inicio", href: "/", icon: "home-line" as const },
	{ label: "Ajustes", href: "/ajustes/" },
	{ label: "Sin enlace" },
	{ label: "Equipo" },
];

describe("Breadcrumbs: el de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<Breadcrumbs items={trail} />)).toBe(BEFORE.breadcrumbs);
	});
});

describe("Breadcrumbs: divisor y tipos", () => {
	it("con divider slash los separadores son barras y siguen fuera del árbol accesible", () => {
		const { container } = render(<Breadcrumbs items={trail} divider="slash" />);
		const separators = container.querySelectorAll('li[aria-hidden="true"]');
		expect(separators).toHaveLength(3);
		for (const s of separators) expect(s.querySelector("svg path")?.getAttribute("d")).toBe("M7 22L17 2");
		expect(screen.getByText("Equipo").getAttribute("aria-current")).toBe("page");
	});

	it("text-line enmarca la ruta entre dos rayas", () => {
		const { container } = render(<Breadcrumbs items={trail} type="text-line" />);
		const nav = container.querySelector("nav") as HTMLElement;
		expect(nav.className).toContain("border-y");
		expect(nav.className).toContain("border-secondary");
	});

	it("button pinta la página actual con fondo y deja los enlaces como enlaces", () => {
		render(<Breadcrumbs items={trail} type="button" />);
		expect(screen.getByText("Equipo").className).toContain("bg-primary_hover");
		expect(screen.getByRole("link", { name: "Ajustes" }).getAttribute("href")).toBe("/ajustes/");
	});

	it("account: el avatar va delante del texto y la cuenta se cambia con el desplegable", async () => {
		const onAccountChange = vi.fn();
		render(
			<Breadcrumbs
				type="account"
				divider="slash"
				items={[
					{ label: "Warpspeed", avatar: <span data-testid="logo" /> },
					{
						label: "Cuenta",
						accounts: [
							{
								value: "caitlyn",
								name: "Caitlyn King",
								email: "caitlyn@jotis.me",
								initials: "CK",
							},
							{
								value: "sienna",
								name: "Sienna Hewitt",
								email: "sienna@jotis.me",
								initials: "SH",
							},
						],
						onAccountChange,
					},
					{ label: "Ajustes", href: "/ajustes/" },
				]}
			/>,
		);
		expect(screen.getByTestId("logo")).toBeTruthy();
		const trigger = screen.getByRole("button", { name: /Cuenta|Caitlyn/ });
		expect(trigger.textContent).toContain("Caitlyn King");
		await userEvent.click(trigger);
		await userEvent.click(await screen.findByText("Sienna Hewitt"));
		expect(onAccountChange).toHaveBeenCalledWith("sienna");
	});

	it("es accesible en cada tipo y en ambos temas", async () => {
		for (const type of ["text", "text-line", "button"] as const) {
			await expectAccessibleInThemes(<Breadcrumbs items={trail} type={type} divider="slash" />);
		}
	});
});

describe("Pagination: la de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<Pagination total={10} defaultPage={5} />)).toBe(BEFORE.pagination);
	});
});

const TYPES: { type: PaginationType; align?: "left" | "center" | "right" }[] = [
	{ type: "page-default" },
	{ type: "page-minimal" },
	{ type: "card-default" },
	{ type: "card-minimal", align: "left" },
	{ type: "card-minimal", align: "center" },
	{ type: "card-minimal", align: "right" },
	{ type: "card-advanced", align: "left" },
	{ type: "card-advanced", align: "center" },
	{ type: "card-button-group", align: "left" },
	{ type: "card-button-group", align: "right" },
];

describe("Pagination: los diez tipos del Figma", () => {
	it.each(TYPES)("$type $align se pinta, avanza con Siguiente y es accesible", async ({ type, align }) => {
		const onChange = vi.fn();
		render(<Pagination total={10} type={type} align={align} onChange={onChange} />);
		const nav = screen.getByRole("navigation", { name: "Paginación" });
		expect(
			within(nav)
				.getByRole("button", { name: /Anterior/ })
				.hasAttribute("disabled"),
		).toBe(true);
		await userEvent.click(within(nav).getByRole("button", { name: /Siguiente/ }));
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it.each(TYPES)(
		"$type $align: sin errores de accesibilidad en claro y oscuro",
		async ({ type, align }) => {
			await expectAccessibleInThemes(<Pagination total={10} type={type} align={align} />);
		},
	);

	it("card-minimal right: texto «Página 2 de 10» y los botones a la derecha", () => {
		const { container } = render(
			<Pagination total={10} defaultPage={2} type="card-minimal" align="right" />,
		);
		const nav = container.querySelector("nav") as HTMLElement;
		const kids = Array.from(nav.children);
		expect(kids[0]?.textContent).toBe("Página 2 de 10");
		expect(
			within(kids[1] as HTMLElement)
				.getAllByRole("button")
				.map((b) => b.textContent),
		).toEqual(["Anterior", "Siguiente"]);
	});

	it("card-minimal left pone los botones a la izquierda y center uno a cada lado", () => {
		const left = render(
			<Pagination total={10} type="card-minimal" align="left" />,
		).container.querySelector("nav") as HTMLElement;
		expect(within(left.children[0] as HTMLElement).getAllByRole("button")).toHaveLength(2);
		const center = render(
			<Pagination total={10} type="card-minimal" align="center" />,
		).container.querySelectorAll("nav")[0] as HTMLElement;
		expect(center.children[1]?.textContent).toBe("Página 1 de 10");
	});

	it("shape circle redondea los números", () => {
		render(<Pagination total={10} type="page-default" shape="circle" />);
		expect(screen.getByRole("button", { name: "Página 1" }).className).toContain("rounded-full");
		render(<Pagination total={10} type="page-default" />);
		expect(screen.getAllByRole("button", { name: "Página 1" })[1]?.className).toContain("rounded-lg");
	});

	it("los números llevan aria-current y el recorte se mantiene", () => {
		render(<Pagination total={10} defaultPage={5} type="card-default" />);
		expect(screen.getByRole("button", { name: "Página 5" }).getAttribute("aria-current")).toBe("page");
		expect(screen.queryByRole("button", { name: "Página 2" })).toBeNull();
	});

	it("los textos se cambian con labels", () => {
		render(
			<Pagination
				total={4}
				type="card-minimal"
				labels={{
					previous: "Back",
					next: "Forward",
					nav: "Pages",
					pageOf: (n, t) => `Page ${n} of ${t}`,
				}}
			/>,
		);
		expect(screen.getByRole("navigation", { name: "Pages" })).toBeTruthy();
		expect(screen.getByText("Page 1 of 4")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Forward" })).toBeTruthy();
	});
});

describe("Pagination: tamaño de página y cuadro de página", () => {
	it("card-advanced enseña la lista de filas, el cuadro de página y primera y última", async () => {
		const onChange = vi.fn();
		const onPageSizeChange = vi.fn();
		render(
			<Pagination
				total={10}
				type="card-advanced"
				onChange={onChange}
				onPageSizeChange={onPageSizeChange}
			/>,
		);
		expect(screen.getByRole("button", { name: "Primera página" }).hasAttribute("disabled")).toBe(true);
		await userEvent.click(screen.getByRole("button", { name: "Última página" }));
		expect(onChange).toHaveBeenLastCalledWith(10);
		const input = screen.getByRole("textbox", { name: "Ir a la página" }) as HTMLInputElement;
		expect(input.value).toBe("10");
		await userEvent.clear(input);
		await userEvent.type(input, "3{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(3);
		await userEvent.click(screen.getByRole("button", { name: "Primera página" }));
		expect(onChange).toHaveBeenLastCalledWith(1);
		expect(input.value).toBe("1");
	});

	it("un número fuera de rango vuelve a la página actual", async () => {
		const onChange = vi.fn();
		render(<Pagination total={10} defaultPage={4} type="card-advanced" onChange={onChange} />);
		const input = screen.getByRole("textbox", { name: "Ir a la página" }) as HTMLInputElement;
		await userEvent.clear(input);
		await userEvent.type(input, "99{Enter}");
		expect(onChange).not.toHaveBeenCalled();
		expect(input.value).toBe("4");
	});

	it("la lista de filas avisa del tamaño elegido", async () => {
		const onPageSizeChange = vi.fn();
		render(<Pagination total={10} type="card-advanced" onPageSizeChange={onPageSizeChange} />);
		await userEvent.selectOptions(screen.getByRole("combobox", { name: "Filas por página" }), "25");
		expect(onPageSizeChange).toHaveBeenCalledWith(25);
	});

	it("card-minimal solo lleva la lista con pageSizes", () => {
		render(<Pagination total={10} type="card-minimal" />);
		expect(screen.queryByRole("combobox", { name: "Filas por página" })).toBeNull();
		render(<Pagination total={10} type="card-minimal" pageSizes={[10, 20]} />);
		expect(screen.getByRole("combobox", { name: "Filas por página" })).toBeTruthy();
	});
});
