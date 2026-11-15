import type { Element, ElementKind } from "../../../shared/document";
export const catalog: {
  kind: ElementKind;
  name: string;
  icon: string;
  description: string;
}[] = [
  { kind: "mirror", name: "平面镜", icon: "╱", description: "精确镜面反射" },
  { kind: "lens", name: "会聚透镜", icon: "()", description: "近轴薄透镜" },
  { kind: "prism", name: "三棱镜", icon: "△", description: "双界面折射" },
  { kind: "screen", name: "接收屏", icon: "▥", description: "采样真实落点" },
];
export function createElement(kind: ElementKind, x = 500, y = 300): Element {
  return {
    id: crypto.randomUUID(),
    kind,
    name: catalog.find((c) => c.kind === kind)!.name,
    x,
    y,
    angle: 0,
    size: kind === "screen" ? 260 : kind === "prism" ? 130 : 180,
    focal: 180,
    index: 1.52,
    enabled: true,
  };
}
export function initialElements(): Element[] {
  return [
    { ...createElement("lens", 490, 300), id: "lens-1" },
    { ...createElement("screen", 780, 300), id: "screen-1" },
  ];
}
