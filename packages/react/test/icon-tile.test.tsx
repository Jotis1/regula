import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Mail01 } from "@untitledui/icons";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { IconTile } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("IconTile", () => {
	it("es un botón que llama a onSelect al pulsarlo", async () => {
		const onSelect = vi.fn();
		render(<IconTile icon={Mail01} label="Mail01" onSelect={onSelect} />);
		const button = screen.getByRole("button", { name: "Mail01" });
		expect(button.getAttribute("type")).toBe("button");
		expect(button.getAttribute("aria-pressed")).toBe("false");
		await userEvent.click(button);
		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it("elegida: aria-pressed true y filo de 2px de border-brand", () => {
		render(<IconTile icon={Mail01} label="Mail01" selected onSelect={() => {}} />);
		const button = screen.getByRole("button", { name: "Mail01" });
		expect(button.getAttribute("aria-pressed")).toBe("true");
		expect(button.className).toContain("inset_0_0_0_2px_var(--border-brand)");
		expect(button.className).not.toContain("inset_0_0_0_1px_var(--border-secondary)]");
	});

	it("sin elegir lleva el filo de 1px border-secondary", () => {
		render(<IconTile icon={Mail01} label="Mail01" onSelect={() => {}} />);
		expect(screen.getByRole("button").className).toContain("inset_0_0_0_1px_var(--border-secondary)");
	});

	it("con href es un enlace, sin aria-pressed, y elegida lo anuncia con aria-current", () => {
		render(
			<>
				<IconTile icon={Mail01} label="Mail01" href="/iconos/mail-01/" />
				<IconTile icon={Mail01} label="Mail02" href="/iconos/mail-02/" selected />
			</>,
		);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(2);
		expect(screen.queryByRole("button")).toBeNull();
		expect(links[0]?.getAttribute("href")).toBe("/iconos/mail-01/");
		expect(links[0]?.hasAttribute("aria-pressed")).toBe(false);
		expect(links[0]?.hasAttribute("aria-current")).toBe(false);
		expect(links[1]?.getAttribute("aria-current")).toBe("true");
	});

	it("el nombre completo es el nombre accesible y el title aunque se recorte", () => {
		const label = "AlignHorizontalCentre02WithAVeryLongName";
		render(<IconTile icon={Mail01} label={label} onSelect={() => {}} />);
		const button = screen.getByRole("button", { name: label });
		expect(button.getAttribute("title")).toBe(label);
		const text = screen.getByText(label);
		expect(text.className).toContain("truncate");
		expect(text.className).toContain("text-xs");
	});

	it("la baldosa mide al menos 84px de alto", () => {
		render(<IconTile icon={Mail01} label="Mail01" onSelect={() => {}} />);
		expect(screen.getByRole("button").className).toContain("min-h-[84px]");
	});

	it("tres tamaños de vista previa: 16, 20 y 24 (24 por defecto)", () => {
		const { container } = render(
			<>
				<IconTile icon={Mail01} label="a" size={16} onSelect={() => {}} />
				<IconTile icon={Mail01} label="b" size={20} onSelect={() => {}} />
				<IconTile icon={Mail01} label="c" onSelect={() => {}} />
			</>,
		);
		const sizes = [...container.querySelectorAll("svg")].map((s) => s.getAttribute("width"));
		expect(sizes).toEqual(["16", "20", "24"]);
		for (const svg of container.querySelectorAll("svg"))
			expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("acepta un nodo ya pintado como icono", () => {
		render(<IconTile icon={<svg data-testid="propio" />} label="Propio" onSelect={() => {}} />);
		expect(screen.getByTestId("propio")).toBeTruthy();
	});

	it("se pinta en el servidor", () => {
		const html = renderToString(<IconTile icon={Mail01} label="Mail01" selected onSelect={() => {}} />);
		expect(html).toContain('aria-pressed="true"');
		expect(html).toContain("Mail01");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<IconTile icon={Mail01} label="Mail01" onSelect={() => {}} />
				<IconTile icon={Mail01} label="Mail02" selected onSelect={() => {}} />
				<IconTile icon={Mail01} label="Mail03" href="/mail-03/" />
			</div>,
		);
	});
});
