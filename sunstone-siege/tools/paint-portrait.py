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
    # top, cliff, path, accent. Deeper greens. Jungle, sandstone, river, canyon, pine, dunes, ruins, ember.
    ((42, 118, 46), (48, 86, 42), (198, 158, 96), (22, 92, 32)),
    ((196, 150, 92), (168, 112, 64), (228, 198, 146), (96, 118, 48)),
    ((36, 112, 74), (42, 86, 64), (168, 188, 146), (24, 88, 108)),
    ((168, 102, 54), (128, 68, 40), (210, 164, 108), (132, 48, 28)),
    ((34, 102, 56), (36, 74, 48), (176, 150, 96), (16, 72, 38)),
    ((188, 142, 78), (150, 96, 52), (224, 190, 136), (64, 108, 40)),
    ((122, 110, 82), (92, 78, 62), (196, 174, 136), (82, 74, 58)),
    ((142, 78, 48), (102, 52, 42), (198, 146, 96), (148, 40, 28)),
]
# Jungle valleys drop off grey stone. Desert valleys drop off sandstone.
DESERT = {1, 3, 5, 7}


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


def stone_for(index: int) -> tuple[tuple[int, int, int], tuple[int, int, int], tuple[int, int, int]]:
    """Face, shadowed face, and the deep drop. Grey stone in the green valleys, sandstone in the desert."""
    if index in DESERT:
        return (196, 150, 102), (132, 88, 52), (78, 50, 30)
    return (138, 142, 146), (86, 90, 96), (52, 56, 62)


def paint(level: dict, theme: tuple, index: int) -> None:
    top, _cliff, path_c, accent = theme
    rng = np.random.default_rng(100 + index)
    road = sample(level["routes"])
    width = int(level["width"])
    stone, stone_dark, stone_deep = stone_for(index)
    drop = 46

    # The play surface is a raised plateau. Everything else is the cliff drop.
    mask_img = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask_img)
    # Narrow enough that a portrait view (about 280 world px wide) shows the drop.
    span = 116
    for x, y in road[::2]:
        md.ellipse((x - span, y - span * 0.78, x + span, y + span * 0.78), fill=255)
    sx0, sy0 = SUN
    md.ellipse((sx0 - 230, sy0 - 180, sx0 + 230, sy0 + 160), fill=255)
    for _n in range(7):
        cx = int(rng.integers(90, W - 90))
        cy = int(rng.integers(80, H - 120))
        if math.hypot(cx - sx0, cy - sy0) < 220:
            continue
        if any(math.hypot(cx - px, cy - py) < span * 0.7 for px, py in road[::8]):
            continue
        rx = int(rng.integers(70, 130))
        ry = int(rng.integers(48, 90))
        md.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(1.4))
    mask = np.asarray(mask_img) > 96

    above = np.zeros_like(mask)
    above[1:] = mask[:-1]
    # Extrude the plateau downward, widening a little each step so the sides drop too.
    cover = mask.copy()
    face = np.zeros_like(mask)
    dist = np.zeros((H, W), np.int16)
    for k in range(1, drop + 1):
        nxt = np.zeros_like(mask)
        nxt[1:] = cover[:-1]
        if k % 2 == 0:
            nxt[:, 1:] |= nxt[:, :-1]
            nxt[:, :-1] |= nxt[:, 1:]
        fresh = nxt & ~mask & (dist == 0)
        dist[fresh] = k
        face |= fresh
        cover = nxt | mask

    noise = rng.random((H // 8, W // 8)).astype(np.float32)
    noise = np.asarray(Image.fromarray((noise * 255).astype(np.uint8), "L").resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    rgb = np.zeros((H, W, 3), np.float32)
    for c in range(3):
        rgb[..., c] = stone_deep[c]
    if np.any(face):
        t = np.clip(dist.astype(np.float32) / drop, 0, 1)
        t = t * t
        for c in range(3):
            lit = stone[c] * 1.08
            shade = stone_dark[c] * 0.72 + stone_deep[c] * 0.28
            rgb[..., c] = np.where(face, lit * (1 - t) + shade * t, rgb[..., c])
    grass_lit = tuple(min(255, int(c) + 38) for c in top)
    top_rim = mask & ~above
    lit_band = top_rim.copy()
    for k in range(1, 6):
        band = np.zeros_like(mask)
        band[k:] = top_rim[:-k]
        lit_band |= band & mask
    for c in range(3):
        field = top[c] * (0.9 + noise * 0.14)
        rgb[..., c] = np.where(mask, field, rgb[..., c])
        rgb[..., c] = np.where(lit_band, field * 0.55 + grass_lit[c] * 0.45, rgb[..., c])
    # A dark contact where the grass meets the drop.
    foot = np.zeros_like(mask)
    for k in range(1, 6):
        below = np.zeros_like(mask)
        below[:-k] = face[k:]
        foot |= mask & below
    for c in range(3):
        rgb[..., c] = np.where(foot, rgb[..., c] * 0.7, rgb[..., c])
    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    half = max(16, int(width * 0.34))
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
        # The soft edge stays on the grass. The cliff face keeps its stone.
        painted = np.array(img)
        painted[~mask, :3] = np.clip(rgb[~mask], 0, 255).astype(np.uint8)
        img = Image.fromarray(painted, "RGBA")
    sx, sy = SUN
    keep = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    kd = ImageDraw.Draw(keep)
    kd.ellipse((sx - 130, sy - 30, sx + 150, sy + 78), fill=(30, 22, 14, 100))
    kd.ellipse((sx - 70, sy - 150, sx + 80, sy - 20), fill=(30, 22, 14, 80))
    keep = keep.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(keep)
    plaza = ImageDraw.Draw(img)
    # Stone courtyard. The keep and the trees are sprites, not painted blobs.
    plaza.ellipse((sx - 120, sy - 6, sx + 128, sy + 62), fill=(118, 96, 68, 255))
    plaza.ellipse((sx - 114, sy - 36, sx + 114, sy + 32), fill=(196, 168, 122, 255))
    plaza.ellipse((sx - 48, sy - 30, sx + 10, sy - 4), fill=(232, 214, 170, 170))
    plaza.ellipse((sx - RIM, sy - RIM * 0.62, sx + RIM, sy + RIM * 0.4), fill=(214, 168, 78, 255))
    plaza.ellipse((sx - RIM + 8, sy - RIM * 0.48, sx + RIM - 10, sy + RIM * 0.08), fill=(255, 214, 120, 255))
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
