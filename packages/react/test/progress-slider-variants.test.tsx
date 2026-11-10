import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProgressBar, Slider } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: string[] = [
	'<div class="flex items-center gap-3 font-body text-sm font-medium text-secondary"><div role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" aria-label="Subida" class="h-2 w-full overflow-hidden rounded-full bg-quaternary flex-1"><div class="h-full rounded-full bg-fg-brand-primary" style="width:40%"></div></div><span>40%</span></div>',
	'<div class="flex font-body text-sm font-medium text-secondary flex-col items-end gap-2"><div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="h-2 w-full overflow-hidden rounded-full bg-quaternary flex-none"><div class="h-full rounded-full bg-fg-brand-primary" style="width:3%"></div></div><span>0%</span></div>',
	'<div class="flex items-center gap-3 font-body text-sm font-medium text-secondary x"><div role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" class="h-2 w-full overflow-hidden rounded-full bg-quaternary flex-1"><div class="h-full rounded-full bg-fg-brand-primary" style="width:100%"></div></div></div>',
	'<div class="inline-block w-full" data-rac="" role="group" id="react-aria-_R_0_" aria-label="Volumen" data-orientation="horizontal"><div style="position:relative;touch-action:none" class="relative h-2 w-full cursor-pointer rounded-full bg-quaternary" data-rac="" data-orientation="horizontal"><div class="absolute inset-y-0 left-0 rounded-l-full bg-fg-brand-primary" style="width:50%"></div><div style="position:absolute;left:calc((100% - 24px) * 0.5);transform:translateY(-50%);touch-action:none" class="top-1/2 size-6 rounded-full border-2 border-slider-handle-border bg-slider-handle-bg shadow-md outline-none data-focus-visible:shadow-focus-ring" data-rac=""><div style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input tabindex="0" id="react-aria-_R_0_-0" aria-labelledby="react-aria-_R_5H1_ react-aria-_R_0_" type="range" min="0" max="100" step="1" aria-orientation="horizontal" aria-valuetext="50" aria-describedby="" aria-details="" value="50"/></div></div></div></div>',
	'<div class="inline-block w-40" data-rac="" role="group" id="react-aria-_R_0_" aria-label="Volumen" data-orientation="horizontal"><div style="position:relative;touch-action:none" class="relative h-2 w-full cursor-pointer rounded-full bg-quaternary" data-rac="" data-orientation="horizontal"><div class="absolute inset-y-0 left-0 rounded-l-full bg-fg-brand-primary" style="width:50%"></div><div style="position:absolute;left:calc((100% - 24px) * 0.5);transform:translateY(-50%);touch-action:none" class="top-1/2 size-6 rounded-full border-2 border-slider-handle-border bg-slider-handle-bg shadow-md outline-none data-focus-visible:shadow-focus-ring" data-rac=""><div style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"><input tabindex="0" id="react-aria-_R_0_-0" aria-labelledby="react-aria-_R_5H1_ react-aria-_R_0_" type="range" min="10" max="20" step="1" aria-orientation="horizontal" aria-valuetext="15" aria-describedby="" aria-details="" value="15"/></div></div></div></div>',
];

// Los ids que reparte React Aria dependen del orden de montaje: se ignoran en la comparación
const noIds = (html: string) => html.replace(/react-aria-_R_[0-9a-z]+H1_/g, "react-aria-ID");

describe("ProgressBar y Slider: sin las props nuevas", () => {
	it("el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<ProgressBar value={40} aria-label="Subida" />)).toBe(BEFORE[0]);
		expect(renderToStaticMarkup(<ProgressBar value={0} label="bottom" />)).toBe(BEFORE[1]);
		expect(renderToStaticMarkup(<ProgressBar value={120} label={false} className="x" />)).toBe(BEFORE[2]);
		expect(noIds(renderToStaticMarkup(<Slider aria-label="Volumen" />))).toBe(noIds(BEFORE[3] as string));
		expect(
			noIds(
				renderToStaticMarkup(
					<Slider aria-label="Volumen" min={10} max={20} value={15} className="w-40" />,
				),
			),
		).toBe(noIds(BEFORE[4] as string));
	});
});

describe("ProgressBar: etiqueta flotante", () => {
	it.each(["top-floating", "bottom-floating"] as const)(
		"%s pone el porcentaje en una burbuja decorativa",
		(label) => {
			const { container } = render(<ProgressBar value={50} label={label} aria-label="Subida" />);
			const bar = screen.getByRole("progressbar", { name: "Subida" });
			expect(bar.getAttribute("aria-valuenow")).toBe("50");
			const bubble = container.querySelector("[aria-hidden=true]") as HTMLElement;
			expect(bubble.textContent).toBe("50%");
			expect(bubble.style.left).toBe("50%");
			expect(bubble.className).toContain(
				label === "top-floating" ? "bottom-[calc(100%+12px)]" : "top-4",
			);
		},
	);

	it("reserva el hueco de la burbuja y no la recorta", () => {
		const { container, rerender } = render(<ProgressBar value={50} label="top-floating" />);
		expect((container.firstChild as HTMLElement).className).toContain("pt-[42px]");
		expect(screen.getByRole("progressbar").className).not.toContain("overflow-hidden");
		rerender(<ProgressBar value={50} label="bottom-floating" />);
		expect((container.firstChild as HTMLElement).className).toContain("pb-[38px]");
	});

	it("el valor no se duplica para los lectores: solo `aria-valuenow`", () => {
		render(<ProgressBar value={72} label="top-floating" aria-label="Subida" />);
		expect(screen.queryByText("72%", { ignore: "[aria-hidden=true]" })).toBeNull();
		expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("72");
	});

	it("acota el valor a 0–100 y deja un mínimo visible", () => {
		const { container } = render(<ProgressBar value={-5} label="top-floating" />);
		expect((container.querySelector("[aria-hidden=true]") as HTMLElement).textContent).toBe("0%");
		expect((container.querySelector("[style]") as HTMLElement).style.width).toBe("3%");
	});

	it("es accesible, en claro y en oscuro", async () => {
		await expectAccessibleInThemes(<ProgressBar value={50} label="top-floating" aria-label="Subida" />);
		await expectAccessibleInThemes(
			<ProgressBar value={50} label="bottom-floating" aria-label="Subida" />,
		);
	});
});

describe("Slider: etiquetas", () => {
	it("label bottom pone el valor bajo el mando y formatValue lo escribe", () => {
		const { container } = render(
			<Slider aria-label="Volumen" label="bottom" defaultValue={40} formatValue={(v) => `${v}%`} />,
		);
		const label = container.querySelector("[aria-hidden=true]") as HTMLElement;
		expect(label.textContent).toBe("40%");
		expect(label.className).toContain("top-8");
		expect((container.firstChild as HTMLElement).className).toContain("pb-11");
	});

	it("label top-floating pone el valor en una burbuja encima y sigue al mando", async () => {
		const { container } = render(<Slider aria-label="Volumen" label="top-floating" defaultValue={40} />);
		const bubble = container.querySelector("[aria-hidden=true]") as HTMLElement;
		expect(bubble.className).toContain("-top-[38px]");
		expect((container.firstChild as HTMLElement).className).toContain("pt-[46px]");
		screen.getByRole("slider").focus();
		await userEvent.keyboard("{ArrowRight}{ArrowRight}");
		expect(bubble.textContent).toBe("42");
	});

	it("sin label no pinta texto ni reserva hueco", () => {
		const { container } = render(<Slider aria-label="Volumen" />);
		expect(container.querySelector("[aria-hidden=true]")).toBeNull();
		expect((container.firstChild as HTMLElement).className).not.toContain("pb-11");
	});

	it("la etiqueta no cambia lo que anuncia el mando", () => {
		render(
			<Slider
				aria-label="Volumen"
				label="bottom"
				defaultValue={40}
				formatValue={(v) => `${v} por ciento`}
			/>,
		);
		expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("40");
	});
});

describe("Slider: range", () => {
	it("pinta dos mandos con su nombre accesible y el relleno entre ellos", () => {
		const { container } = render(<Slider range aria-label="Precio" defaultValue={[25, 50]} />);
		const sliders = screen.getAllByRole("slider");
		expect(sliders).toHaveLength(2);
		expect(screen.getByRole("slider", { name: /Mínimo/ })).toBeTruthy();
		expect(screen.getByRole("slider", { name: /Máximo/ })).toBeTruthy();
		const fill = container.querySelector(".bg-fg-brand-primary") as HTMLElement;
		expect(fill.style.left).toBe("25%");
		expect(fill.style.width).toBe("25%");
	});

	it("los nombres de los mandos se pueden cambiar", () => {
		render(<Slider range aria-label="Precio" thumbLabels={["Desde", "Hasta"]} />);
		expect(screen.getByRole("slider", { name: /Desde/ })).toBeTruthy();
		expect(screen.getByRole("slider", { name: /Hasta/ })).toBeTruthy();
	});

	it("con las flechas, el mando izquierdo cambia solo el mínimo", async () => {
		const onChange = vi.fn();
		render(<Slider range aria-label="Precio" defaultValue={[25, 50]} onChange={onChange} />);
		const [left, right] = screen.getAllByRole("slider") as HTMLInputElement[];
		(left as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}{ArrowRight}");
		expect(onChange).toHaveBeenLastCalledWith([27, 50]);
		expect((left as HTMLInputElement).value).toBe("27");
		expect((right as HTMLInputElement).value).toBe("50");
	});

	it("el mínimo nunca pasa del máximo", async () => {
		const onChange = vi.fn();
		render(<Slider range aria-label="Precio" defaultValue={[48, 50]} onChange={onChange} />);
		const [left] = screen.getAllByRole("slider") as HTMLInputElement[];
		(left as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{End}");
		expect((left as HTMLInputElement).value).toBe("50");
		expect(onChange.mock.lastCall?.[0]).toEqual([50, 50]);
	});

	it("el máximo nunca baja del mínimo y Inicio y Fin funcionan en cada mando", async () => {
		render(<Slider range aria-label="Precio" defaultValue={[30, 60]} />);
		const [left, right] = screen.getAllByRole("slider") as HTMLInputElement[];
		(right as HTMLElement).focus();
		await userEvent.keyboard("{Home}");
		expect((right as HTMLInputElement).value).toBe("30");
		await userEvent.keyboard("{End}");
		expect((right as HTMLInputElement).value).toBe("100");
		(left as HTMLElement).focus();
		await userEvent.keyboard("{Home}");
		expect((left as HTMLInputElement).value).toBe("0");
	});

	it("Tab recorre los dos mandos en orden", async () => {
		render(<Slider range aria-label="Precio" />);
		const [left, right] = screen.getAllByRole("slider");
		await userEvent.tab();
		expect(document.activeElement).toBe(left);
		await userEvent.tab();
		expect(document.activeElement).toBe(right);
	});

	it("controlado: manda el valor del padre", async () => {
		render(<Slider range aria-label="Precio" value={[10, 90]} />);
		const [left] = screen.getAllByRole("slider") as HTMLInputElement[];
		(left as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect((left as HTMLInputElement).value).toBe("10");
	});

	it("con label, cada mando enseña su valor", () => {
		const { container } = render(
			<Slider
				range
				aria-label="Precio"
				label="top-floating"
				defaultValue={[25, 50]}
				formatValue={(v) => `${v}%`}
			/>,
		);
		expect([...container.querySelectorAll("[aria-hidden=true]")].map((n) => n.textContent)).toEqual([
			"25%",
			"50%",
		]);
	});

	it("step cambia el salto de las flechas", async () => {
		render(<Slider range aria-label="Precio" step={10} defaultValue={[20, 60]} />);
		const [left] = screen.getAllByRole("slider") as HTMLInputElement[];
		(left as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect((left as HTMLInputElement).value).toBe("30");
	});

	it("es accesible, en claro y en oscuro", async () => {
		await expectAccessibleInThemes(
			<Slider range aria-label="Precio" label="top-floating" defaultValue={[25, 50]} />,
		);
		await expectAccessibleInThemes(<Slider aria-label="Volumen" label="bottom" defaultValue={40} />);
	});
});
