import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { CommandMenu, type TreeItem, TreeView } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const groups = (onSelect = vi.fn()) => [
	{
		label: "Apps",
		items: [
			{
				icon: "currency-euro" as const,
				label: "Pecunia",
				description: "Gastos e ingresos",
				shortcut: "G P",
			},
			{ icon: "users-01" as const, label: "Vinculum", description: "Contactos" },
			{ icon: "file-04" as const, label: "Ornatus", description: "Lector Markdown", onSelect },
		],
	},
	{
		label: "Acciones",
		items: [
			{ icon: "plus" as const, label: "Nuevo gasto", shortcut: "⌘N" },
			{ icon: "moon-01" as const, label: "Cambiar a modo oscuro", keywords: "tema noche" },
		],
	},
];

function Opener() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Abrir
			</button>
			<CommandMenu open={open} onClose={() => setOpen(false)} groups={groups()} />
		</>
	);
}

const active = () => {
	const box = screen.getByRole("combobox");
	const id = box.getAttribute("aria-activedescendant");
	return id ? document.getElementById(id) : null;
};

/** CommandMenu con resultados de otra fuente, que no contienen lo escrito en su etiqueta. */
function Remote({ seen, onSelect }: { seen: string[]; onSelect: () => void }) {
	const [q, setQ] = useState("");
	const items = q ? [{ label: `Resultado para ${q.length} letras`, onSelect }] : [];
	return (
		<CommandMenu
			contained
			filter={false}
			onQueryChange={(v) => {
				seen.push(v);
				setQ(v);
			}}
			groups={[{ label: "Índice", items }]}
		/>
	);
}

describe("CommandMenu", () => {
	it("el buscador recibe el foco; el primero está activo; flechas con vuelta y Enter ejecuta y cierra", async () => {
		const onSelect = vi.fn();
		const onClose = vi.fn();
		render(<CommandMenu groups={groups(onSelect)} onClose={onClose} />);
		const box = screen.getByRole("combobox", { name: "Buscar comandos" });
		expect(screen.getByRole("dialog", { name: "Menú de comandos" })).toBeTruthy();
		await waitFor(() => expect(document.activeElement).toBe(box));
		expect(box.getAttribute("placeholder")).toBe("Busca o escribe un comando");
		expect(active()?.textContent).toContain("Pecunia");
		expect(active()?.getAttribute("aria-selected")).toBe("true");
		await userEvent.keyboard("{ArrowUp}");
		expect(active()?.textContent).toContain("Cambiar a modo oscuro");
		await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
		expect(active()?.textContent).toContain("Ornatus");
		await userEvent.keyboard("{Enter}");
		expect(onSelect).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("filtra por etiqueta, descripción y keywords; quita los grupos vacíos", async () => {
		render(<CommandMenu groups={groups()} />);
		const box = screen.getByRole("combobox");
		await userEvent.type(box, "contac");
		expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["VinculumContactos"]);
		expect(screen.queryByRole("group", { name: "Acciones" })).toBeNull();
		await userEvent.clear(box);
		await userEvent.type(box, "  NOCHE ");
		expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Cambiar a modo oscuro"]);
		expect(active()?.textContent).toBe("Cambiar a modo oscuro");
		expect(screen.getByRole("group", { name: "Acciones" })).toBeTruthy();
	});

	it("estado vacío con texto sustituible y sin lista", async () => {
		render(<CommandMenu groups={groups()} emptyText="Prueba con «gasto»." />);
		await userEvent.type(screen.getByRole("combobox"), "zzz");
		expect(screen.queryByRole("listbox")).toBeNull();
		const status = screen.getByRole("status");
		expect(status.textContent).toContain("Sin resultados");
		expect(status.textContent).toContain("Prueba con «gasto».");
		expect(screen.getByRole("combobox").getAttribute("aria-activedescendant")).toBeNull();
		await userEvent.keyboard("{Enter}");
	});

	it("clic en una opción la ejecuta; el ratón mueve la activa", async () => {
		const onSelect = vi.fn();
		render(<CommandMenu groups={groups(onSelect)} />);
		const ornatus = screen.getByRole("option", { name: /Ornatus/ });
		await userEvent.hover(ornatus);
		expect(ornatus.getAttribute("aria-selected")).toBe("true");
		await userEvent.click(ornatus);
		expect(onSelect).toHaveBeenCalledOnce();
	});

	it("modal: Escape cierra y el foco vuelve a quien lo abrió", async () => {
		render(<Opener />);
		const opener = screen.getByRole("button", { name: "Abrir" });
		await userEvent.click(opener);
		await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("combobox")));
		// El foco no sale del diálogo
		await userEvent.tab();
		expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
		await userEvent.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).toBeNull();
		await waitFor(() => expect(document.activeElement).toBe(opener));
	});

	it("contained: sin llevarse el foco; Escape y clic en el fondo cierran; open=false no pinta nada", async () => {
		const onClose = vi.fn();
		const { rerender, container } = render(
			<div style={{ position: "relative" }}>
				<CommandMenu contained autoFocus={false} onClose={onClose} groups={groups()} />
			</div>,
		);
		expect(document.activeElement).toBe(document.body);
		const overlay = container.firstElementChild?.firstElementChild as HTMLElement;
		expect(overlay.className).toContain("absolute");
		expect(overlay.className).toContain("bg-overlay/70");
		await userEvent.click(overlay);
		expect(onClose).toHaveBeenCalledTimes(1);
		screen.getByRole("combobox").focus();
		await userEvent.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(2);
		rerender(<CommandMenu open={false} groups={groups()} />);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("axe en claro y oscuro (contained, con lista y vacío)", async () => {
		await expectAccessibleInThemes(
			<div style={{ position: "relative" }}>
				<CommandMenu contained autoFocus={false} groups={groups()} />
			</div>,
		);
		await expectAccessibleInThemes(
			<div style={{ position: "relative" }}>
				<CommandMenu contained autoFocus={false} groups={[]} />
			</div>,
		);
	});

	it("onQueryChange y filter={false}: la app filtra y los grupos se pintan tal cual", async () => {
		const seen: string[] = [];
		const onSelect = vi.fn();
		render(<Remote seen={seen} onSelect={onSelect} />);
		await userEvent.type(screen.getByRole("combobox"), "mod");
		expect(seen).toEqual(["m", "mo", "mod"]);
		expect(screen.getByRole("option", { name: "Resultado para 3 letras" })).toBeTruthy();
		await userEvent.keyboard("{Enter}");
		expect(onSelect).toHaveBeenCalledOnce();
	});
});

const tree: TreeItem[] = [
	{
		id: "notas",
		label: "Notas",
		children: [
			{
				id: "trabajo",
				label: "Trabajo",
				children: [
					{ id: "roadmap", label: "roadmap.md" },
					{ id: "pentest", label: "pentest.md" },
				],
			},
			{ id: "leeme", label: "LEEME.md", meta: "2 KB" },
		],
	},
	{ id: "arch", label: "Archivo", icon: "inbox-01" },
];

const row = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

describe("TreeView", () => {
	it("abre las carpetas iniciales, marca la seleccionada y dibuja una guía por nivel", () => {
		render(
			<TreeView
				aria-label="Documentos"
				items={tree}
				defaultOpen={["notas", "trabajo"]}
				defaultSelected="roadmap"
			/>,
		);
		expect(screen.getByRole("treegrid", { name: "Documentos" })).toBeTruthy();
		const roadmap = row("roadmap.md");
		expect(roadmap.getAttribute("aria-selected")).toBe("true");
		expect(roadmap.getAttribute("aria-level")).toBe("3");
		expect(roadmap.style.paddingLeft).toBe("56px");
		expect(roadmap.querySelectorAll("i")).toHaveLength(2);
		expect(row("Notas").getAttribute("aria-expanded")).toBe("true");
		expect(row("LEEME").textContent).toContain("2 KB");
		expect(roadmap.className).toContain("data-selected:bg-secondary_hover");
	});

	it("clic elige y abre o cierra la carpeta, también si ya estaba elegida", async () => {
		const onSelect = vi.fn();
		render(<TreeView aria-label="Documentos" items={tree} onSelect={onSelect} />);
		expect(screen.queryByRole("row", { name: /Trabajo/ })).toBeNull();
		await userEvent.click(row("Notas"));
		expect(onSelect).toHaveBeenLastCalledWith(tree[0]);
		expect(row("Notas").getAttribute("aria-selected")).toBe("true");
		expect(row("Notas").getAttribute("aria-expanded")).toBe("true");
		await userEvent.click(row("Notas"));
		expect(row("Notas").getAttribute("aria-expanded")).toBe("false");
		expect(row("Notas").getAttribute("aria-selected")).toBe("true");
	});

	it("teclado: flechas mueven el foco sin elegir, → ← abren y cierran, Enter elige y espacio también", async () => {
		const onSelect = vi.fn();
		render(<TreeView aria-label="Documentos" items={tree} onSelect={onSelect} />);
		await userEvent.tab();
		expect(document.activeElement).toBe(row("Notas"));
		await userEvent.keyboard("{ArrowRight}");
		expect(row("Notas").getAttribute("aria-expanded")).toBe("true");
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(row("Trabajo"));
		expect(onSelect).not.toHaveBeenCalled();
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(row("LEEME"));
		await userEvent.keyboard("{Enter}");
		expect(onSelect).toHaveBeenLastCalledWith(tree[0]?.children?.[1]);
		await userEvent.keyboard("{ArrowUp} ");
		expect(row("Trabajo").getAttribute("aria-selected")).toBe("true");
		expect(onSelect).toHaveBeenCalledTimes(2);
		await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
		expect(document.activeElement).toBe(row("Notas"));
	});

	it("controlado: selected manda", async () => {
		const onSelect = vi.fn();
		render(<TreeView aria-label="Documentos" items={tree} selected="arch" onSelect={onSelect} />);
		await userEvent.click(row("Notas"));
		expect(onSelect).toHaveBeenCalledWith(tree[0]);
		expect(row("Archivo").getAttribute("aria-selected")).toBe("true");
		expect(row("Notas").getAttribute("aria-selected")).toBe("false");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<TreeView
				aria-label="Documentos"
				items={tree}
				defaultOpen={["notas", "trabajo"]}
				defaultSelected="roadmap"
			/>,
		);
	});
});
