import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	use: { browserName: "chromium", baseURL: "http://localhost:4400" },
	webServer: {
		command: "bun run preview --port 4400",
		url: "http://localhost:4400",
		reuseExistingServer: true,
	},
});
