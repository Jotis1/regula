import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CompareSlider } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const props = {
	label: "Tema de la pantalla",
	before: <p>Capa de abajo</p>,
	after: <p>Capa de arriba</p>,
};
const range = () => screen.getByRole("slider", { name: "Tema de la pantalla" }) as HTMLInputElement;
const root = () => range().parentElement as HTMLElement;
const at = () => root().style.getPropertyValue("--compare-at");

describe("CompareSlider", () => {
	it("recorta la capa de arriba según el valor: 50 por defecto y 80 cuando se lleva al 80 %", () => {
		const { unmount } = render(<CompareSlider {...props} />);
		expect(at()).toBe("50%");
		expect(range().value).toBe("50");
		const top = screen.getByText("Capa de arriba").parentElement as HTMLElement;
		expect(top.className).toContain("[clip-path:inset(0_0_0_var(--compare-at))]");
		unmount();
		render(<CompareSlider {...props} value={80} />);
		expect(at()).toBe("80%");
	});

	it("el alto es el que se pide, 320 px por defecto", () => {
		const { rerender } = render(<CompareSlider {...props} />);
		expect(root().style.height).toBe("320px");
		rerender(<CompareSlider {...props} height={200} />);
		expect(root().style.height).toBe("200px");
	});

	it("arrastrar la línea (el mando nativo cambia) mueve el recorte y llama a onChange", async () => {
		const onChange = vi.fn();
		render(<CompareSlider {...props} onChange={onChange} />);
		const { fireEvent } = await import("@testing-library/react");
		fireEvent.change(range(), { target: { value: "80" } });
		expect(at()).toBe("80%");
		expect(onChange).toHaveBeenLastCalledWith(80);
	});

	it("con el teclado: tres flechas → dan 53 y Fin da 100", async () => {
		const onChange = vi.fn();
		render(<CompareSlider {...props} onChange={onChange} />);
		await userEvent.tab();
		expect(document.activeElement).toBe(range());
		await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
		expect(range().value).toBe("53");
		expect(at()).toBe("53%");
		await userEvent.keyboard("{End}");
		expect(range().value).toBe("100");
		expect(onChange).toHaveBeenLastCalledWith(100);
	});

	it("las flechas ← y ↓ restan 1, Re Pág suma 10, Av Pág resta 10 e Inicio da 0", async () => {
		render(<CompareSlider {...props} defaultValue={40} />);
		await userEvent.tab();
		await userEvent.keyboard("{ArrowLeft}");
		expect(range().value).toBe("39");
		await userEvent.keyboard("{ArrowDown}");
		expect(range().value).toBe("38");
		await userEvent.keyboard("{PageUp}");
		expect(range().value).toBe("48");
		await userEvent.keyboard("{PageDown}{PageDown}");
		expect(range().value).toBe("28");
		await userEvent.keyboard("{Home}");
		expect(range().value).toBe("0");
	});

	it("no se sale de 0 a 100 y no llama a onChange si no cambia nada", async () => {
		const onChange = vi.fn();
		render(<CompareSlider {...props} defaultValue={95} onChange={onChange} />);
		await userEvent.tab();
		await userEvent.keyboard("{PageUp}");
		expect(range().value).toBe("100");
		onChange.mockClear();
		await userEvent.keyboard("{ArrowRight}{End}");
		expect(onChange).not.toHaveBeenCalled();
	});

	it("controlado: manda el padre", async () => {
		const onChange = vi.fn();
		render(<CompareSlider {...props} value={30} onChange={onChange} />);
		await userEvent.tab();
		await userEvent.keyboard("{ArrowRight}");
		expect(onChange).toHaveBeenCalledWith(31);
		expect(range().value).toBe("30");
	});

	it("el control tiene nombre y anuncia el valor con la capa de arriba: «55 % Después»", () => {
		const { rerender } = render(<CompareSlider {...props} defaultValue={55} />);
		expect(range().getAttribute("aria-valuetext")).toBe("55 % Después");
		expect(range().getAttribute("aria-label")).toBe("Tema de la pantalla");
		rerender(<CompareSlider {...props} defaultValue={55} afterLabel="Oscuro" beforeLabel="Claro" />);
		expect(range().getAttribute("aria-valuetext")).toBe("55 % Oscuro");
		expect(screen.getByText("Claro")).toBeTruthy();
	});

	it("las etiquetas por defecto son «Antes» y «Después»", () => {
		render(<CompareSlider {...props} />);
		expect(screen.getByText("Antes")).toBeTruthy();
		expect(screen.getByText("Después")).toBeTruthy();
	});

	it("la capa de abajo está tapada con aria-hidden e inert; la de arriba se lee", () => {
		render(
			<CompareSlider
				{...props}
				before={<button type="button">Botón de abajo</button>}
				after={<button type="button">Botón de arriba</button>}
			/>,
		);
		const below = screen.getByText("Botón de abajo", { selector: "button" }).parentElement as HTMLElement;
		expect(below.getAttribute("aria-hidden")).toBe("true");
		expect(below.hasAttribute("inert")).toBe(true);
		expect(screen.queryByRole("button", { name: "Botón de abajo" })).toBeNull();
		const above = screen.getByRole("button", { name: "Botón de arriba" }).parentElement as HTMLElement;
		expect(above.hasAttribute("inert")).toBe(false);
		expect(above.hasAttribute("aria-hidden")).toBe(false);
	});

	it("se pinta en el servidor con la línea en defaultValue y las dos capas", () => {
		const html = renderToString(<CompareSlider {...props} defaultValue={30} />);
		expect(html).toContain("--compare-at:30%");
		expect(html).toContain("Capa de abajo");
		expect(html).toContain("Capa de arriba");
		expect(html).toContain('value="30"');
		// Sin JavaScript no se puede mover: el mando va desactivado hasta hidratar
		expect(html).toMatch(/<input[^>]*disabled/);
	});

	it("tras hidratar, el mando se activa", () => {
		render(<CompareSlider {...props} />);
		expect(range().disabled).toBe(false);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<CompareSlider {...props} defaultValue={40} />);
	});
});
