// What the MCP answers with: the four public JSON files of the same deployment (spec mcp-server, «Datos públicos en
// JSON»). The server has no other source, so a tool returns byte for byte what the site publishes.
import type { componentsJson } from "../../lib/components-json";
import type { iconsJson } from "../../lib/icons-json";
import type { standardsJson } from "../../lib/standards";
import type { tokensJson } from "../../lib/tokens-json";

export type StandardsData = ReturnType<typeof standardsJson>;
export type ComponentsData = ReturnType<typeof componentsJson>;
export type TokensData = ReturnType<typeof tokensJson>;
export type IconsData = ReturnType<typeof iconsJson>;

export interface RegulaData {
	standards: StandardsData;
	components: ComponentsData;
	tokens: TokensData;
	icons: IconsData;
}

export type Fetcher = (url: string) => Promise<Response>;

const cache = new Map<string, Promise<RegulaData>>();

async function json<T>(origin: string, path: string, get: Fetcher): Promise<T> {
	const response = await get(new URL(path, origin).href);
	if (!response.ok) throw new Error(`${path} answered ${response.status}`);
	return (await response.json()) as T;
}

/**
 * Downloads the four JSON files from the origin that serves `/mcp`. They are kept in memory while the instance lives;
 * a failure is not kept, so the next request tries again.
 */
export function loadData(origin: string, get: Fetcher = (url) => fetch(url)): Promise<RegulaData> {
	const cached = cache.get(origin);
	if (cached) return cached;
	const loading = Promise.all([
		json<StandardsData>(origin, "/standards.json", get),
		json<ComponentsData>(origin, "/components.json", get),
		json<TokensData>(origin, "/tokens.json", get),
		json<IconsData>(origin, "/icons.json", get),
	]).then(([standards, components, tokens, icons]) => ({ standards, components, tokens, icons }));
	cache.set(origin, loading);
	loading.catch(() => cache.delete(origin));
	return loading;
}
