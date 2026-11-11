import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rating, RatingBadge } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const fills = (el: Element) => [...el.querySelectorAll("svg")].map((s) => Number(s.dataset.fill));

describe("Rating", () => {
	it("4,5: cuatro estrellas llenas y una a medias, y se lee «4,5 de 5»", () => {
		render(<Rating value={4.5} />);
		const img = screen.getByRole("img", { name: "4,5 de 5" });
		expect(fills(img)).toEqual([100, 100, 100, 100, 50]);
		const half = img.querySelectorAll("svg")[4]?.querySelectorAll("path")[1] as SVGPathElement;
		expect(half.style.clipPath).toBe("inset(0 50% 0 0)");
		// Las llenas no recortan
		const full = img.querySelectorAll("svg")[0]?.querySelectorAll("path")[1] as SVGPathElement;
		expect(full.style.clipPath).toBe("");
	});

	it("rellena en pasos de 10 % y respeta max, color y tamaño", () => {
		render(<Rating value={2.34} max={3} color="gray" size="sm" />);
		const img = screen.getByRole("img", { name: "2,3 de 3" });
		expect(fills(img)).toEqual([100, 100, 30]);
		const svg = img.querySelector("svg") as SVGSVGElement;
		expect(svg.getAttribute("width")).toBe("16");
		expect(svg.querySelectorAll("path")[1]?.getAttribute("fill")).toBe("var(--fg-primary)");
	});

	it("una estrella vacía no pinta relleno y el texto se puede cambiar", () => {
		render(<Rating value={0} label="Sin valorar" />);
		const img = screen.getByRole("img", { name: "Sin valorar" });
		expect(fills(img)).toEqual([0, 0, 0, 0, 0]);
		expect(img.querySelectorAll("path")).toHaveLength(5);
	});
});

describe("RatingBadge", () => {
	it("pinta las coronas, las estrellas y los textos", async () => {
		const ui = <RatingBadge title="Mejor herramienta de diseño" supportingText="2.000+ reseñas" />;
		const { container } = render(ui);
		expect(screen.getByRole("img", { name: "5 de 5" })).toBeTruthy();
		expect(screen.getByText("Mejor herramienta de diseño").className).toContain("font-semibold");
		expect(screen.getByText("2.000+ reseñas").className).toContain("text-secondary");
		const wreaths = container.querySelectorAll(":scope > div > svg");
		expect(wreaths).toHaveLength(2);
		expect(wreaths[1]?.getAttribute("class")).toContain("-scale-x-100");
		await expectAccessibleInThemes(ui);
	});

	it("sin estrellas, solo el texto", () => {
		render(<RatingBadge title="Producto del día" stars={false} />);
		expect(screen.queryByRole("img")).toBeNull();
	});
});
