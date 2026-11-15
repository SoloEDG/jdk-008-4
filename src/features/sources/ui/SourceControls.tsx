import type { Source } from "../../../shared/document";
export function SourceControls({
  source: s,
  patch,
}: {
  source: Source | undefined;
  patch: (id: string, p: Partial<Source>) => void;
}) {
  if (!s) return <p className="muted">添加一个光源开始实验</p>;
  const field = (
    label: string,
    key: "angle" | "spread" | "rays" | "wavelength" | "power",
    min: number,
    max: number,
    step = 1,
  ) => (
    <label className="slider-label">
      <span>
        {label}
        <b>
          {s[key]}
          {key === "wavelength" ? " nm" : key === "angle" ? "°" : ""}
        </b>
      </span>
      <input
        data-testid={`source-${key}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={s[key]}
        onChange={(e) => patch(s.id, { [key]: Number(e.target.value) })}
      />
    </label>
  );
  return (
    <section className="source-controls">
      {field("光束方向", "angle", -180, 180)}
      {field("光束宽度", "spread", 0, 180)}
      {field("采样光线", "rays", 1, 21)}
      {field("波长", "wavelength", 380, 750)}
      {field("总功率 / W", "power", 0.1, 5, 0.1)}
      <label className="toggle-row">
        发射光线
        <input
          data-testid="source-enabled"
          type="checkbox"
          checked={s.enabled}
          onChange={(e) => patch(s.id, { enabled: e.target.checked })}
        />
      </label>
    </section>
  );
}
