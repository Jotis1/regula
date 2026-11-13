// El aviso de «no se ha podido copiar»: una `Notification` de error, abajo a la derecha, que se queda hasta que se
// cierra. Sin broma: algo ha ido mal.
import { Notification } from "@jotis-me/react";

export default function CopyError({ onClose }: { onClose: () => void }) {
	return (
		<div className="fixed right-4 bottom-4 left-4 z-60 flex justify-end" data-copy-error>
			<Notification
				color="error"
				title="No se ha podido copiar"
				description="El navegador no ha dejado usar el portapapeles. Selecciona el texto y cópialo a mano."
				autoClose={false}
				onClose={onClose}
				className="w-full max-w-[400px]"
			/>
		</div>
	);
}
