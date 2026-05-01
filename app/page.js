import PokemonVote from '../components/PokemonVote';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ポケモン 人気バトル | Pokémon Popularity Battle',
  url: 'https://www.poke-vote.com',
  description: '全1,025体のポケモンをEloレーティングシステムでランキング。2体を比べて好きな方を選ぶだけで、あなたの投票がリアルタイムでランキングに反映されます。',
  publisher: {
    '@type': 'Organization',
    name: 'ポケモン 人気バトル',
    url: 'https://www.poke-vote.com',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PokemonVote />
    </>
  );
}
