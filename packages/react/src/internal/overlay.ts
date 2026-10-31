// Fondo de las capas (Modal, Slideout, CommandMenu): `bg-overlay` al 70 % con desenfoque de 16px.
// `contained` la pinta dentro de su contenedor (absoluta) en vez de sobre toda la ventana, para las vistas previas.
export const OVERLAY = "z-50 flex bg-overlay/70 p-4 [backdrop-filter:var(--backdrop-blur-lg)]";
export const OVERLAY_POSITION = (contained?: boolean) => (contained ? "absolute inset-0" : "fixed inset-0");
