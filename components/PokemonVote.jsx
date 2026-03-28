'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

let POKEMON = [];
try {
  POKEMON = require("../lib/pokemon.json");
} catch (e) {}

const K = 32;
function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}
function updateElo(winner, loser) {
  const eW = expectedScore(winner, loser);
  const eL = expectedScore(loser, winner);
  return [Math.round(winner + K * (1 - eW)), Math.round(loser + K * (0 - eL))];
}

function formatNum(n) {
  if (n >= 100000000) return Math.floor(n / 100000000) + "億";
  if (n >= 10000) return Math.floor(n / 10000) + "万";
  return n.toLocaleString();
}

const TYPE_MAP = {
  normal: { ja: "ノーマル", color: "#A8A878" },
  fire: { ja: "ほのお", color: "#F08030" },
  water: { ja: "みず", color: "#6890F0" },
  electric: { ja: "でんき", color: "#F8D030" },
  grass: { ja: "くさ", color: "#78C850" },
  ice: { ja: "こおり", color: "#98D8D8" },
  fighting: { ja: "かくとう", color: "#C03028" },
  poison: { ja: "どく", color: "#A040A0" },
  ground: { ja: "じめん", color: "#E0C068" },
  flying: { ja: "ひこう", color: "#A890F0" },
  psychic: { ja: "エスパー", color: "#F85888" },
  bug: { ja: "むし", color: "#A8B820" },
  rock: { ja: "いわ", color: "#B8A038" },
  ghost: { ja: "ゴースト", color: "#705898" },
  dragon: { ja: "ドラゴン", color: "#7038F8" },
  dark: { ja: "あく", color: "#705848" },
  steel: { ja: "はがね", color: "#B8B8D0" },
  fairy: { ja: "フェアリー", color: "#EE99AC" },
};

const GEN_NAMES = {
  1: "カントー", 2: "ジョウト", 3: "ホウエン", 4: "シンオウ",
  5: "イッシュ", 6: "カロス", 7: "アローラ", 8: "ガラル", 9: "パルデア",
};

export default function PokemonVote() {
  const [ratings, setRatings] = useState(() => {
    const r = {};
    POKEMON.forEach((p) => (r[p.id] = 1200));
    return r;
  });
  const [matchCount, setMatchCount] = useState(0);
  const [myVoteCount, setMyVoteCount] = useState(0);
  const [pair, setPair] = useState([null, null]);
  const [showRanking, setShowRanking] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [votedState, setVotedState] = useState(null);
  const [lastVote, setLastVote] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [rankGen, setRankGen] = useState('all');

  const voteCountRef = useRef(0);

  const pickPair = useCallback(() => {
    if (POKEMON.length < 2) return;
    const i = Math.floor(Math.random() * POKEMON.length);
    let j = Math.floor(Math.random() * (POKEMON.length - 1));
    if (j >= i) j++;
    const a = POKEMON[i], b = POKEMON[j];
    setPair(Math.random() < 0.5 ? [a, b] : [b, a]);
    setVotedState(null);
    setPhase('idle');
  }, []);

  useEffect(() => { pickPair(); }, [pickPair]);

  useEffect(() => {
    fetch('/api/ratings')
      .then(r => r.json())
      .then(data => {
        if (data.ratings && Object.keys(data.ratings).length) {
          setRatings(prev => ({ ...prev, ...data.ratings }));
        }
        if (data.matchCount) setMatchCount(data.matchCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setIsSmallScreen(window.innerWidth < 700);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const vote = (winnerId) => {
    if (phase !== 'idle') return;
    const loserId = pair[0].id === winnerId ? pair[1].id : pair[0].id;

    setRatings((prev) => {
      const [newW, newL] = updateElo(prev[winnerId] || 1200, prev[loserId] || 1200);
      return { ...prev, [winnerId]: newW, [loserId]: newL };
    });
    setMatchCount((c) => c + 1);
    setMyVoteCount((c) => c + 1);
    voteCountRef.current += 1;

    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId: String(winnerId), loserId: String(loserId) }),
    }).catch(() => {});

    const winnerName = pair.find(p => p.id === winnerId)?.nameJa;
    setVotedState({ winnerId, loserId });
    setPhase('voted');
    if (myVoteCount === 0) {
      setLastVote({ winnerName });
    }
    setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        setVotedState(null);
        pickPair();
        setPhase('idle');
      }, 150);
    }, 280);
  };

  const availableGens = useMemo(() =>
    [...new Set(POKEMON.map(p => p.generation))].filter(Boolean).sort((a, b) => a - b),
    []);

  const ranking = useMemo(() => {
    const base = POKEMON.map(p => ({ ...p, elo: ratings[p.id] || 1200 }));
    const filtered = rankGen === 'all' ? base : base.filter(p => p.generation === rankGen);
    return filtered.sort((a, b) => b.elo - a.elo || a.id - b.id);
  }, [ratings, rankGen]);

  if (POKEMON.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#1a1a2e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <h1>ポケモンデータが見つかりません</h1>
          <p style={{ color: "#888" }}>node fetch-pokemon.js を実行してデータを生成してください</p>
        </div>
      </div>
    );
  }

  // ---- Ranking ----
  if (showRanking) {
    const limit = rankGen === 'all' ? 200 : 50;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0a2e,#1c1c42,#0a2848)", color: "#fff", fontFamily: "'Kosugi Maru', system-ui, sans-serif", padding: 0, margin: 0, paddingBottom: '80px' }}>
        <div style={{ textAlign: "center", padding: "24px 16px 4px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, background: "linear-gradient(180deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            ポケモン人気ランキング {rankGen === 'all' ? `TOP${limit}` : `${GEN_NAMES[rankGen] || `第${rankGen}世代`} TOP${limit}`}
          </h1>
          <p style={{ color: "#999", fontSize: "13px", marginTop: "6px" }}>ユーザー{formatNum(Math.floor(matchCount / 5))}人 全{formatNum(matchCount)}票 の投票に基づく</p>
        </div>
        <div style={{ padding: "8px 16px 16px" }}>
          <button
            style={{ display: "block", margin: "0 auto 12px", padding: "10px 28px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "30px", color: "#fff", fontSize: "14px", cursor: "pointer" }}
            onClick={() => setShowRanking(false)}
          >← 投票に戻る</button>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", padding: "0 0 16px", maxWidth: "700px", margin: "0 auto" }}>
            <button
              onClick={() => setRankGen('all')}
              style={{ padding: "6px 14px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: rankGen === 'all' ? "rgba(100,210,255,0.85)" : "rgba(255,255,255,0.08)", color: rankGen === 'all' ? "#fff" : "#aaa" }}
            >全世代</button>
            {availableGens.map(g => (
              <button
                key={g}
                onClick={() => setRankGen(g)}
                style={{ padding: "6px 14px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: rankGen === g ? "rgba(100,210,255,0.85)" : "rgba(255,255,255,0.08)", color: rankGen === g ? "#fff" : "#aaa" }}
              >{GEN_NAMES[g] || `第${g}世代`}</button>
            ))}
          </div>

          {ranking.slice(0, limit).map((p, i) => {
            const adPositions = rankGen === 'all' ? [5, 20, 50, 100, 150] : [5, 20, 50];
            return (
              <div key={p.id}>
                <a href={`/pokemon/${p.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,0.09)", borderRadius: "12px", marginBottom: "6px", maxWidth: "700px", marginLeft: "auto", marginRight: "auto", textDecoration: "none", color: "inherit" }}>
                  <span style={{ fontWeight: 900, fontSize: "18px", width: "32px", textAlign: "center", flexShrink: 0, color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : i <= 4 ? "#88c8e8" : "#666" }}>
                    {i + 1}
                  </span>
                  <img
                    src={p.image}
                    alt={p.nameJa}
                    style={{ width: "40px", height: "40px", objectFit: "contain", flexShrink: 0, background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.nameJa}
                      <span style={{ color: "#666", fontWeight: 400, marginLeft: "6px", fontSize: "11px" }}>No.{p.id}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", display: "flex", gap: "4px", alignItems: "center" }}>
                      Elo {p.elo}
                      {p.types.map(t => (
                        <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "1px 6px", borderRadius: "4px", fontSize: "10px" }}>
                          {TYPE_MAP[t]?.ja || t}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
                {adPositions.includes(i + 1) && (
                  <div className="ad-slot" style={{ maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "6px", padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", textAlign: "center", minHeight: i + 1 === 5 ? "90px" : "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#555", fontSize: "11px" }}>広告スペース{i + 1 === 5 ? "（横長バナー）" : "（レスポンシブ）"}</span>
                  </div>
                )}
              </div>
            );
          })}

          <div className="ad-slot" style={{ maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginTop: "16px", marginBottom: "16px", padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", textAlign: "center", minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#555", fontSize: "11px" }}>広告スペース（レスポンシブ）</span>
          </div>

          <button
            style={{ display: "block", margin: "24px auto 16px", padding: "14px 32px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "30px", color: "#ccc", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            onClick={() => {
              const pool = rankGen === 'all' ? POKEMON : POKEMON.filter(p => p.generation === rankGen);
              const p = pool[Math.floor(Math.random() * pool.length)];
              window.open(`/pokemon/${p.id}`, '_blank');
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.08)"}
          >
            🎲 ランダムで{rankGen === 'all' ? '' : `${GEN_NAMES[rankGen]}の`}ポケモンを見る
          </button>

          <div style={{ maxWidth: "700px", margin: "0 auto 24px", padding: "16px 18px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", lineHeight: "1.9" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
              「ポケモン 人気バトル」は、全{POKEMON.length}体のポケモンをファン投票で順位付けするランキングサイトです。
              投票にはEloレーティングシステムを採用しており、2体のポケモンを比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。
              5回投票すると全体のランキング結果を閲覧でき、全世代ランキングと世代別ランキングを切り替えて楽しめます。
            </p>
          </div>

          <div style={{ textAlign: "center", padding: "16px 16px 100px", color: "#888", fontSize: "13px", lineHeight: "1.8" }}>
            <p style={{ margin: "0 0 8px" }}>全{POKEMON.length}体のポケモンから、好きなポケモンを選んで投票できる人気ランキングサイトです。</p>
            <p style={{ margin: "12px 0 0" }}>
              <a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
              <span style={{ color: "#444", margin: "0 8px" }}>|</span>
              <a href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>プライバシーポリシー</a>
            </p>
          </div>
        </div>

        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: '60px', background: 'rgba(20,20,40,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#555', fontSize: '12px', zIndex: 100,
        }}>
          広告スペース
        </div>
      </div>
    );
  }

  // ---- Vote UI ----
  const [a, b] = pair;
  if (!a || !b) return null;

  const cardStyle = (isWinner, isLoser, isHovered) => ({
    flex: 1,
    minWidth: isSmallScreen ? "auto" : "280px",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: phase !== 'idle' ? "default" : "pointer",
    transition: "transform 0.35s ease, opacity 0.35s ease, border-color 0.35s ease, box-shadow 0.2s ease",
    border: isWinner ? "2px solid rgba(255,210,60,0.7)" : (!isSmallScreen && isHovered) ? "2px solid rgba(255,255,255,0.25)" : "2px solid transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px",
    transform: isWinner ? "scale(1.03)" : isLoser ? "scale(0.97)" : (!isSmallScreen && isHovered) ? "translateY(-7px) scale(1.02)" : "none",
    opacity: isLoser ? 0.4 : 1,
    boxShadow: (!isSmallScreen && isHovered && phase === 'idle') ? "0 20px 48px rgba(0,0,0,0.45)" : "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0a2e,#1c1c42,#0a2848)", color: "#fff", fontFamily: "'Kosugi Maru', system-ui, sans-serif", padding: 0, margin: 0, paddingBottom: '80px', display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", padding: isSmallScreen ? "64px 12px 0" : "56px 16px 0" }}>
        <h1 style={{ fontSize: isSmallScreen ? "32px" : "42px", fontWeight: 900, letterSpacing: "0.08em", margin: 0, lineHeight: "1.4" }}>
          <span style={{ background: "linear-gradient(180deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "none" }}>ポケモン 人気バトル</span>
        </h1>
        <p style={{ color: "#ff9944", fontSize: isSmallScreen ? "15px" : "17px", fontWeight: 700, letterSpacing: "0.05em", marginTop: "12px", lineHeight: "1.6" }}>どっちが好き？タップで投票！</p>
        <p style={{ color: "#aaa", fontSize: isSmallScreen ? "13px" : "14px", marginTop: "12px", lineHeight: "1.6" }}>
          あなた {myVoteCount.toLocaleString()}回投票済み ・ 全体 {formatNum(matchCount)}票 ・ {POKEMON.length}体のポケモン
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: isSmallScreen ? "8px" : "24px", padding: "16px 16px 12px", maxWidth: "900px", margin: "0 auto", opacity: phase === 'exit' ? 0 : 1, transition: "opacity 0.15s ease", flexDirection: "row" }}>
        {[a, b].map((pokemon, idx) => {
          const isWinner = phase === 'voted' && votedState?.winnerId === pokemon.id;
          const isLoser = phase === 'voted' && votedState?.loserId === pokemon.id;
          const isHovered = hoveredCard === idx && phase === 'idle';
          return (
            <div
              key={pokemon.id + "-" + matchCount}
              style={cardStyle(isWinner, isLoser, isHovered)}
              onClick={() => vote(pokemon.id)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={pokemon.image}
                alt={pokemon.nameJa}
                style={{ width: isSmallScreen ? "120px" : "160px", height: isSmallScreen ? "120px" : "160px", objectFit: "contain", marginBottom: "12px" }}
              />
              <div style={{ fontSize: isSmallScreen ? "18px" : "22px", fontWeight: 700, marginBottom: "4px" }}>{pokemon.nameJa}</div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>No.{pokemon.id} ・ {GEN_NAMES[pokemon.generation] || `第${pokemon.generation}世代`}</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {pokemon.types.map(t => (
                  <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
                    {TYPE_MAP[t]?.ja || t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "4px 0 24px" }}>
        <button
          style={{ padding: "8px 24px", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", color: "#888", fontSize: "14px", cursor: phase !== 'idle' ? "default" : "pointer", opacity: phase !== 'idle' ? 0.4 : 1 }}
          onClick={() => { if (phase === 'idle') pickPair(); }}
        >
          この組み合わせをスキップ
        </button>

        {lastVote && myVoteCount >= 5 && (
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`🔥 ポケモン 人気バトル 🔥\n私は「${lastVote.winnerName}」に投票！\nhttps://www.poke-vote.com`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setLastVote(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 20px", background: "#000", border: "1px solid #333", borderRadius: "20px", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#000"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            この投票をXでシェアする
          </a>
        )}

        {myVoteCount < 5 ? (
          <>
            <p style={{ textAlign: "center", color: "#bbb", fontSize: isSmallScreen ? "14px" : "15px", margin: 0, lineHeight: "1.6" }}>
              あと{5 - myVoteCount}回投票すると詳しいランキングが見られます
            </p>
            {matchCount > 0 && (
              <div style={{ margin: "6px auto 0", padding: "0 16px" }}>
                <p style={{ textAlign: "center", color: "#888", fontSize: "11px", marginBottom: "8px" }}>現在のTOP3</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                  {ranking.slice(0, 3).map((p, i) => (
                    <div key={p.id} style={{ position: "relative", width: isSmallScreen ? "25vw" : "100px", textAlign: "center" }}>
                      <div style={{ position: "absolute", top: "-6px", left: "-4px", zIndex: 1, width: "22px", height: "22px", borderRadius: "50%", background: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32", color: "#000", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                      <img src={p.image} alt={p.nameJa} style={{ width: "64px", height: "64px", objectFit: "contain" }} />
                      <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{p.nameJa}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            style={{ padding: "12px 32px", background: "linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)", border: "none", borderRadius: "30px", color: "#1a0a2e", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,107,0.3)" }}
            onClick={() => {
              fetch('/api/ratings').then(r => r.json()).then(data => {
                if (data.ratings && Object.keys(data.ratings).length > 0) {
                  setRatings(prev => ({ ...prev, ...data.ratings }));
                }
                if (data.matchCount) setMatchCount(data.matchCount);
              }).catch(() => {});
              setShowRanking(true);
            }}
          >
            🏆 ランキングを見る
          </button>
        )}
      </div>

      {/* フッター */}
      <div style={{ textAlign: "center", padding: "32px 16px 100px", color: "#888", fontSize: "13px", lineHeight: "1.8" }}>
        <p style={{ margin: "0 0 8px" }}>全{POKEMON.length}体のポケモンから、好きなポケモンを選んで投票できる人気ランキングサイトです。</p>
        <p style={{ margin: "12px 0 0" }}>
          <a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
          <span style={{ color: "#444", margin: "0 8px" }}>|</span>
          <a href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>プライバシーポリシー</a>
        </p>
      </div>

      {/* 固定広告バー */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '60px', background: 'rgba(20,20,40,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#555', fontSize: '12px', zIndex: 100,
      }}>
        広告スペース
      </div>
    </div>
  );
}
