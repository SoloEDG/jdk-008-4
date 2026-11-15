export type Vec = { x: number; y: number };
export type ElementKind = "mirror" | "lens" | "prism" | "screen";
export interface Element extends Vec {
  id: string;
  kind: ElementKind;
  name: string;
  angle: number;
  size: number;
  focal: number;
  index: number;
  enabled: boolean;
}
export interface Source extends Vec {
  id: string;
  name: string;
  angle: number;
  spread: number;
  rays: number;
  wavelength: number;
  power: number;
  enabled: boolean;
}
export interface RaySegment {
  from: Vec;
  to: Vec;
  sourceId: string;
  wavelength: number;
  power: number;
  event: string;
  opticId?: string;
}
export interface ScreenHit {
  screenId: string;
  sourceId: string;
  position: number;
  power: number;
  wavelength: number;
  rayId: string;
  events: string[];
}
export interface Trace {
  segments: RaySegment[];
  hits: ScreenHit[];
  warnings: string[];
  emitted: number;
  escaped: number;
}
export interface Measurement {
  screenId: string;
  count: number;
  power: number;
  centroid: number | null;
  width: number | null;
  bins: number[];
  hits: ScreenHit[];
}
export const WORLD = { width: 1000, height: 600 };
