import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axeViolations, expectAccessibleInThemes, renderInThemes } from "./helpers.js";

// Componentes de prueba: uno correcto y otro con dos fallos que axe tiene que encontrar
function Correcto() {
	return (
		<button type="button" className="bg-brand-solid text-white">
			Guardar
		</button>
	);
}
function Roto() {
	return (
		<div>
			<button type="button" />
			{/* biome-ignore lint/a11y/useAltText: fallo a propósito, es lo que axe tiene que encontrar */}
			<img src="x.png" />
		</div>
	);
}

describe("helper de temas y accesibilidad", () => {
	it("pinta el componente en claro y en oscuro", () => {
		const { light, dark } = renderInThemes(<Correcto />);
		expect(light.closest(".dark-mode")).toBeNull();
		expect(dark.classList.contains("dark-mode")).toBe(true);
		expect(screen.getAllByRole("button", { name: "Guardar" })).toHaveLength(2);
	});

	it("deja pasar un componente accesible", async () => {
		await expectAccessibleInThemes(<Correcto />);
	});

	it("encuentra los fallos de un componente roto", async () => {
		const { light } = renderInThemes(<Roto />);
		const found = (await axeViolations(light)).join("\n");
		expect(found).toContain("button-name");
		expect(found).toContain("image-alt");
	});
});
