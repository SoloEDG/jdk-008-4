import type { Trace } from "../../../shared/document";
export function TraceStatus({
  trace,
  visible,
  setVisible,
  maxBounces,
  setMaxBounces,
}: {
  trace: Trace;
  visible: boolean;
  setVisible: (v: boolean) => void;
  maxBounces: number;
  setMaxBounces: (n: number) => void;
}) {
  return (
    <div className="trace-status">
      <span className="live-dot" />
      <b>实时追迹</b>
      <span>{trace.emitted} 条光线</span>
      <span>{trace.segments.length} 段路径</span>
      <label>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />{" "}
        光路
      </label>
      <label>
        交互上限{" "}
        <select
          value={maxBounces}
          onChange={(e) => setMaxBounces(Number(e.target.value))}
        >
          <option>8</option>
          <option>16</option>
          <option>32</option>
        </select>
      </label>
      {trace.warnings.map((w) => (
        <span className="warning" key={w}>
          {w}
        </span>
      ))}
    </div>
  );
}
