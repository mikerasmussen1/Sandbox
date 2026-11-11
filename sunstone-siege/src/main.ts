/**
 * Sunstone Siege boot: camera, input, and the loop that joins the simulation
 * to the view. Combat numbers stay in balance.ts.
 */
import { Application, Rectangle } from "pixi.js";
import { buildArt, paintMapTexture } from "./art";
import { AudioBus } from "./audio";
import { BALANCE, starsFor, towerCost, towerRange, worldCount } from "./balance";
import { Hud, type TowerCard } from "./hud";
import { MAP_H, MAP_W, MAPS } from "./maps";
import { isUnlocked, loadSave, recordStars, writeSave, type SaveData } from "./save";
import { Siege, type Fx, type Tower } from "./sim";
import type { TowerKind } from "./types";
import { RANGE_COLOR, WorldView } from "./view";

const params = new URLSearchParams(location.search);

async function boot(): Promise<void> {
  let save: SaveData = loadSave();
  const host = document.getElementById("game");
  if (!host) throw new Error("sunstone-siege: missing #game");
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: 0x07110c,
    antialias: false,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 1.5),
    preference: "webgl",
    powerPreference: "high-performance",
  });
  host.appendChild(app.canvas);
  app.stage.eventMode = "static";

  const art = buildArt();
  const view = new WorldView(art);
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
  }, save);

  app.stage.addChild(view.world, view.overlay, hud.root);
  hud.setBackdrop(paintMapTexture(MAPS[0], 0.5));
  setMode("title");
  layout();

  const fpsNode = params.get("fps") === "1" ? document.createElement("div") : null;
  if (fpsNode) {
    fpsNode.style.cssText = "position:fixed;left:8px;bottom:8px;color:#f6e7c1;font:12px sans-serif;pointer-events:none;opacity:0.8";
    host.appendChild(fpsNode);
  }
  let fpsFrames = 0;
  let fpsStamp = performance.now();

  app.ticker.add((ticker) => {
    const dt = Math.min(0.05, ticker.deltaMS / 1000);
    const running = mode === "play" && sim !== null && !paused && !settingsOpen && !finished;
    if (sim && running) sim.tick(dt * speed);
    if (sim && mode === "play") {
      const fx = sim.fx.splice(0, sim.fx.length);
      view.apply(fx);
      voice(fx);
      view.update(running ? dt : 0, sim);
      view.menuScale(zoom);
      if (view.menuPad >= 0) view.refreshMenu(sim.jade);
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
        fpsNode.textContent = `${fps} fps`;
        fpsFrames = 0;
        fpsStamp = now;
      }
    }
  });

  const pointers = new Map<number, { x: number; y: number }>();
  let dragId = -1;
  let dragX = 0;
  let dragY = 0;
  let moved = 0;
  let pinch = 0;

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
      pinch = span();
      dragId = -1;
      return;
    }
    dragId = e.pointerId;
    dragX = p.x;
    dragY = p.y;
    moved = 0;
  });

  window.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const p = point(e);
    pointers.set(e.pointerId, p);
    if (pointers.size >= 2 && mode === "play") {
      const next = span();
      if (pinch > 0) {
        const mid = centerOfPointers();
        zoomAt(mid.x, mid.y, next / pinch);
      }
      pinch = next;
      return;
    }
    if (e.pointerId !== dragId) return;
    const dx = p.x - dragX;
    const dy = p.y - dragY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6) {
      camX += dx;
      camY += dy;
      clamp();
    }
    dragX = p.x;
    dragY = p.y;
  });

  window.addEventListener("pointerup", (e) => {
    const p = point(e);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (e.pointerId !== dragId) return;
    const was = moved;
    dragId = -1;
    if (was < 8 && sim && mode === "play" && !paused && !settingsOpen && !finished) tap(p.x, p.y);
  });
  window.addEventListener("pointercancel", (e) => {
    pointers.delete(e.pointerId);
    if (e.pointerId === dragId) dragId = -1;
    pinch = 0;
  });

  app.canvas.addEventListener("wheel", (e) => {
    if (mode !== "play") return;
    e.preventDefault();
    const rect = app.canvas.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0011));
  }, { passive: false });

  window.addEventListener("keydown", (e) => {
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
    view.setMap(paintMapTexture(sim.map), sim.map.biome, sim.pads);
    view.setReduced(save.reduced);
    hud.showSettings(false);
    hud.showPause(false);
    hud.setCard(null);
    setMode("play");
    layout();
    fit();
    audio.loop(sim.map.biome);
    hud.announce(BALANCE.worlds[index].name);
  }

  function layout(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    app.stage.hitArea = new Rectangle(0, 0, w, h);
    hud.layout(w, h);
    view.layout(w, h);
    clamp();
  }

  function fit(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    const z = Math.min(w / MAP_W, h / MAP_H);
    zoomMin = z;
    zoomMax = Math.max(z * 2.5, z + 0.15);
    zoom = z;
    camX = (w - MAP_W * zoom) / 2;
    camY = (h - MAP_H * zoom) / 2;
  }

  function clamp(): void {
    const w = app.screen.width;
    const h = app.screen.height;
    const minX = w - MAP_W * zoom;
    const minY = h - MAP_H * zoom;
    camX = minX >= 0 ? minX / 2 : Math.max(minX, Math.min(0, camX));
    camY = minY >= 0 ? minY / 2 : Math.max(minY, Math.min(0, camY));
  }

  function zoomAt(sx: number, sy: number, factor: number): void {
    const beforeX = (sx - camX) / zoom;
    const beforeY = (sy - camY) / zoom;
    zoom = Math.max(zoomMin, Math.min(zoomMax, zoom * factor));
    camX = sx - beforeX * zoom;
    camY = sy - beforeY * zoom;
    clamp();
  }

  function span(): number {
    const pts = [...pointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  function centerOfPointers(): { x: number; y: number } {
    const pts = [...pointers.values()];
    return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  }

  function tap(sx: number, sy: number): void {
    if (!sim) return;
    const wx = (sx - camX - view.shakeX) / zoom;
    const wy = (sy - camY - view.shakeY) / zoom;
    if (view.menuPad >= 0) view.closeMenu();
    let towerId = 0;
    let best = 42;
    for (const tower of sim.towers) {
      const d = Math.hypot(tower.x - wx, tower.y - wy);
      if (d < best) {
        best = d;
        towerId = tower.id;
      }
    }
    if (towerId) {
      selected = towerId;
      return;
    }
    let pad = -1;
    best = 48;
    const pads = sim.pads;
    for (let i = 0; i < pads.length; i++) {
      if (sim.towers.some((t) => t.pad === i)) continue;
      const d = Math.hypot(pads[i].x - wx, pads[i].y - wy);
      if (d < best) {
        best = d;
        pad = i;
      }
    }
    if (pad >= 0) {
      selected = 0;
      view.openMenu(pad, pads[pad], zoom, sim.jade, (kind) => tryPlace(kind, pad));
      return;
    }
    selected = 0;
    view.hideRange();
  }

  function tryPlace(kind: TowerKind, pad: number): void {
    if (!sim) return;
    if (!sim.place(pad, kind)) {
      audio.play("deny");
      return;
    }
    view.closeMenu();
    selected = sim.towers[sim.towers.length - 1]?.id ?? 0;
  }

  function present(live: Siege): void {
    const tower = live.towers.find((t) => t.id === selected);
    if (view.menuPad < 0) {
      if (tower) view.showRange(tower.x, tower.y, towerRange(tower.kind, tower.tier), RANGE_COLOR[tower.kind]);
      else view.hideRange();
    }
    hud.setCard(tower ? describe(tower, live.jade) : null);
    hud.sync({
      integrity: live.integrity,
      jade: live.jade,
      wave: live.waveShown,
      waves: live.waveCount,
      phase: live.phase,
      speed,
      flare: live.flare,
      flareReady: live.flare >= BALANCE.flare.need && live.time >= live.flareLock,
      buildLeft: live.buildLeft,
      showHint: live.towers.length === 0,
    });
  }

  function voice(fx: Fx[]): void {
    for (const event of fx) {
      if (event.kind === "death") audio.play("death");
      else if (event.kind === "jade") audio.play("jade");
      else if (event.kind === "crack") audio.play("crack");
      else if (event.kind === "drum" || event.kind === "slam") audio.play("drum");
      else if (event.kind === "chain") audio.play("chain");
      else if (event.kind === "place") audio.play("place");
      else if (event.kind === "flare") audio.play("flare");
      else if (event.kind === "boss") {
        audio.play("horn");
        if (event.text) hud.announce(event.text);
      } else if (event.kind === "impact") audio.play("dart");
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
      hud.announce(`Wave ${live.wave + 1}`);
    }
    if (finished) return;
    if (live.phase === "victory") {
      finished = true;
      const stars = starsFor(live.integrity);
      save = recordStars(save, world, stars);
      hud.refreshLevels(save);
      audio.play("victory");
      hud.showEnd("victory", stars, live.integrity, BALANCE.worlds[world].name, world < worldCount() - 1);
    } else if (live.phase === "defeat") {
      finished = true;
      audio.play("defeat");
      hud.showEnd("defeat", 0, 0, BALANCE.worlds[world].name, false);
    }
  }
}

function describe(tower: Tower, jade: number): TowerCard {
  const tier = tower.tier;
  let line = "";
  if (tower.kind === "dart") {
    const s = BALANCE.dart[tier];
    line = `Damage ${s.damage}    Range ${s.range}    Every ${s.interval.toFixed(2)}s`;
  } else if (tower.kind === "lens") {
    const s = BALANCE.lens[tier];
    line = `Beam ${s.dps} to ${s.dps + s.rampMax}    Range ${s.range}`;
  } else if (tower.kind === "drum") {
    const s = BALANCE.drum[tier];
    line = `Ring ${s.damage}    Radius ${s.radius}    Stun ${s.stun.toFixed(2)}s`;
  } else {
    const s = BALANCE.spire[tier];
    line = `Arc ${s.damage}    Jumps ${s.jumps}    Range ${s.range}`;
  }
  const next = tier < 2 ? towerCost(tower.kind, tier + 1) : null;
  return {
    name: BALANCE.towerName[tower.kind],
    blurb: BALANCE.towerBlurb[tower.kind],
    tier: `Tier ${tier + 1}`,
    line,
    upgrade: next === null ? null : `Upgrade ${next}`,
    sell: `Sell ${Math.floor(tower.spent * BALANCE.sellRefund)}`,
    canUpgrade: next !== null && jade >= next,
  };
}

boot().catch((err: unknown) => {
  console.error(err);
  const node = document.getElementById("game");
  if (node) node.textContent = "Sunstone Siege failed to start.";
});
