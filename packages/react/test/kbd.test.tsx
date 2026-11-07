import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dropdown, Kbd } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Kbd", () => {
	it("las dos variantes son un kbd, cada una con su aspecto", () => {
		render(
			<>
				<Kbd>⌘K</Kbd>
				<Kbd variant="field">Ctrl K</Kbd>
			</>,
		);
		const menu = screen.getByText("⌘K");
		const field = screen.getByText("Ctrl K");
		expect(menu.tagName).toBe("KBD");
		expect(field.tagName).toBe("KBD");
		// `menu`, por defecto: texto de 12px de la fuente del cuerpo con filo, sin fondo
		for (const c of ["font-body", "text-xs", "text-quaternary", "rounded-sm"])
			expect(menu.className).toContain(c);
		expect(menu.className).not.toContain("bg-secondary");
		expect(menu.className).not.toContain("h-[22px]");
		// `field`: 22px de alto, fondo `bg-secondary` y Geist Mono
		for (const c of ["h-[22px]", "bg-secondary", "font-mono", "text-xs", "rounded-sm"])
			expect(field.className).toContain(c);
		expect(field.className).not.toContain("font-body");
	});

	it("el className del consumidor manda: `hidden lg:inline-flex` quita el inline-flex de base", () => {
		render(
			<Kbd variant="field" className="hidden lg:inline-flex">
				Ctrl K
			</Kbd>,
		);
		const classes = screen.getByText("Ctrl K").className.split(" ");
		expect(classes).toContain("hidden");
		expect(classes).toContain("lg:inline-flex");
		expect(classes).not.toContain("inline-flex");
	});

	it("los atajos de un Dropdown son Kbd de la variante menu", async () => {
		render(
			<Dropdown
				label="Acciones"
				items={[{ label: "Ver perfil", shortcut: "⌘P", onSelect: () => {} }]}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Acciones" }));
		const kbd = screen.getByText("⌘P");
		expect(kbd.tagName).toBe("KBD");
		expect(kbd.className).toContain("font-body");
		expect(kbd.className).toContain("ml-auto");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<p>
				Busca con <Kbd variant="field">Ctrl K</Kbd> o salta con <Kbd>⌘K</Kbd>.
			</p>,
		);
	});
});
