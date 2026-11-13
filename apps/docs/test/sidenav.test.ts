import { loadRenderers } from "astro:container";
import { getContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import SideNav from "../src/components/SideNav.astro";
import { COMPONENT_GROUPS, FOUNDATIONS } from "../src/lib/catalog";
import { navSectionOf, sidebarTree } from "../src/nav";

const groups = (section: "components" | "stream") => COMPONENT_GROUPS.filter((g) => g.section === section);

describe("sidebarTree, en el lateral", () => {
	it("Componentes: «Todos los componentes» y los doce grupos con su recuento", () => {
		const { items } = sidebarTree("/components/button/", "section");
		expect(items[0]).toMatchObject({ label: "Todos los componentes", href: "/components/" });
		const parents = items.slice(1);
		expect(parents).toHaveLength(12);
		expect(parents.map((p) => [p.label, p.badge])).toEqual(
			groups("components").map((g) => [g.label, String(g.components.length)]),
		);
	});

	it("marca la página actual y su grupo", () => {
		const { items } = sidebarTree("/components/button/", "section");
		const acciones = items.find((i) => i.label === "Acciones");
		expect(acciones?.children?.find((c) => c.active)?.href).toBe("/components/button/");
		expect(items.flatMap((i) => i.children ?? []).filter((c) => c.active)).toHaveLength(1);
	});

	it("Stream: la guía y sus cuatro grupos", () => {
		const { items } = sidebarTree("/components/stream-scene/", "section");
		expect(items[0]).toMatchObject({ href: "/foundations/stream/" });
		expect(items.slice(1)).toHaveLength(4);
		expect(sidebarTree("/foundations/stream/", "section").items[0]?.active).toBe(true);
	});

	it("Fundamentos y Empezar: solo páginas, sin grupos", () => {
		const found = sidebarTree("/foundations/color/", "section").items;
		expect(found).toHaveLength(FOUNDATIONS.length);
		expect(found.every((i) => i.href && !i.children)).toBe(true);
		const start = sidebarTree("/start/install/", "section").items;
		expect(start.map((i) => i.href)).toEqual(["/", "/start/install/"]);
	});

	it("la portada, el historial y la 404 caen en Empezar", () => {
		for (const path of ["/", "/changelog/", "/esto-no-existe/"]) expect(navSectionOf(path)).toBe("start");
	});

	it("«tabla» llega a Table por las palabras clave", () => {
		const { keywords } = sidebarTree("/components/button/", "section");
		expect(keywords["/components/table/"]).toContain("tabla");
	});
});

describe("sidebarTree, en el menú", () => {
	it("lleva los cinco bloques y solo abre el de la página actual", () => {
		const { items } = sidebarTree("/foundations/color/", "all");
		expect(items.map((i) => [i.label, i.defaultOpen])).toEqual([
			["Empezar", false],
			["Fundamentos", true],
			["Componentes", false],
			["Stream", false],
			["Iconos", false],
		]);
	});

	it("los grupos son enlaces a su ancla y el filtro los encuentra por sus componentes", () => {
		const { items, keywords } = sidebarTree("/components/button/", "all");
		const components = items.find((i) => i.label === "Componentes");
		expect(components?.defaultOpen).toBe(true);
		expect(components?.children?.map((c) => c.href)).toEqual([
			"/components/",
			...groups("components").map((g) => `/components/#${g.id}`),
		]);
		expect(keywords["/components/#datos"]).toContain("tabla");
		expect(items.find((i) => i.label === "Stream")?.children).toHaveLength(5);
	});
});

describe("SideNav", () => {
	let html: Record<string, string> = {};
	beforeAll(async () => {
		const renderers = await loadRenderers([getContainerRenderer()]);
		const container = await AstroContainer.create({ renderers });
		const render = (props: Record<string, unknown>) =>
			container.renderToString(SideNav, {
				props,
				request: new Request("https://regula.jotis.me/components/button/"),
			});
		html = {
			lateral: await render({ current: "/components/button/" }),
			menu: await render({ current: "/components/button/", idPrefix: "menu" }),
		};
	});

	it("pinta en el servidor los <details> con el grupo actual abierto y aria-current", () => {
		const { lateral } = html;
		expect(lateral).toContain('aria-label="Documentación"');
		expect(lateral).toMatch(/<details[^>]* open[^>]*>/);
		expect(lateral).toContain('aria-current="page"');
		expect(lateral.match(/<details/g)).toHaveLength(12);
	});

	it("esconde el filtro hasta que el script lo activa", () => {
		expect(html.lateral).toContain(":not([data-docnav-ready])&gt;nav&gt;*:has(input)]:hidden");
		expect(html.lateral).toContain('aria-label="Filtrar navegación"');
	});

	it("el menú lleva los cinco bloques y sus propios ids", () => {
		expect(html.menu?.match(/<details/g)).toHaveLength(5);
		// Los ids del campo los pone React con un prefijo por componente dentro de una misma página (aquí cada
		// render es una página aparte, así que se comprueba en el e2e); los de SideNav llevan el `idPrefix`
		expect(html.lateral).toContain('id="docnav-keywords"');
		expect(html.menu).toContain('id="menu-keywords"');
	});
});
