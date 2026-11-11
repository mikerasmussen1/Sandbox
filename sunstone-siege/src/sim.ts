/**
 * Combat simulation. No rendering and no storage, so a valley can be played
 * forward in a test without a browser.
 */
import { BALANCE, towerCost, towerRange, type RelicDef } from "./balance";
import { poseAt } from "./geom";
import { mapDef, SUN, type MapDef } from "./maps";
import type { EnemyKind, Phase, RelicId, TowerKind, Vec } from "./types";

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
}

export type FxKind = "impact" | "death" | "jade" | "drum" | "chain" | "crack" | "flare" | "slam" | "boss" | "place" | "streak" | "relic" | "aegis" | "rally";

export interface Fx {
  kind: FxKind;
  x: number;
  y: number;
  n?: number;
  text?: string;
  pts?: Vec[];
  enemy?: EnemyKind;
}

interface QueuedSpawn {
  t: number;
  kind: EnemyKind;
  path: number;
}

const SHOTS = 160;

export function stealthed(kind: EnemyKind, age: number): boolean {
  if (kind !== "jaguar") return false;
  const m = age % BALANCE.jaguar.cycle;
  return m > BALANCE.jaguar.cycle - BALANCE.jaguar.dur;
}

export class Siege {
  readonly map: MapDef;
  readonly world: number;
  time = 0;
  jade: number;
  integrity: number = BALANCE.integrity;
  phase: Phase = "build";
  /** Index of the wave in progress, or the next wave during a build. */
  wave = 0;
  buildLeft: number = BALANCE.prewave;
  earlyGranted = false;
  flare = 0;
  flareLock = 0;
  pendingOffer: RelicId[] | null = null;
  offerLeft = 0;
  readonly relics: RelicId[] = [];
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

  constructor(world: number) {
    this.world = world;
    this.map = mapDef(world);
    this.jade = BALANCE.worlds[world].jade;
    for (let i = 0; i < SHOTS; i++) {
      this.shots.push({
        id: 0, x: 0, y: 0, px: 0, py: 0, tx: 0, ty: 0, targetId: 0, damage: 0, speed: 0, alive: false,
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
      angle: Math.atan2(SUN.y - at.y, SUN.x - at.x),
    });
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
    this.towers.splice(i, 1);
    this.fx.push({ kind: "jade", x: tower.x, y: tower.y, text: `+${refund}` });
    return refund;
  }

  callWave(): boolean {
    if (this.phase !== "build" || this.pendingOffer) return false;
    if (this.buildLeft > 0.25 && !this.earlyGranted) {
      this.jade += BALANCE.earlyCall;
      this.earlyGranted = true;
      this.fx.push({ kind: "jade", x: SUN.x, y: SUN.y - 120, text: `+${BALANCE.earlyCall}` });
    }
    this.startWave();
    return true;
  }

  fireFlare(): boolean {
    if (this.phase === "victory" || this.phase === "defeat") return false;
    if (this.flare < BALANCE.flare.need || this.time < this.flareLock) return false;
    this.flare = 0;
    this.flareLock = this.time + BALANCE.flare.lock;
    this.fx.push({ kind: "flare", x: SUN.x, y: SUN.y });
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const raw = (e.boss ? BALANCE.flare.bossDamage : BALANCE.flare.damage) * this.flareMul;
      this.hurt(e, raw, true);
    }
    return true;
  }

  chooseRelic(id: RelicId): boolean {
    if (!this.pendingOffer?.includes(id)) return false;
    this.applyRelic(id);
    this.relics.push(id);
    this.pendingOffer = null;
    const spec = BALANCE.relics[id];
    this.fx.push({ kind: "relic", x: SUN.x, y: SUN.y - 90, text: spec.name });
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

    if (this.phase === "wave") this.spawn();
    if (this.move(dt)) return;
    this.towersAct(dt);
    this.shotsAct(dt);
    this.compact();
    if (this.phase === "wave" && this.q >= this.queue.length && !this.enemies.some((e) => e.alive)) {
      const spec = BALANCE.worlds[this.world].waves[this.wave];
      const bonus = Math.round(spec.bonus * this.jadeMul);
      this.jade += bonus;
      this.fx.push({ kind: "jade", x: SUN.x, y: SUN.y - 140, text: `+${bonus}` });
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
    for (const g of spec.groups) {
      t += g.gap;
      for (let i = 0; i < g.count; i++) {
        queue.push({ t, kind: g.kind, path: g.path });
        t += g.interval;
      }
    }
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
    const pose = poseAt(e.flying ? this.map.flights[path] : this.map.routes[path], dist);
    e.x = pose.x;
    e.y = pose.y;
    e.angle = pose.angle;
    this.enemies.push(e);
    if (kind === "boss") this.fx.push({ kind: "boss", x: e.x, y: e.y, text: stat.name });
    return e;
  }

  private blank(): Enemy {
    return {
      id: 0, kind: "runner", path: 0, dist: 0, x: 0, y: 0, angle: 0, hp: 1, maxHp: 1,
      armor: 0, speed: 0, reward: 0, leak: 1, charge: 0, flying: false, boss: false,
      age: 0, slowUntil: 0, stunUntil: 0, slam: 0, aegis: 0, aegisUntil: 0, rally: 0, rushUntil: 0, flash: 0, alive: false,
    };
  }

  /** Returns true when a leak cracks the Sunstone and the valley is lost. */
  private move(dt: number): boolean {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.age += dt;
      let mul = 1;
      if (e.stunUntil > this.time) mul = 0;
      else if (e.slowUntil > this.time) mul = BALANCE.slowMul;
      if (mul > 0 && e.rushUntil > this.time) mul *= BALANCE.boss.rallySpeed;
      e.dist += e.speed * mul * dt;
      const route = e.flying ? this.map.flights[e.path] : this.map.routes[e.path];
      if (e.dist >= route.len) {
        e.alive = false;
        this.integrity -= e.leak;
        this.fx.push({ kind: "crack", x: SUN.x, y: SUN.y, n: e.leak });
        if (this.integrity <= 0) {
          this.integrity = 0;
          this.phase = "defeat";
          return true;
        }
        continue;
      }
      const pose = poseAt(route, e.dist);
      e.x = pose.x;
      e.y = pose.y;
      e.angle = pose.angle;
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
          this.fx.push({ kind: "aegis", x: e.x, y: e.y });
        }
        e.rally -= dt;
        if (e.rally <= 0) {
          e.rally = BALANCE.boss.rallyEvery;
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
      if (tower.kind === "lens") this.lens(tower, dt);
      else {
        tower.cooldown -= dt;
        if (tower.cooldown > 0) continue;
        if (tower.kind === "dart") this.dart(tower);
        else if (tower.kind === "drum") this.drum(tower);
        else this.spire(tower);
        if (tower.cooldown < 0) tower.cooldown = 0;
      }
    }
  }

  private acquire(tower: Tower, keep: number): Enemy | null {
    const range = towerRange(tower.kind, tower.tier) * this.rangeMul;
    const rangeSq = range * range;
    if (keep) {
      const held = this.enemies.find((e) => e.id === keep && e.alive && !stealthed(e.kind, e.age));
      if (held) {
        const dx = held.x - tower.x;
        const dy = held.y - tower.y;
        if (dx * dx + dy * dy <= rangeSq) return held;
      }
    }
    let best: Enemy | null = null;
    let progress = -1;
    for (const e of this.enemies) {
      if (!e.alive || stealthed(e.kind, e.age)) continue;
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
    const tier = BALANCE.dart[tower.tier];
    const slowed = target.slowUntil > this.time;
    tower.cooldown += tier.interval * (slowed ? BALANCE.synergy.slowDart : 1);
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    tower.targetId = target.id;
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
    shot.damage = tier.damage * this.dartMul;
    shot.speed = tier.shotSpeed;
    shot.alive = true;
  }

  private lens(tower: Tower, dt: number): void {
    const target = this.acquire(tower, tower.targetId);
    if (!target) {
      tower.targetId = 0;
      tower.ramp = 0;
      return;
    }
    if (target.id !== tower.targetId) {
      tower.targetId = target.id;
      tower.ramp = 0;
    }
    const tier = BALANCE.lens[tower.tier];
    tower.ramp = Math.min(tier.rampMax, tower.ramp + tier.ramp * this.lensRampMul * dt);
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    let dps = tier.dps * this.lensDpsMul + tower.ramp;
    if (target.stunUntil > this.time) dps *= BALANCE.synergy.stunnedLens;
    dps = Math.max(BALANCE.minDps, dps - target.armor);
    tower.cooldown -= dt;
    if (tower.cooldown <= 0) {
      target.flash = 0.07;
      tower.cooldown = 0.22;
    }
    this.hurt(target, dps * dt, false);
  }

  private drum(tower: Tower): void {
    const tier = BALANCE.drum[tower.tier];
    const radius = tier.radius * this.rangeMul;
    const r2 = radius * radius;
    let hit = false;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      if (dx * dx + dy * dy > r2) continue;
      hit = true;
      this.hurt(e, tier.damage, true);
      if (!e.alive) continue;
      const stun = (e.boss ? tier.stun * 0.35 : tier.stun) * this.drumStunMul;
      e.stunUntil = Math.max(e.stunUntil, this.time + stun);
      e.slowUntil = Math.max(e.slowUntil, this.time + tier.slow);
    }
    if (!hit) return;
    tower.cooldown += tier.interval;
    this.fx.push({ kind: "drum", x: tower.x, y: tower.y, n: radius });
  }

  private spire(tower: Tower): void {
    const first = this.acquire(tower, 0);
    if (!first) return;
    const tier = BALANCE.spire[tower.tier];
    tower.cooldown += tier.interval;
    tower.angle = Math.atan2(first.y - tower.y, first.x - tower.x);
    const chain: Enemy[] = [first];
    const used = new Set<number>([first.id]);
    let prev = first;
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
    const pts: Vec[] = [{ x: tower.x, y: tower.y - 16 }];
    chain.forEach((e, i) => {
      let damage = tier.damage * this.spireDmgMul * Math.pow(tier.falloff, i);
      if (e.stunUntil > this.time) damage *= BALANCE.synergy.stunnedSpire;
      this.hurt(e, damage, true);
      pts.push({ x: e.x, y: e.y });
    });
    this.fx.push({ kind: "chain", x: tower.x, y: tower.y, pts });
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
        if (target) {
          this.hurt(target, shot.damage, true);
          this.fx.push({ kind: "impact", x: target.x, y: target.y });
        }
      } else {
        shot.x += (dx / dist) * step;
        shot.y += (dy / dist) * step;
      }
    }
  }

  /** `mitigate` subtracts armor. Beams pass false because they already did. */
  private hurt(e: Enemy, raw: number, mitigate: boolean): void {
    if (!e.alive || raw <= 0) return;
    let dealt = mitigate ? Math.max(BALANCE.minHit, raw - e.armor) : raw;
    if (e.boss && e.aegisUntil > this.time) dealt *= BALANCE.boss.aegisMul;
    e.hp -= dealt;
    if (mitigate) e.flash = 0.1;
    if (e.hp > 0) return;
    e.alive = false;
    const reward = Math.max(1, Math.round(e.reward * this.jadeMul));
    this.jade += reward;
    if (this.time >= this.flareLock) this.flare = Math.min(BALANCE.flare.need, this.flare + e.charge);
    this.fx.push({ kind: "death", x: e.x, y: e.y, enemy: e.kind });
    this.fx.push({ kind: "jade", x: e.x, y: e.y - 16, text: `+${reward}` });
    this.noteStreak(e);
    if (e.kind === "golem") {
      for (let i = 0; i < BALANCE.golemShards; i++) this.birth("shard", e.path, Math.min(e.dist + 6, this.routeLen(e) - 4));
    }
  }

  private noteStreak(e: Enemy): void {
    if (this.time <= this.comboUntil) this.combo += 1;
    else this.combo = 1;
    this.comboUntil = this.time + BALANCE.combo.window;
    if (this.combo < BALANCE.combo.start) return;
    const bonus = BALANCE.combo.jade * (this.combo - BALANCE.combo.start + 1);
    this.jade += bonus;
    this.fx.push({ kind: "streak", x: e.x, y: e.y - 34, text: `${this.combo} streak`, n: this.combo });
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
    if (spec.heal) this.integrity = Math.min(BALANCE.integrity, this.integrity + spec.heal);
  }

  private routeLen(e: Enemy): number {
    return (e.flying ? this.map.flights[e.path] : this.map.routes[e.path]).len;
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
