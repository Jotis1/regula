import { defineConfig } from "@playwright/test";

// Lo que depende del navegador en el teclado o el portapapeles (pegar, autocompletar) va en e2e/cross-browser/ y corre
// también en Firefox y WebKit. Todo lo demás, solo en Chromium: las capturas aprobadas se hicieron con él.
const CROSS_BROWSER = /cross-browser[\\/].*\.spec\.ts$/;

export default defineConfig({
	testDir: "e2e",
	// TST-004: en CI, un test que solo pasa al reintentar sale como "flaky" y hace fallar la ejecución. El reintento
	// queda para que el informe diga que es inestable, y no un fallo sin más.
	retries: process.env.CI ? 1 : 0,
	failOnFlakyTests: !!process.env.CI,
	use: { baseURL: "http://localhost:4321" },
	projects: [
		{ name: "chromium", use: { browserName: "chromium" } },
		{ name: "firefox", use: { browserName: "firefox" }, testMatch: CROSS_BROWSER },
		{ name: "webkit", use: { browserName: "webkit" }, testMatch: CROSS_BROWSER },
	],
	webServer: {
		command: "bun run preview --port 4321",
		url: "http://localhost:4321",
		reuseExistingServer: true,
	},
});
