// Muestras de las cards de /components/ (design D2): lo más característico de cada componente, con sus propios datos
// de ejemplo, como las piezas del estudio de Scaena. No son los ejemplos del registro (que enseñan todas las variantes
// y compara la paridad visual): una sola forma, quieta y legible a tamaño de miniatura (288×180).

import { Badge, Button, DatePicker, Input, StreamAlert, StreamScene, Table } from "@jotis-me/react";
import type { ReactNode } from "react";

export interface Thumbnail {
	/** La muestra, centrada en el escenario a su tamaño natural. */
	render: () => ReactNode;
	/** Si es más grande que el escenario, lo que se encoge desde el centro (menor que 1). */
	scale?: number;
}

interface Movimiento {
	c: string;
	ok: boolean;
	i: string;
}

export const THUMBNAILS: Record<string, Thumbnail> = {
	Button: { render: () => <Button iconLeading="plus">Nuevo gasto</Button> },
	Input: {
		render: () => (
			<div style={{ width: 248 }}>
				<Input
					label="Correo"
					icon="mail-01"
					defaultValue="tu@jotis.me"
					hint="Solo lo usamos para avisos."
				/>
			</div>
		),
	},
	Table: {
		scale: 0.5,
		render: () => (
			<div style={{ width: 560 }}>
				<Table<Movimiento>
					title="Movimientos"
					count="240"
					columns={[
						{ key: "c", label: "Concepto", primary: true },
						{
							key: "ok",
							label: "Estado",
							render: (r) => (
								<Badge color={r.ok ? "success" : "warning"} dot size="sm">
									{r.ok ? "Pagado" : "Pendiente"}
								</Badge>
							),
						},
						{ key: "i", label: "Importe", align: "right" },
					]}
					rows={[
						{ c: "Alquiler", ok: true, i: "650,00 €" },
						{ c: "Electricidad", ok: true, i: "48,20 €" },
						{ c: "Seguro del coche", ok: false, i: "210,00 €" },
					]}
				/>
			</div>
		),
	},
	DatePicker: {
		scale: 0.42,
		render: () => (
			<DatePicker
				inline
				today={new Date(2026, 9, 29)}
				defaultValue={{ start: new Date(2026, 9, 17), end: null }}
			/>
		),
	},
	StreamAlert: {
		scale: 0.55,
		render: () => <StreamAlert type="sub" user="nachoXL" tier={1} />,
	},
	StreamScene: {
		// StreamStage no mide sin JavaScript: con `scale` fija se pinta a 288 de ancho sin medir nada (D7)
		render: () => (
			<StreamScene variant="starting" seconds={300} countdownLabel="Para empezar" scale={288 / 1920} />
		),
	},
};

/** La muestra de un componente, o nada si aún no tiene (entonces la card enseña su ejemplo entero). */
export function Thumbnail({ name }: { name: string }) {
	const thumbnail = THUMBNAILS[name];
	return thumbnail ? <>{thumbnail.render()}</> : null;
}
