import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button, CodeSnippet, CopyTooltip, useCopy } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

// jsdom no tiene CSS ni layout: la posición exacta y el color se miran en Playwright (e2e de la web). Aquí, qué dice la
// burbuja, cuándo sale y se va, hacia dónde va y que lo copiado llega al portapapeles.

function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
	const copy = useCopy();
	return <Button onClick={(e) => void copy(value, e.currentTarget)}>{label}</Button>;
}

const bubble = () => document.querySelector("[data-copy-tooltip]") as HTMLElement;

let writeText: ReturnType<typeof vi.fn>;
beforeEach(() => {
	vi.useFakeTimers();
	writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});
afterEach(() => {
	vi.useRealTimers();
});

/** Pulsa y deja que se resuelvan la copia y el aviso. */
async function press(name: string) {
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name }));
	});
}

describe("CopyTooltip", () => {
	it("copia el valor y dice solo «Copiado», como un role=status", async () => {
		render(
			<>
				<CopyButton value="bg-brand-solid" />
				<CopyTooltip />
			</>,
		);
		expect(bubble().textContent).toBe("");
		await press("Copiar");
		expect(writeText).toHaveBeenCalledExactlyOnceWith("bg-brand-solid");
		const status = bubble();
		expect(status.getAttribute("role")).toBe("status");
		expect(status.getAttribute("aria-live")).toBe("polite");
		expect(status.textContent).toBe("Copiado");
	});

	it("con un valor largo sigue diciendo solo «Copiado»", async () => {
		const long = "var(--utility-brand-700-con-un-nombre-larguisimo-de-sesenta-caracteres)";
		expect(long.length).toBeGreaterThan(60);
		render(
			<>
				<CopyButton value={long} />
				<CopyTooltip />
			</>,
		);
		await press("Copiar");
		expect(writeText).toHaveBeenCalledWith(long);
		expect(bubble().textContent).toBe("Copiado");
		expect(bubble().textContent).not.toContain("var(");
	});

	it("se va sola a los 1,5 s, o cuando se le dice", async () => {
		const { rerender } = render(
			<>
				<CopyButton value="x" />
				<CopyTooltip />
			</>,
		);
		await press("Copiar");
		expect(bubble().textContent).toBe("Copiado");
		act(() => {
			vi.advanceTimersByTime(1400);
		});
		expect(bubble().textContent).toBe("Copiado");
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(bubble().textContent).toBe("");
		rerender(
			<>
				<CopyButton value="x" />
				<CopyTooltip duration={300} />
			</>,
		);
		await press("Copiar");
		act(() => {
			vi.advanceTimersByTime(350);
		});
		expect(bubble().textContent).toBe("");
	});

	it("va encima del elemento y, si no cabe arriba, debajo", async () => {
		render(
			<>
				<CopyButton value="x" />
				<CopyTooltip />
			</>,
		);
		const button = screen.getByRole("button", { name: "Copiar" });
		const at = (top: number) =>
			vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
				top,
				bottom: top + 36,
				left: 200,
				right: 260,
				width: 60,
				height: 36,
				x: 200,
				y: top,
				toJSON: () => ({}),
			} as DOMRect);
		at(300);
		await press("Copiar");
		expect(bubble().style.transform).toBe("translate(-50%, -100%)");
		expect(bubble().style.top).toBe("290px");
		expect(bubble().firstElementChild?.className).toContain("after:top-full");
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		at(10);
		await press("Copiar");
		expect(bubble().style.transform).toBe("translate(-50%, 0)");
		expect(bubble().style.top).toBe("56px"); // el borde de abajo (46) más el hueco de 10
		expect(bubble().firstElementChild?.className).toContain("after:bottom-full");
	});

	it("si el portapapeles falla, lo dice y cómo seguir", async () => {
		writeText.mockRejectedValue(new Error("denegado"));
		render(
			<>
				<CopyButton value="x" />
				<CopyTooltip />
			</>,
		);
		await press("Copiar");
		expect(bubble().textContent).toBe("No se pudo copiar: selecciónalo a mano");
	});

	it("con onCopyError, el fallo lo avisa quien la pasa y no sale la burbuja", async () => {
		writeText.mockRejectedValue(new Error("denegado"));
		const onCopyError = vi.fn();
		render(
			<>
				<CopyButton value="x" />
				<CopyTooltip onCopyError={onCopyError} />
			</>,
		);
		await press("Copiar");
		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(bubble().textContent).toBe("");
	});

	it("los textos se pueden sustituir", async () => {
		render(
			<>
				<CopyButton value="x" />
				<CopyTooltip labels={{ copied: "Copied" }} />
			</>,
		);
		await press("Copiar");
		expect(bubble().textContent).toBe("Copied");
	});

	it("con copyAttribute, pulsar HTML estático que lo lleva copia su valor y avisa junto a él", async () => {
		render(
			<>
				<main>
					<button type="button" data-copy="var(--bg-primary)">
						<span>Copiar variable</span>
					</button>
					<button type="button">Sin atributo</button>
				</main>
				<CopyTooltip copyAttribute="data-copy" />
			</>,
		);
		// Pulsar un hijo del elemento con el atributo también vale
		await act(async () => {
			fireEvent.click(screen.getByText("Copiar variable"));
		});
		expect(writeText).toHaveBeenCalledExactlyOnceWith("var(--bg-primary)");
		expect(bubble().textContent).toBe("Copiado");
		// Y uno sin el atributo no copia nada
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Sin atributo" }));
		});
		expect(writeText).toHaveBeenCalledOnce();
	});

	it("sin copyAttribute no escucha los clics del documento", async () => {
		render(
			<>
				<button type="button" data-copy="x">
					Estático
				</button>
				<CopyTooltip />
			</>,
		);
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Estático" }));
		});
		expect(writeText).not.toHaveBeenCalled();
		expect(bubble().textContent).toBe("");
	});

	it("CodeSnippet conserva su propia confirmación y no saca la burbuja", async () => {
		render(
			<>
				<CodeSnippet code="const a = 1;" language="ts" />
				<CopyTooltip copyAttribute="data-copy" />
			</>,
		);
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
		});
		expect(writeText).toHaveBeenCalledWith("const a = 1;");
		// Su ✓ y su «Copiado», como siempre
		expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();
		// Y la burbuja, vacía
		expect(bubble().textContent).toBe("");
	});

	it("con varios CopyTooltip montados sale una sola burbuja", async () => {
		render(
			<>
				<CopyButton value="x" />
				<CopyTooltip />
				<CopyTooltip />
			</>,
		);
		await press("Copiar");
		const texts = [...document.querySelectorAll("[data-copy-tooltip]")].map((el) => el.textContent);
		expect(texts.filter((t) => t === "Copiado")).toHaveLength(1);
		expect(texts.filter((t) => t === "")).toHaveLength(1);
	});

	it("se pinta en el servidor: un role=status vacío, sin JavaScript", () => {
		const html = renderToString(<CopyTooltip copyAttribute="data-copy" />);
		expect(html).toContain('role="status"');
		expect(html).toContain('aria-live="polite"');
		expect(html).not.toContain("Copiado");
	});

	it("axe en claro y oscuro", async () => {
		// axe espera con temporizadores de verdad
		vi.useRealTimers();
		await expectAccessibleInThemes(
			<>
				<CopyButton value="x" />
				<CopyTooltip />
			</>,
		);
	});
});
