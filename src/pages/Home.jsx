import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Box, Link2, Layers, ListOrdered, GitBranch, Share2, ArrowDownUp, Zap, Sparkles, Code2, BookOpen } from 'lucide-react'

const topics = [
  { path: '/arrays', icon: Box, title: 'Arrays & Strings', desc: 'Index-based access, two pointers, sliding window', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { path: '/linked-list', icon: Link2, title: 'Linked Lists', desc: 'Nodes & pointers, traversal, reversal', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { path: '/stacks', icon: Layers, title: 'Stacks', desc: 'LIFO structure, undo/redo, balanced brackets', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { path: '/queues', icon: ListOrdered, title: 'Queues', desc: 'FIFO structure, BFS, task scheduling', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { path: '/trees', icon: GitBranch, title: 'Trees', desc: 'BST, traversals, height, lowest common ancestor', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { path: '/graphs', icon: Share2, title: 'Graphs', desc: 'BFS, DFS, shortest path, cycles', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { path: '/sorting', icon: ArrowDownUp, title: 'Sorting & Searching', desc: 'Bubble, merge, quick sort, binary search', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  { path: '/interview', icon: Target, title: 'Interview Questions', desc: 'Top questions asked in FAANG & product companies', color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { path: '/big-o', icon: Zap, title: 'Big-O Cheatsheet', desc: 'Time & space complexity for every DS & algorithm', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
]

const stats = [
  { label: 'Topics', value: '12+', icon: BookOpen },
  { label: 'Problems', value: '100+', icon: Target },
  { label: 'Languages', value: '3', icon: Code2 },
  { label: 'Visualizations', value: '15+', icon: Sparkles },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function Home() {
  return (
    <div className="content">
      <div className="home-hero flex flex-col items-center justify-center min-h-[45vh] text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6">
            <Sparkles size={16} /> Welcome to the new DSA Master Pro
          </div>
          <h1>Master Data Structures<br/>& Algorithms</h1>
          <p>
            Learn through interactive visualizations, multi-language code examples, 
            and curated interview questions. Designed for developers who want to 
            crack technical rounds with confidence.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
            <Link to="/arrays" className="btn btn-primary px-8 py-3 rounded-xl text-lg group">
              Start Learning 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/interview" className="btn btn-secondary px-8 py-3 rounded-xl text-lg group">
              Interview Prep
              <Target size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl w-full"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center group hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-1 brand-font">{s.value}</div>
                <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
              </div>
            )
          })}
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen size={18} />
          </div>
          <h2 className="text-xl font-semibold text-white">Choose a topic to get started</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {topics.map(t => {
            const Icon = t.icon
            return (
              <motion.div key={t.path} variants={itemVariants}>
                <Link to={t.path} className={`block card !mb-0 h-full !p-5 hover:border-indigo-500/30 group`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.bg} ${t.color} border ${t.border} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t.desc}</p>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-8 md:p-10"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/30">
              <Zap size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">How to use this platform</h2>
              <ul className="space-y-3">
                {[
                  'Pick a topic from the sidebar or cards above',
                  'Read the concept explanation, then watch the interactive animation',
                  'Study the code implementations in Python, JavaScript, or C++',
                  'Try the practice problems — use hints if you get stuck',
                  'Check the Big-O cheatsheet to compare complexities',
                  'Tackle Interview Questions to prepare for your next job'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-muted)]">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
