import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const stages = [
  {
    level: 'Beginner',
    color: 'var(--green)',
    bg: 'rgba(0,212,170,0.08)',
    border: 'rgba(0,212,170,0.3)',
    desc: 'Master the fundamentals before moving on',
    topics: [
      { path: '/arrays', icon: '📦', label: 'Arrays & Strings', key: 'arrays', why: 'Foundation for all DSA. Master index access, two pointers, sliding window.' },
      { path: '/stacks', icon: '📚', label: 'Stacks', key: 'stacks', why: 'Understand LIFO, call stack, balanced brackets, undo operations.' },
      { path: '/queues', icon: '🚶', label: 'Queues', key: 'queues', why: 'Master FIFO for BFS, task scheduling, level-order processing.' },
      { path: '/linked-list', icon: '🔗', label: 'Linked Lists', key: 'linked-list', why: 'Pointers, traversal, reversal, cycle detection with Floyd\'s algorithm.' },
      { path: '/big-o', icon: '⚡', label: 'Big-O Notation', key: null, why: 'Understand time & space complexity — essential for every interview.' },
    ]
  },
  {
    level: 'Intermediate',
    color: 'var(--yellow)',
    bg: 'rgba(255,215,0,0.06)',
    border: 'rgba(255,215,0,0.3)',
    desc: 'Build problem-solving patterns and deeper structures',
    topics: [
      { path: '/sorting', icon: '🔢', label: 'Sorting & Searching', key: 'sorting', why: 'Merge/Quick sort, binary search — used everywhere in interviews.' },
      { path: '/trees', icon: '🌳', label: 'Trees & BST', key: 'trees', why: 'Recursion practice, DFS/BFS on trees, BST operations, LCA.' },
      { path: '/heaps', icon: '⛰️', label: 'Heaps', key: 'heaps', why: 'Priority queues for Top-K, scheduling, and greedy algorithms.' },
      { path: '/greedy', icon: '💰', label: 'Greedy Algorithms', key: 'greedy', why: 'Recognize problems where local optimal leads to global optimal.' },
      { path: '/tries', icon: '🌲', label: 'Tries', key: 'tries', why: 'Prefix trees for string problems, autocomplete, word search.' },
    ]
  },
  {
    level: 'Advanced',
    color: 'var(--accent)',
    bg: 'rgba(233,69,96,0.06)',
    border: 'rgba(233,69,96,0.3)',
    desc: 'Crack FAANG and hard interview problems',
    topics: [
      { path: '/graphs', icon: '🕸️', label: 'Graphs', key: 'graphs', why: 'BFS/DFS, Dijkstra, cycle detection, topological sort — huge interview topic.' },
      { path: '/dp', icon: '🔄', label: 'Dynamic Programming', key: 'dp', why: 'The hardest and most important topic. Memoization, knapsack, sequences.' },
      { path: '/backtracking', icon: '🔙', label: 'Backtracking', key: 'backtracking', why: 'Subsets, permutations, N-Queens — combinatorial problem solving.' },
      { path: '/interview', icon: '🎯', label: 'Interview Questions', key: null, why: 'Company-specific prep. Practice under mock conditions.' },
    ]
  },
]

const tips = [
  { icon: '📅', title: 'Daily Practice', desc: 'Even 30 min/day is better than 5 hours on weekends. Consistency beats intensity.' },
  { icon: '🔁', title: 'Revisit Weak Areas', desc: 'Track what you got wrong. Redo those problems a week later.' },
  { icon: '🕐', title: 'Time Yourself', desc: 'Use the Mock Interview timer. Real interviews are 45-60 minutes.' },
  { icon: '💬', title: 'Explain Out Loud', desc: 'Practice talking through your approach as you solve. Interviewers want to hear your thinking.' },
]

export default function Roadmap() {
  const { getTopicProgress } = useApp()

  return (
    <div className="content">
      <div className="section-title">🗺️ Study Roadmap</div>
      <div className="section-subtitle">A structured path from beginner to cracking FAANG interviews. Follow in order.</div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(77,166,255,0.08), rgba(0,212,170,0.08))', borderColor: 'var(--blue)' }}>
        <h2 style={{ color: 'var(--blue)' }}>⏱ Suggested Timeline</h2>
        <div style={{ display: 'flex', gap: 0, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Beginner', time: '2–3 weeks', color: 'var(--green)' },
            { label: 'Intermediate', time: '3–4 weeks', color: 'var(--yellow)' },
            { label: 'Advanced', time: '4–6 weeks', color: 'var(--accent)' },
            { label: 'Mock Interviews', time: '1–2 weeks', color: 'var(--blue)' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, minWidth: 120, padding: '10px 16px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontWeight: 700, color: s.color, fontSize: '0.88rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{s.time}</div>
            </div>
          ))}
        </div>
      </div>

      {stages.map((stage, si) => (
        <div key={stage.level} style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, marginTop: si > 0 ? 28 : 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: stage.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{si + 1}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: stage.color }}>{stage.level}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{stage.desc}</div>
            </div>
          </div>

          <div style={{ paddingLeft: 20, borderLeft: `2px solid ${stage.border}` }}>
            {stage.topics.map((t, ti) => {
              const prog = t.key ? getTopicProgress(t.key) : null
              const done = prog?.completed
              return (
                <div key={t.path} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? stage.color : 'var(--card)', border: `2px solid ${done ? stage.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
                      {done ? '✓' : (ti + 1)}
                    </div>
                    {ti < stage.topics.length - 1 && (
                      <div style={{ position: 'absolute', top: 28, left: 12, width: 2, height: 22, background: 'var(--border)' }} />
                    )}
                  </div>
                  <div style={{ background: stage.bg, border: `1px solid ${stage.border}`, borderRadius: 10, padding: '12px 16px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span>{t.icon}</span>
                      <Link to={t.path} style={{ fontWeight: 700, color: done ? stage.color : 'var(--text)', textDecoration: 'none', fontSize: '0.92rem' }}>
                        {t.label}
                      </Link>
                      {done && <span className="badge badge-easy" style={{ marginLeft: 4 }}>Completed ✅</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{t.why}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 20 }}>
        <h2>💡 Study Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12, marginTop: 12 }}>
          {tips.map(t => (
            <div key={t.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
