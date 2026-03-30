'use client';

import { useState } from 'react';

export default function PrivacyPage() {
  const [lang, setLang] = useState('ja');

  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const content = {
    ja: {
      backLink: '← トップに戻る',
      title: 'プライバシーポリシー',
      intro: '「ポケモン 人気バトル」（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。',
      collectTitle: '収集する情報',
      collectDesc: '当サイトでは、投票データ（どのポケモンに投票したか）を匿名で収集しています。個人を特定できる情報（氏名、メールアドレス等）は収集しておりません。',
      cookieTitle: 'Cookieの使用',
      cookieDesc: '当サイトでは、サービスの提供および改善のためにCookieを使用する場合があります。ブラウザの設定でCookieを無効にすることが可能ですが、一部機能が利用できなくなる場合があります。',
      adsTitle: '広告について',
      adsDesc: '当サイトでは、Google AdSenseなどの第三者配信事業者による広告を掲載する場合があります。これらの事業者は、ユーザーの興味に基づく広告を表示するためにCookieを使用することがあります。Google AdSenseの詳細については、Googleのプライバシーポリシーをご確認ください。',
      analyticsTitle: 'アクセス解析',
      analyticsDesc: '当サイトでは、アクセス状況を把握するためにGoogle Analyticsを使用する場合があります。Google Analyticsはデータ収集のためにCookieを使用しますが、収集されるデータは匿名であり、個人を特定するものではありません。',
      disclaimerTitle: '免責事項',
      disclaimerDesc: '当サイトに掲載されている情報の正確性には万全を期しておりますが、その内容について保証するものではありません。当サイトの利用により生じた損害について、一切の責任を負いかねます。',
      copyrightTitle: '著作権について',
      copyrightDesc: 'ポケモンの画像および名称等は、株式会社ポケモン、任天堂株式会社、株式会社ゲームフリーク、株式会社クリーチャーズの著作物です。当サイトはファンサイトであり、これらの企業とは一切関係がありません。ポケモンのデータはPokéAPI（pokeapi.co）から取得しています。',
      changeTitle: 'ポリシーの変更',
      changeDesc: '本ポリシーは予告なく変更される場合があります。変更後のポリシーは当ページに掲載された時点で効力を持ちます。',
      lastUpdate: '最終更新: 2026年3月28日',
    },
    en: {
      backLink: '← Back to Top',
      title: 'Privacy Policy',
      intro: 'Pokémon Popularity Battle respects the privacy of users and is committed to protecting personal information.',
      collectTitle: 'Information We Collect',
      collectDesc: 'We collect voting data (which Pokémon you voted for) anonymously. We do not collect personally identifiable information such as names or email addresses.',
      cookieTitle: 'Use of Cookies',
      cookieDesc: 'We may use cookies to provide and improve our service. You can disable cookies in your browser settings, but some features may not work properly.',
      adsTitle: 'About Advertising',
      adsDesc: 'We may display advertisements from third-party ad networks such as Google AdSense. These providers may use cookies to display ads based on your interests. For more information about Google AdSense, please check Google\'s privacy policy.',
      analyticsTitle: 'Access Analysis',
      analyticsDesc: 'We may use Google Analytics to understand site usage. Google Analytics uses cookies for data collection, but the data collected is anonymous and does not identify individuals.',
      disclaimerTitle: 'Disclaimer',
      disclaimerDesc: 'While we strive for accuracy of information on this site, we do not guarantee its contents. We assume no responsibility for damages arising from the use of this site.',
      copyrightTitle: 'About Copyright',
      copyrightDesc: 'Pokémon images and names are copyrighted by The Pokémon Company, Nintendo, Game Freak, and Creatures. This is a fan site and has no affiliation with these companies. Pokémon data is obtained from PokéAPI (pokeapi.co).',
      changeTitle: 'Policy Changes',
      changeDesc: 'This policy may be changed without notice. Any changes take effect when posted on this page.',
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
    container: { maxWidth: 700, margin: '0 auto' },
    langToggle: {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 100,
      display: 'flex',
      gap: '2px',
      background: '#fff',
      borderRadius: '20px',
      padding: '2px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    langButton: (isActive) => ({
      padding: '6px 14px',
      borderRadius: '18px',
      border: 'none',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: FONT,
      background: isActive ? '#3B4CCA' : 'transparent',
      color: isActive ? '#fff' : '#8B7B5E',
      transition: 'all 0.2s',
    }),
    backLink: { display: 'inline-block', color: '#3B4CCA', textDecoration: 'none', marginBottom: 20, fontSize: 14, fontWeight: 700, marginTop: 50 },
    card: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid rgba(255,203,5,0.25)', boxShadow: '0 2px 12px rgba(255,203,5,0.1)' },
    title: { fontSize: 24, fontWeight: 800, color: '#3B4CCA', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 700, color: '#3B4CCA', marginBottom: 12, marginTop: 24 },
    text: { fontSize: 14, lineHeight: 1.8, color: '#4A5568' },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* Language Toggle */}
      <div style={s.langToggle}>
        <button
          onClick={() => setLang('ja')}
          style={s.langButton(lang === 'ja')}
        >
          🇯🇵 JA
        </button>
        <button
          onClick={() => setLang('en')}
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

          <h2 style={s.sectionTitle}>{c.collectTitle}</h2>
          <p style={s.text}>
            {c.collectDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.cookieTitle}</h2>
          <p style={s.text}>
            {c.cookieDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.adsTitle}</h2>
          <p style={s.text}>
            {c.adsDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.analyticsTitle}</h2>
          <p style={s.text}>
            {c.analyticsDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.disclaimerTitle}</h2>
          <p style={s.text}>
            {c.disclaimerDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.copyrightTitle}</h2>
          <p style={s.text}>
            {c.copyrightDesc}
          </p>

          <h2 style={s.sectionTitle}>{c.changeTitle}</h2>
          <p style={s.text}>
            {c.changeDesc}
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#A0926E' }}>
          {c.lastUpdate}
        </div>
      </div>
    </div>
  );
}
