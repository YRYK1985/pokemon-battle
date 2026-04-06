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
      intro: '「ポケモン 人気バトル」は、全1,025体のポケモンの中から2体がランダムに登場し、「どっちが好き？」を選んで投票するファン参加型の人気ランキングサイトです。投票には統計的に信頼性の高いEloレーティングシステムを採用しており、少ない投票数でも公平な順位を算出できます。',
      howTitle: '遊び方',
      howDesc: '①投票画面に2体のポケモンが表示されます。②好きな方をタップするだけで投票完了。③5回投票するとランキング画面が解放されます。④「詳しい情報」ボタンで分類・身長・体重・図鑑説明文も確認できます。世代フィルターを切り替えれば、カントーだけ・ジョウトだけといった絞り込み投票も楽しめます。',
      eloTitle: 'Eloレーティングとは',
      eloDesc: 'チェスや将棋などの対戦競技で広く使われる統計的なレーティングシステムです。強い（人気の高い）ポケモンに勝つとレーティングが大きく上がり、格下の相手に勝っても少ししか上がりません。全ポケモンは初期レーティング1,200からスタートし、投票が積み重なるほど信頼性の高い順位が算出されます。勝率・対戦数も個別ページで確認できます。',
      pokemonTitle: '対象ポケモン',
      pokemonDesc: '第1世代（カントー・151体）から第9世代（パルデア・120体）までの全1,025体が対象です。メガシンカ・リージョンフォーム・キョダイマックスなどのフォルム違いは含まれていません。ポケモンのデータ（名前・タイプ・種族値・画像・分類など）はPokéAPI（pokeapi.co）から取得しています。',
      filterTitle: '世代フィルター',
      filterDesc: 'ランキングは全世代一覧のほか、世代（地方）ごとに絞り込んで閲覧できます。カントー（第1世代）・ジョウト（第2世代）・ホウエン（第3世代）・シンオウ（第4世代）・イッシュ（第5世代）・カロス（第6世代）・アローラ（第7世代）・ガラル（第8世代）・パルデア（第9世代）の9地方に対応しています。投票も同様に世代ごとに絞り込んで楽しめます。',
      statsTitle: '詳しい情報ボタンについて',
      statsDesc: '投票カードの「詳しい情報」ボタンを押すと、そのポケモンの分類（〇〇ポケモン）・身長・体重・図鑑説明文を確認できます。両方のカードが同時に開閉します。個別ページではさらに詳しいランキングデータや種族値も確認できます。',
      faqTitle: 'よくある質問',
      faq: [
        { q: '投票は何回でもできますか？', a: 'はい、何回でも投票できます。投票するたびにランキングが更新されていきます。' },
        { q: 'ランキングは全ユーザーの投票結果ですか？', a: 'はい、全ユーザーの投票を集計したグローバルランキングです。あなたの投票がリアルタイムで反映されます。' },
        { q: '気に入ったポケモンを詳しく調べるには？', a: 'ランキングページや詳細ページでポケモン名をタップすると、個別ページでランキング順位・勝率・種族値などを確認できます。' },
        { q: 'スキップはできますか？', a: 'はい、「この組み合わせをスキップ」ボタンで別の組み合わせに切り替えられます。' },
      ],
      operatorTitle: '運営について',
      operatorDesc: 'ポケモンに関する著作権はすべて株式会社ポケモン・任天堂に帰属します。本サイトはファンによる非公式のランキングサービスです。',
      lastUpdate: '最終更新: 2026年4月',
    },
    en: {
      backLink: '← Back to Top',
      title: 'About Pokémon Popularity Battle',
      intro: 'Pokémon Popularity Battle is a fan-driven ranking site where two Pokémon are randomly selected from all 1,025 Pokémon, and you vote on which one you prefer. We use the Elo rating system to produce statistically reliable rankings even with relatively few votes.',
      howTitle: 'How to Play',
      howDesc: '① Two Pokémon appear on screen. ② Tap the one you like more to vote. ③ After 5 votes, the full ranking is unlocked. ④ Tap the "Details" button to see each Pokémon\'s classification, height, weight, and Pokédex entry. You can also filter by generation to vote only among Kanto, Johto, or any other region.',
      eloTitle: 'What is the Elo Rating?',
      eloDesc: 'The Elo rating system is widely used in competitive games like chess. Beating a highly-rated (popular) Pokémon gives a large rating boost, while beating a lower-rated one gives little. All Pokémon start at 1,200, and rankings become more reliable as votes accumulate. Win rate and match count are also visible on individual Pokémon pages.',
      pokemonTitle: 'Pokémon Included',
      pokemonDesc: 'All 1,025 Pokémon from Generation 1 (Kanto, 151) to Generation 9 (Paldea, 120) are included. Mega Evolutions, Regional Forms, and Gigantamax forms are not included. Pokémon data (names, types, base stats, images, classification, etc.) is sourced from PokéAPI (pokeapi.co).',
      filterTitle: 'Generation Filter',
      filterDesc: 'You can view all generations at once, or filter by specific region: Kanto (Gen 1), Johto (Gen 2), Hoenn (Gen 3), Sinnoh (Gen 4), Unova (Gen 5), Kalos (Gen 6), Alola (Gen 7), Galar (Gen 8), and Paldea (Gen 9). The same filter applies to voting, so you can vote within a single generation.',
      statsTitle: 'About the Details Button',
      statsDesc: 'Tap the "Details" button on a voting card to see that Pokémon\'s classification, height, weight, and Pokédex entry. Both cards open and close together. On individual Pokémon pages, you can also view full ranking data and base stats.',
      faqTitle: 'FAQ',
      faq: [
        { q: 'Can I vote as many times as I want?', a: 'Yes! You can vote as many times as you like. Rankings update with every vote.' },
        { q: 'Is the ranking based on all users\' votes?', a: 'Yes, it\'s a global ranking aggregating all user votes, updated in real time.' },
        { q: 'How can I see more details about a Pokémon?', a: 'Tap a Pokémon\'s name on the ranking or detail page to view its individual stats, rank, win rate, and more.' },
        { q: 'Can I skip a matchup?', a: 'Yes! Tap "Skip this matchup" to get a different pair of Pokémon.' },
      ],
      operatorTitle: 'About the Operator',
      operatorDesc: 'All Pokémon-related copyrights belong to The Pokémon Company and Nintendo. This is an unofficial fan ranking service.',
      lastUpdate: 'Last updated: April 2026',
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
          <p style={s.text}>{c.intro}</p>

          <h2 style={s.sectionTitle}>{c.howTitle}</h2>
          <p style={s.text}>{c.howDesc}</p>

          <h2 style={s.sectionTitle}>{c.eloTitle}</h2>
          <p style={s.text}>{c.eloDesc}</p>

          <h2 style={s.sectionTitle}>{c.pokemonTitle}</h2>
          <p style={s.text}>{c.pokemonDesc}</p>

          <h2 style={s.sectionTitle}>{c.filterTitle}</h2>
          <p style={s.text}>{c.filterDesc}</p>

          <h2 style={s.sectionTitle}>{c.statsTitle}</h2>
          <p style={s.text}>{c.statsDesc}</p>
        </div>

        {/* FAQ */}
        <div style={s.card}>
          <h2 style={{ ...s.title, fontSize: 20, marginBottom: 16 }}>{c.faqTitle}</h2>
          {c.faq.map((item, i) => (
            <div key={i} style={{ marginBottom: i < c.faq.length - 1 ? 16 : 0 }}>
              <p style={{ ...s.text, fontWeight: 700, color: '#3B4CCA', margin: '0 0 4px' }}>Q. {item.q}</p>
              <p style={{ ...s.text, margin: 0, paddingLeft: 12 }}>A. {item.a}</p>
            </div>
          ))}
        </div>

        {/* 運営について */}
        <div style={s.card}>
          <h2 style={{ ...s.title, fontSize: 20, marginBottom: 12 }}>{c.operatorTitle}</h2>
          <p style={s.text}>{c.operatorDesc}</p>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#A0926E' }}>
          {c.lastUpdate}
        </div>
      </div>
    </div>
  );
}
