import { experiments } from "../model/presets";
import type { Experiment } from "../model/presets";
import type { Verdict } from "../lib/evaluate";
export function ExperimentPanel({
  active,
  checked,
  verdict,
  choose,
  check,
}: {
  active: Experiment;
  checked: boolean;
  verdict: Verdict;
  choose: (e: Experiment) => void;
  check: () => void;
}) {
  return (
    <section className="experiment-panel">
      <div className="section-label">
        实验导航 <span>GUIDED LAB</span>
      </div>
      <div className="experiment-tabs">
        {experiments.map((e, i) => (
          <button
            data-testid={`experiment-${e.id}`}
            key={e.id}
            className={e.id === active.id ? "active" : ""}
            onClick={() => choose(e)}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <small className="eyebrow">{active.subtitle}</small>
      <h2>{active.name}</h2>
      <p>{active.description}</p>
      <div className="target">
        <span>◎ 实验目标</span>
        <b>{active.target}</b>
      </div>
      <div className="progress-track">
        <i style={{ width: `${verdict.progress * 100}%` }} />
      </div>
      <button
        data-testid="check-experiment"
        className="primary-btn"
        onClick={check}
      >
        检验实验结果 <span>↗</span>
      </button>
      {checked && (
        <div
          data-testid="experiment-verdict"
          className={`verdict ${verdict.passed ? "passed" : ""}`}
        >
          {verdict.message}
        </div>
      )}
    </section>
  );
}
