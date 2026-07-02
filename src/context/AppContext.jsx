import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const TOPICS = ['arrays','linked-list','stacks','queues','trees','graphs','sorting','dp','greedy','backtracking','tries','heaps']

const defaultState = {
  progress: Object.fromEntries(TOPICS.map(t => [t, { completed: false, problemsDone: [] }])),
  notes: {},
  quizScores: {},
}

function load() {
  try {
    const saved = localStorage.getItem('dsa-master-state')
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
  } catch { return defaultState }
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TOPIC': {
      const t = action.topic
      return { ...state, progress: { ...state.progress, [t]: { ...state.progress[t], completed: !state.progress[t]?.completed } } }
    }
    case 'TOGGLE_PROBLEM': {
      const { topic, idx } = action
      const done = state.progress[topic]?.problemsDone || []
      const newDone = done.includes(idx) ? done.filter(i => i !== idx) : [...done, idx]
      return { ...state, progress: { ...state.progress, [topic]: { ...state.progress[topic], problemsDone: newDone } } }
    }
    case 'SET_NOTE': {
      return { ...state, notes: { ...state.notes, [action.key]: action.text } }
    }
    case 'SET_QUIZ_SCORE': {
      return { ...state, quizScores: { ...state.quizScores, [action.topic]: { score: action.score, total: action.total } } }
    }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try { localStorage.setItem('dsa-master-state', JSON.stringify(state)) } catch {}
  }, [state])

  const toggleTopic = topic => dispatch({ type: 'TOGGLE_TOPIC', topic })
  const toggleProblem = (topic, idx) => dispatch({ type: 'TOGGLE_PROBLEM', topic, idx })
  const setNote = (key, text) => dispatch({ type: 'SET_NOTE', key, text })
  const setQuizScore = (topic, score, total) => dispatch({ type: 'SET_QUIZ_SCORE', topic, score, total })

  const getTopicProgress = topic => state.progress[topic] || { completed: false, problemsDone: [] }
  const totalCompleted = Object.values(state.progress).filter(p => p.completed).length
  const totalTopics = TOPICS.length

  return (
    <AppContext.Provider value={{ state, toggleTopic, toggleProblem, setNote, setQuizScore, getTopicProgress, totalCompleted, totalTopics, TOPICS }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
