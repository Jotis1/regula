// ProgressSteps con `onChange` (cambio add-stream-scene-width): el texto visible de cada botón es su nombre, así que
// axe no marca `label-content-name-mismatch` (WCAG 2.5.3). Es una regla experimental de axe: hay que pedirla por nombre.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("ProgressSteps navegable: la descripción va fuera del botón y axe no marca label-content-name-mismatch", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto("/visual/progress-steps-nav/");
	await expect(page.getByRole("button", { name: "Tus datos" }).first()).toBeVisible();
	const { violations, passes } = await new AxeBuilder({ page })
		.withRules(["label-content-name-mismatch"])
		.analyze();
	expect(violations.flatMap((v) => v.nodes.map((n) => n.html))).toEqual([]);
	// La regla se ha evaluado de verdad sobre los botones
	expect(passes.flatMap((p) => p.nodes).length).toBeGreaterThan(0);
	// La descripción es la descripción accesible del botón, sin entrar en su nombre
	await expect(
		page.getByRole("button", { name: "Tus datos", exact: true }).first(),
	).toHaveAccessibleDescription("Nombre y correo");
});
