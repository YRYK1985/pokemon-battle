import Link from 'next/link';
import { ARTICLES, getRelated } from '../lib/articles';

// 記事末尾の共通フッター：著者情報＋構造化データ＋関連記事カード3枚＋記事一覧＋トップへ戻る
export default function ArticleFooter({ slug }) {
  const related = getRelated(slug, 3);
  const article = ARTICLES.find((a) => a.slug === slug);

  const jsonLd = article && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.desc,
    mainEntityOfPage: `https://www.poke-vote.com/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'ポケモン人気バトル編集部',
      url: 'https://www.poke-vote.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ポケモン 人気バトル',
      url: 'https://www.poke-vote.com',
    },
  };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div
        style={{
          marginTop: '32px',
          padding: '14px 16px',
          background: '#fff',
          border: '1px solid rgba(255,203,5,0.3)',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#A0926E',
          lineHeight: 1.8,
          boxShadow: '0 1px 4px rgba(255,203,5,0.1)',
        }}
      >
        <strong style={{ color: '#3B4CCA' }}>この記事について</strong>
        <br />
        執筆・データ集計：ポケモン人気バトル編集部。種族値・タイプ・身長・体重などのデータは
        PokéAPI経由で取得した公開ゲームデータに基づきます。当サイトは任天堂・ゲームフリーク・
        株式会社ポケモンとは関係のない非公式ファンサイトです。
      </div>
      <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,203,5,0.3)' }}>
        <p style={{ fontSize: '13px', fontWeight: 800, color: '#3B4CCA', marginBottom: '12px' }}>関連記事</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              style={{
                display: 'block',
                padding: '10px 12px',
                background: '#fff',
                borderRadius: '10px',
                border: '1px solid rgba(255,203,5,0.3)',
                textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(255,203,5,0.1)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#3B4CCA', marginBottom: '2px' }}>{a.title}</div>
              <div style={{ fontSize: '11px', color: '#A0926E' }}>{a.desc}</div>
            </Link>
          ))}
        </div>
        <Link href="/articles" style={{ color: '#A0926E', fontSize: '12px', textDecoration: 'none' }}>
          ← 記事一覧
        </Link>
      </div>
      <Link
        href="/"
        style={{ color: '#3B4CCA', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' }}
      >
        ← トップに戻る
      </Link>
    </>
  );
}
