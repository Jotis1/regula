import { act } from "react";
import { Dialog, Heading, Input, Label, Text, TextField } from "react-aria-components";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	Input as JInput,
	MultiSelect,
	NumberInput,
	Select,
	TagInput,
	VerificationCodeInput,
} from "../src/index.js";
import { danglingAriaRefs } from "./helpers.js";

// Dialog en línea (sin Modal) y un campo con etiqueta y descripción: las dos cosas que más dependen
// de ids estables entre servidor y cliente (aria-labelledby, aria-describedby).
function Demo() {
	return (
		<>
			<Dialog>
				<Heading slot="title">¿Eliminar este gasto?</Heading>
				<p>Se borrará también de los informes.</p>
			</Dialog>
			<TextField>
				<Label>Correo</Label>
				<Input />
				<Text slot="description">Solo lo usamos para avisos.</Text>
			</TextField>
		</>
	);
}

/** Los campos de formulario de la fase 1, en sus variantes con más piezas de React Aria. */
const Fields = () => (
	<form>
		<JInput label="Web" prefix="https://" hint="Sin barra final." />
		<JInput label="Teléfono" leadingSelect={{ label: "Prefijo", options: ["+34", "+351"] }} />
		<JInput label="Contraseña" type="password" />
		<NumberInput label="Invitados" defaultValue={2} hint="Hasta 12." />
		<NumberInput label="Horas" orientation="vertical" error="Como mucho, 8." />
		<TagInput label="Etiquetas" defaultValue={["diseño"]} />
		<VerificationCodeInput label="Código" defaultValue="48" hint="Por correo." />
		<MultiSelect label="Equipos" options={["Diseño", "Producto"]} defaultValue={["Diseño"]} />
		<MultiSelect label="Abierto" options={["Diseño", "Producto"]} defaultOpen />
		<Select
			label="Categoría"
			options={["Hogar", { value: "ocio", label: "Ocio", supporting: "@ocio" }]}
			defaultValue="ocio"
		/>
		<Select label="Sin elegir" placeholder="Elige" options={["Hogar", "Ocio"]} />
	</form>
);

describe("react-aria-components en SSR", () => {
	afterEach(() => vi.restoreAllMocks());

	it("renderiza en servidor e hidrata sin avisos ni ids distintos", async () => {
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		const warns = vi.spyOn(console, "warn").mockImplementation(() => {});

		const html = renderToString(<Demo />);
		expect(html).toContain('role="dialog"');
		expect(html).toContain("¿Eliminar este gasto?");

		const container = document.createElement("div");
		container.innerHTML = html;
		document.body.append(container);
		const serverIds = [...container.querySelectorAll("[id]")].map((e) => e.id);
		const recoverable: unknown[] = [];
		const root = await act(async () =>
			hydrateRoot(container, <Demo />, { onRecoverableError: (e) => recoverable.push(e) }),
		);

		expect(recoverable).toEqual([]);
		expect(errors).not.toHaveBeenCalled();
		expect(warns).not.toHaveBeenCalled();
		expect([...container.querySelectorAll("[id]")].map((e) => e.id)).toEqual(serverIds);

		const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
		const title = document.getElementById(dialog.getAttribute("aria-labelledby") ?? "");
		expect(title?.textContent).toBe("¿Eliminar este gasto?");
		const input = container.querySelector("input") as HTMLInputElement;
		expect(document.getElementById(input.getAttribute("aria-describedby") ?? "")?.textContent).toBe(
			"Solo lo usamos para avisos.",
		);
		// Se desmonta: Dialog deja un temporizador de 500 ms que, si sobrevive al fichero, salta ya sin `document`
		await act(async () => root.unmount());
		container.remove();
	});

	it("los campos de formulario de la fase 1 hidratan sin avisos, con los mismos ids y sin referencias rotas", async () => {
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		const warns = vi.spyOn(console, "warn").mockImplementation(() => {});
		const html = renderToString(<Fields />);
		const container = document.createElement("div");
		container.innerHTML = html;
		document.body.append(container);
		expect(danglingAriaRefs(container)).toEqual([]);
		const serverIds = [...container.querySelectorAll("[id]")].map((e) => e.id);
		const recoverable: unknown[] = [];
		const root = await act(async () =>
			hydrateRoot(container, <Fields />, { onRecoverableError: (e) => recoverable.push(e) }),
		);
		expect(recoverable).toEqual([]);
		expect(errors).not.toHaveBeenCalled();
		expect(warns).not.toHaveBeenCalled();
		expect([...container.querySelectorAll("[id]")].map((e) => e.id)).toEqual(serverIds);
		expect(danglingAriaRefs(container)).toEqual([]);
		// Se desmonta, como arriba
		await act(async () => root.unmount());
		container.remove();
	});
});
