// AppStoreBadge en el ejemplo interactivo (un fichero por componente: design D4): el logo, que es un nodo de
// @jotis-me/assets/logos, se elige entre opciones preparadas.
import {
	StoreAppGalleryLogo,
	StoreAppStoreLogo,
	StoreGalaxyStoreLogo,
	StoreGooglePlayLogo,
	StoreMacAppStoreLogo,
} from "@jotis-me/assets/logos";
import type { ReactNode } from "react";
import type { Tweak } from "../lib/playground";

export { AppStoreBadge as default } from "@jotis-me/react";

const LOGOS: [string, ReactNode, string][] = [
	["App Store", <StoreAppStoreLogo key="a" />, "StoreAppStoreLogo"],
	["Google Play", <StoreGooglePlayLogo key="g" />, "StoreGooglePlayLogo"],
	["Mac App Store", <StoreMacAppStoreLogo key="m" />, "StoreMacAppStoreLogo"],
	["Galaxy Store", <StoreGalaxyStoreLogo key="x" />, "StoreGalaxyStoreLogo"],
	["AppGallery", <StoreAppGalleryLogo key="h" />, "StoreAppGalleryLogo"],
];

export const tweaks: Record<string, Tweak> = {
	logo: {
		kind: "content",
		options: LOGOS.map(([label, value, name]) => ({
			label,
			value,
			code: `<${name} />`,
			imports: { "@jotis-me/assets/logos": [name] },
		})),
	},
};
