// Vista previa de SocialButton, SocialButtonGroup y AppStoreBadge. Va en su propio fichero: los logos
// (`@jotis-me/assets/logos`) solo los cargan estas páginas.

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
	SocialXLogoGray,
	StoreAppGalleryLogo,
	StoreAppGalleryOutlineLogo,
	StoreAppStoreLogo,
	StoreAppStoreOutlineLogo,
	StoreGalaxyStoreLogo,
	StoreGalaxyStoreOutlineLogo,
	StoreGooglePlayLogo,
	StoreGooglePlayOutlineLogo,
	StoreMacAppStoreLogo,
	StoreMacAppStoreOutlineLogo,
} from "@jotis-me/assets/logos";
import {
	type AppStore,
	AppStoreBadge,
	SocialButton,
	SocialButtonGroup,
	type SocialButtonTheme,
	type SocialProvider,
} from "@jotis-me/react";
import type { ReactNode } from "react";
import { row, stack } from "./actions";

/**
 * El logo de cada red según el tema: en `brand`, los grises (salen en blanco) salvo Google y Figma; en `color`, los de
 * color, salvo Apple y X, que toman el color del texto y así se ven en oscuro; en `gray`, los grises.
 */
export const SOCIAL_LOGOS: Record<SocialProvider, Record<SocialButtonTheme, ReactNode>> = {
	google: { brand: <SocialGoogleLogo />, color: <SocialGoogleLogo />, gray: <SocialGoogleLogoGray /> },
	facebook: {
		brand: <SocialFacebookLogoGray />,
		color: <SocialFacebookLogo />,
		gray: <SocialFacebookLogoGray />,
	},
	apple: { brand: <SocialAppleLogoGray />, color: <SocialAppleLogoGray />, gray: <SocialAppleLogoGray /> },
	x: { brand: <SocialXLogoGray />, color: <SocialXLogoGray />, gray: <SocialXLogoGray /> },
	figma: { brand: <SocialFigmaLogo />, color: <SocialFigmaLogo />, gray: <SocialFigmaLogoGray /> },
	dribbble: {
		brand: <SocialDribbbleLogoGray />,
		color: <SocialDribbbleLogo />,
		gray: <SocialDribbbleLogoGray />,
	},
};
// SocialAppleLogo (negro) existe, pero en oscuro no se vería: por eso Apple va siempre con el gris
void SocialAppleLogo;

const providers: SocialProvider[] = ["google", "facebook", "apple", "x", "figma", "dribbble"];
const themes: SocialButtonTheme[] = ["brand", "color", "gray"];

/** Las seis redes en los tres temas, con texto y solo logo; abajo, `lg`. */
export function SocialButtonExample() {
	return (
		<div className={stack}>
			{themes.map((theme) => (
				<div key={theme} className={row}>
					{providers.map((p) => (
						<SocialButton key={p} provider={p} theme={theme} logo={SOCIAL_LOGOS[p][theme]} />
					))}
					{providers.map((p) => (
						<SocialButton
							key={`${p}-i`}
							provider={p}
							theme={theme}
							iconOnly
							logo={SOCIAL_LOGOS[p][theme]}
						/>
					))}
				</div>
			))}
			<div className={row}>
				<SocialButton provider="google" theme="color" size="lg" logo={SOCIAL_LOGOS.google.color} />
				<SocialButton provider="apple" size="lg" logo={SOCIAL_LOGOS.apple.brand} />
				<SocialButton provider="dribbble" size="lg" iconOnly logo={SOCIAL_LOGOS.dribbble.brand} />
			</div>
		</div>
	);
}

/** En columna y en fila, en los tres temas, como el Figma. */
export function SocialButtonGroupExample() {
	const trio: SocialProvider[] = ["google", "facebook", "apple"];
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
			{themes.map((theme) => (
				<div key={theme} className={stack}>
					<SocialButtonGroup label="Entrar con">
						{trio.map((p) => (
							<SocialButton key={p} provider={p} theme={theme} logo={SOCIAL_LOGOS[p][theme]} />
						))}
					</SocialButtonGroup>
					<SocialButtonGroup layout="row" label="Entrar con">
						{trio.map((p) => (
							<SocialButton
								key={p}
								provider={p}
								theme={theme}
								iconOnly
								logo={SOCIAL_LOGOS[p][theme]}
							/>
						))}
					</SocialButtonGroup>
				</div>
			))}
		</div>
	);
}

const STORE_BADGES: Record<AppStore, [ReactNode, ReactNode]> = {
	"google-play": [<StoreGooglePlayLogo key="f" />, <StoreGooglePlayOutlineLogo key="o" />],
	"app-store": [<StoreAppStoreLogo key="f" />, <StoreAppStoreOutlineLogo key="o" />],
	"mac-app-store": [<StoreMacAppStoreLogo key="f" />, <StoreMacAppStoreOutlineLogo key="o" />],
	"galaxy-store": [<StoreGalaxyStoreLogo key="f" />, <StoreGalaxyStoreOutlineLogo key="o" />],
	"app-gallery": [<StoreAppGalleryLogo key="f" />, <StoreAppGalleryOutlineLogo key="o" />],
};

/** Las cinco tiendas, en relleno y en contorno; abajo, `lg`. */
export function AppStoreBadgeExample() {
	const stores = Object.keys(STORE_BADGES) as AppStore[];
	return (
		<div className={stack}>
			{[0, 1].map((style) => (
				<div key={style} className={row}>
					{stores.map((s) => (
						<AppStoreBadge key={s} store={s} href="#" logo={STORE_BADGES[s][style]} />
					))}
				</div>
			))}
			<div className={row}>
				<AppStoreBadge store="app-store" href="#" size="lg" logo={STORE_BADGES["app-store"][0]} />
				<AppStoreBadge store="google-play" href="#" size="lg" logo={STORE_BADGES["google-play"][0]} />
			</div>
		</div>
	);
}
