import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, CheckCircle, Lock, Unlock, Clock, 
  BookOpen, Target, Zap, RotateCcw, Box, 
  Link2, Layers, ListOrdered, GitBranch, Share2, 
  ArrowDownUp, Cpu, Coins, Mountain, Network, Lightbulb,
  ShieldAlert, ShieldCheck, Shield
} from 'lucide-react'

const STAGES = [
  {
    level: 'Beginner',
    time: '2–3 weeks',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    icon: Shield,
    desc: 'Master the fundamentals before moving on',
    topics: [
      { path: '/arrays', icon: Box, label: 'Arrays & Strings', key: 'arrays', why: 'Foundation for all DSA. Master index access, two pointers, sliding window.' },
      { path: '/stacks', icon: Layers, label: 'Stacks', key: 'stacks', why: 'Understand LIFO, call stack, balanced brackets, undo operations.' },
      { path: '/queues', icon: ListOrdered, label: 'Queues', key: 'queues', why: 'Master FIFO for BFS, task scheduling, level-order processing.' },
      { path: '/linked-list', icon: Link2, label: 'Linked Lists', key: 'linked-list', why: "Pointers, traversal, reversal, cycle detection with Floyd's algorithm." },
      { path: '/big-o', icon: Zap, label: 'Big-O Notation', key: null, why: 'Understand time & space complexity — essential for every interview.' },
    ]
  },
  {
    level: 'Intermediate',
    time: '3–4 weeks',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
    icon: ShieldCheck,
    desc: 'Build problem-solving patterns and deeper structures',
    topics: [
      { path: '/sorting', icon: ArrowDownUp, label: 'Sorting & Searching', key: 'sorting', why: 'Merge/Quick sort, binary search — used everywhere in interviews.' },
      { path: '/trees', icon: GitBranch, label: 'Trees & BST', key: 'trees', why: 'Recursion practice, DFS/BFS on trees, BST operations, LCA.' },
      { path: '/heaps', icon: Mountain, label: 'Heaps', key: 'heaps', why: 'Priority queues for Top-K, scheduling, and greedy algorithms.' },
      { path: '/greedy', icon: Coins, label: 'Greedy Algorithms', key: 'greedy', why: 'Recognize problems where local optimal leads to global optimal.' },
      { path: '/tries', icon: Network, label: 'Tries', key: 'tries', why: 'Prefix trees for string problems, autocomplete, word search.' },
    ]
  },
  {
    level: 'Advanced',
    time: '4–6 weeks',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.15)]',
    icon: ShieldAlert,
    desc: 'Crack FAANG and hard interview problems',
    topics: [
      { path: '/graphs', icon: Share2, label: 'Graphs', key: 'graphs', why: 'BFS/DFS, Dijkstra, cycle detection, topological sort — huge interview topic.' },
      { path: '/dp', icon: Cpu, label: 'Dynamic Programming', key: 'dp', why: 'The hardest and most important topic. Memoization, knapsack, sequences.' },
      { path: '/backtracking', icon: RotateCcw, label: 'Backtracking', key: 'backtracking', why: 'Subsets, permutations, N-Queens — combinatorial problem solving.' },
      { path: '/interview', icon: Target, label: 'Interview Questions', key: null, why: 'Company-specific prep. Practice under mock conditions.' },
    ]
  },
]

const TIPS = [
  { icon: Clock, title: 'Daily Practice', desc: 'Even 30 min/day is better than 5 hours on weekends. Consistency beats intensity.' },
  { icon: RotateCcw, title: 'Revisit Weak Areas', desc: 'Track what you got wrong. Redo those problems a week later.' },
  { icon: Target, title: 'Time Yourself', desc: 'Use the Mock Interview timer. Real interviews are 45-60 minutes.' },
  { icon: Lightbulb, title: 'Explain Out Loud', desc: 'Practice talking through your approach as you solve. Interviewers want to hear your thinking.' },
]

export default function Roadmap() {
  const { getTopicProgress } = useApp()
  const [activeStage, setActiveStage] = useState(0)

  // Calculate if a stage is unlocked (previous stage is fully completed)
  const isStageUnlocked = (stageIndex) => {
    if (stageIndex === 0) return true
    const prevStage = STAGES[stageIndex - 1]
    return prevStage.topics.every(t => !t.key || getTopicProgress(t.key)?.completed)
  }

  return (
    <div className="content">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Map size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white brand-font">Study Roadmap</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">A structured path from beginner to cracking FAANG interviews. Follow in order.</p>
      </div>

      {/* Timeline Overview */}
      <div className="card !mb-10 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 border-indigo-500/20">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={16} className="text-indigo-400" />
          <h2 className="text-white font-bold text-lg">Suggested Timeline</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {STAGES.map((s, i) => (
            <div key={i} className={`flex-1 p-4 rounded-xl border bg-black/20 ${s.border} ${s.glow}`}>
              <div className={`flex items-center gap-2 font-bold mb-1 ${s.color}`}>
                <s.icon size={16} /> {s.level}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">{s.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Path */}
      <div className="relative pl-4 md:pl-8 border-l-2 border-[var(--border-subtle)] space-y-12">
        
        {STAGES.map((stage, si) => {
          const unlocked = isStageUnlocked(si)
          const StageIcon = stage.icon
          
          return (
            <motion.div 
              key={stage.level} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative transition-all duration-500 ${!unlocked ? 'opacity-50 grayscale' : ''}`}
            >
              {/* Stage Marker */}
              <div className={`absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 rounded-full border-4 border-[#06080F] flex items-center justify-center z-10 transition-colors duration-500 ${unlocked ? stage.bg + ' ' + stage.color + ' ' + stage.border : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'}`}>
                {unlocked ? <StageIcon size={20} /> : <Lock size={18} />}
              </div>

              {/* Stage Header */}
              <div 
                className="flex items-center gap-4 cursor-pointer mb-6"
                onClick={() => setActiveStage(activeStage === si ? -1 : si)}
              >
                <div>
                  <h3 className={`text-xl font-bold ${unlocked ? stage.color : 'text-[var(--text-muted)]'}`}>
                    Stage {si + 1}: {stage.level}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{stage.desc}</p>
                </div>
                {!unlocked && (
                  <div className="ml-auto px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-muted)] flex items-center gap-2">
                    <Lock size={12} /> Locked
                  </div>
                )}
              </div>

              {/* Topics List */}
              <AnimatePresence>
                {(activeStage === si || unlocked) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {stage.topics.map((t, ti) => {
                        const prog = t.key ? getTopicProgress(t.key) : null
                        const done = prog?.completed
                        const Icon = t.icon
                        
                        return (
                          <div key={t.path} className={`relative flex p-4 rounded-xl border transition-all duration-300 ${done ? 'bg-emerald-500/5 border-emerald-500/30' : unlocked ? 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-indigo-500/40 hover:bg-white/5' : 'bg-transparent border-transparent'}`}>
                            
                            {/* Topic Status Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-colors ${done ? 'bg-emerald-500/20 text-emerald-400' : unlocked ? stage.bg + ' ' + stage.color : 'bg-white/5 text-[var(--text-muted)]'}`}>
                              {done ? <CheckCircle size={20} /> : <Icon size={20} />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                {unlocked ? (
                                  <Link to={t.path} className="text-[15px] font-bold text-white hover:text-indigo-400 transition-colors truncate">
                                    {t.label}
                                  </Link>
                                ) : (
                                  <span className="text-[15px] font-bold text-white/50 truncate">{t.label}</span>
                                )}
                                {done && <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Done</span>}
                              </div>
                              <p className={`text-xs leading-relaxed ${unlocked ? 'text-[var(--text-muted)]' : 'text-white/30'}`}>
                                {t.why}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="card !mb-0 mt-16 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border-indigo-500/20">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb size={18} className="text-amber-400" />
          <h2 className="text-white font-bold text-lg">Study Tips</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIPS.map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/20 border border-[var(--border-subtle)] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <t.icon size={16} />
              </div>
              <div>
                <div className="font-bold text-sm text-white mb-1">{t.title}</div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
