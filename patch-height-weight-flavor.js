const fs = require('fs');
const path = require('path');

const POKEMON_FILE = path.join(__dirname, 'lib/pokemon.json');
let pokemon = JSON.parse(fs.readFileSync(POKEMON_FILE, 'utf-8'));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

const cleanText = (text) =>
  text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();

async function main() {
  console.log(`Patching ${pokemon.length} Pokemon with height, weight, flavor text...`);

  for (let i = 0; i < pokemon.length; i++) {
    const p = pokemon[i];
    if (p.height !== undefined && p.flavorJa !== undefined) {
      process.stdout.write(`\rSkip ${i + 1}/${pokemon.length} ${p.nameJa}`);
      continue;
    }

    try {
      const [pokeData, speciesData] = await Promise.all([
        fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${p.id}`),
        fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`),
      ]);

      p.height = (pokeData.height / 10).toFixed(1);
      p.weight = (pokeData.weight / 10).toFixed(1);

      const jaEntries = speciesData.flavor_text_entries.filter(e => e.language.name === 'ja');
      const enEntries = speciesData.flavor_text_entries.filter(e => e.language.name === 'en');
      p.flavorJa = jaEntries.length > 0 ? cleanText(jaEntries[jaEntries.length - 1].flavor_text) : '';
      p.flavorEn = enEntries.length > 0 ? cleanText(enEntries[enEntries.length - 1].flavor_text) : '';

      process.stdout.write(`\r${i + 1}/${pokemon.length} ${p.nameJa} (${p.height}m, ${p.weight}kg)\n`);

      if ((i + 1) % 20 === 0) {
        fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon));
        console.log(`--- saved at ${i + 1} ---`);
      }

      await new Promise(r => setTimeout(r, 120));
    } catch (e) {
      console.error(`\nError for No.${p.id} ${p.nameJa}: ${e.message}`);
    }
  }

  fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon));
  console.log('\nAll done!');
}

main();
