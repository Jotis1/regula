// `/mcp`, the only route that runs on the server. astro.config.mjs injects it in the Vercel build (design D2).
import react from "@jotis-me/react/package.json";
import type { APIRoute } from "astro";
import { loadData } from "./data";
import { handle } from "./server";

export const prerender = false;

export const ALL: APIRoute = ({ request, url }) =>
	handle(request, { version: react.version, load: () => loadData(url.origin) });
