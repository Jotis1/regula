import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ColorPickerDropdown } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("ColorPickerDropdown", () => {
	it("se abre con el teclado, Escape lo cierra y el foco vuelve al disparador", async () => {
		render(<ColorPickerDropdown defaultValue="#7F56D9" />);
		const trigger = screen.getByRole("button", { name: "Color: #7F56D9" });
		await userEvent.tab();
		await waitFor(() => expect(document.activeElement).toBe(trigger));
		await userEvent.keyboard("{Enter}");
		const dialog = await screen.findByRole("dialog", { name: "Color" });
		// El panel es el ColorPicker con sus pestañas
		expect(dialog.querySelector("[role=tablist]")).toBeTruthy();
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("la X del panel también lo cierra y devuelve el foco", async () => {
		render(<ColorPickerDropdown trigger="swatch-sm" label="Fondo" />);
		const trigger = screen.getByRole("button", { name: "Fondo: #7F56D9" });
		await userEvent.click(trigger);
		await screen.findByRole("dialog", { name: "Fondo" });
		await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("los seis disparadores: muestras, botones, campo hex con opacidad y select con etiqueta", async () => {
		const ui = (
			<>
				<ColorPickerDropdown trigger="swatch-md" />
				<ColorPickerDropdown trigger="swatch-button-link" label="Texto" />
				<ColorPickerDropdown trigger="hex-input" label="Borde" defaultAlpha={0.5} />
				<ColorPickerDropdown trigger="select" label="Marca" defaultValue="#4f46e5" />
			</>
		);
		const { container } = render(ui);
		expect(screen.getByRole("button", { name: "Color: #7F56D9" }).className).toContain("size-7");
		expect(screen.getByRole("button", { name: "Texto: #7F56D9" })).toBeTruthy();
		expect(screen.getByRole("button", { name: /^Borde:\s*7F56D9\s*50%$/ }).textContent).toContain(
			"7F56D950%",
		);
		expect(screen.getByRole("button", { name: "Marca #4F46E5" })).toBeTruthy();
		expect(container.querySelector(".w-80")).toBeTruthy();
		await expectAccessibleInThemes(ui);
	});
});
