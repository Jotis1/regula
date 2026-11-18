// The `test` every e2e spec imports. It adds two things to Playwright's.
//
// When an island is ready to use. Astro drops `ssr` as soon as it hands the island to React, but React hydrates later
// (inside `startTransition`), may commit lazy content later still, and runs `useEffect` after each commit: a click
// before that is lost or undone. React calls the DevTools hook on every commit and again right after it runs the
// effects of a root, and the root's container is the island. A test-only hook uses that to know, per element, that
// React has committed it and that its island has no effects left to run.
//
// One more try for a navigation the runner refused (TST-004). On a slow Windows runner, opening a connection to the
// local preview fails now and then (1 pass in 18, measured 2026-11-18, with ports and memory to spare). That says
// nothing about the test, so `page.goto` tries once more and leaves a note in the report. Any other failure counts.
import { test as base, expect, type Locator } from "@playwright/test";

/** Connection errors seen on the runner when opening the local preview. Add one only after seeing it there. */
const RUNNER_CONNECTION_ERRORS = /net::ERR_(CONNECTION_REFUSED|NO_BUFFER_SPACE)\b/;

declare global {
	interface Window {
		/** True once React has committed `el` and its island has run its effects. */
		islandReady(el: Element | null): boolean;
	}
}

export const test = base.extend<{ effectsHook: undefined }>({
	page: async ({ page }, use, testInfo) => {
		const goto = page.goto.bind(page);
		page.goto = async (url, options) => {
			try {
				return await goto(url, options);
			} catch (error) {
				const message = error instanceof Error ? error.message : "";
				if (!RUNNER_CONNECTION_ERRORS.test(message)) throw error;
				testInfo.annotations.push({ type: "navigation-retry", description: message.split("\n")[0] });
				// Chromium (the only one that reports `net::ERR_`) loads its error page after the failure: a navigation
				// started before that one ends is interrupted by it
				await page.waitForURL(/^chrome-error:\/\//);
				return goto(url, options);
			}
		};
		await use(page);
	},
	effectsHook: [
		async ({ page }, use) => {
			await page.addInitScript(() => {
				type Fiber = { flags: number; subtreeFlags: number };
				type Root = { containerInfo?: Node; current: Fiber };
				// React's PassiveMask (react-dom 19): the committed tree has effects still to run. React only calls
				// `onPostCommitFiberRoot` when it does; a tree without them is ready at the commit.
				const PASSIVE_MASK = 10256;
				const committed = new WeakSet<Element>();
				// The key React hangs its props from on every element it owns (`__reactProps$…`, one per React copy)
				let propsKey: string | undefined;
				const island = (root: Root) =>
					root.containerInfo instanceof Element ? root.containerInfo : null;
				/** Records the elements of the island that React owns after this commit, without entering nested islands. */
				const record = (container: Element) => {
					const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, (node) =>
						(node as Element).localName === "astro-island"
							? NodeFilter.FILTER_REJECT
							: NodeFilter.FILTER_ACCEPT,
					);
					for (
						let el = walker.nextNode() as Element | null;
						el;
						el = walker.nextNode() as Element | null
					) {
						propsKey ??= Object.keys(el).find((k) => k.startsWith("__reactProps$"));
						if (propsKey && propsKey in el) committed.add(el);
					}
				};
				let id = 0;
				Object.defineProperty(window, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
					configurable: true,
					value: {
						supportsFiber: true,
						isDisabled: false,
						inject: () => ++id,
						onCommitFiberRoot(_id: number, root: Root) {
							const container = island(root);
							if (!container) return;
							record(container);
							const pending =
								((root.current.flags | root.current.subtreeFlags) & PASSIVE_MASK) !== 0;
							container.toggleAttribute("data-effects", !pending);
						},
						onCommitFiberUnmount() {},
						setStrictMode() {},
						onPostCommitFiberRoot(_id: number, root: Root) {
							island(root)?.setAttribute("data-effects", "");
						},
					},
				});
				window.islandReady = (el) =>
					!!el && committed.has(el) && !!el.closest("astro-island")?.hasAttribute("data-effects");
			});
			await use(undefined);
		},
		{ auto: true },
	],
});

export { expect };

/** Waits until React has hydrated the island and run the effects of its last commit. */
export async function hydrated(island: Locator) {
	await expect(island).not.toHaveAttribute("ssr", /.*/);
	await expect(island).toHaveAttribute("data-effects", "");
}

/** The nearest island that holds `inside` (its first match). */
export const islandOf = (inside: Locator) => inside.first().locator("xpath=ancestor::astro-island[1]");
