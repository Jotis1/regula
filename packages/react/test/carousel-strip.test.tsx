import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Carousel } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const six = [1, 2, 3, 4, 5, 6].map((n) => <p key={n}>Diapositiva {n}</p>);
const list = () => screen.getByRole("list", { name: "Novedades" });

describe("Carousel type=strip", () => {
	it("es una lista con nombre y una diapositiva por elemento, todas en el árbol de accesibilidad", () => {
		render(<Carousel type="strip" aria-label="Novedades" slides={six} />);
		expect(screen.getAllByRole("listitem")).toHaveLength(6);
		expect(list().querySelectorAll("li")).toHaveLength(6);
		expect(list().querySelector("[inert], [aria-hidden]")).toBeNull();
		expect(screen.getByText("Diapositiva 6")).toBeTruthy();
	});

	it("la lista se desplaza en horizontal y se detiene en cada diapositiva", () => {
		render(<Carousel type="strip" aria-label="Novedades" slides={six} />);
		expect(list().className).toContain("overflow-x-auto");
		expect(list().className).toContain("snap-x");
		expect(list().className).toContain("snap-mandatory");
		expect(list().style.scrollSnapType).toBe("x mandatory");
		expect(list().className).toContain("gap-3");
		for (const li of list().querySelectorAll("li")) expect(li.className).toContain("snap-start");
	});

	it("no tiene flechas ni botones", () => {
		render(<Carousel type="strip" aria-label="Novedades" slides={six} />);
		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.queryByRole("region")).toBeNull();
	});

	it("los puntos son solo una indicación: sin botones y marcando la primera sin hidratar", () => {
		const { container } = render(<Carousel type="strip" aria-label="Novedades" slides={six} />);
		expect(screen.getByText("1 de 6")).toBeTruthy();
		const dots = container.querySelectorAll("span[aria-hidden=true]");
		expect(dots).toHaveLength(6);
		expect(dots[0]?.className).toContain("bg-brand-solid");
		expect(dots[1]?.className).toContain("bg-quaternary");
	});

	it("`slideWidth` da el ancho de cada diapositiva, 300px por defecto", () => {
		const { rerender } = render(<Carousel type="strip" aria-label="Novedades" slides={six} />);
		for (const li of list().querySelectorAll("li")) expect((li as HTMLElement).style.width).toBe("300px");
		rerender(<Carousel type="strip" aria-label="Novedades" slides={six} slideWidth={220} />);
		for (const li of list().querySelectorAll("li")) expect((li as HTMLElement).style.width).toBe("220px");
	});

	it('`type="slides"` pinta lo mismo que sin `type`', () => {
		const a = render(<Carousel aria-label="Fotos" slides={six} />).container.innerHTML;
		const b = render(<Carousel type="slides" aria-label="Fotos" slides={six} />).container.innerHTML;
		expect(b).toBe(a);
		expect(a).toContain('aria-roledescription="carrusel"');
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Carousel type="strip" aria-label="Novedades" slides={six} />);
	});
});
