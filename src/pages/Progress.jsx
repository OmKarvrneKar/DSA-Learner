import { useApp } from '../context/AppContext'

const TOPIC_META = {
  arrays:        { label: 'Arrays & Strings',     icon: '📦', path: '/arrays',      problems: 5 },
  'linked-list': { label: 'Linked Lists',          icon: '🔗', path: '/linked-list', problems: 5 },
  stacks:        { label: 'Stacks',                icon: '📚', path: '/stacks',      problems: 4 },
  queues:        { label: 'Queues',                icon: '🚶', path: '/queues',      problems: 4 },
  trees:         { label: 'Trees',                 icon: '🌳', path: '/trees',       problems: 5 },
  graphs:        { label: 'Graphs',                icon: '🕸️', path: '/graphs',      problems: 4 },
  sorting:       { label: 'Sorting & Searching',   icon: '🔢', path: '/sorting',     problems: 4 },
  dp:            { label: 'Dynamic Programming',   icon: '🔄', path: '/dp',          problems: 5 },
  greedy:        { label: 'Greedy Algorithms',     icon: '💰', path: '/greedy',      problems: 5 },
  backtracking:  { label: 'Backtracking',          icon: '🔙', path: '/backtracking',problems: 5 },
  tries:         { label: 'Tries',                 icon: '🌲', path: '/tries',       problems: 5 },
  heaps:         { label: 'Heaps & Priority Queue',icon: '⛰️', path: '/heaps',       problems: 5 },
}

function Ring({ pct, size = 80, color = 'var(--green)', label, sub }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={pct === 0 ? 'var(--border)' : color}
          strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 0.6s' }} />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="var(--text)" fontSize={13} fontWeight={700}>
          {Math.round(pct)}%
        </text>
      </svg>
      {label && <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 4 }}>{label}</div>}
      {sub && <div style={{ fontSize: '0.68rem', color: 'var(--text2)' }}>{sub}</div>}
    </div>
  )
}

export default function Progress() {
  const { state, TOPICS } = useApp()

  const topicsCompleted = TOPICS.filter(t => state.progress[t]?.completed).length
  const totalProblems = Object.values(TOPIC_META).reduce((s, m) => s + m.problems, 0)
  const problemsDone = TOPICS.reduce((s, t) => s + (state.progress[t]?.problemsDone?.length || 0), 0)
  const quizCount = Object.keys(state.quizScores).length
  const noteCount = Object.values(state.notes).filter(n => n && n.trim()).length
  const overallPct = Math.round(((topicsCompleted / TOPICS.length) * 0.5 + (problemsDone / totalProblems) * 0.5) * 100)

  return (
    <div className="content">
      <div className="section-title">📊 Progress Dashboard</div>
      <div className="section-subtitle">Track your learning journey across all topics.</div>

      {/* Overview */}
      <div className="card">
        <h2>🎯 Overall Progress</h2>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
          <Ring pct={overallPct} size={100} color="var(--accent)" label="Overall" sub={`${topicsCompleted}/${TOPICS.length} topics`} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { val: `${topicsCompleted}/${TOPICS.length}`, label: 'Topics Completed', color: 'var(--green)' },
              { val: `${problemsDone}/${totalProblems}`, label: 'Problems Done', color: 'var(--blue)' },
              { val: `${quizCount}`, label: 'Quizzes Taken', color: 'var(--yellow)' },
              { val: `${noteCount}`, label: 'Notes Written', color: 'var(--accent2)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-topic */}
      <div className="card">
        <h2>📚 Topic Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12, marginTop: 12 }}>
          {TOPICS.map(t => {
            const meta = TOPIC_META[t]
            if (!meta) return null
            const prog = state.progress[t] || {}
            const problemsDoneHere = (prog.problemsDone || []).length
            const probPct = meta.problems > 0 ? (problemsDoneHere / meta.problems) * 100 : 0
            const quiz = state.quizScores[t]
            return (
              <div key={t} style={{ background: 'var(--bg2)', border: `1px solid ${prog.completed ? 'var(--green)' : 'var(--border)'}`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{meta.label}</span>
                  {prog.completed && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: '0.9rem' }}>✅</span>}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text2)', marginBottom: 3 }}>
                    <span>Problems</span><span>{problemsDoneHere}/{meta.problems}</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: `${probPct}%` }} />
                  </div>
                </div>
                {quiz && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                    Quiz: <strong style={{ color: quiz.score / quiz.total >= 0.8 ? 'var(--green)' : 'var(--yellow)' }}>
                      {quiz.score}/{quiz.total}
                    </strong>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      {noteCount > 0 && (
        <div className="card">
          <h2>📝 Your Notes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {Object.entries(state.notes).filter(([, v]) => v && v.trim()).map(([key, text]) => (
              <div key={key} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text2)', marginBottom: 4 }}>📌 {key}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz scores */}
      {quizCount > 0 && (
        <div className="card">
          <h2>🧠 Quiz Scores</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            {Object.entries(state.quizScores).map(([topic, { score, total }]) => {
              const meta = TOPIC_META[topic]
              const pct = (score / total) * 100
              return (
                <Ring key={topic} pct={pct} size={80}
                  color={pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--accent)'}
                  label={meta?.icon + ' ' + (meta?.label?.split(' ')[0] || topic)}
                  sub={`${score}/${total}`} />
              )
            })}
          </div>
        </div>
      )}

      {topicsCompleted === 0 && problemsDone === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, borderColor: 'var(--accent2)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
          <h2 style={{ color: 'var(--accent)' }}>Start Your Journey!</h2>
          <p style={{ marginTop: 8 }}>Complete topics, solve problems, and take quizzes to see your progress here.</p>
          <a href="/arrays" style={{ display: 'inline-block', marginTop: 16 }} className="btn btn-primary">Start with Arrays →</a>
        </div>
      )}
    </div>
  )
}
