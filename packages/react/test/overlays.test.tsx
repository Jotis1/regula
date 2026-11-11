import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button, Input, Modal, Slideout } from "../src/index.js";
import { axeViolations, expectAccessibleInThemes } from "./helpers.js";

const actions = (
	<>
		<Button hierarchy="secondary">Cancelar</Button>
		<Button destructive>Eliminar</Button>
	</>
);

function ModalOpener({ onCloseSpy }: { onCloseSpy?: () => void }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Borrar gasto
			</button>
			<Modal
				open={open}
				icon="trash-01"
				destructive
				title="¿Eliminar este gasto?"
				description="No se puede deshacer."
				onClose={() => {
					onCloseSpy?.();
					setOpen(false);
				}}
				actions={actions}
			/>
		</>
	);
}

function SlideoutOpener() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Ver alquiler
			</button>
			<Slideout
				open={open}
				title="Alquiler"
				description="Movimiento del 1 de octubre"
				onClose={() => setOpen(false)}
				actions={<Button>Guardar</Button>}
			>
				<Input label="Concepto" defaultValue="Alquiler" />
			</Slideout>
		</>
	);
}

describe("Modal", () => {
	it("con teclado: el foco recorre solo el modal, Escape lo cierra y el foco vuelve al botón que lo abrió", async () => {
		render(<ModalOpener />);
		const opener = screen.getByRole("button", { name: "Borrar gasto" });
		await userEvent.click(opener);
		const dialog = screen.getByRole("dialog", { name: "¿Eliminar este gasto?" });
		expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
		expect(document.getElementById(dialog.getAttribute("aria-describedby") as string)?.textContent).toBe(
			"No se puede deshacer.",
		);
		await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
		for (let i = 0; i < 6; i++) {
			await userEvent.tab();
			expect(dialog.contains(document.activeElement)).toBe(true);
		}
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).toBeNull();
		await waitFor(() => expect(document.activeElement).toBe(opener));
	});

	it("la X y el clic fuera cierran", async () => {
		const spy = vi.fn();
		render(<ModalOpener onCloseSpy={spy} />);
		await userEvent.click(screen.getByRole("button", { name: "Borrar gasto" }));
		await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
		expect(spy).toHaveBeenCalledTimes(1);
		await userEvent.click(screen.getByRole("button", { name: "Borrar gasto" }));
		const overlay = screen.getByRole("dialog").parentElement?.parentElement as HTMLElement;
		expect(overlay.className).toContain("bg-overlay/70");
		expect(overlay.className).toContain("[backdrop-filter:var(--backdrop-blur-lg)]");
		expect(overlay.className).toContain("fixed");
		await userEvent.click(overlay);
		expect(spy).toHaveBeenCalledTimes(2);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("sin onClose no hay X y Escape no lo cierra; open=false no pinta nada", async () => {
		const { rerender } = render(
			<Modal title="Sesión caducada" actions={<Button>Volver a entrar</Button>} />,
		);
		expect(screen.queryByRole("button", { name: "Cerrar" })).toBeNull();
		await waitFor(() => expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true));
		await userEvent.keyboard("{Escape}");
		expect(screen.getByRole("dialog")).toBeTruthy();
		rerender(<Modal open={false} title="Sesión caducada" />);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("icono destacado en error si es destructivo; apilado reparte los botones y horizontal los alinea a la derecha", () => {
		const { rerender } = render(
			<Modal contained icon="trash-01" destructive title="¿Eliminar?" actions={actions} />,
		);
		const dialog = screen.getByRole("dialog", { name: "¿Eliminar?" });
		expect(dialog.className).toContain("max-w-[var(--width-sm)]");
		expect(dialog.className).toContain("rounded-2xl");
		const icon = dialog.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(icon.className).toMatch(/error/);
		const foot = screen.getByRole("button", { name: "Eliminar" }).parentElement as HTMLElement;
		expect(foot.className).toContain("[&>*]:flex-1");
		rerender(
			<Modal
				contained
				layout="horizontal"
				icon="info-circle"
				title="¿Seguro?"
				actions={actions}
				width={560}
			/>,
		);
		const foot2 = screen.getByRole("button", { name: "Eliminar" }).parentElement as HTMLElement;
		expect(foot2.className).toContain("justify-end");
		expect(screen.getByRole("dialog").style.maxWidth).toBe("560px");
		expect(
			screen.getByRole("heading", { name: "¿Seguro?" }).closest("div")?.parentElement?.className,
		).toContain("flex-row");
	});

	it("sin align, media, footerStart ni dividers el HTML es el de siempre", async () => {
		const { renderToStaticMarkup } = await import("react-dom/server");
		const html = (extra: object) =>
			renderToStaticMarkup(
				<Modal contained icon="trash-01" title="¿Eliminar?" actions={actions} {...extra} />,
			);
		expect(html({ align: undefined, media: undefined, footerStart: undefined, dividers: false })).toBe(
			html({}),
		);
		expect(html({})).toContain('class="flex gap-3 px-6 pt-8 pb-6 [&amp;&gt;*]:flex-1"');
	});

	it("align centra la cabecera; media va encima; footerStart a la izquierda del pie; dividers raya cabecera y pie", () => {
		const { rerender } = render(
			<Modal
				contained
				align="center"
				media={<img alt="Portada" src="data:," />}
				title="Informe publicado"
				footerStart={<Button hierarchy="link-gray">Ayuda</Button>}
				dividers
				actions={actions}
			>
				<Input label="Enlace" />
			</Modal>,
		);
		const dialog = screen.getByRole("dialog", { name: "Informe publicado" });
		const header = screen.getByRole("heading", { name: "Informe publicado" }).closest("div")
			?.parentElement as HTMLElement;
		expect(header.className).toContain("text-center");
		expect(header.className).toContain("inset_0_-1px_0");
		// La imagen va antes que la cabecera
		const img = screen.getByRole("img", { name: "Portada" });
		expect(img.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		const foot = screen.getByRole("button", { name: "Eliminar" }).parentElement
			?.parentElement as HTMLElement;
		expect(foot.className).toContain("inset_0_1px_0");
		expect(foot.firstElementChild?.className).toContain("mr-auto");
		expect(foot.firstElementChild?.textContent).toBe("Ayuda");
		expect(dialog).toBeTruthy();
		// Sin contenido, una sola raya: la de la cabecera
		rerender(<Modal contained dividers title="Hecho" actions={actions} />);
		const foot2 = screen.getByRole("button", { name: "Eliminar" }).parentElement
			?.parentElement as HTMLElement;
		expect(foot2.className).not.toContain("inset_0_1px_0");
		// En horizontal align no centra
		rerender(<Modal contained layout="horizontal" align="center" title="Hecho" actions={actions} />);
		expect(
			screen.getByRole("heading", { name: "Hecho" }).closest("div")?.parentElement?.className,
		).not.toContain("text-center");
	});

	it("contained: no se lleva el foco; Escape y clic en el fondo cierran", async () => {
		const onClose = vi.fn();
		render(
			<div style={{ position: "relative" }}>
				<Modal contained title="¿Eliminar?" onClose={onClose} actions={actions} />
			</div>,
		);
		expect(document.activeElement).toBe(document.body);
		const dialog = screen.getByRole("dialog");
		const overlay = dialog.parentElement as HTMLElement;
		expect(overlay.className).toContain("absolute");
		await userEvent.click(overlay);
		expect(onClose).toHaveBeenCalledTimes(1);
		screen.getByRole("button", { name: "Cancelar" }).focus();
		await userEvent.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(2);
	});

	it("axe en claro y oscuro (contained) y sobre la página", async () => {
		await expectAccessibleInThemes(
			<div style={{ position: "relative" }}>
				<Modal
					contained
					icon="trash-01"
					destructive
					title="¿Eliminar?"
					description="No se puede deshacer."
					onClose={() => {}}
					actions={actions}
				/>
			</div>,
		);
		render(<Modal title="¿Eliminar?" onClose={() => {}} actions={actions} />);
		expect(await axeViolations(document.body)).toEqual([]);
	});
});

describe("Slideout", () => {
	it("con teclado: foco atrapado, Escape cierra y el foco vuelve", async () => {
		render(<SlideoutOpener />);
		const opener = screen.getByRole("button", { name: "Ver alquiler" });
		await userEvent.click(opener);
		const panel = screen.getByRole("dialog", { name: "Alquiler" });
		await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true));
		for (let i = 0; i < 5; i++) {
			await userEvent.tab();
			expect(panel.contains(document.activeElement)).toBe(true);
		}
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).toBeNull();
		await waitFor(() => expect(document.activeElement).toBe(opener));
	});

	it("side: por defecto sale a la derecha; con `left`, a la izquierda, y el filo pasa al lado contrario", () => {
		const overlay = (el: HTMLElement) => el.parentElement as HTMLElement;
		const { rerender } = render(<Slideout contained title="Alquiler" />);
		let panel = screen.getByRole("dialog", { name: "Alquiler" });
		expect(overlay(panel).className).toContain("justify-end");
		expect(panel.className).toContain("inset_1px_0_0");
		rerender(<Slideout contained title="Alquiler" side="left" />);
		panel = screen.getByRole("dialog", { name: "Alquiler" });
		expect(overlay(panel).className).toContain("justify-start");
		expect(overlay(panel).className).not.toContain("justify-end");
		expect(panel.className).toContain("inset_-1px_0_0");
	});

	it("cabecera con X, cuerpo con el contenido, pie a la derecha con línea; ancho por defecto 400", () => {
		render(
			<Slideout
				contained
				title="Alquiler"
				onClose={() => {}}
				actions={<Button>Guardar</Button>}
				width={480}
			>
				<Input label="Concepto" />
			</Slideout>,
		);
		const panel = screen.getByRole("dialog", { name: "Alquiler" });
		expect(panel.className).toContain("max-w-[400px]");
		expect(panel.style.maxWidth).toBe("480px");
		expect(panel.parentElement?.className).toContain("justify-end");
		const foot = screen.getByRole("button", { name: "Guardar" }).parentElement as HTMLElement;
		expect(foot.className).toContain("justify-end");
		expect(foot.className).toContain("shadow-[inset_0_1px_0_var(--border-secondary)]");
		expect(screen.getByRole("textbox", { name: "Concepto" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cerrar" })).toBeTruthy();
	});

	it("axe en claro y oscuro (contained) y sobre la página", async () => {
		await expectAccessibleInThemes(
			<div style={{ position: "relative" }}>
				<Slideout
					contained
					title="Alquiler"
					description="Movimiento del 1 de octubre"
					onClose={() => {}}
					actions={<Button>Guardar</Button>}
				>
					<Input label="Concepto" defaultValue="Alquiler" />
				</Slideout>
			</div>,
		);
		render(
			<Slideout title="Alquiler" onClose={() => {}}>
				<Input label="Concepto" />
			</Slideout>,
		);
		expect(await axeViolations(document.body)).toEqual([]);
	});
});
