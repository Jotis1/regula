import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { HomeLine, Stars02 } from "@untitledui/icons";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
	Button,
	CardHeader,
	ContentDivider,
	InlineCTA,
	PageHeader,
	SectionFooter,
	SectionHeader,
} from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const actions = (
	<>
		<Button hierarchy="secondary" size="sm">
			Cancelar
		</Button>
		<Button size="sm">Guardar</Button>
	</>
);

describe("frontera servidor", () => {
	it.each(["PageHeader", "CardHeader", "SectionHeader", "SectionFooter", "ContentDivider", "InlineCTA"])(
		'%s no lleva "use client"',
		(name) => {
			const code = readFileSync(join(import.meta.dirname, "../src/components", `${name}.tsx`), "utf8");
			expect(code).not.toMatch(/^\s*["']use client["']/);
		},
	);

	it("se pintan en servidor sin hooks ni avisos", () => {
		const error = vi.spyOn(console, "error").mockImplementation(() => {});
		const html = renderToString(
			<>
				<PageHeader
					breadcrumbs={[{ label: "Inicio", icon: HomeLine }, { label: "Pecunia" }]}
					title="Gastos"
					actions={actions}
				/>
				<CardHeader title="Suscripciones" badge="12 activas" menu avatar={{ initials: "AM" }} />
				<SectionHeader title="Contactos" description="Personas." />
				<SectionFooter start={<Button hierarchy="link-gray">Ayuda</Button>} actions={actions} card />
				<ContentDivider label="o continúa con" />
				<InlineCTA icon={Stars02} title="Conecta tu banco" actions={actions} />
			</>,
		);
		expect(html).toContain("<h1");
		expect(html).toContain("Suscripciones");
		expect(html).toContain("o continúa con");
		expect(html).toContain("Conecta tu banco");
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});
});

describe("PageHeader", () => {
	it("migas, h1, descripción, acciones y línea inferior", () => {
		const { container } = render(
			<PageHeader
				breadcrumbs={[{ label: "Inicio", icon: HomeLine }, { label: "Pecunia" }]}
				title="Gastos"
				description="Controla lo que entra y lo que sale."
				actions={actions}
			>
				<p>Pestañas</p>
			</PageHeader>,
		);
		expect(container.firstElementChild?.tagName).toBe("HEADER");
		expect(screen.getByRole("navigation", { name: "Migas de pan" })).toBeTruthy();
		const h1 = screen.getByRole("heading", { level: 1, name: "Gastos" });
		expect(h1.className).toContain("font-display");
		expect(h1.className).toContain("text-display-sm");
		expect(screen.getByText("Controla lo que entra y lo que sale.").className).toContain("text-tertiary");
		const buttons = screen.getAllByRole("button");
		expect(buttons.at(-1)?.textContent).toBe("Guardar");
		expect(screen.getByText("Pestañas")).toBeTruthy();
		expect(container.querySelectorAll(".border-secondary")).toHaveLength(1);
	});

	it("sin línea con divider={false}", () => {
		const { container } = render(<PageHeader title="Gastos" divider={false} />);
		expect(container.querySelector(".border-secondary")).toBeNull();
		expect(container.querySelector("nav")).toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<PageHeader
				breadcrumbs={[{ label: "Inicio", icon: HomeLine }, { label: "Pecunia" }]}
				title="Gastos"
				description="Controla lo que entra y lo que sale."
				actions={actions}
			/>,
		);
	});
});

describe("CardHeader", () => {
	it("título con insignia, descripción, acciones y menú", async () => {
		const onMenu = vi.fn();
		render(
			<CardHeader
				title="Suscripciones"
				badge="12 activas"
				description="Pagos recurrentes de este mes."
				actions={actions}
				menu
				onMenu={onMenu}
			/>,
		);
		const h3 = screen.getByRole("heading", { level: 3 });
		expect(h3.textContent).toBe("Suscripciones12 activas");
		expect(screen.getByText("12 activas").className).toContain("bg-utility-brand-50");
		await userEvent.click(screen.getByRole("button", { name: "Más opciones" }));
		expect(onMenu).toHaveBeenCalledOnce();
	});

	it("color de insignia, avatar, nombre del menú y menú propio", () => {
		const { rerender } = render(
			<CardHeader
				title="Ana Martín"
				badge="Nueva"
				badgeColor="success"
				avatar={{ initials: "AM" }}
				menu
				menuLabel="Opciones de Ana"
			/>,
		);
		expect(screen.getByText("Nueva").className).toContain("bg-utility-green-50");
		expect(screen.getByText("AM")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Opciones de Ana" })).toBeTruthy();
		rerender(<CardHeader title="Ana" menu={<button type="button">Mío</button>} />);
		expect(screen.getByRole("button", { name: "Mío" })).toBeTruthy();
		expect(screen.queryByRole("button", { name: "Más opciones" })).toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<CardHeader
				title="Suscripciones"
				badge="12 activas"
				description="Pagos."
				actions={actions}
				menu
			/>,
		);
	});
});

describe("SectionHeader", () => {
	it("h2 en text-lg, text-md en sm, línea opcional", () => {
		const { container, rerender } = render(
			<SectionHeader title="Contactos" description="Personas y empresas." actions={actions} />,
		);
		expect(screen.getByRole("heading", { level: 2, name: "Contactos" }).className).toContain("text-lg");
		expect(container.querySelector(".border-secondary")).not.toBeNull();
		rerender(
			<SectionHeader title="Preferencias" size="sm" divider={false}>
				<input aria-label="Buscar" />
			</SectionHeader>,
		);
		expect(screen.getByRole("heading", { level: 2 }).className).toContain("text-md");
		expect(container.querySelector(".border-secondary")).toBeNull();
		expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<SectionHeader title="Contactos" description="Personas." actions={actions} />,
		);
	});
});

describe("SectionFooter", () => {
	it("línea superior, inicio a la izquierda y acciones a la derecha; card añade padding", () => {
		const { container, rerender } = render(
			<SectionFooter start={<Button hierarchy="link-gray">Ver ayuda</Button>} actions={actions} />,
		);
		const [line, row] = Array.from(container.firstElementChild?.children ?? []);
		expect(line?.className).toContain("border-secondary");
		expect(row?.firstElementChild?.textContent).toBe("Ver ayuda");
		expect(row?.lastElementChild?.className).toContain("ml-auto");
		expect(row?.className).not.toContain("px-6");
		rerender(<SectionFooter actions={actions} card />);
		expect(container.firstElementChild?.lastElementChild?.className).toContain("px-6");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<SectionFooter start={<Button hierarchy="link-gray">Ver ayuda</Button>} actions={actions} card />,
		);
	});
});

describe("ContentDivider", () => {
	it("sin contenido es un separador; con texto o botón, dos líneas decorativas", () => {
		const { container, rerender } = render(<ContentDivider />);
		expect(screen.getByRole("separator")).toBeTruthy();
		expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
		rerender(<ContentDivider label="o continúa con" />);
		expect(screen.queryByRole("separator")).toBeNull();
		expect(screen.getByText("o continúa con").className).toContain("text-tertiary");
		expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
		rerender(<ContentDivider label="Octubre 2026" heading />);
		expect(screen.getByText("Octubre 2026").className).toContain("text-primary");
		rerender(
			<ContentDivider label="ignorado">
				<Button size="sm">Cargar más</Button>
			</ContentDivider>,
		);
		expect(screen.getByRole("button", { name: "Cargar más" })).toBeTruthy();
		expect(screen.queryByText("ignorado")).toBeNull();
	});

	it("variantes dual y fill", () => {
		const { container, rerender } = render(<ContentDivider variant="dual" />);
		expect(container.querySelector('[aria-hidden="true"]')?.className).toContain("border-y");
		rerender(<ContentDivider variant="fill" label="Pendientes" />);
		expect(container.querySelector('[aria-hidden="true"]')?.className).toContain("bg-secondary");
		expect(screen.getByText("Pendientes").className).toContain("bg-secondary");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<ContentDivider />
				<ContentDivider label="o continúa con" />
				<ContentDivider variant="fill" label="Pendientes" />
			</div>,
		);
	});
});

describe("InlineCTA", () => {
	it("icono, título, descripción y acciones", () => {
		const { container } = render(
			<InlineCTA icon={Stars02} title="Conecta tu banco" description="Importa." actions={actions} />,
		);
		expect(screen.getByRole("heading", { level: 3, name: "Conecta tu banco" })).toBeTruthy();
		expect(container.querySelector("svg")).not.toBeNull();
		expect(container.firstElementChild?.className).toContain("rounded-xl");
		expect(screen.getAllByRole("button")).toHaveLength(2);
	});

	it("imagen por URL con alt, decorativa sin él, o un nodo", () => {
		const { container, rerender } = render(
			<InlineCTA title="Mejora" image="/foto.jpg" imageAlt="Una cuenta" />,
		);
		expect(screen.getByRole("img", { name: "Una cuenta" }).getAttribute("src")).toBe("/foto.jpg");
		rerender(<InlineCTA title="Mejora" image="/foto.jpg" />);
		expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
		rerender(<InlineCTA title="Mejora" image={<span>Dibujo</span>} />);
		expect(screen.getByText("Dibujo")).toBeTruthy();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<InlineCTA
				icon={Stars02}
				title="Conecta tu banco"
				image="/foto.jpg"
				imageAlt="Banco"
				actions={actions}
			/>,
		);
	});
});
