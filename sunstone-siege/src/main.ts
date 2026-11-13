/**
 * Sunstone Siege boot: camera, input, and the loop that joins the simulation
 * to the view. Combat numbers stay in balance.ts.
 */
import { Application, Rectangle } from "pixi.js";
import { loadArt } from "./art";
import { AudioBus } from "./audio";
import { BALANCE, TOWER_HUE, starsFor, towerCost, towerRange, worldCount } from "./balance";
import { Hud } from "./hud";
import { MAP_H, MAP_W } from "./maps";
import { isUnlocked, loadSave, recordStars, writeSave, type SaveData } from "./save";
import { Siege, type Fx } from "./sim";
import { TOWER_KINDS, type TowerKind } from "./types";
import { RANGE_COLOR, WorldView } from "./view";

const params = new URLSearchParams(location.search);

async function boot(): Promise<void> {
  let save: SaveData = loadSave();
  const host = document.getElementById("game");
  if (!host) throw new Error("sunstone-siege: missing #game");
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: 0x2f9a3a,
    antialias: false,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 1.5),
    preference: "webgl",
    powerPreference: "high-performance",
  });
  host.appendChild(app.canvas);
  app.stage.eventMode = "static";

  const bootBar = document.getElementById("boot-bar");
  const bootLabel = document.getElementById("boot-label");
  const art = await loadArt((progress) => {
    const pct = `${Math.round(progress * 100)}%`;
    if (bootBar) bootBar.style.width = pct;
    if (bootLabel) bootLabel.textContent = `Loading the valley… ${pct}`;
  });
  document.getElementById("boot")?.remove();
  const view = new WorldView(art);
  view.setChoose((index, kind) => {
    if (sim) sim.chooseStation(index, kind);
  });
  view.setBranch((index, spec) => {
    if (sim) sim.chooseSpec(index, spec);
  });
  const audio = new AudioBus();
  audio.setMusic(save.music);
  audio.setSfx(save.sfx);
  view.setReduced(save.reduced);

  let mode: "title" | "levels" | "play" = "title";
  let sim: Siege | null = null;
  let world = 0;
  let speed = 1;
  let paused = false;
  let settingsOpen = false;
  let pausedBefore = false;
  let finished = false;
  let selected = 0;
  let zoom = 1;
  let zoomMin = 0.4;
  let zoomMax = 1.4;
  let camX = 0;
  let camY = 0;
  let seenWave = -1;
  let beamAcc = 0;

  const hud = new Hud(art, {
    play: () => { click(); setMode("levels"); },
    openSettings: () => {
      click();
      pausedBefore = paused;
      if (mode === "play" && !finished) paused = true;
      settingsOpen = true;
      hud.showSettings(true);
      audio.duck(true);
    },
    closeSettings: () => {
      click();
      settingsOpen = false;
      hud.showSettings(false);
      if (mode === "play") paused = pausedBefore;
      audio.duck(paused);
    },
    backTitle: () => { click(); setMode("title"); },
    startLevel: (index) => {
      if (!isUnlocked(save.stars, index)) {
        audio.play("deny");
        return;
      }
      click();
      begin(index);
    },
    pause: () => {
      if (mode !== "play" || finished) return;
      click();
      paused = true;
      hud.showPause(true);
      audio.duck(true);
    },
    resume: () => {
      click();
      paused = false;
      hud.showPause(false);
      audio.duck(false);
    },
    restart: () => { click(); begin(world); },
    quit: () => { click(); setMode("levels"); },
    speed: () => {
      click();
      speed = speed === 1 ? 2 : 1;
    },
    flare: () => {
      if (!sim || paused || finished) return;
      if (!sim.fireFlare()) audio.play("deny");
    },
    call: () => {
      if (!sim || finished) return;
      if (paused) {
        paused = false;
        hud.showPause(false);
        audio.duck(false);
      }
      if (!sim.callWave()) audio.play("deny");
    },
    music: (v) => { save = { ...save, music: v }; writeSave(save); audio.setMusic(v); },
    sfx: (v) => { save = { ...save, sfx: v }; writeSave(save); audio.setSfx(v); },
    reduced: (v) => { save = { ...save, reduced: v }; writeSave(save); view.setReduced(v); },
    upgrade: () => {
      if (!sim || !sim.upgrade(selected)) audio.play("deny");
      else teach(4);
    },
    sell: () => {
      if (!sim) return;
      if (sim.sell(selected) <= 0) audio.play("deny");
      else {
        audio.play("sell");
        selected = 0;
      }
    },
    replay: () => { click(); begin(world); },
    next: () => { click(); begin(Math.min(worldCount() - 1, world + 1)); },
    pickRelic: (id) => {
      if (!sim || !sim.chooseRelic(id)) audio.play("deny");
      else {
        audio.play("relic");
        teach(4);
      }
    },
  }, save);
  let lastChime = 0;
  view.setCollect((n) => {
    hud.collect(n);
    if (save.reduced) return;
    const now = performance.now();
    if (now - lastChime < 160) return;
    lastChime = now;
    audio.play("jade");
  });

  app.stage.addChild(view.world, view.overlay, hud.root);
  hud.setBackdrop(art.title);
  setMode("title");
  layout();

  const debugOn = params.get("debug") === "1";
  const fpsOn = debugOn || params.get("fps") === "1";
  const fpsNode = debugOn ? document.createElement("div") : null;
  if (fpsNode) {
    fpsNode.style.cssText = "position:fixed;left:8px;bottom:8px;color:#f6e7c1;font:12px sans-serif;pointer-events:none;opacity:0.8";
    host.appendChild(fpsNode);
  }
  if (fpsOn) {
    const debug = window as unknown as {
      __cam: () => { zoom: number; camX: number; camY: number; w: number; h: number };
      __ui: () => { call: { x: number; y: number }; lanes: { path: number; x: number; y: number }[]; menu: { x: number; y: number }[] };
      __siege: () => {
        phase: string; wave: number; jade: number; towers: number; units: number; integrity: number; offer: boolean;
        saves: number; kills: number; ready: number;
        leaker: { x: number; y: number; d: number } | null;
        hero: { x: number; y: number };
      } | null;
    };
    debug.__cam = () => ({ zoom, camX, camY, w: app.screen.width, h: app.screen.height });
    debug.__ui = () => ({ call: hud.callAnchor(), lanes: hud.laneAnchors(), menu: view.menuAnchors() });
    debug.__siege = () => {
      if (!sim) return null;
      let leaker: { x: number; y: number; d: number } | null = null;
      for (const e of sim.enemies) {
        if (!e.alive) continue;
        const d = Math.hypot(e.x - sim.map.sun.x, e.y - sim.map.sun.y);
        if (!leaker || d < leaker.d) leaker = { x: e.x, y: e.y, d };
      }
      return {
        phase: sim.phase,
        wave: sim.wave,
        jade: sim.jade,
        towers: sim.towers.length,
        units: sim.enemies.filter((e) => e.alive).length,
        integrity: sim.integrity,
        offer: sim.pendingOffer !== null,
        saves: sim.guardianSaves,
        kills: sim.guardianKills,
        ready: sim.guardianReady,
        leaker,
        hero: sim.heroAt(),
        funding: sim.funding,
        stations: sim.stations.map((s) => ({ i: s.index, kind: s.kind, tier: s.tier, spec: s.spec, x: s.x, y: s.y, paid: s.paid, alive: s.alive, hp: s.hp, hurt: s.hurt, path: s.path, dist: s.dist })),
        towersAt: sim.towers.map((t) => ({ kind: t.kind, tier: t.tier, spec: t.spec, x: t.x, y: t.y, cool: t.cooldown })),
      };
    };
    const act = window as unknown as {
      __fund?: (index: number) => boolean;
      __purse?: (n: number) => void;
      __spawn?: (kind: string, path: number, dist: number) => { x: number; y: number };
      __steer?: (x: number, y: number) => void;
      __hero?: (x: number, y: number) => void;
      __skip?: () => void;
      __begin?: (index: number) => void;
      __tower?: (kind: string, x: number, y: number) => boolean;
      __choose?: (index: number, kind: string) => boolean;
      __spec?: (index: number, spec: string) => boolean;
    };
    act.__spec = (index: number, spec: string) => {
      if (!sim) return false;
      const at = sim.stations.findIndex((s) => s.index === index);
      return at >= 0 ? sim.chooseSpec(at, spec as never) : false;
    };
    act.__choose = (index: number, kind: string) => {
      if (!sim) return false;
      const at = sim.stations.findIndex((s) => s.index === index);
      return at >= 0 ? sim.chooseStation(at, kind as never) : false;
    };
    act.__fund = (index) => {
      if (!sim) return false;
      const at = sim.stations.findIndex((s) => s.index === index);
      return at >= 0 ? sim.fundNow(at) : false;
    };
    act.__purse = (n) => { if (sim) sim.jade += n; };
    act.__spawn = (kind, path, dist) => {
      if (!sim) return { x: 0, y: 0 };
      const e = sim.forceEnemy(kind as never, path, dist);
      return { x: e.x, y: e.y };
    };
    act.__steer = (x, y) => { hold = Math.hypot(x, y) < 0.05 ? null : { x, y }; };
    act.__hero = (x, y) => { if (sim) { sim.heroX = x; sim.heroY = y; } };
    act.__skip = () => { if (sim) sim.time = 30; };
    act.__begin = (index: number) => begin(index);
    act.__tower = (kind: string, x: number, y: number) => {
      if (!sim) return false;
      if (kind === "barracks") {
        const station = sim.stations.find((s) => s.kind === "barracks");
        if (!station) return false;
        station.x = x;
        station.y = y;
        return sim.fundNow(sim.stations.indexOf(station));
      }
      sim.forceTower(kind as never, x, y);
      return true;
    };
  }
  let fpsFrames = 0;
  let fpsStamp = performance.now();
  let hitStop = 0;
  let baseWarned = false;

  app.ticker.add((ticker) => {
    const dt = Math.min(0.05, ticker.deltaMS / 1000);
    const freeze = hitStop > 0;
    if (freeze) hitStop = Math.max(0, hitStop - dt);
    const running = mode === "play" && sim !== null && !paused && !settingsOpen && !finished;
    if (sim && running && !freeze) {
      steerFromInput();
      sim.tick(dt * speed);
    } else if (sim) sim.setSteer(0, 0);
    if (sim && mode === "play") {
      const fx = sim.fx.splice(0, sim.fx.length);
      view.apply(fx);
      view.select(selected);
      const jadeAt = hud.jadeAnchor();
      view.setGemGoal((jadeAt.x - camX) / zoom, (jadeAt.y - camY) / zoom);
      voice(fx);
      noteHits(fx);
      if (!save.reduced) {
        for (const event of fx) {
          if (event.kind === "death" && (event.enemy === "boss" || event.enemy === "golem")) {
            hitStop = Math.max(hitStop, event.enemy === "boss" ? 0.1 : 0.055);
          }
          if (event.kind === "multi") {
            const n = event.n ?? 3;
            if (n >= 8) hitStop = Math.max(hitStop, 0.04);
          }
          if (event.kind === "intro" && event.text && event.enemy) {
            hud.showIntro(event.text, BALANCE.enemies[event.enemy].weak);
          }
        }
      }
      view.update(running && !freeze ? dt : 0, sim, freeze);
      frameFight(dt);
      view.menuScale(zoom, camX, camY);
      if (view.menuPad >= 0) view.refreshMenu(sim.jade);
      aimPlacement();
      present(sim);
      watch(sim);
    }
    view.world.position.set(camX + view.shakeX, camY + view.shakeY);
    view.world.scale.set(zoom);
    view.parallax(camX, camY);
    hud.tick(dt);
    if (fpsNode) {
      fpsFrames += 1;
      const now = performance.now();
      if (now - fpsStamp >= 500) {
        const fps = Math.round((fpsFrames * 1000) / (now - fpsStamp));
        fpsNode.textContent = `${fps} fps  ${view.shownUnits} units`;
        fpsFrames = 0;
        fpsStamp = now;
      }
    }
  });

  const pointers = new Map<number, { x: number; y: number }>();
  const keys = new Set<string>();
  let dragId = -1;
  let stickOn = false;
  let originX = 0;
  let originY = 0;
  let knobX = 0;
  let knobY = 0;
  let hover = { x: 0, y: 0 };
  let hold: { x: number; y: number } | null = null;
  let press: { id: number; x: number; y: number; moved: boolean } | null = null;
  let lastTick = 0;

  const point = (e: PointerEvent): { x: number; y: number } => {
    const rect = app.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  window.addEventListener("pointerdown", (e) => {
    audio.unlock();
    if (mode === "title" || mode === "levels") audio.loop("valley");
    const p = point(e);
    pointers.set(e.pointerId, p);
    if (hud.blocks(p.x, p.y) || view.blocks(p.x, p.y)) return;
    if (mode !== "play" || paused || settingsOpen || finished || !sim) return;
    if (pointers.size >= 2) {
      dragId = -1;
      press = null;
      stickOn = false;
      return;
    }
    dragId = e.pointerId;
    press = { id: e.pointerId, x: p.x, y: p.y, moved: false };
  });

  window.addEventListener("pointermove", (e) => {
    const p = point(e);
    hover = p;
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, p);
    if (pointers.size >= 2 && mode === "play") return;
    if (press && e.pointerId === press.id && Math.hypot(p.x - press.x, p.y - press.y) > 16) {
      press.moved = true;
      if (!stickOn) {
        stickOn = true;
        originX = press.x;
        originY = press.y;
        knobX = press.x;
        knobY = press.y;
      }
    }
    if (e.pointerId !== dragId || !stickOn) return;
    const dx = p.x - originX;
    const dy = p.y - originY;
    const len = Math.hypot(dx, dy) || 1;
    const mag = Math.min(70, len);
    knobX = originX + (dx / len) * mag;
    knobY = originY + (dy / len) * mag;
  });

  window.addEventListener("pointerup", (e) => {
    const at = pointers.get(e.pointerId) ?? point(e);
    const tapped = press && e.pointerId === press.id && !press.moved && !stickOn;
    pointers.delete(e.pointerId);
    if (e.pointerId !== dragId) return;
    dragId = -1;
    stickOn = false;
    press = null;
    hud.setStick(false, 0, 0, 0, 0);
    if (tapped) walkTo(at.x, at.y);
  });
  window.addEventListener("pointercancel", (e) => {
    pointers.delete(e.pointerId);
    if (e.pointerId === dragId) {
      dragId = -1;
      stickOn = false;
      press = null;
      hud.setStick(false, 0, 0, 0, 0);
    }
  });

  window.addEventListener("gesturestart", (e) => e.preventDefault());
  window.addEventListener("touchstart", () => audio.unlock(), { passive: true });

  app.canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
  }, { passive: false });

  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown" || key === "a" || key === "w" || key === "s" || key === "d") {
      keys.add(key);
      e.preventDefault();
    }
    if (e.key === "Escape") {
      if (settingsOpen) {
        settingsOpen = false;
        hud.showSettings(false);
        if (mode === "play") paused = pausedBefore;
        audio.duck(paused);
        return;
      }
      if (mode === "play" && !finished) {
        paused = !paused;
        hud.showPause(paused);
        audio.duck(paused);
      }
      return;
    }
    if (!sim || mode !== "play" || finished) return;
    if (e.key === " " && sim.phase === "build") {
      e.preventDefault();
      if (paused) {
        paused = false;
        hud.showPause(false);
        audio.duck(false);
      }
      sim.callWave();
    } else if ((e.key === "f" || e.key === "F") && !paused && !settingsOpen) {
      if (!sim.fireFlare()) audio.play("deny");
    }
  });
  window.addEventListener("keyup", (e) => {
    keys.delete(e.key.toLowerCase());
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && mode === "play" && !finished && !paused) {
      paused = true;
      hud.showPause(true);
      audio.duck(true);
    }
  });

  window.addEventListener("resize", layout);
  app.renderer.on("resize", layout);

  function click(): void {
    audio.unlock();
    audio.play("click");
  }

  function setMode(next: "title" | "levels" | "play"): void {
    mode = next;
    hud.show(next);
    if (next === "title") hud.setBackdrop(art.title);
    else if (next === "levels") hud.setBackdrop(art.valley);
    const playing = next === "play";
    view.world.visible = playing;
    view.overlay.visible = playing;
    if (!playing) {
      paused = false;
      settingsOpen = false;
      hud.showPause(false);
      audio.duck(false);
    }
  }

  function begin(index: number): void {
    world = index;
    sim = new Siege(index);
    finished = false;
    selected = 0;
    paused = false;
    settingsOpen = false;
    speed = 1;
    seenWave = -1;
    view.closeMenu();
    view.hideRange();
    view.setMap(art.level(index), sim.map);
    view.setReduced(save.reduced);
    hud.showSettings(false);
    hud.showPause(false);
    hud.setCard(null);
    setMode("play");
    layout();
    fit();
    audio.loop(sim.map.biome);
    hud.announce(`${BALANCE.worlds[index].name}  ·  Start ${BALANCE.worlds[index].jade} Jade`);
  }

  function layout(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    app.stage.hitArea = new Rectangle(0, 0, w, h);
    const root = getComputedStyle(document.documentElement);
    const sat = Number.parseFloat(root.getPropertyValue("--sat")) || 0;
    const sab = Number.parseFloat(root.getPropertyValue("--sab")) || 0;
    const portrait = h > w;
    hud.setSafe(sat + (portrait ? 8 : 0), sab + (portrait ? 10 : 0));
    hud.layout(w, h);
    view.layout(w, h);
    const limits = zoomLimits(w, h);
    zoomMin = limits.min;
    zoomMax = limits.max;
    zoom = Math.max(zoomMin, Math.min(zoomMax, zoom));
    clamp();
  }

  function zoomLimits(w: number, h: number): { min: number; max: number; start: number } {
    const fitted = Math.min(w / MAP_W, h / MAP_H);
    const tall = h > w * 1.05;
    // Portrait shows about a third of the valley. The hero stays a small figure in that frame.
    const start = tall ? h / (MAP_H / 3) : Math.max(fitted * 1.2, w / (MAP_W * 0.55));
    return { min: start, max: start, start: Math.max(fitted, start) };
  }

  function fit(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    const limits = zoomLimits(w, h);
    zoomMin = limits.min;
    zoomMax = limits.max;
    zoom = limits.start;
    const focus = sim?.heroAt() ?? sim?.map.sun ?? { x: MAP_W / 2, y: MAP_H / 2 };
    camX = w / 2 - focus.x * zoom;
    camY = h / 2 - focus.y * zoom;
    clamp();
  }

  function walkTo(sx: number, sy: number): void {
    if (!sim || mode !== "play" || paused || settingsOpen || finished) return;
    const x = (sx - camX) / zoom;
    const y = (sy - camY) / zoom;
    let dest = { x, y };
    let best = 58;
    for (const station of sim.stations) {
      const d = Math.hypot(station.x - x, station.y - y);
      if (d < best) {
        best = d;
        dest = { x: station.x, y: station.y };
      }
    }
    sim.setGoal(dest.x, dest.y);
    view.showGoal(dest.x, dest.y);
  }

  function steerFromInput(): void {
    if (!sim) return;
    hud.setStick(stickOn, originX, originY, knobX, knobY);
    if (stickOn) {
      const dx = knobX - originX;
      const dy = knobY - originY;
      const len = Math.hypot(dx, dy) || 1;
      const mag = Math.min(1, len / 70);
      sim.setSteer((dx / len) * mag, (dy / len) * mag);
      hold = null;
      return;
    }
    let x = 0;
    let y = 0;
    if (keys.has("arrowleft") || keys.has("a")) x -= 1;
    if (keys.has("arrowright") || keys.has("d")) x += 1;
    if (keys.has("arrowup") || keys.has("w")) y -= 1;
    if (keys.has("arrowdown") || keys.has("s")) y += 1;
    if (x !== 0 || y !== 0) {
      const len = Math.hypot(x, y);
      sim.setSteer(x / len, y / len);
      hold = null;
      return;
    }
    if (hold) {
      sim.setSteer(hold.x, hold.y);
      return;
    }
    sim.setSteer(0, 0);
  }

  function frameFight(dt: number): void {
    if (!sim || mode !== "play" || paused || settingsOpen) return;
    const w = app.screen.width;
    const h = app.screen.height;
    const hero = sim.heroAt();
    const tx = w / 2 - hero.x * zoom;
    const ty = h / 2 - hero.y * zoom;
    const k = 1 - Math.exp(-dt * 14);
    camX += (tx - camX) * k;
    camY += (ty - camY) * k;
    clamp();
  }

  function clamp(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    const minX = w - MAP_W * zoom;
    const minY = h - MAP_H * zoom;
    camX = minX >= 0 ? minX / 2 : Math.max(minX, Math.min(0, camX));
    camY = minY >= 0 ? minY / 2 : Math.max(minY, Math.min(0, camY));
  }

  function aimPlacement(): void {
    if (!sim || view.menuPad < 0) {
      view.aimGhost(0, 0, null, false);
      return;
    }
    const kind = view.armedKind();
    const live = sim;
    if (!kind || !live) {
      view.aimGhost(0, 0, null, false);
      return;
    }
    const wx = (hover.x - camX - view.shakeX) / zoom;
    const wy = (hover.y - camY - view.shakeY) / zoom;
    let pad = -1;
    let best = 90;
    live.pads.forEach((at, i) => {
      if (live.towers.some((t) => t.pad === i)) return;
      const d = Math.hypot(at.x - wx, at.y - wy);
      if (d < best) {
        best = d;
        pad = i;
      }
    });
    const afford = live.jade >= towerCost(kind, 0);
    if (pad >= 0) view.aimGhost(live.pads[pad].x, live.pads[pad].y, kind, afford);
    else view.aimGhost(wx, wy, kind, false);
  }

  function present(live: Siege): void {
    const tower = live.towers.find((t) => t.id === selected);
    view.rangeScale = live.rangeScale;
    if (view.menuPad < 0) {
      if (tower) view.showRange(tower.x, tower.y, towerRange(tower.kind, tower.tier) * live.rangeScale, RANGE_COLOR[tower.kind]);
      else view.hideRange();
    }
    hud.setCard(null);
    hud.setTeach("");
    const goal = nextSpend(live);
    hud.setGoal(goal.text, goal.cost, goal.lit, goal.kind);
    hud.setVaultTip(world === 0 && save.taught === 0 && live.phase === "build" && !live.pendingOffer && view.menuPad < 0);
    hud.syncLanes(
      live.lanePlan(),
      { zoom, camX, camY },
      live.phase === "build",
      live.pendingOffer !== null,
      live.stations.map((s) => ({ x: s.x, y: s.y })),
    );
    const boss = live.enemies.find((e) => e.alive && e.boss);
    const baseRatio = live.integrity / Math.max(1, live.integrityMax);
    if (live.phase === "wave" && baseRatio < 0.3 && baseRatio > 0 && !baseWarned) {
      baseWarned = true;
      audio.play("warn");
    }
    if (baseRatio > 0.42) baseWarned = false;
    hud.sync({
      integrity: live.integrity,
      integrityMax: live.integrityMax,
      jade: live.jade,
      wave: live.waveShown,
      waves: live.waveCount,
      phase: live.phase,
      speed,
      flare: live.flare,
      flareReady: live.flare >= BALANCE.flare.need && live.time >= live.flareLock,
      guardian: live.guardianReady,
      buildLeft: live.buildLeft,
      hint: lesson(live) || hintFor(save, live),
      offer: live.pendingOffer?.map((id) => ({ id, name: BALANCE.relics[id].name, blurb: BALANCE.relics[id].blurb })) ?? null,
      offerLeft: live.offerLeft,
      streak: live.streak,
      purse: `Kills ${live.purse.kills}   Waves ${live.purse.waves}\nEarly ${live.purse.early}   Streaks ${live.purse.streaks}`,
      boss: boss ? `${boss.kind === "boss" ? "Colossus" : "Boss"}  ${Math.ceil(boss.hp)} / ${Math.ceil(boss.maxHp)}` : "",
    });
  }

  function teach(step: number): void {
    if (world !== 0 || save.taught >= step) return;
    save = { ...save, taught: step };
    writeSave(save);
  }

  function noteHits(fx: Fx[]): void {
    if (world !== 0) return;
    for (const event of fx) {
      if (event.kind === "death" && save.taught < 3) {
        teach(3);
        hitStop = Math.max(hitStop, 0.4);
        hud.announce("Raiders drop Jade.");
      }
      if (event.kind === "place" && save.taught < 1) teach(1);
    }
  }

  function voice(fx: Fx[]): void {
    let deaths = 0;
    for (const event of fx) {
      if (event.kind === "death") {
        deaths += 1;
        if (deaths <= 3) audio.play("death");
      } else if (event.kind === "banner" && event.text) hud.announce(event.text);
      else if (event.kind === "volley") audio.play("shower");
      else if (event.kind === "splinter") audio.play("crunch");
      else if (event.kind === "multi") audio.play(event.n && event.n >= 8 ? "streak" : "drum");
      else if (event.kind === "callout") audio.play("streak");
      else if (event.kind === "crack") audio.play("crack");
      else if (event.kind === "drum" || event.kind === "slam") audio.play("drum");
      else if (event.kind === "chain") audio.play("chain");
      else if (event.kind === "place") audio.play("place");
      else if (event.kind === "flare") audio.play("flare");
      else if (event.kind === "boss") {
        audio.play("roar");
        if (event.text) hud.announce(event.text);
      } else if (event.kind === "aegis") audio.play("roar");
      else if (event.kind === "rally") audio.play("horn");
      else if (event.kind === "streak") audio.play("streak");
      else if (event.kind === "relic") audio.play("relic");
      else if (event.kind === "tick") {
        const now = performance.now();
        if (now - lastTick > 48) {
          lastTick = now;
          audio.play("click");
        }
      }
      else if (event.kind === "impact" && event.color === TOWER_HUE.dart && event.n !== 2) audio.play("dart");
    }
    if (sim?.towers.some((t) => t.kind === "lens" && t.targetId)) {
      beamAcc += 0.016;
      if (beamAcc > 0.38) {
        audio.play("beam");
        beamAcc = 0;
      }
    }
  }

  function watch(live: Siege): void {
    if (live.phase === "wave" && seenWave !== live.wave) {
      seenWave = live.wave;
      audio.play("horn");
      const firstStrike = live.world === 0 && live.wave === 0 && save.taught < 3;
      hud.announce(firstStrike ? "Tap to move. Stand on a station to fund a tower." : `Wave ${live.wave + 1}`);
      teach(2);
    }
    if (finished) return;
    if (live.phase === "victory") {
      finished = true;
      const stars = starsFor(live.integrity);
      save = recordStars(save, world, stars);
      hud.refreshLevels(save);
      audio.play("victory");
      teach(4);
      hud.showEnd("victory", stars, live.integrity, BALANCE.worlds[world].name, world < worldCount() - 1);
    } else if (live.phase === "defeat") {
      finished = true;
      audio.play("defeat");
      hud.showEnd("defeat", 0, 0, BALANCE.worlds[world].name, false);
    }
  }
}

function hintFor(save: SaveData, live: Siege): string {
  if (live.pendingOffer) return "";
  if (live.world === 1 && live.wave === 0 && live.phase === "build") return "Runners are fast. Frost stalls them. A heavy bolt is wasted here.";
  if (live.world === 3 && live.wave === 0 && live.phase === "build") return "Brutes shrug off arrows. Fund a Heavy Bolt.";
  if (live.world === 5 && live.wave === 0 && live.phase === "build") return "The boulder crushes troops. It wants a Heavy Bolt.";
  if (live.world !== 0) return "";
  if (live.phase === "wave" && live.wave === 0) return "Tap to move. Stand on a station to fund the next tower.";
  if (!live.stations.some((s) => s.tier > 0) && live.phase === "build") {
    return "Fund an Arrow Shower.";
  }
  if (save.taught < 3 && live.phase === "wave") return "Walk over the Jade gems before they fade.";
  if (save.taught <= 1 && live.phase === "build") return `Call early +${BALANCE.earlyCall} Jade, or wait out the timer.`;
  if (live.wave === 1 && live.phase === "build") return "A Frost Snare stalls runners. A Heavy Bolt melts brutes.";
  if (save.taught <= 3) return "Stand on a built station to fund the next tier.";
  return "";
}

function lesson(live: Siege): string {
  if (live.world !== 0 || live.time > 20) return "";
  const funded = live.stations.some((s) => s.tier > 0);
  if (live.time < 7 && !live.heroMoved) return "Tap to move";
  if (live.time < 14 && !live.heroCollected) return "Walk over the gems";
  if (!funded) return "Stand on a station to fund it";
  return "";
}

function nextSpend(live: Siege): { text: string; cost: number; lit: boolean; kind: TowerKind } {
  const options: { cost: number; kind: TowerKind; text: string }[] = [];
  const free = live.pads.some((_, i) => !live.towers.some((t) => t.pad === i));
  if (free) {
    for (const kind of TOWER_KINDS) {
      options.push({ cost: towerCost(kind, 0), kind, text: BALANCE.towerName[kind] });
    }
  }
  for (const tower of live.towers) {
    if (tower.tier >= 2) continue;
    options.push({
      cost: towerCost(tower.kind, tower.tier + 1),
      kind: tower.kind,
      text: `Upgrade ${BALANCE.towerName[tower.kind]}`,
    });
  }
  options.sort((a, b) => a.cost - b.cost);
  if (!options.length) return { text: "Valley ready", cost: 1, lit: false, kind: "dart" };
  const cheapest = options[0];
  const ahead = options.find((o) => o.cost > live.jade);
  const lit = live.jade >= cheapest.cost;
  const focus = !lit || !ahead ? cheapest : ahead;
  const text = !lit
    ? `${shortTower(cheapest.kind)}  ${cheapest.cost}`
    : ahead
      ? `Next ${shortTower(ahead.kind)}  ${ahead.cost}`
      : `${shortTower(cheapest.kind)}  ${cheapest.cost}`;
  return { text, cost: focus.cost, lit, kind: lit ? cheapest.kind : focus.kind };
}

function shortTower(kind: TowerKind): string {
  if (kind === "dart") return "Arrows";
  if (kind === "lens") return "Bolt";
  if (kind === "drum") return "Frost";
  return "Spire";
}

boot().catch((err: unknown) => {
  console.error(err);
  const node = document.getElementById("game");
  if (node) node.textContent = "Sunstone Siege failed to start.";
});
