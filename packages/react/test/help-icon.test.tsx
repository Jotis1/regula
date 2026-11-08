import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HelpIcon } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("HelpIcon", () => {
	it("es un botón con nombre «Ayuda: <título>» y un icono de 16px", () => {
		render(<HelpIcon title="Qué es esto" />);
		const button = screen.getByRole("button", { name: "Ayuda: Qué es esto" });
		expect(button.getAttribute("type")).toBe("button");
		expect(button.className).toContain("text-fg-quaternary");
		const svg = button.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("16");
	});

	it("abre el tooltip al enfocarlo, con el título y el texto de apoyo, y Escape lo cierra", async () => {
		render(<HelpIcon title="Qué es esto" text="Se calcula cada noche." />);
		expect(screen.queryByRole("tooltip")).toBeNull();
		await userEvent.tab();
		const tip = await screen.findByRole("tooltip");
		expect(tip.textContent).toContain("Qué es esto");
		expect(tip.textContent).toContain("Se calcula cada noche.");
		expect(screen.getByRole("button").getAttribute("aria-describedby")).toBe(tip.id);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
	});

	it("pasa `placement` al tooltip: a la derecha, con la flecha en su borde izquierdo", async () => {
		render(<HelpIcon title="Qué es esto" placement="right" arrow="start" />);
		await userEvent.tab();
		const tip = await screen.findByRole("tooltip");
		expect(tip.className).toContain("after:right-full");
	});

	it("`label` da nombre al botón cuando el título no es texto; `open` lo deja visible", () => {
		render(<HelpIcon title={<b>Qué</b>} label="Más información" open placement="bottom" />);
		expect(screen.getByRole("button", { name: "Más información" })).toBeTruthy();
		expect(screen.getByRole("tooltip").className).toContain("top-[calc(100%+10px)]");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<HelpIcon title="Qué es esto" text="Apoyo" open />);
	});
});
