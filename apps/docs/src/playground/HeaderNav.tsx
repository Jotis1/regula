// HeaderNav en el ejemplo interactivo (un fichero por componente: design D4), con la marca de Regula y sus acciones:
// `brand`, `actions` y `account` son nodos y el punto de partida solo lleva JSON.
import { AppIcon, Button, Dropdown, HeaderNav, Input } from "@jotis-me/react";
import { Bell01, SearchLg } from "@untitledui/icons";
import type { ComponentProps } from "react";

export default function HeaderNavWithBrand(
	props: Omit<ComponentProps<typeof HeaderNav>, "brand" | "search" | "actions" | "account">,
) {
	return (
		<HeaderNav
			brand={
				<span className="flex items-center gap-2 font-display text-lg font-bold">
					<AppIcon app="regula" size={32} />
					Regula
				</span>
			}
			search={<Input aria-label="Buscar" placeholder="Buscar" icon={SearchLg} size="sm" />}
			actions={<Button hierarchy="tertiary" iconOnly={Bell01} label="Avisos" />}
			account={<Dropdown label="Cuenta" items={[{ label: "Perfil" }, { label: "Salir" }]} />}
			{...props}
		/>
	);
}
