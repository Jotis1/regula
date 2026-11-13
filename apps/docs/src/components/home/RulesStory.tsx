// Historia de las reglas en escritorio (design D4): a la izquierda, los seis pasos con `ProgressSteps` vertical
// navegable y los controles; a la derecha, la pantalla de Pecunia con las reglas aplicadas hasta el paso actual. Isla
// `client:visible`: por debajo de `lg` no se ve (la portada enseña la tira de `RulesStrip`) y no llega a hidratarse.
import { Button, PaginationDots, ProgressSteps, TransparencyGrid } from "@jotis-me/react";
import { ArrowRight } from "@untitledui/icons";
import { useState } from "react";
import { PecuniaForm } from "./PecuniaForm";
import { STORY, stageNote } from "./story";

const LAST = STORY.length - 1;
const STEPS = STORY.map((s) => ({ title: s.title }));

export default function RulesStory() {
	const [step, setStep] = useState(0);
	const go = (n: number) => setStep(Math.max(0, Math.min(LAST, n)));

	return (
		<div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-start gap-14">
			<div className="flex flex-col gap-6">
				<ProgressSteps
					type="icons-text"
					size="sm"
					orientation="vertical"
					aria-label="La pantalla, regla a regla"
					steps={STEPS}
					current={step}
					onChange={go}
				>
					{(at) => (
						<div className="flex max-w-[440px] flex-col gap-2 pb-1">
							<p className="text-md text-tertiary">{STORY[at]?.text}</p>
							<p className="flex items-start gap-2 text-sm font-medium text-secondary">
								<ArrowRight
									size={16}
									className="mt-0.5 flex-none text-fg-brand-primary"
									aria-hidden="true"
								/>
								<span>{STORY[at]?.fix}</span>
							</p>
						</div>
					)}
				</ProgressSteps>
				<div className="flex flex-wrap items-center gap-4">
					<Button hierarchy="secondary" disabled={step === 0} onClick={() => go(step - 1)}>
						Anterior
					</Button>
					<PaginationDots
						total={STORY.length}
						current={step + 1}
						onChange={(page) => go(page - 1)}
						aria-label="Pasos de la historia"
						labels={{ goTo: (n, total) => `Ir al paso ${n} de ${total}` }}
					/>
					<Button
						hierarchy="secondary"
						iconTrailing={ArrowRight}
						onClick={() => go(step === LAST ? 0 : step + 1)}
					>
						{step === LAST ? "Volver a empezar" : "Siguiente regla"}
					</Button>
				</div>
			</div>
			<figure className="sticky top-6 m-0 flex flex-col gap-3">
				<TransparencyGrid size="sm" className="overflow-hidden rounded-xl border border-secondary">
					<div className="p-10">
						<PecuniaForm step={step} />
					</div>
				</TransparencyGrid>
				<figcaption className="text-xs text-quaternary">{stageNote(step)}</figcaption>
			</figure>
		</div>
	);
}
