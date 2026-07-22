import pokemons from '../../lib/pokemon.json';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: 'ポケモン ステータス別No.1大全 | ポケモン 人気バトル',
  description:
    'HP・攻撃・防御・特攻・特防・素早さ——6つのステータスそれぞれの歴代No.1ポケモンをデータで紹介。極端な種族値配分を持つポケモンの面白さを分析します。',
};

const STATS = [
  { key: 'hp', ja: 'HP', desc: '体力。高いほど倒れにくい' },
  { key: 'attack', ja: 'こうげき', desc: '物理技の威力に影響' },
  { key: 'defense', ja: 'ぼうぎょ', desc: '物理技への耐性' },
  { key: 'special-attack', ja: 'とくこう', desc: '特殊技の威力に影響' },
  { key: 'special-defense', ja: 'とくぼう', desc: '特殊技への耐性' },
  { key: 'speed', ja: 'すばやさ', desc: '行動順を決める' },
];

export default function StatExtremesPage() {
  const total = (p) => Object.values(p.stats).reduce((a, b) => a + b, 0);
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

  const rankings = STATS.map((s) => ({
    ...s,
    top5: [...pokemons].sort((a, b) => b.stats[s.key] - a.stats[s.key]).slice(0, 5),
  }));

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
    h2: { fontSize: '16px', fontWeight: 800, color: '#3B4CCA', marginTop: '32px', marginBottom: '8px' },
    note: { fontSize: '13px', color: '#A0926E', marginBottom: '28px' },
    p: { marginBottom: '16px', color: '#5a5240' },
    strong: { color: '#3B4CCA' },
    meta: { fontSize: '12px', color: '#A0926E', marginBottom: '8px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(255,203,5,0.1)', marginBottom: '12px' },
    td: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0' },
    tdR: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0', textAlign: 'right', fontWeight: 700 },
    tdRank: { padding: '8px 14px', borderBottom: '1px solid #f7f0e0', color: '#3B4CCA', fontWeight: 800, width: '36px' },
    link: { color: '#2D3748', textDecoration: 'none' },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>ステータス別No.1ポケモン大全</h1>
        <p style={style.note}>
          対象：全{pokemons.length.toLocaleString()}体（第1〜第9世代） ／ 種族値はPokéAPI経由の公開ゲームデータ。
        </p>

        <p style={style.p}>
          <a href="/pokemon-stats" style={{ color: '#3B4CCA' }}>合計種族値ランキング</a>では
          アルセウスのような「万能型」が上位に並びますが、
          個別のステータスで見ると、まったく違う顔ぶれが登場します。
          ここでは6つのステータスそれぞれの歴代TOP5と、
          極端な種族値配分が生む面白さを紹介します。
          「一芸に全振りしたポケモンたち」の世界へようこそ。
        </p>

        {rankings.map((r) => (
          <div key={r.key}>
            <h2 style={style.h2}>{r.ja} TOP5</h2>
            <p style={style.meta}>{r.desc}</p>
            <table style={style.table}>
              <tbody>
                {r.top5.map((p, i) => (
                  <tr key={p.id}>
                    <td style={style.tdRank}>{i + 1}</td>
                    <td style={style.td}>
                      <Link href={`/pokemon/${p.id}`} style={style.link}>
                        {p.nameJa}
                      </Link>
                      <span style={{ color: '#A0926E', fontSize: '11px' }}>（第{p.generation}世代）</span>
                    </td>
                    <td style={style.tdR}>{p.stats[r.key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <h2 style={style.h2}>極端な配分こそポケモンの面白さ</h2>
        <p style={style.p}>
          このランキングの主役は、なんといっても<strong style={style.strong}>ツボツボ</strong>。
          ぼうぎょ・とくぼうがともに230という異次元の硬さを持ちながら、
          こうげき・とくこうは10、すばやさは5しかありません。
          合計種族値505を極端に防御へ全振りした、まさに「生きた要塞」です。
          HPの<strong style={style.strong}>ハピナス（255）</strong>も同様で、
          この数値は全ポケモン・全ステータスを通じた最大値。
          一方すばやさの頂点<strong style={style.strong}>レジエレキ（200）</strong>は
          第8世代の登場で、それまで長年トップだったポケモンの記録を大きく塗り替えました。
        </p>
        <p style={style.p}>
          注目したいのは、各ステータスのNo.1がほぼすべて「そのステータスの代わりに何かを捨てている」こと。
          こうげき181のカミツルギは紙のような耐久、
          ハピナスは攻撃力がほぼ皆無。ゲームバランスを保ちながら個性を出す
          設計思想が、この極端な配分から透けて見えます。
          全体的な強さの世代変化は<a href="/generation-power" style={{ color: '#3B4CCA' }}>世代別インフレ検証</a>で、
          タイプごとの傾向は<a href="/pokemon-type-stats" style={{ color: '#3B4CCA' }}>タイプ別平均種族値</a>で
          さらに掘り下げています。
        </p>

        <ArticleFooter slug="stat-extremes" />
      </div>
    </div>
  );
}
