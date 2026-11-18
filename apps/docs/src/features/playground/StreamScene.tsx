// StreamScene en el ejemplo interactivo: un fichero por componente para que cada página cargue solo el suyo (design D4).
// The headline is an `<h2>` here: the page of the guide already has its `<h1>` (SEO-004). The code of the example does
// not show it: in a scene for OBS, the headline keeps its `<h1>`.
import { StreamScene, type StreamSceneProps } from "@jotis-me/react";

export function Component(props: StreamSceneProps) {
	return <StreamScene headingLevel={2} {...props} />;
}
