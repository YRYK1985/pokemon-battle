export const metadata = {
  title: 'ポケモン 人気バトル',
  description: '全1025体のポケモンから「どっちが好き？」を選んで投票！ファンの投票だけで決まるEloレーティングランキング。',
  openGraph: {
    title: 'ポケモン 人気バトル',
    description: '全1025体のポケモンから「どっちが好き？」を選んで投票！',
    type: 'website',
    images: [{ url: 'https://www.poke-vote.com/ogp.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ポケモン 人気バトル',
    description: '全1025体のポケモンから「どっちが好き？」を選んで投票！',
    images: ['https://www.poke-vote.com/ogp.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
