import { defineTool } from "../_lib/types";
import { RecipeScalerEngine } from "../_engines/recipe-scaler";

const SAMPLE = `2 cups all-purpose flour
1½ tsp salt
0.5 cup whole milk
3 eggs
500 g chicken thigh
1/4 cup olive oil`;

export default defineTool({
  slug: "recipe-scaler",
  category: "utility",
  icon: "chef",
  featured: true,
  engine: { component: RecipeScalerEngine, props: { sample: SAMPLE } },
  copy: {
    en: {
      name: "Recipe Scaler",
      h1: "Recipe Scaler — Double, Halve or Rescale Any Recipe",
      tagline:
        "Paste any recipe, pick a scale factor, and get every ingredient rescaled in real fractions — ½ cup, not 0.5. Eggs round to whole eggs with a note.",
      intro: [
        "Scaling a recipe by hand means multiplying every amount and then translating decimals back into spoon and cup fractions — 0.375 cup means nothing at the counter, ⅜ cup does. Paste your ingredient lines as written (cups, grams, teaspoons, eggs, mixed together) and Batchcook rescales each one by your factor.",
        "Amounts come out as the fractions cooks actually measure: 2 cups × 1.5 is 3 cups, ½ cup × 2 is 1 cup, and 2 cups × ⅔ is 1 ⅓ cups. Eggs are the one ingredient you cannot split: 3 eggs at half batch becomes 2 eggs with a note saying it was rounded, and a result that rounds to zero is flagged instead of quietly disappearing.",
      ],
      steps: [
        "Paste your ingredient lines into the box, one ingredient per line.",
        "Pick a scale factor — ½× for half, 2× to double, or type a custom one.",
        "Read the rescaled list: every amount is shown as a kitchen fraction.",
        "Copy the scaled recipe back into your notes or shopping list.",
      ],
      faqs: [
        {
          q: "Which formats can the amounts be written in?",
          a: "Decimals (0.5 tsp), plain numbers (2 cups), slash fractions (1/4 cup), unicode fractions (½ cup) and mixed numbers (1½ tsp or 1 1/2 cups) all parse. Units can be attached to the number (500g) or written out (500 g). Lines without an amount, like 'Salt to taste', pass through unchanged.",
        },
        {
          q: "How are eggs handled when the math gives a fraction?",
          a: "Eggs are rounded to the nearest whole egg — 1.5 eggs becomes 2, 1.2 becomes 1 — and the line gets a note so you know it was rounded. If a scaled amount rounds all the way down to 0, the tool says so instead of printing a bare 0.",
        },
        {
          q: "How exact are the fractions?",
          a: "Values snap to the nearest common cooking fraction (halves, thirds, quarters, sixths, eighths) within 1/64, which is finer than any measuring spoon. Odd values that don't map to a kitchen fraction are shown as plain decimals so nothing is silently distorted.",
        },
        {
          q: "Does anything get uploaded?",
          a: "No. The scaling runs in your browser with plain JavaScript — the recipe text never leaves your device.",
        },
      ],
    },
    zh: {
      name: "配方缩放器",
      h1: "配方缩放器——把任何配方放大或缩小",
      tagline:
        "粘贴配方、选一个倍数,每种食材都按厨房惯用的分数重新计算——是 ½ 杯,不是 0.5。鸡蛋自动取整并给出提示。",
      intro: [
        "手工放大配方意味着把每个用量乘一遍,再把小数换算回勺和杯的分数——0.375 杯在灶台前毫无意义,⅜ 杯才有用。把配料行原样粘进来(杯、克、茶匙、鸡蛋混在一起都行),Batchcook 按你选的倍数逐行重算。",
        "结果都是厨师真正量得出来的分数:2 杯 × 1.5 = 3 杯,½ 杯 × 2 = 1 杯,2 杯 × ⅔ = 1 ⅓ 杯。鸡蛋是唯一不能切开的东西:3 个鸡蛋乘 ½ 变成 2 个,并标注“已四舍五入”;缩到 0 的结果会明确提示,而不是悄悄消失。",
      ],
      steps: [
        "把配料行粘贴到输入框,每行一种食材。",
        "选缩放倍数——½× 减半、2× 翻倍,或输入自定义倍数。",
        "查看缩放结果:每个用量都以厨房分数显示。",
        "一键复制,贴回笔记或购物清单。",
      ],
      faqs: [
        {
          q: "用量可以写哪些格式?",
          a: "小数(0.5 tsp)、整数(2 cups)、斜杠分数(1/4 cup)、Unicode 分数(½ cup)和带分数(1½ tsp 或 1 1/2 cups)都能识别。单位可以紧贴数字(500g)也可以隔开(500 g)。没有用量的行(如“盐适量”)原样保留。",
        },
        {
          q: "鸡蛋算出小数怎么办?",
          a: "鸡蛋按最近的整数四舍五入——1.5 个变 2 个、1.2 个变 1 个——并在该行给出“已取整”的提示。如果缩放后四舍五入到 0,工具会明确说明,而不是直接打印 0。",
        },
        {
          q: "分数有多精确?",
          a: "数值吸附到 ±1/64 内最近的常用厨房分数(½、⅓、¼、⅙、⅛),比任何量勺都精细。对不上厨房分数的奇怪数值会以普通小数显示,保证不悄悄失真。",
        },
        {
          q: "会把配方上传到服务器吗?",
          a: "不会。缩放完全在浏览器里用 JavaScript 完成,配方文本从不离开你的设备。",
        },
      ],
    },
    ja: {
      name: "レシピスケーラー",
      h1: "レシピ倍率チェンジャー — どんなレシピも2倍・半分に",
      tagline:
        "レシピを貼り付けて倍率を選ぶだけ。全材料を ½ カップのような分数で再計算します(0.5 ではなく)。卵は個数に丸め、その旨を表示します。",
      intro: [
        "手作業でのレシピ拡大は、全ての分量を掛け算して、小数を計量カップやスプーンの分数に戻す作業です — 0.375 カップでは調理場で役に立ちませんが、⅜ カップなら使えます。材料行を書いたまま貼り付けて(カップ・グラム・小さじ・卵が混在していて OK)、倍率を指定すれば 1 行ずつ再計算します。",
        "結果は料理人が実際に計れる分数になります:2 カップ × 1.5 = 3 カップ、½ カップ × 2 = 1 カップ、2 カップ × ⅔ = 1 ⅓ カップ。卵は唯一分割できない材料です:卵 3 個の半分は 2 個になり、「丸めた」旨の注記が付き、0 に丸めるような場合は黙って消すのではなくはっきり表示します。",
      ],
      steps: [
        "材料行を入力欄に貼り付けます(1 行に 1 材料)。",
        "倍率を選びます — ½× で半分、2× で倍量、または任意の数値を入力。",
        "再計算された一覧を読みます。分量はすべてキッチン用の分数で表示。",
        "コピーして、メモや買い物リストに貼り戻します。",
      ],
      faqs: [
        {
          q: "分量はどんな書き方に対応していますか?",
          a: "小数(0.5 tsp)、整数(2 cups)、分数表記(1/4 cup)、Unicode 分数(½ cup)、帯分数(1½ tsp、1 1/2 cups)すべて解析できます。単位は数字に密着(500g)しても離して(500 g)も構いません。「塩少々」のような分量のない行はそのまま残ります。",
        },
        {
          q: "卵が端数になった場合は?",
          a: "卵は最も近い整数に丸めます — 1.5 個は 2 個、1.2 個は 1 個 — 丸めた行には注記が付きます。丸めると 0 になる場合は、0 とだけ表示するのではなく、その旨を明示します。",
        },
        {
          q: "分数の精度は?",
          a: "±1/64 以内で最も近いキッチン用分数(½・⅓・¼・⅙・⅛)にスナップします。計量スプーンより細かい精度です。キッチン用分数に合わない値は普通の小数で表示するので、黙って誤差が生じることはありません。",
        },
        {
          q: "レシピはアップロードされますか?",
          a: "いいえ。スケーリングはブラウザ内の JavaScript だけで動き、レシピのテキストが端末の外に出ることはありません。",
        },
      ],
    },
    es: {
      name: "Escalador de recetas",
      h1: "Escalador de recetas: dobla, reduce o reescala cualquier receta",
      tagline:
        "Pega cualquier receta, elige un factor y obtén cada ingrediente reescalado en fracciones de verdad — ½ taza, no 0,5. Los huevos se redondean a enteros con un aviso.",
      intro: [
        "Escalar una receta a mano implica multiplicar cada cantidad y luego traducir decimales a fracciones de cucharadas y tazas — 0,375 de taza no significa nada junto a la cocina, ⅜ de taza sí. Pega tus líneas de ingredientes tal cual están escritas (tazas, gramos, cucharaditas y huevos mezclados) y Batchcook reescala cada una según tu factor.",
        "Las cantidades salen como las fracciones que de verdad se miden: 2 tazas × 1,5 son 3 tazas, ½ taza × 2 es 1 taza y 2 tazas × ⅔ son 1 ⅓ tazas. El huevo es el único ingrediente que no se puede partir: 3 huevos a media ración se convierten en 2 con una nota de que se redondeó, y un resultado que redondea a cero se avisa en vez de desaparecer en silencio.",
      ],
      steps: [
        "Pega las líneas de ingredientes, un ingrediente por línea.",
        "Elige el factor — ½× para la mitad, 2× para doblar, o escribe uno personalizado.",
        "Lee la lista reescalada: cada cantidad aparece como fracción de cocina.",
        "Copia la receta escalada a tus notas o a la lista de la compra.",
      ],
      faqs: [
        {
          q: "¿Qué formatos de cantidad admite?",
          a: "Decimales (0,5 tsp), números simples (2 cups), fracciones con barra (1/4 cup), fracciones unicode (½ cup) y números mixtos (1½ tsp o 1 1/2 cups) se analizan correctamente. La unidad puede ir pegada al número (500g) o separada (500 g). Las líneas sin cantidad, como 'sal al gusto', pasan sin cambios.",
        },
        {
          q: "¿Qué pasa con los huevos cuando sale una fracción?",
          a: "Los huevos se redondean al entero más cercano — 1,5 huevos son 2, 1,2 es 1 — y la línea recibe un aviso de que se redondeó. Si un resultado redondea a 0, la herramienta lo dice en lugar de imprimir un cero pelado.",
        },
        {
          q: "¿Qué precisión tienen las fracciones?",
          a: "Los valores se ajustan a la fracción de cocina más cercana (medios, tercios, cuartos, sextos, octavos) dentro de 1/64, más fino que cualquier cuchara medidora. Los valores que no corresponden a una fracción de cocina se muestran como decimales, sin distorsionar nada en silencio.",
        },
        {
          q: "¿Se sube la receta a algún servidor?",
          a: "No. El escalado se ejecuta en tu navegador con JavaScript puro: el texto de la receta nunca sale de tu dispositivo.",
        },
      ],
    },
    pt: {
      name: "Escalador de receitas",
      h1: "Escalador de receitas: dobre, reduza ou reescale qualquer receita",
      tagline:
        "Cole qualquer receita, escolha um fator e receba cada ingrediente reescalado em frações de verdade — ½ xícara, não 0,5. Os ovos são arredondados para inteiros com um aviso.",
      intro: [
        "Escalar uma receita à mão significa multiplicar cada quantidade e depois converter decimais em frações de colheres e xícaras — 0,375 de xícara não significa nada na cozinha, ⅜ de xícara sim. Cole as linhas de ingredientes como estão escritas (xícaras, gramas, colheres de chá e ovos misturados) e o Batchcook reescala cada uma pelo seu fator.",
        "As quantidades saem como as frações que realmente se medem: 2 xícaras × 1,5 são 3 xícaras, ½ xícara × 2 é 1 xícara e 2 xícaras × ⅔ são 1 ⅓ xícaras. O ovo é o único ingrediente que não pode ser dividido: 3 ovos em meia porção viram 2, com um aviso de que houve arredondamento, e um resultado que arredonda para zero é sinalizado em vez de desaparecer em silêncio.",
      ],
      steps: [
        "Cole as linhas de ingredientes, um ingrediente por linha.",
        "Escolha o fator — ½× para metade, 2× para dobrar, ou digite um personalizado.",
        "Leia a lista reescalada: cada quantidade aparece como fração de cozinha.",
        "Copie a receita escalada para suas notas ou lista de compras.",
      ],
      faqs: [
        {
          q: "Quais formatos de quantidade são aceitos?",
          a: "Decimais (0,5 tsp), números simples (2 cups), frações com barra (1/4 cup), frações unicode (½ cup) e números mistos (1½ tsp ou 1 1/2 cups) são todos interpretados. A unidade pode estar grudada no número (500g) ou separada (500 g). Linhas sem quantidade, como 'sal a gosto', passam sem alteração.",
        },
        {
          q: "E os ovos quando a conta dá uma fração?",
          a: "Os ovos são arredondados para o inteiro mais próximo — 1,5 ovo vira 2, 1,2 vira 1 — e a linha recebe um aviso de arredondamento. Se um resultado arredonda para 0, a ferramenta avisa em vez de imprimir um zero seco.",
        },
        {
          q: "Qual é a precisão das frações?",
          a: "Os valores se ajustam à fração de cozinha mais próxima (metades, terços, quartos, sextos, oitavos) dentro de 1/64, mais fino que qualquer colher medidora. Valores que não correspondem a uma fração de cozinha aparecem como decimais, sem distorção silenciosa.",
        },
        {
          q: "A receita é enviada para algum servidor?",
          a: "Não. O escalonamento roda no seu navegador em JavaScript puro — o texto da receita nunca sai do seu aparelho.",
        },
      ],
    },
  },
  related: ["baker-percentages", "serving-adjuster"],
});
