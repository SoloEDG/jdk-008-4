import type { Element, Source } from "../../../shared/document";
import { createElement } from "../../bench";
import { initialSources } from "../../sources";
export interface Experiment {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  target: string;
  elements: Element[];
  sources: Source[];
  rule: "focus" | "mirror" | "prism";
}
const optic = (
  kind: Element["kind"],
  id: string,
  x: number,
  y: number,
  p: Partial<Element> = {},
): Element => ({ ...createElement(kind, x, y), id, ...p });
export const experiments: Experiment[] = [
  {
    id: "focus",
    name: "平行光聚焦",
    subtitle: "01 / FOCUS",
    description: "调整透镜焦距或屏幕位置，让平行光束收敛成一个清晰光点。",
    target: "至少 5 条命中 · RMS ≤ 3 mm",
    rule: "focus",
    elements: [
      optic("lens", "lens-1", 490, 300),
      optic("screen", "screen-1", 780, 300),
    ],
    sources: initialSources(),
  },
  {
    id: "mirror",
    name: "反射定律",
    subtitle: "02 / REFLECTION",
    description: "将镜面旋转到合适方向，把水平光束反射到下方的接收屏。",
    target: "反射后至少 5 条命中 · 功率 ≥ 0.7 W",
    rule: "mirror",
    elements: [
      optic("mirror", "mirror-1", 490, 300, { angle: 25, size: 200 }),
      optic("screen", "screen-1", 490, 490, { angle: 90, size: 260 }),
    ],
    sources: initialSources(),
  },
  {
    id: "prism",
    name: "棱镜偏折",
    subtitle: "03 / REFRACTION",
    description: "改变棱镜姿态，观察光线通过两个折射界面后的偏折并在屏幕接收。",
    target: "经棱镜后至少 5 条命中 · 质心偏移 ≥ 8 mm",
    rule: "prism",
    elements: [
      optic("prism", "prism-1", 450, 300, { angle: 0, size: 180 }),
      optic("screen", "screen-1", 780, 300, { size: 400 }),
    ],
    sources: initialSources().map((s) => ({ ...s, spread: 30 })),
  },
];
