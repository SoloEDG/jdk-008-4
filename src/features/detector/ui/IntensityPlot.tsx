import type { Measurement } from "../../../shared/document";
export function IntensityPlot({
  measurement: m,
}: {
  measurement: Measurement | undefined;
}) {
  const max = Math.max(...(m?.bins ?? [0]), 0.001);
  return (
    <div className="plot">
      <div className="plot-label">
        相对光强 <span>{m?.count ?? 0} HITS</span>
      </div>
      <svg viewBox="0 0 280 110" role="img" aria-label="接收屏光强分布">
        {[25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            x2="280"
            y1={y}
            y2={y}
            stroke="#25333e"
            strokeDasharray="3 4"
          />
        ))}
        {m?.bins.map((n, i) => (
          <rect
            key={i}
            x={(i * 280) / m.bins.length + 1}
            y={100 - (n / max) * 85}
            width={Math.max(1, 280 / m.bins.length - 2)}
            height={(n / max) * 85}
            fill="#85e5bc"
            rx="1"
          />
        ))}
        {!m?.count && (
          <text x="140" y="60" textAnchor="middle" fill="#728697" fontSize="12">
            等待光线到达接收屏
          </text>
        )}
      </svg>
      <div className="axis">
        <span>−口径 / 2</span>
        <span>0 mm</span>
        <span>+口径 / 2</span>
      </div>
    </div>
  );
}
