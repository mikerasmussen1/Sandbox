/**
 * 2.5D art. Units, towers, walls, the keep and props come from the
 * Meshy atlas. The sheet is four 2048 pages (atlas-256.png plus the
 * related packs) rather than one 4096 image: a 4096 texture sits on the
 * iOS Safari canvas-area limit and the MAX_TEXTURE_SIZE boundary, and
 * frames cross both midlines so the pages are repacked, not sliced.
 * The 19 MB full-colour PNG is not shipped.
 *
 * Frame names are {id}/{clip}/{facing}/{index}. Facings, in row order:
 * s, se, e, ne, n, nw, w, sw. Walls only have s, se, e, ne; the other
 * four rows reuse those. Each frame keeps the anchor from the JSON
 * (the ground point; y varies per frame). Shadows are shadow/{id} and
 * shadow/prop_{name}.
 */
import { Assets, Spritesheet, Texture } from "pixi.js";

export interface Clip {
  frames: Texture[][];
  /** Per-frame ground point, same shape as frames. */
  anchors: { x: number; y: number }[][];
  fps: number;
  loop: boolean;
  anchorX: number;
  anchorY: number;
  /** World units per source pixel, so the measured body lands on the reference ratio. */
  draw: number;
}

export interface Mark {
  texture: Texture;
  ax: number;
  ay: number;
}

export interface ArtSet {
  frame(name: string): Texture;
  clip(id: string, name: string): Clip | null;
  prop(name: string): Texture | null;
  /** World units per source pixel for a placed prop. */
  propScale(name: string): number;
  /** Contact shadow for a unit id or prop_{name}. */
  mark(id: string): Mark | null;
  map(biome: "valley" | "ruins" | "crater"): Texture;
  level(world: number): Texture;
  title: Texture;
  valley: Texture;
  logo: Texture;
  panel: Texture;
  button: Texture;
  buttonDown: Texture;
  shadow: Texture;
  glow: Texture;
}

const UI = [
  "art/ui/jade.webp",
  "art/ui/flare.webp",
  "art/ui/flare-off.webp",
  "art/ui/fx-beam.webp",
  "art/ui/fx-boom.webp",
  "art/ui/fx-lightning.webp",
  "art/ui/fx-orb.webp",
  "art/ui/fx-spear.webp",
  "art/ui/fx-stun.webp",
  "art/title.webp",
  "art/valley.webp",
  "art/logo.webp",
  "art/panel.webp",
  "art/button.webp",
  "art/button-down.webp",
  "art/glow.webp",
  "art/sun-core.webp",
  "art/sun-inner.webp",
  "art/sun-outer.webp",
  "art/map-jungle.webp",
  "art/map-river.webp",
  "art/map-night.webp",
];

/** Portrait shows 600 world px. These are the measured reference heights. */
const VISIBLE = 600;
const NAMED_HEIGHT: Record<string, number> = {
  hero: 0.069 * VISIBLE,
  swarmer: 0.052 * VISIBLE,
  giant: 0.12 * VISIBLE,
  boulder: 0.15 * VISIBLE,
  boss: 0.114 * VISIBLE,
  base_keep: 0.22 * VISIBLE,
};

const FACINGS = ["s", "se", "e", "ne", "n", "nw", "w", "sw"];
const FACING = new Set(FACINGS);
/** Walls ship four views. The opposite side reuses the matching one. */
const WALL_FOLD: Record<string, string> = { n: "s", nw: "se", w: "e", sw: "ne" };

export async function loadArt(onProgress?: (progress: number) => void): Promise<ArtSet> {
  const urls = [...UI];
  for (let i = 0; i < 8; i++) urls.push(`art/map-l${i}.webp`);
  const loaded = await Assets.load<Texture>(urls, onProgress);
  const tex = (url: string): Texture => loaded[url];

  const frames = new Map<string, Texture>();
  const take = (file: string, name: string): void => {
    frames.set(name, tex(file));
  };
  take("art/ui/jade.webp", "jade");
  take("art/ui/flare.webp", "flare");
  take("art/ui/flare-off.webp", "flare-off");
  take("art/ui/fx-beam.webp", "fx-beam");
  take("art/ui/fx-boom.webp", "fx-boom");
  take("art/ui/fx-lightning.webp", "fx-lightning");
  take("art/ui/fx-orb.webp", "fx-orb");
  take("art/ui/fx-spear.webp", "fx-spear");
  take("art/ui/fx-stun.webp", "fx-stun");
  take("art/sun-core.webp", "sun-core");
  take("art/sun-inner.webp", "sun-inner");
  take("art/sun-outer.webp", "sun-outer");

  const sheet = await Assets.load<Spritesheet>("./art/sprites/atlas.json");
  const textures = new Map<string, Texture>();
  const sources = new Set<Texture["source"]>();
  const absorb = (page: Spritesheet): void => {
    for (const [name, texture] of Object.entries(page.textures)) {
      textures.set(name, texture);
      if (!sources.has(texture.source)) {
        sources.add(texture.source);
        texture.source.scaleMode = "linear";
        texture.source.autoGenerateMipmaps = true;
      }
    }
  };
  absorb(sheet);
  for (const link of sheet.linkedSheets ?? []) absorb(link);

  const clips = new Map<string, Clip>();
  const props = new Map<string, Texture>();
  const marks = new Map<string, Mark>();
  buildAtlas(textures, clips, props, marks, frames);

  const maps = {
    valley: tex("art/map-jungle.webp"),
    ruins: tex("art/map-river.webp"),
    crater: tex("art/map-night.webp"),
  };
  const levels: Texture[] = [];
  for (let i = 0; i < 8; i++) levels.push(tex(`art/map-l${i}.webp`));
  for (const map of [...Object.values(maps), ...levels]) {
    map.source.scaleMode = "linear";
    map.source.autoGenerateMipmaps = true;
  }

  const heroMark = marks.get("hero");
  return {
    frame: (name) => frames.get(name) ?? Texture.EMPTY,
    clip: (id, name) => clips.get(`${id}:${name}`) ?? null,
    prop: (name) => props.get(name) ?? null,
    propScale: (name) => (name === "arrow" ? 0.24 : 0.32),
    mark: (id) => marks.get(id) ?? null,
    map: (biome) => maps[biome],
    level: (world) => levels[Math.max(0, Math.min(levels.length - 1, world))] ?? maps.valley,
    title: tex("art/title.webp"),
    valley: tex("art/valley.webp"),
    logo: tex("art/logo.webp"),
    panel: tex("art/panel.webp"),
    button: tex("art/button.webp"),
    buttonDown: tex("art/button-down.webp"),
    shadow: heroMark?.texture ?? Texture.EMPTY,
    glow: tex("art/glow.webp"),
  };
}

interface ParsedFrame {
  id: string;
  clip: string;
  facing: string;
  index: number;
}

interface Held {
  index: number;
  texture: Texture;
  ax: number;
  ay: number;
}

function anchorOf(texture: Texture): { x: number; y: number } {
  const anchor = texture.defaultAnchor;
  return { x: anchor?.x ?? 0.5, y: anchor?.y ?? 0.85 };
}

function trimHeight(texture: Texture): number {
  return Math.max(1, texture.frame.height);
}

function parseFrameName(name: string): ParsedFrame | null {
  const slash = name.split("/");
  if (slash.length >= 4 && FACING.has(slash[slash.length - 2]) && /^\d+$/.test(slash[slash.length - 1])) {
    return {
      id: slash[0],
      clip: slash.slice(1, -2).join("/") || "idle",
      facing: slash[slash.length - 2],
      index: Number(slash[slash.length - 1]),
    };
  }
  return null;
}

function buildAtlas(
  textures: Map<string, Texture>,
  clips: Map<string, Clip>,
  props: Map<string, Texture>,
  marks: Map<string, Mark>,
  frames: Map<string, Texture>,
): void {
  const buckets = new Map<string, Map<string, Held[]>>();
  for (const [name, texture] of textures) {
    if (name.startsWith("shadow/")) {
      const id = name.slice("shadow/".length);
      const anchor = anchorOf(texture);
      marks.set(id, { texture, ax: anchor.x, ay: anchor.y });
      continue;
    }
    if (name.startsWith("prop/")) {
      const prop = name.slice("prop/".length);
      props.set(prop, texture);
      if (prop === "arrow") frames.set("fx-dart", texture);
      continue;
    }
    const parsed = parseFrameName(name);
    if (!parsed) continue;
    const key = `${parsed.id}:${parsed.clip}`;
    let facings = buckets.get(key);
    if (!facings) {
      facings = new Map();
      buckets.set(key, facings);
    }
    let list = facings.get(parsed.facing);
    if (!list) {
      list = [];
      facings.set(parsed.facing, list);
    }
    const anchor = anchorOf(texture);
    list.push({ index: parsed.index, texture, ax: anchor.x, ay: anchor.y });
  }

  for (const [key, facings] of buckets) {
    const id = key.slice(0, key.indexOf(":"));
    const present = FACINGS.filter((facing) => (facings.get(facing)?.length ?? 0) > 0);
    if (present.length === 0) continue;
    const rowFor = (facing: string): Held[] => {
      const folded = id.startsWith("wall_") ? WALL_FOLD[facing] ?? facing : facing;
      const list = facings.get(folded) ?? facings.get(facing) ?? facings.get("s") ?? facings.get(present[0]) ?? [];
      return [...list].sort((a, b) => a.index - b.index);
    };
    const use = present.length === 1 ? [present[0]] : FACINGS;
    const rows = use.map((facing) => rowFor(facing));
    const first = rows[0][0];
    clips.set(key, {
      frames: rows.map((row) => row.map((held) => held.texture)),
      anchors: rows.map((row) => row.map((held) => ({ x: held.ax, y: held.ay }))),
      fps: id === "hero" ? 12 : 10,
      loop: true,
      anchorX: first?.ax ?? 0.5,
      anchorY: first?.ay ?? 0.85,
      draw: 0.3,
    });
  }

  const swarmer = clips.get("swarmer:walk");
  const density = swarmer ? NAMED_HEIGHT.swarmer / trimHeight(swarmer.frames[0][0]) : 0.32;
  const archer = clips.get("tower_archer_t1:idle");
  const towerDensity = archer ? (0.1 * VISIBLE) / trimHeight(archer.frames[0][0]) : density;
  for (const [key, clip] of clips) {
    const id = key.slice(0, key.indexOf(":"));
    const sample = clip.frames[0][0];
    const height = trimHeight(sample);
    if (NAMED_HEIGHT[id] != null) clip.draw = NAMED_HEIGHT[id] / height;
    else if (id.startsWith("tower_")) clip.draw = towerDensity;
    else if (id.startsWith("wall_")) clip.draw = 48 / height;
    else clip.draw = density;
  }
}
