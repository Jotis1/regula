import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	use: { browserName: "chromium", baseURL: "http://localhost:3100" },
	webServer: {
		command: "bun run start --port 3100",
		url: "http://localhost:3100",
		reuseExistingServer: true,
	},
});
