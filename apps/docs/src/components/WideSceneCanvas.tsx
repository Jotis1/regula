// Isla del ejemplo en 21:9 de StreamScene (`WideScene.astro`): importa la escena por nombre, como
// `CodeSnippetIsland`, para que el bundler no se lleve el índice entero de `@jotis-me/react`. Sin `scale`, el lienzo
// de 2580×1080 mide su contenedor.
import { StreamScene } from "@jotis-me/react";

export default function WideSceneCanvas() {
	return <StreamScene width={2580} variant="ending" next="Próximo directo: jueves, 20:00" />;
}
