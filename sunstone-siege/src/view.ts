/**
 * 2.5D valley. Raiders and totems are pre-rendered sprites, sorted by their
 * feet. Combat decisions stay in sim.ts.
 */
import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import type { ArtSet, Clip } from "./art";
import { BALANCE, TOWER_HUE, TOWER_ICON, sharedScales, towerCost, towerFacts, towerRange, towerReadout } from "./balance";
import { CARRY_CAP, CARRY_SCALE, carrySlots } from "./carry";
import { poseAt } from "./geom";
import type { MapDef } from "./maps";
import { PAY_FLIGHT, type Enemy, type Fx, type Siege, type Shot } from "./sim";
import { TOWER_KINDS, type EnemyKind, type TowerKind, type Vec } from "./types";

const SANS = 'Palatino, "Palatino Linotype", Georgia, serif';
export const RANGE_COLOR = TOWER_HUE;

const PLAY: Record<string, number> = {
  walk: 1.2, run: 1.25, fly: 1.15, idle: 1,
  attack: 1.8, hit: 1.85, block: 1.6, death: 1.7,
  slam: 1.65, roar: 1.7, build: 1.15, sell: 1.25,
};

const ELITE: ReadonlySet<EnemyKind> = new Set(["shield", "golem", "boss"]);
/** Sheets are authored at 2× and were drawn at half size. Use the full frame. */
const ENEMY_DRAW = 1.05;
/** Opaque guardian height lands near 1.5× an opaque Skitter. */
const HERO_DRAW = 0.22;
const TOWER_DRAW = 1.15;
/** Screen-pixel radius of the build cards. The menu is scaled by 1/zoom so this stays constant. */
const MENU_REACH = 220;
/** Clear the Jade vault and the top bar, and the Flare button along the bottom. */
const MENU_TOP = 168;
const MENU_BOTTOM = 96;

function bodyScale(kind: EnemyKind, clipDraw: number): number {
  let scale = clipDraw * ENEMY_DRAW;
  if (kind === "shard") scale *= 0.5;
  else if (ELITE.has(kind)) scale *= 1.1;
  return scale;
}

interface Actor {
  body: Sprite;
  outline: Sprite;
  shadow: Sprite;
  clip: string;
  time: number;
  tier: number;
  cool: number;
}

interface Ghost {
  body: Sprite;
  outline: Sprite;
  shadow: Sprite;
  clip: Clip;
  row: number;
  time: number;
  fodder: boolean;
  draw: number;
  x: number;
  y: number;
}

interface Bit { s: Sprite; vx: number; vy: number; life: number; max: number }
interface Floater { t: Text; life: number; vy: number }
interface Gem { s: Sprite; x: number; y: number; vx: number; vy: number; life: number; n: number }
interface Bucket { x: number; y: number; n: number; age: number }
interface RingFx { s: Sprite; life: number; max: number; grow: number }

function towerAsset(kind: TowerKind, tier: number): string {
  const name = kind === "spire" ? "serpent" : kind;
  return `tower_${name}_t${tier + 1}`;
}

function enemyAsset(kind: EnemyKind): string {
  if (kind === "shield") return "enemy_shieldbearer";
  if (kind === "shard") return "enemy_golem";
  return `enemy_${kind}`;
}

function locomote(kind: EnemyKind): string {
  if (kind === "skitter" || kind === "jaguar") return "run";
  if (kind === "glider") return "fly";
  return "walk";
}

/** Sheet rows are S, SE, E, NE, N, NW, W, SW. Angle 0 points east, and y grows downward. */
function facingRow(angle: number, rows: number): number {
  if (rows <= 1) return 0;
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const i = Math.round(a / (Math.PI / 4)) % 8;
  return [2, 1, 0, 7, 6, 5, 4, 3][i];
}

function frameAt(clip: Clip, row: number, time: number, name: string): { texture: Texture; done: boolean } {
  const speed = PLAY[name] ?? 1.6;
  const count = clip.frames[row]?.length ?? 1;
  const raw = Math.floor(time * clip.fps * speed);
  const done = !clip.loop && raw >= count;
  const index = clip.loop ? raw % count : Math.min(count - 1, Math.max(0, raw));
  return { texture: clip.frames[Math.min(row, clip.frames.length - 1)][index], done };
}

export class WorldView {
  readonly world = new Container();
  readonly overlay = new Container();
  readonly menu = new Container();
  shakeX = 0;
  shakeY = 0;
  menuPad = -1;
  rangeScale = 1;
  shownUnits = 0;
  shownSprites = 0;
  private viewW = 1280;
  private viewH = 720;
  private callout!: Text;
  private calloutLife = 0;
  private camX = 0;
  private camY = 0;
  private zoom = 1;
  private readonly art: ArtSet;
  private readonly mapSprite = new Sprite();
  private readonly ground = new Graphics();
  private readonly pads = new Graphics();
  private readonly range = new Graphics();
  private readonly link = new Graphics();
  private readonly bars = new Graphics();
  private readonly actors = new Container();
  private readonly shadowLayer = new Container();
  private readonly fxLayer = new Container();
  private readonly sun = new Container();
  private readonly glow: Sprite;
  private readonly bloom: Sprite;
  private readonly ring: Sprite;
  private readonly inner: Sprite;
  private readonly disk: Sprite;
  private readonly cracks = new Graphics();
  private readonly flashRect = new Graphics();
  private readonly tag: Text;
  private readonly towers = new Map<number, Actor>();
  private readonly enemies = new Map<number, Actor>();
  private readonly allies = new Map<number, Actor>();
  private readonly beams: Sprite[] = [];
  private readonly ghosts: Ghost[] = [];
  private readonly ghostPool: Ghost[] = [];
  private readonly bits: Bit[] = [];
  private readonly bitPool: Bit[] = [];
  private readonly floats: Floater[] = [];
  private readonly floatPool: Floater[] = [];
  private readonly gems: Gem[] = [];
  private readonly gemPool: Gem[] = [];
  private readonly buckets: Bucket[] = [];
  private readonly rings: RingFx[] = [];
  private readonly menuButtons: Container[] = [];
  private readonly menuCosts: Text[] = [];
  private readonly menuStats: Text[] = [];
  private readonly menuRings: Graphics[] = [];
  private readonly menuSprites: Sprite[] = [];
  private readonly menuBars: Graphics[] = [];
  private readonly menuBadges: Graphics[] = [];
  private readonly menuDps: Text[] = [];
  private readonly menuRange: Text[] = [];
  private readonly menuChips: Text[] = [];
  private readonly placeGhost: Sprite;
  private ghostKind: TowerKind | null = null;
  private menuFit = 1;
  private onCollect: ((n: number) => void) | null = null;
  private gemGoal = { x: 80, y: 40 };
  private selected = 0;
  private armed: TowerKind | null = null;
  private onPlace: ((kind: TowerKind) => void) | null = null;
  private onShort: ((kind: TowerKind, need: number) => void) | null = null;
  private lastJade = 0;
  private fresh = new Map<TowerKind, number>();
  private time = 0;
  private reduced = false;
  private plaza = 160;
  private sunAt = { x: 960, y: 540 };
  private beamCursor = 0;
  private hero: Container | null = null;
  private heroBody: Sprite | null = null;
  private heroLine: Sprite | null = null;
  private heroRing: Graphics | null = null;
  private heroTime = 0;
  private readonly spearBolts: Sprite[] = [];
  private spearUsed = 0;
  private readonly labels = new Container();
  private readonly stationLabels: Text[] = [];
  private readonly stationCosts: Text[] = [];
  private readonly shotBolts: Sprite[] = [];
  private shotUsed = 0;
  private readonly dropSprites: Sprite[] = [];
  private readonly mark = new Graphics();
  private markLife = 0;
  private markX = 0;
  private markY = 0;
  private readonly carrySprites: Sprite[] = [];
  private carryBadge: Text | null = null;
  private carryCount = -1;
  private readonly carryBorn: number[] = [];
  private readonly payGems: { s: Sprite; x: number; y: number; tx: number; ty: number; life: number }[] = [];
  private readonly payPool: Sprite[] = [];
  private needAt = 0;

  constructor(art: ArtSet) {
    this.art = art;
    this.mapSprite.eventMode = "none";
    this.ground.eventMode = "none";
    this.ground.rect(-1200, -1200, 1920 + 2400, 1080 + 2400).fill({ color: 0x2f9a3a });
    this.pads.eventMode = "none";
    this.range.eventMode = "none";
    this.link.eventMode = "none";
    this.bars.eventMode = "none";
    this.shadowLayer.eventMode = "none";
    this.fxLayer.eventMode = "none";
    this.actors.sortableChildren = true;
    this.actors.eventMode = "none";
    this.glow = this.makeSun(art.glow, "add");
    this.bloom = this.makeSun(art.frame("sun-core"), "add");
    this.ring = this.makeSun(art.frame("sun-outer"), "normal");
    this.inner = this.makeSun(art.frame("sun-inner"), "normal");
    this.disk = this.makeSun(art.frame("sun-core"), "normal");
    this.sun.addChild(this.glow, this.bloom, this.ring, this.inner, this.disk, this.cracks);
    this.sun.eventMode = "none";
    this.tag = new Text({
      text: "",
      style: { fontFamily: SANS, fontSize: 28, fill: 0xfff6df, fontWeight: "bold", align: "center", dropShadow: shadowStyle() },
    });
    this.tag.anchor.set(0.5, 1);
    this.tag.eventMode = "none";
    this.labels.eventMode = "none";
    this.mark.eventMode = "none";
    this.world.addChild(this.ground, this.mapSprite, this.pads, this.shadowLayer, this.range, this.actors, this.link, this.bars, this.mark, this.fxLayer, this.labels, this.tag, this.menu);
    this.actors.addChild(this.sun);
    this.flashRect.eventMode = "none";
    this.flashRect.blendMode = "add";
    this.overlay.eventMode = "none";
    this.callout = new Text({
      text: "",
      style: {
        fontFamily: SANS,
        fontSize: 40,
        fill: 0xfff1c2,
        fontWeight: "bold",
        align: "center",
        dropShadow: shadowStyle(),
      },
    });
    this.callout.anchor.set(0.5);
    this.callout.eventMode = "none";
    this.callout.visible = false;
    this.overlay.addChild(this.flashRect, this.callout);
    this.placeGhost = new Sprite(Texture.EMPTY);
    this.placeGhost.anchor.set(0.5, 0.85);
    this.placeGhost.alpha = 0.8;
    this.placeGhost.visible = false;
    this.placeGhost.eventMode = "none";
    this.actors.addChild(this.placeGhost);
    this.buildMenu();
  }

  setMap(texture: Texture, map: MapDef): void {
    const field = map.biome === "crater" ? 0x4d7a38 : map.biome === "ruins" ? 0x3aaa48 : 0x2f9a3a;
    this.ground.clear();
    this.ground.rect(-1200, -1200, 1920 + 2400, 1080 + 2400).fill({ color: field });
    this.mapSprite.texture = texture;
    this.mapSprite.width = 1920;
    this.mapSprite.height = 1080;
    this.plaza = map.plaza;
    this.sunAt = map.sun;
    this.sun.position.set(map.sun.x, map.sun.y);
    this.sun.zIndex = map.sun.y;
    const disk = map.plaza * 1.72;
    const scale = disk / Math.max(1, this.disk.texture.width);
    this.disk.scale.set(scale);
    this.inner.scale.set(scale);
    this.ring.scale.set(scale * 1.04);
    this.bloom.scale.set(scale * 1.15);
    this.glow.scale.set(scale * 1.8);
    for (const g of this.ghosts) this.retireGhost(g);
    this.ghosts.length = 0;
  }

  layout(w: number, h: number): void {
    this.viewW = w;
    this.viewH = h;
    this.callout.position.set(w / 2, w < 760 ? 320 : 248);
    this.flashRect.clear();
    this.flashRect.rect(0, 0, w, h).fill({ color: 0xffe0a0 });
  }

  setReduced(reduced: boolean): void {
    this.reduced = reduced;
  }

  parallax(_camX: number, _camY: number): void {
    /* The painted ground already has its depth. */
  }

  menuScale(zoom: number, camX = 0, camY = 0): void {
    this.zoom = zoom;
    this.camX = camX;
    this.camY = camY;
    const fit = Math.min(
      1,
      (this.viewW - 16) / (MENU_REACH * 2 + 220),
      (this.viewH - MENU_TOP - MENU_BOTTOM) / (MENU_REACH * 2 + 260),
    );
    this.menuFit = Math.max(0.55, fit);
    if (this.menu.visible) this.menu.scale.set(this.menuFit / zoom);
  }

  /** Follow the cursor with a tower ghost. Red when the spot cannot be built on. */
  aimGhost(x: number, y: number, kind: TowerKind | null, ok: boolean): void {
    if (!kind || !this.menu.visible) {
      this.placeGhost.visible = false;
      return;
    }
    if (this.ghostKind !== kind) {
      const clip = this.art.clip(towerAsset(kind, 0), "idle");
      this.placeGhost.texture = clip?.frames[0][0] ?? Texture.EMPTY;
      if (clip) {
        this.placeGhost.anchor.set(clip.anchorX, clip.anchorY);
        this.placeGhost.scale.set(clip.draw * TOWER_DRAW);
      }
      this.ghostKind = kind;
    }
    this.placeGhost.visible = true;
    this.placeGhost.position.set(x, y);
    this.placeGhost.zIndex = y + 1;
    this.placeGhost.tint = ok ? 0xffffff : 0xff5a4a;
    this.placeGhost.alpha = ok ? 0.84 : 0.72;
    this.showRange(x, y, towerRange(kind, 0) * this.rangeScale, ok ? TOWER_HUE[kind] : 0xff5a4a);
  }

  menuAnchors(): { x: number; y: number }[] {
    if (!this.menu.visible) return [];
    return this.menuButtons.map((button) => {
      const p = button.getGlobalPosition();
      return { x: p.x, y: p.y };
    });
  }

  armedKind(): TowerKind | null {
    return this.menu.visible ? this.armed : null;
  }

  setCollect(fn: (n: number) => void): void {
    this.onCollect = fn;
  }

  select(id: number): void {
    this.selected = id;
  }

  setGemGoal(x: number, y: number): void {
    this.gemGoal.x = x;
    this.gemGoal.y = y;
  }

  openMenu(
    pad: number,
    at: Vec,
    zoom: number,
    jade: number,
    onPlace: (kind: TowerKind) => void,
    onShort?: (kind: TowerKind, need: number) => void,
  ): void {
    this.menuPad = pad;
    this.onPlace = onPlace;
    this.onShort = onShort ?? null;
    this.armed = null;
    this.menu.visible = true;
    this.zoom = zoom;
    this.menu.scale.set(this.menuFit / zoom);
    this.placeMenu(at);
    this.refreshMenu(jade);
    this.showRange(at.x, at.y, towerRange("dart", 0) * this.rangeScale, TOWER_HUE.dart);
  }

  refreshMenu(jade: number): void {
    const scales = sharedScales(0);
    let cheapest = Infinity;
    for (const kind of TOWER_KINDS) {
      const cost = towerCost(kind, 0);
      if (jade >= cost) cheapest = Math.min(cheapest, cost);
    }
    TOWER_KINDS.forEach((kind, i) => {
      const cost = towerCost(kind, 0);
      const facts = towerFacts(kind, 0);
      const afford = jade >= cost;
      const lit = afford && cost === cheapest;
      this.menuCosts[i].text = String(cost);
      this.menuCosts[i].style.fill = afford ? 0xfff6df : 0xffd2cc;
      this.menuDps[i].text = facts.dpsText;
      this.menuRange[i].text = String(Math.round(facts.range));
      this.menuStats[i].text = facts.role;
      this.menuChips[i].text = facts.chip;
      this.menuChips[i].style.fill = TOWER_HUE[kind];
      this.menuSprites[i].tint = afford ? 0xffffff : 0x9a9088;
      this.menuSprites[i].alpha = afford ? 1 : 0.55;
      const became = afford && this.lastJade < cost;
      if (became) this.fresh.set(kind, 0.45);
      const bounce = this.fresh.get(kind) ?? 0;
      const pop = bounce > 0 ? 1 + Math.sin((0.45 - bounce) * 18) * 0.06 : 1;
      const glow = lit ? 1.06 : 1;
      this.menuButtons[i].scale.set((this.armed === kind ? 1.06 : 1) * pop * glow);
      const bars = this.menuBars[i];
      bars.clear();
      bars.roundRect(-44, 11, 72, 11, 4).fill({ color: 0x2a2218 });
      bars.roundRect(-44, 11, 72 * Math.max(0.06, Math.min(1, facts.dps / scales.dps)), 11, 4).fill({ color: 0xffe08a });
      bars.roundRect(-44, 41, 72, 11, 4).fill({ color: 0x2a2218 });
      bars.roundRect(-44, 41, 72 * Math.max(0.06, Math.min(1, facts.range / scales.range)), 11, 4).fill({ color: 0x8fd0ff });
      const badge = this.menuBadges[i];
      badge.clear();
      badge.roundRect(-58, 92, 116, 36, 12).fill({ color: afford ? 0x1e6b3a : 0x7a241c });
      badge.roundRect(-58, 92, 116, 36, 12).stroke({ width: 3, color: afford ? 0xc8ffd8 : 0xff8a7a });
      this.menuRings[i].clear();
      if (!afford && cost > 0) {
        const p = Math.max(0, Math.min(1, jade / cost));
        this.menuRings[i].arc(0, -46, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p).stroke({ width: 5, color: TOWER_HUE[kind], alpha: 0.95 });
      }
      if (this.armed === kind || lit) {
        this.menuRings[i].circle(0, -46, 48).stroke({ width: 3, color: lit ? 0xffe08a : 0xfff1c2, alpha: 0.95 });
      }
    });
    this.lastJade = jade;
  }

  private placeMenu(at: Vec): void {
    const fit = this.menuFit;
    const marginX = 110 * fit + 12;
    const marginTop = MENU_TOP + 108 * fit;
    const marginBot = MENU_BOTTOM + 140 * fit;
    const reach = MENU_REACH * fit;
    let shiftX = 0;
    let shiftY = 0;
    for (const [lx, ly] of [[0, -reach], [reach, 0], [0, reach], [-reach, 0]]) {
      const sx = this.camX + at.x * this.zoom + lx;
      const sy = this.camY + at.y * this.zoom + ly;
      if (sx < marginX) shiftX = Math.max(shiftX, marginX - sx);
      if (sx > this.viewW - marginX) shiftX = Math.min(shiftX, this.viewW - marginX - sx);
      if (sy < marginTop) shiftY = Math.max(shiftY, marginTop - sy);
      if (sy > this.viewH - marginBot) shiftY = Math.min(shiftY, this.viewH - marginBot - sy);
    }
    this.menu.position.set(at.x + shiftX / Math.max(0.2, this.zoom), at.y + shiftY / Math.max(0.2, this.zoom));
  }

  closeMenu(): void {
    this.menu.visible = false;
    this.menuPad = -1;
    this.armed = null;
    this.onPlace = null;
    this.onShort = null;
    this.placeGhost.visible = false;
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
    this.range.clear();
    this.range.circle(x, y, radius).fill({ color, alpha: 0.14 });
    this.range.circle(x, y, radius).stroke({ width: 3, color, alpha: 0.9 });
    this.range.visible = true;
  }

  /** A ring where the player tapped. It pulses, then stays until he arrives. */
  showGoal(x: number, y: number): void {
    this.markX = x;
    this.markY = y;
    this.markLife = 0.85;
    this.mark.visible = true;
  }

  hideRange(): void {
    this.range.visible = false;
    this.range.clear();
    this.link.clear();
    this.tag.visible = false;
  }

  update(dt: number, sim: Siege, hold = false): void {
    const step = hold ? 0 : dt;
    this.time += step > 0 ? step : 0.016;
    for (const [kind, left] of this.fresh) {
      const next = left - (step || 0.016);
      if (next <= 0) this.fresh.delete(kind);
      else this.fresh.set(kind, next);
    }
    this.syncTowers(sim, step);
    this.syncEnemies(sim, step);
    this.syncAllies(sim, step);
    this.drawPads(sim);
    this.drawDrops(sim);
    this.drawShots(sim);
    this.drawSelection(sim);
    this.drawBars(sim);
    this.drawSun(step, sim);
    this.drawHero(sim, step);
    this.drawCarry(sim, step);
    this.drawMark(step, sim);
    this.drawSpears(sim);
    this.drawGhosts(step);
    this.drawBits(step);
    this.drawRings(step);
    this.drawGems(step);
    this.drawFloats(step);
    this.drawCallout(step > 0 ? step : 0.016);
    this.flushBuckets();
    const fade = step > 0 ? step : 0.016;
    this.flashRect.alpha = Math.max(0, (this.flashRect.alpha || 0) - fade * (this.reduced ? 2.4 : 1.3));
    this.flashRect.visible = this.flashRect.alpha > 0.02;
    if (this.reduced) {
      this.shakeX = 0;
      this.shakeY = 0;
    } else {
      this.shakeX = Math.sin(this.time * 46) * this.trauma * 8;
      this.shakeY = Math.cos(this.time * 37) * this.trauma * 6;
      this.trauma = Math.max(0, this.trauma - fade * 2.2);
    }
    this.shownUnits = sim.aliveCount;
    this.shownSprites = this.enemies.size + this.towers.size + this.ghosts.length;
  }

  apply(fx: readonly Fx[]): void {
    for (const event of fx) {
      if (event.kind === "impact") {
        const saved = event.n === 1;
        const color = event.color ?? (saved ? 0xffe08a : 0xfff0c2);
        this.burst(event.x, event.y, 0xffffff, saved ? 6 : 4);
        this.burst(event.x, event.y, color, saved ? 10 : 7);
        this.ringFx(event.x, event.y, saved ? 70 : 36, color);
        if (event.text) this.floatText(event.x, event.y - 40, event.text, 0xfff6df, 26);
        if (saved) this.floatText(event.x, event.y - 86, "SAVED!", 0xffe08a, 36);
      } else if (event.kind === "collect" && event.n) this.onCollect?.(event.n);
      else if (event.kind === "pay") this.launchPay(event.x, event.y, event.tx ?? event.x, event.ty ?? event.y);
      else if (event.kind === "num" && event.text) this.popNumber(event.x, event.y, event.text);
      else if (event.kind === "rubble") {
        this.burst(event.x, event.y, 0xffffff, 6);
        this.burst(event.x, event.y, 0xb08968, 8);
      }
      else if (event.kind === "death") this.onDeath(event);
      else if (event.kind === "jade" && event.n) this.onJade(event.x, event.y, event.n);
      else if (event.kind === "multi" && event.text) {
        this.floatText(event.x, event.y - 78, event.text, 0xfff1c2, event.n && event.n >= 10 ? 42 : 32);
        this.bump(event.n && event.n >= 10 ? 0.55 : 0.28);
      } else if (event.kind === "callout" && event.text) {
        this.showCallout(event.text);
      } else if (event.kind === "relic" && event.text) this.floatText(event.x, event.y, event.text, 0xfff1c8, 26);
      else if (event.kind === "drum" && event.n) this.ringFx(event.x, event.y, event.n, 0xb9a0ff);
      else if (event.kind === "slam" && event.n) {
        this.ringFx(event.x, event.y, event.n, 0xff7a4a);
        this.bump(0.45);
      } else if (event.kind === "aegis") this.ringFx(event.x, event.y, 90, 0xc8c0e8);
      else if (event.kind === "rally" && event.n) this.ringFx(event.x, event.y, event.n, 0xff7a3a);
      else if (event.kind === "chain" && event.pts) this.drawChain(event.pts, event.color ?? 0x2ee0d0);
      else if (event.kind === "crack") this.bump(0.12 + Math.min(0.3, event.n ?? 1) * 0.15);
      else if (event.kind === "flare") {
        this.ringFx(this.sunAt.x, this.sunAt.y, 640, 0xffe0a0);
        this.flashRect.alpha = Math.max(this.flashRect.alpha, this.reduced ? 0.2 : 0.55);
        this.bump(0.7);
      } else if (event.kind === "boss") {
        this.ringFx(event.x, event.y, 220, 0xffb03a);
        this.bump(0.4);
      } else if (event.kind === "place") this.burst(event.x, event.y, 0xf0d7a2, 6);
    }
  }

  private trauma = 0;

  private bump(amount: number): void {
    if (!this.reduced) this.trauma = Math.min(1, this.trauma + amount);
  }

  private makeSun(texture: Texture, blend: "add" | "normal"): Sprite {
    const s = new Sprite(texture);
    s.anchor.set(0.5);
    s.blendMode = blend;
    s.eventMode = "none";
    return s;
  }

  private takeSprite(texture: Texture): Sprite {
    const s = new Sprite(texture);
    s.eventMode = "none";
    return s;
  }

  private shadowSprite(): Sprite {
    const s = new Sprite(this.art.shadow);
    s.anchor.set(0.5, 0.5);
    s.alpha = 0.35;
    s.blendMode = "multiply";
    s.tint = 0x1a120c;
    s.eventMode = "none";
    return s;
  }

  private buildMenu(): void {
    this.menu.visible = false;
    this.menu.eventMode = "passive";
    const tiny = { fontFamily: SANS, fontSize: 12, fill: 0xd9cbb0, fontWeight: "bold" as const };
    TOWER_KINDS.forEach((kind, i) => {
      const angle = -Math.PI / 2 + (i / TOWER_KINDS.length) * Math.PI * 2;
      const button = new Container();
      button.position.set(Math.cos(angle) * MENU_REACH, Math.sin(angle) * MENU_REACH);
      const plate = new Graphics();
      plate.roundRect(-102, -108, 204, 248, 20).fill({ color: 0x140e0a, alpha: 0.94 });
      plate.circle(0, -48, 40).stroke({ width: 4, color: TOWER_HUE[kind] });
      const clip = this.art.clip(towerAsset(kind, 0), "idle");
      const icon = new Sprite(clip?.frames[0][0] ?? Texture.EMPTY);
      if (clip) {
        icon.anchor.set(clip.anchorX, clip.anchorY);
        icon.scale.set(clip.draw * 0.36);
      }
      icon.position.set(0, -22);
      const badge = new Text({
        text: TOWER_ICON[kind],
        style: { fontFamily: SANS, fontSize: 18, fill: TOWER_HUE[kind], fontWeight: "bold" },
      });
      badge.anchor.set(0.5);
      badge.position.set(52, -78);
      const name = new Text({
        text: BALANCE.towerName[kind],
        style: { fontFamily: SANS, fontSize: 15, fill: 0xfff6df, fontWeight: "bold", align: "center" },
      });
      name.anchor.set(0.5);
      name.position.set(0, -2);
      const dpsLabel = new Text({ text: "DPS", style: tiny });
      dpsLabel.anchor.set(0, 0.5);
      dpsLabel.position.set(-96, 16);
      const dpsNum = new Text({
        text: "0",
        style: { fontFamily: SANS, fontSize: 13, fill: 0xfff6df, fontWeight: "bold" },
      });
      dpsNum.anchor.set(1, 0.5);
      dpsNum.position.set(96, 16);
      const rangeLabel = new Text({ text: "RANGE", style: tiny });
      rangeLabel.anchor.set(0, 0.5);
      rangeLabel.position.set(-96, 46);
      const rangeNum = new Text({
        text: "0",
        style: { fontFamily: SANS, fontSize: 13, fill: 0xfff6df, fontWeight: "bold" },
      });
      rangeNum.anchor.set(1, 0.5);
      rangeNum.position.set(96, 46);
      const roleLabel = new Text({ text: "ROLE", style: tiny });
      roleLabel.anchor.set(0, 0.5);
      roleLabel.position.set(-96, 76);
      const role = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 14, fill: 0xfff6df, fontWeight: "bold" },
      });
      role.anchor.set(0, 0.5);
      role.position.set(-40, 76);
      const chip = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 13, fill: TOWER_HUE[kind], fontWeight: "bold" },
      });
      chip.anchor.set(1, 0.5);
      chip.position.set(96, 76);
      const bars = new Graphics();
      bars.eventMode = "none";
      const costBadge = new Graphics();
      costBadge.eventMode = "none";
      const cost = new Text({
        text: "0",
        style: { fontFamily: SANS, fontSize: 26, fill: 0xfff6df, fontWeight: "bold" },
      });
      cost.anchor.set(0.5);
      cost.position.set(16, 110);
      const gem = new Sprite(this.art.frame("jade"));
      gem.anchor.set(0.5);
      gem.scale.set(0.32);
      gem.position.set(-30, 110);
      const ring = new Graphics();
      ring.eventMode = "none";
      button.addChild(plate, icon, badge, name, dpsLabel, dpsNum, rangeLabel, rangeNum, roleLabel, role, chip, bars, costBadge, gem, cost, ring);
      button.eventMode = "static";
      button.cursor = "pointer";
      button.on("pointerover", () => {
        this.armed = kind;
        this.showRange(this.menu.position.x, this.menu.position.y, towerRange(kind, 0) * this.rangeScale, TOWER_HUE[kind]);
      });
      button.on("pointertap", (e) => {
        e.stopPropagation();
        const price = towerCost(kind, 0);
        if (this.lastJade < price) {
          this.onShort?.(kind, price - this.lastJade);
          return;
        }
        if (this.armed !== kind) {
          this.armed = kind;
          this.showRange(this.menu.position.x, this.menu.position.y, towerRange(kind, 0) * this.rangeScale, TOWER_HUE[kind]);
          this.refreshMenu(this.lastJade);
          return;
        }
        this.onPlace?.(kind);
      });
      this.menu.addChild(button);
      this.menuButtons.push(button);
      this.menuCosts.push(cost);
      this.menuStats.push(role);
      this.menuRings.push(ring);
      this.menuSprites.push(icon);
      this.menuBars.push(bars);
      this.menuBadges.push(costBadge);
      this.menuDps.push(dpsNum);
      this.menuRange.push(rangeNum);
      this.menuChips.push(chip);
    });
  }

  private actor(clip: Clip): Actor {
    const body = this.takeSprite(clip.frames[0][0]);
    body.anchor.set(clip.anchorX, clip.anchorY);
    const outline = this.takeSprite(clip.frames[0][0]);
    outline.anchor.set(clip.anchorX, clip.anchorY);
    outline.tint = 0x14080c;
    const shadow = this.shadowSprite();
    this.shadowLayer.addChild(shadow);
    this.actors.addChild(outline, body);
    return { body, outline, shadow, clip: "", time: 0, tier: 0, cool: 0 };
  }

  private freeActor(actor: Actor): void {
    actor.body.removeFromParent();
    actor.outline.removeFromParent();
    actor.shadow.removeFromParent();
    actor.body.destroy();
    actor.outline.destroy();
    actor.shadow.destroy();
  }

  private paint(actor: Actor, clip: Clip, row: number, name: string, draw: number): void {
    const posed = frameAt(clip, row, actor.time, name);
    actor.body.texture = posed.texture;
    actor.outline.texture = posed.texture;
    actor.body.anchor.set(clip.anchorX, clip.anchorY);
    actor.outline.anchor.set(clip.anchorX, clip.anchorY);
    actor.body.scale.set(draw);
    const outline = draw * 1.06;
    actor.outline.scale.set(outline);
  }

  private syncTowers(sim: Siege, step: number): void {
    const seen = new Set<number>();
    for (const tower of sim.towers) {
      seen.add(tower.id);
      let actor = this.towers.get(tower.id);
      const asset = towerAsset(tower.kind, tower.tier);
      if (!actor) {
        const clip = this.art.clip(asset, "build") ?? this.art.clip(asset, "idle");
        if (!clip) continue;
        actor = this.actor(clip);
        actor.clip = "build";
        actor.tier = tower.tier;
        this.towers.set(tower.id, actor);
      }
      if (actor.tier !== tower.tier) {
        actor.tier = tower.tier;
        actor.clip = "build";
        actor.time = 0;
      } else if (tower.cooldown > actor.cool + 0.04 && actor.clip !== "build") {
        actor.clip = "attack";
        actor.time = 0;
      }
      actor.cool = tower.cooldown;
      actor.time += step > 0 ? step : 0;
      const current = this.art.clip(asset, actor.clip) ?? this.art.clip(asset, "idle");
      const idle = this.art.clip(asset, "idle");
      if (!current || !idle) continue;
      const posed = frameAt(current, 0, actor.time, actor.clip);
      if (posed.done) {
        actor.clip = "idle";
        actor.time = 0;
      }
      const shown = actor.clip === "idle" ? idle : current;
      const draw = shown.draw * TOWER_DRAW * (1 + tower.tier * 0.2) * (tower.stunnedUntil > sim.time ? 0.98 : 1);
      this.paint(actor, shown, 0, actor.clip, draw);
      const kick = actor.clip === "attack" ? Math.sin(Math.min(1, actor.time / 0.16) * Math.PI) * (8 + tower.tier * 4) : 0;
      actor.body.position.set(tower.x - Math.cos(tower.angle) * kick, tower.y - Math.sin(tower.angle) * kick);
      actor.outline.position.set(actor.body.x, actor.body.y + 2);
      actor.body.zIndex = tower.y;
      actor.outline.zIndex = tower.y - 0.2;
      actor.body.tint = tower.stunnedUntil > sim.time ? 0xb7c4d4 : 0xffffff;
      actor.shadow.position.set(tower.x, tower.y + 6);
      actor.shadow.scale.set(1.45, 0.78);
      if (actor.clip === "attack" && actor.time < 0.09) {
        this.burst(tower.x, tower.y - 70, TOWER_HUE[tower.kind], 3);
        if (tower.tier >= 1) this.burst(tower.x + 18, tower.y - 86, TOWER_HUE[tower.kind], 3);
      }
    }
    for (const [id, actor] of this.towers) {
      if (seen.has(id)) continue;
      this.spawnGhost(actor, "sell", false);
      this.towers.delete(id);
      actor.body.removeFromParent();
      actor.outline.removeFromParent();
      actor.body.destroy();
      actor.outline.destroy();
    }
    this.drawBeams(sim);
  }

  private syncEnemies(sim: Siege, step: number): void {
    const seen = new Set<number>();
    for (const e of sim.enemies) {
      if (!e.alive) continue;
      seen.add(e.id);
      const asset = enemyAsset(e.kind);
      let actor = this.enemies.get(e.id);
      if (!actor) {
        const clip = this.art.clip(asset, locomote(e.kind));
        if (!clip) continue;
        actor = this.actor(clip);
        actor.clip = locomote(e.kind);
        this.enemies.set(e.id, actor);
      }
      const want = this.enemyClip(e, asset);
      if (want !== actor.clip) {
        actor.clip = want;
        actor.time = 0;
      }
      actor.time += step > 0 ? step : 0;
      const clip = this.art.clip(asset, actor.clip) ?? this.art.clip(asset, locomote(e.kind));
      if (!clip) continue;
      const row = facingRow(e.angle, clip.frames.length);
      const draw = bodyScale(e.kind, clip.draw);
      const punch = e.flash > 0 ? 1 + Math.min(0.34, e.flash * 1.6) : 1;
      this.paint(actor, clip, row, actor.clip, draw * punch);
      const hop = e.hop > 0 ? Math.sin((0.16 - e.hop) * 40) * 6 : 0;
      const lift = e.flying ? 18 + Math.sin(this.time * 6 + e.id) * 6 : 0;
      actor.body.position.set(e.x, e.y - lift - hop);
      actor.outline.position.set(e.x, e.y - lift - hop + 2);
      actor.body.zIndex = e.y;
      actor.outline.zIndex = e.y - 0.2;
      actor.body.blendMode = e.flash > 0 ? "add" : "normal";
      actor.body.tint = e.flash > 0 ? 0xffffff : 0xff5a62;
      actor.outline.scale.set(draw * punch * 1.22);
      actor.outline.tint = e.flash > 0 ? 0xffffff : 0x0c0608;
      actor.body.alpha = stealthedFade(e);
      actor.outline.alpha = 1;
      actor.shadow.position.set(e.x, e.y + (e.flying ? 14 : 6));
      const shadow = e.kind === "boss" ? 2.2 : e.kind === "golem" ? 1.7 : e.kind === "skitter" ? 0.85 : 1.15;
      actor.shadow.scale.set(shadow, e.flying ? 0.42 : 0.58);
      actor.shadow.tint = ELITE.has(e.kind) ? 0x6a5420 : 0x1a120c;
      actor.shadow.alpha = ELITE.has(e.kind) ? 0.55 : 0.35;
    }
    for (const [id, actor] of this.enemies) {
      if (seen.has(id)) continue;
      this.enemies.delete(id);
      this.freeActor(actor);
    }
  }

  private enemyClip(e: Enemy, asset: string): string {
    if (e.emote > 0 && this.art.clip(asset, "roar")) return "roar";
    if (e.react === "block" && this.art.clip(asset, "block")) return "block";
    if (e.react === "hit" && this.art.clip(asset, "hit")) return "hit";
    if (e.striking) {
      if (e.kind === "boss" && this.art.clip(asset, "slam")) return "slam";
      return "attack";
    }
    return locomote(e.kind);
  }

  private syncAllies(sim: Siege, step: number): void {
    const seen = new Set<number>();
    const clip = this.art.clip("enemy_runner", "walk");
    if (!clip) return;
    for (const ally of sim.allies) {
      if (!ally.alive) continue;
      seen.add(ally.id);
      let actor = this.allies.get(ally.id);
      if (!actor) {
        actor = this.actor(clip);
        actor.clip = "walk";
        this.allies.set(ally.id, actor);
      }
      actor.time += step > 0 ? step : 0;
      const row = facingRow(ally.angle, clip.frames.length);
      this.paint(actor, clip, row, "walk", clip.draw * 0.95);
      actor.body.position.set(ally.x, ally.y);
      actor.outline.position.set(ally.x, ally.y + 2);
      actor.body.zIndex = ally.y;
      actor.outline.zIndex = ally.y - 0.2;
      actor.body.tint = 0x8ec4ff;
      actor.outline.tint = 0x14203a;
      actor.shadow.position.set(ally.x, ally.y + 6);
      actor.shadow.scale.set(0.7, 0.4);
    }
    for (const [id, actor] of this.allies) {
      if (seen.has(id)) continue;
      this.allies.delete(id);
      this.freeActor(actor);
    }
  }

  private drawPads(sim: Siege): void {
    this.pads.clear();
    for (const e of sim.enemies) {
      if (!e.alive || e.boulder <= 0) continue;
      const reach = 34 + e.boulder * 0.12;
      const x = e.x + Math.cos(e.angle) * 28;
      const y = e.y + Math.sin(e.angle) * 28;
      this.pads.ellipse(x, y, reach, reach * 0.72).fill({ color: 0xd8c4a4, alpha: 0.95 });
      this.pads.ellipse(x, y, reach, reach * 0.72).stroke({ width: 4, color: 0x6b5344, alpha: 1 });
    }
    for (const puddle of sim.puddles) {
      if (puddle.life <= 0) continue;
      const fade = Math.max(0, puddle.life / puddle.max);
      const color = puddle.kind === "drum" ? TOWER_HUE.drum : TOWER_HUE.spire;
      this.pads.circle(puddle.x, puddle.y, puddle.radius).fill({ color, alpha: 0.22 * fade });
      this.pads.circle(puddle.x, puddle.y, puddle.radius).stroke({ width: 4, color, alpha: 0.85 * fade });
    }
    const hero = sim.heroAt();
    let near = -1;
    let nearD: number = BALANCE.fund.preview;
    sim.stations.forEach((station, i) => {
      const d = Math.hypot(station.x - hero.x, station.y - hero.y);
      if (d < nearD && station.tier < 3) {
        nearD = d;
        near = i;
      }
    });
    sim.stations.forEach((station, i) => {
      const color = station.kind === "wall" ? 0xc46a3a : station.kind === "barracks" ? 0x3d7dff : TOWER_HUE[station.kind];
      const hot = i === near;
      if (station.kind === "wall") this.drawWall(sim, station.index - sim.pads.length, station.tier, station.alive, station.hp, station.maxHp);
      else this.dashSquare(station.x, station.y, hot ? 92 : 84, color);
      const next = station.tier < 3 ? sim.stationCost(station) : 0;
      const remain = next > 0 ? Math.max(0, Math.ceil(next - station.paid)) : 0;
      const broke = sim.funding === i && sim.jade < 1 && remain > 0;
      if (sim.funding === i && next > 0) {
        const u = Math.max(0, Math.min(1, station.paid / next));
        this.pads.circle(station.x, station.y, 46).stroke({ width: 8, color: 0x3a2414, alpha: 0.55 });
        this.pads.arc(station.x, station.y, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * u).stroke({ width: 8, color: 0xffe08a, alpha: 1 });
      }
      if (broke && this.time - this.needAt > 1.05) {
        this.needAt = this.time;
        this.floatText(station.x, station.y - 78, "need more", 0xffd0a0, 18);
      }
      const glyph = station.kind === "wall" ? "▮" : station.kind === "barracks" ? "⚑" : TOWER_ICON[station.kind];
      const icon = this.stationLabel(i);
      icon.text = glyph;
      icon.style.fontSize = 34;
      icon.style.fill = 0xfff8e8;
      icon.visible = station.kind !== "wall";
      icon.anchor.set(0.5);
      icon.position.set(station.x, station.y);
      icon.zIndex = station.y + 4;
      const cost = this.stationCostLabel(i);
      cost.text = next > 0 ? String(remain) : "MAX";
      cost.style.fontSize = 28;
      cost.style.fill = broke ? 0xffb089 : 0xfff6df;
      cost.visible = true;
      const shake = broke && !this.reduced ? Math.sin(this.time * 48) * 3.5 : 0;
      const pillW = Math.max(72, cost.text.length * 18 + 28);
      const pillY = station.kind === "wall" ? station.y + 18 : station.y + 50;
      this.pads.roundRect(station.x - pillW / 2 + shake, pillY, pillW, 36, 18).fill({ color: 0x140e0a, alpha: 0.94 });
      cost.position.set(station.x + shake, pillY + 3);
      cost.zIndex = station.y + 5;
      if (hot && station.kind !== "wall" && station.kind !== "barracks" && station.tier < 3) {
        const radius = towerRange(station.kind, station.tier) * sim.rangeScale;
        this.pads.circle(station.x, station.y, radius).stroke({ width: 3, color, alpha: 0.7 });
      }
    });
    for (let i = sim.stations.length; i < this.stationLabels.length; i++) this.stationLabels[i].visible = false;
    for (let i = sim.stations.length; i < this.stationCosts.length; i++) this.stationCosts[i].visible = false;
  }

  private stationLabel(i: number): Text {
    let label = this.stationLabels[i];
    if (!label) {
      label = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 34, fill: 0xfff8e8, fontWeight: "bold", align: "center", stroke: { color: 0x140e0a, width: 5 } },
      });
      label.anchor.set(0.5);
      label.eventMode = "none";
      this.labels.addChild(label);
      this.stationLabels[i] = label;
    }
    return label;
  }

  private stationCostLabel(i: number): Text {
    let label = this.stationCosts[i];
    if (!label) {
      label = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 28, fill: 0xfff6df, fontWeight: "bold", align: "center" },
      });
      label.anchor.set(0.5, 0);
      label.eventMode = "none";
      this.labels.addChild(label);
      this.stationCosts[i] = label;
    }
    return label;
  }

  private dashSquare(x: number, y: number, size: number, color: number): void {
    const h = size / 2;
    this.pads.roundRect(x - h, y - h, size, size, 12).fill({ color, alpha: 0.42 });
    const edges: [number, number, number, number][] = [
      [x - h, y - h, x + h, y - h],
      [x + h, y - h, x + h, y + h],
      [x + h, y + h, x - h, y + h],
      [x - h, y + h, x - h, y - h],
    ];
    for (const [x0, y0, x1, y1] of edges) {
      for (let s = 0; s < 3; s++) {
        const a = (s + 0.06) / 3;
        const b = (s + 0.78) / 3;
        this.pads.moveTo(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a);
        this.pads.lineTo(x0 + (x1 - x0) * b, y0 + (y1 - y0) * b);
      }
    }
    this.pads.stroke({ width: 7, color, alpha: 1 });
  }

  private drawWall(sim: Siege, path: number, tier: number, alive: boolean, hp: number, maxHp: number): void {
    const route = sim.map.routes[path];
    if (!route) return;
    const pose = poseAt(route, route.len * 0.46);
    const across = pose.angle + Math.PI / 2;
    const span = 36 + Math.max(0, tier) * 16;
    const dx = Math.cos(across) * span;
    const dy = Math.sin(across) * span;
    const color = alive ? 0xd07a45 : 0x6a5348;
    this.pads.moveTo(pose.x - dx, pose.y - dy).lineTo(pose.x + dx, pose.y + dy).stroke({
      width: alive ? 16 + tier * 4 : 8,
      color,
      alpha: alive ? 0.95 : 0.55,
      cap: "round",
    });
    if (alive && maxHp > 0) {
      const u = Math.max(0, hp / maxHp);
      this.pads.moveTo(pose.x - dx * u, pose.y - dy * u).lineTo(pose.x + dx * u, pose.y + dy * u).stroke({
        width: 6,
        color: 0xffe08a,
        alpha: 0.9,
        cap: "round",
      });
    }
  }

  /** Ring pulse at the tap, held until the hero arrives. */
  private drawMark(step: number, sim: Siege): void {
    const goal = sim.goalAt;
    const dt = step > 0 ? step : 0;
    if (this.markLife > 0) this.markLife = Math.max(0, this.markLife - dt);
    this.mark.clear();
    if (!goal && this.markLife <= 0) {
      this.mark.visible = false;
      return;
    }
    this.mark.visible = true;
    const x = goal?.x ?? this.markX;
    const y = goal?.y ?? this.markY;
    if (goal) {
      this.mark.circle(x, y, 18).stroke({ width: 4, color: 0xffe08a, alpha: 0.95 });
      this.mark.circle(x, y, 5).fill({ color: 0xfff6df, alpha: 0.95 });
    }
    if (this.markLife > 0 && !this.reduced) {
      const u = 1 - this.markLife / 0.85;
      this.mark.circle(x, y, 12 + u * 46).stroke({ width: 4, color: 0xfff1b0, alpha: (1 - u) * 0.95 });
    }
  }

  private launchPay(x: number, y: number, tx: number, ty: number): void {
    const s = this.payPool.pop() ?? this.makePaySprite();
    s.visible = true;
    s.alpha = 1;
    s.scale.set(CARRY_SCALE);
    s.position.set(x, y);
    this.fxLayer.addChild(s);
    this.payGems.push({ s, x, y, tx, ty, life: 0 });
  }

  private makePaySprite(): Sprite {
    const s = new Sprite(this.art.frame("jade"));
    s.anchor.set(0.5);
    s.eventMode = "none";
    return s;
  }

  /** Jade the hero is carrying: a short wide heap, then gems flung at a pad. */
  private drawCarry(sim: Siege, step: number): void {
    const total = Math.max(0, Math.floor(sim.jade + 1e-3));
    const shown = Math.min(CARRY_CAP, total);
    if (this.carryCount < 0) {
      this.carryCount = total;
      for (let i = 0; i < shown; i++) this.carryBorn.push(this.time - 1);
    } else if (total > this.carryCount) {
      const add = total - this.carryCount;
      this.carryCount = total;
      for (let i = 0; i < add; i++) {
        if (this.carryBorn.length < CARRY_CAP) this.carryBorn.push(this.time);
        else this.carryBorn[CARRY_CAP - 1] = this.time;
      }
    } else if (total < this.carryCount) {
      this.carryCount = total;
      while (this.carryBorn.length > shown) this.carryBorn.pop();
    }
    const hero = sim.heroAt();
    const moving = sim.heroMoving;
    const slots = carrySlots(shown);
    while (this.carrySprites.length < shown) {
      const s = new Sprite(this.art.frame("jade"));
      s.anchor.set(0.5);
      s.eventMode = "none";
      this.actors.addChild(s);
      this.carrySprites.push(s);
    }
    const lean = Math.sin(this.time * (moving ? 4.2 : 1.7)) * (moving ? 1.3 : 0.4);
    for (let i = 0; i < this.carrySprites.length; i++) {
      const s = this.carrySprites[i];
      if (i >= shown) {
        s.visible = false;
        continue;
      }
      s.visible = true;
      const slot = slots[i];
      const age = this.time - (this.carryBorn[i] ?? this.time - 1);
      const bounce = age >= 0 && age < 0.16 ? Math.sin((age / 0.16) * Math.PI) * 5 : 0;
      const pop = age >= 0 && age < 0.14 ? 0.78 + Math.sin((age / 0.14) * Math.PI) * 0.32 : 1;
      const wobble = Math.sin(this.time * 2.4 + i * 0.8) * 0.3;
      const sway = lean * (1 + slot.row * 0.06) + wobble;
      s.position.set(hero.x + slot.x + sway, hero.y + slot.y - bounce);
      s.zIndex = hero.y + 40 - slot.row;
      s.scale.set(CARRY_SCALE * pop);
      s.rotation = wobble * 0.04;
    }
    if (total > CARRY_CAP) {
      if (!this.carryBadge) {
        this.carryBadge = new Text({
          text: "",
          style: {
            fontFamily: SANS,
            fontSize: 15,
            fill: 0xf4ffe8,
            fontWeight: "bold",
            stroke: { color: 0x14301c, width: 4 },
          },
        });
        this.carryBadge.anchor.set(0.5, 1);
        this.carryBadge.eventMode = "none";
        this.actors.addChild(this.carryBadge);
      }
      const top = slots[slots.length - 1];
      this.carryBadge.visible = true;
      this.carryBadge.text = `x${total}`;
      this.carryBadge.position.set(hero.x + lean, hero.y + top.y - 11);
      this.carryBadge.zIndex = hero.y + 48;
    } else if (this.carryBadge) this.carryBadge.visible = false;
    const dt = step > 0 ? step : 0.016;
    for (let i = this.payGems.length - 1; i >= 0; i--) {
      const gem = this.payGems[i];
      gem.life += dt;
      const t = Math.min(1, gem.life / PAY_FLIGHT);
      const e = t * t * (3 - 2 * t);
      const swing = Math.sin(t * Math.PI);
      gem.s.position.set(
        gem.x + (gem.tx - gem.x) * e + swing * 72,
        gem.y + (gem.ty - gem.y) * e - swing * 36,
      );
      gem.s.scale.set(CARRY_SCALE * (1 - t * 0.12));
      gem.s.alpha = 1;
      gem.s.zIndex = gem.ty + 6;
      if (t >= 1) {
        gem.s.visible = false;
        this.payPool.push(gem.s);
        this.payGems.splice(i, 1);
      }
    }
  }

  private drawDrops(sim: Siege): void {
    let n = 0;
    for (const gem of sim.drops) {
      if (!gem.alive) continue;
      let sprite = this.dropSprites[n];
      if (!sprite) {
        sprite = new Sprite(this.art.frame("jade"));
        sprite.anchor.set(0.5);
        sprite.eventMode = "none";
        this.fxLayer.addChild(sprite);
        this.dropSprites.push(sprite);
      }
      sprite.visible = true;
      sprite.position.set(gem.x, gem.y);
      const bob = Math.sin(this.time * 6 + gem.id) * 3;
      sprite.y = gem.y + bob;
      sprite.scale.set(0.46);
      sprite.alpha = gem.life < 1.6 ? 0.35 + Math.sin(this.time * 14) * 0.35 : 1;
      n += 1;
    }
    for (let i = n; i < this.dropSprites.length; i++) this.dropSprites[i].visible = false;
  }

  private drawShots(sim: Siege): void {
    this.shotUsed = 0;
    for (const shot of sim.shots) {
      if (!shot.alive) continue;
      const color = shot.family === "hero" ? 0xffe08a : TOWER_HUE[shot.family];
      const fans = shot.family === "dart" ? shot.tier + 1 : 1;
      const dx = shot.x - shot.px;
      const dy = shot.y - shot.py;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      for (let k = 0; k < fans; k++) {
        const off = (k - (fans - 1) / 2) * (12 + shot.tier * 3);
        this.paintBolt(shot, color, nx * off, ny * off, k === Math.floor((fans - 1) / 2));
      }
    }
    for (let i = this.shotUsed; i < this.shotBolts.length; i++) this.shotBolts[i].visible = false;
  }

  private paintBolt(shot: Shot, color: number, ox: number, oy: number, head: boolean): void {
    const tex = shot.family === "spire" ? "fx-orb" : shot.family === "hero" ? "fx-spear" : "fx-dart";
    const bolt = this.takeShot(this.art.frame(tex));
    bolt.position.set(shot.x + ox, shot.y + oy);
    bolt.rotation = Math.atan2(shot.y - shot.py, shot.x - shot.px);
    const fat = shot.family === "spire" ? 0.7 + shot.tier * 0.22 : 0.85 + shot.tier * 0.12;
    bolt.scale.set(head ? fat : fat * 0.72);
    bolt.tint = color;
    bolt.alpha = head ? 1 : 0.55;
    bolt.blendMode = "add";
    const trail = this.takeShot(this.art.frame("fx-dart"));
    const span = 18 + shot.tier * 10;
    trail.position.set(shot.x + ox - ((shot.x - shot.px) / (Math.hypot(shot.x - shot.px, shot.y - shot.py) || 1)) * span, shot.y + oy);
    trail.rotation = bolt.rotation;
    trail.scale.set(0.35 + shot.tier * 0.08, 1.4 + shot.tier * 0.45);
    trail.tint = color;
    trail.alpha = 0.75;
    trail.blendMode = "add";
  }

  private takeShot(tex: Texture): Sprite {
    let bolt = this.shotBolts[this.shotUsed];
    if (!bolt) {
      bolt = new Sprite(tex);
      bolt.anchor.set(0.15, 0.5);
      bolt.eventMode = "none";
      this.fxLayer.addChild(bolt);
      this.shotBolts.push(bolt);
    }
    bolt.texture = tex;
    bolt.visible = true;
    this.shotUsed += 1;
    return bolt;
  }

  private drawSelection(sim: Siege): void {
    this.link.clear();
    const tower = sim.towers.find((t) => t.id === this.selected);
    if (!tower || this.menu.visible) {
      this.tag.visible = false;
      return;
    }
    const read = towerReadout(tower.kind, tower.tier);
    const radius = towerRange(tower.kind, tower.tier) * sim.rangeScale;
    this.showRange(tower.x, tower.y, radius, TOWER_HUE[tower.kind]);
    if (tower.tier < 2) {
      const next = towerRange(tower.kind, tower.tier + 1) * sim.rangeScale;
      this.dashCircle(tower.x, tower.y, next, TOWER_HUE[tower.kind]);
    }
    if (tower.kind === "drum") {
      const pulse = 0.35 + ((this.time % BALANCE.drum[tower.tier].interval) / BALANCE.drum[tower.tier].interval) * 0.65;
      this.link.circle(tower.x, tower.y, radius * pulse).stroke({ width: 3, color: TOWER_HUE.drum, alpha: 0.45 });
      for (const e of sim.enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x - tower.x, e.y - tower.y) <= radius) {
          this.link.circle(e.x, e.y + 8, 10).stroke({ width: 3, color: 0xd8c6ff, alpha: 0.9 });
        }
      }
    }
    const aim = sim.aim(tower);
    if (tower.kind === "dart" && aim.primary) {
      this.link.moveTo(tower.x, tower.y - 40).lineTo(aim.primary.x, aim.primary.y).stroke({ width: 2, color: TOWER_HUE.dart, alpha: 0.7 });
    } else if (tower.kind === "lens" && aim.primary) {
      this.dash(tower.x, tower.y - 50, aim.primary.x, aim.primary.y, TOWER_HUE.lens);
    } else if (tower.kind === "spire" && aim.chain.length) {
      let x = tower.x;
      let y = tower.y - 40;
      for (const e of aim.chain) {
        this.link.moveTo(x, y).lineTo(e.x, e.y).stroke({ width: 2, color: TOWER_HUE.spire, alpha: 0.75 });
        x = e.x;
        y = e.y;
      }
    }
    this.tag.visible = true;
    this.tag.text = `${TOWER_ICON[tower.kind]}  ${read.stat}   ${read.targets}`;
    const above = this.camY + (tower.y - 168) * this.zoom;
    if (above < 112) this.tag.position.set(tower.x + 130, tower.y - 70);
    else this.tag.position.set(tower.x, tower.y - 168);
    this.tag.zIndex = 0;
  }

  private dashCircle(x: number, y: number, radius: number, color: number): void {
    const steps = 28;
    for (let i = 0; i < steps; i += 2) {
      const a0 = (i / steps) * Math.PI * 2;
      const a1 = ((i + 1) / steps) * Math.PI * 2;
      this.link.moveTo(x + Math.cos(a0) * radius, y + Math.sin(a0) * radius);
      this.link.lineTo(x + Math.cos(a1) * radius, y + Math.sin(a1) * radius);
    }
    this.link.stroke({ width: 2, color, alpha: 0.75 });
  }

  private dash(x0: number, y0: number, x1: number, y1: number, color: number): void {
    const n = 8;
    for (let i = 0; i < n; i += 2) {
      const a = i / n;
      const b = (i + 1) / n;
      this.link.moveTo(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a);
      this.link.lineTo(x0 + (x1 - x0) * b, y0 + (y1 - y0) * b);
    }
    this.link.stroke({ width: 3, color, alpha: 0.8 });
  }

  private drawBars(sim: Siege): void {
    this.bars.clear();
    for (const e of sim.enemies) {
      if (!e.alive || e.kind === "skitter" || e.hp >= e.maxHp - 0.1) continue;
      const w = e.boss ? 74 : e.kind === "golem" || e.kind === "shield" ? 40 : 28;
      const h = e.boss ? 7 : 4;
      const x = e.x - w / 2;
      const y = e.y - (e.boss ? 250 : e.kind === "golem" ? 170 : 118);
      this.bars.rect(x, y, w, h).fill({ color: 0x140e0a, alpha: 0.8 });
      if (e.armor > 0) this.bars.rect(x, y, Math.min(w, e.armor * 2), h).fill({ color: 0x8d8a86 });
      const ratio = Math.max(0, e.hp / e.maxHp);
      this.bars.rect(x, y, w * ratio, h).fill({ color: ratio > 0.45 ? 0xe24b4b : 0xffd0a0 });
    }
  }

  private drawSun(step: number, sim: Siege): void {
    const spin = this.reduced ? 0 : step;
    this.ring.rotation += spin * 0.25;
    this.inner.rotation -= spin * 0.4;
    const charge = sim.flare / BALANCE.flare.need;
    this.glow.alpha = 0.28 + charge * 0.45;
    this.bloom.alpha = 0.18 + charge * 0.4;
    const cracks = 1 - sim.integrity / BALANCE.integrity;
    this.cracks.clear();
    if (cracks > 0.04) {
      const n = Math.ceil(cracks * 6);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        this.cracks.moveTo(Math.cos(a) * 20, Math.sin(a) * 20);
        this.cracks.lineTo(Math.cos(a + 0.4) * this.plaza * 0.7, Math.sin(a + 0.2) * this.plaza * 0.45);
      }
      this.cracks.stroke({ width: 3, color: 0x2a140c, alpha: 0.8 });
    }
  }

  private drawHero(sim: Siege, step: number): void {
    if (!this.hero || !this.heroBody || !this.heroLine || !this.heroRing) {
      this.hero = new Container();
      this.hero.eventMode = "none";
      this.heroBody = new Sprite(Texture.EMPTY);
      this.heroLine = new Sprite(Texture.EMPTY);
      this.heroBody.anchor.set(0.5, 0.9);
      this.heroLine.anchor.set(0.5, 0.9);
      this.heroLine.tint = 0x14080c;
      this.heroBody.eventMode = "none";
      this.heroLine.eventMode = "none";
      this.heroRing = new Graphics();
      this.heroRing.eventMode = "none";
      this.hero.addChild(this.heroRing, this.heroLine, this.heroBody);
      this.actors.addChild(this.hero);
    }
    const at = sim.heroAt();
    this.hero.position.set(at.x, at.y);
    this.hero.zIndex = at.y + 8;
    const throwing = sim.guardianCast > 0;
    const clipName = throwing ? "attack" : sim.heroMoving ? "walk" : "idle";
    const clip = this.art.clip("guardian", clipName) ?? this.art.clip("guardian", "idle");
    if (clip) {
      const row = facingRow(sim.guardianAim, clip.frames.length);
      const frames = clip.frames[Math.min(row, clip.frames.length - 1)] ?? [];
      if (frames.length > 0) {
        let index = 0;
        if (throwing) {
          const span = Math.max(0.05, BALANCE.hero.cast);
          const u = 1 - sim.guardianCast / span;
          index = Math.min(frames.length - 1, Math.max(0, Math.floor(u * frames.length)));
        } else {
          this.heroTime += step > 0 ? step : 0.016;
          index = Math.floor(this.heroTime * clip.fps) % frames.length;
        }
        const tex = frames[index];
        this.heroBody.texture = tex;
        this.heroLine.texture = tex;
        this.heroBody.scale.set(HERO_DRAW);
        this.heroLine.scale.set(HERO_DRAW * 1.18);
        this.heroLine.position.set(1, 2);
      }
    }
    this.heroRing.clear();
    this.heroRing.ellipse(0, 6, 14, 7).fill({ color: 0x0c1a10, alpha: 0.55 });
    this.heroRing.ellipse(0, 4, 13, 6).stroke({ width: 3, color: 0xffe08a, alpha: 0.95 });
    this.heroRing.circle(0, 6, BALANCE.hero.range).stroke({ width: 2, color: 0xffe08a, alpha: 0.16 });
  }

  private drawSpears(sim: Siege): void {
    this.spearUsed = 0;
    const tex = this.art.frame("fx-spear");
    const liftMax = this.reduced ? -18 : -150;
    const samples = 6;
    for (const spear of sim.spears) {
      const now = Math.min(1, spear.age / Math.max(0.05, spear.flight));
      if (now < 0.04) continue;
      for (let i = 0; i < samples; i++) {
        const t = now * ((i + 1) / samples);
        const bolt = this.takeBolt(tex);
        const lift = Math.sin(t * Math.PI) * liftMax;
        const x = spear.sx + (spear.tx - spear.sx) * t;
        const y = spear.sy + (spear.ty - spear.sy) * t + lift;
        const prev = Math.max(0, t - 0.06);
        const px = spear.sx + (spear.tx - spear.sx) * prev;
        const py = spear.sy + (spear.ty - spear.sy) * prev + Math.sin(prev * Math.PI) * liftMax;
        const head = i === samples - 1;
        bolt.position.set(x, y);
        bolt.rotation = Math.atan2(y - py, x - px);
        bolt.scale.set(head ? 1.65 : 0.45 + i * 0.14);
        bolt.alpha = head ? 1 : 0.28 + i * 0.08;
        bolt.blendMode = head ? "normal" : "add";
        bolt.tint = head ? 0xfff6df : 0xffc14a;
      }
    }
    for (let i = this.spearUsed; i < this.spearBolts.length; i++) this.spearBolts[i].visible = false;
  }

  private takeBolt(tex: Texture): Sprite {
    let bolt = this.spearBolts[this.spearUsed];
    if (!bolt) {
      bolt = new Sprite(tex);
      bolt.anchor.set(0.2, 0.5);
      bolt.eventMode = "none";
      this.fxLayer.addChild(bolt);
      this.spearBolts.push(bolt);
    }
    bolt.texture = tex;
    bolt.visible = true;
    this.spearUsed += 1;
    return bolt;
  }

  private drawBeams(sim: Siege): void {
    this.beamCursor = 0;
    for (const tower of sim.towers) {
      if (tower.kind !== "lens" || !tower.targetId) continue;
      const target = sim.enemies.find((e) => e.id === tower.targetId && e.alive);
      if (!target) continue;
      let beam = this.beams[this.beamCursor];
      if (!beam) {
        beam = new Sprite(this.art.frame("fx-beam"));
        beam.anchor.set(0, 0.5);
        beam.blendMode = "add";
        beam.eventMode = "none";
        this.fxLayer.addChild(beam);
        this.beams.push(beam);
      }
      const x = tower.x;
      const y = tower.y - 104;
      const dx = target.x - x;
      const dy = target.y - y;
      beam.visible = true;
      beam.position.set(x, y);
      beam.rotation = Math.atan2(dy, dx);
      const tier = BALANCE.lens[tower.tier];
      const ramp = tier.rampMax > 0 ? tower.ramp / tier.rampMax : 0;
      beam.width = Math.hypot(dx, dy);
      beam.height = 8 + tower.tier * 7 + ramp * 22;
      beam.tint = 0xffd27a;
      beam.alpha = 0.45 + ramp * 0.55;
      this.beamCursor += 1;
    }
    for (let i = this.beamCursor; i < this.beams.length; i++) this.beams[i].visible = false;
  }

  private onDeath(event: Fx): void {
    this.burst(event.x, event.y, 0xffffff, 8);
    this.burst(event.x, event.y - 6, 0xffe08a, 5);
  }

  private spawnGhost(actor: Actor, name: string, fodder: boolean): void {
    const clip = this.art.clip("tower_dart_t1", name);
    void clip;
    actor.shadow.removeFromParent();
    actor.shadow.destroy();
    if (!fodder && name === "sell") {
      this.burst(actor.body.x, actor.body.y, 0xf0d7a2, 5);
    }
  }

  private paintGhost(ghost: Ghost, draw: number): void {
    const posed = frameAt(ghost.clip, ghost.row, ghost.time, "death");
    ghost.body.texture = posed.texture;
    ghost.outline.texture = posed.texture;
    ghost.body.anchor.set(ghost.clip.anchorX, ghost.clip.anchorY);
    ghost.outline.anchor.set(ghost.clip.anchorX, ghost.clip.anchorY);
    ghost.body.scale.set(draw);
    ghost.outline.scale.set(draw * 1.05);
    ghost.body.position.set(ghost.x, ghost.y);
    ghost.outline.position.set(ghost.x, ghost.y + 2);
    ghost.body.zIndex = ghost.y;
    ghost.outline.zIndex = ghost.y - 0.2;
    ghost.shadow.position.set(ghost.x, ghost.y + 4);
    ghost.shadow.scale.set(Math.max(0.5, draw * 0.7), Math.max(0.28, draw * 0.36));
  }

  private drawGhosts(step: number): void {
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const ghost = this.ghosts[i];
      ghost.time += step > 0 ? step : 0.016;
      const draw = ghost.draw;
      if (ghost.fodder) {
        const t = Math.min(1, ghost.time / 0.32);
        const pop = t < 0.22 ? 1.05 + t * 1.4 : Math.max(0, 1.35 * (1 - t));
        this.paintGhost(ghost, draw * pop);
        ghost.body.alpha = 1 - t * 0.85;
        if (t >= 1) {
          this.ghosts.splice(i, 1);
          this.retireGhost(ghost);
        }
      } else {
        this.paintGhost(ghost, draw);
        const posed = frameAt(ghost.clip, ghost.row, ghost.time, "death");
        if (posed.done) {
          ghost.body.alpha -= (step || 0.016) * 2.5;
          if (ghost.body.alpha <= 0) {
            this.ghosts.splice(i, 1);
            this.retireGhost(ghost);
          }
        }
      }
    }
  }

  private retireGhost(ghost: Ghost): void {
    ghost.body.alpha = 1;
    ghost.body.removeFromParent();
    ghost.outline.removeFromParent();
    ghost.shadow.removeFromParent();
    this.ghostPool.push(ghost);
  }

  private onJade(x: number, y: number, amount: number): void {
    const keyX = Math.round(x / 150);
    const keyY = Math.round(y / 150);
    let bucket = this.buckets.find((b) => Math.round(b.x / 150) === keyX && Math.round(b.y / 150) === keyY);
    if (!bucket) {
      bucket = { x, y, n: 0, age: 0 };
      this.buckets.push(bucket);
    }
    bucket.n += amount;
    bucket.x = x;
    bucket.y = y;
    if (this.reduced || this.gems.length >= 36) {
      this.onCollect?.(amount);
      return;
    }
    const gem = this.gemPool.pop() ?? this.makeGem();
    gem.n = amount;
    gem.x = x;
    gem.y = y - 10;
    gem.vx = (Math.random() - 0.5) * 70;
    gem.vy = -90 - Math.random() * 50;
    gem.life = 0;
    gem.s.visible = true;
    gem.s.alpha = 1;
    gem.s.scale.set(0.55);
    gem.s.position.set(gem.x, gem.y);
    this.gems.push(gem);
  }

  private makeGem(): Gem {
    const s = new Sprite(this.art.frame("jade"));
    s.anchor.set(0.5);
    s.scale.set(0.55);
    s.eventMode = "none";
    this.fxLayer.addChild(s);
    return { s, x: 0, y: 0, vx: 0, vy: 0, life: 0, n: 0 };
  }

  private flushBuckets(): void {
    for (let i = this.buckets.length - 1; i >= 0; i--) {
      const bucket = this.buckets[i];
      bucket.age += 0.016;
      if (bucket.age < 0.22) continue;
      this.floatText(bucket.x, bucket.y - 18, `+${bucket.n}`, 0xc8ffd8, bucket.n >= 12 ? 22 : 16);
      this.buckets.splice(i, 1);
    }
  }

  private drawGems(step: number): void {
    const dt = step > 0 ? step : 0.016;
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      gem.life += dt;
      if (gem.life < 0.14) {
        gem.x += gem.vx * dt;
        gem.y += gem.vy * dt;
        gem.s.position.set(gem.x, gem.y);
        const pop = 0.85 + Math.sin(Math.min(1, gem.life / 0.14) * Math.PI) * 0.35;
        gem.s.scale.set(0.55 * pop);
      } else {
        const t = Math.min(1, (gem.life - 0.14) / 0.7);
        const e = t * t;
        const arc = Math.sin(t * Math.PI) * -160;
        gem.s.position.set(
          gem.x + (this.gemGoal.x - gem.x) * e,
          gem.y + (this.gemGoal.y - gem.y) * e + arc,
        );
        gem.s.scale.set(0.55 * (1 - t * 0.25));
        gem.s.alpha = 1 - t * 0.15;
        if (t >= 1) {
          this.onCollect?.(gem.n);
          gem.s.visible = false;
          this.gems.splice(i, 1);
          this.gemPool.push(gem);
        }
      }
    }
  }

  private burst(x: number, y: number, color: number, count: number): void {
    const n = this.reduced ? Math.min(4, count) : count;
    for (let i = 0; i < n; i++) {
      if (this.bits.length > 300) {
        const old = this.bits.shift();
        if (old) {
          old.s.visible = false;
          this.bitPool.push(old);
        }
      }
      const bit = this.bitPool.pop() ?? this.makeBit();
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 90;
      bit.s.position.set(x, y);
      bit.s.tint = color;
      bit.s.alpha = 1;
      bit.s.visible = true;
      bit.s.scale.set(0.12 + Math.random() * 0.12);
      bit.vx = Math.cos(a) * sp;
      bit.vy = Math.sin(a) * sp - 20;
      bit.life = 0.35;
      bit.max = 0.35;
      this.bits.push(bit);
    }
  }

  private makeBit(): Bit {
    const s = new Sprite(this.art.frame("fx-orb"));
    s.anchor.set(0.5);
    s.blendMode = "add";
    s.eventMode = "none";
    this.fxLayer.addChild(s);
    return { s, vx: 0, vy: 0, life: 0, max: 0.3 };
  }

  private drawBits(step: number): void {
    const dt = step > 0 ? step : 0;
    if (dt <= 0) return;
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const bit = this.bits[i];
      bit.life -= dt;
      bit.s.x += bit.vx * dt;
      bit.s.y += bit.vy * dt;
      bit.vy += 80 * dt;
      bit.s.alpha = Math.max(0, bit.life / bit.max);
      if (bit.life <= 0) {
        bit.s.visible = false;
        this.bits.splice(i, 1);
        this.bitPool.push(bit);
      }
    }
  }

  private ringFx(x: number, y: number, radius: number, color: number): void {
    const ring = new Sprite(this.art.frame("fx-stun"));
    ring.anchor.set(0.5);
    ring.blendMode = "add";
    ring.tint = color;
    ring.position.set(x, y);
    ring.eventMode = "none";
    const target = (radius * 2) / Math.max(1, ring.texture.width);
    ring.scale.set(target * 0.45);
    this.fxLayer.addChild(ring);
    this.rings.push({ s: ring, life: 0.42, max: 0.42, grow: target });
  }

  private drawRings(step: number): void {
    const dt = step > 0 ? step : 0.016;
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.life -= dt;
      const t = 1 - Math.max(0, ring.life) / ring.max;
      if (ring.grow > 0) ring.s.scale.set(ring.grow * (0.45 + t * 0.7));
      ring.s.alpha = Math.max(0, 1 - t);
      if (ring.life <= 0) {
        ring.s.destroy();
        this.rings.splice(i, 1);
      }
    }
  }

  private drawChain(pts: Vec[], color: number): void {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const bolt = new Sprite(this.art.frame("fx-lightning"));
      bolt.anchor.set(0, 0.5);
      bolt.blendMode = "add";
      bolt.tint = color;
      bolt.position.set(a.x, a.y);
      bolt.rotation = Math.atan2(b.y - a.y, b.x - a.x);
      bolt.width = Math.hypot(b.x - a.x, b.y - a.y);
      bolt.height = 28;
      bolt.eventMode = "none";
      this.fxLayer.addChild(bolt);
      this.rings.push({ s: bolt, life: 0.2, max: 0.2, grow: 0 });
    }
  }

  private showCallout(text: string): void {
    this.callout.text = text;
    this.callout.visible = true;
    this.callout.alpha = 1;
    this.callout.scale.set(1.12);
    this.calloutLife = 1.2;
  }

  private drawCallout(dt: number): void {
    if (this.calloutLife <= 0) return;
    this.calloutLife -= dt;
    const t = Math.max(0, this.calloutLife / 1.2);
    this.callout.alpha = Math.min(1, t * 2.2);
    this.callout.scale.set(1 + (1 - t) * 0.08);
    if (this.calloutLife <= 0) this.callout.visible = false;
  }

  /** A small white number that hops off a hit. Each hit keeps its own so a pack stays readable. */
  private popNumber(x: number, y: number, text: string): void {
    if (this.floats.length > 72) {
      const oldest = this.floats.shift();
      if (oldest) {
        oldest.t.visible = false;
        oldest.life = 0;
        this.floatPool.push(oldest);
      }
    }
    const floater = this.floatPool.pop() ?? this.makeFloat();
    floater.t.text = text;
    floater.t.style.fontSize = 15;
    floater.t.style.fill = 0xffffff;
    floater.t.position.set(x + ((this.floats.length % 5) - 2) * 4, y);
    floater.t.alpha = 1;
    floater.t.visible = true;
    floater.life = 0.55;
    floater.vy = -92;
    this.floats.push(floater);
  }

  private floatText(x: number, y: number, text: string, fill: number, size: number): void {
    const near = this.floats.find((f) => f.t.visible && f.t.text === text && Math.hypot(f.t.x - x, f.t.y - y) < 140);
    if (near) {
      near.life = 0.9;
      near.t.position.set(x, y);
      near.t.alpha = 1;
      return;
    }
    const floater = this.floatPool.pop() ?? this.makeFloat();
    floater.t.text = text;
    floater.t.style.fontSize = size;
    floater.t.style.fill = fill;
    floater.t.position.set(x, y);
    floater.t.alpha = 1;
    floater.t.visible = true;
    floater.life = 0.8;
    floater.vy = -36;
    this.floats.push(floater);
  }

  private makeFloat(): Floater {
    const t = new Text({
      text: "",
      style: { fontFamily: SANS, fontSize: 16, fill: 0xffffff, fontWeight: "bold", dropShadow: shadowStyle() },
    });
    t.anchor.set(0.5);
    t.eventMode = "none";
    this.fxLayer.addChild(t);
    return { t, life: 0, vy: -30 };
  }

  private drawFloats(step: number): void {
    const dt = step > 0 ? step : 0;
    if (dt <= 0) return;
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const floater = this.floats[i];
      floater.life -= dt;
      floater.t.y += floater.vy * dt;
      floater.t.alpha = Math.max(0, floater.life / 0.8);
      if (floater.life <= 0) {
        floater.t.visible = false;
        this.floats.splice(i, 1);
        this.floatPool.push(floater);
      }
    }
  }
}

function stealthedFade(e: Enemy): number {
  if (e.kind !== "jaguar") return 1;
  const m = e.age % BALANCE.jaguar.cycle;
  return m > BALANCE.jaguar.cycle - BALANCE.jaguar.dur ? 0.28 : 1;
}

function shadowStyle(): { alpha: number; color: number; distance: number; blur: number } {
  return { alpha: 0.7, color: 0x140e0a, distance: 2, blur: 2 };
}
