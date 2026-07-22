import pokemons from '../../lib/pokemon.json';
import AdSense from '../../components/AdSense';
import ArticleFooter from '../../components/ArticleFooter';

export const metadata = {
  title: 'Eloレーティング解説：人気ランキングの仕組み | ポケモン 人気バトル',
  description:
    '当サイトが採用するEloレーティングシステムを詳しく解説。単純な得票数ではなく「どのポケモンに勝ったか」を評価に反映する仕組みと、その統計的な信頼性を紹介します。',
};

export default function EloGuidePage() {
  const total = pokemons.length;
  const FONT = "'M PLUS Rounded 1c', system-ui, sans-serif";

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
    box: {
      background: '#fff',
      border: '1px solid rgba(255,203,5,0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      fontSize: '13px',
      boxShadow: '0 2px 12px rgba(255,203,5,0.1)',
    },
  };

  return (
    <div style={style.page}>
      <div style={style.container}>
        <AdSense />
        <h1 style={style.h1}>Eloレーティング解説：当サイトのランキングはこう決まる</h1>
        <p style={style.note}>
          「ポケモン 人気バトル」が全{total.toLocaleString()}体のポケモンを順位付けするために採用している
          Eloレーティングシステムの仕組みを解説します。
        </p>

        <h2 style={style.h2}>なぜ「得票数ランキング」ではダメなのか</h2>
        <p style={style.p}>
          人気投票と聞いてまず思い浮かぶのは「1人1票で好きなポケモンに投票し、票の多い順に並べる」方式でしょう。
          しかし全{total.toLocaleString()}体という規模でこの方式をやると、大きな問題が起きます。
          投票者は<strong style={style.strong}>知っているポケモンにしか投票できない</strong>のです。
          結果として、アニメやゲームで露出の多い有名ポケモンが上位を独占し、
          第5世代以降のマイナーだけど魅力的なポケモンは、永遠に日の目を見ません。
          これでは「人気ランキング」ではなく「知名度ランキング」になってしまいます。
        </p>
        <p style={style.p}>
          そこで当サイトは「ランダムに選ばれた2体から好きな方を選ぶ」
          <strong style={style.strong}>1対1の対戦形式</strong>を採用しました。
          目の前の2体を比べるだけなので知名度の差が影響しにくく、
          すべてのポケモンに平等な評価のチャンスが与えられます。
        </p>

        <h2 style={style.h2}>Eloレーティングとは何か</h2>
        <p style={style.p}>
          対戦結果を順位に変換する仕組みが<strong style={style.strong}>Eloレーティング</strong>です。
          物理学者アルパド・イロが考案した実力評価システムで、
          チェスの世界ランキングで半世紀以上使われ続けているほか、
          将棋ソフトの強さ評価、サッカーの国際ランキング、
          オンラインゲームのマッチメイキングなど幅広い分野で採用されています。
        </p>
        <div style={style.box}>
          <strong style={{ color: '#3B4CCA' }}>Eloレーティングの基本ルール</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: '18px', color: '#5a5240' }}>
            <li>すべてのポケモンは初期値1200ポイントからスタート</li>
            <li>対戦に勝つとポイントが増え、負けると減る</li>
            <li>格上（高レート）に勝つと大きく増え、格下に勝ってもわずかしか増えない</li>
            <li>格下に負けると大きく減り、格上に負けてもわずかしか減らない</li>
          </ul>
        </div>
        <p style={style.p}>
          この「相手の強さを考慮する」点がEloの核心です。
          たとえば大人気のピカチュウに勝ったマイナーポケモンは一気に評価が上がりますが、
          弱い相手にばかり勝ってもレートはほとんど上がりません。
          <strong style={style.strong}>「誰に勝ったか」が「何回勝ったか」より重視される</strong>ため、
          対戦数に偏りがあっても比較的公平な順位が算出できます。
        </p>

        <h2 style={style.h2}>具体的な計算方法</h2>
        <p style={style.p}>
          ポケモンAとBが対戦するとき、まず両者のレート差から「Aが選ばれる確率（期待勝率）」を計算します。
          レートが同じなら期待勝率は50%、レート差が200あれば格上側の期待勝率は約76%。
          対戦の結果、期待どおり格上が選ばれればレートの変動はわずかで、
          番狂わせが起きれば大きくレートが動きます。
          たとえばレート1200同士なら勝者+16／敗者-16、
          レート1400が1200に負けると敗者は約-24、勝者は約+24。
          この繰り返しで、投票が増えるほど各ポケモンのレートは
          「ファンが感じている本当の人気」に収束していきます。
        </p>

        <h2 style={style.h2}>統計的な信頼性について</h2>
        <p style={style.p}>
          Eloレーティングの精度は対戦数に依存します。対戦数が少ないポケモンのレートは
          まだ「仮の値」で、上下に大きくブレる可能性があります。
          全{total.toLocaleString()}体に十分な対戦数を確保するには多くのファンの参加が必要です。
          だからこそ当サイトは登録不要・匿名・ワンタップ投票の設計にしています。
          あなたの1票が、ランキングの精度を確実に1歩前進させます。
          マッチングは全ポケモンが均等に選ばれる仕組みなので、
          初代の151体から最新世代まで、すべてに平等な評価機会があります。
        </p>

        <h2 style={style.h2}>種族値ランキングとの違いを楽しむ</h2>
        <p style={style.p}>
          当サイトの<a href="/pokemon-stats" style={{ color: '#3B4CCA' }}>合計種族値ランキング</a>は
          ゲーム内の「強さ」のランキングですが、Eloレーティングは「愛され度」のランキングです。
          種族値では下位でも投票で上位に食い込むポケモンがいたら、
          それは強さを超えた魅力の証拠。
          2つのランキングを見比べると、「強いポケモン」と「愛されるポケモン」が
          必ずしも一致しないことがよく分かって面白いですよ。
        </p>

        <ArticleFooter slug="elo-guide" />
      </div>
    </div>
  );
}
