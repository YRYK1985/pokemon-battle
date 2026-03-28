export const metadata = {
  title: 'このサイトについて | ポケモン 人気バトル',
  description: 'ポケモン 人気バトルの仕組みとEloレーティングシステムについて',
};

export default function AboutPage() {
  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E8F4FD 0%, #D0EBFF 100%)',
      color: '#1A3A50',
      fontFamily: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '20px',
    },
    container: {
      maxWidth: 700,
      margin: '0 auto',
    },
    backLink: {
      display: 'inline-block',
      color: '#3B82F6',
      textDecoration: 'none',
      marginBottom: 20,
      fontSize: 14,
      fontWeight: 700,
    },
    card: {
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      border: '1px solid rgba(59,130,246,0.12)',
      boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
    },
    title: {
      fontSize: 24,
      fontWeight: 800,
      color: '#3B82F6',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: '#3B82F6',
      marginBottom: 12,
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: 1.8,
      color: '#3A5A70',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap" rel="stylesheet" />
        <a href="/" style={s.backLink}>← トップに戻る</a>

        <div style={s.card}>
          <h1 style={s.title}>ポケモン 人気バトルについて</h1>

          <p style={s.text}>
            「ポケモン 人気バトル」は、全1025体のポケモンの中から2体がランダムに登場し、
            「どっちが好き？」を選んで投票するファン参加型の人気ランキングサイトです。
          </p>

          <h2 style={s.sectionTitle}>Eloレーティングとは</h2>
          <p style={s.text}>
            チェスなどの対戦競技で使われるレーティングシステムです。
            強い（人気の高い）ポケモンに勝つとレーティングが大きく上がり、
            弱い相手に勝っても少ししか上がりません。
            すべてのポケモンは初期レーティング1200からスタートします。
          </p>

          <h2 style={s.sectionTitle}>対象ポケモン</h2>
          <p style={s.text}>
            第1世代（カントー）から第9世代（パルデア）までの全1025体が対象です。
            メガシンカ・リージョンフォーム・キョダイマックスなどのフォーム違いは含まれていません。
          </p>

          <h2 style={s.sectionTitle}>世代フィルター</h2>
          <p style={s.text}>
            ランキングは全世代一覧のほか、世代（地方）ごとに絞り込んで閲覧できます。
            カントー、ジョウト、ホウエン、シンオウ、イッシュ、カロス、アローラ、ガラル、パルデアの9地方に対応しています。
          </p>

          <h2 style={s.sectionTitle}>データについて</h2>
          <p style={s.text}>
            ポケモンのデータ（名前・タイプ・種族値・画像など）はPokéAPI（pokeapi.co）から取得しています。
            投票データはリアルタイムで集計され、ランキングに反映されます。
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#7BAAC4' }}>
          最終更新: 2026年3月28日
        </div>
      </div>
    </div>
  );
}
