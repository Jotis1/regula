import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, Carousel } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const slides = [<p key="a">Uno</p>, <Button key="b">Dos</Button>, <p key="c">Tres</p>];
const region = () => screen.getByRole("region", { name: "Fotos" });
const track = () => region().querySelector("[style*=translateX]") as HTMLElement;
const shift = () => track().style.transform;

const swipe = (el: Element, from: number, to: number) => {
	fireEvent.pointerDown(el, { clientX: from, pointerId: 1, pointerType: "touch" });
	fireEvent.pointerUp(el, { clientX: to, pointerId: 1, pointerType: "touch" });
};

describe("Carousel", () => {
	it("es una región con nombre y rol «carrusel», con una diapositiva «n de N» cada una", () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		expect(region().getAttribute("aria-roledescription")).toBe("carrusel");
		const groups = region().querySelectorAll("[aria-roledescription=diapositiva]");
		expect(Array.from(groups).map((g) => g.getAttribute("aria-label"))).toEqual([
			"1 de 3",
			"2 de 3",
			"3 de 3",
		]);
	});

	it("las diapositivas que no se ven quedan inertes y ocultas a los lectores", () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		const groups = Array.from(region().querySelectorAll("[aria-roledescription=diapositiva]"));
		expect(groups.map((g) => g.hasAttribute("inert"))).toEqual([false, true, true]);
		expect(groups.map((g) => g.getAttribute("aria-hidden"))).toEqual([null, "true", "true"]);
		// El botón de la segunda no se ofrece mientras no se ve
		expect(screen.queryByRole("button", { name: "Dos" })).toBeNull();
	});

	it("las flechas pasan de diapositiva y se deshabilitan en los extremos", async () => {
		const onChange = vi.fn();
		render(<Carousel aria-label="Fotos" slides={slides} onChange={onChange} />);
		const prev = screen.getByRole("button", { name: "Diapositiva anterior" });
		const next = screen.getByRole("button", { name: "Diapositiva siguiente" });
		const off = (b: HTMLElement) => b.getAttribute("aria-disabled") === "true";
		expect(off(prev)).toBe(true);
		expect(off(next)).toBe(false);
		await userEvent.click(next);
		expect(onChange).toHaveBeenLastCalledWith(1);
		expect(shift()).toBe("translateX(-100%)");
		expect(off(prev)).toBe(false);
		await userEvent.click(next);
		expect(off(next)).toBe(true);
		// Con el foco en la flecha, llegar al extremo no lo pierde
		expect(document.activeElement).toBe(next);
		expect(shift()).toBe("translateX(-200%)");
		await userEvent.click(next); // en el extremo, no pasa nada
		expect(shift()).toBe("translateX(-200%)");
		await userEvent.click(prev);
		expect(onChange).toHaveBeenLastCalledWith(1);
	});

	it("los puntos llevan a cada diapositiva y el actual lleva aria-current", async () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		const dots = screen.getAllByRole("button", { name: /Ir a la página/ });
		expect(dots).toHaveLength(3);
		expect(dots[0]?.getAttribute("aria-current")).toBe("true");
		await userEvent.click(dots[2] as HTMLElement);
		expect(shift()).toBe("translateX(-200%)");
		expect(dots[2]?.getAttribute("aria-current")).toBe("true");
	});

	it("← y → con el foco dentro pasan de diapositiva, sin dar la vuelta", async () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		screen.getByRole("button", { name: "Diapositiva siguiente" }).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(shift()).toBe("translateX(-100%)");
		await userEvent.keyboard("{ArrowRight}{ArrowRight}");
		expect(shift()).toBe("translateX(-200%)");
		await userEvent.keyboard("{ArrowLeft}");
		expect(shift()).toBe("translateX(-100%)");
		await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
		expect(shift()).toBe("translateX(-0%)");
	});

	it("deslizar con el puntero: a la izquierda, la siguiente; a la derecha, la anterior; umbral de 48px", () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		const viewport = track().parentElement as HTMLElement;
		swipe(viewport, 200, 160); // 40px: no llega
		expect(shift()).toBe("translateX(-0%)");
		swipe(viewport, 200, 140); // 60px a la izquierda
		expect(shift()).toBe("translateX(-100%)");
		swipe(viewport, 100, 200); // a la derecha
		expect(shift()).toBe("translateX(-0%)");
		swipe(viewport, 100, 200); // ya en la primera: no da la vuelta
		expect(shift()).toBe("translateX(-0%)");
	});

	it("la transición se quita con movimiento reducido", () => {
		render(<Carousel aria-label="Fotos" slides={slides} />);
		expect(track().className).toContain("transition-transform");
		expect(track().className).toContain("motion-reduce:transition-none");
	});

	it("controlado con `index`: manda el padre", async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Carousel aria-label="Fotos" slides={slides} index={1} onChange={onChange} />,
		);
		expect(shift()).toBe("translateX(-100%)");
		await userEvent.click(screen.getByRole("button", { name: "Diapositiva siguiente" }));
		expect(onChange).toHaveBeenCalledWith(2);
		expect(shift()).toBe("translateX(-100%)");
		rerender(<Carousel aria-label="Fotos" slides={slides} index={2} onChange={onChange} />);
		expect(shift()).toBe("translateX(-200%)");
	});

	it("`size` da flechas de 36px (md) o de 44px (lg)", () => {
		const { rerender } = render(<Carousel aria-label="Fotos" slides={slides} />);
		expect(screen.getByRole("button", { name: "Diapositiva siguiente" }).className).toContain("size-9");
		rerender(<Carousel aria-label="Fotos" slides={slides} size="lg" />);
		expect(screen.getByRole("button", { name: "Diapositiva siguiente" }).className).toContain("size-11");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Carousel aria-label="Fotos" slides={slides} />);
	});
});
