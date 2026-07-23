export default function sitemap() {
  const base = 'https://www.poke-vote.com';

  // 静的ページ
  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/ranking`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 記事ページ（コンテンツの主力）
  const articleSlugs = [
    'pokemon-types',
    'pokemon-stats',
    'pokemon-generations',
    'pokemon-type-stats',
    'pokemon-size',
    'pokemon-gen1-vs-gen9',
    'stat-extremes',
    'generation-power',
    'monotype-dual',
    'name-length',
    'starters',
    'elo-guide',
  ];
  const articlePages = articleSlugs.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ポケモン個別ページ（1,025件）はsitemapから除外（noindex化済み）。
  // データの薄いページを大量にインデックスさせると
  // 「有用性の低いコンテンツ」判定の主因になるため。
  return [...staticPages, ...articlePages];
}
