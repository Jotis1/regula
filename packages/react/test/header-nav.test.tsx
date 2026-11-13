import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BarChart01, HomeLine, Inbox01, Settings02, User01 } from "@untitledui/icons";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, HeaderNav, type HeaderNavItem } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const ITEMS: HeaderNavItem[] = [
	{ label: "Inicio", href: "/", icon: HomeLine },
	{
		label: "Panel",
		href: "/panel/",
		icon: BarChart01,
		current: true,
		children: [
			{ label: "Resumen", href: "/panel/", current: true },
			{ label: "Avisos", href: "/panel/avisos/", badge: 2 },
			{ label: "Analítica", href: "/panel/analitica/" },
		],
	},
	{
		label: "Proyectos",
		href: "/proyectos/",
		icon: Inbox01,
		badge: 8,
		children: [{ label: "Todos", href: "/p/" }],
	},
];

const brand = <span>Yoruverse</span>;
const account = <Button hierarchy="secondary">Cuenta</Button>;
const actions = <Button hierarchy="tertiary" iconOnly={Settings02} label="Ajustes" />;

describe("HeaderNav (escritorio)", () => {
	it("es la cabecera de la página (banner) con la marca, la navegación y la cuenta", () => {
		render(<HeaderNav brand={brand} items={ITEMS} actions={actions} account={account} />);
		const header = screen.getByRole("banner");
		// La marca va en la versión de escritorio y en la de móvil: las dos están en el HTML
		expect(within(header).getAllByText("Yoruverse")).toHaveLength(2);
		const nav = within(header).getByRole("navigation", { name: "Principal" });
		expect(
			within(nav)
				.getAllByRole("link")
				.map((a) => a.textContent),
		).toEqual(["Inicio", "Panel", "Proyectos8"]);
		expect(within(header).getByRole("button", { name: "Ajustes" })).toBeTruthy();
		expect(within(header).getByRole("button", { name: "Cuenta" })).toBeTruthy();
	});

	it("la sección actual lleva aria-current=page", () => {
		render(<HeaderNav brand={brand} items={ITEMS} />);
		const nav = screen.getByRole("navigation", { name: "Principal" });
		const links = within(nav).getAllByRole("link");
		expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
		expect(links[1]?.className).toContain("aria-[current=page]:bg-primary_hover");
	});

	it("simple: una sola fila, sin segunda navegación", () => {
		render(<HeaderNav brand={brand} items={ITEMS} />);
		expect(screen.queryByRole("navigation", { name: "Subsecciones" })).toBeNull();
	});

	it("dual-tier: una segunda fila con las subsecciones de la actual y el buscador a la derecha", () => {
		render(
			<HeaderNav
				type="dual-tier"
				brand={brand}
				items={ITEMS}
				search={<input aria-label="Buscar en el panel" />}
			/>,
		);
		const sub = screen.getByRole("navigation", { name: "Subsecciones" });
		expect(
			within(sub)
				.getAllByRole("link")
				.map((a) => a.textContent),
		).toEqual(["Resumen", "Avisos2", "Analítica"]);
		expect(within(sub).getAllByRole("link")[0]?.getAttribute("aria-current")).toBe("page");
		// El buscador de la segunda fila (el del menú móvil solo existe con el panel abierto)
		expect(screen.getAllByLabelText("Buscar en el panel")).toHaveLength(1);
		expect(sub.parentElement?.contains(screen.getByLabelText("Buscar en el panel"))).toBe(true);
	});

	it("tabs: la segunda fila son enlaces con aspecto de pestaña, sin tablist", () => {
		render(<HeaderNav type="tabs" brand={brand} items={ITEMS} />);
		expect(screen.queryByRole("tablist")).toBeNull();
		expect(screen.queryByRole("tab")).toBeNull();
		const sub = screen.getByRole("navigation", { name: "Subsecciones" });
		const link = within(sub).getAllByRole("link")[0] as HTMLElement;
		expect(link.className).toContain(
			"aria-[current=page]:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)]",
		);
		expect(link.className).toContain("aria-[current=page]:text-brand-secondary");
	});

	it("centered: la navegación va al centro y la segunda fila, centrada", () => {
		const { container } = render(
			<HeaderNav type="centered" brand={brand} items={ITEMS} account={account} />,
		);
		const main = screen.getByRole("navigation", { name: "Principal" });
		expect(main.parentElement?.className).toContain("grid-cols-[1fr_auto_1fr]");
		const sub = screen.getByRole("navigation", { name: "Subsecciones" });
		expect(sub.parentElement?.className).toContain("justify-center");
		expect(container.querySelector("header")).not.toBeNull();
	});

	it("sin subsecciones en la actual, no hay segunda fila", () => {
		const flat = ITEMS.map((i) => ({ ...i, children: undefined }));
		render(<HeaderNav type="dual-tier" brand={brand} items={flat} />);
		expect(screen.queryByRole("navigation", { name: "Subsecciones" })).toBeNull();
	});

	it("los nombres de las navegaciones se pueden sustituir", () => {
		render(
			<HeaderNav
				type="dual-tier"
				brand={brand}
				items={ITEMS}
				labels={{ nav: "Main", subnav: "Sections", openMenu: "Open menu" }}
			/>,
		);
		expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
		expect(screen.getByRole("navigation", { name: "Sections" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
	});

	it("se pinta en el servidor, con las dos versiones en el HTML y sin el panel móvil", () => {
		const html = renderToString(<HeaderNav brand={brand} items={ITEMS} />);
		expect(html).toContain("@max-5xl:hidden");
		expect(html).toContain("@5xl:hidden");
		expect(html).toContain("Abrir menú");
		expect(html).not.toContain("px-0.5");
	});
});

describe("HeaderNav (fullWidth)", () => {
	const wide = <HeaderNav type="dual-tier" brand={brand} items={ITEMS} search={<span>Buscar</span>} />;

	it("sin la prop el HTML es el de siempre: contenido a 1280px", () => {
		const html = renderToString(wide);
		expect(html.match(/max-w-\[1280px\]/g)).toHaveLength(2);
		expect(html).toContain("mx-auto w-full max-w-[1280px] px-8");
		expect(
			renderToString(
				<HeaderNav
					type="dual-tier"
					brand={brand}
					items={ITEMS}
					fullWidth={false}
					search={<span>Buscar</span>}
				/>,
			),
		).toBe(html);
	});

	it("con fullWidth, las dos filas ocupan todo el ancho con 32px a los lados y la móvil no lleva max-w", () => {
		const { container } = render(
			<HeaderNav fullWidth type="dual-tier" brand={brand} items={ITEMS} search={<span>Buscar</span>} />,
		);
		const html = container.innerHTML;
		expect(html).not.toContain("max-w-[1280px]");
		expect(html).not.toContain("mx-auto");
		const [desktop, mobileRow] = [
			container.querySelector(".\\@max-5xl\\:hidden"),
			container.querySelector(".\\@5xl\\:hidden"),
		];
		const rows = [...(desktop?.querySelectorAll(".w-full.px-8") ?? [])];
		expect(rows).toHaveLength(2);
		expect(mobileRow?.innerHTML).not.toContain("max-w");
	});
});

describe("HeaderNav (menú móvil)", () => {
	const mobile = {
		footerItems: [
			{ label: "Ajustes", href: "/ajustes/", icon: Settings02 },
			{ label: "Soporte", href: "/soporte/", icon: User01 },
		],
		footer: <p>Olivia Rhye</p>,
	};
	const renderMobile = () =>
		render(
			<HeaderNav
				brand={brand}
				items={ITEMS}
				search={<input aria-label="Buscar" />}
				mobile={mobile}
				actions={actions}
				account={account}
			/>,
		);
	const openButton = () => screen.getByRole("button", { name: "Abrir menú" });

	it("el botón de menú abre un panel desde la izquierda con el buscador, la navegación y el pie", async () => {
		renderMobile();
		expect(screen.queryByRole("dialog")).toBeNull();
		await userEvent.click(openButton());
		const panel = await screen.findByRole("dialog");
		expect(panel.closest("[class*=justify-start]")).not.toBeNull();
		expect(panel.closest("[class*=justify-end]")).toBeNull();
		expect(within(panel).getByLabelText("Buscar")).toBeTruthy();
		const nav = within(panel).getByRole("navigation", { name: "Principal" });
		expect(
			within(nav)
				.getAllByRole("link")
				.map((a) => a.textContent),
		).toContain("Inicio");
		expect(within(panel).getByRole("link", { name: "Ajustes" })).toBeTruthy();
		expect(within(panel).getByText("Olivia Rhye")).toBeTruthy();
	});

	it("el foco queda atrapado en el panel y Escape lo cierra devolviendo el foco al botón", async () => {
		renderMobile();
		const button = openButton();
		await userEvent.click(button);
		const panel = await screen.findByRole("dialog");
		await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true));
		for (let i = 0; i < 12; i++) {
			await userEvent.tab();
			expect(panel.contains(document.activeElement)).toBe(true);
		}
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(button));
	});

	it("las secciones con subsecciones son botones aria-expanded que despliegan su lista", async () => {
		renderMobile();
		await userEvent.click(openButton());
		const panel = await screen.findByRole("dialog");
		const projects = within(panel).getByRole("button", { name: /Proyectos/ });
		expect(projects.getAttribute("aria-expanded")).toBe("false");
		const list = document.getElementById(projects.getAttribute("aria-controls") as string) as HTMLElement;
		expect(list.hidden).toBe(true);
		await userEvent.click(projects);
		expect(projects.getAttribute("aria-expanded")).toBe("true");
		expect(list.hidden).toBe(false);
		expect(within(list).getByRole("link", { name: "Todos" })).toBeTruthy();
		await userEvent.click(projects);
		expect(projects.getAttribute("aria-expanded")).toBe("false");
		// La sección actual parte desplegada
		const current = within(panel).getByRole("button", { name: /Panel/ });
		expect(current.getAttribute("aria-expanded")).toBe("true");
	});

	it("elegir un enlace del panel lo cierra", async () => {
		renderMobile();
		await userEvent.click(openButton());
		const panel = await screen.findByRole("dialog");
		await userEvent.click(within(panel).getByRole("link", { name: "Inicio" }));
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});

	it("axe en claro y oscuro, con el menú cerrado", async () => {
		await expectAccessibleInThemes(
			<HeaderNav
				type="dual-tier"
				brand={brand}
				items={ITEMS}
				search={<input aria-label="Buscar" />}
				actions={actions}
				account={account}
			/>,
		);
	});
});

describe("HeaderNav underline y mobileBar", () => {
	it("underline: una fila con la sección actual subrayada, sin segunda navegación", () => {
		render(<HeaderNav type="underline" brand={brand} items={ITEMS} />);
		expect(screen.queryByRole("navigation", { name: "Subsecciones" })).toBeNull();
		const nav = screen.getByRole("navigation", { name: "Principal" });
		const links = within(nav).getAllByRole("link");
		expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
		expect(links[1]?.className).toContain(
			"aria-[current=page]:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)]",
		);
		expect(links[1]?.className).not.toContain("bg-primary_hover");
	});

	it("mobileBar sustituye al botón de menú y al panel integrados", async () => {
		render(<HeaderNav brand={brand} items={ITEMS} mobileBar={<button type="button">Mi menú</button>} />);
		expect(screen.getByRole("button", { name: "Mi menú" })).toBeTruthy();
		expect(screen.queryByRole("button", { name: "Abrir menú" })).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: "Mi menú" }));
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("sin las props nuevas el HTML no cambia: los tipos de siempre no llevan el subrayado ni la barra móvil", () => {
		for (const type of ["simple", "dual-tier", "tabs", "centered"] as const) {
			const html = renderToString(<HeaderNav type={type} brand={brand} items={ITEMS} />);
			expect(html).not.toContain('inset_0_-2px_0_var(--fg-brand-primary_alt)]"' + "h-16");
			expect(html).toContain("Abrir menú");
		}
	});

	it("axe en claro y oscuro con underline", async () => {
		await expectAccessibleInThemes(
			<HeaderNav type="underline" brand={brand} items={ITEMS} actions={actions} account={account} />,
		);
	});
});
