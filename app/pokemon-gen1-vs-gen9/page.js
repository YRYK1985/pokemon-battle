import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: '第1世代と第9世代のポケモンデータ比較 | ポケモン 人気バトル',
  description: '初代ポケモン（カントー地方・第1世代）と最新世代（パルデア地方・第9世代）のデータを体数・種族値・タイプ・身長・体重の観点から比較したデータ記事です。',
};

const TYPE_JA = {
  water: 'みず', normal: 'ノーマル', grass: 'くさ', flying: 'ひこう',
  psychic: 'エスパー', bug: 'むし', poison: 'どく', fire: 'ほのお',
  ground: 'じめん', rock: 'いわ', fighting: 'かくとう', dragon: 'ドラゴン',
  electric: 'でんき', dark: 'あく', steel: 'はがね', ghost: 'ゴースト',
  fairy: 'フェアリー', ice: 'こおり',
};

export default function PokemonGen1VsGen9Page() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const gen1 = pokemons.filter((p) => p.generation === 1);
  const gen9 = pokemons.filter((p) => p.generation === 9);

  function calcStats(gp) {
    const totals = gp.map((p) => Object.values(p.stats).reduce((s, v) => s + v, 0));
    const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    const maxPoke = gp.find((p) => Object.values(p.stats).reduce((s, v) => s + v, 0) === max);
    const minPoke = gp.find((p) => Object.values(p.stats).reduce((s, v) => s + v, 0) === min);
    const types = {};
    gp.forEach((p) => p.types.forEach((t) => { types[t] = (types[t] || 0) + 1; }));
    const topTypes = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const avgH = (gp.reduce((s, p) => s + parseFloat(p.height), 0) / gp.length).toFixed(1);
    const avgW = (gp.reduce((s, p) => s + parseFloat(p.weight), 0) / gp.length).toFixed(1);
    const statAvgs = ['hp','attack','defense','special-attack','special-defense','speed'].map(k => ({
      key: k, val: Math.round(gp.reduce((s,p)=>s+p.stats[k],0)/gp.length)
    }));
    return { count: gp.length, avg, max, maxPoke, min, minPoke, topTypes, avgH, avgW, statAvgs };
  }

  const s1 = calcStats(gen1);
  const s9 = calcStats(gen9);

  const STAT_LABEL = { hp: 'HP', attack: 'こうげき', defense: 'ぼうぎょ', 'special-attack': 'とくこう', 'special-defense': 'とくぼう', speed: 'すばやさ' };

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg,#FFF8E1 0%,#FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '20px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    lead: { fontSize: '13px', color: '#A0926E', marginBottom: '32px', lineHeight: 1.7 },
    section: { marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid rgba(255,203,5,0.3)' },
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginBottom: '12px' },
    body: { fontSize: '13px', color: '#4A5568', lineHeight: 1.9, marginBottom: '12px' },
    highlight: { background: 'rgba(59,76,202,0.06)', borderLeft: '3px solid #3B4CCA', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', color: '#2D3748', marginBottom: '16px' },
    compGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
    compCard: (gen) => ({ background: '#fff', borderRadius: '10px', padding: '14px 16px', border: gen === 1 ? '2px solid #3B4CCA' : '2px solid #FFCB05', }),
    compTitle: (gen) => ({ fontSize: '13px', fontWeight: 800, color: gen === 1 ? '#3B4CCA' : '#B8960C', marginBottom: '10px' }),
    compRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0', borderBottom: '1px solid #f7f0e0' },
    compLabel: { color: '#A0926E' },
    compVal: { fontWeight: 700, color: '#2D3748' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)', marginBottom: '8px' },
    th: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'center', background: '#fff' },
    thL: { padding: '8px 12px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left', background: '#fff' },
    td: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'center', color: '#4A5568' },
    tdBold: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'center', fontWeight: 700, color: '#3B4CCA' },
    tdL: { padding: '8px 12px', borderBottom: '1px solid #f7f0e0', textAlign: 'left', color: '#4A5568' },
    link: { color: '#3B4CCA', textDecoration: 'none' },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <AdSense />
        <h1 style={s.h1}>第1世代と第9世代のポケモンデータ比較</h1>
        <p style={s.lead}>
          1996年に登場した第1世代（カントー地方・151体）と、2022年に登場した第9世代（パルデア地方・120体）のポケモンデータを体数・種族値・タイプ・身長・体重の観点から比較します。<br />
          対象データはPokéAPI（pokeapi.co）から取得。メガシンカ・リージョンフォーム等は除外。
        </p>

        <div style={s.section}>
          <h2 style={s.h2}>① 基本データの比較</h2>
          <div style={s.compGrid}>
            <div style={s.compCard(1)}>
              <div style={s.compTitle(1)}>第1世代（カントー地方）</div>
              {[
                ['体数', s1.count + '体'],
                ['図鑑番号', 'No.1〜151'],
                ['登場作品', '赤・緑・青（1996年）'],
                ['平均種族値合計', s1.avg],
                ['最高種族値', s1.max + '（' + s1.maxPoke.nameJa + '）'],
                ['最低種族値', s1.min + '（' + s1.minPoke.nameJa + '）'],
                ['平均身長', s1.avgH + 'm'],
                ['平均体重', s1.avgW + 'kg'],
              ].map(([l, v]) => (
                <div key={l} style={s.compRow}><span style={s.compLabel}>{l}</span><span style={s.compVal}>{v}</span></div>
              ))}
            </div>
            <div style={s.compCard(9)}>
              <div style={s.compTitle(9)}>第9世代（パルデア地方）</div>
              {[
                ['体数', s9.count + '体'],
                ['図鑑番号', 'No.906〜1025'],
                ['登場作品', 'スカーレット・バイオレット（2022年）'],
                ['平均種族値合計', s9.avg],
                ['最高種族値', s9.max + '（' + s9.maxPoke.nameJa + '）'],
                ['最低種族値', s9.min + '（' + s9.minPoke.nameJa + '）'],
                ['平均身長', s9.avgH + 'm'],
                ['平均体重', s9.avgW + 'kg'],
              ].map(([l, v]) => (
                <div key={l} style={s.compRow}><span style={s.compLabel}>{l}</span><span style={s.compVal}>{v}</span></div>
              ))}
            </div>
          </div>
          <p style={s.body}>
            体数は第1世代の151体に対し第9世代は120体。平均種族値合計は第1世代が408、第9世代が457で49の差がある。平均身長は第1世代1.2mに対し第9世代1.4m、平均体重は第1世代46.0kgに対し第9世代87.3kgと、第9世代のポケモンの方が全体的に大型になっている。
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>② 各種族値の平均比較</h2>
          <p style={s.body}>HP・こうげき・ぼうぎょ・とくこう・とくぼう・すばやさの6項目について世代別の平均値を比較する。</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.thL}>種族値項目</th>
                <th style={s.th}>第1世代 平均</th>
                <th style={s.th}>第9世代 平均</th>
                <th style={s.th}>差</th>
              </tr>
            </thead>
            <tbody>
              {s1.statAvgs.map((stat) => {
                const s9stat = s9.statAvgs.find((x) => x.key === stat.key);
                const diff = s9stat.val - stat.val;
                return (
                  <tr key={stat.key}>
                    <td style={s.tdL}>{STAT_LABEL[stat.key]}</td>
                    <td style={s.td}>{stat.val}</td>
                    <td style={s.tdBold}>{s9stat.val}</td>
                    <td style={diff > 0 ? s.tdBold : s.td}>{diff > 0 ? '+' : ''}{diff}</td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ ...s.tdL, fontWeight: 700 }}>合計</td>
                <td style={{ ...s.td, fontWeight: 700 }}>{s1.avg}</td>
                <td style={{ ...s.tdBold }}>{s9.avg}</td>
                <td style={{ ...s.tdBold }}>+{s9.avg - s1.avg}</td>
              </tr>
            </tbody>
          </table>
          <p style={s.body}>
            全6項目で第9世代の平均値が第1世代を上回っている。差が最も大きい項目はHPで+{s9.statAvgs.find(x=>x.key==='hp').val - s1.statAvgs.find(x=>x.key==='hp').val}、最も小さい項目はすばやさで+{s9.statAvgs.find(x=>x.key==='speed').val - s1.statAvgs.find(x=>x.key==='speed').val}となっている。
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>③ タイプ構成の比較</h2>
          <p style={s.body}>
            第1世代の最多タイプはどく（33体）で、次いでみず（32体）、ノーマル（22体）。第9世代の最多タイプはくさ（20体）で、次いでノーマル（14体）、ドラゴン（14体）。第1世代にはフェアリータイプが存在しない（第6世代で追加）。第9世代はドラゴンタイプが14体と、第1世代の3体から大幅に増加している。
          </p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>順位</th>
                <th style={s.thL}>第1世代 最多タイプ</th>
                <th style={s.td}></th>
                <th style={s.thL}>第9世代 最多タイプ</th>
                <th style={s.td}></th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={s.tdL}>{TYPE_JA[s1.topTypes[i]?.[0]] || s1.topTypes[i]?.[0]}</td>
                  <td style={s.td}>{s1.topTypes[i]?.[1]}体</td>
                  <td style={s.tdL}>{TYPE_JA[s9.topTypes[i]?.[0]] || s9.topTypes[i]?.[0]}</td>
                  <td style={s.td}>{s9.topTypes[i]?.[1]}体</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>④ 種族値分布の比較</h2>
          <p style={s.body}>
            第1世代の最低種族値はキャタピーの195、第9世代の最低種族値はタマンチュラの210。最低値が15上昇している。最高値は第1世代がミュウツーの680、第9世代がコライドンの670で、第1世代の方が10高い。平均値は第9世代が49上回っているが、最高値は第1世代が上回るという結果となっている。
          </p>
          <div style={s.highlight}>
            第1世代：最低195（キャタピー）・平均408・最高680（ミュウツー）<br />
            第9世代：最低210（タマンチュラ）・平均457・最高670（コライドン）
          </div>
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginTop: '32px', marginBottom: '12px' }}>26年の進化が意味するもの</h2>
        <p style={{ marginBottom: '16px', color: '#5a5240', fontSize: '14px', lineHeight: 1.9 }}>
          カントーとパルデア、26年を隔てた2つの世代を並べると、
          単なる数字の変化以上のものが見えてきます。
          種族値の底上げは「ゲームバランスの洗練」を、
          複合タイプの増加は「デザインの複雑化」を、
          サイズの多様化は「表現力の拡大」を映しています。
          それでいて、御三家の種族値がほぼ同じ水準に保たれているように、
          変えない部分は頑固に変えない——
          この「変化と伝統のバランス」こそ、シリーズが26年続いた理由でしょう。
          全世代を通したトレンドは<a href="/generation-power" style={{ color: '#3B4CCA' }}>世代別インフレ検証</a>で、
          歴代御三家の詳細比較は<a href="/starters" style={{ color: '#3B4CCA' }}>御三家種族値比較</a>で
          さらに掘り下げています。
        </p>

        <ArticleFooter slug="pokemon-gen1-vs-gen9" />
      </div>
    </div>
  );
}
