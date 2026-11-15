import type { Element, Vec } from "../../../shared/document";
import { add, sub, mul, dot, direction, unit } from "../../../shared/math";
export function reflect(d: Vec, n: Vec): Vec {
  return unit(sub(d, mul(n, 2 * dot(d, n))));
}
export function refract(
  d: Vec,
  normal: Vec,
  n1: number,
  n2: number,
): Vec | null {
  const n = dot(d, normal) > 0 ? mul(normal, -1) : normal;
  const cos = -dot(d, n),
    eta = n1 / n2,
    k = 1 - eta * eta * (1 - cos * cos);
  return k < 0
    ? null
    : unit(add(mul(d, eta), mul(n, eta * cos - Math.sqrt(k))));
}
export function lens(d: Vec, p: Vec, e: Element): Vec {
  let axis = direction(e.angle);
  if (dot(d, axis) < 0) axis = mul(axis, -1);
  const tangent = { x: -axis.y, y: axis.x };
  const axial = dot(d, axis);
  const slope = dot(d, tangent) / Math.max(0.001, axial);
  const height = dot(sub(p, e), tangent);
  return unit(add(axis, mul(tangent, slope - height / e.focal)));
}
