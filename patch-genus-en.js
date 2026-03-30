// 既存のpokemon.jsonに英語genus (genusEn) を追加するパッチスクリプト
// 使い方: node patch-genus-en.js

const fs = require('fs');

const CONCURRENCY = 30;
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

async function main() {
  const pokemon = JSON.parse(fs.readFileSync('lib/pokemon.json', 'utf-8'));
  console.log(`${pokemon.length}体のポケモンに英語genusを追加中...`);

  for (let start = 0; start < pokemon.length; start += CONCURRENCY) {
    const batch = pokemon.slice(start, start + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (p) => {
        const species = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`);
        p.genusEn = species.genera.find(g => g.language.name === 'en')?.genus || '';
        return p;
      })
    );
    const done = Math.min(start + CONCURRENCY, pokemon.length);
    process.stdout.write(`\r${done}/${pokemon.length} (${Math.round(done / pokemon.length * 100)}%)`);
  }

  console.log('\n保存中...');
  fs.writeFileSync('lib/pokemon.json', JSON.stringify(pokemon, null, 2));
  console.log('完了！genusEnを追加しました');
}

main().catch(e => {
  console.error('エラー:', e);
  process.exit(1);
});
