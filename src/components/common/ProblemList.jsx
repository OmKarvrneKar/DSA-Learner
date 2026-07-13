import { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'

export default function ProblemList({ problems, topic }) {
  const { state, toggleProblem, setNote } = useApp()
  const [shown, setShown] = useState({})
  const [noteOpen, setNoteOpen] = useState({})

  const toggle = i => setShown(s => ({ ...s, [i]: !s[i] }))
  const toggleNote = i => setNoteOpen(s => ({ ...s, [i]: !s[i] }))

  const handleNote = useCallback((key, text) => {
    setNote(key, text)
  }, [setNote])

  const done = topic ? (state.progress[topic]?.problemsDone || []) : []

  return (
    <div>
      {problems.map((p, i) => {
        const noteKey = topic ? `${topic}-${i}` : `problem-${i}`
        const isDone = done.includes(i)
        const noteText = state.notes[noteKey] || ''
        return (
          <div className="problem-card" key={i} style={{ borderColor: isDone ? 'rgba(0,212,170,0.4)' : undefined }}>
            <div className="problem-header">
              {topic && (
                <input type="checkbox" checked={isDone}
                  onChange={() => toggleProblem(topic, i)}
                  style={{ cursor: 'pointer', width: 16, height: 16, accentColor: 'var(--green)', flexShrink: 0 }}
                  title={isDone ? 'Mark as not done' : 'Mark as done'}
                />
              )}
              <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              <span className="problem-title" style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>{p.title}</span>
              {p.link && <a className="problem-link" href={p.link} target="_blank" rel="noreferrer">↗ Practice</a>}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{p.desc}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => toggle(i)}>
                {shown[i] ? '🙈 Hide Hint' : '💡 Show Hint'}
              </button>
              <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => toggleNote(i)}>
                {noteText ? '📝 Edit Note' : '📝 Add Note'}
              </button>
            </div>
            <div className={`problem-hint${shown[i] ? ' show' : ''}`}>
              💡 <strong>Hint:</strong> {p.hint}
            </div>
            {noteOpen[i] && (
              <div style={{ marginTop: 10 }}>
                <textarea
                  value={noteText}
                  onChange={e => handleNote(noteKey, e.target.value)}
                  placeholder="Write your notes here..."
                  style={{
                    width: '100%', minHeight: 80, background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 6, color: 'var(--text)', fontSize: '0.82rem', padding: '8px 10px',
                    resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
