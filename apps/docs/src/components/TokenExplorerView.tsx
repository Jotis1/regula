// Lo que pinta el explorador de tokens (design D6 de redesign-docs-site-v2), con componentes del paquete: `Input` de
// filtro, `Tabs` `button-border` de familia y, por familia, una `Table` con un `TokenSwatch` `row` por fila en
// escritorio y una tarjeta `TokenSwatch` `card` por token por debajo de `lg`. Se pinta solo en el servidor (sin
// `client:`): son 241 tokens y no se hidratan. El comportamiento lo pone `src/lib/token-explorer.ts`, que se guía por
// los `data-` de aquí.
import {
	Badge,
	Button,
	EmptyState,
	Input,
	Table,
	type TableColumn,
	Tabs,
	TokenSwatch,
} from "@jotis-me/react";
import { SearchMd } from "@untitledui/icons";
import type { ExplorerFamily, ExplorerToken } from "../lib/tokens";

type Row = ExplorerToken & { id: string };

const THEMES = [
	["light", "claro"],
	["dark", "oscuro"],
] as const;

const COLUMNS: TableColumn<Row>[] = [
	{
		key: "name",
		label: "Token, valores y utilidad",
		primary: true,
		render: (t) => (
			// El nombre en su línea y debajo las dos muestras y la utilidad, para que queden alineadas de fila en fila
			<TokenSwatch
				name={t.name}
				light={t.light}
				dark={t.dark}
				utility={t.utility}
				className="w-80 xl:w-96 [&>span:first-child]:basis-full"
			/>
		),
	},
	{
		key: "usage",
		label: "Cuándo se usa",
		render: (t) => (
			<>
				{t.usage}
				{/* Solo texto e iconos: de un relleno o un borde no se mide el contraste */}
				{t.ratios ? (
					<span className="mt-1 block text-xs text-quaternary tabular-nums">
						Contraste:{" "}
						{THEMES.map(([theme, label]) => {
							const rate = t.ratios?.[theme];
							return rate ? (
								<span
									key={theme}
									data-ratio={theme}
									className="not-last:after:content-['_·_']"
								>
									{rate.label} en {label}
									{rate.low ? " (bajo)" : ""}
								</span>
							) : null;
						})}
					</span>
				) : null}
			</>
		),
	},
];

export default function TokenExplorerView({ families }: { families: ExplorerFamily[] }) {
	const first = families[0]?.id;
	return (
		<div className="not-prose my-4 flex flex-col gap-5" data-tokens="">
			<div className="flex flex-wrap items-end gap-3">
				<div className="min-w-56 flex-1 md:max-w-90" data-tokens-filter="" data-tokens-js="">
					<Input
						type="search"
						label="Filtrar tokens"
						placeholder="Nombre, valor o uso"
						icon={SearchMd}
						autoComplete="off"
					/>
				</div>
				<div className="max-w-full" data-tokens-families="">
					<Tabs
						type="button-border"
						aria-label="Familia"
						defaultValue={first}
						items={families.map((f) => ({
							id: f.id,
							label: f.label,
							count: f.tokens.length,
							href: `#tokens-${f.id}`,
						}))}
						// En móvil las siete familias no caben en una línea: se reparten en varias dentro de su caja
						className="max-w-full [&>ul]:max-w-full [&>ul]:flex-wrap"
					/>
				</div>
			</div>
			<p
				role="status"
				aria-live="polite"
				className="text-sm text-tertiary"
				data-tokens-status=""
				data-tokens-js=""
			>
				{families[0] ? `${families[0].tokens.length} tokens de ${families[0].label}` : ""}
			</p>
			{families.map((f) => {
				const rows = f.tokens.map((t) => ({ ...t, id: t.name }));
				return (
					<section
						key={f.id}
						id={`tokens-${f.id}`}
						data-token-family={f.id}
						data-label={f.label}
						data-collapsed={f.id === first ? undefined : ""}
						// Al llegar por su enlace, el filtro y las pestañas quedan a la vista por encima
						className="scroll-mt-80 data-collapsed:hidden"
					>
						<div className="max-lg:hidden">
							<Table<Row>
								size="sm"
								title={f.label}
								count={f.tokens.length}
								description="Pulsa la utilidad para copiarla."
								columns={COLUMNS}
								rows={rows}
							/>
						</div>
						<div className="flex flex-col gap-3 lg:hidden">
							<h3 className="flex items-center gap-2 text-md font-semibold text-primary">
								{f.label}
								<Badge color="brand" size="sm">
									{f.tokens.length}
								</Badge>
							</h3>
							<ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
								{f.tokens.map((t) => (
									<li key={t.name} data-token-search={t.search} className="min-w-0">
										<TokenSwatch
											layout="card"
											name={t.name}
											light={t.light}
											dark={t.dark}
											utility={t.utility}
											usage={t.usage}
											className="h-full [&>span:first-child]:break-all"
										/>
									</li>
								))}
							</ul>
						</div>
					</section>
				);
			})}
			<div className="rounded-xl border border-secondary" data-tokens-empty="" hidden>
				<EmptyState
					title={
						<>
							Nada con «<span data-tokens-term="" />»
						</>
					}
					description={
						<>
							Ningún token de <span data-tokens-family-name="" /> coincide. Prueba con otro
							nombre, valor o uso, o mira en otra familia.
						</>
					}
					actions={
						<Button hierarchy="secondary" size="sm" data-tokens-clear="">
							Limpiar búsqueda
						</Button>
					}
				/>
			</div>
			<p className="text-xs text-quaternary max-lg:hidden">
				Contraste calculado sobre bg-primary de cada tema (los{" "}
				<code className="font-mono">_on-brand</code>, sobre bg-brand-section), con los valores de
				@jotis-me/tokens.
			</p>
		</div>
	);
}
