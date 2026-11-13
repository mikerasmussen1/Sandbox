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
    # top, cliff, path, accent. Jungle, sandstone, river, canyon, pine, dunes, ruins, ember.
    ((72, 168, 58), (48, 86, 42), (214, 176, 114), (28, 118, 40)),
    ((214, 176, 108), (168, 112, 64), (236, 214, 168), (110, 132, 58)),
    ((58, 148, 96), (42, 86, 64), (176, 204, 164), (32, 108, 132)),
    ((186, 118, 62), (128, 68, 40), (220, 176, 124), (156, 58, 34)),
    ((48, 128, 74), (36, 74, 48), (186, 164, 108), (22, 88, 48)),
    ((206, 158, 84), (150, 96, 52), (232, 206, 150), (78, 124, 46)),
    ((142, 128, 96), (92, 78, 62), (204, 186, 150), (96, 86, 68)),
    ((158, 90, 56), (102, 52, 42), (210, 158, 108), (168, 46, 32)),
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
    rng = np.random.default_rng(100 + index)
    # Soft grass with a little variation, upscaled so it stays chunky but not pixel-stepped.
    noise = rng.random((H // 10, W // 10)).astype(np.float32)
    noise = np.asarray(Image.fromarray((noise * 255).astype(np.uint8), "L").resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    shade = 0.9 + noise * 0.16
    grass = np.zeros((H, W, 3), np.float32)
    for c in range(3):
        grass[..., c] = top[c] * shade
    img = Image.fromarray(np.clip(grass, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    road = sample(level["routes"])
    width = int(level["width"])
    face = tuple(max(0, int(c) - 28) for c in cliff)
    lip = tuple(min(255, int(c) + 48) for c in top)

    # Soft plateaus and a blurred dirt path. No stroked cliff, so the road has no diagonal bands.
    half = max(16, int(width * 0.34))
    plateaus = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plateaus)
    tops = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(tops)
    for n in range(8):
        cx = int(rng.integers(80, W - 80))
        cy = int(rng.integers(90, H - 140))
        rx = int(rng.integers(70, 150))
        ry = int(rng.integers(46, 100))
        pd.ellipse((cx - rx, cy - ry + 16, cx + rx, cy + ry + 22), fill=face + (210,))
        cap = tuple(min(255, c + 28) for c in top)
        td.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=cap + (235,))
        td.ellipse((cx - rx * 0.45, cy - ry * 0.55, cx + rx * 0.15, cy - ry * 0.05), fill=lip + (90,))
    plateaus = plateaus.filter(ImageFilter.GaussianBlur(10))
    tops = tops.filter(ImageFilter.GaussianBlur(3))
    img.alpha_composite(plateaus)
    img.alpha_composite(tops)
    if road:
        # Disks, not a thick polyline: a stroked line miters into diagonal stripes.
        stamps = []
        for i in range(len(road) - 1):
            x0, y0 = road[i]
            x1, y1 = road[i + 1]
            steps = max(1, int(math.hypot(x1 - x0, y1 - y0) / 10))
            for s in range(steps + 1):
                t = s / steps
                stamps.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
        edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ed = ImageDraw.Draw(edge)
        dirt_edge = tuple(max(0, int(c) - 18) for c in path_c)
        rim = half + 18
        for x, y in stamps:
            ed.ellipse((x - rim, y - rim * 0.72, x + rim, y + rim * 0.72), fill=dirt_edge + (150,))
        edge = edge.filter(ImageFilter.GaussianBlur(11))
        img.alpha_composite(edge)
        path = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        path_draw = ImageDraw.Draw(path)
        core = half * 0.86
        for x, y in stamps:
            path_draw.ellipse((x - core, y - core * 0.7, x + core, y + core * 0.7), fill=path_c + (230,))
        path = path.filter(ImageFilter.GaussianBlur(4))
        img.alpha_composite(path)
    shadows = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadows)
    props = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pr = ImageDraw.Draw(props)
    hi = tuple(min(255, int(c) + 55) for c in accent)
    dark = tuple(max(0, int(c) - 36) for c in accent)
    rock = (168, 140, 104) if index in (1, 3, 5, 7) else (132, 124, 112)
    for _ in range(46):
        x = int(rng.integers(40, W - 40))
        y = int(rng.integers(40, H - 40))
        if math.hypot(x - SUN[0], y - SUN[1]) < 150:
            continue
        if any(math.hypot(x - px, y - py) < level["width"] * 0.7 for px, py in road[::6]):
            continue
        kind = int(rng.integers(0, 5))
        if kind <= 1:
            rad = int(rng.integers(18, 32))
            sd.ellipse((x - rad, y + 2, x + rad + 8, y + rad * 0.55), fill=(20, 16, 10, 80))
            pr.rectangle((x - 4, y - 2, x + 4, y + 14), fill=(92, 58, 32, 255))
            pr.ellipse((x - rad * 0.7, y - rad * 0.2, x + rad * 0.75, y + rad * 0.55), fill=dark + (255,))
            pr.ellipse((x - rad * 0.85, y - rad * 1.15, x + rad * 0.7, y + rad * 0.15), fill=accent + (255,))
            pr.ellipse((x - rad * 0.35, y - rad * 0.95, x + rad * 0.15, y - rad * 0.35), fill=hi + (230,))
        elif kind == 2:
            sd.ellipse((x - 22, y + 4, x + 26, y + 16), fill=(20, 16, 10, 70))
            pr.ellipse((x - 20, y - 4, x + 22, y + 12), fill=dark + (255,))
            pr.ellipse((x - 16, y - 14, x + 18, y + 4), fill=accent + (255,))
            pr.ellipse((x - 8, y - 12, x + 4, y - 2), fill=hi + (200,))
        else:
            sd.ellipse((x - 20, y + 2, x + 22, y + 14), fill=(20, 16, 10, 75))
            pr.ellipse((x - 16, y - 2, x + 20, y + 12), fill=tuple(max(0, c - 40) for c in rock) + (255,))
            pr.ellipse((x - 18, y - 14, x + 14, y + 4), fill=rock + (255,))
            pr.ellipse((x - 10, y - 12, x + 1, y - 2), fill=tuple(min(255, c + 40) for c in rock) + (255,))
    shadows = shadows.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(shadows)
    img.alpha_composite(props)
    sx, sy = SUN
    keep = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    kd = ImageDraw.Draw(keep)
    kd.ellipse((sx - 96, sy - 18, sx + 108, sy + 64), fill=(30, 22, 14, 90))
    keep = keep.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(keep)
    plaza = ImageDraw.Draw(img)
    plaza.ellipse((sx - 86, sy - 8, sx + 90, sy + 46), fill=face + (255,))
    plaza.ellipse((sx - 84, sy - 28, sx + 84, sy + 24), fill=(196, 168, 122, 255))
    plaza.ellipse((sx - 36, sy - 22, sx + 8, sy - 2), fill=(232, 214, 170, 160))
    plaza.ellipse((sx - RIM, sy - RIM * 0.62, sx + RIM, sy + RIM * 0.4), fill=(214, 168, 78, 255))
    plaza.ellipse((sx - RIM + 8, sy - RIM * 0.48, sx + RIM - 10, sy + RIM * 0.08), fill=(255, 214, 120, 255))
    for i in range(18):
        ang = i / 18 * math.pi * 2
        fx = sx + math.cos(ang) * 150
        fy = sy + math.sin(ang) * 108
        if any(math.hypot(fx - px, fy - py) < level["width"] * 0.5 for px, py in road[::4]):
            continue
        plaza.rectangle((fx - 5, fy - 16, fx + 5, fy + 10), fill=(92, 58, 32, 255))
        plaza.rectangle((fx - 3, fy - 16, fx - 1, fy + 4), fill=(150, 104, 62, 255))
        plaza.rectangle((fx - 16, fy - 10, fx + 16, fy - 4), fill=(168, 112, 62, 255))
        nxt = (i + 1) / 18 * math.pi * 2
        nx = sx + math.cos(nxt) * 150
        ny = sy + math.sin(nxt) * 108
        if any(math.hypot(nx - px, ny - py) < level["width"] * 0.5 for px, py in road[::4]):
            continue
        plaza.line([(fx, fy - 7), (nx, ny - 7)], fill=(140, 90, 48, 255), width=4)
    arr = np.asarray(img).astype(np.float32)
    rgb_arr = arr[..., :3]
    yy, xx = np.mgrid[0:H, 0:W]
    light = 0.88 + 0.14 * (1 - yy / H) + 0.06 * (1 - xx / W)
    glow = np.exp(-(((xx - sx) ** 2) + ((yy - sy) ** 2)) / (2 * 260 ** 2))
    light = np.clip(light + glow * 0.18, 0.78, 1.22)
    rgb_arr *= light[..., None]
    out = np.zeros_like(arr)
    out[..., :3] = np.clip(rgb_arr, 0, 255)
    out[..., 3] = 255
    Image.fromarray(out.astype(np.uint8), "RGBA").convert("RGB").save(ART / f"map-l{index}.webp", "WEBP", quality=82, method=4)


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


def soften_shadow() -> None:
    path = ART / "shadow.webp"
    src = Image.open(path).convert("RGBA")
    src = src.filter(ImageFilter.GaussianBlur(5))
    src.save(path, "WEBP", quality=86, method=4)


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
