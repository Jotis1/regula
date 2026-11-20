// Every standard as JSON, from the same collection as the pages (spec engineering-standards, «Normas en JSON»).
import { getCollection } from "astro:content";
import react from "@jotis-me/react/package.json";
import type { APIRoute } from "astro";
import { published } from "../features/mcp/contract";
import { standardsJson } from "../lib/standards";

export const GET: APIRoute = async ({ site }) => {
	const areas = await getCollection("standards");
	return Response.json(published(standardsJson(areas, react.version, (site as URL).href)));
};
