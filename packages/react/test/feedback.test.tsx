import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FeaturedIcon, ProgressBar, Skeleton, Spinner } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("FeaturedIcon", () => {
	it("por defecto: light, brand, md, check-circle de 20 y decorativo", () => {
		const { container } = render(<FeaturedIcon />);
		const el = container.firstElementChild as HTMLElement;
		expect(el.getAttribute("aria-hidden")).toBe("true");
		expect(el.className).toContain("size-10");
		expect(el.className).toContain("rounded-full");
		expect(el.className).toContain("bg-brand-secondary");
		expect(el.className).toContain("text-featured-icon-light-fg-brand");
		expect(el.querySelector("svg")?.getAttribute("width")).toBe("20");
	});

	it.each([
		["sm", "size-8", "16"],
		["md", "size-10", "20"],
		["lg", "size-12", "24"],
		["xl", "size-14", "28"],
	] as const)("tamaño %s → %s con icono de %s", (size, cls, icon) => {
		const { container } = render(<FeaturedIcon size={size} />);
		expect(container.firstElementChild?.className).toContain(cls);
		expect(container.querySelector("svg")?.getAttribute("width")).toBe(icon);
	});

	it.each([
		["gray", "bg-tertiary"],
		["error", "bg-error-secondary"],
		["warning", "bg-warning-secondary"],
		["success", "bg-success-secondary"],
	] as const)("light %s usa %s", (color, bg) => {
		const { container } = render(<FeaturedIcon color={color} />);
		expect(container.firstElementChild?.className).toContain(bg);
		expect(container.firstElementChild?.className).toContain(`text-featured-icon-light-fg-${color}`);
	});

	it("modern es cuadrado blanco con sombra esqueumórfica y radio según tamaño", () => {
		const { container } = render(<FeaturedIcon variant="modern" size="xl" />);
		const cls = container.firstElementChild?.className ?? "";
		expect(cls).toContain("bg-primary");
		expect(cls).toContain("--shadow-xs-skeuomorphic");
		expect(cls).toContain("rounded-xl");
		expect(cls).not.toContain("rounded-full");
	});

	it("outline pinta los anillos en el color del estado", () => {
		const { container } = render(<FeaturedIcon variant="outline" color="error" />);
		const cls = container.firstElementChild?.className ?? "";
		expect(cls).toContain("text-fg-error-primary");
		expect(cls).toContain("before:opacity-30");
		expect(cls).toContain("after:opacity-10");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(<FeaturedIcon icon="zap" variant="outline" />);
	});
});

describe("Spinner", () => {
	it("es un status con el texto por defecto y arco de un cuarto", () => {
		const { container } = render(<Spinner />);
		const status = screen.getByRole("status");
		expect(status.textContent).toBe("Cargando…");
		const svg = container.querySelector("svg") as SVGElement;
		expect(svg.getAttribute("width")).toBe("48");
		const [track, arc] = [...svg.querySelectorAll("circle")];
		expect(track?.getAttribute("class")).toContain("--bg-tertiary");
		expect(arc?.getAttribute("class")).toContain("stroke-fg-brand-primary");
		const r = (48 - 6) / 2;
		const c = 2 * Math.PI * r;
		expect(arc?.getAttribute("stroke-dasharray")).toBe(`${c * 0.25} ${c}`);
	});

	it("sm lleva trazo de 4 y el resto de 6", () => {
		const { container } = render(
			<>
				<Spinner size="sm" />
				<Spinner size="xl" />
			</>,
		);
		const [sm, xl] = [...container.querySelectorAll("svg")];
		expect(sm?.getAttribute("width")).toBe("32");
		expect(sm?.querySelector("circle")?.getAttribute("stroke-width")).toBe("4");
		expect(xl?.getAttribute("width")).toBe("64");
		expect(xl?.querySelector("circle")?.getAttribute("stroke-width")).toBe("6");
	});

	it("label propio, y label={false} lo deja solo para lectores de pantalla", () => {
		render(
			<>
				<Spinner label="Importando extracto…" />
				<Spinner label={false} />
			</>,
		);
		const [a, b] = screen.getAllByRole("status");
		expect(a?.textContent).toBe("Importando extracto…");
		expect(b?.querySelector(".sr-only")?.textContent).toBe("Cargando…");
	});

	it("con menos movimiento gira tres veces más despacio en lugar de pararse", () => {
		const { container } = render(<Spinner />);
		const cls = container.querySelector("svg")?.getAttribute("class") ?? "";
		expect(cls).toContain("animate-spin");
		expect(cls).toContain("motion-reduce:animate-[spin_3s_linear_infinite]");
	});

	it("se renderiza en servidor y sin infracciones de axe", async () => {
		expect(renderToStaticMarkup(<Spinner />)).toContain('role="status"');
		await expectAccessibleInThemes(<Spinner size="lg" label="Importando extracto…" />);
	});
});

describe("Skeleton", () => {
	it("bloque oculto, 100 % × 16 por defecto, con pulso solo si se permite movimiento", () => {
		const { container } = render(<Skeleton />);
		const el = container.firstElementChild as HTMLElement;
		expect(el.getAttribute("aria-hidden")).toBe("true");
		expect(el.style.width).toBe("100%");
		expect(el.style.height).toBe("16px");
		expect(el.className).toContain("bg-tertiary");
		expect(el.className).toContain("motion-safe:animate-[pulse_1.4s_ease-in-out_infinite]");
		expect(el.className).toContain("motion-reduce:animate-none");
	});

	it("width, height, radius y circle", () => {
		const { container } = render(
			<>
				<Skeleton width="40%" height={14} radius={4} />
				<Skeleton circle width={40} height={40} />
			</>,
		);
		const [a, b] = [...container.children] as HTMLElement[];
		expect(a?.style.width).toBe("40%");
		expect(a?.style.height).toBe("14px");
		expect(a?.style.borderRadius).toBe("4px");
		expect(b?.className).toContain("rounded-full");
	});

	it("lines: n líneas de 12px y la última al 60 %", () => {
		const { container } = render(<Skeleton lines={3} />);
		const lines = [...(container.firstElementChild as HTMLElement).children] as HTMLElement[];
		expect(lines).toHaveLength(3);
		expect(lines.map((l) => l.style.width)).toEqual(["100%", "100%", "60%"]);
		expect(lines.every((l) => l.style.height === "12px")).toBe(true);
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(<Skeleton lines={2} />);
	});
});

describe("ProgressBar", () => {
	it("progressbar con valor, nombre y porcentaje a la derecha", () => {
		render(<ProgressBar value={62} aria-label="Presupuesto usado" />);
		const bar = screen.getByRole("progressbar", { name: "Presupuesto usado" });
		expect(bar.getAttribute("aria-valuenow")).toBe("62");
		expect(bar.getAttribute("aria-valuemin")).toBe("0");
		expect(bar.getAttribute("aria-valuemax")).toBe("100");
		expect((bar.firstElementChild as HTMLElement).style.width).toBe("62%");
		expect(bar.parentElement?.textContent).toBe("62%");
		expect(bar.parentElement?.className).not.toContain("flex-col");
	});

	it("label bottom pone el porcentaje debajo; false lo quita", () => {
		render(
			<>
				<ProgressBar value={30} label="bottom" aria-label="Subida" />
				<ProgressBar value={30} label={false} aria-label="Sin texto" />
			</>,
		);
		expect(screen.getByRole("progressbar", { name: "Subida" }).parentElement?.className).toContain(
			"flex-col",
		);
		expect(screen.getByRole("progressbar", { name: "Sin texto" }).parentElement?.textContent).toBe("");
	});

	it("limita el valor a 0–100 y deja ver un mínimo del 3 %", () => {
		render(
			<>
				<ProgressBar value={140} aria-label="Alto" />
				<ProgressBar value={-5} aria-label="Bajo" />
			</>,
		);
		expect(screen.getByRole("progressbar", { name: "Alto" }).getAttribute("aria-valuenow")).toBe("100");
		const low = screen.getByRole("progressbar", { name: "Bajo" });
		expect(low.getAttribute("aria-valuenow")).toBe("0");
		expect((low.firstElementChild as HTMLElement).style.width).toBe("3%");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(<ProgressBar value={62} aria-label="Presupuesto usado" />);
	});
});

describe("Spinner con estilos", () => {
	// HTML de `<Spinner />` antes de añadir `variant`: el estilo por defecto no cambia
	const BEFORE =
		'<div role="status" aria-live="polite" class="inline-flex flex-col items-center gap-4 font-body"><svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" class="animate-spin motion-reduce:animate-[spin_3s_linear_infinite]"><circle cx="24" cy="24" r="21" fill="none" stroke-width="6" class="stroke-(color:--bg-tertiary)"></circle><circle cx="24" cy="24" r="21" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="32.98672286269283 131.94689145077132" class="stroke-fg-brand-primary"></circle></svg><span class="text-sm font-medium text-secondary">Cargando…</span></div>';

	it("sin variant, el HTML es el de antes, igual que line-simple", () => {
		expect(renderToStaticMarkup(<Spinner />)).toBe(BEFORE);
		expect(renderToStaticMarkup(<Spinner variant="line-simple" />)).toBe(BEFORE);
	});

	it("line-spinner pinta solo el arco, más largo, sin pista", () => {
		const { container } = render(<Spinner variant="line-spinner" />);
		const circles = container.querySelectorAll("circle");
		expect(circles).toHaveLength(1);
		const c = 2 * Math.PI * 21;
		expect(circles[0]?.getAttribute("stroke-dasharray")).toBe(`${c * 0.6} ${c}`);
		expect(circles[0]?.getAttribute("class")).toContain("stroke-fg-brand-primary");
	});

	it("dot-circle pinta dieciséis puntos de opacidad decreciente en el color de marca", () => {
		const { container } = render(<Spinner variant="dot-circle" size="sm" />);
		const dots = [...container.querySelectorAll("circle")];
		expect(dots).toHaveLength(16);
		const opacities = dots.map((d) => Number(d.getAttribute("opacity")));
		expect(opacities[0]).toBe(1);
		for (let i = 1; i < opacities.length; i++)
			expect(opacities[i]).toBeLessThan(opacities[i - 1] as number);
		// En sm el trazo es de 4: cada punto, de radio 2
		expect(dots[0]?.getAttribute("r")).toBe("2");
		expect(dots[0]?.getAttribute("class")).toContain("fill-fg-brand-primary");
	});

	it("todos giran, más despacio con movimiento reducido, y anuncian Cargando…", () => {
		for (const variant of ["line-simple", "line-spinner", "dot-circle"] as const) {
			const { container, unmount } = render(<Spinner variant={variant} />);
			const svg = container.querySelector("svg") as SVGElement;
			expect(svg.getAttribute("class")).toContain("animate-spin");
			expect(svg.getAttribute("class")).toContain("motion-reduce:animate-[spin_3s_linear_infinite]");
			expect(svg.getAttribute("aria-hidden")).toBe("true");
			expect(screen.getByRole("status").textContent).toBe("Cargando…");
			unmount();
		}
	});
});
