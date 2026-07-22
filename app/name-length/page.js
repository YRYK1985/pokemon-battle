import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: 'ポケモン名の文字数分析：最長6文字・最短2文字 | ポケモン 人気バトル',
  description:
    '全1,025体のポケモン名（日本語）の文字数を集計。最も長い名前・短い名前・文字数の分布から、名前デザインの法則を探る小ネタ統計記事です。',
};

export default function NameLengthPage() {
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const dist = {};
  pokemons.forEach((p) => {
    const len = p.nameJa.length;
    (dist[len] = dist[len] || []).push(p);
  });
  const lens = Object.keys(dist).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...lens.map((l) => dist[l].length));
  const shortest = dist[lens[0]];
  const longest = dist[lens[lens.length - 1]];

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
    barRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '12px' },
    bar: { height: '16px', background: 'linear-gradient(90deg,#FFCB05,#F5B800)', borderRadius: '4px' },
    link: { color: '#3B4CCA', textDecoration: 'none' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>ポケモン名の文字数分析：最長6文字・最短2文字の世界</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体の日本語名（第1〜第9世代）。
        </p>

        <p style={style.p}>
          フシギダネは5文字、ピカチュウも5文字、リザードンも5文字——。
          そう言われてみると、ポケモンの名前には「ちょうどいい長さ」がある気がしませんか？
          全{pokemons.length.toLocaleString()}体の日本語名の文字数を集計して、
          名前デザインの隠れた法則を探ってみました。
        </p>

        <h2 style={style.h2}>文字数の分布</h2>
        <div style={{ marginBottom: '16px' }}>
          {lens.map((l) => (
            <div key={l} style={style.barRow}>
              <span style={{ width: '52px', color: '#A0926E' }}>{l}文字</span>
              <div style={{ ...style.bar, width: `${(dist[l].length / maxCount) * 60}%`, minWidth: '4px' }} />
              <span style={{ fontWeight: 700 }}>{dist[l].length}体</span>
              <span style={{ color: '#A0926E' }}>（{((dist[l].length / pokemons.length) * 100).toFixed(1)}%）</span>
            </div>
          ))}
        </div>
        <p style={style.p}>
          結果は一目瞭然。<strong style={style.strong}>5文字が{dist[5].length}体（{((dist[5].length / pokemons.length) * 100).toFixed(0)}%）で圧倒的多数派</strong>、
          次いで4文字が{dist[4].length}体。この2つで全体の8割以上を占めます。
          日本語名は最大6文字という制約（ゲーム内表示の都合）があるなかで、
          「呼びやすく、覚えやすく、個性が出る」長さとして5文字に収束しているようです。
        </p>

        <h2 style={style.h2}>最短2文字の希少種たち</h2>
        <p style={style.p}>
          全ポケモン中わずか{shortest.length}体しかいない2文字組は、
          {shortest.map((p, i) => (
            <span key={p.id}>
              {i > 0 && '、'}
              <Link href={`/pokemon/${p.id}`} style={style.link}>{p.nameJa}</Link>
            </span>
          ))}
          。声に出すと一瞬で終わる潔さが魅力です。
          対する6文字組は{longest.length}体で、全体の1割弱。
          マフォクシーやジガルデのように、進化後や伝説級の
          「風格のある名前」に多い傾向があります。
        </p>

        <h2 style={style.h2}>文字数と「強そう感」の関係</h2>
        <p style={style.p}>
          面白いのは、名前の長さがポケモンの立ち位置とゆるやかに相関していること。
          進化前の小さなポケモンには短い名前（ボチ、ヒコザルなど）、
          最終進化や伝説には長い名前が付きやすい——
          つまり<strong style={style.strong}>名前の長さは「成長の証」</strong>でもあるのです。
          日本語の音象徴（短い音＝小さい・かわいい、長い音＝大きい・強い）を
          巧みに使ったネーミングデザインと言えるでしょう。
        </p>
        <p style={style.p}>
          こうした「どうでもいいけど気になるデータ」も、
          全体を集計してみると設計思想が見えてくるのがデータ分析の面白いところ。
          もっと本格的な分析は<a href="/pokemon-stats" style={{ color: '#3B4CCA' }}>種族値ランキング</a>や
          <a href="/generation-power" style={{ color: '#3B4CCA' }}>世代別インフレ検証</a>でどうぞ。
        </p>

        <ArticleFooter slug="name-length" />
      </div>
    </div>
  );
}
