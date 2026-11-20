// The version of the contract (spec mcp-server, «Versión del contrato» and «Historial del contrato»): the tools the
// server has are the ones the contract lists, and the history is up to date. Whether a change of parameters is
// compatible cannot be told by a test: that is checked in review (VER-012).
import { describe, expect, it } from "vitest";
import {
	API_HISTORY,
	API_VERSION,
	CONTRACT_FILES,
	CONTRACT_TOOLS,
	historyTerms,
	published,
} from "../src/features/mcp/contract";
import { TOOLS } from "../src/features/mcp/tools";

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;
const parts = (version: string) => (SEMVER.exec(version) ?? []).slice(1).map(Number);

describe("contrato del MCP", () => {
	it("las herramientas del servidor son las del contrato: si cambian, hay que subir la versión", () => {
		expect(
			TOOLS.map((t) => t.name),
			"Las herramientas han cambiado: actualiza CONTRACT_TOOLS, sube API_VERSION como pide SemVer y añade la versión a API_HISTORY (src/features/mcp/contract.ts)",
		).toEqual([...CONTRACT_TOOLS]);
	});

	it("la versión más reciente del historial es la que anuncia el servidor", () => {
		expect(API_HISTORY[0]?.version).toBe(API_VERSION);
	});

	it("las versiones del historial son SemVer y bajan de una a otra, con su fecha y sus cambios", () => {
		for (const entry of API_HISTORY) {
			expect(entry.version).toMatch(SEMVER);
			expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(entry.changes.length).toBeGreaterThan(0);
		}
		const order = API_HISTORY.map((entry) => parts(entry.version).reduce((sum, n) => sum * 1000 + n, 0));
		expect(order).toEqual([...order].sort((a, b) => b - a));
		expect(new Set(order).size).toBe(order.length);
	});

	it("el historial nombra las herramientas y los JSON de cada versión", () => {
		const text = API_HISTORY.flatMap((entry) => entry.changes).join(" ");
		for (const name of [...CONTRACT_TOOLS, ...CONTRACT_FILES])
			expect(text, name).toContain(`\`${name}\``);
	});

	it("la página lista una entrada por versión, con la fecha en español", () => {
		expect(historyTerms().map((t) => t.term)).toEqual(["1.1.0", "1.0.0"]);
		expect(historyTerms()[1]?.text).toMatch(/^16 nov 2026\. Siete herramientas/);
	});

	it("un JSON publicado lleva la versión del contrato junto a la de Regula", () => {
		expect(published({ version: "1.2.3", tokens: [] })).toEqual({
			version: "1.2.3",
			apiVersion: API_VERSION,
			tokens: [],
		});
	});
});
