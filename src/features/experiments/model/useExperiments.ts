import { useState } from "react";
import { experiments } from "./presets";
import type { Measurement, Trace } from "../../../shared/document";
import { evaluate } from "../lib/evaluate";
export function useExperiments(trace: Trace, measurements: Measurement[]) {
  const [activeId, setActiveId] = useState("focus");
  const [checked, setChecked] = useState(false);
  const active = experiments.find((e) => e.id === activeId)!;
  const verdict = evaluate(active, trace, measurements);
  return {
    active,
    activeId,
    checked,
    verdict,
    choose: (id: string) => {
      setActiveId(id);
      setChecked(false);
    },
    check: () => setChecked(true),
  };
}
