export const metadata = {
  title: 'プライバシーポリシー | ポケモン 人気バトル',
  description: 'ポケモン 人気バトルのプライバシーポリシー',
};

export default function PrivacyPage() {
  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E8F4FD 0%, #D0EBFF 100%)',
      color: '#1A3A50',
      fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif",
      padding: '20px',
    },
    container: { maxWidth: 700, margin: '0 auto' },
    backLink: { display: 'inline-block', color: '#3B82F6', textDecoration: 'none', marginBottom: 20, fontSize: 14, fontWeight: 700 },
    card: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid rgba(59,130,246,0.12)', boxShadow: '0 2px 12px rgba(59,130,246,0.08)' },
    title: { fontSize: 24, fontWeight: 800, color: '#3B82F6', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 700, color: '#3B82F6', marginBottom: 12, marginTop: 24 },
    text: { fontSize: 14, lineHeight: 1.8, color: '#3A5A70' },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap" rel="stylesheet" />
      <div style={s.container}>
        <a href="/" style={s.backLink}>← トップに戻る</a>
        <div style={s.card}>
          <h1 style={s.title}>プライバシーポリシー</h1>

          <p style={s.text}>
            「ポケモン 人気バトル」（以下「当サイト」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めます。
          </p>

          <h2 style={s.sectionTitle}>収集する情報</h2>
          <p style={s.text}>
            当サイトでは、投票データ（どのポケモンに投票したか）を匿名で収集しています。
            個人を特定できる情報（氏名、メールアドレス等）は収集しておりません。
          </p>

          <h2 style={s.sectionTitle}>Cookieの使用</h2>
          <p style={s.text}>
            当サイトでは、サービスの提供および改善のためにCookieを使用する場合があります。
            ブラウザの設定でCookieを無効にすることが可能ですが、一部機能が利用できなくなる場合があります。
          </p>

          <h2 style={s.sectionTitle}>広告について</h2>
          <p style={s.text}>
            当サイトでは、Google AdSenseなどの第三者配信事業者による広告を掲載する場合があります。
            これらの事業者は、ユーザーの興味に基づく広告を表示するためにCookieを使用することがあります。
            Google AdSenseの詳細については、Googleのプライバシーポリシーをご確認ください。
          </p>

          <h2 style={s.sectionTitle}>アクセス解析</h2>
          <p style={s.text}>
            当サイトでは、アクセス状況を把握するためにGoogle Analyticsを使用する場合があります。
            Google Analyticsはデータ収集のためにCookieを使用しますが、収集されるデータは匿名であり、
            個人を特定するものではありません。
          </p>

          <h2 style={s.sectionTitle}>免責事項</h2>
          <p style={s.text}>
            当サイトに掲載されている情報の正確性には万全を期しておりますが、
            その内容について保証するものではありません。
            当サイトの利用により生じた損害について、一切の責任を負いかねます。
          </p>

          <h2 style={s.sectionTitle}>著作権について</h2>
          <p style={s.text}>
            ポケモンの画像および名称等は、株式会社ポケモン、任天堂株式会社、株式会社ゲームフリーク、
            株式会社クリーチャーズの著作物です。当サイトはファンサイトであり、
            これらの企業とは一切関係がありません。
            ポケモンのデータはPokéAPI（pokeapi.co）から取得しています。
          </p>

          <h2 style={s.sectionTitle}>ポリシーの変更</h2>
          <p style={s.text}>
            本ポリシーは予告なく変更される場合があります。
            変更後のポリシーは当ページに掲載された時点で効力を持ちます。
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#7BAAC4' }}>
          最終更新: 2026年3月28日
        </div>
      </div>
    </div>
  );
}
