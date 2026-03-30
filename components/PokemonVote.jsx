'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

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

const FONT = "'M PLUS Rounded 1c', 'Kosugi Maru', system-ui, sans-serif";

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
  const [voteGen, setVoteGen] = useState('all');

  const voteCountRef = useRef(0);

  const isFirstBattle = useRef(true);

  const pickPair = useCallback(() => {
    if (POKEMON.length < 2) return;
    let pool;
    if (isFirstBattle.current && voteGen === 'all') {
      // 1戦目はカントー地方（第1世代）限定（全世代モード時のみ）
      pool = POKEMON.filter(p => p.generation === 1);
    } else if (voteGen === 'all') {
      pool = POKEMON;
    } else {
      pool = POKEMON.filter(p => p.generation === voteGen);
    }
    isFirstBattle.current = false;
    const effectivePool = pool.length >= 2 ? pool : POKEMON;
    const i = Math.floor(Math.random() * effectivePool.length);
    let j = Math.floor(Math.random() * (effectivePool.length - 1));
    if (j >= i) j++;
    const a = effectivePool[i], b = effectivePool[j];
    setPair(Math.random() < 0.5 ? [a, b] : [b, a]);
    setVotedState(null);
    setPhase('idle');
  }, [voteGen]);

  useEffect(() => { pickPair(); }, [pickPair]);

  // ハッシュ #ranking でランキング直接表示
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#ranking') {
        setShowRanking(true);
        window.history.replaceState(null, '', '/');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

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
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FFF8E1,#FFF3C4)", color: "#2D3748", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <div style={{ textAlign: "center" }}>
          <h1>ポケモンデータが見つかりません</h1>
          <p style={{ color: "#8B7B5E" }}>node fetch-pokemon.js を実行してデータを生成してください</p>
        </div>
      </div>
    );
  }

  // ---- Ranking ----
  if (showRanking) {
    const limit = rankGen === 'all' ? 100 : Infinity;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FFF8E1,#FFF3C4)", color: "#2D3748", fontFamily: FONT, padding: 0, margin: 0, paddingBottom: '80px' }}>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />

        <div style={{ textAlign: "center", padding: "28px 16px 4px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#CC3333", margin: 0 }}>
            ポケモン人気ランキング {rankGen === 'all' ? 'TOP100' : `${GEN_NAMES[rankGen] || `第${rankGen}世代`}`}
          </h1>
          <p style={{ color: "#8B7B5E", fontSize: "14px", marginTop: "8px" }}>ユーザー{formatNum(Math.floor(matchCount / 5))}人 全{formatNum(matchCount)}票 の投票に基づく</p>
        </div>
        <div style={{ padding: "8px 16px 16px" }}>
          <button
            style={{ display: "block", margin: "0 auto 16px", padding: "12px 32px", background: "#fff", border: "1px solid #E8D89C", borderRadius: "30px", color: "#CC3333", fontSize: "15px", cursor: "pointer", fontFamily: FONT, fontWeight: 700 }}
            onClick={() => setShowRanking(false)}
          >← 投票に戻る</button>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", padding: "0 0 16px", maxWidth: "600px", margin: "0 auto" }}>
            <button
              onClick={() => setRankGen('all')}
              style={{ padding: "7px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", background: rankGen === 'all' ? "#3B4CCA" : "#fff", color: rankGen === 'all' ? "#fff" : "#5B8BA8", fontFamily: FONT, boxShadow: rankGen === 'all' ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}
            >全世代</button>
            {availableGens.map(g => (
              <button
                key={g}
                onClick={() => setRankGen(g)}
                style={{ padding: "7px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", background: rankGen === g ? "#3B4CCA" : "#fff", color: rankGen === g ? "#fff" : "#5B8BA8", fontFamily: FONT, boxShadow: rankGen === g ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}
              >{GEN_NAMES[g] || `第${g}世代`}</button>
            ))}
          </div>

          {/* TOP5 大きいカード: 1位=全幅, 2-5位=半幅(2列) */}
          <div style={{ maxWidth: "600px", margin: "0 auto 10px" }}>
            {/* 1位 - 全幅 */}
            {ranking.length > 0 && (() => {
              const p = ranking[0];
              return (
                <a href={`/pokemon/${p.id}`} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "24px 16px 18px", background: "#fff", borderRadius: "20px",
                  textDecoration: "none", color: "inherit",
                  boxShadow: "0 3px 16px rgba(0,0,0,0.1)",
                  border: "2px solid rgba(255,215,0,0.4)",
                  position: "relative", marginBottom: "10px",
                }}>
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "#ffd700", color: "#000",
                    fontSize: "18px", fontWeight: 900, width: "34px", height: "34px",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>1</div>
                  <img src={p.image} alt={p.nameJa} style={{ width: "120px", height: "120px", objectFit: "contain", marginTop: "10px" }} />
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#2D3748", marginTop: "8px" }}>{p.nameJa}</div>
                  <div style={{ fontSize: "14px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {p.types.map(t => (
                      <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "2px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                        {TYPE_MAP[t]?.ja || t}
                      </span>
                    ))}
                  </div>
                </a>
              );
            })()}

            {/* 2-5位 - 2列グリッド */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {ranking.slice(1, Math.min(5, limit)).map((p, i) => {
                const rank = i + 2;
                const rankColor = rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "#8B7B5E";
                return (
                  <a key={p.id} href={`/pokemon/${p.id}`} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "18px 10px 14px", background: "#fff", borderRadius: "16px",
                    textDecoration: "none", color: "inherit",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                    border: rank <= 3 ? `2px solid ${rankColor}44` : "1px solid rgba(255,203,5,0.2)",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)",
                      background: rankColor, color: rank <= 3 ? "#000" : "#fff",
                      fontSize: "14px", fontWeight: 900, width: "28px", height: "28px",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{rank}</div>
                    <img src={p.image} alt={p.nameJa} style={{ width: "80px", height: "80px", objectFit: "contain", marginTop: "8px" }} />
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#2D3748", marginTop: "6px", textAlign: "center" }}>{p.nameJa}</div>
                    <div style={{ fontSize: "12px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                      {p.types.map(t => (
                        <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
                          {TYPE_MAP[t]?.ja || t}
                        </span>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* 広告スロット一時停止（AdSense審査対策） */}

          {/* 6位以下 3列グリッド */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", maxWidth: "600px", margin: "0 auto" }}>
            {ranking.slice(5, limit).map((p, i) => {
              const actualRank = i + 6;
              const genCount = rankGen !== 'all' ? POKEMON.filter(p => p.generation === rankGen).length : 0;
              const adPositions = rankGen === 'all' ? [20, 50, 100, 150] : genCount > 100 ? [20, 50, 101] : [20, 50];
              const rankColor = "#8B7B5E";
              return (
                <React.Fragment key={p.id}>
                  <a href={`/pokemon/${p.id}`} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "14px 8px 12px", background: "#fff", borderRadius: "16px",
                    textDecoration: "none", color: "inherit",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(255,203,5,0.2)",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)",
                      background: rankColor, color: "#fff",
                      fontSize: "12px", fontWeight: 900, width: "24px", height: "24px",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{actualRank}</div>
                    <img
                      src={p.image} alt={p.nameJa}
                      style={{ width: "64px", height: "64px", objectFit: "contain", marginTop: "8px" }}
                    />
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#2D3748", marginTop: "6px", textAlign: "center", lineHeight: "1.3" }}>{p.nameJa}</div>
                    <div style={{ fontSize: "11px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                      {p.types.map(t => (
                        <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "1px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 700 }}>
                          {TYPE_MAP[t]?.ja || t}
                        </span>
                      ))}
                    </div>
                  </a>
                  {/* 広告スロット一時停止（AdSense審査対策） */}
                </React.Fragment>
              );
            })}
          </div>

          {/* ランキング終わりの広告 — 一時停止（AdSense審査対策） */}

          <button
            style={{ display: "block", margin: "24px auto 16px", padding: "14px 32px", background: "#fff", border: "1px solid #E8D89C", borderRadius: "30px", color: "#CC3333", fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "background 0.2s", fontFamily: FONT }}
            onClick={() => {
              const pool = rankGen === 'all' ? POKEMON : POKEMON.filter(p => p.generation === rankGen);
              const p = pool[Math.floor(Math.random() * pool.length)];
              window.open(`/pokemon/${p.id}`, '_blank');
            }}
            onMouseEnter={(e) => e.target.style.background = "#FFF8E1"}
            onMouseLeave={(e) => e.target.style.background = "#fff"}
          >
            🎲 ランダムで{rankGen === 'all' ? '' : `${GEN_NAMES[rankGen]}の`}ポケモンを見る
          </button>

          <div style={{ maxWidth: "600px", margin: "0 auto 24px", padding: "16px 18px", background: "rgba(255,255,255,0.6)", borderRadius: "12px", lineHeight: "1.9", border: "1px solid rgba(255,203,5,0.08)" }}>
            <p style={{ color: "#8B7B5E", fontSize: "13px", margin: 0 }}>
              「ポケモン 人気バトル」は、全{POKEMON.length}体のポケモンをファン投票で順位付けするランキングサイトです。
              投票にはEloレーティングシステムを採用しており、2体のポケモンを比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。
              5回投票すると全体のランキング結果を閲覧でき、全世代ランキングと世代別ランキングを切り替えて楽しめます。
            </p>
          </div>

          <div style={{ textAlign: "center", padding: "16px 16px 100px", color: "#8B7B5E", fontSize: "13px", lineHeight: "1.8" }}>
            <p style={{ margin: "0 0 8px" }}>全{POKEMON.length}体のポケモンから、好きなポケモンを選んで投票できる人気ランキングサイトです。</p>
            <p style={{ margin: "12px 0 0" }}>
              <a href="/about" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
              <span style={{ color: "#E8D89C", margin: "0 8px" }}>|</span>
              <a href="/privacy" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "12px" }}>プライバシーポリシー</a>
            </p>
          </div>
        </div>

        {/* 下固定バナー — 一時停止（AdSense審査対策） */}
      </div>
    );
  }

  // ---- Vote UI ----
  const [a, b] = pair;
  if (!a || !b) return null;

  const cardStyle = (isWinner, isLoser, isHovered) => ({
    flex: 1,
    minWidth: isSmallScreen ? "auto" : "320px",
    maxWidth: "460px",
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: phase !== 'idle' ? "default" : "pointer",
    transition: "transform 0.35s ease, opacity 0.35s ease, border-color 0.35s ease, box-shadow 0.2s ease",
    border: isWinner ? "2px solid #FFCB05" : (!isSmallScreen && isHovered) ? "2px solid #3B4CCA" : "2px solid rgba(255,203,5,0.25)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: isSmallScreen ? "20px 16px" : "32px 24px",
    transform: isWinner ? "scale(1.03)" : isLoser ? "scale(0.97)" : (!isSmallScreen && isHovered) ? "translateY(-7px) scale(1.02)" : "none",
    opacity: isLoser ? 0.4 : 1,
    boxShadow: (!isSmallScreen && isHovered && phase === 'idle') ? "0 20px 48px rgba(255,203,5,0.15)" : "0 2px 12px rgba(255,203,5,0.08)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FFF8E1,#FFF3C4)", color: "#2D3748", fontFamily: FONT, padding: 0, margin: 0, paddingBottom: '80px', display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", padding: isSmallScreen ? "56px 12px 0" : "48px 16px 0" }}>
        <h1 style={{ fontSize: isSmallScreen ? "34px" : "48px", fontWeight: 900, letterSpacing: "0.06em", margin: 0, lineHeight: "1.3" }}>
          <span style={{ color: "#CC3333" }}>ポケモン 人気バトル</span>
        </h1>
        <p style={{ color: "#3B4CCA", fontSize: isSmallScreen ? "16px" : "19px", fontWeight: 700, letterSpacing: "0.05em", marginTop: "12px", lineHeight: "1.6" }}>どっちが好き？タップで投票！</p>
        <p style={{ color: "#8B7B5E", fontSize: isSmallScreen ? "13px" : "15px", marginTop: "12px", lineHeight: "1.6" }}>
          あなた {myVoteCount.toLocaleString()}回投票済み ・ 全体 {formatNum(matchCount)}票 ・ {voteGen === 'all' ? `${POKEMON.length}体のポケモン` : `${GEN_NAMES[voteGen]}地方 ${POKEMON.filter(p => p.generation === voteGen).length}体`}
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px", padding: "0 8px" }}>
          <button
            onClick={() => setVoteGen('all')}
            style={{ padding: isSmallScreen ? "5px 12px" : "6px 14px", borderRadius: "16px", border: "none", fontSize: isSmallScreen ? "11px" : "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: voteGen === 'all' ? "#3B4CCA" : "#fff", color: voteGen === 'all' ? "#fff" : "#8B7B5E", boxShadow: voteGen === 'all' ? "0 2px 8px rgba(59,76,202,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
          >全世代</button>
          {availableGens.map(g => (
            <button
              key={g}
              onClick={() => setVoteGen(g)}
              style={{ padding: isSmallScreen ? "5px 12px" : "6px 14px", borderRadius: "16px", border: "none", fontSize: isSmallScreen ? "11px" : "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: voteGen === g ? "#3B4CCA" : "#fff", color: voteGen === g ? "#fff" : "#8B7B5E", boxShadow: voteGen === g ? "0 2px 8px rgba(59,76,202,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
            >{GEN_NAMES[g] || `第${g}世代`}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: isSmallScreen ? "8px" : "28px", padding: "20px 16px 12px", maxWidth: "1000px", margin: "0 auto", opacity: phase === 'exit' ? 0 : 1, transition: "opacity 0.15s ease", flexDirection: "row" }}>
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
                style={{ width: isSmallScreen ? "130px" : "200px", height: isSmallScreen ? "130px" : "200px", objectFit: "contain", marginBottom: "14px" }}
              />
              <div style={{ fontSize: isSmallScreen ? "20px" : "26px", fontWeight: 800, marginBottom: "4px", color: "#2D3748" }}>{pokemon.nameJa}</div>
              <div style={{ fontSize: isSmallScreen ? "11px" : "13px", color: "#8B7B5E", marginBottom: "4px", minHeight: isSmallScreen ? "14px" : "17px" }}>{pokemon.genus || "\u00A0"}</div>
              <div style={{ fontSize: isSmallScreen ? "12px" : "14px", color: "#9B8B6E", marginBottom: "10px" }}>No.{pokemon.id} ・ {GEN_NAMES[pokemon.generation] || `第${pokemon.generation}世代`}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {pokemon.types.map(t => (
                  <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: isSmallScreen ? "3px 10px" : "4px 14px", borderRadius: "8px", fontSize: isSmallScreen ? "12px" : "14px", fontWeight: 700 }}>
                    {TYPE_MAP[t]?.ja || t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "8px 0 24px" }}>
        {/* 5回投票後: ランキングボタンをスキップより上に表示 */}
        {myVoteCount >= 5 && (
          <button
            style={{ padding: "14px 36px", background: "#FFCB05", border: "none", borderRadius: "30px", color: "#2D3748", fontSize: "17px", fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,203,5,0.35)", fontFamily: FONT }}
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

        <button
          style={{ padding: "10px 28px", background: "#fff", border: "2px solid #E8D89C", borderRadius: "20px", color: "#8B7B5E", fontSize: "15px", cursor: phase !== 'idle' ? "default" : "pointer", opacity: phase !== 'idle' ? 0.4 : 1, fontFamily: FONT, fontWeight: 700 }}
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
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "#2D3748", border: "1px solid #2D3748", borderRadius: "20px", color: "#fff", fontSize: "14px", fontWeight: 700, textDecoration: "none", transition: "background 0.15s", fontFamily: FONT }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#3D4758"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2D3748"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            この投票をXでシェアする
          </a>
        )}

        {myVoteCount < 5 && (
          <>
            <p style={{ textAlign: "center", color: "#2D3748", fontSize: isSmallScreen ? "15px" : "16px", margin: 0, lineHeight: "1.6", fontWeight: 700 }}>
              あと{5 - myVoteCount}回投票すると詳しいランキングが見られます
            </p>
            {matchCount > 0 && (
              <div style={{ margin: "8px auto 0", padding: "0 16px" }}>
                <p style={{ textAlign: "center", color: "#8B7B5E", fontSize: "12px", marginBottom: "10px" }}>現在のTOP3</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                  {ranking.slice(0, 3).map((p, i) => (
                    <div key={p.id} style={{ position: "relative", width: isSmallScreen ? "25vw" : "110px", textAlign: "center" }}>
                      <div style={{ position: "absolute", top: "-6px", left: "-4px", zIndex: 1, width: "24px", height: "24px", borderRadius: "50%", background: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32", color: "#000", fontSize: "13px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                      <img src={p.image} alt={p.nameJa} style={{ width: isSmallScreen ? "60px" : "80px", height: isSmallScreen ? "60px" : "80px", objectFit: "contain" }} />
                      <div style={{ fontSize: "12px", color: "#2D3748", marginTop: "4px", fontWeight: 700 }}>{p.nameJa}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "32px 16px 100px", color: "#8B7B5E", fontSize: "14px", lineHeight: "1.8" }}>
        <p style={{ margin: "0 0 8px" }}>全{POKEMON.length}体のポケモンから、好きなポケモンを選んで投票できる人気ランキングサイトです。</p>
        <p style={{ margin: "12px 0 0" }}>
          <a href="/about" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "13px" }}>このサイトについて</a>
          <span style={{ color: "#E8D89C", margin: "0 8px" }}>|</span>
          <a href="/privacy" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "13px" }}>プライバシーポリシー</a>
        </p>
      </div>

      {/* 下固定バナー — 一時停止（AdSense審査対策） */}
    </div>
  );
}
