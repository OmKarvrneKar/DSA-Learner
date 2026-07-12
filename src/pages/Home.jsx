import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Box, Link2, Layers, ListOrdered, GitBranch, Share2, ArrowDownUp, Zap, Sparkles, Code2, BookOpen } from 'lucide-react'

const topics = [
  { path: '/arrays', icon: Box, title: 'Arrays & Strings', desc: 'Index-based access, two pointers, sliding window' },
  { path: '/linked-list', icon: Link2, title: 'Linked Lists', desc: 'Nodes & pointers, traversal, reversal' },
  { path: '/stacks', icon: Layers, title: 'Stacks', desc: 'LIFO structure, undo/redo, balanced brackets' },
  { path: '/queues', icon: ListOrdered, title: 'Queues', desc: 'FIFO structure, BFS, task scheduling' },
  { path: '/trees', icon: GitBranch, title: 'Trees', desc: 'BST, traversals, height, lowest common ancestor' },
  { path: '/graphs', icon: Share2, title: 'Graphs', desc: 'BFS, DFS, shortest path, cycles' },
  { path: '/sorting', icon: ArrowDownUp, title: 'Sorting & Searching', desc: 'Bubble, merge, quick sort, binary search' },
  { path: '/interview', icon: Target, title: 'Interview Questions', desc: 'Top questions asked in FAANG & product companies' },
  { path: '/big-o', icon: Zap, title: 'Big-O Cheatsheet', desc: 'Time & space complexity for every DS & algorithm' },
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
      <div className="home-hero">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <Sparkles size={16} /> Welcome to the new DSA Master Pro
          </div>
          <h1>Master Data Structures<br/>& Algorithms</h1>
          <p>
            Learn through interactive visualizations, multi-language code examples, 
            and curated interview questions. Designed for developers who want to 
            crack technical rounds with confidence.
          </p>
          <div className="hero-actions">
            <Link to="/arrays" className="btn btn-primary">
              Start Learning 
              <ArrowRight size={18} />
            </Link>
            <Link to="/interview" className="btn btn-secondary">
              Interview Prep
              <Target size={18} />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="stats-grid"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="stat-card">
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
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
        <div className="section-header">
          <div className="section-icon">
            <BookOpen size={18} />
          </div>
          <h2>Choose a topic to get started</h2>
        </div>
        
        <div className="topics-grid">
          {topics.map(t => {
            const Icon = t.icon
            return (
              <motion.div key={t.path} variants={itemVariants}>
                <Link to={t.path} className="topic-card">
                  <div className="topic-icon bg-blue">
                    <Icon size={24} color="var(--accent-primary)" />
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={itemVariants} className="how-to-card">
          <div className="how-to-icon">
            <Zap size={32} />
          </div>
          <div className="how-to-content">
            <h2>How to use this platform</h2>
            <ul className="how-to-list">
              <li>Pick a topic from the sidebar or cards above</li>
              <li>Read the concept explanation, then watch the interactive animation</li>
              <li>Study the code implementations in Python, JavaScript, or C++</li>
              <li>Try the practice problems — use hints if you get stuck</li>
              <li>Check the Big-O cheatsheet to compare complexities</li>
              <li>Tackle Interview Questions to prepare for your next job</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
