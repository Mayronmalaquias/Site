import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuTrophy,
  LuUsers,
  LuTimer,
  LuShare2,
  LuDownload,
  LuUpload,
  LuPlus,
  LuShuffle,
  LuArrowUp,
  LuArrowDown,
  LuTrash2,
  LuFlag,
  LuX,
  LuCheck,
  LuMedal,
  LuUndo2,
  LuClipboardList,
  LuHandshake,
  LuTarget,
  LuUserPlus,
  LuCrown,
  LuGoal,
  LuChevronUp,
} from 'react-icons/lu';
import '../assets/css/pelada.css';

/* ==========================================================================
   Constantes e helpers puros
   ========================================================================== */
const STORAGE_KEY = 'pelada:v1';
const TEAM_SIZES = [4, 5, 6, 7];
const DURATION_OPTIONS = [5, 7, 8, 10, 12, 15];

const EMPTY_STAT = { goals: 0, assists: 0, wins: 0, played: 0 };

const DEFAULT_STATE = {
  version: 1,
  savedNames: [],
  roster: [], // { id, name }
  queue: [], // id[]
  teamA: [], // id[]
  teamB: [], // id[]
  lastDown: [], // ids que acabaram de descer (destaque)
  lastUp: [], // ids que acabaram de subir (destaque)
  teamSize: 5,
  streaks: { A: 0, B: 0 }, // vitórias seguidas do time que está segurando o campo
  score: { A: 0, B: 0 },
  events: [], // { id, playerId, side, type: 'goal' | 'assist' }
  stats: {}, // id -> EMPTY_STAT
  timer: { durationSec: 600, running: false, remainingSec: 600, deadline: null },
  matchNo: 1,
  history: [], // { matchNo, loserIds, winnerIds, scoreWin, scoreLose, tie }
};

function chunkTeams(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(raw) {
  return String(raw || '').replace(/\s+/g, ' ').trim();
}

function shuffleArray(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatClock(totalSec) {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Merge com o default garante que campos novos existam em dados antigos.
    return { ...DEFAULT_STATE, ...parsed, timer: { ...DEFAULT_STATE.timer, ...(parsed.timer || {}) } };
  } catch (e) {
    return DEFAULT_STATE;
  }
}

function playAlarmSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const start = ctx.currentTime;
    [0, 0.32, 0.64].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.28, start + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start + offset);
      osc.stop(start + offset + 0.3);
    });
    setTimeout(() => ctx.close(), 1300);
  } catch (e) {
    /* silêncio: áudio é opcional */
  }
}

/* ==========================================================================
   Subcomponentes de UI
   ========================================================================== */
function IconButton({ icon: Icon, label, onClick, className = '', disabled }) {
  return (
    <button
      type="button"
      className={`pl-icon-btn ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      <Icon />
    </button>
  );
}

function TeamPlayerRow({ name, stat, moved, onGoal, onAssist }) {
  return (
    <div className="pl-team-player">
      <span className="pl-name">{name}</span>
      {moved === 'up' && (
        <span className="pl-tag-move up" title="Subiu da fila agora">
          <LuArrowUp /> Subiu
        </span>
      )}
      {(stat.goals > 0 || stat.assists > 0) && (
        <span className="pl-counts">
          {stat.goals > 0 && (
            <span title="Gols">
              ⚽<b>{stat.goals}</b>
            </span>
          )}
          {stat.assists > 0 && (
            <span title="Assistências">
              👟<b>{stat.assists}</b>
            </span>
          )}
        </span>
      )}
      <div className="pl-ev-btns">
        <button
          type="button"
          className="pl-ev-btn goal"
          onClick={onGoal}
          aria-label={`Registrar gol de ${name}`}
        >
          <LuGoal /> Gol
        </button>
        <button
          type="button"
          className="pl-ev-btn assist"
          onClick={onAssist}
          aria-label={`Registrar assistência de ${name}`}
        >
          <LuHandshake /> Assist.
        </button>
      </div>
    </div>
  );
}

function FieldTeam({ side, ids, teamSize, nameOf, statOf, upSet, onGoal, onAssist }) {
  const label = side === 'A' ? 'Time A' : 'Time B';
  return (
    <div className={`pl-team ${side}`}>
      <div className="pl-team-head">
        {label}
        <span className="pl-team-count">
          {ids.length}/{teamSize}
        </span>
      </div>
      {ids.length === 0 ? (
        <p className="pl-hint" style={{ padding: '6px 2px' }}>
          Aguardando jogadores da fila…
        </p>
      ) : (
        ids.map((id) => (
          <TeamPlayerRow
            key={id}
            name={nameOf(id)}
            stat={statOf(id)}
            moved={upSet && upSet.has(id) ? 'up' : undefined}
            onGoal={() => onGoal(side, id)}
            onAssist={() => onAssist(side, id)}
          />
        ))
      )}
    </div>
  );
}

/* Bloco de time reutilizável (fila, "se formando", já jogaram, campo somente leitura).
   Preenche vagas vazias até teamSize para deixar claro quanta gente falta. */
function TeamBlock({ title, badge, badgeTone, tone, ids, teamSize, nameOf, upSet, downSet, onRemove }) {
  const emptySlots = Math.max(0, teamSize - ids.length);
  return (
    <div className={`pl-team-block tone-${tone}`}>
      <div className="pl-team-block-head">
        <span className="ttl">{title}</span>
        {badge && <span className={`pl-pill ${badgeTone || ''}`}>{badge}</span>}
      </div>
      <div className="pl-team-block-players">
        {ids.map((id, i) => (
          <div className="pl-block-player" key={id}>
            <span className="pl-num">{i + 1}</span>
            <span className="pl-name">{nameOf(id)}</span>
            {upSet && upSet.has(id) && (
              <span className="pl-tag-move up">
                <LuArrowUp /> Subiu
              </span>
            )}
            {downSet && downSet.has(id) && (
              <span className="pl-tag-move down">
                <LuArrowDown /> Desceu
              </span>
            )}
            {onRemove && (
              <IconButton icon={LuTrash2} label={`Remover ${nameOf(id)}`} className="danger sm" onClick={() => onRemove(id)} />
            )}
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div className="pl-block-player empty" key={`empty-${i}`}>
            <span className="pl-num">{ids.length + i + 1}</span>
            <span className="pl-name pl-slot-empty">vaga livre</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   Página principal
   ========================================================================== */
export default function Pelada() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('partida'); // 'partida' | 'fila' | 'ranking'
  const [now, setNow] = useState(Date.now());
  const [alarm, setAlarm] = useState(false);
  const [pendingTie, setPendingTie] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [orderMode, setOrderMode] = useState('chegada'); // rótulo informativo
  const [sharePreview, setSharePreview] = useState('');
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  const {
    savedNames,
    roster,
    queue,
    teamA,
    teamB,
    lastDown,
    lastUp,
    teamSize,
    streaks,
    score,
    stats,
    timer,
    matchNo,
    history,
  } = state;

  /* ---- Persistência ---- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage cheio/indisponível: ignora */
    }
  }, [state]);

  /* ---- Título da aba ---- */
  useEffect(() => {
    const prev = document.title;
    document.title = 'Pelada — Gerenciador de Racha';
    return () => {
      document.title = prev;
    };
  }, []);

  /* ---- Tick do cronômetro (só roda quando está rodando) ---- */
  useEffect(() => {
    if (!timer.running) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer.running]);

  /* ---- Deriva o tempo restante em segundos ---- */
  const remainingSec = timer.running
    ? Math.max(0, Math.ceil((timer.deadline - now) / 1000))
    : timer.remainingSec;

  /* ---- Dispara o alarme quando o tempo esgota ---- */
  useEffect(() => {
    if (timer.running && timer.deadline && now >= timer.deadline) {
      setState((s) => ({
        ...s,
        timer: { ...s.timer, running: false, remainingSec: 0, deadline: null },
      }));
      setAlarm(true);
      playAlarmSound();
    }
  }, [now, timer.running, timer.deadline]);

  /* ---- Toast helper ---- */
  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  /* ---- Mapas derivados ---- */
  const nameById = useMemo(() => {
    const map = {};
    roster.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [roster]);

  const nameOf = useCallback((id) => nameById[id] || '???', [nameById]);
  const statOf = useCallback((id) => stats[id] || EMPTY_STAT, [stats]);

  const fieldEmpty = teamA.length === 0 && teamB.length === 0;
  const hasBothTeams = teamA.length > 0 && teamB.length > 0;

  // Fila dividida em blocos de time (não em lista corrida).
  const queueTeams = useMemo(() => chunkTeams(queue, teamSize), [queue, teamSize]);
  const lastUpSet = useMemo(() => new Set(lastUp), [lastUp]);
  const lastDownSet = useMemo(() => new Set(lastDown), [lastDown]);

  /* ======================================================================
     Ações — gestão de jogadores
     ====================================================================== */
  const addPlayer = useCallback((raw) => {
    const name = normalizeName(raw);
    if (!name) return;
    setState((s) => {
      const exists = s.roster.some((p) => p.name.toLowerCase() === name.toLowerCase());
      const nextSaved = s.savedNames.some((n) => n.toLowerCase() === name.toLowerCase())
        ? s.savedNames
        : [...s.savedNames, name].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      if (exists) {
        return { ...s, savedNames: nextSaved };
      }
      const id = makeId();
      return {
        ...s,
        roster: [...s.roster, { id, name }],
        queue: [...s.queue, id],
        savedNames: nextSaved,
        stats: { ...s.stats, [id]: { ...EMPTY_STAT } },
      };
    });
  }, []);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!normalizeName(nameInput)) return;
    addPlayer(nameInput);
    setNameInput('');
  };

  const removeSavedName = useCallback((name) => {
    setState((s) => ({
      ...s,
      savedNames: s.savedNames.filter((n) => n !== name),
    }));
  }, []);

  const removePlayer = useCallback((id) => {
    setState((s) => {
      const rest = { ...s.stats };
      delete rest[id];
      return {
        ...s,
        roster: s.roster.filter((p) => p.id !== id),
        queue: s.queue.filter((q) => q !== id),
        teamA: s.teamA.filter((q) => q !== id),
        teamB: s.teamB.filter((q) => q !== id),
        lastDown: s.lastDown.filter((q) => q !== id),
        lastUp: s.lastUp.filter((q) => q !== id),
        events: s.events.filter((ev) => ev.playerId !== id),
        stats: rest,
      };
    });
  }, []);

  const setTeamSize = useCallback((n) => {
    setState((s) => ({ ...s, teamSize: n }));
  }, []);

  const shuffleQueue = useCallback(() => {
    setState((s) => ({ ...s, queue: shuffleArray(s.queue) }));
    setOrderMode('sorteio');
    showToast('Fila embaralhada');
  }, [showToast]);

  /* ======================================================================
     Ações — montagem de times
     ====================================================================== */
  const formTeams = useCallback(
    (shuffle) => {
      setState((s) => {
        const pool = shuffle ? shuffleArray(s.queue) : s.queue;
        const a = pool.slice(0, s.teamSize);
        const b = pool.slice(s.teamSize, s.teamSize * 2);
        const rest = pool.slice(s.teamSize * 2);
        return {
          ...s,
          teamA: a,
          teamB: b,
          queue: rest,
          lastUp: [...a, ...b],
          lastDown: [],
          streaks: { A: 0, B: 0 },
          score: { A: 0, B: 0 },
          events: [],
          timer: { ...s.timer, running: false, remainingSec: s.timer.durationSec, deadline: null },
        };
      });
      setPendingTie(false);
      setAlarm(false);
      setTab('partida');
    },
    [],
  );

  // Desfaz os times: devolve todo mundo pra frente da fila.
  const clearTeams = useCallback(() => {
    setState((s) => ({
      ...s,
      queue: [...s.teamA, ...s.teamB, ...s.queue],
      teamA: [],
      teamB: [],
      lastUp: [],
      streaks: { A: 0, B: 0 },
      score: { A: 0, B: 0 },
      events: [],
      timer: { ...s.timer, running: false, remainingSec: s.timer.durationSec, deadline: null },
    }));
    setPendingTie(false);
    setAlarm(false);
  }, []);

  /* ======================================================================
     Ações — placar e eventos
     ====================================================================== */
  const registerGoal = useCallback((side, playerId) => {
    setState((s) => {
      const st = s.stats[playerId] || EMPTY_STAT;
      return {
        ...s,
        score: { ...s.score, [side]: s.score[side] + 1 },
        stats: { ...s.stats, [playerId]: { ...st, goals: st.goals + 1 } },
        events: [...s.events, { id: makeId(), playerId, side, type: 'goal' }],
      };
    });
  }, []);

  const registerAssist = useCallback((side, playerId) => {
    setState((s) => {
      const st = s.stats[playerId] || EMPTY_STAT;
      return {
        ...s,
        stats: { ...s.stats, [playerId]: { ...st, assists: st.assists + 1 } },
        events: [...s.events, { id: makeId(), playerId, side, type: 'assist' }],
      };
    });
  }, []);

  const adjustScore = useCallback((side, delta) => {
    setState((s) => ({
      ...s,
      score: { ...s.score, [side]: Math.max(0, s.score[side] + delta) },
    }));
  }, []);

  const undoLastEvent = useCallback(() => {
    setState((s) => {
      if (s.events.length === 0) return s;
      const ev = s.events[s.events.length - 1];
      const st = s.stats[ev.playerId] || EMPTY_STAT;
      const nextStat =
        ev.type === 'goal'
          ? { ...st, goals: Math.max(0, st.goals - 1) }
          : { ...st, assists: Math.max(0, st.assists - 1) };
      return {
        ...s,
        score:
          ev.type === 'goal'
            ? { ...s.score, [ev.side]: Math.max(0, s.score[ev.side] - 1) }
            : s.score,
        stats: { ...s.stats, [ev.playerId]: nextStat },
        events: s.events.slice(0, -1),
      };
    });
  }, []);

  /* ======================================================================
     Ações — cronômetro
     ====================================================================== */
  const startTimer = useCallback(() => {
    setAlarm(false);
    setState((s) => {
      const base = s.timer.remainingSec > 0 ? s.timer.remainingSec : s.timer.durationSec;
      return { ...s, timer: { ...s.timer, running: true, remainingSec: base, deadline: Date.now() + base * 1000 } };
    });
    setNow(Date.now());
  }, []);

  const pauseTimer = useCallback(() => {
    setState((s) => {
      const left = s.timer.deadline ? Math.max(0, Math.ceil((s.timer.deadline - Date.now()) / 1000)) : s.timer.remainingSec;
      return { ...s, timer: { ...s.timer, running: false, remainingSec: left, deadline: null } };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setAlarm(false);
    setState((s) => ({
      ...s,
      timer: { ...s.timer, running: false, remainingSec: s.timer.durationSec, deadline: null },
    }));
  }, []);

  const setDuration = useCallback((min) => {
    setState((s) => {
      const durationSec = min * 60;
      return {
        ...s,
        timer: s.timer.running
          ? { ...s.timer, durationSec }
          : { ...s.timer, durationSec, remainingSec: durationSec },
      };
    });
  }, []);

  /* ======================================================================
     Ações — transição de partida (quem sobe / quem desce)
     ====================================================================== */
  const applyTransition = useCallback((loserSide, isTie) => {
    setState((s) => {
      const winnerSide = loserSide === 'A' ? 'B' : 'A';
      const loserIds = s[loserSide === 'A' ? 'teamA' : 'teamB'];
      const winnerIds = s[winnerSide === 'A' ? 'teamA' : 'teamB'];

      // Atualiza estatísticas
      const nextStats = { ...s.stats };
      winnerIds.forEach((id) => {
        const base = nextStats[id] || EMPTY_STAT;
        nextStats[id] = { ...base, played: base.played + 1, wins: base.wins + (isTie ? 0 : 1) };
      });
      loserIds.forEach((id) => {
        const base = nextStats[id] || EMPTY_STAT;
        nextStats[id] = { ...base, played: base.played + 1 };
      });

      // Monta o time que entra: pega da frente da fila. Se não fecha o time,
      // completa com o TOPO de quem acabou de perder (esses "sobem" de novo).
      // O resto dos perdedores desce pro fim da fila.
      const fromQueue = s.queue.slice(0, s.teamSize);
      const shortBy = Math.max(0, s.teamSize - fromQueue.length);
      const climbingLosers = loserIds.slice(0, shortBy); // topo de quem perdeu, sobe pra fechar o time
      const descendingLosers = loserIds.slice(shortBy); // quem sobrou, desce
      const entering = [...fromQueue, ...climbingLosers];
      const newQueue = [...s.queue.slice(fromQueue.length), ...descendingLosers];

      const nextTeamA = loserSide === 'A' ? entering : s.teamA;
      const nextTeamB = loserSide === 'B' ? entering : s.teamB;

      const historyEntry = {
        matchNo: s.matchNo,
        loserIds,
        winnerIds,
        scoreWin: s.score[winnerSide],
        scoreLose: s.score[loserSide],
        tie: !!isTie,
      };

      return {
        ...s,
        stats: nextStats,
        teamA: nextTeamA,
        teamB: nextTeamB,
        queue: newQueue,
        lastDown: descendingLosers,
        // Quem sobe = novatos da fila + perdedores que voltaram pra fechar o time.
        lastUp: entering,
        streaks: { ...s.streaks, [winnerSide]: s.streaks[winnerSide] + 1, [loserSide]: 0 },
        score: { A: 0, B: 0 },
        events: [],
        matchNo: s.matchNo + 1,
        history: [...s.history, historyEntry].slice(-12),
        timer: { ...s.timer, running: false, remainingSec: s.timer.durationSec, deadline: null },
      };
    });
    setPendingTie(false);
    setAlarm(false);
    setTab('partida');
  }, []);

  const finishMatch = useCallback(() => {
    if (!hasBothTeams) return;
    if (score.A === score.B) {
      setPendingTie(true);
      return;
    }
    applyTransition(score.A > score.B ? 'B' : 'A', false);
    showToast('Partida finalizada — próximos subiram!');
  }, [hasBothTeams, score, applyTransition, showToast]);

  const resetPelada = useCallback(() => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Zerar a pelada? Jogadores, fila e estatísticas serão apagados. O histórico de nomes é mantido.')) {
      return;
    }
    setState((s) => ({
      ...DEFAULT_STATE,
      savedNames: s.savedNames,
      teamSize: s.teamSize,
      timer: { ...DEFAULT_STATE.timer, durationSec: s.timer.durationSec, remainingSec: s.timer.durationSec },
    }));
    setPendingTie(false);
    setAlarm(false);
    showToast('Pelada zerada');
  }, [showToast]);

  /* ======================================================================
     Ranking
     ====================================================================== */
  const ranking = useMemo(() => {
    const rows = roster.map((p) => ({ id: p.id, name: p.name, ...(stats[p.id] || EMPTY_STAT) }));
    const byGoals = [...rows].sort((a, b) => b.goals - a.goals || b.assists - a.assists);
    const byAssists = [...rows].sort((a, b) => b.assists - a.assists || b.goals - a.goals);
    const byWins = [...rows].sort((a, b) => b.wins - a.wins || b.played - a.played);
    const top = (list, key) => (list[0] && list[0][key] > 0 ? list[0] : null);
    return {
      rows: byGoals,
      topGoals: top(byGoals, 'goals'),
      topAssists: top(byAssists, 'assists'),
      topWins: top(byWins, 'wins'),
    };
  }, [roster, stats]);

  /* ======================================================================
     Compartilhamento
     ====================================================================== */
  const buildShareText = useCallback(() => {
    const teamLine = (ids) => (ids.length ? ids.map(nameOf).join(', ') : '—');
    const lines = [];
    lines.push(`🏟️ PELADA — Partida #${matchNo}`);
    lines.push(`⏱️ ${formatClock(remainingSec)}  |  Placar: A ${score.A} x ${score.B} B`);
    lines.push('');
    lines.push('🟢 EM CAMPO');
    lines.push(`  Time A: ${teamLine(teamA)}`);
    lines.push(`  Time B: ${teamLine(teamB)}`);
    lines.push('');
    lines.push('🟡 PRÓXIMOS TIMES');
    if (queueTeams.length) {
      queueTeams.forEach((t, i) => {
        const complete = t.length === teamSize;
        const rot = complete ? (i === 0 ? 'Sobe agora' : `${i + 1}º a entrar`) : 'Se formando';
        const falta = complete ? '' : ` (faltam ${teamSize - t.length})`;
        lines.push(`  ${rot}: ${t.map(nameOf).join(', ')}${falta}`);
      });
    } else {
      lines.push('  fila vazia');
    }
    if (lastDown.length) lines.push(`🔴 Desceram: ${lastDown.map(nameOf).join(', ')}`);

    if (ranking.topGoals || ranking.topAssists || ranking.topWins) {
      lines.push('');
      lines.push('🏆 DESTAQUES');
      if (ranking.topGoals) lines.push(`  ⚽ Artilheiro: ${ranking.topGoals.name} (${ranking.topGoals.goals})`);
      if (ranking.topAssists) lines.push(`  👟 Garçom: ${ranking.topAssists.name} (${ranking.topAssists.assists})`);
      if (ranking.topWins) lines.push(`  🥇 Mais vitórias: ${ranking.topWins.name} (${ranking.topWins.wins})`);
    }
    return lines.join('\n');
  }, [matchNo, remainingSec, score, teamA, teamB, queueTeams, teamSize, lastDown, ranking, nameOf]);

  const shareWhatsApp = useCallback(() => {
    const text = buildShareText();
    setSharePreview(text);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }, [buildShareText]);

  const copyShareText = useCallback(async () => {
    const text = buildShareText();
    setSharePreview(text);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Texto copiado!');
    } catch (e) {
      showToast('Copie o texto abaixo 👇');
    }
  }, [buildShareText, showToast]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `pelada-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Arquivo exportado');
  }, [state, showToast]);

  const importJSON = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || !Array.isArray(data.roster)) throw new Error('formato inválido');
          setState({
            ...DEFAULT_STATE,
            ...data,
            timer: { ...DEFAULT_STATE.timer, ...(data.timer || {}), running: false, deadline: null },
          });
          setPendingTie(false);
          setAlarm(false);
          showToast('Pelada importada!');
        } catch (e) {
          showToast('Arquivo inválido');
        }
      };
      reader.readAsText(file);
    },
    [showToast],
  );

  const onImportChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  };

  /* ======================================================================
     Render
     ====================================================================== */
  const timerFaceClass = [
    'pl-timer-face',
    timer.running ? 'running' : '',
    !timer.running && remainingSec === 0 ? 'done' : '',
    timer.running && remainingSec <= 30 ? 'low' : '',
    alarm ? 'alarm' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const savedNotInRoster = useMemo(() => {
    const inRoster = new Set(roster.map((p) => p.name.toLowerCase()));
    return savedNames.map((n) => ({ name: n, used: inRoster.has(n.toLowerCase()) }));
  }, [savedNames, roster]);

  // Renderiza a fila como blocos de time (não como lista corrida).
  const renderQueueTeamBlocks = (limit, withRemove) => {
    const teams = typeof limit === 'number' ? queueTeams.slice(0, limit) : queueTeams;
    return teams.map((ids, i) => {
      const complete = ids.length === teamSize;
      const tone = !complete ? 'forming' : i === 0 ? 'up' : 'wait';
      const title = !complete ? 'Se formando' : i === 0 ? 'Sobe agora' : `${i + 1}º a entrar`;
      const badge = !complete ? `Faltam ${teamSize - ids.length}` : i === 0 ? 'Próximo' : 'Na fila';
      const badgeTone = !complete ? 'amber' : i === 0 ? 'green' : 'amber';
      return (
        <TeamBlock
          key={`qt-${i}`}
          title={title}
          badge={badge}
          badgeTone={badgeTone}
          tone={tone}
          ids={ids}
          teamSize={teamSize}
          nameOf={nameOf}
          downSet={lastDownSet}
          onRemove={withRemove ? removePlayer : undefined}
        />
      );
    });
  };

  // Times que já jogaram e perderam (mais recente primeiro).
  const renderHistoryBlocks = () =>
    history
      .slice()
      .reverse()
      .map((h, idx) => (
        <TeamBlock
          key={`h-${h.matchNo}-${idx}`}
          title={`Partida #${h.matchNo}`}
          badge={h.tie ? 'Empate' : `Perdeu ${h.scoreLose}–${h.scoreWin}`}
          badgeTone="red"
          tone="down"
          ids={h.loserIds}
          teamSize={teamSize}
          nameOf={nameOf}
        />
      ));

  return (
    <div className="pl-app">
      <a href="#pl-content" className="pl-skip">
        Pular para o conteúdo
      </a>

      {/* ---------- HEADER ---------- */}
      <header className="pl-header">
        <div className="pl-shell">
          <div className="pl-header-row">
            <div className="pl-brand">
              <span className="pl-brand-badge" aria-hidden="true">
                ⚽
              </span>
              <div className="pl-brand-txt">
                <h1>Pelada</h1>
                <span>Racha organizado, fila transparente</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <IconButton icon={LuTrash2} label="Zerar pelada" onClick={resetPelada} className="danger" />
              <Link to="/" className="pl-back">
                ← Voltar
              </Link>
            </div>
          </div>

          <nav className="pl-tabs" role="tablist" aria-label="Seções da pelada">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'partida'}
              className={`pl-tab ${tab === 'partida' ? 'is-active' : ''}`}
              onClick={() => setTab('partida')}
            >
              <LuTimer />
              <span className="txt">Partida</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'fila'}
              className={`pl-tab ${tab === 'fila' ? 'is-active' : ''}`}
              onClick={() => setTab('fila')}
            >
              <LuUsers />
              <span className="txt">Fila</span>
              <span className="pl-tab-count">{roster.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'ranking'}
              className={`pl-tab ${tab === 'ranking' ? 'is-active' : ''}`}
              onClick={() => setTab('ranking')}
            >
              <LuTrophy />
              <span className="txt">Ranking</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="pl-content" className="pl-shell">
        {/* ==================================================================
            ABA: PARTIDA
            ================================================================== */}
        {tab === 'partida' && (
          <div className="pl-main" role="tabpanel">
            {fieldEmpty ? (
              <div className="pl-card">
                <h2 className="pl-card-title">
                  <LuUsers /> Montar times
                </h2>
                {roster.length < 2 ? (
                  <p className="pl-hint">
                    Adicione jogadores na aba <strong>Fila</strong> para começar. Você precisa de pelo menos 2 pessoas.
                  </p>
                ) : (
                  <>
                    <p className="pl-hint" style={{ marginBottom: 12 }}>
                      Times de <strong>{teamSize}x{teamSize}</strong>. Tem <strong>{queue.length}</strong> na fila.
                    </p>
                    <div className="pl-actions">
                      <div className="row">
                        <button type="button" className="pl-btn success" onClick={() => formTeams(false)}>
                          <LuFlag /> Por chegada
                        </button>
                        <button type="button" className="pl-btn primary" onClick={() => formTeams(true)}>
                          <LuShuffle /> Sortear times
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* ---- Placar ---- */}
                <div className="pl-card">
                  <h2 className="pl-card-title">
                    <LuTarget /> Placar
                    <span className="pl-pill">Partida #{matchNo}</span>
                  </h2>
                  <div className="pl-scoreboard">
                    <div className="pl-score-side A">
                      <div className="pl-score-name">Time A</div>
                      <div className="pl-score-num">{score.A}</div>
                      <div className="pl-score-adjust">
                        <button type="button" onClick={() => adjustScore('A', -1)} aria-label="Menos um gol do Time A">
                          −
                        </button>
                        <button type="button" onClick={() => adjustScore('A', 1)} aria-label="Mais um gol do Time A">
                          +
                        </button>
                      </div>
                      <span className="pl-streak">{streaks.A > 0 ? `${streaks.A}ª seguida` : ''}</span>
                    </div>
                    <div className="pl-score-vs">×</div>
                    <div className="pl-score-side B">
                      <div className="pl-score-name">Time B</div>
                      <div className="pl-score-num">{score.B}</div>
                      <div className="pl-score-adjust">
                        <button type="button" onClick={() => adjustScore('B', -1)} aria-label="Menos um gol do Time B">
                          −
                        </button>
                        <button type="button" onClick={() => adjustScore('B', 1)} aria-label="Mais um gol do Time B">
                          +
                        </button>
                      </div>
                      <span className="pl-streak">{streaks.B > 0 ? `${streaks.B}ª seguida` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* ---- Cronômetro ---- */}
                <div className="pl-card">
                  <h2 className="pl-card-title">
                    <LuTimer /> Cronômetro
                  </h2>
                  <div className="pl-timer">
                    <div className={timerFaceClass}>
                      <div className="pl-timer-time">{formatClock(remainingSec)}</div>
                      <div className="pl-timer-sub">
                        {alarm
                          ? '⏰ Tempo esgotado!'
                          : timer.running
                          ? 'Em andamento'
                          : remainingSec === timer.durationSec
                          ? 'Pronto para começar'
                          : 'Pausado'}
                      </div>
                    </div>
                    <div className="pl-timer-controls">
                      {timer.running ? (
                        <button type="button" className="pl-btn warn" onClick={pauseTimer}>
                          <LuPause /> Pausar
                        </button>
                      ) : (
                        <button type="button" className="pl-btn success" onClick={startTimer}>
                          <LuPlay /> Iniciar
                        </button>
                      )}
                      <button type="button" className="pl-btn ghost" onClick={resetTimer} aria-label="Resetar cronômetro">
                        <LuRotateCcw />
                      </button>
                      <button
                        type="button"
                        className="pl-btn ghost"
                        onClick={undoLastEvent}
                        disabled={state.events.length === 0}
                        aria-label="Desfazer último gol/assistência"
                        title="Desfazer último evento"
                      >
                        <LuUndo2 />
                      </button>
                    </div>
                    <div className="pl-duration">
                      <span className="pl-field-label">Duração</span>
                      <div className="pl-duration-btns">
                        {DURATION_OPTIONS.map((min) => (
                          <button
                            key={min}
                            type="button"
                            className={timer.durationSec === min * 60 ? 'is-active' : ''}
                            onClick={() => setDuration(min)}
                          >
                            {min}′
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---- Times em campo (gol / assistência) ---- */}
                <div className="pl-card">
                  <h2 className="pl-card-title">
                    <LuGoal /> Em campo
                    <span className="pl-pill green">Jogando</span>
                  </h2>
                  <div className="pl-teams">
                    <FieldTeam
                      side="A"
                      ids={teamA}
                      teamSize={teamSize}
                      nameOf={nameOf}
                      statOf={statOf}
                      upSet={lastUpSet}
                      onGoal={registerGoal}
                      onAssist={registerAssist}
                    />
                    <FieldTeam
                      side="B"
                      ids={teamB}
                      teamSize={teamSize}
                      nameOf={nameOf}
                      statOf={statOf}
                      upSet={lastUpSet}
                      onGoal={registerGoal}
                      onAssist={registerAssist}
                    />
                  </div>
                  <p className="pl-hint" style={{ marginTop: 10 }}>
                    Gols e assistências são opcionais — registre só se quiser.
                  </p>
                </div>

                {/* ---- Próximos times (blocos, não lista) ---- */}
                <div className="pl-card">
                  <h2 className="pl-card-title">
                    <LuChevronUp /> Próximos times
                    <span className="pl-pill amber">Quem sobe</span>
                  </h2>
                  {queueTeams.length === 0 ? (
                    <p className="pl-empty">Ninguém na fila. Adicione jogadores na aba Fila.</p>
                  ) : (
                    <div className="pl-teams-grid">{renderQueueTeamBlocks(2, false)}</div>
                  )}
                  {queueTeams.length > 2 && (
                    <p className="pl-hint" style={{ marginTop: 8 }}>
                      +{queueTeams.length - 2} time(s) na fila — veja tudo na aba Fila.
                    </p>
                  )}
                </div>

                {/* ---- Finalizar / empate ---- */}
                <div className="pl-card">
                  {pendingTie ? (
                    <div className="pl-tie">
                      <p>🤝 Empate! Quem desce pra fila?</p>
                      <div className="btns">
                        <button type="button" className="pl-btn sm" onClick={() => applyTransition('A', true)}>
                          Time A
                        </button>
                        <button type="button" className="pl-btn sm" onClick={() => applyTransition('B', true)}>
                          Time B
                        </button>
                        <button
                          type="button"
                          className="pl-btn sm primary"
                          onClick={() => applyTransition(Math.random() < 0.5 ? 'A' : 'B', true)}
                        >
                          <LuShuffle /> Sortear
                        </button>
                      </div>
                      <button type="button" className="pl-btn ghost sm" onClick={() => setPendingTie(false)}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="pl-actions">
                      <button
                        type="button"
                        className="pl-btn danger block"
                        onClick={finishMatch}
                        disabled={!hasBothTeams}
                      >
                        <LuFlag /> Finalizar partida
                      </button>
                      <button type="button" className="pl-btn ghost block" onClick={clearTeams}>
                        <LuRotateCcw /> Desfazer times (voltar pra fila)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================================================================
            ABA: FILA
            ================================================================== */}
        {tab === 'fila' && (
          <div className="pl-main" role="tabpanel">
            {/* ---- Adicionar jogador ---- */}
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuUserPlus /> Adicionar jogador
              </h2>
              <form className="pl-add-row" onSubmit={handleAddSubmit}>
                <input
                  className="pl-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Nome do jogador (ex: chegou atrasado)"
                  aria-label="Nome do jogador"
                  autoComplete="off"
                  enterKeyHint="done"
                />
                <button type="submit" className="pl-btn primary" disabled={!normalizeName(nameInput)}>
                  <LuPlus /> Add
                </button>
              </form>
              <p className="pl-hint" style={{ marginTop: 8 }}>
                Pode adicionar a qualquer momento — quem chega atrasado vai pro fim da fila.
              </p>

              {savedNotInRoster.length > 0 && (
                <>
                  <span className="pl-field-label" style={{ marginTop: 16 }}>
                    <LuClipboardList style={{ verticalAlign: '-2px', marginRight: 4 }} />
                    Salvos (toque para reutilizar)
                  </span>
                  <div className="pl-saved">
                    {savedNotInRoster.map(({ name, used }) => (
                      <span key={name} className="pl-saved-chip" data-in={used ? 1 : 0}>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => !used && addPlayer(name)}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !used && addPlayer(name)}
                          style={{ cursor: used ? 'default' : 'pointer' }}
                          title={used ? 'Já está na pelada' : 'Adicionar à fila'}
                        >
                          {name}
                        </span>
                        <span
                          className="pl-saved-x"
                          role="button"
                          tabIndex={0}
                          aria-label={`Remover ${name} dos salvos`}
                          onClick={() => removeSavedName(name)}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && removeSavedName(name)}
                        >
                          <LuX size={13} />
                        </span>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ---- Configuração ---- */}
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuUsers /> Configuração
              </h2>
              <div className="pl-setup-grid two">
                <div>
                  <span className="pl-field-label">Tamanho dos times</span>
                  <div className="pl-seg">
                    {TEAM_SIZES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`pl-seg-btn ${teamSize === n ? 'is-active' : ''}`}
                        onClick={() => setTeamSize(n)}
                      >
                        {n}x{n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="pl-field-label">Ordem da fila</span>
                  <div className="pl-seg">
                    <button
                      type="button"
                      className={`pl-seg-btn ${orderMode === 'chegada' ? 'is-active' : ''}`}
                      onClick={() => setOrderMode('chegada')}
                    >
                      <LuFlag /> Chegada
                    </button>
                    <button type="button" className="pl-seg-btn" onClick={shuffleQueue}>
                      <LuShuffle /> Sortear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Em campo: dois times ---- */}
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuGoal /> Em campo
                <span className="pl-pill green">{teamA.length + teamB.length} jogando</span>
              </h2>
              {teamA.length || teamB.length ? (
                <div className="pl-teams-grid">
                  <TeamBlock
                    title="Time A"
                    badge={`${teamA.length}/${teamSize}`}
                    tone="A"
                    ids={teamA}
                    teamSize={teamSize}
                    nameOf={nameOf}
                    upSet={lastUpSet}
                  />
                  <TeamBlock
                    title="Time B"
                    badge={`${teamB.length}/${teamSize}`}
                    tone="B"
                    ids={teamB}
                    teamSize={teamSize}
                    nameOf={nameOf}
                    upSet={lastUpSet}
                  />
                </div>
              ) : (
                <p className="pl-empty">Nenhum time em campo. Monte os times na aba Partida.</p>
              )}
            </div>

            {/* ---- Próximos times: blocos, com "se formando" ---- */}
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuArrowUp /> Próximos times
                <span className="pl-pill amber">{queue.length} na fila</span>
              </h2>
              {queueTeams.length === 0 ? (
                <p className="pl-empty">Fila vazia — adicione jogadores acima.</p>
              ) : (
                <div className="pl-teams-grid">{renderQueueTeamBlocks(null, true)}</div>
              )}
              <p className="pl-hint" style={{ marginTop: 10 }}>
                O <strong>1º time</strong> sobe quando a partida acabar. Se um time está{' '}
                <strong>se formando</strong> (com vagas), quem perdeu e está no topo sobe pra fechar ele; o resto desce.
              </p>
            </div>

            {/* ---- Já jogaram / perderam ---- */}
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuArrowDown /> Já jogaram
                <span className="pl-pill red">{history.length}</span>
              </h2>
              {history.length === 0 ? (
                <p className="pl-empty">Nenhuma partida finalizada ainda.</p>
              ) : (
                <div className="pl-teams-grid">{renderHistoryBlocks()}</div>
              )}
            </div>

            {/* ---- Compartilhamento ---- */}
            <ShareSection
              onWhatsApp={shareWhatsApp}
              onCopy={copyShareText}
              onExport={exportJSON}
              onImportClick={() => fileInputRef.current && fileInputRef.current.click()}
              preview={sharePreview}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={onImportChange}
            />
          </div>
        )}

        {/* ==================================================================
            ABA: RANKING
            ================================================================== */}
        {tab === 'ranking' && (
          <div className="pl-main" role="tabpanel">
            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuTrophy /> Destaques da pelada
              </h2>
              <div className="pl-podium">
                <div className="pl-podium-card goals">
                  <span className="ico">
                    <LuGoal />
                  </span>
                  <div className="lbl">Artilheiro</div>
                  <div className="who">{ranking.topGoals ? ranking.topGoals.name : '—'}</div>
                  <div className="val">{ranking.topGoals ? `${ranking.topGoals.goals} gols` : 'sem gols'}</div>
                </div>
                <div className="pl-podium-card assists">
                  <span className="ico">
                    <LuHandshake />
                  </span>
                  <div className="lbl">Garçom</div>
                  <div className="who">{ranking.topAssists ? ranking.topAssists.name : '—'}</div>
                  <div className="val">
                    {ranking.topAssists ? `${ranking.topAssists.assists} assist.` : 'sem assist.'}
                  </div>
                </div>
                <div className="pl-podium-card wins">
                  <span className="ico">
                    <LuCrown />
                  </span>
                  <div className="lbl">Mais vitórias</div>
                  <div className="who">{ranking.topWins ? ranking.topWins.name : '—'}</div>
                  <div className="val">{ranking.topWins ? `${ranking.topWins.wins} vitórias` : 'sem vitórias'}</div>
                </div>
              </div>
            </div>

            <div className="pl-card">
              <h2 className="pl-card-title">
                <LuMedal /> Tabela geral
              </h2>
              {ranking.rows.length === 0 ? (
                <p className="pl-empty">Nenhum jogador ainda.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th className="rk">#</th>
                        <th>Jogador</th>
                        <th>G</th>
                        <th>A</th>
                        <th>V</th>
                        <th>J</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.rows.map((r, i) => (
                        <tr key={r.id}>
                          <td className="rk">{i + 1}</td>
                          <td className="pname">{r.name}</td>
                          <td>
                            <b>{r.goals}</b>
                          </td>
                          <td>{r.assists}</td>
                          <td>{r.wins}</td>
                          <td>{r.played}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="pl-hint" style={{ marginTop: 10 }}>
                G = gols · A = assistências · V = vitórias · J = jogos
              </p>
            </div>

            <ShareSection
              onWhatsApp={shareWhatsApp}
              onCopy={copyShareText}
              onExport={exportJSON}
              onImportClick={() => fileInputRef.current && fileInputRef.current.click()}
              preview={sharePreview}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={onImportChange}
            />
          </div>
        )}
      </main>

      {toast && (
        <div className="pl-toast" role="status">
          <LuCheck /> {toast}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Seção de compartilhamento (reutilizada em Fila e Ranking)
   ========================================================================== */
function ShareSection({ onWhatsApp, onCopy, onExport, onImportClick, preview }) {
  return (
    <div className="pl-card">
      <h2 className="pl-card-title">
        <LuShare2 /> Compartilhar pelada
      </h2>
      <div className="pl-share-grid">
        <button type="button" className="pl-btn success" onClick={onWhatsApp}>
          <LuShare2 /> WhatsApp
        </button>
        <button type="button" className="pl-btn" onClick={onCopy}>
          <LuClipboardList /> Copiar texto
        </button>
        <button type="button" className="pl-btn" onClick={onExport}>
          <LuDownload /> Exportar JSON
        </button>
        <button type="button" className="pl-btn" onClick={onImportClick}>
          <LuUpload /> Importar JSON
        </button>
      </div>
      <p className="pl-hint" style={{ marginTop: 10 }}>
        Exporte o arquivo e mande pro amigo: ele importa no celular dele e continua de onde parou.
      </p>
      {preview && <pre className="pl-share-preview">{preview}</pre>}
    </div>
  );
}
