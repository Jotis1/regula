// CopyTooltip en el ejemplo interactivo (un fichero por componente: design D4): el botón que se copia va con él,
// porque el componente solo pinta la burbuja «Copiado» junto al elemento pulsado.
import { Button, CopyTooltip } from "@jotis-me/react";
import { Copy01 } from "@untitledui/icons";
import type { ComponentProps } from "react";

export default function CopyTooltipWithButton(props: ComponentProps<typeof CopyTooltip>) {
	return (
		<>
			<Button hierarchy="secondary" iconLeading={Copy01} data-copy="bun add @jotis-me/react">
				Copiar instalación
			</Button>
			<CopyTooltip {...props} />
		</>
	);
}
