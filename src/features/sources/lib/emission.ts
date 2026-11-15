import type { Source, Vec } from "../../../shared/document";
import { add, direction, mul } from "../../../shared/math";
export interface Emission {
  rayId: string;
  origin: Vec;
  direction: Vec;
  sourceId: string;
  wavelength: number;
  power: number;
}
export function emit(s: Source): Emission[] {
  if (!s.enabled) return [];
  const count = Math.max(1, Math.round(s.rays));
  return Array.from({ length: count }, (_, i) => ({
    rayId: `${s.id}:${i}`,
    origin: add(
      s,
      mul(
        direction(s.angle + 90),
        count === 1 ? 0 : (i / (count - 1) - 0.5) * s.spread,
      ),
    ),
    direction: direction(s.angle),
    sourceId: s.id,
    wavelength: s.wavelength,
    power: s.power / count,
  }));
}
export function sourceSummary(ss: Source[]) {
  return {
    active: ss.filter((s) => s.enabled).length,
    rays: ss.reduce((n, s) => n + (s.enabled ? s.rays : 0), 0),
    power: ss.reduce((n, s) => n + (s.enabled ? s.power : 0), 0),
  };
}
