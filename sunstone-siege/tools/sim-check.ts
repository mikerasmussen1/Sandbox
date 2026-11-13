/**
 * Headless proof that the valley can be lost and won, and that the special
 * rules behave. Combat numbers are the invented placeholders in balance.ts.
 */
import { BALANCE, autoSpec, specChoices, starsFor, towerCost, worldCount } from "../src/balance";
import { SUN } from "../src/maps";
import { Siege, stealthed, type Station } from "../src/sim";
import type { RelicId, Spec, TowerKind } from "../src/types";

function fail(msg: string): never {
  throw new Error(msg);
}

type Cell = { kind: "win" | "hold" | "lose"; integrity: number; t: number };

function cellOf(phase: string, integrity: number, t: number): Cell {
  if (phase === "victory") return { kind: "win", integrity, t };
  if (integrity <= 0 || phase === "defeat") return { kind: "lose", integrity, t };
  return { kind: "hold", integrity, t };
}

/** A hold outranks a loss. A win outranks a hold. That is the worst case for a counter. */
function defenseRank(cell: Cell): number {
  if (cell.kind === "win") return 3000 + cell.integrity;
  if (cell.kind === "hold") return 2000 + cell.integrity;
  return cell.t;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeed<T>(seed: number, fn: () => T): T {
  const prev = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = prev;
  }
}

function tickUntil(sim: Siege, seconds: number, dt = 1 / 30): void {
  const steps = Math.ceil(seconds / dt);
  for (let i = 0; i < steps; i++) {
    if (sim.phase === "victory" || sim.phase === "defeat") return;
    sim.tick(dt);
    sim.fx.length = 0;
  }
}

function afk(): void {
  const sim = new Siege(0);
  let t = 0;
  const dt = 0.1;
  while (sim.phase !== "defeat" && t < 240) {
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  if (sim.phase !== "defeat" || sim.integrity !== 0) fail(`afk should lose, phase ${sim.phase} integrity ${sim.integrity}`);
  if (t < 5) fail(`afk ended too fast (${t}s)`);
  console.log(`afk defeat in ${t.toFixed(1)}s`);
}

function affordable(sim: Siege, pred: (s: Station) => boolean): Station | null {
  const list = sim.stations
    .filter((s) => pred(s) && sim.stationCost(s) > 0 && sim.jade >= sim.stationCost(s))
    .sort((a, b) => sim.stationCost(a) - sim.stationCost(b) || dist(a) - dist(b));
  return list[0] ?? null;
}

/** The bot taps a branch, then the dwell spends it. Players still tap these themselves. */
function armBranch(sim: Siege, station: Station): void {
  if (station.tier !== 1 || station.spec !== "none") return;
  const choices = specChoices(station.kind);
  if (!choices) return;
  const spec = sim.preferSpec && choices.includes(sim.preferSpec) ? sim.preferSpec : autoSpec(station.kind, sim.world);
  sim.chooseSpec(sim.stations.indexOf(station), spec);
}

function park(sim: Siege, station: Station): void {
  armBranch(sim, station);
  sim.clearGoal();
  sim.setSteer(0, 0);
  sim.heroX = station.x;
  sim.heroY = station.y;
}

/** Stand through the dwell when a buy is ready. Otherwise call the wave or chase. */
function act(sim: Siege, wish: (sim: Siege) => Station | null, chaseToo: boolean): void {
  const pinned = sim.funding >= 0 && sim.dwell > 0 ? sim.stations[sim.funding] : null;
  if (pinned && sim.jade + 0.001 >= sim.stationCost(pinned)) {
    park(sim, pinned);
    return;
  }
  const next = wish(sim);
  const room = sim.phase !== "build" || sim.buildLeft > BALANCE.fund.dwell + 0.2;
  if (next && room) {
    park(sim, next);
    return;
  }
  sim.setSteer(0, 0);
  if (sim.phase === "build") sim.callWave();
  if (chaseToo) chase(sim);
}

function uncovered(sim: Siege): Station[] {
  const covered = new Set<number>();
  for (const tower of sim.towers) {
    const station = sim.stations.find((s) => s.kind !== "wall" && s.index === tower.pad);
    if (station) covered.add(station.path);
  }
  if (covered.size >= sim.map.routes.length) return [];
  return sim.stations.filter((s) => (s.kind === "dart" || s.kind === "lens") && s.tier === 0 && !covered.has(s.path));
}

function wishMixed(sim: Siege): Station | null {
  const open = uncovered(sim);
  if (open.length) {
    open.sort((a, b) => (a.kind === "dart" ? 0 : 1) - (b.kind === "dart" ? 0 : 1) || dist(a) - dist(b));
    const pick = open[0];
    return sim.jade >= sim.stationCost(pick) ? pick : null;
  }
  return affordable(sim, (s) => s.kind === "dart" && s.tier === 1)
    ?? affordable(sim, (s) => s.kind === "lens" && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === "lens" && s.tier === 1)
    ?? affordable(sim, (s) => s.kind === "dart" && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === "drum" && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === "barracks" && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === "barracks" && s.tier === 1)
    ?? affordable(sim, (s) => s.kind === "drum" && s.tier === 1)
    ?? affordable(sim, (s) => s.kind === "wall" && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === "base" && s.tier < 3)
    ?? affordable(sim, (s) => (s.kind === "dart" || s.kind === "lens" || s.kind === "drum" || s.kind === "wall") && s.tier > 0 && s.tier < 3);
}

function wishFamily(sim: Siege, kind: TowerKind | "barracks", spec: Spec): Station | null {
  sim.preferSpec = spec;
  return affordable(sim, (s) => s.kind === kind && s.tier === 0)
    ?? affordable(sim, (s) => s.kind === kind && s.tier > 0 && s.tier < 3);
}

function wishWalls(sim: Siege): Station | null {
  return affordable(sim, (s) => s.kind === "wall" && (s.tier < 3 || !s.alive));
}

function chase(sim: Siege): void {
  const hero = sim.heroAt();
  let tx = 0;
  let ty = 0;
  let best = Infinity;
  for (const gem of sim.drops) {
    if (!gem.alive) continue;
    const d = Math.hypot(gem.x - hero.x, gem.y - hero.y);
    if (d < best) {
      best = d;
      tx = gem.x;
      ty = gem.y;
    }
  }
  if (best === Infinity) {
    for (const e of sim.enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - hero.x, e.y - hero.y);
      if (d < best) {
        best = d;
        tx = e.x;
        ty = e.y;
      }
    }
  }
  if (best === Infinity) {
    sim.setSteer(0, 0);
    return;
  }
  const dx = tx - hero.x;
  const dy = ty - hero.y;
  if (best < 42) sim.setSteer(-dy / best, dx / best);
  else sim.setSteer(dx / best, dy / best);
}

function dist(t: { x: number; y: number }): number {
  return Math.hypot(t.x - SUN.x, t.y - SUN.y);
}

function bot(world: number): Cell {
  const sim = new Siege(world);
  const dt = 1 / 20;
  let t = 0;
  while (sim.phase !== "victory" && sim.phase !== "defeat" && t < 420) {
    if (sim.pendingOffer?.length) {
      const order: RelicId[] = sim.integrity < 20
        ? ["ward", "kindling", "keen", "focus", "rite", "war", "leap", "heart"]
        : ["kindling", "keen", "focus", "rite", "war", "leap", "heart", "ward"];
      const pick = order.find((id) => sim.pendingOffer?.includes(id)) ?? sim.pendingOffer[0];
      sim.chooseRelic(pick);
    }
    act(sim, wishMixed, true);
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  const cell = cellOf(sim.phase, sim.integrity, t);
  console.log(`bot world ${world}: ${cell.kind} integrity ${sim.integrity.toFixed(1)} stars ${starsFor(sim.integrity)} towers ${sim.towers.length} in ${t.toFixed(1)}s`);
  return cell;
}

function rules(): void {
  const map = new Siege(0);
  if (map.pads.length < 8) fail(`expected pads, got ${map.pads.length}`);
  for (let i = 0; i < map.map.routes.length; i++) {
    if (!(map.map.flights[i].len < map.map.routes[i].len)) {
      fail(`flight ${i} len ${map.map.flights[i].len} vs ground ${map.map.routes[i].len}`);
    }
  }

  if (starsFor(22) !== 3 || starsFor(16) !== 3 || starsFor(10) !== 2 || starsFor(9) !== 1) fail("stars");

  const sell = new Siege(0);
  const before = sell.jade;
  if (!sell.place(0, "dart")) fail("place");
  const refund = sell.sell(sell.towers[0].id);
  if (refund !== Math.floor(towerCost("dart", 0) * BALANCE.sellRefund)) fail(`refund ${refund}`);
  if (sell.jade !== before - towerCost("dart", 0) + refund) fail("jade after sell");
  if (sell.place(0, "dart") !== true) fail("pad freed");

  const flare = new Siege(0);
  const runner = flare.forceEnemy("runner", 0, 40);
  if (flare.fireFlare()) fail("flare at 0");
  flare.flare = BALANCE.flare.need;
  if (!flare.fireFlare()) fail("flare ready");
  if (runner.alive) fail("flare should remove a runner");
  if (flare.fireFlare()) fail("flare lock");
  const boss = flare.forceEnemy("boss", 0, 80);
  const hp = boss.hp;
  flare.flare = BALANCE.flare.need;
  flare.flareLock = 0;
  flare.fireFlare();
  const dealt = Math.max(BALANCE.minHit, BALANCE.flare.bossDamage - BALANCE.enemies.boss.armor);
  if (Math.abs(hp - boss.hp - dealt) > 0.01) fail(`boss flare dealt ${hp - boss.hp} expected ${dealt}`);

  const stealth = new Siege(0);
  const cat = stealth.forceEnemy("jaguar", 0, 200);
  stealth.forceTower("dart", cat.x, cat.y);
  cat.age = BALANCE.jaguar.cycle - BALANCE.jaguar.dur + 0.05;
  const hp0 = cat.hp;
  if (!stealthed(cat.kind, cat.age)) fail("expected stealth");
  tickUntil(stealth, 0.7);
  if (cat.hp !== hp0) fail(`stealthed jaguar took damage ${hp0 - cat.hp}`);
  cat.age = 0.2;
  tickUntil(stealth, 1.6);
  if (cat.hp >= hp0) fail("visible jaguar should take damage");

  const idle = new Siege(0);
  const totem = idle.forceTower("dart", 0, 0);
  tickUntil(idle, 9);
  if (totem.cooldown < 0) fail(`idle cooldown went negative (${totem.cooldown})`);
  const quarry = idle.forceEnemy("runner", 0, 80);
  totem.x = quarry.x + 40;
  totem.y = quarry.y;
  const seen = new Set(idle.shots.map((s) => s.id));
  let fired = 0;
  for (let i = 0; i < 30; i++) {
    idle.tick(1 / 30);
    for (const shot of idle.shots) {
      if (shot.id && !seen.has(shot.id)) {
        seen.add(shot.id);
        fired += 1;
      }
    }
  }
  if (fired > 6) fail(`dart dumped ${fired} shots in one second after idling`);

  const rock = new Siege(0);
  const brute = rock.forceEnemy("golem", 0, 300);
  rock.forceTower("dart", brute.x, brute.y);
  const rockHp = brute.hp;
  tickUntil(rock, 0.2);
  if (brute.hp !== rockHp) fail("boulder should soak the dart");
  if (brute.boulder >= BALANCE.boulder.hp) fail("boulder should chip");

  const split = new Siege(0);
  const golem = split.forceEnemy("golem", 0, 300);
  split.forceTower("dart", golem.x, golem.y);
  golem.boulder = 0;
  golem.hp = 1;
  tickUntil(split, 0.2);
  const shards = split.enemies.filter((e) => e.alive && e.kind === "shard");
  if (shards.length !== BALANCE.golemShards) fail(`shards ${shards.length}`);
  if (split.enemies.some((e) => e.alive && e.kind === "golem")) fail("golem still alive");

  console.log("rules ok");
}

/** The hero shoots by itself. Standing still, or kiting and never funding, still loses. */
function heroLoop(): void {
  const gun = new Siege(0);
  const route = gun.map.routes[0];
  const runner = gun.forceEnemy("runner", 0, Math.max(0, route.len - 140));
  const startHp = runner.hp;
  tickUntil(gun, 2.4);
  if (runner.alive && runner.hp >= startHp) fail("hero should shoot a runner in range");
  if (runner.alive) fail(`runner should fall to the hero, hp ${runner.hp.toFixed(1)}`);
  if (gun.guardianKills < 1) fail("hero kill not counted");

  const fund = new Siege(0);
  const dart = fund.stations.findIndex((s) => s.kind === "dart");
  if (dart < 0 || !fund.fundNow(dart)) fail("funding a dart station");
  if (!fund.towers.some((t) => t.kind === "dart" && t.pad === fund.stations[dart].index)) fail("funded dart did not build");

  const gate = new Siege(0);
  const wall = gate.stations.find((s) => s.kind === "wall" && s.path === 0);
  if (!wall) fail("missing wall station");
  const wallIndex = gate.stations.indexOf(wall);
  if (!gate.fundNow(wallIndex) || !wall.alive) fail("funding a wall");

  const dwell = new Siege(0);
  const pad = dwell.stations.find((s) => s.kind === "dart" && s.tier === 0);
  if (!pad) fail("no dart pad");
  const cost = dwell.stationCost(pad);
  const jade0 = dwell.jade;
  dwell.heroX = pad.x;
  dwell.heroY = pad.y;
  dwell.setSteer(0, 0);
  tickUntil(dwell, 0.45);
  if (pad.tier !== 0 || dwell.jade !== jade0) fail("the ring charged before it finished");
  if (dwell.dwell < 0.3 || dwell.dwell > 0.7) fail(`dwell progress ${dwell.dwell.toFixed(2)}`);
  dwell.setSteer(1, 0);
  tickUntil(dwell, 0.45);
  if (pad.tier !== 0 || dwell.jade !== jade0 || dwell.dwell !== 0) fail("walking off should cancel with no charge");
  dwell.setSteer(0, 0);
  dwell.heroX = pad.x;
  dwell.heroY = pad.y;
  tickUntil(dwell, BALANCE.fund.dwell + 0.12);
  if (pad.tier !== 1) fail("standing should build the previewed tower");
  if (dwell.jade !== jade0 - cost) fail(`jade ${dwell.jade} expected ${jade0 - cost}`);
  const poor = new Siege(0);
  const poorPad = poor.stations.find((s) => s.kind === "dart" && s.tier === 0);
  if (!poorPad) fail("no poor pad");
  poor.jade = 1;
  poor.heroX = poorPad.x;
  poor.heroY = poorPad.y;
  poor.setSteer(0, 0);
  tickUntil(poor, 1.2);
  if (poorPad.tier !== 0 || poor.jade !== 1 || !poor.shortJade) fail("short jade must not build");
  const bug = gate.forceEnemy("skitter", 0, Math.max(0, wall.dist - 180));
  tickUntil(gate, 3.2);
  if (!bug.alive) fail("a lone skitter should still be chewing the wall");
  if (bug.dist > wall.dist - 10) fail(`skitter walked through the wall at ${bug.dist.toFixed(1)} vs ${wall.dist.toFixed(1)}`);

  for (let world = 0; world < worldCount(); world++) {
    const idle = play(world, "idle");
    const kite = play(world, "kite");
    if (idle.phase !== "defeat") fail(`world ${world} idle should lose, got ${idle.phase}`);
    if (kite.phase !== "defeat") fail(`world ${world} kite should lose, got ${kite.phase} kills ${kite.kills}`);
    console.log(`hero world ${world}: idle ${idle.t.toFixed(1)}s, kite ${kite.t.toFixed(1)}s, kills ${kite.kills}`);
  }
  console.log("hero ok");
}

function kite(sim: Siege): void {
  let lead: { x: number; y: number } | null = null;
  let progress = -1;
  for (const e of sim.enemies) {
    if (!e.alive) continue;
    const route = e.flying ? sim.map.flights[e.path] : sim.map.routes[e.path];
    const p = route.len > 0 ? e.dist / route.len : 0;
    if (p > progress) {
      progress = p;
      lead = e;
    }
  }
  if (!lead) {
    sim.setSteer(0, 0);
    return;
  }
  const hero = sim.heroAt();
  const dx = lead.x - hero.x;
  const dy = lead.y - hero.y;
  const d = Math.hypot(dx, dy) || 1;
  const want = BALANCE.hero.range * 0.75;
  if (d > want + 16) sim.setSteer(dx / d, dy / d);
  else if (d < want - 24) sim.setSteer(-dx / d, -dy / d);
  else sim.setSteer(-dy / d, dx / d);
}

function play(world: number, style: "idle" | "kite"): { phase: string; kills: number; t: number } {
  const sim = new Siege(world);
  const dt = 0.1;
  let t = 0;
  while (sim.phase !== "victory" && sim.phase !== "defeat" && t < 360) {
    if (sim.pendingOffer?.length) sim.chooseRelic(sim.pendingOffer[0]);
    if (sim.phase === "build") sim.callWave();
    if (style === "kite") kite(sim);
    else sim.setSteer(0, 0);
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  return { phase: sim.phase, kills: sim.guardianKills, t };
}

function familyRun(world: number, label: string, spend: (sim: Siege) => Station | null): Cell {
  const sim = new Siege(world);
  const dt = 1 / 20;
  let t = 0;
  // Long valleys keep leaking past three minutes. A stone still up at the horizon is a hold, not a loss.
  while (sim.phase !== "victory" && sim.phase !== "defeat" && t < 720) {
    if (sim.pendingOffer?.length) sim.chooseRelic(sim.pendingOffer[0]);
    act(sim, spend, false);
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  const cell = cellOf(sim.phase, sim.integrity, t);
  console.log(`${label} world ${world}: ${cell.kind} integrity ${sim.integrity.toFixed(1)} in ${t.toFixed(1)}s`);
  return cell;
}

const SEEDS = [11, 29, 47, 71, 97];

function worst(cells: Cell[], favor: "defense" | "attack"): Cell {
  return cells.reduce((best, cell) => {
    const left = defenseRank(best);
    const right = defenseRank(cell);
    if (favor === "defense") return right > left ? cell : best;
    return right < left ? cell : best;
  });
}

function formatCell(cell: Cell): string {
  const integrity = Math.round(cell.integrity);
  const seconds = Math.round(cell.t);
  if (cell.kind === "win") return `win ${integrity} / ${seconds}s`;
  if (cell.kind === "hold") return `hold ${integrity} / ${seconds}s`;
  return `lose ${seconds}s`;
}

afk();
rules();
heroLoop();

const worlds = worldCount();
const mixed: Cell[][] = [];
for (let world = 0; world < worlds; world++) {
  const runs = SEEDS.map((seed) => withSeed(seed * 100 + world, () => bot(world)));
  mixed.push(runs);
}

const families: { label: string; spend: (sim: Siege) => Station | null }[] = [
  { label: "archer", spend: (sim) => wishFamily(sim, "dart", "rain") },
  { label: "siege", spend: (sim) => wishFamily(sim, "lens", "ballista") },
  { label: "mystic", spend: (sim) => wishFamily(sim, "drum", "snare") },
  { label: "barracks", spend: (sim) => wishFamily(sim, "barracks", "spears") },
  { label: "wall", spend: (sim) => wishWalls(sim) },
];
const familyCells = new Map<string, Cell[]>();
for (const family of families) {
  for (let world = 0; world < worlds; world++) {
    const runs = SEEDS.map((seed, n) => withSeed(seed * 100 + world * 8 + n + 3, () => familyRun(world, family.label, family.spend)));
    familyCells.set(`${family.label}:${world}`, runs);
  }
}

const countered: [string, number, string][] = [
  ["siege", 0, "the swarm valley"],
  ["siege", 1, "the runner ridge"],
  ["archer", 2, "the twin canyon"],
  ["archer", 3, "the brute valley"],
  ["archer", 5, "the boulder valley"],
  ["barracks", 4, "the flyer valley"],
  ["mystic", 0, "the swarm valley"],
  ["wall", 0, "the swarm valley"],
  ["wall", 2, "the twin canyon"],
  ["wall", 3, "the brute valley"],
  ["wall", 5, "the boulder valley"],
  ["wall", 7, "the colossus stair"],
];

let broken = false;
for (let world = 0; world < worlds; world++) {
  const runs = mixed[world];
  const bad = runs.filter((cell) => cell.kind !== "win" || starsFor(cell.integrity) < 3);
  if (bad.length) {
    broken = true;
    console.error(`mixed world ${world} failed a seed: ${runs.map(formatCell).join(" | ")}`);
  }
}
for (const [label, world, name] of countered) {
  const runs = familyCells.get(`${label}:${world}`) ?? [];
  const slipped = runs.filter((cell) => cell.kind !== "lose");
  if (slipped.length) {
    broken = true;
    console.error(`${label}-only should lose ${name}. Seeds: ${runs.map(formatCell).join(" | ")}`);
  }
}

console.log("worst of 5 seeds");
console.log("| Valley | Mixed | Archer | Siege | Mystic | Barracks | Walls |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
for (let world = 0; world < worlds; world++) {
  const name = `${world} ${BALANCE.worlds[world].name}`;
  const row = [
    formatCell(worst(mixed[world], "attack")),
    ...families.map((family) => formatCell(worst(familyCells.get(`${family.label}:${world}`) ?? [], "defense"))),
  ];
  console.log(`| ${name} | ${row.join(" | ")} |`);
}
if (broken) fail("a countered family held or won, or the mixed bot missed a valley");
console.log("counters: mixed wins every valley on every seed; a countered family loses, and a hold does not pass");
console.log("sim-check ok");
