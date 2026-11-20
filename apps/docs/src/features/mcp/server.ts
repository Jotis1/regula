// The MCP server (spec mcp-server): stateless Streamable HTTP over Web `Request`/`Response`, so it runs on Vercel and
// in a test with no network. A server and a transport are created per request and nothing is kept between requests.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { API_VERSION } from "./contract";
import type { RegulaData } from "./data";
import { TOOLS } from "./tools";

export interface McpOptions {
	/** The data, loaded the first time a tool needs it: `initialize` and `tools/list` do not fetch anything. */
	load: () => Promise<RegulaData>;
}

export const SERVER_NAME = "regula";
const GUIDE = "https://regula.jotis.me/start/mcp/";

export function createServer({ load }: McpOptions): McpServer {
	// The version it announces is the contract's, not the one of the packages it documents (VER-012)
	const server = new McpServer({ name: SERVER_NAME, version: API_VERSION });
	for (const tool of TOOLS) {
		server.registerTool(
			tool.name,
			{
				title: tool.title,
				description: tool.description,
				inputSchema: tool.inputSchema,
				// Nothing here writes, deletes or calls another service (spec mcp-server, «Servidor MCP remoto»)
				annotations: {
					readOnlyHint: true,
					destructiveHint: false,
					idempotentHint: true,
					openWorldHint: false,
				},
			},
			async (args: Record<string, unknown>) => {
				try {
					const { text, isError } = tool.run(await load(), args);
					return { content: [{ type: "text" as const, text }], ...(isError ? { isError } : {}) };
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					return {
						content: [{ type: "text" as const, text: `${tool.name} failed: ${message}` }],
						isError: true,
					};
				}
			},
		);
	}
	return server;
}

/** Only `POST` carries MCP messages here; the rest is answered with a pointer to the guide. */
const notAllowed = () =>
	Response.json(
		{
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: `Method not allowed. Send MCP messages with POST. Guide: ${GUIDE}`,
			},
			id: null,
		},
		{ status: 405, headers: { Allow: "POST", Link: `<${GUIDE}>; rel="help"` } },
	);

export async function handle(request: Request, options: McpOptions): Promise<Response> {
	if (request.method !== "POST") return notAllowed();
	const server = createServer(options);
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true,
	});
	await server.connect(transport);
	try {
		return await transport.handleRequest(request);
	} finally {
		await server.close();
	}
}
