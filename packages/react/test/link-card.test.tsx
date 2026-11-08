import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, LinkCard } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("LinkCard", () => {
	it("el enlace lleva a su destino y su nombre accesible es el título seguido de la descripción", () => {
		render(
			<LinkCard
				href="/components/button-group/"
				title="Button group"
				description="Grupo segmentado de botones"
			/>,
		);
		// jsdom no tiene CSS: sin la columna flex del navegador, los dos span se unen sin espacio (el e2e lo ve con espacio)
		const link = screen.getByRole("link", { name: /^Button groups*Grupo segmentado de botones$/ });
		expect(link.getAttribute("href")).toBe("/components/button-group/");
		expect(screen.getAllByRole("link")).toHaveLength(1);
	});

	it("el enlace cubre toda la card: estira su ::after sobre ella", () => {
		const { container } = render(<LinkCard href="/x/" title="Tarjeta" preview={<p>Muestra</p>} />);
		const link = screen.getByRole("link", { name: "Tarjeta" });
		expect(link.className).toContain("after:absolute");
		expect(link.className).toContain("after:inset-0");
		// La raíz es el contenedor de referencia del ::after
		expect((container.firstElementChild as HTMLElement).className).toContain("relative");
	});

	it("la vista previa va fuera del enlace, inerte y oculta a los lectores de pantalla", () => {
		render(
			<LinkCard
				href="/x/"
				title="Con botón"
				preview={
					<>
						<Button>Dentro de la muestra</Button>
						<a href="/dibujado/">Enlace dibujado</a>
					</>
				}
			/>,
		);
		const link = screen.getByRole("link", { name: "Con botón" });
		const muestra = screen.getByText("Dentro de la muestra").closest("[aria-hidden]") as HTMLElement;
		expect(muestra.getAttribute("aria-hidden")).toBe("true");
		expect(muestra.hasAttribute("inert")).toBe(true);
		expect(muestra.className).toContain("pointer-events-none");
		// Fuera del enlace, no dentro
		expect(link.contains(muestra)).toBe(false);
		expect(muestra.contains(link)).toBe(false);
		// Y ni el botón ni el enlace dibujado salen en el árbol de accesibilidad
		expect(screen.queryByRole("button", { name: "Dentro de la muestra" })).toBeNull();
		expect(screen.queryByRole("link", { name: "Enlace dibujado" })).toBeNull();
	});

	it("sin muestra ni descripción: solo el título, sin cajas vacías", () => {
		const { container } = render(<LinkCard href="/x/" title="Solo título" />);
		expect(container.querySelector("[aria-hidden]")).toBeNull();
		expect(screen.getByRole("link").querySelectorAll("span")).toHaveLength(1);
	});

	it("as=li: la raíz es un elemento de lista", () => {
		render(
			<ul>
				<LinkCard as="li" href="/x/" title="Uno" />
			</ul>,
		);
		expect(screen.getAllByRole("listitem")).toHaveLength(1);
		expect(screen.getByRole("link", { name: "Uno" }).parentElement?.tagName).toBe("LI");
	});

	it("se pinta en el servidor, sin JavaScript", () => {
		const html = renderToString(
			<LinkCard href="/x/" title="Título" description="Texto" preview={<i>muestra</i>} />,
		);
		expect(html).toContain('href="/x/"');
		expect(html).toContain("<i>muestra</i>");
		expect(html).toMatch(/aria-hidden="true"[^>]*inert/);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<LinkCard
				href="/x/"
				title="Button group"
				description="Grupo segmentado"
				preview={<Button>Ver</Button>}
			/>,
		);
	});
});
