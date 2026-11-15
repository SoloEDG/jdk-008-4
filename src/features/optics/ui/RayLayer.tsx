import type { Trace } from "../../../shared/document";
import { color } from "../../../shared/math";
export function RayLayer({
  trace,
  visible,
}: {
  trace: Trace;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <g pointerEvents="none" data-testid="ray-layer">
      {trace.segments.map((s, i) => (
        <g key={i}>
          <line
            x1={s.from.x}
            y1={s.from.y}
            x2={s.to.x}
            y2={s.to.y}
            stroke={color(s.wavelength)}
            opacity=".15"
            strokeWidth="6"
            filter="url(#glow)"
          />
          <line
            x1={s.from.x}
            y1={s.from.y}
            x2={s.to.x}
            y2={s.to.y}
            stroke={color(s.wavelength)}
            opacity={Math.min(0.9, 0.4 + s.power)}
            strokeWidth="1.25"
          />
          {s.event !== "escape" && (
            <circle cx={s.to.x} cy={s.to.y} r="2" fill={color(s.wavelength)} />
          )}
        </g>
      ))}
    </g>
  );
}
