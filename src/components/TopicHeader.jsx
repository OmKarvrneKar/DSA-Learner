import { useState } from 'react'
import { useApp } from '../context/AppContext'
import QuizModal from './QuizModal'

export default function TopicHeader({ topic, title, subtitle, hasQuiz = true }) {
  const { getTopicProgress, toggleTopic } = useApp()
  const { completed } = getTopicProgress(topic)
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
        <div>
          <div className="section-title">{title}</div>
          <div className="section-subtitle">{subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {hasQuiz && (
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => setQuizOpen(true)}>
              🧠 Take Quiz
            </button>
          )}
          <button
            className={`btn ${completed ? 'btn-green' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem' }}
            onClick={() => toggleTopic(topic)}
          >
            {completed ? '✅ Completed' : '☐ Mark Complete'}
          </button>
        </div>
      </div>
      {quizOpen && <QuizModal topic={topic} onClose={() => setQuizOpen(false)} />}
    </>
  )
}
