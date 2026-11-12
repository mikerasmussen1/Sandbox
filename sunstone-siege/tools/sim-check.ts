/**
 * Headless proof that the valley can be lost and won, and that the special
 * rules behave. Combat numbers are the invented placeholders in balance.ts.
 */
import { BALANCE, starsFor, towerCost, worldCount } from "../src/balance";
import { SUN } from "../src/maps";
import { Siege, stealthed, type Station } from "../src/sim";
import type { RelicId, TowerKind } from "../src/types";

function fail(msg: string): never {
  throw new Error(msg);
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

function buy(sim: Siege, pred: (s: Station) => boolean): boolean {
  const list = sim.stations
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => pred(s) && sim.stationCost(s) > 0 && sim.jade >= sim.stationCost(s))
    .sort((a, b) => sim.stationCost(a.s) - sim.stationCost(b.s) || dist(a.s) - dist(b.s));
  if (!list.length) return false;
  return sim.fundNow(list[0].i);
}

/** Hold Jade until every trail has a tower, then buy the cheapest pad, then upgrade. */
function cover(sim: Siege): boolean {
  const covered = new Set<number>();
  for (const tower of sim.towers) {
    const station = sim.stations.find((s) => s.kind !== "wall" && s.index === tower.pad);
    if (station) covered.add(station.path);
  }
  if (covered.size >= sim.map.routes.length) return false;
  const open = sim.stations.filter((s) => (s.kind === "dart" || s.kind === "lens") && s.tier === 0 && !covered.has(s.path));
  if (!open.length) return false;
  open.sort((a, b) => (a.kind === "dart" ? 0 : 1) - (b.kind === "dart" ? 0 : 1) || dist(a) - dist(b));
  const pick = open[0];
  if (sim.jade >= sim.stationCost(pick)) sim.fundNow(sim.stations.indexOf(pick));
  return true;
}

function spend(sim: Siege): void {
  if (cover(sim)) return;
  if (buy(sim, (s) => s.kind === "lens" && s.tier === 0)) return;
  if (buy(sim, (s) => s.kind === "dart" && s.tier === 0)) return;
  if (buy(sim, (s) => s.kind === "drum" && s.tier === 0)) return;
  if (buy(sim, (s) => s.kind === "barracks" && s.tier === 0)) return;
  if (buy(sim, (s) => s.kind === "lens" && s.tier === 1)) return;
  if (buy(sim, (s) => s.kind === "dart" && s.tier === 1)) return;
  if (buy(sim, (s) => s.kind === "wall" && s.tier === 0)) return;
  if (buy(sim, (s) => s.kind === "drum" && s.tier === 1)) return;
  buy(sim, (s) => (s.kind === "dart" || s.kind === "lens" || s.kind === "drum") && s.tier > 0 && s.tier < 3);
}

/** Funds a single role and nothing else, so a countered level can show the gap. */
function spendOnly(sim: Siege, kind: TowerKind | "barracks"): void {
  if (buy(sim, (s) => s.kind === kind && s.tier === 0)) return;
  buy(sim, (s) => s.kind === kind && s.tier > 0 && s.tier < 3);
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

function bot(world: number): void {
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
    if (sim.phase === "build") {
      for (let n = 0; n < 24; n++) {
        const before = sim.jade;
        spend(sim);
        if (sim.jade === before) break;
      }
      sim.callWave();
    } else spend(sim);
    chase(sim);
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  if (sim.phase !== "victory") {
    fail(`bot lost world ${world} at wave ${sim.wave} integrity ${sim.integrity} jade ${sim.jade} towers ${sim.towers.length} after ${t.toFixed(1)}s`);
  }
  if (starsFor(sim.integrity) < 2) {
    fail(`bot scraped world ${world} with integrity ${sim.integrity}`);
  }
  console.log(`bot victory world ${world} in ${t.toFixed(1)}s integrity ${sim.integrity} stars ${starsFor(sim.integrity)} towers ${sim.towers.length}`);
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

function mono(world: number, kind: TowerKind | "barracks"): { phase: string; integrity: number; t: number } {
  const sim = new Siege(world);
  const dt = 1 / 20;
  let t = 0;
  while (sim.phase !== "victory" && sim.phase !== "defeat" && t < 180) {
    if (sim.pendingOffer?.length) sim.chooseRelic(sim.pendingOffer[0]);
    if (sim.phase === "build") {
      spendOnly(sim, kind);
      sim.callWave();
    } else spendOnly(sim, kind);
    sim.tick(dt);
    sim.fx.length = 0;
    t += dt;
  }
  const phase = sim.phase === "victory" ? "victory" : "defeat";
  console.log(`mono ${kind} world ${world}: ${phase} integrity ${sim.integrity.toFixed(1)} in ${t.toFixed(1)}s`);
  return { phase, integrity: sim.integrity, t };
}

afk();
rules();
heroLoop();
for (let world = 0; world < worldCount(); world++) bot(world);
const heavySwarm = mono(0, "lens");
const arrowBrute = mono(3, "dart");
const arrowBoulder = mono(5, "dart");
const troopsBoulder = mono(5, "barracks");
const heavyRunners = mono(1, "lens");
if (heavySwarm.phase === "victory") fail("heavy-only should lose the swarm valley");
if (arrowBrute.phase === "victory") fail("arrow-only should lose the brute valley");
if (arrowBoulder.phase === "victory") fail("arrow-only should lose the boulder valley");
if (troopsBoulder.phase === "victory") fail("barracks-only should lose the boulder valley");
if (heavyRunners.phase === "victory") fail("heavy-only should lose the runner ridge");
console.log("counters: mixed wins every valley; one-role funding loses the valley that answers it");
console.log("sim-check ok");
