/**
 * Procedural art. One unit atlas, a canopy tile, a vignette, and a painted
 * map per valley. Nothing here is a purchased or imported picture.
 */
import { Rectangle, Texture } from "pixi.js";
import type { EnemyKind, TowerKind } from "./types";
import { MAP_H, MAP_W, SUN, type MapDef } from "./maps";

export interface ArtSet {
  units: Texture;
  frame(name: string): Texture;
  vignette: Texture;
  canopy: Texture;
}

function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function css(hex: number, alpha = 1): string {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Packer {
  ctx: CanvasRenderingContext2D;
  frames: Record<string, Rectangle>;
  alloc(w: number, h: number): { x: number; y: number };
}

function packer(size: number): Packer {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("sunstone-siege: canvas unavailable");
  const frames: Record<string, Rectangle> = {};
  let x = 2;
  let y = 2;
  let row = 0;
  return {
    ctx,
    frames,
    alloc(w: number, h: number) {
      if (x + w + 2 > size) {
        x = 2;
        y += row + 2;
        row = 0;
      }
      if (y + h + 2 > size) throw new Error("sunstone-siege: atlas overflow");
      const at = { x, y };
      x += w + 2;
      row = Math.max(row, h);
      return at;
    },
  };
}

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number): void {
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gem(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.7, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.7, y);
  ctx.closePath();
  ctx.fill();
}

function drawTower(ctx: CanvasRenderingContext2D, kind: TowerKind, tier: number, x: number, y: number): void {
  const cx = x + 48;
  const cy = y + 52;
  shadow(ctx, cx, y + 84, 26, 8);
  const stone = tier === 2 ? "#d9d2c4" : tier === 1 ? "#b7b1a6" : "#8d887e";
  const dark = "#3c3832";
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy + 18);
  ctx.lineTo(cx + 22, cy + 18);
  ctx.lineTo(cx + 16, cy + 28);
  ctx.lineTo(cx - 16, cy + 28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = stone;
  if (kind === "dart") {
    ctx.fillRect(cx - 8, cy - 22, 16, 42);
    ctx.fillStyle = "#6d4a2c";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 40);
    ctx.lineTo(cx + 12, cy - 16);
    ctx.lineTo(cx - 12, cy - 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f2d48a";
    ctx.fillRect(cx - 2, cy - 36, 4, 16);
  } else if (kind === "lens") {
    ctx.beginPath();
    ctx.arc(cx, cy - 4, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f0c14a";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = tier === 2 ? "#fff1b0" : "#ffb03a";
    ctx.beginPath();
    ctx.arc(cx, cy - 4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = stone;
    ctx.fillRect(cx - 5, cy + 8, 10, 16);
  } else if (kind === "drum") {
    ctx.fillStyle = "#7a3b28";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e6c27a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = stone;
    ctx.fillRect(cx - 4, cy + 8, 8, 16);
    ctx.fillRect(cx - 16, cy + 10, 6, 14);
    ctx.fillRect(cx + 10, cy + 10, 6, 14);
  } else {
    ctx.strokeStyle = stone;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, cy + 22);
    ctx.quadraticCurveTo(cx + 16, cy, cx, cy - 16);
    ctx.quadraticCurveTo(cx - 18, cy - 28, cx + 4, cy - 38);
    ctx.stroke();
    ctx.fillStyle = "#1f8f62";
    ctx.beginPath();
    ctx.arc(cx + 6, cy - 40, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i <= tier; i++) gem(ctx, cx - 10 + i * 10, y + 86, 4, "#3ddc9a");
}

function drawEnemy(ctx: CanvasRenderingContext2D, kind: EnemyKind, frame: number, x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2 + 2;
  const step = (frame % 2 === 0 ? -1 : 1) * (frame < 2 ? 2 : 3);
  shadow(ctx, cx, y + s - 10, s * 0.22, s * 0.06);
  if (kind === "runner") {
    ctx.fillStyle = "#c4382a";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx - 7, cy - 8, 14, 10);
    ctx.fillStyle = "#f2d48a";
    ctx.fillRect(cx - 4, cy - 5, 2, 3);
    ctx.fillRect(cx + 2, cy - 5, 2, 3);
    ctx.strokeStyle = "#7a1d16";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 8);
    ctx.lineTo(cx - 8, cy + 16 + step);
    ctx.moveTo(cx + 6, cy + 8);
    ctx.lineTo(cx + 8, cy + 16 - step);
    ctx.stroke();
  } else if (kind === "shield") {
    ctx.fillStyle = "#8a3a2a";
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c8b89a";
    ctx.fillRect(cx + 4, cy - 14, 12, 26);
    ctx.strokeStyle = "#6a5a40";
    ctx.strokeRect(cx + 4, cy - 14, 12, 26);
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx - 10, cy - 8, 12, 9);
  } else if (kind === "jaguar") {
    ctx.fillStyle = "#c47a2a";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 12, cy - 2, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a1a10";
    for (let i = 0; i < 4; i++) ctx.fillRect(cx - 10 + i * 6, cy + (i % 2) + step * 0.2, 3, 3);
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx + 10, cy - 6, 6, 4);
  } else if (kind === "golem") {
    ctx.fillStyle = "#8a8680";
    const bob = step;
    ctx.fillRect(cx - 16, cy - 8 + bob, 32, 22);
    ctx.fillRect(cx - 10, cy - 22 + bob, 20, 16);
    ctx.fillStyle = "#5c5852";
    ctx.fillRect(cx - 6, cy - 16 + bob, 12, 6);
    ctx.fillStyle = "#d6ff6a";
    ctx.fillRect(cx - 4, cy - 12 + bob, 3, 3);
    ctx.fillRect(cx + 2, cy - 12 + bob, 3, 3);
  } else if (kind === "shard") {
    ctx.fillStyle = "#9a948c";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx + 12, cy + 8);
    ctx.lineTo(cx - 4, cy + 12);
    ctx.lineTo(cx - 12, cy);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#5a564e";
    ctx.fillRect(cx - 2, cy - 2, 6, 5);
  } else if (kind === "glider") {
    const wing = 8 + (frame % 2) * 7;
    ctx.fillStyle = "rgba(80,40,50,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 16, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6a3048";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 22, cy - wing);
    ctx.lineTo(cx - 6, cy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 22, cy - wing);
    ctx.lineTo(cx + 6, cy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#e07060";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#241820";
    ctx.fillRect(cx - 28, cy - 10, 56, 36);
    ctx.fillRect(cx - 18, cy - 36, 36, 30);
    ctx.fillStyle = "#e6b15a";
    ctx.fillRect(cx - 16, cy - 8, 32, 3);
    ctx.fillRect(cx - 10, cy + 6, 20, 2);
    ctx.fillStyle = "#ffb03a";
    ctx.fillRect(cx - 8, cy - 24, 5, 4);
    ctx.fillRect(cx + 4, cy - 24, 5, 4);
    ctx.fillStyle = "#3a2430";
    ctx.fillRect(cx - 34, cy + 8 + step, 10, 16);
    ctx.fillRect(cx + 24, cy + 8 - step, 10, 16);
  }
}

function drawSun(ctx: CanvasRenderingContext2D, disk: boolean, x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2;
  if (!disk) {
    ctx.strokeStyle = "#e6c27a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#8a6230";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.strokeStyle = i % 2 === 0 ? "#f0d7a2" : "#a56b28";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * s * 0.3, cy + Math.sin(a) * s * 0.3);
      ctx.lineTo(cx + Math.cos(a) * s * 0.37, cy + Math.sin(a) * s * 0.37);
      ctx.stroke();
    }
    return;
  }
  const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, s * 0.4);
  g.addColorStop(0, "#fff1c2");
  g.addColorStop(0.45, "#ffb03a");
  g.addColorStop(1, "#c45a18");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6a3810";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * s * 0.28, cy + Math.sin(a) * s * 0.28);
    ctx.stroke();
  }
}

function drawFx(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2;
  if (name === "glow") {
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, s / 2);
    g.addColorStop(0, "rgba(255,220,140,0.95)");
    g.addColorStop(0.4, "rgba(255,140,40,0.45)");
    g.addColorStop(1, "rgba(255,80,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, s, s);
  } else if (name === "spark") {
    ctx.fillStyle = "#fff3c4";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "dart") {
    ctx.fillStyle = "#f2d48a";
    ctx.beginPath();
    ctx.moveTo(x + s - 4, cy);
    ctx.lineTo(x + 8, cy - 5);
    ctx.lineTo(x + 8, cy + 5);
    ctx.closePath();
    ctx.fill();
  } else if (name === "leaf") {
    ctx.fillStyle = "#2f6a34";
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.28, s * 0.12, -0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "mote") {
    ctx.fillStyle = "rgba(210,255,180,0.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "pad") {
    ctx.fillStyle = "#6a645c";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d9d0c2";
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (name === "jade") {
    gem(ctx, cx, cy, 10, "#3ddc9a");
  } else if (name === "star") {
    ctx.fillStyle = "#f0d060";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 12 : 5;
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = "#e6c27a";
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 8, cy - 10, 16, 14);
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 6, Math.PI, 0);
    ctx.stroke();
  }
}

function stamp(p: Packer, name: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void): void {
  const at = p.alloc(w, h);
  draw(p.ctx, at.x, at.y);
  p.frames[name] = new Rectangle(at.x, at.y, w, h);
}

export function buildArt(): ArtSet {
  const p = packer(1024);
  const kinds: TowerKind[] = ["dart", "lens", "drum", "spire"];
  for (const kind of kinds) {
    for (let tier = 0; tier < 3; tier++) stamp(p, `tower-${kind}-${tier}`, 96, 96, (ctx, x, y) => drawTower(ctx, kind, tier, x, y));
  }
  const enemies: EnemyKind[] = ["runner", "shield", "jaguar", "golem", "shard", "glider", "boss"];
  for (const kind of enemies) {
    const s = kind === "boss" ? 128 : 72;
    const frames = kind === "shard" ? 2 : 4;
    for (let f = 0; f < frames; f++) {
      stamp(p, `enemy-${kind}-${f}`, s, s, (ctx, x, y) => drawEnemy(ctx, kind, f, x, y, s));
    }
  }
  stamp(p, "sun-ring", 192, 192, (ctx, x, y) => drawSun(ctx, false, x, y, 192));
  stamp(p, "sun-disk", 160, 160, (ctx, x, y) => drawSun(ctx, true, x, y, 160));
  for (const name of ["glow", "spark", "dart", "leaf", "mote", "pad", "jade", "star", "lock"]) {
    const s = name === "glow" ? 128 : 48;
    stamp(p, name, s, s, (ctx, x, y) => drawFx(ctx, name, x, y, s));
  }
  const base = Texture.from(p.ctx.canvas);
  const frames: Record<string, Texture> = {};
  for (const [name, rect] of Object.entries(p.frames)) {
    frames[name] = new Texture({ source: base.source, frame: rect });
  }
  return {
    units: base,
    frame: (name) => {
      const t = frames[name];
      if (!t) throw new Error(`sunstone-siege: missing frame ${name}`);
      return t;
    },
    vignette: Texture.from(vignetteCanvas()),
    canopy: Texture.from(canopyCanvas()),
  };
}

function vignetteCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const g = ctx.createRadialGradient(128, 128, 50, 128, 128, 150);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return c;
}

function canopyCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const rng = mulberry(99);
  for (let i = 0; i < 28; i++) {
    ctx.fillStyle = css(rng() > 0.5 ? 0x14301a : 0x0c1c10, 0.55);
    ctx.beginPath();
    ctx.ellipse(rng() * 512, rng() * 512, 18 + rng() * 30, 8 + rng() * 12, rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

const PALETTE = {
  valley: { base: ["#102416", "#1c3d22", "#245a30"], dirt: ["#3a2616", "#8a5a32", "#c4a06a"], canopy: ["#0e2814", "#1e4a28", "#2f6b34", "#3e8a3a"] },
  ruins: { base: ["#1a2218", "#3a3424", "#4a4630"], dirt: ["#3a2a18", "#a07848", "#e0c090"], canopy: ["#243024", "#4a5830", "#6a7040", "#2a4030"] },
  crater: { base: ["#100c16", "#1a1028", "#241430"], dirt: ["#2a1614", "#5a3028", "#c46a40"], canopy: ["#140e22", "#2a1848", "#3a2060", "#201430"] },
} as const;

function strokePath(ctx: CanvasRenderingContext2D, pts: readonly { x: number; y: number }[], width: number, color: string, alpha = 1): void {
  if (pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();
}

export function paintMapTexture(map: MapDef, scale = 1): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(MAP_W * scale));
  canvas.height = Math.max(2, Math.round(MAP_H * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return Texture.from(canvas);
  ctx.scale(scale, scale);
  const pal = PALETTE[map.biome];
  const rng = mulberry(map.seed);
  const g = ctx.createLinearGradient(0, 0, 0, MAP_H);
  g.addColorStop(0, pal.base[0]);
  g.addColorStop(0.5, pal.base[1]);
  g.addColorStop(1, pal.base[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  for (let i = 0; i < 240; i++) {
    ctx.fillStyle = pal.canopy[Math.floor(rng() * pal.canopy.length)];
    ctx.globalAlpha = 0.35 + rng() * 0.5;
    ctx.beginPath();
    ctx.ellipse(rng() * MAP_W, rng() * MAP_H, 40 + rng() * 120, 24 + rng() * 70, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (map.river) {
    strokePath(ctx, map.river, 70, "#1a4e58");
    strokePath(ctx, map.river, 46, "#2f8a96");
    strokePath(ctx, map.river, 16, "#b7fff6", 0.35);
  }

  for (const route of map.routes) {
    strokePath(ctx, route.pts, 58, pal.dirt[0]);
    strokePath(ctx, route.pts, 40, pal.dirt[1]);
    strokePath(ctx, route.pts, 12, pal.dirt[2], 0.55);
  }

  if (map.biome === "crater") {
    const rng2 = mulberry(map.seed + 3);
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = css(0xff6a2a, 0.35);
      ctx.lineWidth = 2;
      const x = rng2() * MAP_W;
      const y = rng2() * MAP_H;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 30, y + 8);
      ctx.stroke();
    }
  }

  // Jagged crater lip, then the pit the live Sunstone sits in.
  ctx.beginPath();
  const teeth = 32;
  for (let i = 0; i <= teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const wobble = 118 + Math.sin(i * 2.3) * 16 + rng() * 14;
    const x = SUN.x + Math.cos(a) * wobble;
    const y = SUN.y + Math.sin(a) * wobble * 0.9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "#1a100c";
  ctx.fill();
  const pit = ctx.createRadialGradient(SUN.x, SUN.y, 10, SUN.x, SUN.y, 88);
  pit.addColorStop(0, "#070403");
  pit.addColorStop(1, "#3a2416");
  ctx.fillStyle = pit;
  ctx.beginPath();
  ctx.ellipse(SUN.x, SUN.y, 84, 74, 0, 0, Math.PI * 2);
  ctx.fill();

  for (const pad of map.pads) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(pad.x, pad.y + 6, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7a746c";
    ctx.beginPath();
    ctx.ellipse(pad.x, pad.y, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e6dfd2";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (const route of map.routes) {
    const gate = route.pts[0];
    ctx.fillStyle = "#4a4038";
    ctx.fillRect(gate.x - 16, gate.y - 26, 10, 32);
    ctx.fillRect(gate.x + 6, gate.y - 26, 10, 32);
    ctx.fillRect(gate.x - 18, gate.y - 32, 36, 10);
  }

  for (const b of map.bridges ?? []) {
    ctx.fillStyle = "#c4a06a";
    ctx.fillRect(b.x - 28, b.y - 16, 56, 32);
    ctx.strokeStyle = "#6a4a2a";
    ctx.strokeRect(b.x - 28, b.y - 16, 56, 32);
  }

  const edge = ctx.createRadialGradient(SUN.x, SUN.y, 280, SUN.x, SUN.y, 980);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  const tex = Texture.from(canvas);
  tex.source.autoGenerateMipmaps = false;
  return tex;
}
