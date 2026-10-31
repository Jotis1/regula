import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FileUpload, Slider, type UploadFile } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Slider", () => {
	it("valor 50 por defecto en 0–100, con nombre accesible", () => {
		render(<Slider aria-label="Presupuesto" />);
		const input = screen.getByRole("slider", { name: "Presupuesto" }) as HTMLInputElement;
		expect(input.value).toBe("50");
		expect(input.min).toBe("0");
		expect(input.max).toBe("100");
	});

	it("flechas, Inicio y Fin cambian el valor y avisan con el número", async () => {
		const onChange = vi.fn();
		render(<Slider aria-label="Presupuesto" defaultValue={40} onChange={onChange} />);
		const input = screen.getByRole("slider") as HTMLInputElement;
		await userEvent.tab();
		expect(document.activeElement).toBe(input);
		await userEvent.keyboard("{ArrowRight}");
		expect(onChange).toHaveBeenLastCalledWith(41);
		await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
		expect(onChange).toHaveBeenLastCalledWith(39);
		await userEvent.keyboard("{End}");
		expect(onChange).toHaveBeenLastCalledWith(100);
		await userEvent.keyboard("{Home}");
		expect(onChange).toHaveBeenLastCalledWith(0);
		expect(input.value).toBe("0");
	});

	it("respeta min y max, y controlado no se mueve solo", async () => {
		const onChange = vi.fn();
		render(<Slider aria-label="X" min={10} max={20} value={20} onChange={onChange} />);
		const input = screen.getByRole("slider") as HTMLInputElement;
		await userEvent.tab();
		await userEvent.keyboard("{ArrowRight}{ArrowLeft}");
		expect(onChange).toHaveBeenLastCalledWith(19);
		expect(input.value).toBe("20");
	});

	it("pista bg-quaternary, relleno fg-brand-primary al porcentaje y mando con los tokens del slider", () => {
		const { container } = render(<Slider aria-label="X" defaultValue={40} />);
		const fill = container.querySelector(".bg-fg-brand-primary") as HTMLElement;
		expect(fill.style.width).toBe("40%");
		expect(fill.parentElement?.className).toContain("bg-quaternary");
		const thumb = screen.getByRole("slider").closest(".size-6") as HTMLElement;
		for (const c of [
			"bg-slider-handle-bg",
			"border-slider-handle-border",
			"shadow-md",
			"data-focus-visible:shadow-focus-ring",
		])
			expect(thumb.className).toContain(c);
		expect(thumb.style.left).toBe("calc(0.4 * (100% - 24px))");
	});

	it("se renderiza en servidor", () => {
		expect(renderToString(<Slider aria-label="X" defaultValue={40} />)).toContain('type="range"');
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<Slider aria-label="Presupuesto" defaultValue={40} />);
	});
});

const FILES: UploadFile[] = [
	{ name: "extracto-octubre.csv", size: 204800, progress: 100, status: "complete" },
	{ name: "notas-reunion.md", size: 12800, progress: 40 },
	{ name: "foto-ticket.heic", size: 3355443, status: "error", error: "Formato no admitido" },
];

describe("FileUpload", () => {
	it("el clic en la zona abre el input de archivo y onFiles recibe la lista", async () => {
		const onFiles = vi.fn();
		render(
			<FileUpload accept=".csv,.md" multiple hint="CSV o Markdown (máx. 10 MB)" onFiles={onFiles} />,
		);
		const input = screen.getByLabelText(/Haz clic para subir/) as HTMLInputElement;
		expect(input.type).toBe("file");
		expect(input.accept).toBe(".csv,.md");
		expect(input.multiple).toBe(true);
		expect(screen.getByText("CSV o Markdown (máx. 10 MB)")).toBeTruthy();
		const a = new File(["a"], "a.csv", { type: "text/csv" });
		const b = new File(["b"], "b.md", { type: "text/markdown" });
		await userEvent.upload(input, [a, b]);
		expect(onFiles).toHaveBeenCalledWith([a, b]);
	});

	it("se enfoca con teclado", async () => {
		render(<FileUpload />);
		await userEvent.tab();
		expect((document.activeElement as HTMLInputElement).type).toBe("file");
	});

	it("arrastrar marca la zona con borde de marca y soltar entrega los archivos", () => {
		const onFiles = vi.fn();
		render(<FileUpload onFiles={onFiles} />);
		const zone = screen.getByText("Haz clic para subir").closest("label") as HTMLElement;
		const file = new File(["x"], "x.csv");
		fireEvent.dragOver(zone, { dataTransfer: { files: [] } });
		expect(zone.getAttribute("data-dragging")).toBe("true");
		expect(zone.className).toContain("shadow-[inset_0_0_0_2px_var(--border-brand)]");
		fireEvent.drop(zone, { dataTransfer: { files: [file] } });
		expect(onFiles).toHaveBeenCalledWith([file]);
		expect(zone.hasAttribute("data-dragging")).toBe(false);
	});

	it("deshabilitado: 50 % y no entrega archivos al soltar", () => {
		const onFiles = vi.fn();
		render(<FileUpload disabled onFiles={onFiles} />);
		const zone = screen.getByText("Haz clic para subir").closest("label") as HTMLElement;
		expect(zone.className).toContain("opacity-50");
		fireEvent.drop(zone, { dataTransfer: { files: [new File(["x"], "x.csv")] } });
		expect(onFiles).not.toHaveBeenCalled();
		expect((zone.querySelector("input") as HTMLInputElement).disabled).toBe(true);
	});

	it("lista: completado, progreso y error con su mensaje y borde", () => {
		render(<FileUpload files={FILES} />);
		const items = screen.getAllByRole("listitem");
		expect(items).toHaveLength(3);
		expect(items[0]?.textContent).toContain("200 KB");
		expect(items[0]?.querySelector(".text-success-primary")?.textContent).toContain("Completado");
		expect(items[0]?.querySelector('[role="progressbar"]')).toBeNull();
		const bar = screen.getByRole("progressbar", { name: "Progreso de notas-reunion.md" });
		expect(bar.getAttribute("aria-valuenow")).toBe("40");
		expect(items[1]?.textContent).toContain("Subiendo…");
		expect(items[2]?.className).toContain("var(--border-error_subtle)");
		expect(items[2]?.querySelector(".text-error-primary")?.textContent).toBe("Formato no admitido");
	});

	it("quitar llama a onRemove con el índice", async () => {
		const onRemove = vi.fn();
		render(<FileUpload files={FILES} onRemove={onRemove} />);
		await userEvent.click(screen.getByRole("button", { name: "Quitar notas-reunion.md" }));
		expect(onRemove).toHaveBeenCalledWith(1);
	});

	it("textos sustituibles", () => {
		render(
			<FileUpload
				files={[{ name: "a.csv", status: "error" }]}
				labels={{ upload: "Sube", failed: "Falló", remove: (n) => `Borrar ${n}` }}
			/>,
		);
		expect(screen.getByText("Sube")).toBeTruthy();
		expect(screen.getByText("Falló")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Borrar a.csv" })).toBeTruthy();
	});

	it("sin infracciones de axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<FileUpload hint="CSV" files={FILES} />);
	});
});
