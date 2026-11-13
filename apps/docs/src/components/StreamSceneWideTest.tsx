// Isla de la página de prueba en 21:9 (`/visual/stream-scene-wide/`): las cuatro variantes de StreamScene con
// `width={2580}` y `scale={4/3}`, que miden 3440×1440, una debajo de otra. La cuenta atrás va en pausa para que la
// captura no cambie de un segundo a otro.
import { StreamScene, type StreamSceneVariant } from "@jotis-me/react";

const SCENES: { variant: StreamSceneVariant; seconds?: number; countdownLabel?: string; next?: string }[] = [
	{ variant: "starting", seconds: 300, countdownLabel: "Para empezar" },
	{ variant: "brb", seconds: 480, countdownLabel: "Vuelvo en" },
	{ variant: "ending", next: "Próximo directo: jueves, 20:00" },
	{ variant: "offline", next: "Lunes, miércoles y viernes · 20:00" },
];

export default function StreamSceneWideTest() {
	return (
		<div className="flex flex-col">
			{SCENES.map((scene) => (
				<div key={scene.variant} data-scene={scene.variant}>
					<StreamScene {...scene} paused width={2580} scale={4 / 3} />
				</div>
			))}
		</div>
	);
}
