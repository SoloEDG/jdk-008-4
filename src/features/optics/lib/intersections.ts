import type { Element, Vec } from "../../../shared/document";
import { endpoints, triangle } from "../../bench";
import { add, sub, mul, cross, unit } from "../../../shared/math";
export interface Intersection {
  distance: number;
  point: Vec;
  normal: Vec;
  element: Element;
}
export function segmentHit(
  origin: Vec,
  dir: Vec,
  a: Vec,
  b: Vec,
): { distance: number; point: Vec; normal: Vec } | null {
  const edge = sub(b, a),
    den = cross(dir, edge);
  if (Math.abs(den) < 1e-9) return null;
  const diff = sub(a, origin),
    t = cross(diff, edge) / den,
    u = cross(diff, dir) / den;
  if (t < 1e-5 || u < 0 || u > 1) return null;
  return {
    distance: t,
    point: add(origin, mul(dir, t)),
    normal: unit({ x: -edge.y, y: edge.x }),
  };
}
export function nearest(
  origin: Vec,
  dir: Vec,
  elements: Element[],
): Intersection | null {
  let best: Intersection | null = null;
  for (const e of elements) {
    if (!e.enabled) continue;
    const pts = e.kind === "prism" ? triangle(e) : endpoints(e);
    const edges =
      e.kind === "prism"
        ? pts.map((p, i) => [p, pts[(i + 1) % 3]])
        : [[pts[0], pts[1]]];
    for (const [a, b] of edges) {
      const hit = segmentHit(origin, dir, a, b);
      if (hit && (!best || hit.distance < best.distance))
        best = { ...hit, element: e };
    }
  }
  return best;
}
export function insidePrism(p: Vec, e: Element): boolean {
  const v = triangle(e);
  const signs = v.map((a, i) => cross(sub(v[(i + 1) % 3], a), sub(p, a)));
  return signs.every((s) => s >= 0) || signs.every((s) => s <= 0);
}
