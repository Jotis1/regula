// Every design token as JSON, from `@jotis-me/tokens` (spec mcp-server, «Datos públicos en JSON»).
import react from "@jotis-me/react/package.json";
import source from "@jotis-me/tokens/tokens.json";
import type { APIRoute } from "astro";
import { published } from "../features/mcp/contract";
import { type TokensSource, tokensJson } from "../lib/tokens-json";

export const GET: APIRoute = () =>
	Response.json(published(tokensJson(source as unknown as TokensSource, react.version)));
