import type { Vec } from "./types";

export interface Route {
  pts: readonly Vec[];
  seg: number[];
  len: number;
}

export function routeOf(pts: readonly Vec[]): Route {
  const seg: number[] = [];
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    seg.push(d);
    len += d;
  }
  return { pts, seg, len };
}

export interface Pose {
  x: number;
  y: number;
  angle: number;
}

/** Point and facing at a distance along a route. Clamps to the last point. */
export function poseAt(route: Route, dist: number): Pose {
  const pts = route.pts;
  if (pts.length === 0) return { x: 0, y: 0, angle: 0 };
  if (pts.length === 1 || dist <= 0) {
    const b = pts[Math.min(1, pts.length - 1)];
    return { x: pts[0].x, y: pts[0].y, angle: Math.atan2(b.y - pts[0].y, b.x - pts[0].x) };
  }
  let left = Math.max(0, Math.min(dist, route.len));
  for (let i = 0; i < route.seg.length; i++) {
    const sl = route.seg[i];
    const a = pts[i];
    const b = pts[i + 1];
    if (left <= sl || i === route.seg.length - 1) {
      const t = sl <= 0 ? 1 : Math.max(0, Math.min(1, left / sl));
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    left -= sl;
  }
  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, angle: 0 };
}

/** A point `side` pixels left of the direction of travel. */
export function beside(route: Route, dist: number, side: number): Vec {
  const p = poseAt(route, dist);
  return { x: p.x + Math.cos(p.angle + Math.PI / 2) * side, y: p.y + Math.sin(p.angle + Math.PI / 2) * side };
}

/**
 * Gliders ignore path bends. They leave the gate, cut one corner toward the
 * crater, and arrive at the same rim point as the ground route.
 */
export function flightOf(ground: Route, center: Vec): Route {
  const a = ground.pts[0];
  const b = ground.pts[ground.pts.length - 1];
  const mid = {
    x: (a.x + b.x) * 0.42 + center.x * 0.16,
    y: (a.y + b.y) * 0.42 + center.y * 0.16,
  };
  return routeOf([a, mid, b]);
}
