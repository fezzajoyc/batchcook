"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { CopyButton } from "@/components/client-ui";
import { ToolPanel } from "@/components/ui";
import { bakerPercentages } from "../_lib/recipe";
import { parseLocaleNumber } from "../_lib/numparse";
import { pick } from "./recipe-scaler";

const L = {
  flour: {
    en: "Flour weight (g)", zh: "面粉重量(克)", ja: "小麦粉の量(g)", es: "Peso de la harina (g)", pt: "Peso da farinha (g)",
  },
  flourHint: {
    en: "Baker's percentages treat flour as 100 %. Everything else is a share of this weight.",
    zh: "烘焙百分比把面粉当作 100%,其他材料都是相对这个重量的占比。",
    ja: "ベーカーズ・パーセントは小麦粉を 100 % とし、他の材料はその重さに対する割合で表します。",
    es: "Los porcentajes de panadero tratan la harina como 100 %. Todo lo demás es una proporción de este peso.",
    pt: "Os percentuais de padeiro tratam a farinha como 100 %. Todo o resto é uma parcela deste peso.",
  },
  items: {
    en: "Ingredients (% of flour)", zh: "其他材料(占面粉的 %)", ja: "材料(小麦粉に対する %)", es: "Ingredientes (% de la harina)", pt: "Ingredientes (% da farinha)",
  },
  name: { en: "Ingredient", zh: "材料", ja: "材料", es: "Ingrediente", pt: "Ingrediente" },
  pct: { en: "%", zh: "%", ja: "%", es: "%", pt: "%" },
  grams: { en: "Grams", zh: "克数", ja: "グラム", es: "Gramos", pt: "Gramas" },
  add: { en: "Add ingredient", zh: "添加材料", ja: "材料を追加", es: "Añadir ingrediente", pt: "Adicionar ingrediente" },
  remove: { en: "Remove", zh: "删除", ja: "削除", es: "Quitar", pt: "Remover" },
  total: { en: "Total dough weight", zh: "面团总重", ja: "生地の合計", es: "Peso total de la masa", pt: "Peso total da massa" },
  invalid: {
    en: "Enter a flour weight greater than 0 and percentages of 0 or more.",
    zh: "请输入大于 0 的面粉重量和 ≥ 0 的百分比。",
    ja: "0 より大きい小麦粉の量と 0 以上の割合を入力してください。",
    es: "Introduce un peso de harina mayor que 0 y porcentajes de 0 o más.",
    pt: "Digite um peso de farinha maior que 0 e percentuais de 0 ou mais.",
  },
} as const;

type Row = { name: string; pct: string };

const START_ROWS: Row[] = [
  { name: "Water", pct: "65" },
  { name: "Salt", pct: "2" },
  { name: "Yeast (instant)", pct: "1" },
];

export function BakerPercentagesEngine({ sampleRows }: { sampleRows?: Row[] }) {
  const { locale } = useI18n();
  const [flour, setFlour] = useState("500");
  const [rows, setRows] = useState<Row[]>(sampleRows ?? START_ROWS);

  const flourG = parseLocaleNumber(flour.trim());
  const parsed = useMemo(
    () => bakerPercentages(flourG, rows.map((r) => ({ name: r.name, pct: parseLocaleNumber(r.pct.trim()) }))),
    [flourG, rows],
  );
  const valid = Number.isFinite(flourG) && flourG > 0 && parsed.items.every((it) => Number.isFinite(it.grams));
  const fmtG = (g: number) =>
    Number.isFinite(g) ? new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(g) : "—";

  const outText = useMemo(
    () =>
      [
        `Flour: ${fmtG(parsed.flourG)} g (100%)`,
        ...parsed.items.map((it) => `${it.name}: ${fmtG(it.grams)} g (${it.pct}%)`),
        `Total: ${fmtG(parsed.totalG)} g`,
      ].join("\n"),
    [parsed, locale], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ToolPanel>
      <label className="block text-sm font-medium" htmlFor="bc-flour">
        {pick(locale, L.flour)}
      </label>
      <input
        id="bc-flour"
        className="field mono mt-2"
        style={{ maxWidth: "12rem" }}
        value={flour}
        onChange={(e) => setFlour(e.target.value)}
        inputMode="decimal"
        placeholder="500"
        aria-label={pick(locale, L.flour)}
      />
      <p className="mt-1.5 text-[13px] text-[var(--color-sub)]">{pick(locale, L.flourHint)}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{pick(locale, L.items)}</span>
        <button
          type="button"
          className="rounded-full border hairline px-3 py-1 text-[13px] hover:border-[var(--color-accent)]"
          onClick={() => setRows((r) => [...r, { name: "", pct: "" }])}
        >
          + {pick(locale, L.add)}
        </button>
      </div>

      <div className="mt-2 grid gap-2" role="group" aria-label={pick(locale, L.items)}>
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="field"
              value={row.name}
              onChange={(e) =>
                setRows((rs) => rs.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
              }
              placeholder={pick(locale, L.name)}
              aria-label={`${pick(locale, L.name)} ${i + 1}`}
            />
            <input
              className="field mono"
              style={{ flex: "0 0 auto", width: "5.5rem" }}
              value={row.pct}
              onChange={(e) =>
                setRows((rs) => rs.map((r, j) => (j === i ? { ...r, pct: e.target.value } : r)))
              }
              inputMode="decimal"
              placeholder="0"
              aria-label={`${pick(locale, L.pct)} ${i + 1}`}
            />
            <button
              type="button"
              className="rounded-xl border hairline px-3 text-[13px] hover:border-[var(--color-accent)]"
              style={{ flex: "0 0 auto" }}
              onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
              aria-label={`${pick(locale, L.remove)} ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="error-bg mt-4 rounded-xl px-3.5 py-2 text-sm" style={{ display: valid ? "none" : "block" }}>
        {pick(locale, L.invalid)}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{pick(locale, L.grams)}</h3>
        <CopyButton value={outText} />
      </div>
      <div className="mt-2 overflow-hidden rounded-xl border hairline bg-[var(--color-surface)]">
        <table className="w-full text-[15px]">
          <tbody>
            <tr className="border-b" style={{ borderColor: "var(--color-hairline)" }}>
              <td className="px-4 py-2.5">flour — 100%</td>
              <td className="mono px-4 py-2.5 text-right">{fmtG(parsed.flourG)} g</td>
            </tr>
            {parsed.items.map((it, i) => (
              <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "var(--color-hairline)" }}>
                <td className="px-4 py-2.5">
                  {it.name || `#${i + 1}`} — {Number.isFinite(it.pct) ? it.pct : "—"}%
                </td>
                <td className="mono px-4 py-2.5 text-right">{fmtG(it.grams)} g</td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2.5 font-semibold">{pick(locale, L.total)}</td>
              <td className="mono px-4 py-2.5 text-right font-semibold">{fmtG(parsed.totalG)} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ToolPanel>
  );
}
