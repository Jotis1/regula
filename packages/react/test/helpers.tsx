import { type RenderResult, render } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";
import { expect } from "vitest";

/** Pinta el componente dos veces, en claro y dentro de `.dark-mode`, y devuelve ambos contenedores. */
export function renderInThemes(ui: ReactElement): RenderResult & { light: HTMLElement; dark: HTMLElement } {
	const result = render(
		<>
			<div data-theme-root="light">{ui}</div>
			<div data-theme-root="dark" className="dark-mode">
				{ui}
			</div>
		</>,
	);
	const light = result.container.querySelector<HTMLElement>('[data-theme-root="light"]') as HTMLElement;
	const dark = result.container.querySelector<HTMLElement>('[data-theme-root="dark"]') as HTMLElement;
	return { ...result, light, dark };
}

/** Infracciones de axe de nivel serio o crítico. El contraste se mide en Playwright: jsdom no tiene CSS real. */
export async function axeViolations(node: Element) {
	const result = await axe.run(node, {
		rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
		resultTypes: ["violations"],
	});
	return result.violations
		.filter((v) => v.impact === "serious" || v.impact === "critical")
		.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** Pinta en ambos temas y exige cero infracciones serias o críticas en cada uno. */
export async function expectAccessibleInThemes(ui: ReactElement) {
	const { light, dark } = renderInThemes(ui);
	expect(await axeViolations(light), "tema claro").toEqual([]);
	expect(await axeViolations(dark), "tema oscuro").toEqual([]);
	return { light, dark };
}
