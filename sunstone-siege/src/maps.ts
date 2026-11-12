/**
 * Eight portrait valleys. The painter and these polylines share one generator,
 * so the road in the picture is the road the raiders walk.
 */
import type { Biome, Vec } from "./types";
import { flightOf, routeOf, type Route } from "./geom";
import { LEVELS } from "./levels";

export const MAP_W = 960;
export const MAP_H = 1800;
export const SUN: Vec = { x: 480, y: 1520 };
/** The stored plaza is already the rim. */
export const SUN_SCALE = 1;

export interface MapDef {
  name: string;
  biome: Biome;
  sun: Vec;
  /** Stone rim around the sunstone, in world pixels. */
  plaza: number;
  pathWidth: number;
  routes: Route[];
  flights: Route[];
  pads: Vec[];
}

const NAMES = [
  "Green Cut",
  "Runner Ridge",
  "Twin Canyon",
  "Brute Steps",
  "High Wind",
  "Boulder Bend",
  "Three Gates",
  "Colossus Stair",
];

/**
 * A pad's dashed square plus the cost pill under it.
 * Walls only reserve the barricade and its short pill, so a pad can sit beside the trail.
 */
const PAD_BOX = { left: 52, right: 52, top: 50, bottom: 94 };
const WALL_BOX = { left: 44, right: 44, top: 22, bottom: 58 };
const PAD_GAP = 18;

export interface GapSpot {
  x: number;
  y: number;
  fixed: boolean;
  wall?: boolean;
}

function boxOf(spot: GapSpot): { left: number; right: number; top: number; bottom: number } {
  return spot.wall ? WALL_BOX : PAD_BOX;
}

/** Nudge stations until no cost pill covers another. Walls stay on the trail. */
export function clearStationGaps(spots: GapSpot[], sun: Vec, plaza: number): void {
  const home = spots.map((s) => ({ x: s.x, y: s.y }));
  const reach = plaza + 56;
  for (let n = 0; n < 16; n++) {
    for (const spot of spots) {
      if (spot.fixed) continue;
      const dx = spot.x - sun.x;
      const dy = spot.y - sun.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < reach) {
        spot.x = sun.x + (dx / dist) * reach;
        spot.y = sun.y + (dy / dist) * reach;
      }
      spot.x = Math.max(48, Math.min(MAP_W - 48, spot.x));
      spot.y = Math.max(48, Math.min(MAP_H - 80, spot.y));
    }
    for (let i = 0; i < spots.length; i++) {
      for (let j = i + 1; j < spots.length; j++) {
        const a = spots[i];
        const b = spots[j];
        if (a.fixed && b.fixed) continue;
        const ab = boxOf(a);
        const bb = boxOf(b);
        const ax0 = a.x - ab.left - PAD_GAP / 2;
        const ax1 = a.x + ab.right + PAD_GAP / 2;
        const ay0 = a.y - ab.top - PAD_GAP / 2;
        const ay1 = a.y + ab.bottom + PAD_GAP / 2;
        const bx0 = b.x - bb.left - PAD_GAP / 2;
        const bx1 = b.x + bb.right + PAD_GAP / 2;
        const by0 = b.y - bb.top - PAD_GAP / 2;
        const by1 = b.y + bb.bottom + PAD_GAP / 2;
        const ox = Math.min(ax1, bx1) - Math.max(ax0, bx0);
        const oy = Math.min(ay1, by1) - Math.max(ay0, by0);
        if (ox <= 0 || oy <= 0) continue;
        const signX = a.x === b.x ? (i % 2 === 0 ? 1 : -1) : Math.sign(a.x - b.x);
        const signY = a.y === b.y ? 1 : Math.sign(a.y - b.y);
        const alongX = ox < oy;
        const push = alongX ? ox : oy;
        const sign = alongX ? signX : signY;
        if (a.fixed) {
          if (alongX) b.x -= sign * push;
          else b.y -= sign * push;
        } else if (b.fixed) {
          if (alongX) a.x += sign * push;
          else a.y += sign * push;
        } else if (alongX) {
          a.x += sign * push * 0.5;
          b.x -= sign * push * 0.5;
        } else {
          a.y += sign * push * 0.5;
          b.y -= sign * push * 0.5;
        }
      }
    }
    for (let i = 0; i < spots.length; i++) {
      if (spots[i].fixed) continue;
      const dx = spots[i].x - home[i].x;
      const dy = spots[i].y - home[i].y;
      const drift = Math.hypot(dx, dy);
      if (drift > 88) {
        spots[i].x = home[i].x + (dx / drift) * 88;
        spots[i].y = home[i].y + (dy / drift) * 88;
      }
    }
  }
}

function build(index: number): MapDef {
  const level = LEVELS[index] ?? LEVELS[LEVELS.length - 1];
  const plaza = 46;
  const routes = level.routes.map((pts) => routeOf(pts.map((p) => ({ ...p }))));
  return {
    name: NAMES[index] ?? `Valley ${index + 1}`,
    biome: level.biome,
    sun: { ...SUN },
    plaza,
    pathWidth: level.pathWidth,
    routes,
    flights: routes.map((route) => flightOf(route, SUN)),
    pads: level.pads.map((p) => ({ ...p })),
  };
}

export const MAPS: MapDef[] = LEVELS.map((_, i) => build(i));

export function mapDef(world: number): MapDef {
  return MAPS[Math.max(0, Math.min(MAPS.length - 1, world))] ?? MAPS[0];
}
