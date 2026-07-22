import pokemons from '../../lib/pokemon.json';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: 'ポケモン世代別インフレ検証：種族値は上がり続けているのか | ポケモン 人気バトル',
  description:
    '「新しい世代ほどポケモンが強い」は本当か？第1〜第9世代の平均種族値をデータで比較し、パワーインフレの実態を検証します。',
};

const GEN_NAMES = {
  1: 'カントー', 2: 'ジョウト', 3: 'ホウエン', 4: 'シンオウ', 5: 'イッシュ',
  6: 'カロス', 7: 'アローラ', 8: 'ガラル', 9: 'パルデア',
};

export default function GenerationPowerPage() {
  const total = (p) => Object.values(p.stats).reduce((a, b) => a + b, 0);
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const byGen = {};
  pokemons.forEach((p) => {
    (byGen[p.generation] = byGen[p.generation] || []).push(p);
  });
  const gens = Object.keys(byGen)
    .map(Number)
    .sort((a, b) => a - b);
  const rows = gens.map((g) => {
    const list = byGen[g];
    const avg = Math.round(list.reduce((s, p) => s + total(p), 0) / list.length);
    const top = [...list].sort((a, b) => total(b) - total(a))[0];
    return { gen: g, count: list.length, avg, top, topTotal: total([...list].sort((a, b) => total(b) - total(a))[0]) };
  });
  const maxAvg = Math.max(...rows.map((r) => r.avg));
  const minAvg = Math.min(...rows.map((r) => r.avg));
  const minGen = rows.find((r) => r.avg === minAvg);
  const maxGen = rows.find((r) => r.avg === maxAvg);

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
    bar: { height: '16px', background: 'linear-gradient(90deg,#3B4CCA,#6C7CE8)', borderRadius: '4px' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>世代別インフレ検証：種族値は上がり続けているのか</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代） ／ 各世代の平均合計種族値を比較。
        </p>

        <p style={style.p}>
          「最近のポケモンは強すぎる」「昔のポケモンは弱い」——
          ファンの間で繰り返されるこの議論、実際のデータではどうなのでしょうか。
          全{pokemons.length.toLocaleString()}体の合計種族値を世代別に平均して検証しました。
        </p>

        <h2 style={style.h2}>世代別 平均合計種族値</h2>
        <div style={{ marginBottom: '16px' }}>
          {rows.map((r) => (
            <div key={r.gen} style={style.barRow}>
              <span style={{ width: '110px', color: '#A0926E' }}>
                第{r.gen}世代（{GEN_NAMES[r.gen]}）
              </span>
              <div style={{ ...style.bar, width: `${((r.avg - 380) / (maxAvg - 380)) * 55}%`, minWidth: '4px' }} />
              <span style={{ fontWeight: 700 }}>{r.avg}</span>
              <span style={{ color: '#A0926E' }}>（{r.count}体）</span>
            </div>
          ))}
        </div>

        <h2 style={style.h2}>結論：インフレは「している」、ただし一直線ではない</h2>
        <p style={style.p}>
          データを見ると、最低の第{minGen.gen}世代（平均{minGen.avg}）から
          最高の第{maxGen.gen}世代（平均{maxGen.avg}）まで、
          確かに<strong style={style.strong}>約{maxGen.avg - minGen.avg}ポイントの上昇</strong>が確認できます。
          「新しい世代ほど強い」は、平均値で見るかぎり事実です。
        </p>
        <p style={style.p}>
          ただし推移は一直線ではありません。第1〜第3世代はほぼ横ばい（404〜408）で、
          最初の跳躍は<strong style={style.strong}>第4世代（+42の446）</strong>。
          既存ポケモンの進化形が多数追加された世代で、強力な最終進化が平均を押し上げました。
          その後第5・第6世代でいったん落ち着き、第7世代で再び449へ上昇、
          そして<strong style={style.strong}>第9世代が457で歴代最高</strong>を記録しています。
        </p>
        <p style={style.p}>
          興味深いのは、インフレの主因が「全体の底上げ」ではなく
          「上位層の厚み」であること。伝説・準伝説ポケモンの数が世代を追うごとに増え、
          平均を引き上げているのです。一般ポケモンだけで比べると世代間の差はぐっと縮まります。
          つまり「昔のポケモンは弱い」のではなく、「新世代はトップ層が厚い」が正確な表現でしょう。
        </p>
        <p style={style.p}>
          最初と最新の世代をより細かく比べた
          <a href="/pokemon-gen1-vs-gen9" style={{ color: '#3B4CCA' }}>第1世代vs第9世代比較</a>や、
          各世代の基礎データをまとめた
          <a href="/pokemon-generations" style={{ color: '#3B4CCA' }}>世代別完全データ</a>も
          合わせてどうぞ。
        </p>

        <ArticleFooter slug="generation-power" />
      </div>
    </div>
  );
}
