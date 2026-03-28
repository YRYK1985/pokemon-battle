export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://pokemon-battle.vercel.app/sitemap.xml',
  };
}
