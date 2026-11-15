import { useState } from "react";
import type { Element, ElementKind, Vec } from "../../../shared/document";
import { clamp } from "../../../shared/math";
import { createElement, initialElements } from "./catalog";
export function useBench() {
  const [elements, setElements] = useState<Element[]>(initialElements);
  const [selected, setSelected] = useState<string | null>("lens-1");
  const [grid, setGrid] = useState(true);
  const [snap, setSnap] = useState(false);
  const patch = (id: string, p: Partial<Element>) =>
    setElements((es) => es.map((e) => (e.id === id ? { ...e, ...p } : e)));
  const move = (id: string, p: Vec) => {
    const step = snap ? 20 : 1;
    patch(id, {
      x: clamp(Math.round(p.x / step) * step, 20, 980),
      y: clamp(Math.round(p.y / step) * step, 20, 580),
    });
  };
  const add = (kind: ElementKind, p?: Vec) => {
    const e = createElement(
      kind,
      clamp(p?.x ?? 420 + (elements.length % 16) * 25, 20, 980),
      clamp(p?.y ?? 300, 20, 580),
    );
    setElements((es) => [...es, e]);
    setSelected(e.id);
  };
  const remove = () => {
    setElements((es) => es.filter((e) => e.id !== selected));
    setSelected(null);
  };
  return {
    elements,
    selected,
    setSelected,
    patch,
    move,
    add,
    remove,
    grid,
    setGrid,
    snap,
    setSnap,
    replace: (es: Element[]) => {
      setElements(es);
      setSelected(es[0]?.id ?? null);
    },
  };
}
