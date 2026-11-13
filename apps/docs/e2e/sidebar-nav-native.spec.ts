// SidebarNav con `disclosure="native"` con el JavaScript desactivado: la página se pinta solo en el servidor, el grupo
// con el elemento activo sale abierto y otro grupo se abre y se cierra al pulsar su título.
import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false, viewport: { width: 800, height: 900 } });

test("sin JavaScript, el grupo del activo está abierto y otro se abre y se cierra al pulsar su título", async ({
	page,
}) => {
	await page.goto("/visual/sidebar-nav-native/");
	const nav = page.getByRole("navigation", { name: "Principal" });
	const equipo = nav.locator("details", { hasText: "Equipo" });
	const panel = nav.locator("details", { hasText: "Panel" });

	await expect(equipo).toHaveAttribute("open", "");
	await expect(equipo.getByRole("link", { name: "Miembros" })).toBeVisible();
	await expect(equipo.getByRole("link", { name: "Miembros" })).toHaveAttribute("aria-current", "page");

	await expect(panel).not.toHaveAttribute("open", "");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeHidden();
	await panel.locator("summary").click();
	await expect(panel).toHaveAttribute("open", "");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeVisible();
	await panel.locator("summary").click();
	await expect(panel).not.toHaveAttribute("open", "");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeHidden();

	// Abrir y cerrar uno no toca el otro: son independientes
	await expect(equipo).toHaveAttribute("open", "");
});
