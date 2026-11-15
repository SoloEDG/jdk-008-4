import type { Vec } from "./document";
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
export const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
export const cross = (a: Vec, b: Vec) => a.x * b.y - a.y * b.x;
export const length = (a: Vec) => Math.hypot(a.x, a.y);
export const unit = (a: Vec): Vec => mul(a, 1 / (length(a) || 1));
export const direction = (angle: number): Vec => ({
  x: Math.cos((angle * Math.PI) / 180),
  y: Math.sin((angle * Math.PI) / 180),
});
export const clamp = (x: number, a: number, b: number) =>
  Math.max(a, Math.min(b, x));
export const rotate = (p: Vec, angle: number): Vec => {
  const d = direction(angle);
  return { x: p.x * d.x - p.y * d.y, y: p.x * d.y + p.y * d.x };
};
export const color = (nm: number) =>
  nm < 490
    ? "#56bcff"
    : nm < 530
      ? "#5dedd5"
      : nm < 580
        ? "#b9f66b"
        : nm < 620
          ? "#ffca66"
          : "#ff6878";
