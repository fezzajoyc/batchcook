import { describe, expect, it } from "vitest";
import {
  FRACTION_GLYPHS,
  SCALE_PRESETS,
  bakerPercentages,
  formatScaledAmount,
  parseRecipeLine,
  scaleRecipe,
  servingFactor,
  toFraction,
} from "@/tools/_lib/recipe";

describe("toFraction — nicest fraction within ±1/64", () => {
  it("matches the common cooking fractions exactly", () => {
    expect(toFraction(0.5)).toEqual({ num: 1, den: 2 });
    expect(toFraction(0.75)).toEqual({ num: 3, den: 4 });
    expect(toFraction(0.25)).toEqual({ num: 1, den: 4 });
    expect(toFraction(0.125)).toEqual({ num: 1, den: 8 });
    expect(toFraction(0.375)).toEqual({ num: 3, den: 8 });
    expect(toFraction(0.875)).toEqual({ num: 7, den: 8 });
  });

  it("snaps repeating decimals to ⅓ and ⅔ within tolerance", () => {
    expect(toFraction(0.333)).toEqual({ num: 1, den: 3 });
    expect(toFraction(0.6667)).toEqual({ num: 2, den: 3 });
    // just outside any nicer fraction still reduces cleanly
    expect(toFraction(1 / 3)).toEqual({ num: 1, den: 3 });
  });

  it("returns improper reduced fractions for values > 1", () => {
    expect(toFraction(1.5)).toEqual({ num: 3, den: 2 });
    expect(toFraction(2.25)).toEqual({ num: 9, den: 4 });
    expect(toFraction(4.5)).toEqual({ num: 9, den: 2 });
  });

  it("handles integers and near-integers", () => {
    expect(toFraction(0)).toEqual({ num: 0, den: 1 });
    expect(toFraction(2)).toEqual({ num: 2, den: 1 });
    expect(toFraction(0.999)).toEqual({ num: 1, den: 1 });
    expect(toFraction(1.00005)).toEqual({ num: 1, den: 1 });
  });

  it("returns 1/10 for 0.1 (exact, within maxDen) and null when maxDen is too small", () => {
    expect(toFraction(0.1)).toEqual({ num: 1, den: 10 });
    expect(toFraction(0.1, 8)).toBeNull();
  });

  it("keeps the sign on negative input and rejects non-finite values", () => {
    expect(toFraction(-0.5)).toEqual({ num: -1, den: 2 });
    expect(toFraction(-1.75)).toEqual({ num: -7, den: 4 });
    expect(toFraction(NaN)).toBeNull();
    expect(toFraction(Infinity)).toBeNull();
  });
});

describe("FRACTION_GLYPHS", () => {
  it("maps the cooking fractions to unicode glyphs", () => {
    expect(FRACTION_GLYPHS["1/2"]).toBe("½");
    expect(FRACTION_GLYPHS["1/4"]).toBe("¼");
    expect(FRACTION_GLYPHS["3/4"]).toBe("¾");
    expect(FRACTION_GLYPHS["1/3"]).toBe("⅓");
    expect(FRACTION_GLYPHS["2/3"]).toBe("⅔");
    expect(FRACTION_GLYPHS["1/8"]).toBe("⅛");
    expect(FRACTION_GLYPHS["7/8"]).toBe("⅞");
  });
});

describe("parseRecipeLine", () => {
  it("parses plain numbers with units", () => {
    expect(parseRecipeLine("2 cups flour")).toEqual({ qty: 2, unit: "cup", ingredient: "flour" });
    expect(parseRecipeLine("0.5 tsp vanilla")).toEqual({ qty: 0.5, unit: "tsp", ingredient: "vanilla" });
    expect(parseRecipeLine("500g chicken")).toEqual({ qty: 500, unit: "g", ingredient: "chicken" });
    expect(parseRecipeLine("500 g chicken")).toEqual({ qty: 500, unit: "g", ingredient: "chicken" });
    expect(parseRecipeLine("1.5 tbsp olive oil")).toEqual({ qty: 1.5, unit: "tbsp", ingredient: "olive oil" });
    expect(parseRecipeLine("1 lb butter")).toEqual({ qty: 1, unit: "lb", ingredient: "butter" });
    expect(parseRecipeLine("1kg flour")).toEqual({ qty: 1, unit: "kg", ingredient: "flour" });
    expect(parseRecipeLine("2 fl oz cream")).toEqual({ qty: 2, unit: "fl-oz", ingredient: "cream" });
  });

  it("parses slash fractions and unicode glyph fractions", () => {
    expect(parseRecipeLine("1/4 cup sugar")).toEqual({ qty: 0.25, unit: "cup", ingredient: "sugar" });
    expect(parseRecipeLine("3/4 cup oats")).toEqual({ qty: 0.75, unit: "cup", ingredient: "oats" });
    expect(parseRecipeLine("½ cup milk")).toEqual({ qty: 0.5, unit: "cup", ingredient: "milk" });
    expect(parseRecipeLine("¾ tsp pepper")).toEqual({ qty: 0.75, unit: "tsp", ingredient: "pepper" });
  });

  it("parses mixed numbers like 1½ and 1 1/2", () => {
    expect(parseRecipeLine("1½ tsp salt")).toEqual({ qty: 1.5, unit: "tsp", ingredient: "salt" });
    expect(parseRecipeLine("1 1/2 cups oats")).toEqual({ qty: 1.5, unit: "cup", ingredient: "oats" });
    expect(parseRecipeLine("2-1/2 cups flour")).toEqual({ qty: 2.5, unit: "cup", ingredient: "flour" });
  });

  it("treats eggs as the egg unit with no leftover ingredient", () => {
    expect(parseRecipeLine("3 eggs")).toEqual({ qty: 3, unit: "egg", ingredient: "" });
    expect(parseRecipeLine("1 egg")).toEqual({ qty: 1, unit: "egg", ingredient: "" });
  });

  it("keeps unknown words after the number in the ingredient", () => {
    expect(parseRecipeLine("2 carrots")).toEqual({ qty: 2, unit: "", ingredient: "carrots" });
    expect(parseRecipeLine("3 chicken breasts")).toEqual({ qty: 3, unit: "", ingredient: "chicken breasts" });
    expect(parseRecipeLine("2")).toEqual({ qty: 2, unit: "", ingredient: "" });
  });

  it("returns null for lines without a parseable amount", () => {
    expect(parseRecipeLine("Salt to taste")).toBeNull();
    expect(parseRecipeLine("flour")).toBeNull();
    expect(parseRecipeLine("")).toBeNull();
    expect(parseRecipeLine("   ")).toBeNull();
    // quantity ranges are not a single amount
    expect(parseRecipeLine("2-3 cloves garlic")).toBeNull();
    expect(parseRecipeLine("2–3 cups spinach")).toBeNull();
  });
});

describe("scaleRecipe", () => {
  it("scales amounts and renders fractions the way cooks read them", () => {
    expect(scaleRecipe(["2 cups flour"], 1.5)[0].display).toBe("3 cups flour");
    expect(scaleRecipe(["1.5 tsp salt"], 2)[0].display).toBe("3 tsp salt");
    expect(scaleRecipe(["½ cup milk"], 2)[0].display).toBe("1 cup milk");
    expect(scaleRecipe(["1/4 cup olive oil"], 3)[0].display).toBe("¾ cup olive oil");
    expect(scaleRecipe(["0.5 tsp vanilla"], 3)[0].display).toBe("1 ½ tsp vanilla");
    expect(scaleRecipe(["500g chicken"], 2)[0].display).toBe("1000 g chicken");
  });

  it("keeps unit singular/plural natural", () => {
    expect(scaleRecipe(["3 cups flour"], 1 / 3)[0].display).toBe("1 cup flour");
    expect(scaleRecipe(["1 cup flour"], 2)[0].display).toBe("2 cups flour");
    expect(scaleRecipe(["2 tsp salt"], 0.5)[0].display).toBe("1 tsp salt");
  });

  it("rounds eggs to whole eggs with a note (0.5–1.4 → 1, 1.5–2.4 → 2)", () => {
    const half = scaleRecipe(["3 eggs"], 0.5)[0];
    expect(half.display).toBe("2 eggs");
    expect(half.note).toBeTruthy();
    expect(half.note).toContain("1.5");
    expect(half.note).toContain("2");

    const few = scaleRecipe(["2 eggs"], 0.6)[0]; // 1.2 eggs
    expect(few.display).toBe("1 egg");
    expect(few.note).toBeTruthy();

    const quarter = scaleRecipe(["2 eggs"], 0.25)[0]; // 0.5 eggs
    expect(quarter.display).toBe("1 egg");
    expect(quarter.note).toBeTruthy();

    const exact = scaleRecipe(["6 eggs"], 2)[0]; // 12 eggs, no rounding
    expect(exact.display).toBe("12 eggs");
    expect(exact.note).toBeNull();
  });

  it("flags an egg amount that rounds to zero instead of printing a bare 0", () => {
    const r = scaleRecipe(["1 egg"], 0.1)[0]; // 0.1 eggs
    expect(r.display).toBe("0 eggs");
    expect(r.note).toContain("omit");
  });

  it("passes lines without a quantity through untouched", () => {
    const [line] = scaleRecipe(["Salt to taste"], 3);
    expect(line.display).toBe("Salt to taste");
    expect(line.qty).toBeNull();
    expect(line.scaledQty).toBeNull();
  });

  it("scales to ⅓-style mixed numbers for awkward factors", () => {
    expect(scaleRecipe(["2 cups flour"], 2 / 3)[0].display).toBe("1 ⅓ cups flour");
    expect(scaleRecipe(["0.6667 cup water"], 1.5)[0].display).toBe("1 cup water");
    expect(scaleRecipe(["2.25 cups flour"], 2)[0].display).toBe("4 ½ cups flour");
  });

  it("leaves every line unchanged for an invalid factor", () => {
    const lines = ["2 cups flour", "3 eggs"];
    for (const bad of [0, -1, NaN, Infinity]) {
      const out = scaleRecipe(lines, bad);
      expect(out.map((l) => l.display)).toEqual(lines);
    }
  });

  it("preserves blank lines and line count", () => {
    const out = scaleRecipe(["2 cups flour", "", "3 eggs"], 2);
    expect(out.length).toBe(3);
    expect(out[1].display).toBe("");
    expect(out[2].display).toBe("6 eggs");
  });
});

describe("formatScaledAmount", () => {
  it("renders integers plainly", () => {
    expect(formatScaledAmount(3)).toBe("3");
    expect(formatScaledAmount(0)).toBe("0");
    expect(formatScaledAmount(1000)).toBe("1000");
  });

  it("renders fractions as glyphs and mixed numbers", () => {
    expect(formatScaledAmount(0.5)).toBe("½");
    expect(formatScaledAmount(0.75)).toBe("¾");
    expect(formatScaledAmount(1.5)).toBe("1 ½");
    expect(formatScaledAmount(2.25)).toBe("2 ¼");
    expect(formatScaledAmount(1.3333)).toBe("1 ⅓");
    expect(formatScaledAmount(0.33)).toBe("⅓");
  });

  it("falls back to a plain fraction or decimal when no glyph exists", () => {
    expect(formatScaledAmount(0.1)).toBe("1/10");
    expect(formatScaledAmount(1.1)).toBe("1 1/10");
    expect(formatScaledAmount(0.05)).toBe("1/20"); // exact small fraction via the precise tier
  });

  it("returns an empty string for negative or non-finite input", () => {
    expect(formatScaledAmount(-1)).toBe("");
    expect(formatScaledAmount(NaN)).toBe("");
    expect(formatScaledAmount(Infinity)).toBe("");
  });
});

describe("bakerPercentages", () => {
  it("computes ingredient grams as a percentage of flour weight", () => {
    const r = bakerPercentages(500, [
      { name: "salt", pct: 2 },
      { name: "water", pct: 65 },
    ]);
    expect(r.items[0].grams).toBe(10);
    expect(r.items[1].grams).toBe(325);
    expect(r.totalG).toBe(835); // 500 + 10 + 325
    expect(r.flourG).toBe(500);
  });

  it("handles zero-percent items and empty lists", () => {
    const r = bakerPercentages(1000, [{ name: "oil", pct: 0 }]);
    expect(r.items[0].grams).toBe(0);
    expect(r.totalG).toBe(1000);
    expect(bakerPercentages(750, []).totalG).toBe(750);
  });

  it("propagates NaN for invalid flour weight or negative percentages", () => {
    expect(bakerPercentages(0, [{ name: "water", pct: 60 }]).items[0].grams).toBeNaN();
    expect(bakerPercentages(-5, [{ name: "water", pct: 60 }]).totalG).toBeNaN();
    expect(bakerPercentages(500, [{ name: "water", pct: -1 }]).items[0].grams).toBeNaN();
  });
});

describe("servingFactor", () => {
  it("divides target servings by original servings", () => {
    expect(servingFactor(4, 6)).toBe(1.5);
    expect(servingFactor(2, 4)).toBe(2);
    expect(servingFactor(6, 4)).toBeCloseTo(2 / 3, 12);
    expect(servingFactor(1, 1)).toBe(1);
  });

  it("returns NaN for non-positive or non-finite servings", () => {
    expect(servingFactor(0, 6)).toBeNaN();
    expect(servingFactor(4, 0)).toBeNaN();
    expect(servingFactor(-2, 4)).toBeNaN();
    expect(servingFactor(NaN, 4)).toBeNaN();
    expect(servingFactor(4, Infinity)).toBeNaN();
  });
});

describe("SCALE_PRESETS", () => {
  it("offers the standard cooking factors in ascending order", () => {
    expect(SCALE_PRESETS.map((p) => p.value)).toEqual([0.5, 2 / 3, 1, 1.5, 2, 2.5, 3]);
  });
});

describe("unicode and CJK input", () => {
  it("parses full-width digits-free CJK ingredient names and keeps them intact", () => {
    expect(parseRecipeLine("200g 面粉")).toEqual({ qty: 200, unit: "g", ingredient: "面粉" });
    expect(parseRecipeLine("大さじ2 of miso")).toEqual(null); // amount after word is not supported
    expect(parseRecipeLine("2 大さじ miso")).toEqual({ qty: 2, unit: "", ingredient: "大さじ miso" });
    expect(scaleRecipe(["200g 面粉"], 1.5)[0].display).toBe("300 g 面粉");
  });
});
