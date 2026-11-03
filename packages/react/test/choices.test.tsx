import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, Radio, RadioGroup, Toggle } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const boxOf = (input: HTMLElement) => input.nextElementSibling as HTMLElement;

describe("Checkbox", () => {
	it("se marca y desmarca con espacio y con clic en la etiqueta, y avisa con el evento", async () => {
		const onChange = vi.fn();
		render(<Checkbox label="Recordarme" hint="Mantener la sesión 30 días." onChange={onChange} />);
		const cb = screen.getByRole("checkbox", { name: /Recordarme/ }) as HTMLInputElement;
		await userEvent.tab();
		expect(document.activeElement).toBe(cb);
		await userEvent.keyboard(" ");
		expect(cb.checked).toBe(true);
		expect(onChange.mock.calls[0]?.[0].target).toBe(cb);
		await userEvent.click(screen.getByText("Recordarme"));
		expect(cb.checked).toBe(false);
	});

	it("caja de 16px marcada en bg-brand-solid con check de 1,67px; foco con el anillo", () => {
		render(<Checkbox label="Recordarme" defaultChecked />);
		const cb = screen.getByRole("checkbox");
		const box = boxOf(cb);
		expect(box.getAttribute("aria-hidden")).toBe("true");
		for (const c of [
			"size-4",
			"rounded-sm",
			"mt-0.5",
			"peer-checked:bg-brand-solid",
			"peer-focus-visible:shadow-focus-ring",
		])
			expect(box.className).toContain(c);
		const svg = box.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("12");
		expect(svg?.getAttribute("stroke-width")).toBe("1.67");
	});

	it("indeterminate: el HTML de servidor no anuncia mixed (la casilla nativa aún no lo está) y se quita al cambiar", () => {
		const html = renderToString(<Checkbox label="Selección parcial" indeterminate />);
		expect(html).not.toContain("aria-checked");
		const { rerender } = render(<Checkbox label="Selección parcial" indeterminate />);
		const cb = screen.getByRole("checkbox") as HTMLInputElement;
		expect(cb.getAttribute("aria-checked")).toBe("mixed");
		rerender(<Checkbox label="Selección parcial" />);
		expect(cb.hasAttribute("aria-checked")).toBe(false);
		expect(cb.indeterminate).toBe(false);
	});

	it("indeterminate: guion, aria-checked=mixed y propiedad del DOM", () => {
		render(<Checkbox label="Selección parcial" indeterminate size="md" />);
		const cb = screen.getByRole("checkbox") as HTMLInputElement;
		expect(cb.getAttribute("aria-checked")).toBe("mixed");
		expect(cb.indeterminate).toBe(true);
		const box = boxOf(cb);
		expect(box.className).toContain("bg-brand-solid");
		expect(box.className).toContain("size-5");
		expect(box.querySelector("svg")?.getAttribute("width")).toBe("14");
	});

	it("controlado", async () => {
		const onChange = vi.fn();
		render(<Checkbox label="A" checked={false} onChange={onChange} />);
		const cb = screen.getByRole("checkbox") as HTMLInputElement;
		await userEvent.click(cb);
		expect(onChange).toHaveBeenCalledOnce();
		expect(cb.checked).toBe(false);
	});

	it("deshabilitado: 50 %, sin foco ni cambio", async () => {
		render(<Checkbox label="Deshabilitado" disabled />);
		const cb = screen.getByRole("checkbox") as HTMLInputElement;
		expect(boxOf(cb).className).toContain("peer-disabled:opacity-50");
		await userEvent.tab();
		expect(document.activeElement).not.toBe(cb);
		await userEvent.click(screen.getByText("Deshabilitado"));
		expect(cb.checked).toBe(false);
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Checkbox label="Recordarme" hint="Pista" defaultChecked />
				<Checkbox label="Parcial" indeterminate />
				<Checkbox label="Deshabilitado" disabled />
			</div>,
		);
	});
});

describe("Radio", () => {
	it("nativo: las flechas mueven la selección entre radios con el mismo name", async () => {
		render(
			<div>
				<Radio name="r" value="a" label="Uno" />
				<Radio name="r" value="b" label="Dos" size="md" />
			</div>,
		);
		const [a, b] = screen.getAllByRole("radio") as HTMLInputElement[];
		await userEvent.click(a as HTMLInputElement);
		expect(a?.checked).toBe(true);
		await userEvent.keyboard("{ArrowDown}");
		expect(b?.checked).toBe(true);
		expect(document.activeElement).toBe(b);
		expect(boxOf(b as HTMLInputElement).className).toContain("size-5");
		expect(boxOf(b as HTMLInputElement).className).toContain("rounded-full");
	});

	it("es componente de servidor: se renderiza sin estado", () => {
		expect(renderToString(<Radio name="r" label="Uno" checked readOnly />)).toContain('type="radio"');
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Radio name="r" label="Seleccionado" checked readOnly />
				<Radio name="r" label="Sin seleccionar" size="md" />
			</div>,
		);
	});
});

describe("RadioGroup", () => {
	const options = [
		{ value: "d", label: "Diario" },
		{ value: "m", label: "Mensual", hint: "Resumen el día 1." },
		{ value: "n", label: "Nunca" },
	];

	it("radiogroup con nombre; Tab entra en la opción elegida y las flechas cambian el valor", async () => {
		const onChange = vi.fn();
		render(<RadioGroup aria-label="Frecuencia" defaultValue="m" options={options} onChange={onChange} />);
		expect(screen.getByRole("radiogroup", { name: "Frecuencia" })).toBeTruthy();
		await userEvent.tab();
		const mensual = screen.getByRole("radio", { name: /Mensual/ }) as HTMLInputElement;
		expect(document.activeElement).toBe(mensual);
		expect(mensual.checked).toBe(true);
		await userEvent.keyboard("{ArrowDown}");
		expect(onChange).toHaveBeenLastCalledWith("n");
		expect((screen.getByRole("radio", { name: "Nunca" }) as HTMLInputElement).checked).toBe(true);
		await userEvent.keyboard("{ArrowUp}");
		expect(onChange).toHaveBeenLastCalledWith("m");
	});

	it("controlado: el valor no cambia sin que lo cambie el padre", async () => {
		const onChange = vi.fn();
		render(<RadioGroup aria-label="F" value="d" options={options} onChange={onChange} />);
		await userEvent.click(screen.getByText("Nunca"));
		expect(onChange).toHaveBeenCalledWith("n");
		expect((screen.getByRole("radio", { name: "Diario" }) as HTMLInputElement).checked).toBe(true);
	});

	it("se renderiza en servidor sin errores", () => {
		const html = renderToString(<RadioGroup aria-label="F" defaultValue="m" options={options} />);
		expect(html).toContain('role="radiogroup"');
		expect(html).toContain("Resumen el día 1.");
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<RadioGroup aria-label="Frecuencia" defaultValue="m" options={options} />,
		);
	});
});

describe("Toggle", () => {
	it('role="switch", espacio lo cambia y onChange recibe el booleano', async () => {
		const onChange = vi.fn();
		render(<Toggle label="Notificaciones" hint="Recibe un aviso." onChange={onChange} />);
		const sw = screen.getByRole("switch", { name: /Notificaciones/ }) as HTMLInputElement;
		await userEvent.tab();
		expect(document.activeElement).toBe(sw);
		await userEvent.keyboard(" ");
		expect(onChange).toHaveBeenLastCalledWith(true);
		expect(sw.checked).toBe(true);
	});

	it("pista bg-tertiary / bg-brand-solid, mando blanco con shadow-sm, tamaños 36×20 y 44×24", () => {
		render(
			<div>
				<Toggle label="sm" defaultChecked />
				<Toggle label="md" size="md" />
			</div>,
		);
		const [sm, md] = screen.getAllByRole("switch").map((s) => s.closest("label") as HTMLElement);
		const track = (l: HTMLElement | undefined) => l?.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(sm?.getAttribute("data-selected")).toBe("true");
		for (const c of ["h-5", "w-9", "bg-tertiary", "group-data-selected:bg-brand-solid"])
			expect(track(sm).className).toContain(c);
		expect(track(md).className).toContain("w-11");
		const knob = track(sm).firstElementChild as HTMLElement;
		for (const c of ["bg-fg-white", "shadow-sm", "group-data-selected:translate-x-4"])
			expect(knob.className).toContain(c);
	});

	it("controlado y deshabilitado", async () => {
		const onChange = vi.fn();
		const { rerender } = render(<Toggle label="A" checked={false} onChange={onChange} />);
		const sw = screen.getByRole("switch") as HTMLInputElement;
		await userEvent.click(sw);
		expect(onChange).toHaveBeenCalledWith(true);
		expect(sw.checked).toBe(false);
		rerender(<Toggle label="A" disabled onChange={onChange} />);
		expect(sw.disabled).toBe(true);
	});

	it("se renderiza en servidor sin errores", () => {
		expect(renderToString(<Toggle label="A" defaultChecked />)).toContain('role="switch"');
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Toggle label="Notificaciones" hint="Pista" defaultChecked />
				<Toggle label="Deshabilitado" disabled />
			</div>,
		);
	});
});
