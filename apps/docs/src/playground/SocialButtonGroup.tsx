// SocialButtonGroup en el ejemplo interactivo (un fichero por componente: design D4): sus hijos son botones, que se
// eligen entre opciones preparadas.
import { SocialAppleLogoGray, SocialFacebookLogo, SocialGoogleLogo } from "@jotis-me/assets/logos";
import { SocialButton } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { SocialButtonGroup as default } from "@jotis-me/react";

const LOGOS = { "@jotis-me/assets/logos": ["SocialAppleLogoGray", "SocialFacebookLogo", "SocialGoogleLogo"] };

export const tweaks: Record<string, Tweak> = {
	children: {
		kind: "content",
		options: [
			{
				label: "Google, Facebook y Apple",
				value: (
					<>
						<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />
						<SocialButton provider="facebook" theme="color" logo={<SocialFacebookLogo />} />
						<SocialButton provider="apple" theme="color" logo={<SocialAppleLogoGray />} />
					</>
				),
				code: [
					'<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />',
					'<SocialButton provider="facebook" theme="color" logo={<SocialFacebookLogo />} />',
					'<SocialButton provider="apple" theme="color" logo={<SocialAppleLogoGray />} />',
				].join("\n\t"),
				imports: { "@jotis-me/react": ["SocialButton"], ...LOGOS },
			},
			{
				label: "Solo Google",
				value: <SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />,
				code: '<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />',
				imports: {
					"@jotis-me/react": ["SocialButton"],
					"@jotis-me/assets/logos": ["SocialGoogleLogo"],
				},
			},
		],
	},
};
