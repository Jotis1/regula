import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { HomeLine, Stars02, User01, Users01 } from "@untitledui/icons";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
	ProgressSteps,
	type ProgressStepsOrientation,
	type ProgressStepsProps,
	type ProgressStepsType,
} from "../src/index.js";
import { CASES } from "./fixtures/progress-steps-cases.js";
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

const BEFORE: Record<keyof typeof CASES, string> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/progress-steps-before.json"), "utf8"),
);

describe("ProgressSteps: el de siempre", () => {
	it.each(Object.keys(CASES) as (keyof typeof CASES)[])(
		"%s: sin las props nuevas el HTML es el de antes",
		(name) => {
			const props = CASES[name] as unknown as ProgressStepsProps;
			expect(renderToStaticMarkup(<ProgressSteps {...props} />)).toMatchBefore(BEFORE[name]);
		},
	);
});

const TYPES: ProgressStepsType[] = [
	"icons-centered",
	"icons-text",
	"text-line",
	"minimal",
	"minimal-connected",
];
const ORIENTATIONS: ProgressStepsOrientation[] = ["horizontal", "vertical"];

describe("ProgressSteps: pasos navegables", () => {
	it.each(TYPES.flatMap((type) => ORIENTATIONS.map((orientation) => ({ type, orientation }))))(
		"$type $orientation: cada paso es un botón con su título como nombre y pulsar el tercero llama a onChange(2)",
		async ({ type, orientation }) => {
			const onChange = vi.fn();
			render(
				<ProgressSteps
					steps={STEPS}
					current={0}
					type={type}
					orientation={orientation}
					onChange={onChange}
					aria-label="Alta"
				/>,
			);
			const buttons = screen.getAllByRole("button");
			expect(buttons.map((b) => b.getAttribute("type"))).toEqual(Array(4).fill("button"));
			for (const step of STEPS) expect(screen.getByRole("button", { name: step.title })).toBeTruthy();
			await userEvent.click(screen.getByRole("button", { name: "Tu equipo" }));
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(2);
			// Un pendiente y uno completo también se pulsan
			await userEvent.click(screen.getByRole("button", { name: "Tus datos" }));
			expect(onChange).toHaveBeenLastCalledWith(0);
			// Cada botón va dentro de su <li> y el actual sigue llevando aria-current
			const items = screen.getAllByRole("listitem");
			expect(items.map((li) => li.querySelectorAll("button").length)).toEqual([1, 1, 1, 1]);
			expect(items.map((li) => li.getAttribute("aria-current"))).toEqual(["step", null, null, null]);
			expect(items[1]?.querySelector(".sr-only")?.textContent).toBe("pendiente: ");
		},
	);

	it("la descripción es la descripción del botón y no entra en su nombre", () => {
		render(<ProgressSteps steps={STEPS} current={0} onChange={() => {}} />);
		const button = screen.getByRole("button", { name: "Tus datos" });
		expect(button.getAttribute("aria-describedby")).not.toBeNull();
		expect(screen.getByRole("button", { name: "Tus datos", description: "Nombre y correo" })).toBe(
			button,
		);
	});

	it("Enter y Espacio activan el paso enfocado, que lleva el anillo de foco del sistema", async () => {
		const onChange = vi.fn();
		render(<ProgressSteps steps={STEPS} current={0} onChange={onChange} />);
		await userEvent.tab();
		const first = screen.getByRole("button", { name: "Tus datos" });
		expect(document.activeElement).toBe(first);
		expect(first.className).toContain("focus-visible:shadow-focus-ring");
		await userEvent.tab();
		await userEvent.keyboard("{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(1);
		await userEvent.tab();
		await userEvent.keyboard(" ");
		expect(onChange).toHaveBeenLastCalledWith(2);
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it("sin onChange no hay botones, aunque haya children", () => {
		render(
			<ProgressSteps steps={STEPS} current={0} orientation="vertical">
				{() => <p>Contenido</p>}
			</ProgressSteps>,
		);
		expect(screen.queryAllByRole("button")).toHaveLength(0);
	});

	it("se pinta en el servidor con onChange", () => {
		const html = renderToString(<ProgressSteps steps={STEPS} current={1} onChange={() => {}} />);
		expect(html).toContain("<button");
		expect(html).toContain('aria-current="step"');
	});
});

describe("ProgressSteps: contenido del paso actual", () => {
	const content = (i: number) => <p data-testid="contenido">Paso {i}</p>;

	it.each(TYPES.filter((t) => t !== "minimal" && t !== "minimal-connected"))(
		"%s en vertical: el contenido va dentro del <li> del actual, bajo su título, en una región polite",
		(type) => {
			render(
				<ProgressSteps steps={STEPS} current={1} type={type} orientation="vertical">
					{content}
				</ProgressSteps>,
			);
			const items = screen.getAllByRole("listitem");
			const text = screen.getByTestId("contenido");
			expect(text.textContent).toBe("Paso 1");
			expect(items[1]?.contains(text)).toBe(true);
			const region = text.closest("[aria-live]");
			expect(region?.getAttribute("aria-live")).toBe("polite");
			expect(items[1]?.contains(region)).toBe(true);
			// Va después del título
			const title = within(items[1] as HTMLElement).getByText("Tu empresa");
			expect(title.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
			// Los demás pasos no llevan contenido
			expect(screen.getAllByTestId("contenido")).toHaveLength(1);
		},
	);

	// `icons-text` siempre es vertical: no tiene versión horizontal
	it.each(TYPES.filter((t) => t !== "icons-text"))(
		"%s en horizontal: el contenido va en un bloque bajo la lista, en una región polite",
		(type) => {
			const { container } = render(
				<ProgressSteps steps={STEPS} current={2} type={type} className="mi-clase" aria-label="Alta">
					{content}
				</ProgressSteps>,
			);
			const text = screen.getByTestId("contenido");
			expect(text.textContent).toBe("Paso 2");
			const ol = screen.getByRole("list", { name: "Alta" });
			expect(ol.contains(text)).toBe(false);
			const region = text.closest("[aria-live]") as HTMLElement;
			expect(region.getAttribute("aria-live")).toBe("polite");
			expect(ol.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
			// La clase del usuario pasa al envoltorio de la lista y el bloque
			expect((container.firstElementChild as HTMLElement).className).toContain("mi-clase");
			expect(ol.className).not.toContain("mi-clase");
		},
	);

	it("el contenido sigue al paso actual y, con todos completos, recibe la longitud de la lista", () => {
		const { rerender } = render(
			<ProgressSteps steps={STEPS} current={0}>
				{content}
			</ProgressSteps>,
		);
		expect(screen.getByTestId("contenido").textContent).toBe("Paso 0");
		rerender(
			<ProgressSteps steps={STEPS} current={9}>
				{content}
			</ProgressSteps>,
		);
		expect(screen.getByTestId("contenido").textContent).toBe("Paso 4");
	});

	it("axe con onChange y contenido, en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<>
				{TYPES.map((type) => (
					<ProgressSteps
						key={type}
						steps={STEPS}
						current={1}
						type={type}
						marker="number"
						onChange={() => {}}
						aria-label={`Alta ${type}`}
					>
						{content}
					</ProgressSteps>
				))}
				<ProgressSteps
					steps={STEPS}
					current={1}
					orientation="vertical"
					onChange={() => {}}
					aria-label="V"
				>
					{content}
				</ProgressSteps>
			</>,
		);
	});
});
