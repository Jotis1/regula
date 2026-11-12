// Isla del playground (design §4, Button.dc.html «Ejemplo interactivo»): pinta el componente con las props del
// punto de partida y de los controles, y su código para Next.js y Astro. Recibe solo JSON (src/lib/playground.ts).
//
// Arriba van los controles: un desplegable por cada prop con valores cerrados (tamaños, variantes…) y un
// interruptor por cada booleano. Debajo, la vista previa, y aparte, separado, el código.
import { iconNames } from "@jotis-me/icons";
import { BackgroundPattern, Button, CodeSnippet, NumberInput, Select, Toggle } from "@jotis-me/react";
import { useState } from "react";
import {
	applyPreset,
	childrenOf,
	codeOf,
	type Playground as Data,
	disabledProps,
	initialState,
	presetActive,
	propsFor,
	type State,
} from "../lib/playground";
import { playgroundComponents } from "../lib/playground-components";

export default function Playground({ playground }: { playground: Data }) {
	const [state, setState] = useState(() => initialState(playground));
	const set = (prop: string) => (value: State[string]) => setState((s) => ({ ...s, [prop]: value }));
	const Component = playgroundComponents[playground.name];
	if (!Component) return null;
	const { next, astro } = codeOf(playground, state);
	const off = disabledProps(playground, state);
	const presets = playground.start.presets ?? [];
	const initial = initialState(playground);
	const isInitial = JSON.stringify(state) === JSON.stringify(initial);
	const toggles = playground.controls.filter((c) => c.kind === "toggle");
	const fields = playground.controls.filter((c) => c.kind !== "toggle");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col overflow-hidden rounded-xl border border-secondary">
				{presets.length > 0 && (
					<div
						role="group"
						aria-label="Atajos"
						data-playground-presets
						className="flex flex-wrap items-center gap-2 border-b border-secondary bg-primary px-5 py-3"
					>
						<span className="text-xs font-semibold text-quaternary">Tipos</span>
						<Button
							size="sm"
							hierarchy="secondary"
							aria-pressed={isInitial}
							className="aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover"
							onClick={() => setState(initial)}
						>
							Por defecto
						</Button>
						{presets.map((p) => (
							<Button
								key={p.label}
								size="sm"
								hierarchy="secondary"
								aria-pressed={presetActive(playground, p, state)}
								className="aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover"
								onClick={() => setState(applyPreset(playground, p))}
							>
								{p.label}
							</Button>
						))}
					</div>
				)}
				<div
					data-playground-controls
					className="flex flex-wrap items-end gap-x-4 gap-y-3 border-b border-secondary bg-primary px-5 py-4"
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
										...iconNames.map((n) => ({ value: n, label: n, icon: n })),
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
						<div className="flex flex-wrap gap-x-5 gap-y-3 pb-2">
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
						<Component {...propsFor(playground, state)}>
							{childrenOf(playground, state)}
						</Component>
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
