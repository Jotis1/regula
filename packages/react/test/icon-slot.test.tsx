import { Plus } from "@untitledui/icons";
import { forwardRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../src/index.js";
import { DynIcon, iconSlot } from "../src/internal/icon.js";

const Flag = forwardRef<SVGSVGElement, { size?: number }>(({ size }, ref) => (
	<svg ref={ref} width={size} data-flag="" />
));

describe("iconSlot", () => {
	it("pinta un componente de función con el tamaño del sitio y oculto", () => {
		const html = renderToStaticMarkup(<>{iconSlot(Plus, 16)}</>);
		expect(html).toContain('width="16"');
		expect(html).toContain('aria-hidden="true"');
	});

	it("pinta un componente con forwardRef", () => {
		expect(renderToStaticMarkup(<>{iconSlot(Flag, 20)}</>)).toContain('data-flag=""');
	});

	it("deja pasar un nodo tal cual", () => {
		const node = <Plus size={32} className="text-fg-brand-primary" />;
		const html = renderToStaticMarkup(<>{iconSlot(node, 16)}</>);
		expect(html).toContain('width="32"');
		expect(html).toContain("text-fg-brand-primary");
	});

	it("sin icono no pinta nada", () => {
		expect(iconSlot(undefined, 16)).toBeNull();
	});

	it("DynIcon pinta el componente elegido", () => {
		expect(renderToStaticMarkup(<DynIcon icon={Plus} size={12} />)).toContain('width="12"');
	});
});

describe("tipos de las props de icono", () => {
	it("aceptan un componente o un nodo y rechazan un nombre en cadena", () => {
		<Button iconLeading={Plus}>Añadir</Button>;
		<Button iconLeading={<Plus />}>Añadir</Button>;
		// @ts-expect-error un nombre en cadena ya no vale
		<Button iconLeading="plus">Añadir</Button>;
		expect(true).toBe(true);
	});
});
