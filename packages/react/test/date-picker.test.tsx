import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DatePicker, type DatePickerPreset } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const TODAY = new Date(2026, 9, 29);
const PRESETS: DatePickerPreset[] = [
	{ label: "Hoy", start: TODAY },
	{ label: "Este mes", start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) },
	{ label: "Mes pasado", start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) },
];

/** Celda del día `n` del mes visible. */
const cell = (n: number) =>
	within(screen.getByRole("grid")).getByText(String(n), {
		selector: "[role=button]:not([data-outside-month])",
	}) as HTMLElement;
const footer = () =>
	screen.getByRole("button", { name: "Aplicar" }).closest(".justify-between") as HTMLElement;

describe("DatePicker", () => {
	it("el disparador muestra el texto por defecto, el placeholder o la fecha en es-ES", () => {
		const { rerender } = render(<DatePicker />);
		expect(screen.getByRole("button").textContent).toBe("Elegir fecha");
		rerender(<DatePicker key="r" range />);
		expect(screen.getByRole("button").textContent).toBe("Elegir fechas");
		rerender(<DatePicker key="p" placeholder="Fecha de cobro" />);
		expect(screen.getByRole("button").textContent).toBe("Fecha de cobro");
		rerender(<DatePicker key="v" defaultValue={{ start: TODAY }} />);
		expect(screen.getByRole("button").textContent).toBe("29 oct 2026");
		rerender(
			<DatePicker
				key="rv"
				range
				defaultValue={{ start: new Date(2026, 9, 6), end: new Date(2026, 9, 17) }}
			/>,
		);
		expect(screen.getByRole("button").textContent).toBe("6 oct 2026 – 17 oct 2026");
	});

	it("mes en castellano, semana desde el lunes y punto en el día de hoy", () => {
		render(<DatePicker inline today={TODAY} />);
		expect(screen.getByText("Octubre 2026")).toBeTruthy();
		// La cabecera es aria-hidden: cada celda ya se anuncia con el día de la semana completo
		const heads = [...document.querySelectorAll("thead th")].map((th) => th.textContent);
		expect(heads).toEqual(["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]);
		// El 1 de octubre de 2026 es jueves: cuarta columna de la primera semana
		const firstWeek = screen.getAllByRole("row")[0] as HTMLElement;
		const days = within(firstWeek)
			.getAllByRole("gridcell")
			.map((td) => td.querySelector("[role=button]:not([data-outside-month])")?.textContent ?? "");
		expect(days).toEqual(["", "", "", "1", "2", "3", "4"]);
		expect(cell(29).className).toContain("bg-tertiary");
		expect(cell(29).className).toContain("after:bg-fg-brand-primary");
		expect(cell(28).className).not.toContain("bg-tertiary");
	});

	it("con teclado: abre, mueve con flechas, elige con Enter y aplica", async () => {
		const onApply = vi.fn();
		render(<DatePicker defaultValue={{ start: TODAY }} today={TODAY} onApply={onApply} />);
		const trigger = screen.getByRole("button", { name: /29 oct 2026/ });
		expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		await userEvent.tab();
		await userEvent.keyboard("{Enter}");
		expect(trigger.getAttribute("aria-expanded")).toBe("true");
		expect(screen.getByRole("dialog", { name: "Selector de fecha" })).toBeTruthy();
		// El foco empieza en el día elegido
		expect(document.activeElement).toBe(cell(29));
		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(cell(30));
		await userEvent.keyboard("{ArrowDown}");
		expect(screen.getByText("Noviembre 2026")).toBeTruthy();
		expect(document.activeElement).toBe(cell(6));
		await userEvent.keyboard("{ArrowUp}{Enter}");
		expect(within(footer()).getByText("30 oct 2026")).toBeTruthy();
		// Nada se aplica hasta pulsar Aplicar
		expect(onApply).not.toHaveBeenCalled();
		expect(trigger.textContent).toBe("29 oct 2026");
		await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
		expect(onApply).toHaveBeenCalledWith({ start: new Date(2026, 9, 30) });
		expect(trigger.textContent).toBe("30 oct 2026");
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("Escape cierra sin aplicar y devuelve el foco al disparador", async () => {
		const onApply = vi.fn();
		render(<DatePicker defaultValue={{ start: TODAY }} today={TODAY} onApply={onApply} />);
		const trigger = screen.getByRole("button");
		await userEvent.click(trigger);
		await userEvent.keyboard("{ArrowLeft}{Enter}{Escape}");
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(document.activeElement).toBe(trigger);
		expect(trigger.textContent).toBe("29 oct 2026");
		// Al volver a abrir, el borrador descartado no reaparece
		await userEvent.click(trigger);
		expect(within(footer()).getByText("29 oct 2026")).toBeTruthy();
		expect(onApply).not.toHaveBeenCalled();
	});

	it("Cancelar descarta el borrador y cierra", async () => {
		render(<DatePicker defaultOpen defaultValue={{ start: TODAY }} today={TODAY} />);
		await userEvent.click(cell(2));
		expect(within(footer()).getByText("2 oct 2026")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(screen.getByRole("button").textContent).toBe("29 oct 2026");
	});

	it("rango: dos clics marcan inicio, tramo y fin; Aplicar espera al segundo", async () => {
		const onApply = vi.fn();
		render(<DatePicker range inline today={TODAY} onApply={onApply} />);
		const apply = screen.getByRole("button", { name: "Aplicar" }) as HTMLButtonElement;
		expect(apply.disabled).toBe(true);
		await userEvent.click(cell(6));
		await userEvent.click(cell(17));
		expect(apply.disabled).toBe(false);
		// Extremos: círculo de marca dibujado con degradado sobre fondo transparente, no una celda entera de marca
		expect(cell(6).className.split(" ")).toContain("bg-transparent");
		expect(cell(6).className.split(" ")).not.toContain("bg-brand-solid");
		expect(cell(6).className).toContain("radial-gradient(circle,var(--bg-brand-solid)");
		expect(cell(6).className).toContain("linear-gradient(to_right");
		expect(cell(17).className).toContain("linear-gradient(to_left");
		expect(cell(10).className).toContain("bg-secondary_hover");
		expect(cell(18).className).not.toContain("bg-secondary_hover");
		const values = within(footer())
			.getAllByText(/oct 2026/)
			.map((e) => e.textContent);
		expect(values).toEqual(["6 oct 2026", "17 oct 2026"]);
		await userEvent.click(apply);
		expect(onApply).toHaveBeenCalledWith({ start: new Date(2026, 9, 6), end: new Date(2026, 9, 17) });
	});

	it("presets: cambian el borrador y el mes visible, y marcan el activo", async () => {
		render(<DatePicker range inline today={TODAY} presets={PRESETS} />);
		const last = screen.getByRole("button", { name: "Mes pasado" });
		await userEvent.click(last);
		expect(last.getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByText("Septiembre 2026")).toBeTruthy();
		const values = within(footer())
			.getAllByText(/sept? 2026/)
			.map((e) => e.textContent);
		expect(values).toEqual(["1 sept 2026", "30 sept 2026"]);
		// Sin `end`, el preset es un solo día y se puede aplicar
		await userEvent.click(screen.getByRole("button", { name: "Hoy" }));
		expect(screen.getByText("Octubre 2026")).toBeTruthy();
		expect(within(footer()).getAllByText("29 oct 2026")).toHaveLength(2);
		expect((screen.getByRole("button", { name: "Aplicar" }) as HTMLButtonElement).disabled).toBe(false);
		expect(last.getAttribute("aria-pressed")).toBe("false");
	});

	it("open controlado y textos sustituibles", () => {
		const { rerender } = render(<DatePicker open={false} labels={{ pickDate: "Elige día" }} />);
		expect(screen.getByRole("button").textContent).toBe("Elige día");
		expect(screen.queryByRole("dialog")).toBeNull();
		rerender(<DatePicker open labels={{ apply: "Guardar", previousMonth: "Atrás" }} />);
		expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Atrás" })).toBeTruthy();
	});

	it("se renderiza en servidor", () => {
		const html = renderToString(
			<DatePicker
				range
				inline
				today={TODAY}
				defaultValue={{ start: new Date(2026, 9, 6), end: new Date(2026, 9, 17) }}
			/>,
		);
		expect(html).toContain("Octubre 2026");
		expect(html).toContain("17 oct 2026");
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<DatePicker
				range
				inline
				today={TODAY}
				presets={PRESETS}
				defaultValue={{ start: new Date(2026, 9, 6), end: new Date(2026, 9, 17) }}
			/>,
		);
		await expectAccessibleInThemes(
			<DatePicker defaultOpen today={TODAY} defaultValue={{ start: TODAY }} />,
		);
	});
});
