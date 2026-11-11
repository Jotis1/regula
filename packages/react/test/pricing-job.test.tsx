import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, JobPostCard, PricingCard, type PricingCardType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const plan = {
	name: "Básico",
	price: "10 €",
	period: "al mes",
	description: "Para empezar.",
	badge: "Popular",
	features: ["Hasta 10 usuarios", "20 GB por persona", "Soporte por chat"],
	featuresTitle: "Funciones",
	actions: (
		<>
			<Button>Empezar</Button>
			<Button hierarchy="secondary">Hablar con ventas</Button>
		</>
	),
	banner: "El plan más elegido",
	callout: "¡El más elegido!",
};

describe("PricingCard", () => {
	it("los diez tipos pintan el plan, la cifra, la lista y los botones", () => {
		const types: PricingCardType[] = [
			"icon",
			"call-out",
			"icon-offset",
			"dual-check-items",
			"badge",
			"badge-group",
			"dual-action",
			"banner",
			"primary-simple",
			"primary-icon",
		];
		for (const type of types) {
			const { container, unmount } = render(<PricingCard type={type} {...plan} />);
			const card = container.querySelector("article") as HTMLElement;
			expect(within(card).getAllByText("Básico").length, type).toBeGreaterThan(0);
			expect(within(card).getByText("10 €"), type).toBeTruthy();
			expect(within(card).getAllByRole("listitem"), type).toHaveLength(3);
			expect(within(card).getByRole("button", { name: "Empezar" }), type).toBeTruthy();
			unmount();
		}
	});

	it("cada tipo pone sus piezas: banda, nota, icono desplazado y checks", () => {
		const { rerender, container } = render(<PricingCard type="banner" {...plan} />);
		expect(screen.getByText("El plan más elegido")).toBeTruthy();
		rerender(<PricingCard type="call-out" {...plan} />);
		expect(screen.getByText("¡El más elegido!")).toBeTruthy();
		rerender(<PricingCard type="primary-simple" {...plan} />);
		expect(container.querySelector("article")?.className).toContain("bg-brand-primary_alt");
		rerender(<PricingCard type="dual-check-items" {...plan} />);
		expect(container.querySelector("ul")?.className).toContain("@lg:grid-cols-2");
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(<PricingCard type="icon" {...plan} />);
	});
});

describe("JobPostCard", () => {
	const job = {
		href: "/empleo/disenador",
		title: "Diseñador de producto",
		description: "Buscamos a alguien para el equipo de diseño.",
		department: "Diseño",
		location: "En remoto",
		employment: "Jornada completa",
		salary: "40.000-50.000 €",
		category: "Diseño",
	};

	it("el título es el enlace; cada tipo enseña su lugar, jornada y sueldo", async () => {
		const { rerender } = render(<JobPostCard {...job} />);
		expect(screen.getByRole("link", { name: "Diseñador de producto" }).getAttribute("href")).toBe(
			"/empleo/disenador",
		);
		expect(screen.getByText("En remoto")).toBeTruthy();
		expect(screen.queryByText("40.000-50.000 €")).toBeNull();
		rerender(<JobPostCard {...job} type="card-02" />);
		expect(screen.getByText("40.000-50.000 €")).toBeTruthy();
		rerender(<JobPostCard {...job} type="card-01" />);
		expect(screen.getByText("Ver la oferta")).toBeTruthy();
		await expectAccessibleInThemes(<JobPostCard {...job} type="card-01" />);
	});
});
