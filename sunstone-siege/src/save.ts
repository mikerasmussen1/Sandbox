/** Stars, unlocks and the two volume knobs. Jade never leaves this browser. */

const KEY = "sunstone-siege.v1";

export interface SaveData {
  stars: [number, number, number];
  music: number;
  sfx: number;
  reduced: boolean;
}

export const DEFAULT_SAVE: SaveData = {
  stars: [0, 0, 0],
  music: 0.55,
  sfx: 0.8,
  reduced: false,
};

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function prefersReducedMotion(): boolean {
  try {
    return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  } catch {
    return false;
  }
}

export function loadSave(): SaveData {
  const fresh = new URLSearchParams(globalThis.location?.search ?? "").get("fresh") === "1";
  const base: SaveData = { ...DEFAULT_SAVE, stars: [0, 0, 0], reduced: prefersReducedMotion() };
  if (fresh) {
    storage()?.removeItem(KEY);
    return base;
  }
  const raw = storage()?.getItem(KEY);
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const stars = [0, 1, 2].map((i) => {
      const n = parsed.stars?.[i] ?? 0;
      return n === 1 || n === 2 || n === 3 ? n : 0;
    }) as [number, number, number];
    return {
      stars,
      music: clamp01(parsed.music ?? base.music),
      sfx: clamp01(parsed.sfx ?? base.sfx),
      reduced: typeof parsed.reduced === "boolean" ? parsed.reduced : base.reduced,
    };
  } catch {
    return base;
  }
}

export function writeSave(data: SaveData): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(data));
  } catch {
    /* a private window that refuses storage still plays the valley */
  }
}

/** Valley 0 is always open. The next valley opens once the previous one was held. */
export function isUnlocked(stars: readonly number[], index: number): boolean {
  if (index <= 0) return true;
  return (stars[index - 1] ?? 0) > 0;
}

export function recordStars(data: SaveData, world: number, stars: 1 | 2 | 3): SaveData {
  const next: SaveData = { ...data, stars: [...data.stars] as [number, number, number] };
  if (stars > next.stars[world]) next.stars[world] = stars;
  writeSave(next);
  return next;
}
