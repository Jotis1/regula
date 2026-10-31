import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, EmptyState } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

// Textos de la vista previa de la guía
const example = (
	<EmptyState
		icon="search-lg"
		title="Sin resultados"
		description="Ningún movimiento coincide con «León». Prueba con otro término o quita filtros."
		actions={
			<>
				<Button hierarchy="secondary">Limpiar búsqueda</Button>
				<Button iconLeading="plus">Nuevo movimiento</Button>
			</>
		}
	/>
);

describe("EmptyState", () => {
	it("título, descripción de 352px como máximo, icono modern gris y acciones centradas", () => {
		const { container } = render(example);
		const title = screen.getByRole("heading", { level: 3, name: "Sin resultados" });
		expect(title.className).toContain("text-md");
		const desc = screen.getByText(/Ningún movimiento coincide con «León»/);
		for (const c of ["max-w-[352px]", "text-sm", "text-tertiary"]) expect(desc.className).toContain(c);
		const icon = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(icon.className).toContain("size-12");
		expect(screen.getByRole("button", { name: "Nuevo movimiento" }).parentElement?.className).toContain(
			"justify-center",
		);
	});

	it("solo con título: icono de búsqueda por defecto, sin descripción ni acciones", () => {
		const { container } = render(<EmptyState title="Aún no hay gastos" />);
		expect(container.querySelectorAll("p")).toHaveLength(0);
		expect(screen.queryByRole("button")).toBeNull();
		expect(container.querySelector("svg")).toBeTruthy();
	});

	it("se pinta en servidor sin directiva", () => {
		const html = renderToString(example);
		expect(html).toContain("Sin resultados");
		expect(html).toContain("Limpiar búsqueda");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(example);
	});
});
