import { useMemo, useState } from "react";
import type { Element, Source } from "../../../shared/document";
import { traceScene } from "../lib/trace";
export function useOptics(elements: Element[], sources: Source[]) {
  const [visible, setVisible] = useState(true);
  const [maxBounces, setMaxBounces] = useState(16);
  const trace = useMemo(
    () => traceScene(elements, sources, maxBounces),
    [elements, sources, maxBounces],
  );
  return { trace, visible, setVisible, maxBounces, setMaxBounces };
}
