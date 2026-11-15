import { catalog } from "../model/catalog";
import type { ElementKind } from "../../../shared/document";
export function Palette({ add }: { add: (kind: ElementKind) => void }) {
  return (
    <section className="palette">
      <div className="section-label">
        器件库 <span>COMPONENTS</span>
      </div>
      {catalog.map((c) => (
        <button
          key={c.kind}
          data-testid={`add-${c.kind}`}
          className="palette-item"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("optic", c.kind)}
          onClick={() => add(c.kind)}
        >
          <span className={`component-icon ${c.kind}`}>{c.icon}</span>
          <span>
            <b>{c.name}</b>
            <small>{c.description}</small>
          </span>
          <span className="plus">+</span>
        </button>
      ))}
      <div className="hint">
        拖拽器件到实验台
        <br />
        或点击添加到画布
      </div>
    </section>
  );
}
