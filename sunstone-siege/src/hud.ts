/**
 * Title, valley select, the battle bar, and the end screens.
 * Jade shown here is the demo token from the simulation. It is not a balance.
 */
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
import type { ArtSet } from "./art";
import { BALANCE, worldCount } from "./balance";
import { isUnlocked, type SaveData } from "./save";
import type { Phase, RelicId } from "./types";

const SERIF = '"Noto Serif", Palatino, Georgia, serif';
const SANS = 'Inter, "Segoe UI", system-ui, sans-serif';

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
}

export interface TowerCard {
  name: string;
  blurb: string;
  tier: string;
  line: string;
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
  private readonly upgradeText: Text;
  private upgradeButton!: Container;
  private readonly sellText: Text;
  private readonly endTitle: Text;
  private readonly endBody: Text;
  private readonly endStars: Sprite[] = [];
  private readonly nextButton: Container;
  private readonly levelCards: Container[] = [];
  private readonly levelStarSets: Sprite[][] = [];
  private readonly levelLocks: Sprite[] = [];
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

  constructor(art: ArtSet, private readonly hooks: HudHooks, save: SaveData) {
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
    this.flareRing = new Graphics();
    this.cardName = label("", 18, 0xf6e7c1);
    this.cardBody = label("", 13, 0xd9cbb0);
    this.cardLine = label("", 14, 0xffe0a0);
    this.upgradeText = label("Upgrade", 15, 0x1a1208);
    this.sellText = label("Sell", 15, 0xf6e7c1);
    this.endTitle = label("", 36, 0xfff1c8);
    this.endTitle.anchor.set(0.5);
    this.endBody = label("", 16, 0xf6e7c1);
    this.endBody.anchor.set(0.5);

    this.buildTitle(art);
    this.buildLevels(art);
    this.callButton = this.button(this.callText, 210, 46, 0xe6b15a, () => hooks.call());
    this.flareButton = new Container();
    this.buildPlay(art);
    this.buildPause();
    this.musicSlider = new Slider("Music", save.music, hooks.music);
    this.sfxSlider = new Slider("Effects", save.sfx, hooks.sfx);
    this.reduced = save.reduced;
    this.reducedText = label(this.reducedLine(), 16, 0xf6e7c1);
    this.buildSettings();
    this.nextButton = this.button(label("Next valley", 16, 0x1a1208), 170, 46, 0xe6b15a, () => hooks.next());
    this.buildOffer();
    this.buildEnd(art);
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
    this.levels.position.set(w / 2, h / 2);
    this.levels.scale.set(Math.max(0.58, Math.min(1, Math.min(w / 1040, h / 620))));
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
    const building = state.phase === "build";
    this.callButton.visible = building && !state.offer;
    if (building) {
      const secs = Math.max(0, Math.ceil(state.buildLeft));
      this.callText.text = state.buildLeft > 0.3 ? `Call wave  ${secs}s  +${BALANCE.earlyCall}` : "Wave incoming";
    }
    this.hint.text = state.hint;
    this.hint.visible = state.hint.length > 0 && !state.offer;
    this.syncOffer(state);
    const charge = state.flare / BALANCE.flare.need;
    this.flareRing.clear();
    this.flareRing.circle(0, 0, 32).stroke({ width: 3, color: 0x3a3024, alpha: 0.9 });
    if (charge > 0) {
      this.flareRing.arc(0, 0, 32, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * charge).stroke({ width: 4, color: state.flareReady ? 0xfff1c2 : 0xffb03a });
    }
    this.flareButton.alpha = state.flareReady ? 1 : 0.72;
    this.flareButton.scale.set(state.flareReady ? 1.06 : 1);
  }

  setCard(card: TowerCard | null): void {
    this.card.visible = card !== null;
    if (!card) return;
    this.cardName.text = `${card.name}  ${card.tier}`;
    this.cardBody.text = card.blurb;
    this.cardLine.text = card.line;
    this.upgradeButton.visible = card.upgrade !== null;
    if (card.upgrade) this.upgradeText.text = card.upgrade;
    this.upgradeButton.alpha = card.canUpgrade ? 1 : 0.45;
    this.sellText.text = card.sell;
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

  private buildTitle(art: ArtSet): void {
    const dim = new Graphics().rect(-800, -500, 1600, 1000).fill({ color: 0x070c08, alpha: 0.45 });
    dim.eventMode = "none";
    const title = new Text({
      text: "SUNSTONE SIEGE",
      style: {
        fontFamily: SERIF,
        fontSize: 64,
        fill: 0xfff1c8,
        fontWeight: "bold",
        align: "center",
        dropShadow: { alpha: 0.7, angle: Math.PI / 2, blur: 6, color: 0x140c06, distance: 3 },
      },
    });
    title.anchor.set(0.5);
    title.position.set(0, -120);
    const sub = wrap("Hold the crater. Carve totems along the trails. Jade is a demo token and has no cash value.", 520, 18, 0xf6e7c1);
    sub.position.set(0, -40);
    const play = this.button(label("Play", 22, 0x1a1208), 220, 56, 0xe6b15a, () => this.hooks.play());
    play.position.set(0, 70);
    const settings = this.button(label("Settings", 18, 0xf6e7c1), 180, 46, 0x2a2118, () => this.hooks.openSettings());
    settings.position.set(0, 140);
    const ring = new Sprite(art.frame("sun-ring"));
    ring.anchor.set(0.5);
    ring.scale.set(0.42);
    ring.position.set(0, -230);
    ring.eventMode = "none";
    const mark = new Sprite(art.frame("sun-disk"));
    mark.anchor.set(0.5);
    mark.scale.set(0.42);
    mark.position.set(0, -230);
    mark.eventMode = "none";
    this.title.addChild(dim, ring, mark, title, sub, play, settings);
    this.hits.push(play, settings);
  }

  private buildLevels(art: ArtSet): void {
    const heading = new Text({ text: "Choose a valley", style: { fontFamily: SERIF, fontSize: 36, fill: 0xfff1c8, fontWeight: "bold" } });
    heading.anchor.set(0.5);
    heading.position.set(0, -210);
    const back = this.button(label("Back", 16, 0xf6e7c1), 120, 40, 0x2a2118, () => this.hooks.backTitle());
    back.position.set(0, 230);
    this.levels.addChild(heading, back);
    this.hits.push(back);
    for (let i = 0; i < worldCount(); i++) {
      const card = new Container();
      card.position.set((i - 1) * 300, 10);
      const plate = new Graphics().roundRect(-130, -150, 260, 300, 16).fill({ color: 0x1c1610 }).stroke({ width: 2, color: 0xe6c27a });
      const name = new Text({ text: BALANCE.worlds[i].name, style: { fontFamily: SERIF, fontSize: 22, fill: 0xfff1c8, fontWeight: "bold", wordWrap: true, wordWrapWidth: 220, align: "center" } });
      name.anchor.set(0.5, 0);
      name.position.set(0, -110);
      const waves = label(`${BALANCE.worlds[i].waves.length} waves`, 15, 0xd9cbb0);
      waves.anchor.set(0.5);
      waves.position.set(0, -40);
      const stars: Sprite[] = [];
      for (let s = 0; s < 3; s++) {
        const star = new Sprite(art.frame("star"));
        star.anchor.set(0.5);
        star.position.set(-36 + s * 36, 10);
        star.scale.set(1.1);
        star.eventMode = "none";
        stars.push(star);
      }
      const lock = new Sprite(art.frame("lock"));
      lock.anchor.set(0.5);
      lock.position.set(0, 78);
      lock.eventMode = "none";
      card.addChild(plate, name, waves, ...stars, lock);
      card.hitArea = new Rectangle(-130, -150, 260, 300);
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
    jadeIcon.scale.set(0.7);
    jadeIcon.eventMode = "none";
    const speed = this.button(this.speedText, 64, 36, 0xe6b15a, () => this.hooks.speed());
    const pause = this.button(label("Pause", 15, 0xf6e7c1), 84, 36, 0x2a2118, () => this.hooks.pause());
    const gear = this.button(label("Settings", 14, 0xf6e7c1), 96, 36, 0x2a2118, () => this.hooks.openSettings());
    const plate = new Graphics().circle(0, 0, 36).fill({ color: 0x3a2410 }).stroke({ width: 2, color: 0xffe0a0 });
    const flareLabel = label("Flare", 13, 0xfff1c8);
    flareLabel.anchor.set(0.5);
    flareLabel.position.set(0, 2);
    this.flareRing.eventMode = "none";
    this.flareButton.addChild(plate, this.flareRing, flareLabel);
    this.flareButton.eventMode = "static";
    this.flareButton.cursor = "pointer";
    this.flareButton.on("pointertap", (e) => {
      e.stopPropagation();
      this.hooks.flare();
    });
    this.hint.text = "Tap a stone pad beside a trail.";
    this.cardName.position.set(16, 12);
    this.cardBody.position.set(16, 40);
    this.cardLine.position.set(16, 64);
    this.upgradeButton = this.button(this.upgradeText, 150, 36, 0xe6b15a, () => this.hooks.upgrade());
    this.upgradeButton.position.set(92, 100);
    const sell = this.button(this.sellText, 140, 36, 0x2a2118, () => this.hooks.sell());
    sell.position.set(250, 100);
    const cardBg = new Graphics().roundRect(0, 0, 400, 128, 14).fill({ color: 0x1c1610, alpha: 0.92 }).stroke({ width: 2, color: 0xe6c27a });
    cardBg.eventMode = "none";
    this.card.addChild(cardBg, this.cardName, this.cardBody, this.cardLine, this.upgradeButton, sell);
    this.card.visible = false;
    this.bar = bar;
    this.jadeIcon = jadeIcon;
    this.speedButton = speed;
    this.pauseButton = pause;
    this.gearButton = gear;
    this.play.addChild(bar, this.integrityText, this.integrityFill, jadeIcon, this.jadeText, this.waveText, speed, pause, gear, this.callButton, this.flareButton, this.hint, this.banner, this.card, this.offerLayer);
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
    bar.clear();
    bar.rect(0, 0, w, 56).fill({ color: 0x140e0a, alpha: 0.84 });
    bar.hitArea = new Rectangle(0, 0, w, 56);
    this.integrityText.position.set(16, 8);
    this.integrityFill.position.set(16, 34);
    jadeIcon.position.set(210, 28);
    this.jadeText.position.set(232, 16);
    this.waveText.anchor.set(0.5, 0);
    this.waveText.position.set(w / 2, 16);
    gear.position.set(w - 64, 28);
    pause.position.set(w - 160, 28);
    speed.position.set(w - 244, 28);
    this.flareButton.position.set(w - 64, h - 64);
    this.callButton.position.set(w / 2, h - 48);
    this.hint.position.set(w / 2, 78);
    this.banner.position.set(w / 2, 120);
    this.card.position.set(16, h - 148);
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
    heading.position.set(0, -150);
    heading.eventMode = "none";
    this.offerClock.position.set(0, -112);
    this.offerLayer.addChild(dim, heading, this.offerClock);
    this.hits.push(dim);
    for (let i = 0; i < 3; i++) {
      const card = new Container();
      card.position.set((i - 1) * 250, 10);
      const plate = new Graphics().roundRect(-110, -70, 220, 150, 14).fill({ color: 0x1c1610, alpha: 0.96 }).stroke({ width: 2, color: 0xe6c27a });
      const name = label("Gift", 16, 0xfff1c8);
      name.anchor.set(0.5, 0);
      name.position.set(0, -52);
      const blurb = new Text({
        text: "",
        style: { fontFamily: SANS, fontSize: 13, fill: 0xd9cbb0, align: "center", wordWrap: true, wordWrapWidth: 190 },
      });
      blurb.anchor.set(0.5, 0);
      blurb.position.set(0, -22);
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
    const title = new Text({ text: "Paused", style: { fontFamily: SERIF, fontSize: 40, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -120);
    const resume = this.button(label("Resume", 18, 0x1a1208), 220, 50, 0xe6b15a, () => this.hooks.resume());
    resume.position.set(0, -30);
    const restart = this.button(label("Restart valley", 16, 0xf6e7c1), 220, 46, 0x2a2118, () => this.hooks.restart());
    restart.position.set(0, 36);
    const settings = this.button(label("Settings", 16, 0xf6e7c1), 220, 46, 0x2a2118, () => this.hooks.openSettings());
    settings.position.set(0, 96);
    const quit = this.button(label("Valley select", 16, 0xf6e7c1), 220, 46, 0x2a2118, () => this.hooks.quit());
    quit.position.set(0, 156);
    this.pauseLayer.addChild(dim, title, resume, restart, settings, quit);
    this.hits.push(dim, resume, restart, settings, quit);
    this.pauseLayer.visible = false;
  }

  private buildSettings(): void {
    const dim = fullDim();
    const title = new Text({ text: "Settings", style: { fontFamily: SERIF, fontSize: 36, fill: 0xfff1c8, fontWeight: "bold" } });
    title.anchor.set(0.5);
    title.position.set(0, -160);
    this.musicSlider.root.position.set(-110, -70);
    this.sfxSlider.root.position.set(-110, -10);
    const toggle = this.button(this.reducedText, 260, 46, 0x2a2118, () => {
      this.reduced = !this.reduced;
      this.reducedText.text = this.reducedLine();
      this.hooks.reduced(this.reduced);
    });
    toggle.position.set(0, 70);
    const close = this.button(label("Close", 16, 0x1a1208), 160, 44, 0xe6b15a, () => this.hooks.closeSettings());
    close.position.set(0, 140);
    this.settingsLayer.addChild(dim, title, this.musicSlider.root, this.sfxSlider.root, toggle, close);
    this.hits.push(dim, toggle, close, this.musicSlider.hit, this.sfxSlider.hit);
    this.settingsLayer.visible = false;
  }

  private buildEnd(art: ArtSet): void {
    const dim = fullDim();
    for (let i = 0; i < 3; i++) {
      const star = new Sprite(art.frame("star"));
      star.anchor.set(0.5);
      star.position.set(-48 + i * 48, -70);
      star.scale.set(1.3);
      this.endStars.push(star);
    }
    this.endTitle.position.set(0, -140);
    this.endBody.position.set(0, -10);
    const replay = this.button(label("Play again", 16, 0x1a1208), 170, 46, 0xe6b15a, () => this.hooks.replay());
    replay.position.set(-100, 80);
    this.nextButton.position.set(100, 80);
    const map = this.button(label("Valleys", 16, 0xf6e7c1), 140, 42, 0x2a2118, () => this.hooks.quit());
    map.position.set(0, 146);
    this.endLayer.addChild(dim, this.endTitle, ...this.endStars, this.endBody, replay, this.nextButton, map);
    this.hits.push(dim, replay, this.nextButton, map);
    this.endLayer.visible = false;
  }

  private button(text: Text, w: number, h: number, fill: number, onClick: () => void): Container {
    const c = new Container();
    const g = new Graphics();
    g.roundRect(-w / 2, -h / 2, w, h, 12).fill({ color: fill });
    g.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.42, 8).fill({ color: 0xffffff, alpha: 0.1 });
    g.roundRect(-w / 2, -h / 2, w, h, 12).stroke({ width: 2, color: 0xf0d7a2, alpha: 0.95 });
    text.anchor.set(0.5);
    c.addChild(g, text);
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
  return new Text({ text, style: { fontFamily: SANS, fontSize: size, fill, fontWeight: "bold" } });
}

function wrap(text: string, width: number, size: number, fill: number): Text {
  const t = new Text({
    text,
    style: { fontFamily: SANS, fontSize: size, fill, align: "center", wordWrap: true, wordWrapWidth: width },
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
