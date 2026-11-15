import { useState } from "react";
import {
  FlaskConical,
  RotateCcw,
  Grid2X2,
  Magnet,
  Move,
  Info,
  Sun,
} from "lucide-react";
import {
  useBench,
  Palette,
  ElementInspector,
  BenchCanvas,
} from "../features/bench";
import {
  useSources,
  SourcePanel,
  SourceControls,
  sourceSummary,
} from "../features/sources";
import { useOptics, RayLayer, TraceStatus } from "../features/optics";
import { useDetector, DetectorPanel } from "../features/detector";
import {
  useExperiments,
  ExperimentPanel,
  experiments,
} from "../features/experiments";
import type { Experiment } from "../features/experiments";
export function Workspace() {
  const bench = useBench(),
    sources = useSources();
  const optics = useOptics(bench.elements, sources.sources);
  const detector = useDetector(optics.trace, bench.elements);
  const lab = useExperiments(optics.trace, detector.measurements);
  const [help, setHelp] = useState(false);
  const selected = bench.elements.find((e) => e.id === bench.selected);
  const summary = sourceSummary(sources.sources);
  const load = (e: Experiment) => {
    bench.replace(e.elements.map((v) => ({ ...v })));
    sources.replace(e.sources.map((v) => ({ ...v })));
    lab.choose(e.id);
  };
  return (
    <div className="workspace">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={23} />
          </div>
          <b>
            LUMEN<span>光学实验室</span>
          </b>
          <i>BETA 1.0</i>
        </div>
        <nav>
          <span className="nav-active">光学实验台</span>
          <button data-testid="help" onClick={() => setHelp(!help)}>
            使用指南 <Info size={14} />
          </button>
        </nav>
        <div className="local-badge">
          <span className="live-dot" />
          本地实时演算
        </div>
      </header>
      <div className="work-area">
        <aside className="left-panel">
          <div className="project-label">
            <small>WORKSPACE / 001</small>
            <h1>
              探索光的路径<span>交互式几何光学实验台</span>
            </h1>
          </div>
          <Palette add={bench.add} />
          <SourcePanel
            sources={sources.sources}
            selected={sources.selected}
            select={sources.setSelected}
            add={sources.add}
            remove={sources.remove}
          />
          <SourceControls
            source={sources.sources.find((s) => s.id === sources.selected)}
            patch={sources.patch}
          />
          <div className="left-footer">
            <Sun size={15} />
            {summary.active} 个光源 · {summary.power.toFixed(1)} W 总功率
          </div>
        </aside>
        <main className="center">
          <div className="bench-toolbar">
            <div>
              <span className="mode">
                <Move size={14} />
                选择与移动
              </span>
              <span className="divider" />
              <button
                className={bench.grid ? "active" : ""}
                data-testid="grid-toggle"
                onClick={() => bench.setGrid(!bench.grid)}
              >
                <Grid2X2 size={15} />
                网格
              </button>
              <button
                className={bench.snap ? "active" : ""}
                data-testid="snap-toggle"
                onClick={() => bench.setSnap(!bench.snap)}
              >
                <Magnet size={15} />
                吸附
              </button>
            </div>
            <button
              data-testid="reset"
              onClick={() =>
                load(experiments.find((e) => e.id === lab.activeId)!)
              }
            >
              <RotateCcw size={14} />
              重置实验
            </button>
          </div>
          <div className="canvas-heading">
            <span className="eyebrow">OPTICAL BENCH</span>
            <span>1000 × 600 mm</span>
          </div>
          <div className="canvas-wrap">
            <BenchCanvas
              elements={bench.elements}
              sources={sources.sources}
              selected={bench.selected}
              select={bench.setSelected}
              move={bench.move}
              moveSource={sources.move}
              selectSource={sources.setSelected}
              add={bench.add}
              grid={bench.grid}
            >
              <RayLayer trace={optics.trace} visible={optics.visible} />
            </BenchCanvas>
          </div>
          <TraceStatus {...optics} />
          <div className="bottom-cards">
            <div>
              <span className="step-number">01</span>
              <b>搭建光路</b>
              <small>拖入器件，自由排列</small>
            </div>
            <div>
              <span className="step-number">02</span>
              <b>调节参数</b>
              <small>点击器件，精确控制</small>
            </div>
            <div>
              <span className="step-number">03</span>
              <b>观察与验证</b>
              <small>分析屏幕上的真实光斑</small>
            </div>
          </div>
          <div className="model-note">
            <Info size={14} />
            二维几何光学 · 理想镜面 · 近轴薄透镜 · 棱镜遵循 Snell 定律。长度单位
            mm，忽略衍射与吸收。
          </div>
        </main>
        <aside className="right-panel">
          <ExperimentPanel
            active={lab.active}
            checked={lab.checked}
            verdict={lab.verdict}
            choose={load}
            check={lab.check}
          />
          <ElementInspector
            element={selected}
            patch={bench.patch}
            remove={bench.remove}
          />
          <DetectorPanel elements={bench.elements} {...detector} />
        </aside>
      </div>
      <footer className="statusbar">
        <span>
          <i className="live-dot" />
          求解器就绪
        </span>
        <span>
          {bench.elements.length} 个器件 · {summary.rays} 条采样光线
        </span>
        <span>LUMEN LAB / GEOMETRICAL OPTICS</span>
      </footer>
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn" onClick={() => setHelp(false)}>
              ×
            </button>
            <h2>让光路成为你的实验</h2>
            <p>
              从左侧拖入器件，或点击添加。在画布上拖动器件与光源，右侧输入精确位置、角度与焦距。光轴角度
              0° 表示向右，90° 表示向下；镜面与屏幕垂直于各自光轴。
            </p>
            <p>
              平行光聚焦：把透镜焦距设为 290 mm，或将接收屏 X 移到 670
              mm。屏幕显示命中功率、质心与光斑 RMS；实验判定始终读取当前测量。
            </p>
            <p>
              棱镜使用常数折射率，不模拟色散。最多 32
              次相互作用，达到上限会显示提示。所有操作均在浏览器内完成，刷新将重置实验。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
