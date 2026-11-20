// Every icon gallery as JSON (spec mcp-server, «Datos públicos en JSON»).
import react from "@jotis-me/react/package.json";
import type { APIRoute } from "astro";
import { published } from "../features/mcp/contract";
import { galleryEntries } from "../lib/gallery-entries";
import { GALLERIES, iconsJson } from "../lib/icons-json";

export const GET: APIRoute = ({ site }) => {
	const galleries = Object.fromEntries(GALLERIES.map((kind) => [kind, galleryEntries(kind)]));
	return Response.json(
		published(iconsJson(galleries as Parameters<typeof iconsJson>[0], react.version, (site as URL).href)),
	);
};
