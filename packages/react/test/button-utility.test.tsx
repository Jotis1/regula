import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Copy01, LinkExternal01, Trash01 } from "@untitledui/icons";
import { describe, expect, it, vi } from "vitest";
import { ButtonUtility } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("ButtonUtility", () => {
	it("es un botón con el nombre de `label`, icono de 20 en sm y 16 en xs", () => {
		render(
			<>
				<ButtonUtility icon={Copy01} label="Copiar" />
				<ButtonUtility icon={Trash01} label="Borrar" size="xs" hierarchy="tertiary" />
			</>,
		);
		const copy = screen.getByRole("button", { name: "Copiar" });
		expect(copy.getAttribute("type")).toBe("button");
		expect(copy.querySelector("svg")?.getAttribute("width")).toBe("20");
		expect(copy.className).toContain("inset_0_0_0_1px_var(--border-primary)");
		expect(copy.className).toContain("text-fg-quaternary");
		const trash = screen.getByRole("button", { name: "Borrar" });
		expect(trash.querySelector("svg")?.getAttribute("width")).toBe("16");
		expect(trash.className).toContain("bg-transparent");
		expect(trash.className).not.toContain("--border-primary");
	});

	it("con Tab muestra el anillo de foco y abre el tooltip con su nombre", async () => {
		render(<ButtonUtility icon={Copy01} label="Copiar" />);
		expect(screen.queryByRole("tooltip")).toBeNull();
		await userEvent.tab();
		const button = screen.getByRole("button", { name: "Copiar" });
		expect(document.activeElement).toBe(button);
		expect(button.className).toContain("focus-visible:shadow-focus-ring");
		const tip = await screen.findByRole("tooltip");
		expect(tip.textContent).toBe("Copiar");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
	});

	// El hover se prueba en el e2e de la página (apps/docs/e2e/button-utility.spec.ts): jsdom no lo dispara en React Aria

	it("tooltip={false} no abre tooltip pero mantiene el nombre", async () => {
		render(<ButtonUtility icon={Copy01} label="Copiar" tooltip={false} />);
		await userEvent.tab();
		expect(screen.getByRole("button", { name: "Copiar" })).toBe(document.activeElement);
		await new Promise((r) => setTimeout(r, 400));
		expect(screen.queryByRole("tooltip")).toBeNull();
	});

	it("disabled no responde ni abre tooltip", async () => {
		const onClick = vi.fn();
		render(<ButtonUtility icon={Copy01} label="Copiar" disabled onClick={onClick} />);
		const button = screen.getByRole("button", { name: "Copiar" }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
		expect(button.className).toContain("disabled:opacity-50");
		await userEvent.click(button);
		await userEvent.hover(button);
		await new Promise((r) => setTimeout(r, 400));
		expect(onClick).not.toHaveBeenCalled();
		expect(screen.queryByRole("tooltip")).toBeNull();
	});

	it("con href es un enlace con el mismo aspecto", () => {
		render(<ButtonUtility icon={LinkExternal01} label="Abrir" href="/docs" />);
		const link = screen.getByRole("link", { name: "Abrir" });
		expect(link.getAttribute("href")).toBe("/docs");
		expect(link.className).toContain("rounded-sm");
	});

	it("axe en claro y oscuro, con el tooltip abierto", async () => {
		await expectAccessibleInThemes(
			<div className="flex gap-2 p-12">
				<ButtonUtility icon={Copy01} label="Copiar" tooltipOpen />
				<ButtonUtility icon={Trash01} label="Borrar" hierarchy="tertiary" size="xs" />
			</div>,
		);
	});
});
