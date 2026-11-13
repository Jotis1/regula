"use client";

// El estado (abierto o cerrado) vive en el cliente; la página que lo usa sigue siendo de servidor.
import { Button, Modal } from "@jotis-me/react";
import { Trash01 } from "@untitledui/icons";
import { useState } from "react";

export function BorrarGasto() {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	return (
		<>
			<Button hierarchy="secondary" destructive iconLeading={Trash01} onClick={() => setOpen(true)}>
				Eliminar gasto
			</Button>
			<Modal
				open={open}
				icon={Trash01}
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
