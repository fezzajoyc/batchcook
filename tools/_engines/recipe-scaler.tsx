"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import {
  SCALE_PRESETS,
  scaleRecipe,
  type ScaledLine,
} from "../_lib/recipe";
import { parseLocaleNumber } from "../_lib/numparse";

/** 5-locale label pick: engines carry their own copy (site standard §1.5). */
export function pick(locale: string, rec: Record<string, string>): string {
  return rec[locale] ?? rec.en;
}

const L = {
  recipe: {
    en: "Recipe lines", zh: "配方行", ja: "レシピの行", es: "Líneas de la receta", pt: "Linhas da receita",
  },
  recipeHint: {
    en: "One ingredient per line. Write amounts the way you read them: 2 cups flour, 1½ tsp salt, 1/4 cup sugar, 3 eggs, 500g chicken.",
    zh: "每行一种食材。数量按你平时的写法:2 cups flour、1½ tsp salt、1/4 cup sugar、3 eggs、500g chicken。",
    ja: "1 行に 1 つの材料。分量はいつも通り:2 cups flour、1½ tsp salt、1/4 cup sugar、3 eggs、500g chicken。",
    es: "Un ingrediente por línea. Escribe las cantidades como las lees: 2 cups flour, 1½ tsp salt, 1/4 cup sugar, 3 eggs, 500g chicken.",
    pt: "Um ingrediente por linha. Escreva as quantidades como você lê: 2 cups flour, 1½ tsp salt, 1/4 cup sugar, 3 eggs, 500g chicken.",
  },
  factor: {
    en: "Scale factor", zh: "缩放倍数", ja: "倍率", es: "Factor de escala", pt: "Fator de escala",
  },
  custom: {
    en: "Custom", zh: "自定义", ja: "カスタム", es: "Personalizado", pt: "Personalizado",
  },
  result: {
    en: "Scaled recipe", zh: "缩放后的配方", ja: "倍率を適用したレシピ", es: "Receta escalada", pt: "Receita escalada",
  },
  factorInvalid: {
    en: "Enter a scale factor greater than 0.",
    zh: "请输入大于 0 的缩放倍数。",
    ja: "0 より大きい倍率を入力してください。",
    es: "Introduce un factor de escala mayor que 0.",
    pt: "Digite um fator de escala maior que 0.",
  },
  eggNote: {
    en: "eggs are counted whole — rounded",
    zh: "鸡蛋按整数计——已四舍五入",
    ja: "卵は丸ごと数えるため四捨五入しました",
    es: "los huevos se cuentan enteros — se redondeó",
    pt: "ovos são contados inteiros — arredondado",
  },
  omitNote: {
    en: "this rounds to 0 — omit it, or add one if the mix looks dry",
    zh: "四舍五入后为 0——可以省略,若面团偏干再加 1 个",
    ja: "四捨五入すると 0 になります — 省略するか、乾いていれば 1 個追加してください",
    es: "esto se redondea a 0 — omítelo o añade uno si la mezcla queda seca",
    pt: "isso arredonda para 0 — omita ou adicione um se a massa ficar seca",
  },
} as const;

/** Shared scaled-lines renderer used by the scaler and the serving adjuster. */
export function ScaledLineList({ lines, locale }: { lines: ScaledLine[]; locale: string }) {
  return (
    <ul className="divide-y" style={{ borderColor: "var(--color-hairline)" }}>
      {lines.map((line, i) => {
        // Egg notes are re-expressed in the UI locale from the line data;
        // the lib's English note string stays the fallback.
        const note =
          line.unit === "egg" && line.note
            ? line.display.startsWith("0 ")
              ? pick(locale, L.omitNote)
              : `${trimNum(line.scaledQty)} → ${line.display} — ${pick(locale, L.eggNote)}`
            : line.note;
        return (
          <li key={i} className="py-2 first:pt-0 last:pb-0">
            {note ? (
              <>
                <p className="text-[15px] font-medium">{line.display}</p>
                <p className="mt-0.5 text-[13px] text-[var(--color-sub)]">{note}</p>
              </>
            ) : (
              <p className={line.display === line.original ? "text-[15px] text-[var(--color-sub)]" : "text-[15px] font-medium"}>
                {line.display}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** ≤3-decimal plain number for notes ("1.5", "2.667"). */
function trimNum(x: number | null): string {
  if (x === null || !Number.isFinite(x)) return "—";
  return String(Math.round(x * 1000) / 1000);
}

export function RecipeScalerEngine({ sample }: { sample?: string }) {
  const { locale } = useI18n();
  const [text, setText] = useState(
    sample ??
      `2 cups all-purpose flour
1½ tsp salt
0.5 cup whole milk
3 eggs
500 g chicken thigh
1/4 cup olive oil`,
  );
  const [factorIdx, setFactorIdx] = useState(4); // 2×
  const [custom, setCustom] = useState("");

  const factor = useMemo(() => {
    const c = custom.trim();
    if (c !== "") return parseLocaleNumber(c);
    return SCALE_PRESETS[factorIdx].value;
  }, [custom, factorIdx]);

  const lines = useMemo(() => text.split(/\r?\n/), [text]);
  const scaled = useMemo(() => scaleRecipe(lines, factor), [lines, factor]);
  const valid = Number.isFinite(factor) && factor > 0;
  const outText = useMemo(() => scaled.map((l) => l.display).join("\n"), [scaled]);

  return (
    <ToolPanel>
      <label className="block text-sm font-medium" htmlFor="bc-recipe">
        {pick(locale, L.recipe)}
      </label>
      <textarea
        id="bc-recipe"
        className="field mono mt-2"
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={pick(locale, L.recipeHint)}
        aria-label={pick(locale, L.recipe)}
      />
      <p className="mt-1.5 text-[13px] text-[var(--color-sub)]">{pick(locale, L.recipeHint)}</p>

      <div className="mt-5">
        <span className="block text-sm font-medium">{pick(locale, L.factor)}</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCALE_PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setFactorIdx(i);
                setCustom("");
              }}
              className={
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors " +
                (custom.trim() === "" && i === factorIdx
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "hairline bg-[var(--color-card)] hover:border-[var(--color-accent)]")
              }
              aria-pressed={custom.trim() === "" && i === factorIdx}
            >
              {p.label}
            </button>
          ))}
          <input
            className="field mono"
            style={{ flex: "0 0 auto", width: "7rem" }}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            inputMode="decimal"
            placeholder={pick(locale, L.custom)}
            aria-label={pick(locale, L.factor)}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">
          {pick(locale, L.result)}
          {valid ? <span className="ml-2 text-[var(--color-sub)]">×{factor}</span> : null}
        </h3>
        <CopyButton value={outText} />
      </div>
      <div className="error-bg mt-2 rounded-xl px-3.5 py-2 text-sm" style={{ display: valid ? "none" : "block" }}>
        {pick(locale, L.factorInvalid)}
      </div>
      <div className="mt-2 rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3">
        <ScaledLineList lines={scaled} locale={locale} />
      </div>
    </ToolPanel>
  );
}
