import { notFound } from 'next/navigation';
import { kv } from '@vercel/kv';
import PokemonDetailClient from './PokemonDetailClient';

let POKEMON = [];
try {
  POKEMON = require('../../../lib/pokemon.json');
} catch (e) {}

const TYPE_MAP = {
  normal: { ja: "ノーマル", en: "Normal", color: "#A8A878" },
  fire: { ja: "ほのお", en: "Fire", color: "#F08030" },
  water: { ja: "みず", en: "Water", color: "#6890F0" },
  electric: { ja: "でんき", en: "Electric", color: "#F8D030" },
  grass: { ja: "くさ", en: "Grass", color: "#78C850" },
  ice: { ja: "こおり", en: "Ice", color: "#98D8D8" },
  fighting: { ja: "かくとう", en: "Fighting", color: "#C03028" },
  poison: { ja: "どく", en: "Poison", color: "#A040A0" },
  ground: { ja: "じめん", en: "Ground", color: "#E0C068" },
  flying: { ja: "ひこう", en: "Flying", color: "#A890F0" },
  psychic: { ja: "エスパー", en: "Psychic", color: "#F85888" },
  bug: { ja: "むし", en: "Bug", color: "#A8B820" },
  rock: { ja: "いわ", en: "Rock", color: "#B8A038" },
  ghost: { ja: "ゴースト", en: "Ghost", color: "#705898" },
  dragon: { ja: "ドラゴン", en: "Dragon", color: "#7038F8" },
  dark: { ja: "あく", en: "Dark", color: "#705848" },
  steel: { ja: "はがね", en: "Steel", color: "#B8B8D0" },
  fairy: { ja: "フェアリー", en: "Fairy", color: "#EE99AC" },
};

const GEN_NAMES = {
  1: { ja: "カントー", en: "Kanto" },
  2: { ja: "ジョウト", en: "Johto" },
  3: { ja: "ホウエン", en: "Hoenn" },
  4: { ja: "シンオウ", en: "Sinnoh" },
  5: { ja: "イッシュ", en: "Unova" },
  6: { ja: "カロス", en: "Kalos" },
  7: { ja: "アローラ", en: "Alola" },
  8: { ja: "ガラル", en: "Galar" },
  9: { ja: "パルデア", en: "Paldea" },
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

  const STAT_NAMES = {
    hp: { ja: 'HP', en: 'HP', color: '#ff5555' },
    attack: { ja: '攻撃', en: 'Attack', color: '#f08030' },
    defense: { ja: '防御', en: 'Defense', color: '#f8d030' },
    'special-attack': { ja: '特攻', en: 'Sp. Atk', color: '#6890f0' },
    'special-defense': { ja: '特防', en: 'Sp. Def', color: '#78c850' },
    speed: { ja: '素早', en: 'Speed', color: '#f85888' },
  };

  // Pass all computed data to client component
  const pageData = {
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
  };

  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9862215132601373"
        crossOrigin="anonymous"
      />
      <PokemonDetailClient data={pageData} />
    </>
  );
}
