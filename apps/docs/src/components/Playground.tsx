// Isla del playground (design §4, Button.dc.html «Ejemplo interactivo»): pinta el componente con las props del
// punto de partida y de los controles, y su código para Next.js y Astro. Recibe solo JSON (src/lib/playground.ts).
//
// Arriba van los controles: un desplegable por cada prop con valores cerrados (tamaños, variantes…) y un
// interruptor por cada booleano. Debajo, la vista previa, y aparte, separado, el código.
import { BackgroundPattern, CodeSnippet, Select, Toggle } from "@jotis-me/react";
import { useState } from "react";
import { codeOf, type Playground as Data, initialState, propsFor } from "../lib/playground";
import { playgroundComponents } from "../lib/playground-components";

export default function Playground({ playground }: { playground: Data }) {
	const [state, setState] = useState(() => initialState(playground));
	const set = (prop: string) => (value: string | boolean) => setState((s) => ({ ...s, [prop]: value }));
	const Component = playgroundComponents[playground.name];
	if (!Component) return null;
	const { next, astro } = codeOf(playground, state);
	const choices = playground.controls.filter((c) => c.kind === "choice");
	const toggles = playground.controls.filter((c) => c.kind === "toggle");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col overflow-hidden rounded-xl border border-secondary">
				<div
					data-playground-controls
					className="flex flex-wrap items-end gap-x-4 gap-y-3 border-b border-secondary bg-primary px-5 py-4"
				>
					{choices.map((c) => (
						<div key={c.prop} className="w-full sm:w-44" data-pg-control="choice">
							<Select
								label={c.prop}
								size="sm"
								value={String(state[c.prop])}
								onChange={set(c.prop)}
								options={c.values}
							/>
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
						<Component {...propsFor(playground, state)}>{playground.start.children}</Component>
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
