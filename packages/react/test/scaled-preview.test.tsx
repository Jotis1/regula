import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, ScaledPreview } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

/** Caja exterior y capa interior de un ScaledPreview ya pintado. */
function parts(container: HTMLElement) {
	const outer = container.firstElementChild as HTMLElement;
	return { outer, inner: outer.firstElementChild as HTMLElement };
}

describe("ScaledPreview", () => {
	it("cabe sin escala dada: 1920 en una caja de 360×202 da 0,1875 y nada sale de la caja", () => {
		const { container } = render(
			<ScaledPreview width={1920} box={[360, 202]}>
				<p>Escena</p>
			</ScaledPreview>,
		);
		const { outer, inner } = parts(container);
		expect(outer.style.width).toBe("360px");
		expect(outer.style.height).toBe("202px");
		expect(outer.className).toContain("overflow-hidden");
		expect(inner.style.width).toBe("1920px");
		expect(inner.style.transform).toBe("scale(0.1875)");
		expect(inner.className).toContain("origin-top-left");
	});

	it("con la escala dada usa esa, y lo que no cabe queda recortado por la caja", () => {
		const { container } = render(
			<ScaledPreview width={400} box={[300, 120]} scale={0.5}>
				<p>Contenido</p>
			</ScaledPreview>,
		);
		const { outer, inner } = parts(container);
		expect(inner.style.width).toBe("400px");
		expect(inner.style.transform).toBe("scale(0.5)");
		expect(outer.style.width).toBe("300px");
		expect(outer.style.height).toBe("120px");
		expect(outer.className).toContain("overflow-hidden");
	});

	it("con contentHeight cuida también el alto: gana la escala menor", () => {
		// Ancho: 360 / 1920 = 0,1875. Alto: 100 / 1080 = 0,0926, que es menor
		const { container } = render(
			<ScaledPreview width={1920} contentHeight={1080} box={[360, 100]}>
				x
			</ScaledPreview>,
		);
		expect(Number.parseFloat(parts(container).inner.style.transform.replace("scale(", ""))).toBeCloseTo(
			100 / 1080,
			4,
		);
		// Y si el alto sobra, manda el ancho
		const { container: wide } = render(
			<ScaledPreview width={1920} contentHeight={1080} box={[360, 400]}>
				x
			</ScaledPreview>,
		);
		expect(parts(wide).inner.style.transform).toBe("scale(0.1875)");
	});

	it("no amplía: un contenido más estrecho que la caja se queda a escala 1", () => {
		const { container } = render(
			<ScaledPreview width={200} box={[360, 100]}>
				x
			</ScaledPreview>,
		);
		expect(parts(container).inner.style.transform).toBe("scale(1)");
	});

	it("el contenido sigue siendo el real y el className del consumidor se suma", () => {
		const { container } = render(
			<ScaledPreview width={800} box={[400, 200]} className="rounded-lg">
				<Button>Grabar</Button>
			</ScaledPreview>,
		);
		expect(screen.getByRole("button", { name: "Grabar" })).toBeTruthy();
		expect(parts(container).outer.className).toContain("rounded-lg");
	});

	it("se pinta en el servidor, sin JavaScript y sin medir nada", () => {
		const html = renderToString(
			<ScaledPreview width={1920} box={[360, 202]}>
				<i>escena</i>
			</ScaledPreview>,
		);
		expect(html).toContain("transform:scale(0.1875)");
		expect(html).toContain("<i>escena</i>");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ScaledPreview width={800} box={[400, 100]}>
				<Button>Grabar</Button>
			</ScaledPreview>,
		);
	});
});
