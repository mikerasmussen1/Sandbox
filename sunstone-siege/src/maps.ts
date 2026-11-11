/**
 * Valley geometry. Paths branch and merge visually by sharing prefixes, then
 * each route ends on the rim of the central crater. Pad stones sit beside the
 * trails. Nothing in this file is a combat number.
 */
import type { Biome, Vec } from "./types";
import { beside, flightOf, routeOf, type Route } from "./geom";

export const MAP_W = 2000;
export const MAP_H = 1200;
export const SUN: Vec = { x: 1000, y: 600 };
const RIM = 92;

export interface MapDef {
  biome: Biome;
  /** Seed for the painted canopy, so a valley looks the same every visit. */
  seed: number;
  routes: Route[];
  flights: Route[];
  pads: Vec[];
  /** Optional river centerline, painted under the trails. */
  river?: Vec[];
  /** Short stone bridges where a trail crosses the river, in world pixels. */
  bridges?: Vec[];
}

function rimEnd(pts: Vec[]): Vec[] {
  const prev = pts[pts.length - 1];
  const vx = SUN.x - prev.x;
  const vy = SUN.y - prev.y;
  const d = Math.hypot(vx, vy) || 1;
  return [...pts, { x: SUN.x - (vx / d) * RIM, y: SUN.y - (vy / d) * RIM }];
}

function padsFor(routes: Route[]): Vec[] {
  const pads: Vec[] = [];
  const fracs = [0.18, 0.36, 0.54, 0.7, 0.84];
  routes.forEach((route, ri) => {
    fracs.forEach((f, i) => {
      const side = (i % 2 === 0 ? 1 : -1) * (74 + (ri % 2) * 10);
      const p = beside(route, route.len * f, side);
      if (p.x < 48 || p.y < 48 || p.x > MAP_W - 48 || p.y > MAP_H - 48) return;
      if (Math.hypot(p.x - SUN.x, p.y - SUN.y) < 150) return;
      if (pads.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 70)) return;
      pads.push(p);
    });
  });
  return pads;
}

function make(biome: Biome, seed: number, raw: Vec[][], extra?: Pick<MapDef, "river" | "bridges">): MapDef {
  const routes = raw.map((pts) => routeOf(rimEnd(pts)));
  const flights = routes.map((r) => flightOf(r, SUN));
  return { biome, seed, routes, flights, pads: padsFor(routes), ...extra };
}

/** West trail forks north and south of the crater. North and east trails join the rim. */
const valley = make("valley", 11, [
  [
    { x: 36, y: 470 },
    { x: 230, y: 420 },
    { x: 470, y: 490 },
    { x: 700, y: 430 },
    { x: 860, y: 500 },
  ],
  [
    { x: 36, y: 470 },
    { x: 230, y: 420 },
    { x: 470, y: 490 },
    { x: 540, y: 680 },
    { x: 760, y: 760 },
    { x: 920, y: 690 },
  ],
  [
    { x: 1180, y: 28 },
    { x: 1320, y: 190 },
    { x: 1160, y: 340 },
    { x: 1040, y: 450 },
  ],
  [
    { x: 1964, y: 840 },
    { x: 1680, y: 880 },
    { x: 1460, y: 740 },
    { x: 1260, y: 790 },
    { x: 1120, y: 690 },
  ],
]);

const ruins = make(
  "ruins",
  29,
  [
    [
      { x: 28, y: 220 },
      { x: 250, y: 250 },
      { x: 420, y: 400 },
      { x: 360, y: 560 },
      { x: 560, y: 660 },
      { x: 800, y: 600 },
    ],
    [
      { x: 1972, y: 250 },
      { x: 1720, y: 210 },
      { x: 1540, y: 390 },
      { x: 1640, y: 560 },
      { x: 1420, y: 660 },
      { x: 1200, y: 600 },
    ],
    [
      { x: 1000, y: 1168 },
      { x: 820, y: 1000 },
      { x: 1160, y: 900 },
      { x: 880, y: 780 },
      { x: 1120, y: 700 },
    ],
  ],
  {
    river: [
      { x: 980, y: -20 },
      { x: 1040, y: 180 },
      { x: 920, y: 360 },
      { x: 1080, y: 540 },
      { x: 940, y: 760 },
      { x: 1060, y: 980 },
      { x: 980, y: 1220 },
    ],
    bridges: [
      { x: 1000, y: 250 },
      { x: 990, y: 600 },
      { x: 1000, y: 900 },
    ],
  },
);

const crater = make("crater", 47, [
  [
    { x: 24, y: 600 },
    { x: 280, y: 500 },
    { x: 520, y: 660 },
    { x: 760, y: 540 },
  ],
  [
    { x: 1000, y: 20 },
    { x: 840, y: 200 },
    { x: 1160, y: 300 },
    { x: 1000, y: 440 },
  ],
  [
    { x: 1976, y: 700 },
    { x: 1620, y: 540 },
    { x: 1380, y: 780 },
    { x: 1180, y: 640 },
  ],
]);

export const MAPS: readonly MapDef[] = [valley, ruins, crater];

export function mapDef(index: number): MapDef {
  const m = MAPS[index];
  if (!m) throw new Error(`sunstone-siege: no valley ${index}`);
  return m;
}
