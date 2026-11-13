import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spotlight } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const ring = (c: HTMLElement) => c.querySelector("[data-spotlight-ring]");
const wrapper = () => screen.getByRole("button", { name: "Guardar" }).parentElement as HTMLElement;
const content = <button type="button">Guardar</button>;

describe("Spotlight", () => {
	it("sin active solo pinta el contenido: ni anillo ni nota ni descripción", () => {
		const { container } = render(
			<Spotlight note="Ahora en gris" notePlacement="top">
				{content}
			</Spotlight>,
		);
		expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
		expect(ring(container)).toBeNull();
		expect(screen.queryByText("Ahora en gris")).toBeNull();
		expect(container.querySelector("[aria-live]")).toBeNull();
		expect(wrapper().hasAttribute("aria-describedby")).toBe(false);
		expect(wrapper().children).toHaveLength(1);
	});

	it("con active, el contenido lleva un anillo de 2 px en border-brand a 8 px con radius-xl", () => {
		const { container } = render(<Spotlight active>{content}</Spotlight>);
		const el = ring(container) as HTMLElement;
		for (const c of ["border-2", "border-brand", "-inset-2", "rounded-xl"])
			expect(el.className).toContain(c);
		expect(el.getAttribute("aria-hidden")).toBe("true");
		// Sin nota no hay descripción
		expect(wrapper().hasAttribute("aria-describedby")).toBe(false);
	});

	it("la nota es una burbuja bg-primary_alt con shadow-lg, enlazada con aria-describedby y anunciada en aria-live", () => {
		render(
			<Spotlight active note="Ahora en gris">
				{content}
			</Spotlight>,
		);
		const note = screen.getByText("Ahora en gris");
		expect(note.className).toContain("bg-primary_alt");
		expect(note.className).toContain("shadow-[var(--shadow-lg)");
		expect(note.getAttribute("aria-live")).toBe("polite");
		expect(note.id).not.toBe("");
		expect(wrapper().getAttribute("aria-describedby")).toBe(note.id);
		expect(screen.getByRole("status").textContent).toBe("Ahora en gris");
	});

	it("la nota sale debajo por defecto y en los cuatro lados cuando se pide", () => {
		const place = (p?: "top" | "bottom" | "left" | "right") => {
			const { unmount } = render(
				<Spotlight active note="Nota" notePlacement={p}>
					{content}
				</Spotlight>,
			);
			const cls = screen.getByText("Nota").className;
			unmount();
			return cls;
		};
		expect(place()).toContain("top-[calc(100%+16px)]");
		expect(place("bottom")).toContain("top-[calc(100%+16px)]");
		expect(place("top")).toContain("bottom-[calc(100%+16px)]");
		expect(place("left")).toContain("right-[calc(100%+16px)]");
		expect(place("right")).toContain("left-[calc(100%+16px)]");
	});

	it("entra con un fundido de 150 ms que se quita con movimiento reducido", () => {
		const { container } = render(
			<Spotlight active note="Nota">
				{content}
			</Spotlight>,
		);
		for (const el of [ring(container) as HTMLElement, screen.getByText("Nota")]) {
			for (const c of ["duration-150", "starting:opacity-0", "motion-reduce:transition-none"])
				expect(el.className, el.className).toContain(c);
		}
	});

	it("pasar a active no vuelve a montar el contenido: conserva su estado", () => {
		const { rerender } = render(<Spotlight>{content}</Spotlight>);
		const before = screen.getByRole("button", { name: "Guardar" });
		rerender(
			<Spotlight active note="Ahora en gris">
				{content}
			</Spotlight>,
		);
		expect(screen.getByRole("button", { name: "Guardar" })).toBe(before);
		expect(screen.getByText("Ahora en gris")).toBeTruthy();
	});

	it("axe en claro y oscuro, con y sin active", async () => {
		await expectAccessibleInThemes(
			<>
				<Spotlight>{content}</Spotlight>
				<Spotlight active note="Ahora en gris" notePlacement="right">
					<button type="button">Cancelar</button>
				</Spotlight>
			</>,
		);
	});
});
