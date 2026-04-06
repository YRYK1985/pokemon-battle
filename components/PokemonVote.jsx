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

function formatNum(n, lang = 'ja') {
  if (lang === 'ja') {
    if (n >= 100000000) return Math.floor(n / 100000000) + "億";
    if (n >= 10000) return Math.floor(n / 10000) + "万";
    return n.toLocaleString();
  } else {
    // English: use K for thousands, M for millions
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toLocaleString();
  }
}

const TYPE_MAP = {
  normal: { ja: "ノーマル", en: "Normal", color: "#A8A878" },
  fire: { ja: "ほのお", en: "Fire", color: "#F08030" },
  water: { ja: "みず", en: "Water", color: "#6890F0" },
  electric: { ja: "でんき", en: "Electric", color: "#F8D030" },
  grass: { ja: "くさ", en: "Grass", color: "#78C850" },
  ice: { ja: "こおり", en: "Ice", color: "#98D8D8" },
  fighting: { ja: "かくとう", en: "Fighting", color: "#C03028" },
  poison: { ja: "どく", en: "Poison", color: "#A040A0" },
  ground: { ja: "じめん", en: "Ground", color: "#E0C068" },
  flying: { ja: "ひこう", en: "Flying", color: "#A890F0" },
  psychic: { ja: "エスパー", en: "Psychic", color: "#F85888" },
  bug: { ja: "むし", en: "Bug", color: "#A8B820" },
  rock: { ja: "いわ", en: "Rock", color: "#B8A038" },
  ghost: { ja: "ゴースト", en: "Ghost", color: "#705898" },
  dragon: { ja: "ドラゴン", en: "Dragon", color: "#7038F8" },
  dark: { ja: "あく", en: "Dark", color: "#705848" },
  steel: { ja: "はがね", en: "Steel", color: "#B8B8D0" },
  fairy: { ja: "フェアリー", en: "Fairy", color: "#EE99AC" },
};

const GEN_NAMES = {
  1: { ja: "カントー", en: "Kanto" },
  2: { ja: "ジョウト", en: "Johto" },
  3: { ja: "ホウエン", en: "Hoenn" },
  4: { ja: "シンオウ", en: "Sinnoh" },
  5: { ja: "イッシュ", en: "Unova" },
  6: { ja: "カロス", en: "Kalos" },
  7: { ja: "アローラ", en: "Alola" },
  8: { ja: "ガラル", en: "Galar" },
  9: { ja: "パルデア", en: "Paldea" },
};

const FONT = "'M PLUS Rounded 1c', 'Kosugi Maru', system-ui, sans-serif";

const T = {
  ja: {
    title: "ポケモン 人気バトル",
    subtitle: "どっちが好き？タップで投票！",
    voteCount: (count) => `あなた ${count}回投票済み`,
    totalVotes: (count) => `全体 ${count}票`,
    pokemonCount: (count) => `${count}体のポケモン`,
    regionLabel: (gen, count) => `${GEN_NAMES[gen]?.ja || `第${gen}世代`}地方 ${count}体`,
    allGens: "全世代",
    genLabel: (gen) => GEN_NAMES[gen]?.ja || `第${gen}世代`,
    rankingTitle: (gen) => gen === 'all' ? "ポケモン人気ランキング TOP100" : `ポケモン人気ランキング ${GEN_NAMES[gen]?.ja || `第${gen}世代`}`,
    usersAndVotes: (users, votes) => `ユーザー${users}人 全${votes}票 の投票に基づく`,
    backToVoting: "← 投票に戻る",
    viewRankings: "🏆 ランキングを見る",
    skipMatchup: "この組み合わせをスキップ",
    shareOnX: "この投票をXでシェアする",
    votesRemaining: (count) => `あと${count}回投票すると詳しいランキングが見られます`,
    currentTop3: "現在のTOP3",
    viewRandomPokemon: (gen) => gen === 'all' ? "🎲 ランダムでポケモンを見る" : `🎲 ランダムで${GEN_NAMES[gen]?.ja}のポケモンを見る`,
    about: "このサイトについて",
    privacy: "プライバシーポリシー",
    siteDescription: "「ポケモン 人気バトル」は、全{count}体のポケモンをファン投票で順位付けするランキングサイトです。投票にはEloレーティングシステムを採用しており、2体のポケモンを比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。5回投票するとランキング結果を閲覧でき、全世代ランキングと世代別ランキングを切り替えて見ることができます。",
    footerDescription: "全{count}体のポケモンから、好きなポケモンを選んで投票できる人気ランキングサイトです。",
    pokemonNotFound: "ポケモンデータが見つかりません",
    fetchCommand: "node fetch-pokemon.js を実行してデータを生成してください",
    shareText: (name) => `🔥 ポケモン 人気バトル 🔥\n私は「${name}」に投票！`,
  },
  en: {
    title: "Pokémon Popularity Battle",
    subtitle: "Which do you prefer? Tap to vote!",
    voteCount: (count) => `You voted ${count} times`,
    totalVotes: (count) => `Total ${count} votes`,
    pokemonCount: (count) => `${count} Pokémon`,
    regionLabel: (gen, count) => `${GEN_NAMES[gen]?.en || `Gen ${gen}`} ${count} Pokémon`,
    allGens: "All Gens",
    genLabel: (gen) => GEN_NAMES[gen]?.en || `Gen ${gen}`,
    rankingTitle: (gen) => gen === 'all' ? "Pokémon Popularity Ranking TOP100" : `Pokémon Popularity Ranking ${GEN_NAMES[gen]?.en || `Gen ${gen}`}`,
    usersAndVotes: (users, votes) => `Based on ${users} users, ${votes} total votes`,
    backToVoting: "← Back to Voting",
    viewRankings: "🏆 View Rankings",
    skipMatchup: "Skip this matchup",
    shareOnX: "Share this vote on X",
    votesRemaining: (count) => `Vote ${count} more times to see full rankings`,
    currentTop3: "Current TOP 3",
    viewRandomPokemon: (gen) => gen === 'all' ? "🎲 View Random Pokémon" : `🎲 View Random ${GEN_NAMES[gen]?.en} Pokémon`,
    about: "About",
    privacy: "Privacy Policy",
    siteDescription: "Pokémon Popularity Battle is a ranking site that uses fan voting to rank all {count} Pokémon. We use the Elo rating system for voting, where you repeatedly compare two Pokémon to determine \"which do you prefer?\" This produces statistically reliable rankings. After 5 votes, you can view the full ranking results and switch between all-generation and generation-specific rankings.",
    footerDescription: "A popularity ranking site where you can select your favorite Pokémon from {count} total and vote.",
    pokemonNotFound: "Pokémon data not found",
    fetchCommand: "Run node fetch-pokemon.js to generate data",
    shareText: (name) => `🔥 Pokémon Popularity Battle 🔥\nI voted for "${name}"!`,
  },
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
  const [rankGen, setRankGen] = useState(1);
  const [voteGen, setVoteGen] = useState(1);
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poke-lang');
      if (saved) return saved;
      const isJa = navigator.language?.startsWith('ja');
      return isJa ? 'ja' : 'en';
    }
    return 'ja';
  });
  const [expandedCard, setExpandedCard] = useState(false);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('poke-lang', l);
  };

  useEffect(() => {
    document.title = lang === 'ja' ? 'ポケモン 人気バトル' : 'Pokémon Popularity Battle';
  }, [lang]);

  const t = T[lang];

  const voteCountRef = useRef(0);

  const pickPair = useCallback(() => {
    if (POKEMON.length < 2) return;
    let pool;
    if (voteGen === 'all') {
      pool = POKEMON;
    } else {
      pool = POKEMON.filter(p => p.generation === voteGen);
    }
    const effectivePool = pool.length >= 2 ? pool : POKEMON;
    const i = Math.floor(Math.random() * effectivePool.length);
    let j = Math.floor(Math.random() * (effectivePool.length - 1));
    if (j >= i) j++;
    const a = effectivePool[i], b = effectivePool[j];
    setPair(Math.random() < 0.5 ? [a, b] : [b, a]);
    setVotedState(null);
    setPhase('idle');
    setExpandedCard(false);
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

    const winnerPokemon = pair.find(p => p.id === winnerId);
    const winnerName = lang === 'ja' ? winnerPokemon?.nameJa : winnerPokemon?.nameEn;
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
          <h1>{t.pokemonNotFound}</h1>
          <p style={{ color: "#8B7B5E" }}>{t.fetchCommand}</p>
        </div>
      </div>
    );
  }

  // ---- Ranking ----
  if (showRanking) {
    const limit = rankGen === 'all' ? 100 : Infinity;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FFF8E1,#FFF3C4)", color: "#2D3748", fontFamily: FONT, padding: 0, margin: 0, paddingBottom: '80px', position: "relative" }}>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />

        {/* Language Toggle Button */}
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 100, display: "flex", gap: "2px", background: "#fff", borderRadius: "16px", padding: "2px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <button
            onClick={() => changeLang('ja')}
            style={{ padding: isSmallScreen ? "4px 10px" : "6px 14px", borderRadius: "14px", border: "none", fontSize: isSmallScreen ? "11px" : "13px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: lang === 'ja' ? "#3B4CCA" : "transparent", color: lang === 'ja' ? "#fff" : "#8B7B5E", transition: "all 0.2s" }}
          >🇯🇵 JA</button>
          <button
            onClick={() => changeLang('en')}
            style={{ padding: isSmallScreen ? "4px 10px" : "6px 14px", borderRadius: "14px", border: "none", fontSize: isSmallScreen ? "11px" : "13px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: lang === 'en' ? "#3B4CCA" : "transparent", color: lang === 'en' ? "#fff" : "#8B7B5E", transition: "all 0.2s" }}
          >🇺🇸 EN</button>
        </div>

        <div style={{ textAlign: "center", padding: isSmallScreen ? "48px 16px 4px" : "28px 16px 4px" }}>
          <h1 style={{ fontSize: isSmallScreen ? "24px" : "30px", fontWeight: 900, color: "#CC3333", margin: 0 }}>
            {t.rankingTitle(rankGen)}
          </h1>
          <p style={{ color: "#8B7B5E", fontSize: "14px", marginTop: "8px" }}>{t.usersAndVotes(formatNum(Math.floor(matchCount / 5), lang), formatNum(matchCount, lang))}</p>
        </div>
        <div style={{ padding: "8px 16px 16px" }}>
          <button
            style={{ display: "block", margin: "0 auto 16px", padding: "12px 32px", background: "#fff", border: "1px solid #E8D89C", borderRadius: "30px", color: "#CC3333", fontSize: "15px", cursor: "pointer", fontFamily: FONT, fontWeight: 700 }}
            onClick={() => setShowRanking(false)}
          >{t.backToVoting}</button>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", padding: "0 0 16px", maxWidth: "600px", margin: "0 auto" }}>
            <button
              onClick={() => setRankGen('all')}
              style={{ padding: "7px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", background: rankGen === 'all' ? "#3B4CCA" : "#fff", color: rankGen === 'all' ? "#fff" : "#5B8BA8", fontFamily: FONT, boxShadow: rankGen === 'all' ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}
            >{t.allGens}</button>
            {availableGens.map(g => (
              <button
                key={g}
                onClick={() => setRankGen(g)}
                style={{ padding: "7px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", background: rankGen === g ? "#3B4CCA" : "#fff", color: rankGen === g ? "#fff" : "#5B8BA8", fontFamily: FONT, boxShadow: rankGen === g ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}
              >{t.genLabel(g)}</button>
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
                  <img src={p.image} alt={lang === 'ja' ? p.nameJa : p.nameEn} style={{ width: "120px", height: "120px", objectFit: "contain", marginTop: "10px" }} />
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#2D3748", marginTop: "8px" }}>{lang === 'ja' ? p.nameJa : p.nameEn}</div>
                  <div style={{ fontSize: "14px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {p.types.map(typeKey => (
                      <span key={typeKey} style={{ background: TYPE_MAP[typeKey]?.color || "#888", color: "#fff", padding: "2px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                        {lang === 'ja' ? TYPE_MAP[typeKey]?.ja : TYPE_MAP[typeKey]?.en}
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
                    <img src={p.image} alt={lang === 'ja' ? p.nameJa : p.nameEn} style={{ width: "80px", height: "80px", objectFit: "contain", marginTop: "8px" }} />
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#2D3748", marginTop: "6px", textAlign: "center" }}>{lang === 'ja' ? p.nameJa : p.nameEn}</div>
                    <div style={{ fontSize: "12px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                      {p.types.map(typeKey => (
                        <span key={typeKey} style={{ background: TYPE_MAP[typeKey]?.color || "#888", color: "#fff", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
                          {lang === 'ja' ? TYPE_MAP[typeKey]?.ja : TYPE_MAP[typeKey]?.en}
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
                      src={p.image} alt={lang === 'ja' ? p.nameJa : p.nameEn}
                      style={{ width: "64px", height: "64px", objectFit: "contain", marginTop: "8px" }}
                    />
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#2D3748", marginTop: "6px", textAlign: "center", lineHeight: "1.3" }}>{lang === 'ja' ? p.nameJa : p.nameEn}</div>
                    <div style={{ fontSize: "11px", color: "#3B4CCA", fontWeight: 700, marginTop: "4px" }}>Elo {p.elo}</div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                      {p.types.map(typeKey => (
                        <span key={typeKey} style={{ background: TYPE_MAP[typeKey]?.color || "#888", color: "#fff", padding: "1px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 700 }}>
                          {lang === 'ja' ? TYPE_MAP[typeKey]?.ja : TYPE_MAP[typeKey]?.en}
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
            {t.viewRandomPokemon(rankGen)}
          </button>

          <div style={{ maxWidth: "600px", margin: "0 auto 24px", padding: "16px 18px", background: "rgba(255,255,255,0.6)", borderRadius: "12px", lineHeight: "1.9", border: "1px solid rgba(255,203,5,0.08)" }}>
            <p style={{ color: "#8B7B5E", fontSize: "13px", margin: 0 }}>
              {t.siteDescription.replace('{count}', POKEMON.length)}
            </p>
          </div>

          <div style={{ textAlign: "center", padding: "16px 16px 100px", color: "#8B7B5E", fontSize: "13px", lineHeight: "1.8" }}>
            <p style={{ margin: "0 0 8px" }}>{t.footerDescription.replace('{count}', POKEMON.length)}</p>
            <p style={{ margin: "12px 0 0" }}>
              <a href="/about" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "12px" }}>{t.about}</a>
              <span style={{ color: "#E8D89C", margin: "0 8px" }}>|</span>
              <a href="/privacy" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "12px" }}>{t.privacy}</a>
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
    flex: isSmallScreen ? "0 0 calc(50% - 5px)" : 1,
    width: isSmallScreen ? "calc(50% - 5px)" : undefined,
    minWidth: isSmallScreen ? 0 : "320px",
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
    padding: isSmallScreen ? "14px 16px" : "22px 24px",
    transform: isWinner ? "scale(1.03)" : isLoser ? "scale(0.97)" : (!isSmallScreen && isHovered) ? "translateY(-7px) scale(1.02)" : "none",
    opacity: isLoser ? 0.4 : 1,
    boxShadow: (!isSmallScreen && isHovered && phase === 'idle') ? "0 20px 48px rgba(255,203,5,0.15)" : "0 2px 12px rgba(255,203,5,0.08)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FFF8E1,#FFF3C4)", color: "#2D3748", fontFamily: FONT, padding: 0, margin: 0, paddingBottom: '80px', display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800;900&display=swap" rel="stylesheet" />

      {/* Language Toggle Button */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 100, display: "flex", gap: "2px", background: "#fff", borderRadius: "16px", padding: "2px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <button
          onClick={() => changeLang('ja')}
          style={{ padding: isSmallScreen ? "4px 10px" : "6px 14px", borderRadius: "14px", border: "none", fontSize: isSmallScreen ? "11px" : "13px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: lang === 'ja' ? "#3B4CCA" : "transparent", color: lang === 'ja' ? "#fff" : "#8B7B5E", transition: "all 0.2s" }}
        >🇯🇵 JA</button>
        <button
          onClick={() => changeLang('en')}
          style={{ padding: isSmallScreen ? "4px 10px" : "6px 14px", borderRadius: "14px", border: "none", fontSize: isSmallScreen ? "11px" : "13px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: lang === 'en' ? "#3B4CCA" : "transparent", color: lang === 'en' ? "#fff" : "#8B7B5E", transition: "all 0.2s" }}
        >🇺🇸 EN</button>
      </div>

      <div style={{ textAlign: "center", padding: isSmallScreen ? "56px 12px 0" : "48px 16px 0" }}>
        <h1 style={{ fontSize: isSmallScreen ? "34px" : "48px", fontWeight: 900, letterSpacing: "0.06em", margin: 0, lineHeight: "1.3" }}>
          <span style={{ color: "#CC3333" }}>{t.title}</span>
        </h1>
        <p style={{ color: "#3B4CCA", fontSize: isSmallScreen ? "16px" : "19px", fontWeight: 700, letterSpacing: "0.05em", marginTop: "12px", lineHeight: "1.6" }}>{t.subtitle}</p>
        <p style={{ color: "#8B7B5E", fontSize: isSmallScreen ? "13px" : "15px", marginTop: "12px", lineHeight: "1.6" }}>
          {t.voteCount(myVoteCount.toLocaleString())} ・ {t.totalVotes(formatNum(matchCount, lang))} ・ {voteGen === 'all' ? t.pokemonCount(POKEMON.length) : t.regionLabel(voteGen, POKEMON.filter(p => p.generation === voteGen).length)}
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px", padding: "0 8px" }}>
          <button
            onClick={() => setVoteGen('all')}
            style={{ padding: isSmallScreen ? "5px 12px" : "6px 14px", borderRadius: "16px", border: "none", fontSize: isSmallScreen ? "11px" : "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: voteGen === 'all' ? "#3B4CCA" : "#fff", color: voteGen === 'all' ? "#fff" : "#8B7B5E", boxShadow: voteGen === 'all' ? "0 2px 8px rgba(59,76,202,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
          >{t.allGens}</button>
          {availableGens.map(g => (
            <button
              key={g}
              onClick={() => setVoteGen(g)}
              style={{ padding: isSmallScreen ? "5px 12px" : "6px 14px", borderRadius: "16px", border: "none", fontSize: isSmallScreen ? "11px" : "12px", fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: voteGen === g ? "#3B4CCA" : "#fff", color: voteGen === g ? "#fff" : "#8B7B5E", boxShadow: voteGen === g ? "0 2px 8px rgba(59,76,202,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
            >{t.genLabel(g)}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: isSmallScreen ? "10px" : "28px", padding: isSmallScreen ? "20px 6px 12px" : "20px 16px 12px", maxWidth: "1000px", margin: "0 auto", opacity: phase === 'exit' ? 0 : 1, transition: "opacity 0.15s ease", flexDirection: "row" }}>
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
                alt={lang === 'ja' ? pokemon.nameJa : pokemon.nameEn}
                style={{ width: isSmallScreen ? "130px" : "200px", height: isSmallScreen ? "130px" : "200px", objectFit: "contain", marginBottom: "14px" }}
              />
              <div style={{ fontSize: isSmallScreen ? "20px" : "26px", fontWeight: 800, marginBottom: "4px", color: "#2D3748" }}>{lang === 'ja' ? pokemon.nameJa : pokemon.nameEn}</div>
              <div style={{ fontSize: isSmallScreen ? "12px" : "14px", color: "#9B8B6E", marginBottom: "10px" }}>No.{pokemon.id} ・ {t.genLabel(pokemon.generation)}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {pokemon.types.map(typeKey => (
                  <span key={typeKey} style={{ background: TYPE_MAP[typeKey]?.color || "#888", color: "#fff", padding: isSmallScreen ? "3px 10px" : "4px 14px", borderRadius: "8px", fontSize: isSmallScreen ? "12px" : "14px", fontWeight: 700 }}>
                    {lang === 'ja' ? TYPE_MAP[typeKey]?.ja : TYPE_MAP[typeKey]?.en}
                  </span>
                ))}
              </div>
              {/* 詳細展開ボタン */}
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedCard(!expandedCard); }}
                style={{ marginTop: "10px", padding: "6px 18px", background: "transparent", border: "1px solid rgba(59,76,202,0.25)", borderRadius: "14px", color: "#3B4CCA", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
              >
                {expandedCard ? (lang === 'ja' ? '▲ 閉じる' : '▲ Close') : (lang === 'ja' ? '▼ 詳しい情報' : '▼ Details')}
              </button>
              {expandedCard && (
                <div style={{ marginTop: "14px", marginBottom: "-4px", width: "100%", textAlign: "left" }} onClick={(e) => e.stopPropagation()}>
                  {/* 分類 */}
                  {(lang === 'ja' ? pokemon.genus : pokemon.genusEn) && (
                    <div style={{ fontSize: "14px", color: "#8B7B5E", marginBottom: "12px", fontWeight: 600 }}>
                      {lang === 'ja' ? pokemon.genus : pokemon.genusEn}
                    </div>
                  )}
                  {/* 身長・体重 */}
                  {pokemon.height && (
                    <div style={{ display: "flex", gap: "20px", marginBottom: "14px" }}>
                      <div style={{ fontSize: "14px", color: "#8B7B5E" }}>
                        📏 {lang === 'ja' ? '身長' : 'Height'} <strong style={{ color: "#2D3748" }}>{pokemon.height}m</strong>
                      </div>
                      <div style={{ fontSize: "14px", color: "#8B7B5E" }}>
                        ⚖️ {lang === 'ja' ? '体重' : 'Weight'} <strong style={{ color: "#2D3748" }}>{pokemon.weight}kg</strong>
                      </div>
                    </div>
                  )}
                  {/* 図鑑説明文 */}
                  {(lang === 'ja' ? pokemon.flavorJa : pokemon.flavorEn) && (
                    <div style={{ fontSize: "13px", color: "#4A5568", lineHeight: "1.9", padding: "12px 14px", background: "rgba(255,203,5,0.08)", borderRadius: "10px", border: "1px solid rgba(255,203,5,0.2)" }}>
                      {lang === 'ja' ? pokemon.flavorJa : pokemon.flavorEn}
                    </div>
                  )}
                  {/* データがまだない場合 */}
                  {!pokemon.height && !pokemon.flavorJa && (
                    <div style={{ fontSize: "13px", color: "#B0A080", textAlign: "center" }}>
                      {lang === 'ja' ? 'データ読み込み中...' : 'Loading data...'}
                    </div>
                  )}
                </div>
              )}
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
            {t.viewRankings}
          </button>
        )}

        <button
          style={{ padding: "10px 28px", background: "#fff", border: "2px solid #E8D89C", borderRadius: "20px", color: "#8B7B5E", fontSize: "15px", cursor: phase !== 'idle' ? "default" : "pointer", opacity: phase !== 'idle' ? 0.4 : 1, fontFamily: FONT, fontWeight: 700 }}
          onClick={() => { if (phase === 'idle') pickPair(); }}
        >
          {t.skipMatchup}
        </button>

        {lastVote && myVoteCount >= 5 && (
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(t.shareText(lastVote.winnerName) + '\nhttps://www.poke-vote.com')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setLastVote(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "#2D3748", border: "1px solid #2D3748", borderRadius: "20px", color: "#fff", fontSize: "14px", fontWeight: 700, textDecoration: "none", transition: "background 0.15s", fontFamily: FONT }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#3D4758"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2D3748"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            {t.shareOnX}
          </a>
        )}

        {myVoteCount < 5 && (
          <>
            <p style={{ textAlign: "center", color: "#2D3748", fontSize: isSmallScreen ? "15px" : "16px", margin: 0, lineHeight: "1.6", fontWeight: 700 }}>
              {t.votesRemaining(5 - myVoteCount)}
            </p>
            {matchCount > 0 && (
              <div style={{ margin: "8px auto 0", padding: "0 16px" }}>
                <p style={{ textAlign: "center", color: "#8B7B5E", fontSize: "12px", marginBottom: "10px" }}>{t.currentTop3}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                  {ranking.slice(0, 3).map((p, i) => (
                    <div key={p.id} style={{ position: "relative", width: isSmallScreen ? "25vw" : "110px", textAlign: "center" }}>
                      <div style={{ position: "absolute", top: "-6px", left: "-4px", zIndex: 1, width: "24px", height: "24px", borderRadius: "50%", background: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32", color: "#000", fontSize: "13px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                      <img src={p.image} alt={lang === 'ja' ? p.nameJa : p.nameEn} style={{ width: isSmallScreen ? "60px" : "80px", height: isSmallScreen ? "60px" : "80px", objectFit: "contain" }} />
                      <div style={{ fontSize: "12px", color: "#2D3748", marginTop: "4px", fontWeight: 700 }}>{lang === 'ja' ? p.nameJa : p.nameEn}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ padding: "32px 16px 100px", color: "#8B7B5E", fontSize: "13px", lineHeight: "1.9", maxWidth: "640px", margin: "0 auto" }}>
        {/* サイト概要 */}
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "14px", padding: "18px 20px", marginBottom: "12px", border: "1px solid rgba(255,203,5,0.15)" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2D3748", fontSize: "14px" }}>{lang === 'ja' ? 'ポケモン 人気バトルとは' : 'About Pokémon Popularity Battle'}</p>
          <p style={{ margin: 0 }}>{t.siteDescription.replace('{count}', POKEMON.length)}</p>
        </div>
        {/* 遊び方 */}
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "14px", padding: "18px 20px", marginBottom: "12px", border: "1px solid rgba(255,203,5,0.15)" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2D3748", fontSize: "14px" }}>{lang === 'ja' ? '遊び方' : 'How to Play'}</p>
          <p style={{ margin: 0 }}>
            {lang === 'ja'
              ? '2体のポケモンが表示されたら「どっちが好き？」を直感で選んでタップするだけ。特別な知識は必要ありません。5回投票するとランキング画面が解放され、全世代または世代別のランキングを確認できます。「詳しい情報」ボタンを押すと、各ポケモンの種族値（HP・攻撃・防御など）も投票画面から確認できます。'
              : 'When two Pokémon appear, just tap the one you prefer — no special knowledge needed. After 5 votes, the full ranking is unlocked. You can view rankings for all generations or filter by specific region. Tap the "Details" button on each card to check base stats like HP, Attack, and Defense without leaving the vote screen.'}
          </p>
        </div>
        {/* Eloレーティング */}
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "14px", padding: "18px 20px", marginBottom: "12px", border: "1px solid rgba(255,203,5,0.15)" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2D3748", fontSize: "14px" }}>{lang === 'ja' ? 'Eloレーティングとは' : 'What is Elo Rating?'}</p>
          <p style={{ margin: 0 }}>
            {lang === 'ja'
              ? 'チェスや将棋などの対戦競技で使われる統計的なレーティングシステムです。強い（人気の高い）ポケモンに勝つとレーティングが大きく上昇し、弱い相手に勝っても少ししか上がりません。全ポケモンは初期レーティング1200からスタートし、投票が積み重なるほど統計的に信頼性の高い順位が算出されます。'
              : 'The Elo rating system is used in competitive games like chess. Beating a highly-rated (popular) Pokémon gives a big rating boost, while beating a low-rated one gives little. All Pokémon start at 1200, and rankings become statistically more reliable as votes accumulate.'}
          </p>
        </div>
        {/* 世代ガイド */}
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "14px", padding: "18px 20px", marginBottom: "12px", border: "1px solid rgba(255,203,5,0.15)" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2D3748", fontSize: "14px" }}>{lang === 'ja' ? '対応している世代' : 'Supported Generations'}</p>
          <p style={{ margin: 0 }}>
            {lang === 'ja'
              ? '第1世代カントー（151体）・第2世代ジョウト（100体）・第3世代ホウエン（135体）・第4世代シンオウ（107体）・第5世代イッシュ（156体）・第6世代カロス（72体）・第7世代アローラ（88体）・第8世代ガラル（96体）・第9世代パルデア（120体）の計1,025体が対象です。メガシンカ・リージョンフォーム・キョダイマックスなどのフォルム違いは含まれていません。'
              : 'All 1,025 Pokémon across 9 generations are included: Kanto (Gen 1, 151), Johto (Gen 2, 100), Hoenn (Gen 3, 135), Sinnoh (Gen 4, 107), Unova (Gen 5, 156), Kalos (Gen 6, 72), Alola (Gen 7, 88), Galar (Gen 8, 96), and Paldea (Gen 9, 120). Mega Evolutions, Regional Forms, and Gigantamax forms are not included.'}
          </p>
        </div>
        {/* フッターリンク */}
        <div style={{ textAlign: "center", paddingTop: "16px" }}>
          <a href="/about" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "13px" }}>{t.about}</a>
          <span style={{ color: "#E8D89C", margin: "0 8px" }}>|</span>
          <a href="/privacy" style={{ color: "#9B8B6E", textDecoration: "none", fontSize: "13px" }}>{t.privacy}</a>
        </div>
      </div>

      {/* 下固定バナー — 一時停止（AdSense審査対策） */}
    </div>
  );
}
