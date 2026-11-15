import { useState } from "react";
import type { Source, Vec } from "../../../shared/document";
import { clamp } from "../../../shared/math";
export function initialSources(): Source[] {
  return [
    {
      id: "source-1",
      name: "平行光源",
      x: 130,
      y: 300,
      angle: 0,
      spread: 100,
      rays: 7,
      wavelength: 532,
      power: 1,
      enabled: true,
    },
  ];
}
export function useSources() {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [selected, setSelected] = useState("source-1");
  const patch = (id: string, p: Partial<Source>) =>
    setSources((ss) => ss.map((s) => (s.id === id ? { ...s, ...p } : s)));
  const add = () => {
    const s = {
      ...initialSources()[0],
      id: crypto.randomUUID(),
      name: `光源 ${sources.length + 1}`,
      y: 200,
    };
    setSources((ss) => [...ss, s]);
    setSelected(s.id);
  };
  return {
    sources,
    selected,
    setSelected,
    patch,
    add,
    remove: (id: string) => {
      setSources((ss) => ss.filter((s) => s.id !== id));
      if (selected === id)
        setSelected(sources.find((s) => s.id !== id)?.id ?? "");
    },
    move: (id: string, p: Vec) =>
      patch(id, {
        x: clamp(Math.round(p.x), 20, 980),
        y: clamp(Math.round(p.y), 20, 580),
      }),
    replace: (ss: Source[]) => {
      setSources(ss);
      setSelected(ss[0]?.id ?? "");
    },
  };
}
