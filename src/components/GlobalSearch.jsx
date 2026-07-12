import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchData } from '../data/searchData'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Command, ArrowRight, Clock, BookOpen, Lightbulb, Target } from 'lucide-react'

const typeIcon = { topic: BookOpen, concept: Lightbulb, problem: Target }
const typeLabel = { topic: 'Topic', concept: 'Concept', problem: 'Problem' }

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dsa_recent_searches')) || [] } catch { return [] }
  })
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { 
      setQuery(''); 
      setSelected(0); 
      setTimeout(() => inputRef.current?.focus(), 50) 
    }
  }, [open])

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('dsa_recent_searches', JSON.stringify(recent))
  }, [recent])

  const results = query.trim().length < 1 ? [] : searchData.filter(item => {
    const q = query.toLowerCase()
    return item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q))
  }).slice(0, 8)

  function go(path, title) {
    if (title) {
      setRecent(prev => {
        const next = prev.filter(p => p.path !== path)
        return [{ path, title }, ...next].slice(0, 4)
      })
    }
    navigate(path)
    onClose()
  }

  function onKey(e) {
    const maxIdx = query.length > 0 ? results.length - 1 : recent.length - 1
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, Math.max(0, maxIdx))) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter') {
      if (query.length > 0 && results[selected]) go(results[selected].path, results[selected].title)
      else if (query.length === 0 && recent[selected]) go(recent[selected].path)
    }
    if (e.key === 'Escape') onClose()
  }

  // Helper to highlight matching text
  const HighlightMatch = ({ text, q }) => {
    if (!q) return text
    const parts = text.split(new RegExp(\`(\${q})\`, 'gi'))
    return (
      <span>
        {parts.map((p, i) => 
          p.toLowerCase() === q.toLowerCase() 
            ? <span key={i} className="text-[var(--accent-primary)] font-bold">{p}</span> 
            : p
        )}
      </span>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="modal-box search-box" 
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="search-header">
              <Search className="search-icon" size={22} />
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search topics, problems, concepts..."
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0) }}
                onKeyDown={onKey}
                spellCheck="false"
              />
              <button onClick={onClose} className="search-esc">ESC</button>
            </div>

            {/* Results Area */}
            <div className="search-results no-scrollbar">
              {query.trim().length > 0 ? (
                results.length > 0 ? (
                  <div style={{ padding: '0 8px' }}>
                    {results.map((r, i) => {
                      const Icon = typeIcon[r.type] || BookOpen
                      return (
                        <div key={i} 
                          className={\`search-item \${i === selected ? 'selected' : ''}\`}
                          onClick={() => go(r.path, r.title)} 
                          onMouseEnter={() => setSelected(i)}
                        >
                          <div className="search-item-icon">
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="search-item-title truncate">
                              <HighlightMatch text={r.title} q={query.trim()} />
                            </div>
                            <div className="search-item-type">
                              {typeLabel[r.type]}
                            </div>
                          </div>
                          <div className="search-item-path">
                            {r.path}
                          </div>
                          {i === selected && <ArrowRight size={16} style={{ color: 'var(--accent-primary)', marginLeft: 8 }} />}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Search size={24} style={{ opacity: 0.5 }} />
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 500, marginBottom: 4 }}>No results found</p>
                    <p style={{ fontSize: '0.9rem' }}>We couldn't find anything matching "<span style={{ color: 'white' }}>{query}</span>"</p>
                  </div>
                )
              ) : (
                <div style={{ padding: '8px 16px' }}>
                  {recent.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={12} /> Recent Searches
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {recent.map((r, idx) => (
                          <div key={idx} 
                            onClick={() => go(r.path)}
                            onMouseEnter={() => setSelected(idx)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                              borderRadius: 8, cursor: 'pointer', border: '1px solid',
                              backgroundColor: idx === selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                              borderColor: idx === selected ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                          >
                            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Target size={12} /> Quick Jump
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 8px' }}>
                      {['/arrays','/dp','/trees','/graphs','/sorting','/playground'].map(p => {
                        const item = searchData.find(s => s.path === p)
                        return item ? (
                          <button key={p} 
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => go(p)}
                          >
                            {item.title}
                          </button>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="search-footer">
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><kbd className="search-esc">↑</kbd> <kbd className="search-esc">↓</kbd> to navigate</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><kbd className="search-esc">↵</kbd> to select</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Command size={12} /> K
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
