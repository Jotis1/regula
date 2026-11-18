// SEC-012 (A02): las cabeceras de seguridad que Vercel envía en todas las rutas de la web. `astro preview` no lee
// vercel.json, así que el e2e no las ve: este test lee el archivo, y tras el despliegue se mira la respuesta real.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

interface VercelConfig {
	headers?: { source: string; headers: { key: string; value: string }[] }[];
}

const config = JSON.parse(
	readFileSync(fileURLToPath(new URL("../vercel.json", import.meta.url)), "utf8"),
) as VercelConfig;

/** Las cabeceras de la regla que cubre todas las rutas, por nombre en minúsculas. */
function headersForAllRoutes(c: VercelConfig): Map<string, string> {
	const rule = c.headers?.find((h) => h.source === "/(.*)");
	return new Map((rule?.headers ?? []).map((h) => [h.key.toLowerCase(), h.value]));
}

describe("cabeceras de seguridad de la web (SEC-012)", () => {
	const headers = headersForAllRoutes(config);

	it("se aplican a todas las rutas", () => {
		expect(config.headers?.some((h) => h.source === "/(.*)")).toBe(true);
	});

	it("la CSP de la cabecera impide que otra web la enmarque", () => {
		expect(headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
	});

	it("fuerza HTTPS durante al menos un año", () => {
		const hsts = headers.get("strict-transport-security") ?? "";
		const maxAge = Number(/max-age=(\d+)/.exec(hsts)?.[1] ?? 0);
		expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
	});

	it("no deja adivinar el tipo de un archivo", () => {
		expect(headers.get("x-content-type-options")).toBe("nosniff");
	});

	it("no manda la ruta completa a otros orígenes", () => {
		expect(headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
	});

	it("apaga la cámara, el micrófono y la ubicación, que la web no usa", () => {
		const policy = headers.get("permissions-policy") ?? "";
		for (const feature of ["camera", "microphone", "geolocation"])
			expect(policy).toContain(`${feature}=()`);
	});
});
