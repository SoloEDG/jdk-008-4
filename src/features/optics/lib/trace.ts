import type { Element, Source, Trace, Vec } from "../../../shared/document";
import { emit } from "../../sources";
import { add, mul, dot, direction, sub } from "../../../shared/math";
import { nearest, insidePrism } from "./intersections";
import { reflect, refract, lens } from "./interactions";
function exitDistance(p: Vec, d: Vec) {
  const ts = [
    d.x > 0 ? (1000 - p.x) / d.x : d.x < 0 ? -p.x / d.x : Infinity,
    d.y > 0 ? (600 - p.y) / d.y : d.y < 0 ? -p.y / d.y : Infinity,
  ];
  return Math.max(0, Math.min(...ts.filter((t) => t >= 0)));
}
export function traceScene(
  elements: Element[],
  sources: Source[],
  maxBounces = 16,
): Trace {
  const result: Trace = {
    segments: [],
    hits: [],
    warnings: [],
    emitted: 0,
    escaped: 0,
  };
  for (const emission of sources.flatMap(emit)) {
    result.emitted++;
    let p = emission.origin,
      d = emission.direction,
      terminated = false;
    const events: string[] = [];
    for (let step = 0; step < maxBounces; step++) {
      const hit = nearest(p, d, elements);
      const edge = exitDistance(p, d);
      if (!hit || hit.distance > edge) {
        result.segments.push({
          from: p,
          to: add(p, mul(d, edge)),
          sourceId: emission.sourceId,
          wavelength: emission.wavelength,
          power: emission.power,
          event: "escape",
        });
        result.escaped++;
        terminated = true;
        break;
      }
      const e = hit.element;
      result.segments.push({
        from: p,
        to: hit.point,
        sourceId: emission.sourceId,
        wavelength: emission.wavelength,
        power: emission.power,
        event: e.kind,
        opticId: e.id,
      });
      if (e.kind === "screen") {
        const tangent = direction(e.angle + 90);
        result.hits.push({
          screenId: e.id,
          sourceId: emission.sourceId,
          position: dot(sub(hit.point, e), tangent),
          power: emission.power,
          wavelength: emission.wavelength,
          rayId: emission.rayId,
          events: [...events],
        });
        terminated = true;
        break;
      }
      if (e.kind === "mirror") {
        events.push("mirror");
        d = reflect(d, hit.normal);
      }
      if (e.kind === "lens") {
        events.push("lens");
        d = lens(d, hit.point, e);
      }
      if (e.kind === "prism") {
        const inside = insidePrism(p, e);
        const out = refract(
          d,
          hit.normal,
          inside ? e.index : 1,
          inside ? 1 : e.index,
        );
        events.push(
          out ? (inside ? "prism-exit" : "prism-enter") : "total-reflection",
        );
        d = out ?? reflect(d, hit.normal);
      }
      p = add(hit.point, mul(d, 0.001));
    }
    if (!terminated) result.warnings.push("部分光线达到交互上限，已停止追迹");
  }
  result.warnings = [...new Set(result.warnings)];
  return result;
}
