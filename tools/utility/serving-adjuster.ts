import { defineTool } from "../_lib/types";
import { ServingAdjusterEngine } from "../_engines/serving-adjuster";

export default defineTool({
  slug: "serving-adjuster",
  category: "utility",
  icon: "users",
  engine: { component: ServingAdjusterEngine, props: {} },
  copy: {
    en: {
      name: "Serving Adjuster",
      h1: "Serving Adjuster — Resize a Recipe to Any Number of Servings",
      tagline:
        "A recipe serves 4 and you need 6? Enter both numbers and every ingredient line scales by 6÷4 — with real fractions and whole-egg rounding handled.",
      intro: [
        "Most recipes are written for one serving count, and life rarely matches: you are cooking for two with a four-person recipe, or meal-prepping six lunches from one that serves four. The math is a single factor — 6 ÷ 4 = 1.5× — but applying it by hand to a dozen ingredient lines is where mistakes live.",
        "Paste the recipe as written and enter both serving counts. Every line rescales by the factor and reads like a recipe again: 1½ cups × 1.5 becomes 2 ¼ cups, not 2.25. Eggs round to whole eggs with a note, and lines like 'Salt to taste' pass through untouched.",
      ],
      steps: [
        "Enter how many servings the original recipe makes.",
        "Enter how many servings you actually need.",
        "Paste the ingredient lines, one per line.",
        "Copy the adjusted recipe — every amount already rescaled.",
      ],
      faqs: [
        {
          q: "How is the scale factor calculated?",
          a: "Factor = target servings ÷ original servings. Going from a recipe for 4 to one for 6 is 6 ÷ 4 = 1.5×, so every amount multiplies by 1.5. Going the other way, 4 → 2, is a 0.5× reduction.",
        },
        {
          q: "Is this different from a recipe scaler?",
          a: "Same engine underneath — here the factor is derived from two serving counts instead of chosen directly. Use this when you think in 'people', use the scaler when you think in 'double it'.",
        },
        {
          q: "What about cooking times and pan sizes?",
          a: "They do not scale linearly. A 1.5× batch in the same pan may need a few extra minutes; doubling usually needs a slightly larger pan, not double the time. Use a thermometer and visual cues rather than multiplying the timer.",
        },
        {
          q: "Do seasonings need adjusting?",
          a: "Spices and salt scale roughly with the factor, but taste at the end and adjust — especially salt in braises and stocks, where reduced liquid can concentrate flavor beyond the arithmetic.",
        },
      ],
    },
    zh: {
      name: "份数调整器",
      h1: "份数调整器——把配方改成任意人数",
      tagline:
        "配方供 4 人,你需要 6 人?输入两个数字,每一行食材都按 6÷4 缩放——真实分数显示,鸡蛋自动取整。",
      intro: [
        "大多数配方只按一种份数写,而现实很少刚好:两个人的晚饭,手里却是四人份的配方;或者要把四人份的菜做成六份便当。数学上只是一个倍数——6 ÷ 4 = 1.5 倍——但把十几行配料逐行手算,错误就在这里发生。",
        "把配方原样粘进来,输入两个份数。每一行按倍数重算,读起来还是一份配方:1½ 杯 × 1.5 变成 2 ¼ 杯,不是 2.25。鸡蛋按整数取整并提示,“盐适量”这类行原样保留。",
      ],
      steps: [
        "输入原配方的份数。",
        "输入你实际需要的份数。",
        "粘贴配料行,每行一种。",
        "复制调整后的配方——每个用量都已重算。",
      ],
      faqs: [
        {
          q: "缩放倍数怎么算?",
          a: "倍数 = 目标份数 ÷ 原份数。四人份改六人份就是 6 ÷ 4 = 1.5 倍,每个用量乘 1.5;反过来四人份改两人份就是 0.5 倍。",
        },
        {
          q: "这和配方缩放器有什么区别?",
          a: "底层是同一套引擎——只是这里的倍数由两个份数推导,而不是直接选。想的是“几个人”就用这个,想的是“翻个倍”就用缩放器。",
        },
        {
          q: "烹饪时间和锅具尺寸呢?",
          a: "它们不按线性缩放。同样的锅里做 1.5 倍的量可能要多几分钟;翻倍通常需要大一号的锅,而不是双倍时间。用温度计和观察状态,别机械放大计时器。",
        },
        {
          q: "调味料也要调整吗?",
          a: "香料和盐大致随倍数走,但最后请尝味再调整——尤其是炖菜和高汤里的盐,汤汁收浓后风味会超出算术比例。",
        },
      ],
    },
    ja: {
      name: "人数調整ツール",
      h1: "人数調整ツール — レシピを任意の人数に合わせる",
      tagline:
        "レシピは 4 人分、作りたいのは 6 人分?2 つの数字を入れるだけで、全材料が 6÷4 で再計算されます。分数表示と卵の丸め込み付き。",
      intro: [
        "レシピは決まった人数分で書かれていますが、実際はそうはいきません:4 人分のレシピを 2 人分に、あるいは 4 人分のレシピから 6 つ分のお弁当を。計算自体は 6 ÷ 4 = 1.5 倍の一つの倍率ですが、十数行の材料に手で掛け算するところにミスが潜みます。",
        "レシピを書いたまま貼り付けて、両方の人数を入力。各行が倍率で再計算され、読み方はレシピのまま:1½ カップ × 1.5 は 2.25 ではなく 2 ¼ カップ。卵は個数に丸めて注記付き、「塩少々」の行はそのまま通ります。",
      ],
      steps: [
        "元のレシピの人数分を入力します。",
        "実際に作りたい人数を入力します。",
        "材料行を 1 行ずつ貼り付けます。",
        "調整済みレシピをコピー — 全ての分量は再計算済みです。",
      ],
      faqs: [
        {
          q: "倍率はどう計算されますか?",
          a: "倍率 = 目標人数 ÷ 元の人数。4 人分を 6 人分にするのは 6 ÷ 4 = 1.5 倍で、全ての分量に 1.5 を掛けます。逆に 4 → 2 なら 0.5 倍の減量です。",
        },
        {
          q: "レシピスケーラーと何が違いますか?",
          a: "内部は同じエンジンです — ここでは倍率を 2 つの人数から導くだけで、直接選びません。「何人分」で考えるならこちら、「倍にしたい」ならスケーラーを。",
        },
        {
          q: "加熱時間や鍋のサイズは?",
          a: "これらは比例しません。同じ鍋で 1.5 倍なら数分の追加が必要かもしれませんし、2 倍は時間を 2 倍ではなく少し大きい鍋が必要です。タイマーを掛け算せず、温度計と見た目で判断してください。",
        },
        {
          q: "調味料はどうすれば?",
          a: "香辛料や塩はほぼ倍率に従いますが、最後に必ず味見して調整を — 特にシチューやストックの塩は、水分が減って味が濃くなるので算術以上に感じられます。",
        },
      ],
    },
    es: {
      name: "Ajustador de raciones",
      h1: "Ajustador de raciones: adapta una receta a cualquier número de comensales",
      tagline:
        "¿La receta sirve para 4 y la necesitas para 6? Escribe ambos números y cada línea de ingredientes se escala por 6÷4 — con fracciones reales y huevos enteros.",
      intro: [
        "Las recetas se escriben para una cantidad de raciones y la vida rara vez coincide: cocinas para dos con una receta de cuatro, o preparas seis comidas con una de cuatro. El cálculo es un solo factor — 6 ÷ 4 = 1,5× — pero aplicarlo a mano a una docena de líneas es donde viven los errores.",
        "Pega la receta tal como está y escribe las dos cantidades. Cada línea se reescala y vuelve a leerse como una receta: 1½ tazas × 1,5 son 2 ¼ tazas, no 2,25. Los huevos se redondean a enteros con un aviso, y las líneas como 'sal al gusto' pasan intactas.",
      ],
      steps: [
        "Escribe para cuántas raciones está la receta original.",
        "Escribe cuántas raciones necesitas de verdad.",
        "Pega las líneas de ingredientes, una por línea.",
        "Copia la receta ajustada — cada cantidad ya reescalada.",
      ],
      faqs: [
        {
          q: "¿Cómo se calcula el factor?",
          a: "Factor = raciones objetivo ÷ raciones originales. De una receta para 4 a una para 6 es 6 ÷ 4 = 1,5×, así que cada cantidad se multiplica por 1,5. Al revés, de 4 a 2, es una reducción de 0,5×.",
        },
        {
          q: "¿En qué se diferencia del escalador de recetas?",
          a: "Debajo usan el mismo motor — aquí el factor se deduce de dos cantidades de raciones en lugar de elegirse directo. Úsalo cuando piensas en 'personas'; usa el escalador cuando piensas en 'dóblalo'.",
        },
        {
          q: "¿Y los tiempos de cocción y los moldes?",
          a: "No escalan linealmente. Un lote de 1,5× en el mismo molde puede necesitar unos minutos más; doblar suele requerir un molde más grande, no el doble de tiempo. Usa termómetro y señales visuales en vez de multiplicar el temporizador.",
        },
        {
          q: "¿Hay que ajustar los condimentos?",
          a: "Las especias y la sal escalan aproximadamente con el factor, pero prueba al final y ajusta — sobre todo la sal en guisos y caldos, donde el líquido reducido concentra el sabor más de lo que dice la aritmética.",
        },
      ],
    },
    pt: {
      name: "Ajustador de porções",
      h1: "Ajustador de porções: adapte uma receita a qualquer número de porções",
      tagline:
        "A receita serve 4 e você precisa de 6? Digite os dois números e cada linha de ingredientes escala por 6÷4 — com frações reais e ovos inteiros.",
      intro: [
        "As receitas são escritas para um número fixo de porções e a vida raramente coincide: você cozinha para dois com uma receita de quatro, ou prepara seis marmitas de uma que serve quatro. A conta é um único fator — 6 ÷ 4 = 1,5× — mas aplicá-lo à mão em uma dúzia de linhas é onde moram os erros.",
        "Cole a receita como está e digite os dois números. Cada linha reescala e volta a ler-se como receita: 1½ xícaras × 1,5 viram 2 ¼ xícaras, não 2,25. Os ovos são arredondados para inteiros com um aviso, e linhas como 'sal a gosto' passam intactas.",
      ],
      steps: [
        "Digite para quantas porções a receita original serve.",
        "Digite quantas porções você realmente precisa.",
        "Cole as linhas de ingredientes, uma por linha.",
        "Copie a receita ajustada — cada quantidade já reescalada.",
      ],
      faqs: [
        {
          q: "Como o fator é calculado?",
          a: "Fator = porções desejadas ÷ porções originais. De uma receita para 4 até uma para 6 é 6 ÷ 4 = 1,5×, então cada quantidade multiplica por 1,5. No sentido inverso, de 4 para 2, é uma redução de 0,5×.",
        },
        {
          q: "Qual a diferença para o escalador de receitas?",
          a: "Embaixo é o mesmo motor — aqui o fator é derivado de duas contagens de porções em vez de escolhido diretamente. Use este quando pensa em 'pessoas'; use o escalador quando pensa em 'dobrar'.",
        },
        {
          q: "E os tempos de cozimento e o tamanho das formas?",
          a: "Não escalam linearmente. Um lote de 1,5× na mesma forma pode precisar de alguns minutos a mais; dobrar geralmente pede uma forma maior, não o dobro do tempo. Use termômetro e sinais visuais em vez de multiplicar o cronômetro.",
        },
        {
          q: "Os temperos precisam de ajuste?",
          a: "Especiarias e sal escalam aproximadamente com o fator, mas prove no final e ajuste — especialmente o sal em refogados e caldos, onde o líquido reduzido concentra o sabor além da aritmética.",
        },
      ],
    },
  },
  related: ["recipe-scaler", "baker-percentages"],
});
