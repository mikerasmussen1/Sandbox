/** Stars, unlocks and the two volume knobs. Jade never leaves this browser. */
import { worldCount } from "./balance";

const KEY = "sunstone-siege.v1";

export interface SaveData {
  stars: number[];
  music: number;
  sfx: number;
  reduced: boolean;
  /** How far the first-valley hints have progressed. */
  taught: number;
}

function blankStars(): number[] {
  return Array.from({ length: worldCount() }, () => 0);
}

export const DEFAULT_SAVE: SaveData = {
  stars: blankStars(),
  music: 0.55,
  sfx: 0.8,
  reduced: false,
  taught: 0,
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
  const base: SaveData = { ...DEFAULT_SAVE, stars: blankStars(), reduced: prefersReducedMotion() };
  if (fresh) {
    storage()?.removeItem(KEY);
    return base;
  }
  const raw = storage()?.getItem(KEY);
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const stars = blankStars().map((zero, i) => {
      const n = parsed.stars?.[i] ?? zero;
      return n === 1 || n === 2 || n === 3 ? n : 0;
    });
    const taughtRaw = (parsed as { taught?: number }).taught;
    const taught = taughtRaw === 0 || taughtRaw === 1 || taughtRaw === 2 || taughtRaw === 3 || taughtRaw === 4
      ? taughtRaw
      : stars.some((n) => n > 0) ? 4 : 0;
    return {
      stars,
      music: clamp01(parsed.music ?? base.music),
      sfx: clamp01(parsed.sfx ?? base.sfx),
      reduced: typeof parsed.reduced === "boolean" ? parsed.reduced : base.reduced,
      taught,
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
  const nextStars = blankStars();
  data.stars.forEach((n, i) => {
    if (i < nextStars.length) nextStars[i] = n;
  });
  const next: SaveData = { ...data, stars: nextStars };
  if (world >= 0 && world < next.stars.length && stars > next.stars[world]) next.stars[world] = stars;
  writeSave(next);
  return next;
}
