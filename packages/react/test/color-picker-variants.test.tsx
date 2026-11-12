import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker, type ColorPickerType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { full: string; bare: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/color-picker-before.json"), "utf8"),
);

const box = (name: string) => screen.getByRole("textbox", { name }) as HTMLInputElement;
const chooseModel = async (label: string) => {
	await userEvent.click(screen.getByRole("button", { name: /Modelo de color/ }));
	await userEvent.click(await screen.findByRole("option", { name: label }));
};

describe("ColorPicker: el de siempre", () => {
	it("sin type el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<ColorPicker defaultValue="#7f56d9" swatches={["#4f39f6", "#00a63e", "#7f56d9"]} />,
			),
		).toBe(BEFORE.full);
		expect(renderToStaticMarkup(<ColorPicker />)).toBe(BEFORE.bare);
	});
});

describe("ColorPicker: modelos de color", () => {
	it("el mismo color se ve igual en Hex, RGB, CSS, HSL y HSB", async () => {
		render(<ColorPicker type="solid" defaultValue="#7f56d9" />);
		expect(box("Hex").value).toBe("7F56D9");
		expect(box("Opacidad").value).toBe("100%");
		await chooseModel("RGB");
		expect([box("Rojo").value, box("Verde").value, box("Azul").value]).toEqual(["127", "86", "217"]);
		await chooseModel("CSS");
		expect(box("Color CSS").value).toBe("rgba(127, 86, 217, 1)");
		await chooseModel("HSL");
		expect([box("Tono").value, box("Saturación").value, box("Luminosidad").value]).toEqual([
			"259",
			"63",
			"59",
		]);
		await chooseModel("HSB");
		expect([box("Tono").value, box("Saturación").value, box("Brillo").value]).toEqual([
			"259",
			"60",
			"85",
		]);
		await chooseModel("Hex");
		expect(box("Hex").value).toBe("7F56D9");
	});

	it("editar un canal cambia el color igual en todos los modelos y avisa con hex y opacidad", async () => {
		const onChange = vi.fn();
		render(<ColorPicker type="solid" defaultValue="#7f56d9" defaultModel="rgb" onChange={onChange} />);
		const red = box("Rojo");
		await userEvent.clear(red);
		await userEvent.type(red, "255");
		expect(onChange).toHaveBeenLastCalledWith("#ff56d9", 1);
		await userEvent.tab();
		await chooseModel("Hex");
		expect(box("Hex").value).toBe("FF56D9");
	});

	it("la opacidad se edita en el campo de porcentaje y llega a onChange", async () => {
		const onChange = vi.fn();
		render(<ColorPicker type="minimal" defaultValue="#7f56d9" onChange={onChange} />);
		const alpha = box("Opacidad");
		await userEvent.clear(alpha);
		await userEvent.type(alpha, "40");
		expect(onChange).toHaveBeenLastCalledWith("#7f56d9", 0.4);
		expect(screen.getByRole("slider", { name: "Opacidad" })).toBeTruthy();
	});

	it("CSS acepta un rgba escrito a mano", async () => {
		const onChange = vi.fn();
		render(<ColorPicker type="solid" defaultValue="#7f56d9" defaultModel="css" onChange={onChange} />);
		const css = box("Color CSS");
		await userEvent.clear(css);
		await userEvent.type(css, "rgba(0, 0, 255, 0.5)");
		expect(onChange).toHaveBeenLastCalledWith("#0000ff", 0.5);
	});
});

describe("ColorPicker: degradado", () => {
	it("añadir una parada pone un mando nuevo, que se mueve y se borra con el teclado, y avisa con la lista", async () => {
		const onGradientChange = vi.fn();
		render(
			<ColorPicker
				type="gradient"
				defaultGradient={[
					{ offset: 0, color: "#7f56d9" },
					{ offset: 100, color: "#432e73" },
				]}
				onGradientChange={onGradientChange}
			/>,
		);
		expect(screen.getAllByRole("slider", { name: /Parada/ })).toHaveLength(2);
		await userEvent.click(screen.getByRole("slider", { name: "Parada 1" }));
		await userEvent.click(screen.getByRole("button", { name: "Añadir" }));
		const third = screen.getByRole("slider", { name: "Parada 3" });
		expect(third.getAttribute("aria-valuenow")).toBe("50");
		expect(document.activeElement).toBe(third);
		expect(onGradientChange).toHaveBeenLastCalledWith([
			{ offset: 0, color: "#7f56d9" },
			{ offset: 50, color: "#7f56d9", alpha: 1 },
			{ offset: 100, color: "#432e73" },
		]);
		await userEvent.keyboard("{ArrowRight}");
		expect(third.getAttribute("aria-valuenow")).toBe("51");
		await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
		expect(third.getAttribute("aria-valuenow")).toBe("41");
		expect(onGradientChange.mock.lastCall?.[0][1].offset).toBe(41);
		await userEvent.keyboard("{Delete}");
		expect(screen.getAllByRole("slider", { name: /Parada/ })).toHaveLength(2);
		expect(onGradientChange.mock.lastCall?.[0]).toHaveLength(2);
	});

	it("no deja menos de dos paradas y cada fila edita posición, color y opacidad", async () => {
		const onGradientChange = vi.fn();
		render(<ColorPicker type="gradient" defaultValue="#7f56d9" onGradientChange={onGradientChange} />);
		expect(screen.getByRole("button", { name: "Quitar la parada 1" }).hasAttribute("disabled")).toBe(
			true,
		);
		const pos = box("Posición de la parada 2");
		await userEvent.clear(pos);
		await userEvent.type(pos, "80");
		expect(screen.getByRole("slider", { name: "Parada 2" }).getAttribute("aria-valuenow")).toBe("80");
		const color = box("Color de la parada 1");
		await userEvent.clear(color);
		await userEvent.type(color, "00A63E");
		expect(onGradientChange.mock.lastCall?.[0][0].color).toBe("#00a63e");
	});

	it("las pestañas cambian entre sólido, degradado e imagen", async () => {
		render(<ColorPicker type="solid" />);
		expect(screen.getByRole("tab", { name: "Sólido" }).getAttribute("aria-selected")).toBe("true");
		await userEvent.click(screen.getByRole("tab", { name: "Degradado" }));
		expect(screen.getAllByRole("slider", { name: /Parada/ })).toHaveLength(2);
		await userEvent.click(screen.getByRole("tab", { name: "Imagen" }));
		expect(screen.getByLabelText("Haz clic para subir")).toBeTruthy();
	});
});

describe("ColorPicker: imagen", () => {
	it("sube una imagen con el input type=file y avisa con el archivo", async () => {
		const onImageChange = vi.fn();
		render(<ColorPicker type="image" onImageChange={onImageChange} />);
		const input = screen.getByLabelText("Haz clic para subir") as HTMLInputElement;
		expect(input.type).toBe("file");
		expect(input.accept).toBe("image/*");
		const file = new File(["png"], "fondo.png", { type: "image/png" });
		await userEvent.upload(input, file);
		expect(onImageChange).toHaveBeenCalledWith(file);
		expect(screen.getByText("fondo.png")).toBeTruthy();
	});

	it("los ajustes son barras con nombre y se restablecen", async () => {
		const onImageAdjust = vi.fn();
		render(<ColorPicker type="image" onImageAdjust={onImageAdjust} />);
		for (const name of [
			"Exposición",
			"Contraste",
			"Saturación",
			"Temperatura",
			"Matiz",
			"Luces",
			"Sombras",
		])
			expect(screen.getByRole("slider", { name })).toBeTruthy();
		screen.getByRole("slider", { name: "Contraste" }).focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(onImageAdjust.mock.lastCall?.[0].contrast).toBe(1);
		await userEvent.click(screen.getByRole("button", { name: "Restablecer los ajustes" }));
		expect(onImageAdjust.mock.lastCall?.[0].contrast).toBe(0);
	});
});

describe("ColorPicker: muestras, barras y paleta", () => {
	it("brand y gray traen la paleta de Tailwind y la muestra elegida queda marcada", async () => {
		const onChange = vi.fn();
		render(
			<ColorPicker
				type="brand"
				source="Tailwind CSS v4.2"
				onReset={() => {}}
				docsHref="/docs/"
				onChange={onChange}
			/>,
		);
		const group = screen.getByRole("group", { name: "Marca" });
		expect(within(group).getAllByRole("button")).toHaveLength(16);
		await userEvent.click(within(group).getByRole("button", { name: "#16A34A" }));
		expect(onChange).toHaveBeenLastCalledWith("#16a34a", 1);
		expect(within(group).getByRole("button", { name: "#16A34A" }).getAttribute("aria-pressed")).toBe(
			"true",
		);
		expect(screen.getByText("Tailwind CSS v4.2")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Documentación" }).getAttribute("href")).toBe("/docs/");
	});

	it("saved-md con onAddSwatch guarda el color actual", async () => {
		const onAddSwatch = vi.fn();
		render(<ColorPicker type="saved-md" defaultValue="#171717" onAddSwatch={onAddSwatch} />);
		await userEvent.click(screen.getByRole("button", { name: "Añadir" }));
		expect(onAddSwatch).toHaveBeenCalledWith("#171717");
	});

	it("hue-slider y transparency-slider son una barra con nombre y el porcentaje", () => {
		render(<ColorPicker type="hue-slider" />);
		expect(screen.getByRole("slider", { name: "Tono" })).toBeTruthy();
		render(<ColorPicker type="transparency-slider" defaultAlpha={0.5} />);
		expect(screen.getByRole("slider", { name: "Opacidad" })).toBeTruthy();
		expect(screen.getByText("50%")).toBeTruthy();
	});

	it("la paleta es un grupo de radio que se recorre con las flechas", async () => {
		const onChange = vi.fn();
		render(<ColorPicker type="palette" onChange={onChange} />);
		const grid = screen.getByRole("radiogroup", { name: "Paleta" });
		const radios = within(grid).getAllByRole("radio");
		expect(radios).toHaveLength(18 * 11);
		// Una sola parada de tabulación
		expect(radios.filter((r) => r.tabIndex === 0)).toHaveLength(1);
		await userEvent.click(radios[0] as HTMLElement);
		expect(onChange).toHaveBeenCalledTimes(1);
		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(radios[1]);
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(radios[19]);
		await userEvent.keyboard("{Enter}");
		expect((radios[19] as HTMLElement).getAttribute("aria-checked")).toBe("true");
	});

	it("con onClose el panel de pestañas lleva la X", async () => {
		const onClose = vi.fn();
		render(<ColorPicker type="solid" onClose={onClose} />);
		await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
		expect(onClose).toHaveBeenCalled();
	});

	it.each<ColorPickerType>([
		"solid",
		"gradient",
		"image",
		"swatch",
		"saved-sm",
		"saved-md",
		"brand",
		"gray",
		"minimal",
		"hue-slider",
		"transparency-slider",
		"palette",
	])("%s es accesible en claro y oscuro", async (type) => {
		await expectAccessibleInThemes(
			<ColorPicker
				type={type}
				swatches={["#4f39f6", "#00a63e"]}
				onAddSwatch={() => {}}
				onClose={() => {}}
			/>,
		);
	});
});
