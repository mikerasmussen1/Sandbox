/**
 * 2.5D valley. Raiders and totems are pre-rendered sprites, sorted by their
 * feet. Combat decisions stay in sim.ts.
 */
import { Circle, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import type { ArtSet, Clip } from "./art";
import { BALANCE, ROLE_HINT, TECH, TOWER_HUE, TOWER_ICON, specChoices, sharedScales, towerCost, towerFacts, towerRange, towerReadout } from "./balance";
import { CARRY_CAP, CARRY_SCALE, carrySlots } from "./carry";
import { poseAt } from "./geom";
import { MAP_H, MAP_W, type MapDef } from "./maps";
import { PAY_FLIGHT, type Enemy, type Fx, type Siege, type Shot, type Station, type StationKind } from "./sim";
import { TOWER_KINDS, type EnemyKind, type Spec, type TowerKind, type Vec } from "./types";

const SANS = 'Palatino, "Palatino Linotype", Georgia, serif';
export const RANGE_COLOR = TOWER_HUE;

const PLAY: Record<string, number> = {
  walk: 1.2, run: 1.25, fly: 1.15, idle: 1, roll: 1.15, push: 1.2,
  attack: 1.8, hit: 1.85, block: 1.6, death: 1.7,
  slam: 1.65, roar: 1.7, build: 1.15, sell: 1.25,
};

/**
 * Clip.draw is already world-units per source pixel, measured so the opaque
 * body matches the reference ratios. These stay at 1 so a call site that
 * still multiplies does not shrink the new art.
 */
const ENEMY_DRAW = 1;
const HERO_DRAW = 1;
const TOWER_DRAW = 1;
/** Screen-pixel radius of the build cards. The menu is scaled by 1/zoom so this stays constant. */
const MENU_REACH = 220;
/** Clear the Jade vault and the top bar, and the Flare button along the bottom. */
const MENU_TOP = 168;
const MENU_BOTTOM = 96;

/** Archer bolts and Arrow Rain shafts, relative to the previous sprite length. */
const ARROW_DRAW = 0.45;

function padHue(kind: StationKind): number {
  if (kind === "wall") return 0xc46a3a;
  if (kind === "barracks") return 0x3d7dff;
  if (kind === "recruit") return 0x7dffb2;
  if (kind === "base") return 0xffe08a;
  return TOWER_HUE[kind];
}

function isTower(kind: StationKind): kind is TowerKind {
  return kind === "dart" || kind === "lens" || kind === "drum" || kind === "spire";
}

function bodyScale(kind: EnemyKind, clipDraw: number): number {
  const scale = clipDraw * ENEMY_DRAW;
  if (kind === "shard") return scale * 0.38;
  return scale;
}

function towerLook(kind: TowerKind, tier: number, spec: Spec): { asset: string; tint: number; mul: number } {
  const step = Math.max(0, Math.min(2, tier));
  const level = step + 1;
  let asset = towerAsset(kind);
  if (step > 0 && spec !== "none") {
    if (kind === "dart" && spec === "rain") asset = `tower_rain_t${level}`;
    else if (kind === "dart" && spec === "volley") asset = `tower_volley_t${level}`;
    else if (kind === "lens" && spec === "ballista") asset = `tower_ballista_t${level}`;
    else if (kind === "lens" && spec === "catapult") asset = `tower_catapult_t${level}`;
    else if (kind === "drum" && spec === "snare") asset = `tower_snare_t${level}`;
    else if (kind === "drum" && spec === "beam") asset = `tower_beam_t${level}`;
    else if (kind === "spire") asset = `tower_beam_t${level}`;
  }
  return { asset, tint: 0xffffff, mul: 1 };
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
interface Floater { t: Text; life: number; max: number; vy: number }
interface Gem { s: Sprite; x: number; y: number; vx: number; vy: number; life: number; n: number }
interface Bucket { x: number; y: number; n: number; age: number }
interface RingFx { s: Sprite; life: number; max: number; grow: number }

function towerAsset(kind: TowerKind): string {
  if (kind === "dart") return "tower_archer_t1";
  if (kind === "lens") return "tower_siege_t1";
  if (kind === "drum" || kind === "spire") return "tower_mystic_t1";
  return "tower_barracks_t1";
}

function enemyAsset(kind: EnemyKind): string {
  if (kind === "skitter" || kind === "jaguar") return "swarmer";
  if (kind === "runner") return "runner";
  if (kind === "shield") return "shield";
  if (kind === "giant" || kind === "golem") return "giant";
  if (kind === "sapper") return "sapper";
  if (kind === "glider") return "flyer";
  if (kind === "roller" || kind === "shard") return "boulder";
  if (kind === "boss") return "boss";
  return "swarmer";
}

function locomote(kind: EnemyKind): string {
  if (kind === "glider") return "fly";
  if (kind === "roller" || kind === "shard") return "roll";
  return "walk";
}

function enemyTint(kind: EnemyKind): number {
  if (kind === "roller" || kind === "shard") return 0xe8a86a;
  if (kind === "jaguar") return 0xb7c4e6;
  if (kind === "golem") return 0xd8dce4;
  return 0xffffff;
}

/** Sheet rows are S, SE, E, NE, N, NW, W, SW. Angle 0 points east, and y grows downward. */
function facingRow(angle: number, rows: number): number {
  if (rows <= 1) return 0;
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const i = Math.round(a / (Math.PI / 4)) % 8;
  return [2, 1, 0, 7, 6, 5, 4, 3][i];
}

function frameAt(clip: Clip, row: number, time: number, name: string): { texture: Texture; done: boolean; ax: number; ay: number } {
  const speed = PLAY[name] ?? 1.6;
  const rowIndex = Math.min(row, clip.frames.length - 1);
  const frames = clip.frames[rowIndex] ?? [];
  const count = frames.length || 1;
  const raw = Math.floor(time * clip.fps * speed);
  const done = !clip.loop && raw >= count;
  const index = clip.loop ? raw % count : Math.min(count - 1, Math.max(0, raw));
  const anchor = clip.anchors[rowIndex]?.[index];
  return {
    texture: frames[index] ?? Texture.EMPTY,
    done,
    ax: anchor?.x ?? clip.anchorX,
    ay: anchor?.y ?? clip.anchorY,
  };
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
  private readonly chevronGfx = new Graphics();
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
  private readonly picker = new Container();
  private readonly pickerHits: Container[] = [];
  private pickerFor = -1;
  private payEpoch = 0;
  private readonly puffs: { x: number; y: number; life: number; max: number; color?: number }[] = [];
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
  private sunFlash = 0;
  private onBranch: ((index: number, spec: Spec) => void) | null = null;
  private reduced = false;
  private plaza = 160;
  private sunAt = { x: 960, y: 540 };
  private beamCursor = 0;
  private hero: Container | null = null;
  private heroBody: Sprite | null = null;
  private heroLine: Sprite | null = null;
  private heroRing: Graphics | null = null;
  private heroShadow: Sprite | null = null;
  private heroTime = 0;
  private heroFace = 0;
  private heroPX = -1;
  private heroPY = -1;
  private keep: Sprite | null = null;
  private keepShadow: Sprite | null = null;
  private readonly crews = new Map<number, { body: Sprite; shadow: Sprite }[]>();
  private readonly built = new Map<number, { body: Sprite; shadow: Sprite; asset: string }>();
  private readonly scenery: { body: Sprite; shadow: Sprite }[] = [];
  private readonly spearBolts: Sprite[] = [];
  private spearUsed = 0;
  private readonly labels = new Container();
  private readonly stationLabels: Text[] = [];
  private readonly stationCosts: Text[] = [];
  private readonly stationCoins: Sprite[] = [];
  private readonly stationHints: Text[] = [];
  private readonly dropBorn = new Map<number, number>();
  private readonly padGhosts: Sprite[] = [];
  private readonly rains: {
    s: Sprite;
    x: number;
    y: number;
    hx: number;
    hy: number;
    px: number;
    py: number;
    fx: number;
    fy: number;
    phase: "wait" | "fall" | "stuck";
    t: number;
    /** Seconds to wait before this arrow starts its fall, so the shower staggers. */
    delay: number;
    dusted: boolean;
    ang: number;
  }[] = [];
  private readonly rainPool: Sprite[] = [];
  private readonly marks: { x: number; y: number; r: number; life: number; hot: boolean }[] = [];
  private readonly flings: { body: Sprite; outline: Sprite; vx: number; vy: number; life: number; hold: number; scale: number }[] = [];
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
    this.ground.rect(-1200, -1200, 1920 + 2400, 1080 + 2400).fill({ color: 0x2c3034 });
    this.pads.eventMode = "none";
    this.range.eventMode = "none";
    this.link.eventMode = "none";
    this.bars.eventMode = "none";
    this.shadowLayer.eventMode = "none";
    this.fxLayer.eventMode = "none";
    // Feet y, painter's order. Atlas frames stay Sprites on one texture, so this sort does not break the batch.
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
    this.picker.eventMode = "passive";
    this.picker.visible = false;
    this.world.addChild(this.ground, this.mapSprite, this.chevronGfx, this.pads, this.shadowLayer, this.range, this.actors, this.link, this.bars, this.mark, this.fxLayer, this.labels, this.picker, this.tag, this.menu);
    this.actors.addChild(this.sun);
    this.flashRect.eventMode = "none";
    this.flashRect.blendMode = "add";
    this.overlay.eventMode = "none";
    this.callout = new Text({
      text: "",
      style: {
        fontFamily: SANS,
        fontSize: 13,
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
    const field = map.biome === "crater" ? 0x3a2a22 : 0x2c3034;
    this.ground.clear();
    this.ground.rect(-400, -400, MAP_W + 800, MAP_H + 800).fill({ color: field });
    this.mapSprite.texture = texture;
    this.mapSprite.width = MAP_W;
    this.mapSprite.height = MAP_H;
    this.paintChevrons(map);
    this.plaza = map.plaza;
    this.sunAt = map.sun;
    this.sun.position.set(map.sun.x, map.sun.y);
    this.sun.zIndex = map.sun.y + 1;
    const disk = map.plaza * 0.42;
    const scale = disk / Math.max(1, this.disk.texture.width);
    this.disk.scale.set(scale);
    this.inner.scale.set(scale);
    this.ring.scale.set(scale * 1.04);
    this.bloom.scale.set(scale * 1.15);
    this.glow.scale.set(scale * 2.4);
    this.placeKeep(map.sun.x, map.sun.y);
    this.dressProps(map);
    this.clearBuilt();
    for (const id of [...this.crews.keys()]) this.freeCrew(id);
    for (const g of this.ghosts) this.retireGhost(g);
    this.ghosts.length = 0;
  }

  layout(w: number, h: number): void {
    this.viewW = w;
    this.viewH = h;
    this.callout.position.set(w / 2, w < 760 ? 108 : 88);
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
      const clip = this.art.clip(towerAsset(kind), "idle");
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

  setBranch(fn: (index: number, spec: Spec) => void): void {
    this.onBranch = fn;
  }

  blocks(x: number, y: number): boolean {
    if (this.picker.visible) {
      for (const button of this.pickerHits) {
        const b = button.getBounds();
        if (x >= b.x && y >= b.y && x <= b.x + b.width && y <= b.y + b.height) return true;
      }
    }
    if (!this.menu.visible) return false;
    for (const button of this.menuButtons) {
      const b = button.getBounds();
      if (x >= b.x && y >= b.y && x <= b.x + b.width && y <= b.y + b.height) return true;
    }
    return false;
  }

  showRange(x: number, y: number, radius: number, color: number): void {
    this.range.clear();
    this.dashRing(this.range, x, y, radius, color, 0.5);
    this.range.visible = true;
  }

  /** A soft dashed ring. One stroke per dash, so a fill elsewhere on the path is not retraced. */
  private dashRing(g: Graphics, x: number, y: number, radius: number, color: number, alpha: number): void {
    const steps = 40;
    for (let i = 0; i < steps; i += 2) {
      const a0 = (i / steps) * Math.PI * 2;
      const a1 = ((i + 0.85) / steps) * Math.PI * 2;
      g.moveTo(x + Math.cos(a0) * radius, y + Math.sin(a0) * radius);
      g.lineTo(x + Math.cos(a1) * radius, y + Math.sin(a1) * radius);
      g.stroke({ width: 2, color, alpha });
    }
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
    this.drawPuffs(step > 0 ? step : 0.016);
    this.syncPicker(sim);
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
    this.drawRains(step > 0 ? step : 0.016);
    this.drawFlings(step > 0 ? step : 0.016);
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
        this.burst(event.x, event.y, 0xffffff, saved ? 6 : 8);
        this.burst(event.x, event.y, color, saved ? 10 : 7);
        this.ringFx(event.x, event.y, saved ? 70 : event.n === 4 ? 48 : 28, 0xfffdf8);
        if (event.text) this.floatText(event.x, event.y - 40, event.text, 0xfff6df, 26);
        if (saved) this.floatText(event.x, event.y - 40, "SAVED!", 0xffe08a, 16);
      } else if (event.kind === "collect" && event.n) this.onCollect?.(event.n);
      else if (event.kind === "pay") this.launchPay(event.x, event.y, event.tx ?? event.x, event.ty ?? event.y);
      else if (event.kind === "num" && event.text) this.popNumber(event.x, event.y, event.text);
      else if (event.kind === "rubble") {
        this.burst(event.x, event.y, 0xffffff, 6);
        this.burst(event.x, event.y, 0xb08968, 8);
      }
      else if (event.kind === "death") this.onDeath(event);
      else if (event.kind === "loom") this.loom(event.x, event.y, event.n ?? BALANCE.shower.radius, event.color === 0xffd24a);
      else if (event.kind === "volley") {
        this.dive(event.x, event.y, event.n ?? BALANCE.shower.radius);
        this.bump(0.06);
      }
      else if (event.kind === "jade" && event.n) this.onJade(event.x, event.y, event.n);
      else if (event.kind === "multi" && event.text) {
        this.showCallout(event.text);
        this.bump(event.n && event.n >= 8 ? 0.2 : 0.08);
      } else if (event.kind === "callout" && event.text) {
        this.showCallout(event.text);
      } else if (event.kind === "relic" && event.text) this.floatText(event.x, event.y, event.text, 0xfff1c8, 18);
      else if (event.kind === "drum" && event.n) this.ringFx(event.x, event.y, event.n, 0xb9a0ff);
      else if (event.kind === "slam" && event.n) {
        this.ringFx(event.x, event.y, event.n, 0xff7a4a);
        this.bump(0.45);
      } else if (event.kind === "aegis") this.ringFx(event.x, event.y, 90, 0xc8c0e8);
      else if (event.kind === "rally" && event.n) this.ringFx(event.x, event.y, event.n, 0xff7a3a);
      else if (event.kind === "chain" && event.pts) this.drawChain(event.pts, event.color ?? 0x2ee0d0);
      else if (event.kind === "crack") {
        this.bump(0.18 + Math.min(0.35, event.n ?? 1) * 0.2);
        this.sunFlash = 0.28;
        this.floatText(event.x, event.y - 78, `-${Math.max(1, Math.round(event.n ?? 1))}`, 0xff5a3c, 14);
      }
      else if (event.kind === "splinter") {
        this.burst(event.x, event.y, 0xf0d7a2, 10);
        this.burst(event.x, event.y - 8, 0x8d5a32, 8);
        this.puffs.push({ x: event.x, y: event.y, life: 0, max: 0.45 });
        this.bump(0.22);
      }
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
    const s = new Sprite(Texture.EMPTY);
    s.anchor.set(0.5, 0.5);
    s.eventMode = "none";
    return s;
  }

  /** Atlas contact shadow. Same world-per-pixel scale as the body, its own ground anchor. */
  private dressShadow(sprite: Sprite, id: string, scale: number, alpha = 0.92): void {
    const mark = this.art.mark(id);
    if (!mark) {
      sprite.visible = false;
      return;
    }
    sprite.visible = true;
    sprite.texture = mark.texture;
    sprite.anchor.set(mark.ax, mark.ay);
    sprite.scale.set(scale);
    sprite.tint = 0xffffff;
    sprite.alpha = alpha;
    sprite.blendMode = "normal";
    sprite.rotation = 0;
  }

  private placeKeep(x: number, y: number): void {
    const clip = this.art.clip("base_keep", "idle");
    if (!clip) return;
    if (!this.keep || !this.keepShadow) {
      this.keep = new Sprite(clip.frames[0][0]);
      this.keep.eventMode = "none";
      this.keepShadow = this.shadowSprite();
      this.shadowLayer.addChild(this.keepShadow);
      this.actors.addChild(this.keep);
    }
    const posed = frameAt(clip, 0, 0, "idle");
    this.keep.texture = posed.texture;
    this.keep.anchor.set(posed.ax, posed.ay);
    this.keep.scale.set(clip.draw);
    this.keep.position.set(x, y);
    this.keep.zIndex = y;
    this.dressShadow(this.keepShadow, "base_keep", clip.draw);
    this.keepShadow.position.set(x, y);
  }

  private dressProps(map: MapDef): void {
    for (const piece of this.scenery) {
      piece.body.destroy();
      piece.shadow.destroy();
    }
    this.scenery.length = 0;
    const desert = map.name === "Boulder Bend" || map.name === "Runner Ridge" || map.name === "Brute Steps" || map.name === "Colossus Stair";
    const names = desert
      ? ["rock_big", "rock_small", "rock_small", "bush", "tree_palm", "rock_big", "bush", "tree_palm"]
      : ["tree_canopy", "tree_kapok", "tree_palm", "tree_canopy", "bush", "tree_kapok", "tree_palm", "rock_small", "bush"];
    const rim: { x: number; y: number; nx: number; ny: number }[] = [];
    for (const route of map.routes) {
      for (let dist = 0; dist < route.len; dist += 32) {
        const here = poseAt(route, dist);
        const ahead = poseAt(route, Math.min(route.len - 1, dist + 16));
        const ang = Math.atan2(ahead.y - here.y, ahead.x - here.x);
        rim.push({ x: here.x, y: here.y, nx: -Math.sin(ang), ny: Math.cos(ang) });
      }
    }
    let seed = 19 + map.routes.length * 13 + Math.round(map.sun.x);
    const rnd = (): number => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const taken: { x: number; y: number }[] = [];
    let placed = 0;
    let tries = 0;
    const want = 120;
    while (placed < want && tries < rim.length * 6 && rim.length > 0) {
      const spot = rim[tries % rim.length];
      tries += 1;
      const side = tries % 2 === 0 ? 1 : -1;
      const reach = map.pathWidth * 0.46 + 54 + rnd() * 36;
      const x = spot.x + spot.nx * reach * side + (rnd() - 0.5) * 16;
      const y = spot.y + spot.ny * reach * side + (rnd() - 0.5) * 12;
      if (x < 24 || y < 24 || x > MAP_W - 24 || y > MAP_H - 24) continue;
      if (Math.hypot(x - map.sun.x, y - map.sun.y) < 168) continue;
      if (map.pads.some((pad) => Math.hypot(pad.x - x, pad.y - y) < 58)) continue;
      let onRoad = false;
      for (const route of map.routes) {
        for (let dist = 0; dist < route.len; dist += 28) {
          const point = poseAt(route, dist);
          if (Math.hypot(point.x - x, point.y - y) < map.pathWidth * 0.42 + 18) {
            onRoad = true;
            break;
          }
        }
        if (onRoad) break;
      }
      if (onRoad) continue;
      if (taken.some((point) => Math.hypot(point.x - x, point.y - y) < 30)) continue;
      const name = names[Math.floor(rnd() * names.length)];
      const texture = this.art.prop(name);
      if (!texture) continue;
      const body = new Sprite(texture);
      const anchor = texture.defaultAnchor;
      body.anchor.set(anchor?.x ?? 0.5, anchor?.y ?? 0.8);
      const scale = this.art.propScale(name) * (0.82 + rnd() * 0.34);
      body.scale.set(name === "bush" || name === "rock_small" ? scale * 0.85 : scale);
      body.position.set(x, y);
      body.zIndex = y;
      body.eventMode = "none";
      const shadow = this.shadowSprite();
      this.dressShadow(shadow, `prop_${name}`, body.scale.x, 0.85);
      shadow.position.set(x, y);
      this.shadowLayer.addChild(shadow);
      this.actors.addChild(body);
      this.scenery.push({ body, shadow });
      taken.push({ x, y });
      placed += 1;
    }
  }

  private clearBuilt(): void {
    for (const piece of this.built.values()) {
      piece.body.destroy();
      piece.shadow.destroy();
    }
    this.built.clear();
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
      const clip = this.art.clip(towerAsset(kind), "idle");
      const icon = new Sprite(clip?.frames[0][0] ?? Texture.EMPTY);
      if (clip) {
        icon.anchor.set(clip.anchorX, clip.anchorY);
        icon.scale.set(clip.draw * 0.72);
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
    outline.visible = false;
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
    actor.body.anchor.set(posed.ax, posed.ay);
    actor.body.scale.set(draw);
    actor.body.rotation = 0;
    actor.outline.visible = false;
  }

  private syncTowers(sim: Siege, step: number): void {
    const seen = new Set<number>();
    for (const tower of sim.towers) {
      seen.add(tower.id);
      let actor = this.towers.get(tower.id);
      const look = towerLook(tower.kind, tower.tier, tower.spec);
      const asset = look.asset;
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
      const draw = shown.draw * TOWER_DRAW * look.mul * (tower.stunnedUntil > sim.time ? 0.98 : 1);
      this.paint(actor, shown, 0, actor.clip, draw);
      const kick = actor.clip === "attack" ? Math.sin(Math.min(1, actor.time / 0.16) * Math.PI) * (8 + tower.tier * 4) : 0;
      actor.body.position.set(tower.x - Math.cos(tower.angle) * kick, tower.y - Math.sin(tower.angle) * kick);
      actor.outline.position.set(actor.body.x, actor.body.y + 2);
      actor.body.zIndex = tower.y;
      actor.outline.zIndex = tower.y - 0.2;
      actor.body.tint = tower.stunnedUntil > sim.time ? 0xb7c4d4 : look.tint;
      this.dressShadow(actor.shadow, asset, draw);
      actor.shadow.position.set(tower.x, tower.y);
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
      const fodder = e.kind === "skitter" || e.kind === "runner" || e.kind === "shard" || e.kind === "jaguar" || e.kind === "glider" || e.kind === "sapper";
      const punch = fodder && e.flash > 0 ? 1 + Math.min(0.5, e.flash * 5) : 1;
      this.paint(actor, clip, row, actor.clip, draw * punch);
      const hop = e.hop > 0 ? Math.sin((0.16 - e.hop) * 40) * 6 : 0;
      const lift = e.flying ? 18 + Math.sin(this.time * 6 + e.id) * 6 : 0;
      const rank = e.kind === "skitter" || e.kind === "runner" ? ((e.id % 3) - 1) * 12 : 0;
      const ox = Math.cos(e.angle + Math.PI / 2) * rank;
      const oy = Math.sin(e.angle + Math.PI / 2) * rank;
      actor.body.position.set(e.x + ox, e.y + oy - lift - hop);
      actor.outline.position.set(e.x + ox, e.y + oy - lift - hop + 2);
      actor.body.zIndex = e.y;
      actor.outline.zIndex = e.y - 0.2;
      const rock = e.kind === "roller" || e.kind === "shard";
      actor.outline.visible = false;
      actor.body.blendMode = "normal";
      actor.body.tint = rock ? (e.flash > 0 ? 0xffe2b8 : 0xe8a86a) : fodder && e.flash > 0.02 ? 0xfff6ee : e.flash > 0 ? 0xfff6ee : enemyTint(e.kind);
      actor.body.alpha = stealthedFade(e);
      if (e.kind === "roller") actor.body.rotation = e.dist / 46;
      this.dressShadow(actor.shadow, asset, draw, e.flying ? 0.4 : 0.92);
      actor.shadow.position.set(e.x + ox, e.y + oy);
      if (e.kind === "roller") this.syncCrew(e);
      else this.freeCrew(e.id);
    }
    for (const [id, actor] of this.enemies) {
      if (seen.has(id)) continue;
      this.enemies.delete(id);
      this.freeCrew(id);
      this.freeActor(actor);
    }
  }

  /** Four pushers behind the boulder. They are a visual crew; the sim still moves one unit. */
  private syncCrew(e: Enemy): void {
    const clip = this.art.clip("pusher", "push") ?? this.art.clip("pusher", "walk");
    if (!clip) return;
    let crew = this.crews.get(e.id);
    if (!crew) {
      crew = [];
      for (let i = 0; i < 4; i++) {
        const body = this.takeSprite(clip.frames[0][0]);
        const shadow = this.shadowSprite();
        this.shadowLayer.addChild(shadow);
        this.actors.addChild(body);
        crew.push({ body, shadow });
      }
      this.crews.set(e.id, crew);
    }
    const row = facingRow(e.angle, clip.frames.length);
    const posed = frameAt(clip, row, this.time, "push");
    for (let i = 0; i < crew.length; i++) {
      const back = 52 + (i % 2) * 16;
      const side = (i - 1.5) * 22;
      const px = e.x - Math.cos(e.angle) * back + Math.cos(e.angle + Math.PI / 2) * side;
      const py = e.y - Math.sin(e.angle) * back + Math.sin(e.angle + Math.PI / 2) * side;
      const member = crew[i];
      member.body.texture = posed.texture;
      member.body.anchor.set(posed.ax, posed.ay);
      member.body.scale.set(clip.draw);
      member.body.position.set(px, py);
      member.body.zIndex = py;
      member.body.rotation = 0;
      member.body.tint = 0xffffff;
      this.dressShadow(member.shadow, "pusher", clip.draw);
      member.shadow.position.set(px, py);
    }
  }

  private freeCrew(id: number): void {
    const crew = this.crews.get(id);
    if (!crew) return;
    for (const member of crew) {
      member.body.destroy();
      member.shadow.destroy();
    }
    this.crews.delete(id);
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
    const clip = this.art.clip("soldier", "walk");
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
      const troop = ally.role === "recruit" ? 0.82 : 1;
      this.paint(actor, clip, row, "walk", clip.draw * troop);
      actor.body.position.set(ally.x, ally.y);
      actor.body.zIndex = ally.y;
      actor.body.tint = ally.role === "knight" ? 0xffe6c2 : ally.role === "spear" ? 0xd6e8ff : ally.role === "recruit" ? 0xd8ffe8 : 0xffffff;
      this.dressShadow(actor.shadow, "soldier", clip.draw * troop);
      actor.shadow.position.set(ally.x, ally.y);
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
      if (!e.alive) continue;
      if (e.kind === "roller" || e.boulder <= 0) continue;
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
      this.pads.circle(puddle.x, puddle.y, puddle.radius).fill({ color, alpha: 0.06 * fade });
    }
    const hero = sim.heroAt();
    sim.stations.forEach((station, i) => {
      const color = padHue(station.kind);
      const away = Math.hypot(station.x - hero.x, station.y - hero.y);
      const fade = away < 170 ? 1 : away > 480 ? 0.26 : 1 - ((away - 170) / 310) * 0.74;
      const plot = this.padSize();
      if (station.kind === "wall") this.drawWall(sim, station, i, fade);
      else if (station.kind === "barracks" && station.tier > 0) this.drawBarracks(station, i);
      else if (station.tier === 0) {
        this.hideBuilt(i);
        this.padPlot(station.x, station.y, plot, fade);
      }
      const next = station.tier < 3 ? sim.stationCost(station) : 0;
      const remain = next > 0 ? Math.max(0, Math.ceil(next)) : 0;
      const dwelling = sim.funding === i && sim.dwell > 0;
      const broke = sim.funding === i && sim.shortJade && remain > 0;
      if (dwelling) {
        const u = Math.max(0, Math.min(1, sim.dwell));
        const ring = plot * 1.15;
        this.pads.circle(station.x, station.y, ring).stroke({ width: 7, color: 0x2a160c, alpha: 0.72 * fade });
        const start = -Math.PI / 2;
        const end = start + Math.PI * 2 * u;
        this.pads.moveTo(station.x, station.y);
        this.pads.arc(station.x, station.y, ring, start, end);
        this.pads.lineTo(station.x, station.y);
        this.pads.fill({ color: 0xffc14a, alpha: 0.78 * fade });
        this.pads.arc(station.x, station.y, ring, start, end).stroke({ width: 7, color: 0xffe08a, alpha: fade });
      }
      if (broke && this.time - this.needAt > 1.05) {
        this.needAt = this.time;
        this.floatText(station.x, station.y - 78, "need more", 0xffd0a0, 18);
      }
      const close = Math.hypot(station.x - sim.heroX, station.y - sim.heroY) < BALANCE.fund.preview;
      const glyph = station.kind === "wall" ? "▮" : station.kind === "barracks" || station.kind === "recruit" ? "⚑" : station.kind === "base" ? "☀" : TOWER_ICON[station.kind];
      const icon = this.stationLabel(i);
      icon.text = glyph;
      icon.style.fontSize = 16;
      icon.style.fill = 0xfff8e8;
      icon.visible = station.tier === 0 && station.kind !== "wall" && close;
      icon.anchor.set(0.5);
      icon.position.set(station.x, station.y - 46);
      icon.zIndex = station.y + 4;
      const cost = this.stationCostLabel(i);
      const coin = this.stationCoin(i);
      const showPrice = fade > 0.62 && next > 0;
      cost.text = next > 0 ? String(remain) : "";
      const zoom = Math.max(0.35, this.zoom);
      const pricePx = 18 / zoom;
      cost.style.fontSize = pricePx;
      cost.style.stroke = { color: broke ? 0x3a0c08 : 0x14301c, width: Math.max(1.25, pricePx * 0.1) };
      cost.style.fill = broke ? 0xff3b30 : 0xfff6df;
      const covered = Math.hypot(station.x - hero.x, station.y - hero.y) < plot * 0.7;
      cost.visible = (showPrice && !covered) || dwelling || broke;
      coin.visible = showPrice && !covered && !dwelling;
      if (covered && !broke) icon.visible = false;
      const shake = broke && !this.reduced ? Math.sin(this.time * 14) * 1.7 : 0;
      cost.position.set(station.x + shake - (dwelling || broke ? 0 : plot * 0.12), (dwelling || broke ? station.y - plot * 1.05 : station.y) + shake * 0.2);
      cost.alpha = fade;
      cost.zIndex = station.y + 5;
      const coinPx = Math.max(7, plot * 0.28);
      coin.scale.set(coinPx / Math.max(1, coin.texture.width));
      coin.position.set(station.x + plot * 0.28 + shake, station.y + 1);
      coin.alpha = fade;
      coin.zIndex = station.y + 5;
      const empty = station.tier === 0 && station.kind !== "wall";
      const ghost = this.padGhost(i);
      if (empty && close && isTower(station.kind)) {
        const kind = station.kind;
        const asset = towerAsset(kind);
        const clip = this.art.clip(asset, "idle") ?? this.art.clip(asset, "walk");
        if (clip) {
          ghost.texture = clip.frames[0]?.[0] ?? Texture.EMPTY;
          ghost.anchor.set(clip.anchorX, clip.anchorY);
          ghost.scale.set(clip.draw * TOWER_DRAW);
        }
        ghost.tint = color;
        ghost.alpha = 0.72;
        ghost.position.set(station.x, station.y + 8);
        ghost.zIndex = station.y - 1;
        ghost.visible = true;
        const radius = towerRange(kind, 0) * sim.rangeScale;
        this.dashRing(this.pads, station.x, station.y, radius, color, 0.38);
      } else {
        ghost.visible = false;
      }
      const hint = this.stationHint(i);
      hint.text = empty && close && station.kind !== "wall" ? ROLE_HINT[station.kind] : "";
      hint.visible = hint.text.length > 0 && Math.hypot(station.x - hero.x, station.y - hero.y) > 100;
      hint.position.set(station.x, station.y - 46);
      hint.zIndex = station.y + 6;
      const standing = away < BALANCE.fund.radius;
      if (standing && isTower(station.kind) && station.tier < 3 && !this.menu.visible) {
        const radius = towerRange(station.kind, Math.min(2, station.tier)) * sim.rangeScale;
        this.dashRing(this.pads, station.x, station.y, radius, color, 0.45);
      }
    });
    for (let i = sim.stations.length; i < this.stationLabels.length; i++) this.stationLabels[i].visible = false;
    for (let i = sim.stations.length; i < this.stationCosts.length; i++) this.stationCosts[i].visible = false;
    for (let i = sim.stations.length; i < this.stationCoins.length; i++) this.stationCoins[i].visible = false;
    for (let i = sim.stations.length; i < this.stationHints.length; i++) this.stationHints[i].visible = false;
    for (let i = sim.stations.length; i < this.padGhosts.length; i++) this.padGhosts[i].visible = false;
  }

  private padGhost(i: number): Sprite {
    let ghost = this.padGhosts[i];
    if (!ghost) {
      ghost = new Sprite(Texture.EMPTY);
      ghost.anchor.set(0.5, 0.85);
      ghost.alpha = 0.4;
      ghost.eventMode = "none";
      this.actors.addChild(ghost);
      this.padGhosts[i] = ghost;
    }
    return ghost;
  }

  private stationHint(i: number): Text {
    let label = this.stationHints[i];
    if (!label) {
      label = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 12, fill: 0xfff6df, fontWeight: "bold", align: "center", stroke: { color: 0x140e0a, width: 3 } },
      });
      label.anchor.set(0.5, 1);
      label.eventMode = "none";
      this.labels.addChild(label);
      this.stationHints[i] = label;
    }
    return label;
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
        style: { fontFamily: SANS, fontSize: 12, fill: 0xfff6df, fontWeight: "bold", align: "center", stroke: { color: 0x14301c, width: 3 } },
      });
      label.anchor.set(0.5);
      label.eventMode = "none";
      this.labels.addChild(label);
      this.stationCosts[i] = label;
    }
    return label;
  }

  private stationCoin(i: number): Sprite {
    let coin = this.stationCoins[i];
    if (!coin) {
      coin = new Sprite(this.art.frame("jade"));
      coin.anchor.set(0.5);
      coin.eventMode = "none";
      this.labels.addChild(coin);
      this.stationCoins[i] = coin;
    }
    return coin;
  }

  /** About 7.5% of the portrait width, in world units. */
  private padSize(): number {
    const zoom = Math.max(0.35, this.zoom);
    return Math.max(16, (this.viewW / zoom) * 0.075);
  }

  private padPlot(x: number, y: number, size: number, alpha = 1): void {
    const w = size;
    const h = size * 0.86;
    const left = x - w / 2;
    const top = y - h / 2;
    this.pads.roundRect(left, top + 2, w, h, 3).fill({ color: 0x0c3a18, alpha: 0.18 * alpha });
    this.pads.roundRect(left, top, w, h, 3).fill({ color: 0x1c8a40, alpha: 0.82 * alpha });
    this.dashBox(left, top, w, h, alpha);
  }

  private dashBox(x: number, y: number, w: number, h: number, alpha: number): void {
    const dash = Math.max(3.2, w * 0.16);
    const gap = dash * 0.7;
    const edges: [number, number, number, number][] = [
      [x, y, x + w, y],
      [x + w, y, x + w, y + h],
      [x + w, y + h, x, y + h],
      [x, y + h, x, y],
    ];
    for (const [x0, y0, x1, y1] of edges) {
      const len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const dx = (x1 - x0) / len;
      const dy = (y1 - y0) / len;
      let t = 0;
      while (t < len - 0.5) {
        const end = Math.min(len, t + dash);
        this.pads.moveTo(x0 + dx * t, y0 + dy * t);
        this.pads.lineTo(x0 + dx * end, y0 + dy * end);
        this.pads.stroke({ width: 1.6, color: 0xfff6ea, alpha: 0.95 * alpha });
        t += dash + gap;
      }
    }
  }

  private paintChevrons(map: MapDef): void {
    this.chevronGfx.clear();
    for (const route of map.routes) {
      let walked = 0;
      let next = 150;
      for (let i = 1; i < route.pts.length; i++) {
        const a = route.pts[i - 1];
        const b = route.pts[i];
        const sl = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        while (next < route.len - 90 && walked + sl >= next) {
          const t = (next - walked) / sl;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const tip = 14;
          const back = 9;
          const wide = 8;
          const nx = Math.cos(ang);
          const ny = Math.sin(ang);
          const px = -ny;
          const py = nx;
          this.chevronGfx.poly([
            x + nx * tip, y + ny * tip,
            x - nx * back + px * wide, y - ny * back + py * wide,
            x - nx * back - px * wide, y - ny * back - py * wide,
          ]).fill({ color: 0xfff6df, alpha: 0.9 });
          next += 210;
        }
        walked += sl;
      }
    }
  }

  private drawWall(sim: Siege, station: Station, index: number, fade = 1): void {
    const route = sim.map.routes[station.path];
    const pose = route ? poseAt(route, station.dist) : { x: station.x, y: station.y, angle: 0 };
    if (station.tier <= 0) {
      this.hideBuilt(index);
      this.padPlot(pose.x, pose.y, this.padSize(), fade);
      return;
    }
    const asset = station.tier >= 3 ? "wall_stone" : station.tier >= 2 ? "wall_spiked" : "wall_wood";
    const clip = this.art.clip(asset, "idle");
    if (!clip) return;
    const row = facingRow(pose.angle + Math.PI, clip.frames.length);
    const piece = this.showBuilt(index, asset, clip, row);
    piece.body.position.set(pose.x, pose.y);
    piece.body.zIndex = pose.y;
    piece.body.alpha = station.alive ? 1 : 0.4;
    piece.shadow.position.set(pose.x, pose.y);
    piece.shadow.alpha = station.alive ? 0.92 : 0.3;
    const heroOn = Math.hypot(pose.x - sim.heroX, pose.y - sim.heroY) < 56;
    if (station.alive && station.hurt > 0 && station.maxHp > 0 && !heroOn) {
      const w = 96;
      const u = Math.max(0, station.hp / station.maxHp);
      const bx = pose.x - w / 2;
      const by = pose.y - 70;
      this.pads.roundRect(bx, by, w, 8, 3).fill({ color: 0x102033, alpha: 0.9 });
      this.pads.roundRect(bx, by, w * u, 8, 3).fill({ color: 0x4aa3ff, alpha: 0.95 });
    }
  }

  private drawBarracks(station: Station, index: number): void {
    let asset = "tower_barracks_t1";
    if (station.tier >= 2 && station.spec === "spears") asset = "tower_spears_t3";
    else if (station.tier >= 2 && station.spec === "knights") asset = "tower_knights_t3";
    const clip = this.art.clip(asset, "idle");
    if (!clip) return;
    const piece = this.showBuilt(index, asset, clip, 0);
    piece.body.position.set(station.x, station.y);
    piece.body.zIndex = station.y;
    piece.shadow.position.set(station.x, station.y);
  }

  private showBuilt(index: number, asset: string, clip: Clip, row: number): { body: Sprite; shadow: Sprite; asset: string } {
    let piece = this.built.get(index);
    if (!piece) {
      piece = { body: this.takeSprite(clip.frames[0][0]), shadow: this.shadowSprite(), asset: "" };
      this.shadowLayer.addChild(piece.shadow);
      this.actors.addChild(piece.body);
      this.built.set(index, piece);
    }
    if (piece.asset !== asset) {
      const posed = frameAt(clip, row, 0, "idle");
      piece.body.texture = posed.texture;
      piece.body.anchor.set(posed.ax, posed.ay);
      piece.body.scale.set(clip.draw);
      piece.body.alpha = 1;
      piece.asset = asset;
      this.dressShadow(piece.shadow, asset, clip.draw);
    } else if (asset.startsWith("wall_")) {
      const posed = frameAt(clip, row, 0, "idle");
      piece.body.texture = posed.texture;
      piece.body.anchor.set(posed.ax, posed.ay);
    }
    piece.body.visible = true;
    piece.shadow.visible = true;
    return piece;
  }

  private hideBuilt(index: number): void {
    const piece = this.built.get(index);
    if (!piece) return;
    piece.body.visible = false;
    piece.shadow.visible = false;
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
    if (sim.payEpoch !== this.payEpoch) {
      this.payEpoch = sim.payEpoch;
      for (const gem of this.payGems) {
        gem.s.visible = false;
        this.payPool.push(gem.s);
      }
      this.payGems.length = 0;
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
    if (this.carryBadge) this.carryBadge.visible = false;
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
    const hero = sim.heroAt();
    const alive = sim.drops.filter((gem) => gem.alive);
    const shown = alive.length <= 40
      ? alive
      : [...alive].sort((a, b) => Math.hypot(a.x - hero.x, a.y - hero.y) - Math.hypot(b.x - hero.x, b.y - hero.y)).slice(0, 40);
    const seen = new Set<number>();
    let n = 0;
    const gemScale = 0.064;
    for (const gem of shown) {
      seen.add(gem.id);
      if (!this.dropBorn.has(gem.id)) this.dropBorn.set(gem.id, this.time);
      let sprite = this.dropSprites[n];
      if (!sprite) {
        sprite = new Sprite(this.art.frame("jade"));
        sprite.anchor.set(0.5);
        sprite.eventMode = "none";
        this.fxLayer.addChild(sprite);
        this.dropSprites.push(sprite);
      }
      const age = this.time - (this.dropBorn.get(gem.id) ?? this.time);
      const ang = ((gem.id * 47) % 360) * (Math.PI / 180);
      const scatter = 18 + (gem.id % 5) * 7;
      const popped = Math.sin(Math.min(1, age / 0.2) * Math.PI);
      const spread = Math.min(1, age / 0.2);
      let x = gem.x + Math.cos(ang) * scatter * spread;
      let y = gem.y + Math.sin(ang) * scatter * 0.62 * spread - popped * 28;
      let alpha = gem.life < 1.6 ? 0.45 + Math.sin(this.time * 14) * 0.25 : 1;
      const dist = Math.hypot(gem.x - hero.x, gem.y - hero.y);
      if (age >= 0.18 && dist < 280) {
        const u = Math.min(1, (age - 0.18) / 0.38);
        const e = u * u * (3 - 2 * u);
        const sx = gem.x + Math.cos(ang) * scatter;
        const sy = gem.y + Math.sin(ang) * scatter * 0.62;
        x = sx + (hero.x - sx) * e;
        y = sy + (hero.y - 34 - sy) * e - Math.sin(u * Math.PI) * 16;
        if (u >= 1) alpha = 0;
      } else if (age >= 0.2) {
        y += Math.sin(this.time * 6 + gem.id) * 2;
      }
      sprite.visible = alpha > 0.02;
      sprite.alpha = alpha;
      sprite.position.set(x, y);
      const pop = age < 0.16 ? 0.65 + Math.sin((age / 0.16) * Math.PI) * 0.45 : 1;
      sprite.scale.set(gemScale * pop);
      n += 1;
    }
    if (this.dropBorn.size > 80) {
      for (const id of this.dropBorn.keys()) if (!seen.has(id)) this.dropBorn.delete(id);
    }
    for (let i = n; i < this.dropSprites.length; i++) this.dropSprites[i].visible = false;
  }

  private drawShots(sim: Siege): void {
    this.shotUsed = 0;
    for (const shot of sim.shots) {
      if (!shot.alive) continue;
      const color = shot.family === "hero" ? 0xffe08a : TOWER_HUE[shot.family];
      if (shot.rain) continue;
      const fans = shot.family === "dart" ? 1 : 1;
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
    const arrow = shot.family === "dart";
    const tex = shot.family === "spire" ? "fx-orb" : shot.family === "lens" || shot.family === "hero" ? "fx-spear" : "fx-dart";
    const bolt = this.takeShot(arrow ? (this.art.prop("arrow") ?? this.art.frame("fx-dart")) : this.art.frame(tex));
    bolt.position.set(shot.x + ox, shot.y + oy);
    bolt.rotation = Math.atan2(shot.y - shot.py, shot.x - shot.px);
    const fat = shot.family === "lens" ? 2.4 : shot.family === "spire" ? 0.7 + shot.tier * 0.22 : 0.85 + shot.tier * 0.12;
    if (arrow) {
      const length = ((head ? 56 : 44) + shot.tier * 4) * ARROW_DRAW;
      const scale = length / Math.max(1, bolt.texture.width);
      bolt.anchor.set(0.5, 0.5);
      bolt.scale.set(scale);
      bolt.tint = 0xffffff;
      bolt.blendMode = "normal";
    } else if (shot.family === "hero") {
      bolt.anchor.set(0.2, 0.5);
      bolt.scale.set(0.42, 0.28);
      bolt.tint = 0xffe2a0;
      bolt.blendMode = "normal";
    } else if (shot.family === "lens") {
      bolt.anchor.set(0.15, 0.5);
      bolt.scale.set(0.48, 0.16);
      bolt.tint = 0xfffaf0;
      bolt.blendMode = "add";
    } else {
      bolt.anchor.set(0.15, 0.5);
      bolt.scale.set(head ? fat : fat * 0.72);
      bolt.tint = color;
      bolt.blendMode = "add";
    }
    bolt.alpha = head ? 1 : 0.55;
    const trail = this.takeShot(arrow ? (this.art.prop("arrow") ?? this.art.frame("fx-spear")) : this.art.frame("fx-spear"));
    const span = 14 + shot.tier * 4;
    const inv = Math.hypot(shot.x - shot.px, shot.y - shot.py) || 1;
    trail.position.set(shot.x + ox - ((shot.x - shot.px) / inv) * span, shot.y + oy - ((shot.y - shot.py) / inv) * span);
    trail.rotation = bolt.rotation;
    if (arrow) {
      trail.anchor.set(1, 0.5);
      trail.scale.set(bolt.scale.x * 0.2, bolt.scale.y * 0.12);
      trail.tint = 0xfff1c0;
      trail.alpha = 0.16;
      trail.blendMode = "add";
    } else if (shot.family === "hero") {
      trail.visible = false;
    } else {
      trail.anchor.set(0.15, 0.5);
      trail.scale.set(0.22, 0.16);
      trail.tint = color;
      trail.alpha = 0.55;
      trail.blendMode = "add";
    }
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
      const marked = e.boss || e.kind === "golem" || e.kind === "shield" || e.kind === "roller" || e.kind === "giant";
      if (!e.alive || e.kind === "skitter" || e.kind === "runner") continue;
      if (!marked && e.hp >= e.maxHp - 0.1) continue;
      const w = e.boss ? 74 : e.kind === "roller" ? 64 : e.kind === "golem" || e.kind === "shield" ? 44 : 28;
      const h = e.boss ? 7 : 5;
      const x = e.x - w / 2;
      const y = e.y - (e.boss ? 78 : e.kind === "roller" ? 118 : e.kind === "giant" ? 96 : e.kind === "golem" ? 64 : 48);
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
    const cap = Math.max(1, sim.integrityMax);
    const ratio = sim.integrity / cap;
    const low = ratio < 0.3 && sim.integrity > 0;
    const grow = (sim.integrity <= 0 ? 0.55 : 1 + sim.baseTier * 0.18) * (low ? 1 + Math.sin(this.time * 8) * 0.045 : 1);
    this.sun.scale.set(grow);
    this.sunFlash = Math.max(0, this.sunFlash - (step > 0 ? step : 0));
    this.disk.tint = this.sunFlash > 0 ? 0xfff6df : low ? 0xff6a4a : 0xffffff;
    if (low) {
      const puff = (this.time * 3) % 1;
      this.cracks.circle(Math.sin(this.time * 2) * 16, -this.plaza * 0.2 - puff * 28, 8 + puff * 10).fill({ color: 0x2a241c, alpha: (1 - puff) * 0.45 });
    }
    const bar = 64;
    this.cracks.roundRect(-bar / 2, -this.plaza - 18, bar, 7, 3).fill({ color: 0x1a120c, alpha: 0.9 });
    this.cracks.roundRect(-bar / 2, -this.plaza - 18, bar * Math.max(0, ratio), 7, 3).fill({ color: low ? 0xff3b30 : ratio > 0.45 ? 0xf0c14a : 0xff5a3c });
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
      this.heroLine.visible = false;
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
    const movedX = at.x - this.heroPX;
    const movedY = at.y - this.heroPY;
    if (this.heroPX >= 0 && sim.heroMoving && Math.hypot(movedX, movedY) > 0.15) this.heroFace = Math.atan2(movedY, movedX);
    this.heroPX = at.x;
    this.heroPY = at.y;
    const clip = this.art.clip("hero", "walk");
    if (clip) {
      const row = facingRow(sim.heroMoving ? this.heroFace : sim.guardianAim, clip.frames.length);
      const frames = clip.frames[Math.min(row, clip.frames.length - 1)] ?? [];
      if (frames.length > 0) {
        this.heroTime += step > 0 ? step : 0.016;
        const index = sim.heroMoving ? Math.floor(this.heroTime * 12) % frames.length : throwing ? Math.min(2, frames.length - 1) : 0;
        const tex = frames[index];
        const anchor = clip.anchors[Math.min(row, clip.anchors.length - 1)]?.[index];
        this.heroBody.texture = tex;
        this.heroBody.anchor.set(anchor?.x ?? clip.anchorX, anchor?.y ?? clip.anchorY);
        this.heroBody.scale.set(clip.draw * HERO_DRAW);
        this.heroLine.visible = false;
        const bob = sim.heroMoving ? Math.abs(Math.sin(this.heroTime * 11)) * -3 : Math.sin(this.time * 2.2) * -1;
        const lean = throwing ? Math.cos(sim.guardianAim) * 6 : 0;
        this.heroBody.position.set(lean, bob);
        if (!this.heroShadow) {
          this.heroShadow = this.shadowSprite();
          this.shadowLayer.addChild(this.heroShadow);
        }
        this.dressShadow(this.heroShadow, "hero", clip.draw * HERO_DRAW);
        this.heroShadow.position.set(at.x, at.y);
      }
    }
    this.heroRing.clear();
    this.heroRing.ellipse(0, 2, 10, 4).stroke({ width: 1.5, color: 0xffe08a, alpha: 0.55 });
    if (sim.guardianCast > 0) {
      const sweep = 1 - sim.guardianCast / Math.max(0.05, BALANCE.hero.cast);
      this.heroRing.arc(0, -4, 22, sim.guardianAim - 0.8, sim.guardianAim - 0.8 + sweep * 1.6).stroke({ width: 3, color: 0xfff6df, alpha: 0.85 });
    }
    const onPad = sim.stations.some((station) => station.tier < 3 && Math.hypot(station.x - at.x, station.y - at.y) < BALANCE.fund.radius + 8);
    if (onPad && !sim.heroMoving) {
      const bob = Math.sin(this.time * 7) * 3;
      this.heroRing.poly([0, -46 + bob, -5, -38 + bob, 5, -38 + bob]).fill({ color: 0xfff3c4, alpha: 0.9 });
    }
  }

  private syncPicker(sim: Siege): void {
    let branch = -1;
    let branchD = BALANCE.fund.radius + 8;
    sim.stations.forEach((station, i) => {
      if (station.tier !== 1 || station.spec !== "none" || !specChoices(station.kind)) return;
      const d = Math.hypot(station.x - sim.heroX, station.y - sim.heroY);
      if (d < branchD) {
        branchD = d;
        branch = i;
      }
    });
    if (branch >= 0 && !sim.heroMoving) {
      const station = sim.stations[branch];
      const choices = specChoices(station.kind);
      if (choices && this.pickerFor !== branch + 1000) {
        this.picker.removeChildren();
        this.pickerHits.length = 0;
        choices.forEach((spec, n) => {
          const button = this.makeSpec(spec, n, choices.length, branch);
          this.picker.addChild(button);
          this.pickerHits.push(button);
        });
        this.pickerFor = branch + 1000;
      }
      this.picker.visible = true;
      this.picker.position.set(station.x, station.y);
      this.picker.zIndex = station.y + 80;
      return;
    }
    this.picker.visible = false;
    this.pickerFor = -1;
  }

  private makeSpec(spec: Spec, n: number, total: number, index: number): Container {
    const node = TECH.find((item) => item.id === spec);
    const button = new Container();
    const ang = -Math.PI / 2 + (n - (total - 1) / 2) * 1.15;
    button.position.set(Math.cos(ang) * 96, Math.sin(ang) * 84 - 6);
    const plate = new Graphics();
    plate.roundRect(-58, -28, 116, 78, 12).fill({ color: 0x1c140e, alpha: 0.94 });
    plate.roundRect(-58, -28, 116, 78, 12).stroke({ width: 4, color: 0xffe08a });
    const title = new Text({
      text: node?.name ?? spec,
      style: { fontFamily: SANS, fontSize: 15, fill: 0xfff6df, fontWeight: "700", align: "center" },
    });
    title.anchor.set(0.5);
    title.position.set(0, -8);
    const line = new Text({
      text: node ? `${node.strong}` : "",
      style: { fontFamily: SANS, fontSize: 12, fill: 0xffe08a, align: "center", wordWrap: true, wordWrapWidth: 104 },
    });
    line.anchor.set(0.5, 0);
    line.position.set(0, 8);
    button.addChild(plate, title, line);
    button.eventMode = "static";
    button.cursor = "pointer";
    button.hitArea = new Circle(0, 8, 58);
    button.on("pointertap", (e) => {
      e.stopPropagation();
      this.onBranch?.(index, spec);
      this.pickerFor = -1;
    });
    return button;
  }

  private drawPuffs(dt: number): void {
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const puff = this.puffs[i];
      puff.life += dt;
      const u = puff.life / puff.max;
      if (u >= 1) {
        this.puffs.splice(i, 1);
        continue;
      }
      this.pads.circle(puff.x, puff.y - 4, 4 + u * 10).fill({ color: puff.color ?? 0xfff8f4, alpha: (1 - u) * 0.8 });
    }
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
      if (tower.kind !== "lens" || tower.ramp <= 0 || !tower.targetId) continue;
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
    const small = event.enemy === "skitter" || event.enemy === "runner" || event.enemy === "shard" || event.enemy === "glider" || event.enemy === "jaguar";
    if (small) {
      this.flingNearest(event.x, event.y, 0.05);
      return;
    }
    this.burst(event.x, event.y, 0xffffff, 6);
    this.burst(event.x, event.y, 0xfff0c2, 5);
    if (this.puffs.length < 28) this.puffs.push({ x: event.x, y: event.y, life: 0, max: 0.28 });
    this.bump(0.2);
  }

  /** Pop the body off the road so a swarm death reads as a fling, not a fade. */
  private flingNearest(x: number, y: number, hold = 0): void {
    let id = 0;
    let actor: Actor | null = null;
    let best = 72;
    for (const [key, body] of this.enemies) {
      const d = Math.hypot(body.body.x - x, body.body.y - y);
      if (d < best) {
        best = d;
        id = key;
        actor = body;
      }
    }
    if (!actor) return;
    this.enemies.delete(id);
    actor.shadow.visible = false;
    actor.body.tint = 0xffffff;
    actor.body.blendMode = "normal";
    actor.outline.visible = false;
    this.flings.push({
      body: actor.body,
      outline: actor.outline,
      vx: (Math.random() - 0.5) * 90,
      vy: -80 - Math.random() * 40,
      life: 0.18,
      hold,
      scale: actor.body.scale.x,
    });
  }

  private takeRain(): Sprite {
    const s = this.rainPool.pop();
    if (s) {
      s.visible = true;
      s.alpha = 1;
      this.dressRain(s);
      return s;
    }
    const arrow = this.art.prop("arrow") ?? this.art.frame("fx-dart");
    const made = new Sprite(arrow);
    made.anchor.set(0.5, 0.5);
    made.eventMode = "none";
    const streak = new Sprite(arrow);
    streak.eventMode = "none";
    made.addChild(streak);
    this.dressRain(made);
    this.fxLayer.addChild(made);
    return made;
  }

  /** The shaft keeps its painted fletching. The streak is a short faint tail, about a third of the arrow. */
  private dressRain(s: Sprite): void {
    s.blendMode = "normal";
    s.tint = 0xffffff;
    const streak = s.children[0] as Sprite | undefined;
    if (!streak) return;
    const w = Math.max(1, s.texture.width);
    streak.anchor.set(1, 0.5);
    streak.position.set(-w * 0.42, 0);
    streak.scale.set(0.22, 0.1);
    streak.alpha = 0.16;
    streak.tint = 0xfff1c0;
    streak.blendMode = "add";
    streak.visible = true;
  }

  private dropRain(s: Sprite): void {
    s.visible = false;
    this.rainPool.push(s);
  }

  /** A dense cloud of small arrows hangs over the spot the volley has chosen. */
  private loom(x: number, y: number, radius: number, golden = false): void {
    this.marks.push({ x, y, r: radius, life: 0, hot: false });
    const count = this.reduced ? 24 : golden ? 88 : 76;
    while (this.rains.length + count > 140) {
      const old = this.rains.findIndex((rain) => rain.phase === "stuck");
      if (old < 0) break;
      const gone = this.rains.splice(old, 1)[0];
      this.dropRain(gone.s);
    }
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius * 0.92;
      const gx = x + Math.cos(ang) * dist;
      const gy = y + Math.sin(ang) * dist * 0.86;
      const s = this.takeRain();
      s.tint = 0xffffff;
      const drop = 156 + Math.random() * 40;
      const run = drop * (3 / 4);
      const hx = gx - run;
      const hy = gy - drop;
      const fall = Math.atan2(drop, run);
      s.rotation = fall;
      const length = ((golden ? 68 : 52) + Math.random() * 8) * ARROW_DRAW;
      s.scale.set(length / Math.max(1, s.texture.width));
      s.position.set(hx, hy);
      this.rains.push({
        s,
        x: gx,
        y: gy,
        hx,
        hy,
        px: hx,
        py: hy,
        fx: gx,
        fy: gy,
        phase: "wait",
        t: 0,
        delay: 0.04 + Math.random() * 0.4,
        dusted: false,
        ang: fall,
      });
    }
  }

  /** The cloud falls onto the telegraph. Each arrow keeps its own delay. */
  private dive(x: number, y: number, radius: number): void {
    for (const rain of this.rains) {
      if (rain.phase !== "wait") continue;
      if (Math.hypot(rain.x - x, rain.y - y) > radius * 1.45) continue;
      rain.phase = "fall";
      rain.t = 0;
    }
    for (const mark of this.marks) {
      if (Math.hypot(mark.x - x, mark.y - y) < radius) mark.hot = true;
    }
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
    ghost.body.anchor.set(posed.ax, posed.ay);
    ghost.outline.anchor.set(posed.ax, posed.ay);
    ghost.outline.visible = false;
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
    gem.life = -Math.random() * 0.16;
    gem.s.visible = true;
    gem.s.alpha = 0;
    gem.s.scale.set(0.16);
    gem.s.position.set(gem.x, gem.y);
    this.gems.push(gem);
  }

  private makeGem(): Gem {
    const s = new Sprite(this.art.frame("jade"));
    s.anchor.set(0.5);
    s.scale.set(0.16);
    s.eventMode = "none";
    this.fxLayer.addChild(s);
    return { s, x: 0, y: 0, vx: 0, vy: 0, life: 0, n: 0 };
  }

  private flushBuckets(): void {
    for (let i = this.buckets.length - 1; i >= 0; i--) {
      const bucket = this.buckets[i];
      bucket.age += 0.016;
      if (bucket.age < 0.22) continue;
      this.floatText(bucket.x, bucket.y - 18, `+${bucket.n}`, 0xc8ffd8, bucket.n >= 12 ? 13 : 11);
      this.buckets.splice(i, 1);
    }
  }

  private drawGems(step: number): void {
    const dt = step > 0 ? step : 0.016;
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      gem.life += dt;
      if (gem.life < 0) {
        gem.s.alpha = 0;
        gem.s.position.set(gem.x, gem.y);
        continue;
      }
      gem.s.alpha = 1;
      if (gem.life < 0.14) {
        gem.x += gem.vx * dt;
        gem.y += gem.vy * dt;
        gem.s.position.set(gem.x, gem.y);
        const pop = 0.85 + Math.sin(Math.min(1, gem.life / 0.14) * Math.PI) * 0.35;
        gem.s.scale.set(0.11 * pop);
      } else {
        const t = Math.min(1, (gem.life - 0.14) / 0.7);
        const e = t * t;
        const arc = Math.sin(t * Math.PI) * -160;
        gem.s.position.set(
          gem.x + (this.gemGoal.x - gem.x) * e,
          gem.y + (this.gemGoal.y - gem.y) * e + arc,
        );
        gem.s.scale.set(0.11 * (1 - t * 0.25));
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
      if (this.bits.length > 80) {
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

  private drawRains(step: number): void {
    for (let i = this.marks.length - 1; i >= 0; i--) {
      const mark = this.marks[i];
      mark.life += step;
      const pulse = 0.28 + Math.sin(mark.life * 16) * 0.12;
      this.pads.circle(mark.x, mark.y, mark.r * (mark.hot ? 1 : 0.92)).stroke({
        width: 1.5,
        color: 0xfff6df,
        alpha: mark.hot ? Math.max(0, 0.28 - mark.life) : pulse * 0.35,
      });
      if (mark.life > (mark.hot ? 0.45 : 1.4)) this.marks.splice(i, 1);
    }
    for (let i = this.rains.length - 1; i >= 0; i--) {
      const rain = this.rains[i];
      rain.t += step;
      const streak = rain.s.children[0] as Sprite | undefined;
      if (rain.phase === "wait") {
        rain.px = rain.hx;
        rain.py = rain.hy + Math.sin(rain.t * 5 + rain.x) * 1.5;
        rain.s.rotation = rain.ang;
        if (streak) streak.visible = true;
        if (rain.t > 0.7) {
          rain.phase = "fall";
          rain.t = 0;
        }
      } else if (rain.phase === "fall") {
        if (rain.t < rain.delay) {
          rain.s.position.set(rain.hx, rain.hy);
          rain.s.rotation = rain.ang;
        } else {
          const u = Math.min(1, (rain.t - rain.delay) / 0.22);
          const e = u * u;
          rain.px = rain.hx + (rain.x - rain.hx) * e;
          rain.py = rain.hy + (rain.y - rain.hy) * e;
          rain.s.position.set(rain.px, rain.py);
          rain.s.rotation = rain.ang;
          if (u >= 1) {
            rain.phase = "stuck";
            rain.t = 0;
            rain.s.position.set(rain.x, rain.y);
            rain.s.rotation = rain.ang + (Math.random() - 0.5) * 0.35;
            if (streak) streak.visible = false;
            if (!rain.dusted) {
              rain.dusted = true;
              if (this.puffs.length < 140) {
                this.puffs.push({
                  x: rain.x,
                  y: rain.y,
                  life: 0,
                  max: 0.22,
                  color: 0xd9c4a2,
                });
              }
            }
          }
        }
      } else {
        rain.s.alpha = rain.t < 0.3 ? 1 : Math.max(0, 1 - (rain.t - 0.3) / 0.08);
        if (rain.t > 0.38) {
          this.dropRain(rain.s);
          this.rains.splice(i, 1);
          continue;
        }
      }
      if (rain.phase !== "stuck") rain.s.position.set(rain.px, rain.py);
      rain.s.zIndex = rain.y + 2;
    }
  }

  private drawFlings(step: number): void {
    for (let i = this.flings.length - 1; i >= 0; i--) {
      const fling = this.flings[i];
      const pop = fling.hold > 0 ? 1 : Math.max(0.35, fling.life / 0.18);
      fling.body.scale.set(fling.scale * pop);
      fling.body.tint = 0xffffff;
      fling.body.blendMode = "normal";
      if (fling.hold > 0) {
        fling.hold -= step;
        continue;
      }
      fling.life -= step;
      fling.vy += 700 * step;
      fling.body.x += fling.vx * step;
      fling.body.y += fling.vy * step;
      fling.outline.position.set(fling.body.x, fling.body.y + 2);
      fling.body.rotation += fling.vx * step * 0.01;
      fling.outline.rotation = fling.body.rotation;
      const fade = Math.max(0, fling.life / 0.18);
      fling.body.alpha = fade;
      fling.outline.alpha = fade * 0.8;
      if (fling.life <= 0) {
        fling.body.destroy();
        fling.outline.destroy();
        this.flings.splice(i, 1);
      }
    }
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
    this.callout.scale.set(1);
    this.calloutLife = 0.7;
  }

  private drawCallout(dt: number): void {
    if (this.calloutLife <= 0) return;
    this.calloutLife -= dt;
    const t = Math.max(0, this.calloutLife / 0.7);
    this.callout.alpha = Math.min(1, t * 3);
    if (this.calloutLife <= 0) this.callout.visible = false;
  }

  /** A small white number that hops off a hit and is gone before the next swing. */
  private popNumber(x: number, y: number, text: string): void {
    if (this.floats.length > 6) return;
    const floater = this.floatPool.pop() ?? this.makeFloat();
    floater.t.text = text;
    const big = Number(text) >= 80;
    floater.t.style.fontSize = big ? 14 : 11;
    floater.t.style.fill = 0xffffff;
    floater.t.position.set(x + ((this.floats.length % 5) - 2) * 3, y - 10);
    floater.t.alpha = 1;
    floater.t.visible = true;
    floater.life = 0.28;
    floater.max = 0.28;
    floater.vy = -70;
    this.floats.push(floater);
  }

  private floatText(x: number, y: number, text: string, fill: number, size: number): void {
    const near = this.floats.find((f) => f.t.visible && f.t.text === text && Math.hypot(f.t.x - x, f.t.y - y) < 140);
    if (near) {
      near.life = near.max;
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
    floater.life = 0.5;
    floater.max = 0.5;
    floater.vy = -28;
    this.floats.push(floater);
  }

  private makeFloat(): Floater {
    const t = new Text({
      text: "",
      style: { fontFamily: SANS, fontSize: 11, fill: 0xffffff, fontWeight: "bold", dropShadow: shadowStyle() },
    });
    t.anchor.set(0.5);
    t.eventMode = "none";
    this.fxLayer.addChild(t);
    return { t, life: 0, max: 0.5, vy: -30 };
  }

  private drawFloats(step: number): void {
    const dt = step > 0 ? step : 0;
    if (dt <= 0) return;
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const floater = this.floats[i];
      floater.life -= dt;
      floater.t.y += floater.vy * dt;
      floater.t.alpha = Math.max(0, floater.life / floater.max);
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
