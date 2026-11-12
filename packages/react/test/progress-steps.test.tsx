import { render, screen, within } from "@testing-library/react";
import { HomeLine, Stars02, User01, Users01 } from "@untitledui/icons";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProgressSteps } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const STEPS = [
	{ title: "Tus datos", description: "Nombre y correo", icon: User01 },
	{ title: "Tu empresa", description: "Web y ubicación", icon: HomeLine },
	{ title: "Tu equipo", description: "Empieza a colaborar", icon: Users01 },
	{ title: "Tus redes", description: "Publicación automática", icon: Stars02 },
];

describe("ProgressSteps", () => {
	it("es una lista ordenada con el paso actual en aria-current y el estado de cada uno para lectores", () => {
		render(<ProgressSteps steps={STEPS} current={1} aria-label="Alta" />);
		const list = screen.getByRole("list", { name: "Alta" });
		expect(list.tagName).toBe("OL");
		const items = within(list).getAllByRole("listitem");
		expect(items).toHaveLength(4);
		expect(items.map((i) => i.getAttribute("aria-current"))).toEqual([null, "step", null, null]);
		expect(items.map((i) => i.querySelector(".sr-only")?.textContent)).toEqual([
			"completo: ",
			"actual: ",
			"pendiente: ",
			"pendiente: ",
		]);
		expect(items[1]?.textContent).toContain("Tu empresa");
	});

	it("los textos de estado se pueden sustituir", () => {
		render(
			<ProgressSteps
				steps={STEPS}
				current={0}
				labels={{ complete: "done", current: "now", pending: "todo" }}
			/>,
		);
		expect(screen.getAllByRole("listitem")[0]?.querySelector(".sr-only")?.textContent).toBe("now: ");
		expect(screen.getAllByRole("listitem")[3]?.querySelector(".sr-only")?.textContent).toBe("todo: ");
	});

	it("el paso actual va en marca y los pendientes con marcador de número, atenuados", () => {
		render(<ProgressSteps steps={STEPS} current={1} marker="number" />);
		const items = screen.getAllByRole("listitem");
		expect(items[1]?.querySelector(".text-brand-secondary")).not.toBeNull();
		expect(items[2]?.querySelector(".text-quaternary")).not.toBeNull();
		const withCheck = render(<ProgressSteps steps={STEPS} current={1} marker="check" />);
		expect(
			within(withCheck.container).getAllByRole("listitem")[2]?.querySelector(".text-secondary"),
		).not.toBeNull();
	});

	it("marcador de número: los pendientes y el actual enseñan su número y los completos un check verde", () => {
		render(<ProgressSteps steps={STEPS} current={2} marker="number" />);
		const items = screen.getAllByRole("listitem");
		for (const done of [items[0], items[1]]) {
			expect(done?.querySelector(".bg-success-solid svg")).not.toBeNull();
			expect(done?.querySelector("[aria-hidden=true]")?.textContent).toBe("");
		}
		expect(items[2]?.querySelector("[aria-hidden=true].text-primary")?.textContent).toBe("3");
		expect(items[3]?.querySelector("[aria-hidden=true].text-quaternary")?.textContent).toBe("4");
		expect(items[2]?.querySelector(".bg-success-solid")).toBeNull();
	});

	it("marcador check: completo con check de marca, actual con doble anillo, pendiente con punto gris", () => {
		render(<ProgressSteps steps={STEPS} current={1} />);
		const items = screen.getAllByRole("listitem");
		expect(items[0]?.querySelector(".bg-brand-solid svg")).not.toBeNull();
		expect(
			items[1]?.querySelector(".shadow-\\[inset_0_0_0_2px_var\\(--border-brand\\)\\]"),
		).not.toBeNull();
		expect(items[1]?.querySelector(".bg-brand-solid .bg-fg-white")).not.toBeNull();
		expect(items[2]?.querySelector(".bg-fg-quaternary")).not.toBeNull();
	});

	it("marcador featured: el icono de cada paso en su cuadrado, atenuado si está pendiente", () => {
		render(<ProgressSteps steps={STEPS} current={1} marker="featured" size="sm" />);
		const items = screen.getAllByRole("listitem");
		expect(items[0]?.querySelector("svg")).not.toBeNull();
		expect(items[0]?.querySelector(".size-10")).not.toBeNull();
		expect(items[3]?.querySelector(".opacity-50")).not.toBeNull();
		expect(items[0]?.querySelector(".opacity-50")).toBeNull();
	});

	it("tamaños: marcador de 24px en sm y de 32px en md", () => {
		const { container, rerender } = render(<ProgressSteps steps={STEPS} current={1} size="sm" />);
		expect(container.querySelector("li [aria-hidden=true].size-6")).not.toBeNull();
		rerender(<ProgressSteps steps={STEPS} current={1} size="md" />);
		expect(container.querySelector("li [aria-hidden=true].size-8")).not.toBeNull();
	});

	it("horizontal: marcadores unidos por líneas, de marca hasta el actual y grises después", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={1} />);
		const lines = container.querySelectorAll("li > span.absolute");
		expect(lines).toHaveLength(3);
		expect(lines[0]?.className).toContain("bg-brand-solid");
		expect(lines[1]?.className).toContain("bg-quaternary");
		expect(container.querySelector("ol")?.className).toContain("flex-row");
		// Texto centrado bajo el marcador
		expect(screen.getAllByRole("listitem")[0]?.className).toContain("text-center");
	});

	it("con números las líneas son punteadas", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={1} marker="number" />);
		expect(container.querySelector("li > span.absolute")?.className).toContain("border-dotted");
	});

	it("vertical: se apilan, el texto va a la derecha del marcador y la línea entre marcadores es vertical", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={1} orientation="vertical" />);
		expect(container.querySelector("ol")?.className).toContain("flex-col");
		const first = screen.getAllByRole("listitem")[0] as HTMLElement;
		const [markCol, textCol] = Array.from(first.children);
		expect(markCol?.querySelector("svg")).not.toBeNull();
		expect(textCol?.textContent).toContain("Tus datos");
		expect(markCol?.querySelector(".w-0\\.5")).not.toBeNull();
		// El último paso no lleva línea
		const last = screen.getAllByRole("listitem")[3] as HTMLElement;
		expect(last.querySelector(".w-0\\.5")).toBeNull();
	});

	it("icons-text es siempre vertical", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={1} type="icons-text" />);
		expect(container.querySelector("ol")?.className).toContain("flex-col");
	});

	it("text-line: una raya sobre cada texto, de marca hasta el actual y gris después, en fila o en columna", () => {
		const { container, rerender } = render(<ProgressSteps steps={STEPS} current={1} type="text-line" />);
		const bars = () => Array.from(container.querySelectorAll("li > span.h-1"));
		expect(bars().map((b) => b.className.includes("bg-brand-solid"))).toEqual([true, true, false, false]);
		expect(container.querySelector("ol")?.className).toContain("flex-row");
		rerender(<ProgressSteps steps={STEPS} current={1} type="text-line" orientation="vertical" />);
		expect(container.querySelector("ol")?.className).toContain("flex-col");
	});

	it("minimal: «Paso 3 de 4» junto a los cuatro marcadores, sin los títulos a la vista", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={2} type="minimal" />);
		expect(screen.getByText("Paso 3 de 4").className).not.toContain("sr-only");
		expect(screen.getAllByRole("listitem")).toHaveLength(4);
		expect(container.querySelectorAll("li > [aria-hidden=true]")).toHaveLength(4);
		// Los títulos solo para lectores
		for (const li of screen.getAllByRole("listitem"))
			expect(li.querySelector(".sr-only")?.textContent).toMatch(/: .+/);
		expect(container.textContent).not.toContain("Nombre y correo");
		expect(screen.getAllByRole("listitem")[2]?.getAttribute("aria-current")).toBe("step");
	});

	it("minimal-connected: los marcadores van unidos por líneas y el «Paso 3 de 4» queda para lectores", () => {
		const { container } = render(<ProgressSteps steps={STEPS} current={2} type="minimal-connected" />);
		expect(container.querySelectorAll("li > span.w-6")).toHaveLength(3);
		expect(screen.getByText("Paso 3 de 4").className).toContain("sr-only");
	});

	it("el texto «Paso n de N» se puede sustituir", () => {
		render(
			<ProgressSteps
				steps={STEPS}
				current={0}
				type="minimal"
				labels={{ stepOf: (n, total) => `Step ${n}/${total}` }}
			/>,
		);
		expect(screen.getByText("Step 1/4")).toBeTruthy();
	});

	it("con `current` fuera de rango, todos completos (al final) o el primero actual (negativo)", () => {
		const { rerender } = render(<ProgressSteps steps={STEPS} current={9} />);
		expect(screen.getAllByRole("listitem").every((i) => i.getAttribute("aria-current") === null)).toBe(
			true,
		);
		rerender(<ProgressSteps steps={STEPS} current={-3} />);
		expect(screen.getAllByRole("listitem")[0]?.getAttribute("aria-current")).toBe("step");
	});

	it("se pinta en el servidor", () => {
		const html = renderToString(<ProgressSteps steps={STEPS} current={1} aria-label="Alta" />);
		expect(html).toContain("<ol");
		expect(html).toContain('aria-current="step"');
		expect(html).toContain("completo: ");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<>
				<ProgressSteps steps={STEPS} current={1} aria-label="Alta" />
				<ProgressSteps
					steps={STEPS}
					current={2}
					type="icons-text"
					marker="number"
					aria-label="Alta 2"
				/>
				<ProgressSteps steps={STEPS} current={1} type="text-line" aria-label="Alta 3" />
				<ProgressSteps steps={STEPS} current={2} type="minimal" aria-label="Alta 4" />
			</>,
		);
	});
});
