import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Copy01, Edit02 } from "@untitledui/icons";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownAccount, type DropdownItem } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: string[] = [
	'<div class="relative inline-block"><button type="button" aria-haspopup="true" aria-expanded="false" id="react-aria-_R_1_" data-react-aria-pressable="true" tabindex="0" class="relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-body text-sm font-semibold no-underline cursor-pointer transition-colors duration-100 ease-linear focus-visible:outline-none focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 h-10 px-3.5 py-2.5 bg-primary text-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] not-disabled:hover:bg-primary_hover not-disabled:hover:text-secondary_hover [&amp;_svg]:text-fg-quaternary"><span class="px-0.5">Opciones</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></button></div>',
	'<div class="relative inline-block"><button type="button" aria-haspopup="true" aria-expanded="false" id="react-aria-_R_1_" data-react-aria-pressable="true" tabindex="0" class="relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-body text-sm font-semibold no-underline cursor-pointer transition-colors duration-100 ease-linear focus-visible:outline-none focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 h-10 px-3.5 py-2.5 bg-primary text-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] not-disabled:hover:bg-primary_hover not-disabled:hover:text-secondary_hover [&amp;_svg]:text-fg-quaternary"><span class="px-0.5">Cuenta</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></button><div class="absolute top-[calc(100%+4px)] left-0 z-30 min-w-60 rounded-lg bg-primary_alt py-1 font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none"><div class="mb-1 flex items-center gap-3 px-4 py-3 shadow-[inset_0_-1px_0_var(--border-secondary)]"><b>Olivia</b></div><template></template><span data-focus-scope-start="true" hidden=""></span><div class="outline-none" data-rac="" aria-label="Cuenta" role="menu" tabindex="0" data-collection="react-aria-_R_1a_"><div class="mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover text-secondary data-focused:text-secondary_hover [&amp;_svg]:text-fg-quaternary" data-rac="" id="react-aria-_R_2raH3_" role="menuitem" aria-labelledby="react-aria-_R_2ra_" aria-describedby="react-aria-_R_2raH1_ react-aria-_R_2raH2_" tabindex="-1" data-collection="react-aria-_R_1a_" data-key="0" data-react-aria-pressable="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 10L14 6M2.49997 21.5L5.88434 21.124C6.29783 21.078 6.50457 21.055 6.69782 20.9925C6.86926 20.937 7.03242 20.8586 7.18286 20.7594C7.35242 20.6475 7.49951 20.5005 7.7937 20.2063L21 7C22.1046 5.89543 22.1046 4.10457 21 3C19.8954 1.89543 18.1046 1.89543 17 3L3.7937 16.2063C3.49952 16.5005 3.35242 16.6475 3.24061 16.8171C3.1414 16.9676 3.06298 17.1307 3.00748 17.3022C2.94493 17.4954 2.92195 17.7021 2.87601 18.1156L2.49997 21.5Z"></path></svg><span class="flex min-w-0 flex-1 items-center gap-2" id="react-aria-_R_2ra_" slot="label">Editar<kbd class="rounded-sm text-xs font-medium text-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] px-1 font-body ml-auto">⌘E</kbd></span><span class="hidden" id="react-aria-_R_2raH1_" slot="description"></span><kbd dir="ltr" id="react-aria-_R_2raH2_" class="hidden"></kbd></div><div role="separator" class="my-1 h-px border-0 bg-[var(--border-secondary)]"></div><div class="mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover text-error-primary [&amp;_svg]:text-fg-error-secondary" data-rac="" id="react-aria-_R_6raH3_" role="menuitem" aria-labelledby="react-aria-_R_6ra_" aria-describedby="react-aria-_R_6raH1_ react-aria-_R_6raH2_" tabindex="-1" data-collection="react-aria-_R_1a_" data-key="2" data-react-aria-pressable="true"><span class="flex min-w-0 flex-1 items-center gap-2" id="react-aria-_R_6ra_" slot="label">Borrar</span><span class="hidden" id="react-aria-_R_6raH1_" slot="description"></span><kbd dir="ltr" id="react-aria-_R_6raH2_" class="hidden"></kbd></div></div><span data-focus-scope-end="true" hidden=""></span></div></div>',
	'<div class="relative inline-block"><button type="button" aria-haspopup="true" aria-expanded="false" id="react-aria-_R_1_" data-react-aria-pressable="true" tabindex="0" class="relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-body text-sm font-semibold no-underline cursor-pointer transition-colors duration-100 ease-linear focus-visible:outline-none focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 h-10 px-3.5 py-2.5 bg-primary text-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] not-disabled:hover:bg-primary_hover not-disabled:hover:text-secondary_hover [&amp;_svg]:text-fg-quaternary"><span class="px-0.5">Tema</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9L12 15L18 9"></path></svg></button><div class="absolute top-[calc(100%+4px)] left-0 z-30 min-w-60 rounded-lg bg-primary_alt py-1 font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none"><template></template><span data-focus-scope-start="true" hidden=""></span><div class="outline-none" data-rac="" aria-label="Tema" role="menu" tabindex="0" data-collection="react-aria-_R_1a_"><div class="mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover text-secondary data-focused:text-secondary_hover [&amp;_svg]:text-fg-quaternary" data-rac="" id="react-aria-_R_2raH3_" role="menuitemradio" aria-labelledby="react-aria-_R_2ra_" aria-describedby="react-aria-_R_2raH1_ react-aria-_R_2raH2_" aria-checked="true" tabindex="-1" data-collection="react-aria-_R_1a_" data-key="claro" data-react-aria-pressable="true" data-selected="true" data-selection-mode="single"><span class="flex min-w-0 flex-1 items-center gap-2" id="react-aria-_R_2ra_" slot="label">Claro</span><span class="hidden" id="react-aria-_R_2raH1_" slot="description"></span><kbd dir="ltr" id="react-aria-_R_2raH2_" class="hidden"></kbd><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="flex-none text-fg-brand-primary!"><path d="M20 6L9 17L4 12"></path></svg></div><div class="mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover text-secondary data-focused:text-secondary_hover [&amp;_svg]:text-fg-quaternary" data-rac="" id="react-aria-_R_4raH3_" role="menuitemradio" aria-labelledby="react-aria-_R_4ra_" aria-describedby="react-aria-_R_4raH1_ react-aria-_R_4raH2_" aria-checked="false" tabindex="-1" data-collection="react-aria-_R_1a_" data-key="oscuro" data-react-aria-pressable="true" data-selection-mode="single"><span class="flex min-w-0 flex-1 items-center gap-2" id="react-aria-_R_4ra_" slot="label">Oscuro</span><span class="hidden" id="react-aria-_R_4raH1_" slot="description"></span><kbd dir="ltr" id="react-aria-_R_4raH2_" class="hidden"></kbd></div></div><span data-focus-scope-end="true" hidden=""></span></div></div>',
];

const accounts: DropdownAccount[] = [
	{
		value: "olivia",
		name: "Olivia Rhye",
		email: "olivia@untitledui.com",
		initials: "OR",
		status: "online",
	},
	{ value: "sienna", name: "Sienna Hewitt", email: "sienna@untitledui.com", initials: "SH" },
];
const plain: DropdownItem[] = [{ label: "Ver perfil" }, { label: "Ajustes" }];
const files: DropdownItem[] = [
	{ label: "Factura enero" },
	{ label: "Invitación equipo" },
	{ label: "Inventario" },
	{ label: "Contrato" },
];

describe("Dropdown: sin las props nuevas", () => {
	it("el HTML es el de antes", () => {
		const items = [
			{ label: "Editar", icon: Edit02, shortcut: "⌘E" },
			{ divider: true as const },
			{ label: "Borrar", danger: true },
		];
		expect(renderToStaticMarkup(<Dropdown items={items} />)).toMatchBefore(BEFORE[0]);
		expect(
			renderToStaticMarkup(
				<Dropdown label="Cuenta" header={<b>Olivia</b>} defaultOpen items={items} />,
			),
		).toMatchBefore(BEFORE[1]);
		expect(
			renderToStaticMarkup(
				<Dropdown
					label="Tema"
					defaultOpen
					selectedValue="claro"
					items={[
						{ label: "Claro", value: "claro" },
						{ label: "Oscuro", value: "oscuro" },
					]}
				/>,
			),
		).toMatchBefore(BEFORE[2]);
	});
});

describe("Dropdown: searchable", () => {
	it("al escribir «inv» solo quedan las opciones que lo contienen y el foco sigue en el buscador", async () => {
		render(<Dropdown label="Archivos" searchable items={files} />);
		await userEvent.click(screen.getByRole("button", { name: "Archivos" }));
		const search = screen.getByRole("searchbox", { name: "Buscar" });
		expect(document.activeElement).toBe(search);
		await userEvent.keyboard("inv");
		const names = screen.getAllByRole("menuitem").map((o) => o.textContent);
		expect(names).toEqual(["Invitación equipo", "Inventario"]);
		expect(document.activeElement).toBe(search);
	});

	it("sin coincidencias dice «Sin resultados», y se puede cambiar el texto", async () => {
		render(<Dropdown label="Archivos" searchable emptyLabel="Nada por aquí" items={files} />);
		await userEvent.click(screen.getByRole("button", { name: "Archivos" }));
		await userEvent.keyboard("zzz");
		expect(screen.getByText("Nada por aquí")).toBeTruthy();
		expect(screen.queryByText("Factura")).toBeNull();
	});

	it("se elige con el teclado sin salir del buscador y avisa", async () => {
		const onSelect = vi.fn();
		render(
			<Dropdown
				label="Archivos"
				searchable
				items={[{ label: "Factura", onSelect }, { label: "Contrato" }]}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Archivos" }));
		await userEvent.keyboard("fact{ArrowDown}{Enter}");
		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it("usa textValue si la etiqueta no es texto, y al cerrar vacía la búsqueda", async () => {
		render(
			<Dropdown
				label="Archivos"
				searchable
				items={[{ label: <b>Factura</b>, textValue: "Factura" }, { label: "Contrato" }]}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Archivos" }));
		await userEvent.keyboard("fact");
		expect(screen.getAllByRole("menuitem")).toHaveLength(1);
		await userEvent.keyboard("{Escape}{Escape}");
		await userEvent.click(screen.getByRole("button", { name: "Archivos" }));
		expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
	});
});

describe("Dropdown: footer, título de grupo y trigger de enlace", () => {
	it("el pie sale tras las opciones, con texto o con un botón", () => {
		render(
			<Dropdown
				defaultOpen
				items={plain}
				footer={
					<>
						<span>© Regula</span>
						<span>v1.2.3</span>
					</>
				}
			/>,
		);
		expect(screen.getByText("© Regula")).toBeTruthy();
		expect(screen.getByText("v1.2.3")).toBeTruthy();
	});

	it("un botón en el pie funciona", async () => {
		const onClick = vi.fn();
		render(
			<Dropdown
				defaultOpen
				items={plain}
				footer={
					<button type="button" onClick={onClick}>
						Cerrar sesión
					</button>
				}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("heading agrupa las opciones siguientes bajo un nombre y no se puede elegir", () => {
		render(
			<Dropdown
				defaultOpen
				items={[
					{ label: "Perfil" },
					{ divider: true },
					{ heading: "Empresa" },
					{ label: "Regula" },
					{ label: "Otra" },
				]}
			/>,
		);
		const group = screen.getByRole("group", { name: "Empresa" });
		expect(
			within(group)
				.getAllByRole("menuitem")
				.map((i) => i.textContent),
		).toEqual(["Regula", "Otra"]);
		expect(screen.getAllByRole("menuitem")).toHaveLength(3);
	});

	it("triggerVariant link pinta texto con chevron, sin caja, y abre el menú con teclado", async () => {
		render(<Dropdown label="Puede editar" triggerVariant="link" items={plain} />);
		const trigger = screen.getByRole("button", { name: "Puede editar" });
		expect(trigger.className).toContain("bg-transparent");
		expect(trigger.className).not.toContain("border-primary");
		expect(trigger.querySelector("svg")).toBeTruthy();
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
	});

	it("con selectedValue el enlace sigue marcando la opción elegida", async () => {
		render(
			<Dropdown
				label="Puede editar"
				triggerVariant="link"
				selectedValue="edit"
				items={[
					{ label: "Propietario", value: "owner" },
					{ label: "Puede editar", value: "edit" },
				]}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Puede editar" }));
		expect(screen.getByRole("menuitemradio", { name: "Puede editar" }).getAttribute("aria-checked")).toBe(
			"true",
		);
	});
});

describe("Dropdown: integrations", () => {
	it("los logos van en una caja de 20px dentro del hueco del icono y el panel mide 216", () => {
		const { container } = render(
			<Dropdown
				variant="integrations"
				label="Copiar"
				defaultOpen
				items={[
					{ label: "Ver como markdown", icon: Copy01 },
					{ divider: true },
					{ label: "Abrir en v0", icon: <svg data-logo="v0" /> },
				]}
			/>,
		);
		const logo = container.querySelector("[data-logo=v0]") as Element;
		expect((logo.parentElement as HTMLElement).className).toContain("[&>*]:size-5");
		expect(container.querySelector(".min-w-54")).toBeTruthy();
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
	});
});

describe("Dropdown: cuentas", () => {
	const base = { accounts, items: plain } as const;

	it("account-avatar: el disparador es solo el avatar y se llama como el menú", () => {
		render(<Dropdown variant="account-avatar" label="Cuenta" {...base} />);
		const trigger = screen.getByRole("button", { name: "Cuenta" });
		expect(trigger.textContent).not.toContain("Olivia");
		expect(trigger.className).toContain("rounded-full");
	});

	it.each([
		["account-card-xs", "h-9"],
		["account-card-sm", "h-11"],
		["account-card-md", "h-14"],
		["account-breadcrumb", "h-7"],
	] as const)("%s: el disparador enseña la cuenta elegida (%s)", (variant, height) => {
		render(<Dropdown variant={variant} {...base} />);
		const trigger = screen.getByRole("button", { name: /Olivia Rhye/ });
		expect(trigger.className).toContain(height);
		expect(variant === "account-card-md" ? trigger.textContent : "").toContain(
			variant === "account-card-md" ? "olivia@untitledui.com" : "",
		);
	});

	it("account-button es el botón de siempre", async () => {
		render(<Dropdown variant="account-button" label="Cuenta" {...base} />);
		await userEvent.click(screen.getByRole("button", { name: "Cuenta" }));
		expect(screen.getByRole("group", { name: "Cambiar de cuenta" })).toBeTruthy();
	});

	it("elegir otra cuenta la deja marcada y avisa con su valor", async () => {
		const onAccountChange = vi.fn();
		render(<Dropdown variant="account-card-sm" onAccountChange={onAccountChange} {...base} />);
		await userEvent.click(screen.getByRole("button", { name: /Olivia Rhye/ }));
		expect(screen.getByRole("menuitemradio", { name: "Olivia Rhye" }).getAttribute("aria-checked")).toBe(
			"true",
		);
		await userEvent.click(screen.getByRole("menuitemradio", { name: "Sienna Hewitt" }));
		expect(onAccountChange).toHaveBeenCalledWith("sienna");
		expect(screen.getByRole("button", { name: /Sienna Hewitt/ })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: /Sienna Hewitt/ }));
		expect(
			screen.getByRole("menuitemradio", { name: "Sienna Hewitt" }).getAttribute("aria-checked"),
		).toBe("true");
		expect(screen.getByRole("menuitemradio", { name: "Olivia Rhye" }).getAttribute("aria-checked")).toBe(
			"false",
		);
	});

	it("controlado: manda el valor del padre", async () => {
		render(<Dropdown variant="account-card-xs" account="olivia" {...base} />);
		await userEvent.click(screen.getByRole("button", { name: /Olivia Rhye/ }));
		await userEvent.click(screen.getByRole("menuitemradio", { name: "Sienna Hewitt" }));
		expect(screen.getByRole("button", { name: /Olivia Rhye/ })).toBeTruthy();
	});

	it("se cambia de cuenta con el teclado", async () => {
		const onAccountChange = vi.fn();
		render(
			<Dropdown variant="account-button" label="Cuenta" onAccountChange={onAccountChange} {...base} />,
		);
		screen.getByRole("button", { name: "Cuenta" }).focus();
		await userEvent.keyboard("{Enter}");
		// al abrir, el foco está en «Ver perfil»; tres bajadas llegan a «Sienna»
		await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
		expect(onAccountChange).toHaveBeenCalledWith("sienna");
	});

	it("el marcador {accounts: true} fija dónde va la lista; sin él, va al final tras un separador", () => {
		const { rerender } = render(
			<Dropdown
				variant="account-button"
				label="Cuenta"
				defaultOpen
				accounts={accounts}
				items={[
					{ label: "Perfil" },
					{ divider: true },
					{ accounts: true },
					{ divider: true },
					{ label: "Salir" },
				]}
			/>,
		);
		let order = screen.getAllByRole("menuitem", { hidden: true }).map((i) => i.textContent);
		expect(order.at(-1)).toBe("Salir");
		rerender(
			<Dropdown
				variant="account-button"
				label="Cuenta"
				defaultOpen
				accounts={accounts}
				items={plain}
			/>,
		);
		order = screen.getAllByRole("menuitem", { hidden: true }).map((i) => i.textContent);
		expect(order.slice(0, 2)).toEqual(["Ver perfil", "Ajustes"]);
	});

	it("onAddAccount añade la fila «Añadir cuenta» y avisa", async () => {
		const onAddAccount = vi.fn();
		render(<Dropdown variant="account-button" label="Cuenta" onAddAccount={onAddAccount} {...base} />);
		await userEvent.click(screen.getByRole("button", { name: "Cuenta" }));
		await userEvent.click(screen.getByRole("menuitem", { name: "Añadir cuenta" }));
		expect(onAddAccount).toHaveBeenCalledTimes(1);
	});

	it("en las migas las filas llevan el correo", async () => {
		render(<Dropdown variant="account-breadcrumb" {...base} />);
		await userEvent.click(screen.getByRole("button", { name: /Olivia Rhye/ }));
		expect(screen.getByRole("menuitemradio", { name: /Sienna Hewitt/ }).textContent).toContain(
			"sienna@untitledui.com",
		);
	});

	it("la cabecera y el pie de cuenta salen en el panel", () => {
		render(
			<Dropdown
				variant="account-card-md"
				defaultOpen
				header={<span>Cuenta PRO</span>}
				footer={<span>v12.6.8</span>}
				{...base}
			/>,
		);
		expect(screen.getByText("Cuenta PRO")).toBeTruthy();
		expect(screen.getByText("v12.6.8")).toBeTruthy();
	});

	it("es accesible, con el panel abierto, en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Dropdown
				variant="account-card-md"
				defaultOpen
				searchable
				header={<span>Cuenta PRO</span>}
				footer={<span>v12.6.8</span>}
				onAddAccount={() => {}}
				{...base}
				items={[
					{ label: "Perfil" },
					{ divider: true },
					{ heading: "Empresa" },
					{ label: "Regula" },
					{ accounts: true },
				]}
			/>,
		);
		await expectAccessibleInThemes(<Dropdown variant="account-avatar" label="Cuenta" {...base} />);
		await expectAccessibleInThemes(<Dropdown label="Puede editar" triggerVariant="link" items={plain} />);
	});
});
