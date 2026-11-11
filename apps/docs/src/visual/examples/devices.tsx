// Vista previa de ScreenMockup, LaptopMockup, PhoneMockup y BackgroundOverlay. La pantalla se hace con componentes del
// paquete (sin fotos), pintada a su tamaño real y encogida con ScaledPreview. Va en su propio fichero: lleva gráficas.

import {
	BackgroundOverlay,
	BackgroundPattern,
	Button,
	LaptopMockup,
	LineChart,
	MetricCard,
	PhoneMockup,
	ScaledPreview,
	ScreenMockup,
} from "@jotis-me/react";

const MESES = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];
const GASTOS = [820, 910, 1100, 880, 940, 870, 1020, 990, 1150, 1240, 1060, 1284];

/** El panel de ejemplo, a 1200 de ancho (escritorio) o 375 (móvil). */
function Panel({ mobile }: { mobile?: boolean }) {
	return (
		<div className="flex flex-col gap-6 bg-primary p-8 font-body" style={{ width: mobile ? 375 : 1200 }}>
			<div className="flex items-center justify-between">
				<p className="m-0 font-display text-display-xs font-semibold text-primary">Tus cuentas</p>
				{mobile ? null : <Button hierarchy="secondary">Exportar</Button>}
			</div>
			<div className={mobile ? "flex flex-col gap-4" : "grid grid-cols-3 gap-6"}>
				<MetricCard
					label="Gasto del mes"
					value="1.284 €"
					change="12%"
					trend="down"
					period="vs. septiembre"
				/>
				{mobile ? null : (
					<>
						<MetricCard
							label="Ingresos"
							value="2.950 €"
							change="3%"
							trend="up"
							period="vs. septiembre"
						/>
						<MetricCard
							label="Ahorro"
							value="1.666 €"
							change="8%"
							trend="up"
							period="vs. septiembre"
						/>
					</>
				)}
			</div>
			<LineChart
				labels={MESES}
				series={[{ name: "Gastos", data: GASTOS }]}
				format={(v) => `${v} €`}
				height={mobile ? 260 : 300}
				aria-label="Gastos de noviembre a octubre"
			/>
		</div>
	);
}

/** Pantalla 3:2 y moderna (escritorio y móvil), con el panel encogido dentro. */
export function ScreenMockupExample() {
	return (
		<div className="flex flex-col gap-10">
			<ScreenMockup size="md">
				<ScaledPreview width={1200} box={[640, 427]}>
					<Panel />
				</ScaledPreview>
			</ScreenMockup>
			<div className="flex flex-wrap items-start gap-8">
				<ScreenMockup variant="modern" className="max-w-[480px]">
					<ScaledPreview width={1200} box={[462, 308]}>
						<Panel />
					</ScaledPreview>
				</ScreenMockup>
				<ScreenMockup variant="modern" breakpoint="mobile" className="max-w-[220px]">
					<ScaledPreview width={375} box={[202, 440]}>
						<Panel mobile />
					</ScaledPreview>
				</ScreenMockup>
			</div>
		</div>
	);
}

/** El portátil con el panel en la pantalla. */
export function LaptopMockupExample() {
	return (
		<LaptopMockup className="max-w-[720px]">
			<ScaledPreview width={1200} box={[583, 389]}>
				<Panel />
			</ScaledPreview>
		</LaptopMockup>
	);
}

/** El teléfono con el panel móvil, con y sin sombra. */
export function PhoneMockupExample() {
	return (
		<div className="flex flex-wrap items-start gap-10">
			<PhoneMockup className="max-w-[300px]">
				<ScaledPreview width={375} box={[269, 600]}>
					<Panel mobile />
				</ScaledPreview>
			</PhoneMockup>
			<PhoneMockup shadow={false} className="max-w-[300px]">
				<ScaledPreview width={375} box={[269, 600]}>
					<Panel mobile />
				</ScaledPreview>
			</PhoneMockup>
		</div>
	);
}

/** Los tres tipos sobre el mismo fondo, con desenfoque; el de la derecha, sin él. */
export function BackgroundOverlayExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
			{(
				[
					["default", true, "Velo"],
					["gradient", true, "Degradado"],
					["transparent", true, "Solo desenfoque"],
					["default", false, "Velo sin desenfoque"],
				] as const
			).map(([type, blur, label]) => (
				<div key={label} className="relative h-48 overflow-hidden rounded-xl bg-brand-solid">
					<BackgroundPattern pattern="grid" size="md" />
					<p className="absolute top-4 left-4 m-0 font-display text-display-sm font-semibold text-white">
						Regula
					</p>
					<BackgroundOverlay type={type} blur={blur} />
					<p className="absolute bottom-3 left-4 m-0 text-sm font-medium text-white">{label}</p>
				</div>
			))}
		</div>
	);
}
