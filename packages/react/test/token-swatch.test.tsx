import { colors } from "@jotis-me/tokens";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyTooltip, TokenSwatch } from "../src/index.js";
import { expectAccessibleInThemes, renderInThemes } from "./helpers.js";

let writeText: ReturnType<typeof vi.fn>;
beforeEach(() => {
	vi.useFakeTimers();
	writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});
afterEach(() => {
	vi.useRealTimers();
});

const props = { name: "text-primary", light: "#171717", dark: "#fafafa", utility: "text-primary" } as const;
const swatches = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>("[data-theme-swatch]")];
const chip = (el: HTMLElement) => el.querySelector<HTMLElement>('[aria-hidden="true"]') as HTMLElement;

describe("TokenSwatch", () => {
	it("pinta las dos muestras con su valor, en cualquier tema de página", () => {
		const { light, dark } = renderInThemes(<TokenSwatch {...props} />);
		for (const root of [light, dark]) {
			const [l, d] = swatches(root);
			expect(l?.textContent).toContain("#171717");
			expect(d?.textContent).toContain("#fafafa");
			// El color va en línea: no depende del tema de la página
			expect(chip(l as HTMLElement).style.backgroundColor).toBe("rgb(23, 23, 23)");
			expect(chip(d as HTMLElement).style.backgroundColor).toBe("rgb(250, 250, 250)");
		}
	});

	it("cada muestra lleva el filo border-primary de su propio tema, y se distingue de su color", () => {
		render(<TokenSwatch {...props} />);
		const [l, d] = swatches(document.body);
		const edge = (el: HTMLElement) => chip(el).style.boxShadow;
		expect(edge(l as HTMLElement)).toContain("#d4d4d4");
		expect(edge(d as HTMLElement)).toContain("#404040");
		expect(edge(l as HTMLElement)).not.toBe(edge(d as HTMLElement));
	});

	it("los filos son los valores de border-primary de @jotis-me/tokens", () => {
		const { light, dark } = colors["border-primary"];
		render(<TokenSwatch {...props} />);
		const [l, d] = swatches(document.body);
		expect(chip(l as HTMLElement).style.boxShadow).toContain(light);
		expect(chip(d as HTMLElement).style.boxShadow).toContain(dark);
	});

	it("el valor del token de la spec (text-primary) coincide con los tokens", () => {
		expect(colors["text-primary"].light).toBe("#171717");
		expect(colors["text-primary"].dark).toBe("#fafafa");
	});

	it("row y card: la tarjeta apila y lleva el uso, con muestras de 24px frente a 20px", () => {
		const { container, rerender } = render(<TokenSwatch {...props} usage="Texto y titulares." />);
		const row = container.firstElementChild as HTMLElement;
		expect(row.getAttribute("data-layout")).toBe("row");
		expect(row.className).not.toContain("rounded-xl");
		expect(chip(swatches(container)[0] as HTMLElement).className).toContain("size-5");
		rerender(<TokenSwatch {...props} usage="Texto y titulares." layout="card" />);
		const card = container.firstElementChild as HTMLElement;
		expect(card.getAttribute("data-layout")).toBe("card");
		expect(card.className).toContain("flex-col");
		expect(card.className).toContain("rounded-xl");
		expect(chip(swatches(container)[0] as HTMLElement).className).toContain("size-6");
		expect(screen.getByText("Texto y titulares.")).toBeTruthy();
		expect(screen.getByText("text-primary", { selector: "span" })).toBeTruthy();
	});

	it("las muestras se anuncian como tema claro y tema oscuro, y se pueden cambiar", () => {
		const { rerender } = render(<TokenSwatch {...props} />);
		expect(swatches(document.body)[0]?.textContent).toBe("Tema claro: #171717");
		expect(swatches(document.body)[1]?.textContent).toBe("Tema oscuro: #fafafa");
		rerender(<TokenSwatch {...props} labels={{ light: "Light", dark: "Dark" }} />);
		expect(swatches(document.body)[0]?.textContent).toBe("Light: #171717");
	});

	it("sin utility no hay botón", () => {
		render(<TokenSwatch name="x" light="#ffffff" dark="#0a0a0a" />);
		expect(screen.queryByRole("button")).toBeNull();
	});

	it("pulsar la utilidad la copia y CopyTooltip dice «Copiado»", async () => {
		const onCopy = vi.fn();
		render(
			<>
				<TokenSwatch {...props} onCopy={onCopy} />
				<CopyTooltip />
			</>,
		);
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "text-primary" }));
		});
		expect(writeText).toHaveBeenCalledExactlyOnceWith("text-primary");
		expect(document.querySelector("[data-copy-tooltip]")?.textContent).toBe("Copiado");
		expect(onCopy).toHaveBeenCalledExactlyOnceWith("text-primary", true);
	});

	it("si el portapapeles falla, avisa como los demás", async () => {
		writeText.mockRejectedValue(new Error("denegado"));
		const onCopy = vi.fn();
		render(
			<>
				<TokenSwatch {...props} onCopy={onCopy} />
				<CopyTooltip />
			</>,
		);
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "text-primary" }));
		});
		expect(document.querySelector("[data-copy-tooltip]")?.textContent).toBe(
			"No se pudo copiar: selecciónalo a mano",
		);
		expect(onCopy).toHaveBeenCalledExactlyOnceWith("text-primary", false);
	});

	it("se pinta en el servidor con los dos valores", () => {
		const html = renderToString(<TokenSwatch {...props} layout="card" />);
		expect(html).toContain("#171717");
		expect(html).toContain("#fafafa");
	});

	it("axe en claro y oscuro, en fila y en tarjeta", async () => {
		// axe usa temporizadores reales
		vi.useRealTimers();
		await expectAccessibleInThemes(
			<div>
				<TokenSwatch {...props} />
				<TokenSwatch {...props} layout="card" usage="Texto y titulares." />
			</div>,
		);
	});
});
