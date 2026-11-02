import { defineTool } from "../_lib/types";
import { BakerPercentagesEngine } from "../_engines/baker-percentages";

export default defineTool({
  slug: "baker-percentages",
  category: "utility",
  icon: "wheat",
  engine: { component: BakerPercentagesEngine, props: {} },
  copy: {
    en: {
      name: "Baker's Percentage Calculator",
      h1: "Baker's Percentage Calculator — Formula Any Dough in Grams",
      tagline:
        "Enter a flour weight and baker's percentages — water 65%, salt 2% — and get exact gram amounts for every ingredient, plus total dough weight.",
      intro: [
        "Bakers don't scale recipes by volume; they express every ingredient as a percentage of the flour weight. Flour is 100 % by definition, so water at 65 % and salt at 2 % against 500 g of flour means 325 g of water and 10 g of salt — no matter how big or small the batch. That is how any bread formula is written, shared and resized.",
        "Enter your flour weight, list the other ingredients with their percentages, and read off the grams. Change the flour amount and the whole formula rescales instantly. Hydration is just water's percentage: 65 % is a lean sandwich loaf, 75 % and up is a wet artisan dough.",
      ],
      steps: [
        "Weigh or decide your flour amount in grams and enter it.",
        "List each extra ingredient with its baker's percentage (water 65, salt 2, yeast 1…).",
        "Read the gram amount for every ingredient and the total dough weight.",
        "Change the flour weight to resize the entire formula at once.",
      ],
      faqs: [
        {
          q: "Why is flour always 100%?",
          a: "Baker's percentages are relative to the flour weight, not the total. Making flour the reference means every other ingredient scales proportionally when you change batch size, and formulas from any source can be compared directly — 65% hydration means the same thing everywhere.",
        },
        {
          q: "What hydration should my bread be?",
          a: "Sandwich and enriched loaves sit around 60–68%; rustic artisan loaves go 70–85%; focaccia can exceed 85%. Higher hydration means a wetter dough, bigger holes and a crispier crust — and stickier handling.",
        },
        {
          q: "Do I add the percentages up to 100?",
          a: "No — only flour is 100%. The other percentages are each a share of the flour weight, so a typical lean dough adds up to well over 100% overall (100 flour + 65 water + 2 salt + 1 yeast).",
        },
        {
          q: "Are the gram amounts exact?",
          a: "The arithmetic is exact — 2% of 500 g is precisely 10 g. Real bakes vary with flour brand and humidity, which is why bakers weigh instead of measuring by volume in the first place.",
        },
      ],
    },
    zh: {
      name: "烘焙百分比计算器",
      h1: "烘焙百分比计算器——用克数配出任何面团",
      tagline:
        "输入面粉重量和烘焙百分比——水 65%、盐 2%——立刻得到每种食材的精确克数,以及面团总重。",
      intro: [
        "面包师不用体积来放大配方,而是把每种材料表示成面粉重量的百分比。面粉按定义就是 100%,所以 500 克面粉配 65% 的水、2% 的盐,就是 325 克水和 10 克盐——批量多大都不会变形。任何面包公式都是这样写、这样分享、这样缩放的。",
        "输入面粉重量,列出其他材料及其百分比,直接读出克数。改一下面粉量,整个公式瞬间重算。含水量就是水的百分比:65% 是三明治吐司,75% 以上就是湿软的手工面团。",
      ],
      steps: [
        "称量或确定面粉克数并输入。",
        "列出其他材料及其烘焙百分比(水 65、盐 2、酵母 1……)。",
        "读取每种材料的克数和面团总重。",
        "修改面粉重量,整个公式一次性重算。",
      ],
      faqs: [
        {
          q: "为什么面粉永远是 100%?",
          a: "烘焙百分比以面粉重量为基准,而不是总量。以面粉为参照,改批量时其他材料按比例缩放;任何来源的公式都能直接对比——65% 含水量在任何地方都是同一个意思。",
        },
        {
          q: "我的面包该用多少含水量?",
          a: "吐司和 enrich 面团在 60–68%;乡村手工面团 70–85%;佛卡夏可以超过 85%。含水量越高,面团越湿、气孔越大、外壳越脆——操作也越粘手。",
        },
        {
          q: "百分比要加起来等于 100 吗?",
          a: "不用——只有面粉是 100%。其他百分比各是相对面粉的占比,所以典型的基础面团总和远超 100%(面粉 100 + 水 65 + 盐 2 + 酵母 1)。",
        },
        {
          q: "克数精确吗?",
          a: "算术是精确的——500 克的 2% 就是 10 克。实际烘烤会受面粉品牌和湿度影响,这正是面包师从一开始就用秤而不用量杯的原因。",
        },
      ],
    },
    ja: {
      name: "ベーカーズパーセント計算機",
      h1: "ベーカーズ・パーセント計算機 — 配合をグラムで組む",
      tagline:
        "小麦粉の量とベーカーズ・パーセント(水 65%、塩 2% など)を入力すると、全材料の正確なグラム数と生地の合計が出ます。",
      intro: [
        "パン職人は体積でレシピを拡大しません。全ての材料を小麦粉の重さに対する割合で表します。小麦粉は定義上 100 % なので、500 g の小麦粉に対して水 65 %・塩 2 % なら水 325 g・塩 10 g — バッチの大小に関係なく比率は崩れません。あらゆるパンの配合はこの書き方で共有・拡大されます。",
        "小麦粉の量を入力し、他の材料と割合を並べれば、グラム数が読み取れます。小麦粉の量を変えれば配合全体が即座に再計算されます。水分量は水の割合そのもの:65 % はサンドイッチローフ、75 % 以上は湿った職人系生地です。",
      ],
      steps: [
        "小麦粉の量をグラムで決めて入力します。",
        "他の材料とベーカーズ・パーセントを並べます(水 65、塩 2、酵母 1…)。",
        "各材料のグラム数と生地の合計を読み取ります。",
        "小麦粉の量を変えると、配合全体が一括で再計算されます。",
      ],
      faqs: [
        {
          q: "なぜ小麦粉は常に 100 % なのですか?",
          a: "ベーカーズ・パーセントは合計ではなく小麦粉の重さを基準にします。小麦粉を基準にすれば、バッチサイズを変えても他の材料は比例して伸縮し、出典の違う配合同士も直接比較できます — 65 % の水分量はどこでも同じ意味です。",
        },
        {
          q: "水分量はどのくらいがいい?",
          a: "サンドイッチやリッチなローフは 60〜68 %、職人系の素朴なパンは 70〜85 %、フォカッチャは 85 % 超も。水分が多いほど生地は柔らかく、気孔は大きく、クラストはパリッとなります — その分扱いはねばねばします。",
        },
        {
          q: "割合の合計は 100 にしますか?",
          a: "いいえ — 100 % は小麦粉だけです。他の割合はそれぞれ小麦粉に対する占比なので、基本的な配合の合計は 100 % を大きく超えます(小麦粉 100 + 水 65 + 塩 2 + 酵母 1)。",
        },
        {
          q: "グラム数は正確ですか?",
          a: "計算は正確です — 500 g の 2 % は厳密に 10 g。実際の焼き上がりは小麦粉の銘柄や湿度で変わります。だからこそパン職人は最初から体積ではなく秤を使うのです。",
        },
      ],
    },
    es: {
      name: "Calculadora de porcentajes de panadero",
      h1: "Calculadora de porcentajes de panadero — formula cualquier masa en gramos",
      tagline:
        "Introduce un peso de harina y porcentajes de panadero — agua 65 %, sal 2 % — y obtén los gramos exactos de cada ingrediente y el peso total de la masa.",
      intro: [
        "Los panaderos no escalan recetas por volumen: expresan cada ingrediente como porcentaje del peso de la harina. La harina es el 100 % por definición, así que agua al 65 % y sal al 2 % con 500 g de harina son 325 g de agua y 10 g de sal, sin importar el tamaño del lote. Así se escriben, comparten y redimensionan todas las fórmulas de pan.",
        "Introduce el peso de la harina, lista los demás ingredientes con sus porcentajes y lee los gramos. Cambia la harina y toda la fórmula se reescala al instante. La hidratación es simplemente el porcentaje del agua: 65 % es un molde de sándwich, 75 % o más es una masa artesanal húmeda.",
      ],
      steps: [
        "Pesa o decide la cantidad de harina en gramos e introdúcela.",
        "Lista cada ingrediente extra con su porcentaje de panadero (agua 65, sal 2, levadura 1…).",
        "Lee los gramos de cada ingrediente y el peso total de la masa.",
        "Cambia el peso de harina para reescalar toda la fórmula de una vez.",
      ],
      faqs: [
        {
          q: "¿Por qué la harina es siempre 100 %?",
          a: "Los porcentajes de panadero son relativos al peso de la harina, no al total. Con la harina como referencia, cada ingrediente escala proporcionalmente al cambiar el lote, y las fórmulas de cualquier fuente se comparan directamente: 65 % de hidratación significa lo mismo en todas partes.",
        },
        {
          q: "¿Qué hidratación debe llevar mi pan?",
          a: "Los panes de molde y enriquecidos van del 60–68 %; los artesanales rústicos del 70–85 %; la focaccia puede pasar del 85 %. Más hidratación significa masa más húmeda, alveolos mayores y corteza más crujiente — y un manejo más pegajoso.",
        },
        {
          q: "¿Los porcentajes tienen que sumar 100?",
          a: "No — solo la harina es 100 %. Los demás porcentajes son cada uno una parte del peso de harina, así que una masa básica suma mucho más de 100 % en total (100 harina + 65 agua + 2 sal + 1 levadura).",
        },
        {
          q: "¿Los gramos son exactos?",
          a: "La aritmética es exacta: el 2 % de 500 g son justo 10 g. Los resultados reales varían con la marca de harina y la humedad, que es justamente por lo que los panaderos pesan en lugar de medir por volumen.",
        },
      ],
    },
    pt: {
      name: "Calculadora de percentuais de padeiro",
      h1: "Calculadora de percentuais de padeiro — formule qualquer massa em gramas",
      tagline:
        "Digite o peso da farinha e os percentuais de padeiro — água 65 %, sal 2 % — e receba os gramas exatos de cada ingrediente e o peso total da massa.",
      intro: [
        "Padeiros não escalam receitas por volume: expressam cada ingrediente como percentual do peso da farinha. A farinha é 100 % por definição, então água a 65 % e sal a 2 % com 500 g de farinha dá 325 g de água e 10 g de sal — não importa o tamanho do lote. É assim que toda fórmula de pão é escrita, compartilhada e redimensionada.",
        "Digite o peso da farinha, liste os demais ingredientes com seus percentuais e leia os gramas. Mude a farinha e a fórmula inteira reescala na hora. A hidratação é simplesmente o percentual da água: 65 % é um pão de forma, 75 % ou mais é uma massa artesanal úmida.",
      ],
      steps: [
        "Pese ou decida a quantidade de farinha em gramas e digite.",
        "Liste cada ingrediente extra com seu percentual de padeiro (água 65, sal 2, fermento 1…).",
        "Leia os gramas de cada ingrediente e o peso total da massa.",
        "Mude o peso da farinha para reescalar toda a fórmula de uma vez.",
      ],
      faqs: [
        {
          q: "Por que a farinha é sempre 100 %?",
          a: "Os percentuais de padeiro são relativos ao peso da farinha, não ao total. Com a farinha como referência, cada ingrediente escala proporcionalmente quando o lote muda, e fórmulas de qualquer fonte se comparam diretamente: 65 % de hidratação significa a mesma coisa em qualquer lugar.",
        },
        {
          q: "Qual hidratação meu pão deve ter?",
          a: "Pães de forma e enriquecidos ficam entre 60–68 %; os artesanais rústicos entre 70–85 %; a focaccia pode passar de 85 %. Mais hidratação significa massa mais úmida, alvéolos maiores e casca mais crocante — e um manuseio mais grudento.",
        },
        {
          q: "Os percentuais precisam somar 100?",
          a: "Não — só a farinha é 100 %. Os demais percentuais são cada uma uma parcela do peso da farinha, então uma massa básica soma bem mais que 100 % no total (100 farinha + 65 água + 2 sal + 1 fermento).",
        },
        {
          q: "Os gramas são exatos?",
          a: "A aritmética é exata: 2 % de 500 g são exatamente 10 g. As fornadas reais variam com a marca da farinha e a umidade — justamente por isso os padeiros pesam em vez de medir por volume.",
        },
      ],
    },
  },
  related: ["recipe-scaler", "serving-adjuster"],
});
