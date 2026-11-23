import systems from './systems.json';

/**
 * All editable content lives here. Replace placeholder files in /public
 * (same file name) and the site picks them up with no code changes.
 */

export const profile = {
  name: 'Rizal Jamalul Lail',
  brand: 'LLAMAAAJ',
  about: [
    'i maketh designs, videos, ui ux , games, and websites.',
    "I enjoy turning ideas and user needs into simple, engaging, and functional digital experiences. I'm constantly learning, exploring new design approaches, and improving my skills through projects, competitions, and creative work.",
    'As you can see from the previous reference (Elden Ring throne), my hobby is gaming. Also I like to read Manhwa.',
  ],
  education: [
    {
      years: '2023 – Present',
      title: 'Bachelor System Information',
      place: 'Institute Technology and Business Stikom Bali.',
    },
    {
      years: '2020 – 2023',
      title: 'Multimedia',
      place: 'SMKN 1 Kuta Selatan',
    },
  ],
};

// PLACEHOLDER art: replace these files, keep the paths (or change the paths here).
// you standing on the rock (from assets (all)/rocks.png, re-encoded to WebP)
export const heroFigure = '/hero/rocks.webp';

export const toolRows: { name: string; src: string }[][] = [
  [
    { name: 'Photoshop', src: '/tools/photoshop.svg' },
    { name: 'Figma', src: '/tools/figma.svg' },
    { name: 'Illustrator', src: '/tools/illustrator.svg' },
    { name: 'Canva', src: '/tools/canva.svg' },
    { name: 'InDesign', src: '/tools/indesign.svg' },
  ],
  [
    { name: 'Premiere Pro', src: '/tools/premiere.svg' },
    { name: 'After Effects', src: '/tools/aftereffects.svg' },
    { name: 'CapCut', src: '/tools/capcut.svg' },
    { name: 'Microsoft Office', src: '/tools/microsoft.svg' },
    { name: 'Blender', src: '/tools/blender.svg' },
  ],
  [
    { name: 'Godot', src: '/tools/godot.svg' },
    { name: 'VS Code', src: '/tools/vscode.svg' },
    { name: 'Unity', src: '/tools/unity.svg' },
    { name: 'Python', src: '/tools/python.svg' },
    { name: 'ChatGPT', src: '/tools/chatgpt.svg' },
    { name: 'Claude', src: '/tools/claude.svg' },
    { name: 'Gemini', src: '/tools/gemini.svg' },
  ],
];

export const contact = [
  { label: 'WhatsApp', value: '+62 821 4694 3003', href: 'https://wa.me/6282146943003' },
  { label: 'Instagram', value: '@llamaaaj', href: 'https://www.instagram.com/llamaaaj' },
  { label: 'LinkedIn', value: 'rizaljamalullail', href: 'https://www.linkedin.com/in/rizaljamalullail/' },
];

export const resumeHref = 'https://drive.google.com/drive/folders/1VMohCFg0M7Hh_inbC1OxGoq19hOBjIwu?usp=drive_link';

export type FolderId = 'graphic' | 'system' | 'video';

/** System projects imported from the old portfolio (jamalismportfolio.vercel.app) */
export type SystemDetail = (typeof systems)[number];

export interface Project {
  slug: string;
  folder: FolderId;
  title: string; // card caption title
  description: string; // card caption text
  cover: string; // 16:9 card image
  coverAlt: string;
  system?: SystemDetail;
}

export const folders: { id: FolderId; label: string; icon: string }[] = [
  { id: 'graphic', label: 'Graphic Design', icon: '/folders/design.svg' },
  { id: 'system', label: 'System', icon: '/folders/system.svg' },
  { id: 'video', label: 'Video', icon: '/folders/video.svg' },
];

// Order = carousel order. First item of a folder is the one centred on open.
export const projects: Project[] = [
  {
    slug: 'lenusa',
    folder: 'graphic',
    title: 'Lenusa - Graphic Design Intern',
    description: 'Things I do and make while working as an intern in PT. Lenusa Konsultan Indonesia.',
    cover: '/projects/lenusa/cover.webp',
    coverAlt: 'Lenusa.id logo on white',
  },
  {
    slug: 'llamaaaj',
    folder: 'graphic',
    title: 'Logo Design - LLAMAAAJ',
    description: 'This is a personal project making my own brand logo.',
    cover: '/projects/llamaaaj/cover.svg',
    coverAlt: 'LLAMAAAJ logo on black',
  },
  {
    slug: 'alur',
    folder: 'graphic',
    title: 'Logo Design - ALUR',
    description: 'A fictional portfolio concept: a logo identity for a logistics-operations platform.',
    cover: '/projects/alur/cover.svg',
    coverAlt: 'Alur logo on pale blue',
  },
  {
    slug: 'ibu-hilmi',
    folder: 'graphic',
    title: 'Logo Design - IBU HILMI',
    description: 'A portfolio logo identity study for a small home-style food business.',
    cover: '/projects/ibu-hilmi/cover.svg',
    coverAlt: 'Ibu Hilmi logo on cream',
  },
  {
    slug: 'random-design',
    folder: 'graphic',
    title: 'Random Design',
    description: 'Carousels, decks, proposals, infographics, characters, stickers and memes that do not fit anywhere else.',
    cover: '/projects/random-design/cover.webp',
    coverAlt: 'Me composited into a Minecraft night scene with a creeper and a music player',
  },
  {
    slug: 'festika-8',
    folder: 'graphic',
    title: 'Festika 8',
    description: 'A gallery of what I made for Festika 8 as Creative Team Lead.',
    cover: '/projects/festika-8/cover.webp',
    coverAlt: 'Festika logo on white',
  },
  {
    slug: 'game-news',
    folder: 'graphic',
    title: 'Instagram Carousel - Game News',
    description: 'A portfolio of Instagram Carousel Post',
    cover: '/projects/game-news/cover.webp',
    coverAlt: 'Instagram carousel slides for GTA VI, Resident Evil Requiem and Forza Horizon 6',
  },
  {
    slug: 'brand-guidelines',
    folder: 'graphic',
    title: 'Brand Guidelines (ALL)',
    description: 'A portfolio Making Brand Guidelines for Business',
    cover: '/projects/brand-guidelines/cover.webp',
    coverAlt: 'Brand guideline cover slides for Litologi, LLAMAAAJ, ALUR and Ibu Hilmi',
  },
  ...systems.map(
    (s): Project => ({
      slug: s.slug,
      folder: 'system',
      title: s.title,
      description: s.subtitle,
      cover: s.cover,
      coverAlt: `${s.title} preview`,
      system: s,
    })
  ),
];
