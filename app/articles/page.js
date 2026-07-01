import Link from 'next/link';

export const metadata = {
  title: 'ポケモン データ記事一覧 | ポケモン 人気バトル',
  description: '全1,025体のポケモンデータを分析した記事の一覧です。タイプ別・世代別・種族値ランキングなど。',
};

const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

const ARTICLES = [
  {
    href: '/pokemon-types',
    title: 'タイプ別一覧・数ランキング',
    desc: '全1,025体のポケモンを18タイプで集計。最も多いタイプ・最も少ないタイプ・各タイプの代表ポケモンをまとめたデータ記事。',
    tag: 'タイプ',
  },
  {
    href: '/pokemon-stats',
    title: '種族値ランキング TOP30',
    desc: '全ポケモンを合計種族値で順位付けしたランキング。HP・攻撃・防御・特攻・特防・素早さの合計値TOP30を掲載。',
    tag: 'ランキング',
  },
  {
    href: '/pokemon-generations',
    title: '世代別ポケモンデータ',
    desc: '第1世代カントーから第9世代パルデアまで、各世代のポケモン体数・平均種族値・タイプ傾向をまとめたデータ記事。',
    tag: '世代',
  },
  {
    href: '/pokemon-type-stats',
    title: 'タイプ別 平均種族値ランキング',
    desc: '18タイプごとに平均合計種族値を算出してランキング。HP・攻撃など各ステータスの平均値も掲載。',
    tag: 'タイプ',
  },
  {
    href: '/pokemon-size',
    title: '身長・体重ランキング',
    desc: '最も背が高いポケモン・最も重いポケモン・最も軽いポケモンのTOP15。全1,025体の身長・体重データを集計。',
    tag: 'ランキング',
  },
  {
    href: '/pokemon-gen1-vs-gen9',
    title: '第1世代と第9世代のデータ比較',
    desc: '1996年の第1世代（カントー・151体）と2022年の第9世代（パルデア・120体）を体数・種族値・タイプ・身長・体重の観点から比較。',
    tag: '比較',
  },
];

export default function ArticlesPage() {
  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(180deg,#FFF8E1 0%,#FFF3C4 100%)', color: '#2D3748', fontFamily: FONT, padding: '40px 20px 80px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px' },
    lead: { fontSize: '13px', color: '#A0926E', marginBottom: '32px', lineHeight: 1.7 },
    grid: { display: 'grid', gap: '12px', marginBottom: '32px' },
    card: { display: 'block', padding: '16px 18px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(255,203,5,0.3)', textDecoration: 'none', boxShadow: '0 2px 8px rgba(255,203,5,0.08)' },
    tag: { display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#3B4CCA', background: 'rgba(59,76,202,0.08)', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' },
    cardTitle: { fontSize: '15px', fontWeight: 800, color: '#2D3748', marginBottom: '6px' },
    cardDesc: { fontSize: '12px', color: '#A0926E', lineHeight: '1.8' },
    backLink: { color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '8px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>ポケモン データ記事一覧</h1>
        <p style={s.lead}>
          全1,025体のポケモンのデータをPokéAPI（pokeapi.co）から取得し、タイプ・世代・種族値・身長・体重などの観点で分析した記事の一覧です。
        </p>
        <div style={s.grid}>
          {ARTICLES.map(({ href, title, desc, tag }) => (
            <a key={href} href={href} style={s.card}>
              <div style={s.tag}>{tag}</div>
              <div style={s.cardTitle}>{title}</div>
              <div style={s.cardDesc}>{desc}</div>
            </a>
          ))}
        </div>
        <Link href="/" style={s.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
