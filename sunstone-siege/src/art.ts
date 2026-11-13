/**
 * 2.5D art. Towers and raiders are pre-rendered sprite sheets (8 facings for
 * raiders, one facing for towers). Maps, the Sunstone, and the stone UI stay
 * as whole images.
 *
 * An optional PixiJS atlas at art/sprites/atlas.json replaces those sheets
 * when it is present (the Meshy zip). Every frame shares that one texture,
 * so the units stay in a single batch. Frame names:
 *   {id}/{clip}/{facing}/{index}     enemy_skitter/run/s/0
 *   {id}_{clip}_{facing}_{index}     tower_dart_t1_idle_s_0
 * Facings, in row order: s, se, e, ne, n, nw, w, sw. One facing is enough
 * for a tower tier. Props are prop/{name} or prop_{name}.
 */
import { Assets, Rectangle, Spritesheet, Texture } from "pixi.js";

export interface Clip {
  frames: Texture[][];
  fps: number;
  loop: boolean;
  anchorX: number;
  anchorY: number;
  draw: number;
}

export interface ArtSet {
  frame(name: string): Texture;
  clip(id: string, name: string): Clip | null;
  /** A 3/4 prop from the atlas, or null until that prop is in the sheet. */
  prop(name: string): Texture | null;
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

interface ClipMeta {
  file: string;
  frames: number;
  loop: boolean;
  fps: number;
  frame_w: number;
  frame_h: number;
  draw: number;
}

interface UnitMeta {
  id: string;
  anchor: [number, number];
  rows: string[];
  clips: Record<string, ClipMeta>;
}

interface Manifest {
  units: UnitMeta[];
  ui: string[];
  maps: string[];
  plates: string[];
}

export async function loadArt(onProgress?: (progress: number) => void): Promise<ArtSet> {
  const manifest = await fetch("./art/sprites/manifest.json").then((res) => {
    if (!res.ok) throw new Error("sunstone-siege: missing sprite manifest");
    return res.json() as Promise<Manifest>;
  });
  const urls: string[] = [];
  for (const unit of manifest.units) {
    for (const clip of Object.values(unit.clips)) urls.push(clip.file);
  }
  urls.push(...manifest.ui, ...manifest.maps, ...manifest.plates);
  for (let i = 0; i < 8; i++) urls.push(`art/map-l${i}.webp`);
  const loaded = await Assets.load<Texture>(urls, onProgress);
  const tex = (url: string): Texture => loaded[url];

  const frames = new Map<string, Texture>();
  for (const url of manifest.ui) frames.set(url.slice(url.lastIndexOf("/") + 1, -5), tex(url));
  frames.set("sun-core", tex("art/sun-core.webp"));
  frames.set("sun-inner", tex("art/sun-inner.webp"));
  frames.set("sun-outer", tex("art/sun-outer.webp"));

  const clips = new Map<string, Clip>();
  for (const unit of manifest.units) {
    for (const [name, clip] of Object.entries(unit.clips)) {
      const sheet = tex(clip.file);
      const rows: Texture[][] = [];
      for (let r = 0; r < unit.rows.length; r++) {
        const row: Texture[] = [];
        for (let c = 0; c < clip.frames; c++) {
          row.push(new Texture({
            source: sheet.source,
            frame: new Rectangle(c * clip.frame_w, r * clip.frame_h, clip.frame_w, clip.frame_h),
          }));
        }
        rows.push(row);
      }
      clips.set(`${unit.id}:${name}`, {
        frames: rows,
        fps: clip.fps,
        loop: clip.loop,
        anchorX: unit.anchor[0],
        anchorY: unit.anchor[1],
        draw: clip.draw,
      });
    }
  }

  const props = new Map<string, Texture>();
  await applyAtlas(clips, frames, props);

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

  return {
    frame: (name) => frames.get(name) ?? Texture.EMPTY,
    clip: (id, name) => clips.get(`${id}:${name}`) ?? null,
    prop: (name) => props.get(name) ?? null,
    map: (biome) => maps[biome],
    level: (world) => levels[Math.max(0, Math.min(levels.length - 1, world))] ?? maps.valley,
    title: tex("art/title.webp"),
    valley: tex("art/valley.webp"),
    logo: tex("art/logo.webp"),
    panel: tex("art/panel.webp"),
    button: tex("art/button.webp"),
    buttonDown: tex("art/button-down.webp"),
    shadow: tex("art/shadow.webp"),
    glow: tex("art/glow.webp"),
  };
}

const FACINGS = ["s", "se", "e", "ne", "n", "nw", "w", "sw"];
const FACING = new Set(FACINGS);
const CLIP_NAMES = ["walk", "run", "fly", "idle", "attack", "hit", "death", "build", "sell", "block", "slam", "roar"];

interface ParsedFrame {
  id: string;
  clip: string;
  facing: string;
  index: number;
}

function basename(name: string): string {
  return name.replace(/\.(png|webp|jpe?g)$/i, "");
}

function clipFromRest(rest: string): { id: string; clip: string } {
  for (const clip of CLIP_NAMES) {
    if (rest.endsWith(`_${clip}`)) return { id: rest.slice(0, -(clip.length + 1)), clip };
  }
  return { id: rest, clip: "idle" };
}

/** Slash names keep underscores inside the id. Underscore names end in _facing_index. */
function parseFrameName(name: string): ParsedFrame | null {
  const base = basename(name);
  const slash = base.split("/");
  if (slash.length >= 4 && FACING.has(slash[slash.length - 2].toLowerCase()) && /^\d+$/.test(slash[slash.length - 1])) {
    return {
      id: slash[0],
      clip: slash.slice(1, -2).join("/") || "idle",
      facing: slash[slash.length - 2].toLowerCase(),
      index: Number(slash[slash.length - 1]),
    };
  }
  if (slash.length === 3 && FACING.has(slash[2].toLowerCase())) {
    return { id: slash[0], clip: slash[1], facing: slash[2].toLowerCase(), index: 0 };
  }
  if (slash.length === 2 && !base.startsWith("prop")) return { id: slash[0], clip: slash[1], facing: "s", index: 0 };
  const indexed = base.match(/^(.*)_([a-z]{1,2})_(\d+)$/i);
  if (indexed && FACING.has(indexed[2].toLowerCase())) {
    const { id, clip } = clipFromRest(indexed[1]);
    return { id, clip, facing: indexed[2].toLowerCase(), index: Number(indexed[3]) };
  }
  return null;
}

function parseAnim(name: string): { id: string; clip: string; facing: string } | null {
  const slash = name.split("/");
  if (slash.length >= 3 && FACING.has(slash[slash.length - 1].toLowerCase())) {
    return { id: slash[0], clip: slash.slice(1, -1).join("/") || "idle", facing: slash[slash.length - 1].toLowerCase() };
  }
  if (slash.length === 2) return { id: slash[0], clip: slash[1], facing: "s" };
  const tail = name.match(/^(.*)_([a-z]{1,2})$/i);
  if (tail && FACING.has(tail[2].toLowerCase())) {
    const { id, clip } = clipFromRest(tail[1]);
    return { id, clip, facing: tail[2].toLowerCase() };
  }
  return null;
}

function propName(name: string): string | null {
  const base = basename(name);
  if (base.startsWith("prop/")) return base.slice("prop/".length);
  if (base.startsWith("props/")) return base.slice("props/".length);
  if (base.startsWith("prop_")) return base.slice("prop_".length);
  return null;
}

/**
 * Loads art/sprites/atlas.json when the zip has been dropped in. A missing
 * file leaves the manifest sheets in place. Textures stay on the one atlas
 * source so a full wave still batches.
 */
async function applyAtlas(clips: Map<string, Clip>, frames: Map<string, Texture>, props: Map<string, Texture>): Promise<void> {
  let sheet: Spritesheet;
  try {
    const probe = await fetch("./art/sprites/atlas.json");
    if (!probe.ok) return;
    sheet = await Assets.load<Spritesheet>("./art/sprites/atlas.json");
  } catch {
    return;
  }
  if (!sheet?.textures) return;
  const sample = Object.values(sheet.textures)[0];
  if (sample?.source) {
    sample.source.scaleMode = "linear";
    sample.source.autoGenerateMipmaps = true;
  }

  const buckets = new Map<string, Map<string, { index: number; texture: Texture }[]>>();
  const fromAnim = new Set<string>();
  const add = (parsed: ParsedFrame, texture: Texture, animated: boolean): void => {
    const key = `${parsed.id}:${parsed.clip}`;
    const slot = `${key}:${parsed.facing}`;
    if (animated) fromAnim.add(slot);
    else if (fromAnim.has(slot)) return;
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
    list.push({ index: parsed.index, texture });
  };

  for (const [name, textures] of Object.entries(sheet.animations ?? {})) {
    const anim = parseAnim(name);
    if (!anim) continue;
    textures.forEach((texture, index) => add({ ...anim, index }, texture, true));
  }
  for (const [name, texture] of Object.entries(sheet.textures)) {
    const prop = propName(name);
    if (prop) {
      props.set(prop, texture);
      continue;
    }
    const parsed = parseFrameName(name);
    if (!parsed) {
      const bare = basename(name).split("/").pop() ?? name;
      frames.set(bare === "arrow" ? "fx-dart" : bare, texture);
      continue;
    }
    add(parsed, texture, false);
  }

  for (const [key, facings] of buckets) {
    const present = FACINGS.filter((facing) => (facings.get(facing)?.length ?? 0) > 0);
    if (present.length === 0) continue;
    const rowOf = (facing: string): Texture[] => {
      const list = facings.get(facing) ?? facings.get("s") ?? facings.get(present[0]) ?? [];
      return [...list].sort((a, b) => a.index - b.index).map((frame) => frame.texture);
    };
    const rows = present.length === 1 ? [rowOf(present[0])] : FACINGS.map((facing) => rowOf(facing));
    const prior = clips.get(key);
    const clipName = key.slice(key.indexOf(":") + 1);
    clips.set(key, {
      frames: rows,
      fps: prior?.fps ?? 10,
      loop: prior?.loop ?? clipName !== "death",
      anchorX: prior?.anchorX ?? 0.5,
      anchorY: prior?.anchorY ?? 0.78,
      draw: prior?.draw ?? 0.5,
    });
  }
}
