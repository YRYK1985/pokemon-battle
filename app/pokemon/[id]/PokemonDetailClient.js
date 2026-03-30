'use client';

import React, { useState, useEffect } from 'react';

export default function PokemonDetailClient({ data }) {
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
    const name = lang === 'ja' ? data.pokemon.nameJa : data.pokemon.nameEn;
    document.title = lang === 'ja'
      ? `${name}（No.${data.pokemon.id}）のランキング | ポケモン 人気バトル`
      : `${name} (No.${data.pokemon.id}) Rankings | Pokémon Popularity Battle`;
  }, [lang, data.pokemon]);

  const {
    pokemon,
    elo,
    pokemonWins,
    pokemonMatches,
    winRate,
    overallRank,
    genRank,
    genPokemon,
    prevPokemon,
    nextPokemon,
    totalStats,
    sorted,
    TYPE_MAP,
    GEN_NAMES,
    STAT_NAMES,
    POKEMON,
  } = data;

  const content = {
    ja: {
      backToVoting: '← 投票に戻る',
      backToRanking: '🏆 ランキングに戻る',
      rankingData: 'ランキングデータ',
      eloRating: 'Eloレーティング',
      winRate: '勝率',
      overallRanking: '全体ランキング',
      genRanking: '世代別ランキング',
      baseStats: '種族値',
      pokemonInfo: 'ポケモン情報',
      height: '高さ',
      weight: '重さ',
      neighboringRanks: '前後のランキング',
      footer: 'ポケモン 人気バトル - ファンの投票だけで決まるランキング',
      description: (name, id, year, total) =>
        `「ポケモン 人気バトル」は、全${total}体のポケモンをファン投票で順位付けするランキングサイトです。投票にはEloレーティングシステムを採用しており、2体のポケモンを比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。このページでは${name}（No.${id}）のランキング情報をご覧いただけます。データはリアルタイムの投票結果に基づいて更新されます。`,
    },
    en: {
      backToVoting: '← Back to Voting',
      backToRanking: '🏆 Back to Rankings',
      rankingData: 'Ranking Data',
      eloRating: 'Elo Rating',
      winRate: 'Win Rate',
      overallRanking: 'Overall Ranking',
      genRanking: 'Generation Ranking',
      baseStats: 'Base Stats',
      pokemonInfo: 'Pokémon Info',
      height: 'Height',
      weight: 'Weight',
      neighboringRanks: 'Neighboring Rankings',
      footer: 'Pokémon Popularity Battle - Rankings decided by fan voting',
      description: (name, id, year, total) =>
        `Pokémon Popularity Battle is a fan-driven ranking site for all ${total} Pokémon. It uses the Elo rating system, where fans repeatedly choose between two Pokémon in a "Which do you prefer?" format to produce statistically reliable rankings. This page shows ranking data for ${name} (No.${id}). Data is updated in real-time based on voting results.`,
    },
  };

  const c = content[lang];

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)',
      color: '#2D3748',
      fontFamily: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '20px',
    },
    container: {
      maxWidth: 700,
      margin: '0 auto',
    },
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
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      background: isActive ? '#3B4CCA' : 'transparent',
      color: isActive ? '#fff' : '#8B7B5E',
      transition: 'all 0.2s',
    }),
    backLink: {
      color: '#3B4CCA',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 700,
    },
    card: {
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      border: '1px solid rgba(255,203,5,0.25)',
      boxShadow: '0 2px 12px rgba(255,203,5,0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap',
    },
    image: {
      width: 140,
      height: 140,
      objectFit: 'contain',
      filter: 'drop-shadow(0 4px 12px rgba(255,203,5,0.2))',
    },
    name: {
      fontSize: 28,
      fontWeight: 800,
      color: '#2D3748',
      margin: '0 0 4px 0',
    },
    nameEn: {
      fontSize: 14,
      color: '#8B7B5E',
      marginBottom: 8,
    },
    no: {
      fontSize: 14,
      color: '#3B4CCA',
      marginBottom: 8,
    },
    typeBadge: (color) => ({
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      background: color,
      marginRight: 6,
    }),
    sectionTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: '#3B4CCA',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: '1px solid rgba(59,76,202,0.15)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
    dataItem: {
      background: 'rgba(255,203,5,0.06)',
      borderRadius: 10,
      padding: '12px 16px',
    },
    dataLabel: {
      fontSize: 11,
      color: '#8B7B5E',
      marginBottom: 4,
    },
    dataValue: {
      fontSize: 20,
      fontWeight: 700,
      color: '#2D3748',
    },
    statBar: (val, max, color) => ({
      height: 8,
      borderRadius: 4,
      background: 'rgba(255,203,5,0.12)',
      overflow: 'hidden',
      position: 'relative',
    }),
    statFill: (val, max, color) => ({
      height: '100%',
      borderRadius: 4,
      width: `${Math.min((val / max) * 100, 100)}%`,
      background: color,
    }),
    statRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    statLabel: {
      width: 45,
      fontSize: 12,
      color: '#8B7B5E',
      textAlign: 'right',
    },
    statValue: {
      width: 35,
      fontSize: 13,
      fontWeight: 700,
      color: '#2D3748',
      textAlign: 'right',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: 'rgba(255,203,5,0.06)',
      borderRadius: 10,
      textDecoration: 'none',
      color: '#2D3748',
      transition: 'background 0.2s',
    },
    navImg: {
      width: 40,
      height: 40,
      objectFit: 'contain',
    },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />

      {/* Language Toggle */}
      <div style={s.langToggle}>
        <button onClick={() => changeLang('ja')} style={s.langButton(lang === 'ja')}>🇯🇵 JA</button>
        <button onClick={() => changeLang('en')} style={s.langButton(lang === 'en')}>🇺🇸 EN</button>
      </div>

      <div style={s.container}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, marginTop: 30 }}>
          <a href="/" style={s.backLink}>{c.backToVoting}</a>
          <a href="/#ranking" style={{ ...s.backLink, color: '#CC3333' }}>{c.backToRanking}</a>
        </div>

        {/* Header Card */}
        <div style={s.card}>
          <div style={s.header}>
            <img src={pokemon.image} alt={lang === 'ja' ? pokemon.nameJa : pokemon.nameEn} style={s.image} />
            <div>
              <div style={s.no}>No.{pokemon.id}</div>
              <h1 style={s.name}>{lang === 'ja' ? pokemon.nameJa : pokemon.nameEn}</h1>
              <div style={{ marginBottom: 8 }}>
                {pokemon.types && pokemon.types.map((t) => (
                  <span key={t} style={s.typeBadge(TYPE_MAP[t]?.color || '#888')}>
                    {lang === 'ja' ? TYPE_MAP[t]?.ja : TYPE_MAP[t]?.en}
                  </span>
                ))}
              </div>
              {(lang === 'ja' ? pokemon.genus : pokemon.genusEn) && (
                <div style={{ fontSize: 13, color: '#8B7B5E', marginBottom: 4 }}>{lang === 'ja' ? pokemon.genus : pokemon.genusEn}</div>
              )}
              <div style={{ fontSize: 13, color: '#A0926E' }}>
                {lang === 'ja' ? (
                  <>第{pokemon.generation}世代 / {GEN_NAMES[pokemon.generation]?.ja || ''}地方</>
                ) : (
                  <>Gen {pokemon.generation} / {GEN_NAMES[pokemon.generation]?.en || ''}</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Data */}
        <div style={s.card}>
          <div style={s.sectionTitle}>{c.rankingData}</div>
          <div style={s.grid}>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.eloRating}</div>
              <div style={s.dataValue}>{elo}</div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.winRate}</div>
              <div style={s.dataValue}>{winRate !== null ? `${winRate}%` : '-'}</div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.overallRanking}</div>
              <div style={s.dataValue}>{overallRank}<span style={{ fontSize: 13, color: '#8B7B5E' }}>/{POKEMON.length}</span></div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.genRanking}</div>
              <div style={s.dataValue}>{genRank}<span style={{ fontSize: 13, color: '#8B7B5E' }}>/{genPokemon.length}</span></div>
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div style={s.card}>
          <div style={s.sectionTitle}>
            {c.baseStats}
            {lang === 'ja' ? `（合計: ${totalStats}）` : ` (Total: ${totalStats})`}
          </div>
          {pokemon.stats && Object.entries(STAT_NAMES).map(([key, { ja, en, color }]) => (
            <div key={key} style={s.statRow}>
              <div style={s.statLabel}>{lang === 'ja' ? ja : en}</div>
              <div style={s.statValue}>{pokemon.stats[key] || 0}</div>
              <div style={{ flex: 1, ...s.statBar(pokemon.stats[key] || 0, 255, color) }}>
                <div style={s.statFill(pokemon.stats[key] || 0, 255, color)} />
              </div>
            </div>
          ))}
        </div>

        {/* Pokemon Info */}
        <div style={s.card}>
          <div style={s.sectionTitle}>{c.pokemonInfo}</div>
          <div style={s.grid}>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.height}</div>
              <div style={{ ...s.dataValue, fontSize: 16 }}>{(pokemon.height / 10).toFixed(1)} m</div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>{c.weight}</div>
              <div style={{ ...s.dataValue, fontSize: 16 }}>{(pokemon.weight / 10).toFixed(1)} kg</div>
            </div>
          </div>
        </div>

        {/* Neighboring Rankings */}
        <div style={s.card}>
          <div style={s.sectionTitle}>{c.neighboringRanks}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {prevPokemon && (
              <a href={`/pokemon/${prevPokemon.id}`} style={s.navLink}>
                <span style={{ color: '#3B4CCA', fontWeight: 700, width: 30 }}>▲{sorted.findIndex((p) => p.id === prevPokemon.id) + 1}</span>
                <img src={prevPokemon.image} alt={lang === 'ja' ? prevPokemon.nameJa : prevPokemon.nameEn} style={s.navImg} />
                <div>
                  <div style={{ fontWeight: 600, color: '#2D3748' }}>{lang === 'ja' ? prevPokemon.nameJa : prevPokemon.nameEn}</div>
                  <div style={{ fontSize: 12, color: '#8B7B5E' }}>Elo {prevPokemon.elo}</div>
                </div>
              </a>
            )}
            <div style={{ ...s.navLink, background: 'rgba(255,203,5,0.15)', border: '1px solid rgba(255,203,5,0.5)' }}>
              <span style={{ color: '#D4A005', fontWeight: 700, width: 30 }}>{overallRank}</span>
              <img src={pokemon.image} alt={lang === 'ja' ? pokemon.nameJa : pokemon.nameEn} style={s.navImg} />
              <div>
                <div style={{ fontWeight: 600, color: '#2D3748' }}>{lang === 'ja' ? pokemon.nameJa : pokemon.nameEn}</div>
                <div style={{ fontSize: 12, color: '#D4A005' }}>Elo {elo}</div>
              </div>
            </div>
            {nextPokemon && (
              <a href={`/pokemon/${nextPokemon.id}`} style={s.navLink}>
                <span style={{ color: '#3B4CCA', fontWeight: 700, width: 30 }}>▼{sorted.findIndex((p) => p.id === nextPokemon.id) + 1}</span>
                <img src={nextPokemon.image} alt={lang === 'ja' ? nextPokemon.nameJa : nextPokemon.nameEn} style={s.navImg} />
                <div>
                  <div style={{ fontWeight: 600, color: '#2D3748' }}>{lang === 'ja' ? nextPokemon.nameJa : nextPokemon.nameEn}</div>
                  <div style={{ fontSize: 12, color: '#8B7B5E' }}>Elo {nextPokemon.elo}</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Description for SEO / AdSense */}
        <div style={{ padding: '20px 24px', fontSize: 13, lineHeight: 1.8, color: '#8B7B5E' }}>
          {c.description(lang === 'ja' ? pokemon.nameJa : pokemon.nameEn, pokemon.id, null, POKEMON.length)}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#A0926E' }}>
          {c.footer}
        </div>
      </div>
    </div>
  );
}
