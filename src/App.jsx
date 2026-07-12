import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
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
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/progress', label: 'My Progress', icon: '📊' },
  { path: '/roadmap', label: 'Study Roadmap', icon: '🗺️' },
]
const dsaItems = [
  { path: '/arrays', label: 'Arrays & Strings', icon: '📦' },
  { path: '/linked-list', label: 'Linked Lists', icon: '🔗' },
  { path: '/stacks', label: 'Stacks', icon: '📚' },
  { path: '/queues', label: 'Queues', icon: '🚶' },
  { path: '/trees', label: 'Trees', icon: '🌳' },
  { path: '/graphs', label: 'Graphs', icon: '🕸️' },
  { path: '/sorting', label: 'Sorting & Searching', icon: '🔢' },
  { path: '/dp', label: 'Dynamic Programming', icon: '🔄' },
  { path: '/greedy', label: 'Greedy Algorithms', icon: '💰' },
  { path: '/backtracking', label: 'Backtracking', icon: '🔙' },
  { path: '/tries', label: 'Tries', icon: '🌲' },
  { path: '/heaps', label: 'Heaps', icon: '⛰️' },
]
const extraItems = [
  { path: '/interview', label: 'Interview Questions', icon: '🎯' },
  { path: '/big-o', label: 'Big-O Cheatsheet', icon: '⚡' },
  { path: '/playground', label: 'Code Playground', icon: '💻' },
]

const allItems = [...navItems, ...dsaItems, ...extraItems]

function Sidebar({ open, onClose, onSearch }) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>🧠 DSA Master Pro</h1>
          <p>Learn Data Structures & Algorithms</p>
        </div>

        <div style={{ padding: '10px 12px 0' }}>
          <button className="search-trigger" onClick={() => { onSearch(); onClose() }}>
            <span>🔍</span><span>Search...</span><kbd>Ctrl K</kbd>
          </button>
        </div>

        <div className="sidebar-section">
          {navItems.map(i => (
            <NavLink key={i.path} to={i.path} end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={onClose}>
              <span className="icon">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Data Structures & Algorithms</div>
          {dsaItems.map(i => (
            <NavLink key={i.path} to={i.path} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={onClose}>
              <span className="icon">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Resources</div>
          {extraItems.map(i => (
            <NavLink key={i.path} to={i.path} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={onClose}>
              <span className="icon">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}

function TopBar({ onMenu, onSearch }) {
  const loc = useLocation()
  const current = allItems.find(i => i.path === loc.pathname) || navItems[0]
  return (
    <div className="topbar">
      <button className="menu-btn" onClick={onMenu}>☰</button>
      <div className="topbar-title">
        {current.icon} <span>{current.label}</span>
      </div>
      <button className="topbar-search" onClick={onSearch}>
        🔍 <span>Search</span> <kbd>Ctrl+K</kbd>
      </button>
    </div>
  )
}

function AppInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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
      <div className="main">
        <TopBar onMenu={() => setSidebarOpen(o => !o)} onSearch={() => setSearchOpen(true)} />
        <Routes>
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
      </div>
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
