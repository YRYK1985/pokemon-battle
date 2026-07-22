// AdSense スクリプト（コンテンツ量が十分なページのみで読み込む）
// 「パブリッシャーのコンテンツを含まない画面における広告」ポリシー違反を防ぐため、
// 投票UI・ポケモン個別ページ・エラーページでは読み込まない。
export default function AdSense() {
  return (
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9862215132601373"
      crossOrigin="anonymous"
    ></script>
  );
}
