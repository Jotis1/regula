// Isla de la página a tamaño real (design §10): pinta un lienzo de Stream con `scale={1}`, que mide lo mismo que
// en OBS o en Twitch. Es isla porque la cuenta atrás de StreamScene corre en el cliente.
import { ChannelBanner, StreamScene } from "@jotis-me/react";
import type { ComponentType } from "react";

const canvases: Record<string, ComponentType<Record<string, unknown>>> = {
	StreamScene: StreamScene as ComponentType<Record<string, unknown>>,
	ChannelBanner: ChannelBanner as ComponentType<Record<string, unknown>>,
};

export default function FullCanvas({ name, props }: { name: string; props: Record<string, unknown> }) {
	const Canvas = canvases[name];
	return Canvas ? <Canvas {...props} scale={1} /> : null;
}
