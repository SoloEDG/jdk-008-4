import type { Measurement, Trace } from "../../../shared/document";
import type { Experiment } from "../model/presets";
export interface Verdict {
  passed: boolean;
  message: string;
  progress: number;
}
export function evaluate(
  experiment: Experiment,
  trace: Trace,
  measurements: Measurement[],
): Verdict {
  const m = measurements.find((m) => m.screenId === "screen-1");
  if (!m || m.count === 0)
    return {
      passed: false,
      message: "尚未接收到光线，调整光路后重试",
      progress: 0,
    };
  const relevant = m.hits.filter((h) =>
    experiment.rule === "focus"
      ? h.events.includes("lens")
      : experiment.rule === "mirror"
        ? h.events.includes("mirror")
        : h.events.includes("prism-enter") && h.events.includes("prism-exit"),
  );
  const power = relevant.reduce((sum, h) => sum + h.power, 0);
  const centroid = power
    ? relevant.reduce((sum, h) => sum + h.position * h.power, 0) / power
    : 0;
  const width = power
    ? Math.sqrt(
        relevant.reduce(
          (sum, h) => sum + (h.position - centroid) ** 2 * h.power,
          0,
        ) / power,
      )
    : Infinity;
  let passed = false;
  let progress = 0;
  if (experiment.rule === "focus") {
    passed = relevant.length >= 5 && width <= 3;
    progress = Math.min(relevant.length / 5, Math.max(0, 1 - width / 50));
  }
  if (experiment.rule === "mirror") {
    passed = relevant.length >= 5 && power >= 0.7;
    progress = Math.min(relevant.length / 5, power / 0.7);
  }
  if (experiment.rule === "prism") {
    passed = relevant.length >= 5 && Math.abs(centroid) >= 8;
    progress = Math.min(relevant.length / 5, Math.abs(centroid) / 8);
  }
  return {
    passed,
    message: passed
      ? "实验达成！当前测量满足所有目标"
      : "继续调整器件，观察实时测量结果",
    progress: Math.min(1, progress),
  };
}
