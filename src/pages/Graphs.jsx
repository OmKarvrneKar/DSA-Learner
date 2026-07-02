import { useState, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import ProblemList from '../components/ProblemList'
import TopicHeader from '../components/TopicHeader'

const GRAPH = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4],
}

const NODE_POS = {
  0: [100, 50], 1: [220, 50], 2: [100, 150], 3: [320, 30], 4: [320, 90], 5: [210, 150]
}

const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[4,5]]

function GraphViz() {
  const [visited, setVisited] = useState([])
  const [current, setCurrent] = useState(null)
  const [status, setStatus] = useState('Press BFS or DFS to traverse from node 0')
  const [running, setRunning] = useState(false)

  function runBFS() {
    if (running) return
    setRunning(true)
    setVisited([]); setCurrent(null)
    const order = []
    const q = [0], vis = new Set([0])
    while (q.length) { const n = q.shift(); order.push(n); for (const nb of GRAPH[n]) { if (!vis.has(nb)) { vis.add(nb); q.push(nb) } } }
    setStatus(`BFS order: ${order.join(' → ')}`)
    order.forEach((n, i) => {
      setTimeout(() => {
        setCurrent(n)
        setVisited(prev => [...prev, n])
        if (i === order.length - 1) { setCurrent(null); setRunning(false) }
      }, i * 600)
    })
  }

  function runDFS() {
    if (running) return
    setRunning(true)
    setVisited([]); setCurrent(null)
    const order = [], vis = new Set()
    function dfs(n) { if (vis.has(n)) return; vis.add(n); order.push(n); for (const nb of GRAPH[n]) dfs(nb) }
    dfs(0)
    setStatus(`DFS order: ${order.join(' → ')}`)
    order.forEach((n, i) => {
      setTimeout(() => {
        setCurrent(n)
        setVisited(prev => [...prev, n])
        if (i === order.length - 1) { setCurrent(null); setRunning(false) }
      }, i * 600)
    })
  }

  function reset() { setVisited([]); setCurrent(null); setStatus('Press BFS or DFS to traverse from node 0'); setRunning(false) }

  return (
    <div className="viz-container">
      <svg viewBox="0 0 420 190" style={{ width: '100%', maxWidth: 420, height: 190 }}>
        {EDGES.map(([a, b]) => {
          const [ax, ay] = NODE_POS[a], [bx, by] = NODE_POS[b]
          return <line key={`${a}-${b}`} x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--border)" strokeWidth={2} />
        })}
        {Object.entries(NODE_POS).map(([id, [x, y]]) => {
          const n = Number(id)
          const isVisited = visited.includes(n)
          const isCurrent = current === n
          return (
            <g key={id}>
              <circle cx={x} cy={y} r={22}
                fill={isCurrent ? 'rgba(255,215,0,0.3)' : isVisited ? 'rgba(0,212,170,0.2)' : 'var(--card)'}
                stroke={isCurrent ? 'var(--yellow)' : isVisited ? 'var(--green)' : 'var(--border)'}
                strokeWidth={2} />
              <text x={x} y={y + 5} textAnchor="middle"
                fill={isCurrent ? 'var(--yellow)' : isVisited ? 'var(--green)' : 'var(--text)'}
                fontSize={14} fontWeight={700}>{n}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', display: 'flex', gap: 16 }}>
        <span>🟡 Current</span><span>🟢 Visited</span><span>⚫ Unvisited</span>
      </div>
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={runBFS}>BFS (Queue)</button>
        <button className="btn btn-secondary" onClick={runDFS}>DFS (Recursive)</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `from collections import defaultdict, deque

# Graph as adjacency list
graph = defaultdict(list)
edges = [(0,1),(0,2),(1,3),(1,4),(2,5),(4,5)]
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)

# BFS – shortest path (unweighted)
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                queue.append(nb)
    return order

# DFS – iterative
def dfs(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            stack.extend(graph[node])
    return order

# Detect cycle (undirected)
def has_cycle(graph, n):
    visited = set()
    def dfs(node, parent):
        visited.add(node)
        for nb in graph[node]:
            if nb not in visited:
                if dfs(nb, node): return True
            elif nb != parent:
                return True
        return False
    return any(dfs(i, -1) for i in range(n) if i not in visited)`,
  JavaScript: `// BFS
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start], order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of (graph[node] || [])) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
  }
  return order;
}

// DFS (recursive)
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  for (const nb of (graph[node] || [])) {
    if (!visited.has(nb)) dfs(graph, nb, visited);
  }
  return visited;
}

// Topological Sort (DAG)
function topoSort(graph, n) {
  const visited = new Set(), result = [];
  function dfs(node) {
    visited.add(node);
    for (const nb of (graph[node] || [])) {
      if (!visited.has(nb)) dfs(nb);
    }
    result.unshift(node);
  }
  for (let i = 0; i < n; i++) if (!visited.has(i)) dfs(i);
  return result;
}`,
  'C++': `#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

// BFS
vector<int> bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    q.push(start); visited.insert(start);
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int nb : graph[node]) {
            if (!visited.count(nb)) {
                visited.insert(nb);
                q.push(nb);
            }
        }
    }
    return order;
}

// DFS (recursive)
void dfs(vector<vector<int>>& graph, int node,
         unordered_set<int>& visited, vector<int>& order) {
    visited.insert(node);
    order.push_back(node);
    for (int nb : graph[node])
        if (!visited.count(nb))
            dfs(graph, nb, visited, order);
}`,
}

const problems = [
  { title: 'Number of Connected Components', difficulty: 'Medium', desc: 'Count the number of connected components in an undirected graph.', hint: 'Run DFS/BFS from each unvisited node, incrementing a counter each time you start a new traversal.', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  { title: 'Course Schedule (Cycle Detection)', difficulty: 'Medium', desc: 'Determine if it\'s possible to finish all courses given prerequisites (detect if DAG).', hint: 'Model as a directed graph. Use DFS with three states: unvisited, in-progress, done. A cycle exists if you visit an in-progress node.', link: 'https://leetcode.com/problems/course-schedule/' },
  { title: 'Word Ladder', difficulty: 'Hard', desc: 'Find the shortest transformation sequence from beginWord to endWord.', hint: 'BFS level by level. At each step, try all one-character mutations of the current word and check if they exist in the word list.', link: 'https://leetcode.com/problems/word-ladder/' },
  { title: 'Clone Graph', difficulty: 'Medium', desc: 'Deep clone a graph where each node has a value and a list of neighbors.', hint: 'Use a hash map from original node to clone node. BFS/DFS: for each node, clone it if not already cloned, then recursively clone neighbors.', link: 'https://leetcode.com/problems/clone-graph/' },
]

export default function Graphs() {
  return (
    <div className="content">
      <TopicHeader topic="graphs" title="🕸️ Graphs" subtitle="Nodes (vertices) connected by edges. Used to model networks, maps, dependencies." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>Representation</strong> — Adjacency list (sparse graphs) or adjacency matrix (dense graphs).</li>
          <li><strong style={{ color: 'var(--blue)' }}>BFS</strong> — Uses a queue, explores level by level. Best for shortest path in unweighted graphs.</li>
          <li><strong style={{ color: 'var(--blue)' }}>DFS</strong> — Uses a stack (recursive), explores as deep as possible. Best for cycle detection, topological sort.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Directed vs Undirected</strong> — Edges are one-way or two-way.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Topological Sort</strong> — Linear ordering of vertices in a DAG (Directed Acyclic Graph).</li>
          <li><strong style={{ color: 'var(--blue)' }}>Dijkstra</strong> — Shortest path in weighted graphs. Uses a priority queue (min-heap).</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Graph Traversal Animation</h2>
        <p style={{ marginBottom: 12 }}>6-node undirected graph. Watch BFS explore level by level vs DFS go deep first.</p>
        <GraphViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead><tr><th>Algorithm</th><th>Time</th><th>Space</th></tr></thead>
          <tbody>
            <tr><td>BFS</td><td className="on">O(V + E)</td><td className="on">O(V)</td></tr>
            <tr><td>DFS</td><td className="on">O(V + E)</td><td className="on">O(V)</td></tr>
            <tr><td>Dijkstra (heap)</td><td className="on">O((V+E) log V)</td><td className="on">O(V)</td></tr>
            <tr><td>Topological Sort</td><td className="on">O(V + E)</td><td className="on">O(V)</td></tr>
            <tr><td>Adj List Storage</td><td>-</td><td className="on">O(V + E)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="graphs" />
      </div>
    </div>
  )
}
