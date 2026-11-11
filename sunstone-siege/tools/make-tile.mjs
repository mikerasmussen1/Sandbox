/**
 * Paints the lobby tile: a 3:4 jungle crater with no words on it.
 * Run: node sunstone-siege/tools/make-tile.mjs
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const W = 900;
const H = 1200;
const buf = Buffer.alloc(W * H * 3);

function noise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function set(x, y, r, g, b) {
  const xi = x | 0;
  const yi = y | 0;
  if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
  const i = (yi * W + xi) * 3;
  buf[i] = r;
  buf[i + 1] = g;
  buf[i + 2] = b;
}

function blend(x, y, r, g, b, a) {
  const xi = x | 0;
  const yi = y | 0;
  if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
  const i = (yi * W + xi) * 3;
  buf[i] = buf[i] * (1 - a) + r * a;
  buf[i + 1] = buf[i + 1] * (1 - a) + g * a;
  buf[i + 2] = buf[i + 2] * (1 - a) + b * a;
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const n = noise(x * 0.35, y * 0.35);
    const canopy = noise(x * 0.02, y * 0.018);
    const shade = noise(x * 0.008 + 4, y * 0.008);
    set(
      x,
      y,
      16 + canopy * 28 + shade * 10,
      42 + canopy * 58 + n * 14,
      24 + canopy * 18,
    );
  }
}

function disc(cx, cy, rad, r, g, b, a) {
  const r2 = rad * rad;
  for (let y = cy - rad; y <= cy + rad; y++) {
    for (let x = cx - rad; x <= cx + rad; x++) {
      const d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d <= r2) blend(x, y, r, g, b, a * (1 - d / r2 * 0.25));
    }
  }
}

function pathStroke(pts, width, r, g, b) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const c = pts[i];
    const steps = Math.hypot(c.x - a.x, c.y - a.y);
    for (let s = 0; s <= steps; s += 1) {
      const k = s / steps;
      const x = a.x + (c.x - a.x) * k;
      const y = a.y + (c.y - a.y) * k;
      disc(x, y, width, r, g, b, 0.92);
    }
  }
}

const sun = { x: 450, y: 640 };
pathStroke([{ x: 20, y: 280 }, { x: 180, y: 360 }, { x: 320, y: 520 }, sun], 28, 92, 68, 36);
pathStroke([{ x: 20, y: 280 }, { x: 200, y: 500 }, { x: 300, y: 760 }, { x: 400, y: 700 }, sun], 26, 84, 60, 32);
pathStroke([{ x: 700, y: 40 }, { x: 620, y: 220 }, { x: 540, y: 400 }, sun], 26, 96, 70, 38);
pathStroke([{ x: 860, y: 980 }, { x: 700, y: 860 }, { x: 560, y: 780 }, sun], 28, 88, 62, 34);

disc(sun.x, sun.y, 118, 42, 24, 12, 1);
disc(sun.x, sun.y, 78, 120, 48, 16, 1);
disc(sun.x, sun.y, 46, 255, 186, 64, 1);
disc(sun.x, sun.y, 22, 255, 236, 170, 1);

function tower(x, y) {
  disc(x, y, 22, 58, 52, 46, 1);
  disc(x, y - 6, 10, 92, 78, 60, 1);
  disc(x, y - 16, 5, 255, 196, 80, 0.9);
}

tower(250, 430);
tower(560, 500);
tower(390, 820);
tower(640, 760);

disc(310, 560, 7, 168, 42, 36, 1);
disc(360, 590, 6, 168, 42, 36, 1);
disc(500, 470, 7, 150, 36, 32, 1);

for (let i = 0; i < 40; i++) {
  const x = 250 + i * 4.2;
  const y = 430 - i * 3.2;
  disc(x, y, 3, 255, 210, 90, 0.35);
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - W / 2) / (W / 2);
    const dy = (y - H / 2) / (H / 2);
    const v = Math.min(0.72, (dx * dx + dy * dy) * 0.45);
    blend(x, y, 4, 10, 6, v);
  }
}

const here = path.dirname(fileURLToPath(import.meta.url));
const ppm = path.join(here, "tile.ppm");
const jpg = path.resolve(here, "../public/tile.jpg");
const header = Buffer.from(`P6\n${W} ${H}\n255\n`);
writeFileSync(ppm, Buffer.concat([header, buf]));
const ff = spawnSync("ffmpeg", ["-y", "-i", ppm, "-q:v", "3", jpg], { stdio: "inherit" });
unlinkSync(ppm);
if (ff.status !== 0) process.exit(ff.status ?? 1);
console.log(jpg);
