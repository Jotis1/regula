import { defineConfig } from "@playwright/test";

// Lo que depende del navegador en el teclado o el portapapeles (pegar, autocompletar) va en e2e/cross-browser/ y corre
// también en Firefox y WebKit. Todo lo demás, solo en Chromium: las capturas aprobadas se hicieron con él.
const CROSS_BROWSER = /cross-browser[\\/].*\.spec\.ts$/;

export default defineConfig({
	testDir: "e2e",
	// En CI, un reintento: en el runner de Windows `astro preview` rechaza a veces una conexión suelta
	// (ERR_CONNECTION_REFUSED a mitad de pasada). Un test que solo pasa al reintentar sale como "flaky" en el informe.
	retries: process.env.CI ? 1 : 0,
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
