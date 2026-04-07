'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
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
    document.title = lang === 'ja' ? 'お問い合わせ | ポケモン 人気バトル' : 'Contact | Pokémon Popularity Battle';
  }, [lang]);

  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const c = {
    ja: {
      back: '← トップに戻る',
      title: 'お問い合わせ',
      intro: '「ポケモン 人気バトル」へのご意見・ご要望・不具合のご報告などは、以下の方法でご連絡ください。',
      xTitle: 'X（Twitter）でのお問い合わせ',
      xDesc: '最も迅速に対応できる方法です。DMまたはリプライでお気軽にどうぞ。',
      xLink: 'Xアカウントに移動する →',
      youtubeTitle: 'YouTubeコミュニティからのお問い合わせ',
      youtubeDesc: '東海ランキング【公認】のYouTubeチャンネルのコミュニティ投稿にてご連絡いただくことも可能です。',
      youtubeLink: 'YouTubeチャンネルに移動する →',
      noteTitle: 'ご注意',
      noteDesc: '本サイトはポケモンの公式サイトではありません。ポケモンに関する公式のお問い合わせは、株式会社ポケモンの公式サイトをご利用ください。',
      lastUpdate: '最終更新: 2026年4月',
    },
    en: {
      back: '← Back to Top',
      title: 'Contact',
      intro: 'For feedback, requests, or bug reports about Pokémon Popularity Battle, please reach out through the following methods.',
      xTitle: 'Contact via X (Twitter)',
      xDesc: 'This is the fastest way to get a response. Feel free to DM or reply.',
      xLink: 'Go to X account →',
      youtubeTitle: 'Contact via YouTube Community',
      youtubeDesc: 'You can also contact us through the community posts on the Tokai Ranking official YouTube channel.',
      youtubeLink: 'Go to YouTube channel →',
      noteTitle: 'Note',
      noteDesc: 'This site is not an official Pokémon site. For official Pokémon inquiries, please visit The Pokémon Company\'s official website.',
      lastUpdate: 'Last updated: April 2026',
    },
  }[lang];

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '20px' },
    container: { maxWidth: 700, margin: '0 auto' },
    langToggle: { position: 'absolute', top: '12px', right: '12px', zIndex: 100, display: 'flex', gap: '2px', background: '#fff', borderRadius: '16px', padding: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    langButton: (isActive) => ({ padding: '4px 10px', borderRadius: '14px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, background: isActive ? '#3B4CCA' : 'transparent', color: isActive ? '#fff' : '#8B7B5E', transition: 'all 0.2s' }),
    backLink: { display: 'inline-block', color: '#3B4CCA', textDecoration: 'none', marginBottom: 20, fontSize: 14, fontWeight: 700, marginTop: 50 },
    card: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid rgba(255,203,5,0.25)', boxShadow: '0 2px 12px rgba(255,203,5,0.1)' },
    title: { fontSize: 24, fontWeight: 800, color: '#3B4CCA', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#3B4CCA', marginBottom: 8, marginTop: 20 },
    text: { fontSize: 14, lineHeight: 1.8, color: '#4A5568' },
    link: { display: 'inline-block', marginTop: 10, padding: '10px 20px', background: '#3B4CCA', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 },
    noteBox: { background: 'rgba(255,203,5,0.1)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(255,203,5,0.3)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap" rel="stylesheet" />
      <div style={s.langToggle}>
        <button onClick={() => changeLang('ja')} style={s.langButton(lang === 'ja')}>🇯🇵 JA</button>
        <button onClick={() => changeLang('en')} style={s.langButton(lang === 'en')}>🇺🇸 EN</button>
      </div>
      <div style={s.container}>
        <a href="/" style={s.backLink}>{c.back}</a>
        <div style={s.card}>
          <h1 style={s.title}>{c.title}</h1>
          <p style={s.text}>{c.intro}</p>

          <h2 style={s.sectionTitle}>{c.xTitle}</h2>
          <p style={s.text}>{c.xDesc}</p>
          <a href="https://x.com/RankingQQQ" target="_blank" rel="noopener noreferrer" style={s.link}>{c.xLink}</a>

          <h2 style={s.sectionTitle}>{c.youtubeTitle}</h2>
          <p style={s.text}>{c.youtubeDesc}</p>
          <a href="https://www.youtube.com/@TokaiRanking" target="_blank" rel="noopener noreferrer" style={{ ...s.link, background: '#CC0000', marginLeft: 8 }}>{c.youtubeLink}</a>
        </div>

        <div style={s.noteBox}>
          <p style={{ ...s.text, fontWeight: 700, marginBottom: 4 }}>{c.noteTitle}</p>
          <p style={{ ...s.text, margin: 0 }}>{c.noteDesc}</p>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#A0926E' }}>{c.lastUpdate}</div>
      </div>
    </div>
  );
}
