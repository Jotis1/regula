import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AlignLeft, ArrowRight, Clock, DotsVertical, Edit02, Grid01, Plus, Trash01 } from "@untitledui/icons";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonGroup, type ButtonGroupItem, CloseButton } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Button", () => {
	it("es primario y md por defecto, con el texto en una etiqueta con padding", () => {
		render(<Button>Guardar</Button>);
		const button = screen.getByRole("button", { name: "Guardar" });
		expect(button.getAttribute("type")).toBe("button");
		expect(button.className).toContain("bg-brand-solid");
		expect(button.className).toContain("h-10");
		expect(button.querySelector("span")?.className).toBe("px-0.5");
	});

	it("aplica jerarquía, tamaño e icono inicial", () => {
		render(
			<Button hierarchy="secondary" size="lg" iconLeading={Plus}>
				Nuevo gasto
			</Button>,
		);
		const button = screen.getByRole("button", { name: "Nuevo gasto" });
		expect(button.className).toContain("h-11");
		expect(button.className).toContain("text-secondary");
		const [icon, label] = [...button.children];
		expect(icon?.tagName.toLowerCase()).toBe("svg");
		expect(icon?.getAttribute("width")).toBe("20");
		expect(label?.textContent).toBe("Nuevo gasto");
	});

	it("los iconos de xs miden 16", () => {
		render(
			<Button size="xs" iconTrailing={ArrowRight}>
				xs
			</Button>,
		);
		expect(screen.getByRole("button").querySelector("svg")?.getAttribute("width")).toBe("16");
	});

	it("destructivo usa los colores de error y su anillo de foco", () => {
		render(<Button destructive>Eliminar</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("bg-error-solid");
		expect(button.className).toContain("focus-visible:shadow-focus-ring-error");
	});

	it("solo icono: lleva el nombre accesible de label", () => {
		render(<Button hierarchy="secondary" iconOnly={Edit02} label="Editar" />);
		const button = screen.getByRole("button", { name: "Editar" });
		expect(button.className).toContain("w-10");
	});

	it("deshabilitado: no responde ni recibe foco", async () => {
		const onClick = vi.fn();
		render(
			<>
				<Button disabled onClick={onClick}>
					Deshabilitado
				</Button>
				<Button>Siguiente</Button>
			</>,
		);
		const disabled = screen.getByRole("button", { name: "Deshabilitado" });
		expect(disabled.className).toContain("disabled:opacity-50");
		await userEvent.click(disabled);
		expect(onClick).not.toHaveBeenCalled();
		await userEvent.tab();
		expect(document.activeElement).toBe(screen.getByRole("button", { name: "Siguiente" }));
	});

	it("cargando: spinner, aria-busy y desactivado", () => {
		render(<Button loading>Guardando</Button>);
		const button = screen.getByRole("button", { name: "Guardando" });
		expect(button.getAttribute("aria-busy")).toBe("true");
		expect((button as HTMLButtonElement).disabled).toBe(true);
		expect(button.querySelector("svg")?.getAttribute("class")).toContain("animate-spin");
	});

	it("con href se pinta como enlace con el mismo aspecto", () => {
		render(<Button href="/ajustes">Ajustes</Button>);
		const link = screen.getByRole("link", { name: "Ajustes" });
		expect(link.getAttribute("href")).toBe("/ajustes");
		expect(link.className).toContain("bg-brand-solid");
	});

	it("el className del consumidor gana en conflictos", () => {
		render(<Button className="h-14">Alto</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("h-14");
		expect(button.className).not.toContain("h-10");
	});

	it("se renderiza en servidor sin estado", () => {
		expect(renderToStaticMarkup(<Button>Guardar</Button>)).toContain("<button");
	});

	it("rechaza props inválidas en compilación", () => {
		// @ts-expect-error: no existe la jerarquía "ghost"
		const a = <Button hierarchy="ghost">x</Button>;
		// @ts-expect-error: un botón solo con icono necesita label
		const b = <Button iconOnly={Edit02} />;
		expect([a, b]).toHaveLength(2);
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Button>Guardar</Button>
				<Button hierarchy="secondary" destructive iconLeading={Trash01}>
					Borrar
				</Button>
				<Button hierarchy="tertiary" iconOnly={DotsVertical} label="Más" />
				<Button hierarchy="link-color" href="/detalles">
					Ver detalles
				</Button>
			</div>,
		);
	});
});

const CLOSE_BEFORE = [
	'<button type="button" aria-label="Cerrar" class="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6L18 18"></path></svg></button>',
	'<button type="button" aria-label="Cerrar aviso" class="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6L18 18"></path></svg></button>',
];
const GROUP_BEFORE =
	'<fieldset aria-label="Periodo" class="m-0 inline-flex min-w-0 overflow-hidden border-0 p-0 rounded-lg shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]"><button type="button" aria-pressed="false" class="inline-flex h-10 cursor-pointer items-center gap-2 border-l border-primary bg-primary px-4 py-2.5 font-body text-sm font-semibold text-secondary transition-colors duration-100 first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover [&amp;_svg]:text-fg-quaternary">12 meses</button><button type="button" aria-pressed="true" class="inline-flex h-10 cursor-pointer items-center gap-2 border-l border-primary bg-primary px-4 py-2.5 font-body text-sm font-semibold text-secondary transition-colors duration-100 first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover [&amp;_svg]:text-fg-quaternary">30 días</button><button type="button" aria-pressed="false" class="inline-flex h-10 cursor-pointer items-center gap-2 border-l border-primary bg-primary px-4 py-2.5 font-body text-sm font-semibold text-secondary transition-colors duration-100 first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover [&amp;_svg]:text-fg-quaternary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"></path></svg>24 horas</button></fieldset>';

describe("CloseButton", () => {
	it("se llama «Cerrar» por defecto y admite otro nombre", () => {
		render(
			<>
				<CloseButton />
				<CloseButton label="Cerrar aviso" />
			</>,
		);
		expect(screen.getByRole("button", { name: "Cerrar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cerrar aviso" })).toBeTruthy();
	});

	it("sin las props nuevas, el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<CloseButton />)).toMatchBefore(CLOSE_BEFORE[0]);
		expect(renderToStaticMarkup(<CloseButton label="Cerrar aviso" />)).toMatchBefore(CLOSE_BEFORE[1]);
	});

	it.each([
		["sm", "size-9", "20"],
		["md", "size-10", "20"],
		["lg", "size-11", "24"],
	] as const)("tamaño %s: caja %s y X de %s px", (size, box, icon) => {
		render(<CloseButton size={size} />);
		const button = screen.getByRole("button", { name: "Cerrar" });
		expect(button.className).toContain(box);
		expect(button.querySelector("svg")?.getAttribute("width")).toBe(icon);
	});

	it("onDark pinta la X clara y el fondo blanco translúcido al pasar por encima", () => {
		render(<CloseButton onDark />);
		const { className } = screen.getByRole("button", { name: "Cerrar" });
		expect(className).toContain("text-fg-white/70");
		expect(className).toContain("hover:bg-fg-white/20");
		expect(className).not.toContain("text-fg-quaternary");
	});

	it("es accesible", async () => {
		await expectAccessibleInThemes(<CloseButton />);
		await expectAccessibleInThemes(<CloseButton size="lg" onDark />);
	});
});

describe("ButtonGroup", () => {
	const items = [
		{ value: "a", label: "12 meses" },
		{ value: "b", label: "30 días" },
		{ value: "d", label: "24 horas", icon: Clock },
	];

	it("marca la opción elegida con aria-pressed y cambia al pulsar", async () => {
		const onChange = vi.fn();
		render(<ButtonGroup aria-label="Periodo" items={items} defaultValue="b" onChange={onChange} />);
		expect(screen.getByRole("group", { name: "Periodo" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "30 días" }).getAttribute("aria-pressed")).toBe("true");
		await userEvent.click(screen.getByRole("button", { name: "24 horas" }));
		expect(onChange).toHaveBeenCalledWith("d");
		expect(screen.getByRole("button", { name: "24 horas" }).getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByRole("button", { name: "30 días" }).getAttribute("aria-pressed")).toBe("false");
	});

	it("se maneja con teclado", async () => {
		render(<ButtonGroup aria-label="Periodo" items={items} />);
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard("{Enter}");
		expect(screen.getByRole("button", { name: "30 días" }).getAttribute("aria-pressed")).toBe("true");
		await userEvent.tab();
		await userEvent.keyboard(" ");
		expect(screen.getByRole("button", { name: "24 horas" }).getAttribute("aria-pressed")).toBe("true");
	});

	it("controlado: manda el valor del padre", async () => {
		render(<ButtonGroup items={items} value="a" />);
		await userEvent.click(screen.getByRole("button", { name: "30 días" }));
		expect(screen.getByRole("button", { name: "12 meses" }).getAttribute("aria-pressed")).toBe("true");
	});

	it("sin las props nuevas, el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(<ButtonGroup aria-label="Periodo" items={items} defaultValue="b" />),
		).toMatchBefore(GROUP_BEFORE);
	});

	it("size: md mide 40 px y sm 36 px, con los rellenos del Figma", () => {
		const { rerender } = render(
			<ButtonGroup
				aria-label="Vista"
				size="sm"
				items={[
					{ value: "a", label: "Texto" },
					{ value: "b", label: "Reloj", icon: Clock },
				]}
			/>,
		);
		const [text, withIcon] = screen.getAllByRole("button");
		expect(text?.className).toContain("h-9");
		expect(text?.className).toContain("px-3.5");
		expect(withIcon?.className).toContain("pl-3");
		expect(withIcon?.className).toContain("pr-3.5");
		expect(withIcon?.className).toContain("gap-1.5");
		rerender(<ButtonGroup aria-label="Vista" items={[{ value: "a", label: "Texto" }]} />);
		expect(screen.getByRole("button", { name: "Texto" }).className).toContain("h-10");
	});

	it("iconOnly enseña solo el icono y se llama como su label", async () => {
		const onChange = vi.fn();
		render(
			<ButtonGroup
				aria-label="Vista"
				onChange={onChange}
				items={[
					{ value: "grid", iconOnly: Grid01, label: "Cuadrícula" },
					{ value: "list", iconOnly: AlignLeft, label: "Lista" },
				]}
			/>,
		);
		const grid = screen.getByRole("button", { name: "Cuadrícula" });
		expect(grid.querySelector("svg")).toBeTruthy();
		expect(grid.textContent).toBe("Cuadrícula");
		expect(grid.querySelector(".sr-only")?.textContent).toBe("Cuadrícula");
		expect(grid.className).toContain("px-3");
		await userEvent.click(screen.getByRole("button", { name: "Lista" }));
		expect(onChange).toHaveBeenCalledWith("list");
	});

	it("iconOnly exige label y no admite texto (tipos)", () => {
		// @ts-expect-error sin label no hay nombre accesible
		const sinLabel: ButtonGroupItem = { value: "a", iconOnly: Grid01 };
		// @ts-expect-error con iconOnly no se admite icon
		const conIcon: ButtonGroupItem = { value: "a", iconOnly: Grid01, label: "A", icon: Clock };
		expect([sinLabel, conIcon]).toHaveLength(2);
	});

	it("dot pinta un punto decorativo que los lectores no anuncian", () => {
		render(
			<ButtonGroup
				aria-label="Estado"
				items={[
					{ value: "on", label: "Activo", dot: true },
					{ value: "off", label: "Inactivo" },
				]}
			/>,
		);
		const on = screen.getByRole("button", { name: "Activo" });
		const dot = on.querySelector("span[aria-hidden=true]");
		expect(dot?.className).toContain("size-2.5");
		expect(dot?.className).toContain("rounded-full");
		expect(screen.getByRole("button", { name: "Inactivo" }).querySelector("span")).toBeNull();
	});

	it("es accesible", async () => {
		await expectAccessibleInThemes(<ButtonGroup aria-label="Periodo" items={items} defaultValue="a" />);
		await expectAccessibleInThemes(
			<ButtonGroup
				aria-label="Vista"
				size="sm"
				defaultValue="grid"
				items={[
					{ value: "grid", iconOnly: Grid01, label: "Cuadrícula" },
					{ value: "on", label: "Activo", dot: true },
				]}
			/>,
		);
	});
});
