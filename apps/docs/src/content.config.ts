import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const foundations = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/foundations" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number(),
	}),
});

// Una página por componente: el cuerpo es su ficha de la guía; los ejemplos son los de la paridad visual
// y los fragmentos de código salen de src/lib/snippets.ts.
const components = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/components" }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		/** Necesita `client:*` en Astro para responder. */
		interactive: z.boolean(),
		/** Aviso bajo el fragmento de Astro (props función, islas). */
		astroNote: z.string().optional(),
		/** Fuente de sus tipos, si no es packages/react/src/components/<name>.tsx (relativa a la raíz). */
		source: z.string().optional(),
	}),
});

export const collections = { foundations, components };
