import type { MetadataRoute } from "next";

// NutriNani es una app clínica privada: no hay páginas públicas que valga la pena
// indexar, y no queremos que /login (ni URLs con ?next=... que revelen rutas
// internas) aparezcan en resultados de búsqueda.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
