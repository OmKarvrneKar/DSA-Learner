import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchData } from '../data/searchData'

const typeIcon = { topic: '📚', concept: '💡', problem: '🏋️' }
const typeLabel = { topic: 'Topic', concept: 'Concept', problem: 'Problem' }

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const results = query.trim().length < 1 ? [] : searchData.filter(item => {
    const q = query.toLowerCase()
    return item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q))
  }).slice(0, 10)

  function go(path) { navigate(path); onClose() }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) go(results[selected].path)
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box search-box" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search topics, problems, concepts..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={onKey}
          />
          <kbd className="search-esc" onClick={onClose}>ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="search-results">
            {results.map((r, i) => (
              <div key={i} className={`search-item${i === selected ? ' selected' : ''}`}
                onClick={() => go(r.path)} onMouseEnter={() => setSelected(i)}>
                <span className="search-item-icon">{typeIcon[r.type]}</span>
                <div>
                  <div className="search-item-title">{r.title}</div>
                  <div className="search-item-type">{typeLabel[r.type]}</div>
                </div>
                <span className="search-item-path">{r.path}</span>
              </div>
            ))}
          </div>
        )}
        {query.trim().length > 0 && results.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', fontSize: '0.85rem' }}>
            No results for "<strong>{query}</strong>"
          </div>
        )}
        {query.trim().length === 0 && (
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 10 }}>QUICK JUMP</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['/arrays','/dp','/trees','/graphs','/sorting','/interview','/playground'].map(p => {
                const item = searchData.find(s => s.path === p)
                return item ? (
                  <button key={p} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => go(p)}>
                    {item.title}
                  </button>
                ) : null
              })}
            </div>
          </div>
        )}
        <div className="search-footer">
          <span>↑↓ navigate</span><span>↵ select</span><span>ESC close</span>
        </div>
      </div>
    </div>
  )
}
