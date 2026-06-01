import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';

export const metadata = {
  title: 'ポケモン 身長・体重ランキング | ポケモン 人気バトル',
  description: '全1,025体のポケモンを身長・体重で順位付けしたランキングです。最も背が高いポケモン、最も重いポケモン、最も軽いポケモンのTOP15をそれぞれ掲載しています。',
};

const GEN_JA = ['', 'カントー', 'ジョウト', 'ホウエン', 'シンオウ', 'イッシュ', 'カロス', 'アローラ', 'ガラル', 'パルデア'];

export default function PokemonSizePage() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const byHeight = [...pokemons].sort((a, b) => parseFloat(b.height) - parseFloat(a.height));
  const byWeightDesc = [...pokemons].sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
  const byWeightAsc = [...pokemons].sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));

  const tallest = byHeight.slice(0, 15);
  const shortest = byHeight.slice(-10).reverse();
  const heaviest = byWeightDesc.slice(0, 15);
  const lightest = byWeightAsc.slice(0, 10);

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg,#FFF8E1 0%,#FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '20px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    lead: { fontSize: '13px', color: '#A0926E', marginBottom: '32px', lineHeight: 1.7 },
    section: { marginBottom: '40px' },
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginBottom: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)', marginBottom: '8px' },
    th: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left', background: '#fff' },
    thR: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'right', background: '#fff' },
    tdRank: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', color: '#FFCB05', fontWeight: 700, textAlign: 'center', width: '36px' },
    tdName: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', fontWeight: 700 },
    tdGen: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', color: '#A0926E', fontSize: '12px' },
    tdVal: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700, color: '#3B4CCA' },
    link: { color: '#3B4CCA', textDecoration: 'none' },
    divider: { borderBottom: '1px solid rgba(255,203,5,0.3)', marginBottom: '40px' },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  const Table = ({ data, valueKey, unit, label }) => (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={{ ...s.th, textAlign: 'center' }}>順位</th>
          <th style={s.th}>ポケモン</th>
          <th style={s.th}>地方</th>
          <th style={s.thR}>{label}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={p.id}>
            <td style={s.tdRank}>{i + 1}</td>
            <td style={s.tdName}><Link href={`/pokemon/${p.id}`} style={s.link}>{p.nameJa}</Link></td>
            <td style={s.tdGen}>{GEN_JA[p.generation] || `第${p.generation}世代`}</td>
            <td style={s.tdVal}>{p[valueKey]}{unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>ポケモン 身長・体重ランキング</h1>
        <p style={s.lead}>
          全{pokemons.length.toLocaleString()}体のポケモンの身長・体重データを集計したランキングです。<br />
          対象：第1〜第9世代。メガシンカ・リージョンフォーム等のフォルム違いは除外。データはPokéAPI（pokeapi.co）から取得。
        </p>

        <div style={s.section}>
          <h2 style={s.h2}>身長が高いポケモン TOP15</h2>
          <Table data={tallest} valueKey="height" unit="m" label="身長" />
        </div>

        <div style={s.divider} />

        <div style={s.section}>
          <h2 style={s.h2}>身長が低いポケモン TOP10</h2>
          <Table data={shortest} valueKey="height" unit="m" label="身長" />
        </div>

        <div style={s.divider} />

        <div style={s.section}>
          <h2 style={s.h2}>体重が重いポケモン TOP15</h2>
          <Table data={heaviest} valueKey="weight" unit="kg" label="体重" />
        </div>

        <div style={s.divider} />

        <div style={s.section}>
          <h2 style={s.h2}>体重が軽いポケモン TOP10</h2>
          <Table data={lightest} valueKey="weight" unit="kg" label="体重" />
        </div>

        <Link href="/" style={s.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
