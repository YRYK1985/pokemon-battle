import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';

export const metadata = {
  title: 'ポケモン タイプ別 平均種族値ランキング | ポケモン 人気バトル',
  description: '全1,025体のポケモンを18タイプ別に分類し、タイプごとの平均合計種族値・最高合計種族値・体数を集計したランキングです。最も平均種族値が高いタイプ、低いタイプがひと目でわかります。',
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

const TYPE_NOTE = {
  dragon: 'ドラゴンタイプは平均505と全タイプ中最高値。伝説・準伝説ポケモンにドラゴンタイプが多いことが要因となっている。',
  steel: 'はがねタイプは平均480で2位。防御面に優れたポケモンが多く、種族値合計も高い傾向にある。',
  fighting: 'かくとうタイプは平均467で3位。攻撃特化型のポケモンが多いタイプ。',
  bug: 'むしタイプは平均375と全タイプ中最低値。序盤に登場する進化前ポケモンが多く含まれることが要因のひとつ。',
  normal: 'ノーマルタイプは平均403で下位。アルセウス（720）が最高値だが、弱いポケモンも多く含まれるため平均は低い。',
  poison: 'どくタイプは平均413。進化前の小型ポケモンが多く含まれる。',
  grass: 'くさタイプは平均416。くさタイプの最高値はセレビィの600。',
  water: 'みずタイプは体数154と全タイプ中最多だが、平均は419と中位に位置する。',
  ice: 'こおりタイプは体数48と少ないが、平均454と上位。キュレム（660）が最高値。',
  fairy: 'フェアリータイプは第6世代で追加された比較的新しいタイプ。平均429。',
  electric: 'でんきタイプは平均442。ゼクロム（680）が最高値。',
  rock: 'いわタイプは平均442でんきタイプと同値。最高はバンギラスの600。',
  ghost: 'ゴーストタイプは平均447。ギラティナ（680）が最高値。',
  psychic: 'エスパータイプは平均457で5位。体数102と多いタイプだが平均は高い水準を保つ。ミュウツー（680）が最高値。',
  dark: 'あくタイプは平均460で4位。イベルタル（680）が最高値。',
  fire: 'ほのおタイプは平均450。ホウオウ（680）が最高値。',
  ground: 'じめんタイプは平均432。グラードン（670）が最高値。',
  flying: 'ひこうタイプは平均435。ルギア（680）が最高値。体数109は全タイプ4位。',
};

export default function PokemonTypeStatsPage() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const typeStats = {};
  pokemons.forEach((p) => {
    const total = Object.values(p.stats).reduce((s, v) => s + v, 0);
    p.types.forEach((t) => {
      if (!typeStats[t]) typeStats[t] = { sum: 0, count: 0, max: 0, maxPoke: '', maxId: 0 };
      typeStats[t].sum += total;
      typeStats[t].count++;
      if (total > typeStats[t].max) {
        typeStats[t].max = total;
        typeStats[t].maxPoke = p.nameJa;
        typeStats[t].maxId = p.id;
      }
    });
  });

  const sorted = Object.entries(typeStats).sort((a, b) => b[1].sum / b[1].count - a[1].sum / a[1].count);

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg,#FFF8E1 0%,#FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '20px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    lead: { fontSize: '13px', color: '#A0926E', marginBottom: '8px', lineHeight: 1.7 },
    note: { fontSize: '12px', color: '#A0926E', marginBottom: '32px' },
    summaryTable: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)', marginBottom: '40px' },
    th: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left', background: '#fff' },
    thR: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'right', background: '#fff' },
    tdBadge: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0' },
    tdR: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', color: '#4A5568' },
    tdBold: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700, color: '#3B4CCA' },
    badge: (t) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', background: TYPE_COLOR[t] || '#aaa', color: '#fff', fontSize: '12px', fontWeight: 700 }),
    typeBlock: { marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,203,5,0.3)' },
    h2: { fontSize: '14px', fontWeight: 700, color: '#3B4CCA', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' },
    typeMeta: { fontSize: '12px', color: '#A0926E', marginBottom: '6px' },
    typeNote: { fontSize: '13px', color: '#4A5568', lineHeight: 1.8 },
    link: { color: '#3B4CCA', textDecoration: 'none' },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>ポケモン タイプ別 平均種族値ランキング</h1>
        <p style={s.lead}>
          全{pokemons.length.toLocaleString()}体のポケモンを18タイプ別に分類し、タイプごとの平均合計種族値を集計しています。<br />
          デュアルタイプのポケモンは両方のタイプにカウント。平均値の高い順に並べています。
        </p>
        <p style={s.note}>※ タイプ別体数はデュアルタイプのカウントを含むため、合計は{pokemons.length.toLocaleString()}体を超えます。</p>

        <table style={s.summaryTable}>
          <thead>
            <tr>
              <th style={s.th}>順位</th>
              <th style={s.th}>タイプ</th>
              <th style={s.thR}>体数</th>
              <th style={s.thR}>平均種族値</th>
              <th style={s.thR}>最高種族値</th>
              <th style={s.th}>最高ポケモン</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([type, d], i) => (
              <tr key={type}>
                <td style={s.tdR}>{i + 1}</td>
                <td style={s.tdBadge}><span style={s.badge(type)}>{TYPE_JA[type] || type}</span></td>
                <td style={s.tdR}>{d.count}体</td>
                <td style={s.tdBold}>{Math.round(d.sum / d.count)}</td>
                <td style={s.tdR}>{d.max}</td>
                <td style={s.tdBadge}><Link href={`/pokemon/${d.maxId}`} style={s.link}>{d.maxPoke}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.map(([type, d], i) => (
          <div key={type} style={s.typeBlock}>
            <h2 style={s.h2}>
              <span style={s.badge(type)}>{TYPE_JA[type] || type}</span>
              {i + 1}位　平均種族値 {Math.round(d.sum / d.count)}
            </h2>
            <p style={s.typeMeta}>
              体数：{d.count}体　／　最高種族値：{d.max}（<Link href={`/pokemon/${d.maxId}`} style={s.link}>{d.maxPoke}</Link>）
            </p>
            <p style={s.typeNote}>{TYPE_NOTE[type] || ''}</p>
          </div>
        ))}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255,203,5,0.3)" }}>
          <p style={{ fontSize: "13px", fontWeight: 800, color: "#3B4CCA", marginBottom: "12px" }}>関連記事</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <a href="/pokemon-types" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>タイプ別一覧</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>18タイプの体数ランキング</div>
            </a>
            <a href="/pokemon-stats" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>種族値ランキング</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>合計種族値TOP30</div>
            </a>
            <a href="/pokemon-generations" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>世代別データ</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>第1〜第9世代の比較</div>
            </a>
          </div>
          <a href="/articles" style={{ color: "#A0926E", fontSize: "12px", textDecoration: "none" }}>← 記事一覧</a>
        </div>
        <Link href="/" style={s.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
