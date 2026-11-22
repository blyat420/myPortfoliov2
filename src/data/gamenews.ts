// Instagram Carousel – Game News. Slides live in /public/projects/game-news.
// Each post = 4 slides (cover, overview, gameplay, highlight) + link to the real IG post.

export interface CarouselPost {
  n: number;
  title: string;
  desc: string;
  slug: string; // image file prefix
  link: string;
  bg: string; // section background
  dark: boolean; // true = light text
}

const kinds = ['cover', 'overview', 'gameplay', 'highlight'];

export const gameNewsSlides = (p: CarouselPost) =>
  kinds.map((k, i) => ({
    src: `/projects/game-news/${p.slug}-${i + 1}-${k}.webp`,
    alt: `${p.title} — slide ${i + 1} (${k})`,
  }));

export const gameNewsPosts: CarouselPost[] = [
  {
    n: 1,
    title: 'Vice City',
    desc: 'A game that everyone has been waiting for, 13 years of waiting and now it finally came. GTA VI',
    slug: 'gta6',
    link: 'https://www.instagram.com/p/Df7X0QEIzaa/?fqnt=MTB1Z2d2aG0wOWw0MA==',
    bg: '#f1f1f1',
    dark: false,
  },
  {
    n: 2,
    title: 'RE 9 Requiem',
    desc: 'An Old Series that reaching its peak, Leon is back with a new story to cover, and a new Character?',
    slug: 're9',
    link: 'https://www.instagram.com/p/Df7X7k0I4pB/?dmpr=MTFoNjA1aDFzcnBoNQ==',
    bg: '#1c1c1c',
    dark: true,
  },
  {
    n: 3,
    title: 'Forza Horizon',
    desc: 'The Horizon Festival heads to Japan: 550+ cars, endless roads, and a legend to become. Forza Horizon 6',
    slug: 'fh6',
    link: 'https://www.instagram.com/p/Df7YIv3I3Fm/?knvt=eGYxMzg2ZGtoMWdl',
    bg: '#f1f1f1',
    dark: false,
  },
  {
    n: 4,
    title: 'Pokemon Pokopia',
    desc: 'A cozy new life as a Ditto, rebuilding a quiet world into a home for Pokémon. Pokémon Pokopia',
    slug: 'pokopia',
    link: 'https://www.instagram.com/p/Df7YWcIIy5o/?gwpx=Njl4ZWwycnlmNzB1',
    bg: '#16291c',
    dark: true,
  },
  {
    n: 5,
    title: 'Pragmata',
    desc: 'An astronaut and a young android stranded on the moon, finding a way home together. Pragmata',
    slug: 'pragmata',
    link: 'https://www.instagram.com/p/Df7Yl0Low4S/?evlk=MXhrYTVjZW84NXNvaw==',
    bg: '#f1f1f1',
    dark: false,
  },
  {
    n: 6,
    title: 'Saros',
    desc: 'Every death makes you stronger. Fight through the shape-shifting world of Carcosa. Saros',
    slug: 'saros',
    link: 'https://www.instagram.com/p/Df7Y2p_I2NU/?jplx=NnV4aXN2ZW96MGFl',
    bg: '#1d1108',
    dark: true,
  },
  {
    n: 7,
    title: 'Phantom Blade Zero',
    desc: 'An elite assassin has 66 days left to uncover the truth in a kungfupunk world. Phantom Blade Zero',
    slug: 'phantom',
    link: 'https://www.instagram.com/p/Df7ZBgvIxRB/?gwpx=M3c5c2wza2NwZGRw',
    bg: '#f1f1f1',
    dark: false,
  },
  {
    n: 8,
    title: 'Mewgenics',
    desc: 'Breed cats, build a team, and survive turn-based chaos where no two runs are the same. Mewgenics',
    slug: 'mewgenics',
    link: 'https://www.instagram.com/p/Df7ZLpFo_-4/?bqrl=MXA4MnV0djdtMWljag==',
    bg: '#2a1740',
    dark: true,
  },
  {
    n: 9,
    title: 'Big Walk',
    desc: 'Get lost together in a wide-open world built for 2–12 players. Big Walk',
    slug: 'bigwalk',
    link: 'https://www.instagram.com/p/Df7ZYcpo94J/?lqvp=MWc1dzE3NmxrbzN5cg==',
    bg: '#f1f1f1',
    dark: false,
  },
];
