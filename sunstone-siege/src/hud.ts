/**
 * Title, valley select, the battle bar, and the end screens.
 * Jade shown here is the demo token from the simulation. It is not a balance.
 */
import { Container, Graphics, NineSliceSprite, Rectangle, Sprite, Text, Texture } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, worldCount } from "./balance";
import { isUnlocked, type SaveData } from "./save";
import type { LanePlan } from "./sim";
import type { EnemyKind, Phase, RelicId, TowerKind } from "./types";

const SERIF = 'Palatino, "Palatino Linotype", Georgia, "Times New Roman", serif';
const SANS = 'Palatino, "Palatino Linotype", Georgia, serif';
const INK = 0x2a1608;

export interface HudState {
  integrity: number;
  jade: number;
  wave: number;
  waves: number;
  phase: Phase;
  speed: number;
  flare: number;
  flareReady: boolean;
  /** 1 when the Guardian can throw, 0 just after a throw. */
  guardian: number;
  buildLeft: number;
  hint: string;
  offer: { id: RelicId; name: string; blurb: string }[] | null;
  offerLeft: number;
  streak: number;
  purse: string;
  boss: string;
}

export interface TowerCard {
  name: string;
  blurb: string;
  tier: string;
  dps: string;
  range: string;
  targets: string;
  chip: string;
  delta: string;
  dealt: string;
  upgrade: string | null;
  sell: string;
  canUpgrade: boolean;
}

interface LaneNode {
  root: Container;
  plate: Graphics;
  arrow: Graphics;
  badge: Sprite;
  title: Text;
  extras: Text;
  icons: Sprite[];
  path: number;
}

export interface HudHooks {
  play: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  backTitle: () => void;
  startLevel: (index: number) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  quit: () => void;
  speed: () => void;
  flare: () => void;
  call: () => void;
  music: (v: number) => void;
  sfx: (v: number) => void;
  reduced: (v: boolean) => void;
  upgrade: () => void;
  sell: () => void;
  replay: () => void;
  next: () => void;
  pickRelic: (id: RelicId) => void;
}

export class Hud {
  readonly root = new Container();
  private readonly hits: Container[] = [];
  private readonly title = new Container();
  private readonly levels = new Container();
  private readonly play = new Container();
  private readonly pauseLayer = new Container();
  private readonly settingsLayer = new Container();
  private readonly endLayer = new Container();
  private readonly backdrop: Sprite;
  private readonly integrityText: Text;
  private readonly integrityFill: Graphics;
  private readonly jadeText: Text;
  private readonly waveText: Text;
  private readonly speedText: Text;
  private readonly callText: Text;
  private readonly callButton: Container;
  private readonly flareButton: Container;
  private readonly flareReady: Sprite;
  private readonly flareCool: Sprite;
  private readonly flareRing: Graphics;
  private guardianButton!: Container;
  private guardianRing!: Graphics;
  private guardianFace!: Sprite;
  private readonly hint: Text;
  private readonly offerLayer = new Container();
  private readonly offerNames: Text[] = [];
  private readonly offerBlurbs: Text[] = [];
  private readonly offerClock: Text;
  private offerIds: RelicId[] = [];
  private readonly banner: Text;
  private readonly card = new Container();
  private readonly cardName: Text;
  private readonly cardBody: Text;
  private readonly cardLine: Text;
  private readonly cardDelta: Text;
  private readonly cardDealt: Text;
  private readonly upgradeText: Text;
  private readonly streakText: Text;
  private readonly bossText: Text;
  private readonly purseText: Text;
  private upgradeButton!: Container;
  private readonly sellText: Text;
  private readonly endTitle: Text;
  private readonly endBody: Text;
  private readonly endStars: Text[] = [];
  private readonly nextButton: Container;
  private readonly levelCards: Container[] = [];
  private readonly levelStarSets: Text[][] = [];
  private readonly levelLocks: Text[] = [];
  private readonly musicSlider: Slider;
  private readonly sfxSlider: Slider;
  private readonly reducedText: Text;
  private bar!: Graphics;
  private jadeIcon!: Sprite;
  private readonly vault = new Container();
  private readonly vaultPlate = new Graphics();
  private readonly vaultBar = new Graphics();
  private readonly vaultGlow = new Graphics();
  private readonly vaultPlus: Text;
  private readonly vaultGoal: Text;
  private readonly vaultTip: Text;
  private readonly vaultTipPlate = new Graphics();
  private vaultTower!: Sprite;
  private readonly laneLayer = new Container();
  private readonly laneNodes: LaneNode[] = [];
  private readonly laneTip = new Container();
  private readonly laneTipBg = new Graphics();
  private readonly laneTipText: Text;
  private lanePlans: LanePlan[] = [];
  private laneCam = { zoom: 1, camX: 0, camY: 0 };
  private laneBuilding = false;
  private laneOffer = false;
  private openLane = -1;
  private laneTime = 0;
  private readonly laneFade = new Map<number, number>();
  private shownJade = 0;
  private jadeGoalN = 0;
  private landed = 0;
  private plusLife = 0;
  private plusShown = 0;
  private vaultBump = 0;
  private jadeCatch = 0;
  private jadePrimed = false;
  private goalCost = 50;
  private goalLabel = "Dart Totem  50";
  private vaultLit = false;
  private goalKind: TowerKind = "dart";
  private showTip = false;
  private vaultW = 340;
  private vaultH = 86;
  private readonly cardRange: Text;
  private readonly cardTargets: Text;
  private readonly cardChip: Text;
  private speedButton!: Container;
  private pauseButton!: Container;
  private gearButton!: Container;
  private reduced = false;
  private bannerLife = 0;
  private screen: "title" | "levels" | "play" = "title";
  private w = 800;
  private h = 450;

  constructor(private readonly art: ArtSet, private readonly hooks: HudHooks, save: SaveData) {
    this.backdrop = new Sprite();
    this.backdrop.eventMode = "none";
    this.root.addChild(this.backdrop, this.title, this.levels, this.play, this.pauseLayer, this.endLayer, this.settingsLayer);

    this.integrityText = label("Sunstone 0", 16, 0xf6e7c1);
    this.integrityFill = new Graphics();
    this.jadeText = label("0", 48, 0xf3ffe8);
    this.waveText = label("Wave 1/5", 16, 0xf6e7c1);
    this.speedText = label("1x", 16, 0x1a1208);
    this.callText = label("Call wave", 16, 0x1a1208);
    this.hint = label("", 16, 0xf6e7c1);
    this.hint.anchor.set(0.5);
    this.offerClock = label("", 16, 0xf6e7c1);
    this.offerClock.anchor.set(0.5);
    this.banner = label("", 28, 0xfff1c8);
    this.banner.anchor.set(0.5);
    this.flareReady = new Sprite(art.frame("flare"));
    this.flareCool = new Sprite(art.frame("flare-off"));
    this.flareRing = new Graphics();
    this.cardName = label("", 18, 0xf6e7c1);
    this.cardBody = label("", 13, 0xd9cbb0);
    this.cardLine = label("", 34, 0xfff6df);
    this.cardRange = label("", 22, 0xffe0a0);
    this.cardTargets = label("", 18, 0xf6e7c1);
    this.cardChip = label("", 16, 0xffe08a);
    this.cardDelta = label("", 20, 0x9dff8a);
    this.cardDealt = label("", 18, 0xf6e7c1);
    this.vaultPlus = label("", 28, 0xc8ffd8);
    this.vaultGoal = label("", 15, 0xffe08a);
    this.vaultTip = wrap("Defeat raiders to earn Jade. Spend Jade to build totems.", 300, 16, 0xfff6df);
    this.laneTipText = wrap("", 240, 16, 0xfff6df);
    this.upgradeText = label("Upgrade", 15, 0x1a1208);
    this.streakText = label("", 16, 0xffd56a);
    this.bossText = label("", 16, 0xffb0a0);
    this.purseText = wrap("", 280, 15, 0xfff6df);
    this.purseText.visible = false;
    this.sellText = label("Sell", 15, 0xf6e7c1);
    this.endTitle = label("", 36, 0xfff1c8);
    this.endTitle.anchor.set(0.5);
    this.endBody = label("", 16, 0xf6e7c1);
    this.endBody.anchor.set(0.5);

    this.buildTitle(art);
    this.buildLevels(art);
    this.callButton = this.button(this.callText, 250, 52, () => hooks.call());
    this.flareButton = new Container();
    this.buildPlay(art);
    this.buildPause();
    this.musicSlider = new Slider("Music", save.music, hooks.music);
    this.sfxSlider = new Slider("Effects", save.sfx, hooks.sfx);
    this.reduced = save.reduced;
    this.reducedText = label(this.reducedLine(), 16, 0xf6e7c1);
    this.buildSettings();
    this.nextButton = this.button(label("Next valley", 16, INK), 190, 50, () => hooks.next());
    this.buildOffer();
    this.buildEnd();
    this.refreshLevels(save);
    this.show("title");
  }

  show(screen: "title" | "levels" | "play"): void {
    this.screen = screen;
    this.title.visible = screen === "title";
    this.levels.visible = screen === "levels";
    this.play.visible = screen === "play";
    this.backdrop.visible = screen === "title" || screen === "levels";
    this.pauseLayer.visible = false;
    this.endLayer.visible = false;
    if (screen !== "play") this.settingsLayer.visible = false;
  }

  setBackdrop(texture: Sprite["texture"]): void {
    this.backdrop.texture = texture;
    this.layout(this.w, this.h);
  }

  layout(w: number, h: number): void {
    this.w = w;
    this.h = h;
    if (this.backdrop.texture) {
      const tw = this.backdrop.texture.width || 1;
      const th = this.backdrop.texture.height || 1;
      const k = Math.max(w / tw, h / th);
      this.backdrop.scale.set(k);
      this.backdrop.position.set((w - tw * k) / 2, (h - th * k) / 2);
    }
    this.title.position.set(w / 2, h / 2);
    this.title.scale.set(Math.max(0.62, Math.min(1, Math.min(w / 980, h / 640))));
    const narrowLevels = w < 700;
    this.levels.position.set(w / 2, h / 2);
    this.levels.scale.set(narrowLevels
      ? Math.min(1, w / 340, (h - 24) / 860)
      : Math.max(0.58, Math.min(1, Math.min(w / 1040, h / 620))));
    const heading = this.levels.children[0] as Container | undefined;
    const back = this.levels.children[1] as Container | undefined;
    if (heading) heading.position.y = narrowLevels ? -430 : -210;
    if (back) back.position.y = narrowLevels ? 400 : 230;
    this.levelCards.forEach((card, i) => {
      card.position.set(narrowLevels ? 0 : (i - 1) * 300, narrowLevels ? (i - 1) * 230 - 20 : 10);
    });
    this.placePlay(w, h);
    this.pauseLayer.position.set(w / 2, h / 2);
    this.settingsLayer.position.set(w / 2, h / 2);
    this.endLayer.position.set(w / 2, h / 2);
    this.fitModal(this.pauseLayer, w, h);
    this.fitModal(this.settingsLayer, w, h);
    this.fitModal(this.endLayer, w, h);
  }

  blocks(x: number, y: number): boolean {
    for (const c of this.hits) {
      if (!chainVisible(c)) continue;
      const b = c.getBounds();
      if (x >= b.x && y >= b.y && x <= b.x + b.width && y <= b.y + b.height) return true;
    }
    return false;
  }

  refreshLevels(save: SaveData): void {
    for (let i = 0; i < worldCount(); i++) {
      const open = isUnlocked(save.stars, i);
      this.levelCards[i].alpha = 1;
      this.levelLocks[i].visible = !open;
      const earned = save.stars[i] ?? 0;
      this.levelStarSets[i].forEach((star, s) => {
        star.tint = s < earned ? 0xffe08a : 0x4a4038;
      });
    }
  }

  sync(state: HudState): void {
    this.integrityText.text = `Sunstone ${Math.ceil(state.integrity)}`;
    const k = Math.max(0, Math.min(1, state.integrity / BALANCE.integrity));
    this.integrityFill.clear();
    this.integrityFill.roundRect(0, 0, 148, 8, 4).fill({ color: 0x1a120c });
    this.integrityFill.roundRect(0, 0, 148 * k, 8, 4).fill({ color: k > 0.45 ? 0xf0c14a : 0xff5a3c });
    this.jadeGoalN = state.jade;
    if (!this.jadePrimed) {
      this.shownJade = state.jade;
      this.jadePrimed = true;
    }
    if (this.shownJade > this.jadeGoalN) this.shownJade = this.jadeGoalN;
    this.jadeText.text = String(Math.round(this.shownJade));
    this.waveText.text = `Wave ${state.wave}/${state.waves}`;
    this.speedText.text = state.speed === 2 ? "2x" : "1x";
    this.streakText.text = state.streak >= 3 ? `${state.streak} streak` : "";
    this.bossText.text = state.boss;
    this.purseText.text = state.purse;
    const building = state.phase === "build";
    this.callButton.visible = building && !state.offer;
    if (building) {
      const secs = Math.max(0, Math.ceil(state.buildLeft));
      this.callText.text = state.buildLeft > 0.3 ? `Call early +${BALANCE.earlyCall}  ·  ${secs}s` : "Call wave";
    }
    this.hint.text = state.hint;
    this.hint.visible = state.hint.length > 0 && !state.offer && this.bannerLife <= 0;
    this.syncOffer(state);
    if (state.offer) this.card.visible = false;
    const charge = state.flare / BALANCE.flare.need;
    this.flareRing.clear();
    this.flareRing.circle(0, 0, 32).stroke({ width: 3, color: 0x3a3024, alpha: 0.9 });
    if (charge > 0) {
      this.flareRing.arc(0, 0, 32, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * charge).stroke({ width: 4, color: state.flareReady ? 0xfff1c2 : 0xffb03a });
    }
    this.flareReady.visible = state.flareReady;
    this.flareCool.visible = !state.flareReady;
    this.flareButton.scale.set(state.flareReady ? 1.04 : 1);
    if (this.guardianRing) {
      const ready = Math.max(0, Math.min(1, state.guardian));
      this.guardianRing.clear();
      this.guardianRing.circle(0, 0, 36).stroke({ width: 4, color: 0x3a3024, alpha: 0.9 });
      this.guardianRing.arc(0, 0, 36, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready).stroke({
        width: 5,
        color: ready >= 0.999 ? 0xffe08a : 0xffb03a,
      });
      this.guardianButton.alpha = ready >= 0.999 ? 1 : 0.92;
    }
  }

  setCard(card: TowerCard | null): void {
    this.card.visible = card !== null;
    if (!card) return;
    this.cardName.text = `${card.name}  ${card.tier}`;
    this.cardBody.text = card.blurb;
    this.cardLine.text = card.dps;
    this.cardRange.text = card.range;
    this.cardTargets.text = card.targets;
    this.cardChip.text = card.chip;
    this.cardDelta.text = card.delta;
    this.cardDealt.text = card.dealt;
    this.upgradeButton.visible = card.upgrade !== null;
    if (card.upgrade) this.upgradeText.text = card.upgrade;
    this.upgradeText.style.fill = card.canUpgrade ? INK : 0x8e1c14;
    this.upgradeButton.alpha = card.canUpgrade ? 1 : 0.85;
    this.sellText.text = card.sell;
  }

  callAnchor(): { x: number; y: number } {
    const p = this.callButton.getGlobalPosition();
    return { x: p.x, y: p.y };
  }

  laneAnchors(): { path: number; x: number; y: number }[] {
    return this.laneNodes.filter((n) => n.root.visible).map((n) => {
      const p = n.root.getGlobalPosition();
      return { path: n.path, x: p.x, y: p.y };
    });
  }

  /** Screen position of the gem the flying Jade aims at. */
  jadeAnchor(): { x: number; y: number } {
    const icon = this.jadeIcon;
    if (!icon) return { x: this.w / 2, y: 90 };
    const p = icon.getGlobalPosition();
    return { x: p.x, y: p.y };
  }

  private teachText: Text | null = null;
  private stickGfx: Graphics | null = null;

  setTeach(text: string): void {
    if (!this.teachText) {
      this.teachText = new Text({
        text: "",
        style: {
          fontFamily: SANS,
          fontSize: 40,
          fill: 0xfff6df,
          fontWeight: "bold",
          align: "center",
          stroke: { color: 0x140e0a, width: 6 },
        },
      });
      this.teachText.anchor.set(0.5, 0);
      this.teachText.eventMode = "none";
      this.play.addChild(this.teachText);
    }
    this.teachText.text = text;
    this.teachText.visible = text.length > 0;
    const below = this.vault.y + this.vaultH;
    this.teachText.position.set(this.w / 2, below + 112);
  }

  setStick(on: boolean, ox: number, oy: number, x: number, y: number): void {
    if (!this.stickGfx) {
      this.stickGfx = new Graphics();
      this.stickGfx.eventMode = "none";
      this.play.addChild(this.stickGfx);
    }
    this.stickGfx.clear();
    this.stickGfx.visible = on;
    if (!on) return;
    this.stickGfx.circle(ox, oy, 56).stroke({ width: 5, color: 0xfff1c8, alpha: 0.4 });
    this.stickGfx.circle(x, y, 24).fill({ color: 0xffe08a, alpha: 0.9 });
  }

  /** Jade arrived in the vault. The number rolls up from here. */
  collect(n: number): void {
    if (n <= 0) return;
    this.landed += n;
    this.plusShown += n;
    this.plusLife = 1.05;
    this.vaultBump = 1;
  }

  setGoal(text: string, cost: number, lit: boolean, kind: TowerKind): void {
    this.goalLabel = text;
    this.goalCost = Math.max(1, cost);
    this.vaultLit = lit;
    this.goalKind = kind;
  }

  setVaultTip(show: boolean): void {
    this.showTip = show;
  }

  syncLanes(plans: LanePlan[], cam: { zoom: number; camX: number; camY: number }, building: boolean, offer: boolean): void {
    this.lanePlans = plans;
    this.laneCam = cam;
    this.laneBuilding = building;
    this.laneOffer = offer;
  }

  announce(text: string): void {
    this.banner.text = text;
    this.bannerLife = 1.7;
    this.banner.alpha = 1;
    this.banner.visible = true;
  }

  tick(dt: number): void {
    this.laneTime += dt;
    this.drawVault(dt);
    this.drawLanes(dt);
    if (this.bannerLife <= 0) return;
    this.bannerLife -= dt;
    this.banner.alpha = Math.max(0, this.bannerLife / 0.4);
    if (this.bannerLife <= 0) this.banner.visible = false;
  }

  showPause(open: boolean): void {
    this.pauseLayer.visible = open;
    if (this.screen === "play" && !this.endLayer.visible) this.play.visible = !open;
  }

  showSettings(open: boolean): void {
    this.settingsLayer.visible = open;
    this.reducedText.text = this.reducedLine();
    if (open) {
      this.title.visible = false;
      this.levels.visible = false;
    } else if (this.screen !== "play") {
      this.title.visible = this.screen === "title";
      this.levels.visible = this.screen === "levels";
    }
  }

  showEnd(kind: "victory" | "defeat", stars: number, integrity: number, worldName: string, hasNext: boolean): void {
    this.endLayer.visible = true;
    this.pauseLayer.visible = false;
    this.play.visible = false;
    this.endTitle.text = kind === "victory" ? `${worldName} holds` : "The Sunstone cracks";
    this.endBody.text = kind === "victory"
      ? `Integrity ${Math.ceil(integrity)} of ${BALANCE.integrity}. The Jade stays in this demo.`
      : "The raiders reached the crater. The valley can be tried again.";
    this.endStars.forEach((star, i) => {
      star.visible = kind === "victory";
      star.tint = i < stars ? 0xffe08a : 0x4a4038;
    });
    this.nextButton.visible = kind === "victory" && hasNext;
  }

  private buildTitle(_art: ArtSet): void {
    const sub = wrap("Hold the crater. Jade is a demo token and has no cash value.", 460, 18, 0xfff6df);
    sub.position.set(0, 168);
    const play = this.button(label("Play", 22, INK), 240, 58, () => this.hooks.play());
    play.position.set(0, 230);
    const settings = this.button(label("Settings", 18, INK), 200, 50, () => this.hooks.openSettings());
    settings.position.set(0, 300);
    this.title.addChild(sub, play, settings);
    this.hits.push(play, settings);
  }

  private buildLevels(_art: ArtSet): void {
    const heading = new Text({ text: "Choose a valley", style: { fontFamily: SERIF, fontSize: 40, fill: 0xfff6df, fontWeight: "bold", dropShadow: { alpha: 0.9, angle: Math.PI / 2, blur: 6, color: 0x140c06, distance: 2 } } });
    heading.anchor.set(0.5);
    heading.position.set(0, -210);
    const back = this.button(label("Back", 16, INK), 150, 46, () => this.hooks.backTitle());
    back.position.set(0, 230);
    this.levels.addChild(heading, back);
    this.hits.push(back);
    for (let i = 0; i < worldCount(); i++) {
      const card = new Container();
      card.position.set((i - 1) * 300, 10);
      const plate = this.panel(280, 320);
      plate.position.set(0, 0);
      const name = new Text({ text: BALANCE.worlds[i].name, style: { fontFamily: SERIF, fontSize: 22, fill: 0xfff1c8, fontWeight: "bold", wordWrap: true, wordWrapWidth: 220, align: "center" } });
      name.anchor.set(0.5, 0);
      name.position.set(0, -110);
      const waves = label(`${BALANCE.worlds[i].waves.length} waves`, 15, 0xd9cbb0);
      waves.anchor.set(0.5);
      waves.position.set(0, -40);
      const stars: Text[] = [];
      for (let s = 0; s < 3; s++) {
        const star = label("★", 28, 0xffe08a);
        star.anchor.set(0.5);
        star.position.set(-40 + s * 40, 16);
        star.eventMode = "none";
        stars.push(star);
      }
      const lock = label("Locked", 16, 0xfff1c8);
      lock.anchor.set(0.5);
      lock.position.set(0, 78);
      lock.eventMode = "none";
      card.addChild(plate, name, waves, ...stars, lock);
      card.hitArea = new Rectangle(-140, -160, 280, 320);
      card.eventMode = "static";
      card.cursor = "pointer";
      card.on("pointertap", (e) => {
        e.stopPropagation();
        this.hooks.startLevel(i);
      });
      this.levels.addChild(card);
      this.levelCards.push(card);
      this.levelStarSets.push(stars);
      this.levelLocks.push(lock);
      this.hits.push(card);
    }
  }

  private buildPlay(art: ArtSet): void {
    const bar = new Graphics().roundRect(0, 0, 10, 52, 0).fill({ color: 0x140e0a, alpha: 0.82 });
    bar.eventMode = "none";
    const jadeIcon = new Sprite(art.frame("jade"));
    jadeIcon.anchor.set(0.5);
    jadeIcon.scale.set(0.38);
    jadeIcon.eventMode = "static";
    jadeIcon.cursor = "pointer";
    jadeIcon.on("pointertap", (e) => {
      e.stopPropagation();
      this.purseText.visible = !this.purseText.visible;
    });
    const speed = this.button(this.speedText, 86, 42, () => this.hooks.speed());
    const pause = this.button(label("Pause", 15, INK), 118, 42, () => this.hooks.pause());
    const gear = this.button(label("Settings", 14, INK), 132, 42, () => this.hooks.openSettings());
    this.flareReady.anchor.set(0.5);
    this.flareCool.anchor.set(0.5);
    this.flareReady.scale.set(0.46);
    this.flareCool.scale.set(0.46);
    this.flareReady.eventMode = "none";
    this.flareCool.eventMode = "none";
    const flareLabel = label("Flare", 13, 0xfff6df);
    flareLabel.anchor.set(0.5);
    flareLabel.position.set(0, 46);
    this.flareRing.eventMode = "none";
    this.flareButton.addChild(this.flareCool, this.flareReady, this.flareRing, flareLabel);
    this.flareButton.eventMode = "static";
    this.flareButton.cursor = "pointer";
    this.flareButton.on("pointertap", (e) => {
      e.stopPropagation();
      this.hooks.flare();
    });
    this.guardianButton = new Container();
    this.guardianRing = new Graphics();
    this.guardianRing.eventMode = "none";
    const guardianPlate = new Graphics();
    guardianPlate.circle(0, 0, 32).fill({ color: 0x1a120c });
    guardianPlate.circle(0, 0, 28).fill({ color: 0x4a3018 });
    guardianPlate.eventMode = "none";
    const idle = art.clip("guardian", "idle");
    this.guardianFace = new Sprite(idle?.frames[0]?.[0] ?? Texture.EMPTY);
    this.guardianFace.anchor.set(0.5, 0.38);
    this.guardianFace.scale.set(0.34);
    this.guardianFace.eventMode = "none";
    const guardianMask = new Graphics().circle(0, 0, 26).fill({ color: 0xffffff });
    guardianMask.eventMode = "none";
    this.guardianFace.mask = guardianMask;
    const guardianLabel = label("You", 13, 0xfff6df);
    guardianLabel.anchor.set(0.5);
    guardianLabel.position.set(0, 48);
    guardianLabel.eventMode = "none";
    this.guardianButton.addChild(guardianPlate, guardianMask, this.guardianFace, this.guardianRing, guardianLabel);
    this.guardianButton.eventMode = "static";
    this.guardianButton.on("pointertap", (e) => e.stopPropagation());
    this.hint.text = "Tap a stone pad beside a trail.";
    this.cardName.position.set(96, 28);
    this.cardChip.position.set(96, 64);
    this.cardLine.position.set(96, 96);
    this.cardRange.position.set(96, 142);
    this.cardTargets.position.set(96, 176);
    this.cardBody.style.wordWrap = true;
    this.cardBody.style.wordWrapWidth = 420;
    this.cardBody.position.set(96, 206);
    this.cardDelta.position.set(96, 252);
    this.cardDealt.position.set(96, 284);
    this.upgradeButton = this.button(this.upgradeText, 230, 58, () => this.hooks.upgrade());
    this.upgradeButton.position.set(175, 338);
    const upGem = new Sprite(art.frame("jade"));
    upGem.anchor.set(0.5);
    upGem.scale.set(0.28);
    upGem.position.set(96, 338);
    upGem.eventMode = "none";
    const sell = this.button(this.sellText, 180, 58, () => this.hooks.sell());
    sell.position.set(430, 338);
    const cardBg = this.panel(600, 400);
    cardBg.position.set(300, 200);
    cardBg.eventMode = "none";
    this.card.addChild(cardBg, this.cardName, this.cardChip, this.cardLine, this.cardRange, this.cardTargets, this.cardBody, this.cardDelta, this.cardDealt, upGem, this.upgradeButton, sell);
    this.card.visible = false;
    this.bar = bar;
    this.jadeIcon = jadeIcon;
    this.speedButton = speed;
    this.pauseButton = pause;
    this.gearButton = gear;
    this.vaultTower = new Sprite(Texture.EMPTY);
    this.vaultTower.anchor.set(0.5, 0.85);
    this.vaultTower.eventMode = "none";
    this.vaultPlus.anchor.set(0, 0.5);
    this.vaultGoal.anchor.set(0, 0.5);
    this.vaultTip.anchor.set(0.5, 0);
    this.vault.addChild(this.vaultPlate, this.vaultGlow, this.vaultBar, jadeIcon, this.jadeText, this.vaultPlus, this.vaultGoal, this.vaultTower, this.vaultTipPlate, this.vaultTip);
    this.vault.eventMode = "static";
    this.laneTip.addChild(this.laneTipBg, this.laneTipText);
    this.laneTip.visible = false;
    this.laneTip.eventMode = "static";
    this.laneLayer.eventMode = "passive";
    this.play.addChild(bar, this.integrityText, this.integrityFill, this.waveText, this.streakText, this.bossText, speed, pause, gear, this.vault, this.purseText, this.laneLayer, this.laneTip, this.callButton, this.guardianButton, this.flareButton, this.hint, this.banner, this.card, this.offerLayer);
    this.hits.push(speed, pause, gear, this.callButton, this.guardianButton, this.flareButton, this.card, bar, this.vault, this.laneTip);
    this.banner.visible = false;
  }

  private placePlay(w: number, h: number): void {
    const bar = this.bar;
    const jadeIcon = this.jadeIcon;
    const speed = this.speedButton;
    const pause = this.pauseButton;
    const gear = this.gearButton;
    if (!bar || !jadeIcon || !speed || !pause || !gear) return;
    const barH = w < 760 ? 112 : 56;
    bar.clear();
    bar.rect(0, 0, w, barH).fill({ color: 0x140e0a, alpha: 0.84 });
    bar.hitArea = new Rectangle(0, 0, w, barH);
    this.integrityText.position.set(16, 8);
    this.integrityFill.position.set(16, 34);
    const narrow = w < 760;
    this.vaultW = narrow ? Math.max(220, w - 16) : 360;
    this.vaultH = narrow ? 72 : 88;
    this.vault.position.set(narrow ? 8 : (w - this.vaultW) / 2, narrow ? barH + 6 : barH + 6);
    this.layoutVault(narrow);
    this.waveText.anchor.set(narrow ? 1 : 0.5, 0);
    this.waveText.position.set(narrow ? w - 12 : w / 2, 8);
    this.streakText.anchor.set(narrow ? 1 : 0, 0);
    this.streakText.position.set(narrow ? w - 12 : w / 2 + 90, narrow ? 30 : 16);
    if (narrow) {
      const gap = 8;
      const right = w - 10;
      gear.position.set(right - 66, 84);
      pause.position.set(right - 132 - gap - 59, 84);
      speed.position.set(right - 132 - gap - 118 - gap - 43, 84);
    } else {
      gear.position.set(w - 78, 28);
      pause.position.set(w - 214, 28);
      speed.position.set(w - 326, 28);
    }
    this.flareButton.position.set(w - 64, h - 64);
    this.guardianButton.position.set(w < 760 ? w - 64 : w - 156, w < 760 ? h - 168 : h - 64);
    this.callButton.scale.set(1);
    this.callButton.position.set(narrow ? Math.max(150, w / 2 - 70) : w / 2, h - 48);
    const belowVault = this.vault.y + this.vaultH;
    this.hint.style.wordWrap = true;
    this.hint.style.wordWrapWidth = Math.max(160, w - 28);
    this.banner.style.wordWrap = true;
    this.banner.style.wordWrapWidth = Math.max(200, w - 48);
    this.banner.style.align = "center";
    this.hint.position.set(w / 2, belowVault + (narrow ? 22 : 28));
    this.banner.position.set(w / 2, belowVault + (narrow ? 58 : 64));
    const cardScale = Math.min(1, (w - 8) / 600, Math.max(0.62, (h * 0.5) / 400));
    this.card.scale.set(cardScale);
    this.card.position.set(8, h - 400 * cardScale - 8);
    this.bossText.anchor.set(0.5, 0);
    this.bossText.position.set(w / 2, belowVault + (narrow ? 8 : 4));
    this.purseText.position.set(this.vault.x + 16, this.vault.y + this.vaultH + 4);
    this.offerLayer.position.set(w / 2, h / 2 + 10);
  }

  private buildOffer(): void {
    const dim = new Graphics().rect(-4000, -3000, 8000, 6000).fill({ color: 0x070c08, alpha: 0.55 });
    dim.eventMode = "static";
    const heading = new Text({
      text: "Choose a gift",
      style: { fontFamily: SERIF, fontSize: 32, fill: 0xfff1c8, fontWeight: "bold", align: "center" },
    });
    heading.anchor.set(0.5);
    heading.position.set(0, -188);
    heading.eventMode = "none";
    this.offerClock.position.set(0, -148);
    this.offerLayer.addChild(dim, heading, this.offerClock);
    this.hits.push(dim);
    for (let i = 0; i < 3; i++) {
      const card = new Container();
      card.position.set((i - 1) * 330, 24);
      const plate = this.panel(300, 230);
      const name = label("Gift", 18, 0xfff1c8);
      name.anchor.set(0.5, 0);
      name.position.set(0, -28);
      const blurb = new Text({
        text: "",
        style: {
          fontFamily: SANS,
          fontSize: 15,
          fill: 0xf6e7c1,
          align: "center",
          wordWrap: true,
          wordWrapWidth: 210,
          dropShadow: { alpha: 0.8, angle: Math.PI / 2, blur: 3, color: 0x140c06, distance: 1 },
        },
      });
      blurb.anchor.set(0.5, 0);
      blurb.position.set(0, 4);
      card.addChild(plate, name, blurb);
      card.eventMode = "static";
      card.cursor = "pointer";
      card.on("pointertap", (e) => {
        e.stopPropagation();
        const id = this.offerIds[i];
        if (id) this.hooks.pickRelic(id);
      });
      this.offerLayer.addChild(card);
      this.offerNames.push(name);
      this.offerBlurbs.push(blurb);
      this.hits.push(card);
    }
    this.offerLayer.visible = false;
  }

  private syncOffer(state: HudState): void {
    const open = !!state.offer && state.offer.length === 3 && state.phase === "build";
    this.offerLayer.visible = open;
    if (!open || !state.offer) return;
    this.offerIds = state.offer.map((r) => r.id);
    this.offerClock.text = `The wave waits. ${Math.max(1, Math.ceil(state.offerLeft))}s`;
    state.offer.forEach((relic, i) => {
      this.offerNames[i].text = relic.name;
      this.offerBlurbs[i].text = relic.blurb;
    });
  }

  private buildPause(): void {
    const dim = fullDim();
    const plate = this.panel(340, 420);
    const title = new Text({ text: "Paused", style: { fontFamily: SERIF, fontSize: 40, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -120);
    const resume = this.button(label("Resume", 18, INK), 240, 54, () => this.hooks.resume());
    resume.position.set(0, -30);
    const restart = this.button(label("Restart valley", 16, INK), 240, 50, () => this.hooks.restart());
    restart.position.set(0, 36);
    const settings = this.button(label("Settings", 16, INK), 240, 50, () => this.hooks.openSettings());
    settings.position.set(0, 96);
    const quit = this.button(label("Valley select", 16, INK), 240, 50, () => this.hooks.quit());
    quit.position.set(0, 156);
    this.pauseLayer.addChild(dim, plate, title, resume, restart, settings, quit);
    this.hits.push(dim, resume, restart, settings, quit);
    this.pauseLayer.visible = false;
  }

  private buildSettings(): void {
    const dim = fullDim();
    const plate = this.panel(380, 420);
    const title = new Text({ text: "Settings", style: { fontFamily: SERIF, fontSize: 36, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -160);
    this.musicSlider.root.position.set(-110, -70);
    this.sfxSlider.root.position.set(-110, -10);
    const toggle = this.button(this.reducedText, 280, 50, () => {
      this.reduced = !this.reduced;
      this.reducedText.text = this.reducedLine();
      this.hooks.reduced(this.reduced);
    });
    toggle.position.set(0, 70);
    const close = this.button(label("Close", 16, INK), 180, 48, () => this.hooks.closeSettings());
    close.position.set(0, 140);
    this.settingsLayer.addChild(dim, plate, title, this.musicSlider.root, this.sfxSlider.root, toggle, close);
    this.hits.push(dim, toggle, close, this.musicSlider.hit, this.sfxSlider.hit);
    this.settingsLayer.visible = false;
  }

  private buildEnd(): void {
    const dim = fullDim();
    const plate = this.panel(520, 420);
    for (let i = 0; i < 3; i++) {
      const star = label("★", 36, 0xffe08a);
      star.anchor.set(0.5);
      star.position.set(-56 + i * 56, -70);
      this.endStars.push(star);
    }
    this.endTitle.position.set(0, -140);
    this.endBody.position.set(0, -10);
    const replay = this.button(label("Play again", 16, INK), 190, 50, () => this.hooks.replay());
    replay.position.set(-100, 80);
    this.nextButton.position.set(100, 80);
    const map = this.button(label("Valleys", 16, INK), 170, 48, () => this.hooks.quit());
    map.position.set(0, 146);
    this.endLayer.addChild(dim, plate, this.endTitle, ...this.endStars, this.endBody, replay, this.nextButton, map);
    this.hits.push(dim, replay, this.nextButton, map);
    this.endLayer.visible = false;
  }

  private panel(w: number, h: number): NineSliceSprite {
    return this.stone(this.art.panel, w, h, 173, 127);
  }

  private stone(texture: Texture, w: number, h: number, insetX: number, insetY: number): NineSliceSprite {
    const border = Math.max(14, Math.min(insetX * 0.42, w * 0.2, h * 0.42));
    const s = border / insetX;
    const slice = new NineSliceSprite({
      texture,
      leftWidth: insetX,
      rightWidth: insetX,
      topHeight: insetY,
      bottomHeight: insetY,
      width: Math.max(insetX * 2 + 8, w / s),
      height: Math.max(insetY * 2 + 8, h / s),
      anchor: 0.5,
    });
    slice.scale.set(s);
    slice.eventMode = "none";
    return slice;
  }

  private button(text: Text, w: number, h: number, onClick: () => void): Container {
    const c = new Container();
    const face = this.stone(this.art.button, w, h, 115, 65);
    const pressed = this.stone(this.art.buttonDown, w, h, 115, 65);
    pressed.visible = false;
    text.style.fill = INK;
    text.anchor.set(0.5);
    c.addChild(face, pressed, text);
    const down = () => {
      face.visible = false;
      pressed.visible = true;
      pressed.y = 2;
      text.y = 2;
    };
    const up = () => {
      face.visible = true;
      pressed.visible = false;
      pressed.y = 0;
      text.y = 0;
    };
    c.on("pointerdown", down);
    c.on("pointerup", up);
    c.on("pointerupoutside", up);
    c.eventMode = "static";
    c.cursor = "pointer";
    c.on("pointertap", (e) => {
      e.stopPropagation();
      onClick();
    });
    return c;
  }

  private iconBase = 0.5;

  private layoutVault(narrow: boolean): void {
    const w = this.vaultW;
    const h = this.vaultH;
    this.vaultPlate.clear();
    this.vaultPlate.roundRect(0, 0, w, h, 20).fill({ color: 0x102018, alpha: 0.94 });
    this.vaultPlate.roundRect(0, 0, w, h, 20).stroke({ width: 5, color: 0x3d8f62 });
    const icon = narrow ? 46 : 64;
    this.iconBase = icon / Math.max(1, this.jadeIcon.texture.width);
    this.jadeIcon.scale.set(this.iconBase);
    this.jadeIcon.position.set(14 + icon / 2, h * 0.42);
    this.jadeText.style.fontSize = narrow ? 36 : 50;
    this.jadeText.position.set(14 + icon + 10, narrow ? 4 : 2);
    this.vaultPlus.position.set(14 + icon + 10, h * 0.42 + (narrow ? 18 : 22));
    this.vaultGoal.position.set(Math.min(w - 150, 14 + icon + 108), h - 22);
    this.vaultTower.position.set(w - 28, h - 10);
    this.vaultTip.position.set(w / 2, h + 6);
    this.vaultTip.style.wordWrapWidth = Math.min(360, Math.max(180, w - 8));
    this.vault.hitArea = new Rectangle(-6, -6, w + 12, h + 8);
  }

  private drawVault(dt: number): void {
    if (this.screen !== "play") return;
    if (this.landed > 0) {
      const step = Math.max(1, this.landed * Math.min(1, dt * 9));
      const add = Math.min(this.landed, step);
      this.shownJade = Math.min(this.jadeGoalN, this.shownJade + add);
      this.landed -= add;
      this.vaultBump = Math.max(this.vaultBump, 0.6);
    } else if (this.shownJade < this.jadeGoalN - 0.4) {
      this.jadeCatch += dt;
      if (this.jadeCatch > 0.65) this.shownJade += (this.jadeGoalN - this.shownJade) * Math.min(1, dt * 5);
    } else this.jadeCatch = 0;
    if (this.shownJade > this.jadeGoalN) this.shownJade = this.jadeGoalN;
    this.jadeText.text = String(Math.round(this.shownJade));
    const pop = 1 + Math.min(0.16, this.vaultBump * 0.16);
    this.jadeText.scale.set(pop);
    this.jadeIcon.scale.set(this.iconBase * (1 + Math.min(0.12, this.vaultBump * 0.12)));
    this.vaultGlow.clear();
    if (this.vaultBump > 0.04) {
      this.vaultGlow.roundRect(-6, -6, this.vaultW + 12, this.vaultH + 12, 22).stroke({ width: 7, color: 0xd8ffe8, alpha: Math.min(0.95, this.vaultBump) });
    }
    this.vaultBump = Math.max(0, this.vaultBump - dt * 2.2);
    this.plusLife -= dt;
    this.vaultPlus.visible = this.plusLife > 0 && this.plusShown > 0;
    this.vaultPlus.alpha = Math.max(0, Math.min(1, this.plusLife));
    this.vaultPlus.text = `+${Math.round(this.plusShown)}`;
    this.vaultPlus.position.set(this.jadeText.x + this.jadeText.width + 10, this.jadeText.y + 8 - (1 - Math.max(0, this.plusLife)) * 8);
    if (this.plusLife <= 0) this.plusShown = 0;
    const progress = Math.max(0, Math.min(1, this.shownJade / this.goalCost));
    const barW = Math.max(40, this.vaultW - 86);
    this.vaultBar.clear();
    this.vaultBar.roundRect(16, this.vaultH - 16, barW, 9, 4).fill({ color: 0x1a120c });
    this.vaultBar.roundRect(16, this.vaultH - 16, barW * progress, 9, 4).fill({ color: this.vaultLit ? 0xc8ffd8 : 0x3d8f62 });
    this.vaultGoal.text = this.goalLabel;
    this.paintGoalTower();
    this.vaultTip.visible = this.showTip;
    this.vaultTipPlate.visible = this.showTip;
    this.vaultTipPlate.clear();
    if (this.showTip) {
      const tw = Math.min(this.vaultW - 8, 360);
      const tx = (this.vaultW - tw) / 2;
      const ty = this.vaultH + 10;
      this.vaultTipPlate.roundRect(tx, ty, tw, 54, 12).fill({ color: 0x140e0a, alpha: 0.94 });
      this.vaultTipPlate.roundRect(tx, ty, tw, 54, 12).stroke({ width: 3, color: 0xffe08a });
      const cx = this.vaultW / 2;
      this.vaultTipPlate.poly([cx - 9, ty, cx + 9, ty, cx, ty - 10], true).fill({ color: 0xffe08a });
      this.vaultTip.position.set(this.vaultW / 2, ty + 8);
    }
    const extra = this.showTip ? 68 : 0;
    const underVault = this.vault.y + this.vaultH + extra;
    // Hint and the map title never show together. On a phone the hint sits
    // in the bottom-left grass, clear of the counter, the title, and Flare.
    if (this.w < 760) {
      this.hint.anchor.set(0, 1);
      this.hint.style.align = "left";
      this.hint.position.set(12, this.h - 18);
      this.hint.style.wordWrapWidth = Math.max(140, this.w - 160);
    } else {
      this.hint.anchor.set(0.5);
      this.hint.style.align = "center";
      this.hint.y = underVault + 14;
    }
    this.banner.y = underVault + (this.w < 760 ? 8 : 32);
    if (this.vaultLit) {
      this.vaultGlow.circle(this.vaultW - 28, this.vaultH - 28, 22).stroke({ width: 3, color: 0xffe08a, alpha: 0.9 });
    }
  }

  private paintGoalTower(): void {
    const name = this.goalKind === "spire" ? "serpent" : this.goalKind;
    const clip = this.art.clip(`tower_${name}_t1`, "idle");
    if (!clip) return;
    const frame = clip.frames[0][0];
    this.vaultTower.texture = frame;
    this.vaultTower.anchor.set(clip.anchorX, clip.anchorY);
    const target = this.w < 760 ? 34 : 42;
    this.vaultTower.scale.set(target / Math.max(1, frame.width));
    this.vaultTower.tint = this.vaultLit ? 0xffffff : 0x6e6860;
    this.vaultTower.alpha = this.vaultLit ? 1 : 0.45;
  }

  private ensureLanes(count: number): void {
    while (this.laneNodes.length < count) {
      const root = new Container();
      const arrow = new Graphics();
      const plate = new Graphics();
      const badge = new Sprite(Texture.EMPTY);
      badge.anchor.set(0.5, 0.82);
      badge.eventMode = "none";
      const title = label("", 18, 0xfff6df);
      title.anchor.set(0.5, 0);
      const extras = label("", 13, 0xffe0a0);
      extras.anchor.set(0.5, 0);
      const icons: Sprite[] = [];
      for (let i = 0; i < 3; i++) {
        const icon = new Sprite(Texture.EMPTY);
        icon.anchor.set(0.5, 0.85);
        icon.eventMode = "none";
        icon.visible = false;
        icons.push(icon);
      }
      root.addChild(arrow, plate, badge, ...icons, title, extras);
      root.eventMode = "static";
      root.cursor = "pointer";
      root.hitArea = new Rectangle(-220, -180, 460, 420);
      const node: LaneNode = { root, plate, arrow, badge, title, extras, icons, path: -1 };
      root.on("pointerover", () => { this.openLane = node.path; });
      root.on("pointertap", (e) => {
        e.stopPropagation();
        this.openLane = this.openLane === node.path ? -1 : node.path;
      });
      this.laneLayer.addChild(root);
      this.hits.push(root);
      this.laneNodes.push(node);
    }
  }

  private drawLanes(dt: number): void {
    const underway = this.lanePlans.some((p) => p.state === "gone" && (this.laneFade.get(p.path) ?? 1) > 0.04);
    const show = this.screen === "play" && !this.laneOffer && (this.laneBuilding || this.lanePlans.some((p) => p.state !== "gone") || underway);
    this.laneLayer.visible = show;
    if (!show) {
      this.laneTip.visible = false;
      return;
    }
    const plans = this.lanePlans;
    this.ensureLanes(plans.length);
    for (let i = plans.length; i < this.laneNodes.length; i++) this.laneNodes[i].root.visible = false;
    const short = Math.min(this.w, this.h);
    const k = (short * 0.12) / 176;
    const vaultBottom = this.vault.y + this.vaultH + 8;
    const occupied = this.arrowBlocks();
    const placed: { x: number; y: number; ext: { minX: number; minY: number; maxX: number; maxY: number } }[] = [];
    let callX = 0;
    let callY = 0;
    let callN = 0;
    let tipAt: { x: number; y: number; plan: LanePlan } | null = null;
    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      const node = this.laneNodes[i];
      node.path = plan.path;
      let fade = this.laneFade.get(plan.path) ?? 1;
      if (plan.state === "gone") fade = Math.max(0, fade - dt * 1.7);
      else fade = 1;
      this.laneFade.set(plan.path, fade);
      if (fade < 0.05) {
        node.root.visible = false;
        continue;
      }
      node.root.visible = true;
      const sx = this.laneCam.camX + plan.x * this.laneCam.zoom;
      const sy = this.laneCam.camY + plan.y * this.laneCam.zoom;
      let point = plan.angle;
      let px = Math.max(24, Math.min(this.w - 24, sx));
      let py = Math.max(vaultBottom, Math.min(this.h - 24, sy));
      if (!(sx > 24 && sx < this.w - 24 && sy > vaultBottom && sy < this.h - 24)) {
        point = Math.atan2(sy - py, sx - px);
      }
      const fit = this.fitArrow(px, py, point, k, occupied, { x: sx, y: sy });
      px = fit.x;
      py = fit.y;
      const drawK = fit.k;
      placed.push({ x: px, y: py, ext: fit.ext });
      occupied.push({
        x: px + fit.ext.minX - 10,
        y: py + fit.ext.minY - 10,
        w: fit.ext.maxX - fit.ext.minX + 20,
        h: fit.ext.maxY - fit.ext.minY + 20,
      });
      const bobAmp = this.reduced ? 0 : plan.state === "gone" ? 2 : 5;
      const bob = Math.sin(this.laneTime * 5.2 + plan.path * 1.3) * bobAmp;
      node.root.position.set(px - Math.cos(point) * bob, py - Math.sin(point) * bob);
      const pulse = this.reduced ? 1 : 1 + Math.sin(this.laneTime * (plan.state === "soon" ? 8.5 : 4.1) + plan.path) * (plan.state === "soon" ? 0.11 : 0.055);
      const shrink = plan.state === "gone" ? 0.78 : 1;
      node.root.scale.set(pulse * shrink);
      node.root.alpha = plan.state === "gone" ? fade : 1;
      const wobble = this.reduced ? 0 : Math.sin(this.laneTime * 3.4 + plan.path) * 0.08;
      this.paintArrow(node.arrow, point, drawK, wobble);
      const tail = -46 * drawK;
      const bx = Math.cos(point) * tail;
      const by = Math.sin(point) * tail;
      const badgeR = 44 * drawK;
      node.plate.clear();
      node.plate.circle(bx, by, badgeR + 8 * drawK).fill({ color: 0x2a1608 });
      node.plate.circle(bx, by, badgeR).fill({ color: 0x1a120c, alpha: 0.96 });
      node.plate.circle(bx, by, badgeR).stroke({ width: 8 * drawK, color: plan.state === "soon" ? 0xfff6d0 : 0xffe08a });
      const icon = enemyIcon(this.art, plan.lead, badgeR * 1.85);
      node.badge.texture = icon.texture;
      node.badge.anchor.set(icon.anchorX, icon.anchorY);
      node.badge.scale.set(icon.scale);
      node.badge.position.set(bx, by + badgeR * 0.08);
      const leadName = BALANCE.enemies[plan.lead].name;
      node.title.style.fontSize = Math.max(14, Math.round(20 * drawK));
      node.title.text = `${leadName}  x${plan.leadCount}`;
      while (node.title.width > this.w - 28 && node.title.style.fontSize > 18) node.title.style.fontSize = Number(node.title.style.fontSize) - 2;
      const chipW = Math.min(this.w - 16, Math.max(badgeR * 2.1, node.title.width + 28));
      const chipH = Math.max(36, node.title.height + 8);
      const chipY = by + badgeR + 6;
      const originX = node.root.position.x;
      const originScale = Math.abs(node.root.scale.x) || 1;
      let chipX = bx - chipW / 2;
      const chipScreen = (local: number) => originX + local * originScale;
      if (chipScreen(chipX) < 8) chipX = (8 - originX) / originScale;
      if (chipScreen(chipX + chipW) > this.w - 10) chipX = (this.w - 10 - originX) / originScale - chipW;
      node.plate.roundRect(chipX, chipY, chipW, chipH, 16).fill({ color: 0x140e0a, alpha: 0.94 });
      node.plate.roundRect(chipX, chipY, chipW, chipH, 16).stroke({ width: Math.max(4, 3.5 * drawK), color: 0xffe08a });
      node.title.position.set(chipX + chipW / 2, chipY + 4);
      const extras = plan.parts.filter((p) => p.kind !== plan.lead);
      node.extras.style.fontSize = Math.round(13 * Math.min(drawK, 2.2));
      node.extras.text = extras.map((p) => `${BALANCE.enemies[p.kind].name} x${p.count}`).join("   ");
      node.extras.position.set(bx, chipY + chipH + 2);
      const marks = extras.filter((p) => p.kind === "boss" || p.kind === "golem" || p.kind === "shield" || p.kind === "jaguar" || p.kind === "glider");
      node.icons.forEach((sprite, s) => {
        const mark = marks[s];
        if (!mark) {
          sprite.visible = false;
          return;
        }
        const face = enemyIcon(this.art, mark.kind, 34 * drawK);
        sprite.texture = face.texture;
        sprite.anchor.set(face.anchorX, face.anchorY);
        sprite.scale.set(face.scale);
        sprite.position.set(bx + (s - (marks.length - 1) / 2) * (40 * drawK), chipY + chipH + 28 * Math.min(drawK, 2));
        sprite.visible = extras.length > 0 && node.extras.text.length < 42;
      });
      node.root.hitArea = new Rectangle(fit.ext.minX, fit.ext.minY, Math.max(40, fit.ext.maxX - fit.ext.minX), Math.max(40, fit.ext.maxY - fit.ext.minY));
      callX += node.root.position.x;
      callY += node.root.position.y;
      callN += 1;
      if (plan.path === this.openLane) tipAt = { x: node.root.position.x, y: node.root.position.y, plan };
    }
    if (this.laneBuilding && callN > 0) {
      const compact = this.h < 480;
      this.callButton.scale.set(compact ? 0.78 : 1);
      const button = compact ? { minX: -100, maxX: 100, minY: -24, maxY: 24 } : { minX: -132, maxX: 132, minY: -30, maxY: 30 };
      const low = placed.reduce((best, spot) => (spot.y + spot.ext.maxY > best.y + best.ext.maxY ? spot : best), placed[0]);
      let x = callX / callN;
      let y = low.y + low.ext.maxY + 46;
      if (this.w < 760) {
        x = Math.min(150, this.w * 0.38);
        y = this.h - 64;
      }
      const bounds = this.screenBounds(button);
      const spot = this.clearOf(x, y, button, occupied, bounds, { x, y });
      this.callButton.position.set(spot.x, spot.y);
    }
    if (this.card.visible || !tipAt || !this.lanePlans.some((p) => p.path === this.openLane && p.state !== "gone")) {
      this.laneTip.visible = false;
      if (!this.lanePlans.some((p) => p.path === this.openLane)) this.openLane = -1;
      return;
    }
    const lines = tipAt.plan.parts.map((p) => `${BALANCE.enemies[p.kind].name}  x${p.count}`).join("\n");
    this.laneTipText.text = lines;
    const tw = 220;
    const th = 28 + tipAt.plan.parts.length * 22;
    let tx = tipAt.x + 88;
    let ty = tipAt.y - 20;
    if (tx + tw > this.w - 8) tx = tipAt.x - tw - 40;
    ty = Math.max(vaultBottom, Math.min(this.h - th - 8, ty));
    this.laneTipBg.clear();
    this.laneTipBg.roundRect(0, 0, tw, th, 12).fill({ color: 0x140e0a, alpha: 0.94 });
    this.laneTipBg.roundRect(0, 0, tw, th, 12).stroke({ width: 3, color: 0xffe08a });
    this.laneTipText.anchor.set(0.5, 0);
    this.laneTipText.position.set(tw / 2, 12);
    this.laneTip.position.set(tx, ty);
    this.laneTip.visible = true;
  }

  /** Screen rects an arrow must not cover: the top bar, the vault, the tower panel, and the corner buttons. */
  private arrowBlocks(): { x: number; y: number; w: number; h: number }[] {
    const blocks: { x: number; y: number; w: number; h: number }[] = [];
    blocks.push({ x: 0, y: 0, w: this.w, h: this.w < 760 ? 112 : 56 });
    const tip = this.showTip ? 36 : 2;
    blocks.push({ x: this.vault.x - 6, y: this.vault.y - 2, w: this.vaultW + 12, h: this.vaultH + tip });
    if (this.card.visible) {
      const b = this.card.getBounds();
      if (b.width > 8 && b.height > 8) blocks.push({ x: b.x, y: b.y, w: b.width, h: b.height });
    }
    for (const btn of [this.flareButton, this.guardianButton]) {
      if (!btn.visible) continue;
      const p = btn.getGlobalPosition();
      blocks.push({ x: p.x - 58, y: p.y - 58, w: 116, h: 132 });
    }
    return blocks;
  }

  /** Local bounds of the rotated arrow, the badge, and the count, around the arrow's origin. */
  private arrowExtent(angle: number, k: number): { minX: number; minY: number; maxX: number; maxY: number } {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rot = (x: number, y: number) => ({ x: x * c - y * s, y: x * s + y * c });
    const pts = [
      rot(-92 * k, -24 * k), rot(18 * k, -24 * k), rot(18 * k, 24 * k), rot(-92 * k, 24 * k),
      rot(-2 * k, -46 * k), rot(74 * k, 0), rot(-2 * k, 46 * k),
    ];
    const badgeR = 44 * k + 10;
    const bx = c * -46 * k;
    const by = s * -46 * k;
    const chipW = badgeR * 2.3;
    const chipH = 20 * k + 18;
    pts.push(
      { x: bx - badgeR, y: by - badgeR },
      { x: bx + badgeR, y: by + badgeR },
      { x: bx - chipW / 2, y: by + badgeR + 4 },
      { x: bx + chipW / 2, y: by + badgeR + chipH },
    );
    return {
      minX: Math.min(...pts.map((p) => p.x)),
      maxX: Math.max(...pts.map((p) => p.x)),
      minY: Math.min(...pts.map((p) => p.y)),
      maxY: Math.max(...pts.map((p) => p.y)),
    };
  }

  /** Largest arrow that stays on screen and misses every blocked rect, still nearest the lane entrance. */
  private fitArrow(
    x: number,
    y: number,
    angle: number,
    k: number,
    blocks: { x: number; y: number; w: number; h: number }[],
    entrance: { x: number; y: number },
  ): { x: number; y: number; k: number; ext: { minX: number; minY: number; maxX: number; maxY: number } } {
    const scales = [k];
    for (const smaller of [2.35, 2.1, 1.9, 1.7, 1.55, 1.35, 1.2]) if (smaller < k - 0.04) scales.push(smaller);
    let beside: { x: number; y: number; k: number; ext: { minX: number; minY: number; maxX: number; maxY: number } } | null = null;
    let fallback: { x: number; y: number; k: number; ext: { minX: number; minY: number; maxX: number; maxY: number } } | null = null;
    for (const scale of scales) {
      const ext = this.arrowExtent(angle, scale);
      const bounds = this.screenBounds(ext);
      if (bounds.left > bounds.right || bounds.top > bounds.bottom) continue;
      const spot = this.clearOf(x, y, ext, blocks, bounds, entrance);
      const clear = blocks.every((block) => !this.overlaps(spot.x, spot.y, ext, block));
      const placed = { x: spot.x, y: spot.y, k: scale, ext };
      if (!clear) {
        fallback ??= placed;
        continue;
      }
      // Stay on the entrance side when a slightly smaller arrow can. A clear spot
      // on the far side of the map is only kept when nothing nearer fits.
      if (Math.hypot(spot.x - x, spot.y - y) <= 72) return placed;
      beside ??= placed;
    }
    const ext = this.arrowExtent(angle, k);
    return beside ?? fallback ?? { x, y, k, ext };
  }

  private screenBounds(ext: { minX: number; minY: number; maxX: number; maxY: number }): { left: number; top: number; right: number; bottom: number } {
    return {
      left: 8 - ext.minX,
      right: this.w - 12 - ext.maxX,
      top: 8 - ext.minY,
      bottom: this.h - 8 - ext.maxY,
    };
  }

  private overlaps(
    px: number,
    py: number,
    ext: { minX: number; minY: number; maxX: number; maxY: number },
    block: { x: number; y: number; w: number; h: number },
  ): boolean {
    return px + ext.maxX > block.x && px + ext.minX < block.x + block.w && py + ext.maxY > block.y && py + ext.minY < block.y + block.h;
  }

  /**
   * Slide a graphic until it misses every blocked rect.
   * The chosen spot stays as close as possible to where the lane actually enters.
   */
  private clearOf(
    x: number,
    y: number,
    ext: { minX: number; minY: number; maxX: number; maxY: number },
    blocks: { x: number; y: number; w: number; h: number }[],
    bounds: { left: number; top: number; right: number; bottom: number },
    entrance: { x: number; y: number },
  ): { x: number; y: number } {
    const clamp = (px: number, py: number) => ({
      x: Math.max(bounds.left, Math.min(bounds.right, px)),
      y: Math.max(bounds.top, Math.min(bounds.bottom, py)),
    });
    const candidates = [clamp(x, y)];
    const gap = 16;
    for (const block of blocks) {
      candidates.push(
        clamp(x, block.y - ext.maxY - gap),
        clamp(block.x + block.w - ext.minX + gap, y),
        clamp(block.x - ext.maxX - gap, y),
        clamp(x, block.y + block.h - ext.minY + gap),
      );
    }
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i];
        const b = blocks[j];
        candidates.push(
          clamp(a.x + a.w - ext.minX + gap, b.y - ext.maxY - gap),
          clamp(b.x + b.w - ext.minX + gap, a.y - ext.maxY - gap),
          clamp(a.x - ext.maxX - gap, b.y - ext.maxY - gap),
          clamp(b.x - ext.maxX - gap, a.y - ext.maxY - gap),
        );
      }
    }
    if (bounds.right > bounds.left && bounds.bottom > bounds.top) {
      const stepX = Math.max(48, (bounds.right - bounds.left) / 5);
      const stepY = Math.max(40, (bounds.bottom - bounds.top) / 4);
      for (let gx = bounds.left; gx <= bounds.right + 0.5; gx += stepX) {
        for (let gy = bounds.top; gy <= bounds.bottom + 0.5; gy += stepY) candidates.push({ x: gx, y: gy });
      }
    }
    const open = candidates.filter((spot) => blocks.every((block) => !this.overlaps(spot.x, spot.y, ext, block)));
    const pool = open.length ? open : [clamp(x, y)];
    pool.sort((a, b) => {
      const da = Math.hypot(a.x - x, a.y - y) + Math.hypot(a.x - entrance.x, a.y - entrance.y) * 0.45;
      const db = Math.hypot(b.x - x, b.y - y) + Math.hypot(b.x - entrance.x, b.y - entrance.y) * 0.45;
      return da - db;
    });
    return pool[0];
  }

  private paintArrow(g: Graphics, angle: number, k: number, wobble: number): void {
    g.clear();
    g.rotation = angle + wobble;
    const ink = 0x2a1608;
    const outline = Math.max(2, 3.2 * k);
    const shaftH = 34 * k;
    const shaftX = -86 * k;
    const shaftW = 98 * k;
    g.roundRect(shaftX, -shaftH / 2, shaftW, shaftH, 18 * k).fill({ color: 0xfff1b0 });
    g.roundRect(shaftX, -shaftH / 2, shaftW, shaftH, 18 * k).stroke({ width: outline, color: ink });
    g.roundRect(shaftX + 12 * k, -shaftH * 0.28, shaftW * 0.4, shaftH * 0.32, 10 * k).fill({ color: 0xfffce8 });
    const base = 4 * k;
    const tip = 66 * k;
    const half = 38 * k;
    g.poly([base, -half, tip, 0, base, half], true).fill({ color: 0xff3a2a });
    g.poly([base, -half, tip, 0, base, half], true).stroke({ width: outline, color: ink });
    g.poly([base + 14 * k, -half * 0.38, tip * 0.58, -4 * k, base + 16 * k, -3 * k], true).fill({ color: 0xffe08a });
  }

  private fitModal(layer: Container, w: number, h: number): void {
    layer.scale.set(Math.max(0.6, Math.min(1, Math.min(w / 720, h / 560))));
  }

  private reducedLine(): string {
    return this.reduced ? "Reduced motion: on" : "Reduced motion: off";
  }
}

class Slider {
  readonly root = new Container();
  readonly hit: Container;
  private readonly handle = new Graphics();
  private value: number;

  constructor(caption: string, value: number, onChange: (v: number) => void) {
    this.value = value;
    const name = label(caption, 14, 0xd9cbb0);
    name.position.set(0, -22);
    const track = new Graphics().roundRect(0, 0, 220, 8, 4).fill({ color: 0x3a3228 });
    this.handle.circle(0, 4, 11).fill({ color: 0xf0d7a2 });
    this.handle.x = value * 220;
    this.handle.eventMode = "none";
    track.eventMode = "static";
    track.cursor = "pointer";
    track.hitArea = new Rectangle(-8, -18, 236, 44);
    let dragging = false;
    const apply = (globalX: number) => {
      const local = track.toLocal({ x: globalX, y: 0 });
      this.value = Math.max(0, Math.min(1, local.x / 220));
      this.handle.x = this.value * 220;
      onChange(this.value);
    };
    track.on("pointerdown", (e) => {
      dragging = true;
      apply(e.global.x);
    });
    track.on("globalpointermove", (e) => {
      if (dragging) apply(e.global.x);
    });
    track.on("pointerup", () => { dragging = false; });
    track.on("pointerupoutside", () => { dragging = false; });
    this.root.addChild(name, track, this.handle);
    this.hit = track;
  }
}

function label(text: string, size: number, fill: number): Text {
  return new Text({
    text,
    style: {
      fontFamily: SANS,
      fontSize: size,
      fill,
      fontWeight: "bold",
      dropShadow: { alpha: 0.85, angle: Math.PI / 2, blur: 4, color: 0x140c06, distance: 1 },
    },
  });
}

function wrap(text: string, width: number, size: number, fill: number): Text {
  const t = new Text({
    text,
    style: {
      fontFamily: SANS,
      fontSize: size,
      fill,
      align: "center",
      wordWrap: true,
      wordWrapWidth: width,
      dropShadow: { alpha: 0.9, angle: Math.PI / 2, blur: 5, color: 0x140c06, distance: 1 },
    },
  });
  t.anchor.set(0.5);
  return t;
}

function fullDim(): Graphics {
  const g = new Graphics().rect(-4000, -3000, 8000, 6000).fill({ color: 0x070c08, alpha: 0.9 });
  g.eventMode = "static";
  return g;
}

function enemyIcon(art: ArtSet, kind: EnemyKind, px = 84): { texture: Texture; scale: number; anchorX: number; anchorY: number } {
  const asset = kind === "shield" ? "enemy_shieldbearer" : kind === "shard" ? "enemy_golem" : `enemy_${kind}`;
  const loco = kind === "skitter" || kind === "jaguar" ? "run" : kind === "glider" ? "fly" : "walk";
  const clip = art.clip(asset, loco) ?? art.clip(asset, "idle");
  if (!clip) return { texture: Texture.EMPTY, scale: 0.2, anchorX: 0.5, anchorY: 0.5 };
  const frame = clip.frames[0][0];
  return {
    texture: frame,
    scale: px / Math.max(1, frame.height),
    anchorX: 0.5,
    anchorY: 0.62,
  };
}

function chainVisible(c: Container): boolean {
  let n: Container | null = c;
  while (n) {
    if (!n.visible) return false;
    n = n.parent;
  }
  return true;
}
