import { useState, useEffect, useRef } from 'react'

const questions = [
  { topic: 'Arrays', difficulty: 'Easy', companies: ['Amazon', 'Google', 'Meta'],
    q: 'What is the difference between an Array and a Linked List?',
    a: 'Arrays store elements in contiguous memory — O(1) access by index, but O(n) insert/delete. Linked lists store elements as nodes with pointers — O(n) access, but O(1) insert/delete at head. Use arrays when you need random access; use linked lists when you need frequent insertions/deletions.',
    tags: ['Memory', 'Access Pattern'] },
  { topic: 'Arrays', difficulty: 'Medium', companies: ['Google', 'Microsoft'],
    q: 'Explain the Sliding Window technique. When should you use it?',
    a: 'Sliding window maintains a "window" (subarray/substring) that slides over the data. Use it when: you need to find a subarray/substring satisfying a condition, and the answer shrinks/grows predictably. Two types: fixed-size window (e.g., max sum of k elements) and variable-size window (e.g., longest substring without repeating chars). Time: O(n) instead of O(n²).',
    tags: ['Technique', 'O(n)'] },
  { topic: 'Arrays', difficulty: 'Easy', companies: ['Amazon', 'Apple'],
    q: 'What is a prefix sum and when is it useful?',
    a: 'A prefix sum array where prefix[i] = arr[0] + arr[1] + ... + arr[i]. After O(n) preprocessing, any range sum arr[l..r] = prefix[r] - prefix[l-1] can be answered in O(1). Useful in problems like "find subarray with sum K", range queries, and 2D matrix sum problems.',
    tags: ['Precomputation', 'Range Query'] },
  { topic: 'Linked List', difficulty: 'Easy', companies: ['Meta', 'Amazon', 'Microsoft'],
    q: 'How do you detect a cycle in a linked list?',
    a: "Floyd's Cycle Detection (Tortoise & Hare): Use two pointers — slow moves 1 step, fast moves 2 steps. If there's a cycle, they will meet. If fast reaches null, no cycle. Time: O(n), Space: O(1). To find cycle start: after detection, move one pointer to head, keep the other at meeting point, then move both 1 step at a time — they'll meet at cycle start.",
    tags: ["Floyd's Algorithm", 'Two Pointers'] },
  { topic: 'Linked List', difficulty: 'Medium', companies: ['Google', 'Meta'],
    q: 'How do you reverse a linked list? What are the two approaches?',
    a: 'Iterative (O(1) space): Use three pointers — prev=null, curr=head, next. At each step: save next, rewire curr.next=prev, advance prev=curr, curr=next. Recursive (O(n) stack space): Recurse to the last node, then rewire on the way back. Interview tip: iterative is preferred for large lists due to stack overflow risk.',
    tags: ['Iteration', 'Recursion'] },
  { topic: 'Stacks', difficulty: 'Easy', companies: ['Amazon', 'Google', 'Microsoft'],
    q: 'What is a Monotonic Stack? Give a real interview use case.',
    a: 'A monotonic stack is a stack where elements are always in increasing or decreasing order. When a new element is added, pop all elements that violate the ordering. Use cases: "Next Greater Element" (monotonic decreasing), "Daily Temperatures", "Largest Rectangle in Histogram". Pattern: iterate left to right, use the stack to track useful pending comparisons.',
    tags: ['Monotonic', 'Pattern'] },
  { topic: 'Trees', difficulty: 'Easy', companies: ['Google', 'Meta', 'Apple', 'Microsoft'],
    q: 'What are the four tree traversal methods? When to use each?',
    a: 'Inorder (Left→Root→Right): gives sorted order for BST. Preorder (Root→Left→Right): copying/serializing a tree. Postorder (Left→Right→Root): deleting a tree, expression evaluation. Level Order (BFS): finding shortest path, printing level by level. Interview tip: most tree problems are solved with DFS (inorder/preorder/postorder). Use BFS when level matters.',
    tags: ['DFS', 'BFS', 'Traversal'] },
  { topic: 'Trees', difficulty: 'Medium', companies: ['Amazon', 'Google'],
    q: 'Explain the difference between a Binary Tree and a BST.',
    a: 'A Binary Tree just has at most 2 children per node — no ordering constraint. A Binary Search Tree (BST) has the constraint: left subtree values < node < right subtree values. This makes search/insert/delete O(log n) in balanced BSTs. A balanced BST (AVL, Red-Black) guarantees O(log n). An unbalanced BST degrades to O(n) — like a linked list.',
    tags: ['BST', 'Balance'] },
  { topic: 'Graphs', difficulty: 'Medium', companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
    q: 'When would you use BFS vs DFS on a graph?',
    a: 'BFS: finding shortest path in unweighted graphs (explores all nodes at distance d before d+1), level-order processing, checking bipartiteness. DFS: detecting cycles, topological sorting, finding connected components, maze solving. Rule of thumb: BFS for shortest/nearest; DFS for exhaustive search, backtracking, and topology.',
    tags: ['BFS', 'DFS', 'Strategy'] },
  { topic: 'Graphs', difficulty: 'Hard', companies: ['Google', 'Apple'],
    q: "Explain Dijkstra's algorithm. When does it fail?",
    a: "Dijkstra finds shortest paths from a source in a weighted graph. Uses a min-heap (priority queue). At each step, pick the unvisited node with the smallest tentative distance, relax its neighbors. Time: O((V+E) log V). Fails with negative edge weights — use Bellman-Ford instead. For dense graphs with negative edges, Bellman-Ford O(VE) or Floyd-Warshall O(V³) for all-pairs.",
    tags: ['Shortest Path', 'Heap'] },
  { topic: 'Sorting', difficulty: 'Easy', companies: ['Amazon', 'Microsoft', 'Meta'],
    q: 'Which sorting algorithm would you use in a production system and why?',
    a: "Most language standard libraries use Timsort (Python, Java) — a hybrid of merge sort and insertion sort — O(n log n) worst case, O(n) best case on already-sorted data, stable. For interviews: Merge Sort is the safe choice (always O(n log n), stable). Quick Sort is fastest in practice but O(n²) worst case (avoided with random pivot). Never use Bubble Sort in production.",
    tags: ['Comparison', 'Production'] },
  { topic: 'Sorting', difficulty: 'Medium', companies: ['Google', 'Amazon'],
    q: 'How does Binary Search work? What are common mistakes?',
    a: 'Binary search halves the search space each iteration. Three key choices: (1) Loop condition: lo <= hi for exact target, lo < hi for boundary. (2) Mid calculation: use lo + (hi - lo) / 2 to avoid integer overflow. (3) Pointer update: lo = mid + 1 and hi = mid - 1 to avoid infinite loops. Common mistakes: off-by-one errors, using < instead of <=, wrong mid update.',
    tags: ['Binary Search', 'Common Mistakes'] },
  { topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
    q: 'What is Dynamic Programming? What are the two main approaches?',
    a: 'DP is an optimization technique that stores results of overlapping subproblems to avoid recomputation. Two approaches: (1) Top-down (Memoization): recursive + cache, natural to write. (2) Bottom-up (Tabulation): iterative, fill table from base cases up, better space optimization. Key: identify state, recurrence relation, and base case. Classic: Fibonacci, Knapsack, LCS, Coin Change.',
    tags: ['Memoization', 'Tabulation'] },
  { topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Amazon', 'Google'],
    q: 'How do you identify if a problem can be solved with DP?',
    a: 'Two properties must hold: (1) Optimal Substructure: optimal solution built from optimal solutions to subproblems. (2) Overlapping Subproblems: same subproblems solved multiple times. Signal words in problem: "maximum/minimum", "count ways", "is it possible". Classic DP patterns: 0/1 Knapsack, Unbounded Knapsack, Subsequence/Substring, Grid/Matrix, Interval DP, State Machine.',
    tags: ['Identification', 'Patterns'] },
  { topic: 'General', difficulty: 'Easy', companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
    q: 'What is Big-O notation? Why does it matter?',
    a: "Big-O describes the worst-case growth rate of an algorithm's time or space as input size n grows. We drop constants and lower-order terms. Common: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n), O(n²) quadratic, O(2ⁿ) exponential. Matters because an O(n²) algorithm on 10⁶ elements takes 10¹² operations — unusable. An O(n log n) takes ~2×10⁷ — fast.",
    tags: ['Complexity', 'Fundamentals'] },
  { topic: 'General', difficulty: 'Easy', companies: ['Amazon', 'Microsoft'],
    q: 'What is the difference between time complexity and space complexity?',
    a: 'Time complexity measures how runtime grows with input size. Space complexity measures how extra memory usage grows. Trade-offs exist: memoization uses O(n) space to reduce time from O(2ⁿ) to O(n). In interviews, state both. Common space uses: recursion stack O(depth), hash maps O(n), arrays O(n), sorting O(log n) to O(n) depending on algorithm.',
    tags: ['Fundamentals', 'Space-Time Tradeoff'] },
]

const COMPANIES = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple']
const TOPICS = ['All', ...new Set(questions.map(q => q.topic))]
const DIFFS = ['All', 'Easy', 'Medium', 'Hard']
const TOTAL_MOCK_SECS = 30 * 60

function MockInterview({ questions, onClose }) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [secs, setSecs] = useState(TOTAL_MOCK_SECS)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(intervalRef.current); setDone(true); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const pct = (secs / TOTAL_MOCK_SECS) * 100
  const q = questions[idx]

  function next() {
    if (idx + 1 >= questions.length) { setDone(true); clearInterval(intervalRef.current) }
    else { setIdx(i => i + 1); setRevealed(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 620, width: '95vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>⏱ Mock Interview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: secs < 300 ? 'var(--accent)' : 'var(--green)', fontWeight: 700 }}>{mm}:{ss}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
        </div>

        <div className="progress-bar-wrap" style={{ marginBottom: 16 }}>
          <div className="progress-bar" style={{ width: `${pct}%`, background: secs < 300 ? 'var(--accent)' : undefined, transition: 'width 1s linear' }} />
        </div>

        {!done ? (
          <>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 8 }}>
              Question {idx + 1} of {questions.length} &nbsp;·&nbsp;
              <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
              &nbsp;&nbsp;<span style={{ background: 'var(--bg2)', borderRadius: 10, padding: '2px 8px', fontSize: '0.7rem' }}>{q.topic}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.6, marginBottom: 16 }}>{q.q}</div>
            {revealed
              ? <div style={{ background: 'rgba(77,166,255,0.08)', border: '1px solid rgba(77,166,255,0.2)', borderRadius: 8, padding: '14px 16px', fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>{q.a}</div>
              : <button className="btn btn-secondary" style={{ marginBottom: 16, width: '100%' }} onClick={() => setRevealed(true)}>👁 Reveal Answer</button>
            }
            <div style={{ display: 'flex', gap: 8 }}>
              {revealed && <button className="btn btn-primary" style={{ flex: 1 }} onClick={next}>{idx + 1 >= questions.length ? 'Finish' : 'Next →'}</button>}
              <button className="btn btn-secondary" onClick={onClose}>End Session</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{secs === 0 ? '⏰' : '🎉'}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
              {secs === 0 ? "Time's up!" : 'Session Complete!'}
            </div>
            <div style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: 20 }}>
              You answered {idx + 1} of {questions.length} questions
            </div>
            <button className="btn btn-primary" onClick={onClose}>Done ✓</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Interview() {
  const [topicFilter, setTopicFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [openIdx, setOpenIdx] = useState(null)
  const [mockOpen, setMockOpen] = useState(false)

  const filtered = questions.filter(q =>
    (topicFilter === 'All' || q.topic === topicFilter) &&
    (diffFilter === 'All' || q.difficulty === diffFilter) &&
    (companyFilter === 'All' || (q.companies || []).includes(companyFilter))
  )

  const mockQs = filtered.length >= 5
    ? [...filtered].sort(() => Math.random() - 0.5).slice(0, 5)
    : filtered

  return (
    <div className="content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <div>
          <div className="section-title">🎯 Interview Questions</div>
          <div className="section-subtitle">Top Q&As asked in FAANG and product company rounds — with company tags.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setMockOpen(true)}>⏱ Mock Interview</button>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(233,69,96,0.08), rgba(83,52,131,0.08))', borderColor: 'var(--accent2)' }}>
        <h2 style={{ color: 'var(--accent)' }}>💡 Interview Tips</h2>
        <ul>
          <li>Always <strong style={{ color: 'var(--blue)' }}>clarify the problem</strong> — ask about edge cases, input range, sorted or not</li>
          <li>State your <strong style={{ color: 'var(--blue)' }}>brute force</strong> first, then optimize step by step</li>
          <li>Think aloud — say what you're considering, interviewers want to see your process</li>
          <li>Discuss <strong style={{ color: 'var(--blue)' }}>time and space complexity</strong> for every solution</li>
          <li>Test with edge cases: empty input, single element, all same values</li>
        </ul>
      </div>

      {/* Company filter */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 6 }}>🏢 Company:</div>
        <div className="interview-filter" style={{ marginBottom: 12 }}>
          {COMPANIES.map(c => (
            <button key={c} className={`filter-btn${companyFilter === c ? ' active' : ''}`} onClick={() => setCompanyFilter(c)}>
              {c === 'Google' ? '🔵' : c === 'Amazon' ? '🟠' : c === 'Meta' ? '🔷' : c === 'Microsoft' ? '🟩' : c === 'Apple' ? '⚫' : ''} {c}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 6 }}>📚 Topic:</div>
        <div className="interview-filter" style={{ marginBottom: 12 }}>
          {TOPICS.map(t => (
            <button key={t} className={`filter-btn${topicFilter === t ? ' active' : ''}`} onClick={() => setTopicFilter(t)}>{t}</button>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 6 }}>⚡ Difficulty:</div>
        <div className="interview-filter">
          {DIFFS.map(d => (
            <button key={d} className={`filter-btn${diffFilter === d ? ' active' : ''}`} onClick={() => setDiffFilter(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 16 }}>
        Showing <strong style={{ color: 'var(--accent)' }}>{filtered.length}</strong> questions · Click any card to reveal the answer
      </div>

      {filtered.map((item, i) => (
        <div className="q-card" key={i} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
          <div className="q-header">
            <span className="q-num">Q{i + 1}.</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                <span className={`badge badge-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text2)', background: 'var(--bg2)', padding: '2px 8px', borderRadius: 10 }}>{item.topic}</span>
                {(item.companies || []).map(c => (
                  <span key={c} className="company-tag">{c}</span>
                ))}
              </div>
              <div className="q-title">{item.q}</div>
            </div>
            <span style={{ marginLeft: 8, color: 'var(--text2)', fontSize: '0.9rem', flexShrink: 0 }}>{openIdx === i ? '▲' : '▼'}</span>
          </div>
          <div className="q-tags">
            {item.tags.map(tag => <span key={tag} className="q-tag">{tag}</span>)}
          </div>
          <div className={`q-answer${openIdx === i ? ' show' : ''}`}>
            <strong style={{ color: 'var(--blue)', display: 'block', marginBottom: 6 }}>Answer:</strong>
            {item.a}
          </div>
        </div>
      ))}

      {mockOpen && mockQs.length > 0 && (
        <MockInterview questions={mockQs} onClose={() => setMockOpen(false)} />
      )}
    </div>
  )
}
