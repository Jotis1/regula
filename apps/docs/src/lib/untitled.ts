// Lo que la web enseña de los paquetes de Untitled UI (change adopt-untitled-ui-icons): la lista de iconos de línea, de
// banderas y de tipos de archivo, calculada de los propios paquetes en el build. Solo se importa desde páginas y
// endpoints de Astro (el servidor): las islas reciben los nombres ya calculados, nunca estos módulos, que cargan los
// 1.181 iconos.
import * as flags from "@untitledui/country-flags";
import * as lineIcons from "@untitledui/icons";
import { type ComponentType, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type Drawable = ComponentType<Record<string, unknown>>;

/** Los nombres de los iconos de línea (`SearchLg`), en orden alfabético. */
export const ICON_NAMES: string[] = Object.keys(lineIcons)
	.filter((k) => /^[A-Z]/.test(k))
	.sort();

/** Los códigos de las banderas (`es`) con el nombre del país en castellano. */
export const FLAGS: { code: string; title: string }[] = (() => {
	const names = new Intl.DisplayNames(["es"], { type: "region" });
	return Object.keys(flags)
		.filter((k) => /^Flag[A-Z]/.test(k))
		.map((k) => {
			const code = k.slice(4).toLowerCase();
			let title = code;
			try {
				title = names.of(code.toUpperCase()) ?? code;
			} catch {
				// `earth`, `bq1`, `gb2`…: sin nombre de región, se queda el código
			}
			if (code === "earth") title = "Mundo";
			return { code, title: title === code ? code : title };
		})
		.sort((a, b) => a.title.localeCompare(b.title, "es"));
})();

export { FILE_GROUP as FILE_TYPES } from "./gallery";

/** Un icono suelto como SVG de fichero (con `xmlns`: como `<img>` no vale sin él). */
export function svgOf(component: unknown, props: Record<string, unknown> = {}): string {
	return `${renderToStaticMarkup(createElement(component as Drawable, { xmlns: "http://www.w3.org/2000/svg", ...props }))}\n`;
}

export const lineIconComponent = (name: string) => (lineIcons as unknown as Record<string, unknown>)[name];
export const flagComponent = (code: string) =>
	(flags as unknown as Record<string, unknown>)[`Flag${code.charAt(0).toUpperCase()}${code.slice(1)}`];
