import Link from 'next/link';

export const metadata = {
  title: 'ページが見つかりません | ポケモン 人気バトル',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const card = {
    display: 'block',
    padding: '12px 14px',
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid rgba(255,203,5,0.3)',
    textDecoration: 'none',
    color: '#3B4CCA',
    fontSize: '13px',
    fontWeight: 700,
    boxShadow: '0 1px 4px rgba(255,203,5,0.1)',
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#FFF8E1,#FFF3C4)',
        color: '#2D3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif",
        padding: '20px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '22px', color: '#3B4CCA', marginBottom: '12px' }}>ページが見つかりません</h1>
        <p style={{ fontSize: '14px', color: '#A0926E', marginBottom: '24px', lineHeight: 1.8 }}>
          お探しのページは移動または削除された可能性があります。
          以下のリンクからお楽しみください。
        </p>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Link href="/" style={card}>投票バトルに参加する</Link>
          <Link href="/articles" style={card}>データ記事一覧を見る</Link>
          <Link href="/pokemon-stats" style={card}>種族値ランキング TOP30</Link>
        </div>
      </div>
    </div>
  );
}
