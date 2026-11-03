// Isla del playground (design §4, Button.dc.html «Ejemplo interactivo»): pinta el componente con las props del
// punto de partida y de los controles, y su código para Next.js y Astro. Recibe solo JSON (src/lib/playground.ts).
import * as Regula from "@jotis-me/react";
import { BackgroundPattern, ButtonGroup, CodeSnippet, Select, Toggle } from "@jotis-me/react";
import { type ComponentType, useState } from "react";
import { codeOf, type Playground as Data, initialState, propsFor, usesSelect } from "../lib/playground";

export default function Playground({ playground }: { playground: Data }) {
	const [state, setState] = useState(() => initialState(playground));
	const set = (prop: string) => (value: string | boolean) => setState((s) => ({ ...s, [prop]: value }));
	const Component = (Regula as unknown as Record<string, ComponentType<Record<string, unknown>>>)[
		playground.name
	];
	if (!Component) return null;
	const { next, astro } = codeOf(playground, state);
	const choices = playground.controls.filter((c) => c.kind === "choice");
	const toggles = playground.controls.filter((c) => c.kind === "toggle");
	const label = "text-xs font-medium text-secondary";

	return (
		<div className="flex flex-col overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_var(--border-secondary)]">
			<div
				data-playground-preview
				className={`relative flex min-h-55 items-center justify-center overflow-hidden p-6 md:p-10 ${
					playground.dark ? "dark-mode bg-primary text-primary" : "bg-secondary"
				}`}
			>
				<div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-center">
					<BackgroundPattern pattern="grid-dot" size="sm" mask="radial" width={800} height={220} />
				</div>
				<div className={`relative ${playground.start.wide ? "w-full" : "max-w-full"}`}>
					<Component {...propsFor(playground, state)}>{playground.start.children}</Component>
				</div>
			</div>
			<div className="flex flex-wrap items-end gap-x-6 gap-y-4 px-5 py-4 shadow-[inset_0_1px_0_var(--border-secondary),inset_0_-1px_0_var(--border-secondary)]">
				{choices.map((c) => {
					// En móvil, siempre desplegable, como ButtonM: un grupo de cinco botones no cabe en 390px
					const select = (
						<div
							key={`${c.prop}-select`}
							className={`w-full md:w-44 ${usesSelect(c) ? "" : "md:hidden"}`}
							data-pg-control="choice"
						>
							<Select
								label={c.prop}
								size="sm"
								value={String(state[c.prop])}
								onChange={(e) => set(c.prop)(e.target.value)}
								options={c.values}
							/>
						</div>
					);
					if (usesSelect(c)) return select;
					return [
						select,
						<div
							key={c.prop}
							className="hidden flex-col gap-1.5 md:flex"
							data-pg-control="choice"
						>
							<span aria-hidden="true" className={label}>
								{c.prop}
							</span>
							<ButtonGroup
								aria-label={c.prop}
								value={String(state[c.prop])}
								onChange={set(c.prop)}
								items={c.values.map((v) => ({ value: v, label: v }))}
							/>
						</div>,
					];
				})}
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
			<CodeSnippet
				className="rounded-none shadow-none"
				tabs={[
					{ label: "Next.js", code: next },
					{ label: "Astro", code: astro },
				]}
			/>
		</div>
	);
}
