import { useState, useRef } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

// ─── Min-Heap Logic ───────────────────────────────────────────────────────────
function heapParent(i) { return Math.floor((i - 1) / 2) }
function heapLeft(i) { return 2 * i + 1 }
function heapRight(i) { return 2 * i + 2 }

function heapInsert(arr, val) {
  const h = [...arr, val]
  let i = h.length - 1
  const steps = [{ heap: [...h], highlight: [i], label: `Insert ${val} at end` }]
  // Bubble up
  while (i > 0 && h[heapParent(i)] > h[i]) {
    const p = heapParent(i)
    ;[h[i], h[p]] = [h[p], h[i]]
    i = p
    steps.push({ heap: [...h], highlight: [i, heapParent(i) < 0 ? i : i], label: `Bubble up: swap with parent → pos ${i}` })
  }
  steps.push({ heap: [...h], highlight: [i], label: `${val} settled at index ${i}` })
  return { result: [...h], steps }
}

function heapExtractMin(arr) {
  if (arr.length === 0) return { result: [], steps: [] }
  const h = [...arr]
  const min = h[0]
  const last = h.pop()
  const steps = [{ heap: [...h], highlight: [0], label: `Remove root (${min}), move last (${last ?? min}) to top` }]
  if (h.length === 0) {
    return { result: [], steps }
  }
  if (last !== undefined) h[0] = last
  steps.push({ heap: [...h], highlight: [0], label: `Sift down from index 0` })

  let i = 0
  while (true) {
    let smallest = i
    const l = heapLeft(i), r = heapRight(i)
    if (l < h.length && h[l] < h[smallest]) smallest = l
    if (r < h.length && h[r] < h[smallest]) smallest = r
    if (smallest === i) break
    ;[h[i], h[smallest]] = [h[smallest], h[i]]
    steps.push({ heap: [...h], highlight: [i, smallest], label: `Swap index ${i} (${h[i]}) ↔ ${smallest} (${h[smallest]})` })
    i = smallest
  }
  steps.push({ heap: [...h], highlight: [i], label: `Sift-down complete — heap property restored` })
  return { result: [...h], steps }
}

// ─── SVG Tree for heap ───────────────────────────────────────────────────────
function HeapTree({ heap, highlight = [] }) {
  if (heap.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        Empty heap
      </div>
    )
  }

  const highlightSet = new Set(highlight)
  const levels = Math.floor(Math.log2(heap.length)) + 1
  const svgH = 60 + levels * 70
  const svgW = 600

  function getXY(idx) {
    const level = Math.floor(Math.log2(idx + 1))
    const posInLevel = idx - (Math.pow(2, level) - 1)
    const totalInLevel = Math.pow(2, level)
    const x = ((posInLevel + 0.5) / totalInLevel) * svgW
    const y = 40 + level * 70
    return { x, y }
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      style={{ maxHeight: svgH, display: 'block', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}
    >
      {/* Edges */}
      {heap.map((_, idx) => {
        if (idx === 0) return null
        const parent = heapParent(idx)
        const { x: px, y: py } = getXY(parent)
        const { x: cx, y: cy } = getXY(idx)
        const isHighlighted = highlightSet.has(idx) && highlightSet.has(parent)
        return (
          <line key={idx}
            x1={px} y1={py} x2={cx} y2={cy}
            stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
            strokeWidth={isHighlighted ? 2.5 : 1.5}
          />
        )
      })}

      {/* Nodes */}
      {heap.map((val, idx) => {
        const { x, y } = getXY(idx)
        const isHighlighted = highlightSet.has(idx)
        const isRoot = idx === 0
        return (
          <g key={idx}>
            <circle
              cx={x} cy={y} r={22}
              fill={isRoot ? 'var(--accent2)' : isHighlighted ? 'var(--accent)' : 'var(--card)'}
              stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isRoot ? 2.5 : 1.5}
            />
            <text
              x={x} y={y + 5}
              textAnchor="middle"
              fill={isHighlighted || isRoot ? '#fff' : 'var(--text)'}
              fontSize="13"
              fontWeight="600"
              fontFamily="monospace"
            >
              {val}
            </text>
            <text
              x={x} y={y + 36}
              textAnchor="middle"
              fill="var(--text2)"
              fontSize="10"
              fontFamily="monospace"
            >
              [{idx}]
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Heap Visualization Component ────────────────────────────────────────────
function HeapViz() {
  const INITIAL = [3, 8, 12, 15, 21, 17, 25, 30, 28]
  const [heap, setHeap] = useState([...INITIAL])
  const [highlight, setHighlight] = useState([])
  const [stepQueue, setStepQueue] = useState([])
  const [stepLabel, setStepLabel] = useState('Min-heap ready. Insert a value or extract the minimum.')
  const [statusType, setStatusType] = useState('info')
  const [isAnimating, setIsAnimating] = useState(false)
  const animRef = useRef(null)

  function playSteps(steps, finalHeap) {
    if (isAnimating) return
    setIsAnimating(true)
    let i = 0
    function next() {
      if (i >= steps.length) {
        setHeap(finalHeap)
        setHighlight([])
        setIsAnimating(false)
        return
      }
      const s = steps[i++]
      setHeap(s.heap)
      setHighlight(s.highlight)
      setStepLabel(s.label)
      setStatusType('info')
      animRef.current = setTimeout(next, 700)
    }
    next()
  }

  function handleInsert() {
    if (isAnimating) return
    const val = Math.floor(Math.random() * 40) + 1
    const { result, steps } = heapInsert(heap, val)
    setStatusType('success')
    playSteps(steps, result)
  }

  function handleExtract() {
    if (isAnimating || heap.length === 0) return
    const min = heap[0]
    const { result, steps } = heapExtractMin(heap)
    setStepLabel(`Extracting min (${min})…`)
    setStatusType('info')
    playSteps(steps, result)
  }

  function handleReset() {
    if (animRef.current) clearTimeout(animRef.current)
    setIsAnimating(false)
    setHeap([...INITIAL])
    setHighlight([])
    setStepLabel('Reset to initial heap.')
    setStatusType('info')
  }

  return (
    <div className="viz-container">
      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        The <strong>purple</strong> node is the root (minimum). <strong>Blue</strong> nodes are the active swap path during animation.
        The array below mirrors the tree — they stay in sync.
      </p>

      {/* Tree */}
      <HeapTree heap={heap} highlight={highlight} />

      {/* Array representation */}
      <div style={{ margin: '1rem 0 0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)', display: 'block', marginBottom: '0.4rem' }}>
          Heap as array (index math: left = 2i+1, right = 2i+2, parent = ⌊(i-1)/2⌋):
        </span>
        <div className="viz-boxes" style={{ flexWrap: 'wrap' }}>
          {heap.map((val, i) => (
            <div
              key={i}
              className={`viz-box ${highlight.includes(i) ? 'highlight' : ''} ${i === 0 ? 'found' : ''}`}
              style={{ position: 'relative', minWidth: '2.5rem' }}
            >
              {val}
              <span style={{
                fontSize: '0.6rem', color: 'var(--text2)',
                position: 'absolute', bottom: '-1.2rem', left: '50%', transform: 'translateX(-50%)',
              }}>
                [{i}]
              </span>
            </div>
          ))}
          {heap.length === 0 && (
            <span style={{ color: 'var(--text2)', fontStyle: 'italic', fontSize: '0.9rem' }}>empty</span>
          )}
        </div>
      </div>

      {/* Index math reminder */}
      <div style={{
        display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
        fontSize: '0.82rem', fontFamily: 'monospace',
        color: 'var(--text2)', margin: '1.5rem 0 1rem',
      }}>
        <span>left child of [i] = [2i+1]</span>
        <span>right child of [i] = [2i+2]</span>
        <span>parent of [i] = [⌊(i-1)/2⌋]</span>
        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>root = [0] = minimum</span>
      </div>

      {/* Controls */}
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={handleInsert} disabled={isAnimating}>
          Insert [random]
        </button>
        <button
          className="btn btn-green"
          onClick={handleExtract}
          disabled={isAnimating || heap.length === 0}
          style={{ background: heap.length === 0 ? undefined : 'var(--green)', color: heap.length === 0 ? undefined : '#fff' }}
        >
          Extract Min
        </button>
        <button className="btn btn-secondary" onClick={handleReset} disabled={isAnimating}>
          Reset
        </button>
        {heap.length > 0 && (
          <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text2)' }}>
            min = <strong style={{ color: 'var(--accent)' }}>{heap[0]}</strong> &nbsp;|&nbsp; size = {heap.length}
          </span>
        )}
      </div>

      <div className={`viz-status ${statusType}`} style={{ marginTop: '0.75rem' }}>
        {stepLabel}
      </div>
    </div>
  )
}

// ─── Code snippets ────────────────────────────────────────────────────────────
const codes = {
  Python: `import heapq

# ── Python heapq (min-heap by default) ───────────────────
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
heapq.heappush(h, 8)
print(heapq.heappop(h))   # 1  — always the minimum

# Max-heap: negate values
heapq.heappush(h, -3)     # "push 3 to max-heap"
print(-heapq.heappop(h))  # 3

# heapify existing list in O(n)
arr = [9, 4, 7, 1, 8, 2]
heapq.heapify(arr)         # modifies in-place → [1, 4, 2, 9, 8, 7]

# ── MinHeap class (manual, for interviews) ────────────────
class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)

    def extract_min(self):
        if not self.heap: return None
        self._swap(0, len(self.heap) - 1)
        min_val = self.heap.pop()
        self._sift_down(0)
        return min_val

    def peek(self): return self.heap[0] if self.heap else None

    # ── Internal helpers ──────────────────────────────────
    def _bubble_up(self, i):
        while i > 0:
            p = (i - 1) // 2
            if self.heap[p] <= self.heap[i]: break
            self._swap(i, p)
            i = p

    def _sift_down(self, i):
        n = len(self.heap)
        while True:
            smallest, l, r = i, 2*i+1, 2*i+2
            if l < n and self.heap[l] < self.heap[smallest]: smallest = l
            if r < n and self.heap[r] < self.heap[smallest]: smallest = r
            if smallest == i: break
            self._swap(i, smallest)
            i = smallest

    def _swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]`,

  JavaScript: `class MinHeap {
  constructor() { this.heap = []; }

  insert(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (!this.heap.length) return null;
    this._swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    this._siftDown(0);
    return min;
  }

  peek() { return this.heap[0] ?? null; }
  size() { return this.heap.length; }

  // ── Internal helpers ────────────────────────────────────
  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p] <= this.heap[i]) break;
      this._swap(i, p);
      i = p;
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      this._swap(i, smallest);
      i = smallest;
    }
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// ── Usage ────────────────────────────────────────────────
const mh = new MinHeap();
[5, 1, 8, 3].forEach(v => mh.insert(v));
console.log(mh.extractMin()); // 1
console.log(mh.peek());       // 3`,

  'C++': `#include <queue>
#include <vector>

// ── STL priority_queue ────────────────────────────────────
// Min-heap (use greater<int>)
priority_queue<int, vector<int>, greater<int>> minH;
minH.push(5); minH.push(1); minH.push(8);
cout << minH.top();   // 1
minH.pop();

// Max-heap (default)
priority_queue<int> maxH;
maxH.push(5); maxH.push(1); maxH.push(8);
cout << maxH.top();   // 8

// ── Manual MinHeap class ──────────────────────────────────
class MinHeap {
    vector<int> h;
    void swap(int i, int j) { std::swap(h[i], h[j]); }

    void bubbleUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (h[p] <= h[i]) break;
            swap(i, p); i = p;
        }
    }

    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int s = i, l = 2*i+1, r = 2*i+2;
            if (l < n && h[l] < h[s]) s = l;
            if (r < n && h[r] < h[s]) s = r;
            if (s == i) break;
            swap(i, s); i = s;
        }
    }

public:
    void insert(int val) { h.push_back(val); bubbleUp(h.size()-1); }

    int extractMin() {
        swap(0, h.size()-1);
        int m = h.back(); h.pop_back();
        if (!h.empty()) siftDown(0);
        return m;
    }

    int peek() const { return h[0]; }
    int size() const { return h.size(); }

    // Build heap from array in O(n) — heapify
    void buildHeap(vector<int>& arr) {
        h = arr;
        for (int i = h.size()/2 - 1; i >= 0; i--) siftDown(i);
    }
};`,
}

// ─── Problems ─────────────────────────────────────────────────────────────────
const problems = [
  {
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    desc: 'Find the k-th largest element in an unsorted array without sorting the full array.',
    hint: 'Maintain a min-heap of size k. For each element, push it in; if size exceeds k, pop the minimum. The heap\'s root is the k-th largest.',
    link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
  },
  {
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    desc: 'Given an integer array, return the k most frequent elements.',
    hint: 'Count frequencies with a hash map. Use a min-heap of size k keyed by frequency — pop when size exceeds k. O(n log k) time.',
    link: 'https://leetcode.com/problems/top-k-frequent-elements/',
  },
  {
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    desc: 'Design a data structure that supports addNum and findMedian efficiently on a streaming dataset.',
    hint: 'Two heaps: a max-heap for the lower half and a min-heap for the upper half. Balance so their sizes differ by at most 1. Median is the top of the larger heap (or average of both tops).',
    link: 'https://leetcode.com/problems/find-median-from-data-stream/',
  },
  {
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    desc: 'Merge k sorted linked lists into one sorted list.',
    hint: 'Push the head of each list into a min-heap. Each time you pop the smallest node, advance its list and push the next node. O(n log k) total.',
    link: 'https://leetcode.com/problems/merge-k-sorted-lists/',
  },
  {
    title: 'Task Scheduler',
    difficulty: 'Medium',
    desc: 'Given tasks with a cooldown n, find the minimum time to execute all tasks.',
    hint: 'Use a max-heap of task frequencies. Each round (of n+1 slots), greedily pick the most frequent available tasks. Append idle time when no tasks are available.',
    link: 'https://leetcode.com/problems/task-scheduler/',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Heaps() {
  return (
    <div className="content">
      <TopicHeader
        topic="heaps"
        title="⛰️ Heaps & Priority Queues"
        subtitle="A complete binary tree satisfying the heap property — enabling O(log n) insert and extract, and O(1) peek of the minimum (or maximum)."
        hasQuiz={true}
      />

      {/* Core Concepts */}
      <div className="card">
        <h2>Core Concepts</h2>
        <p>
          A <strong>heap</strong> is a complete binary tree where every parent satisfies the <em>heap property</em>
          relative to its children. A <strong>min-heap</strong> guarantees the root is always the smallest element.
          A <strong>max-heap</strong> guarantees the root is always the largest.
        </p>

        <h3 style={{ marginTop: '1.25rem' }}>Min-Heap vs Max-Heap</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Property</th><th>Min-Heap</th><th>Max-Heap</th></tr>
            </thead>
            <tbody>
              <tr><td>Heap rule</td><td>parent ≤ children</td><td>parent ≥ children</td></tr>
              <tr><td>Root</td><td>Smallest element</td><td>Largest element</td></tr>
              <tr><td>Use cases</td><td>Dijkstra, Prim, merge K lists, median</td><td>Heap sort, scheduling, top-K</td></tr>
              <tr><td>Python</td><td><code>heapq</code> (default)</td><td>negate values: <code>-val</code></td></tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '1.25rem' }}>Array Representation</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          A heap is stored as a flat array — no pointers needed. The tree structure is implied by index arithmetic:
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem', margin: '0.5rem 0',
        }}>
          {[
            { label: 'Left child of i', formula: '2i + 1' },
            { label: 'Right child of i', formula: '2i + 2' },
            { label: 'Parent of i', formula: '⌊(i - 1) / 2⌋' },
            { label: 'Root', formula: 'index 0' },
          ].map(({ label, formula }) => (
            <div key={label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.75rem 1rem',
            }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--accent)', fontWeight: 600 }}>{formula}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '1.25rem' }}>Key Operations</h3>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Insert + bubble-up:</strong> append to end, then swap with parent while parent &gt; child (O(log n)).</li>
          <li><strong>Extract min + sift-down:</strong> swap root with last element, remove last, then swap with smaller child until heap property holds (O(log n)).</li>
          <li><strong>Peek:</strong> read heap[0] — no modification needed (O(1)).</li>
          <li><strong>Heapify (buildHeap):</strong> start sift-down from the last non-leaf (n/2 - 1) toward root — O(n) total, better than n insertions O(n log n).</li>
          <li><strong>Priority Queue:</strong> a heap is the canonical implementation of a priority queue, where each element has a priority and dequeue always yields the highest-priority item.</li>
        </ul>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>Visualization — Min-Heap (Tree + Array)</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
          <strong>Insert</strong> adds a random value and animates the bubble-up path.
          <strong> Extract Min</strong> removes the root and animates sift-down.
          The array below the tree stays perfectly in sync.
        </p>
        <HeapViz />
      </div>

      {/* Complexity */}
      <div className="card">
        <h2>Time Complexity</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Operation</th><th>Time</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>insert</td><td><span className="ologn">O(log n)</span></td><td>Bubble-up at most tree height = log n swaps</td></tr>
              <tr><td>extractMin / extractMax</td><td><span className="ologn">O(log n)</span></td><td>Sift-down at most log n levels</td></tr>
              <tr><td>peek (min/max)</td><td><span className="o1">O(1)</span></td><td>Root is always at index 0</td></tr>
              <tr><td>buildHeap (heapify)</td><td><span className="on">O(n)</span></td><td>Sift-down from n/2 → 0; most nodes are near leaves</td></tr>
              <tr><td>Heap Sort</td><td><span className="onlogn">O(n log n)</span></td><td>n extractions × O(log n) each</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginTop: '0.75rem' }}>
          Space: O(n) for the array. No pointers — cache-friendly compared to linked-list-based structures.
        </p>
      </div>

      {/* Code */}
      <div className="card">
        <h2>Code — MinHeap with insert, extractMin, heapify</h2>
        <CodeBlock codes={codes} />
      </div>

      {/* Problems */}
      <div className="card">
        <h2>Practice Problems</h2>
        <ProblemList problems={problems} />
      </div>
    </div>
  )
}
