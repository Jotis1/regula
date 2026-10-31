"use client";

// El estado (abierto o cerrado) vive en el cliente; la página que lo usa sigue siendo de servidor.
import { Button, Modal } from "@jotis-me/react";
import { useState } from "react";

export function BorrarGasto() {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	return (
		<>
			<Button hierarchy="secondary" destructive iconLeading="trash-01" onClick={() => setOpen(true)}>
				Eliminar gasto
			</Button>
			<Modal
				open={open}
				icon="trash-01"
				destructive
				title="¿Eliminar este gasto?"
				description="Se borrará también de los informes. No se puede deshacer."
				onClose={close}
				actions={
					<>
						<Button hierarchy="secondary" onClick={close}>
							Cancelar
						</Button>
						<Button destructive onClick={close}>
							Eliminar
						</Button>
					</>
				}
			/>
		</>
	);
}
