import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';

export const metadata = {
  title: 'ポケモン 種族値ランキング TOP30 | ポケモン 人気バトル',
  description: '全1,025体のポケモンを合計種族値で順位付けしたランキングです。HP・攻撃・防御・特攻・特防・素早さの合計値が高いポケモンTOP30を掲載しています。',
};

const GEN_JA = ['', 'カントー', 'ジョウト', 'ホウエン', 'シンオウ', 'イッシュ', 'カロス', 'アローラ', 'ガラル', 'パルデア'];

export default function PokemonStatsPage() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const withTotal = pokemons
    .map((p) => ({
      ...p,
      total: Object.values(p.stats).reduce((s, v) => s + v, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 30);

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
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)' },
    th: { padding: '8px 10px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'right', background: '#fff' },
    thL: { padding: '8px 10px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left', background: '#fff' },
    td: { padding: '8px 10px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', color: '#4A5568' },
    tdL: { padding: '8px 10px', borderBottom: '1px solid #f7f0e0', textAlign: 'left' },
    tdTotal: { padding: '8px 10px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 800, color: '#3B4CCA' },
    tdRank: { padding: '8px 10px', borderBottom: '1px solid #f7f0e0', textAlign: 'center', color: '#FFCB05', fontWeight: 700 },
    nameLink: { color: '#3B4CCA', textDecoration: 'none', fontWeight: 700 },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <h1 style={style.h1}>ポケモン 合計種族値ランキング TOP30</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代）<br />
          種族値：HP・こうげき・ぼうぎょ・とくこう・とくぼう・すばやさの合計
        </p>

        <table style={style.table}>
          <thead>
            <tr>
              <th style={{ ...style.th, textAlign: 'center' }}>順位</th>
              <th style={style.thL}>ポケモン</th>
              <th style={style.thL}>地方</th>
              <th style={style.th}>合計</th>
              <th style={style.th}>HP</th>
              <th style={style.th}>攻撃</th>
              <th style={style.th}>防御</th>
              <th style={style.th}>特攻</th>
              <th style={style.th}>特防</th>
              <th style={style.th}>素早</th>
            </tr>
          </thead>
          <tbody>
            {withTotal.map((p, i) => (
              <tr key={p.id}>
                <td style={style.tdRank}>{i + 1}</td>
                <td style={style.tdL}>
                  <Link href={`/pokemon/${p.id}`} style={style.nameLink}>{p.nameJa}</Link>
                </td>
                <td style={style.tdL}>{GEN_JA[p.generation] || `第${p.generation}世代`}</td>
                <td style={style.tdTotal}>{p.total}</td>
                <td style={style.td}>{p.stats.hp}</td>
                <td style={style.td}>{p.stats.attack}</td>
                <td style={style.td}>{p.stats.defense}</td>
                <td style={style.td}>{p.stats['special-attack']}</td>
                <td style={style.td}>{p.stats['special-defense']}</td>
                <td style={style.td}>{p.stats.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link href="/" style={style.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
