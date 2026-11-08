import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PaginationDots } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("PaginationDots", () => {
	it("sin onChange es un indicador: «2 de 5» para lectores y sin botones", () => {
		const { container } = render(<PaginationDots total={5} current={2} />);
		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByText("2 de 5").className).toContain("sr-only");
		const marks = container.querySelectorAll("[aria-hidden=true]");
		expect(marks).toHaveLength(5);
		expect(marks[1]?.className).toContain("bg-brand-solid");
		expect(marks[0]?.className).toContain("bg-quaternary");
	});

	it("con onChange, un botón «Ir a la página n de N» por punto, con aria-current en el actual", async () => {
		const onChange = vi.fn();
		render(<PaginationDots total={3} current={2} onChange={onChange} aria-label="Diapositivas" />);
		const group = screen.getByRole("group", { name: "Diapositivas" });
		const buttons = screen.getAllByRole("button");
		expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
			"Ir a la página 1 de 3",
			"Ir a la página 2 de 3",
			"Ir a la página 3 de 3",
		]);
		expect(buttons.map((b) => b.getAttribute("aria-current"))).toEqual([null, "true", null]);
		expect(group.contains(buttons[0] as HTMLElement)).toBe(true);
		await userEvent.click(buttons[2] as HTMLElement);
		expect(onChange).toHaveBeenCalledExactlyOnceWith(3);
	});

	it("dot o line, y md o lg: las medidas del Figma", () => {
		const cls = (props: Parameters<typeof PaginationDots>[0]) => {
			const { container, unmount } = render(<PaginationDots {...props} />);
			const mark = container.querySelector("[aria-hidden=true]")?.className ?? "";
			const gap = container.firstElementChild?.className ?? "";
			unmount();
			return { mark, gap };
		};
		expect(cls({ total: 3, current: 1 }).mark).toContain("size-2");
		expect(cls({ total: 3, current: 1 }).gap).toContain("gap-3");
		expect(cls({ total: 3, current: 1, size: "lg" }).mark).toContain("size-2.5");
		expect(cls({ total: 3, current: 1, size: "lg" }).gap).toContain("gap-4");
		expect(cls({ total: 3, current: 1, variant: "line" }).mark).toContain("h-2 w-11");
		expect(cls({ total: 3, current: 1, variant: "line", size: "lg" }).mark).toContain("h-2.5 w-11");
	});

	it("framed va sobre una píldora blanca", () => {
		const { container, rerender } = render(<PaginationDots total={3} current={1} />);
		expect(container.firstElementChild?.className).not.toContain("bg-primary");
		rerender(<PaginationDots total={3} current={1} framed />);
		expect(container.firstElementChild?.className).toContain("bg-primary");
		expect(container.firstElementChild?.className).toContain("rounded-full");
		rerender(<PaginationDots total={3} current={1} framed size="lg" />);
		expect(container.firstElementChild?.className).toContain("p-3");
	});

	it("la página actual se recorta al rango y los textos se pueden sustituir", () => {
		render(<PaginationDots total={3} current={9} labels={{ pageOf: (n, t) => `Page ${n}/${t}` }} />);
		expect(screen.getByText("Page 3/3")).toBeTruthy();
	});

	it("se pinta en el servidor", () => {
		expect(renderToString(<PaginationDots total={3} current={1} onChange={() => {}} />)).toContain(
			"Ir a la página 1 de 3",
		);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<>
				<PaginationDots total={4} current={2} />
				<PaginationDots total={4} current={2} onChange={() => {}} aria-label="Diapositivas" framed />
			</>,
		);
	});
});
