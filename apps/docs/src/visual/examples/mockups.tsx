// Puertos de las vistas previas decorativas, maquetas y multimedia de la guía (reference/components/*/preview.html).

import {
	BackgroundPattern,
	type BackgroundPatternMask,
	type BackgroundPatternName,
	Badge,
	BrowserFrame,
	Carousel,
	CreditCard,
	EmptyState,
	FeaturedIcon,
	InlineCTA,
	MetricCard,
	ScaledPreview,
	StreamScene,
	TransparencyGrid,
	VideoPlayer,
} from "@jotis-me/react";
import { BarChart01, Download01, Mail01, Stars02, Users01 } from "@untitledui/icons";

const PATTERNS: [BackgroundPatternName, BackgroundPatternMask, "sm" | "md"][] = [
	["grid", "radial", "md"],
	["grid-dot", "radial", "md"],
	["grid-check", "radial", "sm"],
	["circles", "radial", "sm"],
	["squares", "radial", "sm"],
	["grid", "linear-down", "sm"],
	["tech-grid", "radial-down", "md"],
	["tech-grid", "linear-down", "sm"],
];

export function BackgroundPatternExample() {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
			{PATTERNS.map(([pattern, mask, size]) => (
				<div key={`${pattern}-${mask}`}>
					<div
						style={{
							position: "relative",
							height: 200,
							borderRadius: 12,
							boxShadow: "inset 0 0 0 1px var(--border-secondary)",
							overflow: "hidden",
						}}
					>
						<BackgroundPattern pattern={pattern} mask={mask} size={size} />
						<div
							style={{
								position: "relative",
								height: "100%",
								display: "grid",
								placeItems: "center",
							}}
						>
							<FeaturedIcon icon={Stars02} variant="modern" color="gray" size="lg" />
						</div>
					</div>
					<p className="m-0 font-body text-sm text-tertiary" style={{ marginTop: 8 }}>
						<code>{pattern}</code> · {mask} · {size}
					</p>
				</div>
			))}
		</div>
	);
}

export function BrowserFrameExample() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
			<BrowserFrame url="pecunia.jotis.me/resumen" height={260}>
				<div
					style={{
						position: "relative",
						height: "100%",
						padding: 24,
						background: "var(--bg-secondary)",
					}}
				>
					<BackgroundPattern pattern="grid" size="sm" mask="radial-down" />
					<div
						style={{
							position: "relative",
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
							gap: 16,
						}}
					>
						<MetricCard
							label="Gasto de octubre"
							value="1.284,50 €"
							change="8 %"
							trend="up"
							period="vs. septiembre"
						/>
						<MetricCard
							label="Ahorro"
							value="412,00 €"
							change="3 %"
							trend="down"
							period="vs. septiembre"
						/>
					</div>
				</div>
			</BrowserFrame>
			<BrowserFrame variant="minimal-color" url="regula.jotis.me" height={120}>
				<div style={{ display: "grid", placeItems: "center", height: "100%" }}>
					<Badge color="brand">Minimal en color</Badge>
				</div>
			</BrowserFrame>
			<BrowserFrame theme="dark" url="pecunia.jotis.me/resumen" height={160}>
				<div style={{ position: "relative", height: "100%", padding: 24 }}>
					<MetricCard
						label="Gasto de octubre"
						value="1.284,50 €"
						change="8 %"
						trend="up"
						period="vs. septiembre"
					/>
				</div>
			</BrowserFrame>
			<BrowserFrame variant="minimal" theme="dark" url="vinculum.jotis.me" height={80}>
				<div style={{ display: "grid", placeItems: "center", height: "100%" }}>
					<Badge>Minimal oscuro</Badge>
				</div>
			</BrowserFrame>
			<BrowserFrame variant="minimal" url="vinculum.jotis.me" height={160}>
				<div style={{ display: "grid", placeItems: "center", height: "100%" }}>
					<EmptyState
						icon={Users01}
						title="Sin contactos todavía"
						description="Importa un CSV o añade el primero."
					/>
				</div>
			</BrowserFrame>
		</div>
	);
}

export function CreditCardExample() {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
			<CreditCard
				theme="brand-dark"
				company="Pecunia"
				holder="Administrador"
				expiry="06/29"
				last4="4821"
			/>
			<CreditCard
				theme="gray-dark"
				company="Pecunia"
				holder="Administrador"
				expiry="11/28"
				last4="0317"
			/>
			<CreditCard
				theme="brand-light"
				company="Pecunia"
				holder="Administrador"
				expiry="02/30"
				last4="7754"
			/>
			<CreditCard
				theme="gray-light"
				company="Pecunia"
				holder="Administrador"
				expiry="09/27"
				last4="1290"
			/>
			<div
				style={{
					padding: 20,
					borderRadius: 16,
					background: "linear-gradient(135deg,#432dd7,#a3b3ff)",
				}}
			>
				<CreditCard
					theme="transparent"
					company="Pecunia"
					holder="Administrador"
					expiry="01/31"
					last4="6608"
				/>
			</div>
			{(
				[
					"transparent-gradient",
					"transparent-strip",
					"gray-strip",
					"gradient-strip",
					"salmon-strip",
					"gray-strip-vertical",
					"gradient-strip-vertical",
					"salmon-strip-vertical",
				] as const
			).map((theme) =>
				theme.startsWith("transparent") ? (
					<div
						key={theme}
						style={{
							padding: 20,
							borderRadius: 16,
							background: "linear-gradient(135deg,#432dd7,#a3b3ff)",
						}}
					>
						<CreditCard
							theme={theme}
							company="Pecunia"
							holder="Administrador"
							expiry="06/28"
							last4="1234"
						/>
					</div>
				) : (
					<CreditCard
						key={theme}
						theme={theme}
						company="Pecunia"
						holder="Administrador"
						expiry="06/28"
						last4="1234"
					/>
				),
			)}
		</div>
	);
}

export function VideoPlayerExample() {
	return (
		<div className="flex flex-col gap-6">
			<div style={{ maxWidth: 640 }}>
				<VideoPlayer duration={252} />
			</div>
			<div className="flex flex-wrap items-start gap-6">
				<VideoPlayer size="sm" duration={504} style={{ width: 320, maxWidth: "100%" }} />
				<VideoPlayer size="md" duration={504} style={{ width: 560, maxWidth: "100%" }} />
				<VideoPlayer size="lg" duration={504} style={{ width: 720, maxWidth: "100%" }} />
			</div>
		</div>
	);
}

export function TransparencyGridExample() {
	return (
		<div className="flex flex-wrap gap-6">
			<TransparencyGrid className="flex h-32 w-64 items-center justify-center rounded-xl border border-secondary">
				<Badge color="brand">Cuadros de 8px</Badge>
			</TransparencyGrid>
			<TransparencyGrid
				size="md"
				className="flex h-32 w-64 items-center justify-center rounded-xl border border-secondary"
			>
				<Badge color="brand">Cuadros de 16px</Badge>
			</TransparencyGrid>
		</div>
	);
}

export function ScaledPreviewExample() {
	return (
		<div className="flex flex-wrap items-start gap-6">
			{/* Una escena de 1920 de ancho en una caja de 360: la escala sale sola (0,1875) */}
			<ScaledPreview width={1920} box={[360, 203]} className="rounded-lg border border-secondary">
				<StreamScene scale={1} variant="starting" seconds={300} countdownLabel="Para empezar" />
			</ScaledPreview>
			{/* Una pieza de 560 de ancho con la escala dada, 0,6 */}
			<ScaledPreview
				width={560}
				scale={0.6}
				box={[336, 100]}
				className="rounded-lg border border-secondary"
			>
				<InlineCTA
					icon={Stars02}
					title="Conecta tu banco"
					description="Importa los movimientos cada día sin subir extractos."
				/>
			</ScaledPreview>
		</div>
	);
}

const NEWS = [
	{
		icon: Download01,
		title: "Importa tus extractos",
		text: "Sube el archivo del banco y Regula lee los movimientos.",
		tone: "bg-tertiary",
	},
	{
		icon: BarChart01,
		title: "Categoriza solo",
		text: "Aprende de tus cambios y ordena el gasto por ti.",
		tone: "bg-secondary_alt",
	},
	{
		icon: Mail01,
		title: "Comparte informes",
		text: "Envía un resumen mensual a quien lo necesite.",
		tone: "bg-secondary",
	},
] as const;

function NewsSlide({ item, height }: { item: (typeof NEWS)[number]; height: number }) {
	return (
		<div
			className={`flex flex-col items-center justify-center gap-4 px-24 text-center ${item.tone}`}
			style={{ height }}
		>
			<FeaturedIcon icon={item.icon} variant="modern" size="xl" color="gray" />
			<p className="m-0 font-display text-display-xs font-semibold text-primary">{item.title}</p>
			<p className="m-0 max-w-[360px] text-md text-secondary">{item.text}</p>
		</div>
	);
}

export function CarouselExample() {
	return (
		<div className="flex flex-col gap-6">
			<Carousel
				aria-label="Novedades"
				slides={NEWS.map((n) => <NewsSlide key={n.title} item={n} height={320} />)}
			/>
			<Carousel
				aria-label="Novedades grandes"
				size="lg"
				defaultIndex={1}
				slides={NEWS.map((n) => <NewsSlide key={n.title} item={n} height={320} />)}
			/>
		</div>
	);
}
