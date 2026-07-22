// 全記事のメタ情報（/articles ハブ・関連記事フッター・sitemapで共用）
export const ARTICLES = [
  {
    slug: 'pokemon-stats',
    title: '合計種族値ランキング TOP30',
    desc: '全1,025体で最も種族値が高いポケモンは？頂点はアルセウスの720',
    category: 'ランキング',
  },
  {
    slug: 'stat-extremes',
    title: 'ステータス別No.1ポケモン大全',
    desc: 'HP・攻撃・防御・素早さ…6項目それぞれの頂点と極端な配分を分析',
    category: 'ランキング',
  },
  {
    slug: 'pokemon-size',
    title: '身長・体重ランキング',
    desc: '最も重い・軽い・高い・低いポケモンをデータで一覧化',
    category: 'ランキング',
  },
  {
    slug: 'name-length',
    title: 'ポケモン名の文字数分析',
    desc: '最長6文字・最短2文字。1,025体の名前の長さを集計した小ネタ統計',
    category: 'データ分析',
  },
  {
    slug: 'generation-power',
    title: '世代別インフレ検証：種族値は上がり続けているのか',
    desc: '第1〜第9世代の平均種族値を比較。数字で見るパワーインフレの真実',
    category: 'データ分析',
  },
  {
    slug: 'monotype-dual',
    title: '単タイプvs複合タイプ 徹底比較',
    desc: '複合タイプの方が平均種族値が48も高い？タイプ構成の意外な法則',
    category: 'データ分析',
  },
  {
    slug: 'pokemon-types',
    title: 'タイプ別体数ランキング',
    desc: '18タイプで最も多いのは？少ないのは？全体数を集計',
    category: 'データ分析',
  },
  {
    slug: 'pokemon-type-stats',
    title: 'タイプ別 平均種族値ランキング',
    desc: '最も「強い」タイプはどれか。平均種族値で18タイプを比較',
    category: 'データ分析',
  },
  {
    slug: 'pokemon-generations',
    title: '世代別完全データ 第1〜第9世代',
    desc: '各世代の登場数・地方名・特徴をまとめた基礎データ集',
    category: 'データ分析',
  },
  {
    slug: 'pokemon-gen1-vs-gen9',
    title: '第1世代 vs 第9世代 データ比較',
    desc: 'カントーとパルデア、26年の進化をデータで比較する',
    category: 'データ分析',
  },
  {
    slug: 'starters',
    title: '歴代御三家 種族値比較',
    desc: '9世代分の御三家（最終進化）を種族値で比較。最強の御三家は？',
    category: 'データ分析',
  },
  {
    slug: 'elo-guide',
    title: 'Eloレーティング解説：人気ランキングの仕組み',
    desc: '当サイトの順位算出方法を解説。なぜ得票数ではダメなのか',
    category: 'サイト解説',
  },
];

export function getRelated(slug, n = 3) {
  const others = ARTICLES.filter((a) => a.slug !== slug);
  const cur = ARTICLES.find((a) => a.slug === slug);
  const same = others.filter((a) => cur && a.category === cur.category);
  const rest = others.filter((a) => !same.includes(a));
  return [...same, ...rest].slice(0, n);
}
