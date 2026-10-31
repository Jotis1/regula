import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonGroup, CloseButton } from "../src/index.js";
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
			<Button hierarchy="secondary" size="lg" iconLeading="plus">
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
			<Button size="xs" iconTrailing="arrow-right">
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
		render(<Button hierarchy="secondary" iconOnly="edit-02" label="Editar" />);
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
		expect(button.querySelector("svg")?.getAttribute("class")).toContain("jm-icon-spin");
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
		const b = <Button iconOnly="edit-02" />;
		expect([a, b]).toHaveLength(2);
	});

	it("es accesible en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Button>Guardar</Button>
				<Button hierarchy="secondary" destructive iconLeading="trash-01">
					Borrar
				</Button>
				<Button hierarchy="tertiary" iconOnly="dots-vertical" label="Más" />
				<Button hierarchy="link-color" href="/detalles">
					Ver detalles
				</Button>
			</div>,
		);
	});
});

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

	it("es accesible", async () => {
		await expectAccessibleInThemes(<CloseButton />);
	});
});

describe("ButtonGroup", () => {
	const items = [
		{ value: "a", label: "12 meses" },
		{ value: "b", label: "30 días" },
		{ value: "d", label: "24 horas", icon: "clock" as const },
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

	it("es accesible", async () => {
		await expectAccessibleInThemes(<ButtonGroup aria-label="Periodo" items={items} defaultValue="a" />);
	});
});
