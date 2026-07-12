import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import { 
  Trophy, Flame, Star, Target, BookOpen, Brain, 
  Code2, Edit3, Activity, Award, ArrowUpRight, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'

const TOPIC_META = {
  arrays:        { label: 'Arrays & Strings',     icon: BookOpen, path: '/arrays',      problems: 5 },
  'linked-list': { label: 'Linked Lists',          icon: BookOpen, path: '/linked-list', problems: 5 },
  stacks:        { label: 'Stacks',                icon: BookOpen, path: '/stacks',      problems: 4 },
  queues:        { label: 'Queues',                icon: BookOpen, path: '/queues',      problems: 4 },
  trees:         { label: 'Trees',                 icon: BookOpen, path: '/trees',       problems: 5 },
  graphs:        { label: 'Graphs',                icon: BookOpen, path: '/graphs',      problems: 4 },
  sorting:       { label: 'Sorting & Searching',   icon: BookOpen, path: '/sorting',     problems: 4 },
  dp:            { label: 'Dynamic Programming',   icon: BookOpen, path: '/dp',          problems: 5 },
  greedy:        { label: 'Greedy Algorithms',     icon: BookOpen, path: '/greedy',      problems: 5 },
  backtracking:  { label: 'Backtracking',          icon: BookOpen, path: '/backtracking',problems: 5 },
  tries:         { label: 'Tries',                 icon: BookOpen, path: '/tries',       problems: 5 },
  heaps:         { label: 'Heaps & Priority Q',    icon: BookOpen, path: '/heaps',       problems: 5 },
}

function Ring({ pct, size = 80, color = '#10B981', label, sub }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
            strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold" style={{ fontSize: size * 0.22 }}>{Math.round(pct)}%</span>
        </div>
      </div>
      {label && <div className="text-xs font-semibold text-white mt-3">{label}</div>}
      {sub && <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{sub}</div>}
    </div>
  )
}

function Heatmap() {
  const days = Array.from({ length: 7 * 12 }, (_, i) => Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0)
  const colors = ['bg-white/5', 'bg-indigo-500/40', 'bg-indigo-500/60', 'bg-indigo-500', 'bg-indigo-400']
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {days.map((val, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${colors[val]} transition-colors hover:ring-2 hover:ring-indigo-400`} title={`${val} activities`} />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-[var(--text-muted)]">
        <span>Less</span>
        <div className="flex gap-1">
          {colors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
        </div>
        <span>More</span>
      </div>
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
  const overallPct = Math.round(((topicsCompleted / TOPICS.length) * 0.5 + (problemsDone / totalProblems) * 0.5) * 100) || 0

  // Simulated XP and Streak
  const currentXP = (topicsCompleted * 500) + (problemsDone * 100) + (quizCount * 50) + (noteCount * 10)
  const currentStreak = Math.max(1, Math.floor(problemsDone / 3))

  const badges = [
    { id: 'first-blood', icon: Target, title: 'First Blood', desc: 'Solved your first problem', earned: problemsDone >= 1, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'topic-master', icon: Brain, title: 'Topic Master', desc: 'Completed a full topic', earned: topicsCompleted >= 1, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 'streak-week', icon: Flame, title: '7-Day Streak', desc: 'Learned for 7 days straight', earned: currentStreak >= 7, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'quiz-ace', icon: Award, title: 'Quiz Ace', desc: 'Aced a topic quiz', earned: quizCount >= 1, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <div className="content">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Trophy size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white brand-font">Your Progress</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">Track your learning journey, achievements, and stats.</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        
        {/* Top Level Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Progress Card */}
          <motion.div variants={itemVariants} className="card !mb-0 lg:col-span-2 bg-gradient-to-br from-[var(--bg-elevated)] to-indigo-900/10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Ring pct={overallPct} size={120} color="var(--accent-primary)" label="Overall Mastery" sub={`${topicsCompleted} / ${TOPICS.length} Topics`} />
              
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Star size={18} className="text-amber-400 fill-amber-400" />
                      {currentXP.toLocaleString()} XP
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">Keep learning to level up</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <Flame size={16} className="fill-orange-400" />
                    <span className="font-bold">{currentStreak} Day Streak</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { val: `${topicsCompleted} / ${TOPICS.length}`, label: 'Topics', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { val: `${problemsDone} / ${totalProblems}`, label: 'Problems', icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { val: quizCount, label: 'Quizzes', icon: Brain, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                    { val: noteCount, label: 'Notes', icon: Edit3, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-[var(--border-subtle)] flex flex-col items-center text-center">
                      <s.icon size={16} className={`${s.color} mb-2`} />
                      <div className="font-bold text-white text-lg">{s.val}</div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div variants={itemVariants} className="card !mb-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" /> Activity
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-mono">Last 3 months</span>
              </div>
              <Heatmap />
            </div>
            
            {topicsCompleted === 0 && problemsDone === 0 && (
              <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <p className="text-sm text-indigo-200 mb-3">Ready to start your journey?</p>
                <Link to="/arrays" className="btn btn-primary w-full text-sm py-2">Start First Topic <ArrowUpRight size={14} /></Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div variants={itemVariants} className="card !mb-0">
          <h2 className="text-lg text-white font-semibold flex items-center gap-2 mb-6">
            <Award size={18} className="text-amber-400" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(b => (
              <div key={b.id} className={`relative p-4 rounded-xl border transition-all ${b.earned ? 'bg-[var(--bg-glass)] border-[var(--border-strong)]' : 'bg-black/20 border-[var(--border-subtle)] opacity-60 grayscale'}`}>
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${b.earned ? b.bg : 'bg-white/5'} ${b.earned ? b.color : 'text-[var(--text-muted)]'}`}>
                  <b.icon size={24} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{b.title}</div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed">{b.desc}</div>
                {!b.earned && (
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Topic Breakdown */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Brain size={18} className="text-indigo-400" />
            <h2 className="text-lg text-white font-semibold">Topic Breakdown</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOPICS.map(t => {
              const meta = TOPIC_META[t]
              if (!meta) return null
              const prog = state.progress[t] || {}
              const problemsDoneHere = (prog.problemsDone || []).length
              const probPct = meta.problems > 0 ? (problemsDoneHere / meta.problems) * 100 : 0
              const quiz = state.quizScores[t]
              
              const isCompleted = prog.completed || probPct === 100

              return (
                <Link key={t} to={meta.path} className={`block p-4 rounded-xl border transition-all hover:-translate-y-1 ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]' : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-indigo-500/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)]'}`}>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <meta.icon size={20} />
                    </div>
                    {isCompleted && (
                      <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                        Mastered
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-[15px] font-bold text-white mb-3 truncate">{meta.label}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1.5 font-medium uppercase tracking-wider">
                        <span>Problems</span>
                        <span>{problemsDoneHere} / {meta.problems}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/40 overflow-hidden border border-[var(--border-subtle)]">
                        <div className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-400' : 'bg-indigo-400'}`} style={{ width: `${probPct}%` }} />
                      </div>
                    </div>

                    {quiz && (
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-[var(--border-subtle)]">
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">Quiz Score</span>
                        <span className={`text-xs font-bold ${quiz.score / quiz.total >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {Math.round((quiz.score / quiz.total) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Notes Preview */}
        {noteCount > 0 && (
          <motion.div variants={itemVariants} className="card !mb-0">
            <h2 className="text-lg text-white font-semibold flex items-center gap-2 mb-4">
              <Edit3 size={18} className="text-indigo-400" /> Recent Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(state.notes).filter(([, v]) => v && v.trim()).map(([key, text]) => (
                <div key={key} className="p-4 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] flex flex-col">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> {key}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed line-clamp-4 flex-1">
                    {text}
                  </div>
                  <Link to={`/${key}`} className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-1">
                    View full notes <ArrowUpRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
