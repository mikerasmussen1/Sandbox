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
    ((214, 168, 104), (176, 92, 54), (236, 204, 150), (150, 78, 44)),
    ((122, 110, 82), (92, 78, 62), (196, 174, 136), (82, 74, 58)),
    ((142, 78, 48), (102, 52, 42), (198, 146, 96), (148, 40, 28)),
]
# Jungle valleys drop off grey stone. Desert valleys drop off sandstone.
DESERT = {1, 3, 5, 7}


def clamp(v: float, a: float, b: float) -> float:
    return max(a, min(b, v))


def chaikin(pts: list[tuple[float, float]], iters: int = 4) -> list[tuple[float, float]]:
    """Corner cutting. The curve stays near the controls and does not loop back on itself."""
    out = pts
    for _ in range(iters):
        nxt = [out[0]]
        for a, b in zip(out, out[1:]):
            nxt.append((a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25))
            nxt.append((a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75))
        nxt.append(out[-1])
        out = nxt
    return out


def resample(pts: list[tuple[float, float]], step: float = 18) -> list[tuple[float, float]]:
    if len(pts) < 2:
        return pts
    out = [pts[0]]
    acc = 0.0
    for i in range(len(pts) - 1):
        ax, ay = pts[i]
        bx, by = pts[i + 1]
        seg = math.hypot(bx - ax, by - ay) or 1
        walked = 0.0
        while walked + step - acc <= seg:
            walked += step - acc
            acc = 0.0
            t = walked / seg
            out.append((ax + (bx - ax) * t, ay + (by - ay) * t))
        acc += seg - walked
    end = pts[-1]
    if math.hypot(out[-1][0] - end[0], out[-1][1] - end[1]) > 1:
        out.append(end)
    else:
        out[-1] = end
    return out


def finish(pts: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Come into the crater from outside the rim, then stop on the sunstone."""
    last = pts[-1]
    dx, dy = SUN[0] - last[0], SUN[1] - last[1]
    dist = math.hypot(dx, dy) or 1
    door = (SUN[0] - dx / dist * 78, SUN[1] - dy / dist * 78)
    return pts + [door, (float(SUN[0]), float(SUN[1]))]


def smooth(controls: list[tuple[float, float]]) -> list[tuple[float, float]]:
    pinned = [(clamp(x, 96, W - 96), clamp(y, 28, H - 80)) for x, y in controls]
    return resample(chaikin(finish(pinned), 4), 16)


def poly_len(pts: list[tuple[float, float]]) -> float:
    return sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:]))


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


def turn_span(route: list[tuple[float, float]], i: int, span: int) -> float:
    ax, ay = route[i - span]
    bx, by = route[i]
    cx, cy = route[i + span]
    a = math.atan2(by - ay, bx - ax)
    b = math.atan2(cy - by, cx - bx)
    return (b - a + math.pi) % (2 * math.pi) - math.pi


def pip(poly: list[tuple[float, float]], x: float, y: float) -> bool:
    hit = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-6) + xi:
            hit = not hit
        j = i
    return hit


def road(head: list[tuple[float, float]], tail: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """One smooth road. The tail is the shared run home, so the forks meet."""
    controls = [(clamp(x, 112, W - 112), clamp(y, 32, 1688)) for x, y in head + tail]
    curved = chaikin(finish(controls), 3)
    curved[-1] = (float(SUN[0]), float(SUN[1]))
    return resample(curved, 16)


def inside_pads(
    routes: list[list[tuple[float, float]]],
    n: int,
    water: list[list[tuple[float, float]]],
    index: int,
    offset: float = 90,
) -> list[tuple[float, float]]:
    """A pad in the crook of a bend, off the dirt, so the tower covers that curve."""
    cands: list[tuple[float, float, float, float]] = []
    span = 6
    for route in routes:
        total = poly_len(route) or 1
        cum = [0.0]
        for a, b in zip(route, route[1:]):
            cum.append(cum[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
        i = span
        while i < len(route) - span:
            turn = turn_span(route, i, span)
            frac = cum[i] / total
            i_next = i + span
            if abs(turn) < 0.28 or frac < 0.16 or frac > 0.9:
                i += 3
                continue
            ang = math.atan2(route[i + 1][1] - route[i][1], route[i + 1][0] - route[i][0])
            side = 1 if turn > 0 else -1
            nx, ny = -math.sin(ang), math.cos(ang)
            cands.append((abs(turn) * (1.2 if 0.42 < frac < 0.82 else 0.9), frac, route[i][0] + nx * side * offset, route[i][1] + ny * side * offset))
            i = i_next
    cands.sort(key=lambda item: item[0], reverse=True)
    picked: list[tuple[float, float]] = []

    def blocked(x: float, y: float) -> bool:
        if any(pip(poly, x, y) for poly in water):
            return True
        if index == 4 and 1180 < y < 1420 and 340 < x < 700:
            return True
        return False

    def clear(x: float, y: float) -> bool:
        if math.hypot(x - SUN[0], y - SUN[1]) < 168:
            return False
        if blocked(x, y):
            return False
        if any(math.hypot(x - qx, y - qy) < 120 for qx, qy in picked):
            return False
        near = min((math.hypot(x - px, y - py) for route in routes for px, py in route[::2]), default=999)
        return 60 < near < max(148, offset + 36)

    def take(frac_lo: float, frac_hi: float, limit: int) -> None:
        got = 0
        for _score, frac, ox, oy in cands:
            if len(picked) >= n or got >= limit:
                return
            if not (frac_lo <= frac <= frac_hi):
                continue
            ox = clamp(ox, 84, W - 84)
            oy = clamp(oy, 96, H - 96)
            if clear(ox, oy):
                picked.append((ox, oy))
                got += 1

    take(0.16, 0.42, 2)
    take(0.42, 0.9, n)
    take(0.16, 0.9, n)
    fracs = (0.22, 0.34, 0.46, 0.58, 0.7, 0.82)
    for route in routes:
        for frac in fracs:
            if len(picked) >= n:
                return picked
            x, y, ang = point_at(route, frac)
            best: tuple[float, float] | None = None
            best_near = -1.0
            for side in (-1, 1):
                nx, ny = -math.sin(ang), math.cos(ang)
                ox = clamp(x + nx * side * offset, 84, W - 84)
                oy = clamp(y + ny * side * offset, 96, H - 96)
                if not clear(ox, oy):
                    continue
                near = min((math.hypot(ox - px, oy - py) for rt in routes for px, py in rt[::2]), default=0)
                if near > best_near:
                    best_near = near
                    best = (ox, oy)
            if best:
                picked.append(best)
    return picked


def layouts() -> list[dict]:
    """Eight valleys. The roads bend, the forks meet, and each map has its own landmark.

    Tracks stay a few tower-ranges apart so one pad covers the bend in front of it,
    not the whole lane. The shared tail is where the roads come home together.
    """
    # (biome, heads, tail, width, pad count, water polygons)
    # The river sits between the lanes. Each road fords it once, up high, then comes home down the middle.
    river = [
        (400, 80), (560, 60), (600, 240), (520, 420), (560, 600), (470, 760),
        (350, 760), (390, 560), (340, 380), (420, 200), (360, 80),
    ]
    pool = [(340, 1460), (620, 1440), (640, 1620), (320, 1630)]
    chasm = [(360, 1240), (680, 1210), (710, 1290), (640, 1380), (390, 1400), (330, 1310)]
    plaza = [(340, 1400), (630, 1380), (650, 1560), (320, 1570)]
    home = [(470, 1560), (390, 1400), (560, 1240), (430, 1140)]
    designs: list[tuple] = [
        # Green Cut. Each lane fords the river, then the roads meet and wind home.
        ("valley", [
            [(150, 36), (280, 200), (150, 380), (560, 520), (200, 700), (300, 920), (170, 1140), (280, 1360), (400, 1500)],
            [(820, 36), (760, 180), (840, 340), (400, 520), (780, 720), (800, 960), (760, 1180), (680, 1400), (540, 1520)],
        ], home, 132, 8, [river]),
        # Runner Ridge. Switchbacks that stay on their own side of the spine.
        ("valley", [
            [(150, 40), (380, 200), (140, 400), (370, 600), (150, 820), (360, 1040), (150, 1260), (320, 1460)],
            [(820, 40), (590, 220), (830, 420), (600, 640), (820, 860), (610, 1080), (830, 1300), (700, 1480)],
        ], home, 128, 8, []),
        # Twin Canyon. Two canyons meet in a pool under the fall.
        ("ruins", [
            [(150, 36), (340, 180), (140, 360), (330, 560), (150, 760), (320, 980), (160, 1200), (340, 1420)],
            [(820, 36), (640, 200), (840, 400), (650, 600), (830, 800), (660, 1020), (820, 1240), (620, 1440)],
        ], [(480, 1560), (400, 1420), (560, 1260), (440, 1140)], 124, 10, [pool]),
        # Brute Steps. Each stair is a ruined tread the road actually climbs.
        ("ruins", [
            [(150, 40), (360, 220), (140, 420), (350, 640), (150, 860), (340, 1100), (160, 1320), (380, 1500)],
            [(820, 50), (620, 240), (830, 440), (630, 660), (820, 880), (640, 1120), (810, 1340), (600, 1520)],
        ], [(500, 1580), (460, 1360), (510, 1180)], 136, 10, []),
        # High Wind. The way home is a rope bridge over the gorge.
        ("valley", [
            [(145, 36), (300, 200), (140, 400), (280, 600), (145, 820), (270, 1040), (150, 1260), (280, 1460)],
            [(825, 36), (680, 220), (840, 420), (700, 640), (830, 860), (720, 1080), (830, 1300), (700, 1480)],
        ], [(500, 1560), (470, 1400), (520, 1240), (450, 1140)], 130, 10, [chasm]),
        # Boulder Bend. Each canyon road passes under its own arches.
        ("crater", [
            [(150, 40), (340, 200), (140, 400), (330, 600), (150, 820), (320, 1040), (150, 1260), (340, 1460)],
            [(820, 40), (640, 220), (840, 420), (650, 640), (830, 860), (660, 1080), (820, 1300), (620, 1480)],
        ], home, 146, 8, []),
        # Three Gates. Three roads drop into a sunken court, then one leaves.
        ("ruins", [
            [(140, 36), (280, 200), (140, 400), (260, 620), (150, 840), (250, 1060), (170, 1280), (400, 1480)],
            [(520, 36), (340, 240), (560, 480), (300, 760), (280, 1040), (400, 1280), (470, 1460)],
            [(830, 36), (700, 220), (840, 440), (720, 660), (830, 880), (740, 1100), (820, 1320), (600, 1500)],
        ], [(490, 1540), (420, 1400), (540, 1240), (450, 1140)], 118, 12, [plaza]),
        # Colossus Stair. Wide treads, and the roads switch back across them.
        ("crater", [
            [(145, 48), (350, 220), (140, 420), (340, 640), (150, 860), (330, 1100), (150, 1320), (320, 1500)],
            [(825, 60), (630, 240), (835, 440), (640, 660), (825, 880), (650, 1120), (820, 1340), (680, 1520)],
        ], home, 140, 10, []),
    ]
    out = []
    for index, (biome, heads, tail, width, count, water) in enumerate(designs):
        routes = [road(head, tail) for head in heads]
        spots = inside_pads(routes, count, water, index)
        # The two pads tightest on the lower stair were enough for arrows to hold.
        if index == 3:
            samples = [p for route in routes for p in route[::3]]
            ranked = sorted(
                spots,
                key=lambda p: min(math.hypot(p[0] - a, p[1] - b) for a, b in samples),
            )
            drop = {id(p) for p in ranked[:2] if p[1] > 700}
            spots = [p for p in spots if id(p) not in drop]
        out.append({
            "biome": biome,
            "width": width,
            "routes": routes,
            "pads": spots,
            "water": water,
        })
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
        "  water: Vec[][];",
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
        if level["water"]:
            waters = ",\n      ".join(f"[{vecs(w)}]" for w in level["water"])
            lines.append(f"    water: [\n      {waters},\n    ],")
        else:
            lines.append("    water: [],")
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
    """Face, shadowed face, and the deep drop. Grey stone in the green valleys, red rock in the desert."""
    if index in DESERT:
        return (214, 118, 74), (168, 74, 46), (112, 46, 32)
    return (138, 142, 146), (86, 90, 96), (52, 56, 62)


def texture_ground(img: Image.Image, mask: np.ndarray, rng: np.random.Generator, desert: bool) -> None:
    """Tufts, blotches, and flowers on the plateau. The path is painted afterwards and covers the road."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return
    count = 520 if desert else 1600
    pick = rng.choice(len(xs), size=min(count, len(xs)), replace=False)
    flowers = ((236, 208, 86, 230), (244, 246, 236, 220), (232, 126, 156, 220), (186, 210, 96, 220))
    for n, i in enumerate(pick):
        x = int(xs[i])
        y = int(ys[i])
        if desert:
            if n % 7 == 0:
                draw.ellipse((x - 3, y - 2, x + 4, y + 2), fill=(132, 72, 46, 170))
            elif n % 3 == 0:
                draw.ellipse((x - 8, y - 5, x + 9, y + 5), fill=(150, 96, 58, 70))
            else:
                draw.line((x, y, x + int(rng.integers(-2, 3)), y - int(rng.integers(2, 5))), fill=(120, 86, 48, 150), width=1)
            continue
        kind = int(rng.integers(0, 14))
        if kind < 8:
            lean = int(rng.integers(-3, 4))
            tall = int(rng.integers(4, 8))
            draw.line((x, y, x + lean, y - tall), fill=(22, 86, 34, 190), width=1)
            draw.line((x + 1, y, x + lean + 2, y - tall + 2), fill=(78, 156, 62, 170), width=1)
        elif kind < 11:
            draw.ellipse((x - 14, y - 8, x + 14, y + 8), fill=(16, 64, 24, 80))
        else:
            petal = flowers[kind % len(flowers)]
            draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=petal)
            draw.ellipse((x - 1, y - 1, x + 1, y + 1), fill=(255, 236, 170, 230))
    img.alpha_composite(overlay)


def quad(draw: ImageDraw.ImageDraw, cx: float, cy: float, dx: float, dy: float, hw: float, ht: float, color: tuple) -> None:
    nx, ny = -dy, dx
    draw.polygon([
        (cx - dx * ht - nx * hw, cy - dy * ht - ny * hw),
        (cx + dx * ht - nx * hw, cy + dy * ht - ny * hw),
        (cx + dx * ht + nx * hw, cy + dy * ht + ny * hw),
        (cx - dx * ht + nx * hw, cy - dy * ht + ny * hw),
    ], fill=color)


def crossings(route: list[tuple[float, float]], poly: list[tuple[float, float]]) -> list[tuple[float, float, float, float]]:
    """Spans of the road that run through a polygon: center, angle, length."""
    groups: list[list[int]] = []
    cur: list[int] = []
    for i, (x, y) in enumerate(route):
        if pip(poly, x, y):
            cur.append(i)
        elif cur:
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    found = []
    for group in groups:
        a = route[group[0]]
        b = route[group[-1]]
        span = math.hypot(b[0] - a[0], b[1] - a[1])
        if span < 28:
            continue
        mid = route[group[len(group) // 2]]
        ang = math.atan2(b[1] - a[1], b[0] - a[0])
        found.append((mid[0], mid[1], ang, span + 28))
    return found


def paint_water(draw: ImageDraw.ImageDraw, poly: list[tuple[float, float]], deep: tuple, lite: tuple) -> None:
    draw.polygon(poly, fill=deep + (210,))
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    cx = sum(xs) / len(xs)
    cy = sum(ys) / len(ys)
    inner = [(cx + (x - cx) * 0.72, cy + (y - cy) * 0.72) for x, y in poly]
    draw.polygon(inner, fill=lite + (180,))
    # A bright thread so the surface reads as water even before the shimmer.
    for i in range(4):
        t = 0.2 + i * 0.18
        draw.line(
            [(cx + (xs[0] - cx) * t, ys[0] * 0.15 + cy * 0.85), (cx + (xs[len(xs) // 2] - cx) * t, ys[len(ys) // 2] * 0.2 + cy * 0.8)],
            fill=(232, 248, 255, 90),
            width=2,
        )


def wooden_bridge(draw: ImageDraw.ImageDraw, x: float, y: float, ang: float, length: float, width: float) -> None:
    dx, dy = math.cos(ang), math.sin(ang)
    nx, ny = -dy, dx
    length = clamp(length, 78, 168)
    quad(draw, x, y, dx, dy, width * 0.5, length * 0.5, (164, 112, 64, 255))
    n = max(5, int(length / 14))
    for i in range(1, n):
        t = i / n - 0.5
        x0 = x + dx * t * length - nx * width * 0.46
        y0 = y + dy * t * length - ny * width * 0.46
        x1 = x + dx * t * length + nx * width * 0.46
        y1 = y + dy * t * length + ny * width * 0.46
        draw.line((x0, y0, x1, y1), fill=(110, 72, 40, 180), width=2)
    for side in (-1, 1):
        x0 = x - dx * length * 0.5 + nx * side * width * 0.48
        y0 = y - dy * length * 0.5 + ny * side * width * 0.48
        x1 = x + dx * length * 0.5 + nx * side * width * 0.48
        y1 = y + dy * length * 0.5 + ny * side * width * 0.48
        draw.line((x0, y0, x1, y1), fill=(74, 46, 28, 255), width=5)
        draw.ellipse((x0 - 6, y0 - 6, x0 + 6, y0 + 6), fill=(92, 58, 34, 255))
        draw.ellipse((x1 - 6, y1 - 6, x1 + 6, y1 + 6), fill=(92, 58, 34, 255))


def rope_bridge(draw: ImageDraw.ImageDraw, x: float, y: float, ang: float, length: float, width: float) -> None:
    """A sagging plank deck with a rope on each side. The deck is solid, not a ladder."""
    dx, dy = math.cos(ang), math.sin(ang)
    nx, ny = -dy, dx
    length = clamp(length, 110, 220)
    left: list[tuple[float, float]] = []
    right: list[tuple[float, float]] = []
    for i in range(22):
        t = i / 21
        sag = math.sin(t * math.pi) * 16
        px = x + dx * (t - 0.5) * length
        py = y + dy * (t - 0.5) * length + sag
        left.append((px + nx * width * 0.36, py + ny * width * 0.36))
        right.append((px - nx * width * 0.36, py - ny * width * 0.36))
    draw.polygon(left + right[::-1], fill=(158, 112, 68, 255))
    for i in range(1, 14):
        t = i / 14
        sag = math.sin(t * math.pi) * 16
        px = x + dx * (t - 0.5) * length
        py = y + dy * (t - 0.5) * length + sag
        draw.line(
            (px - nx * width * 0.34, py - ny * width * 0.34, px + nx * width * 0.34, py + ny * width * 0.34),
            fill=(110, 72, 42, 210),
            width=2,
        )
    for side in (-1, 1):
        pts = []
        for i in range(18):
            t = i / 17
            sag = math.sin(t * math.pi) * 8
            px = x + dx * (t - 0.5) * length + nx * side * width * 0.48
            py = y + dy * (t - 0.5) * length + ny * side * width * 0.48 + sag
            pts.append((px, py))
        draw.line(pts, fill=(236, 220, 186, 255), width=4)
        draw.line(pts, fill=(92, 62, 38, 230), width=2)
        draw.ellipse((pts[0][0] - 6, pts[0][1] - 6, pts[0][0] + 6, pts[0][1] + 6), fill=(74, 48, 30, 255))
        draw.ellipse((pts[-1][0] - 6, pts[-1][1] - 6, pts[-1][0] + 6, pts[-1][1] + 6), fill=(74, 48, 30, 255))


def stone_arch(draw: ImageDraw.ImageDraw, x: float, y: float, ang: float, gap: float) -> None:
    """A sandstone gate: thick piers on the road edges and a lintel across the dirt."""
    dx, dy = math.cos(ang), math.sin(ang)
    nx, ny = -dy, dx
    half = max(46, gap * 0.7)
    stone = (176, 124, 78, 255)
    lite = (236, 204, 156, 255)
    dark = (96, 62, 40, 255)
    for side in (-1, 1):
        bx = x + nx * side * half
        by = y + ny * side * half
        quad(draw, bx, by, dx, dy, 16, 34, stone)
        quad(draw, bx, by, dx, dy, 9, 26, lite)
        quad(draw, bx + dx * 32, by + dy * 32, nx, ny, 18, 7, lite)
        quad(draw, bx - dx * 32, by - dy * 32, nx, ny, 18, 7, dark)
    outer: list[tuple[float, float]] = []
    inner: list[tuple[float, float]] = []
    rise, thick = 26, 18
    for i in range(21):
        t = i / 20
        across = (t - 0.5) * half * 2
        bow = math.sin(t * math.pi) * rise
        cx = x + nx * across + dx * bow
        cy = y + ny * across + dy * bow
        outer.append((cx + dx * thick * 0.55, cy + dy * thick * 0.55))
        inner.append((cx - dx * thick * 0.45, cy - dy * thick * 0.45))
    draw.polygon(outer + inner[::-1], fill=stone)
    draw.line(outer, fill=lite, width=5)
    draw.line(inner, fill=dark, width=3)
    crown = outer[len(outer) // 2]
    draw.ellipse((crown[0] - 8, crown[1] - 8, crown[0] + 8, crown[1] + 8), fill=lite)


def paint_fall(draw: ImageDraw.ImageDraw, x: float, y: float) -> None:
    """A lit cliff with a bright fall. The lip is y; the water lands well below it."""
    draw.polygon([(x - 78, y - 150), (x + 86, y - 162), (x + 70, y + 18), (x - 64, y + 24)], fill=(72, 66, 60, 255))
    draw.polygon([(x - 78, y - 150), (x + 86, y - 162), (x + 78, y - 128), (x - 70, y - 118)], fill=(198, 190, 172, 255))
    draw.polygon([(x - 70, y - 128), (x + 78, y - 136), (x + 64, y - 108), (x - 58, y - 102)], fill=(228, 220, 204, 255))
    for i, shift in enumerate((-36, -18, 0, 18, 34)):
        tone = (248, 252, 255, 240) if i % 2 == 0 else (176, 214, 230, 230)
        draw.line((x + shift, y - 110, x + shift * 0.35, y + 168), fill=tone, width=8 if i % 2 == 0 else 5)
    draw.ellipse((x - 64, y + 140, x + 70, y + 186), fill=(220, 240, 248, 180))


def paint_steps(draw: ImageDraw.ImageDraw, bands: list[int], color: tuple, lite: tuple, routes: list[list[tuple[float, float]]], tall: int, flights: int) -> None:
    """A short flight across the dirt where a road climbs, plus a broken column beside it."""
    step = max(14, tall // 2)
    for y in bands:
        seen: list[float] = []
        for route in routes:
            for i in range(len(route) - 1):
                y0, y1 = route[i][1], route[i + 1][1]
                if (y0 - y) * (y1 - y) > 0:
                    continue
                span = y1 - y0
                t = 0 if abs(span) < 1 else (y - y0) / span
                cx = route[i][0] + (route[i + 1][0] - route[i][0]) * t
                if any(abs(cx - other) < 110 for other in seen):
                    continue
                seen.append(cx)
                half = 74
                for k in range(flights):
                    yy = y + k * (step + 5)
                    draw.rounded_rectangle((cx - half, yy, cx + half, yy + step), radius=4, fill=color + (245,))
                    draw.rectangle((cx - half, yy, cx + half, yy + 5), fill=lite + (255,))
                    draw.rectangle((cx - half, yy + step - 4, cx + half, yy + step), fill=(48, 28, 18, 170))
                post_y = y - 8
                post = cx + (half + 18 if cx < SUN[0] else -(half + 18))
                draw.rectangle((post - 9, post_y - tall, post + 9, post_y + 8), fill=(154, 116, 74, 255))
                draw.rectangle((post - 13, post_y - tall - 12, post + 13, post_y - tall), fill=(214, 176, 128, 255))
                break


def paint_early(img: Image.Image, index: int, level: dict) -> None:
    """Water, terraces, and the sunken court, under the road so the dirt stays readable."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    routes = level["routes"]
    if index == 0:
        for poly in level["water"]:
            paint_water(draw, poly, (36, 108, 128), (92, 168, 176))
        # Reeds along the bank.
        for poly in level["water"]:
            for x, y in poly[::2]:
                draw.line((x, y, x + 4, y - 14), fill=(48, 110, 62, 180), width=2)
    elif index == 1:
        # Sandstone hogback the switchbacks climb.
        draw.polygon([(430, 160), (560, 180), (600, 1520), (390, 1560)], fill=(214, 156, 96, 90))
        draw.line((448, 180, 430, 1540), fill=(236, 196, 140, 180), width=8)
        draw.ellipse((500, 700, 560, 748), fill=(186, 112, 64, 230))
        draw.ellipse((488, 676, 548, 724), fill=(214, 146, 88, 240))
        draw.ellipse((496, 654, 540, 700), fill=(232, 176, 116, 250))
    elif index == 2:
        for poly in level["water"]:
            paint_water(draw, poly, (28, 96, 112), (86, 160, 168))
    elif index == 6:
        for poly in level["water"]:
            xs = [p[0] for p in poly]
            ys = [p[1] for p in poly]
            draw.ellipse((min(xs) - 36, min(ys) - 28, max(xs) + 36, max(ys) + 24), fill=(92, 78, 58, 200))
            paint_water(draw, poly, (42, 92, 108), (96, 150, 156))
    # A few raised knolls, off the road, so the ground is not one flat table.
    rng = np.random.default_rng(40 + index)
    road = [p for route in routes for p in route[::6]]
    for _n in range(5):
        for _try in range(12):
            cx = int(rng.integers(140, W - 140))
            cy = int(rng.integers(160, 1600))
            if any(math.hypot(cx - px, cy - py) < 88 for px, py in road):
                continue
            rw = int(rng.integers(36, 70))
            rh = int(rng.integers(22, 40))
            draw.ellipse((cx - rw, cy - rh + 10, cx + rw, cy + rh + 10), fill=(20, 16, 12, 70))
            draw.ellipse((cx - rw, cy - rh, cx + rw, cy + rh), fill=(255, 244, 220, 28))
            break
    img.alpha_composite(overlay)


def unique_spans(spans: list[tuple[float, float, float, float]], gap: float = 36) -> list[tuple[float, float, float, float]]:
    """Collapse fords that would stack two decks on the same bend."""
    kept: list[tuple[float, float, float, float]] = []
    for span in spans:
        hit = next((i for i, other in enumerate(kept) if math.hypot(span[0] - other[0], span[1] - other[1]) < gap), None)
        if hit is None:
            kept.append(span)
            continue
        ox, oy, oang, olen = kept[hit]
        longer = span if span[3] >= olen else kept[hit]
        kept[hit] = ((span[0] + ox) * 0.5, (span[1] + oy) * 0.5, longer[2], max(span[3], olen))
    return kept


def stamp_road(draw: ImageDraw.ImageDraw, routes: list[list[tuple[float, float]]], half: int, color: tuple, around: tuple[float, float], reach: float) -> None:
    """Put the dirt back over a landmark so the road stays the brightest shape."""
    core = half * 0.86
    ax, ay = around
    for route in routes:
        for x, y in route:
            if math.hypot(x - ax, y - ay) > reach:
                continue
            draw.ellipse((x - core, y - core * 0.7, x + core, y + core * 0.7), fill=color + (255,))


def paint_late(img: Image.Image, index: int, level: dict, half: int) -> None:
    """Bridges, arches, and the fall, on top of the road and the cliff."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    routes = level["routes"]
    deck = max(46, half * 1.15)
    if index == 0:
        spans: list[tuple[float, float, float, float]] = []
        for poly in level["water"]:
            for route in routes:
                spans.extend(crossings(route, poly))
        for x, y, ang, span in unique_spans(spans, 110):
            if span < 80:
                continue
            wooden_bridge(draw, x, y, ang, span, deck)
    elif index == 2:
        # The fall drops into the pool, below the sun. The road is stamped back on top.
        paint_fall(draw, 520, 1410)
        stamp_road(draw, routes, half, (168, 188, 146), (520, 1410), 320)
    elif index == 3:
        paint_steps(draw, [280, 560, 860, 1160, 1420], (150, 112, 74), (214, 176, 124), routes, 28, 3)
    elif index == 4:
        rope_spans: list[tuple[float, float, float, float]] = []
        for poly in level["water"]:
            paint_water(draw, poly, (18, 36, 48), (48, 86, 102))
            for route in routes:
                rope_spans.extend(crossings(route, poly))
        for x, y, ang, span in unique_spans(rope_spans):
            rope_bridge(draw, x, y, ang, max(span, 120), deck)
    elif index == 5:
        for route in routes:
            for frac in (0.32, 0.55):
                x, y, ang = point_at(route, frac)
                stone_arch(draw, x, y, ang, deck + 18)
    elif index == 6:
        for poly in level["water"]:
            xs = [p[0] for p in poly]
            ys = [p[1] for p in poly]
            draw.ellipse((min(xs) - 30, min(ys) - 22, max(xs) + 30, max(ys) + 18), outline=(214, 190, 140, 230), width=8)
            draw.arc((min(xs) - 18, min(ys) - 10, max(xs) + 18, max(ys) + 8), 20, 200, fill=(236, 214, 170, 200), width=3)
    elif index == 7:
        paint_steps(draw, [300, 600, 920, 1220, 1480], (132, 78, 52), (214, 150, 96), routes, 40, 4)
        # A fallen drum on the grass beside the lower flight, off the dirt.
        dx0, dy0 = 330, 1216
        draw.ellipse((dx0, dy0 + 8, dx0 + 108, dy0 + 40), fill=(90, 48, 32, 255))
        draw.ellipse((dx0 + 4, dy0, dx0 + 104, dy0 + 30), fill=(186, 122, 74, 255))
        draw.ellipse((dx0 + 8, dy0 + 4, dx0 + 34, dy0 + 28), fill=(228, 176, 120, 255))
        draw.arc((dx0 + 36, dy0 + 2, dx0 + 78, dy0 + 30), 200, 40, fill=(120, 72, 44, 255), width=3)
    # Pebbles along the outside of the curves. They stay off the dirt.
    rng = np.random.default_rng(70 + index)
    for route in routes:
        for i in range(10, len(route) - 10, 11):
            if rng.random() > 0.55:
                continue
            ang = math.atan2(route[i + 1][1] - route[i][1], route[i + 1][0] - route[i][0])
            side = 1 if (i // 11) % 2 == 0 else -1
            nx, ny = -math.sin(ang), math.cos(ang)
            ox = route[i][0] + nx * side * (half + 20)
            oy = route[i][1] + ny * side * (half + 14)
            if any(pip(poly, ox, oy) for poly in level["water"]):
                continue
            r = int(rng.integers(4, 8))
            draw.ellipse((ox - r, oy - r * 0.6, ox + r, oy + r * 0.6), fill=(72, 58, 44, 210))
            draw.ellipse((ox - r * 0.4, oy - r * 0.45, ox + r * 0.2, oy), fill=(140, 120, 96, 180))
    img.alpha_composite(overlay)


def paint(level: dict, theme: tuple, index: int) -> None:
    top, _cliff, path_c, accent = theme
    rng = np.random.default_rng(100 + index)
    road = sample(level["routes"])
    width = int(level["width"])
    stone, stone_dark, stone_deep = stone_for(index)
    drop = 64

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
    if index == 4:
        # The gorge is a hole in the plateau. The rope bridge is painted back over it.
        md.polygon(level["water"][0], fill=0)
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
        if index in DESERT:
            # Layered red-rock: light caps, darker bases, and a ledge on each band.
            yy = np.arange(H, dtype=np.float32)[:, None]
            yb = yy + (noise - 0.5) * 14
            period = 18.0
            phase = np.mod(yb, period) / period
            cap = np.clip((0.42 - phase) / 0.42, 0, 1)
            ledge = np.clip((phase - 0.78) / 0.22, 0, 1)
            light_rgb = np.array([236, 176, 118], np.float32)
            mid_rgb = np.array([186, 86, 52], np.float32)
            dark_rgb = np.array([92, 38, 26], np.float32)
            for c in range(3):
                band = light_rgb[c] * cap + mid_rgb[c] * (1 - cap)
                band = band * (1 - 0.62 * t) + dark_rgb[c] * (0.62 * t)
                band = band * (1 - 0.55 * ledge) + (dark_rgb[c] * 0.7) * ledge
                rgb[..., c] = np.where(face, band, rgb[..., c])
        else:
            t = t * t
            cap = np.clip(1 - dist.astype(np.float32) / 10, 0, 1)
            light_top = (198, 202, 194)
            for c in range(3):
                lit = stone[c] * 1.08
                shade = stone_dark[c] * 0.62 + stone_deep[c] * 0.38
                body = lit * (1 - t) + shade * t
                rgb[..., c] = np.where(face, body * (1 - cap) + light_top[c] * cap, rgb[..., c])
    grass_lit = tuple(min(255, int(c) + 18) for c in top)
    top_rim = mask & ~above
    # A soft lit lip, blurred so the plateau edge does not cut a hard diagonal stripe.
    rim = np.zeros_like(mask)
    for k in range(1, 8):
        band = np.zeros_like(mask)
        band[k:] = top_rim[:-k]
        rim |= band & mask
    rim_img = Image.fromarray(np.where(rim, np.uint8(255), np.uint8(0)), "L").filter(ImageFilter.GaussianBlur(8))
    lip = np.asarray(rim_img).astype(np.float32) / 255
    blot = rng.random((H // 28 + 1, W // 28 + 1)).astype(np.float32)
    blot = np.asarray(Image.fromarray((blot * 255).astype(np.uint8), "L").resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    for c in range(3):
        field = top[c] * (0.84 + noise * 0.22)
        shade = 0.82 + blot * 0.28
        field = field * shade
        rgb[..., c] = np.where(mask, field, rgb[..., c])
        rgb[..., c] = np.where(mask, rgb[..., c] * (1 - 0.16 * lip) + grass_lit[c] * 0.16 * lip, rgb[..., c])
    # A dark contact where the grass meets the drop.
    foot = np.zeros_like(mask)
    for k in range(1, 6):
        below = np.zeros_like(mask)
        below[:-k] = face[k:]
        foot |= mask & below
    for c in range(3):
        rgb[..., c] = np.where(foot, rgb[..., c] * 0.7, rgb[..., c])
    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    texture_ground(img, mask, rng, index in DESERT)
    paint_early(img, index, level)
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
        fringe = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        fd = ImageDraw.Draw(fringe)
        grass_fringe = (accent[0], min(255, accent[1] + 24), accent[2], 80)
        reach = half + 36
        for x, y in stamps[::2]:
            fd.ellipse((x - reach, y - reach * 0.7, x + reach, y + reach * 0.7), fill=grass_fringe)
        fringe = fringe.filter(ImageFilter.GaussianBlur(16))
        img.alpha_composite(fringe)
        edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ed = ImageDraw.Draw(edge)
        dirt_edge = tuple(max(0, int(c) - 18) for c in path_c)
        rim = half + 18
        for x, y in stamps:
            ed.ellipse((x - rim, y - rim * 0.72, x + rim, y + rim * 0.72), fill=dirt_edge + (150,))
        edge = edge.filter(ImageFilter.GaussianBlur(14))
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
    paint_late(img, index, level, half)
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
        lens = [round(poly_len(r)) for r in level["routes"]]
        print("valley", i, "len", lens, "pads", len(level["pads"]), "routes", len(level["routes"]))
        paint(level, THEMES[i], i)
    touch_icon()
    print("done")


if __name__ == "__main__":
    main()
