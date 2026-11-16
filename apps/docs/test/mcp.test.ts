// The MCP server end to end (spec mcp-server, «Servidor comprobado»): a real MCP client talks to `handle` through a
// fetch that calls the handler directly, with no network.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { describe, expect, it } from "vitest";
import { loadData } from "../src/mcp/data";
import { handle, SERVER_NAME } from "../src/mcp/server";
import { TOOLS } from "../src/mcp/tools";
import { data, VERSION } from "./mcp-fixture";

const URL_MCP = "https://regula.jotis.me/mcp";
const options = { version: VERSION, load: async () => data };

async function connect() {
	const transport = new StreamableHTTPClientTransport(new URL(URL_MCP), {
		fetch: (input, init) => handle(new Request(input, init), options),
	});
	const client = new Client({ name: "test", version: "0.0.0" });
	await client.connect(transport);
	return client;
}

const text = (result: Awaited<ReturnType<Client["callTool"]>>) =>
	(result.content as { type: string; text: string }[])[0]?.text ?? "";

describe("conexión", () => {
	it("initialize devuelve el nombre, la versión y la capacidad de herramientas, sin credenciales", async () => {
		const client = await connect();
		expect(client.getServerVersion()).toMatchObject({ name: SERVER_NAME, version: VERSION });
		expect(client.getServerCapabilities()).toHaveProperty("tools");
		await client.close();
	});

	it("tools/list devuelve las siete herramientas, todas de solo lectura", async () => {
		const client = await connect();
		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toEqual(TOOLS.map((t) => t.name));
		expect(tools).toHaveLength(7);
		for (const t of tools) {
			expect(t.annotations?.readOnlyHint, t.name).toBe(true);
			expect(t.annotations?.openWorldHint, t.name).toBe(false);
		}
		await client.close();
	});

	it("un GET responde 405 con un enlace a la guía", async () => {
		const response = await handle(new Request(URL_MCP), options);
		expect(response.status).toBe(405);
		expect(response.headers.get("Allow")).toBe("POST");
		expect(await response.text()).toContain("https://regula.jotis.me/start/mcp/");
	});
});

describe("una llamada con éxito y otra con error por herramienta", () => {
	const cases: {
		name: string;
		ok: Record<string, unknown>;
		okText: string;
		bad: Record<string, unknown>;
		badText: string;
	}[] = [
		{ name: "list_standards", ok: {}, okText: "NOM-001", bad: { area: "seo" }, badText: "naming" },
		{
			name: "get_standard",
			ok: { id: "git-001" },
			okText: "GIT-001",
			bad: { id: "NOM-999" },
			badText: "list_standards",
		},
		{
			name: "list_components",
			ok: { group: "acciones" },
			okText: "Button",
			bad: { group: "nada" },
			badText: "acciones",
		},
		{
			name: "get_component",
			ok: { name: "button" },
			okText: "hierarchy",
			bad: { name: "Botón" },
			badText: "Button",
		},
		{
			name: "search_tokens",
			ok: { query: "text-secondary" },
			okText: "text-secondary",
			bad: {},
			badText: "query",
		},
		{ name: "search_icons", ok: { query: "search-lg" }, okText: "SearchLg", bad: {}, badText: "query" },
		{ name: "search", ok: { query: "dominio inverso" }, okText: "NOM-001", bad: {}, badText: "query" },
	];

	for (const c of cases)
		it(c.name, async () => {
			const client = await connect();
			const success = await client.callTool({ name: c.name, arguments: c.ok });
			expect(success.isError).toBeFalsy();
			expect(text(success)).toContain(c.okText);
			const failure = await client.callTool({ name: c.name, arguments: c.bad });
			expect(failure.isError, "error de herramienta, no de protocolo").toBe(true);
			expect(text(failure)).toContain(c.badText);
			await client.close();
		});

	it("cubre todas las herramientas", () => {
		expect(cases.map((c) => c.name)).toEqual(TOOLS.map((t) => t.name));
	});

	it("un límite fuera de rango es un error de herramienta que nombra el parámetro", async () => {
		const client = await connect();
		const result = await client.callTool({
			name: "search_tokens",
			arguments: { query: "text", limit: 500 },
		});
		expect(result.isError).toBe(true);
		expect(text(result)).toContain("limit");
		await client.close();
	});
});

describe("loadData", () => {
	const files: Record<string, unknown> = {
		"/standards.json": data.standards,
		"/components.json": data.components,
		"/tokens.json": data.tokens,
		"/icons.json": data.icons,
	};

	it("descarga los cuatro JSON del mismo origen y los guarda", async () => {
		const asked: string[] = [];
		const get = async (url: string) => {
			asked.push(url);
			return Response.json(files[new URL(url).pathname]);
		};
		const first = await loadData("https://a.example", get);
		await loadData("https://a.example", get);
		expect(first.standards.version).toBe(VERSION);
		expect(asked.sort()).toEqual(
			Object.keys(files)
				.map((p) => `https://a.example${p}`)
				.sort(),
		);
	});

	it("un fallo no se guarda: la siguiente petición lo vuelve a intentar", async () => {
		let up = false;
		const get = async (url: string) =>
			up ? Response.json(files[new URL(url).pathname]) : new Response("no", { status: 503 });
		await expect(loadData("https://b.example", get)).rejects.toThrow(/503/);
		up = true;
		await expect(loadData("https://b.example", get)).resolves.toHaveProperty("tokens");
	});
});
