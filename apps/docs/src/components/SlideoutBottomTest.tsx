// Botón y hoja inferior para la página de prueba `visual/slideout-bottom` (e2e a 390 px). Abrir necesita estado, así que
// es una isla cliente.
import { Button, Slideout } from "@jotis-me/react";
import { useState } from "react";

export default function SlideoutBottomTest() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Ver detalle</Button>
			<Slideout
				open={open}
				side="bottom"
				title="Alquiler"
				description="Movimiento del 1 de octubre"
				onClose={() => setOpen(false)}
				actions={<Button>Guardar</Button>}
			>
				<p className="m-0 text-sm text-secondary">Importe 650,00 €</p>
			</Slideout>
		</>
	);
}
