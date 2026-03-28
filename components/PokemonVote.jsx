'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// pokemon.json は fetch-pokemon.js で生成
// ビルド時に静的インポート
let POKEMON = [];
try {
  POKEMON = require("../lib/pokemon.json");
} catch (e) {
  // データ未生成時は空配列
}

const K = 32;
function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function formatNum(n) {
  if (n >= 100000000) return Math.floor(n / 100000000) + "億";
  if (n >= 10000) return Math.floor(n / 10000) + "万";
  return n.toLocaleString();
}

// タイプの日本語名と色
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

// 世代名
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
    setPair([POKEMON[i], POKEMON[j]]);
    setVotedState(null);
    setPhase('idle');
  }, []);

  // 初回ロード
  useEffect(() => {
    pickPair();
    setIsSmallScreen(window.innerWidth < 700);
    const h = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', h);

    // レーティング取得
    fetch('/api/ratings')
      .then(r => r.json())
      .then(data => {
        if (data.ratings && Object.keys(data.ratings).length) {
          setRatings(prev => ({ ...prev, ...data.ratings }));
        }
        if (data.matchCount) setMatchCount(data.matchCount);
      })
      .catch(() => {});

    return () => window.removeEventListener('resize', h);
  }, [pickPair]);

  const vote = useCallback(async (winner, loser) => {
    if (phase !== 'idle') return;
    setPhase('voted');
    setVotedState(winner.id);
    setLastVote({ winnerName: winner.name });

    const eW = expectedScore(ratings[winner.id] || 1200, ratings[loser.id] || 1200);
    const newW = Math.round((ratings[winner.id] || 1200) + K * (1 - eW));
    const eL = expectedScore(ratings[loser.id] || 1200, ratings[winner.id] || 1200);
    const newL = Math.round((ratings[loser.id] || 1200) + K * (0 - eL));
    setRatings(prev => ({ ...prev, [winner.id]: newW, [loser.id]: newL }));
    setMatchCount(prev => prev + 1);
    const newCount = voteCountRef.current + 1;
    voteCountRef.current = newCount;
    setMyVoteCount(newCount);

    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId: String(winner.id), loserId: String(loser.id) }),
    }).catch(() => {});

    setTimeout(() => pickPair(), 800);
  }, [phase, ratings, pickPair]);

  // ランキング計算
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
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0a2e,#1c1c42,#0a2848)", color: "#fff", fontFamily: "system-ui,sans-serif", padding: 0, margin: 0, paddingBottom: '80px' }}>
        <div style={{ textAlign: "center", padding: "24px 16px 4px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, background: "linear-gradient(180deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
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

          {ranking.slice(0, limit).map((p, i) => (
            <a key={p.id} href={`/pokemon/${p.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,0.09)", borderRadius: "12px", marginBottom: "6px", maxWidth: "700px", marginLeft: "auto", marginRight: "auto", textDecoration: "none", color: "inherit" }}>
              <span style={{ fontWeight: 900, fontSize: "18px", width: "32px", textAlign: "center", flexShrink: 0, color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : i <= 4 ? "#88c8e8" : "#666" }}>
                {i + 1}
              </span>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "40px", height: "40px", objectFit: "contain", flexShrink: 0, background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
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
          ))}

          <div style={{ maxWidth: "700px", margin: "24px auto", padding: "16px 18px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", lineHeight: "1.9" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
              「ポケモン 人気バトル」は、全{POKEMON.length}体のポケモンをファン投票で順位付けするランキングサイトです。
              投票にはEloレーティングシステムを採用しており、2体のポケモンを比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。
            </p>
          </div>

          <div style={{ textAlign: "center", padding: "16px", color: "#888", fontSize: "13px" }}>
            <a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
          </div>
        </div>
      </div>
    );
  }

  // ---- Vote UI ----
  const [a, b] = pair;
  if (!a || !b) return null;

  const cardStyle = (pokemon, isHovered) => {
    const isWinner = votedState === pokemon.id;
    const isLoser = votedState && votedState !== pokemon.id;
    return {
      flex: 1,
      minWidth: isSmallScreen ? "auto" : "280px",
      maxWidth: "400px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "16px",
      overflow: "hidden",
      cursor: phase !== 'idle' ? "default" : "pointer",
      transition: "transform 0.35s ease, opacity 0.35s ease, border-color 0.35s ease",
      border: isWinner ? "2px solid rgba(255,210,60,0.7)" : (!isSmallScreen && isHovered) ? "2px solid rgba(255,255,255,0.25)" : "2px solid transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px",
      transform: isWinner ? "scale(1.03)" : isLoser ? "scale(0.97)" : (!isSmallScreen && isHovered) ? "translateY(-7px) scale(1.02)" : "none",
      opacity: isLoser ? 0.4 : 1,
    };
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0a2e,#1c1c42,#0a2848)", color: "#fff", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <h1 style={{ fontSize: isSmallScreen ? "20px" : "26px", fontWeight: 800, textAlign: "center", marginBottom: "4px", background: "linear-gradient(180deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        ポケモン 人気バトル
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>どっちが好き？</p>

      <div style={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: "16px", width: "100%", maxWidth: "840px", justifyContent: "center", alignItems: "stretch" }}>
        {[a, b].map((pokemon) => {
          const isHovered = hoveredCard === pokemon.id;
          return (
            <div
              key={pokemon.id}
              style={cardStyle(pokemon, isHovered)}
              onClick={() => vote(pokemon, pokemon === a ? b : a)}
              onMouseEnter={() => setHoveredCard(pokemon.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={pokemon.image}
                alt={pokemon.name}
                style={{ width: isSmallScreen ? "120px" : "160px", height: isSmallScreen ? "120px" : "160px", objectFit: "contain", marginBottom: "12px" }}
              />
              <div style={{ fontSize: isSmallScreen ? "18px" : "20px", fontWeight: 700, marginBottom: "4px" }}>{pokemon.name}</div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>No.{pokemon.id} ・ {GEN_NAMES[pokemon.generation] || `第${pokemon.generation}世代`}</div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                {pokemon.types.map(t => (
                  <span key={t} style={{ background: TYPE_MAP[t]?.color || "#888", color: "#fff", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
                    {TYPE_MAP[t]?.ja || t}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "#666" }}>
                HP {pokemon.stats.hp} ・ 攻撃 {pokemon.stats.attack} ・ 防御 {pokemon.stats.defense}
              </div>
            </div>
          );
        })}
      </div>

      {lastVote && (
        <p style={{ color: "#aaa", fontSize: "13px", marginTop: "16px" }}>
          「{lastVote.winnerName}」に投票しました！
        </p>
      )}

      {myVoteCount >= 5 && (
        <button
          style={{ marginTop: "16px", padding: "12px 32px", background: "linear-gradient(135deg,#ff6b6b,#ffd93d)", border: "none", borderRadius: "30px", color: "#1a0a2e", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}
          onClick={() => setShowRanking(true)}
        >
          🏆 ランキングを見る
        </button>
      )}

      <p style={{ color: "#aaa", fontSize: isSmallScreen ? "13px" : "14px", marginTop: "16px", lineHeight: "1.6" }}>
        あなた {myVoteCount}回投票済み ・ 全体 {formatNum(matchCount)}票 ・ {POKEMON.length}体のポケモン
      </p>

      {myVoteCount < 5 && (
        <p style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}>あと{5 - myVoteCount}回投票するとランキングが見れます</p>
      )}
    </div>
  );
}
