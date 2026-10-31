// Página de servidor que usa componentes interactivos: ButtonGroup ya lleva "use client"; el Modal va en un
// envoltorio de cliente porque su estado (abierto o cerrado) no puede vivir en el servidor.
import { ButtonGroup } from "@jotis-me/react";
import { BorrarGasto } from "./borrar-gasto";

export default function Page() {
	return (
		<main className="flex flex-col gap-6">
			<h1 className="font-display text-display-sm font-semibold">Componentes interactivos</h1>
			<ButtonGroup
				aria-label="Periodo"
				defaultValue="m"
				items={[
					{ value: "a", label: "12 meses" },
					{ value: "m", label: "7 días" },
					{ value: "d", label: "24 horas", icon: "clock" },
				]}
			/>
			<div>
				<BorrarGasto />
			</div>
		</main>
	);
}
