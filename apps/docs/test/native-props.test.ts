// `nativeOf` (spec docs-site, «Página por componente»): los atributos nativos que reenvía cada componente.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nativeOf } from "../src/lib/props";

const root = join(import.meta.dirname, "../../..");
const components = join(root, "packages/react/src/components");
const native = (name: string) => nativeOf(join(components, `${name}.tsx`), name);

describe("nativeOf", () => {
	it("Button reenvía a button y a, sin globales ni eventos", () => {
		const result = native("Button");
		expect(result.map((t) => t.element)).toEqual(["button", "a"]);
		const [button, a] = result;
		expect(button?.attributes).toEqual(expect.arrayContaining(["type", "disabled", "name"]));
		expect(a?.attributes).toEqual(expect.arrayContaining(["target", "download"]));
		for (const t of result) {
			for (const global of ["className", "onClick", "aria-label", "id", "ref", "key"]) {
				expect(t.attributes).not.toContain(global);
			}
		}
	});

	it("Input reenvía a input, sin los atributos que quita", () => {
		const [input, ...rest] = native("Input");
		expect(rest).toEqual([]);
		expect(input?.element).toBe("input");
		expect(input?.attributes).toEqual(expect.arrayContaining(["placeholder", "autoComplete"]));
		expect(input?.attributes).not.toContain("type");
		expect(input?.attributes).not.toContain("size");
	});

	it("Checkbox no trae type ni size", () => {
		const attributes = native("Checkbox")[0]?.attributes;
		expect(attributes).not.toContain("type");
		expect(attributes).not.toContain("size");
	});

	it("TransparencyGrid solo hereda los globales", () => {
		expect(native("TransparencyGrid")).toEqual([{ element: null, attributes: [] }]);
	});

	it("Avatar no hereda nada", () => {
		expect(native("Avatar")).toEqual([]);
	});

	it("los componentes que reenvían atributos son los once conocidos", () => {
		const names = readdirSync(components)
			.filter((f) => f.endsWith(".tsx"))
			.map((f) => f.replace(".tsx", ""))
			.filter((n) => native(n).length > 0)
			.sort();
		expect(names).toEqual([
			"AppStoreBadge",
			"BadgeGroup",
			"Button",
			"ButtonUtility",
			"Checkbox",
			"CloseButton",
			"Input",
			"Radio",
			"SocialButton",
			"Textarea",
			"TransparencyGrid",
		]);
		// Cada componente se analiza por separado (~0,3 s): los 130 pasan del límite global
	}, 180_000);
});
