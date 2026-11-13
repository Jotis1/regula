import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Mail01, Star01, Zap } from "@untitledui/icons";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect, RadioGroup, Select } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: string[] = [
	'<div class="flex flex-col gap-3" data-rac="" aria-label="R" role="radiogroup" aria-orientation="vertical" id="react-aria-_R_0_" aria-describedby="react-aria-_R_0H3_ react-aria-_R_0H4_" data-orientation="vertical"><label data-react-aria-pressable="true" class="group relative inline-flex cursor-pointer items-start font-body has-[:disabled]:cursor-not-allowed data-disabled:cursor-not-allowed gap-2" data-rac="" data-selected="true"><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="0" type="radio" aria-describedby="react-aria-_R_3_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" checked="" value="a"/></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50"><span class="rounded-full bg-fg-white size-1.5 hidden group-data-selected:block"></span></span><span class="flex flex-col group-data-disabled:opacity-50"><span class="text-sm font-medium text-secondary">A</span><span class="text-sm font-normal text-tertiary">ha</span></span></label><label data-react-aria-pressable="true" class="group relative inline-flex cursor-pointer items-start font-body has-[:disabled]:cursor-not-allowed data-disabled:cursor-not-allowed gap-2" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="-1" type="radio" aria-describedby="react-aria-_R_5_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="b"/></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50"><span class="rounded-full bg-fg-white size-1.5 hidden group-data-selected:block"></span></span><span class="flex flex-col group-data-disabled:opacity-50"><span class="text-sm font-medium text-secondary">B</span></span></label></div>',
	'<div class="flex flex-col gap-3" data-rac="" aria-label="R" role="radiogroup" aria-orientation="vertical" id="react-aria-_R_0_" aria-describedby="react-aria-_R_0H3_ react-aria-_R_0H4_" data-orientation="vertical"><label data-react-aria-pressable="true" class="group relative inline-flex cursor-pointer items-start font-body has-[:disabled]:cursor-not-allowed data-disabled:cursor-not-allowed gap-3" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="0" type="radio" aria-describedby="react-aria-_R_3_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="a"/></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-5 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50"><span class="rounded-full bg-fg-white size-2 hidden group-data-selected:block"></span></span><span class="flex flex-col gap-0.5 group-data-disabled:opacity-50"><span class="text-md font-medium text-secondary">A</span><span class="text-md font-normal text-tertiary">ha</span></span></label><label data-react-aria-pressable="true" class="group relative inline-flex cursor-pointer items-start font-body has-[:disabled]:cursor-not-allowed data-disabled:cursor-not-allowed gap-3" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="0" type="radio" aria-describedby="react-aria-_R_5_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="b"/></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-5 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50"><span class="rounded-full bg-fg-white size-2 hidden group-data-selected:block"></span></span><span class="flex flex-col gap-0.5 group-data-disabled:opacity-50"><span class="text-md font-medium text-secondary">B</span></span></label></div>',
	'<div class="flex flex-col gap-3 font-body" data-rac="" aria-label="R" role="radiogroup" aria-orientation="vertical" id="react-aria-_R_0_" aria-describedby="react-aria-_R_0H3_ react-aria-_R_0H4_" data-orientation="vertical"><label data-react-aria-pressable="true" class="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="-1" type="radio" aria-describedby="react-aria-_R_3_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="a"/></span><span class="flex min-w-0 flex-1 items-start gap-3"><span class="flex flex-none"><i></i></span><span class="flex min-w-0 flex-col text-sm"><span class="flex flex-wrap gap-x-1"><span class="font-medium text-secondary">A</span><span class="font-normal text-tertiary">s</span></span><span class="font-normal text-tertiary">h</span></span></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring"><span class="rounded-full bg-fg-white size-1.5 hidden group-data-selected:block"></span></span></label><label data-react-aria-pressable="true" class="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50" data-rac="" data-selected="true" data-disabled="true"><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" type="radio" disabled="" aria-describedby="react-aria-_R_5_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" checked="" value="b"/></span><span class="flex min-w-0 flex-1 items-start gap-3"><span class="flex min-w-0 flex-col text-sm"><span class="flex flex-wrap gap-x-1"><span class="font-medium text-secondary">B</span></span></span></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-full group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring"><span class="rounded-full bg-fg-white size-1.5 hidden group-data-selected:block"></span></span></label></div>',
	'<div class="flex flex-col gap-3 font-body" data-rac="" aria-label="R" role="radiogroup" aria-orientation="vertical" id="react-aria-_R_0_" aria-describedby="react-aria-_R_0H3_ react-aria-_R_0H4_" data-orientation="vertical"><label data-react-aria-pressable="true" class="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="0" type="radio" aria-describedby="react-aria-_R_3_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="a"/></span><span class="flex min-w-0 flex-1 items-start gap-3"><span class="flex min-w-0 flex-col text-sm"><span class="flex flex-wrap gap-x-1"><span class="font-medium text-secondary">A</span></span><span class="font-normal text-tertiary">ha</span></span></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-sm group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring"><span class="hidden group-data-selected:inline-flex"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6L9 17L4 12"></path></svg></span></span></label><label data-react-aria-pressable="true" class="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50" data-rac=""><span style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input data-react-aria-pressable="true" tabindex="0" type="radio" aria-describedby="react-aria-_R_5_ react-aria-_R_0H3_" name="react-aria-_R_0H5_" value="b"/></span><span class="flex min-w-0 flex-1 items-start gap-3"><span class="flex min-w-0 flex-col text-sm"><span class="flex flex-wrap gap-x-1"><span class="font-medium text-secondary">B</span></span></span></span><span aria-hidden="true" class="mt-0.5 inline-flex flex-none items-center justify-center bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] size-4 rounded-sm group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring"><span class="hidden group-data-selected:inline-flex"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6L9 17L4 12"></path></svg></span></span></label></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">S</label><template></template><div class="group relative flex min-w-0 w-full" data-rac=""><button id="_R_0_" class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] gap-2 px-3 py-2 min-h-10 w-full cursor-pointer text-left outline-none data-disabled:cursor-not-allowed group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-labelledby="react-aria-_R_lH7_ _R_0_-label" aria-describedby="react-aria-_R_lH5_ react-aria-_R_lH6_ _R_0_-hint" aria-haspopup="listbox" aria-expanded="false"><span id="react-aria-_R_lH7_" class="flex min-w-0 items-center gap-2 text-left data-placeholder:text-placeholder flex-1 font-body text-primary text-md" data-rac=""><span class="truncate font-medium text-primary">y</span></span><span class="inline-flex flex-none text-fg-quaternary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></span></button><span class="hidden" id="react-aria-_R_lH5_" slot="description"></span><span class="hidden" id="react-aria-_R_lH6_" slot="errorMessage"></span><div style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:fixed;width:1px;white-space:nowrap;top:0;left:0" aria-hidden="true" data-react-aria-prevent-focus="true" data-a11y-ignore="aria-hidden-focus" data-testid="hidden-select-container"><label><select tabindex="-1"><option value="" label=" "> </option><option value="x">x</option><option value="y" selected="">y</option></select></label></div></div><p id="_R_0_-hint" class="m-0 text-sm font-normal text-tertiary">h</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">S</label><template></template><div class="group relative flex min-w-0 w-full" data-rac="" data-invalid="true"><button id="_R_0_" class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear gap-2 px-3 py-2 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)] w-full cursor-pointer text-left outline-none data-disabled:cursor-not-allowed group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-labelledby="react-aria-_R_lH7_ _R_0_-label" aria-describedby="react-aria-_R_lH5_ react-aria-_R_lH6_ _R_0_-hint" aria-haspopup="listbox" aria-expanded="false"><span class="inline-flex flex-none text-fg-quaternary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"></path></svg></span><span id="react-aria-_R_lH7_" class="flex min-w-0 items-center gap-2 text-left data-placeholder:text-placeholder flex-1 font-body text-primary text-sm" data-rac="" data-placeholder="true"><span class="truncate text-placeholder">Elige</span></span><span class="inline-flex flex-none text-fg-quaternary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></span></button><span class="hidden" id="react-aria-_R_lH5_" slot="description"></span><span class="hidden" id="react-aria-_R_lH6_" slot="errorMessage"></span><div style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:fixed;width:1px;white-space:nowrap;top:0;left:0" aria-hidden="true" data-react-aria-prevent-focus="true" data-a11y-ignore="aria-hidden-focus" data-testid="hidden-select-container"><label><select tabindex="-1"><option value="" label=" " selected=""> </option><option value="x">X</option></select></label></div></div><p id="_R_0_-hint" class="m-0 font-normal text-xs text-error-primary">e</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">M</label><div class="relative"><button id="_R_0_" class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] gap-2 px-3 py-2 min-h-10 w-full cursor-pointer text-left data-disabled:cursor-not-allowed" data-rac="" type="button" tabindex="0" aria-expanded="false" data-react-aria-pressable="true"><span class="flex min-w-0 flex-1 gap-1.5 text-md"><span class="truncate font-medium text-primary">1 elegido</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></button></div></div>',
];

const options = [
	{ value: "a", label: "A", hint: "ha" },
	{ value: "b", label: "B" },
];

describe("RadioGroup, Select y MultiSelect: sin las props nuevas", () => {
	it("el HTML es el de antes", () => {
		const html = [
			renderToStaticMarkup(<RadioGroup aria-label="R" options={options} defaultValue="a" />),
			renderToStaticMarkup(<RadioGroup aria-label="R" size="md" options={options} />),
			renderToStaticMarkup(
				<RadioGroup
					aria-label="R"
					appearance="card"
					options={[
						{ value: "a", label: "A", supporting: "s", hint: "h", media: <i /> },
						{ value: "b", label: "B", disabled: true },
					]}
					defaultValue="b"
				/>,
			),
			renderToStaticMarkup(
				<RadioGroup aria-label="R" appearance="card" indicator="checkbox" options={options} />,
			),
			renderToStaticMarkup(<Select label="S" options={["x", "y"]} defaultValue="y" hint="h" />),
			renderToStaticMarkup(
				<Select
					label="S"
					options={[{ value: "x", label: "X", supporting: "s", dot: "success" }]}
					placeholder="Elige"
					size="sm"
					error="e"
					icon={Mail01}
				/>,
			),
			renderToStaticMarkup(
				<MultiSelect label="M" options={["a", "b"]} defaultValue={["a"]} placeholder="p" />,
			),
		];
		html.forEach((h, i) => {
			expect(h, `caso ${i}`).toMatchBefore(BEFORE[i]);
		});
	});
});

describe("RadioGroup: icon-simple, avatar e icono de pago", () => {
	const plans = [
		{
			value: "basic",
			label: "Plan básico",
			supporting: "10 €/mes",
			hint: "Hasta 10 usuarios",
			icon: Star01,
		},
		{
			value: "pro",
			label: "Plan pro",
			supporting: "20 €/mes",
			hint: "Hasta 20 usuarios",
			icon: Zap,
		},
	];

	it("icon-simple pinta una tarjeta con el icono en una caja de 32px", () => {
		const { container } = render(
			<RadioGroup aria-label="Plan" appearance="icon-simple" options={plans} defaultValue="basic" />,
		);
		const radios = screen.getAllByRole("radio");
		expect(radios).toHaveLength(2);
		const box = container.querySelector("label span.size-8") as HTMLElement;
		expect(box.querySelector("svg")).toBeTruthy();
		expect(box.getAttribute("aria-hidden")).toBe("true");
		expect(container.querySelector("label")?.className).toContain("rounded-xl");
	});

	it("el nombre accesible es solo el texto: el icono, el avatar y el logo son decorativos", () => {
		render(
			<RadioGroup
				aria-label="Plan"
				appearance="icon-simple"
				options={[
					{ value: "a", label: "Plan básico", icon: Zap },
					{ value: "b", label: "Olivia Rhye", avatar: { initials: "OR" } },
					{ value: "c", label: "Visa terminada en 1234", paymentIcon: <svg data-logo="visa" /> },
				]}
			/>,
		);
		expect(screen.getByRole("radio", { name: "Plan básico" })).toBeTruthy();
		expect(screen.getByRole("radio", { name: "Olivia Rhye" })).toBeTruthy();
		expect(screen.getByRole("radio", { name: "Visa terminada en 1234" })).toBeTruthy();
	});

	it("avatar pone un avatar redondo de 32px", () => {
		const { container } = render(
			<RadioGroup
				aria-label="Equipo"
				appearance="icon-simple"
				options={[
					{
						value: "o",
						label: "Olivia Rhye",
						supporting: "@olivia",
						hint: "Product Manager",
						avatar: { initials: "OR" },
					},
				]}
			/>,
		);
		const avatar = container.querySelector("[aria-hidden=true] .size-8") as HTMLElement;
		expect(avatar).toBeTruthy();
		expect(avatar.textContent).toBe("OR");
	});

	it("paymentIcon pone el logo en una caja de 46×32 y lo estira", () => {
		const { container } = render(
			<RadioGroup
				aria-label="Pago"
				appearance="card"
				options={[
					{
						value: "v",
						label: "Visa terminada en 1234",
						hint: "Caduca 06/2028",
						paymentIcon: <svg data-logo="visa" />,
					},
				]}
			/>,
		);
		const logo = container.querySelector("[data-logo=visa]") as Element;
		const box = logo.parentElement as HTMLElement;
		expect(box.className).toContain("h-8");
		expect(box.className).toContain("w-[46px]");
		expect(box.className).toContain("[&>*]:w-full");
	});

	it("size md agranda el delantero, el texto y el indicador", () => {
		const { container } = render(
			<RadioGroup
				aria-label="Plan"
				appearance="icon-simple"
				size="md"
				options={[
					{ value: "a", label: "Plan", icon: Zap },
					{ value: "b", label: "Visa", paymentIcon: <svg data-logo="x" /> },
					{ value: "c", label: "Olivia", avatar: { initials: "OR" } },
				]}
			/>,
		);
		expect(container.querySelector("span.size-10")).toBeTruthy();
		expect((container.querySelector("[data-logo]") as Element).parentElement?.className).toContain(
			"w-[58px]",
		);
		expect(container.querySelector("label .text-md")).toBeTruthy();
		expect(container.querySelector("label span.size-5")).toBeTruthy();
	});

	it("manda media, luego paymentIcon, luego avatar y luego icon", () => {
		const { container } = render(
			<RadioGroup
				aria-label="Prioridad"
				appearance="icon-simple"
				options={[
					{
						value: "a",
						label: "A",
						media: <i data-m="media" />,
						paymentIcon: <i data-m="pago" />,
						avatar: { initials: "AA" },
						icon: Zap,
					},
					{
						value: "b",
						label: "B",
						paymentIcon: <i data-m="pago" />,
						avatar: { initials: "BB" },
						icon: Zap,
					},
					{ value: "c", label: "C", avatar: { initials: "CC" }, icon: Zap },
				]}
			/>,
		);
		const marks = [...container.querySelectorAll("label")].map(
			(l) =>
				l.querySelector("[data-m]")?.getAttribute("data-m") ??
				(l.textContent?.includes("CC") ? "avatar" : "?"),
		);
		expect(marks).toEqual(["media", "pago", "avatar"]);
	});

	it("se elige con las flechas, con el indicador de casilla o de círculo", async () => {
		const onChange = vi.fn();
		render(
			<RadioGroup
				aria-label="Plan"
				appearance="icon-simple"
				indicator="checkbox"
				options={plans}
				defaultValue="basic"
				onChange={onChange}
			/>,
		);
		await userEvent.tab();
		await userEvent.keyboard("{ArrowDown}");
		expect(onChange).toHaveBeenCalledWith("pro");
		expect((screen.getByRole("radio", { name: /Plan pro/ }) as HTMLInputElement).checked).toBe(true);
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<RadioGroup aria-label="Plan" appearance="icon-simple" options={plans} defaultValue="basic" />,
		);
		await expectAccessibleInThemes(
			<RadioGroup
				aria-label="Pago"
				appearance="card"
				size="md"
				indicator="checkbox"
				options={[{ value: "v", label: "Visa", paymentIcon: <svg />, avatar: { initials: "V" } }]}
			/>,
		);
	});
});

describe("Select searchable", () => {
	const cities = ["Madrid", "Valencia", "Sevilla", "Barcelona", "Bilbao", "Madridejos"];

	it("el campo es un cuadro de texto con la lupa, y nombre y pista como los demás", () => {
		const { container } = render(<Select label="Ciudad" searchable options={cities} hint="Pista" />);
		const input = screen.getByRole("combobox", { name: "Ciudad" }) as HTMLInputElement;
		expect(input.placeholder).toBe("Buscar");
		expect(input.getAttribute("aria-describedby")).toBeTruthy();
		expect(container.querySelector("svg")).toBeTruthy();
		expect(screen.getByText("Pista")).toBeTruthy();
	});

	it("al escribir «mad» solo quedan las opciones que lo contienen y Enter elige la marcada", async () => {
		const onChange = vi.fn();
		render(<Select label="Ciudad" searchable options={cities} onChange={onChange} />);
		const input = screen.getByRole("combobox", { name: "Ciudad" });
		await userEvent.click(input);
		expect(screen.getAllByRole("option")).toHaveLength(6);
		await userEvent.keyboard("mad");
		expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Madrid", "Madridejos"]);
		await userEvent.keyboard("{Enter}");
		expect(onChange).toHaveBeenCalledWith("Madrid");
		expect((input as HTMLInputElement).value).toBe("Madrid");
	});

	it("sin coincidencias enseña el texto de «Sin resultados», que se puede cambiar", async () => {
		render(<Select label="Ciudad" searchable emptyLabel="Nada por aquí" options={cities} />);
		await userEvent.click(screen.getByRole("combobox", { name: "Ciudad" }));
		await userEvent.keyboard("zzz");
		expect(screen.getByText("Nada por aquí")).toBeTruthy();
		expect(screen.queryByText("Madrid")).toBeNull();
	});

	it("filtra sin distinguir mayúsculas ni acentos", async () => {
		render(<Select label="Ciudad" searchable options={["Málaga", "Madrid", "Sevilla"]} />);
		await userEvent.click(screen.getByRole("combobox", { name: "Ciudad" }));
		await userEvent.keyboard("MALA");
		expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Málaga"]);
	});

	it("con las flechas se mueve por las que quedan y Enter elige otra", async () => {
		const onChange = vi.fn();
		render(<Select label="Ciudad" searchable options={cities} onChange={onChange} />);
		await userEvent.click(screen.getByRole("combobox", { name: "Ciudad" }));
		await userEvent.keyboard("mad{ArrowDown}{ArrowDown}{Enter}");
		expect(onChange).toHaveBeenCalledWith("Madridejos");
	});

	it("parte con la opción de defaultValue y marca la elegida al abrir", async () => {
		render(
			<Select
				label="Ciudad"
				searchable
				defaultValue="sevilla"
				options={[
					{ value: "madrid", label: "Madrid" },
					{ value: "sevilla", label: "Sevilla", supporting: "Andalucía" },
				]}
			/>,
		);
		const input = screen.getByRole("combobox", { name: "Ciudad" }) as HTMLInputElement;
		expect(input.value).toBe("Sevilla");
		await userEvent.click(screen.getByRole("button", { hidden: true }));
		expect(screen.getByRole("option", { name: /Sevilla/ }).getAttribute("aria-selected")).toBe("true");
	});

	it("controlado: manda el valor del padre", async () => {
		render(<Select label="Ciudad" searchable value="Bilbao" options={cities} />);
		const input = screen.getByRole("combobox", { name: "Ciudad" }) as HTMLInputElement;
		expect(input.value).toBe("Bilbao");
		await userEvent.click(input);
		await userEvent.click(screen.getByRole("option", { name: "Madrid" }));
		expect(input.value).toBe("Bilbao");
	});

	it("el chevron abre la lista con el ratón y no entra en el orden de Tab", async () => {
		render(<Select label="Ciudad" searchable options={cities} />);
		await userEvent.tab();
		expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Ciudad" }));
		await userEvent.keyboard("{Escape}");
		await userEvent.tab();
		expect(document.activeElement).toBe(document.body);
	});

	it("Escape cierra la lista y al salir vuelve el texto de la elegida", async () => {
		render(<Select label="Ciudad" searchable defaultValue="Madrid" options={cities} />);
		const input = screen.getByRole("combobox", { name: "Ciudad" }) as HTMLInputElement;
		await userEvent.click(input);
		await userEvent.keyboard("{Control>}a{/Control}bil");
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("listbox")).toBeNull();
		await userEvent.tab();
		expect(input.value).toBe("Madrid");
	});

	it("manda el valor en el formulario con name", () => {
		const { container } = render(
			<Select label="Ciudad" searchable name="ciudad" defaultValue="Bilbao" options={cities} />,
		);
		expect((container.querySelector("input[name=ciudad]") as HTMLInputElement).value).toBe("Bilbao");
	});

	it("error y disabled se pintan como en el Select de siempre", () => {
		const { container } = render(
			<Select label="Ciudad" searchable error="Elige una" disabled options={cities} />,
		);
		expect((screen.getByRole("combobox") as HTMLInputElement).disabled).toBe(true);
		expect(screen.getByText("Elige una")).toBeTruthy();
		expect(container.querySelector(".opacity-50")).toBeTruthy();
	});

	it("es accesible, en claro y en oscuro", async () => {
		await expectAccessibleInThemes(<Select label="Ciudad" searchable hint="Pista" options={cities} />);
	});
});

describe("Select type=tags", () => {
	const team = [
		{ value: "olivia", label: "Olivia Rhye", supporting: "@olivia" },
		{ value: "phoenix", label: "Phoenix Baker", supporting: "@phoenix" },
		{ value: "lana", label: "Lana Steiner", supporting: "@lana" },
	];

	it("enseña cada elegida como etiqueta dentro del campo, y el placeholder si no hay ninguna", () => {
		const { unmount } = render(<Select type="tags" label="Equipo" options={team} placeholder="Elige" />);
		expect(screen.getByText("Elige")).toBeTruthy();
		unmount();
		render(<Select type="tags" label="Equipo" options={team} defaultValue={["olivia", "phoenix"]} />);
		const field = screen.getByRole("button", { name: /Equipo/ });
		expect(within(field).getByText("Olivia Rhye")).toBeTruthy();
		expect(within(field).getByText("Phoenix Baker")).toBeTruthy();
		expect(within(field).queryByText("Lana Steiner")).toBeNull();
	});

	it("elegir en la lista añade la etiqueta y avisa con todos los valores", async () => {
		const onChange = vi.fn();
		render(
			<Select
				type="tags"
				label="Equipo"
				options={team}
				defaultValue={["olivia"]}
				onChange={onChange}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: /Equipo/ }));
		await userEvent.click(screen.getByRole("option", { name: /Lana Steiner/ }));
		expect(onChange).toHaveBeenLastCalledWith(["olivia", "lana"]);
		expect(
			within(screen.getByRole("button", { name: /Equipo/, hidden: true })).getByText("Lana Steiner"),
		).toBeTruthy();
	});

	it("desmarcar una opción quita su etiqueta", async () => {
		const onChange = vi.fn();
		render(
			<Select
				type="tags"
				label="Equipo"
				options={team}
				defaultValue={["olivia", "lana"]}
				onChange={onChange}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: /Equipo/ }));
		await userEvent.click(screen.getByRole("option", { name: /Olivia Rhye/ }));
		expect(onChange).toHaveBeenLastCalledWith(["lana"]);
	});

	it("la lista lleva buscador", async () => {
		render(<Select type="tags" label="Equipo" options={team} />);
		await userEvent.click(screen.getByRole("button", { name: /Equipo/ }));
		await userEvent.keyboard("lan");
		expect(screen.getAllByRole("option")).toHaveLength(1);
	});

	it("las etiquetas no llevan X: no hay botones dentro del campo", () => {
		render(<Select type="tags" label="Equipo" options={team} defaultValue={["olivia", "phoenix"]} />);
		const field = screen.getByRole("button", { name: /Equipo/ });
		expect(within(field).queryAllByRole("button")).toHaveLength(0);
	});

	it("una etiqueta con muchas elegidas deja crecer el campo en alto", () => {
		render(
			<Select type="tags" label="Equipo" options={team} defaultValue={["olivia", "phoenix", "lana"]} />,
		);
		const field = screen.getByRole("button", { name: /Equipo/ });
		expect(field.querySelector(".flex-wrap")).toBeTruthy();
	});

	it("usa textValue si la etiqueta no es texto, y name manda los valores separados por comas", () => {
		const { container } = render(
			<Select
				type="tags"
				label="Equipo"
				name="equipo"
				defaultValue={["a", "b"]}
				options={[
					{ value: "a", label: <b>Ana</b>, textValue: "Ana" },
					{ value: "b", label: "Beto" },
				]}
			/>,
		);
		expect(within(screen.getByRole("button", { name: /Equipo/ })).getByText("Ana")).toBeTruthy();
		expect((container.querySelector("input[name=equipo]") as HTMLInputElement).value).toBe("a,b");
	});

	it("MultiSelect con display tags hace lo mismo, y sin display sigue resumiendo", () => {
		const { rerender } = render(<MultiSelect label="M" options={["a", "b"]} defaultValue={["a", "b"]} />);
		expect(screen.getByText("2 elegidos")).toBeTruthy();
		rerender(<MultiSelect label="M" display="tags" options={["a", "b"]} defaultValue={["a", "b"]} />);
		expect(screen.queryByText("2 elegidos")).toBeNull();
	});

	it("es accesible, en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Select
				type="tags"
				label="Equipo"
				hint="Pista"
				options={team}
				defaultValue={["olivia", "phoenix"]}
			/>,
		);
	});
});
