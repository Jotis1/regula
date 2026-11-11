import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarProfilePhoto } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("AvatarProfilePhoto", () => {
	it("con foto, la foto lleva el nombre como texto alternativo", () => {
		render(<AvatarProfilePhoto src="/olivia.jpg" alt="Olivia Rhye" />);
		expect(screen.getByRole("img", { name: "Olivia Rhye" }).getAttribute("src")).toBe("/olivia.jpg");
	});

	it("con iniciales y nombre es una imagen con nombre; el sello entra en él", () => {
		render(<AvatarProfilePhoto initials="OR" alt="Olivia Rhye" verified />);
		const img = screen.getByRole("img", { name: "Olivia Rhye, Verificado" });
		expect(img.textContent).toContain("OR");
	});

	it("sin foto ni iniciales pinta el icono de usuario del tamaño que toca", () => {
		const { container } = render(
			<>
				<AvatarProfilePhoto size="sm" />
				<AvatarProfilePhoto size="lg" />
			</>,
		);
		const icons = container.querySelectorAll("svg");
		expect(icons[0]?.getAttribute("width")).toBe("32");
		expect(icons[1]?.getAttribute("width")).toBe("64");
	});

	it("los tres tamaños miden 72, 96 y 160 y el sello sin nombre se anuncia aparte", () => {
		const { container } = render(
			<>
				<AvatarProfilePhoto size="sm" verified />
				<AvatarProfilePhoto size="md" />
				<AvatarProfilePhoto size="lg" />
			</>,
		);
		const [sm, md, lg] = [...container.children] as HTMLElement[];
		expect(sm?.className).toContain("size-18");
		expect(md?.className).toContain("size-24");
		expect(lg?.className).toContain("size-40");
		expect(screen.getByText("Verificado").className).toContain("sr-only");
	});

	it("es accesible en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<>
				<AvatarProfilePhoto initials="OR" alt="Olivia Rhye" verified size="lg" />
				<AvatarProfilePhoto verified />
				<AvatarProfilePhoto src="/a.jpg" alt="Ana" />
			</>,
		);
	});
});
