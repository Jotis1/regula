// SidebarNav en el ejemplo interactivo (un fichero por componente: design D4), con la marca de Regula: `brand` y `mark`
// son nodos y el punto de partida solo lleva JSON.
import { AppIcon, SidebarNav } from "@jotis-me/react";
import type { ComponentProps } from "react";

const regula = <AppIcon app="regula" size={32} />;

export default function SidebarNavWithBrand(props: ComponentProps<typeof SidebarNav>) {
	return (
		<SidebarNav
			brand={
				<>
					{regula}
					Regula
				</>
			}
			mark={regula}
			{...props}
		/>
	);
}
