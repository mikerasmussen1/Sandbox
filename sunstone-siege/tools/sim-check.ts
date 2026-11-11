/**
 * Headless proof that the valley can be lost and won, and that the special
 * rules behave. Combat numbers are the invented placeholders in balance.ts.
 */
import { BALANCE, starsFor, towerCost } from "../src/balance";
import { SUN } from "../src/maps";
import { Siege, stealthed } from "../src/sim";

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

function spend(sim: Siege): void {
  const taken = new Set(sim.towers.map((t) => t.pad));
  const wanted: number[] = [];
  for (const route of sim.map.routes) {
    for (const frac of [0.78, 0.56, 0.36]) {
      const at = pointAlong(route, frac);
      let best = -1;
      let bestD = 150;
      sim.pads.forEach((p, i) => {
        if (taken.has(i) || wanted.includes(i)) return;
        const d = Math.hypot(p.x - at.x, p.y - at.y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best >= 0) wanted.push(best);
    }
  }
  const primary = wanted.filter((_, n) => n % 3 === 0);
  const rest = wanted.filter((_, n) => n % 3 !== 0);
  for (const pad of [...primary, ...rest]) {
    if (sim.jade < towerCost("dart", 0)) break;
    const lenses = sim.towers.filter((t) => t.kind === "lens").length;
    const use = !primary.includes(pad) && lenses < sim.map.routes.length && sim.jade >= towerCost("lens", 0) ? "lens" : "dart";
    sim.place(pad, use);
    taken.add(pad);
  }
  if (wanted.some((pad) => !taken.has(pad))) return;
  const bySun = sim.towers.slice().sort((a, b) => dist(a) - dist(b));
  for (const tower of bySun) {
    if (tower.tier >= 2) continue;
    if (tower.kind !== "dart" && tower.kind !== "lens") continue;
    if (sim.jade >= towerCost(tower.kind, tower.tier + 1)) sim.upgrade(tower.id);
  }
}

function pointAlong(route: { len: number; pts: readonly { x: number; y: number }[] }, frac: number): { x: number; y: number } {
  let left = route.len * frac;
  for (let i = 1; i < route.pts.length; i++) {
    const a = route.pts[i - 1];
    const b = route.pts[i];
    const sl = Math.hypot(b.x - a.x, b.y - a.y);
    if (left <= sl) {
      const k = sl > 0 ? left / sl : 0;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
    left -= sl;
  }
  return route.pts[route.pts.length - 1];
}

function dist(t: { x: number; y: number }): number {
  return Math.hypot(t.x - SUN.x, t.y - SUN.y);
}

function bot(world: number): void {
  const sim = new Siege(world);
  const dt = 1 / 20;
  let t = 0;
  while (sim.phase !== "victory" && sim.phase !== "defeat" && t < 420) {
    spend(sim);
    if (sim.phase === "build") sim.callWave();
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

  const split = new Siege(0);
  const golem = split.forceEnemy("golem", 0, 300);
  split.forceTower("dart", golem.x, golem.y);
  golem.hp = 1;
  tickUntil(split, 0.2);
  const shards = split.enemies.filter((e) => e.alive && e.kind === "shard");
  if (shards.length !== BALANCE.golemShards) fail(`shards ${shards.length}`);
  if (split.enemies.some((e) => e.alive && e.kind === "golem")) fail("golem still alive");

  console.log("rules ok");
}

afk();
rules();
bot(0);
bot(1);
bot(2);
console.log("sim-check ok");
