import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CodeSnippet, Tabs } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const TABS_BEFORE: string[] = [
	'<template></template><div class="" data-rac="" data-orientation="horizontal"><div class="flex font-body gap-3 shadow-[inset_0_-1px_0_var(--border-secondary)]" data-rac="" data-collection="react-aria-_R_6_" id="react-aria-_R_6H1_" aria-label="Secciones" role="tablist" aria-orientation="horizontal" data-orientation="horizontal"><div class="group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap py-2 font-semibold text-quaternary outline-none transition-colors duration-100 data-hovered:text-secondary data-focus-visible:shadow-focus-ring text-sm h-auto rounded-none px-1 pt-0 pb-3 data-selected:text-brand-secondary data-selected:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)] data-selected:data-focus-visible:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]" data-rac="" tabindex="-1" data-collection="react-aria-_R_6_" data-key="a" data-react-aria-pressable="true" id="react-aria-_R_6H1_-tab-a" aria-selected="true" role="tab" data-selected="true">Resumen</div><div class="group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap py-2 font-semibold text-quaternary outline-none transition-colors duration-100 data-hovered:text-secondary data-focus-visible:shadow-focus-ring text-sm h-auto rounded-none px-1 pt-0 pb-3 data-selected:text-brand-secondary data-selected:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)] data-selected:data-focus-visible:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]" data-rac="" tabindex="-1" data-collection="react-aria-_R_6_" data-key="b" data-react-aria-pressable="true" id="react-aria-_R_6H1_-tab-b" aria-selected="false" role="tab">Movimientos<span class="rounded-full bg-utility-neutral-50 px-2 text-xs font-medium text-utility-neutral-700 inset-ring inset-ring-utility-neutral-200 group-data-selected:bg-utility-brand-50 group-data-selected:text-utility-brand-700 group-data-selected:inset-ring-utility-brand-200">12</span></div></div></div>',
	'<template></template><div class="" data-rac="" data-orientation="horizontal"><div class="gap-1 font-body inline-flex w-fit rounded-lg bg-secondary_alt p-1 shadow-[inset_0_0_0_1px_var(--border-secondary)]" data-rac="" data-collection="react-aria-_R_6_" id="react-aria-_R_6H1_" aria-label="Modo" role="tablist" aria-orientation="horizontal" data-orientation="horizontal"><div class="group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-semibold text-quaternary outline-none transition-colors duration-100 data-hovered:text-secondary data-focus-visible:shadow-focus-ring h-11 text-md data-selected:bg-primary_alt data-selected:text-secondary data-selected:shadow-sm" data-rac="" tabindex="-1" data-collection="react-aria-_R_6_" data-key="a" data-react-aria-pressable="true" id="react-aria-_R_6H1_-tab-a" aria-selected="true" role="tab" data-selected="true">Resumen</div><div class="group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-semibold text-quaternary outline-none transition-colors duration-100 data-hovered:text-secondary data-focus-visible:shadow-focus-ring h-11 text-md data-selected:bg-primary_alt data-selected:text-secondary data-selected:shadow-sm" data-rac="" tabindex="-1" data-collection="react-aria-_R_6_" data-key="b" data-react-aria-pressable="true" id="react-aria-_R_6H1_-tab-b" aria-selected="false" role="tab">Movimientos<span class="rounded-full bg-utility-neutral-50 px-2 text-xs font-medium text-utility-neutral-700 inset-ring inset-ring-utility-neutral-200 group-data-selected:bg-utility-brand-50 group-data-selected:text-utility-brand-700 group-data-selected:inset-ring-utility-brand-200">12</span></div></div></div>',
];
const CODE_BEFORE: string[] = [
	'<div class="relative overflow-hidden rounded-xl border border-secondary bg-primary font-body"><div class="relative flex"><div aria-hidden="true" class="flex-none bg-secondary px-4 py-5 text-right font-mono text-code-sm text-quaternary shadow-[inset_-1px_0_0_var(--border-secondary)] select-none"><div>1</div><div>2</div></div><pre tabindex="0" class="m-0 flex-1 overflow-auto p-5 pr-14 font-mono text-code-sm text-primary [tab-size:2] focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none"><code><span class="text-utility-pink-600">const</span> a = 1\n<span class="text-utility-green-700">// nota</span></code></pre><button type="button" aria-label="Copiar código" class="absolute top-3 right-3 inline-flex cursor-pointer rounded-md border-0 bg-primary p-1.5 text-fg-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 15C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12V5.2C2 4.0799 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H12C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5M12.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V12.2C22 11.0799 22 10.5198 21.782 10.092C21.5903 9.71569 21.2843 9.40973 20.908 9.21799C20.4802 9 19.9201 9 18.8 9H12.2C11.0799 9 10.5198 9 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9 10.5198 9 11.0799 9 12.2V18.8C9 19.9201 9 20.4802 9.21799 20.908C9.40973 21.2843 9.71569 21.5903 10.092 21.782C10.5198 22 11.0799 22 12.2 22Z"></path></svg></button><span class="sr-only" aria-live="polite"></span></div></div>',
	'<div class="relative overflow-hidden rounded-xl border border-secondary bg-primary font-body"><div role="tablist" aria-label="código" class="flex gap-1 bg-secondary px-3 py-2 shadow-[inset_0_-1px_0_var(--border-secondary)]"><button type="button" role="tab" id="_R_0_-tab-0" aria-selected="true" aria-controls="_R_0_-panel" tabindex="0" class="cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 font-body text-sm font-semibold text-quaternary focus-visible:shadow-focus-ring focus-visible:outline-none aria-selected:bg-primary aria-selected:text-primary aria-selected:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]">npm</button><button type="button" role="tab" id="_R_0_-tab-1" aria-selected="false" aria-controls="_R_0_-panel" tabindex="-1" class="cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 font-body text-sm font-semibold text-quaternary focus-visible:shadow-focus-ring focus-visible:outline-none aria-selected:bg-primary aria-selected:text-primary aria-selected:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]">bun</button></div><div class="relative flex" role="tabpanel" id="_R_0_-panel" aria-labelledby="_R_0_-tab-0"><pre tabindex="0" class="m-0 flex-1 overflow-auto p-5 pr-14 font-mono text-code-sm text-primary [tab-size:2] focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none"><code>npm i x</code></pre><button type="button" aria-label="Copiar código" class="absolute top-3 right-3 inline-flex cursor-pointer rounded-md border-0 bg-primary p-1.5 text-fg-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 15C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12V5.2C2 4.0799 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H12C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5M12.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V12.2C22 11.0799 22 10.5198 21.782 10.092C21.5903 9.71569 21.2843 9.40973 20.908 9.21799C20.4802 9 19.9201 9 18.8 9H12.2C11.0799 9 10.5198 9 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9 10.5198 9 11.0799 9 12.2V18.8C9 19.9201 9 20.4802 9.21799 20.908C9.40973 21.2843 9.71569 21.5903 10.092 21.782C10.5198 22 11.0799 22 12.2 22Z"></path></svg></button><span class="sr-only" aria-live="polite"></span></div></div>',
];

const items = [
	{ id: "a", label: "Resumen" },
	{ id: "b", label: "Movimientos", count: 12 },
];
const long = Array.from({ length: 30 }, (_, i) => `const linea${i} = ${i}`).join("\n");

describe("Tabs: fullWidth", () => {
	it("sin la prop nueva, el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<Tabs aria-label="Secciones" items={items} />)).toBe(TABS_BEFORE[0]);
		expect(
			renderToStaticMarkup(<Tabs aria-label="Modo" type="button-border" size="md" items={items} />),
		).toBe(TABS_BEFORE[1]);
	});

	it("reparte el ancho: cada pestaña crece y se centra", () => {
		render(<Tabs aria-label="Secciones" fullWidth items={items} />);
		for (const tab of screen.getAllByRole("tab")) {
			expect(tab.className).toContain("flex-1");
			expect(tab.className).toContain("justify-center");
		}
	});

	it("los segmentados pasan de inline-flex w-fit a flex w-full", () => {
		render(<Tabs aria-label="Modo" type="button-border" fullWidth items={items} />);
		const list = screen.getByRole("tablist");
		expect(list.className).toContain("w-full");
		expect(list.className).not.toContain("w-fit");
		expect(list.className).not.toContain("inline-flex");
	});

	it("en vertical no hace nada", () => {
		render(<Tabs aria-label="Ajustes" orientation="vertical" fullWidth items={items} />);
		expect(screen.getAllByRole("tab")[0]?.className).not.toContain("flex-1");
	});

	it("sigue con las flechas y es accesible", async () => {
		const onChange = vi.fn();
		render(<Tabs aria-label="Secciones" fullWidth items={items} onChange={onChange} />);
		await userEvent.tab();
		await userEvent.keyboard("{ArrowRight}");
		expect(onChange).toHaveBeenCalledWith("b");
		await expectAccessibleInThemes(
			<Tabs aria-label="Secciones" type="button-border" fullWidth items={items} />,
		);
	});
});

describe("CodeSnippet: variantes del Figma", () => {
	it("sin las props nuevas, el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<CodeSnippet code={"const a = 1\n// nota"} language="js" />)).toBe(
			CODE_BEFORE[0],
		);
		expect(
			renderToStaticMarkup(
				<CodeSnippet
					lineNumbers={false}
					tabs={[
						{ label: "npm", code: "npm i x" },
						{ label: "bun", code: "bun add x" },
					]}
				/>,
			),
		).toBe(CODE_BEFORE[1]);
	});

	it("vertical: tarjeta gris, sin números de línea y con un solo botón de copiar", () => {
		const { container } = render(<CodeSnippet variant="vertical" code="const a = 1" />);
		expect((container.firstChild as HTMLElement).className).toContain("rounded-3xl");
		expect((container.firstChild as HTMLElement).className).toContain("bg-secondary_alt");
		expect(container.querySelector("[aria-hidden=true].select-none")).toBeNull();
		expect(screen.getAllByRole("button", { name: "Copiar código" })).toHaveLength(1);
	});

	it("vertical con lineNumbers los pinta", () => {
		const { container } = render(<CodeSnippet variant="vertical" lineNumbers code={"a\nb"} />);
		expect(container.querySelector("[aria-hidden=true].select-none")?.textContent).toBe("12");
	});

	it("vertical con pestañas: cabecera con las pestañas y un solo botón de copiar, que copia la activa", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
		const { container } = render(
			<CodeSnippet
				variant="vertical"
				tabs={[
					{ label: "npm", code: "npm i x" },
					{ label: "yarn", code: "yarn add x" },
					{ label: "bun", code: "bun add x" },
				]}
			/>,
		);
		expect((container.firstChild as HTMLElement).className).toContain("rounded-t-xl");
		expect(screen.getAllByRole("tab")).toHaveLength(3);
		expect(screen.getByRole("tab", { name: "npm" }).getAttribute("aria-selected")).toBe("true");
		expect(screen.getByRole("tabpanel").textContent).toContain("npm i x");
		await userEvent.click(screen.getByRole("tab", { name: "yarn" }));
		expect(screen.getByRole("tabpanel").textContent).toContain("yarn add x");
		const copy = screen.getAllByRole("button", { name: "Copiar código" });
		expect(copy).toHaveLength(1);
		await userEvent.click(copy[0] as HTMLElement);
		expect(writeText).toHaveBeenCalledWith("yarn add x");
	});

	it("las pestañas verticales se recorren con las flechas", async () => {
		render(
			<CodeSnippet
				variant="vertical"
				tabs={[
					{ label: "npm", code: "a" },
					{ label: "bun", code: "b" },
				]}
			/>,
		);
		screen.getByRole("tab", { name: "npm" }).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(screen.getByRole("tab", { name: "bun" }).getAttribute("aria-selected")).toBe("true");
	});

	it("onExpand pinta el botón de ampliar, con nombre, y avisa al pulsarlo", async () => {
		const onExpand = vi.fn();
		render(<CodeSnippet code="a" onExpand={onExpand} />);
		await userEvent.click(screen.getByRole("button", { name: "Ampliar código" }));
		expect(onExpand).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("button", { name: "Copiar código" })).toBeTruthy();
	});

	it("sin onExpand no hay botón de ampliar", () => {
		render(<CodeSnippet code="a" />);
		expect(screen.queryByRole("button", { name: "Ampliar código" })).toBeNull();
	});

	describe("maxHeight", () => {
		it("con código corto no recorta ni enseña el botón", () => {
			render(<CodeSnippet variant="vertical" maxHeight={400} code="a" />);
			expect(screen.queryByRole("button", { name: "Ver más" })).toBeNull();
		});

		it("con código largo recorta y «Ver más» lo despliega y lo vuelve a recoger", async () => {
			const { container } = render(<CodeSnippet variant="vertical" maxHeight={200} code={long} />);
			const more = screen.getByRole("button", { name: "Ver más" });
			expect(more.getAttribute("aria-expanded")).toBe("false");
			expect(container.querySelector("pre")?.id).toBe(more.getAttribute("aria-controls"));
			expect((container.querySelector("[style]") as HTMLElement).style.maxHeight).toBe("200px");
			await userEvent.click(more);
			const less = screen.getByRole("button", { name: "Ver menos" });
			expect(less.getAttribute("aria-expanded")).toBe("true");
			expect((container.querySelector("[style]") as HTMLElement | null)?.style.maxHeight ?? "").toBe(
				"",
			);
			await userEvent.click(less);
			expect(screen.getByRole("button", { name: "Ver más" })).toBeTruthy();
		});

		it("funciona también en horizontal y se maneja con teclado", async () => {
			render(<CodeSnippet maxHeight={200} code={long} />);
			const more = screen.getByRole("button", { name: "Ver más" });
			more.focus();
			await userEvent.keyboard("{Enter}");
			expect(screen.getByRole("button", { name: "Ver menos" })).toBeTruthy();
		});
	});

	it("se renderiza en servidor y es accesible", async () => {
		expect(
			renderToStaticMarkup(<CodeSnippet variant="vertical" maxHeight={200} code={long} />),
		).toContain("Ver más");
		await expectAccessibleInThemes(
			<CodeSnippet
				variant="vertical"
				maxHeight={200}
				onExpand={() => {}}
				tabs={[
					{ label: "npm", code: long },
					{ label: "bun", code: "bun add x" },
				]}
			/>,
		);
		await expectAccessibleInThemes(<CodeSnippet maxHeight={200} code={long} />);
	});
});
