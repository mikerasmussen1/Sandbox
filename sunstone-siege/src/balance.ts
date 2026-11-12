/**
 * Invented placeholder balance for Sunstone Siege.
 *
 * Every cost, hit point, damage, speed, range, reward, leak and timing value
 * the game uses lives in this file. None of these figures are measured from
 * the reference clip. The clip shows a map, walking units and a beam; it does
 * not show a HUD, a currency, or any number. Tune the game here and nowhere else.
 */
import { TOWER_KINDS, type EnemyKind, type RelicId, type SpawnGroup, type TowerKind, type WaveDef } from "./types";

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

/** A Skitter blob. The sim spawns these in clumps of ten. */
function skitter(count: number, path: number, gap = 0): SpawnGroup {
  return group("skitter", count, 0.1, path, gap);
}

export const BALANCE = {
  /** Cracks the Sunstone can take. Zero ends the valley. */
  integrity: 22,
  /** Fraction of Jade spent on a totem returned when it is sold. */
  sellRefund: 0.6,
  /** Seconds of free building before a wave walks in on its own. */
  prewave: 9,
  /** Jade granted for calling a wave before the timer finishes. */
  earlyCall: 22,
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
  /**
   * The Sunstone Guardian walks the valley and fires on his own.
   * Damage is high enough to pick off a Runner and to chip a crowd, and
   * far too low to hold a lane. A jungle Skitter is 60, so this gun needs
   * several shots, and a snake of them walks through him.
   */
  hero: {
    /** 2× a Skitter, the top of the 1.5–2× band the march should read at. */
    speed: 216,
    range: 214,
    damage: 11,
    interval: 0.15,
    /** How long the attack pose holds after a shot. */
    cast: 0.2,
  },
  /** Standing on a station pours Jade into it until the price is met. */
  fund: {
    radius: 48,
    /** Jade per second while the hero stands on the pad. */
    rate: 62,
    /** How close the hero must be before the pad previews its range. */
    preview: 150,
  },
  /** Kill gems sit on the ground until the hero walks into the magnet. */
  gem: {
    magnet: 280,
    life: 14,
    fly: 760,
  },
  /** A barricade pad. Ground raiders stop and chew on it. */
  wall: {
    cost: [45, 70, 110] as const,
    hp: [380, 640, 980] as const,
  },
  /**
   * Venom left where a serpent spit lands. Damage, range, and fire interval
   * stay on the spire tiers. This only slows raiders standing in the puddle,
   * using the same slow as a drum.
   */
  venom: {
    radius: [56, 74, 96] as const,
    life: 1.45,
  },
  /**
   * A barracks pad. The first payment marches a blue squad down the trail.
   * The next payment raises a Dart on the same pad. Costs are our own curve.
   */
  barracks: {
    squad: 55,
    tower: 120,
    count: 4,
    hp: 54,
    damage: 10,
    interval: 0.48,
    speed: 96,
  },
  /** A Golem's boulder soaks shots until it shatters. The Golem underneath is unchanged. */
  boulder: { hp: 36 },
  /**
   * Tower synergies. Invented. A Quake Drum's stun is the setup; the Sun Lens
   * is the payoff. Slowed raiders also eat darts faster, and stunned raiders
   * take a heavier serpent arc.
   */
  synergy: {
    stunnedLens: 1.75,
    slowDart: 0.7,
    stunnedSpire: 1.3,
  },
  /**
   * Kills inside this window build a streak. Jade is paid at milestones
   * (5, 10, 25, 50, then every 50), not per kill. A per-kill cap of 6 still
   * minted thousands of Jade across a horde, so the milestone alternative
   * from the 2.5D spec is what the sim pays. Invented, tune in play.
   */
  combo: { window: 2.35, start: 3, jade: 2, cap: 6 },
  /** Seconds to pick a relic before the first offer is taken for you. Invented. */
  offerSeconds: 9,
  relics: {
    keen: { name: "Keen Barbs", blurb: "Dart Totems deal heavier hits.", dart: 1.22 },
    kindling: { name: "Kindling Glass", blurb: "Sun Lenses burn hotter and ramp faster.", lens: 1.16, ramp: 1.45 },
    war: { name: "War Cadence", blurb: "Quake Drums hold a stun longer.", stun: 1.4 },
    leap: { name: "Living Jade", blurb: "Serpent Spires jump to one more raider.", jumps: 1 },
    rite: { name: "Jade Rite", blurb: "Kills and cleared waves pay more Jade.", jade: 1.25 },
    ward: { name: "Sun Ward", blurb: "The Sunstone knits four cracks shut.", heal: 4 },
    heart: { name: "Flare Heart", blurb: "Solar Flare scorches hotter.", flare: 1.3 },
    focus: { name: "Long Sight", blurb: "Every totem reaches a little farther.", range: 1.12 },
  } satisfies Record<RelicId, RelicDef>,
  dart: [
    { cost: 50, damage: 24, range: 186, interval: 0.3, shotSpeed: 720 },
    { cost: 70, damage: 40, range: 210, interval: 0.24, shotSpeed: 800 },
    { cost: 100, damage: 58, range: 236, interval: 0.18, shotSpeed: 880 },
  ] as const satisfies readonly DartTier[],
  lens: [
    { cost: 100, dps: 54, ramp: 20, rampMax: 80, range: 190 },
    { cost: 130, dps: 78, ramp: 28, rampMax: 120, range: 216 },
    { cost: 210, dps: 110, ramp: 36, rampMax: 170, range: 248 },
  ] as const satisfies readonly LensTier[],
  drum: [
    { cost: 85, damage: 16, radius: 132, stun: 0.45, slow: 1.4, interval: 1.35 },
    { cost: 120, damage: 26, radius: 156, stun: 0.58, slow: 1.6, interval: 1.15 },
    { cost: 190, damage: 40, radius: 184, stun: 0.72, slow: 1.85, interval: 0.98 },
  ] as const satisfies readonly DrumTier[],
  spire: [
    { cost: 130, damage: 18, jumps: 3, falloff: 0.72, range: 160, chain: 136, interval: 0.92 },
    { cost: 165, damage: 32, jumps: 4, falloff: 0.76, range: 188, chain: 152, interval: 0.76 },
    { cost: 260, damage: 50, jumps: 5, falloff: 0.8, range: 220, chain: 170, interval: 0.64 },
  ] as const satisfies readonly SpireTier[],
  towerName: {
    dart: "Dart Totem",
    lens: "Sun Lens",
    drum: "Quake Drum",
    spire: "Serpent Spire",
  } as const satisfies Record<TowerKind, string>,
  towerBlurb: {
    dart: "Fast carved darts. They loose quicker into a slowed raider.",
    lens: "Sunlight that burns hotter on one target. A stunned raider takes much more.",
    drum: "A shock ring. It hurts, slows, and stuns. Stunned raiders feed a Sun Lens.",
    spire: "Jade arcs that leap across a crowd. A stunned target takes the heavier arc.",
  } as const satisfies Record<TowerKind, string>,
  enemies: {
    // Skitter is the horde fodder. A 150-body line at the new size turns into a
    // smear, so the jungle's biggest pack is 110 (was 244) and the later
    // valleys field fewer still, because their HP multiplier stacks on this.
    // HP 60 means a tier-1 Dart (24) needs three hits and a tier-2 Dart (58)
    // needs two. Reward 4 and leak 0.4 keep bounty and leak pressure near the
    // old one-shot swarm.
    skitter: { name: "Skitter", hp: 60, speed: 108, armor: 0, reward: 4, leak: 0.4, charge: 4, flying: false },
    runner: { name: "Runner", hp: 30, speed: 104, armor: 0, reward: 7, leak: 1, charge: 9, flying: false },
    shield: { name: "Shieldbearer", hp: 96, speed: 52, armor: 6, reward: 12, leak: 2, charge: 12, flying: false },
    jaguar: { name: "Jaguar Stalker", hp: 48, speed: 92, armor: 0, reward: 11, leak: 1, charge: 11, flying: false },
    golem: { name: "Stone Golem", hp: 260, speed: 34, armor: 4, reward: 22, leak: 3, charge: 18, flying: false },
    shard: { name: "Golem Shard", hp: 48, speed: 70, armor: 0, reward: 5, leak: 1, charge: 6, flying: false },
    glider: { name: "Glider", hp: 60, speed: 90, armor: 0, reward: 11, leak: 1, charge: 10, flying: true },
    boss: { name: "Obsidian Colossus", hp: 1500, speed: 26, armor: 8, reward: 100, leak: 8, charge: 40, flying: false },
  } as const satisfies Record<EnemyKind, EnemyStat>,
  jaguar: { cycle: 4.6, dur: 1.45 },
  boss: {
    slamEvery: 4.4,
    slamRadius: 176,
    slamStun: 1.2,
    /** Obsidian shell. Invented. Damage taken is multiplied while it holds. */
    aegisEvery: 7.4,
    aegisDur: 1.65,
    aegisMul: 0.5,
    /** Nearby raiders hurry while the roar lasts. Invented. */
    rallyEvery: 8.2,
    rallyRadius: 220,
    rallySpeed: 1.5,
    rallyDur: 1.7,
  },
  golemShards: 2,
  worlds: [
    {
      name: "Jungle Valley",
      jade: 230,
      hp: 1,
      speed: 1,
      waves: [
        { bonus: 28, groups: [skitter(16, 0)] },
        { bonus: 34, groups: [skitter(14, 0), skitter(14, 2, 1.1)] },
        { bonus: 40, groups: [group("shield", 5, 0.95, 1), group("jaguar", 4, 0.8, 3, 0.4), skitter(14, 0, 2)] },
        { bonus: 48, groups: [group("glider", 5, 0.72, 2), group("shield", 4, 1, 3, 0.5), group("golem", 2, 2.4, 0, 1.2), skitter(36, 0, 0.3), skitter(36, 2), skitter(18, 1), skitter(18, 3)] },
        { bonus: 70, groups: [skitter(14, 0), group("boss", 1, 0.2, 2, 0.8), group("shield", 4, 0.9, 1, 1.4), group("jaguar", 3, 0.75, 3, 1.6), skitter(32, 0, 0.2), skitter(32, 2), skitter(16, 1), skitter(16, 3)] },
      ],
    },
    {
      name: "River Ruins",
      jade: 300,
      hp: 1.32,
      speed: 1.04,
      waves: [
        { bonus: 32, groups: [skitter(14, 0), skitter(12, 1, 1)] },
        { bonus: 38, groups: [group("shield", 4, 0.95, 0), skitter(12, 3, 1.2)] },
        { bonus: 44, groups: [group("jaguar", 5, 0.7, 1), group("glider", 5, 0.65, 0, 0.6)] },
        { bonus: 50, groups: [group("golem", 3, 2.1, 2), group("shield", 5, 0.9, 1, 0.8)] },
        { bonus: 56, groups: [group("glider", 7, 0.55, 0), group("jaguar", 5, 0.7, 1, 0.4), group("shield", 4, 0.85, 2, 1.2), skitter(22, 0, 0.3), skitter(18, 1), skitter(12, 2), skitter(12, 3)] },
        { bonus: 80, groups: [group("shield", 5, 0.8, 0), group("boss", 1, 0.2, 1, 0.6), group("glider", 5, 0.6, 2, 1), group("golem", 2, 2.2, 0, 1.5), skitter(26, 0, 0.2), skitter(22, 1), skitter(14, 2), skitter(12, 3)] },
      ],
    },
    {
      name: "Night Crater",
      jade: 320,
      hp: 1.85,
      speed: 1.1,
      waves: [
        { bonus: 36, groups: [skitter(22, 0)] },
        { bonus: 42, groups: [skitter(18, 0), skitter(18, 1, 0.6)] },
        { bonus: 48, groups: [group("shield", 6, 0.75, 2), group("jaguar", 6, 0.62, 0, 0.4)] },
        { bonus: 54, groups: [group("glider", 6, 0.5, 1), group("golem", 3, 1.8, 3, 0.8)] },
        { bonus: 60, groups: [group("shield", 8, 0.62, 2), group("glider", 7, 0.42, 1, 0.3), group("jaguar", 6, 0.5, 0, 0.8)] },
        { bonus: 66, groups: [group("golem", 4, 1.5, 0), group("golem", 3, 1.5, 2, 0.4), skitter(16, 1, 0.6), skitter(24, 0, 0.2), skitter(22, 2), skitter(12, 3)] },
        { bonus: 90, groups: [group("shield", 7, 0.55, 0), group("boss", 1, 0.2, 1, 0.3), group("glider", 8, 0.4, 2, 0.5), group("jaguar", 6, 0.48, 0, 0.8), skitter(28, 0, 0.2), skitter(24, 1), skitter(16, 2), skitter(14, 3)] },
      ],
    },
  ] as const satisfies readonly WorldBalance[],
} as const;

export interface RelicDef {
  name: string;
  blurb: string;
  dart?: number;
  lens?: number;
  ramp?: number;
  stun?: number;
  jumps?: number;
  jade?: number;
  heal?: number;
  flare?: number;
  range?: number;
}

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

/** One hue per tower, used on cards, rings, and the selection badge. */
export const TOWER_HUE: Record<TowerKind, number> = {
  dart: 0x3cbe4a,
  lens: 0xffc14a,
  drum: 0x7b4dff,
  spire: 0x2ee0d0,
};

export const TOWER_ICON: Record<TowerKind, string> = {
  dart: "➤",
  lens: "☀",
  drum: "◎",
  spire: "⚡",
};

export interface TowerReadout {
  tag: string;
  /** The one number that defines the role, already formatted. */
  stat: string;
  role: string;
  /** Targets this tower prefers, for the selection panel. */
  targets: string;
  value: number;
  pips: string;
  range: number;
}

function pips(value: number, max: number): string {
  const n = Math.max(1, Math.min(5, Math.round((value / max) * 5)));
  return "■".repeat(n) + "□".repeat(5 - n);
}

/** Role line for a card. DPS figures are damage / interval. Pips compare inside the role. */
export function towerReadout(kind: TowerKind, tier: number): TowerReadout {
  if (kind === "dart") {
    const s = BALANCE.dart[tier];
    const value = s.damage / s.interval;
    return { tag: "DPS", stat: `DPS ${Math.round(value)}`, role: "Single target", targets: "First raider", value, pips: pips(value, 322), range: s.range };
  }
  if (kind === "lens") {
    const s = BALANCE.lens[tier];
    const top = s.dps + s.rampMax;
    return { tag: "BEAM", stat: `BEAM ${s.dps} to ${top}`, role: "Ramping beam", targets: "One raider", value: top, pips: pips(top, 322), range: s.range };
  }
  if (kind === "drum") {
    const s = BALANCE.drum[tier];
    const value = s.damage / s.interval;
    return { tag: "AREA", stat: `AREA ${value.toFixed(1)} per enemy`, role: "Area stun", targets: "Every raider in the ring", value, pips: pips(value, 40.8), range: s.radius };
  }
  const s = BALANCE.spire[tier];
  return { tag: "CHAIN", stat: `CHAIN ${s.jumps} targets`, role: "Chain", targets: "A crowd", value: s.jumps, pips: pips(s.jumps, 5), range: s.range };
}

export function towerDelta(kind: TowerKind, tier: number): string | null {
  if (tier >= 2) return null;
  const now = towerReadout(kind, tier);
  const next = towerReadout(kind, tier + 1);
  const left = now.tag === "DPS" || now.tag === "AREA" ? (now.tag === "AREA" ? now.value.toFixed(1) : String(Math.round(now.value))) : now.stat.replace(`${now.tag} `, "");
  const right = next.tag === "DPS" || next.tag === "AREA" ? (next.tag === "AREA" ? next.value.toFixed(1) : String(Math.round(next.value))) : next.stat.replace(`${next.tag} `, "");
  return `${now.tag} ${left} → ${right}    RANGE ${Math.round(now.range)} → ${Math.round(next.range)}`;
}

export interface TowerFacts {
  /** Damage per second on a shared scale with the other three towers. */
  dps: number;
  dpsText: string;
  range: number;
  role: string;
  targets: string;
  /** Special effect chip: stun, chain, burn, or fast. */
  chip: string;
}

function dpsText(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Build-card facts. These read the existing combat numbers and do not change them.
 * DPS is damage / interval (lens uses its base beam, before the ramp).
 * Range is the tower's reach in world units, the same unit the range ring uses.
 */
export function towerFacts(kind: TowerKind, tier: number): TowerFacts {
  if (kind === "dart") {
    const s = BALANCE.dart[tier];
    const dps = s.damage / s.interval;
    return { dps, dpsText: dpsText(dps), range: s.range, role: "Single", targets: "First raider", chip: "fast" };
  }
  if (kind === "lens") {
    const s = BALANCE.lens[tier];
    return {
      dps: s.dps,
      dpsText: `${s.dps}–${s.dps + s.rampMax}`,
      range: s.range,
      role: "Beam",
      targets: "One raider",
      chip: "burn",
    };
  }
  if (kind === "drum") {
    const s = BALANCE.drum[tier];
    const dps = s.damage / s.interval;
    return { dps, dpsText: dpsText(dps), range: s.radius, role: "Area", targets: "Every raider in the ring", chip: "stun" };
  }
  const s = BALANCE.spire[tier];
  const dps = s.damage / s.interval;
  return { dps, dpsText: dpsText(dps), range: s.range, role: "Chain", targets: "A crowd", chip: "chain" };
}

/** Shared bar ceilings so a Drum and a Dart are compared on the same scale. */
export function sharedScales(tier: number): { dps: number; range: number } {
  let dps = 1;
  let range = 1;
  for (const kind of TOWER_KINDS) {
    const facts = towerFacts(kind, tier);
    dps = Math.max(dps, facts.dps);
    range = Math.max(range, facts.range);
  }
  return { dps, range };
}
