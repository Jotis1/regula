// Every component as JSON, from the same collection as the pages (spec mcp-server, «Datos públicos en JSON»).
import { getCollection } from "astro:content";
import { join } from "node:path";
import react from "@jotis-me/react/package.json";
import type { APIRoute } from "astro";
import { type ComponentEntry, componentsJson } from "../lib/components-json";
import { nativeOf, propsOf } from "../lib/props";
import { snippetsOf } from "../lib/snippets";

export const GET: APIRoute = async ({ site }) => {
	const pages = await getCollection("components");
	const entries = pages.map((p) => ({ id: p.id, data: p.data, body: p.body }));
	// The build runs in apps/docs: the props come from the component's source, as in its page
	const sourceOf = (e: ComponentEntry) =>
		join(process.cwd(), "../..", e.data.source ?? `packages/react/src/components/${e.data.name}.tsx`);
	return Response.json(
		componentsJson(
			entries,
			{
				propsOf: (e) => propsOf(sourceOf(e), e.data.name),
				nativeOf: (e) => nativeOf(sourceOf(e), e.data.name),
				snippetsOf,
			},
			react.version,
			(site as URL).href,
		),
	);
};
