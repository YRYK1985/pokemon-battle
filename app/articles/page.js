import Link from 'next/link';
import AdSense from '../../components/AdSense';
import { ARTICLES } from '../../lib/articles';

export const metadata = {
  title: 'ポケモン データ記事一覧 | ポケモン 人気バトル',
  description:
    '全1,025体のポケモンデータを分析した全12記事の一覧。種族値ランキング・世代別インフレ検証・御三家比較・タイプ分析など。',
};

const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

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
        <AdSense />
        <h1 style={s.h1}>ポケモン データ記事一覧</h1>
        <p style={s.lead}>
          全1,025体のポケモンのデータをPokéAPI（pokeapi.co）から取得し、
          種族値・タイプ・世代・身長・体重などの観点で分析した全{ARTICLES.length}記事の一覧です。
          データは定期的に更新されます。
        </p>
        <div style={s.grid}>
          {ARTICLES.map(({ slug, title, desc, category }) => (
            <a key={slug} href={`/${slug}`} style={s.card}>
              <div style={s.tag}>{category}</div>
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
