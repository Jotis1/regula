// La entrada `@jotis-me/icons/logos` (icon-set, «Logos de terceros» y «Logos accesibles»).
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it } from "vitest";
import * as main from "../src/index.js";
import * as logos from "../src/logos.js";

const pkg = join(import.meta.dirname, "..");

describe("@jotis-me/icons/logos", () => {
	it("exporta los 232 logos de apps, los 16 de integraciones y los 34 sociales, con sus grises, y las 10 insignias de tienda", () => {
		expect(logos.logoNames.app).toHaveLength(232);
		expect(logos.logoNames.integration).toHaveLength(32);
		expect(logos.logoNames.social).toHaveLength(68);
		expect(logos.logoNames.store).toHaveLength(10);
		const components = Object.keys(logos).filter((k) => /^[A-Z].*Logo(Gray)?$/.test(k));
		expect(components).toHaveLength(342);
		expect(logos).toHaveProperty("SocialGithubLogo");
		expect(logos).toHaveProperty("SocialGithubLogoGray");
		expect(logos).toHaveProperty("AppZapierLogo");
		expect(logos).toHaveProperty("IntegrationClaudeLogo");
	});

	it("la entrada principal no exporta ningún logo", () => {
		expect(Object.keys(main).filter((k) => /Logo(Gray)?$|^logoNames$|^makeLogo$/.test(k))).toEqual([]);
	});

	it("sin title es decorativo; con title, una imagen con ese nombre", () => {
		const { container } = render(
			<>
				<logos.SocialGithubLogo />
				<logos.SocialGithubLogo title="GitHub" />
			</>,
		);
		const [plain] = [...container.querySelectorAll("svg")];
		expect(plain?.getAttribute("aria-hidden")).toBe("true");
		expect(plain?.getAttribute("role")).toBeNull();
		const named = screen.getByRole("img", { name: "GitHub" });
		expect(named.querySelector("title")?.textContent).toBe("GitHub");
	});

	it("size fija el alto y el ancho sigue la proporción; por defecto, el tamaño del Figma", () => {
		const html = renderToStaticMarkup(
			<>
				<logos.AppZapierLogo />
				<logos.IntegrationClaudeLogo size={40} />
			</>,
		);
		expect(html).toContain('width="32" height="32"');
		expect(html).toContain('width="40" height="40"');
	});

	it("los grises monocromos pintan con currentColor", () => {
		const html = renderToStaticMarkup(<logos.SocialGithubLogoGray />);
		expect(html).toContain("currentColor");
	});

	describe("un import suelto no arrastra los demás", () => {
		const dir = mkdtempSync(join(tmpdir(), "logos-bundle-"));
		afterAll(() => rmSync(dir, { recursive: true, force: true }));

		it("al empaquetar solo SocialGithubLogo no entra ningún otro logo", () => {
			const built = join(pkg, "dist/logos.js");
			expect(existsSync(built), "hace falta `bun run build` antes").toBe(true);
			const entry = join(dir, "entry.js");
			writeFileSync(
				entry,
				`import { SocialGithubLogo } from ${JSON.stringify(built.replaceAll("\\", "/"))};\nexport default SocialGithubLogo;\n`,
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
			// El de GitHub sí (su ruta empieza en 428 104 dentro del marco del Figma); el de Zapier o los de apps no
			expect(code).toContain("social-github");
			expect(code).not.toContain("social-gitlab");
			expect(code).not.toContain("app-");
			expect(code).not.toContain("integration-");
			expect(code.length).toBeLessThan(20_000);
		});
	});
});
