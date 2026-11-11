/**
 * Invented placeholder balance for Sunstone Siege.
 *
 * Every cost, hit point, damage, speed, range, reward, leak and timing value
 * the game uses lives in this file. None of these figures are measured from
 * the reference clip. The clip shows a map, walking units and a beam; it does
 * not show a HUD, a currency, or any number. Tune the game here and nowhere else.
 */
import type { EnemyKind, SpawnGroup, TowerKind, WaveDef } from "./types";

export interface DartTier {
  cost: number;
  damage: number;
  range: number;
  interval: number;
  shotSpeed: number;
}
export interface LensTier {
  cost: number;
  dps: number;
  /** Extra damage per second added while the beam stays on one target. */
  ramp: number;
  rampMax: number;
  range: number;
}
export interface DrumTier {
  cost: number;
  damage: number;
  radius: number;
  stun: number;
  slow: number;
  interval: number;
}
export interface SpireTier {
  cost: number;
  damage: number;
  jumps: number;
  falloff: number;
  range: number;
  chain: number;
  interval: number;
}

export interface EnemyStat {
  name: string;
  hp: number;
  speed: number;
  /** Flat damage subtracted from a projectile hit. Beams lose this much dps. */
  armor: number;
  reward: number;
  leak: number;
  /** Solar Flare charge gained when this unit breaks. */
  charge: number;
  flying: boolean;
}

export interface WorldBalance {
  name: string;
  /** Opening Jade. */
  jade: number;
  /** Multiplies enemy hit points. */
  hp: number;
  /** Multiplies enemy speed. */
  speed: number;
  waves: readonly WaveDef[];
}

function group(kind: EnemyKind, count: number, interval: number, path: number, gap = 0): SpawnGroup {
  return { kind, count, interval, path, gap };
}

export const BALANCE = {
  /** Cracks the Sunstone can take. Zero ends the valley. */
  integrity: 22,
  /** Fraction of Jade spent on a totem returned when it is sold. */
  sellRefund: 0.6,
  /** Seconds of free building before a wave walks in on its own. */
  prewave: 9,
  /** Jade granted for calling a wave before the timer finishes. */
  earlyCall: 18,
  /** Movement multiplier while a drum's slow lasts. */
  slowMul: 0.48,
  /** A hit never drops below this after armor, so a shielded unit still chips. */
  minHit: 1,
  /** Continuous beams keep at least this much dps after armor. */
  minDps: 2,
  stars: { two: 0.45, three: 0.72 },
  flare: {
    need: 100,
    damage: 78,
    bossDamage: 46,
    /** Seconds after a flare during which charge does not accept and the button stays dark. */
    lock: 2.4,
  },
  dart: [
    { cost: 50, damage: 24, range: 186, interval: 0.3, shotSpeed: 720 },
    { cost: 70, damage: 40, range: 210, interval: 0.24, shotSpeed: 800 },
    { cost: 100, damage: 58, range: 236, interval: 0.18, shotSpeed: 880 },
  ] as const satisfies readonly DartTier[],
  lens: [
    { cost: 100, dps: 54, ramp: 20, rampMax: 80, range: 190 },
    { cost: 130, dps: 78, ramp: 28, rampMax: 120, range: 216 },
    { cost: 180, dps: 110, ramp: 36, rampMax: 170, range: 248 },
  ] as const satisfies readonly LensTier[],
  drum: [
    { cost: 85, damage: 16, radius: 132, stun: 0.45, slow: 1.4, interval: 1.35 },
    { cost: 120, damage: 26, radius: 156, stun: 0.58, slow: 1.6, interval: 1.15 },
    { cost: 165, damage: 40, radius: 184, stun: 0.72, slow: 1.85, interval: 0.98 },
  ] as const satisfies readonly DrumTier[],
  spire: [
    { cost: 130, damage: 18, jumps: 3, falloff: 0.72, range: 160, chain: 136, interval: 0.92 },
    { cost: 165, damage: 32, jumps: 4, falloff: 0.76, range: 188, chain: 152, interval: 0.76 },
    { cost: 230, damage: 50, jumps: 5, falloff: 0.8, range: 220, chain: 170, interval: 0.64 },
  ] as const satisfies readonly SpireTier[],
  towerName: {
    dart: "Dart Totem",
    lens: "Sun Lens",
    drum: "Quake Drum",
    spire: "Serpent Spire",
  } as const satisfies Record<TowerKind, string>,
  towerBlurb: {
    dart: "Fast carved darts. Strikes one raider at a time.",
    lens: "A sunlight beam that burns hotter while it holds the same target.",
    drum: "A shock ring. Damages, slows, and briefly stops a crowd.",
    spire: "Jade arcs that leap from raider to raider.",
  } as const satisfies Record<TowerKind, string>,
  enemies: {
    runner: { name: "Runner", hp: 30, speed: 104, armor: 0, reward: 7, leak: 1, charge: 9, flying: false },
    shield: { name: "Shieldbearer", hp: 96, speed: 52, armor: 6, reward: 12, leak: 2, charge: 12, flying: false },
    jaguar: { name: "Jaguar Stalker", hp: 48, speed: 92, armor: 0, reward: 11, leak: 1, charge: 11, flying: false },
    golem: { name: "Stone Golem", hp: 260, speed: 34, armor: 4, reward: 22, leak: 3, charge: 18, flying: false },
    shard: { name: "Golem Shard", hp: 48, speed: 70, armor: 0, reward: 5, leak: 1, charge: 6, flying: false },
    glider: { name: "Glider", hp: 60, speed: 90, armor: 0, reward: 11, leak: 1, charge: 10, flying: true },
    boss: { name: "Obsidian Colossus", hp: 960, speed: 28, armor: 8, reward: 100, leak: 8, charge: 40, flying: false },
  } as const satisfies Record<EnemyKind, EnemyStat>,
  jaguar: { cycle: 4.6, dur: 1.45 },
  boss: { slamEvery: 4.4, slamRadius: 176, slamStun: 1.2 },
  golemShards: 2,
  worlds: [
    {
      name: "Jungle Valley",
      jade: 230,
      hp: 1,
      speed: 1,
      waves: [
        { bonus: 28, groups: [group("runner", 8, 0.68, 0)] },
        { bonus: 34, groups: [group("runner", 6, 0.58, 0), group("runner", 6, 0.58, 2, 1.1)] },
        { bonus: 40, groups: [group("shield", 5, 0.95, 1), group("jaguar", 4, 0.8, 3, 0.4), group("runner", 6, 0.5, 0, 2)] },
        { bonus: 48, groups: [group("glider", 5, 0.72, 2), group("shield", 4, 1, 3, 0.5), group("golem", 2, 2.4, 0, 1.2)] },
        { bonus: 70, groups: [group("runner", 8, 0.5, 0), group("boss", 1, 0.2, 2, 0.8), group("shield", 4, 0.9, 1, 1.4), group("jaguar", 3, 0.75, 3, 1.6)] },
      ],
    },
    {
      name: "River Ruins",
      jade: 270,
      hp: 1.1,
      speed: 1.03,
      waves: [
        { bonus: 32, groups: [group("runner", 8, 0.55, 0), group("runner", 6, 0.55, 1, 0.8)] },
        { bonus: 38, groups: [group("shield", 6, 0.85, 0), group("runner", 6, 0.48, 2, 1)] },
        { bonus: 44, groups: [group("jaguar", 5, 0.7, 1), group("glider", 5, 0.65, 0, 0.6)] },
        { bonus: 50, groups: [group("golem", 3, 2.1, 2), group("shield", 5, 0.9, 1, 0.8)] },
        { bonus: 56, groups: [group("glider", 7, 0.55, 0), group("jaguar", 5, 0.7, 1, 0.4), group("shield", 4, 0.85, 2, 1.2)] },
        { bonus: 80, groups: [group("shield", 5, 0.8, 0), group("boss", 1, 0.2, 1, 0.6), group("glider", 5, 0.6, 2, 1), group("golem", 2, 2.2, 0, 1.5)] },
      ],
    },
    {
      name: "Night Crater",
      jade: 320,
      hp: 1.24,
      speed: 1.06,
      waves: [
        { bonus: 36, groups: [group("runner", 10, 0.48, 0)] },
        { bonus: 42, groups: [group("runner", 8, 0.45, 0), group("runner", 8, 0.45, 1, 0.6)] },
        { bonus: 48, groups: [group("shield", 6, 0.75, 2), group("jaguar", 6, 0.62, 0, 0.4)] },
        { bonus: 54, groups: [group("glider", 6, 0.5, 1), group("golem", 3, 1.8, 0, 0.8)] },
        { bonus: 60, groups: [group("shield", 7, 0.7, 2), group("glider", 6, 0.5, 1, 0.3), group("jaguar", 5, 0.6, 0, 1)] },
        { bonus: 66, groups: [group("golem", 3, 1.7, 0), group("golem", 3, 1.7, 2, 0.5), group("runner", 8, 0.4, 1, 1)] },
        { bonus: 90, groups: [group("shield", 6, 0.65, 0), group("boss", 1, 0.2, 1, 0.4), group("glider", 6, 0.48, 2, 0.8), group("jaguar", 5, 0.55, 0, 1.2)] },
      ],
    },
  ] as const satisfies readonly WorldBalance[],
} as const;

export type BalanceWorld = (typeof BALANCE.worlds)[number];

export function worldCount(): number {
  return BALANCE.worlds.length;
}

export function starsFor(integrity: number): 1 | 2 | 3 {
  const ratio = integrity / BALANCE.integrity;
  if (ratio >= BALANCE.stars.three) return 3;
  if (ratio >= BALANCE.stars.two) return 2;
  return 1;
}

export function towerCost(kind: TowerKind, tier: number): number {
  if (kind === "dart") return BALANCE.dart[tier].cost;
  if (kind === "lens") return BALANCE.lens[tier].cost;
  if (kind === "drum") return BALANCE.drum[tier].cost;
  return BALANCE.spire[tier].cost;
}

export function towerRange(kind: TowerKind, tier: number): number {
  if (kind === "dart") return BALANCE.dart[tier].range;
  if (kind === "lens") return BALANCE.lens[tier].range;
  if (kind === "drum") return BALANCE.drum[tier].radius;
  return BALANCE.spire[tier].range;
}
