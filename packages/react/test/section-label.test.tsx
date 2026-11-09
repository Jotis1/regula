import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, SectionLabel } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("SectionLabel", () => {
	it("el título es un h3 por defecto y `as` cambia el nivel", () => {
		render(
			<>
				<SectionLabel title="Equipo" />
				<SectionLabel title="Facturación" as="h2" />
			</>,
		);
		expect(screen.getByRole("heading", { level: 3, name: "Equipo" })).toBeTruthy();
		expect(screen.getByRole("heading", { level: 2, name: "Facturación" })).toBeTruthy();
	});

	it("obligatorio: asterisco de marca oculto a lectores y «obligatorio» como texto", () => {
		render(<SectionLabel title="Equipo" required />);
		const heading = screen.getByRole("heading", { name: /^Equipo ?\(obligatorio\)$/ });
		const star = heading.querySelector("[aria-hidden=true]") as HTMLElement;
		expect(star.textContent).toBe("*");
		expect(star.className).toContain("text-brand-tertiary");
	});

	it("help pone un botón de ayuda que abre ese texto en un tooltip", async () => {
		render(<SectionLabel title="Equipo" required help="Quién puede ver el proyecto" />);
		const button = screen.getByRole("button", { name: "Ayuda: Equipo" });
		await userEvent.tab();
		expect(document.activeElement).toBe(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Quién puede ver el proyecto");
	});

	it("texto de apoyo y acciones debajo; sm de 14 y md de 16", () => {
		const { container } = render(
			<>
				<SectionLabel
					title="Equipo"
					description="Gestiona quién entra."
					actions={
						<Button hierarchy="link-color" size="sm">
							Invitar
						</Button>
					}
				/>
				<SectionLabel title="Equipo" description="Gestiona quién entra." size="md" />
			</>,
		);
		const [sm, md] = [...container.children] as HTMLElement[];
		expect(sm?.querySelector("h3")?.className).toContain("text-sm");
		expect(sm?.querySelector("p")?.className).toContain("text-tertiary");
		expect(screen.getByRole("button", { name: "Invitar" })).toBeTruthy();
		expect(md?.querySelector("h3")?.className).toContain("text-md");
		expect(md?.querySelector("p")?.className).toContain("text-md");
	});

	it("sin help ni required, solo texto: se pinta en el servidor", () => {
		const html = renderToStaticMarkup(<SectionLabel title="Equipo" description="Apoyo" />);
		expect(html).toContain("<h3");
		expect(html).not.toContain("button");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<SectionLabel
				title="Equipo"
				required
				help="Quién puede ver el proyecto"
				description="Gestiona quién entra."
				actions={
					<>
						<Button hierarchy="link-gray" size="sm">
							Ver todos
						</Button>
						<Button hierarchy="link-color" size="sm">
							Invitar
						</Button>
					</>
				}
			/>,
		);
	});
});
