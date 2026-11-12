import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Carousel, Testimonial } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Testimonial", () => {
	it("la cita, las estrellas y la persona, en una figura sobre la foto", async () => {
		const ui = (
			<Testimonial
				quote="Regula nos ha ahorrado horas cada mes."
				name="Lucía Ramos"
				role="Diseñadora, Capas"
				company="Agencia de diseño"
				rating={5}
				image={<img src="/lucia.jpg" alt="" />}
			/>
		);
		const { container } = render(ui);
		expect(container.querySelector("blockquote")?.textContent).toBe(
			"“Regula nos ha ahorrado horas cada mes.”",
		);
		expect(screen.getByRole("img", { name: "5 de 5" })).toBeTruthy();
		expect(container.querySelector("figcaption")?.textContent).toContain("Lucía Ramos");
		await expectAccessibleInThemes(ui);
	});

	it("flechas solo con sus funciones; tipo y tamaño", async () => {
		const onNext = vi.fn();
		const { container, rerender } = render(<Testimonial name="Lucía Ramos" />);
		expect(screen.queryByRole("button")).toBeNull();
		rerender(
			<Testimonial
				name="Lucía Ramos"
				type="full-width"
				size="sm"
				onPrevious={() => {}}
				onNext={onNext}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Testimonio siguiente" }));
		expect(onNext).toHaveBeenCalled();
		expect(container.querySelector(".rounded-2xl")).toBeNull();
	});
});

describe("Carousel arrowStyle", () => {
	const slides = ["Uno", "Dos"].map((t) => <p key={t}>{t}</p>);

	it("sin arrowStyle, el HTML de siempre", () => {
		const a = renderToStaticMarkup(<Carousel slides={slides} aria-label="Fotos" />);
		const b = renderToStaticMarkup(
			<Carousel slides={slides} aria-label="Fotos" arrowStyle="button-chevron" />,
		);
		expect(b).toBe(a);
	});

	it("button-arrow cambia el icono y arrow quita el círculo", () => {
		const arrow = renderToStaticMarkup(
			<Carousel slides={slides} aria-label="Fotos" arrowStyle="button-arrow" />,
		);
		const base = renderToStaticMarkup(<Carousel slides={slides} aria-label="Fotos" />);
		expect(arrow).not.toBe(base);
		render(<Carousel slides={slides} aria-label="Fotos" arrowStyle="arrow" />);
		const next = screen.getByRole("button", { name: /siguiente/i });
		expect(next.className).toContain("bg-transparent");
		expect(next.querySelector("svg")?.getAttribute("width")).toBe("40");
	});
});
