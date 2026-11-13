/**
 * Title, valley select, the battle bar, and the end screens.
 * Jade shown here is the demo token from the simulation. It is not a balance.
 */
import { Container, Graphics, NineSliceSprite, Rectangle, Sprite, Text, Texture } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, TECH, worldCount } from "./balance";
import { isUnlocked, type SaveData } from "./save";
import type { LanePlan } from "./sim";
import type { Phase, RelicId, TowerKind } from "./types";

const SERIF = 'Palatino, "Palatino Linotype", Georgia, "Times New Roman", serif';
const SANS = 'Palatino, "Palatino Linotype", Georgia, serif';
const INK = 0x2a1608;

export interface HudState {
  integrity: number;
  integrityMax?: number;
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
  private readonly treeLayer = new Container();
  private hpTarget: number = BALANCE.integrity;
  private hpCap: number = BALANCE.integrity;
  private hpShown: number = BALANCE.integrity;
  private hpLag: number = BALANCE.integrity;
  private hpW = 220;
  private readonly backdrop: Sprite;
  private readonly wordmark: Sprite;
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
  private hintLife = 0;
  private hintShown = "";
  private hintPlate: Graphics | null = null;
  private treeDetail!: Text;
  private introLife = 0;
  private safeTop = 0;
  private safeBottom = 0;
  private intro!: Container;
  private introTitle!: Text;
  private introBody!: Text;
  private screen: "title" | "levels" | "play" = "title";
  private w = 800;
  private h = 450;

  constructor(private readonly art: ArtSet, private readonly hooks: HudHooks, save: SaveData) {
    this.backdrop = new Sprite();
    this.backdrop.eventMode = "none";
    this.wordmark = new Sprite();
    this.wordmark.anchor.set(0.5, 0);
    this.wordmark.eventMode = "none";
    this.wordmark.visible = false;
    this.root.addChild(this.backdrop, this.wordmark, this.title, this.levels, this.play, this.pauseLayer, this.endLayer, this.settingsLayer, this.treeLayer);

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
    this.buildTree();
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
    this.wordmark.visible = screen === "title";
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
    const portrait = h > w * 1.05;
    if (this.backdrop.texture) {
      const tw = this.backdrop.texture.width || 1;
      const th = this.backdrop.texture.height || 1;
      let k = Math.max(w / tw, h / th);
      let y = (h - th * k) / 2;
      // title.webp bakes the wordmark into its top ~340px. A phone cover-crop
      // leaves only the middle of that line ("NSTONE SI"). Frame below it so
      // the screen stays filled, and draw the full logo over the sky.
      if (portrait && this.screen === "title") {
        const band = 340;
        k = Math.max(k, h / Math.max(1, th - band));
        y = -band * k;
      }
      this.backdrop.scale.set(k);
      this.backdrop.position.set((w - tw * k) / 2, y);
    }
    this.title.position.set(w / 2, h / 2);
    let titleScale = Math.max(0.62, Math.min(1, Math.min(w / 980, h / 640)));
    if (portrait) {
      // Settings is 50 local px. Keep every title plate at least 44 CSS px tall.
      titleScale = Math.min(Math.max(titleScale, 44 / 50), (w - 24) / 240);
    }
    this.title.scale.set(titleScale);
    const showLogo = portrait && this.screen === "title" && !this.settingsLayer.visible && !!this.wordmark.texture?.width;
    if (showLogo) {
      const fit = w / this.wordmark.texture.width;
      this.wordmark.scale.set(fit);
      this.wordmark.position.set(w / 2, Math.max(4, h * 0.012));
    }
    this.wordmark.visible = showLogo;
    const cols = w < 800 ? 2 : 4;
    const gapX = 184;
    const gapY = 168;
    const rows = Math.max(1, Math.ceil(this.levelCards.length / cols));
    this.levelCards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      card.position.set((col - (cols - 1) / 2) * gapX, (row - (rows - 1) / 2) * gapY);
    });
    const gridW = (cols - 1) * gapX + 176;
    const gridH = (rows - 1) * gapY + 160 + 220;
    this.levels.position.set(w / 2, h / 2);
    this.levels.scale.set(Math.min(1, (w - 12) / gridW, (h - 16) / gridH));
    const heading = this.levels.children[0] as Container | undefined;
    const back = this.levels.children[1] as Container | undefined;
    const treeBtn = this.levels.children[2] as Container | undefined;
    const foot = ((rows - 1) / 2) * gapY + 118;
    if (heading) heading.position.y = -((rows - 1) / 2) * gapY - 108;
    if (back) back.position.set(-90, foot);
    if (treeBtn) treeBtn.position.set(90, foot);
    this.placePlay(w, h);
    this.pauseLayer.position.set(w / 2, h / 2);
    this.treeLayer.position.set(w / 2, h / 2);
    this.treeLayer.scale.set(Math.min(1, (w - 8) / 360, (h - 8) / 640));
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
    this.hpTarget = state.integrity;
    this.hpCap = Math.max(1, state.integrityMax ?? BALANCE.integrity);
    this.integrityText.text = `Base ${Math.ceil(state.integrity)}`;
    this.drawHp();
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
      this.callText.text = state.buildLeft > 0.3 ? (this.w < 760 ? `Call +${BALANCE.earlyCall} · ${secs}s` : `Call early +${BALANCE.earlyCall}  ·  ${secs}s`) : "Call wave";
    }
    if (state.hint !== this.hintShown) {
      this.hintShown = state.hint;
      this.hint.text = state.hint;
      if (state.hint.length > 0) {
        this.hintLife = 2.8;
        this.hint.alpha = 1;
      }
    }
    this.hint.visible = this.hintLife > 0 && this.hintShown.length > 0 && !state.offer && this.bannerLife <= 0;
    if (this.hintPlate) this.hintPlate.visible = this.hint.visible;
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
    void text;
    if (this.teachText) this.teachText.visible = false;
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
    void text;
    void cost;
    void lit;
    void kind;
  }

  setVaultTip(show: boolean): void {
    this.showTip = show;
    void this.showTip;
  }

  private lanePads: { x: number; y: number }[] = [];

  syncLanes(
    plans: LanePlan[],
    cam: { zoom: number; camX: number; camY: number },
    building: boolean,
    offer: boolean,
    pads: { x: number; y: number }[] = [],
  ): void {
    this.lanePlans = plans;
    this.laneCam = cam;
    this.laneBuilding = building;
    this.laneOffer = offer;
    this.lanePads = pads;
    void this.laneCam;
    void this.lanePads;
  }

  announce(text: string): void {
    this.banner.text = text;
    this.bannerLife = 1.05;
    this.banner.alpha = 1;
    this.banner.visible = true;
  }

  /** Notch and home-indicator insets, in screen pixels. */
  setSafe(top: number, bottom: number): void {
    this.safeTop = top;
    this.safeBottom = bottom;
  }

  /** First time a raider appears. It uses the bottom toast so the plate never sits on the fight. */
  showIntro(name: string, weak: string): void {
    this.announce(`${name} · ${weak}`);
    this.bannerLife = 1.5;
    if (this.intro) this.intro.visible = false;
  }

  tick(dt: number): void {
    this.laneTime += dt;
    this.hpShown += (this.hpTarget - this.hpShown) * Math.min(1, dt * 8);
    this.hpLag += (this.hpShown - this.hpLag) * Math.min(1, dt * 2.2);
    this.drawHp();
    this.drawVault(dt);
    this.drawLanes(dt);
    if (this.introLife > 0) {
      this.introLife -= dt;
      this.intro.alpha = this.introLife < 0.4 ? Math.max(0, this.introLife / 0.4) : 1;
      if (this.introLife <= 0) this.intro.visible = false;
    }
    if (this.hintLife > 0) {
      this.hintLife -= dt;
      const fade = this.hintLife < 0.4 ? Math.max(0, this.hintLife / 0.4) : 1;
      this.hint.alpha = fade;
      if (this.hintPlate) this.hintPlate.alpha = fade;
      if (this.hintLife <= 0) {
        this.hint.visible = false;
        if (this.hintPlate) this.hintPlate.visible = false;
      }
    }
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
      this.wordmark.visible = false;
      this.levels.visible = false;
    } else if (this.screen !== "play") {
      this.title.visible = this.screen === "title";
      this.wordmark.visible = this.screen === "title" && this.h > this.w * 1.05;
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

  private buildTitle(art: ArtSet): void {
    this.wordmark.texture = art.logo;
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
    back.position.set(-90, 300);
    const tree = this.button(label("Tech tree", 16, INK), 170, 46, () => this.toggleTree());
    tree.position.set(90, 300);
    this.levels.addChild(heading, back, tree);
    this.hits.push(back, tree);
    for (let i = 0; i < worldCount(); i++) {
      const card = new Container();
      const plate = this.panel(168, 150);
      plate.position.set(0, 0);
      const name = new Text({ text: BALANCE.worlds[i].name, style: { fontFamily: SERIF, fontSize: 16, fill: 0xfff1c8, fontWeight: "bold", wordWrap: true, wordWrapWidth: 148, align: "center" } });
      name.anchor.set(0.5, 0);
      name.position.set(0, -58);
      const waves = label(`${BALANCE.worlds[i].waves.length} waves`, 13, 0xd9cbb0);
      waves.anchor.set(0.5);
      waves.position.set(0, -6);
      const stars: Text[] = [];
      for (let s = 0; s < 3; s++) {
        const star = label("★", 20, 0xffe08a);
        star.anchor.set(0.5);
        star.position.set(-28 + s * 28, 24);
        star.eventMode = "none";
        stars.push(star);
      }
      const lock = label("Locked", 14, 0xfff1c8);
      lock.anchor.set(0.5);
      lock.position.set(0, 52);
      lock.eventMode = "none";
      card.addChild(plate, name, waves, ...stars, lock);
      card.hitArea = new Rectangle(-84, -75, 168, 150);
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
    const idle = art.clip("hero", "walk");
    this.guardianFace = new Sprite(idle?.frames[0]?.[0] ?? Texture.EMPTY);
    this.guardianFace.anchor.set(idle?.anchorX ?? 0.5, idle?.anchorY ?? 0.7);
    this.guardianFace.scale.set((idle?.draw ?? 0.25) * 0.7);
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
    this.intro = new Container();
    this.intro.visible = false;
    this.intro.eventMode = "none";
    const introPlate = this.panel(200, 46);
    introPlate.position.set(0, 0);
    introPlate.eventMode = "none";
    this.introTitle = new Text({ text: "", style: { fontFamily: SERIF, fontSize: 15, fill: 0xfff6df, fontWeight: "bold", align: "center" } });
    this.introTitle.anchor.set(0.5, 0);
    this.introTitle.position.set(0, -16);
    this.introTitle.eventMode = "none";
    this.introBody = new Text({ text: "", style: { fontFamily: SANS, fontSize: 12, fill: 0xffe08a, fontWeight: "bold", align: "center", wordWrap: true, wordWrapWidth: 180 } });
    this.introBody.anchor.set(0.5, 0);
    this.introBody.position.set(0, 4);
    this.introBody.eventMode = "none";
    this.intro.addChild(introPlate, this.introTitle, this.introBody);
    this.hintPlate = new Graphics();
    this.hintPlate.eventMode = "none";
    this.hintPlate.visible = false;
    this.play.addChild(bar, this.integrityText, this.integrityFill, this.waveText, this.streakText, this.bossText, speed, pause, gear, this.vault, this.purseText, this.laneLayer, this.laneTip, this.callButton, this.guardianButton, this.flareButton, this.hintPlate, this.hint, this.banner, this.intro, this.card, this.offerLayer);
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
    const top = this.safeTop;
    const bottom = this.safeBottom;
    const narrow = w < 760;
    const row = narrow ? 34 : 48;
    bar.clear();
    bar.position.set(0, top);
    bar.roundRect(0, 0, w, row, 0).fill({ color: 0x140e0a, alpha: 0.88 });
    bar.hitArea = new Rectangle(0, 0, w, row);
    this.integrityText.style.fontSize = narrow ? 13 : 16;
    this.integrityText.position.set(8, top + (narrow ? 8 : 6));
    const pauseW = narrow ? 72 : 118;
    const pillW = narrow ? 102 : 160;
    const barX = narrow ? 70 : 120;
    const barRight = w - pauseW - pillW - 16;
    this.hpW = Math.max(48, barRight - barX);
    this.integrityFill.position.set(barX, top + (row - 10) / 2);
    this.vaultW = pillW;
    this.vaultH = narrow ? 26 : 36;
    this.vault.position.set(w - pauseW - pillW - 6, top + (row - this.vaultH) / 2);
    this.layoutVault(narrow);
    this.waveText.visible = !narrow;
    this.streakText.visible = !narrow;
    this.waveText.anchor.set(0.5, 0);
    this.waveText.position.set(w / 2, top + 6);
    this.streakText.position.set(w / 2 + 90, top + 8);
    pause.scale.set(narrow ? 0.52 : 0.85);
    pause.position.set(w - (narrow ? 40 : 70), top + row / 2);
    gear.visible = false;
    speed.scale.set(0.85);
    speed.position.set(0, -158);
    this.flareButton.scale.set(narrow ? 0.62 : 1);
    this.guardianButton.visible = false;
    this.flareButton.position.set(w - (narrow ? 40 : 64), h - (narrow ? 48 : 64) - bottom);
    this.callButton.scale.set(narrow ? 0.58 : 1);
    this.callButton.position.set(w / 2, h - (narrow ? 32 : 48) - bottom);
    this.hint.style.fontSize = 14;
    this.hint.style.wordWrap = true;
    this.hint.style.wordWrapWidth = Math.max(140, w - 120);
    this.hint.anchor.set(0.5);
    this.hint.style.align = "center";
    const toastY = h - (narrow ? 78 : 96) - bottom;
    this.hint.position.set(w / 2, toastY);
    if (this.hintPlate) {
      const tw = Math.min(w - 96, 280);
      this.hintPlate.clear();
      this.hintPlate.roundRect(-tw / 2, -16, tw, 32, 12).fill({ color: 0x140e0a, alpha: 0.88 });
      this.hintPlate.position.set(w / 2, toastY);
    }
    this.banner.style.fontSize = narrow ? 13 : 18;
    this.banner.style.wordWrap = true;
    this.banner.style.wordWrapWidth = Math.max(160, w - 80);
    this.banner.style.align = "center";
    this.banner.position.set(w / 2, toastY);
    const cardScale = Math.min(1, (w - 8) / 600, Math.max(0.62, (h * 0.5) / 400));
    this.card.scale.set(cardScale);
    this.card.position.set(8, h - 400 * cardScale - 8 - bottom);
    this.intro.scale.set(narrow ? 0.7 : 0.88);
    this.intro.position.set(w - (narrow ? 86 : 130), top + row + (narrow ? 96 : 112));
    this.bossText.style.fontSize = 12;
    this.bossText.anchor.set(0.5, 0);
    this.bossText.position.set(w / 2, top + row + 4);
    this.purseText.position.set(8, top + row + 4);
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

  toggleTree(): void {
    this.treeLayer.visible = !this.treeLayer.visible;
  }

  private drawHp(): void {
    const cap = Math.max(1, this.hpCap);
    const shown = Math.max(0, Math.min(1, this.hpShown / cap));
    const lag = Math.max(shown, Math.min(1, this.hpLag / cap));
    const low = shown < 0.3 && this.hpTarget > 0;
    const pulse = low ? 0.55 + Math.abs(Math.sin(this.laneTime * 7)) * 0.45 : 1;
    const w = this.hpW;
    this.integrityFill.clear();
    this.integrityFill.roundRect(0, 0, w, 10, 5).fill({ color: 0x1a120c, alpha: 0.92 });
    this.integrityFill.roundRect(1, 1, Math.max(0, w - 2) * lag, 8, 4).fill({ color: 0x8e1c14, alpha: 0.85 });
    this.integrityFill.roundRect(1, 1, Math.max(0, w - 2) * shown, 8, 4).fill({ color: low ? 0xff3b30 : 0xf0c14a, alpha: pulse });
    this.integrityText.style.fill = low ? 0xffb0a4 : 0xfff6df;
  }

  private buildTree(): void {
    const dim = fullDim();
    dim.on("pointertap", (e) => {
      e.stopPropagation();
      this.treeLayer.visible = false;
    });
    const plate = this.panel(348, 620);
    const title = new Text({ text: "Tech tree", style: { fontFamily: SERIF, fontSize: 22, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -286);
    title.eventMode = "none";
    const close = this.button(label("Close", 15, INK), 120, 36, () => {
      this.treeLayer.visible = false;
    });
    close.position.set(0, 276);
    const wires = new Graphics();
    wires.eventMode = "none";
    this.treeDetail = new Text({
      text: "Tap a node. Strong and weak show here.",
      style: { fontFamily: SANS, fontSize: 12, fill: 0xfff6df, align: "center", wordWrap: true, wordWrapWidth: 310 },
    });
    this.treeDetail.anchor.set(0.5, 0);
    this.treeDetail.position.set(0, 168);
    this.treeDetail.eventMode = "none";
    this.treeLayer.addChild(dim, plate, wires, title, this.treeDetail, close);
    this.hits.push(dim, close);
    const byId = new Map(TECH.map((node) => [node.id, node]));
    const cols = [
      { name: "Archer", x: -126, base: "archer", a: "volley", b: "rain", max: "100" },
      { name: "Siege", x: -42, base: "siege", a: "ballista", b: "catapult", max: "180" },
      { name: "Mystic", x: 42, base: "totem", a: "snare", b: "beam", max: "140" },
      { name: "Barracks", x: 126, base: "squad", a: "spears", b: "knights", max: "" },
    ];
    for (const col of cols) {
      const cap = new Text({ text: col.name, style: { fontFamily: SANS, fontSize: 11, fill: 0xe7c98a, fontWeight: "bold" } });
      cap.anchor.set(0.5);
      cap.position.set(col.x, -258);
      cap.eventMode = "none";
      this.treeLayer.addChild(cap);
      const base = byId.get(col.base);
      const left = byId.get(col.a);
      const right = byId.get(col.b);
      if (!base || !left || !right) continue;
      this.techNode(col.x, -210, base, base.cost);
      this.techNode(col.x - 20, -128, left, left.cost);
      this.techNode(col.x + 20, -128, right, right.cost);
      const maxLine = (node: (typeof TECH)[number]) => col.max
        ? `${node.name} max · ${col.max} Jade. Strong: ${node.strong}. Weak: ${node.weak}.`
        : `${node.name} is the top of this line. No further upgrade. Strong: ${node.strong}. Weak: ${node.weak}.`;
      this.techNode(col.x - 20, -52, left, col.max || "Top", maxLine(left));
      this.techNode(col.x + 20, -52, right, col.max || "Top", maxLine(right));
      wires.moveTo(col.x, -196);
      wires.lineTo(col.x - 20, -144);
      wires.moveTo(col.x, -196);
      wires.lineTo(col.x + 20, -144);
      wires.moveTo(col.x - 20, -112);
      wires.lineTo(col.x - 20, -66);
      wires.moveTo(col.x + 20, -112);
      wires.lineTo(col.x + 20, -66);
    }
    wires.stroke({ width: 2, color: 0xe7c98a, alpha: 0.7 });
    const util = new Text({ text: "Utility", style: { fontFamily: SANS, fontSize: 11, fill: 0xe7c98a, fontWeight: "bold" } });
    util.anchor.set(0.5);
    util.position.set(0, 8);
    util.eventMode = "none";
    this.treeLayer.addChild(util);
    for (const [id, x] of [["wall", -110], ["recruit", 0], ["heart", 110]] as const) {
      const node = byId.get(id);
      if (node) this.techNode(x, 58, node, node.cost.split(" ")[0]);
    }
    this.treeLayer.visible = false;
  }

  private techNode(x: number, y: number, node: (typeof TECH)[number], cost: string, override = ""): void {
    const locked = node.unlock > 0;
    const valley = locked ? (BALANCE.worlds[node.unlock]?.name ?? "") : "";
    const box = new Container();
    box.position.set(x, y);
    const g = new Graphics();
    g.circle(0, 0, 13).fill({ color: locked ? 0x2a241c : 0x3e3428 });
    g.circle(0, 0, 13).stroke({ width: 2, color: locked ? 0x8a7a62 : 0xe7c98a });
    g.eventMode = "none";
    const icon = new Text({ text: node.icon, style: { fontFamily: SANS, fontSize: 12, fill: 0xfff6df } });
    icon.anchor.set(0.5);
    icon.eventMode = "none";
    const price = new Text({ text: cost, style: { fontFamily: SANS, fontSize: 10, fill: 0xe7c98a, fontWeight: "bold" } });
    price.anchor.set(0.5, 0);
    price.position.set(0, 15);
    price.eventMode = "none";
    box.addChild(g, icon, price);
    if (locked && valley) {
      const tag = new Text({
        text: valley.split(" ").slice(-1)[0] ?? valley,
        style: { fontFamily: SANS, fontSize: 9, fill: 0xcbbfa8 },
      });
      tag.anchor.set(0.5, 0);
      tag.position.set(0, 26);
      tag.eventMode = "none";
      box.addChild(tag);
    }
    const where = locked ? `Opens in ${valley}.` : "Open from the start.";
    const line = override || `${node.name} · ${node.cost} Jade. ${where} Strong: ${node.strong}. Weak: ${node.weak}.`;
    box.eventMode = "static";
    box.cursor = "pointer";
    box.hitArea = new Rectangle(-26, -16, 52, 46);
    box.on("pointertap", (e) => {
      e.stopPropagation();
      this.treeDetail.text = line;
    });
    this.treeLayer.addChild(box);
    this.hits.push(box);
  }

  private buildPause(): void {
    const dim = fullDim();
    const plate = this.panel(340, 540);
    const title = new Text({ text: "Paused", style: { fontFamily: SERIF, fontSize: 36, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -220);
    this.speedButton.removeFromParent();
    this.speedButton.position.set(0, -158);
    const resume = this.button(label("Resume", 18, INK), 240, 50, () => this.hooks.resume());
    resume.position.set(0, -100);
    const restart = this.button(label("Restart valley", 16, INK), 240, 48, () => this.hooks.restart());
    restart.position.set(0, -40);
    const tree = this.button(label("Tech tree", 16, INK), 240, 48, () => this.toggleTree());
    tree.position.set(0, 20);
    const settings = this.button(label("Settings", 16, INK), 240, 48, () => this.hooks.openSettings());
    settings.position.set(0, 80);
    const quit = this.button(label("Valley select", 16, INK), 240, 48, () => this.hooks.quit());
    quit.position.set(0, 140);
    this.pauseLayer.addChild(dim, plate, title, this.speedButton, resume, restart, tree, settings, quit);
    this.hits.push(dim, resume, restart, tree, settings, quit);
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
    text.eventMode = "none";
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
    c.hitArea = new Rectangle(-w / 2, -h / 2, w, h);
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
    const pill = h < 40;
    this.vaultPlate.clear();
    this.vaultPlate.roundRect(0, 0, w, h, pill ? 13 : 20).fill({ color: 0x102018, alpha: 0.94 });
    this.vaultPlate.roundRect(0, 0, w, h, pill ? 13 : 20).stroke({ width: pill ? 2 : 5, color: 0x3d8f62 });
    const icon = pill ? 18 : h < 56 ? 26 : narrow ? 46 : 64;
    this.iconBase = icon / Math.max(1, this.jadeIcon.texture.width);
    this.jadeIcon.scale.set(this.iconBase);
    this.jadeIcon.position.set(6 + icon / 2, h / 2);
    this.jadeText.style.fontSize = pill ? 16 : h < 56 ? 24 : narrow ? 36 : 50;
    this.jadeText.position.set(8 + icon, pill ? 3 : h < 56 ? 2 : 4);
    this.vaultPlus.position.set(8 + icon, h * 0.7);
    this.vaultGoal.alpha = 0;
    this.vaultTower.alpha = 0;
    this.vaultTip.visible = false;
    this.vaultTipPlate.visible = false;
    this.vault.hitArea = new Rectangle(0, 0, w, h);
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
    this.vaultBar.clear();
    this.vaultGoal.text = "";
    this.vaultTip.visible = false;
    this.vaultTipPlate.visible = false;
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
    const vaultBottom = this.vault.y + this.vaultH + 8;
    let callN = 0;
    let tipAt: { x: number; y: number; plan: LanePlan } | null = null;
    const narrow = this.w < 760;
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
      const col = narrow ? i % 2 : i;
      const row = narrow ? Math.floor(i / 2) : 0;
      const px = narrow ? (col === 0 ? 86 : this.w - 86) : this.w * (0.2 + col * 0.16);
      const py = vaultBottom + 14 + row * 30;
      node.root.position.set(px, py);
      node.root.scale.set(1);
      node.root.alpha = plan.state === "gone" ? fade : 1;
      node.arrow.clear();
      node.badge.visible = false;
      node.extras.visible = false;
      node.icons.forEach((sprite) => { sprite.visible = false; });
      const leadName = BALANCE.enemies[plan.lead].name;
      const shortName = leadName.length > 9 ? leadName.slice(0, 8) : leadName;
      node.title.style.fontSize = 13;
      node.title.text = `${shortName} x${plan.leadCount}`;
      const chipW = Math.min(140, Math.max(88, node.title.width + 18));
      node.plate.clear();
      node.plate.roundRect(-chipW / 2, -12, chipW, 24, 10).fill({ color: 0x140e0a, alpha: 0.92 });
      node.plate.roundRect(-chipW / 2, -12, chipW, 24, 10).stroke({ width: 2, color: plan.state === "soon" ? 0xfff6d0 : 0xc9a36a });
      node.title.position.set(0, -11);
      node.root.hitArea = new Rectangle(-chipW / 2, -12, chipW, 24);
      if (plan.state !== "gone") callN += 1;
      if (plan.path === this.openLane) tipAt = { x: px, y: py, plan };
    }
    if (this.laneBuilding && callN > 0) {
      this.callButton.scale.set(narrow ? 0.5 : 0.86);
      this.callButton.position.set(this.w / 2, this.h - (narrow ? 22 : 36) - this.safeBottom);
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

function chainVisible(c: Container): boolean {
  let n: Container | null = c;
  while (n) {
    if (!n.visible) return false;
    n = n.parent;
  }
  return true;
}
