import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Entorno de tests de React: activa act() también fuera de render() de Testing Library (p. ej. al hidratar)
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

// Los «HTML de antes» de las pruebas de variantes (change adopt-untitled-ui-icons): los iconos pasaron de los propios a
// los de `@untitledui/icons`, que dibujan distinto, así que se compara el HTML con cada SVG reducido a `<svg/>`. Lo
// demás (clases, atributos, estructura) sigue igual de exigente.
const withoutSvg = (html: string) => html.replace(/<svg\b[\s\S]*?<\/svg>/g, "<svg/>");

expect.extend({
	toMatchBefore(received: string, expected: string | undefined = "") {
		const a = withoutSvg(received);
		const b = withoutSvg(expected);
		return {
			pass: a === b,
			message: () => `el HTML no es el de antes (sin contar los SVG)\n${this.utils.diff(b, a) ?? ""}`,
		};
	},
});

declare module "vitest" {
	interface Assertion<R, T> {
		/** Igual que el HTML guardado de antes, sin contar el dibujo de los iconos. */
		toMatchBefore(expected: string | undefined): R extends void | Promise<void> ? R : never;
	}
}
