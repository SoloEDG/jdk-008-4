import type { Source } from "../../../shared/document";
import { color } from "../../../shared/math";
export function SourcePanel({
  sources,
  selected,
  select,
  add,
  remove,
}: {
  sources: Source[];
  selected: string;
  select: (s: string) => void;
  add: () => void;
  remove: (s: string) => void;
}) {
  return (
    <section className="source-list">
      <div className="section-label">
        光源{" "}
        <button data-testid="add-source" className="icon-btn" onClick={add}>
          + 添加
        </button>
      </div>
      {sources.map((s) => (
        <div
          className={`source-row ${selected === s.id ? "active" : ""}`}
          key={s.id}
        >
          <button onClick={() => select(s.id)}>
            <i style={{ background: color(s.wavelength) }} />
            <span>
              {s.name}
              <small>
                {s.wavelength} nm · {s.enabled ? "已开启" : "已关闭"}
              </small>
            </span>
          </button>
          <button
            title="移除光源"
            className="icon-btn"
            onClick={() => remove(s.id)}
          >
            ×
          </button>
        </div>
      ))}
    </section>
  );
}
