/**
 * Jade the guardian is carrying, drawn as a short brick heap above his head.
 * Four courses, then a count badge. The heap stays about as wide as the
 * guardian and shorter than he is tall.
 */

/** Bottom course first. Odd courses are a half-step brick offset. */
const ROW_SLOTS = [4, 3, 4, 3];

export const CARRY_CAP = ROW_SLOTS.reduce((sum, n) => sum + n, 0);

/**
 * Center spacing. The guardian's body is about 22px wide, so four overlapping
 * gems land a little wider than he is and four courses stay shorter than he is.
 */
const PITCH_X = 6.5;
const PITCH_Y = 5;

/**
 * Bottom-course center above the guardian's feet. His head tops out near 41px,
 * so the lowest gems rest on the crown.
 */
const BASE_Y = -46;

/** Jade texture is 128px. This lands near a 17px gem. */
export const CARRY_SCALE = 0.09;

export interface CarrySlot {
  /** Hero-local, +x right, +y down. */
  x: number;
  y: number;
  row: number;
}

/** Visible gems for a carried total, filled from the bottom course. */
export function carrySlots(total: number): CarrySlot[] {
  const n = Math.max(0, Math.min(CARRY_CAP, Math.floor(total)));
  const out: CarrySlot[] = [];
  let left = n;
  for (let row = 0; row < ROW_SLOTS.length && left > 0; row++) {
    const take = Math.min(ROW_SLOTS[row], left);
    left -= take;
    for (let i = 0; i < take; i++) {
      out.push({
        x: (i - (take - 1) / 2) * PITCH_X,
        y: BASE_Y - row * PITCH_Y,
        row,
      });
    }
  }
  return out;
}

/** The gem that just left the top of the heap, before the total dropped. */
export function carryLaunch(totalBefore: number): CarrySlot {
  const shown = Math.max(1, Math.min(CARRY_CAP, Math.floor(totalBefore)));
  const slots = carrySlots(shown);
  return slots[slots.length - 1];
}
