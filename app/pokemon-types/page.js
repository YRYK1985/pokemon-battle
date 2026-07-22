import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: 'ポケモン タイプ別一覧・数ランキング | ポケモン 人気バトル',
  description: '全1,025体のポケモンをタイプ別に集計した一覧です。最も多いタイプ、最も少ないタイプ、各タイプの代表ポケモンをまとめています。',
};

const TYPE_JA = {
  water: 'みず', normal: 'ノーマル', grass: 'くさ', flying: 'ひこう',
  psychic: 'エスパー', bug: 'むし', poison: 'どく', fire: 'ほのお',
  ground: 'じめん', rock: 'いわ', fighting: 'かくとう', dragon: 'ドラゴン',
  electric: 'でんき', dark: 'あく', steel: 'はがね', ghost: 'ゴースト',
  fairy: 'フェアリー', ice: 'こおり',
};

const TYPE_COLOR = {
  water: '#6390F0', normal: '#A8A878', grass: '#78C850', flying: '#A890F0',
  psychic: '#F85888', bug: '#A8B820', poison: '#A040A0', fire: '#F08030',
  ground: '#E0C068', rock: '#B8A038', fighting: '#C03028', dragon: '#7038F8',
  electric: '#F8D030', dark: '#705848', steel: '#B8B8D0', ghost: '#705898',
  fairy: '#EE99AC', ice: '#98D8D8',
};

export default function PokemonTypesPage() {
  const typeCount = {};
  const typeReps = {};
  pokemons.forEach((p) => {
    p.types.forEach((t) => {
      typeCount[t] = (typeCount[t] || 0) + 1;
      if (!typeReps[t]) typeReps[t] = p;
    });
  });

  const sorted = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);

  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const style = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)',
      color: '#2D3748',
      fontFamily: FONT,
      padding: '20px',
    },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    note: { fontSize: '13px', color: '#A0926E', marginBottom: '28px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)' },
    th: { padding: '10px 14px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left', background: '#fff' },
    thR: { padding: '10px 14px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'right', background: '#fff' },
    td: { padding: '10px 14px', borderBottom: '1px solid #f7f0e0' },
    tdR: { padding: '10px 14px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700, color: '#2D3748' },
    badge: (t) => ({
      display: 'inline-block', padding: '2px 10px', borderRadius: '10px',
      background: TYPE_COLOR[t] || '#aaa', color: '#fff', fontSize: '12px', fontWeight: 700,
    }),
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
    repLink: { color: '#3B4CCA', textDecoration: 'none', fontSize: '13px' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>ポケモン タイプ別体数ランキング</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代）<br />
          ※デュアルタイプのポケモンは両方のタイプにカウント
        </p>

        <table style={style.table}>
          <thead>
            <tr>
              <th style={style.th}>順位</th>
              <th style={style.th}>タイプ</th>
              <th style={style.thR}>体数</th>
              <th style={style.th}>代表ポケモン（第1体目）</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([type, count], i) => (
              <tr key={type}>
                <td style={style.td}>{i + 1}</td>
                <td style={style.td}>
                  <span style={style.badge(type)}>{TYPE_JA[type] || type}</span>
                </td>
                <td style={style.tdR}>{count}体</td>
                <td style={style.td}>
                  <Link href={`/pokemon/${typeReps[type].id}`} style={style.repLink}>
                    {typeReps[type].nameJa}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginTop: '32px', marginBottom: '12px' }}>タイプ分布から見えるデザインの意図</h2>
        <p style={{ marginBottom: '16px', color: '#5a5240', fontSize: '14px', lineHeight: 1.9 }}>
          最多の{TYPE_JA[sorted[0][0]]}タイプ（{sorted[0][1]}体）と
          最少の{TYPE_JA[sorted[sorted.length - 1][0]]}タイプ（{sorted[sorted.length - 1][1]}体）では、
          体数に{Math.round(sorted[0][1] / sorted[sorted.length - 1][1])}倍近い開きがあります。
          これは偶然ではなく、世界観の反映です。
          水辺・草むら・洞窟など「どこにでもいる」生き物のタイプは自然と数が多くなり、
          ドラゴンやゴーストのような「特別な存在」は希少性を保つよう意図的に絞られています。
          希少タイプは1体あたりの存在感が強く、ファンの記憶にも残りやすい——
          数の少なさ自体がキャラクター性になっているのです。
        </p>
        <p style={{ marginBottom: '16px', color: '#5a5240', fontSize: '14px', lineHeight: 1.9 }}>
          また、このランキングは複合タイプを両方にカウントしているため、
          「サブタイプとして使われやすいタイプ」も上位に来ます。
          ひこうタイプが典型で、単タイプのひこうポケモンはごく僅かなのに、
          サブタイプとしての採用数で上位に食い込んでいます。
          タイプごとの「強さ」の違いは
          <a href="/pokemon-type-stats" style={{ color: '#3B4CCA' }}>タイプ別平均種族値ランキング</a>で、
          単タイプと複合タイプの構造的な違いは
          <a href="/monotype-dual" style={{ color: '#3B4CCA' }}>単タイプvs複合タイプ比較</a>で
          詳しく分析しています。
        </p>

        <ArticleFooter slug="pokemon-types" />
      </div>
    </div>
  );
}
