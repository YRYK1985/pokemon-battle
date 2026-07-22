import pokemons from '../../lib/pokemon.json';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: '単タイプvs複合タイプ 徹底比較 | ポケモン 人気バトル',
  description:
    '全1,025体を単タイプと複合タイプに分けてデータ比較。複合タイプの方が平均種族値が高いのはなぜか、世代ごとの複合化トレンドとともに分析します。',
};

export default function MonotypeDualPage() {
  const total = (p) => Object.values(p.stats).reduce((a, b) => a + b, 0);
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const mono = pokemons.filter((p) => p.types.length === 1);
  const dual = pokemons.filter((p) => p.types.length === 2);
  const monoAvg = Math.round(mono.reduce((s, p) => s + total(p), 0) / mono.length);
  const dualAvg = Math.round(dual.reduce((s, p) => s + total(p), 0) / dual.length);

  // 世代別の複合率
  const byGen = {};
  pokemons.forEach((p) => {
    if (!byGen[p.generation]) byGen[p.generation] = { total: 0, dual: 0 };
    byGen[p.generation].total++;
    if (p.types.length === 2) byGen[p.generation].dual++;
  });
  const gens = Object.keys(byGen).map(Number).sort((a, b) => a - b);

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
    td: { padding: '10px 14px', borderBottom: '1px solid #f7f0e0' },
    tdR: { padding: '10px 14px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700 },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>単タイプ vs 複合タイプ 徹底比較</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代） ／ タイプ構成別にデータを集計。
        </p>

        <p style={style.p}>
          ポケモンのタイプ構成は「単タイプ」と「複合タイプ（2タイプ持ち）」の2種類。
          全{pokemons.length.toLocaleString()}体を分類すると、
          単タイプが{mono.length}体、複合タイプが{dual.length}体と、
          ほぼ半々に分かれます。しかし平均種族値を計算すると、意外な差が浮かび上がりました。
        </p>

        <h2 style={style.h2}>基本データ比較</h2>
        <table style={style.table}>
          <thead>
            <tr>
              <th style={style.th}>区分</th>
              <th style={style.thR}>体数</th>
              <th style={style.thR}>割合</th>
              <th style={style.thR}>平均合計種族値</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={style.td}>単タイプ</td>
              <td style={style.tdR}>{mono.length}体</td>
              <td style={style.tdR}>{((mono.length / pokemons.length) * 100).toFixed(1)}%</td>
              <td style={style.tdR}>{monoAvg}</td>
            </tr>
            <tr>
              <td style={style.td}>複合タイプ</td>
              <td style={style.tdR}>{dual.length}体</td>
              <td style={style.tdR}>{((dual.length / pokemons.length) * 100).toFixed(1)}%</td>
              <td style={style.tdR}>{dualAvg}</td>
            </tr>
          </tbody>
        </table>

        <h2 style={style.h2}>複合タイプの方が{dualAvg - monoAvg}も高い理由</h2>
        <p style={style.p}>
          平均合計種族値は単タイプ{monoAvg}に対し、複合タイプ{dualAvg}。
          <strong style={style.strong}>{dualAvg - monoAvg}ポイントもの差</strong>がついています。
          これは偶然ではありません。主な理由は2つ考えられます。
        </p>
        <p style={style.p}>
          第一に<strong style={style.strong}>進化による複合化</strong>。
          多くのポケモンは進化の最終段階で2つ目のタイプを獲得します。
          進化後は種族値も高くなるため、「複合タイプ＝進化後の強い個体が多い」
          という構造的な偏りが生まれるのです。
          第二に<strong style={style.strong}>伝説ポケモンの複合率の高さ</strong>。
          種族値600前後の伝説・準伝説ポケモンはドラゴン×ひこうのような
          複合タイプが多く、これも平均を押し上げています。
        </p>

        <h2 style={style.h2}>世代別 複合タイプ率の推移</h2>
        <table style={style.table}>
          <thead>
            <tr>
              <th style={style.th}>世代</th>
              <th style={style.thR}>登場数</th>
              <th style={style.thR}>複合タイプ</th>
              <th style={style.thR}>複合率</th>
            </tr>
          </thead>
          <tbody>
            {gens.map((g) => (
              <tr key={g}>
                <td style={style.td}>第{g}世代</td>
                <td style={style.tdR}>{byGen[g].total}体</td>
                <td style={style.tdR}>{byGen[g].dual}体</td>
                <td style={style.tdR}>{((byGen[g].dual / byGen[g].total) * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={style.p}>
          世代を追うごとに複合タイプの比率はゆるやかに上昇傾向にあります。
          タイプの組み合わせは理論上18×17÷2＝153通りあり、
          新しい組み合わせを開拓する余地がデザインの自由度につながっているためでしょう。
          「まだ存在しない組み合わせ」が新世代の目玉になることも珍しくありません。
        </p>
        <p style={style.p}>
          タイプ別の詳しい体数は<a href="/pokemon-types" style={{ color: '#3B4CCA' }}>タイプ別体数ランキング</a>、
          タイプごとの強さは<a href="/pokemon-type-stats" style={{ color: '#3B4CCA' }}>タイプ別平均種族値</a>で
          確認できます。あなたの推しポケモンは単タイプ派？複合派？
          <a href="/" style={{ color: '#3B4CCA' }}>投票バトル</a>で推しに1票をどうぞ。
        </p>

        <ArticleFooter slug="monotype-dual" />
      </div>
    </div>
  );
}
