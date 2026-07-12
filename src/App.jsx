import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home as HomeIcon, BarChart2, Map, Box, Link2, Layers, ListOrdered, GitBranch,
  Share2, ArrowDownUp, Cpu, Coins, RotateCcw, Network, Mountain, Target, Zap, Code2,
  Search, Menu, X, Command
} from 'lucide-react'
import { AppProvider } from './context/AppContext'
import GlobalSearch from './components/GlobalSearch'
import Home from './pages/Home'
import Arrays from './pages/Arrays'
import LinkedList from './pages/LinkedList'
import Stacks from './pages/Stacks'
import Queues from './pages/Queues'
import Trees from './pages/Trees'
import Graphs from './pages/Graphs'
import Sorting from './pages/Sorting'
import DynamicProgramming from './pages/DynamicProgramming'
import Greedy from './pages/Greedy'
import Backtracking from './pages/Backtracking'
import Tries from './pages/Tries'
import Heaps from './pages/Heaps'
import Interview from './pages/Interview'
import BigO from './pages/BigO'
import Roadmap from './pages/Roadmap'
import Playground from './pages/Playground'
import Progress from './pages/Progress'
import './index.css'

const navItems = [
  { path: '/', label: 'Overview', icon: HomeIcon },
  { path: '/progress', label: 'My Progress', icon: BarChart2 },
  { path: '/roadmap', label: 'Study Roadmap', icon: Map },
]
const dsaItems = [
  { path: '/arrays', label: 'Arrays & Strings', icon: Box },
  { path: '/linked-list', label: 'Linked Lists', icon: Link2 },
  { path: '/stacks', label: 'Stacks', icon: Layers },
  { path: '/queues', label: 'Queues', icon: ListOrdered },
  { path: '/trees', label: 'Trees', icon: GitBranch },
  { path: '/graphs', label: 'Graphs', icon: Share2 },
  { path: '/sorting', label: 'Sorting & Searching', icon: ArrowDownUp },
  { path: '/dp', label: 'Dynamic Programming', icon: Cpu },
  { path: '/greedy', label: 'Greedy Algorithms', icon: Coins },
  { path: '/backtracking', label: 'Backtracking', icon: RotateCcw },
  { path: '/tries', label: 'Tries', icon: Network },
  { path: '/heaps', label: 'Heaps', icon: Mountain },
]
const extraItems = [
  { path: '/interview', label: 'Interview Prep', icon: Target },
  { path: '/big-o', label: 'Big-O Cheatsheet', icon: Zap },
  { path: '/playground', label: 'Code Playground', icon: Code2 },
]

const allItems = [...navItems, ...dsaItems, ...extraItems]

function Sidebar({ open, onClose, onSearch }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`sidebar ${open ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <div>
            <h1 className="sidebar-brand">
              <Code2 size={28} />
              DSA Master Pro
            </h1>
            <p className="sidebar-subtitle">PREMIUM LEARNING</p>
          </div>
          <button className="menu-btn" onClick={onClose} style={{ display: open ? 'block' : 'none' }}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-search">
          <button className="sidebar-search-btn" onClick={() => { onSearch(); onClose(); }}>
            <Search size={18} />
            <span>Quick search...</span>
            <kbd><Command size={12} /> K</kbd>
          </button>
        </div>

        <div className="sidebar-nav no-scrollbar">
          <div className="nav-section">
            <div className="nav-title">Overview</div>
            {navItems.map(i => (
              <NavLink key={i.path} to={i.path} end onClick={onClose}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                {({isActive}) => <><i.icon size={18} /> {i.label}</>}
              </NavLink>
            ))}
          </div>
          
          <div className="nav-section">
            <div className="nav-title">Data Structures & Algorithms</div>
            {dsaItems.map(i => (
              <NavLink key={i.path} to={i.path} onClick={onClose}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                {({isActive}) => <><i.icon size={18} /> {i.label}</>}
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-title">Resources</div>
            {extraItems.map(i => (
              <NavLink key={i.path} to={i.path} onClick={onClose}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                {({isActive}) => <><i.icon size={18} /> {i.label}</>}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

function TopBar({ onMenu, onSearch }) {
  const loc = useLocation()
  const current = allItems.find(i => i.path === loc.pathname) || navItems[0]
  const Icon = current.icon

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenu}>
          <Menu size={24} />
        </button>
        <div className="topbar-title-wrap">
          <div className="topbar-icon">
            <Icon size={20} />
          </div>
          <h2 className="topbar-title">{current.label}</h2>
        </div>
      </div>
      
      <button onClick={onSearch} className="topbar-search">
        <Search size={16} />
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    </header>
  )
}

function AppInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSearch={() => setSearchOpen(true)} />
      <main className="main">
        <TopBar onMenu={() => setSidebarOpen(true)} onSearch={() => setSearchOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/arrays" element={<Arrays />} />
              <Route path="/linked-list" element={<LinkedList />} />
              <Route path="/stacks" element={<Stacks />} />
              <Route path="/queues" element={<Queues />} />
              <Route path="/trees" element={<Trees />} />
              <Route path="/graphs" element={<Graphs />} />
              <Route path="/sorting" element={<Sorting />} />
              <Route path="/dp" element={<DynamicProgramming />} />
              <Route path="/greedy" element={<Greedy />} />
              <Route path="/backtracking" element={<Backtracking />} />
              <Route path="/tries" element={<Tries />} />
              <Route path="/heaps" element={<Heaps />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/big-o" element={<BigO />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  )
}
