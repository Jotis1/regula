// Parte la guía (reference/GUIA.md) en una página por apartado: src/content/foundations/*.md.
// Lo que dice cada página es el texto de la guía tal cual. Uso: bun run scripts/split-guide.ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const guide = readFileSync(join(import.meta.dirname, "../../../reference/GUIA.md"), "utf8");
const [intro = "", ...sections] = guide.split(/^## /m);

/** Apartado de la guía → página de la web, en el orden de la navegación. */
const pages: Record<string, { slug: string; title: string; description: string }> = {
	Principios: {
		slug: "principles",
		title: "Principios",
		description: "Neutro primero, una acción principal, profundidad sutil.",
	},
	"Contenido y tono": {
		slug: "content",
		title: "Contenido y tono",
		description: "Voz cercana y con humor seco, castellano de España, formatos de cifras y fechas.",
	},
	Color: { slug: "color", title: "Color", description: "Tokens semánticos de color en claro y oscuro." },
	Tipografía: {
		slug: "typography",
		title: "Tipografía",
		description: "Geist, Geist Mono y Bricolage Grotesque.",
	},
	"Espaciado, radios y layout": {
		slug: "spacing",
		title: "Espaciado, radios y layout",
		description: "Escala de espaciado, radios, contenedor y anchos.",
	},
	"Sombras y estados": {
		slug: "shadows",
		title: "Sombras y estados",
		description: "Sombras, hover, deshabilitado y foco.",
	},
	Iconografía: {
		slug: "iconography",
		title: "Iconografía",
		description: "Iconos de línea de 24×24 y trazo de 2px.",
	},
	"Fondos y adornos": {
		slug: "backgrounds",
		title: "Fondos y adornos",
		description: "Banners, patrones de fondo, trazos a mano y maquetas.",
	},
	Marca: {
		slug: "brand",
		title: "Marca e iconos de app",
		description: "La marca jotis.me y los iconos de cada app.",
	},
};

// El párrafo de gráficas está en «Uso en el propio sistema» pero es una regla de color
const charts = guide.match(/^\*\*Gráficas\.\*\*.*$/m)?.[0];

let order = 0;
for (const section of sections) {
	const heading = section.slice(0, section.indexOf("\n")).trim();
	const page = pages[heading];
	if (!page) continue; // «Con Tailwind v4» y «Uso en el propio sistema» se reescriben para los paquetes
	let body = section.slice(section.indexOf("\n") + 1).trim();
	if (page.slug === "principles") body = `${intro.trim()}\n\n${body}`;
	// Los subapartados (### …) pasan a ser apartados de la página (## …)
	body = body.replace(/^### /gm, "## ");
	if (page.slug === "color" && charts) body = `${body}\n\n${charts}`;
	order++;
	writeFileSync(
		join(import.meta.dirname, `../src/content/foundations/${page.slug}.md`),
		`---\ntitle: ${JSON.stringify(page.title)}\ndescription: ${JSON.stringify(page.description)}\norder: ${order}\n---\n\n${body}\n`,
	);
	console.log(`${page.slug}.md ← «${heading}»`);
}
