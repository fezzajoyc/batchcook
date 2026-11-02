/**
 * Recipe-scaling pure logic — the whole-product core of Batchcook.
 *
 * Cooks think in fractions (½ cup), not decimals (0.5 cup), and count eggs
 * whole. These functions turn pasted recipe lines into rescaled lines with:
 * - fraction display via the nicest fraction within ±1/64 of the value,
 * - unicode fraction glyphs for the common cooking fractions,
 * - egg rounding to whole eggs with a note when rounding happened,
 * - baker's percentages (flour = 100 %) for bread baking.
 *
 * All functions are pure and Node-testable. Illegal input never throws:
 * parse failures return null / pass through unchanged; invalid numbers
 * propagate as NaN; invalid scale factors leave every line unchanged.
 */

/* ------------------------------------------------------------------ */
/* Fraction glyphs                                                     */
/* ------------------------------------------------------------------ */

/** Unicode glyph per reduced fraction "num/den" (cooking-common set). */
export const FRACTION_GLYPHS: Record<string, string> = {
  "1/8": "⅛",
  "1/6": "⅙",
  "1/4": "¼",
  "1/3": "⅓",
  "3/8": "⅜",
  "1/2": "½",
  "5/8": "⅝",
  "2/3": "⅔",
  "3/4": "¾",
  "5/6": "⅚",
  "7/8": "⅞",
};

/** Value of each single-char unicode fraction glyph (parsing input). */
const GLYPH_VALUES: Record<string, number> = {
  "½": 1 / 2,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "¼": 1 / 4,
  "¾": 3 / 4,
  "⅛": 1 / 8,
  "⅜": 3 / 8,
  "⅝": 5 / 8,
  "⅞": 7 / 8,
};

const GLYPH_CHARS = Object.keys(GLYPH_VALUES).join("");

/** Accept a fraction whose value is within ±1/64 of the target. */
const FRAC_TOL = 1 / 64;

function gcd(a: number, b: number): number {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

/** Cooking denominators that have unicode glyphs — tier-1 "nicest" candidates. */
const COOKING_DENS = [2, 3, 4, 6, 8];

/**
 * Nicest fraction for a decimal. Two tiers:
 * 1. common cooking denominators (2,3,4,6,8) accepted within ±1/64 — so
 *    0.51 reads ½, 0.333 reads ⅓, 0.13 reads ⅛ (kitchen-friendly rounding);
 * 2. otherwise the closest fraction with den ≤ maxDen, only when it is
 *    essentially exact (|err| ≤ 1e-9) — 0.1 → 1/10, 0.05 → 1/20;
 * 3. otherwise null (caller decides how to show it).
 * Integers (and values within tolerance of one) return den = 1.
 * Examples: 0.5 → 1/2 · 0.75 → 3/4 · 0.6667 → 2/3 · 1.5 → 3/2 (improper, reduced)
 */
export function toFraction(decimal: number, maxDen = 64): { num: number; den: number } | null {
  if (!Number.isFinite(decimal)) return null;
  const sign = decimal < 0 ? -1 : 1;
  const x = Math.abs(decimal);
  const whole = Math.floor(x);
  const frac = x - whole;

  // Within tolerance of an integer → den 1 (handles 3, 0, and 0.999…).
  if (frac < FRAC_TOL) return { num: sign * whole, den: 1 };
  if (frac > 1 - FRAC_TOL) return { num: sign * (whole + 1), den: 1 };

  const cap = Math.floor(maxDen);
  const compose = (den: number, num: number) => {
    const n = whole * den + num;
    const g = gcd(n, den) || 1;
    return { num: (sign * n) / g, den: den / g };
  };

  for (const den of COOKING_DENS) {
    if (den > cap) break;
    const num = Math.round(frac * den);
    if (Math.abs(frac - num / den) <= FRAC_TOL) return compose(den, num);
  }
  let best: { den: number; num: number; err: number } | null = null;
  for (let den = 2; den <= cap; den++) {
    const num = Math.round(frac * den);
    const err = Math.abs(frac - num / den);
    if (err === 0) return compose(den, num);
    if (!best || err < best.err) best = { den, num, err };
  }
  return best && best.err <= 1e-9 ? compose(best.den, best.num) : null;
}

/* ------------------------------------------------------------------ */
/* Amount formatting                                                   */
/* ------------------------------------------------------------------ */

/** Trim trailing zeros of a decimal string ("1.50" → "1.5", "2.00" → "2"). */
function trimZeros(s: string): string {
  return s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
}

/**
 * Human recipe amount: integers plain, common fractions as unicode glyphs
 * (mixed numbers like "1 ½"), other nice fractions as "n/d", anything else
 * as a ≤2-decimal number. Negative or non-finite input → "".
 */
export function formatScaledAmount(qty: number): string {
  if (!Number.isFinite(qty) || qty < 0) return "";
  const rounded = Math.round(qty);
  if (Math.abs(qty - rounded) < 1e-9) return String(rounded);
  const f = toFraction(qty);
  if (!f) return trimZeros(qty.toFixed(2));
  const whole = Math.floor(Math.abs(f.num) / f.den) * (f.num < 0 ? -1 : 1);
  const remNum = Math.abs(f.num) % f.den;
  if (whole === 0) {
    return FRACTION_GLYPHS[`${f.num}/${f.den}`] ?? `${f.num}/${f.den}`;
  }
  if (remNum === 0) return String(whole); // e.g. 2/2 reduced upstream, safety net
  const fracStr = FRACTION_GLYPHS[`${remNum}/${f.den}`] ?? `${remNum}/${f.den}`;
  return f.num < 0 ? `-${whole} ${fracStr}` : `${whole} ${fracStr}`;
}

/* ------------------------------------------------------------------ */
/* Recipe line parsing                                                 */
/* ------------------------------------------------------------------ */

/** Canonical unit → [singular display, plural display]. Abbreviations don't inflect. */
const UNIT_DISPLAY: Record<string, [string, string]> = {
  cup: ["cup", "cups"],
  tbsp: ["tbsp", "tbsp"],
  tsp: ["tsp", "tsp"],
  "fl-oz": ["fl oz", "fl oz"],
  ml: ["ml", "ml"],
  l: ["l", "l"],
  g: ["g", "g"],
  kg: ["kg", "kg"],
  oz: ["oz", "oz"],
  lb: ["lb", "lb"],
  quart: ["quart", "quarts"],
  pint: ["pint", "pints"],
  stick: ["stick", "sticks"],
  clove: ["clove", "cloves"],
  can: ["can", "cans"],
  pinch: ["pinch", "pinches"],
  egg: ["egg", "eggs"],
};

/** Spoken token (lowercased) → canonical unit. Unknown tokens are NOT units. */
const UNIT_ALIASES: Record<string, string> = {
  cup: "cup", cups: "cup",
  tbsp: "tbsp", tbsps: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  tsp: "tsp", tsps: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  ml: "ml", milliliter: "ml", milliliters: "ml", millilitre: "ml", millilitres: "ml",
  l: "l", liter: "l", liters: "l", litre: "l", litres: "l",
  g: "g", gs: "g", gram: "g", grams: "g", gramme: "g", grammes: "g",
  kg: "kg", kgs: "kg", kilogram: "kg", kilograms: "kg",
  oz: "oz", ozs: "oz", ounce: "oz", ounces: "oz",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  quart: "quart", quarts: "quart", qt: "quart", qts: "quart",
  pint: "pint", pints: "pint", pt: "pint", pts: "pint",
  stick: "stick", sticks: "stick",
  clove: "clove", cloves: "clove",
  can: "can", cans: "can",
  pinch: "pinch", pinches: "pinch",
  egg: "egg", eggs: "egg",
};

/** Singular display for a canonical unit at a given amount (0 or ≥ 2 → plural, ½-style keeps singular). */
export function displayUnit(unit: string, qty: number): string {
  const pair = UNIT_DISPLAY[unit];
  if (!pair) return unit;
  return qty > 1 || qty === 0 ? pair[1] : pair[0];
}

/**
 * The value `formatScaledAmount` will actually render: the snapped integer
 * when the amount is within tolerance of one, else the reduced fraction's
 * exact value, else the input. Unit pluralization must use this, or
 * 0.6667 × 1.5 → 1.00005 would print "1 cups".
 */
export function snapAmount(qty: number): number {
  if (!Number.isFinite(qty) || qty < 0) return qty;
  const rounded = Math.round(qty);
  if (Math.abs(qty - rounded) < 1e-9) return rounded;
  const f = toFraction(qty);
  return f ? f.num / f.den : qty;
}

/** Amount prefix patterns, tried in order (first match wins). */
const PREFIX_PATTERNS: Array<{ re: RegExp; kind: "whole-frac" | "whole-glyph" | "glyph" | "frac" | "plain" }> = [
  { re: /^(\d+)[\s\-]*(\d+)\s*\/\s*(\d+)/, kind: "whole-frac" }, // 1 1/2 · 2-1/2
  { re: new RegExp(`^(\\d+)\\s*([${GLYPH_CHARS}])`), kind: "whole-glyph" }, // 1½ · 1 ½
  { re: new RegExp(`^([${GLYPH_CHARS}])`), kind: "glyph" }, // ½
  { re: /^(\d+)\s*\/\s*(\d+)/, kind: "frac" }, // 1/4
  { re: /^(\d*\.\d+)/, kind: "plain" }, // 1.5 · 0.5 · .5
  { re: /^(\d+)/, kind: "plain" }, // 2 · 500 (safe: "." and "/" cases matched above)
];

function parseQtyPrefix(s: string): { qty: number; rest: string } | null {
  for (const { re, kind } of PREFIX_PATTERNS) {
    const m = re.exec(s);
    if (!m) continue;
    let qty: number;
    if (kind === "whole-frac") {
      qty = Number(m[1]) + Number(m[2]) / Number(m[3]);
    } else if (kind === "whole-glyph") {
      qty = Number(m[1]) + GLYPH_VALUES[m[2]];
    } else if (kind === "frac") {
      qty = Number(m[1]) / Number(m[2]);
    } else if (kind === "glyph") {
      qty = GLYPH_VALUES[m[1]];
    } else {
      qty = Number(m[1]);
    }
    if (!Number.isFinite(qty)) return null;
    return { qty, rest: s.slice(m[0].length) };
  }
  return null;
}

/**
 * Parse one recipe line: quantity (integer, decimal, 1/4-style or ½-style
 * fraction, mixed "1½"/"1 1/2") + optional known unit + ingredient text.
 * "2 cups flour" → {2, "cup", "flour"} · "1½ tsp salt" → {1.5, "tsp", "salt"}
 * "3 eggs" → {3, "egg", ""} · "500g chicken" → {500, "g", "chicken"}
 * Unknown words after the number ("2 carrots") stay in the ingredient.
 * No quantity ("Salt to taste") → null.
 */
export function parseRecipeLine(line: string): { qty: number; unit: string; ingredient: string } | null {
  if (typeof line !== "string") return null;
  const head = line.trim();
  if (!head) return null;
  const q = parseQtyPrefix(head);
  if (!q) return null;
  // A quantity range ("2-3 cloves", "2–3 cups") is not a single amount —
  // pass the line through unchanged instead of scaling half of it.
  if (/^[-–]\s*\d/.test(q.rest)) return null;

  let rest = q.rest.replace(/^[\s,]*/, "");
  let unit = "";
  let ingredient = "";

  // "fl oz" is the only two-word unit worth supporting.
  const flOz = /^(fl\.?\s*oz)\b/i.exec(rest);
  const token = flOz ? null : /^([A-Za-z]+)\.?/.exec(rest);
  const raw = flOz ? "fl oz" : token ? token[1] : "";
  if (raw) {
    const after = rest.slice((flOz ? flOz[0] : token![0]).length);
    // A unit must be followed by end/space — "2cups" ok, "2Dozen" of unknown word → ingredient.
    const known = raw.toLowerCase() === "fl oz" ? "fl-oz" : UNIT_ALIASES[raw.toLowerCase().replace(/\.$/, "")];
    if (known && (after === "" || /^\s/.test(after))) {
      unit = known;
      rest = after;
    }
  }
  ingredient = rest.trim().replace(/\s{2,}/g, " ");
  return { qty: q.qty, unit, ingredient };
}

/* ------------------------------------------------------------------ */
/* Recipe scaling                                                      */
/* ------------------------------------------------------------------ */

export type ScaledLine = {
  /** The input line, verbatim. */
  original: string;
  /** Parsed amount, or null when the line had no quantity. */
  qty: number | null;
  /** Canonical unit ("" when none or unknown-word). */
  unit: string;
  /** Ingredient text after the amount+unit. */
  ingredient: string;
  /** qty × factor, or null when unparsed. */
  scaledQty: number | null;
  /** The rescaled line as a cook reads it ("1 ½ cups flour"). */
  display: string;
  /** Non-null when the display needed a judgement call (egg rounding). */
  note: string | null;
};

/** Round to ≤3 decimals for notes ("1.5", "2.667"). */
function n3(x: number): string {
  return trimZeros(x.toFixed(3));
}

/**
 * Scale every line by `factor`. Lines without a quantity pass through
 * unchanged. Eggs (canonical unit "egg") are rounded to the nearest whole
 * egg — Math.round, so 0.5–1.4 → 1, 1.5–2.4 → 2 — with a note; a result
 * rounding to 0 gets an "omit or add to taste" note instead of a bare 0.
 * A non-finite or non-positive factor leaves all lines unchanged with no
 * notes — callers (engine, MCP tool) surface the error themselves.
 */
export function scaleRecipe(lines: string[], factor: number): ScaledLine[] {
  const usable = Number.isFinite(factor) && factor > 0;
  return lines.map((original) => {
    const parsed = parseRecipeLine(original);
    if (!parsed || !usable) {
      return { original, qty: parsed?.qty ?? null, unit: parsed?.unit ?? "", ingredient: parsed?.ingredient ?? "", scaledQty: null, display: original, note: null };
    }
    const scaledQty = parsed.qty * factor;
    if (parsed.unit === "egg") {
      const whole = Math.round(scaledQty);
      let note: string | null = null;
      let shown = whole;
      if (whole === 0 && scaledQty > 0) {
        note = `${n3(scaledQty)} eggs rounds to 0 — omit, or add one if the mix looks dry`;
        shown = 0;
      } else if (Math.abs(scaledQty - whole) > 1e-9) {
        note = `${n3(scaledQty)} eggs → rounded to ${whole} (eggs are counted whole)`;
      }
      const display = `${shown} ${displayUnit("egg", shown)}`;
      return { original, qty: parsed.qty, unit: parsed.unit, ingredient: parsed.ingredient, scaledQty, display, note };
    }
    const unitStr = parsed.unit ? ` ${displayUnit(parsed.unit, snapAmount(scaledQty))}` : "";
    const ingStr = parsed.ingredient ? ` ${parsed.ingredient}` : "";
    return {
      original,
      qty: parsed.qty,
      unit: parsed.unit,
      ingredient: parsed.ingredient,
      scaledQty,
      display: `${formatScaledAmount(scaledQty)}${unitStr}${ingStr}`,
      note: null,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Baker's percentages                                                 */
/* ------------------------------------------------------------------ */

export type BakerItem = { name: string; pct: number; grams: number };
export type BakerResult = { flourG: number; items: BakerItem[]; totalG: number };

/**
 * Baker's math: flour is 100 %, every other ingredient is expressed as a
 * percentage of the flour WEIGHT. grams = flourG × pct / 100.
 * Invalid flourG (non-finite, ≤ 0) or invalid pct → NaN grams, NaN total.
 */
export function bakerPercentages(flourG: number, items: Array<{ name: string; pct: number }>): BakerResult {
  const scaled = items.map((it) => ({
    name: it.name,
    pct: it.pct,
    grams: (Number.isFinite(flourG) && flourG > 0 && Number.isFinite(it.pct) && it.pct >= 0)
      ? (flourG * it.pct) / 100
      : NaN,
  }));
  const totalG = scaled.reduce((acc, it) => acc + it.grams, Number.isFinite(flourG) && flourG > 0 ? flourG : NaN);
  return { flourG, items: scaled, totalG };
}

/* ------------------------------------------------------------------ */
/* Servings                                                            */
/* ------------------------------------------------------------------ */

/**
 * Scale factor to go from a recipe that serves `servesN` to one that
 * serves `servesM`: factor = M / N. Non-finite or non-positive input → NaN.
 */
export function servingFactor(servesN: number, servesM: number): number {
  if (!Number.isFinite(servesN) || !Number.isFinite(servesM) || servesN <= 0 || servesM <= 0) return NaN;
  return servesM / servesN;
}

/** Quick-pick scale factors for the UI (label ×, value). */
export const SCALE_PRESETS: Array<{ label: string; value: number }> = [
  { label: "½×", value: 0.5 },
  { label: "⅔×", value: 2 / 3 },
  { label: "1×", value: 1 },
  { label: "1½×", value: 1.5 },
  { label: "2×", value: 2 },
  { label: "2½×", value: 2.5 },
  { label: "3×", value: 3 },
];
