import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Input, MultiSelect, NumberInput, Select, TagInput, Textarea, Toggle } from "../src/index.js";

describe("Toggle: nombre accesible", () => {
	it("sin label, aria-label da nombre al interruptor", () => {
		render(<Toggle aria-label="Activar recordatorio" />);
		expect(screen.getByRole("switch", { name: "Activar recordatorio" })).toBeTruthy();
	});

	it("con label y aria-label, manda aria-label", () => {
		render(<Toggle label="Recordatorio" aria-label="Activar recordatorio" />);
		expect(screen.getByRole("switch", { name: "Activar recordatorio" })).toBeTruthy();
		expect(screen.queryByRole("switch", { name: "Recordatorio" })).toBeNull();
	});

	it("aria-labelledby apunta al elemento que lo nombra", () => {
		render(
			<>
				<span id="nombre">Avisos por correo</span>
				<Toggle aria-labelledby="nombre" />
			</>,
		);
		expect(screen.getByRole("switch", { name: "Avisos por correo" })).toBeTruthy();
	});
});

const aside = (onClick: () => void) => (
	<button type="button" onClick={onClick}>
		Restablecer
	</button>
);

type Make = (a: ReactElement | undefined, label?: string) => ReactElement;
const fields: Array<[string, Make]> = [
	["Input", (a, label = "Nombre") => <Input label={label} labelAside={a} />],
	["Textarea", (a, label = "Nombre") => <Textarea label={label} labelAside={a} />],
	["Select", (a, label = "Nombre") => <Select label={label} labelAside={a} options={["Uno", "Dos"]} />],
	[
		"MultiSelect",
		(a, label = "Nombre") => <MultiSelect label={label} labelAside={a} options={["Uno", "Dos"]} />,
	],
	["NumberInput", (a, label = "Nombre") => <NumberInput label={label} labelAside={a} />],
	["TagInput", (a, label = "Nombre") => <TagInput label={label} labelAside={a} />],
];

describe.each(fields)("%s: labelAside", (_name, make) => {
	it("se pinta al final de la fila de la etiqueta, fuera del label", () => {
		const { container } = render(make(aside(() => {})));
		const label = container.querySelector("label") as HTMLElement;
		const button = screen.getByRole("button", { name: "Restablecer" });
		expect(label.contains(button)).toBe(false);
		const row = label.parentElement as HTMLElement;
		expect(row.className).toContain("flex");
		expect(row.firstElementChild).toBe(label);
		expect(row.lastElementChild?.contains(button)).toBe(true);
		expect(row.lastElementChild?.className).toContain("ml-auto");
	});

	it("un clic en su botón no enfoca el campo ni abre el desplegable", async () => {
		const onClick = vi.fn();
		const { container } = render(make(aside(onClick)));
		await userEvent.click(screen.getByRole("button", { name: "Restablecer" }));
		expect(onClick).toHaveBeenCalledTimes(1);
		const controlId = (container.querySelector("label") as HTMLElement).getAttribute("for");
		const control = controlId ? document.getElementById(controlId) : null;
		if (control) expect(document.activeElement).not.toBe(control);
		expect(container.querySelector('[aria-expanded="true"]')).toBeNull();
		expect(screen.queryByRole("listbox")).toBeNull();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("sin la prop, la etiqueta no lleva fila y el HTML es el de antes", () => {
		const html = renderToStaticMarkup(make(undefined));
		expect(html).toMatch(/^<div class="flex min-w-0 flex-col gap-1\.5 font-body"><label /);
		expect(html).not.toContain("ml-auto");
	});

	it("sin label, el acompañante se pinta solo en la fila", () => {
		const { container } = render(
			make(
				aside(() => {}),
				"",
			),
		);
		expect(container.querySelector("label[for]")).toBeNull();
		const button = screen.getByRole("button", { name: "Restablecer" });
		expect(container.firstElementChild?.firstElementChild?.contains(button)).toBe(true);
		expect(container.firstElementChild?.firstElementChild?.className).toContain("flex");
	});
});

describe("Select: el botón del acompañante", () => {
	it("no abre la lista, y el campo sí la abre", async () => {
		render(<Select label="Talla" labelAside={aside(() => {})} options={["S", "M"]} />);
		await userEvent.click(screen.getByRole("button", { name: "Restablecer" }));
		expect(screen.queryByRole("listbox")).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: /Talla/ }));
		expect(screen.getByRole("listbox")).toBeTruthy();
	});
});

describe("Toggle: labelAside", () => {
	it("se pinta tras la etiqueta, a la derecha y fuera del interruptor", () => {
		const { container } = render(<Toggle label="Avisos" labelAside={aside(() => {})} />);
		const sw = screen.getByRole("switch");
		const button = screen.getByRole("button", { name: "Restablecer" });
		const label = sw.closest("label") as HTMLElement;
		expect(label.contains(button)).toBe(false);
		const row = label.parentElement as HTMLElement;
		expect(row).toBe(container.firstElementChild);
		expect(row.firstElementChild).toBe(label);
		expect(row.lastElementChild?.className).toContain("ml-auto");
		expect(row.lastElementChild?.contains(button)).toBe(true);
	});

	it("pulsar su botón no activa el interruptor ni lo enfoca", async () => {
		const onChange = vi.fn();
		const onClick = vi.fn();
		render(<Toggle label="Avisos" onChange={onChange} labelAside={aside(onClick)} />);
		await userEvent.click(screen.getByRole("button", { name: "Restablecer" }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
		expect(document.activeElement).not.toBe(screen.getByRole("switch"));
	});

	it("sin la prop, el HTML es el de antes: la etiqueta es la raíz", () => {
		const html = renderToStaticMarkup(<Toggle label="Avisos" className="x" />);
		expect(html).toMatch(/^<label [^>]*class="group relative inline-flex [^"]*x"/);
		expect(html).not.toContain("ml-auto");
	});
});
