let POKEMON = [];
try {
  POKEMON = require('../lib/pokemon.json');
} catch (e) {}

export default function sitemap() {
  const base = 'https://www.poke-vote.com';

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const pokemonPages = POKEMON.map((p) => ({
    url: `${base}/pokemon/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPages, ...pokemonPages];
}
