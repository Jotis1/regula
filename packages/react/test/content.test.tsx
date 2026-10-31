import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { highlight } from "../src/components/CodeSnippet.js";
import { CalendarView, CodeSnippet, Message } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Message", () => {
	it("recibido: avatar, autor, hora y burbuja gris con la esquina superior izquierda recta", () => {
		render(
			<Message author="Emptor" avatar={{ initials: "Em" }} time="Jueves 18:02">
				He encontrado tres aspiradoras.
			</Message>,
		);
		expect(screen.getByText("Em")).toBeTruthy();
		expect(screen.getByText("Emptor").className).toContain("text-secondary");
		const bubble = screen.getByText("He encontrado tres aspiradoras.");
		for (const c of ["bg-secondary", "rounded-tl-none", "text-md"]) expect(bubble.className).toContain(c);
	});

	it("enviado: a la derecha, sin avatar, 'Tú' por defecto y burbuja con la esquina superior derecha recta", () => {
		const { container } = render(
			<Message sent time="Jueves 18:03">
				Sí.
			</Message>,
		);
		expect((container.firstElementChild as HTMLElement).className).toContain("ml-auto");
		expect(screen.getByText("Tú")).toBeTruthy();
		expect(screen.getByText("Sí.").className).toContain("rounded-tr-none");
		expect(container.querySelector('[class*="rounded-full"] img, [aria-label="Em"]')).toBeNull();
	});

	it("escribiendo: tres puntos animados (solo con movimiento) y texto para lectores de pantalla", () => {
		const { container } = render(<Message author="Emptor" typing />);
		expect(screen.getByText("Escribiendo").className).toContain("sr-only");
		const dots = container.querySelectorAll("i[aria-hidden]");
		expect(dots).toHaveLength(3);
		expect(dots[0]?.className).toContain("motion-safe:animate-[pulse_1s_infinite]");
		expect(dots[2]?.className).toContain("[animation-delay:.4s]");
	});

	it("axe en claro y oscuro y render en servidor", async () => {
		const ui = (
			<div>
				<Message author="Emptor" avatar={{ initials: "Em" }} time="Jueves 18:02" online>
					Hola.
				</Message>
				<Message sent time="18:03">
					Adiós.
				</Message>
				<Message author="Emptor" typing />
			</div>
		);
		expect(renderToString(ui)).toContain("Escribiendo");
		await expectAccessibleInThemes(ui);
	});
});

const events = [
	{ date: new Date(2026, 9, 1), title: "Alquiler", time: "650 €", color: "brand" as const },
	{ date: new Date(2026, 9, 15), title: "Seguro coche", color: "indigo" as const },
	{ date: new Date(2026, 9, 15), title: "Gimnasio", color: "success" as const },
	{ date: new Date(2026, 9, 15), title: "Netflix", color: "purple" as const },
	{ date: new Date(2026, 9, 15), title: "Spotify", color: "success" as const },
];

describe("CalendarView", () => {
	it("octubre de 2026 en es-ES: semana desde el lunes, hoy marcado, cabecera con OCT 29", () => {
		render(<CalendarView today={new Date(2026, 9, 29)} subtitle="Pagos" events={events} />);
		expect(screen.getByRole("heading", { name: "Octubre 2026" })).toBeTruthy();
		expect(screen.getByText("OCT")).toBeTruthy();
		const table = screen.getByRole("table");
		expect(
			within(table)
				.getAllByRole("columnheader")
				.map((h) => h.textContent),
		).toEqual(["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]);
		// 1 de octubre de 2026 es jueves: la primera fila empieza el lunes 28 de septiembre
		const firstRow = within(table).getAllByRole("row")[1] as HTMLElement;
		expect(within(firstRow).getAllByRole("cell")[0]?.className).toContain("bg-secondary");
		expect(screen.getByText("jueves, 29 de octubre, hoy")).toBeTruthy();
		expect(within(table).getAllByRole("row")).toHaveLength(6);
	});

	it("chips con los colores de Badge, como mucho 3 por día y 'N más…'", () => {
		render(<CalendarView today={new Date(2026, 9, 29)} events={events} />);
		const alquiler = screen.getByTitle("Alquiler");
		expect(alquiler.className).toContain("bg-utility-brand-50");
		expect(alquiler.textContent).toBe("Alquiler650 €");
		expect(screen.getByTitle("Seguro coche").className).toContain("bg-utility-indigo-50");
		expect(screen.queryByTitle("Spotify")).toBeNull();
		expect(screen.getByText("1 más…")).toBeTruthy();
	});

	it("navegación: mes anterior, siguiente y hoy", async () => {
		render(<CalendarView today={new Date(2026, 9, 29)} />);
		await userEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
		expect(screen.getByRole("heading", { name: "Noviembre 2026" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
		await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
		expect(screen.getByRole("heading", { name: "Septiembre 2026" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Hoy" }));
		expect(screen.getByRole("heading", { name: "Octubre 2026" })).toBeTruthy();
	});

	it("onSelectDate: clic en la celda o Enter en el número", async () => {
		const onSelectDate = vi.fn();
		render(<CalendarView today={new Date(2026, 9, 29)} onSelectDate={onSelectDate} />);
		const day = screen.getByRole("button", { name: "jueves, 15 de octubre" });
		await userEvent.click(day.closest("td") as HTMLElement);
		expect(onSelectDate).toHaveBeenLastCalledWith(new Date(2026, 9, 15));
		day.focus();
		await userEvent.keyboard("{Enter}");
		expect(onSelectDate).toHaveBeenCalledTimes(2);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<CalendarView today={new Date(2026, 9, 29)} events={events} />);
	});
});

const js =
	"// Cargar el sistema\nimport { Button } from 'jotis'\n\nexport const guardar = new Button({\n  hierarchy: 'primary',\n})\n";

describe("CodeSnippet", () => {
	it("resaltado con los colores de la guía", () => {
		const { container } = render(<code>{highlight(js)}</code>);
		const color = (text: string) =>
			[...container.querySelectorAll("span")].find((s) => s.textContent === text)?.className;
		expect(color("// Cargar el sistema")).toBe("text-utility-green-700");
		expect(color("import")).toBe("text-utility-pink-600");
		expect(color("Button")).toBe("text-utility-blue-600");
		expect(color("hierarchy")).toBe("text-utility-blue-600");
		expect(color("'jotis'")).toBe("text-primary");
		expect(container.textContent).toBe(js);
	});

	it("números de línea (sin el salto final), pestañas con flechas y copiar", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
		render(
			<CodeSnippet
				tabs={[
					{ label: "js", code: js },
					{ label: "bash", code: "npm install jotis" },
				]}
			/>,
		);
		const tabs = screen.getAllByRole("tab");
		expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false"]);
		const panel = screen.getByRole("tabpanel");
		expect(panel.querySelector('[aria-hidden="true"]')?.textContent).toBe("123456");
		tabs[0]?.focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(tabs[1]);
		expect(screen.getByRole("tabpanel").textContent).toContain("npm install jotis");
		await userEvent.click(screen.getByRole("button", { name: "Copiar código" }));
		expect(writeText).toHaveBeenCalledWith("npm install jotis");
		expect(await screen.findByRole("button", { name: "Copiado" })).toBeTruthy();
	});

	it("una sola pieza sin pestañas y sin números con lineNumbers={false}; el bloque es enfocable", async () => {
		render(<CodeSnippet code="npm install jotis" language="bash" lineNumbers={false} />);
		expect(screen.queryByRole("tablist")).toBeNull();
		await userEvent.tab();
		expect(document.activeElement?.tagName).toBe("PRE");
		expect(document.activeElement?.className).toContain("font-mono");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<CodeSnippet
				tabs={[
					{ label: "js", code: js },
					{ label: "bash", code: "npm install jotis" },
				]}
			/>,
		);
	});
});
