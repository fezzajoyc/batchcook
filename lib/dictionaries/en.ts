// en is the typing source of truth: every other dictionary must satisfy Dictionary.
// 刻意不加 as const:字符串需放宽为 string,翻译文件才可实现同一类型。
const en = {
  brand: "Batchcook",
  tagline: "Every tool runs in your browser.",
  metaDesc:
    "Free recipe tools: scale any recipe to any amount with fractions, adjust servings and compute baker's percentages — all in your browser, nothing uploaded.",

  nav: {
    tools: "All tools",
    categories: "Categories",
    about: "About",
    menu: "Menu",
    language: "Language",
  },

  home: {
    heroTitle: "Scale any recipe without doing fraction math in your head",
    heroSub:
      "{n} tools for scaling recipes, adjusting servings and computing baker's percentages. Paste a recipe, pick a factor — every ingredient recalculated, free, right in your browser.",
    browseAll: "Browse all tools",
    pinned: "Pinned",
    pin: "Pin to top",
    unpin: "Remove from pinned",
    popular: "Popular right now",
    categoriesTitle: "Categories",
    featuredTitle: "Popular tools",
    trustLocal: "Files stay on your device",
    trustFree: "Free, no account",
    trustFast: "Instant, works offline",
    rotating: [
      "Double a recipe for a crowd — ½ cups stay ½ cups, never 0.5",
      "3 eggs at half batch? Rounded to whole eggs, with a note",
      "Baker's percentages: 500 g of flour becomes your whole dough",
      "Paste the recipe as-is — cups, grams, spoons and eggs mixed together",
    ],
    statsLabels: { tools: "tools", languages: "languages", uploads: "uploads", accounts: "accounts" },
    eyebrow: "Free forever",
    heroCtaSecondary: "How it works",
    statsTools: "{n} tools",
    statsLanguages: "{n} languages",
    statsUploads: "0 uploads",
    statsAccounts: "0 accounts",
    categoriesSub: "Recipe math that runs on your device.",
    popularSub: "The tools people open most.",
    privacyTitle: "Your files never leave your device.",
    privacySub:
      "There is no upload step. The tools are JavaScript running in your browser — that is not a policy promise, it is how they are built.",
    privacyPoint1T: "Local processing",
    privacyPoint1D:
      "Files are read with the browser's own File API and processed in memory. Nothing is transmitted, anywhere.",
    privacyPoint2T: "No accounts",
    privacyPoint2D: "No sign-up, no email, no stored history. Open a tool and use it.",
    privacyPoint3T: "Honest by design",
    privacyPoint3D:
      "If something genuinely cannot be done in the browser, we say so instead of pretending.",
    privacyLink: "Read the full privacy note",
    endTitle: "Pick a tool. It just works.",
    endSub: "Fifteen languages, zero uploads, nothing to install.",
  },

  tools: {
    title: "All tools",
    subtitle: "Search {count} free browser tools. No upload, no signup.",
    filterPlaceholder: "Search tools…",
    count: "{count} tools",
    empty: "No tools match “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Merge, split, convert and edit PDF files without uploading them anywhere." },
    image: { name: "Image", desc: "Compress, resize, crop and convert images right in your browser." },
    text: { name: "Text", desc: "Count, clean, sort and transform text instantly as you type." },
    developer: { name: "Developer", desc: "Formatters, encoders, decoders and generators for daily dev work." },
    seo: { name: "SEO", desc: "Meta tags, schema markup, SERP preview and other on-page SEO helpers." },
    security: { name: "Security", desc: "Passwords, hashes and lookups — generated and checked on your device." },
    utility: { name: "Utility", desc: "Recipe scaling, serving adjustments and baker's percentages." },
  },

  tool: {
    howTo: "How to use",
    faq: "Frequently asked questions",
    related: "Related tools",
    nextStep: "Next steps",
    copyLink: "Copy link",
    privacyNote:
      "This tool runs entirely in your browser. Your data never leaves your device — it is not uploaded to any server.",
    inCategory: "More in {category}",
    backToCategory: "All {category} tools",
  },

  common: {
    openTool: "Open tool",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    reset: "Reset",
    swap: "Swap",
    clear: "Clear",
    error: "Something went wrong. Check your input and try again.",
    input: "Input",
    output: "Result",
    settings: "Options",
    dropFiles: "Drop files here or click to choose",
    dropFile: "Drop a file here or click to choose",
    processing: "Processing…",
    fileSize: "Size",
    sample: "Try an example",
    uppercase: "UPPERCASE",
  },

  unit: {
    from: "From",
    to: "To",
    amount: "Amount",
    result: "Result",
    common: "Common conversions",
    formula: "Formula",
    allUnits: "All units",
  },

  text: {
    stats: {
      words: "Words",
      characters: "Characters",
      charsNoSpaces: "No spaces",
      sentences: "Sentences",
      paragraphs: "Paragraphs",
      lines: "Lines",
      readingTime: "Reading time",
      readingMinutes: "{n} min read",
    },
  },

  footer: {
    line: "Free recipe tools. Nothing you cook up here leaves your device.",
    privacy: "Privacy",
    terms: "Terms",
    about: "About",
    badges: "Badges",
    language: "Language",
  },

  badge: {
    title: "Batchcook badges",
    desc: "Put a Batchcook badge on your site, README or docs. It links back here and tells people the recipe tools behind it run entirely in the browser.",
    voluntary: "Embedding is completely voluntary — pick a badge if you like the project. No permission needed.",
    md: "Markdown (README)",
    html: "HTML (website)",
    thanks: "Thanks for spreading the word — every embed helps more people discover tools that respect their files.",
  },

    embed: {
    title: "Embed this tool",
    desc: "Put this tool on your own site with one line — it runs entirely in the visitor's browser.",
  },

    mcp: {
    title: "MCP server — AI-accessible tools",
    desc1: "Batchcook ships an MCP (Model Context Protocol) server: AI assistants like Claude or Cursor can scale recipes and compute baker's percentages with the same tested logic you see on this site — no reimplementation.",
    desc2: "The tools run the site's own pure functions for recipe scaling, fraction display and baker's math. Execution happens on the AI client's machine via npx — nothing is sent to our servers.",
    toolsTitle: "Executable tools ({n})",
    requiresNode: "Requires Node.js 18+. The server runs locally over stdio; only the tool calls you make are computed on your machine.",
    privacy: "Requires Node.js 18+. The server runs locally over stdio; only the tool calls you make are computed on your machine.",
  },

    notFound: {
    title: "Page not found",
    body: "The tool you are looking for does not exist. Browse all tools instead.",
    home: "Go to homepage",
  },
};

export default en;
