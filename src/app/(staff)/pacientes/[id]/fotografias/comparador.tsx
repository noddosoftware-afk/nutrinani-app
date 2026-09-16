"use client";

import { useMemo, useState } from "react";

interface Foto {
  id: string;
  url: string;
  fecha_captura: string;
  vista: string;
  observaciones: string | null;
}

export function ComparadorFotos({ fotos }: { fotos: Foto[] }) {
  const ordenadas = useMemo(
    () => [...fotos].sort((a, b) => a.fecha_captura.localeCompare(b.fecha_captura)),
    [fotos]
  );
  const [idA, setIdA] = useState(ordenadas[0]?.id);
  const [idB, setIdB] = useState(ordenadas[ordenadas.length - 1]?.id);
  const [slider, setSlider] = useState(50);

  const fotoA = ordenadas.find((f) => f.id === idA);
  const fotoB = ordenadas.find((f) => f.id === idB);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-700">Galería cronológica</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {ordenadas.map((f) => (
            <figure key={f.id} className="w-32 shrink-0 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.vista} className="h-40 w-32 rounded-md object-cover" />
              <figcaption className="mt-1 text-xs text-stone-500">
                {new Date(f.fecha_captura).toLocaleDateString("es-MX")} · {f.vista}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-stone-700">Comparador antes / después</h3>
        <div className="flex flex-wrap gap-3">
          <SelectorFoto label="Antes" fotos={ordenadas} valor={idA} onChange={setIdA} />
          <SelectorFoto label="Después" fotos={ordenadas} valor={idB} onChange={setIdB} />
        </div>

        {fotoA && fotoB && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoA.url} alt="Antes" className="w-full rounded-lg object-cover" />
                <figcaption className="mt-1 text-center text-xs text-stone-500">
                  {new Date(fotoA.fecha_captura).toLocaleDateString("es-MX")}
                </figcaption>
              </figure>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoB.url} alt="Después" className="w-full rounded-lg object-cover" />
                <figcaption className="mt-1 text-center text-xs text-stone-500">
                  {new Date(fotoB.fecha_captura).toLocaleDateString("es-MX")}
                </figcaption>
              </figure>
            </div>

            <div>
              <p className="mb-1 text-xs text-stone-500">Deslizador de superposición</p>
              <div className="relative aspect-[3/4] max-w-sm overflow-hidden rounded-lg border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoB.url} alt="Después" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoA.url} alt="Antes" className="h-full w-full max-w-none object-cover" style={{ width: `${10000 / slider}%` }} />
                </div>
                <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${slider}%` }} />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="mt-2 w-full max-w-sm"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SelectorFoto({
  label,
  fotos,
  valor,
  onChange,
}: {
  label: string;
  fotos: Foto[];
  valor?: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="text-sm">
      <span className="block text-stone-700">{label}</span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
      >
        {fotos.map((f) => (
          <option key={f.id} value={f.id}>
            {new Date(f.fecha_captura).toLocaleDateString("es-MX")} · {f.vista}
          </option>
        ))}
      </select>
    </label>
  );
}
