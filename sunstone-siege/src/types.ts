/** Shared literals for Sunstone Siege. Combat numbers live in balance.ts. */

export type TowerKind = "dart" | "lens" | "drum" | "spire";
export type EnemyKind = "skitter" | "runner" | "shield" | "jaguar" | "golem" | "shard" | "glider" | "boss";
export type Biome = "valley" | "ruins" | "crater";
export type Phase = "build" | "wave" | "victory" | "defeat";
export type RelicId = "keen" | "kindling" | "war" | "leap" | "rite" | "ward" | "heart" | "focus";

export interface Vec {
  x: number;
  y: number;
}

export const TOWER_KINDS: readonly TowerKind[] = ["dart", "lens", "drum", "spire"];

export interface SpawnGroup {
  kind: EnemyKind;
  count: number;
  /** Seconds between units in this group. */
  interval: number;
  path: number;
  /** Seconds after the previous group before this one starts. */
  gap: number;
}

export interface WaveDef {
  bonus: number;
  groups: readonly SpawnGroup[];
}
