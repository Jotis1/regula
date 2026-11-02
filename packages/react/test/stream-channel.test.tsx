// Stream (13.6): ChannelPanel y ChannelBanner.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ChannelBanner, ChannelPanel } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src/components", file), "utf8"));
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);

const schedule = [
	{ day: "Lunes", time: "20:00" },
	{ day: "Miércoles", time: "20:00" },
	{ day: "Viernes", time: "22:00" },
];
const rows = schedule.map((r) => ({ label: r.day, value: r.time }));

describe("frontera servidor/cliente", () => {
	it("los dos son de servidor; el banner usa el lienzo de cliente", () => {
		expect(isClient("ChannelPanel.tsx")).toBe(false);
		expect(isClient("ChannelBanner.tsx")).toBe(false);
		const html = renderToString(
			<>
				<ChannelPanel title="Horario" rows={rows} />
				<ChannelBanner name="jotis" schedule={schedule} scale={0.5} />
			</>,
		);
		expect(html).toContain("Miércoles");
		expect(html).toContain("jotis");
	});
});

describe("ChannelPanel", () => {
	it("320px por defecto, en oscuro, con nombre por su título en Bricolage 24/32", () => {
		render(
			<ChannelPanel title="Sobre el canal" icon="user-01">
				<p>Directos tranquilos.</p>
				<p>Si es tu primera vez, siéntate.</p>
			</ChannelPanel>,
		);
		const panel = screen.getByRole("region", { name: "Sobre el canal" });
		expect(classes(panel)).toEqual(expect.arrayContaining(["dark-mode", "w-[320px]"]));
		const title = within(panel).getByRole("heading", { level: 3 });
		expect(classes(title)).toEqual(
			expect.arrayContaining(["font-display", "text-display-xs", "font-semibold"]),
		);
		expect(panel.querySelectorAll("p")).toHaveLength(2);
		expect(panel.querySelector("svg")).not.toBeNull();
	});

	it("las filas son una lista de definiciones con la cifra tabular a la derecha", () => {
		const { container } = render(<ChannelPanel title="Horario" rows={rows} width={360} />);
		const dl = container.querySelector("dl");
		expect(dl?.querySelectorAll("dt")).toHaveLength(3);
		const dd = dl?.querySelector("dd");
		expect(dd?.textContent).toBe("20:00");
		expect(classes(dd)).toEqual(expect.arrayContaining(["tabular-nums", "text-right"]));
		expect((container.firstElementChild as HTMLElement).style.width).toBe("360px");
	});

	it("una sola acción: botón secundario a todo el ancho, enlace con `href` o botón con `onClick`", async () => {
		const { rerender } = render(
			<ChannelPanel
				title="Sobre el canal"
				action={{ label: "Ver todos los enlaces", href: "/enlaces", icon: "arrow-right" }}
			/>,
		);
		const link = screen.getByRole("link", { name: "Ver todos los enlaces" });
		expect(link.getAttribute("href")).toBe("/enlaces");
		expect(classes(link)).toContain("w-full");
		const onClick = vi.fn();
		rerender(<ChannelPanel title="Sobre el canal" action={{ label: "Seguir", onClick }} />);
		await userEvent.click(screen.getByRole("button", { name: "Seguir" }));
		expect(onClick).toHaveBeenCalledOnce();
		expect(screen.getAllByRole("button")).toHaveLength(1);
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ChannelPanel title="Horario" icon="calendar" rows={rows} action={{ label: "Más", href: "#" }}>
				<p>Directos tranquilos.</p>
			</ChannelPanel>,
		);
	});
});

describe("ChannelBanner", () => {
	it("con scale={1} mide 1200×480 tal cual, para exportarlo", () => {
		const { container } = render(<ChannelBanner scale={1} />);
		const outer = container.firstElementChild as HTMLElement;
		expect(outer.style.width).toBe("1200px");
		expect(outer.style.height).toBe("480px");
		expect(classes(outer)).toContain("dark-mode");
		const stage = outer.firstElementChild as HTMLElement;
		expect(stage.style.width).toBe("1200px");
		expect(stage.style.height).toBe("480px");
	});

	it("textos por defecto y sustituibles; el nombre es un h2", () => {
		const { rerender } = render(<ChannelBanner scale={0.5} />);
		expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Tu canal");
		expect(screen.getByText("Directos en Twitch")).toBeTruthy();
		rerender(<ChannelBanner scale={0.5} name="jotis" eyebrow="En directo" tagline="Sin guion." />);
		expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("jotis");
		expect(screen.getByText("En directo")).toBeTruthy();
		expect(screen.getByText("Sin guion.")).toBeTruthy();
	});

	it("deja 120px de zona segura a cada lado: texto a la izquierda y horario a la derecha", () => {
		render(<ChannelBanner scale={0.5} schedule={schedule} />);
		const heading = screen.getByRole("heading", { level: 2 });
		expect(classes(heading.parentElement)).toEqual(expect.arrayContaining(["left-[120px]", "w-[560px]"]));
		const list = screen.getByRole("list", { name: "Horario de directos" });
		expect(classes(list)).toEqual(expect.arrayContaining(["right-[120px]", "w-[300px]"]));
		// 120 + 560 = 680 y 1200 − 120 − 300 = 780: ni se tocan ni se salen de la zona segura.
		expect(
			within(list)
				.getAllByRole("listitem")
				.map((li) => li.textContent),
		).toEqual(["Lunes20:00", "Miércoles20:00", "Viernes22:00"]);
	});

	it("sin horario no hay lista; `scheduleLabel` cambia su nombre", () => {
		const { rerender } = render(<ChannelBanner scale={0.5} />);
		expect(screen.queryByRole("list")).toBeNull();
		rerender(<ChannelBanner scale={0.5} schedule={schedule} scheduleLabel="Schedule" />);
		expect(screen.getByRole("list", { name: "Schedule" })).toBeTruthy();
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ChannelBanner scale={0.5} tagline="Sin guion." schedule={schedule} />,
		);
	});
});
