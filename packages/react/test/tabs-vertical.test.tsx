import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const ITEMS = [
	{ id: "datos", label: "Mis datos" },
	{ id: "perfil", label: "Perfil" },
	{ id: "avisos", label: "Avisos", count: 2 },
];
const panel = (id: string) => <p>Panel de {id}</p>;

describe("Tabs verticales", () => {
	it("la lista es vertical y ↓ pasa a la siguiente pestaña", async () => {
		render(
			<Tabs aria-label="Ajustes" items={ITEMS} orientation="vertical" type="line">
				{panel}
			</Tabs>,
		);
		const list = screen.getByRole("tablist", { name: "Ajustes" });
		expect(list.getAttribute("aria-orientation")).toBe("vertical");
		const [first, second] = screen.getAllByRole("tab");
		(first as HTMLElement).focus();
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(second);
		expect(second?.getAttribute("aria-selected")).toBe("true");
		expect(screen.getByRole("tabpanel").textContent).toBe("Panel de perfil");
		await userEvent.keyboard("{ArrowUp}");
		expect(first?.getAttribute("aria-selected")).toBe("true");
	});

	it("la horizontal sigue con aria-orientation horizontal y ← →", async () => {
		render(<Tabs aria-label="Ajustes" items={ITEMS} />);
		expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("horizontal");
		(screen.getAllByRole("tab")[0] as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(screen.getAllByRole("tab")[1]?.getAttribute("aria-selected")).toBe("true");
	});

	it("line: la actual lleva una raya de 2px a la izquierda en fg-brand-primary", () => {
		render(<Tabs aria-label="Ajustes" items={ITEMS} orientation="vertical" type="line" />);
		const [first, second] = screen.getAllByRole("tab");
		expect(first?.className).toContain(
			"data-selected:shadow-[inset_2px_0_0_var(--fg-brand-primary_alt)]",
		);
		expect(first?.className).toContain("data-selected:text-brand-secondary");
		expect(second?.getAttribute("aria-selected")).toBe("false");
	});

	it("line en horizontal se pinta como underline, y underline en vertical como line", () => {
		const horizontal = render(<Tabs aria-label="a" items={ITEMS} type="line" />);
		const underline = render(<Tabs aria-label="a" items={ITEMS} type="underline" />);
		expect(horizontal.container.innerHTML.replace(/react-aria-_r[^"]*/g, "")).toBe(
			underline.container.innerHTML.replace(/react-aria-_r[^"]*/g, ""),
		);
		const { container } = render(
			<Tabs aria-label="b" items={ITEMS} orientation="vertical" type="underline" />,
		);
		expect(container.querySelector("[role=tab]")?.className).toContain("inset_2px_0_0");
	});

	it("button-minimal: segmentado sin borde, la actual sobre bg-primary, en los dos sentidos", () => {
		for (const orientation of ["horizontal", "vertical"] as const) {
			const { container, unmount } = render(
				<Tabs aria-label="m" items={ITEMS} type="button-minimal" orientation={orientation} />,
			);
			expect(container.querySelector("[role=tablist]")?.className).toContain("bg-secondary_alt");
			expect(container.querySelector("[role=tablist]")?.className).not.toContain("inset_0_0_0_1px");
			expect(container.querySelector("[role=tab]")?.className).toContain("data-selected:bg-primary");
			unmount();
		}
	});

	it("en vertical la lista se oculta por debajo de lg y un desplegable con las mismas opciones ocupa su lugar", () => {
		const { container } = render(
			<Tabs aria-label="Ajustes" items={ITEMS} orientation="vertical" type="line" />,
		);
		expect(container.querySelector("[role=tablist]")?.className).toContain("max-lg:hidden");
		const select = container.querySelector("button[aria-haspopup=listbox]") as HTMLElement;
		expect(select).not.toBeNull();
		expect(select.closest(".lg\\:hidden")).not.toBeNull();
		expect(select.textContent).toContain("Mis datos");
	});

	it("el desplegable cambia el panel y la pestaña, y avisa con onChange", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<Tabs aria-label="Ajustes" items={ITEMS} orientation="vertical" type="line" onChange={onChange}>
				{panel}
			</Tabs>,
		);
		await userEvent.click(container.querySelector("button[aria-haspopup=listbox]") as HTMLElement);
		const options = within(screen.getByRole("listbox")).getAllByRole("option");
		expect(options.map((o) => o.textContent)).toEqual(["Mis datos", "Perfil", "Avisos2"]);
		await userEvent.click(options[1] as HTMLElement);
		expect(onChange).toHaveBeenCalledExactlyOnceWith("perfil");
		expect(screen.getByRole("tabpanel").textContent).toBe("Panel de perfil");
		expect(
			screen
				.getAllByRole("tab", { hidden: true })
				.find((t) => t.getAttribute("aria-selected") === "true")?.textContent,
		).toBe("Perfil");
	});

	it("sin las props nuevas, el HTML es el de siempre y no lleva desplegable", () => {
		const bare = renderToString(<Tabs aria-label="Ajustes" items={ITEMS} />);
		const explicit = renderToString(<Tabs aria-label="Ajustes" items={ITEMS} orientation="horizontal" />);
		expect(explicit).toBe(bare);
		expect(bare).not.toContain("aria-haspopup");
		expect(bare).toContain('aria-orientation="horizontal"');
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Tabs aria-label="Ajustes" items={ITEMS} orientation="vertical" type="line">
				{panel}
			</Tabs>,
		);
	});
});
