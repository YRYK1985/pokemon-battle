import Script from 'next/script';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') || '';
  const isJa = acceptLang.toLowerCase().startsWith('ja');

  if (isJa) {
    return {
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
      icons: { icon: '/favicon.svg' },
    };
  }

  return {
    title: 'Pokémon Popularity Battle',
    description: 'Vote for your favorite Pokémon! Fan-driven Elo rating rankings for all 1025 Pokémon.',
    openGraph: {
      title: 'Pokémon Popularity Battle',
      description: 'Which Pokémon do you prefer? Tap to vote!',
      type: 'website',
      images: [{ url: 'https://www.poke-vote.com/ogp-en.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pokémon Popularity Battle',
      description: 'Which Pokémon do you prefer? Tap to vote!',
      images: ['https://www.poke-vote.com/ogp-en.png'],
    },
    icons: { icon: '/favicon.svg' },
  };
}

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
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
