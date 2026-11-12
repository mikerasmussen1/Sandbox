/**
 * 2.5D art. Towers and raiders are pre-rendered sprite sheets (8 facings for
 * raiders, one facing for towers). Maps, the Sunstone, and the stone UI stay
 * as whole images.
 */
import { Assets, Rectangle, Texture } from "pixi.js";

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
