// `/start/mcp/` lists the tools from the server's own registry (spec docs-site, «Página del MCP»): the Spanish text of
// each tool lives in src/features/mcp/guide.ts, and neither side can drift from the other.
import { describe, expect, it } from "vitest";
import { TOOL_GUIDE, toolTerms } from "../src/features/mcp/guide";
import { TOOLS } from "../src/features/mcp/tools";

describe("guía del MCP", () => {
	it("cada herramienta tiene su texto, en el orden de tools/list", () => {
		expect(toolTerms().map((t) => t.term)).toEqual(TOOLS.map((t) => t.name));
	});

	it("no sobra el texto de una herramienta que ya no existe", () => {
		expect(Object.keys(TOOL_GUIDE).sort()).toEqual(TOOLS.map((t) => t.name).sort());
	});
});
