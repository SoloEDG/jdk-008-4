import { useRef } from "react";
import type { ReactNode } from "react";
import type {
  Element,
  ElementKind,
  Source,
  Vec,
} from "../../../shared/document";
import { shapePath, pointerToWorld } from "../lib/geometry";
export function BenchCanvas({
  elements,
  sources,
  selected,
  select,
  move,
  moveSource,
  selectSource,
  add,
  grid,
  children,
}: {
  elements: Element[];
  sources: Source[];
  selected: string | null;
  select: (id: string) => void;
  move: (id: string, p: Vec) => void;
  moveSource: (id: string, p: Vec) => void;
  selectSource: (id: string) => void;
  add: (k: ElementKind, p: Vec) => void;
  grid: boolean;
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<{
    id: string;
    source: boolean;
    dx: number;
    dy: number;
  } | null>(null);
  const point = (x: number, y: number) =>
    pointerToWorld(x, y, ref.current!.getBoundingClientRect());
  return (
    <svg
      ref={ref}
      data-testid="optical-bench"
      viewBox="0 0 1000 600"
      className="bench-svg"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const k = e.dataTransfer.getData("optic");
        if (["mirror", "lens", "prism", "screen"].includes(k))
          add(k as ElementKind, point(e.clientX, e.clientY));
      }}
      onPointerMove={(e) => {
        if (drag.current) {
          const p = point(e.clientX, e.clientY);
          const d = drag.current;
          (d.source ? moveSource : move)(d.id, {
            x: p.x + d.dx,
            y: p.y + d.dy,
          });
        }
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#1d2a36" strokeWidth=".6" />
        </pattern>
        <pattern
          id="major"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="100" fill="url(#grid)" />
          <path
            d="M100 0H0V100"
            fill="none"
            stroke="#2a3947"
            strokeWidth=".7"
          />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <rect width="1000" height="600" fill={grid ? "url(#major)" : "#0d151e"} />
      <line
        x1="0"
        y1="300"
        x2="1000"
        y2="300"
        stroke="#435163"
        strokeDasharray="4 6"
        opacity=".5"
      />
      {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
        <text key={x} x={x + 6} y="18" className="ruler">
          {x}
        </text>
      ))}
      {children}
      {elements.map((e) => (
        <g
          key={e.id}
          data-testid={`optic-${e.id}`}
          data-kind={e.kind}
          opacity={e.enabled ? 1 : 0.35}
          className="draggable"
          onPointerDown={(ev) => {
            ev.preventDefault();
            select(e.id);
            const p = point(ev.clientX, ev.clientY);
            drag.current = {
              id: e.id,
              source: false,
              dx: e.x - p.x,
              dy: e.y - p.y,
            };
            ref.current!.setPointerCapture(ev.pointerId);
          }}
        >
          <path
            d={shapePath(e)}
            fill={e.kind === "prism" ? "#529ecc22" : "none"}
            stroke={
              e.kind === "screen"
                ? "#c4d4e4"
                : e.kind === "lens"
                  ? "#72dad5"
                  : e.kind === "mirror"
                    ? "#a6b4e7"
                    : "#93b8f3"
            }
            strokeWidth={e.kind === "screen" ? 8 : e.kind === "lens" ? 7 : 5}
            strokeLinecap="round"
          />
          <path
            d={shapePath(e)}
            stroke="transparent"
            strokeWidth="28"
            fill={e.kind === "prism" ? "transparent" : "none"}
          />
          {selected === e.id && (
            <circle
              cx={e.x}
              cy={e.y}
              r="13"
              fill="#0d151e"
              stroke="#6de4ca"
              strokeWidth="2"
            />
          )}
          <text
            x={e.x}
            y={e.y + e.size / 2 + 23}
            textAnchor="middle"
            className="object-label"
          >
            {e.name}
          </text>
        </g>
      ))}
      {sources.map((s) => (
        <g
          key={s.id}
          data-testid={`source-${s.id}`}
          className="draggable"
          transform={`translate(${s.x} ${s.y})`}
          onPointerDown={(ev) => {
            ev.preventDefault();
            selectSource(s.id);
            const p = point(ev.clientX, ev.clientY);
            drag.current = {
              id: s.id,
              source: true,
              dx: s.x - p.x,
              dy: s.y - p.y,
            };
            ref.current!.setPointerCapture(ev.pointerId);
          }}
        >
          <g transform={`rotate(${s.angle})`}>
            <rect
              x="-23"
              y="-14"
              width="44"
              height="28"
              rx="6"
              fill="#25333c"
              stroke="#69dfbb"
              strokeWidth="2"
            />
            <path d="M20 -8L31 0L20 8" fill="#9af5c6" />
          </g>
          <text y="40" textAnchor="middle" className="object-label">
            {s.name}
          </text>
        </g>
      ))}
      <text x="17" y="582" className="ruler">
        1 格 = 20 mm · 拖动器件调整光路
      </text>
    </svg>
  );
}
