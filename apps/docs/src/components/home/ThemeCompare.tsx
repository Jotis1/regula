// «Así se ve» (design D4): la misma pantalla de Pecunia en claro y en oscuro, con la línea de `CompareSlider` entre
// las dos y dos botones que la llevan a un extremo. Los temas van en capas hermanas, una con `light-mode` y otra con
// `dark-mode` de @jotis-me/tokens: un `dark-mode` dentro de un `light-mode` no está soportado, así que nunca se
// anidan. Con la web en oscuro, la capa clara sigue en claro. Isla `client:visible`; sin JavaScript se ve en su
// posición inicial.
import { Badge, Button, CompareSlider, MetricCard, SectionHeader, Table, Tabs } from "@jotis-me/react";
import { Plus } from "@untitledui/icons";
import { useState } from "react";

interface Movement extends Record<string, unknown> {
	id: string;
	what: string;
	when: string;
	state: string;
	color: "success" | "warning" | "error";
	amount: string;
}

const PERIODS = [
	{ id: "dia", label: "Día" },
	{ id: "semana", label: "Semana" },
	{ id: "mes", label: "Mes" },
];
const COLUMNS = [
	{ key: "what", label: "Concepto", primary: true },
	{ key: "when", label: "Fecha" },
	{
		key: "state",
		label: "Estado",
		render: (r: Movement) => (
			<Badge color={r.color} size="sm" dot>
				{r.state}
			</Badge>
		),
	},
	{ key: "amount", label: "Importe", align: "right" as const },
];
const ROWS: Movement[] = [
	{ id: "m1", what: "Alquiler", when: "1 oct 2026", state: "Pagado", color: "success", amount: "650,00 €" },
	{ id: "m2", what: "Luz", when: "14 oct 2026", state: "Pendiente", color: "warning", amount: "96,40 €" },
	{ id: "m3", what: "Internet", when: "20 oct 2026", state: "Pagado", color: "success", amount: "42,10 €" },
	{ id: "m4", what: "Gimnasio", when: "29 oct 2026", state: "Vencido", color: "error", amount: "39,00 €" },
];

/** La pantalla: cabecera, métricas y movimientos. En estrecho, sin periodos, con dos métricas y sin tabla. */
function PecuniaScreen({ mode }: { mode: "light" | "dark" }) {
	return (
		<div
			data-theme-layer={mode}
			className={`${mode}-mode flex h-full flex-col gap-3 bg-secondary p-4 font-body text-primary lg:gap-5 lg:p-8`}
		>
			<div className="hidden flex-wrap items-center gap-3 lg:flex">
				<p className="min-w-30 flex-1 font-display text-display-xs font-semibold text-primary">
					Octubre
				</p>
				<Tabs type="button-border" aria-label="Periodo" items={PERIODS} defaultValue="mes" />
				<Button hierarchy="secondary">Exportar</Button>
				<Button iconLeading={Plus}>Nuevo gasto</Button>
			</div>
			<div className="flex items-center gap-2 lg:hidden">
				<p className="min-w-0 flex-1 font-display text-xl font-semibold text-primary">Octubre</p>
				<Button size="sm" hierarchy="secondary">
					Exportar
				</Button>
				<Button size="sm" iconLeading={Plus}>
					Nuevo gasto
				</Button>
			</div>
			<div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
				<MetricCard
					label="Gastado en octubre"
					value="1.284,50 €"
					change="12 %"
					trend="down"
					period="frente a septiembre"
				/>
				<MetricCard label="Fijos" value="842,00 €" change="0 %" period="sin sorpresas" />
				<MetricCard
					className="max-lg:hidden"
					label="Pendiente de pagar"
					value="96,40 €"
					change="3 recibos"
					period="vencen esta semana"
				/>
			</div>
			<div className="hidden lg:block">
				<Table size="sm" title="Movimientos" count={ROWS.length} columns={COLUMNS} rows={ROWS} />
			</div>
		</div>
	);
}

export default function ThemeCompare() {
	const [at, setAt] = useState(55);
	const buttons = (
		<>
			<Button hierarchy="secondary" size="sm" onClick={() => setAt(100)}>
				Todo claro
			</Button>
			<Button hierarchy="secondary" size="sm" onClick={() => setAt(0)}>
				Todo oscuro
			</Button>
		</>
	);
	return (
		<div className="flex flex-col gap-6">
			<div id="asi-t">
				<SectionHeader
					title="Una pantalla, dos temas, cero capturas."
					description="Pecunia montada solo con piezas de Regula. Arrastra la línea: lo de la derecha es la misma pantalla en oscuro."
					// En estrecho los botones no caben junto al título: van en su fila, debajo
					actions={<div className="hidden gap-3 lg:flex">{buttons}</div>}
				/>
			</div>
			<div className="flex gap-3 lg:hidden">{buttons}</div>
			<CompareSlider
				label="Mover la línea entre claro y oscuro"
				before={<PecuniaScreen mode="light" />}
				after={<PecuniaScreen mode="dark" />}
				beforeLabel="Claro"
				afterLabel="Oscuro"
				value={at}
				onChange={setAt}
				className="h-[420px]! lg:h-[640px]!"
			/>
		</div>
	);
}
