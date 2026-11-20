// The design foundations as JSON, from the same collection as their pages (spec mcp-server, «Fundamentos en JSON»).
import { getCollection, render } from "astro:content";
import react from "@jotis-me/react/package.json";
import { type } from "@jotis-me/tokens";
import type { APIRoute } from "astro";
import { foundationsJson } from "../lib/foundations-json";
import { tokenSections } from "../lib/tokens";

export const GET: APIRoute = async ({ site }) => {
	const entries = await getCollection("foundations");
	// The anchors come from the same `render()` the page uses, so they are the page's and are not worked out twice
	const anchors = new Map(
		await Promise.all(
			entries.map(async (entry) => {
				const { headings } = await render(entry);
				return [entry.id, headings.filter((h) => h.depth === 2).map((h) => h.slug)] as const;
			}),
		),
	);
	return Response.json(
		foundationsJson(
			entries,
			{
				anchorsOf: (entry) => anchors.get(entry.id) ?? [],
				tokenSectionsOf: (id) => tokenSections(id, type.groups),
			},
			react.version,
			(site as URL).href,
		),
	);
};
