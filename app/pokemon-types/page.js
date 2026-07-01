import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';

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

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255,203,5,0.3)" }}>
          <p style={{ fontSize: "13px", fontWeight: 800, color: "#3B4CCA", marginBottom: "12px" }}>関連記事</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <a href="/pokemon-type-stats" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>タイプ別種族値</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>タイプ別平均種族値</div>
            </a>
            <a href="/pokemon-generations" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>世代別データ</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>第1〜第9世代の比較</div>
            </a>
            <a href="/pokemon-gen1-vs-gen9" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>第1世代vs第9世代</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>カントーとパルデアの比較</div>
            </a>
          </div>
          <a href="/articles" style={{ color: "#A0926E", fontSize: "12px", textDecoration: "none" }}>← 記事一覧</a>
        </div>
        <Link href="/" style={style.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
