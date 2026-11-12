// Isla del playground (design §4, Button.dc.html «Ejemplo interactivo»): pinta el componente con las props del
// punto de partida y de los controles, y su código para Next.js y Astro. Recibe solo JSON (src/lib/playground.ts).
//
// Arriba van los controles: un desplegable por cada prop con valores cerrados (tamaños, variantes…) y un
// interruptor por cada booleano. Debajo, la vista previa, y aparte, separado, el código.
import { BackgroundPattern, CodeSnippet, NumberInput, Select, Toggle } from "@jotis-me/react";
import { type ComponentType, type ReactNode, Suspense, use, useState } from "react";
import {
	childrenOf,
	codeOf,
	controlsOf,
	type Playground as Data,
	disabledProps,
	initialState,
	propsFor,
	type State,
	type Tweak,
} from "../lib/playground";
import { PLAYGROUND_ICON_NAMES, PLAYGROUND_ICONS, resolveIcons } from "../lib/playground-icons";

/** Lo que exporta el fichero de un componente (src/playground/): el componente y, si los tiene, sus ajustes de cliente. */
interface PlaygroundModule {
	default: ComponentType<Record<string, unknown>>;
	tweaks?: Record<string, Tweak>;
}

// Un fichero por componente: cada página carga solo el suyo (design D4). El servidor espera a la carga y pinta lo mismo.
const modules = import.meta.glob<PlaygroundModule>("../playground/*.tsx");
const cache = new Map<string, Promise<PlaygroundModule>>();
function load(name: string): Promise<PlaygroundModule> {
	let promise = cache.get(name);
	if (!promise) {
		const loader = modules[`../playground/${name}.tsx`];
		promise = loader ? loader() : Promise.reject(new Error(`Falta src/playground/${name}.tsx`));
		cache.set(name, promise);
	}
	return promise;
}

export default function Playground({ playground, rows }: { playground: Data; rows: PropRow[] }) {
	return (
		<Suspense fallback={null}>
			<Loaded playground={playground} rows={rows} />
		</Suspense>
	);
}

import type { PropRow } from "../lib/props";

function Loaded({ playground: data, rows }: { playground: Data; rows: PropRow[] }) {
	const { default: Component, tweaks } = use(load(data.name));
	// Los ajustes de cliente (contenido preparado, con nodos) no cruzan de Astro: los controles se rehacen con ellos
	const playground = tweaks
		? { ...data, controls: controlsOf(rows, { ...data.start.tweaks, ...tweaks }, data.start.props) }
		: data;
	const [state, setState] = useState(() => initialState(playground));
	const set = (prop: string) => (value: State[string]) => setState((s) => ({ ...s, [prop]: value }));
	const { next, astro } = codeOf(playground, state);
	const off = disabledProps(playground, state);
	// Los iconos viajan como nombre (`"Plus"`) y aquí se resuelven a su componente
	const props = resolveIcons(propsFor(playground, state)) as Record<string, unknown> & {
		children?: ReactNode;
	};
	const toggles = playground.controls.filter((c) => c.kind === "toggle");
	const fields = playground.controls.filter((c) => c.kind !== "toggle");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col overflow-hidden rounded-xl border border-secondary">
				<div
					data-playground-controls
					className="flex flex-wrap items-start gap-x-4 gap-y-3 border-b border-secondary bg-primary px-5 py-4"
				>
					{fields.map((c) => (
						<div key={c.prop} className="w-full sm:w-44" data-pg-control={c.kind}>
							{c.kind === "choice" ? (
								<Select
									label={c.prop}
									size="sm"
									value={String(state[c.prop])}
									onChange={set(c.prop)}
									options={c.values}
									disabled={c.prop in off}
									hint={off[c.prop]}
								/>
							) : c.kind === "number" ? (
								<NumberInput
									label={c.prop}
									size="sm"
									value={
										typeof state[c.prop] === "number"
											? (state[c.prop] as number)
											: undefined
									}
									onChange={set(c.prop)}
									min={c.min}
									max={c.max}
									step={c.step}
									disabled={c.prop in off}
									hint={off[c.prop]}
								/>
							) : c.kind === "icon" ? (
								<Select
									label={c.prop}
									size="sm"
									searchable
									value={String(state[c.prop] ?? "")}
									onChange={(v) => set(c.prop)(v === "" ? undefined : v)}
									options={[
										{ value: "", label: "Ninguno" },
										...PLAYGROUND_ICON_NAMES.map((n) => ({
											value: n,
											label: n,
											icon: PLAYGROUND_ICONS[n],
										})),
									]}
									disabled={c.prop in off}
									hint={off[c.prop]}
								/>
							) : (
								<Select
									label={c.prop}
									size="sm"
									value={String(state[c.prop] ?? "")}
									onChange={(v) => set(c.prop)(v === "" ? undefined : v)}
									options={[
										{ value: "", label: "Ninguno" },
										...c.options.map((o) => ({ value: o.label, label: o.label })),
									]}
									disabled={c.prop in off}
									hint={off[c.prop]}
								/>
							)}
						</div>
					))}
					{toggles.length > 0 && (
						<div className="flex flex-wrap gap-x-5 gap-y-3 sm:mt-6.5">
							{toggles.map((c) => (
								<Toggle
									key={c.prop}
									size="sm"
									label={c.prop}
									checked={state[c.prop] === true}
									onChange={set(c.prop)}
									disabled={c.prop in off}
									hint={off[c.prop]}
								/>
							))}
						</div>
					)}
				</div>
				<div
					data-playground-preview
					className={`relative flex min-h-55 items-center justify-center overflow-hidden p-6 md:p-10 ${
						playground.dark
							? "dark-mode bg-primary text-primary"
							: // Con marco (BackgroundPattern), sobre `bg-primary`, donde va en la guía: en `bg-secondary` apenas se ve
								playground.start.fill
								? "bg-primary"
								: "bg-secondary"
					}`}
				>
					{!playground.start.fill && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 flex justify-center"
						>
							<BackgroundPattern
								pattern="grid-dot"
								size="sm"
								mask="radial"
								width={800}
								height={220}
							/>
						</div>
					)}
					<div
						className={`relative ${playground.start.wide || playground.start.fill ? "w-full" : "max-w-full"}`}
						style={playground.start.fill ? { height: playground.start.fill } : undefined}
					>
						<Component {...props}>{props.children ?? childrenOf(playground, state)}</Component>
					</div>
				</div>
			</div>
			<CodeSnippet
				tabs={[
					{ label: "Next.js", code: next },
					{ label: "Astro", code: astro },
				]}
			/>
		</div>
	);
}
