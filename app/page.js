import PokemonVote from '../components/PokemonVote';
import Link from 'next/link';
import pokemons from '../lib/pokemon.json';

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

// サーバーレンダリングされるサイト紹介セクション。
// 投票UIはクライアントレンダリングのため、クローラーから
// 「コンテンツのない画面」に見えないようにする役割を持つ。
function SiteIntro() {
  const total = pokemons.length;
  const gens = [...new Set(pokemons.map((p) => p.generation))].length;

  const s = {
    section: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '48px 20px 64px',
      color: '#2D3748',
      fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif",
      lineHeight: '1.9',
      fontSize: '14px',
    },
    h2: { fontSize: '18px', fontWeight: 800, color: '#3B4CCA', marginBottom: '12px' },
    p: { marginBottom: '16px', color: '#5a5240' },
    strong: { color: '#3B4CCA' },
    card: {
      display: 'block',
      padding: '12px 14px',
      background: '#fff',
      borderRadius: '10px',
      border: '1px solid rgba(255,203,5,0.3)',
      textDecoration: 'none',
      boxShadow: '0 1px 4px rgba(255,203,5,0.1)',
    },
    cardTitle: { fontSize: '13px', fontWeight: 800, color: '#3B4CCA', marginBottom: '2px' },
    cardDesc: { fontSize: '11px', color: '#A0926E' },
  };

  return (
    <section style={{ background: 'linear-gradient(180deg,#FFF8E1,#FFF3C4)' }}>
      <div style={s.section}>
        <h2 style={s.h2}>「ポケモン 人気バトル」とは / About This Site</h2>
        <p style={s.p}>
          ポケモン 人気バトルは、第1世代から第{gens}世代までの
          全<strong style={s.strong}>{total.toLocaleString()}体</strong>のポケモンを対象に、
          ファンの投票で「本当に人気のあるポケモンランキング」を作る参加型サイトです。
          ランダムに表示される2体から好きな方を選ぶだけ。登録不要・匿名で、日本語と英語に対応しています。
          Vote for your favorite from two randomly selected Pokémon — no sign-up required.
        </p>
        <p style={s.p}>
          順位の算出には、チェスの世界ランキングにも使われる
          <strong style={s.strong}>Eloレーティングシステム</strong>を採用。
          単純な得票数ではなく「どのポケモンに勝ったか」を評価に反映するため、
          投票が増えるほど統計的に信頼性の高いランキングになります。
          詳しくは<Link href="/elo-guide" style={{ color: '#3B4CCA' }}>Eloレーティング解説</Link>をどうぞ。
        </p>
        <p style={s.p}>
          また、PokéAPI経由で取得した公開ゲームデータ（種族値・タイプ・身長・体重など）をもとにした
          データ分析記事も公開しています。投票の合間にぜひご覧ください。
        </p>

        <h2 style={{ ...s.h2, marginTop: '32px' }}>データ分析記事 / Articles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <Link href="/pokemon-stats" style={s.card}>
            <div style={s.cardTitle}>合計種族値ランキング TOP30</div>
            <div style={s.cardDesc}>最も強いポケモンをデータで検証</div>
          </Link>
          <Link href="/stat-extremes" style={s.card}>
            <div style={s.cardTitle}>ステータス別No.1大全</div>
            <div style={s.cardDesc}>最速・最硬・最強攻撃はどの子？</div>
          </Link>
          <Link href="/generation-power" style={s.card}>
            <div style={s.cardTitle}>世代別インフレ検証</div>
            <div style={s.cardDesc}>種族値は本当に上がり続けている？</div>
          </Link>
          <Link href="/starters" style={s.card}>
            <div style={s.cardTitle}>歴代御三家 種族値比較</div>
            <div style={s.cardDesc}>9世代の御三家、最強はどれだ</div>
          </Link>
        </div>
        <Link href="/articles" style={{ color: '#3B4CCA', fontSize: '13px', textDecoration: 'none' }}>
          → 記事一覧を見る（全12本） / View all articles
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PokemonVote />
      <SiteIntro />
    </>
  );
}
