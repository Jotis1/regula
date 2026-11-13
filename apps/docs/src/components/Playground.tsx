// Isla del ejemplo interactivo (design D3 de redesign-docs-site-v2, lienzo «Input» y «ButtonMobile»): pinta el componente
// con las props del punto de partida y de los controles, y su código para Next.js y Astro. Recibe solo JSON
// (src/lib/playground.ts).
//
// Tres zonas. La cabecera, con el desplegable de atajos, el recuento de cambios y «Restablecer todo». A la izquierda, el
// lienzo sobre damero, la tira de props cambiadas y el código, que marca sus líneas. A la derecha, el inspector, de
// 368 px y con desplazamiento propio: los controles en grupos plegables y, con más de doce, un filtro pegado arriba.
// Por debajo de `lg`, una columna: el lienzo pegado arriba, los atajos, la tira, los grupos, el código y una barra
// pegada abajo con el recuento, «Restablecer» y «Copiar código».
import {
	Badge,
	Button,
	CodeSnippet,
	Disclosure,
	Input,
	NumberInput,
	Select,
	Spinner,
	Tag,
	Toggle,
	TransparencyGrid,
} from "@jotis-me/react";
import { Copy01, RefreshCcw01, SearchLg } from "@untitledui/icons";
import { type ComponentType, type ReactNode, Suspense, use, useEffect, useRef, useState } from "react";
import {
	type Control,
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
import {
	changedProps,
	changeLabel,
	changesText,
	filterGroups,
	groupChangesText,
	groupsOf,
	highlightOf,
	MANY_CONTROLS,
	propsText,
	reasonText,
	resetProp,
	shortcutHolds,
	shortcutState,
} from "../lib/playground-inspector";
import type { PropRow } from "../lib/props";

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

const FRAME = "overflow-clip rounded-xl border border-secondary bg-primary";

export default function Playground({ playground, rows }: { playground: Data; rows: PropRow[] }) {
	return (
		<Suspense
			fallback={
				// Mientras baja el componente (design D8): el lienzo, con su aviso
				<div className={FRAME}>
					<TransparencyGrid className="flex min-h-44 items-center justify-center p-5 lg:min-h-84">
						<Spinner size="sm" label="Montando el ejemplo" />
					</TransparencyGrid>
				</div>
			}
		>
			<Loaded playground={playground} rows={rows} />
		</Suspense>
	);
}

/** El nombre de la prop, en la letra del código, como etiqueta de su control. */
const propName = (prop: string) => <span className="font-mono text-[13px] text-primary">{prop}</span>;

function Loaded({ playground: data, rows }: { playground: Data; rows: PropRow[] }) {
	const { default: Component, tweaks } = use(load(data.name));
	// Los ajustes de cliente (contenido preparado, con nodos) no cruzan de Astro: los controles se rehacen con ellos
	const playground = tweaks
		? {
				...data,
				controls: controlsOf(
					rows,
					{ ...data.start.tweaks, ...tweaks },
					data.start.props,
					data.start.children,
				),
			}
		: data;
	const [state, setState] = useState(() => initialState(playground));
	const [shortcut, setShortcut] = useState<string>();
	const [query, setQuery] = useState("");
	const [copied, setCopied] = useState<"" | "ok" | "error">("");
	const root = useRef<HTMLDivElement>(null);
	const strip = useRef<HTMLDivElement>(null);
	// Los grupos que ya se han abierto por tener cambios siguen abiertos al restablecerlos: no se cierran bajo el cursor
	const opened = useRef(new Set<string>());
	const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(copyTimer.current), []);

	const set = (prop: string) => (value: State[string]) => setState((s) => ({ ...s, [prop]: value }));
	const code = codeOf(playground, state);
	const off = disabledProps(playground, state);
	const changed = changedProps(playground, state);
	const isChanged = new Set(changed);
	// Los iconos viajan como nombre (`"Plus"`) y aquí se resuelven a su componente
	const props = resolveIcons(propsFor(playground, state)) as Record<string, unknown> & {
		children?: ReactNode;
	};

	const shortcuts = playground.start.shortcuts ?? [];
	// El atajo sigue elegido mientras las props que puso no cambien
	const active = shortcuts.find((s) => s.label === shortcut && shortcutHolds(playground, state, s));
	// Las props que solo pone un atajo (un `defaultValue`) no se aplican a un componente ya montado: se monta de nuevo
	const loose = Object.keys(state).filter((p) => !playground.controls.some((c) => c.prop === p));
	const mountKey = JSON.stringify(loose.map((p) => [p, state[p]]));

	const groups = groupsOf(playground);
	const filterable = playground.controls.length > MANY_CONTROLS;
	const filtering = filterable && query.trim() !== "";
	const visible = filtering ? filterGroups(groups, query) : groups;

	const focusControl = (prop: string) =>
		requestAnimationFrame(() =>
			root.current
				?.querySelector<HTMLElement>(
					`[data-prop="${CSS.escape(prop)}"] :is(button, input):not([disabled])`,
				)
				?.focus(),
		);
	/** Devuelve una prop a su valor de partida. Quien lo pide desaparece al hacerlo: el foco pasa a donde diga `focus`. */
	const reset = (prop: string, focus: "control" | "strip") => {
		setState((s) => resetProp(playground, s, prop));
		if (focus === "control") focusControl(prop);
		else requestAnimationFrame(() => strip.current?.focus());
	};
	const resetAll = () => {
		setState(initialState(playground));
		setShortcut(undefined);
	};

	/** Copia el código de la pestaña que se ve (la barra del móvil): `CodeSnippet` no dice cuál es, se lee de su lista. */
	const copy = async () => {
		const tab = root.current?.querySelector('[data-playground-code] [role="tab"][aria-selected="true"]');
		const text = tab?.textContent === "Astro" ? code.astro : code.next;
		let result: "ok" | "error" = "ok";
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			result = "error";
		}
		setCopied(result);
		clearTimeout(copyTimer.current);
		copyTimer.current = setTimeout(() => setCopied(""), result === "ok" ? 1500 : 6000);
	};

	/** Lo que va tras la etiqueta de un control cambiado: que lo está, con texto, y cómo deshacerlo. */
	const aside = (prop: string) =>
		isChanged.has(prop) ? (
			<>
				<Badge color="brand" size="sm" dot>
					Cambiado
				</Badge>
				<Button
					hierarchy="link-gray"
					size="xs"
					aria-label={`Restablecer ${prop}`}
					onClick={() => reset(prop, "control")}
				>
					Restablecer
				</Button>
			</>
		) : undefined;

	const control = (c: Control) => {
		const disabled = c.prop in off;
		// El motivo va en el `hint` del campo, que lo enlaza con `aria-describedby`
		const hint = disabled ? reasonText(off[c.prop] as string) : undefined;
		const shared = { label: propName(c.prop), labelAside: aside(c.prop), disabled, hint };
		return (
			<div key={c.prop} data-pg-control={c.kind} data-prop={c.prop}>
				{c.kind === "toggle" ? (
					<Toggle {...shared} size="sm" checked={state[c.prop] === true} onChange={set(c.prop)} />
				) : c.kind === "choice" ? (
					<Select
						{...shared}
						size="sm"
						value={String(state[c.prop])}
						onChange={set(c.prop)}
						options={c.values}
					/>
				) : c.kind === "number" ? (
					<NumberInput
						{...shared}
						size="sm"
						value={typeof state[c.prop] === "number" ? (state[c.prop] as number) : Number.NaN}
						onChange={(v) => set(c.prop)(Number.isNaN(v) ? undefined : v)}
						min={c.min}
						max={c.max}
						step={c.step}
					/>
				) : c.kind === "text" ? (
					<Input
						{...shared}
						size="sm"
						value={typeof state[c.prop] === "string" ? (state[c.prop] as string) : ""}
						onChange={(e) => set(c.prop)(e.target.value === "" ? undefined : e.target.value)}
						placeholder="Sin texto"
						autoComplete="off"
						spellCheck={false}
					/>
				) : c.kind === "icon" ? (
					<Select
						{...shared}
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
					/>
				) : (
					<Select
						{...shared}
						size="sm"
						value={String(state[c.prop] ?? "")}
						onChange={(v) => set(c.prop)(v === "" ? undefined : v)}
						options={[
							{ value: "", label: "Ninguno" },
							...c.options.map((o) => ({ value: o.label, label: o.label })),
						]}
					/>
				)}
			</div>
		);
	};

	const { start } = playground;
	const stage = (
		<div
			className={`relative ${start.wide || start.fill ? "w-full" : "max-w-full"}`}
			style={start.fill ? { height: start.fill } : undefined}
		>
			<Component key={mountKey} {...props}>
				{props.children ?? childrenOf(playground, state)}
			</Component>
		</div>
	);
	// Por debajo de `lg` el lienzo se queda pegado arriba mientras se recorren los controles; si es muy alto, se desplaza dentro
	const canvas =
		"order-first sticky top-0 z-2 flex min-h-44 max-h-[50vh] items-center-safe justify-center-safe overflow-auto border-b border-secondary p-5 lg:static lg:order-none lg:col-start-1 lg:min-h-84 lg:max-h-none lg:border-b-0 lg:p-12 focus-visible:shadow-[inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none";
	// El lienzo se desplaza por dentro si el componente no cabe: tiene que poder enfocarse para moverlo con el teclado
	const region = { role: "region", "aria-label": "Vista previa", tabIndex: 0 } as const;

	return (
		<div
			ref={root}
			data-playground
			className={`${FRAME} flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_368px] lg:grid-rows-[auto_auto_auto_1fr]`}
		>
			<div className="flex items-center gap-4 border-b border-secondary bg-secondary p-3 lg:col-span-2 lg:min-h-14 lg:px-4 lg:py-2">
				{shortcuts.length > 0 && (
					<div className="w-full lg:w-60" data-playground-shortcuts>
						<Select
							size="sm"
							aria-label="Atajos"
							placeholder="Empezar desde un atajo"
							value={active?.label ?? ""}
							onChange={(label) => {
								const next = shortcuts.find((s) => s.label === label);
								if (!next) return;
								setState(shortcutState(playground, next));
								setShortcut(label);
							}}
							options={shortcuts.map((s) => s.label)}
						/>
					</div>
				)}
				<span className="hidden grow lg:block" />
				<span className="hidden flex-none text-sm text-tertiary lg:block" data-playground-count>
					{changesText(changed.length)}
				</span>
				<span className="hidden flex-none lg:block">
					<Button
						hierarchy="secondary"
						size="xs"
						iconLeading={RefreshCcw01}
						disabled={changed.length === 0}
						onClick={resetAll}
					>
						Restablecer todo
					</Button>
				</span>
			</div>

			{start.fill ? (
				// Con marco (BackgroundPattern), sobre `bg-primary`, donde va en la guía, y sin damero
				<div
					{...region}
					data-playground-preview
					className={`${canvas} ${data.dark ? "dark-mode bg-primary text-primary" : "bg-primary"}`}
				>
					{stage}
				</div>
			) : (
				<TransparencyGrid
					{...region}
					data-playground-preview
					className={`${canvas} ${data.dark ? "dark-mode text-primary" : ""}`}
				>
					{stage}
				</TransparencyGrid>
			)}

			<div
				ref={strip}
				tabIndex={-1}
				aria-live="polite"
				data-playground-changes
				className="flex min-h-14 flex-wrap items-center gap-2 border-b border-secondary px-4 py-3 focus-visible:outline-none lg:col-start-1 lg:border-t lg:border-b-0"
			>
				{changed.length > 0 ? (
					<>
						<span className="text-sm font-medium text-secondary">Cambiado:</span>
						{changed.map((prop) => (
							<Tag
								key={prop}
								size="md"
								onRemove={() => reset(prop, "strip")}
								removeLabel={`Quitar el cambio de ${prop}`}
							>
								<span className="font-mono text-[13px]" data-change={prop}>
									{changeLabel(playground, state, prop)}
								</span>
							</Tag>
						))}
					</>
				) : (
					<span className="text-sm text-tertiary">
						Todo como viene de fábrica. Toca algo, que para eso está.
					</span>
				)}
			</div>

			<div className="relative border-secondary lg:col-start-2 lg:row-span-3 lg:row-start-2 lg:min-h-160 lg:border-l">
				<fieldset
					aria-label="Propiedades"
					data-playground-controls
					className="m-0 flex min-w-0 flex-col border-0 p-0 lg:absolute lg:inset-0 lg:overflow-y-auto"
				>
					{filterable && (
						<div className="border-b border-secondary bg-primary px-4 py-3 lg:sticky lg:top-0 lg:z-1">
							<Input
								size="sm"
								type="search"
								aria-label="Filtrar propiedades"
								placeholder={`Filtrar las ${playground.controls.length} props`}
								icon={SearchLg}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								autoComplete="off"
								spellCheck={false}
							/>
						</div>
					)}
					{visible.map((group, i) => {
						const count = group.controls.filter((c) => isChanged.has(c.prop)).length;
						if (count > 0) opened.current.add(group.name);
						// El primero, abierto; los demás, si tienen cambios (o los han tenido) o el filtro ha dado con ellos
						const open = i === 0 || filtering || opened.current.has(group.name);
						return (
							<Disclosure
								key={group.name}
								defaultOpen={open}
								className="px-4"
								title={
									<span className="flex items-center gap-2" data-pg-group={group.name}>
										{group.name}
										{count > 0 && (
											<Badge color="brand" size="sm">
												{groupChangesText(count)}
											</Badge>
										)}
									</span>
								}
								aside={
									<span className="text-xs font-normal text-quaternary">
										{propsText(group.controls.length)}
									</span>
								}
							>
								<div className="-ml-6 flex flex-col gap-4 pt-1 pb-1">
									{group.controls.map(control)}
								</div>
							</Disclosure>
						);
					})}
					{filtering && visible.length === 0 && (
						<div className="flex flex-col items-start gap-2 px-4 py-5" data-playground-empty>
							<p className="m-0 text-sm text-tertiary">
								Ninguna prop lleva «{query.trim()}» en el nombre.
							</p>
							<Button hierarchy="link-color" size="sm" onClick={() => setQuery("")}>
								Limpiar filtro
							</Button>
						</div>
					)}
				</fieldset>
			</div>

			<div
				data-playground-code
				className="border-secondary bg-secondary p-3 lg:col-start-1 lg:border-t lg:p-4"
			>
				<CodeSnippet
					tabs={[
						{
							label: "Next.js",
							code: code.next,
							highlight: highlightOf(code.lines.next, changed),
						},
						{
							label: "Astro",
							code: code.astro,
							highlight: highlightOf(code.lines.astro, changed),
						},
					]}
				/>
			</div>

			<div
				data-playground-bar
				className="sticky bottom-0 z-2 flex flex-wrap items-center gap-2 border-t border-secondary bg-primary_alt p-3 lg:hidden"
			>
				{/* A 390 px el recuento y los dos botones no caben en una línea: el recuento va encima */}
				<span
					className="min-w-0 basis-full text-sm font-medium text-secondary sm:grow sm:basis-0"
					aria-live="polite"
				>
					{copied === "error"
						? "No se ha podido copiar. Selecciona el código y cópialo a mano."
						: changesText(changed.length)}
				</span>
				<Button
					hierarchy="secondary"
					size="lg"
					className="grow sm:grow-0"
					disabled={changed.length === 0}
					onClick={resetAll}
				>
					Restablecer
				</Button>
				<Button size="lg" className="grow sm:grow-0" iconLeading={Copy01} onClick={copy}>
					{copied === "ok" ? "Copiado" : "Copiar código"}
				</Button>
			</div>
		</div>
	);
}
