// Comprueba que los paquetes oficiales de Untitled UI se pintan bien con React 19 (change adopt-untitled-ui-icons):
// banderas, iconos de archivo en sus variantes y un icono de línea con nombre accesible.
import { FlagEs } from "@untitledui/country-flags";
import { FileIcon } from "@untitledui/file-icons";
import { SearchLg } from "@untitledui/icons";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("paquetes de Untitled UI con React 19", () => {
	it("pinta una bandera en círculo a 16px", () => {
		const html = render(h(FlagEs, { size: 16 }));
		expect(html).toContain('width="16"');
		expect(html).toContain("clip-path");
		expect(html).toContain('aria-hidden="true"');
	});

	it("pinta dos veces la misma bandera con el mismo recorte", () => {
		const html = render(h("div", null, h(FlagEs), h(FlagEs)));
		expect(html.match(/<svg/g)).toHaveLength(2);
		expect(html.match(/ES_svg__a/g)?.length).toBeGreaterThanOrEqual(4);
	});

	it.each(["default", "gray", "solid"] as const)("pinta el icono de PDF en %s", (variant) => {
		expect(render(h(FileIcon, { type: "pdf", variant, size: 40 }))).toContain('width="40"');
	});

	it("pinta el icono de PDF en oscuro con otros colores que en claro", () => {
		const light = render(h(FileIcon, { type: "pdf", theme: "light" }));
		const dark = render(h(FileIcon, { type: "pdf", theme: "dark" }));
		expect(dark).not.toBe(light);
	});

	it("pinta una carpeta y un tipo MIME", () => {
		expect(render(h(FileIcon, { type: "folder" }))).toContain("<svg");
		expect(render(h(FileIcon, { type: "video/mp4" }))).toContain("<svg");
	});

	it("un icono de línea con nombre accesible se expone como imagen", () => {
		const html = render(
			h(SearchLg, { size: 16, role: "img", "aria-label": "Buscar", "aria-hidden": undefined }),
		);
		expect(html).toContain('role="img"');
		expect(html).toContain('aria-label="Buscar"');
		expect(html).not.toContain("aria-hidden");
	});
});
