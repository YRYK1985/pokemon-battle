'use client';

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poke-lang');
      if (saved) return saved;
      return navigator.language?.startsWith('ja') ? 'ja' : 'en';
    }
    return 'ja';
  });

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('poke-lang', l);
  };

  useEffect(() => {
    document.title = lang === 'ja' ? 'このサイトについて | ポケモン 人気バトル' : 'About | Pokémon Popularity Battle';
  }, [lang]);

  const FONT = "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const content = {
    ja: {
      backLink: '← トップに戻る',
      title: 'ポケモン 人気バトルについて',
      intro: '「ポケモン 人気バトル」は、全1025体のポケモンの中から2体がランダムに登場し、「どっちが好き？」を選んで投票するファン参加型の人気ランキングサイトです。',
      eloTitle: 'Eloレーティングとは',
      eloDesc: 'チェスなどの対戦競技で使われるレーティングシステムです。強い（人気の高い）ポケモンに勝つとレーティングが大きく上がり、弱い相手に勝っても少ししか上がりません。すべてのポケモンは初期レーティング1200からスタートします。',
      pokemonTitle: '対象ポケモン',
      pokemonDesc: '第1世代（カントー）から第9世代（パルデア）までの全1025体が対象です。メガシンカ・リージョンフォーム・キョダイマックスなどのフォーム違いは含まれていません。',
      filterTitle: '世代フィルター',
      filterDesc: 'ランキングは全世代一覧のほか、世代（地方）ごとに絞り込んで閲覧できます。カントー、ジョウト、ホウエン、シンオウ、イッシュ、カロス、アローラ、ガラル、パルデアの9地方に対応しています。',
      dataTitle: 'データについて',
      dataDesc: 'ポケモンのデータ（名前・タイプ・種族値・画像など）はPokéAPI（pokeapi.co）から取得しています。投票データはリアルタイムで集計され、ランキングに反映されます。',
      lastUpdate: '最終更新: 2026年3月28日',
    },
    en: {
      backLink: '← Back to Top',
      title: 'About Pokémon Popularity Battle',
      intro: 'Pokémon Popularity Battle is a fan-driven ranking site where two Pokémon are randomly selected from all 1025 Pokémon, and you vote on which one you prefer.',
      eloTitle: 'What is the Elo Rating?',
      eloDesc: 'The Elo rating system is used in competitive games like chess. When you vote for a popular Pokémon, its rating increases significantly. When you vote for a less popular one, the increase is smaller. All Pokémon start with an initial rating of 1200.',
      pokemonTitle: 'Pokémon Included',
      pokemonDesc: 'All 1025 Pokémon from Generation 1 (Kanto) to Generation 9 (Paldea) are included. Mega Evolution forms, Regional forms, and Gigantamax forms are not included.',
      filterTitle: 'Generation Filter',
      filterDesc: 'You can view the ranking of all generations, or filter by specific regions. The 9 regions supported are Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, and Paldea.',
      dataTitle: 'About the Data',
      dataDesc: 'Pokémon data (names, types, base stats, images, etc.) is obtained from PokéAPI (pokeapi.co). Vote data is collected in real-time and reflected in the rankings.',
      lastUpdate: 'Last updated: March 28, 2026',
    },
  };

  const c = content[lang];

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)',
      color: '#2D3748',
      fontFamily: FONT,
      padding: '20px',
    },
    container: {
      maxWidth: 700,
      margin: '0 auto',
    },
    langToggle: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      zIndex: 100,
      display: 'flex',
      gap: '2px',
      background: '#fff',
      borderRadius: '16px',
      padding: '2px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    langButton: (isActive) => ({
      padding: '4px 10px',
      borderRadius: '14px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: FONT,
      background: isActive ? '#3B4CCA' : 'transparent',
      color: isActive ? '#fff' : '#8B7B5E',
      transition: 'all 0.2s',
    }),
    backLink: {
      display: 'inline-block',
      color: '#3B4CCA',
      textDecoration: 'none',
      marginBottom: 20,
      fontSize: 14,
      fontWeight: 700,
      marginTop: 50,
    },
    card: {
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      border: '1px solid rgba(255,203,5,0.25)',
      boxShadow: '0 2px 12px rgba(255,203,5,0.1)',
    },
    title: {
      fontSize: 24,
      fontWeight: 800,
      color: '#3B4CCA',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: '#3B4CCA',
      marginBottom: 12,
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: 1.8,
      color: '#4A5568',
    },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* Language Toggle */}
      <div style={s.langToggle}>
        <button
          onClick={() => changeLang('ja')}
          style={s.langButton(lang === 'ja')}
        >
          🇯🇵 JA
        </button>
        <button
          onClick={() => changeLang('en')}
          style={s.langButton(lang === 'en')}
        >
          🇺🇸 EN
        </button>
      </div>

      <div style={s.container}>
        <a href="/" style={s.backLink}>{c.backLink}</a>

        <div style={s.card}>
          <h1 style={s.title}>{c.title}</h1>

          <p style={s.text}>
            {c.intro}
          </p>

          <h2 style={s.sectionTitle}>{c.eloTitle}</h2>
          <p style={s.text}>
            {c.eloDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.pokemonTitle}</h2>
          <p style={s.text}>
            {c.pokemonDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.filterTitle}</h2>
          <p style={s.text}>
            {c.filterDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.dataTitle}</h2>
          <p style={s.text}>
            {c.dataDesc}
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#A0926E' }}>
          {c.lastUpdate}
        </div>
      </div>
    </div>
  );
}
