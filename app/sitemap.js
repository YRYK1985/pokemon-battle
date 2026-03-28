let POKEMON = [];
try {
  POKEMON = require('../lib/pokemon.json');
} catch (e) {}

export default function sitemap() {
  const base = 'https://pokemon-battle.vercel.app'; // デプロイ後にドメイン変更

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const pokemonPages = POKEMON.map((p) => ({
    url: `${base}/pokemon/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPages, ...pokemonPages];
}
