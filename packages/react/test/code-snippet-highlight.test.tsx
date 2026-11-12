import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CodeSnippet } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const SIX = "const a = 1\nconst b = 2\nconst c = 3\nconst d = 4\nconst e = 5\nconst f = 6";
const marked = (container: HTMLElement) =>
	[...container.querySelectorAll<HTMLElement>("code > span.bg-brand-primary_alt")].map(
		(el) => el.textContent,
	);

describe("CodeSnippet: líneas destacadas", () => {
	it("las líneas marcadas llevan fondo y raya de marca, y las demás no", () => {
		const { container } = render(<CodeSnippet code={SIX} highlight={[4, 5]} language="js" />);
		const lines = container.querySelectorAll<HTMLElement>("code > span.bg-brand-primary_alt");
		expect(lines).toHaveLength(2);
		const el = lines[0] as HTMLElement;
		expect(el.className).toContain("bg-brand-primary_alt");
		expect(el.className).toContain("shadow-[inset_2px_0_0_var(--fg-brand-primary)]");
		expect(el.textContent).toContain("const d = 4");
		expect(el.textContent).not.toContain("const c = 3");
		expect(container.querySelector("code")?.textContent).toContain("const a = 1\nconst b = 2\n");
	});

	it("cada línea marcada es su propio elemento, también las seguidas", () => {
		const { container } = render(<CodeSnippet code={SIX} highlight={[4, 5]} />);
		expect(marked(container)).toEqual(["línea destacadaconst d = 4", "const e = 5"]);
	});

	it("un texto oculto por bloque de líneas seguidas", () => {
		const { container } = render(<CodeSnippet code={SIX} highlight={[1, 2, 4, 6]} />);
		expect(screen.getAllByText("línea destacada")).toHaveLength(3);
		const hidden = container.querySelectorAll("code .sr-only");
		expect(hidden).toHaveLength(3);
		for (const h of hidden) expect(h.className).toContain("sr-only");
		// El texto oculto abre cada bloque: va en la primera línea de cada uno
		expect(marked(container)).toEqual([
			"línea destacadaconst a = 1",
			"const b = 2",
			"línea destacadaconst d = 4",
			"línea destacadaconst f = 6",
		]);
	});

	it("el código copiado y el texto no cambian", () => {
		const { container } = render(<CodeSnippet code={"a\nb\nc"} highlight={[2]} />);
		const text = container.querySelector("code")?.textContent ?? "";
		expect(text.replace("línea destacada", "")).toBe("a\nb\nc");
	});

	it("ignora números fuera del código", () => {
		const { container } = render(<CodeSnippet code="a\nb" highlight={[0, 9, 1.5, -1]} />);
		expect(container.querySelector("code .bg-brand-primary_alt")).toBeNull();
		expect(screen.queryByText("línea destacada")).toBeNull();
	});

	it("sin highlight, el HTML es el de antes", () => {
		const html = renderToStaticMarkup(<CodeSnippet code="const a = 1" language="js" />);
		expect(html).toContain('<code><span class="text-utility-pink-600">const</span> a = 1</code>');
		expect(html).not.toContain("bg-brand-primary_alt");
		expect(renderToStaticMarkup(<CodeSnippet code="const a = 1" highlight={[]} />)).toBe(
			renderToStaticMarkup(<CodeSnippet code="const a = 1" />),
		);
	});

	it("un comentario de varias líneas conserva su color en cada una", () => {
		const { container } = render(<CodeSnippet code={"/* uno\ndos */\nx"} highlight={[2]} />);
		const line = container.querySelector("code > span.bg-brand-primary_alt") as HTMLElement;
		expect(line.querySelector(".text-utility-green-700")?.textContent).toBe("dos */");
	});

	it("cambiar de pestaña usa el highlight de la pestaña", async () => {
		const { container } = render(
			<CodeSnippet
				tabs={[
					{ label: "npm", code: "uno\ndos\ntres", highlight: [1] },
					{ label: "bun", code: "uno\ndos\ntres", highlight: [3] },
					{ label: "pnpm", code: "uno\ndos\ntres" },
				]}
			/>,
		);
		expect(marked(container)).toEqual(["línea destacadauno"]);
		await userEvent.click(screen.getByRole("tab", { name: "bun" }));
		expect(marked(container)).toEqual(["línea destacadatres"]);
		await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
		expect(marked(container)).toEqual([]);
	});

	it("el highlight del bloque vale para las pestañas que no llevan el suyo", async () => {
		const { container } = render(
			<CodeSnippet
				highlight={[2]}
				tabs={[
					{ label: "npm", code: "uno\ndos\ntres" },
					{ label: "bun", code: "uno\ndos\ntres", highlight: [3] },
				]}
			/>,
		);
		expect(marked(container)).toEqual(["línea destacadados"]);
		await userEvent.click(screen.getByRole("tab", { name: "bun" }));
		expect(marked(container)).toEqual(["línea destacadatres"]);
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(<CodeSnippet code={SIX} highlight={[2, 3]} />);
	});
});
