import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, Disclosure } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Disclosure", () => {
	it("es un details con su summary, cerrado por defecto", () => {
		const { container } = render(<Disclosure title="Iconos">Contenido</Disclosure>);
		const details = container.querySelector("details");
		expect(details).not.toBeNull();
		expect(details?.open).toBe(false);
		const summary = container.querySelector("details > summary");
		expect(summary?.textContent).toContain("Iconos");
	});

	it("con defaultOpen se pinta abierto, también en el servidor (sin JavaScript)", () => {
		const html = renderToStaticMarkup(
			<Disclosure title="Iconos" aside="3 props" defaultOpen>
				Contenido
			</Disclosure>,
		);
		expect(html).toMatch(/<details[^>]* open=""/);
		expect(html).toContain("3 props");
	});

	it("el acompañante va dentro del summary, después del título", () => {
		const { container } = render(
			<Disclosure title="Iconos" aside={<Badge>3 props</Badge>} defaultOpen>
				Contenido
			</Disclosure>,
		);
		const summary = container.querySelector("summary") as HTMLElement;
		const text = summary.textContent ?? "";
		expect(text.indexOf("Iconos")).toBeLessThan(text.indexOf("3 props"));
		expect(summary.querySelector("span.ml-auto")?.textContent).toBe("3 props");
	});

	it("sin aside no pinta el hueco", () => {
		const { container } = render(<Disclosure title="Iconos">x</Disclosure>);
		expect(container.querySelector("summary .ml-auto")).toBeNull();
	});

	it("sm mide 40px de cabecera y md, 48px (por defecto)", () => {
		const { container } = render(
			<>
				<Disclosure title="Pequeño" size="sm">
					x
				</Disclosure>
				<Disclosure title="Medio">x</Disclosure>
			</>,
		);
		const [sm, md] = Array.from(container.querySelectorAll("summary"));
		expect(sm?.className).toContain("min-h-10");
		expect(md?.className).toContain("min-h-12");
	});

	it("la raya inferior va por defecto y se quita con divider={false}", () => {
		const { container } = render(
			<>
				<Disclosure title="Con raya">x</Disclosure>
				<Disclosure title="Sin raya" divider={false}>
					x
				</Disclosure>
			</>,
		);
		const [con, sin] = Array.from(container.querySelectorAll("details"));
		expect(con?.className).toContain("border-b");
		expect(sin?.className).not.toContain("border-b");
	});

	it("el chevron es decorativo y gira al abrir", () => {
		const { container } = render(<Disclosure title="Iconos">x</Disclosure>);
		const svg = container.querySelector("summary svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("class")).toContain("group-open/disclosure:rotate-90");
	});

	it("el título es el nombre del summary", () => {
		render(<Disclosure title="Iconos">x</Disclosure>);
		expect(screen.getByText("Iconos").closest("summary")).not.toBeNull();
	});

	it("axe en claro y oscuro, abierto y cerrado", async () => {
		await expectAccessibleInThemes(
			<>
				<Disclosure title="Iconos" aside="3 props" defaultOpen>
					<p>Contenido</p>
				</Disclosure>
				<Disclosure title="Tamaño" size="sm" divider={false}>
					<p>Más contenido</p>
				</Disclosure>
			</>,
		);
	});
});
