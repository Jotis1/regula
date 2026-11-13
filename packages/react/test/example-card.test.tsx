import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExampleCard, type ExampleCardVerdict } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const WORDS: [ExampleCardVerdict, string, "success" | "error"][] = [
	["do", "Esto sí", "success"],
	["dont", "Esto no", "error"],
	["instead", "En lugar de", "error"],
	["better", "Mejor", "success"],
];

describe("ExampleCard", () => {
	it("es una figure con su figcaption: veredicto y texto", () => {
		const { container } = render(
			<ExampleCard verdict="dont" caption="No apiles dos primarios.">
				<button type="button">Guardar</button>
				<button type="button">Enviar</button>
			</ExampleCard>,
		);
		const figure = container.querySelector("figure") as HTMLElement;
		expect(figure).not.toBeNull();
		const caption = figure.querySelector("figcaption") as HTMLElement;
		expect(caption.textContent).toContain("Esto no");
		expect(caption.textContent).toContain("No apiles dos primarios.");
		expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
		expect(figure.querySelector("figcaption")?.previousElementSibling?.textContent).toContain("Guardar");
	});

	it.each(WORDS)("%s: palabra «%s», icono y color %s", (verdict, word, color) => {
		const { container } = render(
			<ExampleCard verdict={verdict} caption="Texto">
				x
			</ExampleCard>,
		);
		const badge = screen.getByText(word);
		expect(badge.tagName).toBe("SPAN");
		expect(badge.className).toContain(`bg-utility-${color === "success" ? "green" : "red"}-50`);
		// el icono acompaña a la palabra: un svg decorativo dentro del badge
		const svg = badge.querySelector("svg");
		expect(svg).not.toBeNull();
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(container.querySelector("figcaption")?.contains(badge)).toBe(true);
	});

	it("el espécimen va sobre el damero por defecto y grid={false} lo quita", () => {
		const { container, rerender } = render(
			<ExampleCard verdict="do" caption="c">
				<span data-testid="s">x</span>
			</ExampleCard>,
		);
		const hasGrid = () => container.querySelector('[class*="linear-gradient"]') !== null;
		expect(hasGrid()).toBe(true);
		rerender(
			<ExampleCard verdict="do" caption="c" grid={false}>
				<span data-testid="s">x</span>
			</ExampleCard>,
		);
		expect(hasGrid()).toBe(false);
		expect(screen.getByTestId("s")).toBeTruthy();
	});

	it("grid acepta md", () => {
		const { container } = render(
			<ExampleCard verdict="do" caption="c" grid="md">
				x
			</ExampleCard>,
		);
		expect(container.querySelector('[class*="32px_32px"]')).not.toBeNull();
	});

	it("minHeight es 168 por defecto y se cambia", () => {
		const { container, rerender } = render(
			<ExampleCard verdict="do" caption="c">
				x
			</ExampleCard>,
		);
		const specimen = () => container.querySelector("figure > div") as HTMLElement;
		expect(specimen().style.minHeight).toBe("168px");
		rerender(
			<ExampleCard verdict="do" caption="c" minHeight={240}>
				x
			</ExampleCard>,
		);
		expect(specimen().style.minHeight).toBe("240px");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<>
				<ExampleCard verdict="do" caption="Un primario por pantalla.">
					<button type="button">Guardar</button>
				</ExampleCard>
				<ExampleCard verdict="dont" caption="No apiles dos primarios." grid={false}>
					<button type="button">Guardar</button>
				</ExampleCard>
			</>,
		);
	});
});
