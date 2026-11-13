// Historia de las reglas en móvil (design D4): `Carousel` `strip` con un fotograma por paso. La tira y su
// desplazamiento son HTML y CSS del servidor, así que se recorre con el dedo también sin JavaScript; hidratada
// (`client:visible`), además mueve los puntos. La pantalla de cada fotograma es una ilustración: va inerte, y lo que
// cambia lo cuenta el texto de debajo.
import { Carousel, TransparencyGrid } from "@jotis-me/react";
import { ArrowRight } from "@untitledui/icons";
import { PecuniaForm } from "./PecuniaForm";
import { STORY, stepLabel } from "./story";

export default function RulesStrip() {
	return (
		<Carousel
			type="strip"
			aria-label="La pantalla, regla a regla"
			slideWidth={300}
			slides={STORY.map((s, i) => (
				<div key={s.title} data-story-frame={i} className="flex flex-col gap-3">
					<TransparencyGrid
						size="sm"
						aria-hidden="true"
						inert
						className="overflow-hidden rounded-xl border border-secondary"
					>
						<div className="p-3">
							<PecuniaForm step={i} compact />
						</div>
					</TransparencyGrid>
					<div className="flex flex-col gap-1 px-1">
						<span className="text-xs font-semibold text-quaternary">{stepLabel(i)}</span>
						<h3 className="m-0 text-md font-semibold text-primary">{s.title}</h3>
						<p className="m-0 text-sm text-tertiary">{s.text}</p>
						<p className="m-0 flex items-start gap-2 text-sm font-medium text-secondary">
							<ArrowRight
								size={16}
								className="mt-0.5 flex-none text-fg-brand-primary"
								aria-hidden="true"
							/>
							<span>{i === 0 ? `${s.fix} Desliza.` : s.fix}</span>
						</p>
					</div>
				</div>
			))}
		/>
	);
}
