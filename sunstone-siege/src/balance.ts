/**
 * Invented placeholder balance for Sunstone Siege.
 *
 * Every cost, hit point, damage, speed, range, reward, leak and timing value
 * the game uses lives in this file. None of these figures are measured from
 * the reference clip. The clip shows a map, walking units and a beam; it does
 * not show a HUD, a currency, or any number. Tune the game here and nowhere else.
 */
import { TOWER_KINDS, type EnemyKind, type RelicId, type SpawnGroup, type Spec, type TowerKind, type WaveDef } from "./types";

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
  /** One line for the first-sight card: which tower answers this unit. */
  weak: string;
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
  prewave: 11,
  /** Jade granted for calling a wave before the timer finishes. */
  earlyCall: 22,
  /** Movement multiplier while a drum's slow lasts. */
  slowMul: 0.48,
  /** A hit never drops below this after armor, so a shielded unit still chips. */
  minHit: 1,
  /**
   * Arrow Shower. One volley, then every unarmored raider in the ring pops.
   * Armor at or above the gate shrugs the arrows off. A boulder only chips.
   */
  shower: { radius: 150, armorGate: 6, boulderChip: 8 },
  /** Heavy Bolt. Slow, huge, and the armor it ignores is most of the plate. */
  heavy: { interval: [1.28, 1.12, 0.96] as const, speed: 900, armorMul: 0.25 },
  /** Frost Snare. Runners and boulder crews lock up harder than a normal slow. */
  snare: { dur: 3.4, mul: 0.22 },
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
  /** Standing still on a station fills a ring, then spends the price. */
  fund: {
    radius: 48,
    /** How long the hero must stay before the pad builds or upgrades. */
    dwell: 0.9,
    /** How close the hero must be before the pad previews its tower. */
    preview: 150,
  },
  /** Kill gems sit on the ground until the hero walks into the magnet. */
  gem: {
    /** Walk into the pile. Once inside, the coins snap to the hero. */
    magnet: 150,
    life: 14,
    fly: 1100,
  },
  /** A palisade pad. Wood, then spiked wood, then stone. A breach is repaired in place. */
  wall: {
    cost: [40, 65, 100] as const,
    repair: [24, 36, 48] as const,
    hp: [420, 700, 1100] as const,
    /** Light damage per second to whoever is chewing spiked wood or stone. */
    thorn: 0.8,
  },
  /** One bolt from a tier-1 Archer. The rain and the volley are the branches. */
  bolt: {
    damage: [16, 22, 28] as const,
    interval: [0.5, 0.44, 0.38] as const,
    speed: 760,
  },
  /** Volley branch. A handful of bolts across a group, not a blanket. */
  volley: { damage: 14, count: 5, interval: 1.05, speed: 680 },
  /** Arrow Rain branch. One shot, then the circle pops. */
  rain: { damage: [72, 88, 108] as const, interval: [0.9, 0.78, 0.66] as const },
  /** Catapult branch. Slow, heavy, and only a small splash. */
  catapult: { radius: 62, interval: 1.7, speed: 420 },
  /** Ballista branch. The bolt keeps going through a short line. */
  ballista: { extra: 2, width: 28 },
  /** Sun Beam branch. It ramps while it stays on one body, and it melts a boss. */
  beam: { dps: [28, 46, 70] as const, ramp: 18, cap: 90, range: 230 },
  /** Stand on the pad and Jade keeps hiring sword soldiers. */
  recruit: { rate: 16, groupCost: 12, count: 3, hp: 28, damage: 8, interval: 0.55, speed: 140 },
  /** The crater itself. More hit points, a bigger heart, and a bolt of its own. */
  base: {
    cost: [70, 110, 160] as const,
    hp: [6, 8, 10] as const,
    damage: [7, 10, 14] as const,
    interval: 0.85,
    range: 200,
  },
  /** A sapper's blast against the palisade it reaches. */
  sapper: { blast: 260 },
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
    spear: 80,
    knight: 80,
    count: 4,
    spearCount: 6,
    knightCount: 3,
    hp: 54,
    spearHp: 90,
    knightHp: 48,
    damage: 10,
    spearDamage: 14,
    knightDamage: 22,
    interval: 0.48,
    speed: 96,
    knightSpeed: 150,
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
    { cost: 50, damage: 64, range: 200, interval: 0.85, shotSpeed: 640 },
    { cost: 70, damage: 78, range: 220, interval: 0.74, shotSpeed: 700 },
    { cost: 100, damage: 96, range: 240, interval: 0.64, shotSpeed: 760 },
  ] as const satisfies readonly DartTier[],
  lens: [
    { cost: 95, dps: 240, ramp: 0, rampMax: 0, range: 210 },
    { cost: 130, dps: 340, ramp: 0, rampMax: 0, range: 230 },
    { cost: 180, dps: 460, ramp: 0, rampMax: 0, range: 250 },
  ] as const satisfies readonly LensTier[],
  drum: [
    { cost: 70, damage: 5, radius: 150, stun: 0.28, slow: 3.2, interval: 1.45 },
    { cost: 100, damage: 7, radius: 170, stun: 0.34, slow: 3.6, interval: 1.25 },
    { cost: 140, damage: 9, radius: 190, stun: 0.4, slow: 4, interval: 1.1 },
  ] as const satisfies readonly DrumTier[],
  spire: [
    { cost: 130, damage: 18, jumps: 3, falloff: 0.72, range: 160, chain: 136, interval: 0.92 },
    { cost: 165, damage: 32, jumps: 4, falloff: 0.76, range: 188, chain: 152, interval: 0.76 },
    { cost: 260, damage: 50, jumps: 5, falloff: 0.8, range: 220, chain: 170, interval: 0.64 },
  ] as const satisfies readonly SpireTier[],
  towerName: {
    dart: "Arrow Shower",
    lens: "Heavy Bolt",
    drum: "Frost Snare",
    spire: "Serpent Spire",
  } as const satisfies Record<TowerKind, string>,
  towerBlurb: {
    dart: "A rain of arrows. It mows a swarm of small raiders and bounces off armor.",
    lens: "One huge hit. It melts a brute or a boulder and is wasted on a swarm.",
    drum: "Vines of frost. It stalls runners and the crew pushing a boulder.",
    spire: "Jade arcs that leap across a crowd. A stunned target takes the heavier arc.",
  } as const satisfies Record<TowerKind, string>,
  enemies: {
    // Skitter is the horde fodder. A 150-body line at the new size turns into a
    // smear, so the jungle's biggest pack is 110 (was 244) and the later
    // valleys field fewer still, because their HP multiplier stacks on this.
    // HP 60 means a tier-1 Dart (24) needs three hits and a tier-2 Dart (58)
    // needs two. Reward 4 and leak 0.4 keep bounty and leak pressure near the
    // old one-shot swarm.
    skitter: { name: "Skitter", hp: 58, speed: 96, armor: 0, reward: 4, leak: 0.4, charge: 4, flying: false, weak: "Weak to Arrow Rain" },
    runner: { name: "Runner", hp: 32, speed: 168, armor: 0, reward: 7, leak: 1, charge: 9, flying: false, weak: "Stall with Vine Snare" },
    shield: { name: "Shieldbearer", hp: 160, speed: 48, armor: 10, reward: 12, leak: 2, charge: 12, flying: false, weak: "Needs a Ballista or Catapult" },
    jaguar: { name: "Jaguar Stalker", hp: 44, speed: 120, armor: 0, reward: 11, leak: 1, charge: 11, flying: false, weak: "Weak to Arrow Rain" },
    golem: { name: "Stone Golem", hp: 200, speed: 32, armor: 10, reward: 22, leak: 3, charge: 18, flying: false, weak: "Needs a Ballista" },
    shard: { name: "Golem Shard", hp: 40, speed: 78, armor: 0, reward: 5, leak: 1, charge: 6, flying: false, weak: "Weak to Arrow Rain" },
    glider: { name: "Glider", hp: 44, speed: 132, armor: 0, reward: 11, leak: 1, charge: 10, flying: true, weak: "Only Archer and Mystic can hit it" },
    roller: { name: "Boulder Crew", hp: 640, speed: 40, armor: 12, reward: 28, leak: 6, charge: 20, flying: false, weak: "Catapult or Spear Wall. Smashes walls" },
    boss: { name: "Obsidian Colossus", hp: 1200, speed: 28, armor: 10, reward: 100, leak: 8, charge: 40, flying: false, weak: "Sun Beam melts it" },
    giant: { name: "Club Giant", hp: 460, speed: 34, armor: 8, reward: 24, leak: 4, charge: 16, flying: false, weak: "Ballista. Smashes walls" },
    sapper: { name: "Sapper", hp: 36, speed: 156, armor: 0, reward: 6, leak: 2, charge: 5, flying: false, weak: "Arrow Rain. Blows up on a wall" },
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
      name: "Green Cut",
      jade: 190,
      hp: 1,
      speed: 1,
      waves: [
        { bonus: 24, groups: [skitter(40, 0), skitter(32, 1)] },
        { bonus: 28, groups: [skitter(28, 0), skitter(24, 1, 0.3)] },
        { bonus: 32, groups: [skitter(36, 0), skitter(28, 1)] },
        { bonus: 36, groups: [skitter(20, 0), group("runner", 6, 0.28, 1, 0.6)] },
        { bonus: 40, groups: [skitter(44, 0), skitter(32, 1)] },
      ],
    },
    {
      name: "Runner Ridge",
      jade: 210,
      hp: 1,
      speed: 1,
      waves: [
        { bonus: 26, groups: [skitter(18, 0), skitter(16, 1)] },
        { bonus: 30, groups: [group("runner", 36, 0.08, 0), group("runner", 28, 0.08, 1)] },
        { bonus: 34, groups: [group("runner", 32, 0.08, 0), group("runner", 24, 0.08, 1), skitter(12, 0, 0.6)] },
        { bonus: 38, groups: [group("runner", 40, 0.08, 0), group("runner", 28, 0.08, 1)] },
        { bonus: 42, groups: [group("runner", 36, 0.08, 0), group("runner", 28, 0.08, 1, 0.2)] },
      ],
    },
    {
      name: "Twin Canyon",
      jade: 360,
      hp: 1.02,
      speed: 1,
      waves: [
        { bonus: 30, groups: [skitter(16, 0), skitter(16, 1, 0.4)] },
        { bonus: 36, groups: [group("shield", 3, 1.1, 0), skitter(10, 1, 0.6)] },
        { bonus: 40, groups: [group("shield", 3, 1.05, 0), group("shield", 3, 1.05, 1, 0.3)] },
        { bonus: 44, groups: [group("shield", 3, 1, 0), group("sapper", 3, 0.45, 1, 0.4), group("runner", 8, 0.3, 1, 0.8)] },
        { bonus: 48, groups: [group("shield", 4, 0.95, 0), group("shield", 3, 1, 1, 0.4), skitter(10, 0, 1)] },
      ],
    },
    {
      name: "Brute Steps",
      jade: 380,
      hp: 1.04,
      speed: 1,
      waves: [
        { bonus: 30, groups: [skitter(14, 0), skitter(12, 1, 0.5)] },
        { bonus: 36, groups: [group("golem", 2, 2.4, 0), skitter(10, 1, 0.8)] },
        { bonus: 42, groups: [group("golem", 2, 2.2, 0), group("golem", 2, 2.2, 1, 0.6)] },
        { bonus: 46, groups: [group("golem", 3, 2, 0), group("shield", 3, 0.9, 1, 0.5)] },
        { bonus: 52, groups: [group("golem", 2, 2, 0), group("giant", 1, 0.4, 1, 0.6), skitter(14, 0, 1)] },
      ],
    },
    {
      name: "High Wind",
      jade: 340,
      hp: 1.04,
      speed: 1.02,
      waves: [
        { bonus: 28, groups: [skitter(14, 0), skitter(12, 1, 0.4)] },
        { bonus: 34, groups: [group("glider", 16, 0.22, 0), group("glider", 14, 0.22, 1, 0.3)] },
        { bonus: 38, groups: [group("glider", 18, 0.2, 0), group("glider", 16, 0.2, 1, 0.2)] },
        { bonus: 42, groups: [group("glider", 14, 0.2, 1), group("runner", 16, 0.2, 0, 0.3)] },
        { bonus: 48, groups: [group("glider", 20, 0.18, 0), group("glider", 16, 0.18, 1, 0.2)] },
      ],
    },
    {
      name: "Boulder Bend",
      jade: 340,
      hp: 1.05,
      speed: 1,
      waves: [
        { bonus: 30, groups: [skitter(20, 0), skitter(16, 1)] },
        { bonus: 40, groups: [group("roller", 1, 0.2, 0), skitter(12, 1, 0.4)] },
        { bonus: 46, groups: [group("roller", 2, 3.2, 0), skitter(10, 1)] },
        { bonus: 50, groups: [group("roller", 2, 2.8, 0), skitter(12, 0, 1.2), skitter(10, 1, 0.6)] },
        { bonus: 56, groups: [group("roller", 3, 2.6, 0), skitter(12, 1, 0.5)] },
      ],
    },
    {
      name: "Three Gates",
      jade: 520,
      hp: 1.08,
      speed: 1.02,
      waves: [
        { bonus: 32, groups: [skitter(14, 0), skitter(12, 1, 0.3), skitter(12, 2, 0.5)] },
        { bonus: 38, groups: [group("runner", 8, 0.3, 0), group("shield", 3, 0.9, 1, 0.4), skitter(8, 2, 0.6)] },
        { bonus: 44, groups: [group("glider", 8, 0.3, 2), group("golem", 2, 2.2, 0, 0.5)] },
        { bonus: 50, groups: [group("roller", 1, 0.2, 1), group("sapper", 4, 0.4, 0, 0.5), group("giant", 1, 0.4, 2, 0.8), skitter(12, 0, 1.2)] },
        { bonus: 58, groups: [group("golem", 2, 2,1, 0), group("shield", 3, 0.85, 1, 0.4), group("glider", 6, 0.3, 2, 0.5)] },
      ],
    },
    {
      name: "Colossus Stair",
      jade: 460,
      hp: 1.1,
      speed: 1,
      waves: [
        { bonus: 32, groups: [skitter(16, 0), skitter(12, 1, 0.4)] },
        { bonus: 38, groups: [group("shield", 4, 0.85, 0), group("runner", 8, 0.28, 1, 0.4)] },
        { bonus: 44, groups: [group("golem", 2, 2.2, 0), skitter(10, 1, 0.6)] },
        { bonus: 50, groups: [group("roller", 1, 0.2, 1), group("shield", 3, 0.9, 0, 0.8)] },
        { bonus: 80, groups: [group("boss", 1, 0.2, 0), skitter(12, 1, 1.2)] },
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
  lens: "◆",
  drum: "❄",
  spire: "⚡",
};

/** One line on an empty pad: what funding it is for. */
export const ROLE_HINT: Record<TowerKind | "barracks" | "wall" | "recruit" | "base", string> = {
  dart: "Archer. Bolts, then a branch",
  lens: "Siege. Slow, heavy hits",
  drum: "Mystic. Slows, then a branch",
  spire: "Chains a crowd",
  barracks: "Squad. Blocks the path",
  wall: "Palisade. Bunches a crowd",
  recruit: "Stand to hire soldiers",
  base: "Bigger heart, a bolt of its own",
};

export interface TechNode {
  id: string;
  name: string;
  icon: string;
  role: string;
  strong: string;
  weak: string;
  cost: string;
  /** Valley index where this opens. 0 is the first valley. */
  unlock: number;
}

/** The tree the pause menu and the valley select both show. Costs are ours. */
export const TECH: readonly TechNode[] = [
  { id: "archer", name: "Archer", icon: "➤", role: "One glowing bolt", strong: "Flyers", weak: "Armor and giants", cost: "50", unlock: 0 },
  { id: "volley", name: "Volley", icon: "➤", role: "A spread of bolts", strong: "Mid-size groups", weak: "Armor", cost: "70", unlock: 0 },
  { id: "rain", name: "Arrow Rain", icon: "☔", role: "A cloud of arrows", strong: "Swarms, bunched on a wall", weak: "Giants, boulders, shields", cost: "70", unlock: 0 },
  { id: "siege", name: "Bolt Thrower", icon: "◆", role: "One slow heavy hit", strong: "A single brute", weak: "Swarms", cost: "95", unlock: 1 },
  { id: "ballista", name: "Ballista", icon: "⇨", role: "A bolt that pierces a line", strong: "Giants and golems", weak: "A wide swarm", cost: "130", unlock: 1 },
  { id: "catapult", name: "Catapult", icon: "◉", role: "A slow heavy splash", strong: "Boulders and shields", weak: "A long swarm", cost: "130", unlock: 1 },
  { id: "totem", name: "Totem", icon: "❄", role: "A slowing pulse", strong: "Runners", weak: "Anything armored", cost: "70", unlock: 2 },
  { id: "snare", name: "Vine Snare", icon: "🌿", role: "A root that stops a lane", strong: "Runners and boulder crews", weak: "Bosses", cost: "100", unlock: 2 },
  { id: "beam", name: "Sun Beam", icon: "☀", role: "A beam that ramps", strong: "The end boss", weak: "A swarm", cost: "100", unlock: 2 },
  { id: "squad", name: "Squad", icon: "⚑", role: "Four blockers", strong: "Holding a lane", weak: "Boulders and flyers", cost: "55", unlock: 3 },
  { id: "spears", name: "Spear Wall", icon: "🔱", role: "A wall of spears", strong: "Holds a boulder", weak: "Flyers", cost: "80", unlock: 3 },
  { id: "knights", name: "Knights", icon: "⚔", role: "Hard-hitting, mobile", strong: "Brutes they can reach", weak: "Boulders and flyers", cost: "80", unlock: 3 },
  { id: "wall", name: "Palisade", icon: "▮", role: "Wood, spikes, then stone", strong: "Bunching a swarm for rain", weak: "Giants, sappers, boulders", cost: "40", unlock: 0 },
  { id: "recruit", name: "Soldier pad", icon: "⚔", role: "Stand and keep hiring", strong: "A trickle of melee", weak: "It spends Jade the whole time", cost: "12 a group", unlock: 1 },
  { id: "heart", name: "Base heart", icon: "☀", role: "More HP and a small bolt", strong: "Surviving a leak", weak: "It will not hold a lane", cost: "70", unlock: 0 },
];

const FAMILY_SPEC: Record<"dart" | "lens" | "drum" | "barracks", readonly [Spec, Spec]> = {
  dart: ["volley", "rain"],
  lens: ["ballista", "catapult"],
  drum: ["snare", "beam"],
  barracks: ["spears", "knights"],
};

export function specChoices(kind: string): readonly [Spec, Spec] | null {
  if (kind === "dart" || kind === "lens" || kind === "drum" || kind === "barracks") return FAMILY_SPEC[kind];
  return null;
}

/** What a funding bot picks when the player is not there to choose. */
export function autoSpec(kind: string, world: number): Spec {
  if (kind === "dart") return "rain";
  if (kind === "lens") return world === 5 || world === 6 ? "catapult" : "ballista";
  if (kind === "drum") return world === 7 ? "beam" : "snare";
  if (kind === "barracks") return "spears";
  return "none";
}

export function familyUnlocked(kind: string, world: number): boolean {
  if (kind === "dart" || kind === "wall" || kind === "base") return true;
  if (kind === "lens" || kind === "recruit") return world >= 1;
  if (kind === "drum") return world >= 2;
  if (kind === "barracks") return world >= 3;
  return true;
}

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
    return { tag: "VOLLEY", stat: `VOLLEY ${s.damage}`, role: "Arrow shower", targets: "A swarm of small raiders", value, pips: pips(value, 160), range: s.range };
  }
  if (kind === "lens") {
    const s = BALANCE.lens[tier];
    const gap = BALANCE.heavy.interval[tier];
    return { tag: "HIT", stat: `HIT ${s.dps}`, role: "Heavy bolt", targets: "Brutes and the boulder", value: s.dps / gap, pips: pips(s.dps, 460), range: s.range };
  }
  if (kind === "drum") {
    const s = BALANCE.drum[tier];
    const value = s.slow;
    return { tag: "SLOW", stat: `SLOW ${s.slow.toFixed(1)}s`, role: "Frost snare", targets: "Runners and boulder crews", value, pips: pips(value, 4), range: s.radius };
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
    return { dps, dpsText: dpsText(dps), range: s.range, role: "Volley", targets: "Small swarms", chip: "shower" };
  }
  if (kind === "lens") {
    const s = BALANCE.lens[tier];
    const gap = BALANCE.heavy.interval[tier];
    return {
      dps: s.dps / gap,
      dpsText: String(s.dps),
      range: s.range,
      role: "Heavy",
      targets: "Brutes and the boulder",
      chip: "hit",
    };
  }
  if (kind === "drum") {
    const s = BALANCE.drum[tier];
    const dps = s.damage / s.interval;
    return { dps, dpsText: dpsText(dps), range: s.radius, role: "Slow", targets: "Runners and boulder crews", chip: "slow" };
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
