import type { Element, Trace, Measurement } from "../../../shared/document";
import { clamp } from "../../../shared/math";
export function measure(
  trace: Trace,
  screens: Element[],
  binCount: number,
): Measurement[] {
  return screens
    .filter((s) => s.kind === "screen")
    .map((s) => {
      const hits = trace.hits.filter((h) => h.screenId === s.id);
      const power = hits.reduce((n, h) => n + h.power, 0);
      const centroid = power
        ? hits.reduce((n, h) => n + h.position * h.power, 0) / power
        : null;
      const width =
        power && centroid !== null
          ? Math.sqrt(
              hits.reduce(
                (n, h) => n + (h.position - centroid) ** 2 * h.power,
                0,
              ) / power,
            )
          : null;
      const bins = Array.from({ length: binCount }, () => 0);
      for (const h of hits)
        bins[
          clamp(
            Math.floor((h.position / s.size + 0.5) * binCount),
            0,
            binCount - 1,
          )
        ] += h.power;
      return {
        screenId: s.id,
        hits,
        count: hits.length,
        power,
        centroid,
        width,
        bins,
      };
    });
}
