import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { type BadgeColor, type CalendarEvent, CalendarView } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { full: string; bare: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/calendar-view-before.json"), "utf8"),
);

// Viernes 8 de enero de 2027, 14:20: la semana va del lunes 4 al domingo 10
const TODAY = new Date(2027, 0, 8, 14, 20);
const at = (day: number, h: number, m = 0) => new Date(2027, 0, day, h, m);

const events: CalendarEvent[] = [
	{ date: at(8, 10), title: "Olivia x Riley", color: "indigo", duration: 90 },
	{ date: at(4, 9), title: "Monday standup", duration: 30 },
	{ date: at(6, 9), title: "Deep work", color: "blue", duration: 120 },
	{ date: at(6, 9, 30), title: "Reunión larga", color: "pink", duration: 60 },
];

const column = (name: RegExp) => screen.getByRole("list", { name });
// El bloque posicionado es el <li>; su nombre está en él o, con onSelectEvent, en el botón que lleva dentro
const block = (scope: ReturnType<typeof within>, name: string | RegExp) =>
	scope.getByLabelText(name).closest("li") as HTMLElement;
const px = (el: HTMLElement, prop: "top" | "height" | "left" | "width") => el.style[prop];

describe("CalendarView: la de siempre", () => {
	it("sin las props nuevas el HTML de la vista de mes es el de antes", () => {
		const full = renderToStaticMarkup(
			<CalendarView
				today={new Date(2026, 9, 29)}
				subtitle="Pagos"
				onSelectDate={() => {}}
				events={[
					{ date: new Date(2026, 9, 1), title: "Alquiler", time: "650 €", color: "brand" },
					{ date: new Date(2026, 9, 15), title: "Uno" },
					{ date: new Date(2026, 9, 15), title: "Dos" },
					{ date: new Date(2026, 9, 15), title: "Tres" },
					{ date: new Date(2026, 9, 15), title: "Cuatro" },
				]}
			/>,
		);
		expect(full).toBe(BEFORE.full);
		expect(
			renderToStaticMarkup(
				<CalendarView today={new Date(2026, 9, 29)} month={new Date(2026, 10, 3)} />,
			),
		).toBe(BEFORE.bare);
	});

	it("sin selector de vista no hay desplegable", () => {
		render(<CalendarView today={TODAY} />);
		expect(screen.queryByRole("button", { name: /Vista/ })).toBeNull();
	});
});

describe("CalendarView: vista de semana", () => {
	it("un evento de 10:00 a 11:30 ocupa hora y media en la columna de su día", () => {
		render(<CalendarView today={TODAY} view="week" events={events} />);
		const friday = column(/8 de enero/);
		const evt = block(within(friday), "Olivia x Riley, 10:00–11:30");
		// 96 px por hora: arranca a las 10:00 (960) y mide 144 menos 4 de separación
		expect(px(evt, "top")).toBe("962px");
		expect(px(evt, "height")).toBe("140px");
		// Y no está en ninguna otra columna
		expect(within(column(/4 de enero/)).queryByLabelText(/Olivia/)).toBeNull();
	});

	it("la línea de la hora actual cruza el día de hoy a las 14:20", () => {
		render(<CalendarView today={TODAY} view="week" events={events} />);
		const line = screen.getByRole("separator", { name: "Hora actual: 14:20" });
		// 14 h 20 min = 860 min → 1.376 px
		expect(px(line, "top")).toBe("1376px");
		expect(line.textContent).toContain("14:20");
	});

	it("la línea desaparece en una semana que no contiene hoy", async () => {
		render(<CalendarView today={TODAY} view="week" events={events} />);
		await userEvent.click(screen.getByRole("button", { name: "Semana siguiente" }));
		expect(screen.queryByRole("separator")).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: "Hoy" }));
		expect(screen.getByRole("separator")).toBeTruthy();
	});

	it("las cabeceras marcan hoy y los eventos que se pisan se reparten el ancho", () => {
		render(<CalendarView today={TODAY} view="week" events={events} />);
		expect(screen.getByRole("button", { name: /viernes, 8 de enero, hoy/ })).toBeTruthy();
		const wed = column(/6 de enero/);
		const deep = block(within(wed), "Deep work, 09:00–11:00");
		const long = block(within(wed), "Reunión larga, 09:30–10:30");
		expect(px(deep, "width")).toBe("calc(50% - 4px)");
		expect(px(deep, "left")).toBe("calc(0% + 2px)");
		expect(px(long, "left")).toBe("calc(50% + 2px)");
		// Uno sin pisar ocupa todo el ancho
		expect(px(block(within(column(/4 de enero/)), /Monday standup/), "width")).toBe("calc(100% - 4px)");
	});

	it("el título y el rango de la semana siguen a la navegación", async () => {
		render(<CalendarView today={TODAY} view="week" events={events} />);
		expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Enero 2027");
		expect(screen.getByText("4 ene 2027 – 10 ene 2027")).toBeTruthy();
		expect(screen.getByText("Semana 1")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Semana anterior" }));
		expect(screen.getByText("28 dic 2026 – 3 ene 2027")).toBeTruthy();
		expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Enero 2027");
	});

	it("un evento de cada color de Badge toma sus clases", () => {
		const colors: BadgeColor[] = [
			"gray",
			"blue",
			"indigo",
			"pink",
			"orange",
			"success",
			"purple",
			"warning",
			"brand",
		];
		render(
			<CalendarView
				today={TODAY}
				view="day"
				events={colors.map((color, i) => ({
					date: at(8, 8 + i),
					title: `Evento ${color}`,
					color,
					duration: 30,
				}))}
			/>,
		);
		expect(screen.getByLabelText(/Evento pink/).className).toContain("bg-utility-pink-50");
		expect(screen.getByLabelText(/Evento success/).className).toContain("bg-utility-green-50");
		expect(screen.getByLabelText(/Evento orange/).className).toContain("bg-utility-orange-50");
		expect(colors.length).toBe(9);
	});

	it("con onSelectEvent los eventos son botones y avisan del evento", async () => {
		const onSelectEvent = vi.fn();
		render(<CalendarView today={TODAY} view="week" events={events} onSelectEvent={onSelectEvent} />);
		await userEvent.click(screen.getByRole("button", { name: "Monday standup, 09:00–09:30" }));
		expect(onSelectEvent).toHaveBeenCalledWith(events[1]);
	});
});

describe("CalendarView: vista de día y selector", () => {
	it("el día enseña solo su columna, con el panel a la derecha si se pasa", () => {
		render(<CalendarView today={TODAY} view="day" events={events} aside={<p>Detalle del evento</p>} />);
		expect(screen.getAllByRole("list")).toHaveLength(1);
		expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("8 de enero de 2027");
		expect(screen.getByText("Viernes")).toBeTruthy();
		expect(screen.getByText("Detalle del evento")).toBeTruthy();
		expect(screen.getByRole("separator", { name: "Hora actual: 14:20" })).toBeTruthy();
	});

	it("el selector de vista cambia entre mes, semana y día y avisa", async () => {
		const onViewChange = vi.fn();
		render(<CalendarView today={TODAY} defaultView="week" onViewChange={onViewChange} events={events} />);
		await userEvent.click(screen.getByRole("button", { name: /Vista semanal/ }));
		await userEvent.click(await screen.findByRole("menuitemradio", { name: "Vista diaria" }));
		expect(onViewChange).toHaveBeenCalledWith("day");
		expect(screen.getAllByRole("list")).toHaveLength(1);
		await userEvent.click(screen.getByRole("button", { name: /Vista diaria/ }));
		await userEvent.click(await screen.findByRole("menuitemradio", { name: "Vista mensual" }));
		expect(screen.getByRole("table")).toBeTruthy();
	});

	it("la navegación del día avanza de uno en uno", async () => {
		render(<CalendarView today={TODAY} view="day" />);
		await userEvent.click(screen.getByRole("button", { name: "Día siguiente" }));
		expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("9 de enero de 2027");
		expect(screen.queryByRole("separator")).toBeNull();
	});

	it("es accesible en claro y oscuro, en semana y en día", async () => {
		await expectAccessibleInThemes(<CalendarView today={TODAY} view="week" events={events} />);
		await expectAccessibleInThemes(<CalendarView today={TODAY} view="day" events={events} />);
	});
});

describe("CalendarView: tramo de horas", () => {
	it("con hours solo se pintan esas horas y los eventos se colocan desde la primera", () => {
		render(<CalendarView today={TODAY} view="week" hours={[8, 18]} events={events} />);
		// Las 09:00 quedan a una hora del arranque: 96 + 2
		const evt = block(within(column(/4 de enero/)), "Monday standup, 09:00–09:30");
		expect(px(evt, "top")).toBe("98px");
		// La línea de las 14:20 queda a 6 h 20 min del arranque: 608 px
		expect(px(screen.getByRole("separator"), "top")).toBe("608px");
		expect(screen.queryByText("07:00")).toBeNull();
		expect(screen.getByText("17:00")).toBeTruthy();
	});

	it("la línea no sale si la hora actual cae fuera del tramo", () => {
		render(<CalendarView today={TODAY} view="week" hours={[8, 12]} />);
		expect(screen.queryByRole("separator")).toBeNull();
	});
});
