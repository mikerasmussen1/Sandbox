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
SUN = (480, 1040)
RIM = 46

THEMES = [
    # top, cliff, path, accent
    ((96, 196, 78), (86, 98, 70), (228, 196, 132), (46, 140, 52)),
    ((214, 170, 96), (150, 92, 58), (236, 210, 150), (90, 150, 56)),
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
    """A long road from the top edge that folds back into the central base."""
    pts: list[tuple[float, float]] = []
    y = 48.0
    while y < 1680:
        x = x0 + math.sin(y * 0.008 + phase) * wobble
        pts.append((clamp(x, 80, W - 80), y))
        y += 180
    pts.append((clamp(x0 * 0.4 + SUN[0] * 0.6, 120, W - 120), 1720))
    pts.append((SUN[0] + (x0 - SUN[0]) * 0.22, SUN[1] + 240))
    pts.append((float(SUN[0]), float(SUN[1])))
    return pts


def point_at(route: list[tuple[float, float]], frac: float) -> tuple[float, float, float]:
    segs = [math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]) or 1 for i in range(len(route) - 1)]
    total = sum(segs) or 1
    want = total * frac
    walked = 0.0
    for i, seg in enumerate(segs):
        if walked + seg >= want or i == len(segs) - 1:
            t = min(1, (want - walked) / seg)
            ax, ay = route[i]
            bx, by = route[i + 1]
            return (ax + (bx - ax) * t, ay + (by - ay) * t, math.atan2(by - ay, bx - ax))
        walked += seg
    return (route[-1][0], route[-1][1], 0)


def pads_for(routes: list[list[tuple[float, float]]], n: int) -> list[tuple[float, float]]:
    """A yard ringing the base, where every road and flight path comes in.

    The pads share one short kill window. A slow single-target shot wastes
    itself on the lead body. A shower lands on that same crowd.
    """
    per = max(2, math.ceil(n / len(routes)))
    picked: list[tuple[float, float]] = []
    for route in routes:
        x, y, ang = point_at(route, 0.36)
        ux, uy = math.cos(ang), math.sin(ang)
        px, py = -uy, ux
        for i in range(per):
            side = -1 if i % 2 == 0 else 1
            along = (i // 2 - 0.5) * 54
            ox = x + ux * along + px * 92 * side
            oy = y + uy * along + py * 92 * side
            ox = clamp(ox, 70, W - 70)
            oy = clamp(oy, 70, H - 80)
            if all(math.hypot(ox - qx, oy - qy) > 72 for qx, qy in picked):
                picked.append((ox, oy))
            if len(picked) >= n:
                return picked
    return picked


def layouts() -> list[dict]:
    specs = [
        ("valley", [poly(300, 70, 0.4), poly(680, 60, 2.1)], 140, 8),
        ("valley", [poly(260, 110, 1.1), poly(710, 90, 2.5)], 160, 8),
        ("ruins", [poly(300, 60, 0.2), poly(660, 60, 2.1)], 130, 10),
        ("ruins", [poly(280, 90, 0.6), poly(700, 80, 2.4)], 150, 10),
        ("valley", [poly(250, 50, 1.4), poly(710, 50, 2.8)], 140, 10),
        ("crater", [poly(250, 130, 0.9), poly(720, 110, 2.3)], 180, 8),
        ("ruins", [poly(220, 40, 0.3), poly(480, 36, 1.7), poly(740, 40, 2.6)], 120, 12),
        ("crater", [poly(320, 80, 0.5), poly(640, 80, 2.2)], 150, 10),
    ]
    out = []
    for biome, routes, width, count in specs:
        spots = pads_for(routes, count)
        while len(spots) < 8:
            spots.append((SUN[0] - 180 + 50 * (len(spots) % 4), SUN[1] + 80 + 36 * (len(spots) % 3)))
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
    top, cliff, path_c, accent = theme
    # Blocky grass so the ground reads as a lit board, not a blur.
    rgb = np.zeros((H // 6, W // 6, 3), np.float32)
    for c in range(3):
        rgb[:, :, c] = top[c] / 255
    img = Image.fromarray((rgb * 255).astype(np.uint8), "RGB").resize((W, H), Image.NEAREST).convert("RGBA")
    draw = ImageDraw.Draw(img)
    face = cliff
    lip = tuple(min(255, c + 55) for c in top)
    road = sample(level["routes"])
    width = int(level["width"])
    shadow = tuple(max(0, c - 55) for c in path_c)
    stripe = tuple(min(255, c + 32) for c in path_c)
    def stamp(pts: list[tuple[float, float]], rad: float, fill: tuple, squash: float = 0.78) -> None:
        for x, y in pts[::2]:
            draw.ellipse((x - rad, y - rad * squash, x + rad, y + rad * squash), fill=fill)
    # A cliff runs down the left of the road so a close camera still sees thickness.
    depth = 150 if index in (1, 3, 5, 7) else 96
    if road:
        wall = [(x - depth * 0.55, y + 18) for x, y in road]
        stamp(wall, depth * 0.62, face + (255,), 0.9)
        draw.line([(x - width * 0.5, y + 2) for x, y in road], fill=lip + (255,), width=9)
        stamp([(x + 6, y + 8) for x, y in road], width * 0.34 + 6, shadow + (180,))
        stamp(road, width * 0.32, path_c + (255,))
        draw.line(road, fill=stripe + (255,), width=max(8, width // 12))
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
            rad = int(rng.integers(18, 36))
            draw.ellipse((x - rad, y + 4, x + rad, y + rad * 0.7), fill=(30, 24, 16, 90))
            draw.polygon([(x, y - rad * 1.5), (x - rad * 0.7, y + 4), (x + rad * 0.7, y + 4)], fill=accent + (255,))
            draw.polygon([(x - 4, y - rad), (x - rad * 0.45, y + 2), (x + 2, y + 2)], fill=tuple(min(255, c + 40) for c in accent) + (255,))
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
    # A fence around the base, with a gap wherever a road comes in.
    for i in range(22):
        ang = i / 22 * math.pi * 2
        fx = sx + math.cos(ang) * 168
        fy = sy + math.sin(ang) * 120
        if any(math.hypot(fx - px, fy - py) < level["width"] * 0.55 for px, py in road[::4]):
            continue
        draw.rectangle((fx - 4, fy - 16, fx + 4, fy + 10), fill=(92, 58, 32, 255))
        draw.rectangle((fx - 14, fy - 8, fx + 14, fy - 3), fill=(122, 78, 42, 255))
    arr = np.asarray(img).astype(np.float32)
    rgb_arr = arr[..., :3]
    yy, xx = np.mgrid[0:H, 0:W]
    light = 0.86 + 0.16 * (1 - yy / H) + 0.08 * (1 - xx / W)
    glow = np.exp(-(((xx - sx) ** 2) + ((yy - sy) ** 2)) / (2 * 260 ** 2))
    light = np.clip(light + glow * 0.22, 0.75, 1.28)
    rgb_arr *= light[..., None]
    rgb_arr[..., 0] = np.clip(rgb_arr[..., 0] * 1.03, 0, 255)
    img = Image.fromarray(np.clip(rgb_arr, 0, 255).astype(np.uint8), "RGB")
    img.save(ART / f"map-l{index}.webp", "WEBP", quality=80, method=4)


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
    touch_icon()
    print("done")


if __name__ == "__main__":
    main()
