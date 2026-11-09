import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BadgeGroup } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("BadgeGroup", () => {
	it("con href es un enlace con el badge y el mensaje en su nombre, y una flecha decorativa al final", () => {
		render(
			<BadgeGroup badge="Nuevo" href="/novedades">
				Hemos publicado una función
			</BadgeGroup>,
		);
		const link = screen.getByRole("link", { name: "Nuevo Hemos publicado una función" });
		expect(link.getAttribute("href")).toBe("/novedades");
		const svgs = link.querySelectorAll("svg");
		expect(svgs).toHaveLength(1);
		expect(svgs[0]?.getAttribute("aria-hidden")).toBe("true");
		// Badge delante: la flecha va tras el mensaje, de 16
		expect(svgs[0]?.getAttribute("width")).toBe("16");
		expect(link.firstElementChild?.textContent).toBe("Nuevo");
	});

	it("con onClick es un botón que responde", async () => {
		const onClick = vi.fn();
		render(
			<BadgeGroup badge="Error" color="error" onClick={onClick}>
				No se pudo guardar
			</BadgeGroup>,
		);
		const button = screen.getByRole("button", { name: "Error No se pudo guardar" });
		expect(button.getAttribute("type")).toBe("button");
		await userEvent.click(button);
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("sin acción no es interactivo ni lleva flecha", () => {
		const { container } = render(<BadgeGroup badge="v4.0">Ya disponible</BadgeGroup>);
		expect(screen.queryByRole("link")).toBeNull();
		expect(screen.queryByRole("button")).toBeNull();
		expect(container.querySelector("svg")).toBeNull();
		expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
	});

	it("badge detrás: el mensaje primero y la flecha de 12 dentro del badge", () => {
		render(
			<BadgeGroup badge="Ver" badgePosition="trailing" href="#">
				Novedades de noviembre
			</BadgeGroup>,
		);
		const link = screen.getByRole("link");
		expect(link.firstElementChild?.textContent).toBe("Novedades de noviembre");
		const badge = link.lastElementChild as HTMLElement;
		expect(badge.textContent).toBe("Ver");
		expect(badge.querySelector("svg")?.getAttribute("width")).toBe("12");
	});

	it("pill del color con hover un escalón más; modern blanca con el punto del color", () => {
		const { container } = render(
			<>
				<BadgeGroup badge="Aviso" color="warning" href="#">
					Revisa tus datos
				</BadgeGroup>
				<BadgeGroup badge="Nuevo" color="success" type="modern" href="#">
					Ya puedes exportar
				</BadgeGroup>
			</>,
		);
		const [pill, modern] = [...container.querySelectorAll("a")];
		expect(pill?.className).toContain("bg-utility-yellow-50");
		expect(pill?.className).toContain("hover:bg-utility-yellow-100");
		expect(pill?.className).toContain("rounded-full");
		expect(modern?.className).toContain("bg-primary");
		expect(modern?.className).toContain("shadow-xs");
		expect(modern?.className).toContain("hover:bg-secondary");
		expect(modern?.querySelector(".bg-utility-green-500")?.getAttribute("aria-hidden")).toBe("true");
	});

	it("md con texto de 12 y lg con texto de 14", () => {
		const { container } = render(
			<>
				<BadgeGroup badge="A">Uno</BadgeGroup>
				<BadgeGroup badge="B" size="lg">
					Dos
				</BadgeGroup>
			</>,
		);
		const [md, lg] = [...container.children] as HTMLElement[];
		expect(md?.className).toContain("text-xs");
		expect(lg?.className).toContain("text-sm");
	});

	it("axe en claro y oscuro, en los cinco colores y los dos tipos", async () => {
		await expectAccessibleInThemes(
			<div className="flex flex-col items-start gap-2">
				{(["gray", "brand", "error", "warning", "success"] as const).map((color) => (
					<div key={color} className="flex gap-2">
						<BadgeGroup badge="Nuevo" color={color} href="#">
							Hemos publicado una función
						</BadgeGroup>
						<BadgeGroup
							badge="Nuevo"
							color={color}
							type="modern"
							badgePosition="trailing"
							href="#"
						>
							Hemos publicado una función
						</BadgeGroup>
					</div>
				))}
			</div>,
		);
	});
});
