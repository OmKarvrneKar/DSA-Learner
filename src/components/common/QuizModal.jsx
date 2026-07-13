import { useState } from 'react'
import { quizData } from '../../data/quizData'
import { useApp } from '../../context/AppContext'

export default function QuizModal({ topic, onClose }) {
  const { setQuizScore } = useApp()
  const questions = quizData[topic] || []
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (!questions.length) return null

  const q = questions[current]

  function pick(i) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === q.answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) {
      const finalScore = score + (selected === q.answer ? 1 : 0)
      setQuizScore(topic, finalScore, questions.length)
      setDone(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const finalScore = done ? score : score

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box quiz-box" onClick={e => e.stopPropagation()}>
        <div className="quiz-header">
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>🧠 Quiz</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
              {done ? 'Complete!' : `Question ${current + 1} of ${questions.length}`}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        {!done ? (
          <>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
            </div>

            <div className="quiz-question">{q.q}</div>

            <div className="quiz-options">
              {q.options.map((opt, i) => {
                let cls = 'quiz-option'
                if (answered) {
                  if (i === q.answer) cls += ' correct'
                  else if (i === selected) cls += ' wrong'
                }
                return (
                  <button key={i} className={cls} onClick={() => pick(i)}>
                    <span className="quiz-opt-letter">{['A','B','C','D'][i]}</span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {answered && (
              <div className="quiz-explanation">
                <span>{selected === q.answer ? '✅' : '❌'}</span>
                <span>{q.explanation}</span>
              </div>
            )}

            {answered && (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={next}>
                {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
              </button>
            )}
          </>
        ) : (
          <div className="quiz-result">
            <div className="quiz-score-circle">
              <svg viewBox="0 0 80 80" width={120} height={120}>
                <circle cx={40} cy={40} r={34} fill="none" stroke="var(--border)" strokeWidth={8} />
                <circle cx={40} cy={40} r={34} fill="none"
                  stroke={finalScore >= 4 ? 'var(--green)' : finalScore >= 2 ? 'var(--yellow)' : 'var(--accent)'}
                  strokeWidth={8}
                  strokeDasharray={`${(finalScore / questions.length) * 213.6} 213.6`}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x={40} y={44} textAnchor="middle" fill="var(--text)" fontSize={18} fontWeight={700}>
                  {finalScore}/{questions.length}
                </text>
              </svg>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
              {finalScore === questions.length ? '🎉 Perfect!' : finalScore >= 4 ? '🌟 Great job!' : finalScore >= 2 ? '👍 Good effort!' : '📖 Keep studying!'}
            </div>
            <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: 20 }}>
              You scored <strong style={{ color: 'var(--green)' }}>{finalScore} out of {questions.length}</strong> on this quiz.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false) }}>
                Retry Quiz
              </button>
              <button className="btn btn-primary" onClick={onClose}>Done ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
