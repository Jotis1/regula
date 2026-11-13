// La pantalla de ejemplo de la historia de las reglas (design D4): «Nuevo gasto» de Pecunia, hecha con componentes de
// @jotis-me/react. Llega con cinco fallos y cada regla arregla uno: las reglas aplicadas se quedan puestas y
// `Spotlight` rodea lo que cambió con la última (`mark`). `Spotlight` mide lo que su contenido, así que las zonas que
// ocupan toda la fila toman el ancho de su contenedor con `100cqw`.
import { Badge, BrowserFrame, Button, Input, Spotlight } from "@jotis-me/react";

export interface PecuniaFormProps {
	/** Cuántas reglas lleva aplicadas, de 0 (tal como llega) a 5. */
	step: number;
	/** Rodea la zona que cambió con la última regla aplicada. */
	mark?: boolean;
	/** Para los fotogramas de 300 px del móvil: campos en una columna y controles pequeños. */
	compact?: boolean;
}

export function PecuniaForm({ step, mark = true, compact = false }: PecuniaFormProps) {
	const on = (rule: number) => mark && step === rule;
	const size = compact ? "sm" : "md";
	return (
		<BrowserFrame variant="minimal" url="pecunia.jotis.me/gastos/borrador">
			<div
				data-story-screen={step}
				className={`@container flex flex-col bg-primary_alt ${compact ? "gap-5 p-5" : "gap-6 p-7"}`}
			>
				<div className="flex min-h-7 items-center justify-between gap-3">
					<p className="text-lg font-semibold text-primary">Nuevo gasto</p>
					<div data-zone="estado">
						<Spotlight active={on(4)}>
							{step >= 4 ? (
								<Badge color="success" dot>
									Pagado
								</Badge>
							) : (
								<span
									role="img"
									aria-label="Punto verde, sin texto"
									className="block size-3 rounded-full bg-fg-success-primary"
								/>
							)}
						</Spotlight>
					</div>
				</div>

				<div data-zone="etiquetas">
					<Spotlight active={on(1)}>
						<div className="flex flex-wrap gap-2">
							<Badge color={step >= 1 ? "gray" : "purple"}>Casa</Badge>
							<Badge color={step >= 1 ? "gray" : "orange"}>Recurrente</Badge>
							<Badge color={step >= 1 ? "brand" : "pink"}>Octubre</Badge>
						</div>
					</Spotlight>
				</div>

				<div data-zone="campos">
					<Spotlight active={on(3)}>
						<div className={`grid w-[100cqw] gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
							<Input
								size={size}
								aria-label="Concepto"
								label={step >= 3 ? "Concepto" : undefined}
								placeholder={step >= 3 ? "Alquiler" : "Concepto"}
							/>
							<Input
								size={size}
								aria-label="Quién paga"
								label={step >= 3 ? "Quién paga" : undefined}
								placeholder={step >= 3 ? "Tú, como siempre" : "Quién paga"}
							/>
						</div>
					</Spotlight>
				</div>

				<div data-zone="cifras">
					<Spotlight active={on(5)}>
						<div className="flex flex-wrap items-baseline gap-x-3">
							<span
								className={`font-display font-semibold tracking-[-0.02em] text-primary tabular-nums ${compact ? "text-display-sm" : "text-display-md"}`}
							>
								{step >= 5 ? "1.284,50 €" : "1284.5 EUR"}
							</span>
							<span className="text-sm text-tertiary">
								{step >= 5 ? "29 oct 2026" : "10/29/2026"}
							</span>
						</div>
					</Spotlight>
				</div>

				<div data-zone="acciones" className="flex justify-end">
					<Spotlight active={on(2)}>
						<div className="flex flex-wrap justify-end gap-2">
							<Button size={size} hierarchy={step >= 2 ? "tertiary" : "primary"}>
								Cancelar
							</Button>
							<Button size={size} hierarchy={step >= 2 ? "secondary" : "primary"}>
								Borrador
							</Button>
							<Button size={size}>Guardar gasto</Button>
						</div>
					</Spotlight>
				</div>
			</div>
		</BrowserFrame>
	);
}
