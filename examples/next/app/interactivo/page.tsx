// Página de servidor que usa componentes interactivos: ButtonGroup ya lleva "use client"; el Modal va en un
// envoltorio de cliente porque su estado (abierto o cerrado) no puede vivir en el servidor. Un icono que va de una página
// de servidor a un componente de cliente se pasa como nodo (`<Clock />`): un componente (`Clock`) es una función y no cruza.
import { ButtonGroup } from "@jotis-me/react";
import { Clock } from "@untitledui/icons";
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
					{ value: "d", label: "24 horas", icon: <Clock size={16} /> },
				]}
			/>
			<div>
				<BorrarGasto />
			</div>
		</main>
	);
}
