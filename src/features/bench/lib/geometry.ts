import type { Element, Vec } from "../../../shared/document";
import { add, direction, mul, rotate } from "../../../shared/math";
export function endpoints(e: Element): [Vec, Vec] {
  const t = direction(e.angle + 90);
  return [add(e, mul(t, -e.size / 2)), add(e, mul(t, e.size / 2))];
}
export function triangle(e: Element): Vec[] {
  return [
    { x: -e.size * 0.48, y: -e.size * 0.55 },
    { x: -e.size * 0.48, y: e.size * 0.55 },
    { x: e.size * 0.48, y: 0 },
  ].map((p) => add(e, rotate(p, e.angle)));
}
export function shapePath(e: Element): string {
  const p = e.kind === "prism" ? triangle(e) : endpoints(e);
  return (
    p.map((v, i) => `${i ? "L" : "M"}${v.x},${v.y}`).join(" ") +
    (e.kind === "prism" ? " Z" : "")
  );
}
export function pointerToWorld(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): Vec {
  return {
    x: ((clientX - rect.left) * 1000) / rect.width,
    y: ((clientY - rect.top) * 600) / rect.height,
  };
}
