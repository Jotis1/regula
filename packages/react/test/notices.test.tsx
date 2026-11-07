import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert, Banner, Button, Notification, Tooltip } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

afterEach(() => {
	vi.useRealTimers();
});

describe("Tooltip", () => {
	it("aparece al enfocar con teclado, describe el control y Escape lo cierra", async () => {
		render(
			<Tooltip title="Ayuda" text="Abre la guía de uso.">
				<Button hierarchy="secondary" iconOnly="help-circle" label="Ayuda" />
			</Tooltip>,
		);
		expect(screen.queryByRole("tooltip")).toBeNull();
		await userEvent.tab();
		const tip = await screen.findByRole("tooltip");
		expect(tip.textContent).toContain("Abre la guía de uso.");
		const button = screen.getByRole("button", { name: "Ayuda" });
		expect(button.getAttribute("aria-describedby")).toBe(tip.id);
		expect(tip.className).toContain("bg-primary-solid");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
	});

	it("open lo fuerza en línea sobre el disparador, con flecha, y lo enlaza", () => {
		render(
			<Tooltip title="Con texto de apoyo" text="Una frase más." open>
				<Button hierarchy="secondary">Pasa el ratón</Button>
			</Tooltip>,
		);
		const tip = screen.getByRole("tooltip");
		expect(screen.getByRole("button").getAttribute("aria-describedby")).toBe(tip.id);
		for (const c of [
			"absolute",
			"bottom-[calc(100%+10px)]",
			"after:border-t-[var(--bg-primary-solid)]",
			"p-3",
		])
			expect(tip.className).toContain(c);
		expect(tip.querySelector("span")?.className).toContain("text-tooltip-supporting-text");
	});

	it("cada posición pone la burbuja y su flecha en su sitio (open)", () => {
		const cases = [
			["top", "bottom-[calc(100%+10px)]", "after:top-full"],
			["bottom", "top-[calc(100%+10px)]", "after:bottom-full"],
			["left", "right-[calc(100%+10px)]", "after:left-full"],
			["right", "left-[calc(100%+10px)]", "after:right-full"],
		] as const;
		for (const [placement, bubble, arrow] of cases) {
			const { unmount } = render(
				<Tooltip title="Un tooltip" open placement={placement}>
					<Button hierarchy="secondary">Botón</Button>
				</Tooltip>,
			);
			const tip = screen.getByRole("tooltip");
			expect(tip.className).toContain(bubble);
			expect(tip.className).toContain(arrow);
			unmount();
		}
	});

	it("la flecha va al principio, al final o centrada del borde, o se quita (open)", () => {
		const html = (arrow: "center" | "start" | "end" | false) => {
			const { unmount } = render(
				<Tooltip title="Un tooltip" open placement="top" arrow={arrow}>
					<Button hierarchy="secondary">Botón</Button>
				</Tooltip>,
			);
			const cls = screen.getByRole("tooltip").className;
			unmount();
			return cls;
		};
		expect(html("center")).toContain("after:left-1/2");
		expect(html("start")).toContain("after:left-3");
		expect(html("start")).toContain("left-0");
		expect(html("end")).toContain("after:right-3");
		expect(html("end")).toContain("right-0");
		expect(html(false)).not.toContain("after:");
	});

	it("sin props, el HTML es el de siempre (arriba, flecha centrada)", () => {
		const bare = renderToString(
			<Tooltip title="Un tooltip" open>
				<Button hierarchy="secondary">Botón</Button>
			</Tooltip>,
		);
		const explicit = renderToString(
			<Tooltip title="Un tooltip" open placement="top" arrow="center">
				<Button hierarchy="secondary">Botón</Button>
			</Tooltip>,
		);
		expect(explicit).toBe(bare);
		expect(bare).toContain("bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2");
	});

	it("con placement a un lado, al enfocar sale ahí con la flecha en el borde contrario; arrow=false la quita", async () => {
		const { unmount } = render(
			<Tooltip title="Ayuda" placement="right" arrow="start">
				<Button hierarchy="secondary" iconOnly="help-circle" label="Ayuda" />
			</Tooltip>,
		);
		await userEvent.tab();
		const tip = await screen.findByRole("tooltip");
		expect(tip.className).toContain("after:right-full");
		expect(tip.className).toContain("after:top-3");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
		unmount();
		render(
			<Tooltip title="Ayuda" placement="bottom" arrow={false}>
				<Button hierarchy="secondary" iconOnly="help-circle" label="Ayuda" />
			</Tooltip>,
		);
		await userEvent.tab();
		const bare = await screen.findByRole("tooltip");
		expect(bare.className).not.toContain("after:");
		expect(bare.querySelector("svg")).toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Tooltip title="Esto es un tooltip" open>
				<Button hierarchy="secondary" iconOnly="help-circle" label="Ayuda" />
			</Tooltip>,
		);
	});
});

describe("Alert", () => {
	it("status salvo en error (alert); icono por color; el color solo va en el icono", () => {
		const { rerender } = render(<Alert color="success" title="Copia de seguridad completada" />);
		const status = screen.getByRole("status");
		expect(status.textContent).toContain("Copia de seguridad completada");
		expect(status.querySelector(".text-secondary")?.textContent).toBe("Copia de seguridad completada");
		rerender(<Alert color="error" title="No se pudo sincronizar" description="Revisa la conexión." />);
		const alert = screen.getByRole("alert");
		expect(alert.querySelector(".text-tertiary")?.textContent).toBe("Revisa la conexión.");
		expect(alert.className).toContain("rounded-xl");
	});

	it("la X se llama Descartar (sustituible) y avisa; full va a todo el ancho sin radio", async () => {
		const onClose = vi.fn();
		const { rerender } = render(<Alert color="brand" title="Hay una actualización" onClose={onClose} />);
		await userEvent.click(screen.getByRole("button", { name: "Descartar" }));
		expect(onClose).toHaveBeenCalledOnce();
		rerender(<Alert title="Aviso" variant="full" onClose={onClose} closeLabel="Ocultar" />);
		expect(screen.getByRole("button", { name: "Ocultar" })).toBeTruthy();
		expect(screen.getByRole("status").className).toContain("rounded-none");
	});

	it("se pinta en servidor sin directiva", () => {
		const html = renderToString(<Alert color="warning" title="Presupuesto casi agotado" />);
		expect(html).toContain('role="status"');
		expect(html).toContain("Presupuesto casi agotado");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Alert
					color="brand"
					title="Hay una actualización disponible"
					description="La nueva versión mejora la importación."
					onClose={() => {}}
					actions={<Button hierarchy="link-color">Ver cambios</Button>}
				/>
				<Alert color="error" title="No se pudo sincronizar" />
			</div>,
		);
	});
});

describe("Notification", () => {
	it("se cierra sola a los 6 s si tiene onClose y no tiene acciones", () => {
		vi.useFakeTimers();
		const onClose = vi.fn();
		render(<Notification color="success" title="Pago registrado" onClose={onClose} />);
		act(() => vi.advanceTimersByTime(5900));
		expect(onClose).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(200));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("el tiempo se para con el ratón encima o el foco dentro y sigue al salir", () => {
		vi.useFakeTimers();
		const onClose = vi.fn();
		render(<Notification title="Pago registrado" onClose={onClose} autoClose={1000} />);
		const toast = screen.getByRole("status");
		act(() => vi.advanceTimersByTime(600));
		fireEvent.mouseEnter(toast);
		act(() => vi.advanceTimersByTime(5000));
		expect(onClose).not.toHaveBeenCalled();
		fireEvent.mouseLeave(toast);
		fireEvent.focus(screen.getByRole("button", { name: "Descartar" }));
		act(() => vi.advanceTimersByTime(5000));
		expect(onClose).not.toHaveBeenCalled();
		fireEvent.blur(screen.getByRole("button", { name: "Descartar" }));
		act(() => vi.advanceTimersByTime(350));
		expect(onClose).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(100));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("no se cierra sola con acciones ni con autoClose={false}; 320px de ancho", () => {
		vi.useFakeTimers();
		const onClose = vi.fn();
		const { rerender } = render(
			<Notification
				title="Pago registrado"
				onClose={onClose}
				actions={<Button hierarchy="link-gray">Deshacer</Button>}
			/>,
		);
		act(() => vi.advanceTimersByTime(20000));
		rerender(<Notification title="Pago registrado" onClose={onClose} autoClose={false} />);
		act(() => vi.advanceTimersByTime(20000));
		expect(onClose).not.toHaveBeenCalled();
		const toast = screen.getByRole("status");
		expect(toast.className).toContain("max-w-[var(--width-xxs)]");
		expect(toast.className).toContain(
			"shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
		);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Notification
				color="success"
				title="Pago registrado"
				description="Has añadido 42,50 € a Suscripciones."
				onClose={() => {}}
				actions={<Button hierarchy="link-color">Ver gasto</Button>}
			/>,
		);
	});
});

describe("Banner", () => {
	it("región con nombre, icono, acciones y X 'Cerrar aviso'", async () => {
		const onClose = vi.fn();
		render(
			<Banner
				icon="zap"
				title="Nueva versión de Pecunia."
				description="Ahora con presupuestos compartidos."
				actions={<Button size="sm">Ver novedades</Button>}
				onClose={onClose}
			/>,
		);
		const region = screen.getByRole("region", { name: "Nueva versión de Pecunia." });
		expect(region.className).toContain("bg-secondary");
		expect(region.className).toContain("rounded-xl");
		await userEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("cuenta atrás congelada con now: días, horas, minutos y segundos", () => {
		render(
			<Banner
				theme="brand"
				title="Fin de la beta."
				countdown={new Date(2026, 10, 1, 12, 0, 0)}
				now={new Date(2026, 9, 29, 9, 30, 15)}
			/>,
		);
		const timer = screen.getByRole("timer");
		expect(timer.getAttribute("aria-label")).toBe("3 días, 2 horas, 29 min, 45 seg");
		expect(timer.textContent).toBe("03días02horas29min45seg");
		expect(screen.getByRole("region").className).toContain("bg-brand-section_subtle");
	});

	it("la cuenta atrás avanza sola sin now", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 9, 31, 23, 59, 50));
		render(<Banner title="Cierre" countdown={new Date(2026, 10, 1, 0, 0, 0)} />);
		expect(screen.getByRole("timer").getAttribute("aria-label")).toBe("0 días, 0 horas, 0 min, 10 seg");
		act(() => vi.advanceTimersByTime(3000));
		expect(screen.getByRole("timer").getAttribute("aria-label")).toBe("0 días, 0 horas, 0 min, 7 seg");
	});

	it("correo: campo obligatorio de tipo email y envío con el valor", async () => {
		const onSubmit = vi.fn();
		render(
			<Banner
				title="Resumen semanal por correo."
				email={{ buttonLabel: "Suscribirme", hint: "Puedes darte de baja cuando quieras.", onSubmit }}
			/>,
		);
		const box = screen.getByRole("textbox", { name: "Tu correo" }) as HTMLInputElement;
		expect(box.type).toBe("email");
		expect(box.required).toBe(true);
		await userEvent.type(box, "ana@jotis.me");
		await userEvent.click(screen.getByRole("button", { name: "Suscribirme" }));
		expect(onSubmit).toHaveBeenCalledWith("ana@jotis.me");
		expect(screen.getByText("Puedes darte de baja cuando quieras.")).toBeTruthy();
	});

	it("slim: sin icono y con la X centrada; full sin radio", () => {
		render(
			<Banner
				slim
				layout="full"
				theme="brand"
				icon="zap"
				title="Datos de ejemplo."
				onClose={() => {}}
			/>,
		);
		const region = screen.getByRole("region");
		expect(region.querySelector('[aria-hidden="true"] svg')).toBeNull();
		expect(region.className).not.toContain("rounded-xl");
		expect(screen.getByRole("button", { name: "Cerrar aviso" }).className).toContain("-translate-y-1/2");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Banner
					icon="mail-01"
					title="Resumen semanal."
					email={{ hint: "Un correo los lunes." }}
					onClose={() => {}}
				/>
				<Banner
					theme="brand"
					icon="clock"
					title="Fin de la beta."
					countdown={new Date(2026, 10, 1)}
					now={new Date(2026, 9, 29)}
					actions={
						<Button hierarchy="secondary" size="sm">
							Exportar
						</Button>
					}
				/>
			</div>,
		);
	});
});
