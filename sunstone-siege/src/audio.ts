/**
 * Original audio, synthesized in the browser. No samples are loaded from disk.
 * Howler plays the wav blobs: one sprite sheet for effects, one loop per valley.
 */
import { Howl, Howler } from "howler";
import type { Biome } from "./types";

const RATE = 22050;

export type SfxName =
  | "click"
  | "deny"
  | "place"
  | "sell"
  | "dart"
  | "beam"
  | "drum"
  | "chain"
  | "death"
  | "horn"
  | "crack"
  | "flare"
  | "jade"
  | "victory"
  | "defeat";

const NAMES: SfxName[] = [
  "click", "deny", "place", "sell", "dart", "beam", "drum", "chain",
  "death", "horn", "crack", "flare", "jade", "victory", "defeat",
];

function wavUrl(samples: Float32Array): string {
  const n = samples.length;
  const buffer = new ArrayBuffer(44 + n * 2);
  const view = new DataView(buffer);
  const str = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  str(0, "RIFF");
  view.setUint32(4, 36 + n * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, RATE, true);
  view.setUint32(28, RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, n * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, (s < 0 ? s * 0x8000 : s * 0x7fff) | 0, true);
    o += 2;
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function env(i: number, n: number, attack: number, release: number): number {
  const a = Math.max(1, attack);
  const r = Math.max(1, release);
  const up = Math.min(1, i / a);
  const down = Math.min(1, (n - i) / r);
  return up * down;
}

function tone(buf: Float32Array, start: number, freq: number, dur: number, amp: number, harm: number): void {
  const n = Math.floor(dur * RATE);
  const a0 = Math.floor(start * RATE);
  for (let i = 0; i < n && a0 + i < buf.length; i++) {
    const t = i / RATE;
    const s = Math.sin(2 * Math.PI * freq * t) + harm * Math.sin(4 * Math.PI * freq * t);
    buf[a0 + i] += s * env(i, n, RATE * 0.02, RATE * 0.08) * amp;
  }
}

function noise(buf: Float32Array, start: number, dur: number, amp: number, decay: number): void {
  const n = Math.floor(dur * RATE);
  const a0 = Math.floor(start * RATE);
  let hold = 0;
  for (let i = 0; i < n && a0 + i < buf.length; i++) {
    hold = hold * 0.82 + (Math.random() * 2 - 1) * 0.18;
    const k = Math.exp((-i / RATE) * decay);
    buf[a0 + i] += hold * k * amp;
  }
}

function kick(buf: Float32Array, start: number, amp: number): void {
  const n = Math.floor(0.18 * RATE);
  const a0 = Math.floor(start * RATE);
  let phase = 0;
  for (let i = 0; i < n && a0 + i < buf.length; i++) {
    const t = i / RATE;
    const f = 150 * Math.exp(-t * 22) + 46;
    phase += (2 * Math.PI * f) / RATE;
    buf[a0 + i] += Math.sin(phase) * Math.exp(-t * 10) * amp;
  }
}

function synthSfx(): { url: string; sprite: Record<SfxName, [number, number]> } {
  const gap = 0.06;
  const plan: { name: SfxName; dur: number; draw: (b: Float32Array, t: number) => void }[] = [
    { name: "click", dur: 0.07, draw: (b, t) => tone(b, t, 740, 0.06, 0.35, 0.2) },
    { name: "deny", dur: 0.12, draw: (b, t) => tone(b, t, 180, 0.11, 0.3, 0) },
    { name: "place", dur: 0.16, draw: (b, t) => { noise(b, t, 0.08, 0.45, 28); tone(b, t, 220, 0.14, 0.28, 0.4); } },
    { name: "sell", dur: 0.14, draw: (b, t) => { tone(b, t, 520, 0.08, 0.22, 0.3); tone(b, t + 0.05, 390, 0.08, 0.18, 0); } },
    { name: "dart", dur: 0.07, draw: (b, t) => { noise(b, t, 0.04, 0.35, 60); tone(b, t, 980, 0.05, 0.16, 0.5); } },
    { name: "beam", dur: 0.1, draw: (b, t) => tone(b, t, 640, 0.09, 0.16, 0.8) },
    { name: "drum", dur: 0.24, draw: (b, t) => { kick(b, t, 0.7); noise(b, t, 0.16, 0.35, 12); } },
    { name: "chain", dur: 0.18, draw: (b, t) => { tone(b, t, 880, 0.06, 0.2, 0.4); tone(b, t + 0.05, 1180, 0.06, 0.16, 0.3); tone(b, t + 0.1, 1460, 0.06, 0.12, 0.2); } },
    { name: "death", dur: 0.16, draw: (b, t) => { noise(b, t, 0.12, 0.4, 16); tone(b, t, 240, 0.12, 0.2, 0); } },
    { name: "horn", dur: 0.42, draw: (b, t) => { tone(b, t, 392, 0.38, 0.28, 0.15); tone(b, t, 588, 0.38, 0.16, 0); } },
    { name: "crack", dur: 0.3, draw: (b, t) => { noise(b, t, 0.22, 0.55, 8); tone(b, t, 90, 0.28, 0.4, 0); } },
    { name: "flare", dur: 0.5, draw: (b, t) => { noise(b, t, 0.35, 0.4, 6); tone(b, t, 523, 0.4, 0.22, 0.4); tone(b, t, 784, 0.4, 0.16, 0.2); tone(b, t + 0.08, 1046, 0.3, 0.12, 0); } },
    { name: "jade", dur: 0.12, draw: (b, t) => { tone(b, t, 880, 0.08, 0.18, 0.2); tone(b, t + 0.04, 1320, 0.07, 0.12, 0); } },
    { name: "victory", dur: 0.7, draw: (b, t) => { [523, 659, 784, 1046].forEach((f, i) => tone(b, t + i * 0.12, f, 0.22, 0.24, 0.25)); } },
    { name: "defeat", dur: 0.6, draw: (b, t) => { [392, 349, 311, 262].forEach((f, i) => tone(b, t + i * 0.12, f, 0.2, 0.24, 0.1)); } },
  ];
  let total = 0;
  for (const p of plan) total += p.dur + gap;
  const buf = new Float32Array(Math.floor(total * RATE) + 8);
  const sprite = {} as Record<SfxName, [number, number]>;
  let t = 0;
  for (const p of plan) {
    p.draw(buf, t);
    sprite[p.name] = [Math.floor(t * 1000), Math.floor(p.dur * 1000)];
    t += p.dur + gap;
  }
  return { url: wavUrl(buf), sprite };
}

function music(biome: Biome): string {
  const bpm = biome === "crater" ? 112 : biome === "ruins" ? 84 : 96;
  const root = biome === "crater" ? 196 : biome === "ruins" ? 174.61 : 220;
  const scale = [0, 3, 5, 7, 10].map((st) => root * Math.pow(2, st / 12));
  const beats = 16;
  const dur = (beats * 60) / bpm;
  const buf = new Float32Array(Math.floor(dur * RATE));
  const beat = 60 / bpm;
  const melody = biome === "crater" ? [4, 3, 2, 4, 1, 0, 2, 3] : biome === "ruins" ? [0, 2, 1, 4, 2, 0, 3, 1] : [0, 2, 4, 2, 3, 1, 0, 2];
  for (let i = 0; i < beats; i++) {
    const t = i * beat;
    if (i % 2 === 0) kick(buf, t, biome === "crater" ? 0.55 : 0.42);
    if (i % 2 === 1) noise(buf, t, 0.04, 0.12, 40);
    const bass = scale[melody[i % melody.length] % 3] / 2;
    tone(buf, t, bass, beat * 0.9, 0.16, 0.05);
    if (i % 2 === 0) {
      const note = scale[melody[(i / 2) % melody.length]];
      tone(buf, t, note, beat * 1.4, 0.11, 0.35);
      tone(buf, t, note * 2, beat * 1.1, 0.04, 0);
    }
  }
  // A short fade at both ends so the loop does not click.
  const fade = Math.floor(0.04 * RATE);
  for (let i = 0; i < fade; i++) {
    const k = i / fade;
    buf[i] *= k;
    buf[buf.length - 1 - i] *= k;
  }
  return wavUrl(buf);
}

export class AudioBus {
  private sfx?: Howl;
  private loops = new Map<Biome, Howl>();
  private current?: Howl;
  private ready = false;
  musicVol = 0.55;
  sfxVol = 0.8;
  private last: Partial<Record<SfxName, number>> = {};
  unlocked = false;

  warm(): void {
    if (this.ready) return;
    const built = synthSfx();
    this.sfx = new Howl({ src: [built.url], sprite: built.sprite, volume: this.sfxVol });
    this.ready = true;
    for (const name of NAMES) if (!built.sprite[name]) throw new Error(`missing sfx ${name}`);
  }

  unlock(): void {
    this.warm();
    this.unlocked = true;
    const ctx = Howler.ctx;
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  play(name: SfxName): void {
    if (!this.unlocked || this.sfxVol <= 0.001) return;
    this.warm();
    const now = performance.now();
    const gap = name === "dart" || name === "beam" || name === "jade" || name === "death" ? 55 : 0;
    if (now - (this.last[name] ?? 0) < gap) return;
    this.last[name] = now;
    const id = this.sfx?.play(name);
    if (id !== undefined && (name === "dart" || name === "beam")) this.sfx?.rate(0.92 + Math.random() * 0.16, id);
  }

  setMusic(v: number): void {
    this.musicVol = v;
    this.current?.volume(v);
  }

  setSfx(v: number): void {
    this.sfxVol = v;
    this.sfx?.volume(v);
  }

  loop(biome: Biome): void {
    if (!this.unlocked) return;
    this.warm();
    let howl = this.loops.get(biome);
    if (!howl) {
      howl = new Howl({ src: [music(biome)], loop: true, volume: 0 });
      this.loops.set(biome, howl);
    }
    if (this.current === howl) {
      howl.volume(this.musicVol);
      return;
    }
    const prev = this.current;
    this.current = howl;
    if (!howl.playing()) howl.play();
    howl.fade(0, this.musicVol, 400);
    if (prev) prev.fade(this.musicVol, 0, 350);
  }

  duck(down: boolean): void {
    this.current?.volume(down ? this.musicVol * 0.45 : this.musicVol);
  }
}
