// Logo case studies transcribed from the Figma mockups
// (web-alur-pagedetail.png, web-ibu-hilmi-pagedetail.png).
// Symbols are redrawn as SVG from the mockup geometry (1 unit = 1px at 1920 wide).
// Elements with class "tint" take the brand colour on the colour tiles.

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

export interface Sym {
  vb: string;
  body: string; // SVG children
}

export interface LogoStudy {
  name: string; // wordmark text
  theme: {
    dark: string; // dark section background
    tileBg: string; // colour-row tile background
    tileInk: string; // colour-row wordmark / untinted parts
    tint: string; // colour-row tinted parts
    highlight: string; // selected-concept lockup panel
    wmFont: string;
    wmTrack: string;
  };
  // sizes in rem: [horizontal symbol, horizontal text, stacked symbol, stacked text, symbol tile, wordmark tile]
  tiles: [string, string, string, string, string, string];
  symbol: Sym;
  snapshot: [string, string][];
  snapshotNote: string;
  idea: string;
  cards: [string, string, string][];
  promise: string;
  principles: string[];
  architecture: [string, string, string][];
  preview: [string, string]; // symbol width, text size
  concepts: { title: string; route: string; desc: string; sym: Sym; big: string; dark: string; darkSmall: string; wordmarkFirst?: boolean }[];
  selected: { title: string; text: string; big: string; lockup: [string, string] };
  typeRows: [string, string][];
  kerning: string;
  sampleFont: string;
  swatches: { name: string; role: string; hex: string; rgb: string; cmyk: string; fg: string; border?: boolean }[];
  contrast: [string, string, string][];
}

const ALUR_A: Sym = {
  vb: '0 0 274 303',
  body: '<path class="tint" d="M0 0H58V137L108 188H166L216 137V58H274V137L166 245V303H108V245L0 137Z"/>',
};
const IBU_A: Sym = {
  vb: '0 0 290 302',
  body:
    '<rect x="59" width="47" height="151" rx="23.5"/><rect x="185" width="47" height="151" rx="23.5"/>' +
    '<rect x="100" y="57" width="90" height="37"/><path class="tint" d="M0 179H290A145 123 0 0 1 0 179Z"/>',
};

export const studies: Record<string, LogoStudy> = {
  alur: {
    name: 'ALUR',
    theme: {
      dark: '#102A43',
      tileBg: '#F4F8FC',
      tileInk: '#102A43',
      tint: '#2563EB',
      highlight: '#38BDF8',
      wmFont: "'Manrope Variable', 'Manrope', sans-serif",
      wmTrack: '0.06em',
    },
    tiles: ['3.1rem', '2.3rem', '3.15rem', '2.3rem', '4.8rem', '3.1rem'],
    symbol: ALUR_A,
    snapshot: [
      ['Brand name', 'ALUR — working name (provisional)'],
      ['Brand type', 'B2B SaaS / logistics-technology startup (fictional portfolio concept)'],
      ['Product', 'Digital operations platform for SME distributors, online sellers and local delivery operators'],
      ['Main functions', 'Order consolidation · route planning · dispatch coordination · delivery-status visibility · basic analytics'],
      ['Primary audience', 'MSMEs, D2C sellers, distributors, local fleet operators, logistics operations teams'],
      ['Positioning', 'A practical logistics-operations platform that helps businesses coordinate orders and deliveries more clearly'],
      ['Logo architecture', 'Abstract mark + wordmark → combination mark; symbol must work alone as app icon'],
      ['Style', 'Minimalist, flat, geometric, corporate, technology-led, reliable'],
    ],
    snapshotNote:
      'FICTIONAL / PROVISIONAL portfolio concept — name not checked for trademark, company-name, domain or social-handle availability.',
    idea: 'Many moving parts, one connected flow.',
    cards: [
      ['01', 'Reliable', 'Operationally dependable and clear.'],
      ['02', 'Intelligent', 'Data-aware; organises complex workflows.'],
      ['03', 'Efficient', 'Removes friction so delivery operations are easy to understand.'],
    ],
    promise: '“Every delivery, in a clearer flow.”',
    principles: [
      'Software, not a courier — no truck, pin, parcel box or road',
      'Calm and organised, not fast or aggressive',
      'Symbol must stand alone inside a square app icon',
      'No gradients; single-colour dark and reversed versions required',
    ],
    architecture: [
      ['Wordmark', 'Supporting', 'ALUR must stay legible at small sizes.'],
      ['Lettermark', 'Considered', 'A-derived route C only.'],
      ['Pictorial', 'Rejected', 'Literal truck / pin / box is off-category.'],
      ['Abstract', 'PRIMARY', 'Route geometry expresses flow without literal imagery.'],
      ['Mascot', 'Rejected', 'Wrong tone for B2B.'],
      ['Combination', 'PRIMARY LOCKUP', 'Abstract symbol + wordmark; symbol also the app icon.'],
      ['Emblem', 'Rejected', 'Too intricate for dashboards.'],
    ],
    preview: ['5rem', '3.5rem'],
    concepts: [
      {
        title: 'Concept A (Selected)',
        route: 'Route A — Converging routes',
        desc: 'Structured tracks merge into one clear channel: many moving parts, one connected flow.',
        sym: ALUR_A,
        big: '9rem',
        dark: '4.25rem',
        darkSmall: '1.85rem',
      },
      {
        title: 'Concept B',
        route: 'Route B — Connected modules',
        desc: 'Modular forms connect through shared negative space — integrated operations.',
        sym: {
          vb: '0 0 189 189',
          body:
            '<rect width="70" height="70" rx="14"/><rect x="119" width="70" height="70" rx="14"/>' +
            '<rect x="60" y="119" width="70" height="70" rx="14"/><rect x="60" y="24" width="70" height="24"/>' +
            '<rect x="82" y="40" width="25" height="85"/>',
        },
        big: '9.5rem',
        dark: '4.4rem',
        darkSmall: '1.9rem',
      },
      {
        title: 'Concept C',
        route: 'Route C — Abstract A / flow',
        desc: 'An A-derived symbol from route segments with a flow bar; compact app-icon shape.',
        sym: {
          vb: '0 0 190 200',
          body: '<path d="M60 0H95L44 200H0ZM95 0H130L190 200H146ZM62 114H128V147H62Z"/>',
        },
        big: '9.5rem',
        dark: '4.4rem',
        darkSmall: '1.85rem',
      },
    ],
    selected: {
      title: 'Selected: A — Converging routes',
      text:
        'Chosen because it expresses the product idea — separate routes becoming one channel — without a truck, pin or arrow. Unequal entry heights add direction, and the solid silhouette holds inside a square app icon. Risk to monitor: reading as a Y. B is generic network imagery; C is the least abstract.',
      big: '13.7rem',
      lockup: ['3.9rem', '2.4rem'],
    },
    typeRows: [
      ['Wordmark', 'Manrope ExtraBold · +6% letter-spacing'],
      ['Supporting', 'Inter (UI and body)'],
      ['Spelling', 'Exact: ALUR (not shortened or auto-corrected)'],
      ['Font substitution', 'None — all families available in Figma'],
    ],
    kerning:
      'Open spacing keeps ALUR readable at small sizes. Only global tracking was set; per-pair kerning (A–L, L–U) is an open refinement.',
    sampleFont: "'Manrope Variable', 'Manrope', sans-serif",
    swatches: [
      { name: 'Deep navy', role: 'Primary', hex: '#102A43', rgb: '16, 42, 67', cmyk: '76/37/0/74', fg: '#fff' },
      { name: 'Cobalt blue', role: 'Brand blue', hex: '#2563EB', rgb: '37, 99, 235', cmyk: '84/58/0/8', fg: '#fff' },
      { name: 'Clear cyan', role: 'Accent', hex: '#38BDF8', rgb: '56, 189, 248', cmyk: '77/24/0/3', fg: '#102A43' },
      { name: 'Cloud white', role: 'Light background', hex: '#F4F8FC', rgb: '244, 248, 252', cmyk: '3/2/0/1', fg: '#111', border: true },
      { name: 'Slate', role: 'Neutral', hex: '#64748B', rgb: '100, 116, 139', cmyk: '28/17/0/45', fg: '#fff' },
    ],
    contrast: [
      ['Deep navy on cloud white', '13.72 : 1', 'AAA (text)'],
      ['White on cobalt', '5.17 : 1', 'AA (text)'],
      ['Deep navy on cyan', '6.83 : 1', 'AA (text)'],
      ['Slate on cloud white', '4.46 : 1', 'Large text / graphics only'],
    ],
  },

  'ibu-hilmi': {
    name: 'IBU HILMI',
    theme: {
      dark: '#29231F',
      tileBg: '#FFF4E7',
      tileInk: '#29231F',
      tint: '#B84C3A',
      highlight: '#E3B35B',
      wmFont: "'Nunito Sans Variable', 'Nunito Sans', sans-serif",
      wmTrack: '0.02em',
    },
    tiles: ['3.25rem', '1.6rem', '3.75rem', '1.85rem', '5rem', '3.05rem'],
    symbol: IBU_A,
    snapshot: [
      ['Brand name', 'IBU HILMI — exact spelling preserved'],
      ['Brand type', 'Small food business, everyday home-style food (working assumption)'],
      ['Working category', 'Indonesian home-cooked meals / masakan rumahan — unconfirmed'],
      ['Primary audience', 'Nearby residents, workers, students, families, takeaway customers'],
      ['Positioning', 'A simple, familiar, approachable place for comforting everyday meals'],
      ['Brand promise', 'Food that feels familiar, welcoming, and dependable'],
      ['Logo architecture', 'Pictorial mark + wordmark → combination mark; optional compact stamp / badge'],
      ['Style', 'Minimalist, flat, warm, friendly, easy to reproduce'],
    ],
    snapshotNote: 'Working assumption only: everyday Indonesian home-style meals. Menu, location and service format are unconfirmed.',
    idea: 'The warmth of a home meal, expressed with simplicity.',
    cards: [
      ['01', 'Warm', 'Welcoming and familiar.'],
      ['02', 'Honest', 'Simple, approachable, trustworthy.'],
      ['03', 'Comforting', 'Evokes everyday meals and a feeling of home.'],
    ],
    promise: 'Food that feels familiar, welcoming, and dependable.',
    principles: [
      'The name IBU HILMI stays the most important verbal element',
      'Sturdy shapes — no fine strokes that vanish on stickers or stamps',
      'Not luxury, not trendy fusion, not a chain',
      'Never depict Ibu Hilmi’s real appearance; no invented dish or biography',
    ],
    architecture: [
      ['Wordmark', 'Route C', 'Possible, but needs a food cue to read as food.'],
      ['Lettermark', 'Hidden only', 'H appears subtly in steam negative space.'],
      ['Pictorial', 'PRIMARY', 'A bowl is instantly food and easy to reproduce.'],
      ['Abstract', 'Rejected', 'Food must read at first glance.'],
      ['Mascot', 'Secondary', 'Not pursued; avoids inventing a character.'],
      ['Combination', 'PRIMARY LOCKUP', 'Bowl + name; both usable alone.'],
      ['Emblem', 'Optional', 'Stamp adaptation only, not the primary logo.'],
    ],
    preview: ['5.35rem', '2.2rem'],
    concepts: [
      {
        title: 'Concept A (Selected)',
        route: 'Route A — Steam H',
        desc: 'A simplified bowl with steam whose two stems and bar form a subtle H.',
        sym: IBU_A,
        big: '9.5rem',
        dark: '4.4rem',
        darkSmall: '1.8rem',
      },
      {
        title: 'Concept B',
        route: 'Route B — Shared table',
        desc: 'A top-view plate with three small servings: gathering and sharing.',
        sym: {
          vb: '0 0 200 200',
          body:
            `<path fill-rule="evenodd" d="${circle(100, 100, 100)}${circle(100, 100, 62)}"/>` +
            `<path d="${circle(100, 74, 19)}${circle(74, 119, 19)}${circle(126, 119, 19)}"/>`,
        },
        big: '10rem',
        dark: '4.6rem',
        darkSmall: '1.9rem',
      },
      {
        title: 'Concept C',
        route: 'Route C — Wordmark-first',
        desc: 'A friendly custom wordmark with a small restrained bowl signature.',
        sym: { vb: '0 0 92 88', body: `<path d="${circle(46, 12, 12)}M0 43H92A46 45 0 0 1 0 43Z"/>` },
        big: '4.6rem',
        dark: '2.2rem',
        darkSmall: '2.2rem',
        wordmarkFirst: true,
      },
    ],
    selected: {
      title: 'Selected: A — Steam H',
      text:
        'A and B tie on score (33 each). A is chosen on judgement: the bowl signals food, the steam signals warmth, and the H ties it to Hilmi — B is a generic ring. Risk to test: steam stems thin at 16 px and on stamps. C depends on the wordmark alone.',
      big: '14.5rem',
      lockup: ['4.1rem', '1.75rem'],
    },
    typeRows: [
      ['Wordmark', 'Nunito Sans ExtraBold · +2% letter-spacing'],
      ['Supporting', 'Nunito Sans Regular / Bold'],
      ['Spelling', 'Exact: IBU HILMI (not shortened or auto-corrected)'],
      ['Font substitution', 'None — all families available in Figma'],
      ['Descriptor', 'MASAKAN RUMAHAN — optional, if menu matches'],
    ],
    kerning: 'Weights are sturdy to stay legible from a distance on signage. Only global tracking was set; per-pair kerning is open.',
    sampleFont: "'Nunito Sans Variable', 'Nunito Sans', sans-serif",
    swatches: [
      { name: 'Warm terracotta', role: 'Primary', hex: '#B84C3A', rgb: '184, 76, 58', cmyk: '0/59/68/28', fg: '#fff' },
      { name: 'Warm charcoal', role: 'Dark neutral', hex: '#29231F', rgb: '41, 35, 31', cmyk: '0/15/24/84', fg: '#fff' },
      { name: 'Cream', role: 'Light background', hex: '#FFF4E7', rgb: '255, 244, 231', cmyk: '0/4/9/0', fg: '#29231F', border: true },
      { name: 'Leaf green', role: 'Secondary accent', hex: '#456B4A', rgb: '69, 107, 74', cmyk: '36/0/31/58', fg: '#fff' },
      { name: 'Soft mustard', role: 'Optional highlight', hex: '#E3B35B', rgb: '227, 179, 91', cmyk: '0/21/60/11', fg: '#29231F' },
    ],
    contrast: [
      ['Charcoal on cream', '14.28 : 1', 'AAA (text)'],
      ['Terracotta on cream', '4.68 : 1', 'AA (text)'],
      ['White on terracotta', '5.08 : 1', 'AA (text)'],
      ['Leaf green on cream', '5.60 : 1', 'AA (text)'],
    ],
  },
};
