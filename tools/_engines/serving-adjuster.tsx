"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import { scaleRecipe, servingFactor } from "../_lib/recipe";
import { parseLocaleNumber } from "../_lib/numparse";
import { pick, ScaledLineList } from "./recipe-scaler";

const SAMPLE = `2 cups all-purpose flour
1½ tsp salt
0.5 cup whole milk
3 eggs
500 g chicken thigh
1/4 cup olive oil`;

const L = {
  serves: { en: "The recipe serves", zh: "配方原本供", ja: "レシピの人数", es: "La receta sirve para", pt: "A receita serve" },
  want: { en: "You need it to serve", zh: "你需要它供", ja: "作りたい人数", es: "La necesitas para", pt: "Você precisa que sirva" },
  people: { en: "people", zh: "人", ja: "人分", es: "personas", pt: "pessoas" },
  recipe: {
    en: "Recipe lines", zh: "配方行", ja: "レシピの行", es: "Líneas de la receta", pt: "Linhas da receita",
  },
  recipeHint: {
    en: "One ingredient per line, amounts written naturally: 2 cups flour, 1½ tsp salt, 3 eggs, 500g chicken.",
    zh: "每行一种食材,数量按平时写法:2 cups flour、1½ tsp salt、3 eggs、500g chicken。",
    ja: "1 行に 1 つの材料、分量はいつも通り:2 cups flour、1½ tsp salt、3 eggs、500g chicken。",
    es: "Un ingrediente por línea, cantidades escritas con naturalidad: 2 cups flour, 1½ tsp salt, 3 eggs, 500g chicken.",
    pt: "Um ingrediente por linha, quantidades escritas naturalmente: 2 cups flour, 1½ tsp salt, 3 eggs, 500g chicken.",
  },
  result: {
    en: "Adjusted recipe", zh: "调整后的配方", ja: "人数調整したレシピ", es: "Receta ajustada", pt: "Receita ajustada",
  },
  invalid: {
    en: "Enter serving counts greater than 0.",
    zh: "请输入大于 0 的人数。",
    ja: "0 より大きい人数を入力してください。",
    es: "Introduce números de comensales mayores que 0.",
    pt: "Digite números de porções maiores que 0.",
  },
} as const;

export function ServingAdjusterEngine({ sample }: { sample?: string }) {
  const { locale } = useI18n();
  const [servesN, setServesN] = useState("4");
  const [servesM, setServesM] = useState("6");
  const [text, setText] = useState(sample ?? SAMPLE);

  const n = parseLocaleNumber(servesN.trim());
  const m = parseLocaleNumber(servesM.trim());
  const factor = servingFactor(n, m);
  const valid = Number.isFinite(factor);
  const scaled = useMemo(
    () => scaleRecipe(text.split(/\r?\n/), factor),
    [text, factor],
  );
  const outText = useMemo(() => scaled.map((l) => l.display).join("\n"), [scaled]);

  return (
    <ToolPanel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="bc-n">
            {pick(locale, L.serves)}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="bc-n"
              className="field mono"
              style={{ flex: "0 0 auto", width: "6rem" }}
              value={servesN}
              onChange={(e) => setServesN(e.target.value)}
              inputMode="numeric"
              placeholder="4"
              aria-label={pick(locale, L.serves)}
            />
            <span className="text-sm text-[var(--color-sub)]">{pick(locale, L.people)}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="bc-m">
            {pick(locale, L.want)}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="bc-m"
              className="field mono"
              style={{ flex: "0 0 auto", width: "6rem" }}
              value={servesM}
              onChange={(e) => setServesM(e.target.value)}
              inputMode="numeric"
              placeholder="6"
              aria-label={pick(locale, L.want)}
            />
            <span className="text-sm text-[var(--color-sub)]">{pick(locale, L.people)}</span>
          </div>
        </div>
      </div>
      {valid ? (
        <p className="mt-3 text-sm text-[var(--color-sub)]">×{Math.round(factor * 1000) / 1000}</p>
      ) : (
        <div className="error-bg mt-3 rounded-xl px-3.5 py-2 text-sm">{pick(locale, L.invalid)}</div>
      )}

      <label className="mt-5 block text-sm font-medium" htmlFor="bc-recipe-srv">
        {pick(locale, L.recipe)}
      </label>
      <textarea
        id="bc-recipe-srv"
        className="field mono mt-2"
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={pick(locale, L.recipeHint)}
        aria-label={pick(locale, L.recipe)}
      />
      <p className="mt-1.5 text-[13px] text-[var(--color-sub)]">{pick(locale, L.recipeHint)}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{pick(locale, L.result)}</h3>
        <CopyButton value={outText} />
      </div>
      <div className="mt-2 rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3">
        <ScaledLineList lines={scaled} locale={locale} />
      </div>
    </ToolPanel>
  );
}
