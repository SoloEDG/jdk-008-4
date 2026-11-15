import type { Element, Measurement } from "../../../shared/document";
import { IntensityPlot } from "./IntensityPlot";
export function DetectorPanel({
  elements,
  current,
  screenId,
  setScreenId,
  binCount,
  setBinCount,
}: {
  elements: Element[];
  current: Measurement | undefined;
  screenId: string;
  setScreenId: (s: string) => void;
  binCount: number;
  setBinCount: (n: number) => void;
}) {
  const fmt = (n: number | null | undefined) =>
    n == null ? "—" : n.toFixed(2);
  return (
    <section className="detector-panel">
      <div className="section-label">
        屏幕测量 <span>LIVE</span>
      </div>
      <select
        data-testid="detector-screen"
        value={screenId}
        onChange={(e) => setScreenId(e.target.value)}
      >
        {elements
          .filter((e) => e.kind === "screen")
          .map((s, i) => (
            <option key={s.id} value={s.id}>
              {s.name} {i + 1}
            </option>
          ))}
      </select>
      <IntensityPlot measurement={current} />
      <div className="metrics">
        <div>
          <small>接收功率</small>
          <b data-testid="detector-power">
            {fmt(current?.power)} <em>W</em>
          </b>
        </div>
        <div>
          <small>光斑 RMS</small>
          <b data-testid="detector-width">
            {fmt(current?.width)} <em>mm</em>
          </b>
        </div>
        <div>
          <small>质心偏移</small>
          <b data-testid="detector-centroid">
            {fmt(current?.centroid)} <em>mm</em>
          </b>
        </div>
        <div>
          <small>命中光线</small>
          <b data-testid="detector-count">{current?.count ?? 0}</b>
        </div>
      </div>
      <label className="toggle-row">
        采样分箱
        <select
          value={binCount}
          onChange={(e) => setBinCount(Number(e.target.value))}
        >
          <option>16</option>
          <option>32</option>
          <option>64</option>
        </select>
      </label>
    </section>
  );
}
