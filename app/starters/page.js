import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: '歴代御三家 種族値比較：最強のスターターはどれだ | ポケモン 人気バトル',
  description:
    '第1〜第9世代の御三家（最終進化）27体を合計種族値で徹底比較。くさ・ほのお・みずの御三家、データ上最強はどのポケモンか検証します。',
};

// 各世代の御三家最終進化の図鑑ID
const STARTER_FINALS = {
  1: [3, 6, 9],
  2: [154, 157, 160],
  3: [254, 257, 260],
  4: [389, 392, 395],
  5: [497, 500, 503],
  6: [652, 655, 658],
  7: [724, 727, 730],
  8: [812, 815, 818],
  9: [908, 911, 914],
};

export default function StartersPage() {
  const total = (p) => Object.values(p.stats).reduce((a, b) => a + b, 0);
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const byId = {};
  pokemons.forEach((p) => (byId[p.id] = p));

  const gens = Object.keys(STARTER_FINALS).map(Number).sort((a, b) => a - b);
  const rows = gens
    .map((g) => ({
      gen: g,
      starters: STARTER_FINALS[g].map((id) => byId[id]).filter(Boolean),
    }))
    .filter((r) => r.starters.length === 3);

  const all = rows.flatMap((r) => r.starters);
  const ranked = [...all].sort((a, b) => total(b) - total(a));

  const style = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FFF3C4 100%)',
      color: '#2D3748',
      fontFamily: FONT,
      padding: '20px',
      fontSize: '14px',
      lineHeight: 1.9,
    },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: '20px', fontWeight: 800, color: '#3B4CCA', marginBottom: '8px', marginTop: '48px' },
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginTop: '32px', marginBottom: '12px' },
    note: { fontSize: '13px', color: '#A0926E', marginBottom: '28px' },
    p: { marginBottom: '16px', color: '#5a5240' },
    strong: { color: '#3B4CCA' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)', marginBottom: '16px' },
    th: { padding: '10px 14px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'left' },
    thR: { padding: '10px 14px', borderBottom: '1px solid #f0e6c0', color: '#3B4CCA', fontWeight: 700, textAlign: 'right' },
    td: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0' },
    tdR: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700 },
    tdRank: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0', color: '#3B4CCA', fontWeight: 800, width: '36px' },
    link: { color: '#2D3748', textDecoration: 'none' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>歴代御三家 種族値比較：最強のスターターはどれだ</h1>
        <p style={style.note}>
          対象：第1〜第9世代の御三家 最終進化{all.length}体 ／ 合計種族値で比較。種族値はPokéAPI経由の公開ゲームデータ。
        </p>

        <p style={style.p}>
          冒険の最初に選ぶ相棒、御三家。くさ・ほのお・みずの3択は
          シリーズ{rows.length}世代を通じて守られてきた伝統です。
          「どの御三家が一番強いのか」という永遠の議論に、
          最終進化{all.length}体の合計種族値というデータで決着をつけてみましょう。
        </p>

        <h2 style={style.h2}>御三家（最終進化）合計種族値ランキング</h2>
        <table style={style.table}>
          <thead>
            <tr>
              <th style={style.th}>順位</th>
              <th style={style.th}>ポケモン</th>
              <th style={style.th}>世代</th>
              <th style={style.thR}>合計種族値</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((p, i) => (
              <tr key={p.id}>
                <td style={style.tdRank}>{i + 1}</td>
                <td style={style.td}>
                  <Link href={`/pokemon/${p.id}`} style={style.link}>{p.nameJa}</Link>
                </td>
                <td style={style.td}>第{p.generation}世代</td>
                <td style={style.tdR}>{total(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={style.h2}>データが示す「御三家の平等設計」</h2>
        <p style={style.p}>
          ランキングを見てまず驚くのは、
          <strong style={style.strong}>1位から最下位までの差がわずか{total(ranked[0]) - total(ranked[ranked.length - 1])}ポイント</strong>しかないこと。
          {all.length}体の平均は{Math.round(all.reduce((s, p) => s + total(p), 0) / all.length)}で、
          ほぼ全員が530前後に収まっています。
          これは偶然ではなく、「最初に選ぶ3匹に性能差があってはいけない」という
          明確な設計思想の表れです。26年以上のシリーズ史を通じて、
          この平等性が保たれ続けているのは見事という他ありません。
        </p>
        <p style={style.p}>
          つまり御三家選びに「データ上の正解」はほぼ存在しません。
          決め手になるのは見た目の好み、タイプの好み、そして思い出——。
          それこそが御三家という文化の本質なのでしょう。
          あなたの推し御三家が本当に一番人気なのかは、
          当サイトの<a href="/" style={{ color: '#3B4CCA' }}>投票バトル</a>で確かめられます。
          全ポケモンの頂点を争う<a href="/pokemon-stats" style={{ color: '#3B4CCA' }}>合計種族値TOP30</a>や、
          <a href="/generation-power" style={{ color: '#3B4CCA' }}>世代別インフレ検証</a>も合わせてどうぞ。
        </p>

        <ArticleFooter slug="starters" />
      </div>
    </div>
  );
}
