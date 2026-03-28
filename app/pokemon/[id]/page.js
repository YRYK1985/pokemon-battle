import { notFound } from 'next/navigation';
import { kv } from '@vercel/kv';

let POKEMON = [];
try {
  POKEMON = require('../../../lib/pokemon.json');
} catch (e) {}

const TYPE_MAP = {
  normal: { ja: "ノーマル", color: "#A8A878" },
  fire: { ja: "ほのお", color: "#F08030" },
  water: { ja: "みず", color: "#6890F0" },
  electric: { ja: "でんき", color: "#F8D030" },
  grass: { ja: "くさ", color: "#78C850" },
  ice: { ja: "こおり", color: "#98D8D8" },
  fighting: { ja: "かくとう", color: "#C03028" },
  poison: { ja: "どく", color: "#A040A0" },
  ground: { ja: "じめん", color: "#E0C068" },
  flying: { ja: "ひこう", color: "#A890F0" },
  psychic: { ja: "エスパー", color: "#F85888" },
  bug: { ja: "むし", color: "#A8B820" },
  rock: { ja: "いわ", color: "#B8A038" },
  ghost: { ja: "ゴースト", color: "#705898" },
  dragon: { ja: "ドラゴン", color: "#7038F8" },
  dark: { ja: "あく", color: "#705848" },
  steel: { ja: "はがね", color: "#B8B8D0" },
  fairy: { ja: "フェアリー", color: "#EE99AC" },
};

const GEN_NAMES = {
  1: "カントー", 2: "ジョウト", 3: "ホウエン", 4: "シンオウ",
  5: "イッシュ", 6: "カロス", 7: "アローラ", 8: "ガラル", 9: "パルデア",
};

export const dynamicParams = true;
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pokemon = POKEMON.find((p) => String(p.id) === String(id));
  if (!pokemon) return { title: 'ポケモンが見つかりません' };

  return {
    title: `${pokemon.nameJa}（No.${pokemon.id}）のランキング | ポケモン 人気バトル`,
    description: `${pokemon.nameJa}（${pokemon.nameEn}）のEloレーティング・人気ランキング・勝率データ。全${POKEMON.length}体のポケモンの中での順位をチェック！`,
    openGraph: {
      title: `${pokemon.nameJa}（No.${pokemon.id}）| ポケモン 人気バトル`,
      description: `${pokemon.nameJa}の人気ランキングデータ`,
      images: [pokemon.image],
    },
  };
}

export default async function PokemonPage({ params }) {
  const { id } = await params;
  const pokemon = POKEMON.find((p) => String(p.id) === String(id));
  if (!pokemon) notFound();

  // Redis からデータ取得
  let ratings = {}, wins = {}, matches = {};
  try {
    const [r, w, m] = await Promise.all([
      kv.hgetall('pokemon_ratings'),
      kv.hgetall('pokemon_wins'),
      kv.hgetall('pokemon_matches'),
    ]);
    ratings = r || {};
    wins = w || {};
    matches = m || {};
  } catch (e) {
    console.error('Redis error:', e);
  }

  const elo = ratings[pokemon.id] || 1200;
  const pokemonWins = wins[pokemon.id] || 0;
  const pokemonMatches = matches[pokemon.id] || 0;
  const winRate = pokemonMatches >= 10 ? Math.round((pokemonWins / pokemonMatches) * 100) : null;

  // ランキング計算
  const sorted = [...POKEMON]
    .map((p) => ({ ...p, elo: ratings[p.id] || 1200 }))
    .sort((a, b) => b.elo - a.elo);
  const overallRank = sorted.findIndex((p) => p.id === pokemon.id) + 1;

  // 世代別ランキング
  const genPokemon = sorted.filter((p) => p.generation === pokemon.generation);
  const genRank = genPokemon.findIndex((p) => p.id === pokemon.id) + 1;

  // 前後のポケモン（ランキング順）
  const idx = sorted.findIndex((p) => p.id === pokemon.id);
  const prevPokemon = idx > 0 ? sorted[idx - 1] : null;
  const nextPokemon = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // 種族値合計
  const totalStats = pokemon.stats
    ? Object.values(pokemon.stats).reduce((a, b) => a + b, 0)
    : 0;

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E8F4FD 0%, #D0EBFF 100%)',
      color: '#1A3A50',
      fontFamily: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '20px',
    },
    container: {
      maxWidth: 700,
      margin: '0 auto',
    },
    backLink: {
      display: 'inline-block',
      color: '#3B82F6',
      textDecoration: 'none',
      marginBottom: 20,
      fontSize: 14,
      fontWeight: 700,
    },
    card: {
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      border: '1px solid rgba(59,130,246,0.12)',
      boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
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
      filter: 'drop-shadow(0 4px 12px rgba(59,130,246,0.2))',
    },
    name: {
      fontSize: 28,
      fontWeight: 800,
      color: '#1A3A50',
      margin: '0 0 4px 0',
    },
    nameEn: {
      fontSize: 14,
      color: '#5B8BA8',
      marginBottom: 8,
    },
    no: {
      fontSize: 14,
      color: '#3B82F6',
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
      color: '#3B82F6',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: '1px solid rgba(59,130,246,0.15)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
    dataItem: {
      background: 'rgba(59,130,246,0.04)',
      borderRadius: 10,
      padding: '12px 16px',
    },
    dataLabel: {
      fontSize: 11,
      color: '#5B8BA8',
      marginBottom: 4,
    },
    dataValue: {
      fontSize: 20,
      fontWeight: 700,
      color: '#1A3A50',
    },
    statBar: (val, max, color) => ({
      height: 8,
      borderRadius: 4,
      background: 'rgba(59,130,246,0.08)',
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
      color: '#5B8BA8',
      textAlign: 'right',
    },
    statValue: {
      width: 35,
      fontSize: 13,
      fontWeight: 700,
      color: '#1A3A50',
      textAlign: 'right',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: 'rgba(59,130,246,0.04)',
      borderRadius: 10,
      textDecoration: 'none',
      color: '#1A3A50',
      transition: 'background 0.2s',
    },
    navImg: {
      width: 40,
      height: 40,
      objectFit: 'contain',
    },
  };

  const STAT_NAMES = {
    hp: { label: 'HP', color: '#ff5555' },
    attack: { label: '攻撃', color: '#f08030' },
    defense: { label: '防御', color: '#f8d030' },
    'special-attack': { label: '特攻', color: '#6890f0' },
    'special-defense': { label: '特防', color: '#78c850' },
    speed: { label: '素早', color: '#f85888' },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.container}>
        <a href="/" style={s.backLink}>← ポケモン 人気バトルに戻る</a>

        {/* ヘッダーカード */}
        <div style={s.card}>
          <div style={s.header}>
            <img src={pokemon.image} alt={pokemon.nameJa} style={s.image} />
            <div>
              <div style={s.no}>No.{pokemon.id}</div>
              <h1 style={s.name}>{pokemon.nameJa}</h1>
              <div style={s.nameEn}>{pokemon.nameEn}</div>
              <div style={{ marginBottom: 8 }}>
                {pokemon.types && pokemon.types.map((t) => (
                  <span key={t} style={s.typeBadge(TYPE_MAP[t]?.color || '#888')}>
                    {TYPE_MAP[t]?.ja || t}
                  </span>
                ))}
              </div>
              {pokemon.genus && (
                <div style={{ fontSize: 13, color: '#5B8BA8', marginBottom: 4 }}>{pokemon.genus}</div>
              )}
              <div style={{ fontSize: 13, color: '#7BAAC4' }}>
                第{pokemon.generation}世代 / {GEN_NAMES[pokemon.generation] || ''}地方
              </div>
            </div>
          </div>
        </div>

        {/* ランキングデータ */}
        <div style={s.card}>
          <div style={s.sectionTitle}>ランキングデータ</div>
          <div style={s.grid}>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>Eloレーティング</div>
              <div style={s.dataValue}>{elo}</div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>全体ランキング</div>
              <div style={s.dataValue}>{overallRank}<span style={{ fontSize: 13, color: '#5B8BA8' }}>/{POKEMON.length}</span></div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>世代別ランキング</div>
              <div style={s.dataValue}>{genRank}<span style={{ fontSize: 13, color: '#5B8BA8' }}>/{genPokemon.length}</span></div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>勝率</div>
              <div style={s.dataValue}>{winRate !== null ? `${winRate}%` : '-'}</div>
            </div>
          </div>
        </div>

        {/* 種族値 */}
        <div style={s.card}>
          <div style={s.sectionTitle}>種族値（合計: {totalStats}）</div>
          {pokemon.stats && Object.entries(STAT_NAMES).map(([key, { label, color }]) => (
            <div key={key} style={s.statRow}>
              <div style={s.statLabel}>{label}</div>
              <div style={s.statValue}>{pokemon.stats[key] || 0}</div>
              <div style={{ flex: 1, ...s.statBar(pokemon.stats[key] || 0, 255, color) }}>
                <div style={s.statFill(pokemon.stats[key] || 0, 255, color)} />
              </div>
            </div>
          ))}
        </div>

        {/* ポケモン情報 */}
        <div style={s.card}>
          <div style={s.sectionTitle}>ポケモン情報</div>
          <div style={s.grid}>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>高さ</div>
              <div style={{ ...s.dataValue, fontSize: 16 }}>{(pokemon.height / 10).toFixed(1)} m</div>
            </div>
            <div style={s.dataItem}>
              <div style={s.dataLabel}>重さ</div>
              <div style={{ ...s.dataValue, fontSize: 16 }}>{(pokemon.weight / 10).toFixed(1)} kg</div>
            </div>
          </div>
        </div>

        {/* 前後のランキング */}
        <div style={s.card}>
          <div style={s.sectionTitle}>前後のランキング</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {prevPokemon && (
              <a href={`/pokemon/${prevPokemon.id}`} style={s.navLink}>
                <span style={{ color: '#3B82F6', fontWeight: 700, width: 30 }}>▲{idx}</span>
                <img src={prevPokemon.image} alt={prevPokemon.nameJa} style={s.navImg} />
                <div>
                  <div style={{ fontWeight: 600, color: '#1A3A50' }}>{prevPokemon.nameJa}</div>
                  <div style={{ fontSize: 12, color: '#5B8BA8' }}>Elo {prevPokemon.elo}</div>
                </div>
              </a>
            )}
            <div style={{ ...s.navLink, background: 'rgba(255,203,5,0.12)', border: '1px solid rgba(255,203,5,0.4)' }}>
              <span style={{ color: '#D4A005', fontWeight: 700, width: 30 }}>{overallRank}</span>
              <img src={pokemon.image} alt={pokemon.nameJa} style={s.navImg} />
              <div>
                <div style={{ fontWeight: 600, color: '#1A3A50' }}>{pokemon.nameJa}</div>
                <div style={{ fontSize: 12, color: '#D4A005' }}>Elo {elo}</div>
              </div>
            </div>
            {nextPokemon && (
              <a href={`/pokemon/${nextPokemon.id}`} style={s.navLink}>
                <span style={{ color: '#3B82F6', fontWeight: 700, width: 30 }}>▼{idx + 2}</span>
                <img src={nextPokemon.image} alt={nextPokemon.nameJa} style={s.navImg} />
                <div>
                  <div style={{ fontWeight: 600, color: '#1A3A50' }}>{nextPokemon.nameJa}</div>
                  <div style={{ fontSize: 12, color: '#5B8BA8' }}>Elo {nextPokemon.elo}</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* フッター */}
        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#7BAAC4' }}>
          ポケモン 人気バトル - ファンの投票だけで決まるランキング
        </div>
      </div>
    </div>
  );
}
