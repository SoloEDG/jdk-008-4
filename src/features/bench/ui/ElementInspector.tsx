import type { Element } from "../../../shared/document";
export function ElementInspector({
  element: e,
  patch,
  remove,
}: {
  element: Element | undefined;
  patch: (id: string, p: Partial<Element>) => void;
  remove: () => void;
}) {
  if (!e) return <div className="empty-inspector">点击画布器件查看参数</div>;
  const field = (
    label: string,
    key: "x" | "y" | "angle" | "size" | "focal" | "index",
    min: number,
    max: number,
    step = 1,
  ) => (
    <label className="numeric-field">
      {label}
      <input
        data-testid={`element-${key}`}
        type="number"
        min={min}
        max={max}
        step={step}
        value={e[key]}
        onChange={(ev) => {
          const n = Number(ev.target.value);
          if (Number.isFinite(n))
            patch(e.id, { [key]: Math.max(min, Math.min(max, n)) });
        }}
      />
    </label>
  );
  return (
    <section>
      <div className="section-label">
        器件属性 <span>{e.kind.toUpperCase()}</span>
      </div>
      <div className="inspector-title">
        <b>{e.name}</b>
        <button
          data-testid="delete-element"
          className="icon-btn danger"
          onClick={remove}
        >
          删除
        </button>
      </div>
      <div className="field-pair">
        {field("位置 X / mm", "x", 20, 980)}
        {field("位置 Y / mm", "y", 20, 580)}
      </div>
      {field("光轴角度 / °", "angle", -180, 180)}
      {field("有效口径 / mm", "size", 30, 500)}
      {e.kind === "lens" && field("焦距 / mm", "focal", 30, 600)}
      {e.kind === "prism" && field("折射率 n", "index", 1.01, 2.5, 0.01)}
      <label className="toggle-row">
        参与光路
        <input
          data-testid="element-enabled"
          type="checkbox"
          checked={e.enabled}
          onChange={(ev) => patch(e.id, { enabled: ev.target.checked })}
        />
      </label>
    </section>
  );
}
