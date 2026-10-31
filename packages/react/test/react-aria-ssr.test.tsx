import { act } from "react";
import { Dialog, Heading, Input, Label, Text, TextField } from "react-aria-components";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

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
		await act(async () => {
			hydrateRoot(container, <Demo />, { onRecoverableError: (e) => recoverable.push(e) });
		});

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
		container.remove();
	});
});
