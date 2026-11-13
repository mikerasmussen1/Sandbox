/**
 * Combat simulation. No rendering and no storage, so a valley can be played
 * forward in a test without a browser.
 */
import { autoSpec, BALANCE, familyUnlocked, specChoices, TOWER_HUE, towerCost, towerRange, type RelicDef } from "./balance";
import { carryLaunch } from "./carry";
import { poseAt, type Route } from "./geom";
import { clearStationGaps, MAP_H, MAP_W, mapDef, type MapDef } from "./maps";
import type { EnemyKind, Phase, RelicId, Spec, TowerKind, Vec } from "./types";

export type StationKind = TowerKind | "wall" | "barracks" | "recruit" | "base";

export interface Station {
  index: number;
  x: number;
  y: number;
  kind: StationKind;
  /** What this empty pad will let the hero build. Walls are not a choice. */
  offers: StationKind[];
  /** False until the hero picks an offer. Standing does not pour before that. */
  chosen: boolean;
  /** Tier-2 branch. `none` until the hero (or the bot) picks one. */
  spec: Spec;
  /** Seconds the wall's HP bar stays up after a hit. */
  hurt: number;
  path: number;
  /** Distance along the route. Walls block here. Tower pads only use it for layout. */
  dist: number;
  paid: number;
  /** 0 is an empty pad. 1, 2 and 3 are built tiers. */
  tier: number;
  hp: number;
  maxHp: number;
  alive: boolean;
}

export interface Drop {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: number;
  life: number;
  alive: boolean;
}

export interface LanePlan {
  path: number;
  x: number;
  y: number;
  /** Direction the lane travels, radians. */
  angle: number;
  lead: EnemyKind;
  leadCount: number;
  parts: { kind: EnemyKind; count: number }[];
  /** wait: still coming. soon: about to spawn. gone: this lane has started. */
  state: "wait" | "soon" | "gone";
}

export interface Enemy {
  id: number;
  kind: EnemyKind;
  path: number;
  dist: number;
  x: number;
  y: number;
  angle: number;
  hp: number;
  maxHp: number;
  armor: number;
  speed: number;
  reward: number;
  leak: number;
  charge: number;
  flying: boolean;
  boss: boolean;
  age: number;
  slowUntil: number;
  stunUntil: number;
  slam: number;
  /** Countdown until the next obsidian shell. Boss only. */
  aegis: number;
  aegisUntil: number;
  /** Countdown until the next rally roar. Boss only. */
  rally: number;
  rushUntil: number;
  flash: number;
  alive: boolean;
  /** Fixed sideways offset so a blob fills the trail instead of walking single file. */
  lane: number;
  striking: boolean;
  strikeLeft: number;
  /** Seconds left on a shield block pose. */
  guard: number;
  react: "" | "hit" | "block";
  reactLeft: number;
  knockX: number;
  knockY: number;
  hop: number;
  /** Seconds left on a boss roar pose. */
  emote: number;
  /** Shots left in the boulder a Golem is pushing. Zero means the rock is gone. */
  boulder: number;
  /** Frost has the legs pinned. Runners and boulder crews take the hard snare. */
  snareUntil: number;
}

export interface Ally {
  id: number;
  path: number;
  dist: number;
  x: number;
  y: number;
  angle: number;
  hp: number;
  maxHp: number;
  cool: number;
  alive: boolean;
  role: "squad" | "spear" | "knight" | "recruit";
}

export interface Tower {
  id: number;
  kind: TowerKind;
  tier: number;
  pad: number;
  x: number;
  y: number;
  spent: number;
  cooldown: number;
  stunnedUntil: number;
  targetId: number;
  ramp: number;
  angle: number;
  /** Damage this totem has actually dealt in the valley. */
  dealt: number;
  spec: Spec;
}

export interface Shot {
  id: number;
  x: number;
  y: number;
  px: number;
  py: number;
  tx: number;
  ty: number;
  targetId: number;
  damage: number;
  speed: number;
  alive: boolean;
  towerId: number;
  /** Who painted this bolt, so the trail can wear that family's color. */
  family: TowerKind | "hero";
  tier: number;
  /** Arrow Rain blankets this radius. 0 is a single hit. */
  splash: number;
  /** Extra bodies a ballista may catch along the bolt. */
  pierce: number;
  rain: boolean;
}

export interface Puddle {
  x: number;
  y: number;
  radius: number;
  life: number;
  max: number;
  /** Drum decals are the splash that already landed. Venom keeps slowing. */
  kind: "drum" | "spire";
}

/** A sun spear the Guardian has already thrown. One target, then it is gone. */
export interface Spear {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  age: number;
  flight: number;
  targetId: number;
  raw: number;
  saved: boolean;
  struck: boolean;
  alive: boolean;
}

export type FxKind = "impact" | "death" | "jade" | "drum" | "chain" | "crack" | "flare" | "slam" | "boss" | "place" | "streak" | "relic" | "aegis" | "rally" | "banner" | "multi" | "callout" | "collect" | "num" | "rubble" | "pay" | "tick" | "volley" | "intro" | "loom" | "splinter";

/** How long a carried gem takes to arc from the hero onto a pad. */
export const PAY_FLIGHT = 0.34;

export interface Fx {
  kind: FxKind;
  x: number;
  y: number;
  n?: number;
  text?: string;
  pts?: Vec[];
  enemy?: EnemyKind;
  /** Impact burst color. Hits also flash the raider white. */
  color?: number;
  /** Where a carried gem is flying. */
  tx?: number;
  ty?: number;
}

interface QueuedSpawn {
  t: number;
  kind: EnemyKind;
  path: number;
}

const SHOTS = 160;

export function streakBonus(combo: number): number {
  if (combo === 5) return 8;
  if (combo === 10) return 14;
  if (combo === 25) return 24;
  if (combo === 50) return 40;
  if (combo >= 100 && combo % 50 === 0) return 40;
  return 0;
}

export function stealthed(kind: EnemyKind, age: number): boolean {
  if (kind !== "jaguar") return false;
  const m = age % BALANCE.jaguar.cycle;
  return m > BALANCE.jaguar.cycle - BALANCE.jaguar.dur;
}

/** How much trail a body wants. Bigger sprites need a wider crowd. */
function padOffers(kind: StationKind, world: number): StationKind[] {
  if (kind === "wall") return ["wall"];
  if (kind === "recruit") return ["recruit"];
  if (kind === "base") return ["base"];
  const open: StationKind[] = ["dart"];
  if (familyUnlocked("lens", world)) open.push("lens");
  if (familyUnlocked("drum", world)) open.push("drum");
  if (kind === "barracks" && familyUnlocked("barracks", world)) open.unshift("barracks");
  if (open.includes(kind)) return [kind, ...open.filter((k) => k !== kind)];
  return open;
}

function girth(kind: EnemyKind): number {
  if (kind === "boss") return 86;
  if (kind === "roller") return 96;
  if (kind === "giant") return 84;
  if (kind === "golem") return 72;
  if (kind === "shield" || kind === "glider") return 58;
  return 62;
}

export class Siege {
  readonly map: MapDef;
  readonly world: number;
  time = 0;
  jade: number;
  integrity: number = BALANCE.integrity;
  integrityMax: number = BALANCE.integrity;
  /** 0 until the heart pad is bought. Each step grows the crater and its bolt. */
  baseTier = 0;
  /** Family bot override for the tier-2 branch. */
  preferSpec: Spec | null = null;
  private baseCool = 0;
  private recruitBank = 0;
  phase: Phase = "build";
  /** Index of the wave in progress, or the next wave during a build. */
  wave = 0;
  buildLeft: number = BALANCE.prewave;
  earlyGranted = false;
  flare = 0;
  flareLock = 0;
  /** Facing of the Guardian. Angle 0 is east, and y grows downward. */
  guardianAim = Math.PI / 2;
  /** Seconds left on the attack pose. */
  guardianCast = 0;
  guardianKills = 0;
  /** Kept so older checks still compile. The walking hero does not score saves. */
  guardianSaves = 0;
  readonly spears: Spear[] = [];
  heroX = 0;
  heroY = 0;
  heroMoving = false;
  /** True once the hero has actually walked. The opening prompt watches this. */
  heroMoved = false;
  /** True once a ground gem has reached the hero. */
  heroCollected = false;
  /** Station index currently being funded, or -1. */
  funding = -1;
  readonly stations: Station[] = [];
  readonly drops: Drop[] = [];
  readonly puddles: Puddle[] = [];
  readonly allies: Ally[] = [];
  private steerX = 0;
  private steerY = 0;
  private heroCool = 0;
  private readonly dropFree: Drop[] = [];
  pendingOffer: RelicId[] | null = null;
  offerLeft = 0;
  readonly relics: RelicId[] = [];
  private readonly seen = new Set<EnemyKind>();
  private dartMul = 1;
  private lensDpsMul = 1;
  private lensRampMul = 1;
  private drumStunMul = 1;
  private spireJumpAdd = 0;
  private spireDmgMul = 1;
  private jadeMul = 1;
  private flareMul = 1;
  private rangeMul = 1;
  private combo = 0;
  private comboUntil = 0;
  /** Jade broken out by where it came from, for the counter popover. */
  readonly purse = { kills: 0, waves: 0, early: 0, streaks: 0 };
  readonly enemies: Enemy[] = [];
  readonly towers: Tower[] = [];
  readonly shots: Shot[] = [];
  readonly fx: Fx[] = [];
  private uid = 1;
  private queue: QueuedSpawn[] = [];
  private q = 0;
  private waveStartedAt = 0;
  private readonly occupied = new Set<number>();
  private readonly freeEnemies: Enemy[] = [];
  private shotCursor = 0;
  private goal: { x: number; y: number } | null = null;
  private fundBank = 0;
  private readonly pours: { index: number; left: number; tier: number }[] = [];

  constructor(world: number) {
    this.world = world;
    this.map = mapDef(world);
    this.jade = BALANCE.worlds[world].jade;
    this.heroX = this.map.sun.x;
    this.heroY = Math.min(MAP_H - 36, this.map.sun.y + this.map.plaza * 0.72);
    this.stations.push(...this.buildStations());
    this.seedLesson();
    for (let i = 0; i < SHOTS; i++) {
      this.shots.push({
        id: 0, x: 0, y: 0, px: 0, py: 0, tx: 0, ty: 0, targetId: 0, damage: 0, speed: 0, alive: false, towerId: 0,
        family: "hero", tier: 0, splash: 0, pierce: 0, rain: false,
      });
    }
  }

  get pads(): readonly Vec[] {
    return this.map.pads;
  }

  get waveCount(): number {
    return BALANCE.worlds[this.world].waves.length;
  }

  /** 1-based wave the HUD should name. */
  get waveShown(): number {
    return Math.min(this.waveCount, this.wave + 1);
  }

  /** Relic range multiplier. The placement ring uses the same figure. */
  get rangeScale(): number {
    return this.rangeMul;
  }

  get streak(): number {
    return this.time <= this.comboUntil ? this.combo : 0;
  }

  get aliveCount(): number {
    let n = 0;
    for (const e of this.enemies) if (e.alive) n += 1;
    return n;
  }

  private nextId(): number {
    this.uid += 1;
    return this.uid;
  }

  place(pad: number, kind: TowerKind): boolean {
    if (this.phase === "victory" || this.phase === "defeat") return false;
    if (pad < 0 || pad >= this.map.pads.length || this.occupied.has(pad)) return false;
    const cost = towerCost(kind, 0);
    if (this.jade < cost) return false;
    this.jade -= cost;
    this.occupied.add(pad);
    const at = this.map.pads[pad];
    this.towers.push({
      id: this.nextId(),
      kind,
      tier: 0,
      pad,
      x: at.x,
      y: at.y,
      spent: cost,
      cooldown: 0.15,
      stunnedUntil: 0,
      targetId: 0,
      ramp: 0,
      angle: Math.atan2(this.map.sun.y - at.y, this.map.sun.x - at.x),
      dealt: 0,
      spec: "none",
    });
    const station = this.stations.find((s) => s.kind !== "wall" && s.index === pad);
    if (station) station.tier = Math.max(station.tier, 1);
    this.fx.push({ kind: "place", x: at.x, y: at.y });
    return true;
  }

  upgrade(id: number): boolean {
    const tower = this.towers.find((t) => t.id === id);
    if (!tower || tower.tier >= 2) return false;
    if (this.phase === "victory" || this.phase === "defeat") return false;
    const cost = towerCost(tower.kind, tower.tier + 1);
    if (this.jade < cost) return false;
    this.jade -= cost;
    tower.spent += cost;
    tower.tier += 1;
    tower.cooldown = Math.max(tower.cooldown, 0.12);
    this.fx.push({ kind: "place", x: tower.x, y: tower.y });
    return true;
  }

  sell(id: number): number {
    const i = this.towers.findIndex((t) => t.id === id);
    if (i < 0) return 0;
    if (this.phase === "victory" || this.phase === "defeat") return 0;
    const tower = this.towers[i];
    const refund = Math.floor(tower.spent * BALANCE.sellRefund);
    this.jade += refund;
    this.occupied.delete(tower.pad);
    const station = this.stations.find((s) => s.kind !== "wall" && s.index === tower.pad);
    if (station) {
      station.tier = 0;
      station.paid = 0;
      station.spec = "none";
    }
    this.towers.splice(i, 1);
    this.fx.push({ kind: "jade", x: tower.x, y: tower.y, text: `+${refund}`, n: refund });
    return refund;
  }

  callWave(): boolean {
    if (this.phase !== "build" || this.pendingOffer) return false;
    if (this.buildLeft > 0.25 && !this.earlyGranted) {
      this.jade += BALANCE.earlyCall;
      this.purse.early += BALANCE.earlyCall;
      this.earlyGranted = true;
      this.fx.push({ kind: "jade", x: this.map.sun.x, y: this.map.sun.y - 120, text: `+${BALANCE.earlyCall}`, n: BALANCE.earlyCall });
    }
    this.startWave();
    return true;
  }

  fireFlare(): boolean {
    if (this.phase === "victory" || this.phase === "defeat") return false;
    if (this.flare < BALANCE.flare.need || this.time < this.flareLock) return false;
    this.flare = 0;
    this.flareLock = this.time + BALANCE.flare.lock;
    this.fx.push({ kind: "flare", x: this.map.sun.x, y: this.map.sun.y });
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const raw = (e.boss ? BALANCE.flare.bossDamage : BALANCE.flare.damage) * this.flareMul;
      this.hurt(e, raw, true);
    }
    return true;
  }

  /** Where the Guardian is standing right now. */
  heroAt(): { x: number; y: number } {
    return { x: this.heroX, y: this.heroY };
  }

  /** The gun is always ready. The portrait no longer gates a manual throw. */
  get guardianReady(): number {
    return 1;
  }

  /** Stick or keyboard, each axis about -1 to 1. The hero walks this way until the next call. */
  setSteer(x: number, y: number): void {
    this.steerX = x;
    this.steerY = y;
  }

  /** Walk in a straight line to a tapped point. A stick or key press cancels it. */
  setGoal(x: number, y: number): void {
    this.goal = {
      x: Math.max(28, Math.min(MAP_W - 28, x)),
      y: Math.max(28, Math.min(MAP_H - 28, y)),
    };
  }

  clearGoal(): void {
    this.goal = null;
  }

  get goalAt(): { x: number; y: number } | null {
    return this.goal;
  }

  /** Price of the next tier on this station, or 0 when it is finished. */
  stationCost(station: Station): number {
    if (station.kind === "recruit") return 0;
    if (station.kind === "wall") {
      if (station.tier > 0 && !station.alive) return BALANCE.wall.repair[station.tier - 1];
      if (station.tier >= 3) return 0;
      return BALANCE.wall.cost[station.tier];
    }
    if (station.tier >= 3) return 0;
    if (station.kind === "base") return BALANCE.base.cost[station.tier];
    if (station.kind === "barracks") {
      if (station.tier === 0) return BALANCE.barracks.squad;
      if (station.tier === 1) return station.spec === "knights" ? BALANCE.barracks.knight : BALANCE.barracks.spear;
      return 0;
    }
    return towerCost(station.kind, station.tier);
  }

  /**
   * Pay a station off in one step. The headless bot uses this for the Jade
   * it would have poured in while standing on the pad during a build.
   */
  fundNow(index: number): boolean {
    const station = this.stations[index];
    if (!station || station.kind === "recruit") return false;
    if (this.phase === "victory" || this.phase === "defeat") return false;
    const repairing = station.kind === "wall" && station.tier > 0 && !station.alive;
    if (station.tier >= 3 && !repairing) return false;
    if (station.tier === 1 && station.spec === "none" && specChoices(station.kind)) {
      station.spec = this.preferSpec && specChoices(station.kind)?.includes(this.preferSpec)
        ? this.preferSpec
        : autoSpec(station.kind, this.world);
    }
    const left = this.stationCost(station) - station.paid;
    if (left <= 0 || this.jade < left) return false;
    station.chosen = true;
    this.jade -= left;
    station.paid = 0;
    this.finishStation(station, left);
    return true;
  }

  /** Pick the tier-2 branch. The pour starts once the hero stands on the pad. */
  chooseSpec(index: number, spec: Spec): boolean {
    const station = this.stations[index];
    const choices = station ? specChoices(station.kind) : null;
    if (!station || !choices || station.tier !== 1 || station.spec !== "none") return false;
    if (!choices.includes(spec)) return false;
    station.spec = spec;
    return true;
  }

  /** Lock an empty pad to one of its offers. The pour starts once the hero stands still. */
  chooseStation(index: number, kind: StationKind): boolean {
    const station = this.stations[index];
    if (!station || station.chosen || station.tier > 0) return false;
    if (!station.offers.includes(kind)) return false;
    station.kind = kind;
    station.chosen = true;
    station.paid = 0;
    return true;
  }

  chooseRelic(id: RelicId): boolean {
    if (!this.pendingOffer?.includes(id)) return false;
    this.applyRelic(id);
    this.relics.push(id);
    this.pendingOffer = null;
    const spec = BALANCE.relics[id];
    this.fx.push({ kind: "relic", x: this.map.sun.x, y: this.map.sun.y - 90, text: spec.name });
    return true;
  }

  /** Test hook: a totem that does not take a pad. */
  forceTower(kind: TowerKind, x: number, y: number): Tower {
    const tower: Tower = {
      id: this.nextId(),
      kind,
      tier: 0,
      pad: -1,
      x,
      y,
      spent: towerCost(kind, 0),
      cooldown: 0,
      stunnedUntil: 0,
      targetId: 0,
      ramp: 0,
      angle: 0,
      dealt: 0,
      spec: "none",
    };
    this.towers.push(tower);
    return tower;
  }

  /** Test hook: a raider already on a trail. */
  forceEnemy(kind: EnemyKind, path: number, dist: number): Enemy {
    return this.birth(kind, path, dist);
  }

  tick(dt: number): void {
    if (dt <= 0) return;
    if (this.phase === "victory" || this.phase === "defeat") return;
    this.time += dt;
    for (const e of this.enemies) if (e.flash > 0) e.flash = Math.max(0, e.flash - dt);

    if (this.phase === "build") {
      if (this.pendingOffer) {
        this.offerLeft -= dt;
        if (this.offerLeft <= 0) this.chooseRelic(this.pendingOffer[0]);
      }
      if (!this.pendingOffer) {
        this.buildLeft -= dt;
        if (this.buildLeft <= 0) this.startWave();
      }
    }

    this.heroAct(dt);
    if (this.phase === "wave") this.spawn();
    if (this.move(dt)) {
      this.spearAct(dt);
      return;
    }
    this.towersAct(dt);
    this.baseAct(dt);
    this.shotsAct(dt);
    this.allyAct(dt);
    this.recruitAct(dt);
    for (const station of this.stations) if (station.hurt > 0) station.hurt = Math.max(0, station.hurt - dt);
    this.puddleAct(dt);
    this.spearAct(dt);
    this.compact();
    if (this.phase === "wave" && this.q >= this.queue.length && !this.enemies.some((e) => e.alive)) {
      const spec = BALANCE.worlds[this.world].waves[this.wave];
      const bonus = Math.round(spec.bonus * this.jadeMul);
      this.jade += bonus;
      this.purse.waves += bonus;
      this.fx.push({ kind: "banner", x: this.map.sun.x, y: this.map.sun.y - 80, text: `Wave ${this.wave + 1} cleared  +${bonus} Jade` });
      this.fx.push({ kind: "jade", x: this.map.sun.x, y: this.map.sun.y - 140, text: `+${bonus}`, n: bonus });
      this.wave += 1;
      if (this.wave >= this.waveCount) this.phase = "victory";
      else {
        this.phase = "build";
        this.buildLeft = BALANCE.prewave;
        this.earlyGranted = false;
        this.rollOffer();
      }
    }
  }

  private startWave(): void {
    const spec = BALANCE.worlds[this.world].waves[this.wave];
    const queue: QueuedSpawn[] = [];
    let t = 0.35;
    // Skitter packs in one wave share a start, so every trail fills at once
    // instead of one clot finishing before the next path begins.
    let skitterAt = -1;
    for (const g of spec.groups) {
      if (g.kind === "skitter") {
        if (skitterAt < 0) skitterAt = t + g.gap;
        let at = skitterAt;
        // Packs of four, then a gap, so the crowd reads as clumps instead of a line.
        // Big packs still arrive together, or each tower along the trail
        // picks them off one at a time and the wave stops being a fight.
        // A long pack is one red snake. Short packs stay in clumps.
        const line = g.count >= 20;
        const step = line ? 0.07 : 0.14;
        const clump = line ? 10000 : 4;
        const breathe = line ? 0 : 0.55;
        for (let i = 0; i < g.count; i++) {
          queue.push({ t: at, kind: g.kind, path: g.path });
          at += step;
          if ((i + 1) % clump === 0) at += breathe;
        }
        t = Math.max(t, at);
      } else {
        t += g.gap;
        for (let i = 0; i < g.count; i++) {
          queue.push({ t, kind: g.kind, path: g.path });
          t += g.interval;
        }
      }
    }
    queue.sort((a, b) => a.t - b.t);
    this.queue = queue;
    this.q = 0;
    this.phase = "wave";
    this.buildLeft = 0;
    this.waveStartedAt = this.time;
  }

  private spawn(): void {
    const clock = this.time - this.waveStartedAt;
    while (this.q < this.queue.length && this.queue[this.q].t <= clock) {
      const s = this.queue[this.q];
      this.q += 1;
      if (s.path < 0 || s.path >= this.map.routes.length) continue;
      this.birth(s.kind, s.path, 0);
    }
  }

  private birth(kind: EnemyKind, path: number, dist: number): Enemy {
    const stat = BALANCE.enemies[kind];
    const world = BALANCE.worlds[this.world];
    const e = this.freeEnemies.pop() ?? this.blank();
    e.id = this.nextId();
    e.kind = kind;
    e.path = path;
    e.dist = dist;
    e.hp = stat.hp * world.hp;
    e.maxHp = e.hp;
    e.armor = stat.armor;
    e.speed = stat.speed * world.speed;
    e.reward = stat.reward;
    e.leak = stat.leak;
    e.charge = stat.charge;
    e.flying = stat.flying;
    e.boss = kind === "boss";
    e.age = 0;
    e.slowUntil = 0;
    e.stunUntil = 0;
    e.slam = BALANCE.boss.slamEvery * 0.65;
    e.aegis = BALANCE.boss.aegisEvery;
    e.aegisUntil = 0;
    e.rally = BALANCE.boss.rallyEvery * 0.72;
    e.rushUntil = 0;
    e.flash = 0;
    e.alive = true;
    e.lane = ((e.id * 37) % 97) - 48;
    e.striking = false;
    e.strikeLeft = 0;
    e.guard = 0;
    e.react = "";
    e.reactLeft = 0;
    e.knockX = 0;
    e.knockY = 0;
    e.hop = 0;
    e.emote = 0;
    e.boulder = kind === "golem" ? BALANCE.boulder.hp : 0;
    e.snareUntil = 0;
    const pose = poseAt(e.flying ? this.map.flights[path] : this.map.routes[path], dist);
    e.x = pose.x;
    e.y = pose.y;
    e.angle = pose.angle;
    this.enemies.push(e);
    if (kind === "boss") this.fx.push({ kind: "boss", x: e.x, y: e.y, text: stat.name });
    if (!this.seen.has(kind)) {
      this.seen.add(kind);
      this.fx.push({ kind: "intro", x: e.x, y: e.y, text: stat.name, enemy: kind });
    }
    return e;
  }

  private blank(): Enemy {
    return {
      id: 0, kind: "runner", path: 0, dist: 0, x: 0, y: 0, angle: 0, hp: 1, maxHp: 1,
      armor: 0, speed: 0, reward: 0, leak: 1, charge: 0, flying: false, boss: false,
      age: 0, slowUntil: 0, stunUntil: 0, slam: 0, aegis: 0, aegisUntil: 0, rally: 0, rushUntil: 0, flash: 0, alive: false,
      lane: 0, striking: false, strikeLeft: 0, guard: 0, react: "", reactLeft: 0, knockX: 0, knockY: 0, hop: 0, emote: 0, boulder: 0, snareUntil: 0,
    };
  }

  /** Returns true when a leak cracks the Sunstone and the valley is lost. */
  private move(dt: number): boolean {
    this.crowd();
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.age += dt;
      let mul = 1;
      if (e.stunUntil > this.time) mul = 0;
      else if (e.snareUntil > this.time) mul = BALANCE.snare.mul;
      else if (e.slowUntil > this.time) mul = BALANCE.slowMul;
      if (mul > 0 && e.rushUntil > this.time) mul *= BALANCE.boss.rallySpeed;
      e.reactLeft = Math.max(0, e.reactLeft - dt);
      if (e.reactLeft <= 0) e.react = "";
      e.guard = Math.max(0, e.guard - dt);
      e.emote = Math.max(0, e.emote - dt);
      e.hop = Math.max(0, e.hop - dt);
      const knock = Math.exp(-7 * dt);
      e.knockX *= knock;
      e.knockY *= knock;
      const route = e.flying ? this.map.flights[e.path] : this.map.routes[e.path];
      const blocked = this.pressWall(e, dt) || this.pressAlly(e);
      if (blocked) e.striking = true;
      else if (e.dist < route.len) e.striking = false;
      if (!e.striking) e.dist += e.speed * mul * dt;
      if (e.dist >= route.len) {
        e.dist = route.len;
        if (!e.striking) {
          e.striking = true;
          e.strikeLeft = e.kind === "boss" ? 0.55 : e.kind === "skitter" ? 0.26 : 0.4;
        }
        e.strikeLeft -= dt;
        this.pose(e, route);
        if (e.strikeLeft > 0) continue;
        e.alive = false;
        this.integrity -= e.leak;
        this.fx.push({ kind: "crack", x: this.map.sun.x, y: this.map.sun.y, n: e.leak });
        if (this.integrity <= 0) {
          this.integrity = 0;
          this.phase = "defeat";
          return true;
        }
        continue;
      }
      this.pose(e, route);
      if (e.boss) {
        e.slam -= dt;
        if (e.slam <= 0) {
          e.slam = BALANCE.boss.slamEvery;
          this.fx.push({ kind: "slam", x: e.x, y: e.y, n: BALANCE.boss.slamRadius });
          for (const tower of this.towers) {
            if (Math.hypot(tower.x - e.x, tower.y - e.y) <= BALANCE.boss.slamRadius) {
              tower.stunnedUntil = this.time + BALANCE.boss.slamStun;
            }
          }
        }
        e.aegis -= dt;
        if (e.aegis <= 0) {
          e.aegis = BALANCE.boss.aegisEvery;
          e.aegisUntil = this.time + BALANCE.boss.aegisDur;
          e.guard = BALANCE.boss.aegisDur;
          e.react = "block";
          e.reactLeft = BALANCE.boss.aegisDur;
          this.fx.push({ kind: "aegis", x: e.x, y: e.y });
        }
        e.rally -= dt;
        if (e.rally <= 0) {
          e.rally = BALANCE.boss.rallyEvery;
          e.emote = 0.9;
          this.fx.push({ kind: "rally", x: e.x, y: e.y, n: BALANCE.boss.rallyRadius });
          for (const other of this.enemies) {
            if (!other.alive || other.id === e.id) continue;
            if (Math.hypot(other.x - e.x, other.y - e.y) <= BALANCE.boss.rallyRadius) {
              other.rushUntil = Math.max(other.rushUntil, this.time + BALANCE.boss.rallyDur);
            }
          }
        }
      }
    }
    return false;
  }

  private towersAct(dt: number): void {
    for (const tower of this.towers) {
      if (tower.stunnedUntil > this.time) continue;
      tower.cooldown -= dt;
      if (tower.cooldown > 0) continue;
      if (tower.kind === "dart") this.dart(tower);
      else if (tower.kind === "lens") this.lens(tower);
      else if (tower.kind === "drum") this.drum(tower);
      else this.spire(tower);
      if (tower.cooldown < 0) tower.cooldown = 0;
    }
  }

  private acquire(tower: Tower, keep: number): Enemy | null {
    const range = towerRange(tower.kind, tower.tier) * this.rangeMul;
    const rangeSq = range * range;
    if (keep) {
      const held = this.enemies.find((e) => e.id === keep && e.alive && !stealthed(e.kind, e.age));
      if (held && !(held.flying && tower.kind !== "dart" && tower.kind !== "drum")) {
        const dx = held.x - tower.x;
        const dy = held.y - tower.y;
        if (dx * dx + dy * dy <= rangeSq) return held;
      }
    }
    let best: Enemy | null = null;
    let progress = -1;
    for (const e of this.enemies) {
      if (!e.alive || stealthed(e.kind, e.age)) continue;
      if (e.flying && tower.kind !== "dart" && tower.kind !== "drum") continue;
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      if (dx * dx + dy * dy > rangeSq) continue;
      const route = e.flying ? this.map.flights[e.path] : this.map.routes[e.path];
      const p = route.len > 0 ? e.dist / route.len : 0;
      if (p > progress) {
        progress = p;
        best = e;
      }
    }
    return best;
  }

  private dart(tower: Tower): void {
    const target = this.acquire(tower, 0);
    if (!target) return;
    const slowed = target.slowUntil > this.time;
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    tower.targetId = target.id;
    if (tower.spec === "rain") {
      const tier = Math.min(2, tower.tier);
      tower.cooldown += BALANCE.rain.interval[tier] * (slowed ? BALANCE.synergy.slowDart : 1);
      this.fx.push({
        kind: "loom",
        x: target.x,
        y: target.y,
        tx: tower.x,
        ty: tower.y,
        n: BALANCE.shower.radius,
        color: 0xffd24a,
      });
      this.arm(tower, target, BALANCE.rain.damage[tier] * this.dartMul, 640, { rain: true });
      return;
    }
    if (tower.spec === "volley") {
      tower.cooldown += BALANCE.volley.interval;
      const pack = this.enemies
        .filter((e) => e.alive && !stealthed(e.kind, e.age) && Math.hypot(e.x - tower.x, e.y - tower.y) <= towerRange(tower.kind, tower.tier) * this.rangeMul)
        .sort((a, b) => b.dist - a.dist)
        .slice(0, BALANCE.volley.count);
      const shots = pack.length ? pack : [target];
      for (const e of shots) this.arm(tower, e, BALANCE.volley.damage * this.dartMul, BALANCE.volley.speed, {});
      return;
    }
    const tier = Math.min(2, tower.tier);
    tower.cooldown += BALANCE.bolt.interval[tier] * (slowed ? BALANCE.synergy.slowDart : 1);
    this.arm(tower, target, BALANCE.bolt.damage[tier] * this.dartMul, BALANCE.bolt.speed, {});
  }

  private arm(tower: Tower, target: Enemy, damage: number, speed: number, style: { rain?: boolean; splash?: number; pierce?: number }): void {
    const shot = this.shots[this.shotCursor];
    this.shotCursor = (this.shotCursor + 1) % this.shots.length;
    shot.id = this.nextId();
    shot.x = tower.x;
    shot.y = tower.y - 18;
    shot.px = shot.x;
    shot.py = shot.y;
    shot.tx = target.x;
    shot.ty = target.y;
    shot.targetId = target.id;
    shot.damage = damage;
    shot.speed = speed;
    shot.towerId = tower.id;
    shot.family = tower.kind;
    shot.tier = tower.tier;
    shot.splash = style.splash ?? 0;
    shot.pierce = style.pierce ?? 0;
    shot.rain = style.rain ?? false;
    shot.alive = true;
  }

  /** One slow bolt. The number on the lens tier is the hit, not a beam. */
  private lens(tower: Tower): void {
    const target = this.acquire(tower, tower.targetId);
    if (!target) {
      tower.targetId = 0;
      return;
    }
    const tier = BALANCE.lens[tower.tier];
    const catapult = tower.spec === "catapult";
    tower.cooldown += catapult ? BALANCE.catapult.interval : BALANCE.heavy.interval[tower.tier];
    tower.targetId = target.id;
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    let damage = tier.dps * this.lensDpsMul * (this.lensRampMul > 1 ? 1.08 : 1);
    if (tower.spec === "none") damage *= 0.72;
    if (target.stunUntil > this.time) damage *= BALANCE.synergy.stunnedLens;
    this.arm(tower, target, damage, catapult ? BALANCE.catapult.speed : BALANCE.heavy.speed, {
      splash: catapult ? BALANCE.catapult.radius : 0,
      pierce: tower.spec === "ballista" ? BALANCE.ballista.extra : 0,
    });
  }

  private drum(tower: Tower): void {
    if (tower.spec === "beam") {
      this.beam(tower);
      return;
    }
    const tier = BALANCE.drum[tower.tier];
    const radius = (tower.spec === "snare" ? tier.radius * 1.15 : tier.radius) * this.rangeMul;
    const r2 = radius * radius;
    let hit = false;
    let killed = 0;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      if (dx * dx + dy * dy > r2) continue;
      hit = true;
      if (this.hurt(e, tier.damage, true, tower, tower.x, tower.y)) killed += 1;
      this.fx.push({ kind: "impact", x: e.x, y: e.y, color: TOWER_HUE.drum });
      if (!e.alive) continue;
      const stun = (e.boss ? tier.stun * 0.35 : tier.stun) * this.drumStunMul;
      e.stunUntil = Math.max(e.stunUntil, this.time + stun);
      e.slowUntil = Math.max(e.slowUntil, this.time + tier.slow);
      if (tower.spec === "snare" && (e.kind === "runner" || e.kind === "roller" || e.kind === "giant")) {
        e.snareUntil = Math.max(e.snareUntil, this.time + BALANCE.snare.dur);
      } else if (e.kind === "runner" || e.kind === "roller") {
        e.snareUntil = Math.max(e.snareUntil, this.time + BALANCE.snare.dur * 0.45);
      }
      if (e.kind === "skitter") {
        const d = Math.hypot(dx, dy) || 1;
        e.knockX += (dx / d) * 9;
        e.knockY += (dy / d) * 9;
      }
    }
    if (!hit) return;
    tower.cooldown += tier.interval;
    this.fx.push({ kind: "drum", x: tower.x, y: tower.y, n: radius });
    this.spill(tower.x, tower.y, radius, tier.slow, "drum");
    this.noteMulti(tower.x, tower.y, killed);
  }

  /** Venom spit. The bolt carries the chain; the puddle is what it leaves behind. */
  private spire(tower: Tower): void {
    const first = this.acquire(tower, 0);
    if (!first) return;
    const tier = BALANCE.spire[tower.tier];
    tower.cooldown += tier.interval;
    tower.angle = Math.atan2(first.y - tower.y, first.x - tower.x);
    tower.targetId = first.id;
    const shot = this.shots[this.shotCursor];
    this.shotCursor = (this.shotCursor + 1) % this.shots.length;
    shot.id = this.nextId();
    shot.x = tower.x;
    shot.y = tower.y - 16;
    shot.px = shot.x;
    shot.py = shot.y;
    shot.tx = first.x;
    shot.ty = first.y;
    shot.targetId = first.id;
    shot.damage = 0;
    shot.speed = 760;
    shot.towerId = tower.id;
    shot.family = "spire";
    shot.tier = tower.tier;
    shot.splash = 0;
    shot.pierce = 0;
    shot.rain = false;
    shot.alive = true;
  }

  /** A beam that stays hotter the longer it holds one body. Bosses melt. */
  private beam(tower: Tower): void {
    const target = this.acquire(tower, tower.targetId);
    if (!target) {
      tower.targetId = 0;
      tower.ramp = Math.max(0, tower.ramp - 20);
      return;
    }
    const tier = Math.min(2, tower.tier);
    if (tower.targetId !== target.id) tower.ramp = 0;
    tower.targetId = target.id;
    tower.ramp = Math.min(BALANCE.beam.cap, tower.ramp + BALANCE.beam.ramp);
    tower.cooldown += 0.28;
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    const raw = (BALANCE.beam.dps[tier] + tower.ramp) * 0.28 * this.lensDpsMul;
    this.hurt(target, raw, true, tower, tower.x, tower.y);
    this.fx.push({ kind: "impact", x: target.x, y: target.y, color: 0xffe08a, n: 2 });
  }

  /** Chain damage, unchanged numbers, then a slowing puddle at the landing. */
  private venom(tower: Tower, first: Enemy, x: number, y: number): void {
    const tier = BALANCE.spire[tower.tier];
    const chain: Enemy[] = [];
    if (first.alive) chain.push(first);
    const used = new Set<number>(chain.map((e) => e.id));
    let prev = first;
    const chainSq = tier.chain * tier.chain;
    const jumps = tier.jumps + this.spireJumpAdd;
    for (let j = chain.length; j < jumps; j++) {
      let best: Enemy | null = null;
      let bestD = chainSq;
      for (const e of this.enemies) {
        if (!e.alive || used.has(e.id) || stealthed(e.kind, e.age)) continue;
        const dx = e.x - prev.x;
        const dy = e.y - prev.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = e;
        }
      }
      if (!best) break;
      used.add(best.id);
      chain.push(best);
      prev = best;
    }
    const pts: Vec[] = [{ x, y }];
    let killed = 0;
    let fromX = x;
    let fromY = y;
    chain.forEach((e, i) => {
      let damage = tier.damage * this.spireDmgMul * Math.pow(tier.falloff, i);
      if (e.stunUntil > this.time) damage *= BALANCE.synergy.stunnedSpire;
      if (this.hurt(e, damage, true, tower, fromX, fromY)) killed += 1;
      this.fx.push({ kind: "impact", x: e.x, y: e.y, color: TOWER_HUE.spire });
      if (e.alive) e.hop = 0.16;
      fromX = e.x;
      fromY = e.y;
      pts.push({ x: e.x, y: e.y });
    });
    if (pts.length > 1) this.fx.push({ kind: "chain", x, y, pts, color: TOWER_HUE.spire });
    this.spill(first.alive ? first.x : x, first.alive ? first.y : y, BALANCE.venom.radius[tower.tier] ?? 96, BALANCE.venom.life, "spire");
    this.noteMulti(x, y, killed);
  }

  private spill(x: number, y: number, radius: number, life: number, kind: Puddle["kind"]): void {
    let slot = this.puddles.find((p) => p.life <= 0);
    if (!slot) {
      if (this.puddles.length >= 24) slot = this.puddles[0];
      else {
        slot = { x, y, radius, life, max: life, kind };
        this.puddles.push(slot);
        return;
      }
    }
    slot.x = x;
    slot.y = y;
    slot.radius = radius;
    slot.life = life;
    slot.max = life;
    slot.kind = kind;
  }

  private puddleAct(dt: number): void {
    for (const puddle of this.puddles) {
      if (puddle.life <= 0) continue;
      puddle.life -= dt;
      if (puddle.kind !== "spire") continue;
      const r2 = puddle.radius * puddle.radius;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        const dx = e.x - puddle.x;
        const dy = e.y - puddle.y;
        if (dx * dx + dy * dy > r2) continue;
        e.slowUntil = Math.max(e.slowUntil, this.time + 0.2);
      }
    }
  }

  private spearAct(dt: number): void {
    for (let i = this.spears.length - 1; i >= 0; i--) {
      const spear = this.spears[i];
      if (!spear.alive) {
        this.spears.splice(i, 1);
        continue;
      }
      const target = this.enemies.find((e) => e.id === spear.targetId && e.alive);
      if (target) {
        spear.tx = target.x;
        spear.ty = target.y - 18;
      }
      spear.age += dt;
      if (spear.age >= spear.flight && !spear.struck) {
        spear.struck = true;
        if (target) {
          let shown = Math.max(BALANCE.minHit, spear.raw - target.armor);
          if (target.boss && target.aegisUntil > this.time) shown *= BALANCE.boss.aegisMul;
          const killed = this.hurt(target, spear.raw, true, undefined, spear.sx, spear.sy);
          if (killed) {
            this.guardianKills += 1;
            if (spear.saved) this.guardianSaves += 1;
          }
          this.fx.push({
            kind: "impact",
            x: target.x,
            y: target.y,
            text: String(Math.round(shown)),
            n: spear.saved ? 1 : 0,
          });
        } else {
          this.fx.push({ kind: "impact", x: spear.tx, y: spear.ty });
        }
      }
      if (spear.age >= spear.flight + 0.22) this.spears.splice(i, 1);
    }
  }

  private shotsAct(dt: number): void {
    for (const shot of this.shots) {
      if (!shot.alive) continue;
      const target = this.enemies.find((e) => e.id === shot.targetId && e.alive);
      if (target) {
        shot.tx = target.x;
        shot.ty = target.y;
      }
      const dx = shot.tx - shot.x;
      const dy = shot.ty - shot.y;
      const dist = Math.hypot(dx, dy);
      const step = shot.speed * dt;
      shot.px = shot.x;
      shot.py = shot.y;
      if (dist <= step + 10) {
        shot.alive = false;
        shot.x = shot.tx;
        shot.y = shot.ty;
        if (shot.family === "spire") {
          const owner = this.towers.find((t) => t.id === shot.towerId);
          if (owner && target) this.venom(owner, target, shot.x, shot.y);
          else this.spill(shot.x, shot.y, BALANCE.venom.radius[shot.tier] ?? 56, BALANCE.venom.life, "spire");
        } else if (shot.rain) {
          this.shower(shot);
        } else if (shot.splash > 0) {
          this.splash(shot);
        } else if (shot.pierce > 0) {
          this.pierce(shot);
        } else if (target && !(target.flying && shot.family !== "dart" && shot.family !== "drum")) {
          const owner = shot.towerId > 0 ? this.towers.find((t) => t.id === shot.towerId) : undefined;
          const heavy = shot.family === "lens";
          const killed = this.hurt(target, shot.damage, !heavy, owner, shot.px, shot.py, heavy);
          if (killed && shot.towerId < 0) this.guardianKills += 1;
          const color = shot.family === "hero" ? 0xffe08a : TOWER_HUE[shot.family];
          this.fx.push({ kind: "impact", x: target.x, y: target.y, color, n: heavy ? 4 : shot.family === "hero" ? 2 : 0 });
        }
      } else {
        shot.x += (dx / dist) * step;
        shot.y += (dy / dist) * step;
      }
    }
  }

  /**
   * Arrow Shower. One logical shot blankets the circle. Armor at the gate
   * takes nothing. A golem's boulder only chips, so the soak test still holds.
   */
  private shower(shot: Shot): void {
    const owner = shot.towerId > 0 ? this.towers.find((t) => t.id === shot.towerId) : undefined;
    const radius = BALANCE.shower.radius;
    const r2 = radius * radius;
    const caught = this.enemies.filter((e) => e.alive && (e.x - shot.x) ** 2 + (e.y - shot.y) ** 2 <= r2);
    let killed = 0;
    for (const e of caught) {
      if (this.hurt(e, shot.damage, true, owner, shot.px, shot.py, false, true)) killed += 1;
    }
    this.fx.push({ kind: "volley", x: shot.x, y: shot.y, n: radius });
    this.noteMulti(shot.x, shot.y, killed);
  }

  /** Catapult. A short heavy splash. It breaks a boulder instead of chipping it. */
  private splash(shot: Shot): void {
    const owner = shot.towerId > 0 ? this.towers.find((t) => t.id === shot.towerId) : undefined;
    const r2 = shot.splash * shot.splash;
    let killed = 0;
    for (const e of this.enemies) {
      if (!e.alive || e.flying) continue;
      if ((e.x - shot.x) ** 2 + (e.y - shot.y) ** 2 > r2) continue;
      if (this.hurt(e, shot.damage, false, owner, shot.px, shot.py, true, false)) killed += 1;
    }
    this.fx.push({ kind: "impact", x: shot.x, y: shot.y, color: 0xffc14a, n: 4 });
    this.noteMulti(shot.x, shot.y, killed);
  }

  /** Ballista. The bolt and a couple of bodies standing along it. */
  private pierce(shot: Shot): void {
    const owner = shot.towerId > 0 ? this.towers.find((t) => t.id === shot.towerId) : undefined;
    const ax = shot.px;
    const ay = shot.py;
    const bx = shot.x;
    const by = shot.y;
    const abx = bx - ax;
    const aby = by - ay;
    const ab2 = abx * abx + aby * aby || 1;
    const width = BALANCE.ballista.width;
    const lined = this.enemies
      .filter((e) => {
        if (!e.alive || e.flying) return false;
        const t = Math.max(0, Math.min(1, ((e.x - ax) * abx + (e.y - ay) * aby) / ab2));
        const px = ax + abx * t;
        const py = ay + aby * t;
        return Math.hypot(e.x - px, e.y - py) <= width;
      })
      .sort((a, b) => Math.hypot(a.x - ax, a.y - ay) - Math.hypot(b.x - ax, b.y - ay))
      .slice(0, 1 + shot.pierce);
    for (const e of lined) this.hurt(e, shot.damage, false, owner, shot.px, shot.py, true, false);
    this.fx.push({ kind: "impact", x: shot.x, y: shot.y, color: 0xffe2a8, n: 4 });
  }

  /**
   * `mitigate` subtracts armor. A heavy bolt passes false and only shaves a
   * fraction of the plate. `shower` is the arrow volley. Returns true on a kill.
   */
  private hurt(
    e: Enemy,
    raw: number,
    mitigate: boolean,
    tower?: Tower,
    fromX?: number,
    fromY?: number,
    heavy = false,
    shower = false,
  ): boolean {
    if (!e.alive || raw <= 0) return false;
    if (e.boulder > 0) {
      const chip = shower
        ? Math.min(e.boulder, BALANCE.shower.boulderChip)
        : Math.min(e.boulder, Math.max(BALANCE.minHit, raw));
      e.boulder -= chip;
      e.flash = 0.12;
      if (e.boulder <= 0) {
        e.boulder = 0;
        this.fx.push({ kind: "rubble", x: e.x + 22, y: e.y - 8 });
      }
      return false;
    }
    let dealt = heavy
      ? Math.max(BALANCE.minHit, raw - e.armor * BALANCE.heavy.armorMul)
      : mitigate
        ? Math.max(BALANCE.minHit, raw - e.armor)
        : raw;
    if (shower && e.armor >= BALANCE.shower.armorGate) {
      dealt = BALANCE.minHit;
      e.react = "hit";
      e.reactLeft = 0.22;
      e.knockX += (Math.random() - 0.5) * 22;
      e.knockY -= 8;
    }
    if (e.boss && e.aegisUntil > this.time) dealt *= BALANCE.boss.aegisMul;
    if (dealt <= 0) {
      e.flash = 0.08;
      e.react = "block";
      e.reactLeft = 0.32;
      e.guard = 0.32;
      return false;
    }
    const applied = Math.min(e.hp, dealt);
    e.hp -= applied;
    if (tower) tower.dealt += applied;
    const fodder = e.kind === "skitter" || e.kind === "runner" || e.kind === "shard" || e.kind === "jaguar" || e.kind === "glider" || e.kind === "sapper";
    e.flash = fodder ? 0.1 : 0.12;
    if (!fodder && e.kind !== "roller") this.fx.push({ kind: "num", x: e.x, y: e.y - 30, text: String(Math.max(1, Math.round(applied))) });
    if (mitigate && (e.kind === "shield" || e.kind === "boss") && fromX !== undefined && fromY !== undefined) {
      const fx = Math.cos(e.angle);
      const fy = Math.sin(e.angle);
      const dot = (fromX - e.x) * fx + (fromY - e.y) * fy;
      if (dot > 0) {
        e.react = "block";
        e.reactLeft = 0.42;
        e.guard = 0.42;
      } else {
        e.react = "hit";
        e.reactLeft = 0.28;
      }
    } else if (mitigate) {
      e.react = "hit";
      e.reactLeft = e.kind === "skitter" ? 0.12 : 0.28;
    }
    if (e.hp > 0) return false;
    e.alive = false;
    const reward = Math.max(1, Math.round(e.reward * this.jadeMul));
    this.scatterGem(e.x, e.y, reward, e.kind);
    if (this.time >= this.flareLock) this.flare = Math.min(BALANCE.flare.need, this.flare + e.charge);
    this.fx.push({ kind: "death", x: e.x, y: e.y, enemy: e.kind, n: e.angle });
    this.noteStreak(e);
    if (e.kind === "golem") {
      for (let i = 0; i < BALANCE.golemShards; i++) this.birth("shard", e.path, Math.min(e.dist + 6, this.routeLen(e) - 4));
    }
    return true;
  }

  private noteMulti(x: number, y: number, killed: number): void {
    if (killed < 3) return;
    const text = killed >= 10 ? `MOWED DOWN x${killed}` : killed >= 5 ? "SMASH" : "TRIPLE";
    this.fx.push({ kind: "multi", x, y: y - 28, text, n: killed });
  }

  private noteStreak(e: Enemy): void {
    if (this.time <= this.comboUntil) this.combo += 1;
    else this.combo = 1;
    this.comboUntil = this.time + BALANCE.combo.window;
    if (this.combo < BALANCE.combo.start) return;
    // A per-kill bonus, even capped at 6, still pays thousands across a horde.
    // Pay the spec's milestone alternative instead, once per threshold.
    const bonus = streakBonus(this.combo);
    if (bonus <= 0) return;
    this.jade += bonus;
    this.purse.streaks += bonus;
    this.fx.push({ kind: "callout", x: e.x, y: e.y - 48, text: `${this.combo} STREAK`, n: this.combo });
  }

  private rollOffer(): void {
    const ids = Object.keys(BALANCE.relics) as RelicId[];
    const fresh = ids.filter((id) => !this.relics.includes(id));
    const pool = fresh.length >= 3 ? [...fresh] : [...ids];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = pool[i];
      pool[i] = pool[j];
      pool[j] = swap;
    }
    this.pendingOffer = pool.slice(0, 3);
    this.offerLeft = BALANCE.offerSeconds;
  }

  private applyRelic(id: RelicId): void {
    const spec = BALANCE.relics[id] as RelicDef;
    if (spec.dart) this.dartMul *= spec.dart;
    if (spec.lens) this.lensDpsMul *= spec.lens;
    if (spec.ramp) this.lensRampMul *= spec.ramp;
    if (spec.stun) this.drumStunMul *= spec.stun;
    if (spec.jumps) this.spireJumpAdd += spec.jumps;
    if (spec.jade) this.jadeMul *= spec.jade;
    if (spec.flare) this.flareMul *= spec.flare;
    if (spec.range) this.rangeMul *= spec.range;
    if (spec.heal) this.integrity = Math.min(this.integrityMax, this.integrity + spec.heal);
  }

  /** Who a selected totem would shoot, plus the serpent's next jumps. */
  aim(tower: Tower): { primary: Enemy | null; chain: Enemy[] } {
    const primary = this.acquire(tower, tower.kind === "lens" ? tower.targetId : 0);
    if (!primary) return { primary: null, chain: [] };
    if (tower.kind !== "spire") return { primary, chain: [primary] };
    const tier = BALANCE.spire[tower.tier];
    const chain: Enemy[] = [primary];
    const used = new Set<number>([primary.id]);
    let prev = primary;
    const chainSq = tier.chain * tier.chain;
    const jumps = tier.jumps + this.spireJumpAdd;
    for (let j = 1; j < jumps; j++) {
      let best: Enemy | null = null;
      let bestD = chainSq;
      for (const e of this.enemies) {
        if (!e.alive || used.has(e.id) || stealthed(e.kind, e.age)) continue;
        const dx = e.x - prev.x;
        const dy = e.y - prev.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = e;
        }
      }
      if (!best) break;
      used.add(best.id);
      chain.push(best);
      prev = best;
    }
    return { primary, chain };
  }

  /**
   * Where the next wave enters, and which unit leads each lane.
   * Read-only: it does not change the spawn queue or any combat number.
   */
  lanePlan(): LanePlan[] {
    if (this.phase === "victory" || this.phase === "defeat") return [];
    if (this.wave < 0 || this.wave >= this.waveCount) return [];
    const spec = BALANCE.worlds[this.world].waves[this.wave];
    if (!spec) return [];
    const partsByPath = new Map<number, { kind: EnemyKind; count: number }[]>();
    for (const g of spec.groups) {
      const list = partsByPath.get(g.path) ?? [];
      const hit = list.find((p) => p.kind === g.kind);
      if (hit) hit.count += g.count;
      else list.push({ kind: g.kind, count: g.count });
      partsByPath.set(g.path, list);
    }
    const clock = this.phase === "wave" ? this.time - this.waveStartedAt : -1;
    const out: LanePlan[] = [];
    for (const [path, parts] of partsByPath) {
      if (!parts.length) continue;
      const flying = parts.every((p) => BALANCE.enemies[p.kind].flying);
      const route = (flying ? this.map.flights[path] : this.map.routes[path]) ?? this.map.routes[path];
      if (!route || route.pts.length === 0) continue;
      const a = route.pts[0];
      const b = route.pts[Math.min(1, route.pts.length - 1)];
      const lead = parts.reduce((best, p) => (p.count > best.count ? p : best), parts[0]);
      let state: LanePlan["state"] = "wait";
      if (this.phase === "wave") {
        let first = Infinity;
        let started = false;
        for (const s of this.queue) {
          if (s.path !== path) continue;
          if (s.t <= clock) started = true;
          else first = Math.min(first, s.t);
        }
        if (started) state = "gone";
        else if (first - clock < 1.35) state = "soon";
      } else if (this.buildLeft < 2.2) state = "soon";
      out.push({
        path,
        x: a.x,
        y: a.y,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
        lead: lead.kind,
        leadCount: lead.count,
        parts,
        state,
      });
    }
    return out;
  }

  /** Push neighbors apart across the trail so a pack is a crowd, not a file. */
  private crowd(): void {
    const alive = this.enemies.filter((e) => e.alive && !e.striking);
    for (let i = 0; i < alive.length; i++) {
      const a = alive[i];
      for (let j = i + 1; j < alive.length; j++) {
        const b = alive[j];
        if (a.path !== b.path || a.flying !== b.flying) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const want = (girth(a.kind) + girth(b.kind)) * 0.5;
        if (d >= want) continue;
        const push = (want - d) * 0.42;
        const lx = Math.cos(a.angle + Math.PI / 2);
        const ly = Math.sin(a.angle + Math.PI / 2);
        const side = dx * lx + dy * ly >= 0 ? 1 : -1;
        a.lane += side * push * 0.55;
        b.lane -= side * push * 0.55;
        if (Math.abs(a.dist - b.dist) < want * 0.65) {
        if (a.dist >= b.dist) a.dist += push * 0.14;
        else b.dist += push * 0.14;
        }
      }
    }
    for (const e of alive) {
      const cap = e.boss ? 34 : e.flying ? 26 : e.kind === "skitter" ? 32 : 72;
      e.lane = Math.max(-cap, Math.min(cap, e.lane));
    }
  }

  private pose(e: Enemy, route: Route): void {
    const pose = poseAt(route, e.dist);
    const side = e.flying ? e.lane * 0.35 : e.lane;
    const ox = Math.cos(pose.angle + Math.PI / 2) * side + e.knockX;
    const oy = Math.sin(pose.angle + Math.PI / 2) * side + e.knockY;
    e.x = pose.x + ox;
    e.y = pose.y + oy;
    e.angle = pose.angle;
  }

  private routeLen(e: Enemy): number {
    return (e.flying ? this.map.flights[e.path] : this.map.routes[e.path]).len;
  }

  /** Walk, collect, fund, and shoot. Enemies never chase the hero. */
  private heroAct(dt: number): void {
    this.guardianCast = Math.max(0, this.guardianCast - dt);
    const len = Math.hypot(this.steerX, this.steerY);
    if (len > 0.2) this.goal = null;
    let stepped = false;
    if (this.goal) {
      const dx = this.goal.x - this.heroX;
      const dy = this.goal.y - this.heroY;
      const dist = Math.hypot(dx, dy);
      if (dist <= 5) {
        this.heroX = this.goal.x;
        this.heroY = this.goal.y;
        this.goal = null;
        this.heroMoving = false;
      } else {
        const step = Math.min(dist, BALANCE.hero.speed * dt);
        this.heroX += (dx / dist) * step;
        this.heroY += (dy / dist) * step;
        this.guardianAim = Math.atan2(dy, dx);
        this.heroMoving = true;
        stepped = step > 0.4;
      }
    } else if (len > 0.12) {
      const nx = this.steerX / len;
      const ny = this.steerY / len;
      const step = BALANCE.hero.speed * Math.min(1, len) * dt;
      this.heroX = Math.max(28, Math.min(MAP_W - 28, this.heroX + nx * step));
      this.heroY = Math.max(28, Math.min(MAP_H - 28, this.heroY + ny * step));
      this.guardianAim = Math.atan2(ny, nx);
      this.heroMoving = true;
      stepped = step > 0.4;
    } else {
      this.heroMoving = false;
    }
    if (stepped) this.heroMoved = true;
    this.gemAct(dt);
    this.fundAct(dt);
    this.heroFire(dt);
  }

  private heroFire(dt: number): void {
    this.heroCool -= dt;
    let best: Enemy | null = null;
    let bestD: number = BALANCE.hero.range;
    for (const e of this.enemies) {
      if (!e.alive || e.flying || stealthed(e.kind, e.age)) continue;
      const d = Math.hypot(e.x - this.heroX, e.y - this.heroY);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    if (!best || this.heroCool > 0) return;
    this.heroCool = BALANCE.hero.interval;
    this.guardianAim = Math.atan2(best.y - this.heroY, best.x - this.heroX);
    this.guardianCast = BALANCE.hero.cast;
    const shot = this.shots[this.shotCursor];
    this.shotCursor = (this.shotCursor + 1) % this.shots.length;
    shot.id = this.nextId();
    shot.x = this.heroX + Math.cos(this.guardianAim) * 26;
    shot.y = this.heroY - 48 + Math.sin(this.guardianAim) * 16;
    shot.px = shot.x;
    shot.py = shot.y;
    shot.tx = best.x;
    shot.ty = best.y;
    shot.targetId = best.id;
    shot.damage = BALANCE.hero.damage;
    shot.speed = 920;
    shot.towerId = -1;
    shot.family = "hero";
    shot.tier = 0;
    shot.splash = 0;
    shot.pierce = 0;
    shot.rain = false;
    shot.alive = true;
  }

  private gemAct(dt: number): void {
    const magnet = BALANCE.gem.magnet;
    for (const gem of this.drops) {
      if (!gem.alive) continue;
      gem.life -= dt;
      if (gem.life <= 0) {
        gem.alive = false;
        this.dropFree.push(gem);
        continue;
      }
      gem.vx *= Math.exp(-3.2 * dt);
      gem.vy *= Math.exp(-3.2 * dt);
      gem.x += gem.vx * dt;
      gem.y += gem.vy * dt;
      const dx = this.heroX - gem.x;
      const dy = this.heroY - gem.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= magnet) continue;
      const step = BALANCE.gem.fly * dt;
      if (dist <= step + 24) {
        gem.alive = false;
        this.dropFree.push(gem);
        this.jade += gem.value;
        this.purse.kills += gem.value;
        this.heroCollected = true;
        this.fx.push({ kind: "collect", x: this.heroX, y: this.heroY - 20, n: gem.value });
      } else {
        gem.x += (dx / dist) * step;
        gem.y += (dy / dist) * step;
        gem.vx = 0;
        gem.vy = 0;
      }
    }
  }

  /** A few coins for a swarmer, a cluster for a brute. The total still equals the reward. */
  private scatterGem(x: number, y: number, reward: number, kind: EnemyKind): void {
    const brute = kind === "golem" || kind === "boss" || kind === "shield" || kind === "roller" || kind === "giant";
    const pieces = brute ? Math.min(5, reward) : Math.min(2, reward);
    const base = Math.floor(reward / pieces);
    let extra = reward - base * pieces;
    for (let i = 0; i < pieces; i++) {
      const share = base + (extra > 0 ? 1 : 0);
      if (extra > 0) extra -= 1;
      const spread = (i - (pieces - 1) / 2) * 10;
      this.dropGem(x + spread, y + ((i % 2) - 0.5) * 8, share);
    }
  }

  private dropGem(x: number, y: number, value: number): void {
    let alive = 0;
    for (const gem of this.drops) if (gem.alive) alive += 1;
    if (alive > 220) {
      this.jade += value;
      this.purse.kills += value;
      this.heroCollected = true;
      return;
    }
    const gem = this.dropFree.pop() ?? this.blankDrop();
    if (!this.drops.includes(gem)) this.drops.push(gem);
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 80;
    gem.id = this.nextId();
    gem.x = x;
    gem.y = y;
    gem.vx = Math.cos(angle) * speed;
    gem.vy = Math.sin(angle) * speed - 30;
    gem.value = value;
    gem.life = BALANCE.gem.life;
    gem.alive = true;
  }

  private blankDrop(): Drop {
    return { id: 0, x: 0, y: 0, vx: 0, vy: 0, value: 0, life: 0, alive: false };
  }

  private fundAct(dt: number): void {
    for (let i = this.pours.length - 1; i >= 0; i--) {
      const pour = this.pours[i];
      pour.left -= dt;
      if (pour.left > 0) continue;
      this.pours.splice(i, 1);
      const station = this.stations[pour.index];
      const cost = station && station.tier === pour.tier ? this.stationCost(station) : 0;
      if (!station || station.tier !== pour.tier || cost <= 0 || station.paid >= cost) {
        this.jade += 1;
        continue;
      }
      station.paid += 1;
      this.fx.push({ kind: "tick", x: station.x, y: station.y - 24 });
      if (station.paid >= cost - 0.001) {
        const spent = station.paid;
        station.paid = 0;
        this.finishStation(station, spent);
      }
    }
    let best = -1;
    let bestD: number = BALANCE.fund.radius;
    for (let i = 0; i < this.stations.length; i++) {
      const station = this.stations[i];
      const repairing = station.kind === "wall" && station.tier > 0 && !station.alive;
      if (!station.chosen || station.kind === "recruit") continue;
      if (station.tier === 1 && station.spec === "none" && specChoices(station.kind)) continue;
      if (station.tier >= 3 && !repairing) continue;
      if (this.stationCost(station) - station.paid <= 0) continue;
      const d = Math.hypot(station.x - this.heroX, station.y - this.heroY);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const moving = this.goal !== null || Math.hypot(this.steerX, this.steerY) > 0.35;
    this.funding = moving ? -1 : best;
    if (moving || best < 0 || this.jade < 1) return;
    const station = this.stations[best];
    const cost = this.stationCost(station);
    this.fundBank += BALANCE.fund.rate * dt;
    let inFlight = 0;
    for (const pour of this.pours) if (pour.index === best) inFlight += 1;
    while (this.fundBank >= 1 && this.jade >= 1 && cost - station.paid - inFlight >= 1) {
      this.fundBank -= 1;
      this.jade -= 1;
      inFlight += 1;
      const from = carryLaunch(this.jade + 1);
      this.pours.push({ index: best, left: PAY_FLIGHT, tier: station.tier });
      this.fx.push({ kind: "pay", x: this.heroX + from.x, y: this.heroY + from.y, tx: station.x, ty: station.y });
    }
  }

  private finishStation(station: Station, spent: number): void {
    station.paid = 0;
    if (station.kind === "wall") {
      if (station.tier > 0 && !station.alive) {
        station.hp = station.maxHp;
        station.alive = true;
        this.fx.push({ kind: "place", x: station.x, y: station.y });
        return;
      }
      station.tier += 1;
      station.maxHp = BALANCE.wall.hp[station.tier - 1];
      station.hp = station.maxHp;
      station.alive = true;
      this.fx.push({ kind: "place", x: station.x, y: station.y, n: station.tier });
      return;
    }
    if (station.kind === "base") {
      station.tier += 1;
      const bonus = BALANCE.base.hp[station.tier - 1];
      this.baseTier = station.tier;
      this.integrityMax += bonus;
      this.integrity = Math.min(this.integrityMax, this.integrity + bonus);
      this.fx.push({ kind: "place", x: station.x, y: station.y, n: station.tier });
      return;
    }
    if (station.kind === "recruit") return;
    station.tier += 1;
    if (station.kind === "barracks") {
      const role = station.spec === "knights" ? "knight" : station.spec === "spears" ? "spear" : "squad";
      this.muster(station, role);
      this.fx.push({ kind: "place", x: station.x, y: station.y, n: station.tier });
      return;
    }
    const kind: TowerKind = station.kind;
    const existing = this.towers.find((t) => t.pad === station.index);
    if (!existing) {
      this.occupied.add(station.index);
      this.towers.push({
        id: this.nextId(),
        kind,
        tier: 0,
        pad: station.index,
        x: station.x,
        y: station.y,
        spent,
        cooldown: 0.12,
        stunnedUntil: 0,
        targetId: 0,
        ramp: 0,
        angle: Math.atan2(this.map.sun.y - station.y, this.map.sun.x - station.x),
        dealt: 0,
        spec: "none",
      });
    } else {
      existing.tier = Math.min(2, existing.tier + 1);
      existing.spec = station.spec;
      existing.spent += spent;
      existing.cooldown = Math.max(existing.cooldown, 0.12);
    }
    this.fx.push({ kind: "place", x: station.x, y: station.y, n: station.tier });
  }

  /** Blue soldiers march toward the entrance and hold the first raider they meet. */
  private muster(station: Station, role: Ally["role"]): void {
    const spec = BALANCE.barracks;
    const count = role === "spear" ? spec.spearCount : role === "knight" ? spec.knightCount : role === "recruit" ? BALANCE.recruit.count : spec.count;
    const hp = role === "spear" ? spec.spearHp : role === "knight" ? spec.knightHp : role === "recruit" ? BALANCE.recruit.hp : spec.hp;
    for (let i = 0; i < count; i++) {
      let ally = this.allies.find((a) => !a.alive);
      if (!ally) {
        if (this.allies.length >= 48) return;
        ally = { id: 0, path: 0, dist: 0, x: 0, y: 0, angle: 0, hp: 0, maxHp: 0, cool: 0, alive: false, role };
        this.allies.push(ally);
      }
      ally.id = this.nextId();
      ally.role = role;
      ally.path = station.path;
      ally.dist = Math.max(8, station.dist - i * 26);
      ally.hp = hp;
      ally.maxHp = hp;
      ally.cool = i * 0.08;
      ally.alive = true;
      const pose = poseAt(this.map.routes[station.path], ally.dist);
      ally.x = pose.x;
      ally.y = pose.y;
      ally.angle = pose.angle + Math.PI;
    }
  }

  private allyAct(dt: number): void {
    const spec = BALANCE.barracks;
    for (const ally of this.allies) {
      if (!ally.alive) continue;
      ally.cool -= dt;
      const reach = ally.role === "knight" ? 96 : 52;
      let foe: Enemy | null = null;
      let gap = reach;
      for (const e of this.enemies) {
        if (!e.alive || e.flying || e.path !== ally.path) continue;
        const d = ally.dist - e.dist;
        if (d < -8 || d > gap) continue;
        gap = d;
        foe = e;
      }
      if (foe) {
        if (foe.kind === "roller" && ally.role !== "spear") {
          ally.alive = false;
          this.fx.push({ kind: "rubble", x: ally.x, y: ally.y });
          continue;
        }
        if (ally.cool <= 0) {
          const damage = ally.role === "spear" ? spec.spearDamage : ally.role === "knight" ? spec.knightDamage : ally.role === "recruit" ? BALANCE.recruit.damage : spec.damage;
          const interval = ally.role === "recruit" ? BALANCE.recruit.interval : spec.interval;
          ally.cool = interval;
          this.hurt(foe, damage, true, undefined, ally.x, ally.y);
        }
        const bite = foe.boss ? 22 : foe.kind === "giant" ? 16 : foe.kind === "golem" ? 12 : foe.kind === "runner" ? 16 : 7;
        ally.hp -= bite * dt;
        if (ally.hp <= 0) {
          ally.alive = false;
          this.fx.push({ kind: "rubble", x: ally.x, y: ally.y });
        }
      } else {
        const speed = ally.role === "knight" ? spec.knightSpeed : ally.role === "recruit" ? BALANCE.recruit.speed : spec.speed;
        ally.dist = Math.max(0, ally.dist - speed * dt);
      }
      const pose = poseAt(this.map.routes[ally.path], ally.dist);
      ally.x = pose.x;
      ally.y = pose.y;
      ally.angle = pose.angle + Math.PI;
    }
  }

  /**
   * Barracks troops stand in the lane. Ordinary raiders stop and fight.
   * A boulder crew rolls through them. Gliders fly over.
   */
  private pressAlly(e: Enemy): boolean {
    if (e.flying) return false;
    let held = false;
    for (const ally of this.allies) {
      if (!ally.alive || ally.path !== e.path) continue;
      const ahead = ally.dist - e.dist;
      if (ahead < -12 || ahead > (ally.role === "knight" ? 48 : 36)) continue;
      if (e.kind === "roller" && ally.role !== "spear") {
        ally.alive = false;
        this.fx.push({ kind: "rubble", x: ally.x, y: ally.y });
        continue;
      }
      const stop = ally.dist - 22;
      if (e.dist > stop) e.dist = stop;
      held = true;
    }
    return held;
  }

  /** A catapult on the lane, or a living spear wall, keeps a boulder from deleting the palisade. */
  private wallHeld(path: number): boolean {
    if (this.allies.some((a) => a.alive && a.role === "spear" && a.path === path)) return true;
    return this.towers.some((t) => t.spec === "catapult" && this.stations.some((s) => s.index === t.pad && s.path === path));
  }

  private breakWall(wall: Station): void {
    wall.hp = 0;
    wall.alive = false;
    wall.hurt = 0;
    this.fx.push({ kind: "splinter", x: wall.x, y: wall.y, n: wall.tier });
  }

  /** Ground raiders chew a barricade instead of walking through it. */
  private pressWall(e: Enemy, dt: number): boolean {
    if (e.flying) return false;
    let wall: Station | null = null;
    let gap = 40;
    for (const station of this.stations) {
      if (station.kind !== "wall" || !station.alive || station.path !== e.path) continue;
      const ahead = station.dist - e.dist;
      if (ahead < -10 || ahead > gap) continue;
      gap = ahead;
      wall = station;
    }
    if (!wall) return false;
    if (e.kind === "roller" && !this.wallHeld(e.path)) {
      this.breakWall(wall);
      return false;
    }
    if (e.kind === "sapper") {
      wall.hp -= BALANCE.sapper.blast;
      wall.hurt = 1.2;
      e.alive = false;
      this.scatterGem(e.x, e.y, e.reward, e.kind);
      this.fx.push({ kind: "death", x: e.x, y: e.y, enemy: e.kind, n: e.angle });
      this.fx.push({ kind: "splinter", x: wall.x, y: wall.y, n: 1 });
      if (wall.hp <= 0) this.breakWall(wall);
      return true;
    }
    const stop = wall.dist - 26;
    if (e.dist > stop) e.dist = stop;
    const bite = (e.boss ? 26 : e.kind === "giant" ? 78 : e.kind === "golem" ? 14 : e.kind === "shield" ? 9 : 6.5) * dt;
    wall.hp -= bite;
    wall.hurt = 1.2;
    if (wall.tier >= 2 && Math.floor(this.time * 2) !== Math.floor((this.time - dt) * 2)) {
      this.hurt(e, BALANCE.wall.thorn * 0.5, false);
    }
    if (wall.hp <= 0) this.breakWall(wall);
    return true;
  }

  /** The heart fires a small bolt of its own once it has been bought. */
  private baseAct(dt: number): void {
    if (this.baseTier <= 0) return;
    this.baseCool -= dt;
    if (this.baseCool > 0) return;
    let best: Enemy | null = null;
    let bestD: number = BALANCE.base.range;
    for (const e of this.enemies) {
      if (!e.alive || e.flying || stealthed(e.kind, e.age)) continue;
      const d = Math.hypot(e.x - this.map.sun.x, e.y - this.map.sun.y);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    if (!best) return;
    this.baseCool = BALANCE.base.interval;
    const shot = this.shots[this.shotCursor];
    this.shotCursor = (this.shotCursor + 1) % this.shots.length;
    shot.id = this.nextId();
    shot.x = this.map.sun.x;
    shot.y = this.map.sun.y - 20;
    shot.px = shot.x;
    shot.py = shot.y;
    shot.tx = best.x;
    shot.ty = best.y;
    shot.targetId = best.id;
    shot.damage = BALANCE.base.damage[this.baseTier - 1];
    shot.speed = 700;
    shot.towerId = -2;
    shot.family = "hero";
    shot.tier = this.baseTier - 1;
    shot.splash = 0;
    shot.pierce = 0;
    shot.rain = false;
    shot.alive = true;
  }

  /** Standing on the soldier pad keeps spending Jade and keeps sending swords. */
  private recruitAct(dt: number): void {
    const pad = this.stations.find((s) => s.kind === "recruit");
    if (!pad || !familyUnlocked("recruit", this.world)) return;
    const moving = this.goal !== null || Math.hypot(this.steerX, this.steerY) > 0.35;
    const standing = !moving && Math.hypot(pad.x - this.heroX, pad.y - this.heroY) < BALANCE.fund.radius;
    if (!standing || this.jade < 0.2) return;
    const pay = Math.min(this.jade, BALANCE.recruit.rate * dt);
    const before = Math.floor(this.recruitBank);
    this.jade -= pay;
    this.recruitBank += pay;
    if (Math.floor(this.recruitBank) !== before) {
      const from = carryLaunch(this.jade + 1);
      this.fx.push({ kind: "pay", x: this.heroX + from.x, y: this.heroY + from.y, tx: pad.x, ty: pad.y });
    }
    if (this.recruitBank < BALANCE.recruit.groupCost) return;
    this.recruitBank -= BALANCE.recruit.groupCost;
    this.muster(pad, "recruit");
  }

  private buildStations(): Station[] {
    const stations: Station[] = this.map.pads.map((pad, index) => {
      const near = this.nearestProgress(pad.x, pad.y);
      let kind: StationKind = "dart";
      if (near.frac < 0.38) kind = "dart";
      else if (near.frac < 0.68) kind = index % 2 === 0 ? "drum" : "dart";
      else kind = "lens";
      if (!familyUnlocked(kind, this.world)) kind = "dart";
      return {
        index, x: pad.x, y: pad.y, kind, offers: padOffers(kind, this.world), chosen: false,
        spec: "none", hurt: 0,
        path: near.path, dist: near.dist,
        paid: 0, tier: 0, hp: 0, maxHp: 0, alive: false,
      };
    });
    let closest = 0;
    let best = Infinity;
    stations.forEach((station, i) => {
      const d = Math.hypot(station.x - this.heroX, station.y - this.heroY);
      if (d < best) {
        best = d;
        closest = i;
      }
    });
    if (stations[closest]) stations[closest].kind = "dart";
    for (let path = 0; path < this.map.routes.length; path++) {
      const onPath = stations.filter((s) => s.path === path);
      if (onPath.some((s) => s.kind === "dart")) continue;
      const entrance = onPath.slice().sort((a, b) => a.dist - b.dist)[0];
      if (entrance) entrance.kind = "dart";
    }
    if (familyUnlocked("lens", this.world)) {
      for (let path = 0; path < this.map.routes.length; path++) {
        const onPath = stations.filter((s) => s.path === path);
        if (onPath.some((s) => s.kind === "lens")) continue;
        const last = onPath.slice().sort((a, b) => b.dist - a.dist)[0];
        if (last && last.kind !== "dart") last.kind = "lens";
        else if (onPath.length > 1) {
          const other = onPath.filter((s) => s.kind !== "dart").sort((a, b) => b.dist - a.dist)[0];
          if (other) other.kind = "lens";
        }
      }
    }
    for (const station of stations) station.offers = padOffers(station.kind, this.world);
    let extra = this.map.pads.length + this.map.routes.length;
    if (familyUnlocked("barracks", this.world)) {
      const musterRoute = this.map.routes[0];
      const musterDist = musterRoute.len * 0.62;
      const musterAt = poseAt(musterRoute, musterDist);
      stations.push({
        index: extra,
        x: musterAt.x + Math.cos(musterAt.angle + Math.PI / 2) * 78,
        y: musterAt.y + Math.sin(musterAt.angle + Math.PI / 2) * 78,
        kind: "barracks",
        offers: padOffers("barracks", this.world),
        chosen: false,
        spec: "none",
        hurt: 0,
        path: 0,
        dist: musterDist,
        paid: 0,
        tier: 0,
        hp: 0,
        maxHp: 0,
        alive: false,
      });
      extra += 1;
    }
    if (familyUnlocked("recruit", this.world)) {
      stations.push({
        index: extra,
        x: this.map.sun.x - 150,
        y: this.map.sun.y + 90,
        kind: "recruit",
        offers: ["recruit"],
        chosen: true,
        spec: "none",
        hurt: 0,
        path: 0,
        dist: this.map.routes[0].len * 0.9,
        paid: 0,
        tier: 0,
        hp: 0,
        maxHp: 0,
        alive: false,
      });
      extra += 1;
    }
    stations.push({
      index: extra,
      x: this.map.sun.x + 130,
      y: this.map.sun.y + 80,
      kind: "base",
      offers: ["base"],
      chosen: true,
      spec: "none",
      hurt: 0,
      path: 0,
      dist: this.map.routes[0].len,
      paid: 0,
      tier: 0,
      hp: 0,
      maxHp: 0,
      alive: false,
    });
    this.map.routes.forEach((route, path) => {
      const dist = route.len * 0.28;
      const at = poseAt(route, dist);
      stations.push({
        index: this.map.pads.length + path,
        x: at.x,
        y: at.y,
        kind: "wall",
        offers: ["wall"],
        chosen: true,
        spec: "none",
        hurt: 0,
        path,
        dist,
        paid: 0,
        tier: 0,
        hp: 0,
        maxHp: 0,
        alive: false,
      });
    });
    const spots = stations.map((station) => ({
      x: station.x,
      y: station.y,
      fixed: station.kind === "wall",
      wall: station.kind === "wall",
    }));
    clearStationGaps(spots, this.map.sun, this.map.plaza);
    stations.forEach((station, i) => {
      station.x = spots[i].x;
      station.y = spots[i].y;
    });
    return stations;
  }

  private nearestProgress(x: number, y: number): { path: number; frac: number; dist: number } {
    let best = { path: 0, frac: 0, dist: 0, d: Infinity };
    this.map.routes.forEach((route, path) => {
      let walked = 0;
      for (let i = 1; i < route.pts.length; i++) {
        const a = route.pts[i - 1];
        const b = route.pts[i];
        const sl = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const t = Math.max(0, Math.min(1, ((x - a.x) * (b.x - a.x) + (y - a.y) * (b.y - a.y)) / (sl * sl)));
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;
        const d = Math.hypot(x - px, y - py);
        if (d < best.d) best = { path, frac: route.len > 0 ? (walked + sl * t) / route.len : 0, dist: walked + sl * t, d };
        walked += sl;
      }
    });
    return best;
  }

  private seedLesson(): void {
    if (this.world !== 0) return;
    for (let i = 0; i < 5; i++) {
      const gem = this.blankDrop();
      gem.id = this.nextId();
      gem.x = this.heroX + 240 + i * 22;
      gem.y = this.heroY - 320;
      gem.value = 6;
      gem.life = 40;
      gem.alive = true;
      this.drops.push(gem);
    }
  }

  private compact(): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].alive) continue;
      const dead = this.enemies[i];
      this.enemies.splice(i, 1);
      this.freeEnemies.push(dead);
    }
  }
}
