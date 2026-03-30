import Script from 'next/script';
// AdSense審査用スクリプト（広告スロットは審査通過後に追加）

export const metadata = {
  title: 'ポケモン 人気バトル | Pokémon Popularity Battle',
  description: '全1025体のポケモンから「どっちが好き？」を選んで投票！ファンの投票だけで決まるEloレーティングランキング。Vote for your favorite from all 1025 Pokémon!',
  openGraph: {
    title: 'ポケモン 人気バトル | Pokémon Popularity Battle',
    description: '全1025体のポケモンから「どっちが好き？」を選んで投票！Which Pokémon do you prefer? Tap to vote!',
    type: 'website',
    images: [{ url: 'https://www.poke-vote.com/ogp.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ポケモン 人気バトル | Pokémon Popularity Battle',
    description: '全1025体のポケモンから「どっちが好き？」を選んで投票！Which Pokémon do you prefer? Tap to vote!',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2V19NHYH1C"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2V19NHYH1C');
          `}
        </Script>
      </head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9862215132601373"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
