import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	COMPONENT_GROUPS,
	catalogComponents,
	FOUNDATIONS,
	groupOf,
	neighborsOf,
	SECTIONS,
	sectionOf,
	slugOf,
} from "../src/lib/catalog";

const dir = fileURLToPath(new URL("../src/content/components/", import.meta.url));

/** Las fichas de la colección: slug (nombre del fichero) y `name` del frontmatter. */
const collection = readdirSync(dir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => {
		const name = readFileSync(`${dir}${f}`, "utf8").match(/^name:\s*"?([^"\n]+)"?\s*$/m)?.[1];
		return { slug: f.replace(/\.md$/, ""), name };
	});

describe("catálogo de componentes", () => {
	// El recuento no es fijo: el catálogo crece con cada componente (test/catalog-sync.test.ts lo cruza con el paquete)
	it("la colección tiene una ficha por componente del catálogo, cada una con `name`", () => {
		expect(collection).toHaveLength(catalogComponents().length);
		expect(collection.filter((c) => !c.name)).toEqual([]);
	});

	it("cada componente de la colección está en un solo grupo", () => {
		const placed = catalogComponents().map(slugOf);
		for (const { slug } of collection) {
			expect(
				placed.filter((s) => s === slug),
				`${slug} debería estar en un solo grupo`,
			).toHaveLength(1);
		}
		expect(placed).toHaveLength(collection.length);
	});

	it("ningún grupo nombra un componente que no existe", () => {
		const slugs = new Set(collection.map((c) => c.slug));
		const unknown = catalogComponents().filter((n) => !slugs.has(slugOf(n)));
		expect(unknown).toEqual([]);
	});

	it("el nombre del catálogo es el `name` de la ficha, con su mayúscula", () => {
		const nameBySlug = new Map(collection.map((c) => [c.slug, c.name]));
		for (const n of catalogComponents()) expect(nameBySlug.get(slugOf(n)), n).toBe(n);
	});

	it("no hay grupos vacíos ni ids repetidos", () => {
		expect(COMPONENT_GROUPS.filter((g) => g.components.length === 0)).toEqual([]);
		const ids = COMPONENT_GROUPS.map((g) => g.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("hay 11 grupos de aplicación y los cuatro de Stream, y entre todos reparten el catálogo", () => {
		const count = (s: "components" | "stream") =>
			COMPONENT_GROUPS.filter((g) => g.section === s).flatMap((g) => g.components).length;
		expect(COMPONENT_GROUPS.filter((g) => g.section === "components")).toHaveLength(11);
		expect(COMPONENT_GROUPS.filter((g) => g.section === "stream").map((g) => g.label)).toEqual([
			"Alertas",
			"Escenas",
			"Overlay",
			"Canal",
		]);
		expect(count("components") + count("stream")).toBe(catalogComponents().length);
		expect(count("stream")).toBeGreaterThan(0);
	});

	it("groupOf acepta el nombre o el slug", () => {
		expect(groupOf("Button")?.label).toBe("Acciones");
		expect(groupOf("button-group")?.label).toBe("Acciones");
		expect(groupOf("ChannelBanner")?.id).toBe("stream-canal");
		expect(groupOf("Inexistente")).toBeUndefined();
	});
});

describe("catálogo de secciones y fundamentos", () => {
	it("la cabecera tiene las cinco secciones, en orden", () => {
		expect(SECTIONS.map((s) => [s.id, s.label])).toEqual([
			["start", "Empezar"],
			["foundations", "Fundamentos"],
			["components", "Componentes"],
			["stream", "Stream"],
			["icons", "Iconos"],
		]);
		expect(SECTIONS.every((s) => s.href.startsWith("/") && s.href.endsWith("/"))).toBe(true);
	});

	it("los fundamentos van en el orden de la guía, sin repetir y con las URLs nuevas", () => {
		const slugs = FOUNDATIONS.map((f) => f.slug);
		expect(slugs).toEqual([
			"principles",
			"content",
			"color",
			"typography",
			"layout",
			"states",
			"iconography",
			"backgrounds",
			"brand",
		]);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).not.toContain("spacing");
		expect(slugs).not.toContain("shadows");
	});

	it("sectionOf marca la sección de cada ruta", () => {
		expect(sectionOf("/")).toBeUndefined();
		expect(sectionOf("/start/install/")).toBe("start");
		expect(sectionOf("/foundations/color/")).toBe("foundations");
		expect(sectionOf("/foundations/stream/")).toBe("stream");
		expect(sectionOf("/components/")).toBe("components");
		expect(sectionOf("/components/button/")).toBe("components");
		expect(sectionOf("/components/stream-scene/")).toBe("stream");
		expect(sectionOf("/components/stream-scene/full/")).toBe("stream");
		expect(sectionOf("/components/channel-banner")).toBe("stream");
		expect(sectionOf("/icons/")).toBe("icons");
		expect(sectionOf("/changelog/")).toBeUndefined();
	});

	it("slugOf reproduce el de la navegación del diseño", () => {
		expect(slugOf("ButtonGroup")).toBe("button-group");
		expect(slugOf("InlineCTA")).toBe("inline-cta");
		expect(slugOf("button-group")).toBe("button-group");
	});

	it("anterior y siguiente no salen de la sección y los relacionados son los de su grupo", () => {
		expect(neighborsOf("Button")).toEqual({
			prev: undefined,
			next: "ButtonGroup",
			related: ["ButtonGroup", "ButtonUtility", "CloseButton", "SocialButton", "SocialButtonGroup"],
		});
		expect(neighborsOf("SocialButtonGroup").next).toBe("Input");
		// El último de Componentes no salta a Stream, ni el primero de Stream vuelve a Componentes
		expect(neighborsOf("AppIcon").next).toBeUndefined();
		expect(neighborsOf("StreamAlert")).toEqual({ prev: undefined, next: "StreamScene", related: [] });
		expect(neighborsOf("ChannelBanner").next).toBeUndefined();
		expect(neighborsOf("Ejemplo")).toEqual({ related: [] });
	});
});
