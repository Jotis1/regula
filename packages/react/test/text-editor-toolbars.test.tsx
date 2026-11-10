import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextEditor } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const HTML = "<p>Revisar el <b>seguro del coche</b> antes del 15.</p>";

const selectionChanged = () =>
	act(() => {
		document.dispatchEvent(new Event("selectionchange"));
	});

/** Selecciona todo el texto del área y avisa, como hace el navegador al arrastrar. */
function selectAll() {
	const area = screen.getByRole("textbox");
	const range = document.createRange();
	range.selectNodeContents(area);
	const sel = window.getSelection();
	sel?.removeAllRanges();
	sel?.addRange(range);
	selectionChanged();
	return area;
}

const names = (bar: HTMLElement) =>
	within(bar)
		.getAllByRole("button")
		.map((b) => b.getAttribute("aria-label") ?? b.textContent);

describe("TextEditor: barras del Figma", () => {
	const original = { exec: document.execCommand, state: document.queryCommandState };
	afterEach(() => {
		document.execCommand = original.exec;
		document.queryCommandState = original.state;
		window.getSelection()?.removeAllRanges();
	});

	it("sin toolbar ni size, la barra y los títulos de siempre", () => {
		render(<TextEditor label="Notas" defaultValue={HTML} />);
		const bar = screen.getByRole("toolbar", { name: "Formato" });
		expect(names(bar)).toEqual([
			"Negrita",
			"Cursiva",
			"Subrayado",
			"Lista",
			"Enlace",
			"Alinear a la izquierda",
			"Centrar",
			"Alinear a la derecha",
		]);
		expect(screen.getByRole("button", { name: "Negrita" }).getAttribute("title")).toBe("Negrita");
		const html = renderToStaticMarkup(<TextEditor label="Notas" defaultValue={HTML} />);
		expect(html).toContain("rounded-xl p-5 text-md");
		expect(html).not.toContain("relative");
	});

	it("simple: negrita, cursiva, subrayado, color, alineación y lista, sin selectores", () => {
		render(<TextEditor toolbar="simple" />);
		const bar = screen.getByRole("toolbar", { name: "Formato" });
		expect(names(bar)).toEqual([
			"Negrita",
			"Cursiva",
			"Subrayado",
			"Color del texto",
			"Alinear a la izquierda",
			"Centrar",
			"Lista",
		]);
	});

	it("avanzada: selectores de letra, enlace, imagen y generar solo con onGenerate", async () => {
		const { rerender } = render(<TextEditor toolbar="advanced" />);
		const bar = screen.getByRole("toolbar", { name: "Formato" });
		expect(names(bar)).toContain("Enlace");
		expect(names(bar)).toContain("Insertar imagen");
		expect(names(bar)).not.toContain("Generar");
		expect(
			bar.querySelectorAll("[aria-label='Tipo de letra'], [aria-label='Tamaño de letra']").length,
		).toBeGreaterThan(0);
		const onGenerate = vi.fn();
		rerender(<TextEditor toolbar="advanced" onGenerate={onGenerate} />);
		await userEvent.click(screen.getByRole("button", { name: "Generar" }));
		expect(onGenerate).toHaveBeenCalledTimes(1);
	});

	it("imagen y enlace piden la dirección; cancelar no hace nada", async () => {
		const exec = vi.fn(() => true);
		document.execCommand = exec;
		const prompt = vi
			.spyOn(window, "prompt")
			.mockReturnValueOnce("https://jotis.me/a.png")
			.mockReturnValueOnce(null);
		render(<TextEditor toolbar="advanced" />);
		const image = screen.getByRole("button", { name: "Insertar imagen" });
		await userEvent.click(image);
		expect(prompt).toHaveBeenCalledWith("Dirección de la imagen");
		expect(exec).toHaveBeenCalledWith("insertImage", false, "https://jotis.me/a.png");
		await userEvent.click(image);
		expect(exec).toHaveBeenCalledTimes(1);
		prompt.mockRestore();
	});

	it("el color se aplica con un clic en una muestra o con un hex y Enter", async () => {
		const exec = vi.fn(() => true);
		document.execCommand = exec;
		const onChange = vi.fn();
		render(<TextEditor toolbar="simple" defaultValue={HTML} onChange={onChange} />);
		await userEvent.click(screen.getByRole("button", { name: "Color del texto" }));
		const dialog = await screen.findByRole("dialog", { name: "Color del texto" });
		await userEvent.click(within(dialog).getByRole("button", { name: "#2563eb" }));
		await waitFor(() => expect(exec).toHaveBeenCalledWith("foreColor", false, "#2563eb"));
		expect(onChange).toHaveBeenCalled();
		// Elegir una muestra cierra el selector
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		await userEvent.click(screen.getByRole("button", { name: "Color del texto" }));
		const field = (await screen.findByRole("textbox", { name: "Personalizado" })) as HTMLInputElement;
		await userEvent.clear(field);
		await userEvent.type(field, "7F56D9{Enter}");
		await waitFor(() => expect(exec).toHaveBeenLastCalledWith("foreColor", false, "#7F56D9"));
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		// Un hex a medias no cambia nada y deja abierto el selector
		await userEvent.click(screen.getByRole("button", { name: "Color del texto" }));
		const half = (await screen.findByRole("textbox", { name: "Personalizado" })) as HTMLInputElement;
		const calls = exec.mock.calls.length;
		await userEvent.clear(half);
		await userEvent.type(half, "7F5{Enter}");
		expect(exec.mock.calls.length).toBe(calls);
		expect(screen.getByRole("dialog")).toBeTruthy();
	});

	it("tooltips: cada botón se nombra y el tooltip sale al enfocarlo", async () => {
		render(<TextEditor toolbar="simple" />);
		const bold = screen.getByRole("button", { name: "Negrita" });
		expect(bold.getAttribute("title")).toBeNull();
		await userEvent.tab();
		expect(document.activeElement).toBe(bold);
		const tip = await screen.findByRole("tooltip");
		expect(tip.textContent).toBe("Negrita");
	});

	it("flotante: no hay barra hasta seleccionar; al seleccionar aparece y Escape la cierra", async () => {
		const exec = vi.fn(() => true);
		document.execCommand = exec;
		render(<TextEditor toolbar="floating" size="sm" defaultValue={HTML} />);
		expect(screen.queryByRole("toolbar")).toBeNull();
		const area = selectAll();
		const bar = await screen.findByRole("toolbar", { name: "Formato" });
		// sm: los botones de la simple
		expect(within(bar).getAllByRole("button")).toHaveLength(7);
		await userEvent.click(within(bar).getByRole("button", { name: "Negrita" }));
		expect(exec).toHaveBeenCalledWith("bold", false, undefined);
		fireEvent.keyDown(area, { key: "Escape" });
		await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
		// Mientras siga seleccionado, no vuelve; sin selección y al volver a seleccionar, sí
		selectionChanged();
		expect(screen.queryByRole("toolbar")).toBeNull();
		window.getSelection()?.removeAllRanges();
		selectionChanged();
		selectAll();
		expect(await screen.findByRole("toolbar", { name: "Formato" })).toBeTruthy();
	});

	it("flotante: Escape desde un botón de la barra también la cierra y devuelve el foco al área", async () => {
		render(<TextEditor toolbar="floating" defaultValue={HTML} />);
		const area = selectAll();
		const bar = await screen.findByRole("toolbar", { name: "Formato" });
		// md: los de la avanzada, sin los selectores
		expect(within(bar).getByRole("button", { name: "Insertar imagen" })).toBeTruthy();
		expect(bar.querySelector("[aria-label='Tipo de letra']")).toBeNull();
		const italic = within(bar).getByRole("button", { name: "Cursiva" });
		italic.focus();
		fireEvent.keyDown(italic, { key: "Escape" });
		await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
		expect(document.activeElement).toBe(area);
	});

	it("flotante: se centra en la selección sin salirse del editor por los lados", async () => {
		// jsdom no calcula medidas: editor de 300 px, barra de 200 px y selección de 10 px de ancho
		const rect = (left: number) => ({ left, top: 100, width: 10, height: 20 }) as DOMRect;
		const spies = [
			vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(200),
			vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(300),
			vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect(0)),
		];
		let left = 0;
		Range.prototype.getBoundingClientRect = () => rect(left);
		try {
			render(<TextEditor toolbar="floating" size="sm" defaultValue={HTML} />);
			const placed = async (x: number) => {
				window.getSelection()?.removeAllRanges();
				selectionChanged();
				left = x;
				selectAll();
				return (await screen.findByRole("toolbar")).style.left;
			};
			expect(await placed(0)).toBe("100px");
			expect(await placed(145)).toBe("150px");
			expect(await placed(290)).toBe("200px");
		} finally {
			for (const spy of spies) spy.mockRestore();
			delete (Range.prototype as { getBoundingClientRect?: unknown }).getBoundingClientRect;
		}
	});

	it("flotante: una selección vacía la esconde", async () => {
		render(<TextEditor toolbar="floating" defaultValue={HTML} />);
		selectAll();
		await screen.findByRole("toolbar");
		window.getSelection()?.collapseToStart();
		selectionChanged();
		await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
	});

	it("size sm cambia el relleno, el radio y el texto del área", () => {
		render(<TextEditor size="sm" label="Notas" />);
		const area = screen.getByRole("textbox", { name: "Notas" });
		expect(area.className).toContain("p-4");
		expect(area.className).toContain("rounded-md");
		expect(area.className).toContain("text-sm");
	});

	it("se renderiza en servidor: la flotante no sale, las demás sí", () => {
		expect(renderToStaticMarkup(<TextEditor toolbar="floating" defaultValue={HTML} />)).not.toContain(
			'role="toolbar"',
		);
		expect(renderToStaticMarkup(<TextEditor toolbar="advanced" defaultValue={HTML} />)).toContain(
			'role="toolbar"',
		);
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<TextEditor label="Notas" toolbar="simple" defaultValue={HTML} />);
		await expectAccessibleInThemes(
			<TextEditor label="Notas" toolbar="advanced" size="sm" onGenerate={() => {}} />,
		);
	});
});
