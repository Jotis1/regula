// El desplegable de grupo del índice de componentes, montado a demanda (component-index.ts): el `Select` del paquete
// sobre el HTML que ya pintó el servidor con las mismas props, abierto, porque se monta al pulsarlo. Va en su propio
// trozo, que solo se descarga cuando alguien se acerca al desplegable.
import { Select, type SelectOption } from "@jotis-me/react";
import { createRoot } from "react-dom/client";

export interface GroupSelectProps {
	id?: string;
	label?: string;
	options?: SelectOption[];
	defaultValue?: string;
	onChange: (value: string) => void;
}

export function mountGroupSelect(host: HTMLElement, props: GroupSelectProps) {
	createRoot(host).render(<Select {...props} options={props.options ?? []} defaultOpen />);
}
