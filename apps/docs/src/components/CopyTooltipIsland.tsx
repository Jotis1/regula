// `CopyTooltip` como isla de la web, por la misma razón que `CodeSnippetIsland`. Si una copia falla (el navegador no
// deja usar el portapapeles), en vez de la burbuja sale un aviso de error que dice qué ha pasado y cómo seguir, y no se
// cierra solo (design D8). El aviso se carga solo cuando hace falta: no pesa en las páginas donde nada falla.
import { CopyTooltip, type CopyTooltipProps } from "@jotis-me/react";
import { lazy, Suspense, useState } from "react";

const CopyError = lazy(() => import("./CopyError"));

export default function CopyTooltipIsland(props: CopyTooltipProps) {
	const [failed, setFailed] = useState(false);
	return (
		<>
			<CopyTooltip {...props} onCopyError={() => setFailed(true)} />
			{failed ? (
				<Suspense fallback={null}>
					<CopyError onClose={() => setFailed(false)} />
				</Suspense>
			) : null}
		</>
	);
}
