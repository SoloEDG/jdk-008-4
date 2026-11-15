import { useMemo, useState } from "react";
import type { Element, Trace } from "../../../shared/document";
import { measure } from "../lib/measure";
export function useDetector(trace: Trace, elements: Element[]) {
  const [screenId, setScreenId] = useState("screen-1");
  const [binCount, setBinCount] = useState(32);
  const measurements = useMemo(
    () => measure(trace, elements, binCount),
    [trace, elements, binCount],
  );
  const current =
    measurements.find((m) => m.screenId === screenId) ?? measurements[0];
  return {
    measurements,
    current,
    screenId: current?.screenId ?? "",
    setScreenId,
    binCount,
    setBinCount,
  };
}
