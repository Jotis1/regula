import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
	Avatar,
	Button,
	ButtonGroup,
	MetricCard,
	type MetricCardChartStyle,
	type MetricCardIconStyle,
	PageHeader,
	SectionHeader,
	Tabs,
} from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { metric: string; page: string; section: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/headers-metric-before.json"), "utf8"),
);

describe("los de siempre", () => {
	it("sin las props nuevas el HTML de MetricCard, PageHeader y SectionHeader es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<>
					<MetricCard label="Gasto" value="1.284 €" change="12%" period="vs. septiembre" menu />
					<MetricCard label="Ingresos" value="2.000 €" change="3%" trend="down" />
				</>,
			),
		).toBe(BEFORE.metric);
		expect(
			renderToStaticMarkup(
				<PageHeader
					title="Gastos"
					description="Lo que entra y sale"
					breadcrumbs={[{ label: "Inicio", href: "/", icon: "home-line" }, { label: "Gastos" }]}
					actions={<button type="button">Nuevo</button>}
				>
					<p>Hijos</p>
				</PageHeader>,
			),
		).toBe(BEFORE.page);
		expect(
			renderToStaticMarkup(
				<>
					<SectionHeader
						title="Equipo"
						description="Personas"
						actions={<button type="button">Invitar</button>}
					/>
					<SectionHeader title="Pequeña" size="sm" divider={false}>
						<p>Hijos</p>
					</SectionHeader>
				</>,
			),
		).toBe(BEFORE.section);
	});
});

const DATA = [3, 5, 4, 6, 5, 8, 7, 9];

describe("MetricCard: icono y gráfica", () => {
	it("con chart y trend down lleva la mini gráfica en el color de error y el cambio en rojo con su flecha", () => {
		const { container } = render(
			<MetricCard label="Visitas" value="2.000" change="10%" trend="down" chart={DATA} />,
		);
		const svg = container.querySelector("svg[aria-hidden='true'][viewBox='0 0 112 56']") as SVGElement;
		expect(svg).toBeTruthy();
		const paths = svg.querySelectorAll("path");
		expect(paths[1]?.getAttribute("stroke")).toBe("var(--fg-error-secondary)");
		const change = screen.getByText("10%").closest(".text-error-primary") as HTMLElement;
		expect(change).toBeTruthy();
		expect(within(change).getByText(/Baja/)).toBeTruthy();
		// La gráfica está a la derecha de la cifra
		const row = svg.parentElement as HTMLElement;
		expect(row.lastElementChild).toBe(svg);
	});

	it("la línea de chartStyle line va a todo el ancho y header pone el título en una banda", () => {
		const { container } = render(
			<>
				<MetricCard label="Línea" value="1" change="1%" chart={DATA} chartStyle="line" />
				<MetricCard label="Banda" value="2" change="2%" chart={DATA} chartStyle="header" />
			</>,
		);
		expect(container.querySelectorAll("svg[viewBox='0 0 320 64']")).toHaveLength(2);
		expect((container.children[1] as HTMLElement).className).toContain("bg-secondary");
	});

	it.each<MetricCardIconStyle>(["featured", "featured-inline", "modern", "modern-inline"])(
		"iconStyle %s pinta el icono destacado y es accesible",
		async (iconStyle) => {
			const { container } = render(
				<MetricCard
					label="Visitas"
					value="2.000"
					change="100%"
					icon="trend-up-01"
					iconStyle={iconStyle}
					menu
				/>,
			);
			expect(container.querySelector("svg")).toBeTruthy();
			await expectAccessibleInThemes(
				<MetricCard
					label="Visitas"
					value="2.000"
					change="100%"
					icon="trend-up-01"
					iconStyle={iconStyle}
					menu
				/>,
			);
		},
	);

	it.each<MetricCardChartStyle>(["sparkline", "area", "line", "header"])(
		"chartStyle %s es accesible",
		async (chartStyle) => {
			await expectAccessibleInThemes(
				<MetricCard
					label="Visitas"
					value="2.000"
					change="100%"
					period="vs. el mes pasado"
					icon="eye"
					chart={DATA}
					chartStyle={chartStyle}
					menu
					footer={<a href="/informe">Ver informe</a>}
				/>,
			);
		},
	);

	it("changeBadge pinta el cambio como insignia y footer va bajo una raya", () => {
		render(
			<MetricCard
				label="Visitas"
				value="2.000"
				change="100%"
				changeBadge
				footer={<a href="/informe">Ver informe</a>}
			/>,
		);
		expect(screen.getByText("100%").closest(".rounded-md")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Ver informe" })).toBeTruthy();
	});
});

describe("PageHeader: avatar, banda y centrado", () => {
	it("con banda y avatar, la banda es decorativa y el avatar sube sobre ella", () => {
		const { container } = render(
			<PageHeader
				title="Olivia Rhye"
				description="olivia@jotis.me"
				banner
				avatar={<Avatar size="2xl" initials="OR" />}
			/>,
		);
		const band = container.querySelector("header > div[aria-hidden='true']") as HTMLElement;
		expect(band.className).toContain("h-40");
		expect(screen.getByText("OR").closest("div.flex-none")?.className).toContain("-mt-16");
		expect(screen.getByRole("heading", { level: 1, name: "Olivia Rhye" })).toBeTruthy();
	});

	it("centered centra el texto y back pone el enlace «Volver» para estrecho", () => {
		render(
			<PageHeader
				title="Equipo"
				centered
				back={{ href: "/ajustes/" }}
				breadcrumbs={[{ label: "Ajustes", href: "/ajustes/" }, { label: "Equipo" }]}
			/>,
		);
		expect(screen.getByRole("heading", { level: 1 }).parentElement?.className).toContain("text-center");
		expect(screen.getByRole("link", { name: "Volver" }).getAttribute("href")).toBe("/ajustes/");
		expect(screen.getByRole("navigation", { name: "Migas de pan" })).toBeTruthy();
	});

	it("es accesible con banda, avatar y centrado", async () => {
		await expectAccessibleInThemes(
			<PageHeader
				title="Olivia Rhye"
				description="olivia@jotis.me"
				banner
				centered
				avatar={<Avatar size="2xl" initials="OR" />}
				actions={<Button size="sm">Editar</Button>}
			/>,
		);
	});
});

describe("SectionHeader: pestañas, búsqueda y grupo de botones", () => {
	it("con tabs de tres pestañas, van bajo el título y se manejan con las flechas", async () => {
		render(
			<SectionHeader
				title="Equipo"
				tabs={
					<Tabs
						type="button-border"
						aria-label="Secciones"
						items={[
							{ id: "a", label: "Mis datos" },
							{ id: "b", label: "Perfil" },
							{ id: "c", label: "Contraseña" },
						]}
					/>
				}
			/>,
		);
		const tabs = screen.getAllByRole("tab");
		expect(tabs).toHaveLength(3);
		// Bajo el título: el h2 va antes que la lista de pestañas en el documento
		const h2 = screen.getByRole("heading", { level: 2 });
		expect(
			h2.compareDocumentPosition(tabs[0] as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		await userEvent.click(tabs[0] as HTMLElement);
		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(tabs[1]);
	});

	it("search, buttonGroup y menu van a la derecha, con el menú el último", () => {
		const { container } = render(
			<SectionHeader
				title="Equipo"
				search={<input aria-label="Buscar" />}
				buttonGroup={
					<ButtonGroup
						aria-label="Periodo"
						items={[
							{ value: "12m", label: "12 meses" },
							{ value: "30d", label: "30 días" },
						]}
					/>
				}
				menu={<Button hierarchy="tertiary" size="sm" iconOnly="dots-vertical" label="Más opciones" />}
			/>,
		);
		expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "12 meses" })).toBeTruthy();
		const grid = container.querySelector(".grid") as HTMLElement;
		expect((grid.lastElementChild as HTMLElement).textContent).toContain("Más opciones");
	});

	it("es accesible con todo", async () => {
		await expectAccessibleInThemes(
			<SectionHeader
				title="Equipo"
				description="Gestiona tu equipo."
				search={<input aria-label="Buscar" />}
				menu={<Button hierarchy="tertiary" size="sm" iconOnly="dots-vertical" label="Más opciones" />}
				tabs={
					<Tabs
						type="button-border"
						aria-label="Secciones"
						items={[{ id: "a", label: "Mis datos" }]}
					/>
				}
			/>,
		);
	});
});
