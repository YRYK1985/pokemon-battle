// PokéAPIから全ポケモンデータを取得して pokemon.json に保存するスクリプト
// 使い方: node fetch-pokemon.js

const fs = require('fs');

const TOTAL = 1025; // 第9世代まで
const CONCURRENCY = 20; // 並列リクエスト数
const RETRY = 3;

async function fetchWithRetry(url, retries = RETRY) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function fetchPokemon(id) {
  const [pokemon, species] = await Promise.all([
    fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  // 日本語名を取得
  const nameJa = species.names.find(n => n.language.name === 'ja')?.name
    || species.names.find(n => n.language.name === 'ja-Hrkt')?.name
    || pokemon.name;

  // 英語名
  const nameEn = species.names.find(n => n.language.name === 'en')?.name || pokemon.name;

  // 分類（たねポケモン、とかげポケモン等）
  const genus = species.genera.find(g => g.language.name === 'ja')?.genus || '';

  // タイプ
  const types = pokemon.types.map(t => t.type.name);

  // ステータス
  const stats = {};
  pokemon.stats.forEach(s => {
    stats[s.stat.name] = s.base_stat;
  });

  // 世代番号
  const genMatch = species.generation.name.match(/generation-(\w+)/);
  const genRoman = genMatch ? genMatch[1] : '';
  const genMap = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 };
  const generation = genMap[genRoman] || 0;

  return {
    id: pokemon.id,
    nameJa,
    nameEn,
    genus,
    types,
    stats,
    height: pokemon.height,
    weight: pokemon.weight,
    generation,
    image: pokemon.sprites.other['official-artwork'].front_default,
  };
}

async function main() {
  console.log(`全${TOTAL}体のポケモンデータを取得中...`);
  const results = [];

  for (let start = 1; start <= TOTAL; start += CONCURRENCY) {
    const end = Math.min(start + CONCURRENCY - 1, TOTAL);
    const batch = [];
    for (let id = start; id <= end; id++) {
      batch.push(fetchPokemon(id));
    }

    const batchResults = await Promise.all(batch);
    results.push(...batchResults);

    const pct = Math.round(results.length / TOTAL * 100);
    process.stdout.write(`\r${results.length}/${TOTAL} (${pct}%)`);
  }

  console.log('\n完了！pokemon.json に保存中...');

  results.sort((a, b) => a.id - b.id);

  fs.writeFileSync('lib/pokemon.json', JSON.stringify(results, null, 2));
  console.log(`${results.length}体のポケモンデータを保存しました`);
}

main().catch(e => {
  console.error('エラー:', e);
  process.exit(1);
});
