// `/mcp`, the only route that runs on the server. astro.config.mjs injects it in the Vercel build (design D2).
import type { APIRoute } from "astro";
import { loadData } from "./data";
import { handle } from "./server";

export const prerender = false;

export const ALL: APIRoute = ({ request, url }) => handle(request, { load: () => loadData(url.origin) });
