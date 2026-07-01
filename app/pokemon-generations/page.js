import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';

export const metadata = {
  title: 'ポケモン 世代別完全データ 第1〜第9世代 | ポケモン 人気バトル',
  description: '第1世代（カントー）から第9世代（パルデア）まで、各世代のポケモン体数・タイプ傾向・種族値データ・対応ゲームタイトルをまとめたデータ記事です。',
};

const TYPE_JA = {
  water: 'みず', normal: 'ノーマル', grass: 'くさ', flying: 'ひこう',
  psychic: 'エスパー', bug: 'むし', poison: 'どく', fire: 'ほのお',
  ground: 'じめん', rock: 'いわ', fighting: 'かくとう', dragon: 'ドラゴン',
  electric: 'でんき', dark: 'あく', steel: 'はがね', ghost: 'ゴースト',
  fairy: 'フェアリー', ice: 'こおり',
};

const GEN_INFO = [
  {
    gen: 1,
    region: 'カントー地方',
    games: '赤・緑・青・ピカチュウ（1996年〜）',
    count: 151,
    noRange: 'No.1〜151',
    maxPoke: 'ミュウツー',
    maxTotal: 680,
    minTotal: 195,
    avgTotal: 408,
    topType: 'どく',
    topTypeCount: 33,
    note: '初代ポケモンとなる151体が登場した世代。最多タイプはどくタイプで33体。合計種族値の最高値はミュウツーの680。種族値合計の最低値は195で、ポケモン全9世代のうち最低値に近い水準となっている。どくタイプの割合が高い点がこの世代の特徴のひとつ。',
  },
  {
    gen: 2,
    region: 'ジョウト地方',
    games: '金・銀・クリスタル（1999年〜）',
    count: 100,
    noRange: 'No.152〜251',
    maxPoke: 'ルギア・ホウオウ',
    maxTotal: 680,
    minTotal: 180,
    avgTotal: 407,
    topType: 'ひこう',
    topTypeCount: 19,
    note: '新たに100体が追加された世代。追加数は全9世代のうち少ない部類に入る。最多タイプはひこうタイプで19体。伝説ポケモンのルギア・ホウオウがともに合計種族値680を持つ。平均合計種族値407は全世代通じて最も低い水準のひとつ。',
  },
  {
    gen: 3,
    region: 'ホウエン地方',
    games: 'ルビー・サファイア・エメラルド（2002年〜）',
    count: 135,
    noRange: 'No.252〜386',
    maxPoke: 'レックウザ',
    maxTotal: 680,
    minTotal: 190,
    avgTotal: 404,
    topType: 'みず',
    topTypeCount: 28,
    note: '135体が追加された世代。最多タイプはみずタイプで28体。ホウエン地方は水に囲まれた地形という設定があり、みずタイプの比率が高い。合計種族値の最高値はレックウザの680。平均合計種族値は404で全世代最低値。',
  },
  {
    gen: 4,
    region: 'シンオウ地方',
    games: 'ダイヤモンド・パール・プラチナ（2006年〜）',
    count: 107,
    noRange: 'No.387〜493',
    maxPoke: 'アルセウス',
    maxTotal: 720,
    minTotal: 194,
    avgTotal: 446,
    topType: 'ノーマル',
    topTypeCount: 17,
    note: '107体が追加された世代。アルセウスが合計種族値720を記録し、現在も全ポケモン中最高値となっている。最多タイプはノーマルタイプで17体。平均合計種族値446は第1〜3世代から大きく上昇しており、この世代から伝説ポケモンの種族値水準が引き上げられている。',
  },
  {
    gen: 5,
    region: 'イッシュ地方',
    games: 'ブラック・ホワイト（2010年〜）',
    count: 156,
    noRange: 'No.494〜649',
    maxPoke: 'レシラム・ゼクロム',
    maxTotal: 680,
    minTotal: 255,
    avgTotal: 426,
    topType: 'くさ',
    topTypeCount: 20,
    note: '156体が追加された世代で、1世代あたりの追加数は全世代最多。最多タイプはくさタイプで20体。種族値合計の最低値が255と全世代で最も高く、いわゆる弱いポケモンでも一定の水準が保たれている。平均合計種族値は426。',
  },
  {
    gen: 6,
    region: 'カロス地方',
    games: 'X・Y（2013年〜）',
    count: 72,
    noRange: 'No.650〜721',
    maxPoke: 'ゼルネアス・イベルタル',
    maxTotal: 680,
    minTotal: 200,
    avgTotal: 429,
    topType: 'フェアリー',
    topTypeCount: 13,
    note: '72体が追加された世代で、1世代あたりの追加数は全世代最少。この世代でフェアリータイプが新たに追加されており、最多タイプもフェアリーの13体となっている。平均合計種族値は429。',
  },
  {
    gen: 7,
    region: 'アローラ地方',
    games: 'サン・ムーン（2016年〜）',
    count: 88,
    noRange: 'No.722〜809',
    maxPoke: 'ソルガレオ・ルナアーラ',
    maxTotal: 680,
    minTotal: 175,
    avgTotal: 449,
    topType: 'くさ',
    topTypeCount: 13,
    note: '88体が追加された世代。最多タイプはくさタイプで13体。平均合計種族値449は第1〜6世代と比較して高い水準。種族値合計の最低値は175で全世代通じて最低値となっている。',
  },
  {
    gen: 8,
    region: 'ガラル地方',
    games: 'ソード・シールド（2019年〜）',
    count: 96,
    noRange: 'No.810〜905',
    maxPoke: 'ムゲンダイナ',
    maxTotal: 690,
    minTotal: 180,
    avgTotal: 439,
    topType: 'みず',
    topTypeCount: 11,
    note: '96体が追加された世代。ムゲンダイナが合計種族値690を記録し、アルセウスの720に次ぐ水準。最多タイプはみずタイプで11体。平均合計種族値は439。',
  },
  {
    gen: 9,
    region: 'パルデア地方',
    games: 'スカーレット・バイオレット（2022年〜）',
    count: 120,
    noRange: 'No.906〜1025',
    maxPoke: 'コライドン・ミライドン',
    maxTotal: 670,
    minTotal: 210,
    avgTotal: 457,
    topType: 'くさ',
    topTypeCount: 20,
    note: '120体が追加され、累計1,025体となった世代。最多タイプはくさタイプで20体（第5世代と同数）。種族値合計の最低値210は全世代で最も高く、平均合計種族値457も全世代最高値。',
  },
];

export default function PokemonGenerationsPage() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg,#FFF8E1 0%,#FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '20px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    lead: { fontSize: '13px', color: '#A0926E', marginBottom: '8px', lineHeight: 1.7 },
    summary: { fontSize: '13px', color: '#2D3748', marginBottom: '32px', padding: '12px 16px', background: 'rgba(59,76,202,0.06)', borderRadius: '8px', borderLeft: '3px solid #3B4CCA' },
    genBlock: { marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,203,5,0.3)' },
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginBottom: '4px' },
    subh: { fontSize: '12px', color: '#A0926E', marginBottom: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' },
    stat: { background: '#fff', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,203,5,0.25)' },
    statLabel: { fontSize: '11px', color: '#A0926E', marginBottom: '2px' },
    statValue: { fontSize: '14px', fontWeight: 700, color: '#2D3748' },
    note: { fontSize: '13px', color: '#4A5568', lineHeight: 1.85 },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>ポケモン 世代別完全データ 第1〜第9世代</h1>
        <p style={s.lead}>
          第1世代（カントー地方）から第9世代（パルデア地方）まで、各世代の体数・タイプ傾向・種族値データ・対応ゲームタイトルをまとめています。<br />
          対象：全{pokemons.length.toLocaleString()}体。メガシンカ・リージョンフォーム・キョダイマックス等のフォルム違いは除外。
        </p>
        <div style={s.summary}>
          全{pokemons.length.toLocaleString()}体　／　全9世代　／　第1世代（1996年）〜第9世代（2022年）
        </div>

        {GEN_INFO.map((d) => (
          <div key={d.gen} style={s.genBlock}>
            <h2 style={s.h2}>第{d.gen}世代 — {d.region}</h2>
            <p style={s.subh}>{d.noRange}　／　対応ゲーム：{d.games}</p>
            <div style={s.grid}>
              <div style={s.stat}>
                <div style={s.statLabel}>体数</div>
                <div style={s.statValue}>{d.count}体</div>
              </div>
              <div style={s.stat}>
                <div style={s.statLabel}>平均種族値合計</div>
                <div style={s.statValue}>{d.avgTotal}</div>
              </div>
              <div style={s.stat}>
                <div style={s.statLabel}>最高種族値合計</div>
                <div style={s.statValue}>{d.maxTotal}（{d.maxPoke}）</div>
              </div>
              <div style={s.stat}>
                <div style={s.statLabel}>最低種族値合計</div>
                <div style={s.statValue}>{d.minTotal}</div>
              </div>
              <div style={s.stat}>
                <div style={s.statLabel}>最多タイプ</div>
                <div style={s.statValue}>{d.topType}（{d.topTypeCount}体）</div>
              </div>
            </div>
            <p style={s.note}>{d.note}</p>
          </div>
        ))}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255,203,5,0.3)" }}>
          <p style={{ fontSize: "13px", fontWeight: 800, color: "#3B4CCA", marginBottom: "12px" }}>関連記事</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <a href="/pokemon-gen1-vs-gen9" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>第1世代vs第9世代</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>カントーとパルデアの比較</div>
            </a>
            <a href="/pokemon-types" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>タイプ別一覧</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>18タイプの体数ランキング</div>
            </a>
            <a href="/pokemon-stats" style={{ display: "block", padding: "10px 12px", background: "#fff", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.3)", textDecoration: "none", boxShadow: "0 1px 4px rgba(255,203,5,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#3B4CCA", marginBottom: "2px" }}>種族値ランキング</div>
              <div style={{ fontSize: "11px", color: "#A0926E" }}>合計種族値TOP30</div>
            </a>
          </div>
          <a href="/articles" style={{ color: "#A0926E", fontSize: "12px", textDecoration: "none" }}>← 記事一覧</a>
        </div>
        <Link href="/" style={s.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
