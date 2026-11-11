/**
 * The valley: painted map, rendered totems and raiders, the layered Sunstone,
 * and pooled effects. Combat decisions stay in sim.ts.
 */
import { Container, Graphics, Sprite, Text, type Texture } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, towerRange } from "./balance";
import { MAP_H, MAP_W, SUN } from "./maps";
import { stealthed, type Fx, type Siege } from "./sim";
import { TOWER_KINDS, type EnemyKind, type TowerKind, type Vec } from "./types";

const SANS = 'Palatino, "Palatino Linotype", Georgia, serif';
const TOWER_SCALE = 0.62;
const SUN_SCALE = 0.36;

const ENEMY_SCALE: Record<EnemyKind, number> = {
  runner: 0.58,
  shield: 0.62,
  jaguar: 0.6,
  golem: 0.68,
  shard: 0.28,
  glider: 0.54,
  boss: 0.48,
};

export const RANGE_COLOR: Record<TowerKind, number> = {
  dart: 0xf0d7a2,
  lens: 0xffb03a,
  drum: 0x7dffe0,
  spire: 0x5dffb0,
};

interface Ghost { s: Sprite; shadow: Sprite; life: number }
interface Bit { s: Sprite; vx: number; vy: number; life: number; max: number; spin: number; gravity: number; shrink: number }
interface Floater { t: Text; life: number; vy: number }
interface Ring { x: number; y: number; radius: number; life: number; max: number; color: number }
interface Arc { pts: Vec[]; life: number }
interface Boom { s: Sprite; life: number; max: number }

export class WorldView {
  readonly world = new Container();
  readonly overlay = new Container();
  readonly menu = new Container();
  shakeX = 0;
  shakeY = 0;
  menuPad = -1;
  rangeScale = 1;
  private readonly art: ArtSet;
  private readonly mapSprite = new Sprite();
  private readonly grade = new Graphics();
  private readonly range = new Graphics();
  private readonly shadows = new Container();
  private readonly towers = new Container();
  private readonly enemies = new Container();
  private readonly shots = new Container();
  private readonly bars = new Graphics();
  private readonly fxLayer = new Container();
  private readonly bitsLayer = new Container();
  private readonly floatLayer = new Container();
  private readonly sun = new Container();
  private readonly glow: Sprite;
  private readonly bloom: Sprite;
  private readonly ring: Sprite;
  private readonly inner: Sprite;
  private readonly disk: Sprite;
  private readonly cracks = new Graphics();
  private readonly flashRect = new Graphics();
  private readonly towerSpr = new Map<number, Sprite>();
  private readonly towerShadow = new Map<number, Sprite>();
  private readonly lensGlow = new Map<number, Sprite>();
  private readonly spireGold = new Map<number, Sprite>();
  private readonly enemySpr = new Map<number, Sprite>();
  private readonly enemyShadow = new Map<number, Sprite>();
  private readonly shotSpr: Sprite[] = [];
  private readonly beamSpr: Sprite[] = [];
  private readonly ringSpr: Sprite[] = [];
  private readonly boltSpr: Sprite[] = [];
  private readonly spritePool: Sprite[] = [];
  private readonly shadowPool: Sprite[] = [];
  private readonly ghosts: Ghost[] = [];
  private readonly bits: Bit[] = [];
  private readonly bitPool: Bit[] = [];
  private readonly floats: Floater[] = [];
  private readonly floatPool: Floater[] = [];
  private readonly rings: Ring[] = [];
  private readonly arcs: Arc[] = [];
  private readonly booms: Boom[] = [];
  private readonly boomPool: Boom[] = [];
  private readonly padSpr: Sprite[] = [];
  private readonly menuButtons: Container[] = [];
  private readonly menuCosts: Text[] = [];
  private rangeKey = "";
  private crackKey = -1;
  private trauma = 0;
  private flash = 0;
  private time = 0;
  private reduced = false;
  private held = false;
  private biome: "valley" | "ruins" | "crater" = "valley";
  private onPlace: ((kind: TowerKind) => void) | null = null;

  constructor(art: ArtSet) {
    this.art = art;
    this.mapSprite.eventMode = "none";
    this.shadows.eventMode = "none";
    this.world.addChild(this.mapSprite, this.shadows, this.range, this.towers, this.enemies, this.shots);
    this.sun.position.set(SUN.x, SUN.y);
    this.glow = this.sunSprite(art.glow, "add");
    this.bloom = this.sunSprite(art.frame("sun-core"), "add");
    this.ring = this.sunSprite(art.frame("sun-outer"), "normal");
    this.inner = this.sunSprite(art.frame("sun-inner"), "normal");
    this.disk = this.sunSprite(art.frame("sun-core"), "normal");
    this.sun.addChild(this.glow, this.bloom, this.ring, this.inner, this.disk, this.cracks);
    this.enemies.sortableChildren = true;
    this.towers.sortableChildren = true;
    this.fxLayer.eventMode = "none";
    this.world.addChild(this.sun, this.bars, this.fxLayer, this.bitsLayer, this.floatLayer, this.menu);
    this.grade.eventMode = "none";
    this.flashRect.eventMode = "none";
    this.flashRect.blendMode = "add";
    this.overlay.eventMode = "none";
    this.overlay.addChild(this.grade, this.flashRect);
    this.buildMenu();
  }

  setMap(texture: Texture, biome: "valley" | "ruins" | "crater", pads: readonly Vec[]): void {
    this.mapSprite.texture = texture;
    this.mapSprite.width = MAP_W;
    this.mapSprite.height = MAP_H;
    this.biome = biome;
    for (const s of this.padSpr) s.destroy();
    this.padSpr.length = 0;
    for (const pad of pads) {
      const s = new Sprite(this.art.frame("pad"));
      s.anchor.set(0.5);
      s.scale.set(0.42);
      s.position.set(pad.x, pad.y);
      s.eventMode = "none";
      this.padSpr.push(s);
      this.world.addChildAt(s, 1);
    }
    this.crackKey = -1;
  }

  layout(w: number, h: number): void {
    this.grade.clear();
    this.flashRect.clear();
    this.flashRect.rect(0, 0, w, h).fill({ color: 0xffe0a0 });
  }

  setReduced(reduced: boolean): void {
    this.reduced = reduced;
  }

  parallax(_camX: number, _camY: number): void {
    /* The painted map carries its own depth. */
  }

  menuScale(zoom: number): void {
    if (this.menu.visible) this.menu.scale.set(1 / zoom);
  }

  openMenu(pad: number, at: Vec, zoom: number, jade: number, onPlace: (kind: TowerKind) => void): void {
    this.menuPad = pad;
    this.onPlace = onPlace;
    this.menu.visible = true;
    this.menu.position.set(at.x, at.y);
    this.menu.scale.set(1 / zoom);
    this.refreshMenu(jade);
  }

  refreshMenu(jade: number): void {
    TOWER_KINDS.forEach((kind, i) => {
      this.menuCosts[i].text = String(towerCostLabel(kind));
      this.menuButtons[i].alpha = jade >= towerCostLabel(kind) ? 1 : 0.45;
    });
  }

  closeMenu(): void {
    this.menu.visible = false;
    this.menuPad = -1;
    this.onPlace = null;
  }

  blocks(x: number, y: number): boolean {
    if (!this.menu.visible) return false;
    for (const button of this.menuButtons) {
      const b = button.getBounds();
      if (x >= b.x && y <= b.y + b.height && x <= b.x + b.width && x >= b.x && y >= b.y) return true;
    }
    return false;
  }

  showRange(x: number, y: number, radius: number, color: number): void {
    const key = `${radius}:${color}`;
    if (key !== this.rangeKey) {
      this.range.clear();
      this.range.circle(0, 0, radius).fill({ color, alpha: 0.12 });
      this.range.circle(0, 0, radius).stroke({ width: 3, color, alpha: 0.9 });
      this.rangeKey = key;
    }
    this.range.visible = true;
    this.range.position.set(x, y);
  }

  hideRange(): void {
    this.range.visible = false;
  }

  update(dt: number, sim: Siege, hold = false): void {
    this.held = hold;
    const step = hold ? 0 : dt > 0 ? dt : 0;
    this.time += hold ? 0 : step > 0 ? step : 0.016;
    this.syncTowers(sim);
    this.syncEnemies(sim);
    this.syncShots(sim);
    this.drawBars(sim);
    this.drawSun(step, sim);
    this.drawFx(step);
    this.drawBits(step);
    this.drawFloats(step);
    const fade = hold ? 0 : step > 0 ? step : 0.016;
    this.flash = Math.max(0, this.flash - fade * (this.reduced ? 2.4 : 1.3));
    this.flashRect.alpha = this.flash;
    this.flashRect.visible = this.flash > 0.02;
    if (this.reduced) {
      this.trauma = 0;
      this.shakeX = 0;
      this.shakeY = 0;
    } else {
      this.trauma = Math.max(0, this.trauma - (step > 0 ? step : 0.016) * 1.6);
      this.shakeX = Math.sin(this.time * 46) * this.trauma * 18;
      this.shakeY = Math.cos(this.time * 37) * this.trauma * 12;
    }
    const pulse = this.reduced ? 0.85 : 0.62 + Math.sin(this.time * 3) * 0.2;
    const fresh = sim.towers.length === 0 && sim.wave === 0 && sim.phase === "build";
    this.padSpr.forEach((s, i) => {
      s.visible = !sim.towers.some((t) => t.pad === i);
      s.alpha = fresh ? 1 : pulse;
    });
  }

  apply(fx: readonly Fx[]): void {
    for (const event of fx) {
      if (event.kind === "impact") this.burst(event.x, event.y, 0xfff0c2, 6, 110);
      else if (event.kind === "death") {
        const boss = event.enemy === "boss";
        this.boom(event.x, event.y, boss ? 1.15 : 0.55);
        this.burst(event.x, event.y, boss ? 0xffb03a : 0xff6a4a, boss ? 16 : 8, boss ? 220 : 150);
        this.bump(boss ? 0.7 : event.enemy === "golem" ? 0.28 : 0.08);
      } else if (event.kind === "jade" && event.text) {
        this.floatText(event.x, event.y, event.text, 0xc8ffd8, 16);
        this.burst(event.x, event.y, 0x7dffc4, 5, 80);
      } else if (event.kind === "streak" && event.text) {
        this.floatText(event.x, event.y, event.text, 0xffe08a, 22);
        this.bump((event.n ?? 0) >= 6 ? 0.2 : 0.08);
      } else if (event.kind === "relic" && event.text) this.floatText(event.x, event.y, event.text, 0xfff1c8, 26);
      else if (event.kind === "aegis") {
        this.rings.push({ x: event.x, y: event.y, radius: 86, life: 0.4, max: 0.4, color: 0x9a90c8 });
        this.bump(0.16);
      } else if (event.kind === "rally" && event.n) this.rings.push({ x: event.x, y: event.y, radius: event.n, life: 0.45, max: 0.45, color: 0xff7a3a });
      else if (event.kind === "drum" && event.n) this.rings.push({ x: event.x, y: event.y, radius: event.n, life: 0.42, max: 0.42, color: 0x9dffd8 });
      else if (event.kind === "slam" && event.n) {
        this.rings.push({ x: event.x, y: event.y, radius: event.n, life: 0.36, max: 0.36, color: 0xff7a4a });
        this.bump(0.35);
      } else if (event.kind === "chain" && event.pts) this.arcs.push({ pts: event.pts, life: 0.28 });
      else if (event.kind === "crack") {
        this.bump(0.3);
        this.flash = Math.max(this.flash, this.reduced ? 0.1 : 0.2);
      } else if (event.kind === "flare") {
        this.rings.push({ x: SUN.x, y: SUN.y, radius: 640, life: 0.55, max: 0.55, color: 0xffe0a0 });
        this.flash = Math.max(this.flash, this.reduced ? 0.25 : 0.7);
        this.bump(0.75);
        this.burst(SUN.x, SUN.y, 0xffe6b0, this.reduced ? 6 : 22, 280);
      } else if (event.kind === "place") this.burst(event.x, event.y, 0xf0d7a2, 6, 70);
      else if (event.kind === "boss") {
        this.rings.push({ x: event.x, y: event.y, radius: 240, life: 0.7, max: 0.7, color: 0xffb03a });
        this.bump(0.55);
        this.flash = Math.max(this.flash, this.reduced ? 0.12 : 0.35);
      }
    }
  }

  private bump(amount: number): void {
    if (!this.reduced) this.trauma = Math.min(1, this.trauma + amount);
  }

  private sunSprite(texture: Texture, blend: "add" | "normal"): Sprite {
    const s = new Sprite(texture);
    s.anchor.set(0.5);
    s.scale.set(SUN_SCALE);
    s.blendMode = blend;
    s.eventMode = "none";
    return s;
  }

  private buildMenu(): void {
    this.menu.visible = false;
    this.menu.eventMode = "passive";
    TOWER_KINDS.forEach((kind, i) => {
      const angle = -Math.PI / 2 + (i / TOWER_KINDS.length) * Math.PI * 2;
      const button = new Container();
      button.position.set(Math.cos(angle) * 104, Math.sin(angle) * 104);
      const plate = new Graphics().circle(0, 0, 34).fill({ color: 0x1a140e, alpha: 0.92 }).stroke({ width: 2, color: 0xe6c27a });
      const icon = new Sprite(this.art.frame(`tower-${kind}-0`));
      icon.anchor.set(0.5, 0.72);
      icon.scale.set(0.22);
      const cost = new Text({
        text: "0",
        style: { fontFamily: SANS, fontSize: 15, fill: 0xfff1c8, fontWeight: "bold", dropShadow: shadow() },
      });
      cost.anchor.set(0.5);
      cost.position.set(0, 40);
      button.addChild(plate, icon, cost);
      button.eventMode = "static";
      button.cursor = "pointer";
      button.on("pointerover", () => {
        this.showRange(this.menu.position.x, this.menu.position.y, towerRange(kind, 0) * this.rangeScale, RANGE_COLOR[kind]);
      });
      button.on("pointertap", (e) => {
        e.stopPropagation();
        this.onPlace?.(kind);
      });
      this.menu.addChild(button);
      this.menuButtons.push(button);
      this.menuCosts.push(cost);
    });
  }

  private syncTowers(sim: Siege): void {
    const seen = new Set<number>();
    for (const tower of sim.towers) {
      seen.add(tower.id);
      let spr = this.towerSpr.get(tower.id);
      let shade = this.towerShadow.get(tower.id);
      if (!spr || !shade) {
        spr = this.takeSprite();
        spr.anchor.set(0.5, 0.98);
        shade = this.takeShadow();
        this.towers.addChild(spr);
        this.shadows.addChild(shade);
        this.towerSpr.set(tower.id, spr);
        this.towerShadow.set(tower.id, shade);
      }
      spr.texture = this.art.frame(`tower-${tower.kind}-${tower.tier}`);
      spr.position.set(tower.x, tower.y);
      shade.position.set(tower.x, tower.y - 4);
      shade.scale.set(0.85);
      const interval = tower.kind === "dart" ? BALANCE.dart[tower.tier].interval : tower.kind === "drum" ? BALANCE.drum[tower.tier].interval : tower.kind === "spire" ? BALANCE.spire[tower.tier].interval : 0;
      const kick = interval > 0 && tower.cooldown > interval * 0.82;
      const pop = kick ? 1.07 : 1;
      const squash = kick ? 0.94 : 1;
      spr.scale.set(TOWER_SCALE * pop, TOWER_SCALE * squash);
      spr.zIndex = tower.y;
      spr.tint = tower.stunnedUntil > sim.time ? 0x9aa8b4 : 0xffffff;
      this.syncLensGlow(tower.id, tower.kind === "lens", tower.x, tower.y);
      this.syncSpireGold(tower.id, tower.kind === "spire" ? tower.tier : -1, tower.x, tower.y);
    }
    for (const [id, spr] of this.towerSpr) {
      if (seen.has(id)) continue;
      this.towerSpr.delete(id);
      spr.removeFromParent();
      this.spritePool.push(spr);
      const shade = this.towerShadow.get(id);
      if (shade) {
        shade.removeFromParent();
        this.shadowPool.push(shade);
        this.towerShadow.delete(id);
      }
      this.retire(this.lensGlow, id);
      this.retire(this.spireGold, id);
    }
  }

  private syncLensGlow(id: number, on: boolean, x: number, y: number): void {
    let glow = this.lensGlow.get(id);
    if (!on) {
      if (glow) glow.visible = false;
      return;
    }
    if (!glow) {
      glow = new Sprite(this.art.glow);
      glow.anchor.set(0.5);
      glow.blendMode = "add";
      glow.eventMode = "none";
      this.fxLayer.addChild(glow);
      this.lensGlow.set(id, glow);
    }
    glow.visible = true;
    glow.position.set(x, y - 102);
    const pulse = this.reduced ? 1 : 1 + Math.sin(this.time * 6 + id) * 0.08;
    glow.scale.set(0.42 * pulse);
    glow.alpha = 0.75;
    glow.tint = 0xffc14a;
  }

  private syncSpireGold(id: number, tier: number, x: number, y: number): void {
    let gold = this.spireGold.get(id);
    if (tier < 1) {
      if (gold) gold.visible = false;
      return;
    }
    if (!gold) {
      gold = new Sprite(this.art.frame("fx-orb"));
      gold.anchor.set(0.5);
      gold.blendMode = "add";
      gold.eventMode = "none";
      this.fxLayer.addChild(gold);
      this.spireGold.set(id, gold);
    }
    gold.visible = true;
    gold.position.set(x + 6, y - (tier === 1 ? 112 : 124));
    gold.scale.set(tier === 1 ? 0.22 : 0.3);
    gold.tint = tier === 1 ? 0xffd56a : 0x9dffc8;
    gold.alpha = this.reduced ? 0.7 : 0.55 + Math.sin(this.time * 5 + id) * 0.2;
  }

  private retire(map: Map<number, Sprite>, id: number): void {
    const s = map.get(id);
    if (!s) return;
    s.removeFromParent();
    s.destroy();
    map.delete(id);
  }

  private syncEnemies(sim: Siege): void {
    const seen = new Set<number>();
    for (const e of sim.enemies) {
      if (!e.alive) continue;
      seen.add(e.id);
      let spr = this.enemySpr.get(e.id);
      let shade = this.enemyShadow.get(e.id);
      if (!spr || !shade) {
        spr = this.takeSprite();
        shade = this.takeShadow();
        this.enemies.addChild(spr);
        this.shadows.addChild(shade);
        this.enemySpr.set(e.id, spr);
        this.enemyShadow.set(e.id, shade);
      }
      const kind = e.kind === "shard" ? "golem" : e.kind;
      const frame = Math.floor(this.time * (e.flying ? 6 : 5) + e.id * 0.7) % 2;
      spr.texture = this.art.frame(`enemy-${kind}-${frame}`);
      const flying = e.flying;
      spr.anchor.set(flying ? 0.5 : 0.5, flying ? 0.55 : 0.97);
      const bob = flying ? Math.sin(this.time * 6 + e.id) * 8 : Math.sin(this.time * 8 + e.id) * 1.5;
      spr.position.set(e.x, e.y + bob);
      shade.position.set(e.x, e.y + (flying ? 16 : 2));
      shade.scale.set(flying ? 0.55 : e.kind === "boss" ? 1.15 : 0.72);
      shade.alpha = flying ? 0.28 : 0.5;
      spr.zIndex = e.y;
      let sc = ENEMY_SCALE[e.kind];
      if (e.kind === "boss") sc *= Math.min(1, 0.35 + e.age * 1.6);
      if (e.flash > 0) sc *= 1.06;
      const face = e.kind === "shard" ? 1 : Math.cos(e.angle) >= 0 ? 1 : -1;
      spr.scale.set(sc * face, sc);
      spr.rotation = e.kind === "shard" ? this.time * 2 + e.id : 0;
      spr.alpha = stealthed(e.kind, e.age) ? 0.22 : e.boss && e.aegisUntil > sim.time ? 0.78 : 1;
      spr.tint = e.flash > 0 ? 0xfff4ee : e.boss && e.aegisUntil > sim.time ? 0xc8bdd8 : 0xffffff;
    }
    for (const [id, spr] of this.enemySpr) {
      if (seen.has(id)) continue;
      this.enemySpr.delete(id);
      const shade = this.enemyShadow.get(id);
      this.enemyShadow.delete(id);
      if (shade) this.ghosts.push({ s: spr, shadow: shade, life: 0.4 });
    }
  }

  private syncShots(sim: Siege): void {
    let shown = 0;
    for (const shot of sim.shots) {
      if (!shot.alive) continue;
      let spr = this.shotSpr[shown];
      if (!spr) {
        spr = new Sprite(this.art.frame("fx-dart"));
        spr.anchor.set(0.35, 0.5);
        spr.scale.set(0.55);
        this.shots.addChild(spr);
        this.shotSpr[shown] = spr;
      }
      spr.visible = true;
      spr.position.set(shot.x, shot.y);
      spr.rotation = Math.atan2(shot.y - shot.py, shot.x - shot.px);
      shown += 1;
    }
    for (let i = shown; i < this.shotSpr.length; i++) this.shotSpr[i].visible = false;
  }

  private drawBars(sim: Siege): void {
    this.bars.clear();
    for (const e of sim.enemies) {
      if (!e.alive || e.hp >= e.maxHp - 0.2) continue;
      const w = e.boss ? 64 : 32;
      const k = Math.max(0, Math.min(1, e.hp / e.maxHp));
      const y = e.y - (e.boss ? 78 : 46);
      this.bars.roundRect(e.x - w / 2, y, w, 5, 2).fill({ color: 0x140e0c, alpha: 0.85 });
      this.bars.roundRect(e.x - w / 2, y, w * k, 5, 2).fill({ color: k > 0.35 ? 0xc6f27a : 0xff5a3c });
    }
  }

  private drawSun(dt: number, sim: Siege): void {
    const charge = sim.flare / BALANCE.flare.need;
    const spin = (this.reduced ? 0.04 : 0.22) * (1 + charge * 1.2);
    if (dt > 0) {
      this.ring.rotation += dt * spin;
      this.inner.rotation -= dt * spin * 0.72;
    }
    const pulse = this.reduced ? 0 : Math.sin(this.time * (2 + charge * 4)) * 0.03;
    this.glow.scale.set(SUN_SCALE * (2.1 + charge * 1.6 + pulse));
    this.glow.alpha = 0.18 + charge * 0.7;
    this.glow.tint = 0xffc14a;
    this.bloom.scale.set(SUN_SCALE * (1.05 + charge * 0.2));
    this.bloom.alpha = 0.15 + charge * 0.55;
    this.bloom.tint = 0xffe0a0;
    this.disk.scale.set(SUN_SCALE * (1 + charge * 0.04 + pulse));
    this.ring.scale.set(SUN_SCALE);
    this.inner.scale.set(SUN_SCALE);
    const cracks = Math.ceil((1 - sim.integrity / BALANCE.integrity) * 7);
    if (cracks !== this.crackKey) {
      this.crackKey = cracks;
      this.cracks.clear();
      for (let i = 0; i < cracks; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.4;
        this.cracks.moveTo(Math.cos(a) * 18, Math.sin(a) * 18).lineTo(Math.cos(a + 0.35) * 70, Math.sin(a + 0.15) * 60).stroke({ width: 3, color: 0x2a100c, alpha: 0.9 });
      }
    }
    let beams = 0;
    for (const tower of sim.towers) {
      if (tower.kind !== "lens" || tower.targetId === 0) continue;
      const target = sim.enemies.find((e) => e.id === tower.targetId && e.alive);
      if (!target) continue;
      const x1 = tower.x;
      const y1 = tower.y - 104;
      const wobble = this.reduced ? 0 : Math.sin(this.time * 22 + tower.id) * 3;
      const x2 = target.x + Math.cos(target.angle + Math.PI / 2) * wobble;
      const y2 = target.y - 20 + Math.sin(target.angle + Math.PI / 2) * wobble;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      let beam = this.beamSpr[beams];
      if (!beam) {
        beam = new Sprite(this.art.frame("fx-beam"));
        beam.anchor.set(0, 0.5);
        beam.blendMode = "add";
        beam.eventMode = "none";
        this.fxLayer.addChild(beam);
        this.beamSpr[beams] = beam;
      }
      beam.visible = true;
      beam.position.set(x1, y1);
      beam.rotation = Math.atan2(dy, dx);
      beam.scale.set(len / 512, 0.55);
      beam.alpha = 0.9;
      beam.tint = 0xffc14a;
      beams += 1;
    }
    for (let i = beams; i < this.beamSpr.length; i++) this.beamSpr[i].visible = false;
  }

  private animStep(dt: number): number {
    if (this.held) return 0;
    return dt > 0 ? dt : 0.016;
  }

  private drawFx(dt: number): void {
    const step = this.animStep(dt);
    let rings = 0;
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.life -= step;
      if (ring.life <= 0) {
        this.rings.splice(i, 1);
        continue;
      }
      const k = 1 - ring.life / ring.max;
      let spr = this.ringSpr[rings];
      if (!spr) {
        spr = new Sprite(this.art.frame("fx-stun"));
        spr.anchor.set(0.5);
        spr.blendMode = "add";
        spr.eventMode = "none";
        this.fxLayer.addChild(spr);
        this.ringSpr[rings] = spr;
      }
      const size = 8 + ring.radius * k;
      spr.visible = true;
      spr.position.set(ring.x, ring.y);
      spr.scale.set(size / 128);
      spr.alpha = ring.life / ring.max;
      spr.tint = ring.color;
      rings += 1;
    }
    for (let i = rings; i < this.ringSpr.length; i++) this.ringSpr[i].visible = false;

    let bolts = 0;
    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const arc = this.arcs[i];
      arc.life -= step;
      if (arc.life <= 0) {
        this.arcs.splice(i, 1);
        continue;
      }
      for (let p = 1; p < arc.pts.length; p++) {
        const a = arc.pts[p - 1];
        const b = arc.pts[p];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        let bolt = this.boltSpr[bolts];
        if (!bolt) {
          bolt = new Sprite(this.art.frame("fx-lightning"));
          bolt.anchor.set(0, 0.5);
          bolt.blendMode = "add";
          bolt.eventMode = "none";
          this.fxLayer.addChild(bolt);
          this.boltSpr[bolts] = bolt;
        }
        bolt.visible = true;
        bolt.position.set(a.x, a.y - 16);
        bolt.rotation = Math.atan2(dy, dx);
        bolt.scale.set(len / 512, 0.45);
        bolt.alpha = arc.life / 0.28;
        bolt.tint = 0xb8ffd0;
        bolts += 1;
      }
    }
    for (let i = bolts; i < this.boltSpr.length; i++) this.boltSpr[i].visible = false;

    for (let i = this.booms.length - 1; i >= 0; i--) {
      const boom = this.booms[i];
      boom.life -= step;
      const k = Math.max(0, boom.life / boom.max);
      boom.s.alpha = k;
      boom.s.scale.set((1.15 - k) * (boom.max > 0.4 ? 1.3 : 0.7));
      if (boom.life <= 0) {
        boom.s.visible = false;
        this.boomPool.push(boom);
        this.booms.splice(i, 1);
      }
    }

    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      g.life -= step;
      const k = Math.max(0, g.life / 0.4);
      g.s.alpha = k;
      g.s.y -= step * 18;
      g.shadow.alpha = k * 0.4;
      if (g.life <= 0) {
        g.s.removeFromParent();
        g.shadow.removeFromParent();
        g.s.scale.set(1);
        g.s.rotation = 0;
        this.spritePool.push(g.s);
        this.shadowPool.push(g.shadow);
        this.ghosts.splice(i, 1);
      }
    }
  }

  private drawBits(dt: number): void {
    if (dt > 0 && !this.reduced && this.bits.length < 40 && Math.random() < dt * 4) {
      const leaf = this.biome !== "crater" && Math.random() > 0.4;
      this.bit(Math.random() * MAP_W, -10, leaf ? 0x8fbf62 : 0xd6ffb0, (Math.random() - 0.5) * 14, 16 + Math.random() * 18, 5, 0, leaf ? "mote" : "mote");
    }
    const step = this.animStep(dt);
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const b = this.bits[i];
      b.life -= step;
      if (b.life <= 0 || b.s.y > MAP_H + 20) {
        b.s.visible = false;
        this.bitPool.push(b);
        this.bits.splice(i, 1);
        continue;
      }
      if (dt > 0) {
        b.vy += b.gravity * dt;
        b.s.x += b.vx * dt;
        b.s.y += b.vy * dt;
        b.s.rotation += b.spin * dt;
      }
      b.s.alpha = Math.max(0, b.life / b.max);
      if (b.shrink) b.s.scale.set((b.life / b.max) * b.shrink);
    }
  }

  private drawFloats(dt: number): void {
    const step = this.animStep(dt);
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.life -= step;
      f.t.y += f.vy * step;
      f.t.alpha = Math.max(0, f.life / 0.85);
      if (f.life <= 0) {
        f.t.visible = false;
        this.floatPool.push(f);
        this.floats.splice(i, 1);
      }
    }
  }

  private boom(x: number, y: number, scale: number): void {
    const pooled = this.boomPool.pop();
    const s = pooled?.s ?? new Sprite(this.art.frame("fx-boom"));
    s.anchor.set(0.5);
    s.position.set(x, y);
    s.visible = true;
    s.alpha = 1;
    s.scale.set(scale * 0.35);
    s.blendMode = "normal";
    s.tint = 0xffffff;
    if (!s.parent) this.fxLayer.addChild(s);
    const row = pooled ?? { s, life: 0.35, max: 0.35 };
    row.life = scale > 1 ? 0.5 : 0.32;
    row.max = row.life;
    this.booms.push(row);
  }

  private burst(x: number, y: number, color: number, count: number, speed: number): void {
    const n = this.reduced ? Math.min(4, count) : count;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      this.bit(x, y, color, Math.cos(a) * v, Math.sin(a) * v, 0.25 + Math.random() * 0.25, 0.55, "spark");
    }
  }

  private bit(x: number, y: number, color: number, vx: number, vy: number, life: number, shrink: number, frame: string): void {
    if (this.bits.length > 180) return;
    const pooled = this.bitPool.pop();
    const s = pooled?.s ?? new Sprite();
    s.texture = frame === "spark" ? this.art.frame("fx-orb") : this.art.frame("fx-orb");
    s.anchor.set(0.5);
    s.position.set(x, y);
    s.tint = color;
    s.visible = true;
    s.alpha = 1;
    s.blendMode = "add";
    s.scale.set(frame === "spark" ? 0.12 : 0.16);
    s.rotation = Math.random() * 6;
    if (!s.parent) this.bitsLayer.addChild(s);
    const row = pooled ?? { s, vx, vy, life, max: life, spin: 0, gravity: 0, shrink };
    row.vx = vx;
    row.vy = vy;
    row.life = life;
    row.max = life;
    row.spin = (Math.random() - 0.5) * 4;
    row.gravity = frame === "spark" ? 0 : 8;
    row.shrink = shrink;
    this.bits.push(row);
  }

  private floatText(x: number, y: number, text: string, color: number, size = 16): void {
    const pooled = this.floatPool.pop();
    const t = pooled?.t ?? new Text({ text, style: { fontFamily: SANS, fontSize: size, fill: color, fontWeight: "bold", dropShadow: shadow() } });
    t.text = text;
    t.style.fontSize = size;
    t.style.fill = color;
    t.anchor.set(0.5);
    t.position.set(x, y);
    t.visible = true;
    t.alpha = 1;
    if (!t.parent) this.floatLayer.addChild(t);
    const row = pooled ?? { t, life: 0.85, vy: -34 };
    row.life = 0.85;
    row.vy = -34;
    this.floats.push(row);
  }

  private takeSprite(): Sprite {
    const s = this.spritePool.pop() ?? new Sprite();
    s.visible = true;
    s.alpha = 1;
    s.tint = 0xffffff;
    s.scale.set(1);
    s.rotation = 0;
    s.blendMode = "normal";
    return s;
  }

  private takeShadow(): Sprite {
    const s = this.shadowPool.pop() ?? new Sprite(this.art.shadow);
    s.texture = this.art.shadow;
    s.anchor.set(0.5, 0.5);
    s.visible = true;
    s.alpha = 0.5;
    s.tint = 0x000000;
    s.scale.set(0.8);
    s.rotation = 0;
    return s;
  }
}

function towerCostLabel(kind: TowerKind): number {
  return kind === "dart" ? BALANCE.dart[0].cost : kind === "lens" ? BALANCE.lens[0].cost : kind === "drum" ? BALANCE.drum[0].cost : BALANCE.spire[0].cost;
}

function shadow(): { alpha: number; angle: number; blur: number; color: number; distance: number } {
  return { alpha: 0.8, angle: Math.PI / 2, blur: 3, color: 0x140c06, distance: 1 };
}
