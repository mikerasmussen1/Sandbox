/**
 * Painted art, baked into atlases when the valley loads.
 * Every shape is drawn here. Nothing is a purchased or imported picture.
 */
import { Rectangle, Texture } from "pixi.js";
import type { Biome, EnemyKind, TowerKind } from "./types";
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

function stamp(p: Packer, name: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void): void {
  const at = p.alloc(w, h);
  draw(p.ctx, at.x, at.y);
  p.frames[name] = new Rectangle(at.x, at.y, w, h);
}

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string, rot = 0): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number): void {
  ellipse(ctx, x, y, rx, ry, "rgba(0,0,0,0.38)");
}

function gem(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.72, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.72, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(x - 1, y - s * 0.55, 2, s * 0.4);
}

function plinth(ctx: CanvasRenderingContext2D, cx: number, base: number, tier: number): void {
  shadow(ctx, cx, base + 6, 28 + tier * 4, 8);
  ctx.fillStyle = "#2c261e";
  ctx.beginPath();
  ctx.moveTo(cx - 26 - tier * 3, base - 4);
  ctx.lineTo(cx + 26 + tier * 3, base - 4);
  ctx.lineTo(cx + 18 + tier * 2, base + 12);
  ctx.lineTo(cx - 18 - tier * 2, base + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#6b6256";
  ctx.fillRect(cx - 22 - tier * 2, base - 8, 44 + tier * 4, 6);
  ctx.fillStyle = tier === 2 ? "#e6c27a" : "#8d8376";
  ctx.fillRect(cx - 18, base - 7, 36, 2);
  for (let i = 0; i <= tier; i++) gem(ctx, cx - 10 + i * 10, base + 4, 3.5, "#3ddc9a");
}

function goldBand(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = "#e6b15a";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#fff1c2";
  ctx.fillRect(x, y, w, Math.max(1, h * 0.35));
}

function drawDart(ctx: CanvasRenderingContext2D, tier: number, x: number, y: number): void {
  const cx = x + 64;
  const base = y + 108;
  plinth(ctx, cx, base, tier);
  const h = 46 + tier * 16;
  ctx.fillStyle = tier === 2 ? "#d9d0c2" : tier === 1 ? "#b7b1a6" : "#8a7560";
  ctx.fillRect(cx - (6 + tier), base - h, 12 + tier * 2, h - 6);
  ctx.fillStyle = "#4a3828";
  ctx.fillRect(cx - 3, base - h, 6, h - 10);
  const spears = tier + 1;
  for (let i = 0; i < spears; i++) {
    const ox = (i - (spears - 1) / 2) * (10 + tier * 2);
    const tip = base - h - 10 - (tier === 2 && i === 1 ? 12 : 0);
    ctx.fillStyle = "#6d4a2c";
    ctx.beginPath();
    ctx.moveTo(cx + ox, tip);
    ctx.lineTo(cx + ox + 7, tip + 18);
    ctx.lineTo(cx + ox - 7, tip + 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = tier === 2 ? "#fff1c2" : "#f2d48a";
    ctx.fillRect(cx + ox - 1.5, tip + 4, 3, 12);
  }
  if (tier >= 1) goldBand(ctx, cx - 10, base - h * 0.45, 20, 4);
  if (tier === 2) {
    disc(ctx, cx, base - h - 8, 5, "rgba(255,220,140,0.9)");
    ctx.strokeStyle = "#3ddc9a";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 12, base - h * 0.72, 24, 10);
  }
}

function drawLens(ctx: CanvasRenderingContext2D, tier: number, x: number, y: number): void {
  const cx = x + 64;
  const base = y + 108;
  plinth(ctx, cx, base, tier);
  const lift = 36 + tier * 10;
  ctx.fillStyle = "#5c564c";
  ctx.fillRect(cx - 5, base - lift, 10, lift);
  if (tier >= 1) {
    ctx.fillStyle = "#8d8376";
    ctx.fillRect(cx - 16, base - lift + 6, 6, 18);
    ctx.fillRect(cx + 10, base - lift + 6, 6, 18);
  }
  const r = 14 + tier * 6;
  const cy = base - lift - r + 6;
  ctx.fillStyle = "#3a342c";
  disc(ctx, cx, cy, r + 4, "#3a342c");
  const g = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, r);
  g.addColorStop(0, tier === 2 ? "#fff6d0" : "#ffe0a0");
  g.addColorStop(0.45, "#ffb03a");
  g.addColorStop(1, "#c45a18");
  ctx.fillStyle = g;
  disc(ctx, cx, cy, r, "#ffb03a");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = tier === 2 ? "#fff1c2" : "#e6b15a";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (tier === 2) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.strokeStyle = "rgba(255,220,140,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r + 4), cy + Math.sin(a) * (r + 4));
      ctx.lineTo(cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12));
      ctx.stroke();
    }
  }
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.28, cy - r * 0.28, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawDrum(ctx: CanvasRenderingContext2D, tier: number, x: number, y: number): void {
  const cx = x + 64;
  const base = y + 108;
  plinth(ctx, cx, base, tier);
  const rw = 18 + tier * 8;
  const rh = 12 + tier * 4;
  const cy = base - 28 - tier * 6;
  ctx.fillStyle = "#4a3024";
  ctx.fillRect(cx - 4, cy, 8, base - cy - 8);
  if (tier >= 1) {
    ctx.fillRect(cx - rw, cy + 4, 5, base - cy - 16);
    ctx.fillRect(cx + rw - 5, cy + 4, 5, base - cy - 16);
  }
  ellipse(ctx, cx, cy + rh * 0.45, rw, rh * 0.72, "#5a3828");
  ellipse(ctx, cx, cy, rw, rh, tier === 2 ? "#c47a3a" : "#8a4a30");
  ctx.strokeStyle = "#e6c27a";
  ctx.lineWidth = tier === 2 ? 4 : 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,220,160,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, rw * 0.7, rh * 0.45, 0, Math.PI, 0);
  ctx.stroke();
  if (tier >= 1) {
    for (let i = 0; i < 5; i++) gem(ctx, cx - 16 + i * 8, cy + rh + 6, 2.4, "#f0d060");
  }
  if (tier === 2) {
    ctx.fillStyle = "#1a1214";
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, cx - 2, cy - 2, 1.5, "#ffb03a");
  }
}

function drawSpire(ctx: CanvasRenderingContext2D, tier: number, x: number, y: number): void {
  const cx = x + 64;
  const base = y + 108;
  plinth(ctx, cx, base, tier);
  ctx.strokeStyle = tier === 2 ? "#d9d0c2" : "#8d867c";
  ctx.lineWidth = 7 + tier;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, base - 8);
  const coils = 2 + tier;
  for (let i = 0; i < coils; i++) {
    const y1 = base - 20 - i * 16;
    const dir = i % 2 === 0 ? 1 : -1;
    ctx.quadraticCurveTo(cx + dir * (22 + tier * 4), y1 + 8, cx + dir * 6, y1);
  }
  ctx.stroke();
  const headY = base - 24 - coils * 14;
  ctx.fillStyle = tier === 2 ? "#1f8f62" : "#146b4a";
  disc(ctx, cx + 8, headY, 6 + tier, "#1f8f62");
  disc(ctx, cx + 8, headY, 6 + tier, tier === 2 ? "#3ddc9a" : "#146b4a");
  disc(ctx, cx + 11, headY - 1, 2, "#e8fff4");
  if (tier >= 1) disc(ctx, cx - 6, headY + 12, 3, "#3ddc9a");
  if (tier === 2) {
    ctx.strokeStyle = "rgba(180,255,210,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, headY + 8, 16, 0.4, 2.4);
    ctx.stroke();
  }
}

function drawTower(ctx: CanvasRenderingContext2D, kind: TowerKind, tier: number, x: number, y: number): void {
  if (kind === "dart") drawDart(ctx, tier, x, y);
  else if (kind === "lens") drawLens(ctx, tier, x, y);
  else if (kind === "drum") drawDrum(ctx, tier, x, y);
  else drawSpire(ctx, tier, x, y);
}

function legs(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, color: string, reach: number): void {
  const stride = [0, 1, 0, -1][frame % 4] * reach;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x - 8, y + 8 + stride);
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + 8, y + 8 - stride);
  ctx.stroke();
}

function drawEnemy(ctx: CanvasRenderingContext2D, kind: EnemyKind, frame: number, x: number, y: number, s: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, s, s);
  ctx.clip();
  ctx.translate(x + s / 2, y + s / 2);
  ctx.scale(1.65, 1.65);
  ctx.translate(-(x + s / 2), -(y + s / 2));
  const cx = x + s * 0.46;
  const cy = y + s * 0.5;
  const bob = [0, 2, 0, 1][frame % 4];
  shadow(ctx, x + s * 0.5, y + s - 12, s * 0.22, s * 0.06);
  if (kind === "runner") {
    legs(ctx, cx, cy + 8 + bob, frame, "#7a1d16", 4);
    ctx.fillStyle = "#c4382a";
    ctx.beginPath();
    ctx.ellipse(cx, cy + bob, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a2018";
    ctx.fillRect(cx - 8, cy - 2 + bob, 16, 8);
    ctx.fillStyle = "#1a1214";
    ctx.beginPath();
    ctx.moveTo(cx + 12, cy - 6 + bob);
    ctx.lineTo(cx - 2, cy - 12 + bob);
    ctx.lineTo(cx - 2, cy + 2 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f2d48a";
    ctx.fillRect(cx + 2, cy - 6 + bob, 3, 3);
    ctx.fillRect(cx + 6, cy - 5 + bob, 2, 2);
  } else if (kind === "shield") {
    legs(ctx, cx - 6, cy + 10, frame, "#5a3028", 3);
    ctx.fillStyle = "#8a3a2a";
    ctx.beginPath();
    ctx.ellipse(cx - 6, cy, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx - 12, cy - 10, 12, 8);
    ctx.fillStyle = "#e6d2b0";
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 16);
    ctx.lineTo(cx + 18, cy - 12);
    ctx.lineTo(cx + 16, cy + 14);
    ctx.lineTo(cx + 2, cy + 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8a6230";
    ctx.lineWidth = 2;
    ctx.stroke();
    goldBand(ctx, cx + 6, cy - 2, 8, 3);
  } else if (kind === "jaguar") {
    const crouch = bob;
    ellipse(ctx, cx - 2, cy + 4 + crouch, 16, 8, "#c47a2a");
    ellipse(ctx, cx + 14, cy - 2 + crouch, 8, 6, "#c47a2a");
    ctx.fillStyle = "#2a1a10";
    for (let i = 0; i < 4; i++) ctx.fillRect(cx - 12 + i * 6, cy + (i % 2) * 3, 3, 3);
    ctx.strokeStyle = "#8a4a16";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy + 4);
    ctx.quadraticCurveTo(cx - 24, cy - 8 + frame * 2, cx - 18, cy - 12);
    ctx.stroke();
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx + 16, cy - 6, 5, 3);
    disc(ctx, cx + 18, cy - 4, 1.2, "#f2d48a");
  } else if (kind === "golem") {
    const step = [0, -2, 0, 2][frame % 4];
    ctx.fillStyle = "#6a6560";
    ctx.fillRect(cx - 18, cy + 6 + step, 14, 12);
    ctx.fillRect(cx + 4, cy + 8 - step, 14, 12);
    ctx.fillStyle = "#8a8680";
    ctx.fillRect(cx - 16, cy - 8, 34, 20);
    ctx.fillStyle = "#6e6a64";
    ctx.fillRect(cx - 8, cy - 4, 18, 6);
    ctx.fillStyle = "#b7b1a6";
    ctx.fillRect(cx - 12, cy - 26, 26, 20);
    ctx.fillStyle = "#5c5852";
    ctx.fillRect(cx - 8, cy - 20, 18, 6);
    ctx.fillStyle = "#d6ff6a";
    ctx.fillRect(cx - 5, cy - 18, 4, 4);
    ctx.fillRect(cx + 4, cy - 18, 4, 4);
  } else if (kind === "shard") {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(frame * 0.8);
    ctx.fillStyle = "#9a948c";
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(12, 6);
    ctx.lineTo(-2, 12);
    ctx.lineTo(-12, -2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d9d2c4";
    ctx.fillRect(-2, -6, 5, 4);
    ctx.restore();
  } else if (kind === "glider") {
    const wing = 6 + [10, 4, 12, 2][frame % 4];
    ellipse(ctx, cx, cy + 16, 8, 3, "rgba(40,16,24,0.35)");
    ctx.fillStyle = "#6a3048";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 26, cy - wing);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 26, cy - wing * 0.85);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#e07060";
    ctx.beginPath();
    ctx.ellipse(cx + 6, cy + 2, 6, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1214";
    ctx.fillRect(cx + 8, cy - 2, 6, 4);
  } else {
    const stomp = [0, 3, 0, 4][frame % 4];
    ctx.fillStyle = "#140e14";
    ctx.fillRect(cx - 34, cy + 8 + stomp, 16, 18);
    ctx.fillRect(cx + 18, cy + 10 - stomp, 16, 18);
    ctx.fillStyle = "#241820";
    ctx.fillRect(cx - 32, cy - 16, 64, 36);
    ctx.fillStyle = "#3a2430";
    ctx.fillRect(cx - 28, cy - 12, 56, 8);
    ctx.fillStyle = "#100810";
    ctx.fillRect(cx - 22, cy - 48, 44, 36);
    ctx.fillStyle = "#e6b15a";
    for (let i = 0; i < 5; i++) ctx.fillRect(cx - 16 + (i % 3) * 10, cy - 8 + Math.floor(i / 3) * 10, 14, 2);
    ctx.fillStyle = "#ffb03a";
    ctx.fillRect(cx - 10, cy - 36, 6, 5);
    ctx.fillRect(cx + 6, cy - 36, 6, 5);
    ctx.fillStyle = "#1a100c";
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 48);
    ctx.lineTo(cx - 28, cy - 68);
    ctx.lineTo(cx - 6, cy - 48);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 16, cy - 48);
    ctx.lineTo(cx + 28, cy - 68);
    ctx.lineTo(cx + 6, cy - 48);
    ctx.fill();
    if (frame % 2 === 0) {
      ctx.fillStyle = "rgba(255,120,60,0.35)";
      ctx.fillRect(cx - 8, cy + 4, 16, 4);
    }
  }
  ctx.restore();
}

function drawSun(ctx: CanvasRenderingContext2D, part: "outer" | "mid" | "inner" | "disk", x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2;
  if (part === "disk") {
    const g = ctx.createRadialGradient(cx - 8, cy - 10, 6, cx, cy, s * 0.42);
    g.addColorStop(0, "#fff6d4");
    g.addColorStop(0.4, "#ffb03a");
    g.addColorStop(1, "#c45a18");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6a3810";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.08, 0.2, Math.PI * 1.5);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * s * 0.18, cy + Math.sin(a) * s * 0.18);
      ctx.lineTo(cx + Math.cos(a) * s * 0.3, cy + Math.sin(a) * s * 0.3);
      ctx.stroke();
    }
    return;
  }
  const radius = part === "outer" ? s * 0.42 : part === "mid" ? s * 0.36 : s * 0.3;
  const count = part === "outer" ? 24 : part === "mid" ? 12 : 16;
  ctx.strokeStyle = part === "mid" ? "#1f8f62" : "#e6c27a";
  ctx.lineWidth = part === "inner" ? 6 : 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const inner = radius - (part === "outer" ? 16 : 8);
    const outer = radius + (part === "outer" ? (i % 2 === 0 ? 22 : 12) : 8);
    ctx.strokeStyle = part === "mid" ? (i % 2 ? "#3ddc9a" : "#146b4a") : i % 2 === 0 ? "#f0d7a2" : "#a56b28";
    ctx.lineWidth = part === "outer" ? 4 : 3;
    ctx.beginPath();
    if (part === "outer" && i % 2 === 0) {
      ctx.fillStyle = "#e6b15a";
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a - 0.08) * outer, cy + Math.sin(a - 0.08) * outer);
      ctx.lineTo(cx + Math.cos(a + 0.08) * outer, cy + Math.sin(a + 0.08) * outer);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.stroke();
    }
  }
}

function drawFx(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2;
  if (name === "glow") {
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, s / 2);
    g.addColorStop(0, "rgba(255,230,170,0.95)");
    g.addColorStop(0.35, "rgba(255,150,40,0.45)");
    g.addColorStop(1, "rgba(255,80,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, s, s);
  } else if (name === "spark") {
    ctx.fillStyle = "#fff3c4";
    disc(ctx, cx, cy, s * 0.16, "#fff3c4");
  } else if (name === "dart") {
    ctx.fillStyle = "#f2d48a";
    ctx.beginPath();
    ctx.moveTo(x + s - 4, cy);
    ctx.lineTo(x + 6, cy - 5);
    ctx.lineTo(x + 6, cy + 5);
    ctx.closePath();
    ctx.fill();
  } else if (name === "leaf") {
    ctx.fillStyle = "#2f6a34";
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.32, s * 0.12, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#14301a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 2);
    ctx.lineTo(cx + 6, cy - 2);
    ctx.stroke();
  } else if (name === "mote") {
    disc(ctx, cx, cy, 3, "rgba(210,255,180,0.95)");
  } else if (name === "pad") {
    ellipse(ctx, cx, cy + 2, 20, 12, "#5c564c");
    ellipse(ctx, cx, cy, 18, 11, "#8a8378");
    ctx.strokeStyle = "#e6d7b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    gem(ctx, cx, cy, 4, "#3ddc9a");
  } else if (name === "jade") {
    gem(ctx, cx, cy, 11, "#3ddc9a");
    gem(ctx, cx, cy - 1, 5, "#e8fff4");
  } else if (name === "star") {
    ctx.fillStyle = "#f0d060";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 13 : 5;
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
    ctx.strokeRect(cx - 8, cy - 8, 16, 12);
    ctx.beginPath();
    ctx.arc(cx, cy - 8, 6, Math.PI, 0);
    ctx.stroke();
  }
}

export function buildArt(): ArtSet {
  const p = packer(2048);
  const kinds: TowerKind[] = ["dart", "lens", "drum", "spire"];
  for (const kind of kinds) {
    for (let tier = 0; tier < 3; tier++) {
      stamp(p, `tower-${kind}-${tier}`, 128, 128, (ctx, x, y) => drawTower(ctx, kind, tier, x, y));
    }
  }
  const enemies: EnemyKind[] = ["runner", "shield", "jaguar", "golem", "shard", "glider", "boss"];
  for (const kind of enemies) {
    const s = kind === "boss" ? 160 : kind === "shard" ? 72 : 96;
    const frames = kind === "shard" ? 2 : 4;
    for (let f = 0; f < frames; f++) {
      stamp(p, `enemy-${kind}-${f}`, s, s, (ctx, x, y) => drawEnemy(ctx, kind, f, x, y, s));
    }
  }
  stamp(p, "sun-ring", 256, 256, (ctx, x, y) => drawSun(ctx, "outer", x, y, 256));
  stamp(p, "sun-mid", 220, 220, (ctx, x, y) => drawSun(ctx, "mid", x, y, 220));
  stamp(p, "sun-inner", 180, 180, (ctx, x, y) => drawSun(ctx, "inner", x, y, 180));
  stamp(p, "sun-disk", 200, 200, (ctx, x, y) => drawSun(ctx, "disk", x, y, 200));
  for (const name of ["glow", "spark", "dart", "leaf", "mote", "pad", "jade", "star", "lock"]) {
    const s = name === "glow" ? 160 : name === "pad" ? 64 : 48;
    stamp(p, name, s, s, (ctx, x, y) => drawFx(ctx, name, x, y, s));
  }
  const base = Texture.from(p.ctx.canvas);
  base.source.autoGenerateMipmaps = false;
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
  const g = ctx.createRadialGradient(128, 128, 40, 128, 128, 150);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
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
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = rng() > 0.5 ? "rgba(20,48,26,0.45)" : "rgba(12,28,16,0.4)";
    ctx.beginPath();
    ctx.ellipse(rng() * 512, rng() * 512, 16 + rng() * 28, 7 + rng() * 10, rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

const PALETTE: Record<Biome, { sky: string[]; dirt: string[]; leaf: string[]; light: string; trunk: string }> = {
  valley: {
    sky: ["#0c2416", "#14361c", "#1d4a28"],
    dirt: ["#3a2614", "#8a5a32", "#d2b07a"],
    leaf: ["#0e2814", "#1c4a22", "#2f6b34", "#4a8a3a", "#1a3a20"],
    light: "rgba(255,214,140,0.16)",
    trunk: "#3a2616",
  },
  ruins: {
    sky: ["#1a2214", "#3a3420", "#4a4630"],
    dirt: ["#3a2a18", "#a07848", "#e6c898"],
    leaf: ["#24301c", "#4a5830", "#6a7040", "#2e4428"],
    light: "rgba(255,196,120,0.14)",
    trunk: "#4a3a28",
  },
  crater: {
    sky: ["#100c18", "#1a1028", "#241838"],
    dirt: ["#241416", "#5a3028", "#c46a40"],
    leaf: ["#140e22", "#241848", "#3a2060", "#1a1430"],
    light: "rgba(140,160,255,0.08)",
    trunk: "#2a2030",
  },
};

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

function tree(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, pal: (typeof PALETTE)["valley"], rng: () => number): void {
  ctx.fillStyle = pal.trunk;
  ctx.fillRect(x - s * 0.05, y - s * 0.05, s * 0.1, s * 0.38);
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = pal.leaf[Math.floor(rng() * pal.leaf.length)];
    ctx.beginPath();
    ctx.ellipse(x + (rng() - 0.5) * s * 0.25, y - s * 0.18 - i * s * 0.08, s * (0.34 + rng() * 0.12), s * 0.2, rng() * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#d6f0a8";
  ctx.beginPath();
  ctx.ellipse(x - s * 0.1, y - s * 0.32, s * 0.12, s * 0.06, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function vine(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, rng: () => number): void {
  ctx.strokeStyle = "rgba(18,70,36,0.85)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  let py = y;
  let px = x;
  for (let i = 0; i < 3; i++) {
    py += len / 3;
    const nx = x + (rng() - 0.5) * 18;
    ctx.quadraticCurveTo(px + (rng() - 0.5) * 20, py - 8, nx, py);
    px = nx;
  }
  ctx.stroke();
  ctx.fillStyle = "#2f6a34";
  ctx.beginPath();
  ctx.ellipse(px, py, 7, 3, rng() * 2, 0, Math.PI * 2);
  ctx.fill();
}

function pool(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, night: boolean): void {
  ctx.fillStyle = night ? "#6a3018" : "#143e48";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = night ? "#c46a40" : "#2f8a96";
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.72, ry * 0.68, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = night ? "rgba(255,180,80,0.45)" : "rgba(190,255,246,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x - rx * 0.1, y - ry * 0.15, rx * 0.4, ry * 0.18, -0.4, Math.PI, 0);
  ctx.stroke();
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
  const g = ctx.createLinearGradient(0, 0, MAP_W, MAP_H);
  g.addColorStop(0, pal.sky[0]);
  g.addColorStop(0.55, pal.sky[1]);
  g.addColorStop(1, pal.sky[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  for (let i = 0; i < 70; i++) {
    tree(ctx, rng() * MAP_W, rng() * MAP_H, 70 + rng() * 150, pal, rng);
  }
  for (let i = 0; i < 36; i++) vine(ctx, rng() * MAP_W, rng() * 400, 40 + rng() * 80, rng);

  if (map.biome === "ruins") {
    for (let i = 0; i < 16; i++) {
      const x = rng() * MAP_W;
      const y = rng() * MAP_H;
      ctx.fillStyle = rng() > 0.5 ? "#6a5a44" : "#8a7a60";
      ctx.fillRect(x, y, 18 + rng() * 28, 28 + rng() * 40);
      ctx.strokeStyle = "rgba(40,28,16,0.6)";
      ctx.strokeRect(x, y, 18, 30);
    }
  }
  if (map.biome === "crater") {
    ctx.strokeStyle = "rgba(255,90,30,0.35)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.moveTo(rng() * MAP_W, rng() * MAP_H);
      ctx.lineTo(rng() * MAP_W, rng() * MAP_H);
      ctx.stroke();
    }
  }

  if (map.biome !== "crater") {
    pool(ctx, 280 + rng() * 200, 860, 70, 36, false);
    pool(ctx, 1680, 280, 54, 28, false);
  } else {
    pool(ctx, 420, 240, 60, 30, true);
  }

  if (map.river) {
    strokePath(ctx, map.river, 78, "#123840");
    strokePath(ctx, map.river, 52, "#1e6e78");
    strokePath(ctx, map.river, 18, "rgba(190,255,246,0.45)");
  }

  for (const route of map.routes) {
    strokePath(ctx, route.pts, 64, "#24160e");
    strokePath(ctx, route.pts, 46, pal.dirt[0]);
    strokePath(ctx, route.pts, 28, pal.dirt[1]);
    strokePath(ctx, route.pts, 8, pal.dirt[2], 0.55);
  }

  ctx.beginPath();
  const teeth = 36;
  for (let i = 0; i <= teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const wobble = 128 + Math.sin(i * 2.2) * 18 + (i % 3) * 6;
    const x = SUN.x + Math.cos(a) * wobble;
    const y = SUN.y + Math.sin(a) * wobble * 0.88;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "#1a100c";
  ctx.fill();
  ctx.strokeStyle = "#6a4a32";
  ctx.lineWidth = 6;
  ctx.stroke();
  const pit = ctx.createRadialGradient(SUN.x, SUN.y, 8, SUN.x, SUN.y, 90);
  pit.addColorStop(0, "#120804");
  pit.addColorStop(1, "#3a2416");
  ctx.fillStyle = pit;
  ctx.beginPath();
  ctx.ellipse(SUN.x, SUN.y, 86, 74, 0, 0, Math.PI * 2);
  ctx.fill();

  for (const route of map.routes) {
    const gate = route.pts[0];
    ctx.fillStyle = "#3a3228";
    ctx.fillRect(gate.x - 18, gate.y - 34, 12, 40);
    ctx.fillRect(gate.x + 8, gate.y - 34, 12, 40);
    ctx.fillStyle = "#e6c27a";
    ctx.fillRect(gate.x - 22, gate.y - 40, 46, 10);
    ctx.fillStyle = "#6a4a2a";
    ctx.fillRect(gate.x - 4, gate.y - 38, 8, 6);
  }

  for (const b of map.bridges ?? []) {
    ctx.fillStyle = "#c4a06a";
    ctx.fillRect(b.x - 34, b.y - 18, 68, 36);
    ctx.strokeStyle = "#6a4a2a";
    ctx.lineWidth = 3;
    ctx.strokeRect(b.x - 34, b.y - 18, 68, 36);
    ctx.beginPath();
    ctx.moveTo(b.x - 20, b.y);
    ctx.lineTo(b.x + 20, b.y);
    ctx.stroke();
  }

  const light = ctx.createRadialGradient(420, 180, 40, SUN.x, SUN.y, 980);
  light.addColorStop(0, pal.light);
  light.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = rng() > 0.7 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    ctx.fillRect(rng() * MAP_W, rng() * MAP_H, 2, 2);
  }

  const tex = Texture.from(canvas);
  tex.source.autoGenerateMipmaps = false;
  return tex;
}

/** Title and valley-select painting. Smaller than a battle map, so the menus stay light. */
export function paintMenuScene(): Texture {
  const w = 1280;
  const h = 720;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Texture.from(canvas);
  const rng = mulberry(7);
  const pal = PALETTE.valley;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#102818");
  g.addColorStop(1, "#07140c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 28; i++) tree(ctx, rng() * w, 80 + rng() * h, 90 + rng() * 160, pal, rng);
  strokePath(ctx, [{ x: -20, y: 250 }, { x: 360, y: 300 }, { x: 640, y: 420 }, { x: 980, y: 360 }, { x: 1320, y: 480 }], 54, "#24160e");
  strokePath(ctx, [{ x: -20, y: 250 }, { x: 360, y: 300 }, { x: 640, y: 420 }, { x: 980, y: 360 }, { x: 1320, y: 480 }], 28, "#8a5a32");
  strokePath(ctx, [{ x: 200, y: 740 }, { x: 480, y: 520 }, { x: 640, y: 430 }], 40, "#24160e");
  strokePath(ctx, [{ x: 200, y: 740 }, { x: 480, y: 520 }, { x: 640, y: 430 }], 18, "#a87840");
  const pit = ctx.createRadialGradient(640, 300, 10, 640, 300, 90);
  pit.addColorStop(0, "#fff1c2");
  pit.addColorStop(0.4, "#ffb03a");
  pit.addColorStop(1, "rgba(80,30,8,0)");
  ctx.fillStyle = pit;
  ctx.beginPath();
  ctx.arc(640, 300, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e6c27a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(640, 300, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#1f8f62";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(640, 300, 28, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 18; i++) vine(ctx, rng() * w, rng() * 200, 50 + rng() * 40, rng);
  const shade = ctx.createRadialGradient(640, 340, 80, 640, 360, 520);
  shade.addColorStop(0, "rgba(0,0,0,0.05)");
  shade.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
  const tex = Texture.from(canvas);
  tex.source.autoGenerateMipmaps = false;
  return tex;
}
