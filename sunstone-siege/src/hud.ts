/**
 * Title, valley select, the battle bar, and the end screens.
 * Jade shown here is the demo token from the simulation. It is not a balance.
 */
import { Container, Graphics, NineSliceSprite, Rectangle, Sprite, Text, type Texture } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, worldCount } from "./balance";
import { isUnlocked, type SaveData } from "./save";
import type { Phase, RelicId } from "./types";

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
  line: string;
  delta: string;
  dealt: string;
  upgrade: string | null;
  sell: string;
  canUpgrade: boolean;
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
    this.jadeText = label("0", 18, 0xc8ffd8);
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
    this.cardLine = label("", 15, 0xffe0a0);
    this.cardDelta = label("", 14, 0xb6f7a4);
    this.cardDealt = label("", 13, 0xf6e7c1);
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
    this.jadeText.text = String(state.jade);
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
    this.hint.visible = state.hint.length > 0 && !state.offer;
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
  }

  setCard(card: TowerCard | null): void {
    this.card.visible = card !== null;
    if (!card) return;
    this.cardName.text = `${card.name}  ${card.tier}`;
    this.cardBody.text = card.blurb;
    this.cardLine.text = card.line;
    this.cardDelta.text = card.delta;
    this.cardDealt.text = card.dealt;
    this.upgradeButton.visible = card.upgrade !== null;
    if (card.upgrade) this.upgradeText.text = card.upgrade;
    this.upgradeText.style.fill = card.canUpgrade ? INK : 0x8e1c14;
    this.upgradeButton.alpha = 1;
    this.sellText.text = card.sell;
  }

  jadeAnchor(): { x: number; y: number } {
    return { x: this.jadeIcon?.position.x ?? 210, y: this.jadeIcon?.position.y ?? 28 };
  }

  announce(text: string): void {
    this.banner.text = text;
    this.bannerLife = 1.7;
    this.banner.alpha = 1;
    this.banner.visible = true;
  }

  tick(dt: number): void {
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
    this.hint.text = "Tap a stone pad beside a trail.";
    this.cardName.position.set(96, 64);
    this.cardBody.style.wordWrap = true;
    this.cardBody.style.wordWrapWidth = 360;
    this.cardBody.position.set(96, 90);
    this.cardLine.position.set(96, 124);
    this.cardDelta.position.set(96, 146);
    this.cardDealt.position.set(96, 168);
    this.upgradeButton = this.button(this.upgradeText, 170, 44, () => this.hooks.upgrade());
    this.upgradeButton.position.set(180, 206);
    const sell = this.button(this.sellText, 150, 44, () => this.hooks.sell());
    sell.position.set(370, 206);
    const cardBg = this.panel(560, 340);
    cardBg.position.set(280, 170);
    cardBg.eventMode = "none";
    this.card.addChild(cardBg, this.cardName, this.cardBody, this.cardLine, this.cardDelta, this.cardDealt, this.upgradeButton, sell);
    this.card.visible = false;
    this.bar = bar;
    this.jadeIcon = jadeIcon;
    this.speedButton = speed;
    this.pauseButton = pause;
    this.gearButton = gear;
    this.play.addChild(bar, this.integrityText, this.integrityFill, jadeIcon, this.jadeText, this.purseText, this.waveText, this.streakText, this.bossText, speed, pause, gear, this.callButton, this.flareButton, this.hint, this.banner, this.card, this.offerLayer);
    this.hits.push(speed, pause, gear, this.callButton, this.flareButton, this.card, bar);
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
    jadeIcon.position.set(210, 28);
    this.jadeText.position.set(232, 16);
    const narrow = w < 760;
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
    this.callButton.position.set(narrow ? Math.max(150, w / 2 - 46) : w / 2, h - 48);
    this.hint.style.wordWrap = true;
    this.hint.style.wordWrapWidth = Math.max(160, w - 28);
    this.hint.position.set(w / 2, narrow ? 140 : 78);
    this.banner.position.set(w / 2, narrow ? 206 : 120);
    this.card.position.set(12, h - 356);
    this.bossText.anchor.set(0.5, 0);
    this.bossText.position.set(w / 2, w < 760 ? 128 : 96);
    this.purseText.position.set(188, 62);
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
