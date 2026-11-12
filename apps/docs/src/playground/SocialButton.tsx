// SocialButton en el ejemplo interactivo (un fichero por componente: design D4): el logo, que es un nodo de
// @jotis-me/icons/logos, se elige entre opciones preparadas.
import {
	SocialAppleLogo,
	SocialAppleLogoGray,
	SocialDribbbleLogo,
	SocialDribbbleLogoGray,
	SocialFacebookLogo,
	SocialFacebookLogoGray,
	SocialFigmaLogo,
	SocialFigmaLogoGray,
	SocialGoogleLogo,
	SocialGoogleLogoGray,
	SocialXLogo,
	SocialXLogoGray,
} from "@jotis-me/icons/logos";
import type { ReactNode } from "react";
import type { Tweak } from "../lib/playground";

export { SocialButton as default } from "@jotis-me/react";

const LOGOS: [string, ReactNode, string][] = [
	["Google", <SocialGoogleLogo key="g" />, "SocialGoogleLogo"],
	["Google (gris)", <SocialGoogleLogoGray key="gg" />, "SocialGoogleLogoGray"],
	["Facebook", <SocialFacebookLogo key="f" />, "SocialFacebookLogo"],
	["Facebook (gris)", <SocialFacebookLogoGray key="fg" />, "SocialFacebookLogoGray"],
	["Apple", <SocialAppleLogo key="a" />, "SocialAppleLogo"],
	["Apple (gris)", <SocialAppleLogoGray key="ag" />, "SocialAppleLogoGray"],
	["X", <SocialXLogo key="x" />, "SocialXLogo"],
	["X (gris)", <SocialXLogoGray key="xg" />, "SocialXLogoGray"],
	["Figma", <SocialFigmaLogo key="fi" />, "SocialFigmaLogo"],
	["Figma (gris)", <SocialFigmaLogoGray key="fig" />, "SocialFigmaLogoGray"],
	["Dribbble", <SocialDribbbleLogo key="d" />, "SocialDribbbleLogo"],
	["Dribbble (gris)", <SocialDribbbleLogoGray key="dg" />, "SocialDribbbleLogoGray"],
];

export const tweaks: Record<string, Tweak> = {
	logo: {
		kind: "content",
		options: LOGOS.map(([label, value, name]) => ({
			label,
			value,
			code: `<${name} />`,
			imports: { "@jotis-me/icons/logos": [name] },
		})),
	},
};
