/**
 * The valley: map, totems, raiders, the Sunstone, and pooled effects.
 * Combat decisions stay in sim.ts. Screens stay in hud.ts.
 */
import { Container, Graphics, Sprite, Text, TilingSprite, type Texture } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, towerRange } from "./balance";
import { MAP_H, MAP_W, SUN } from "./maps";
import { stealthed, type Fx, type Siege } from "./sim";
import { TOWER_KINDS, type TowerKind, type Vec } from "./types";

const SANS = 'Inter, "Segoe UI", system-ui, sans-serif';

interface Ghost { s: Sprite; life: number }
interface Bit { s: Sprite; vx: number; vy: number; life: number; max: number; spin: number; gravity: number; shrink: number }
interface Floater { t: Text; life: number; vy: number }
interface Ring { x: number; y: number; radius: number; life: number; max: number; color: number }
interface Arc { pts: Vec[]; life: number }

export const RANGE_COLOR: Record<TowerKind, number> = {
  dart: 0xf0d7a2,
  lens: 0xffb03a,
  drum: 0x7dffe0,
  spire: 0x5dffb0,
};

export class WorldView {
  readonly world = new Container();
  readonly overlay = new Container();
  readonly menu = new Container();
  shakeX = 0;
  shakeY = 0;
  menuPad = -1;
  private readonly art: ArtSet;
  private readonly mapSprite = new Sprite();
  private readonly canopy: TilingSprite;
  private readonly vignette: Sprite;
  private readonly grade = new Graphics();
  private readonly range = new Graphics();
  private readonly towers = new Container();
  private readonly enemies = new Container();
  private readonly shots = new Container();
  private readonly bars = new Graphics();
  private readonly additive = new Graphics();
  private readonly bitsLayer = new Container();
  private readonly floatLayer = new Container();
  private readonly sun = new Container();
  private readonly glow: Sprite;
  private readonly ring: Sprite;
  private readonly disk: Sprite;
  private readonly cracks = new Graphics();
  private readonly flashRect = new Graphics();
  private readonly towerSpr = new Map<number, Sprite>();
  private readonly enemySpr = new Map<number, Sprite>();
  private readonly shotSpr: Sprite[] = [];
  private readonly spritePool: Sprite[] = [];
  private readonly ghosts: Ghost[] = [];
  private readonly bits: Bit[] = [];
  private readonly bitPool: Bit[] = [];
  private readonly floats: Floater[] = [];
  private readonly floatPool: Floater[] = [];
  private readonly rings: Ring[] = [];
  private readonly arcs: Arc[] = [];
  private readonly padSpr: Sprite[] = [];
  private readonly menuButtons: Container[] = [];
  private readonly menuCosts: Text[] = [];
  private rangeKey = "";
  private crackKey = -1;
  private trauma = 0;
  private flash = 0;
  private time = 0;
  private reduced = false;
  private biome: "valley" | "ruins" | "crater" = "valley";
  private onPlace: ((kind: TowerKind) => void) | null = null;
  private mapTex: Texture | null = null;

  constructor(art: ArtSet) {
    this.art = art;
    this.mapSprite.eventMode = "none";
    this.world.addChild(this.mapSprite, this.range, this.towers, this.enemies, this.shots);
    this.sun.position.set(SUN.x, SUN.y);
    this.glow = new Sprite(art.frame("glow"));
    this.glow.anchor.set(0.5);
    this.glow.blendMode = "add";
    this.ring = new Sprite(art.frame("sun-ring"));
    this.ring.anchor.set(0.5);
    this.disk = new Sprite(art.frame("sun-disk"));
    this.disk.anchor.set(0.5);
    this.disk.scale.set(0.72);
    this.sun.addChild(this.glow, this.ring, this.disk, this.cracks);
    this.additive.blendMode = "add";
    this.enemies.sortableChildren = true;
    this.towers.sortableChildren = true;
    this.world.addChild(this.sun, this.bars, this.additive, this.bitsLayer, this.floatLayer, this.menu);
    this.canopy = new TilingSprite({ texture: art.canopy, width: 10, height: 10 });
    this.canopy.alpha = 0.5;
    this.canopy.eventMode = "none";
    this.vignette = new Sprite(art.vignette);
    this.vignette.eventMode = "none";
    this.grade.eventMode = "none";
    this.flashRect.eventMode = "none";
    this.flashRect.blendMode = "add";
    this.overlay.eventMode = "none";
    this.overlay.addChild(this.canopy, this.grade, this.vignette, this.flashRect);
    this.buildMenu();
  }

  setMap(texture: Texture, biome: "valley" | "ruins" | "crater", pads: readonly Vec[]): void {
    if (this.mapTex && this.mapTex !== texture) this.mapTex.destroy(true);
    this.mapTex = texture;
    this.mapSprite.texture = texture;
    this.mapSprite.width = MAP_W;
    this.mapSprite.height = MAP_H;
    this.biome = biome;
    for (const s of this.padSpr) s.destroy();
    this.padSpr.length = 0;
    for (const pad of pads) {
      const s = new Sprite(this.art.frame("pad"));
      s.anchor.set(0.5);
      s.position.set(pad.x, pad.y);
      s.eventMode = "none";
      this.padSpr.push(s);
      this.world.addChildAt(s, 1);
    }
    this.crackKey = -1;
  }

  layout(w: number, h: number): void {
    this.canopy.width = w;
    this.canopy.height = h;
    this.vignette.width = w;
    this.vignette.height = h;
    this.grade.clear();
    if (this.biome === "ruins") this.grade.rect(0, 0, w, h).fill({ color: 0xffc080, alpha: 0.08 });
    if (this.biome === "crater") this.grade.rect(0, 0, w, h).fill({ color: 0x140820, alpha: 0.2 });
    this.flashRect.clear();
    this.flashRect.rect(0, 0, w, h).fill({ color: 0xffe0a0 });
  }

  setReduced(reduced: boolean): void {
    this.reduced = reduced;
  }

  parallax(camX: number, camY: number): void {
    this.canopy.tilePosition.set(-camX * 0.22, -camY * 0.22);
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
      if (x >= b.x && y >= b.y && x <= b.x + b.width && y <= b.y + b.height) return true;
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

  update(dt: number, sim: Siege): void {
    const step = dt > 0 ? dt : 0;
    this.time += step > 0 ? step : 0.016;
    this.syncTowers(sim);
    this.syncEnemies(sim);
    this.syncShots(sim);
    this.drawBars(sim);
    this.drawSun(step, sim);
    this.drawFx(step);
    this.drawBits(step);
    this.drawFloats(step > 0 ? step : 0.016);
    this.flash = Math.max(0, this.flash - (step > 0 ? step : 0.016) * (this.reduced ? 2.4 : 1.3));
    this.flashRect.alpha = this.flash;
    if (this.reduced) {
      this.trauma = 0;
      this.shakeX = 0;
      this.shakeY = 0;
    } else {
      this.trauma = Math.max(0, this.trauma - (step > 0 ? step : 0.016) * 1.6);
      this.shakeX = Math.sin(this.time * 46) * this.trauma * 18;
      this.shakeY = Math.cos(this.time * 37) * this.trauma * 12;
    }
    const pulse = this.reduced ? 0.75 : 0.55 + Math.sin(this.time * 3) * 0.22;
    this.padSpr.forEach((s, i) => {
      s.visible = !sim.towers.some((t) => t.pad === i);
      s.alpha = pulse;
    });
  }

  apply(fx: readonly Fx[]): void {
    for (const event of fx) {
      if (event.kind === "impact") this.burst(event.x, event.y, 0xfff0c2, 5, 90);
      else if (event.kind === "death") this.burst(event.x, event.y, event.enemy === "boss" ? 0xffb03a : 0xff6a4a, event.enemy === "boss" ? 16 : 8, 140);
      else if (event.kind === "jade" && event.text) this.floatText(event.x, event.y, event.text, 0xc8ffd8);
      else if (event.kind === "drum" && event.n) this.rings.push({ x: event.x, y: event.y, radius: event.n, life: 0.42, max: 0.42, color: 0x9dffd8 });
      else if (event.kind === "slam" && event.n) {
        this.rings.push({ x: event.x, y: event.y, radius: event.n, life: 0.36, max: 0.36, color: 0xff7a4a });
        this.bump(0.35);
      } else if (event.kind === "chain" && event.pts) this.arcs.push({ pts: event.pts, life: 0.28 });
      else if (event.kind === "crack") {
        this.bump(0.3);
        this.flash = Math.max(this.flash, this.reduced ? 0.1 : 0.2);
      } else if (event.kind === "flare") {
        this.rings.push({ x: SUN.x, y: SUN.y, radius: 760, life: 0.55, max: 0.55, color: 0xffe0a0 });
        this.flash = Math.max(this.flash, this.reduced ? 0.25 : 0.7);
        this.bump(0.75);
        this.burst(SUN.x, SUN.y, 0xffe6b0, this.reduced ? 6 : 26, 280);
      } else if (event.kind === "place") this.burst(event.x, event.y, 0xf0d7a2, 6, 70);
    }
  }

  private bump(amount: number): void {
    if (!this.reduced) this.trauma = Math.min(1, this.trauma + amount);
  }

  private buildMenu(): void {
    this.menu.visible = false;
    this.menu.eventMode = "passive";
    TOWER_KINDS.forEach((kind, i) => {
      const angle = -Math.PI / 2 + (i / TOWER_KINDS.length) * Math.PI * 2;
      const button = new Container();
      button.position.set(Math.cos(angle) * 92, Math.sin(angle) * 92);
      const plate = new Graphics().circle(0, 0, 30).fill({ color: 0x241c14, alpha: 0.94 }).stroke({ width: 2, color: 0xf0d7a2 });
      const icon = new Sprite(this.art.frame(`tower-${kind}-0`));
      icon.anchor.set(0.5);
      icon.scale.set(0.46);
      const cost = new Text({ text: "0", style: { fontFamily: SANS, fontSize: 14, fill: 0xf6e7c1, fontWeight: "bold" } });
      cost.anchor.set(0.5);
      cost.position.set(0, 36);
      button.addChild(plate, icon, cost);
      button.eventMode = "static";
      button.cursor = "pointer";
      button.on("pointerover", () => {
        this.showRange(this.menu.position.x, this.menu.position.y, towerRange(kind, 0), RANGE_COLOR[kind]);
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
      if (!spr) {
        spr = this.takeSprite();
        spr.anchor.set(0.5, 0.62);
        this.towers.addChild(spr);
        this.towerSpr.set(tower.id, spr);
      }
      spr.texture = this.art.frame(`tower-${tower.kind}-${tower.tier}`);
      spr.position.set(tower.x, tower.y);
      const idle = tower.kind === "drum" || tower.kind === "spire";
      spr.rotation = idle ? Math.sin(this.time * 1.5 + tower.id) * 0.05 : tower.angle + Math.PI / 2;
      spr.zIndex = tower.y;
      spr.tint = tower.stunnedUntil > sim.time ? 0x8aa0b0 : 0xffffff;
    }
    for (const [id, spr] of this.towerSpr) {
      if (seen.has(id)) continue;
      this.towerSpr.delete(id);
      spr.removeFromParent();
      this.spritePool.push(spr);
    }
  }

  private syncEnemies(sim: Siege): void {
    const seen = new Set<number>();
    for (const e of sim.enemies) {
      if (!e.alive) continue;
      seen.add(e.id);
      let spr = this.enemySpr.get(e.id);
      if (!spr) {
        spr = this.takeSprite();
        spr.anchor.set(0.5);
        this.enemies.addChild(spr);
        this.enemySpr.set(e.id, spr);
      }
      const frames = e.kind === "shard" ? 2 : 4;
      const frame = Math.floor(this.time * (e.flying ? 8 : 6) + e.id) % frames;
      spr.texture = this.art.frame(`enemy-${e.kind}-${frame}`);
      const bob = e.flying ? Math.sin(this.time * 7 + e.id) * 7 : 0;
      const side = e.kind === "shard" ? ((e.id % 2) * 2 - 1) * 10 : 0;
      spr.position.set(e.x + Math.cos(e.angle + Math.PI / 2) * side, e.y + bob);
      spr.rotation = e.angle;
      spr.zIndex = e.y;
      spr.scale.set(e.kind === "boss" ? 1.15 : e.kind === "golem" ? 1.05 : 1);
      spr.alpha = stealthed(e.kind, e.age) ? 0.22 : 1;
      spr.tint = e.flash > 0 ? 0xffe4dc : 0xffffff;
    }
    for (const [id, spr] of this.enemySpr) {
      if (seen.has(id)) continue;
      this.enemySpr.delete(id);
      this.ghosts.push({ s: spr, life: 0.32 });
    }
  }

  private syncShots(sim: Siege): void {
    sim.shots.forEach((shot, i) => {
      let spr = this.shotSpr[i];
      if (!shot.alive) {
        if (spr) spr.visible = false;
        return;
      }
      if (!spr) {
        spr = new Sprite(this.art.frame("dart"));
        spr.anchor.set(0.5);
        this.shots.addChild(spr);
        this.shotSpr[i] = spr;
      }
      spr.visible = true;
      spr.position.set(shot.x, shot.y);
      spr.rotation = Math.atan2(shot.y - shot.py, shot.x - shot.px);
      if (!this.reduced && (i + Math.floor(this.time * 60)) % 2 === 0) this.bit(shot.x, shot.y, 0xffe0a0, 0, 0, 0.14, 0, "spark");
    });
  }

  private drawBars(sim: Siege): void {
    this.bars.clear();
    for (const e of sim.enemies) {
      if (!e.alive || e.hp >= e.maxHp - 0.2) continue;
      const w = e.boss ? 54 : 28;
      const k = Math.max(0, Math.min(1, e.hp / e.maxHp));
      const y = e.y - (e.boss ? 52 : 30);
      this.bars.rect(e.x - w / 2, y, w, 4).fill({ color: 0x140e0c, alpha: 0.85 });
      this.bars.rect(e.x - w / 2, y, w * k, 4).fill({ color: k > 0.35 ? 0xb6ff8a : 0xff5a3c });
    }
  }

  private drawSun(dt: number, sim: Siege): void {
    const charge = sim.flare / BALANCE.flare.need;
    const spin = (this.reduced ? 0.06 : 0.3) * (1 + charge);
    if (dt > 0) {
      this.ring.rotation += dt * spin;
      this.disk.rotation -= dt * spin * 0.55;
    }
    const pulse = this.reduced ? 0 : Math.sin(this.time * (2 + charge * 5)) * 0.045;
    this.glow.alpha = 0.2 + charge * 0.8;
    this.glow.scale.set(1.2 + charge * 1.05 + pulse);
    this.disk.tint = charge > 0.98 ? 0xfff6d0 : 0xffd18a;
    this.additive.clear();
    const cracks = Math.ceil((1 - sim.integrity / BALANCE.integrity) * 7);
    if (cracks !== this.crackKey) {
      this.crackKey = cracks;
      this.cracks.clear();
      for (let i = 0; i < cracks; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.4;
        this.cracks.moveTo(Math.cos(a) * 12, Math.sin(a) * 12).lineTo(Math.cos(a + 0.35) * 50, Math.sin(a + 0.15) * 44).stroke({ width: 2, color: 0x4a1810, alpha: 0.95 });
      }
    }
    for (const tower of sim.towers) {
      if (tower.kind !== "lens" || tower.targetId === 0) continue;
      const target = sim.enemies.find((e) => e.id === tower.targetId && e.alive);
      if (!target) continue;
      const wobble = this.reduced ? 0 : Math.sin(this.time * 22 + tower.id) * 2.5;
      const x2 = target.x + Math.cos(target.angle + Math.PI / 2) * wobble;
      const y2 = target.y + Math.sin(target.angle + Math.PI / 2) * wobble;
      this.additive.moveTo(tower.x, tower.y - 22).lineTo(x2, y2).stroke({ width: 11, color: 0xffb050, alpha: 0.35 });
      this.additive.moveTo(tower.x, tower.y - 22).lineTo(x2, y2).stroke({ width: 3, color: 0xfff6d2, alpha: 0.95 });
    }
  }

  private drawFx(dt: number): void {
    const step = dt > 0 ? dt : 0.016;
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.life -= step;
      if (ring.life <= 0) {
        this.rings.splice(i, 1);
        continue;
      }
      const k = 1 - ring.life / ring.max;
      this.additive.circle(ring.x, ring.y, 8 + ring.radius * k).stroke({ width: 4, color: ring.color, alpha: ring.life / ring.max });
    }
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
        this.additive.moveTo(a.x, a.y).lineTo(b.x, b.y).stroke({ width: 4, color: 0xb8ffd2, alpha: arc.life / 0.28 });
      }
    }
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      g.life -= step;
      g.s.alpha = Math.max(0, g.life / 0.32);
      if (g.life <= 0) {
        g.s.removeFromParent();
        g.s.scale.set(1);
        this.spritePool.push(g.s);
        this.ghosts.splice(i, 1);
      }
    }
  }

  private drawBits(dt: number): void {
    if (dt > 0 && !this.reduced && this.bits.length < 70 && Math.random() < dt * 7) {
      const leaf = this.biome !== "crater" ? Math.random() > 0.35 : Math.random() > 0.7;
      this.bit(Math.random() * MAP_W, Math.random() * MAP_H, leaf ? 0x6aaa58 : 0xd6ffb0, (Math.random() - 0.5) * 16, 12 + Math.random() * 18, 4 + Math.random() * 3, 0, leaf ? "leaf" : "mote");
    }
    const step = dt > 0 ? dt : 0.016;
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const b = this.bits[i];
      b.life -= step;
      if (b.life <= 0) {
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

  private drawFloats(step: number): void {
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

  private burst(x: number, y: number, color: number, count: number, speed: number): void {
    const n = this.reduced ? Math.min(4, count) : count;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      this.bit(x, y, color, Math.cos(a) * v, Math.sin(a) * v, 0.25 + Math.random() * 0.25, 0.7, "spark");
    }
  }

  private bit(x: number, y: number, color: number, vx: number, vy: number, life: number, shrink: number, frame: string): void {
    if (this.bits.length > 260) return;
    const pooled = this.bitPool.pop();
    const s = pooled?.s ?? new Sprite();
    s.texture = this.art.frame(frame);
    s.anchor.set(0.5);
    s.position.set(x, y);
    s.tint = color;
    s.visible = true;
    s.alpha = 1;
    s.blendMode = frame === "leaf" ? "normal" : "add";
    s.scale.set(frame === "leaf" ? 0.85 : 0.5);
    s.rotation = Math.random() * 6;
    if (!s.parent) this.bitsLayer.addChild(s);
    const row = pooled ?? { s, vx, vy, life, max: life, spin: 0, gravity: 0, shrink };
    row.vx = vx;
    row.vy = vy;
    row.life = life;
    row.max = life;
    row.spin = (Math.random() - 0.5) * 6;
    row.gravity = frame === "leaf" ? 14 : 0;
    row.shrink = shrink;
    this.bits.push(row);
  }

  private floatText(x: number, y: number, text: string, color: number): void {
    const pooled = this.floatPool.pop();
    const t = pooled?.t ?? new Text({ text, style: { fontFamily: SANS, fontSize: 16, fill: color, fontWeight: "bold" } });
    t.text = text;
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
    return s;
  }
}

function towerCostLabel(kind: TowerKind): number {
  return kind === "dart" ? BALANCE.dart[0].cost : kind === "lens" ? BALANCE.lens[0].cost : kind === "drum" ? BALANCE.drum[0].cost : BALANCE.spire[0].cost;
}
