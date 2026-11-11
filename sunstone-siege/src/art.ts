/**
 * Rendered art. The pictures live in public/art as WebP. Units share one
 * atlas. Maps, the Sunstone layers, and the stone UI stay whole because they
 * are large or nine-sliced.
 */
import { Assets, Spritesheet, Texture } from "pixi.js";

export interface ArtSet {
  frame(name: string): Texture;
  map(biome: "valley" | "ruins" | "crater"): Texture;
  title: Texture;
  valley: Texture;
  logo: Texture;
  panel: Texture;
  button: Texture;
  buttonDown: Texture;
  shadow: Texture;
  glow: Texture;
}

const ATLAS = "art/units.json";
const FILES = [
  "art/map-jungle.webp",
  "art/map-river.webp",
  "art/map-night.webp",
  "art/title.webp",
  "art/valley.webp",
  "art/logo.webp",
  "art/sun-core.webp",
  "art/sun-inner.webp",
  "art/sun-outer.webp",
  "art/panel.webp",
  "art/button.webp",
  "art/button-down.webp",
  "art/shadow.webp",
  "art/glow.webp",
];

export async function loadArt(onProgress?: (progress: number) => void): Promise<ArtSet> {
  const loaded = await Assets.load<Spritesheet | Texture>([ATLAS, ...FILES], onProgress);
  const sheet = loaded[ATLAS] as Spritesheet;
  const frames = sheet.textures;
  const tex = (url: string): Texture => loaded[url] as Texture;
  const maps = {
    valley: tex("art/map-jungle.webp"),
    ruins: tex("art/map-river.webp"),
    crater: tex("art/map-night.webp"),
  };
  for (const map of Object.values(maps)) {
    map.source.scaleMode = "linear";
    map.source.autoGenerateMipmaps = true;
  }
  const sun = {
    "sun-core": tex("art/sun-core.webp"),
    "sun-inner": tex("art/sun-inner.webp"),
    "sun-outer": tex("art/sun-outer.webp"),
  };
  const lookup = (name: string): Texture => frames[name] ?? sun[name as keyof typeof sun];
  return {
    frame: lookup,
    map: (biome) => maps[biome],
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
