import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SidebarCards, SidebarNav, type SidebarNavItem } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { full: string; bare: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/sidebar-nav-before.json"), "utf8"),
);

const dashboardChildren = [
	{ icon: "eye" as const, label: "Resumen", href: "/panel/" },
	{ icon: "bell-01" as const, label: "Avisos", href: "/panel/avisos/", badge: 10 },
	{ icon: "star-01" as const, label: "Guardados", href: "/panel/guardados/" },
];

// React reparte ids por orden de render y este componente pide dos más que antes: no es parte del HTML que se compara
const normalizeIds = (html: string) => html.replace(/_R_[a-z0-9]+_/g, "_R_");

const items: SidebarNavItem[] = [
	{ icon: "home-line", label: "Inicio", href: "/" },
	{ icon: "bar-chart-01", label: "Panel", children: dashboardChildren },
	{ icon: "users-01", label: "Equipo", href: "/equipo/", badge: 8 },
];

describe("SidebarNav: el de siempre", () => {
	const base = [
		{ icon: "home-line" as const, label: "Inicio", href: "/", active: true },
		{ icon: "bar-chart-01" as const, label: "Panel", href: "/panel/", badge: 3 },
		{ icon: "currency-euro" as const, label: "Pecunia" },
	];

	it("sin las props nuevas el HTML es el de antes", () => {
		const full = renderToStaticMarkup(
			<SidebarNav
				brand="jotis.me"
				search
				items={base}
				footerItems={[{ icon: "settings-02", label: "Ajustes", href: "/ajustes/" }]}
				user={{ initials: "AD", name: "Administrador", supporting: "admin@jotis.me" }}
			/>,
		);
		expect(normalizeIds(full)).toBe(normalizeIds(BEFORE.full));
		expect(normalizeIds(renderToStaticMarkup(<SidebarNav items={base} />))).toBe(
			normalizeIds(BEFORE.bare),
		);
	});
});

describe("SidebarNav: submenús desplegables", () => {
	it("un elemento con hijos es un botón que se abre con el teclado y avisa de su estado", async () => {
		render(<SidebarNav items={items} />);
		const toggle = screen.getByRole("button", { name: "Panel" });
		expect(toggle.getAttribute("aria-expanded")).toBe("false");
		// Cerrado, los hijos no están en el árbol de accesibilidad
		expect(screen.queryByRole("link", { name: "Resumen" })).toBeNull();
		await userEvent.tab(); // Inicio
		await userEvent.tab();
		expect(document.activeElement).toBe(toggle);
		await userEvent.keyboard("{Enter}");
		expect(toggle.getAttribute("aria-expanded")).toBe("true");
		expect(screen.getByRole("link", { name: "Resumen" }).getAttribute("href")).toBe("/panel/");
		expect(screen.getByRole("link", { name: /Avisos/ }).textContent).toBe("Avisos10");
		await userEvent.keyboard(" ");
		expect(toggle.getAttribute("aria-expanded")).toBe("false");
		expect(screen.queryByRole("link", { name: "Resumen" })).toBeNull();
	});

	it("empieza abierto si un hijo es la página actual o con defaultOpen, y cerrado si no", () => {
		render(
			<SidebarNav
				items={[
					{ label: "Cerrado", children: [{ label: "Uno", href: "/uno/" }] },
					{ label: "Actual", children: [{ label: "Dos", href: "/dos/", active: true }] },
					{ label: "Forzado", defaultOpen: true, children: [{ label: "Tres", href: "/tres/" }] },
				]}
			/>,
		);
		const open = (name: string) => screen.getByRole("button", { name }).getAttribute("aria-expanded");
		expect(open("Cerrado")).toBe("false");
		expect(open("Actual")).toBe("true");
		expect(open("Forzado")).toBe("true");
	});

	it("se pinta en servidor con el submenú oculto y sin enlaces falsos", () => {
		const html = renderToStaticMarkup(<SidebarNav items={items} />);
		expect(html).toContain('aria-expanded="false"');
		expect(html).toContain("hidden");
		expect(html).not.toContain('href="#"');
	});
});

describe("SidebarNav: dos niveles y estrecho", () => {
	it("dos niveles: el elemento elegido enseña su submenú en un segundo panel", async () => {
		render(<SidebarNav type="dual-tier" items={items} />);
		const panel = document.querySelector('[role="group"]') as HTMLElement;
		expect(panel.hidden).toBe(true); // ninguno elegido
		const parent = screen.getByRole("button", { name: "Panel" });
		expect(parent.getAttribute("aria-controls")).toBe(panel.id);
		await userEvent.click(parent);
		expect(parent.getAttribute("aria-expanded")).toBe("true");
		expect(panel.hidden).toBe(false);
		expect(panel.getAttribute("aria-label")).toBe("Panel");
		expect(within(panel).getByRole("link", { name: "Resumen" })).toBeTruthy();
		await userEvent.click(parent);
		expect(panel.hidden).toBe(true);
	});

	it("dos niveles: empieza con el elemento de la página actual elegido", () => {
		const withActive = [
			items[0],
			{
				...items[1],
				children: [{ ...dashboardChildren[0], active: true }, ...dashboardChildren.slice(1)],
			},
		] as SidebarNavItem[];
		render(<SidebarNav type="dual-tier" items={withActive} />);
		expect(screen.getByRole("button", { name: "Panel" }).getAttribute("aria-expanded")).toBe("true");
	});

	it("estrecho: solo iconos, cada uno con su nombre en un tooltip", async () => {
		render(<SidebarNav type="slim" brand="jotis.me" mark="j" items={items} />);
		const home = screen.getByRole("link", { name: "Inicio" });
		expect(home.textContent).toBe("Inicio"); // el nombre es texto para lectores, no se ve
		expect(home.querySelector(".sr-only")).toBeTruthy();
		expect(home.className).toContain("size-10");
		await userEvent.tab();
		expect(document.activeElement).toBe(home);
		const tip = await screen.findByRole("tooltip");
		expect(tip.textContent).toBe("Inicio");
		expect(screen.getByRole("link", { name: "Equipo" })).toBeTruthy();
		// La marca compacta, no el nombre entero
		expect(screen.queryByText("jotis.me")).toBeNull();
		expect(screen.getByText("j")).toBeTruthy();
	});

	it("estrecho: el submenú se abre en un segundo panel con su título, con el teclado", async () => {
		const closedItems = items.map((item) => ({ ...item, defaultOpen: false }));
		render(<SidebarNav type="slim" items={closedItems} />);
		const parent = screen.getByRole("button", { name: "Panel" });
		expect(parent.getAttribute("aria-expanded")).toBe("false");
		expect(document.querySelector('[role="group"]')?.hasAttribute("hidden")).toBe(true);
		parent.focus();
		await userEvent.keyboard("{Enter}");
		const panel = document.querySelector('[role="group"]') as HTMLElement;
		expect(panel.hidden).toBe(false);
		expect(within(panel).getByRole("heading", { name: "Panel" })).toBeTruthy();
		expect(within(panel).getAllByRole("link")).toHaveLength(3);
		// Escape no existe aquí: se cierra volviendo a pulsar
		await userEvent.keyboard("{Enter}");
		expect(panel.hidden).toBe(true);
	});

	it("estrecho: la ficha del usuario es el avatar con el nombre para lectores y cerrar sesión", async () => {
		const onLogout = vi.fn();
		render(
			<SidebarNav
				type="slim"
				items={items}
				user={{ initials: "OR", name: "Olivia Rhye", supporting: "olivia@jotis.me" }}
				onLogout={onLogout}
			/>,
		);
		expect(screen.getByText("Olivia Rhye").className).toContain("sr-only");
		expect(screen.queryByText("olivia@jotis.me")).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
		expect(onLogout).toHaveBeenCalledOnce();
	});
});

describe("SidebarNav: secciones", () => {
	const sections = [
		{
			title: "General",
			items: [{ icon: "home-line" as const, label: "Panel", href: "/", active: true }],
		},
		{
			title: "Equipos",
			items: [
				{ label: "Catálogo", shortcut: "⌘1", trailing: <span aria-hidden>›</span>, href: "/c/" },
				{ label: "Carpetas", children: [{ label: "Recientes", href: "/r/", badge: 8 }] },
			],
		},
	];

	it("cada grupo con subtítulo es una lista con nombre", () => {
		render(<SidebarNav type="sections-subheadings" brand="jotis.me" search sections={sections} />);
		expect(screen.getByRole("heading", { name: "General" })).toBeTruthy();
		expect(screen.getByRole("list", { name: "Equipos" })).toBeTruthy();
		// La lupa sustituye al campo de búsqueda
		expect(screen.queryByRole("textbox")).toBeNull();
		expect(screen.getByRole("button", { name: "Buscar" })).toBeTruthy();
		expect(screen.getByRole("link", { name: /Catálogo/ }).textContent).toBe("Catálogo⌘1›");
	});

	it("con divisores, una raya entre grupos y los hijos se despliegan", async () => {
		const { container } = render(<SidebarNav type="sections-dividers" sections={sections} />);
		expect(container.querySelector("nav > div")?.className).toContain("[&>*+*]:border-t");
		await userEvent.click(screen.getByRole("button", { name: "Carpetas" }));
		expect(screen.getByRole("link", { name: /Recientes/ })).toBeTruthy();
	});
});

describe("SidebarNav: tarjetas destacadas y cuenta", () => {
	it("la tarjeta de progreso se anuncia como barra y la X avisa", async () => {
		const onClose = vi.fn();
		render(
			<SidebarNav
				items={items}
				featured={
					<SidebarCards.Progress
						title="Espacio usado"
						description="Has usado el 80 %."
						value={80}
						onClose={onClose}
						actions={<button type="button">Descartar</button>}
					/>
				}
			/>,
		);
		const bar = screen.getByRole("progressbar", { name: "Espacio usado" });
		expect(bar.getAttribute("aria-valuenow")).toBe("80");
		await userEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("con anillo, el progreso va arriba; el aviso admite cualquier contenido", () => {
		render(
			<>
				<SidebarCards.Progress title="Espacio" value={40} variant="circle" />
				<SidebarCards.Notice
					outline
					title="Cookies"
					description="Usamos cookies."
					actions={<a href="/c">Aceptar</a>}
				>
					<p>Contenido libre</p>
				</SidebarCards.Notice>
			</>,
		);
		expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("40");
		expect(screen.getByText("Contenido libre")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Aceptar" })).toBeTruthy();
	});

	it("mejora de plan: etiqueta, texto y botón principal", async () => {
		const onCta = vi.fn();
		render(
			<SidebarCards.Upgrade
				title="Pasa a PRO"
				badge="20% OFF"
				description="Más integraciones."
				cta="Mejorar ahora"
				onCta={onCta}
			/>,
		);
		expect(screen.getByText("20% OFF")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Mejorar ahora" }));
		expect(onCta).toHaveBeenCalledOnce();
	});

	it("la cuenta es la tarjeta del Dropdown: muestra la elegida, cambia de cuenta y avisa", async () => {
		const onAccountChange = vi.fn();
		render(
			<SidebarNav
				items={items}
				account={{
					items: [{ label: "Ver perfil", shortcut: "⌘P" }],
					accounts: [
						{ value: "olivia", name: "Olivia Rhye", email: "olivia@jotis.me", initials: "OR" },
						{ value: "sienna", name: "Sienna Hewitt", email: "sienna@jotis.me", initials: "SH" },
					],
					onAccountChange,
				}}
			/>,
		);
		const trigger = screen.getByRole("button", { name: /Olivia Rhye/ });
		expect(trigger.textContent).toContain("olivia@jotis.me");
		await userEvent.click(trigger);
		expect(screen.getByRole("menuitem", { name: /Ver perfil/ })).toBeTruthy();
		await userEvent.click(screen.getByRole("menuitemradio", { name: /Sienna Hewitt/ }));
		expect(onAccountChange).toHaveBeenCalledWith("sienna");
	});
});

describe("SidebarNav: diseño adaptable", () => {
	it("con responsive, una barra con el botón de menú abre y cierra la navegación", async () => {
		render(<SidebarNav responsive brand="jotis.me" items={items} />);
		const button = screen.getByRole("button", { name: "Abrir menú" });
		expect(button.getAttribute("aria-expanded")).toBe("false");
		const body = document.getElementById(button.getAttribute("aria-controls") as string) as HTMLElement;
		expect(body.className).toContain("hidden"); // en pantalla estrecha, cerrada
		expect(body.className).toContain("lg:flex"); // y siempre visible desde `lg`
		await userEvent.click(button);
		expect(button.getAttribute("aria-expanded")).toBe("true");
		expect(body.className).not.toMatch(/(^| )hidden( |$)/);
	});

	it("sin responsive no hay barra ni botón de menú", () => {
		render(<SidebarNav brand="jotis.me" items={items} />);
		expect(screen.queryByRole("button", { name: "Abrir menú" })).toBeNull();
	});
});

describe("SidebarNav: accesibilidad", () => {
	const featured = (
		<SidebarCards.Progress
			title="Espacio usado"
			description="Has usado el 80 %."
			value={80}
			onClose={() => {}}
		/>
	);
	const account = {
		items: [{ label: "Ver perfil" }],
		accounts: [{ value: "o", name: "Olivia Rhye", email: "olivia@jotis.me", initials: "OR" }],
	};

	it("axe en claro y oscuro: simple con submenú, tarjeta y cuenta", async () => {
		await expectAccessibleInThemes(
			<SidebarNav brand="jotis.me" search items={items} featured={featured} account={account} />,
		);
	});

	it("axe en claro y oscuro: dos niveles, estrecho y secciones", async () => {
		await expectAccessibleInThemes(<SidebarNav type="dual-tier" brand="jotis.me" items={items} />);
		await expectAccessibleInThemes(<SidebarNav type="slim" mark="j" brand="jotis.me" items={items} />);
		await expectAccessibleInThemes(
			<SidebarNav
				type="sections-subheadings"
				brand="jotis.me"
				search
				sections={[{ title: "General", items: [{ label: "Panel", href: "/" }] }]}
			/>,
		);
	});
});

describe("SidebarNav: marca y cuenta según el tipo", () => {
	const account = {
		items: [{ label: "Ver perfil" }],
		accounts: [{ value: "o", name: "Olivia Rhye", email: "olivia@jotis.me", initials: "OR" }],
	};

	it("estrecho: la cuenta es solo el avatar, sin la tarjeta que no cabe en la columna", async () => {
		render(<SidebarNav type="slim" items={items} account={account} />);
		expect(screen.queryByText("olivia@jotis.me")).toBeNull();
		const trigger = screen.getByRole("button", { name: /Principal/ });
		expect(trigger.className).toContain("rounded-full");
		await userEvent.click(trigger);
		expect(screen.getByRole("menuitemradio", { name: /Olivia Rhye/ })).toBeTruthy();
	});

	it("con subtítulos y lupa, la marca (logo y nombre) va junta y la lupa a la derecha", () => {
		render(
			<SidebarNav
				type="sections-subheadings"
				search
				brand={
					<>
						<svg aria-hidden data-testid="logo" />
						Regula
					</>
				}
				sections={[{ title: "General", items: [{ label: "Panel", href: "/" }] }]}
			/>,
		);
		const group = screen.getByTestId("logo").parentElement as HTMLElement;
		expect(group.tagName).toBe("SPAN");
		expect(group.textContent).toBe("Regula");
		expect(group.nextElementSibling?.textContent).toContain("Buscar");
	});
});
