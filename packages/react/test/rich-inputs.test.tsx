import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ColorPicker, MessageInput, TextEditor } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const SWATCHES = ["#4f39f6", "#00a63e", "#e7000b"];

describe("ColorPicker", () => {
	const hexField = () => screen.getByRole("textbox", { name: "Hex" }) as HTMLInputElement;

	it("muestra el hex inicial en mayúsculas y las muestras con la activa marcada", () => {
		render(<ColorPicker defaultValue="#4f39f6" swatches={SWATCHES} />);
		expect(hexField().value).toBe("#4F39F6");
		expect(screen.getByText("Colores guardados")).toBeTruthy();
		expect(screen.getByRole("button", { name: "#4F39F6" }).getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByRole("button", { name: "#00A63E" }).getAttribute("aria-pressed")).toBe("false");
	});

	it("área y barra de tono se manejan con flechas y avisan con el hex", async () => {
		const onChange = vi.fn();
		render(<ColorPicker defaultValue="#4f39f6" onChange={onChange} />);
		const [saturation, brightness] = screen.getAllByRole("slider").slice(0, 2) as HTMLInputElement[];
		const hue = screen.getByRole("slider", { name: /tono/i }) as HTMLInputElement;
		// #4f39f6 tiene un tono de 246,6°
		expect(Math.abs(Number(hue.value) - 246.6)).toBeLessThan(0.5);

		await userEvent.tab();
		expect(document.activeElement).toBe(saturation);
		await userEvent.keyboard("{ArrowLeft}");
		const afterSat = onChange.mock.lastCall?.[0] as string;
		expect(afterSat).toMatch(/^#[0-9a-f]{6}$/);
		expect(afterSat).not.toBe("#4f39f6");
		expect(hexField().value).toBe(afterSat.toUpperCase());

		brightness?.focus();
		await userEvent.keyboard("{ArrowDown}");
		expect(onChange.mock.lastCall?.[0]).not.toBe(afterSat);

		hue.focus();
		const before = Number(hue.value);
		await userEvent.keyboard("{ArrowRight}");
		expect(Number(hue.value)).toBe(before + 1);
	});

	it("el campo hex acepta un color válido y no avisa con uno a medias", async () => {
		const onChange = vi.fn();
		render(<ColorPicker defaultValue="#4f39f6" onChange={onChange} />);
		const field = hexField();
		await userEvent.clear(field);
		await userEvent.type(field, "#00a6");
		expect(onChange).not.toHaveBeenCalled();
		expect(field.value).toBe("#00a6");
		await userEvent.type(field, "f4");
		expect(onChange).toHaveBeenLastCalledWith("#00a6f4");
		fireEvent.blur(field);
		expect(field.value).toBe("#00A6F4");
	});

	it("pulsar una muestra la elige", async () => {
		const onChange = vi.fn();
		render(<ColorPicker swatches={SWATCHES} onChange={onChange} />);
		await userEvent.click(screen.getByRole("button", { name: "#E7000B" }));
		expect(onChange).toHaveBeenLastCalledWith("#e7000b");
		expect(hexField().value).toBe("#E7000B");
		expect(screen.getByRole("button", { name: "#E7000B" }).getAttribute("aria-pressed")).toBe("true");
	});

	it("panel de 320px con el radio y la sombra de la ficha, mandos blancos de 20px", () => {
		const { container } = render(<ColorPicker />);
		const panel = container.querySelector(".w-80") as HTMLElement;
		for (const c of ["rounded-2xl", "bg-primary_alt", "p-5"]) expect(panel.className).toContain(c);
		expect(panel.className).toContain("var(--shadow-xl)");
		const thumbs = container.querySelectorAll(".size-5.rounded-full");
		expect(thumbs).toHaveLength(2);
	});

	it("se renderiza en servidor", () => {
		expect(renderToString(<ColorPicker swatches={SWATCHES} />)).toContain("#4F39F6");
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<ColorPicker swatches={SWATCHES} />);
	});
});

describe("TextEditor", () => {
	const original = { exec: document.execCommand, state: document.queryCommandState };
	afterEach(() => {
		document.execCommand = original.exec;
		document.queryCommandState = original.state;
	});
	const HTML = "<p>Revisar el <b>seguro del coche</b> antes del 15.</p>";

	it("etiqueta, área con el HTML inicial y caracteres restantes", () => {
		render(<TextEditor label="Notas" maxLength={500} defaultValue={HTML} />);
		const area = screen.getByRole("textbox", { name: "Notas" });
		expect(area.getAttribute("contenteditable")).toBe("true");
		expect(area.getAttribute("aria-multiline")).toBe("true");
		expect(area.innerHTML).toBe(HTML);
		const left = 500 - "Revisar el seguro del coche antes del 15.".length;
		expect(screen.getByText(`${left} caracteres restantes`).id).toBe(
			area.getAttribute("aria-describedby"),
		);
	});

	it("la barra aplica el formato con el modo de edición nativo y marca el activo", async () => {
		const exec = vi.fn(() => true);
		document.execCommand = exec;
		document.queryCommandState = vi.fn((c: string) => c === "bold");
		const onChange = vi.fn();
		render(<TextEditor label="Notas" defaultValue={HTML} onChange={onChange} />);
		expect(screen.getByRole("toolbar", { name: "Formato" })).toBeTruthy();
		const bold = screen.getByRole("button", { name: "Negrita" });
		expect(bold.getAttribute("aria-pressed")).toBe("false");
		await userEvent.click(bold);
		expect(exec).toHaveBeenCalledWith("bold", false, undefined);
		expect(bold.getAttribute("aria-pressed")).toBe("true");
		expect(bold.className).toContain("text-editor-icon-fg_active");
		expect(screen.getByRole("button", { name: "Cursiva" }).getAttribute("aria-pressed")).toBe("false");
		expect(onChange).toHaveBeenCalledWith(HTML);
		await userEvent.click(screen.getByRole("button", { name: "Lista" }));
		expect(exec).toHaveBeenLastCalledWith("insertUnorderedList", false, undefined);
		await userEvent.click(screen.getByRole("button", { name: "Centrar" }));
		expect(exec).toHaveBeenLastCalledWith("justifyCenter", false, undefined);
	});

	it("el enlace pide la dirección y no hace nada si se cancela", async () => {
		const exec = vi.fn(() => true);
		document.execCommand = exec;
		const prompt = vi
			.spyOn(window, "prompt")
			.mockReturnValueOnce("https://jotis.me")
			.mockReturnValueOnce(null);
		render(<TextEditor />);
		const link = screen.getByRole("button", { name: "Enlace" });
		expect(link.getAttribute("aria-pressed")).toBeNull();
		await userEvent.click(link);
		expect(prompt).toHaveBeenCalledWith("Dirección del enlace");
		expect(exec).toHaveBeenCalledWith("createLink", false, "https://jotis.me");
		await userEvent.click(link);
		expect(exec).toHaveBeenCalledTimes(1);
		prompt.mockRestore();
	});

	it("al escribir avisa con el HTML y recuenta", () => {
		const onChange = vi.fn();
		render(<TextEditor maxLength={10} onChange={onChange} placeholder="Escribe una nota" />);
		const area = screen.getByRole("textbox", { name: "Escribe una nota" });
		expect(area.getAttribute("data-placeholder")).toBe("Escribe una nota");
		expect(screen.getByText("10 caracteres restantes")).toBeTruthy();
		area.innerHTML = "<p>Hola</p>";
		fireEvent.input(area);
		expect(onChange).toHaveBeenLastCalledWith("<p>Hola</p>");
		expect(screen.getByText("6 caracteres restantes")).toBeTruthy();
		area.textContent = "Más de diez letras";
		fireEvent.input(area);
		expect(screen.getByText("0 caracteres restantes")).toBeTruthy();
	});

	it("pista sin maxLength, y deshabilitado sin edición ni botones", () => {
		render(<TextEditor label="Notas" hint="Solo tú lo ves." disabled />);
		expect(screen.getByText("Solo tú lo ves.")).toBeTruthy();
		const area = screen.getByRole("textbox", { name: "Notas" });
		expect(area.getAttribute("contenteditable")).toBe("false");
		expect(area.getAttribute("aria-disabled")).toBe("true");
		expect((screen.getByRole("button", { name: "Negrita" }) as HTMLButtonElement).disabled).toBe(true);
	});

	it("textos sustituibles", () => {
		render(<TextEditor maxLength={3} labels={{ bold: "Bold", charactersLeft: (n) => `${n} left` }} />);
		expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
		expect(screen.getByText("3 left")).toBeTruthy();
	});

	it("se renderiza en servidor con el HTML inicial", () => {
		const html = renderToString(<TextEditor label="Notas" maxLength={500} defaultValue={HTML} />);
		expect(html).toContain("<b>seguro del coche</b>");
		expect(html).toContain("459 caracteres restantes");
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<TextEditor label="Notas" maxLength={500} defaultValue={HTML} />);
		await expectAccessibleInThemes(<TextEditor />);
	});
});

describe("MessageInput", () => {
	it("Enter envía el texto recortado y vacía; Mayús+Enter salta de línea", async () => {
		const onSend = vi.fn();
		render(<MessageInput placeholder="Pregunta a Emptor…" onSend={onSend} />);
		const box = screen.getByRole("textbox", { name: "Pregunta a Emptor…" }) as HTMLTextAreaElement;
		await userEvent.type(box, "  Hola{Shift>}{Enter}{/Shift}qué tal  ");
		expect(box.value).toBe("  Hola\nqué tal  ");
		expect(onSend).not.toHaveBeenCalled();
		await userEvent.keyboard("{Enter}");
		expect(onSend).toHaveBeenCalledWith("Hola\nqué tal");
		expect(box.value).toBe("");
	});

	it("Enviar se desactiva con el campo vacío o solo espacios", async () => {
		const onSend = vi.fn();
		render(<MessageInput onSend={onSend} />);
		const send = screen.getByRole("button", { name: "Enviar" }) as HTMLButtonElement;
		expect(send.disabled).toBe(true);
		const box = screen.getByRole("textbox", { name: "Escribe un mensaje" });
		await userEvent.type(box, "   {Enter}");
		expect(onSend).not.toHaveBeenCalled();
		expect(send.disabled).toBe(true);
		await userEvent.type(box, "Vale");
		expect(send.disabled).toBe(false);
		await userEvent.click(send);
		expect(onSend).toHaveBeenCalledWith("Vale");
	});

	it("adjuntar solo aparece con onAttach; textos sustituibles", async () => {
		const onAttach = vi.fn();
		const { rerender } = render(<MessageInput />);
		expect(screen.queryByRole("button", { name: "Adjuntar archivo" })).toBeNull();
		rerender(<MessageInput onAttach={onAttach} sendLabel="Mandar" attachLabel="Adjuntar foto" />);
		await userEvent.click(screen.getByRole("button", { name: "Adjuntar foto" }));
		expect(onAttach).toHaveBeenCalledOnce();
		expect(screen.getByRole("button", { name: "Mandar" })).toBeTruthy();
	});

	it("deshabilitado: campo y botones sin uso, al 50 %", () => {
		const { container } = render(<MessageInput disabled onAttach={() => {}} />);
		expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(true);
		for (const b of screen.getAllByRole("button")) expect((b as HTMLButtonElement).disabled).toBe(true);
		expect((container.firstElementChild as HTMLElement).className).toContain("opacity-50");
	});

	it("se renderiza en servidor y sin infracciones de axe", async () => {
		expect(renderToString(<MessageInput placeholder="Pregunta a Emptor…" />)).toContain(
			"Pregunta a Emptor…",
		);
		await expectAccessibleInThemes(<MessageInput placeholder="Pregunta a Emptor…" onAttach={() => {}} />);
	});
});
