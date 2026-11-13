"""Original 3/4 sprites from simple meshes.

One camera and one light for every sheet. Eight facings are the model turning
under that camera. Meshy is not called. No vendor meshes.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public" / "art"
MANIFEST = ART / "sprites" / "manifest.json"

# Fixed studio: the camera sits up and to the left, light comes from the same side.
CAM_YAW = 0.62
PITCH = 0.64
LIGHT = (-0.34, 0.84, 0.42)
ROW_YAW = {
    "S": 0.0,
    "SE": -math.pi / 4,
    "E": -math.pi / 2,
    "NE": -3 * math.pi / 4,
    "N": math.pi,
    "NW": 3 * math.pi / 4,
    "W": math.pi / 2,
    "SW": math.pi / 4,
}

CP, SP = math.cos(PITCH), math.sin(PITCH)


def xform(p: tuple[float, float, float], yaw: float) -> tuple[float, float, float]:
    x, y, z = p
    a = yaw + CAM_YAW
    c, s = math.cos(a), math.sin(a)
    x, z = x * c + z * s, -x * s + z * c
    y, z = y * CP - z * SP, y * SP + z * CP
    return x, y, z


def swing(tag: str, phase: float, clip: str) -> tuple[float, float, float]:
    s = math.sin(phase * math.tau)
    thrust = math.sin(min(1.0, phase) * math.pi)
    if clip in ("walk", "run", "fly"):
        amp = 0.26 if clip == "run" else 0.18
        if tag == "lleg":
            return (0, max(0, -s) * 0.1, s * amp)
        if tag == "rleg":
            return (0, max(0, s) * 0.1, -s * amp)
        if tag == "larm":
            return (s * 0.05, 0, -s * amp * 0.65)
        if tag == "rarm":
            return (-s * 0.05, 0, s * amp * 0.65)
        if tag == "wing":
            return (0, abs(s) * 0.16, 0)
        if tag == "body":
            return (0, abs(s) * 0.035, 0)
        if tag == "club":
            return (s * 0.06, 0, s * 0.12)
        if tag == "tail":
            return (0, 0, s * 0.12)
    if clip in ("attack", "slam"):
        power = thrust * (1.15 if clip == "slam" else 0.85)
        if tag in ("rarm", "club", "arm"):
            return (0.04, -power * 0.12, power * 0.34)
        if tag == "head":
            return (0, power * 0.04, power * 0.06)
    if clip == "roar":
        if tag == "head":
            return (0, abs(math.sin(phase * math.pi)) * 0.1, 0.04)
    if clip == "block":
        if tag == "shield":
            return (0, 0.04, 0.14)
    if clip == "hit":
        kick = math.sin(phase * math.pi)
        if tag in ("body", "head"):
            return (-0.1 * kick, 0, -0.04 * kick)
    if clip == "idle":
        if tag == "banner":
            return (s * 0.08, 0, 0)
        if tag == "orb":
            return (0, s * 0.04, 0)
        if tag == "body":
            return (0, abs(s) * 0.02, 0)
    if clip == "build":
        return (0, (phase - 1) * 0.55, 0)
    if clip == "sell":
        return (0, -phase * 0.5, 0)
    if clip == "death":
        return (phase * 0.08, -phase * 0.28, 0)
    return (0, 0, 0)


def pose(parts: list[tuple], phase: float, clip: str) -> list[tuple]:
    posed = []
    for part in parts:
        dx, dy, dz = swing(part[7], phase, clip)
        posed.append((part[0] + dx, part[1] + dy, part[2] + dz, part[3], part[4], part[5], part[6], part[7]))
    return posed


def bounds(parts: list[tuple], yaw: float) -> tuple[float, float, float, float]:
    xs: list[float] = []
    ys: list[float] = []
    for part in parts:
        cx, cy, cz, sx, sy, sz, _color, _tag = part
        for dx in (-1, 1):
            for dy in (-1, 1):
                for dz in (-1, 1):
                    x, y, _z = xform((cx + dx * sx / 2, cy + dy * sy / 2, cz + dz * sz / 2), yaw)
                    xs.append(x)
                    ys.append(y)
    return min(xs), max(xs), min(ys), max(ys)


def render_frame(parts: list[tuple], yaw: float, fw: int, fh: int, ppu: float, foot: float, anchor_y: float, fade: float) -> Image.Image:
    """Shaded ellipsoids at 2x, then scaled down so the silhouettes stay smooth."""
    ss = 2
    height, width = fh * ss, fw * ss
    rgb = np.zeros((height, width, 3), np.float32)
    depth = np.full((height, width), -1e9, np.float32)
    cover = np.zeros((height, width), np.bool_)
    lx, ly, lz = LIGHT
    ln = math.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / ln, ly / ln, lz / ln
    for part in parts:
        cx, cy, cz, sx, sy, sz, color, _tag = part
        x, y, z = xform((cx, cy, cz), yaw)
        rx = max(1.2, sx * 0.5 * ppu * ss)
        ry = max(1.2, sy * 0.5 * ppu * ss * 0.92)
        rz = max(0.02, sz * 0.5)
        scx = (fw * 0.5 + x * ppu) * ss
        scy = (anchor_y * fh - (y - foot) * ppu) * ss
        x0 = max(0, int(scx - rx - 1))
        x1 = min(width, int(scx + rx + 2))
        y0 = max(0, int(scy - ry - 1))
        y1 = min(height, int(scy + ry + 2))
        if x0 >= x1 or y0 >= y1:
            continue
        yy, xx = np.mgrid[y0:y1, x0:x1]
        dx = (xx - scx) / rx
        dy = (scy - yy) / ry
        disk = dx * dx + dy * dy
        inside = disk <= 1.0
        if not np.any(inside):
            continue
        nz = np.sqrt(np.clip(1.0 - disk, 0.0, 1.0))
        nd = np.clip(dx * lx + dy * ly + nz * lz, 0.0, 1.0)
        shade = 0.36 + 0.64 * nd + (nd > 0.84) * 0.1
        shade = shade * (0.82 + 0.18 * nz)
        far = z + nz * rz
        win = inside & (far > depth[y0:y1, x0:x1])
        slot = rgb[y0:y1, x0:x1]
        for channel, value in enumerate(color):
            slot[..., channel] = np.where(win, value * shade, slot[..., channel])
        depth[y0:y1, x0:x1] = np.where(win, far, depth[y0:y1, x0:x1])
        cover[y0:y1, x0:x1] |= win
    rgba = np.zeros((height, width, 4), np.uint8)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = np.where(cover, int(255 * fade), 0)
    image = Image.fromarray(rgba, "RGBA").resize((fw, fh), Image.Resampling.LANCZOS)
    return image


def sheet(kind: str, parts_fn, meta: dict, fill: float) -> None:
    rows = meta["rows"]
    anchor_y = float(meta["anchor"][1])
    for name, clip in meta["clips"].items():
        fw, fh = int(clip["frame_w"]), int(clip["frame_h"])
        frames = int(clip["frames"])
        rest = pose(parts_fn(0, "idle" if name == "idle" else "walk"), 0, "idle")
        yaw0 = ROW_YAW[rows[0]] if rows[0] in ROW_YAW else 0.0
        min_x, max_x, foot, max_y = bounds(rest, yaw0)
        height = max(0.2, max_y - foot)
        width = max(0.2, max_x - min_x)
        ppu = min((fh * fill) / height, (fw * 0.9) / width)
        image = Image.new("RGBA", (fw * frames, fh * len(rows)), (0, 0, 0, 0))
        for r, row in enumerate(rows):
            yaw = ROW_YAW.get(row, 0.0)
            for c in range(frames):
                phase = c / max(1, frames)
                fade = 1.0
                if name == "death":
                    fade = max(0.15, 1 - phase * 0.85)
                if name == "sell":
                    fade = max(0.2, 1 - phase * 0.7)
                frame = render_frame(pose(parts_fn(phase, name), phase, name), yaw, fw, fh, ppu, foot, anchor_y, fade)
                image.paste(frame, (c * fw, r * fh))
        dest = ROOT / "public" / clip["file"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        image.save(dest, "WEBP", quality=86, method=4)
        print(f"  {kind} {name} {image.size}", flush=True)


RED = (214, 54, 48)
RED_DARK = (132, 28, 32)
BELLY = (255, 176, 146)
EYE = (255, 248, 236)
PUPIL = (36, 14, 16)
WOOD = (150, 96, 52)
WOOD_DARK = (96, 58, 32)
STONE = (150, 144, 132)
STONE_DARK = (96, 90, 82)
GOLD = (232, 184, 78)
TAN = (214, 176, 122)
LEAF = (52, 140, 58)
CLOTH = (64, 108, 176)


def P(x, y, z, sx, sy, sz, color, tag="body"):
    return (x, y, z, sx, sy, sz, color, tag)


def skitter(_phase: float, _clip: str):
    return [
        P(0, 0.36, 0, 0.82, 0.46, 0.64, RED),
        P(0, 0.28, 0.2, 0.46, 0.26, 0.24, BELLY),
        P(0, 0.74, 0.05, 0.72, 0.5, 0.6, RED, "head"),
        P(-0.16, 0.82, 0.32, 0.18, 0.14, 0.08, EYE, "head"),
        P(0.16, 0.82, 0.32, 0.18, 0.14, 0.08, EYE, "head"),
        P(-0.16, 0.82, 0.36, 0.08, 0.08, 0.04, PUPIL, "head"),
        P(0.16, 0.82, 0.36, 0.08, 0.08, 0.04, PUPIL, "head"),
        P(-0.2, 1.05, 0, 0.12, 0.24, 0.12, RED_DARK, "head"),
        P(0.2, 1.05, 0, 0.12, 0.24, 0.12, RED_DARK, "head"),
        P(-0.22, 0.16, 0.02, 0.2, 0.26, 0.22, RED_DARK, "lleg"),
        P(0.22, 0.16, 0.02, 0.2, 0.26, 0.22, RED_DARK, "rleg"),
        P(-0.46, 0.4, 0, 0.22, 0.16, 0.2, RED, "larm"),
        P(0.46, 0.4, 0, 0.22, 0.16, 0.2, RED, "rarm"),
    ]


def runner(_phase: float, _clip: str):
    return [
        P(0, 0.62, 0, 0.42, 0.62, 0.34, RED),
        P(0, 1.08, 0.04, 0.4, 0.36, 0.36, RED, "head"),
        P(-0.1, 1.14, 0.2, 0.1, 0.08, 0.05, EYE, "head"),
        P(0.1, 1.14, 0.2, 0.1, 0.08, 0.05, EYE, "head"),
        P(-0.14, 0.28, 0, 0.14, 0.5, 0.16, RED_DARK, "lleg"),
        P(0.14, 0.28, 0, 0.14, 0.5, 0.16, RED_DARK, "rleg"),
        P(-0.28, 0.72, 0, 0.12, 0.4, 0.12, RED, "larm"),
        P(0.28, 0.72, 0, 0.12, 0.4, 0.12, RED, "rarm"),
    ]


def sapper(_phase: float, _clip: str):
    return runner(0, "run") + [
        P(0, 0.7, -0.24, 0.36, 0.4, 0.28, (232, 140, 48), "body"),
        P(0, 0.7, -0.38, 0.16, 0.16, 0.08, (255, 210, 120), "body"),
    ]


def shield(_phase: float, _clip: str):
    return [
        P(0, 0.55, -0.05, 0.48, 0.7, 0.36, RED),
        P(0, 1.05, 0, 0.4, 0.36, 0.34, RED, "head"),
        P(-0.1, 1.12, 0.16, 0.1, 0.08, 0.04, EYE, "head"),
        P(0.1, 1.12, 0.16, 0.1, 0.08, 0.04, EYE, "head"),
        P(-0.16, 0.24, 0, 0.16, 0.42, 0.16, RED_DARK, "lleg"),
        P(0.16, 0.24, 0, 0.16, 0.42, 0.16, RED_DARK, "rleg"),
        P(0, 0.62, 0.28, 0.78, 0.92, 0.12, TAN, "shield"),
        P(0, 0.62, 0.36, 0.16, 0.7, 0.04, (120, 78, 40), "shield"),
        P(-0.32, 0.7, 0.05, 0.14, 0.4, 0.14, RED, "larm"),
    ]


def golem(_phase: float, _clip: str):
    return [
        P(0, 0.55, 0, 0.9, 0.7, 0.7, STONE),
        P(0, 1.1, 0.04, 0.55, 0.42, 0.48, STONE, "head"),
        P(-0.12, 1.16, 0.26, 0.12, 0.1, 0.06, (230, 220, 190), "head"),
        P(0.12, 1.16, 0.26, 0.12, 0.1, 0.06, (230, 220, 190), "head"),
        P(-0.28, 0.22, 0, 0.28, 0.36, 0.28, STONE_DARK, "lleg"),
        P(0.28, 0.22, 0, 0.28, 0.36, 0.28, STONE_DARK, "rleg"),
        P(-0.62, 0.62, 0, 0.28, 0.22, 0.28, STONE, "larm"),
        P(0.62, 0.55, 0.1, 0.24, 0.5, 0.24, STONE_DARK, "rarm"),
    ]


def giant(_phase: float, _clip: str):
    return [
        P(0, 0.7, 0, 1.05, 0.85, 0.72, (120, 132, 96)),
        P(0, 1.3, 0.04, 0.62, 0.48, 0.5, (108, 120, 86), "head"),
        P(-0.14, 1.38, 0.26, 0.14, 0.1, 0.06, EYE, "head"),
        P(0.14, 1.38, 0.26, 0.14, 0.1, 0.06, EYE, "head"),
        P(-0.18, 1.62, 0, 0.1, 0.22, 0.1, (70, 78, 52), "head"),
        P(0.18, 1.62, 0, 0.1, 0.22, 0.1, (70, 78, 52), "head"),
        P(-0.32, 0.28, 0, 0.32, 0.48, 0.3, (86, 96, 68), "lleg"),
        P(0.32, 0.28, 0, 0.32, 0.48, 0.3, (86, 96, 68), "rleg"),
        P(-0.7, 0.85, 0, 0.28, 0.55, 0.26, (100, 112, 78), "larm"),
        P(0.72, 0.7, 0.15, 0.22, 0.7, 0.22, WOOD_DARK, "club"),
        P(0.78, 1.15, 0.2, 0.36, 0.36, 0.36, (70, 48, 32), "club"),
    ]


def glider(_phase: float, _clip: str):
    return [
        P(0, 0.5, 0, 0.46, 0.5, 0.62, RED),
        P(0, 0.78, 0.22, 0.4, 0.36, 0.36, RED, "head"),
        P(-0.1, 0.86, 0.38, 0.1, 0.08, 0.05, EYE, "head"),
        P(0.1, 0.86, 0.38, 0.1, 0.08, 0.05, EYE, "head"),
        P(-0.46, 0.56, 0.02, 0.72, 0.24, 0.42, (186, 52, 56), "wing"),
        P(0.46, 0.56, 0.02, 0.72, 0.24, 0.42, (186, 52, 56), "wing"),
        P(0, 0.42, -0.42, 0.16, 0.12, 0.32, RED_DARK, "tail"),
    ]


def jaguar(_phase: float, _clip: str):
    return [
        P(0, 0.42, 0, 0.46, 0.4, 1.05, (120, 78, 42)),
        P(0, 0.62, 0.62, 0.4, 0.32, 0.4, (108, 68, 36), "head"),
        P(-0.18, 0.86, 0.58, 0.1, 0.16, 0.06, (90, 54, 28), "head"),
        P(0.18, 0.86, 0.58, 0.1, 0.16, 0.06, (90, 54, 28), "head"),
        P(-0.1, 0.66, 0.8, 0.08, 0.06, 0.04, (255, 220, 80), "head"),
        P(0.1, 0.66, 0.8, 0.08, 0.06, 0.04, (255, 220, 80), "head"),
        P(-0.16, 0.18, 0.32, 0.14, 0.3, 0.14, (90, 56, 30), "lleg"),
        P(0.16, 0.18, 0.32, 0.14, 0.3, 0.14, (90, 56, 30), "rleg"),
        P(-0.16, 0.18, -0.32, 0.14, 0.3, 0.14, (90, 56, 30), "larm"),
        P(0.16, 0.18, -0.32, 0.14, 0.3, 0.14, (90, 56, 30), "rarm"),
        P(0, 0.48, -0.7, 0.12, 0.12, 0.4, (96, 60, 32), "tail"),
    ]


def boss(_phase: float, _clip: str):
    return [
        P(0, 0.7, 0, 1.15, 0.9, 0.8, (72, 64, 78)),
        P(0, 0.85, 0.28, 0.7, 0.22, 0.16, GOLD),
        P(0, 1.35, 0.05, 0.7, 0.52, 0.55, (58, 50, 64), "head"),
        P(-0.28, 1.7, 0, 0.16, 0.4, 0.16, (40, 34, 46), "head"),
        P(0.28, 1.7, 0, 0.16, 0.4, 0.16, (40, 34, 46), "head"),
        P(-0.16, 1.4, 0.3, 0.14, 0.1, 0.06, (255, 80, 60), "head"),
        P(0.16, 1.4, 0.3, 0.14, 0.1, 0.06, (255, 80, 60), "head"),
        P(-0.7, 0.9, 0, 0.4, 0.28, 0.4, (86, 74, 90)),
        P(0.7, 0.9, 0, 0.4, 0.28, 0.4, (86, 74, 90)),
        P(-0.36, 0.28, 0, 0.36, 0.5, 0.34, (54, 46, 58), "lleg"),
        P(0.36, 0.28, 0, 0.36, 0.5, 0.34, (54, 46, 58), "rleg"),
        P(0.85, 0.55, 0.2, 0.24, 0.85, 0.24, WOOD_DARK, "club"),
        P(0.9, 1.15, 0.25, 0.46, 0.46, 0.46, (48, 40, 44), "club"),
    ]


def guardian(_phase: float, _clip: str):
    return [
        P(0, 0.55, 0, 0.55, 0.7, 0.36, CLOTH),
        P(0, 0.4, -0.12, 0.4, 0.55, 0.12, (196, 48, 52)),
        P(0, 1.05, 0, 0.4, 0.36, 0.36, (232, 186, 150), "head"),
        P(0, 1.28, 0, 0.46, 0.14, 0.4, GOLD, "head"),
        P(0, 1.0, 0.16, 0.28, 0.16, 0.1, (180, 130, 96), "head"),
        P(-0.16, 0.22, 0, 0.16, 0.4, 0.16, (48, 58, 96), "lleg"),
        P(0.16, 0.22, 0, 0.16, 0.4, 0.16, (48, 58, 96), "rleg"),
        P(-0.36, 0.62, 0, 0.14, 0.4, 0.14, CLOTH, "larm"),
        P(0.38, 0.58, 0.08, 0.12, 0.5, 0.12, GOLD, "rarm"),
    ]


def tower_dart(tier: int):
    def build(_phase: float, _clip: str):
        parts = [
            P(0, 0.18, 0, 1.15, 0.32, 1.15, STONE),
            P(0, 0.95, 0, 0.36, 1.15, 0.36, WOOD),
            P(0, 1.55, 0, 0.95, 0.12, 0.95, WOOD_DARK),
            P(0, 1.85, 0.05, 0.28, 0.4, 0.24, (70, 110, 170)),
            P(0.22, 1.85, 0.2, 0.1, 0.36, 0.42, WOOD_DARK, "arm"),
        ]
        if tier >= 2:
            parts += [
                P(0, 2.15, 0, 0.7, 0.1, 0.7, (120, 70, 48)),
                P(-0.28, 1.7, 0, 0.12, 0.4, 0.12, WOOD),
                P(0.28, 1.7, 0, 0.12, 0.4, 0.12, WOOD),
            ]
        if tier >= 3:
            parts += [
                P(0, 2.45, 0, 0.16, 0.45, 0.08, (180, 48, 42), "banner"),
                P(0, 2.15, 0, 1.05, 0.08, 1.05, STONE_DARK),
                P(-0.4, 1.2, 0, 0.12, 0.9, 0.12, WOOD),
                P(0.4, 1.2, 0, 0.12, 0.9, 0.12, WOOD),
            ]
        return parts

    return build


def tower_lens(tier: int):
    def build(_phase: float, _clip: str):
        parts = [
            P(0, 0.2, 0, 1.2, 0.36, 1.0, STONE_DARK),
            P(0, 0.7, 0, 0.7, 0.5, 0.55, STONE),
            P(0, 0.85, 0.45, 0.22, 0.18, 1.15, WOOD_DARK, "arm"),
            P(0, 0.95, 0.95, 0.28, 0.28, 0.28, (90, 98, 110), "arm"),
        ]
        if tier >= 2:
            parts += [
                P(-0.4, 0.55, 0, 0.18, 0.5, 0.5, STONE),
                P(0.4, 0.55, 0, 0.18, 0.5, 0.5, STONE),
                P(0, 0.85, 0.2, 0.16, 0.16, 0.7, GOLD),
            ]
        if tier >= 3:
            parts += [
                P(0, 1.35, 0, 0.9, 0.16, 0.7, STONE),
                P(0, 1.15, -0.2, 0.35, 0.45, 0.3, WOOD),
                P(0, 0.9, 1.2, 0.4, 0.4, 0.2, (70, 78, 88)),
            ]
        return parts

    return build


def tower_drum(tier: int):
    def build(_phase: float, _clip: str):
        parts = [
            P(0, 0.16, 0, 1.1, 0.28, 1.1, (90, 70, 48)),
            P(-0.32, 0.9, 0, 0.22, 1.3, 0.22, WOOD),
            P(0.32, 0.9, 0, 0.22, 1.3, 0.22, WOOD),
            P(0, 0.7, 0.15, 0.7, 0.45, 0.45, (150, 70, 48)),
            P(0, 1.55, 0, 0.55, 0.12, 0.4, GOLD, "arm"),
        ]
        if tier >= 2:
            parts += [
                P(0, 1.15, 0.35, 0.28, 0.4, 0.2, (120, 210, 190), "orb"),
                P(-0.32, 1.65, 0, 0.28, 0.16, 0.28, LEAF),
                P(0.32, 1.65, 0, 0.28, 0.16, 0.28, LEAF),
            ]
        if tier >= 3:
            parts += [
                P(0, 1.9, 0, 0.18, 0.7, 0.18, (170, 140, 230), "banner"),
                P(0, 2.3, 0, 0.32, 0.22, 0.32, (210, 190, 255), "orb"),
            ]
        return parts

    return build


def tower_serpent(tier: int):
    def build(_phase: float, _clip: str):
        parts = [
            P(0, 0.16, 0, 1.05, 0.28, 1.05, STONE_DARK),
            P(0, 0.7, 0, 0.55, 0.8, 0.55, (110, 90, 150)),
            P(0, 1.25, 0, 0.38, 0.45, 0.38, (150, 120, 200)),
            P(0, 1.6, 0, 0.28, 0.28, 0.28, (230, 210, 255), "orb"),
        ]
        if tier >= 2:
            parts += [
                P(0, 0.95, 0, 0.85, 0.1, 0.85, GOLD),
                P(0, 1.4, 0, 0.6, 0.08, 0.6, GOLD),
            ]
        if tier >= 3:
            parts += [
                P(0, 2.05, 0, 0.22, 0.55, 0.22, (180, 150, 240), "banner"),
                P(0, 2.4, 0, 0.36, 0.3, 0.36, (245, 230, 255), "orb"),
                P(-0.4, 0.8, 0, 0.12, 0.7, 0.12, STONE),
                P(0.4, 0.8, 0, 0.12, 0.7, 0.12, STONE),
            ]
        return parts

    return build


def paint_arrow() -> None:
    image = Image.new("RGBA", (128, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    # Soft streak behind the shaft so the fall reads as motion, not a hairline.
    draw.polygon([(4, 16), (70, 6), (70, 26)], fill=(255, 236, 170, 90))
    draw.polygon([(18, 16), (78, 9), (78, 23)], fill=(255, 248, 220, 150))
    draw.rounded_rectangle((36, 12, 108, 20), radius=3, fill=(255, 236, 190, 255))
    draw.polygon([(100, 4), (126, 16), (100, 28)], fill=(255, 214, 90, 255))
    draw.polygon([(108, 10), (122, 16), (108, 22)], fill=(255, 250, 220, 255))
    draw.polygon([(34, 16), (52, 4), (48, 16), (52, 28)], fill=(230, 70, 48, 255))
    draw.polygon([(40, 16), (50, 8), (48, 16)], fill=(255, 180, 140, 255))
    dest = ART / "ui" / "fx-dart.webp"
    image.save(dest, "WEBP", quality=90, method=4)
    print("  arrow", dest.name, flush=True)


BUILDERS = {
    "enemy_skitter": (skitter, 0.64),
    "enemy_runner": (runner, 0.66),
    "enemy_sapper": (sapper, 0.66),
    "enemy_shieldbearer": (shield, 0.66),
    "enemy_golem": (golem, 0.66),
    "enemy_giant": (giant, 0.66),
    "enemy_glider": (glider, 0.62),
    "enemy_jaguar": (jaguar, 0.62),
    "enemy_boss": (boss, 0.66),
    "guardian": (guardian, 0.74),
}


def clone_unit(manifest: dict, src: str, dst: str) -> None:
    if any(unit["id"] == dst for unit in manifest["units"]):
        return
    source = next(unit for unit in manifest["units"] if unit["id"] == src)
    copied = json.loads(json.dumps(source))
    copied["id"] = dst
    for clip in copied["clips"].values():
        clip["file"] = clip["file"].replace(src, dst)
    manifest["units"].append(copied)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text())
    clone_unit(manifest, "enemy_runner", "enemy_sapper")
    clone_unit(manifest, "enemy_golem", "enemy_giant")
    for tier, fn in (
        (1, tower_dart),
        (2, tower_dart),
        (3, tower_dart),
        (1, tower_lens),
        (2, tower_lens),
        (3, tower_lens),
        (1, tower_drum),
        (2, tower_drum),
        (3, tower_drum),
        (1, tower_serpent),
        (2, tower_serpent),
        (3, tower_serpent),
    ):
        family = {tower_dart: "dart", tower_lens: "lens", tower_drum: "drum", tower_serpent: "serpent"}[fn]
        BUILDERS[f"tower_{family}_t{tier}"] = (fn(tier), 0.7)
    by_id = {unit["id"]: unit for unit in manifest["units"]}
    only = set(sys.argv[1:])
    for kind, (builder, fill) in BUILDERS.items():
        if only and kind not in only:
            continue
        print(kind, flush=True)
        sheet(kind, builder, by_id[kind], fill)
    paint_arrow()
    MANIFEST.write_text(json.dumps(manifest, separators=(",", ":")))
    print("baked", flush=True)


if __name__ == "__main__":
    main()
