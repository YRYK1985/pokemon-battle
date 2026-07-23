import { kv } from '@vercel/kv';
import Link from 'next/link';
import pokemons from '../../lib/pokemon.json';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

// 投票結果は変動するため1時間ごとに再生成（ISR）
export const revalidate = 3600;

export const metadata = {
  title: 'ファン投票 人気ランキング TOP100（Eloレーティング） | ポケモン 人気バトル',
  description:
    'ファンの1対1投票で決まるポケモン人気ランキングTOP100。全1,025体からEloレーティングで順位化した、ここにしかないリアルタイム人気投票結果。毎時更新。',
};

const TYPE_JA = {
  water: 'みず', normal: 'ノーマル', grass: 'くさ', flying: 'ひこう',
  psychic: 'エスパー', bug: 'むし', poison: 'どく', fire: 'ほのお',
  ground: 'じめん', rock: 'いわ', fighting: 'かくとう', dragon: 'ドラゴン',
  electric: 'でんき', dark: 'あく', steel: 'はがね', ghost: 'ゴースト',
  fairy: 'フェアリー', ice: 'こおり',
};

export default async function RankingPage() {
  // KVからレーティングデータ取得（失敗してもページ自体は成立させる）
  let ratings = {};
  let matchCount = 0;
  let wins = {};
  let matches = {};
  try {
    const [r, mc, w, m] = await Promise.all([
      kv.hgetall('pokemon_ratings'),
      kv.get('pokemon_matchCount'),
      kv.hgetall('pokemon_wins'),
      kv.hgetall('pokemon_matches'),
    ]);
    ratings = r || {};
    matchCount = mc ?? 0;
    wins = w || {};
    matches = m || {};
  } catch (e) {
    console.error('Ranking page: failed to fetch ratings', e);
  }

  const byId = {};
  pokemons.forEach((p) => (byId[p.id] = p));

  const ranked = Object.entries(ratings)
    .filter(([id]) => byId[id])
    .map(([id, elo]) => ({
      pokemon: byId[id],
      elo: Math.round(Number(elo)),
      matches: Number(matches[id] || 0),
      wins: Number(wins[id] || 0),
    }))
    .filter((r) => r.matches >= 1)
    .sort((a, b) => b.elo - a.elo)
    .slice(0, 100);

  const hasData = ranked.length > 0;
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const style = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)',
      color: '#2D3748',
      fontFamily: FONT,
      padding: '20px',
      fontSize: '14px',
      lineHeight: 1.9,
    },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginTop: '32px', marginBottom: '12px' },
    note: { fontSize: '13px', color: '#A0926E', marginBottom: '24px' },
    p: { marginBottom: '16px', color: '#5a5240' },
    strong: { color: '#3B4CCA' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)' },
    th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700 },
    tdRank: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', color: '#3B4CCA', fontWeight: 800, width: '36px' },
    td: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0' },
    tdNum: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 700 },
    link: { color: '#2D3748', textDecoration: 'none' },
    badge: {
      display: 'inline-block',
      fontSize: '10px',
      color: '#A0926E',
      border: '1px solid #e0d6b0',
      borderRadius: '4px',
      padding: '0 4px',
      marginLeft: '6px',
      verticalAlign: 'middle',
    },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>ファン投票 人気ランキング TOP100</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代） ／
          累計対戦数：{Number(matchCount).toLocaleString()}回 ／ 1時間ごとに自動更新。
        </p>

        <p style={style.p}>
          このページは、当サイトの<Link href="/" style={{ color: '#3B4CCA' }}>投票バトル</Link>に寄せられた
          ファンの投票だけで決まる、<strong style={style.strong}>ここにしかないリアルタイム人気ランキング</strong>です。
          公式の人気投票は開催時点のスナップショットですが、
          このランキングは毎日の投票で今この瞬間も動き続けています。
          順位はチェスの世界ランキングと同じ
          <a href="/elo-guide" style={{ color: '#3B4CCA' }}>Eloレーティング</a>で算出。
          知名度に左右されにくい1対1比較なので、
          マイナーポケモンにも公平にチャンスがあります。
        </p>

        {hasData ? (
          <>
            <table style={style.table}>
              <thead>
                <tr>
                  <th style={style.th}>順位</th>
                  <th style={style.th}>ポケモン</th>
                  <th style={style.th}>タイプ</th>
                  <th style={{ ...style.th, textAlign: 'right' }}>レート</th>
                  <th style={{ ...style.th, textAlign: 'right' }}>勝率</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => (
                  <tr key={r.pokemon.id}>
                    <td style={style.tdRank}>{i + 1}</td>
                    <td style={style.td}>
                      <Link href={`/pokemon/${r.pokemon.id}`} style={style.link}>
                        {r.pokemon.nameJa}
                      </Link>
                      <span style={{ color: '#A0926E', fontSize: '11px' }}>（第{r.pokemon.generation}世代）</span>
                      {r.matches < 10 && <span style={style.badge}>暫定</span>}
                    </td>
                    <td style={{ ...style.td, fontSize: '12px', color: '#A0926E' }}>
                      {r.pokemon.types.map((t) => TYPE_JA[t] || t).join('・')}
                    </td>
                    <td style={style.tdNum}>{r.elo}</td>
                    <td style={style.tdNum}>
                      {r.matches > 0 ? Math.round((r.wins / r.matches) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '12px', color: '#A0926E', marginTop: '8px' }}>
              ※「暫定」は対戦数10回未満。投票が集まると順位が大きく動く可能性があります。
            </p>

            <h2 style={style.h2}>このランキングの読み方</h2>
            <p style={style.p}>
              注目してほしいのは、<a href="/pokemon-stats" style={{ color: '#3B4CCA' }}>種族値ランキング</a>との
              顔ぶれの違いです。ゲーム内の「強さ」で上位の伝説ポケモンが、
              人気投票でも上位とは限りません。
              進化前の小さなポケモンが強豪を押しのけて上位に入っていたら、
              それは純粋な「愛され力」の証明です。
              強さと人気のギャップを探しながら眺めると、このランキングは何倍も面白くなります。
            </p>
            <p style={style.p}>
              順位に納得がいかない？なら話は簡単です。
              <Link href="/" style={{ color: '#3B4CCA' }}>投票バトル</Link>で推しに投票してください。
              あなたの1票がこのページの順位を直接動かします。
            </p>
          </>
        ) : (
          <p style={style.p}>
            現在ランキングを集計中です。
            <Link href="/" style={{ color: '#3B4CCA' }}>投票バトル</Link>に参加して、
            最初のランキング作りに貢献してください。
            集計され次第、このページに順位が表示されます。
          </p>
        )}

        <ArticleFooter slug="ranking" />
      </div>
    </div>
  );
}
