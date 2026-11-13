// Tira de seis diapositivas para la página de prueba `visual/carousel-strip` (e2e sin JavaScript). Las diapositivas son
// nodos React, así que no se pueden armar en un `.astro`.
import { Carousel } from "@jotis-me/react";

export default function CarouselStripTest() {
	return (
		<Carousel
			type="strip"
			aria-label="Novedades"
			slides={[1, 2, 3, 4, 5, 6].map((n) => (
				<div
					key={n}
					className="flex h-40 items-center justify-center rounded-xl bg-secondary font-semibold text-secondary"
				>
					Diapositiva {n}
				</div>
			))}
		/>
	);
}
