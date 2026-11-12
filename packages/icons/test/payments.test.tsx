import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it } from "vitest";
import { paymentSlug } from "../scripts/import-payments.ts";
import * as main from "../src/index.js";
import { PaymentApplePayMd, PaymentVisaMd, PaymentVisaSm, paymentNames } from "../src/payments.js";

const pkg = join(import.meta.dirname, "..");
const assets = join(pkg, "assets/payments");
const files = readdirSync(assets).filter((f) => f.endsWith(".svg"));
const read = (f: string) => readFileSync(join(assets, f), "utf8");
const SIZES = { sm: [34, 24], md: [46, 32] } as const;

describe("iconos de pago (assets/payments)", () => {
	it("56 métodos en sm y md", () => {
		expect(files).toHaveLength(112);
		const byMethod = new Map<string, string[]>();
		for (const f of files) {
			const m = f.match(/^(.*)-(sm|md)\.svg$/);
			expect(m, f).toBeTruthy();
			byMethod.set(m?.[1] as string, [...(byMethod.get(m?.[1] as string) ?? []), m?.[2] as string]);
		}
		expect(byMethod.size).toBe(56);
		for (const [method, sizes] of byMethod) expect(sizes.sort(), method).toEqual(["md", "sm"]);
	});

	it("nombra en kebab-case, separa las palabras juntas y corrige las erratas del Figma", () => {
		for (const f of files) expect(f, f).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*-(sm|md)\.svg$/);
		expect(paymentSlug("ApplePay")).toBe("apple-pay");
		expect(paymentSlug("Cash App Pay")).toBe("cash-app-pay");
		expect(paymentSlug("PayPal")).toBe("paypal");
		expect(paymentSlug("Etherium")).toBe("ethereum");
		expect(paymentSlug("Lightcoin")).toBe("litecoin");
		expect(paymentSlug("Ayden")).toBe("adyen");
		for (const needed of [
			"visa",
			"mastercard",
			"amex",
			"apple-pay",
			"google-pay",
			"paypal",
			"stripe",
			"bitcoin-cash",
		])
			expect(files, needed).toContain(`${needed}-md.svg`);
	});

	it("cada SVG tiene el tamaño de su variante y su viewBox, sin ids ni nada que no sea dibujo", () => {
		const problems: string[] = [];
		for (const f of files) {
			const svg = read(f);
			const size = f.match(/-(sm|md)\.svg$/)?.[1] as keyof typeof SIZES;
			const [w, h] = SIZES[size];
			const m = svg.match(
				/^<svg [^>]*width="([\d.]+)" height="([\d.]+)" viewBox="(\S+) (\S+) ([\d.]+) ([\d.]+)"/,
			);
			if (!m) problems.push(`${f}: cabecera inesperada`);
			else if (Number(m[1]) !== w || Number(m[2]) !== h || Number(m[5]) !== w || Number(m[6]) !== h)
				problems.push(`${f}: tamaño ${m[1]}×${m[2]}, viewBox ${m[5]}×${m[6]}, esperado ${w}×${h}`);
			if (/<(image|foreignObject|script|style)\b/i.test(svg))
				problems.push(`${f}: elemento no permitido`);
			// Los ids de dentro (máscaras, degradados) llevan el prefijo del icono para que dos no choquen
			const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1] as string);
			if (new Set(ids).size !== ids.length) problems.push(`${f}: ids repetidos`);
			for (const id of ids) if (!id.startsWith("p-")) problems.push(`${f}: id «${id}» sin prefijo`);
		}
		expect(problems).toEqual([]);
	});
});

describe("componentes de iconos de pago", () => {
	it("paymentNames lista los mismos ficheros", () => {
		expect([...paymentNames].sort()).toEqual(files.map((f) => f.replace(/\.svg$/, "")).sort());
	});

	it("es decorativo por defecto y se mide por su alto", () => {
		const { container } = render(<PaymentVisaMd />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("height")).toBe("32");
		expect(svg?.getAttribute("width")).toBe("46");
		const small = render(<PaymentVisaSm />).container.querySelector("svg");
		expect(small?.getAttribute("width")).toBe("34");
		expect(small?.getAttribute("height")).toBe("24");
	});

	it("con title es una imagen con ese nombre", () => {
		render(<PaymentApplePayMd title="Apple Pay" />);
		expect(screen.getByRole("img", { name: "Apple Pay" })).toBeTruthy();
	});

	it("la entrada principal no exporta ninguno", () => {
		expect(Object.keys(main).filter((k) => k.startsWith("Payment") || k === "paymentNames")).toEqual([]);
	});
});

describe("publicación", () => {
	const dist = join(pkg, "dist");
	const dir = mkdtempSync(join(tmpdir(), "payments-bundle-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("dist/payments tiene los mismos SVG", () => {
		expect(existsSync(join(dist, "payments")), "hace falta `bun run build` antes").toBe(true);
		expect(readdirSync(join(dist, "payments")).sort()).toEqual([...files].sort());
	});

	it("al empaquetar solo PaymentVisaMd no entra ningún otro icono", () => {
		const built = join(dist, "payments.js");
		expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
		const entry = join(dir, "entry.js");
		writeFileSync(
			entry,
			`import { PaymentVisaMd } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default PaymentVisaMd;\n`,
		);
		const out = join(dir, "out.js");
		const run = spawnSync(
			"bun",
			[
				"build",
				entry,
				"--outfile",
				out,
				"--minify",
				"--external",
				"react",
				"--external",
				"react/jsx-runtime",
			],
			{ encoding: "utf8" },
		);
		expect(run.status, run.stderr).toBe(0);
		const code = readFileSync(out, "utf8");
		const firstPath = (f: string) => read(f).match(/<path d="([^"]+)"/)?.[1] as string;
		expect(code).toContain(firstPath("visa-md.svg"));
		const leaked = files
			.filter((f) => f !== "visa-md.svg")
			.filter((f) => {
				const d = firstPath(f);
				return d && d.length > 60 && code.includes(d);
			});
		expect(leaked).toEqual([]);
	});
});
