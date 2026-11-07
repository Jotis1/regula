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

/** Referencias ARIA (`aria-labelledby`, `aria-describedby`, `aria-controls`) que apuntan a un id que no está en `root`. */
export function danglingAriaRefs(root: ParentNode): string[] {
	const out: string[] = [];
	for (const el of root.querySelectorAll("[aria-labelledby],[aria-describedby],[aria-controls]")) {
		for (const attr of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
			for (const ref of (el.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) {
				if (!root.querySelector(`[id="${ref}"]`))
					out.push(`${el.tagName.toLowerCase()} ${attr} → ${ref}`);
			}
		}
	}
	return out;
}

/** Pinta en servidor y devuelve las referencias ARIA rotas del HTML resultante (sin hidratar). */
export function danglingAriaRefsOnServer(html: string): string[] {
	const host = document.createElement("div");
	host.innerHTML = html;
	return danglingAriaRefs(host);
}
