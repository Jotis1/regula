// Puertos de las vistas previas decorativas, maquetas y multimedia de la guía (reference/components/*/preview.html).

import {
	BackgroundPattern,
	type BackgroundPatternMask,
	type BackgroundPatternName,
	Badge,
	BrowserFrame,
	CreditCard,
	EmptyState,
	FeaturedIcon,
	MetricCard,
	TransparencyGrid,
	VideoPlayer,
} from "@jotis-me/react";

const PATTERNS: [BackgroundPatternName, BackgroundPatternMask, "sm" | "md"][] = [
	["grid", "radial", "md"],
	["grid-dot", "radial", "md"],
	["grid-check", "radial", "sm"],
	["circles", "radial", "sm"],
	["squares", "radial", "sm"],
	["grid", "linear-down", "sm"],
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
							<FeaturedIcon icon="stars-02" variant="modern" color="gray" size="lg" />
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
			<BrowserFrame variant="minimal" url="vinculum.jotis.me" height={160}>
				<div style={{ display: "grid", placeItems: "center", height: "100%" }}>
					<EmptyState
						icon="users-01"
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
		</div>
	);
}

export function VideoPlayerExample() {
	return (
		<div style={{ maxWidth: 640 }}>
			<VideoPlayer duration={252} />
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
