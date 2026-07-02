import { Link } from 'react-router-dom'

const topics = [
  { path: '/arrays', icon: '📦', title: 'Arrays & Strings', desc: 'Index-based access, two pointers, sliding window', color: '#4da6ff' },
  { path: '/linked-list', icon: '🔗', title: 'Linked Lists', desc: 'Nodes & pointers, traversal, reversal', color: '#00d4aa' },
  { path: '/stacks', icon: '📚', title: 'Stacks', desc: 'LIFO structure, undo/redo, balanced brackets', color: '#ffd700' },
  { path: '/queues', icon: '🚶', title: 'Queues', desc: 'FIFO structure, BFS, task scheduling', color: '#ff9966' },
  { path: '/trees', icon: '🌳', title: 'Trees', desc: 'BST, traversals, height, lowest common ancestor', color: '#00d4aa' },
  { path: '/graphs', icon: '🕸️', title: 'Graphs', desc: 'BFS, DFS, shortest path, cycles', color: '#d2a8ff' },
  { path: '/sorting', icon: '🔢', title: 'Sorting & Searching', desc: 'Bubble, merge, quick sort, binary search', color: '#ff7b72' },
  { path: '/interview', icon: '🎯', title: 'Interview Questions', desc: 'Top questions asked in FAANG & product companies', color: '#e94560' },
  { path: '/big-o', icon: '⚡', title: 'Big-O Cheatsheet', desc: 'Time & space complexity for every DS & algorithm', color: '#ffd700' },
]

const stats = [
  { label: 'Topics', value: '7' },
  { label: 'Problems', value: '70+' },
  { label: 'Code Examples', value: '3 langs' },
  { label: 'Animations', value: '7+' },
]

export default function Home() {
  return (
    <div>
      <div className="home-hero">
        <h1>Master DSA — Step by Step</h1>
        <p>
          Learn Data Structures & Algorithms with interactive visualizations,
          multi-language code examples, hints, and the top interview questions
          to crack any technical round.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/arrays" className="btn btn-primary">Start Learning →</Link>
          <Link to="/interview" className="btn btn-secondary">Interview Prep 🎯</Link>
        </div>

        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 32px 16px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--text2)', fontWeight: 400 }}>
          📚 Choose a topic to get started
        </h2>
      </div>
      <div className="topics-grid">
        {topics.map(t => (
          <Link key={t.path} to={t.path} className="topic-card">
            <div className="t-icon">{t.icon}</div>
            <h3 style={{ color: t.color }}>{t.title}</h3>
            <p>{t.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ padding: '0 32px 40px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(233,69,96,0.1), rgba(83,52,131,0.1))', borderColor: 'var(--accent2)' }}>
          <h2 style={{ color: 'var(--accent)' }}>🚀 How to use this platform</h2>
          <ul style={{ color: 'var(--text2)', lineHeight: 2.2, paddingLeft: 20, fontSize: '0.9rem' }}>
            <li>Pick a topic from the sidebar or cards above</li>
            <li>Read the concept explanation, then watch the animation</li>
            <li>Study the code in Python, JavaScript, or C++</li>
            <li>Try the practice problems — use hints if you're stuck</li>
            <li>Check the Big-O cheatsheet to compare complexities</li>
            <li>Tackle Interview Questions to prepare for your next job</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
