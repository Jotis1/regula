import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button, MarketingNav, type MarketingNavItem, NavMenu } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const items: MarketingNavItem[] = [
	{
		label: "Producto",
		panel: {
			columns: [
				<NavMenu.Section key="a" title="Producto">
					<NavMenu.Item
						href="/informes"
						icon="bar-chart-01"
						title="Informes"
						description="Lo que pasa con tu dinero."
					/>
					<NavMenu.Item
						href="/presupuestos"
						icon="wallet-02"
						title="Presupuestos"
						description="Gasta con un plan."
					/>
				</NavMenu.Section>,
			],
			aside: <NavMenu.Card title="Novedad" description="El nuevo panel ya está aquí." />,
			footer: <a href="/precios">Ver precios</a>,
		},
	},
	{ label: "Precios", href: "/precios" },
];

const brand = <a href="/">Regula</a>;
const actions = (
	<>
		<Button hierarchy="secondary">Entrar</Button>
		<Button>Empezar</Button>
	</>
);

describe("MarketingNav", () => {
	it("abre el menú con el teclado, el foco entra y Escape lo devuelve al botón", async () => {
		render(<MarketingNav brand={brand} items={items} actions={actions} type="featured-card" />);
		const nav = screen.getAllByRole("navigation", { name: "Principal" })[0] as HTMLElement;
		const trigger = within(nav).getByRole("button", { name: "Producto" });
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		const dialog = await screen.findByRole("dialog", { name: "Producto" });
		await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
		expect(within(dialog).getByRole("link", { name: /Informes/ })).toBeTruthy();
		expect(within(dialog).getByText("Novedad")).toBeTruthy();
		expect(dialog.className).toContain("w-160");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("a todo el ancho, el panel toma el ancho de la cabecera", async () => {
		render(<MarketingNav brand={brand} items={items} menu="full-width" type="4-col-with-footer" />);
		const nav = screen.getAllByRole("navigation", { name: "Principal" })[0] as HTMLElement;
		await userEvent.click(within(nav).getByRole("button", { name: "Producto" }));
		const dialog = await screen.findByRole("dialog", { name: "Producto" });
		expect(dialog.parentElement?.className).toContain("w-[var(--trigger-width)]");
		expect(within(dialog).getByRole("link", { name: "Ver precios" })).toBeTruthy();
	});

	it("móvil: el botón abre el menú; cada apartado con menú se despliega dentro", async () => {
		render(
			<MarketingNav
				brand={brand}
				items={items}
				actions={actions}
				mobileLinks={[{ label: "Ayuda", href: "/ayuda" }]}
			/>,
		);
		const open = screen.getByRole("button", { name: "Abrir menú" });
		await userEvent.click(open);
		const dialog = await screen.findByRole("dialog", { name: "Principal" });
		const section = within(dialog).getByRole("button", { name: "Producto" });
		expect(section.getAttribute("aria-expanded")).toBe("false");
		await userEvent.click(section);
		expect(section.getAttribute("aria-expanded")).toBe("true");
		expect(within(dialog).getByRole("link", { name: /Presupuestos/ })).toBeTruthy();
		expect(within(dialog).getByRole("link", { name: "Ayuda" })).toBeTruthy();
		expect(within(dialog).getByRole("button", { name: "Empezar" })).toBeTruthy();
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});

	it("flotante: la barra va en una caja con borde; es accesible en los dos temas", async () => {
		const ui = <MarketingNav brand={brand} items={items} actions={actions} floating />;
		const { container } = render(ui);
		expect(container.querySelector("header > div.rounded-2xl")).toBeTruthy();
		await expectAccessibleInThemes(ui);
	});
});
