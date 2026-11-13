// El inspector del ejemplo interactivo (design D3 de redesign-docs-site-v2): grupos, filtro, props cambiadas, atajos y
// las líneas del código que se marcan. Lo que pinta la isla sale de `src/lib/playground-inspector.ts`.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	codeOf,
	controlsOf,
	initialState,
	type Playground,
	propsFor,
	STARTS,
	type Start,
	type State,
	type Tweak,
} from "../src/lib/playground";
import {
	changedProps,
	changeLabel,
	DEFAULT_GROUP,
	filterGroups,
	groupsOf,
	highlightOf,
	MANY_CONTROLS,
	REST_GROUP,
	reasonText,
	resetProp,
	shortcutHolds,
	shortcutState,
} from "../src/lib/playground-inspector";
import { propsOf } from "../src/lib/props";
import { ATAJOS } from "../src/lib/starts/atajos";
import { GRUPOS } from "../src/lib/starts/grupos";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const dir = join(root, "apps/docs/src/content/components");
const pages = new Map(
	readdirSync(dir).map((f) => {
		const md = readFileSync(join(dir, f), "utf8");
		const field = (k: string) => md.match(new RegExp(`^${k}: "?([^"\\n]+)"?$`, "m"))?.[1];
		return [
			field("name") as string,
			{ interactive: field("interactive") === "true", source: field("source") },
		] as const;
	}),
);

const built = new Map<string, Playground>();
/** El ejemplo de un componente como lo arma la isla: con los ajustes del punto de partida y los de su módulo. */
async function playgroundFor(name: string): Promise<Playground> {
	let pg = built.get(name);
	if (!pg) {
		const rows = propsOf(
			join(root, pages.get(name)?.source ?? `packages/react/src/components/${name}.tsx`),
			name,
		);
		const start = STARTS[name] as Start;
		const mod = (await import(`../src/playground/${name}.tsx`)) as { tweaks?: Record<string, Tweak> };
		pg = {
			name,
			start,
			controls: controlsOf(rows, { ...start.tweaks, ...mod.tweaks }, start.props, start.children),
			interactive: pages.get(name)?.interactive ?? false,
			dark: false,
		};
		built.set(name, pg);
	}
	return pg;
}

describe("grupos del inspector", () => {
	it("sin `groups`, un solo grupo «Propiedades» con todos los controles", async () => {
		const pg = await playgroundFor("Kbd");
		expect(pg.start.groups).toBeUndefined();
		expect(groupsOf(pg)).toEqual([{ name: DEFAULT_GROUP, controls: pg.controls }]);
	});

	it("Button, Input y Table traen sus grupos, con «Lo esencial» el primero", async () => {
		for (const name of ["Button", "Input", "Table"]) {
			const groups = groupsOf(await playgroundFor(name));
			expect(groups.length, name).toBeGreaterThan(1);
			expect(groups[0]?.name, name).toBe("Lo esencial");
		}
		expect(groupsOf(await playgroundFor("Button")).map((g) => g.controls.map((c) => c.prop))).toEqual([
			["children", "hierarchy", "size"],
			["iconLeading", "iconTrailing", "iconOnly", "label"],
			["destructive", "loading"],
		]);
	});

	it("un control que ningún grupo nombra va a «Más props», al final", () => {
		const pg = {
			start: { groups: [{ name: "Lo esencial", props: ["size"] }] },
			controls: [
				{ kind: "toggle" as const, prop: "loading", default: false },
				{ kind: "choice" as const, prop: "size", values: ["sm", "md"] },
			],
		};
		expect(groupsOf(pg).map((g) => [g.name, g.controls.map((c) => c.prop)])).toEqual([
			["Lo esencial", ["size"]],
			[REST_GROUP, ["loading"]],
		]);
	});

	it("los grupos nombran controles que existen, sin repetir ninguno y sin dejar ninguno fuera", async () => {
		const problems: string[] = [];
		for (const name of Object.keys(STARTS)) {
			const pg = await playgroundFor(name);
			if (!pg.start.groups) continue;
			const controls = new Set(pg.controls.map((c) => c.prop));
			const seen = new Set<string>();
			for (const group of pg.start.groups)
				for (const prop of group.props) {
					if (!controls.has(prop))
						problems.push(`${name}: «${group.name}» nombra «${prop}», que no tiene control`);
					if (seen.has(prop)) problems.push(`${name}: «${prop}» está en dos grupos`);
					seen.add(prop);
				}
			for (const prop of controls)
				if (!seen.has(prop)) problems.push(`${name}: «${prop}» no está en ningún grupo`);
		}
		for (const name of Object.keys(GRUPOS))
			if (!(name in STARTS)) problems.push(`${name}: tiene grupos pero no punto de partida`);
		expect(problems).toEqual([]);
	}, 180_000);

	it(`avisa de los componentes con más de ${MANY_CONTROLS} controles sin grupos`, async () => {
		const without: string[] = [];
		for (const name of Object.keys(STARTS)) {
			const pg = await playgroundFor(name);
			if (pg.controls.length > MANY_CONTROLS && !pg.start.groups?.length)
				without.push(`${name} (${pg.controls.length} controles)`);
		}
		// Todos los que pasan de doce tienen grupos: si entra uno nuevo sin ellos, se decide aquí
		expect(without, "añade sus grupos en src/lib/starts/grupos.ts").toEqual([]);
	}, 180_000);

	it("Input pasa de doce controles y el filtro «label» deja solo los que lo llevan en el nombre", async () => {
		const pg = await playgroundFor("Input");
		expect(pg.controls.length).toBeGreaterThan(MANY_CONTROLS);
		const filtered = filterGroups(groupsOf(pg), " Label ");
		const props = filtered.flatMap((g) => g.controls.map((c) => c.prop));
		expect(props.length).toBeGreaterThan(1);
		expect(props).toContain("label");
		expect(props).toContain("labelAside");
		for (const prop of props) expect(prop.toLowerCase()).toContain("label");
		// Los grupos sin coincidencias no salen
		for (const group of filtered) expect(group.controls.length).toBeGreaterThan(0);
		expect(filterGroups(groupsOf(pg), "")).toEqual(groupsOf(pg));
		expect(filterGroups(groupsOf(pg), "zzz")).toEqual([]);
	});
});

describe("cambios a la vista", () => {
	it("nada cambiado de partida, en ningún componente", async () => {
		for (const name of Object.keys(STARTS)) {
			const pg = await playgroundFor(name);
			expect(changedProps(pg, initialState(pg)), name).toEqual([]);
		}
	}, 180_000);

	it("Input: `size` e `icon` cambiadas, con su forma en código y sus líneas marcadas", async () => {
		const pg = await playgroundFor("Input");
		const state: State = { ...initialState(pg), size: "lg", icon: "Mail01" };
		expect(changedProps(pg, state)).toEqual(["size", "icon"]);
		expect(changeLabel(pg, state, "size")).toBe('size="lg"');
		expect(changeLabel(pg, state, "icon")).toBe("icon={Mail01}");
		const code = codeOf(pg, state);
		const lines = code.next.split("\n");
		const marked = highlightOf(code.lines.next, changedProps(pg, state));
		expect(marked.length).toBeGreaterThan(0);
		// Las líneas marcadas son las que escriben esas props, y ninguna otra las escribe
		const text = marked.map((n) => lines[n - 1]).join("\n");
		expect(text).toContain('size="lg"');
		expect(text).toContain("icon={Mail01}");
		// En Astro, lo mismo, tres líneas más abajo si el JSX va en varias (el frontmatter)
		const astro = code.astro.split("\n");
		const astroText = highlightOf(code.lines.astro, ["size"])
			.map((n) => astro[n - 1])
			.join("\n");
		expect(astroText).toContain('size="lg"');
		// Restablecer una la quita de la lista y del código
		const back = resetProp(pg, state, "size");
		expect(changedProps(pg, back)).toEqual(["icon"]);
		expect(codeOf(pg, back).next).not.toContain("size=");
	});

	it("cada prop va en su línea cuando el JSX se parte, también las de varias líneas", () => {
		const pg: Playground = {
			name: "ButtonGroup",
			start: { props: { "aria-label": "Vista de los movimientos del mes" } },
			controls: [
				{ kind: "choice", prop: "size", values: ["sm", "md"], default: "md" },
				{
					kind: "content",
					prop: "items",
					options: [{ label: "Tres", value: [1, 2, 3], code: "[\n\t1,\n\t2,\n\t3,\n]" }],
				},
			],
			interactive: false,
			dark: false,
		};
		const state: State = { size: "sm", items: "Tres" };
		const code = codeOf(pg, state);
		const lines = code.next.split("\n");
		expect(code.lines.next.size?.map((n) => lines[n - 1]?.trim())).toEqual(['size="sm"']);
		const items = code.lines.next.items ?? [];
		expect(items.length).toBe(5);
		expect(lines[(items[0] as number) - 1]?.trim()).toBe("items={[");
		expect(lines[(items[4] as number) - 1]?.trim()).toBe("]}");
		expect(changeLabel(pg, state, "items")).toBe("items={[ 1, 2, 3, ]}");
	});

	it("una prop desactivada por una regla no cuenta como cambiada", async () => {
		const pg = await playgroundFor("Button");
		const state: State = { ...initialState(pg), iconLeading: "Plus", iconOnly: "Plus" };
		expect(changedProps(pg, state)).toEqual(["iconOnly"]);
		expect(reasonText("Un botón de solo icono no lleva texto ni iconos a los lados.")).toBe(
			"No aplica: un botón de solo icono no lleva texto ni iconos a los lados.",
		);
	});

	it("el texto entre las etiquetas y los textos vaciados se dicen como son", async () => {
		const pg = await playgroundFor("Button");
		const state: State = { ...initialState(pg), children: "Guardar", loading: true };
		expect(changedProps(pg, state)).toEqual(["children", "loading"]);
		expect(changeLabel(pg, state, "children")).toBe("children: Guardar");
		expect(changeLabel(pg, state, "loading")).toBe("loading");
		expect(codeOf(pg, state).next).toContain("<Button loading>Guardar</Button>");
		const input = await playgroundFor("Input");
		const empty: State = { ...initialState(input), label: undefined };
		expect(changeLabel(input, empty, "label")).toBe("sin label");
		expect(propsFor(input, empty)).not.toHaveProperty("label");
	});
});

describe("atajos", () => {
	it("el fichero generado está al día con test/fixtures/figma-types.json", () => {
		const types: Record<string, unknown[]> = JSON.parse(
			readFileSync(join(import.meta.dirname, "fixtures/figma-types.json"), "utf8"),
		);
		const expected = Object.fromEntries(Object.entries(types).filter(([, list]) => list.length > 1));
		// Si falla: bun run scripts/generate-shortcuts.ts && bunx biome format --write src/lib/starts/atajos.ts
		expect(ATAJOS).toEqual(expected);
	});

	it("cada componente con más de un tipo del Figma lleva sus atajos en el arranque", () => {
		for (const [name, shortcuts] of Object.entries(ATAJOS)) {
			expect(shortcuts.length, name).toBeGreaterThan(1);
			expect(STARTS[name]?.shortcuts, name).toBe(shortcuts);
		}
	});

	it("Input → «Tarjeta de pago» pone `type` en `card` sobre los valores de partida y queda elegido", async () => {
		const pg = await playgroundFor("Input");
		const card = pg.start.shortcuts?.find((s) => s.label === "Tarjeta de pago");
		if (!card) throw new Error("Input debería tener el atajo «Tarjeta de pago»");
		// Sobre los valores por defecto, no sobre los actuales: el `size` que había se pierde
		const state = shortcutState(pg, card);
		expect(state.type).toBe("card");
		expect(state.size).toBe(initialState(pg).size);
		expect(propsFor(pg, state)).toMatchObject({
			type: "card",
			label: "Tarjeta",
			placeholder: "1234 1234 1234 1234",
		});
		expect(shortcutHolds(pg, state, card)).toBe(true);
		// Cambiar otra prop no lo quita; cambiar una de las suyas, sí
		expect(shortcutHolds(pg, { ...state, size: "lg" }, card)).toBe(true);
		expect(shortcutHolds(pg, { ...state, type: "email" }, card)).toBe(false);
		// Lo que puso el atajo cuenta como cambiado, también lo que no tiene control (`placeholder`)
		expect(changedProps(pg, state)).toEqual(["type", "label", "placeholder"]);
		expect(changedProps(pg, resetProp(pg, state, "placeholder"))).toEqual(["type", "label"]);
	});

	it("un atajo que vacía una prop sin control la quita del punto de partida", async () => {
		const pg = await playgroundFor("Input");
		const file = pg.start.shortcuts?.find((s) => s.label === "Archivo");
		if (!file) throw new Error("Input debería tener el atajo «Archivo»");
		expect(propsFor(pg, shortcutState(pg, file))).not.toHaveProperty("placeholder");
	});
});
