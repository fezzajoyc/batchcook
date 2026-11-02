import { z } from "zod";
import { bakerPercentages, formatScaledAmount, scaleRecipe, servingFactor, toFraction } from "../tools/_lib/recipe";

/**
 * MCP 工具注册表:把 tools/_lib 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式),这里跑同一份经过测试的实现——
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "scale_recipe",
    title: "Scale a recipe",
    description:
      "Scale a whole recipe by a factor. Paste ingredient lines exactly as written — '2 cups flour', '1½ tsp salt', '1/4 cup sugar', '3 eggs', '500g chicken' — and every line is rescaled with kitchen fractions (½ cup, not 0.5). Eggs round to whole eggs with a note; lines without an amount pass through unchanged.",
    schema: {
      recipe: z.string().describe("recipe ingredients, one ingredient per line"),
      factor: z.number().positive().describe("scale factor: 0.5 = half, 2 = double"),
    },
    run: (a) => {
      const lines = String(a.recipe).split(/\r?\n/);
      const scaled = scaleRecipe(lines, a.factor);
      const parsed = scaled.filter((l) => l.scaledQty !== null);
      if (parsed.length === 0) {
        return {
          content: [{ type: "text", text: "no ingredient lines with a parseable amount — write amounts like '2 cups flour', '1½ tsp salt', '3 eggs', '500g chicken'" }],
          isError: true,
        };
      }
      return json({
        factor: a.factor,
        lines: scaled.map((l) => ({
          display: l.display,
          ...(l.note ? { note: l.note } : {}),
        })),
      });
    },
  },
  {
    name: "to_fraction",
    title: "Decimal to cooking fraction",
    description:
      "Convert a decimal amount to the nicest cooking fraction within ±1/64 — 0.5 → 1/2, 0.333 → 1/3, 1.5 → 3/2. Integers return den 1. Returns null when nothing nice exists within max_den.",
    schema: {
      value: z.number().finite(),
      max_den: z.number().int().min(2).max(128).default(64).describe("largest denominator allowed (default 64)"),
    },
    run: (a) => {
      const f = toFraction(a.value, a.max_den ?? 64);
      if (!f) {
        return { content: [{ type: "text", text: `no nice fraction for ${a.value} within ±1/64 at max_den ${a.max_den ?? 64}` }], isError: true };
      }
      return text(`${f.num}/${f.den} — as a recipe amount: ${formatScaledAmount(a.value)}`);
    },
  },
  {
    name: "baker_percentages",
    title: "Baker's percentages to grams",
    description:
      "Baker's math: flour is 100%, every other ingredient is a percentage of the FLOUR WEIGHT. Given flour grams and items with percentages, returns each ingredient's grams and the total dough weight. Example: 500 g flour, water 65% → 325 g, salt 2% → 10 g.",
    schema: {
      flour_g: z.number().positive().describe("flour weight in grams — the 100% reference"),
      items: z
        .array(z.object({ name: z.string(), pct: z.number().min(0).describe("percentage of flour weight, not of total") }))
        .describe("e.g. [{name:'water',pct:65},{name:'salt',pct:2},{name:'instant yeast',pct:1}]"),
    },
    run: (a) => {
      const r = bakerPercentages(a.flour_g, a.items);
      return json({
        flour_g: r.flourG,
        items: r.items.map((it) => ({ name: it.name, pct: it.pct, grams: it.grams })),
        total_dough_g: r.totalG,
      });
    },
  },
  {
    name: "serving_factor",
    title: "Serving scale factor",
    description:
      "Scale factor to resize a recipe between serving counts: target ÷ original. Recipe serves 4, you need 6 → 1.5×. Pair with scale_recipe to apply it to ingredient lines.",
    schema: {
      serves_original: z.number().positive(),
      serves_target: z.number().positive(),
    },
    run: (a) => {
      const f = servingFactor(a.serves_original, a.serves_target);
      if (!Number.isFinite(f)) {
        return { content: [{ type: "text", text: "serving counts must be greater than 0" }], isError: true };
      }
      return text(`×${Math.round(f * 1000) / 1000} — multiply every ingredient amount by this`);
    },
  },
];
