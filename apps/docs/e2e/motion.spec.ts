// `prefers-reduced-motion` con CSS real: jsdom no evalúa media queries.
import { expect, type Page, test } from "@playwright/test";
import { streamMotion } from "../../../packages/react/src/internal/stream";

// Entrada y salida de Stream (design §12). La web escanea packages/react/dist, así que su CSS ya trae estas
// clases. Se monta un elemento con la entrada y luego se pasa a la salida, mirando qué transiciones arranca.
async function streamTransitions(page: Page) {
	return page.evaluate(
		([enter, exit]) => {
			const el = document.createElement("div");
			el.className = enter;
			el.textContent = "Alerta";
			document.body.append(el);
			const props = () =>
				el
					.getAnimations()
					.map((a) => (a as CSSTransition).transitionProperty)
					.sort();
			const s = getComputedStyle(el);
			void s.opacity; // fuerza el cálculo de estilos: aquí arranca la transición desde @starting-style
			const entering = {
				props: props(),
				duration: s.transitionDuration,
				easing: s.transitionTimingFunction,
			};
			for (const a of el.getAnimations()) a.finish();
			el.className = exit;
			void getComputedStyle(el).opacity;
			const leaving = { props: props(), duration: getComputedStyle(el).transitionDuration };
			for (const a of el.getAnimations()) a.finish();
			const end = { opacity: getComputedStyle(el).opacity, translate: getComputedStyle(el).translate };
			el.remove();
			return { entering, leaving, end };
		},
		[streamMotion("enter") ?? "", streamMotion("exit") ?? ""],
	);
}

const animation = (el: Element) => {
	const s = getComputedStyle(el);
	return { name: s.animationName, duration: s.animationDuration };
};

for (const reduce of [false, true]) {
	test.describe(reduce ? "con menos movimiento" : "con movimiento", () => {
		test.beforeEach(async ({ page }) => {
			await page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
		});

		test(`Skeleton ${reduce ? "no pulsa" : "pulsa cada 1,4 s"}`, async ({ page }) => {
			await page.goto("/visual/skeleton/");
			const block = page.locator('[aria-hidden="true"].bg-tertiary').first();
			const anim = await block.evaluate(animation);
			expect(anim.name).toBe(reduce ? "none" : "pulse");
			if (!reduce) expect(anim.duration).toBe("1.4s");
		});

		test(`Spinner ${reduce ? "gira a 3 s por vuelta" : "gira a 1 s por vuelta"}`, async ({ page }) => {
			await page.goto("/visual/spinner/");
			const svg = page.getByRole("status").first().locator("svg");
			const anim = await svg.evaluate(animation);
			expect(anim.name).toBe("spin");
			expect(anim.duration).toBe(reduce ? "3s" : "1s");
		});

		test(`Stream ${reduce ? "entra y sale solo con fundido" : "entra y sale con fundido y 8px"}`, async ({
			page,
		}) => {
			await page.goto("/");
			const t = await streamTransitions(page);
			const moved = reduce ? ["opacity"] : ["opacity", "translate"];
			expect(t.entering.props).toEqual(moved);
			expect(t.entering.duration).toBe("0.25s");
			expect(t.entering.easing).toBe("cubic-bezier(0.2, 0.7, 0.2, 1)");
			expect(t.leaving.props).toEqual(moved);
			expect(t.leaving.duration).toBe("0.2s");
			expect(t.end.opacity).toBe("0");
			expect(t.end.translate).toBe(reduce ? "0px" : "0px -8px");
		});
	});
}
