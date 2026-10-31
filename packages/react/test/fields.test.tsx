import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Input, Select, Textarea } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const controlOf = (el: HTMLElement) => el.parentElement as HTMLElement;
/** Texto de los elementos a los que apunta `aria-describedby`. */
const description = (el: HTMLElement) =>
	(el.getAttribute("aria-describedby") ?? "")
		.split(" ")
		.map((id) => document.getElementById(id)?.textContent ?? "")
		.join(" ");

describe("Input", () => {
	it("enlaza la etiqueta visible con el campo y muestra la pista", () => {
		render(<Input label="Correo" hint="Solo lo usamos para avisos." placeholder="tu@jotis.me" />);
		const input = screen.getByLabelText("Correo");
		expect(input.tagName).toBe("INPUT");
		expect(description(input)).toBe("Solo lo usamos para avisos.");
		expect(input.hasAttribute("aria-invalid")).toBe(false);
		expect(input.getAttribute("placeholder")).toBe("tu@jotis.me");
	});

	it("con error: texto bajo el campo, aria-invalid enlazado al mensaje, borde e icono de error", () => {
		render(<Input label="Correo" hint="Pista" error="Introduce un correo válido." />);
		const input = screen.getByLabelText("Correo");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(description(input)).toBe("Introduce un correo válido.");
		expect(screen.queryByText("Pista")).toBeNull();
		expect(screen.getByText("Introduce un correo válido.").className).toContain("text-error-primary");
		const control = controlOf(input);
		expect(control.className).toContain("var(--border-error_subtle)");
		expect(control.className).toContain(
			"focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]",
		);
		expect(control.className).toContain("var(--focus-ring-error-shadow)");
		expect(control.querySelector(".text-fg-error-secondary svg")).not.toBeNull();
	});

	it("error = true marca el campo sin mensaje", () => {
		render(<Input label="Correo" error />);
		const input = screen.getByLabelText("Correo");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.hasAttribute("aria-describedby")).toBe(false);
	});

	it("en foco usa el borde de 2px border-brand y, con teclado, el anillo de foco", async () => {
		render(<Input label="Nombre" />);
		await userEvent.tab();
		const input = screen.getByLabelText("Nombre");
		expect(document.activeElement).toBe(input);
		const control = controlOf(input).className;
		expect(control).toContain(
			"focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]",
		);
		expect(control).toContain(
			"has-[:focus-visible]:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)]",
		);
	});

	it("asterisco de obligatorio oculto a lectores, en marca y en rojo con error", () => {
		const { rerender } = render(<Input label="Correo" required />);
		const star = screen.getByText("*");
		expect(star.getAttribute("aria-hidden")).toBe("true");
		expect(star.className).toContain("text-brand-tertiary");
		expect((screen.getByRole("textbox", { name: "Correo" }) as HTMLInputElement).required).toBe(true);
		rerender(<Input label="Correo" required error="Falta" />);
		expect(screen.getByText("*").className).toContain("text-error-primary");
	});

	it.each([
		["sm", "", "text-sm"],
		["md", "min-h-10", "text-md"],
		["lg", "min-h-11", "text-md"],
	] as const)("tamaño %s", (size, height, text) => {
		render(<Input label="Campo" size={size} />);
		const input = screen.getByLabelText("Campo");
		if (height) expect(controlOf(input).className).toContain(height);
		expect(input.className).toContain(text);
	});

	it("iconos inicial (20px) y final (16px)", () => {
		render(<Input label="Importe" icon="search-lg" trailing="currency-euro" />);
		const svgs = controlOf(screen.getByLabelText("Importe")).querySelectorAll("svg");
		expect(svgs).toHaveLength(2);
		expect(svgs[0]?.getAttribute("width")).toBe("20");
		expect(svgs[1]?.getAttribute("width")).toBe("16");
	});

	it("deshabilitado: 50 % en el control y sin foco", async () => {
		render(<Input label="Usuario" disabled defaultValue="jotis" />);
		const input = screen.getByLabelText("Usuario");
		expect((input as HTMLInputElement).disabled).toBe(true);
		expect(controlOf(input).className).toContain("opacity-50");
		await userEvent.tab();
		expect(document.activeElement).not.toBe(input);
	});

	it("pasa los atributos de <input> y escribe", async () => {
		const onChange = vi.fn();
		render(<Input label="Correo" type="email" name="email" onChange={onChange} />);
		const input = screen.getByLabelText("Correo");
		expect(input.getAttribute("type")).toBe("email");
		await userEvent.type(input, "a@b");
		expect(onChange).toHaveBeenCalledTimes(3);
	});

	it("se renderiza en servidor con ids estables", () => {
		const html = renderToStaticMarkup(<Input label="Correo" hint="Pista" />);
		const id = html.match(/for="([^"]+)"/)?.[1];
		expect(id).toBeTruthy();
		expect(html).toContain(`aria-describedby="${id}-hint"`);
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Input label="Correo" required icon="mail-01" hint="Pista" />
				<Input label="Error" error="Introduce un correo válido." />
				<Input label="Usuario" disabled defaultValue="jotis" />
			</div>,
		);
	});
});

describe("Textarea", () => {
	it("4 filas por defecto, alto mínimo 104px y redimensionable en vertical", () => {
		render(<Textarea label="Descripción" hint="Máximo 280 caracteres." />);
		const ta = screen.getByLabelText("Descripción");
		expect(ta.tagName).toBe("TEXTAREA");
		expect(ta.getAttribute("rows")).toBe("4");
		expect(ta.className).toContain("min-h-[104px]");
		expect(ta.className).toContain("resize-y");
		expect(description(ta)).toBe("Máximo 280 caracteres.");
	});

	it("error con aria-invalid y foco con teclado", async () => {
		render(<Textarea label="Nota" error="Demasiado larga." rows={6} />);
		const ta = screen.getByLabelText("Nota");
		expect(ta.getAttribute("rows")).toBe("6");
		expect(ta.getAttribute("aria-invalid")).toBe("true");
		expect(description(ta)).toBe("Demasiado larga.");
		await userEvent.tab();
		expect(document.activeElement).toBe(ta);
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Textarea label="Descripción" hint="Pista" />);
	});
});

describe("Select", () => {
	it("nativo, con placeholder no seleccionable y opciones en texto u objeto", () => {
		render(
			<Select
				label="Categoría"
				placeholder="Elige una"
				options={["Hogar", { value: "ocio", label: "Ocio" }]}
			/>,
		);
		const select = screen.getByLabelText("Categoría") as HTMLSelectElement;
		expect(select.tagName).toBe("SELECT");
		expect(select.value).toBe("");
		const opts = screen.getAllByRole("option") as HTMLOptionElement[];
		expect(opts.map((o) => o.textContent)).toEqual(["Elige una", "Hogar", "Ocio"]);
		expect(opts[0]?.disabled).toBe(true);
		expect(opts[2]?.value).toBe("ocio");
	});

	it("controlado con value/onChange y teclado", async () => {
		const onChange = vi.fn();
		render(<Select label="Categoría" options={["Hogar", "Ocio"]} value="Hogar" onChange={onChange} />);
		const select = screen.getByLabelText("Categoría");
		await userEvent.tab();
		expect(document.activeElement).toBe(select);
		await userEvent.selectOptions(select, "Ocio");
		expect(onChange).toHaveBeenCalledOnce();
	});

	it("error con aria-invalid, pista enlazada, chevron e icono", () => {
		render(
			<Select label="Categoría" icon="search-lg" options={["Hogar"]} error="Elige una categoría." />,
		);
		const select = screen.getByLabelText("Categoría");
		expect(select.getAttribute("aria-invalid")).toBe("true");
		expect(description(select)).toBe("Elige una categoría.");
		expect(controlOf(select).querySelectorAll("svg")).toHaveLength(2);
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Select label="Categoría" placeholder="Elige una" options={["Hogar", "Ocio"]} hint="Pista" />,
		);
	});
});
