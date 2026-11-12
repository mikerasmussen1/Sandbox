"""Portrait valleys and a stepping guardian walk.

The layouts written to src/levels.ts are the same polylines painted into the maps.
"""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public" / "art"
W, H = 960, 1800
SUN = (480, 1520)
RIM = 46

THEMES = [
    # top, cliff, path, accent
    ((92, 176, 72), (78, 92, 58), (214, 186, 120), (40, 120, 48)),
    ((196, 154, 78), (140, 86, 48), (232, 206, 150), (90, 140, 50)),
    ((78, 168, 96), (64, 96, 70), (186, 214, 170), (40, 110, 130)),
    ((176, 132, 70), (120, 72, 46), (228, 196, 140), (160, 70, 40)),
    ((70, 158, 86), (52, 90, 58), (200, 176, 110), (30, 100, 60)),
    ((188, 140, 72), (130, 78, 44), (236, 210, 156), (70, 120, 48)),
    ((150, 124, 78), (96, 70, 52), (210, 188, 140), (90, 80, 50)),
    ((168, 110, 64), (110, 62, 48), (220, 180, 130), (150, 50, 36)),
]


def clamp(v: float, a: float, b: float) -> float:
    return max(a, min(b, v))


def poly(x0: float, wobble: float, phase: float) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    y = 36.0
    while y < SUN[1] - 200:
        x = x0 + math.sin(y * 0.0075 + phase) * wobble
        pts.append((clamp(x, 90, W - 90), y))
        y += 190
    pts.append((clamp(SUN[0] + (x0 - SUN[0]) * 0.35, 120, W - 120), SUN[1] - 150))
    pts.append((float(SUN[0]), float(SUN[1] - RIM)))
    return pts


def pads_for(routes: list[list[tuple[float, float]]], n: int) -> list[tuple[float, float]]:
    samples: list[tuple[float, float, float, float]] = []
    for route in routes:
        for i in range(len(route) - 1):
            ax, ay = route[i]
            bx, by = route[i + 1]
            seg = math.hypot(bx - ax, by - ay) or 1
            steps = max(1, int(seg / 150))
            for s in range(steps):
                t = (s + 0.5) / steps
                x = ax + (bx - ax) * t
                y = ay + (by - ay) * t
                if math.hypot(x - SUN[0], y - SUN[1]) < 150:
                    continue
                ang = math.atan2(by - ay, bx - ax)
                samples.append((x, y, ang, y))
    samples.sort(key=lambda p: p[3])
    if not samples:
        return []
    picked: list[tuple[float, float]] = []
    step = max(1, len(samples) // n)
    side = 1
    for i in range(0, len(samples), step):
        x, y, ang, _ = samples[i]
        ox = math.cos(ang + math.pi / 2) * 108 * side
        oy = math.sin(ang + math.pi / 2) * 108 * side
        px = clamp(x + ox, 70, W - 70)
        py = clamp(y + oy, 70, H - 80)
        if all(math.hypot(px - qx, py - qy) > 86 for qx, qy in picked):
            picked.append((px, py))
        side *= -1
        if len(picked) >= n:
            break
    return picked


def layouts() -> list[dict]:
    specs = [
        ("valley", [poly(480, 70, 0.4)], 150, 8),
        ("valley", [poly(480, 150, 1.1)], 190, 8),
        ("ruins", [poly(300, 60, 0.2), poly(660, 60, 2.1)], 130, 10),
        ("ruins", [poly(280, 90, 0.6), poly(700, 80, 2.4)], 150, 10),
        ("valley", [poly(250, 50, 1.4), poly(710, 50, 2.8)], 140, 10),
        ("crater", [poly(480, 170, 0.9)], 210, 8),
        ("ruins", [poly(220, 40, 0.3), poly(480, 36, 1.7), poly(740, 40, 2.6)], 120, 12),
        ("crater", [poly(320, 80, 0.5), poly(640, 80, 2.2)], 150, 10),
    ]
    out = []
    for biome, routes, width, count in specs:
        spots = pads_for(routes, count)
        while len(spots) < 8:
            spots.append((120 + 80 * len(spots), 400 + 40 * len(spots)))
        out.append({"biome": biome, "width": width, "routes": routes, "pads": spots})
    return out


def write_levels(levels: list[dict]) -> None:
    def vecs(pts: list[tuple[float, float]]) -> str:
        return ", ".join(f"{{ x: {x:.1f}, y: {y:.1f} }}" for x, y in pts)
    lines = [
        "/** Portrait valleys. Generated with the map painter so the roads match. */",
        'import type { Biome, Vec } from "./types";',
        "",
        "export interface LevelLayout {",
        "  biome: Biome;",
        "  pathWidth: number;",
        "  routes: Vec[][];",
        "  pads: Vec[];",
        "}",
        "",
        "export const LEVELS: LevelLayout[] = [",
    ]
    for level in levels:
        routes = ",\n      ".join(f"[{vecs(r)}]" for r in level["routes"])
        pads = vecs(level["pads"])
        lines.append("  {")
        lines.append(f'    biome: "{level["biome"]}",')
        lines.append(f'    pathWidth: {level["width"]},')
        lines.append(f"    routes: [\n      {routes},\n    ],")
        lines.append(f"    pads: [{pads}],")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    (ROOT / "src" / "levels.ts").write_text("\n".join(lines))


def sample(routes: list[list[tuple[float, float]]]) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    for route in routes:
        for i in range(len(route) - 1):
            ax, ay = route[i]
            bx, by = route[i + 1]
            seg = math.hypot(bx - ax, by - ay) or 1
            n = max(1, int(seg / 10))
            for s in range(n + 1):
                t = s / n
                pts.append((ax + (bx - ax) * t, ay + (by - ay) * t))
    return pts


def paint(level: dict, theme: tuple, index: int) -> None:
    top, cliff, path, accent = theme
    yy, xx = np.mgrid[0 : H // 4, 0 : W // 4].astype(np.float32)
    edge = np.minimum(np.minimum(xx, W // 4 - 1 - xx), np.minimum(yy, H // 4 - 1 - yy))
    # Warp the rim so the cliff is a canyon wall, not a picture frame.
    warp = 8 * np.sin(yy * 0.09 + index) + 6 * np.sin(xx * 0.13 + index * 0.7)
    edge = edge + warp
    height = np.clip(edge / 14, 0, 1)
    height = np.where(edge > 28, 0.82, height)
    hills = (
        np.sin(xx * 0.22 + index * 1.3) * np.cos(yy * 0.08) * 0.16
        + np.sin((xx * 0.7 + yy) * 0.05 + index) * 0.1
        + np.sin(yy * 0.19) * 0.05
    )
    height = np.clip(height + hills, 0, 1.2)
    road = sample(level["routes"])
    width = level["width"] / 4
    for px, py in road[::2]:
        d = np.hypot(xx - px / 4, yy - py / 4)
        groove = np.clip(d / width, 0, 1)
        height = np.minimum(height, 0.48 + groove * 0.55)
    gy, gx = np.gradient(height)
    light = np.clip(0.62 + (-gx * 0.9 - gy * 1.15) * 1.4, 0.38, 1.18)
    rgb = np.zeros((H // 4, W // 4, 3), np.float32)
    for c in range(3):
        high = top[c] / 255
        low = cliff[c] / 255
        road_c = path[c] / 255
        base = low + (high - low) * np.clip(height, 0, 1)
        # path is the mid band of height
        on_road = np.clip(1 - np.abs(height - 0.55) * 3.2, 0, 1)
        base = base * (1 - on_road * 0.85) + road_c * on_road * 0.85
        rgb[:, :, c] = np.clip(base * light, 0, 1)
    # ambient occlusion where the road meets the grass
    ao = np.clip(1 - np.abs(height - 0.62) * 6, 0, 1) * 0.28
    rgb *= 1 - ao[..., None]
    img = Image.fromarray((rgb * 255).astype(np.uint8), "RGB").resize((W, H), Image.BICUBIC)
    draw = ImageDraw.Draw(img, "RGBA")
    rng = np.random.default_rng(100 + index)
    # rounded rocks and props sitting on the high ground
    for _ in range(46):
        x = int(rng.integers(40, W - 40))
        y = int(rng.integers(40, H - 40))
        if math.hypot(x - SUN[0], y - SUN[1]) < 120:
            continue
        if any(math.hypot(x - px, y - py) < level["width"] * 0.7 for px, py in road[::6]):
            continue
        kind = int(rng.integers(0, 5))
        if kind <= 1:
            rad = int(rng.integers(22, 48))
            draw.ellipse((x - rad, y - rad * 0.45, x + rad, y + rad * 0.35), fill=(40, 30, 20, 70))
            draw.ellipse((x - rad, y - rad, x + rad, y + rad * 0.8), fill=cliff)
            draw.ellipse((x - rad * 0.7, y - rad * 0.85, x + rad * 0.15, y - rad * 0.15), fill=tuple(min(255, c + 40) for c in cliff))
        elif kind == 2 and index % 3 != 1:
            # hut
            draw.ellipse((x - 22, y + 8, x + 22, y + 18), fill=(40, 30, 20, 80))
            draw.rectangle((x - 28, y - 18, x + 28, y + 22), fill=(166, 108, 62, 255))
            draw.polygon([(x - 36, y - 14), (x, y - 46), (x + 36, y - 14)], fill=(132, 58, 38, 255))
            draw.rectangle((x - 7, y - 2, x + 7, y + 22), fill=(78, 46, 30, 255))
        elif kind == 3:
            # cactus or broad leaf
            green = accent
            draw.rounded_rectangle((x - 5, y - 26, x + 5, y + 10), radius=4, fill=green + (255,))
            draw.rounded_rectangle((x - 16, y - 16, x - 6, y - 4), radius=4, fill=green + (255,))
            draw.rounded_rectangle((x + 6, y - 12, x + 16, y), radius=4, fill=tuple(min(255, c + 20) for c in green) + (255,))
        else:
            # round bush
            draw.ellipse((x - 14, y - 8, x + 14, y + 10), fill=(30, 24, 16, 60))
            draw.ellipse((x - 16, y - 18, x + 16, y + 8), fill=accent + (255,))
            draw.ellipse((x - 8, y - 16, x + 2, y - 4), fill=tuple(min(255, c + 30) for c in accent) + (230,))
    # small sun plaza, stone rim, lit top
    sx, sy = SUN
    draw.ellipse((sx - 34, sy - 16, sx + 34, sy + 18), fill=(50, 36, 20, 90))
    draw.ellipse((sx - RIM, sy - RIM * 0.72, sx + RIM, sy + RIM * 0.62), fill=(214, 168, 78, 255))
    draw.ellipse((sx - RIM + 8, sy - RIM * 0.55, sx + RIM - 10, sy + RIM * 0.2), fill=(255, 214, 120, 255))
    draw.ellipse((sx - 10, sy - 8, sx + 8, sy + 6), fill=(255, 244, 200, 255))
    img = img.filter(ImageFilter.SMOOTH)
    img.save(ART / f"map-l{index}.webp", "WEBP", quality=76, method=4)


def step_walk() -> None:
    src = Image.open(ART / "sprites" / "guardian" / "guardian_walk.webp").convert("RGBA")
    fw, fh = 160, 200
    cols, rows = 6, 8
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    for r in range(rows):
        base = src.crop((0, r * fh, fw, (r + 1) * fh))
        px = np.array(base)
        alpha = px[:, :, 3]
        ys, xs = np.where(alpha > 20)
        if len(xs) == 0:
            continue
        leg = int(fh * 0.58)
        leg_xs = np.where(alpha[leg:, :] > 20)[1]
        split = int(np.median(leg_xs)) if len(leg_xs) else int(np.median(xs))
        body = px.copy()
        body[leg:, :, 3] = 0
        left = px.copy()
        left[:leg, :, 3] = 0
        left[:, split:, 3] = 0
        right = px.copy()
        right[:leg, :, 3] = 0
        right[:, :split, 3] = 0
        for c in range(cols):
            phase = c / cols * math.tau
            bob = int(round(abs(math.sin(phase)) * 5))
            shift = int(round(math.sin(phase) * 9))
            lift_l = int(round(max(0, -math.cos(phase)) * 9))
            lift_r = int(round(max(0, math.cos(phase)) * 9))
            frame = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
            body_i = Image.fromarray(body, "RGBA")
            frame.alpha_composite(body_i, (0, -bob))
            frame.alpha_composite(Image.fromarray(left, "RGBA"), (-shift, -lift_l))
            frame.alpha_composite(Image.fromarray(right, "RGBA"), (shift, -lift_r))
            out.paste(frame, (c * fw, r * fh))
    out.save(ART / "sprites" / "guardian" / "guardian_walk.webp", "WEBP", quality=86, method=4)


def touch_icon() -> None:
    icon = Image.new("RGB", (180, 180), (20, 48, 28))
    d = ImageDraw.Draw(icon)
    d.ellipse((28, 28, 152, 152), fill=(232, 176, 64))
    d.ellipse((62, 62, 118, 118), fill=(255, 236, 180))
    icon.save(ART / "touch-icon.png")


def main() -> None:
    levels = layouts()
    write_levels(levels)
    for i, level in enumerate(levels):
        paint(level, THEMES[i], i)
        print("painted", i, "pads", len(level["pads"]), "routes", len(level["routes"]))
    step_walk()
    touch_icon()
    print("done")


if __name__ == "__main__":
    main()
