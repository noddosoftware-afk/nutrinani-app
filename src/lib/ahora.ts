import "server-only";
import { cache } from "react";

/**
 * Marca de tiempo "ahora" cacheada por request — evita llamar Date.now() de forma
 * impura directamente en el cuerpo de un Server Component.
 */
export const ahoraMs = cache(() => Date.now());
