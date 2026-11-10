import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { detectCardNetwork, formatCardNumber } from "../src/components/Input.js";
import { type CardNetwork, Input, TagInput, Textarea } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const INPUT_BEFORE: string[] = [
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Correo</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] gap-2 px-3 py-2 min-h-10"><input id="_R_0_" aria-describedby="_R_0_-hint" placeholder="a@b.c" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed"/></div><p id="_R_0_-hint" class="m-0 text-sm font-normal text-tertiary">Pista</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Clave<span aria-hidden="true" class="ml-0.5 text-error-primary">*</span></label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear gap-2 px-3 py-2 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]"><input id="_R_0_" type="password" required="" aria-invalid="true" aria-describedby="_R_0_-hint" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed text-sm"/><span class="inline-flex text-fg-error-secondary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"></path></svg></span><button type="button" aria-pressed="false" aria-label="Mostrar contraseña" class="inline-flex flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"></path><path d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"></path></svg></button></div><p id="_R_0_-hint" class="m-0 font-normal text-xs text-error-primary">Mala</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Web</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] overflow-hidden min-h-10"><span class="flex flex-none items-center self-stretch font-body text-md font-normal text-tertiary gap-2 px-3 py-2">https://</span><div class="flex min-w-0 flex-1 items-center self-stretch gap-2 px-3 py-2 border-l border-primary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"></path></svg><input id="_R_0_" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed" value="x"/><span class="inline-flex"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"></path></svg></span></div></div></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Tel</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] overflow-hidden min-h-10 opacity-50"><template></template><div class="group relative flex min-w-0 flex-none self-stretch" data-rac="" data-disabled="true"><button id="react-aria-_R_4dH2_" class="flex flex-none items-center self-stretch font-body text-md font-normal text-tertiary px-3 py-2 cursor-pointer gap-0.5 border-0 bg-transparent outline-none data-disabled:cursor-not-allowed pr-0" data-rac="" type="button" disabled="" data-react-aria-pressable="true" aria-label="Prefijo" aria-labelledby="react-aria-_R_4dH7_ react-aria-_R_4dH2_" aria-describedby="react-aria-_R_4dH5_ react-aria-_R_4dH6_" aria-haspopup="listbox" aria-expanded="false" data-disabled="true"><span id="react-aria-_R_4dH7_" class="flex min-w-0 items-center gap-2 text-left data-placeholder:text-placeholder text-tertiary" data-rac=""><span class="truncate">+34</span></span><span class="inline-flex flex-none text-fg-quaternary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></span></button><span class="hidden" id="react-aria-_R_4dH5_" slot="description"></span><span class="hidden" id="react-aria-_R_4dH6_" slot="errorMessage"></span><div style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:fixed;width:1px;white-space:nowrap;top:0;left:0" aria-hidden="true" data-react-aria-prevent-focus="true" data-a11y-ignore="aria-hidden-focus" data-testid="hidden-select-container"><label><select tabindex="-1" disabled=""><option value="" label=" "> </option><option value="+34" selected="">+34</option><option value="+1">+1</option></select></label></div></div><div class="flex min-w-0 flex-1 items-center self-stretch gap-2 px-3 py-2 pl-2.5"><input id="_R_0_" type="tel" disabled="" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed"/></div></div></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] gap-2 px-3.5 py-2.5 min-h-11"><input id="_R_0_" type="date" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed"/></div></div>',
];
const TAGS_BEFORE: string[] = [
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Etiquetas</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] px-3 py-2 min-h-10 flex-wrap gap-1.5 pl-2"><ul aria-label="Etiquetas" class="m-0 flex list-none flex-wrap gap-1.5 p-0"><li class="flex"><span class="inline-flex items-center gap-[3px] whitespace-nowrap rounded-md bg-primary font-body font-medium text-secondary inset-ring inset-ring-primary px-[9px] py-0.5 text-sm">a<button type="button" aria-label="Quitar a" class="inline-flex cursor-pointer rounded-[3px] bg-transparent p-0.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6L18 18"></path></svg></button></span></li><li class="flex"><span class="inline-flex items-center gap-[3px] whitespace-nowrap rounded-md bg-primary font-body font-medium text-secondary inset-ring inset-ring-primary px-[9px] py-0.5 text-sm">b<button type="button" aria-label="Quitar b" class="inline-flex cursor-pointer rounded-[3px] bg-transparent p-0.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6L18 18"></path></svg></button></span></li></ul><input id="_R_0_" placeholder="Añadir etiqueta" aria-describedby="_R_0_-hint" class="flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed min-w-24" value=""/><input type="hidden" name="t" value="a,b"/></div><p id="_R_0_-hint" class="m-0 text-sm font-normal text-tertiary">Pista</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Etiquetas</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear gap-2 px-3.5 py-2.5 min-h-11 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]"><input id="_R_0_" placeholder="Añadir etiqueta" aria-invalid="true" aria-describedby="_R_0_-hint" class="flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed min-w-24" value=""/></div><ul aria-label="Etiquetas" class="m-0 flex list-none flex-wrap gap-1.5 p-0 mt-0.5"><li class="flex"><span class="inline-flex items-center gap-[3px] whitespace-nowrap rounded-md bg-primary font-body font-medium text-secondary inset-ring inset-ring-primary px-[9px] py-0.5 text-sm">a<button type="button" aria-label="Quitar a" class="inline-flex cursor-pointer rounded-[3px] bg-transparent p-0.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6L18 18"></path></svg></button></span></li></ul><p id="_R_0_-hint" class="m-0 text-sm font-normal text-error-primary">Mal</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><label id="_R_0_-label" for="_R_0_" class="text-sm font-medium text-secondary">Notas</label><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] gap-2 px-3.5 py-3"><textarea id="_R_0_" rows="3" aria-describedby="_R_0_-hint" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed min-h-[104px] resize-y">hola</textarea></div><p id="_R_0_-hint" class="m-0 text-sm font-normal text-tertiary">Pista</p></div>',
	'<div class="flex min-w-0 flex-col gap-1.5 font-body"><div class="flex items-center rounded-lg bg-primary text-fg-quaternary transition-shadow duration-100 ease-linear gap-2 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)] opacity-50 px-3.5 py-3"><textarea id="_R_0_" rows="4" required="" disabled="" aria-invalid="true" class="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed min-h-[104px] resize-y"></textarea></div></div>',
];

describe("Input y Textarea: sin las props nuevas", () => {
	it("el HTML de Input es el de antes", () => {
		expect(renderToStaticMarkup(<Input label="Correo" hint="Pista" placeholder="a@b.c" />)).toBe(
			INPUT_BEFORE[0],
		);
		expect(
			renderToStaticMarkup(<Input label="Clave" type="password" size="sm" error="Mala" required />),
		).toBe(INPUT_BEFORE[1]);
		expect(
			renderToStaticMarkup(
				<Input
					label="Web"
					prefix="https://"
					trailing="help-circle"
					icon="mail-01"
					defaultValue="x"
				/>,
			),
		).toBe(INPUT_BEFORE[2]);
		expect(
			renderToStaticMarkup(
				<Input
					label="Tel"
					leadingSelect={{ label: "Prefijo", options: ["+34", "+1"], defaultValue: "+34" }}
					type="tel"
					disabled
				/>,
			),
		).toBe(INPUT_BEFORE[3]);
		expect(renderToStaticMarkup(<Input type="date" size="lg" />)).toBe(INPUT_BEFORE[4]);
	});

	it("el HTML de TagInput y Textarea es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<TagInput label="Etiquetas" defaultValue={["a", "b"]} hint="Pista" name="t" />,
			),
		).toBe(TAGS_BEFORE[0]);
		expect(
			renderToStaticMarkup(
				<TagInput label="Etiquetas" placement="outside" size="lg" defaultValue={["a"]} error="Mal" />,
			),
		).toBe(TAGS_BEFORE[1]);
		expect(
			renderToStaticMarkup(<Textarea label="Notas" hint="Pista" rows={3} defaultValue="hola" />),
		).toBe(TAGS_BEFORE[2]);
		expect(renderToStaticMarkup(<Textarea error disabled required />)).toBe(TAGS_BEFORE[3]);
	});
});

describe("Input type=card", () => {
	const logos = {
		visa: <svg data-logo="visa" />,
		mastercard: <svg data-logo="mastercard" />,
	};

	it.each<[string, CardNetwork | undefined]>([
		["4242", "visa"],
		["5555 5555", "mastercard"],
		["2221", "mastercard"],
		["2720", "mastercard"],
		["2721", undefined],
		["3714", "amex"],
		["3530", "jcb"],
		["6011", "discover"],
		["6500", "discover"],
		["3056", "diners"],
		["6212", "unionpay"],
		["5018", "maestro"],
		["9", undefined],
		["", undefined],
	])("detecta %s como %s", (number, network) => {
		expect(detectCardNetwork(number)).toBe(network);
	});

	it("agrupa de cuatro en cuatro, quita lo que no son dígitos y corta a 19", () => {
		expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
		expect(formatCardNumber("4242-4242 abcd 4242")).toBe("4242 4242 4242");
		expect(formatCardNumber("12345678901234567890123")).toBe("1234 5678 9012 3456 789");
		expect(formatCardNumber("")).toBe("");
	});

	it("al escribir un número que empieza por 4 agrupa los dígitos y enseña el logo de Visa", async () => {
		const { container } = render(<Input label="Tarjeta" type="card" cardLogos={logos} />);
		const input = screen.getByLabelText("Tarjeta") as HTMLInputElement;
		expect(container.querySelector("[data-logo]")).toBeNull();
		await userEvent.type(input, "4242424242424242");
		expect(input.value).toBe("4242 4242 4242 4242");
		expect(container.querySelector("[data-logo=visa]")).toBeTruthy();
	});

	it("cambia el logo con la red y lo quita si no hay uno para esa red", async () => {
		const { container } = render(<Input label="Tarjeta" type="card" cardLogos={logos} />);
		const input = screen.getByLabelText("Tarjeta") as HTMLInputElement;
		await userEvent.type(input, "5555");
		expect(container.querySelector("[data-logo=mastercard]")).toBeTruthy();
		await userEvent.clear(input);
		await userEvent.type(input, "3714");
		expect(container.querySelector("[data-logo]")).toBeNull();
	});

	it("es un campo numérico para tarjeta, con placeholder y sin letras", async () => {
		render(<Input label="Tarjeta" type="card" />);
		const input = screen.getByLabelText("Tarjeta") as HTMLInputElement;
		expect(input.getAttribute("type")).toBe("text");
		expect(input.getAttribute("inputmode")).toBe("numeric");
		expect(input.getAttribute("autocomplete")).toBe("cc-number");
		expect(input.placeholder).toBe("0000 0000 0000 0000");
		await userEvent.type(input, "ab12cd34");
		expect(input.value).toBe("1234");
	});

	it("avisa con el valor ya agrupado", async () => {
		const onChange = vi.fn();
		render(<Input label="Tarjeta" type="card" onChange={onChange} />);
		await userEvent.type(screen.getByLabelText("Tarjeta"), "42424");
		expect(onChange).toHaveBeenLastCalledWith(
			expect.objectContaining({ target: expect.objectContaining({ value: "4242 4" }) }),
		);
	});

	it("con value (controlado) enseña el valor agrupado y con defaultValue parte de él", () => {
		const { rerender } = render(
			<Input label="Tarjeta" type="card" value="4242424242424242" onChange={() => {}} />,
		);
		expect((screen.getByLabelText("Tarjeta") as HTMLInputElement).value).toBe("4242 4242 4242 4242");
		rerender(<Input label="Tarjeta" type="card" value="5555" onChange={() => {}} />);
		expect((screen.getByLabelText("Tarjeta") as HTMLInputElement).value).toBe("5555");
		rerender(<div />);
		render(<Input label="Otra" type="card" defaultValue="37144963539843" />);
		expect((screen.getByLabelText("Otra") as HTMLInputElement).value).toBe("3714 4963 5398 43");
	});
});

describe("Input trailingButton", () => {
	it("el botón va pegado al campo por la derecha, con el filo compartido, y funciona", async () => {
		const onClick = vi.fn();
		const { container } = render(
			<Input
				label="Web"
				defaultValue="jotis.me"
				trailingButton={{ label: "Copiar", icon: "copy-01", onClick }}
			/>,
		);
		const button = screen.getByRole("button", { name: "Copiar" });
		expect(button.querySelector("svg")).toBeTruthy();
		expect(button.className).toContain("border-l");
		// El botón es el último del marco, tras el campo
		const frame = (screen.getByLabelText("Web") as HTMLElement).closest(
			"div.overflow-hidden",
		) as HTMLElement;
		expect(frame.lastElementChild).toBe(button);
		await userEvent.click(button);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(container.querySelectorAll("input")).toHaveLength(1);
	});

	it("se llega con Tab tras el campo y se pulsa con Enter", async () => {
		const onClick = vi.fn();
		render(<Input label="Web" trailingButton={{ label: "Copiar", onClick }} />);
		await userEvent.tab();
		expect(document.activeElement).toBe(screen.getByLabelText("Web"));
		await userEvent.tab();
		expect(document.activeElement).toBe(screen.getByRole("button", { name: "Copiar" }));
		await userEvent.keyboard("{Enter}");
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("disabled apaga también el botón", () => {
		render(<Input label="Web" disabled trailingButton={{ label: "Copiar" }} />);
		expect((screen.getByRole("button", { name: "Copiar" }) as HTMLButtonElement).disabled).toBe(true);
	});
});

describe("Input type=datetime-local", () => {
	it("es el campo nativo de fecha y hora, con el botón del calendario delante", () => {
		const { container } = render(<Input label="Fecha" type="datetime-local" />);
		const input = screen.getByLabelText("Fecha") as HTMLInputElement;
		expect(input.type).toBe("datetime-local");
		expect(input.className).toContain("[&::-webkit-calendar-picker-indicator]:hidden");
		const picker = screen.getByRole("button", { name: "Elegir fecha" });
		expect(picker.nextElementSibling).toBe(input);
		expect(container.querySelectorAll("input")).toHaveLength(1);
	});

	it("el botón del calendario abre el selector nativo y se puede cambiar su nombre", async () => {
		render(<Input label="Fecha" type="datetime-local" pickerLabel="Abrir calendario" />);
		const input = screen.getByLabelText("Fecha") as HTMLInputElement;
		const showPicker = vi.fn();
		input.showPicker = showPicker;
		await userEvent.click(screen.getByRole("button", { name: "Abrir calendario" }));
		expect(showPicker).toHaveBeenCalledTimes(1);
	});

	it("guarda la fecha y la hora y avisa", () => {
		const onChange = vi.fn();
		render(<Input label="Fecha" type="datetime-local" onChange={onChange} />);
		const input = screen.getByLabelText("Fecha") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "2028-04-16T10:30" } });
		expect(input.value).toBe("2028-04-16T10:30");
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("con icon propio no pone el botón del calendario", () => {
		render(<Input label="Fecha" type="datetime-local" icon="clock" />);
		expect(screen.queryByRole("button", { name: "Elegir fecha" })).toBeNull();
	});
});

describe("Input type=file", () => {
	it("enseña «Ningún archivo seleccionado» y el botón «Elegir archivo», y el campo es el nativo", () => {
		render(<Input label="Subir archivo" type="file" />);
		const input = screen.getByLabelText("Subir archivo") as HTMLInputElement;
		expect(input.type).toBe("file");
		expect(screen.getByText("Ningún archivo seleccionado")).toBeTruthy();
		expect(screen.getByText("Elegir archivo")).toBeTruthy();
	});

	it("al elegir un archivo enseña su nombre y avisa", async () => {
		const onChange = vi.fn();
		render(<Input label="Subir archivo" type="file" onChange={onChange} />);
		const input = screen.getByLabelText("Subir archivo") as HTMLInputElement;
		await userEvent.upload(input, new File(["x"], "logo.svg", { type: "image/svg+xml" }));
		expect(screen.getByText("logo.svg")).toBeTruthy();
		expect(screen.queryByText("Ningún archivo seleccionado")).toBeNull();
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("con varios archivos junta los nombres", async () => {
		render(<Input label="Subir archivo" type="file" multiple />);
		await userEvent.upload(screen.getByLabelText("Subir archivo"), [
			new File(["a"], "a.png"),
			new File(["b"], "b.png"),
		]);
		expect(screen.getByText("a.png, b.png")).toBeTruthy();
	});

	it("el botón es para el ratón (abre el selector) y el campo nativo, para el teclado", async () => {
		render(<Input label="Subir archivo" type="file" />);
		const input = screen.getByLabelText("Subir archivo") as HTMLInputElement;
		const click = vi.spyOn(input, "click");
		const button = screen.getByText("Elegir archivo");
		expect(button.getAttribute("aria-hidden")).toBe("true");
		expect(button.getAttribute("tabindex")).toBe("-1");
		await userEvent.click(button);
		expect(click).toHaveBeenCalledTimes(1);
		input.focus();
		expect(document.activeElement).toBe(input);
	});

	it("se pueden cambiar los textos y disabled apaga el botón", () => {
		render(<Input label="Archivo" type="file" chooseFileLabel="Browse" noFileLabel="Nada" disabled />);
		expect(screen.getByText("Nada")).toBeTruthy();
		expect((screen.getByText("Browse") as HTMLButtonElement).disabled).toBe(true);
	});
});

describe("Textarea con etiquetas", () => {
	it("tags pinta las etiquetas y una caja de varias líneas, y Enter o coma crean otra", async () => {
		const onTagsChange = vi.fn();
		render(<Textarea label="Etiquetas" defaultTags={["Diseño"]} onTagsChange={onTagsChange} />);
		expect(screen.getByText("Diseño")).toBeTruthy();
		const input = screen.getByRole("textbox", { name: "Etiquetas" }) as HTMLInputElement;
		expect((input.parentElement as HTMLElement).className).toContain("min-h-[104px]");
		await userEvent.type(input, "Marketing{Enter}Ventas,");
		expect(onTagsChange).toHaveBeenLastCalledWith(["Diseño", "Marketing", "Ventas"]);
		expect(screen.getByText("Ventas")).toBeTruthy();
	});

	it("no admite repetidas ni vacías, y Retroceso quita la última", async () => {
		const onTagsChange = vi.fn();
		render(<Textarea label="Etiquetas" defaultTags={["a"]} onTagsChange={onTagsChange} />);
		const input = screen.getByRole("textbox", { name: "Etiquetas" });
		await userEvent.type(input, "a{Enter}  {Enter}");
		expect(onTagsChange).not.toHaveBeenCalled();
		await userEvent.type(input, "{Backspace}");
		expect(onTagsChange).toHaveBeenLastCalledWith([]);
	});

	it("la X de una etiqueta la quita, con nombre, y devuelve el foco al campo", async () => {
		render(<Textarea label="Etiquetas" defaultTags={["Diseño", "Ventas"]} />);
		await userEvent.click(screen.getByRole("button", { name: "Quitar Diseño" }));
		expect(screen.queryByText("Diseño")).toBeNull();
		expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Etiquetas" }));
	});

	it("controlado: manda la lista del padre", async () => {
		render(<Textarea label="Etiquetas" tags={["a"]} />);
		await userEvent.type(screen.getByRole("textbox", { name: "Etiquetas" }), "b{Enter}");
		expect(screen.queryByText("b")).toBeNull();
	});

	it("tagPlacement outside pone las etiquetas debajo del campo", () => {
		const { container } = render(
			<Textarea label="Etiquetas" defaultTags={["Diseño"]} tagPlacement="outside" />,
		);
		const field = screen.getByRole("textbox", { name: "Etiquetas" }).parentElement as HTMLElement;
		const list = container.querySelector("ul") as HTMLElement;
		expect(field.contains(list)).toBe(false);
		expect(field.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it("un clic en la caja enfoca el campo", async () => {
		render(<Textarea label="Etiquetas" defaultTags={["Diseño"]} />);
		const input = screen.getByRole("textbox", { name: "Etiquetas" });
		await userEvent.click(input.parentElement as HTMLElement);
		expect(document.activeElement).toBe(input);
	});

	it("placeholder, name, pista y error pasan al campo de etiquetas", () => {
		const { container } = render(
			<Textarea label="Etiquetas" defaultTags={["a", "b"]} placeholder="Añade" name="t" hint="Pista" />,
		);
		expect((screen.getByRole("textbox", { name: "Etiquetas" }) as HTMLInputElement).placeholder).toBe(
			"Añade",
		);
		expect((container.querySelector("input[type=hidden]") as HTMLInputElement).value).toBe("a,b");
		expect(screen.getByText("Pista")).toBeTruthy();
	});

	it("con defaultTags vacío ya es de etiquetas", () => {
		render(<Textarea label="Etiquetas" defaultTags={[]} />);
		expect(document.querySelector("textarea")).toBeNull();
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Textarea label="Etiquetas" defaultTags={["Diseño", "Ventas"]} hint="Pista" />,
		);
		await expectAccessibleInThemes(
			<Textarea label="Etiquetas" defaultTags={["a"]} tagPlacement="outside" error="Mal" />,
		);
	});
});

describe("accesibilidad de los campos nuevos", () => {
	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Input label="Tarjeta" type="card" cardLogos={{ visa: <svg /> }} defaultValue="4242" />,
		);
		await expectAccessibleInThemes(
			<Input label="Web" hint="Pista" trailingButton={{ label: "Copiar", icon: "copy-01" }} />,
		);
		await expectAccessibleInThemes(<Input label="Fecha" type="datetime-local" error="Mal" />);
		await expectAccessibleInThemes(<Input label="Archivo" type="file" hint="SVG o PNG" />);
	});
});
