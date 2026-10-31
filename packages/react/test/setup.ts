import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Entorno de tests de React: activa act() también fuera de render() de Testing Library (p. ej. al hidratar)
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());
