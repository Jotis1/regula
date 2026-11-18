// The one retry of `page.goto` in `fixtures.ts` (TST-004): only for a connection the runner refused, only once, and
// with a note in the report.
import { expect, test } from "./fixtures";

const PATH = "/start/install/";
const notes = (annotations: { type: string }[]) => annotations.filter((a) => a.type === "navigation-retry");

test("una navegación que el runner rechaza se reintenta una vez y queda anotada", async ({
	page,
}, testInfo) => {
	let requests = 0;
	await page.route(`**${PATH}`, (route) => {
		requests++;
		return requests === 1 ? route.abort("connectionrefused") : route.continue();
	});
	await page.goto(PATH);
	await expect(page.locator("h1")).toBeVisible();
	expect(requests).toBe(2);
	expect(notes(testInfo.annotations)).toHaveLength(1);
});

test("si el reintento también falla, la navegación falla", async ({ page }, testInfo) => {
	let requests = 0;
	await page.route(`**${PATH}`, (route) => {
		requests++;
		return route.abort("connectionrefused");
	});
	await expect(page.goto(PATH)).rejects.toThrow(/ERR_CONNECTION_REFUSED/);
	expect(requests).toBe(2);
	expect(notes(testInfo.annotations)).toHaveLength(1);
});

test("otro error de red no se reintenta", async ({ page }, testInfo) => {
	let requests = 0;
	await page.route(`**${PATH}`, (route) => {
		requests++;
		return route.abort("failed");
	});
	await expect(page.goto(PATH)).rejects.toThrow(/ERR_FAILED/);
	expect(requests).toBe(1);
	expect(notes(testInfo.annotations)).toHaveLength(0);
});
