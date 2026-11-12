// Logos de mentira para los tests: `@jotis-me/assets` depende de este paquete, así que no se puede importar desde aquí.
// Pintan un SVG con 20×20 y una marca (`data-logo`) para reconocerlo.
function stub(name: string) {
	// biome-ignore lint/correctness/noComponentHookFactories: fábrica de logos de prueba, se llama una vez por logo al cargar el módulo
	return function Logo({ size = 20 }: { size?: number }) {
		return (
			<svg data-logo={name} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
				<circle cx="10" cy="10" r="8" fill="currentColor" />
			</svg>
		);
	};
}

export const SocialAppleLogoGray = stub("apple-gray");
export const SocialFacebookLogoGray = stub("facebook-gray");
export const SocialGoogleLogo = stub("google");
export const SocialGoogleLogoGray = stub("google-gray");
export const StoreAppStoreLogo = stub("app-store");
export const StoreGooglePlayOutlineLogo = stub("google-play-outline");
