// `/components.json` (spec mcp-server): every component of the collection, with its props and both snippets.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { type ComponentEntry, componentsJson } from "../src/lib/components-json";
import { propsOf } from "../src/lib/props";
import { snippetsOf } from "../src/lib/snippets";

const dir = join(import.meta.dirname, "../src/content/components");
const root = join(import.meta.dirname, "../../..");

const entries: ComponentEntry[] = readdirSync(dir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => {
		const raw = readFileSync(join(dir, f), "utf8");
		const [, front, body] = raw.split(/^---\s*$/m);
		return { id: f.replace(/\.md$/, ""), data: parse(front), body };
	});

const deps = {
	propsOf: (e: ComponentEntry) =>
		propsOf(join(root, e.data.source ?? `packages/react/src/components/${e.data.name}.tsx`), e.data.name),
	snippetsOf,
};
const json = componentsJson(entries, deps, "1.2.3", "https://regula.jotis.me/");

describe("componentsJson", () => {
	it("trae todos los componentes de la colección, con la versión", () => {
		expect(json.version).toBe("1.2.3");
		expect(json.components).toHaveLength(entries.length);
		expect(json.components.length).toBeGreaterThanOrEqual(130);
	});

	it("Button trae hierarchy con sus cinco valores y los dos fragmentos", () => {
		const button = json.components.find((c) => c.name === "Button");
		expect(button?.group?.label).toBe("Acciones");
		expect(button?.url).toBe("https://regula.jotis.me/components/button/");
		const hierarchy = button?.props.find((p) => p.name === "hierarchy");
		expect(hierarchy?.type).toBe('"primary" · "secondary" · "tertiary" · "link-color" · "link-gray"');
		expect(button?.snippets.next).toContain('import { Button } from "@jotis-me/react"');
		expect(button?.snippets.astro).toContain("---");
		expect(button?.guide).toContain("**Cuándo.**");
	});

	it("cada componente está en un grupo y lleva fragmentos", () => {
		for (const c of json.components) {
			expect(c.group, `${c.name} sin grupo`).not.toBeNull();
			expect(c.snippets.next.length).toBeGreaterThan(0);
		}
	});
});
