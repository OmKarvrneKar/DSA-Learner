import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

function QueueViz() {
  const [queue, setQueue] = useState([10, 20, 30, 40])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('Queue ready. Enqueue adds to rear, Dequeue removes from front.')

  function enqueue() {
    const val = Number(input) || Math.floor(Math.random() * 90 + 10)
    setQueue(q => [...q, val])
    setStatus(`✅ Enqueued ${val} at REAR — O(1)`)
    setInput('')
  }

  function dequeue() {
    if (queue.length === 0) { setStatus('❌ Queue is empty!'); return }
    const front = queue[0]
    setQueue(q => q.slice(1))
    setStatus(`✅ Dequeued ${front} from FRONT — O(1)`)
  }

  return (
    <div className="viz-container">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
          ← FRONT (dequeue) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; REAR (enqueue) →
        </span>
      </div>
      <div className="queue-viz">
        {queue.map((v, i) => (
          <div key={i} className={`queue-item${i === 0 ? ' front' : i === queue.length - 1 ? ' rear' : ''}`}>{v}</div>
        ))}
        {queue.length === 0 && <div style={{ color: 'var(--text2)', fontSize: '0.85rem', padding: 16 }}>Empty Queue</div>}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text2)', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>🟢 Front (next to dequeue)</span><span>🔴 Rear (last enqueued)</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Value"
          style={{ width: 100, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.85rem' }}
        />
        <button className="btn btn-primary" onClick={enqueue}>Enqueue</button>
        <button className="btn btn-secondary" onClick={dequeue}>Dequeue</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `from collections import deque

# Queue using deque (double-ended, O(1) both ends)
queue = deque()
queue.append(10)       # enqueue → O(1)
queue.append(20)
queue.append(30)
front = queue[0]       # peek front → 10
queue.popleft()        # dequeue   → O(1) → removes 10

# BFS using Queue
from collections import defaultdict

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
  JavaScript: `// Queue using array (simple)
const queue = [];
queue.push(10);            // enqueue → O(1)
queue.push(20);
queue.push(30);
const front = queue[0];   // peek front → 10
queue.shift();             // dequeue → O(n) (use linked-list based for O(1))

// Better: use index-based queue
class Queue {
  constructor() { this.data = {}; this.head = 0; this.tail = 0; }
  enqueue(val) { this.data[this.tail++] = val; }
  dequeue() {
    if (this.head === this.tail) return undefined;
    return this.data[this.head++];
  }
  peek() { return this.data[this.head]; }
  get size() { return this.tail - this.head; }
}`,
  'C++': `#include <queue>
using namespace std;

queue<int> q;
q.push(10);           // enqueue → O(1)
q.push(20);
q.push(30);
int front = q.front(); // peek → 10
q.pop();               // dequeue → O(1)

// BFS
#include <vector>
#include <unordered_set>
void bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    q.push(start);
    visited.insert(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}`,
}

const problems = [
  { title: 'Number of Islands (BFS)', difficulty: 'Medium', desc: 'Count the number of islands in a 2D grid of 0s and 1s.', hint: 'For each unvisited land cell (1), start a BFS/DFS that marks all connected land as visited. Count how many times you start a new BFS.', link: 'https://leetcode.com/problems/number-of-islands/' },
  { title: 'Rotting Oranges', difficulty: 'Medium', desc: 'Find minimum time until all oranges are rotten, spreading to adjacent cells each minute.', hint: 'Multi-source BFS: start with all rotten oranges in the queue simultaneously. Process level by level (each level = 1 minute).', link: 'https://leetcode.com/problems/rotting-oranges/' },
  { title: 'Walls and Gates', difficulty: 'Medium', desc: 'Fill each empty room with distance to its nearest gate.', hint: 'Multi-source BFS starting from all gates at once. BFS guarantees shortest distance is found first.', link: 'https://leetcode.com/problems/walls-and-gates/' },
  { title: 'Design Circular Queue', difficulty: 'Medium', desc: 'Design a circular queue with fixed size supporting standard queue operations.', hint: 'Use an array with head and tail pointers. Use modulo arithmetic to wrap around. Track size to distinguish full vs empty.', link: 'https://leetcode.com/problems/design-circular-queue/' },
]

export default function Queues() {
  return (
    <div className="content">
      <TopicHeader topic="queues" title="🚶 Queues" subtitle="FIFO (First In, First Out) — like a queue at a ticket counter. First to enter is first to leave." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>FIFO</strong> — First element enqueued is the first to be dequeued.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Enqueue</strong> — Add to rear. O(1). <strong style={{ color: 'var(--blue)' }}>Dequeue</strong> — Remove from front. O(1) with deque.</li>
          <li><strong style={{ color: 'var(--blue)' }}>BFS</strong> — Breadth-First Search uses a queue to explore level by level.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Deque</strong> — Double-ended queue. Can add/remove from both ends. Very versatile.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Priority Queue</strong> — Elements are served by priority, not insertion order (implemented with a heap).</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Queue Animation</h2>
        <p style={{ marginBottom: 12 }}>Enqueue adds to the rear, dequeue removes from the front. This is the FIFO principle in action.</p>
        <QueueViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead><tr><th>Operation</th><th>Time</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Enqueue</td><td className="o1">O(1)</td><td>Add to rear</td></tr>
            <tr><td>Dequeue</td><td className="o1">O(1)</td><td>Remove from front (with deque)</td></tr>
            <tr><td>Peek (Front)</td><td className="o1">O(1)</td><td>View front element</td></tr>
            <tr><td>Search</td><td className="on">O(n)</td><td>Not a typical operation</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="queues" />
      </div>
    </div>
  )
}
