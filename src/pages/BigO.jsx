export default function BigO() {
  return (
    <div className="content">
      <div className="section-title">⚡ Big-O Cheatsheet</div>
      <div className="section-subtitle">Quick reference for time & space complexity of every major data structure and algorithm.</div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(77,166,255,0.06), rgba(0,212,170,0.06))', borderColor: 'var(--blue)' }}>
        <h2 style={{ color: 'var(--blue)' }}>📊 Complexity Hierarchy (Fastest → Slowest)</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12, alignItems: 'center' }}>
          {[
            { label: 'O(1)', color: '#00d4aa', desc: 'Constant' },
            { label: 'O(log n)', color: '#7ecfff', desc: 'Logarithmic' },
            { label: 'O(n)', color: '#ffd700', desc: 'Linear' },
            { label: 'O(n log n)', color: '#ffb347', desc: 'Linearithmic' },
            { label: 'O(n²)', color: '#ff9966', desc: 'Quadratic' },
            { label: 'O(2ⁿ)', color: '#ff7b72', desc: 'Exponential' },
            { label: 'O(n!)', color: '#e94560', desc: 'Factorial' },
          ].map((c, i, arr) => (
            <>
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: c.color, fontSize: '0.9rem' }}>{c.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text2)' }}>{c.desc}</div>
              </div>
              {i < arr.length - 1 && <span style={{ color: 'var(--text2)', fontSize: '1rem' }}>→</span>}
            </>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>📦 Data Structures</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Data Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th><th>Space</th></tr>
          </thead>
          <tbody>
            <tr><td>Array</td><td className="o1">O(1)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="on">O(n)</td></tr>
            <tr><td>Dynamic Array (list)</td><td className="o1">O(1)</td><td className="on">O(n)</td><td className="o1">O(1)*</td><td className="on">O(n)</td><td className="on">O(n)</td></tr>
            <tr><td>Linked List (singly)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="o1">O(1)**</td><td className="o1">O(1)**</td><td className="on">O(n)</td></tr>
            <tr><td>Stack</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="o1">O(1)</td><td className="o1">O(1)</td><td className="on">O(n)</td></tr>
            <tr><td>Queue</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="o1">O(1)</td><td className="o1">O(1)</td><td className="on">O(n)</td></tr>
            <tr><td>Hash Table</td><td>N/A</td><td className="o1">O(1)*</td><td className="o1">O(1)*</td><td className="o1">O(1)*</td><td className="on">O(n)</td></tr>
            <tr><td>BST (balanced)</td><td className="ologn">O(log n)</td><td className="ologn">O(log n)</td><td className="ologn">O(log n)</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
            <tr><td>BST (unbalanced)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="on">O(n)</td><td className="on">O(n)</td></tr>
            <tr><td>Min/Max Heap</td><td className="o1">O(1)†</td><td className="on">O(n)</td><td className="ologn">O(log n)</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
            <tr><td>Trie</td><td className="ologn">O(k)</td><td className="ologn">O(k)</td><td className="ologn">O(k)</td><td className="ologn">O(k)</td><td className="on">O(n·k)</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 10, fontSize: '0.75rem' }}>* Amortized or average. ** At head. † Min/max only.</p>
      </div>

      <div className="card">
        <h2>🔢 Sorting Algorithms</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr>
          </thead>
          <tbody>
            <tr><td>Bubble Sort</td><td className="on">O(n)</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="o1">O(1)</td><td>✅</td></tr>
            <tr><td>Selection Sort</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="o1">O(1)</td><td>❌</td></tr>
            <tr><td>Insertion Sort</td><td className="on">O(n)</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="o1">O(1)</td><td>✅</td></tr>
            <tr><td>Merge Sort</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="on">O(n)</td><td>✅</td></tr>
            <tr><td>Quick Sort</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="on2">O(n²)</td><td className="ologn">O(log n)</td><td>❌</td></tr>
            <tr><td>Heap Sort</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="o1">O(1)</td><td>❌</td></tr>
            <tr><td>Counting Sort</td><td className="on">O(n+k)</td><td className="on">O(n+k)</td><td className="on">O(n+k)</td><td className="on">O(k)</td><td>✅</td></tr>
            <tr><td>Timsort (Python/Java)</td><td className="on">O(n)</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="on">O(n)</td><td>✅</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🕸️ Graph Algorithms</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Algorithm</th><th>Time</th><th>Space</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>BFS</td><td className="on">O(V + E)</td><td className="on">O(V)</td><td>Shortest path (unweighted)</td></tr>
            <tr><td>DFS</td><td className="on">O(V + E)</td><td className="on">O(V)</td><td>Stack depth = O(V) recursion</td></tr>
            <tr><td>Dijkstra (heap)</td><td className="on">O((V+E) log V)</td><td className="on">O(V)</td><td>No negative edges</td></tr>
            <tr><td>Bellman-Ford</td><td className="on">O(V·E)</td><td className="on">O(V)</td><td>Handles negative edges</td></tr>
            <tr><td>Floyd-Warshall</td><td className="on">O(V³)</td><td className="on">O(V²)</td><td>All-pairs shortest path</td></tr>
            <tr><td>Topological Sort</td><td className="on">O(V + E)</td><td className="on">O(V)</td><td>DAG only</td></tr>
            <tr><td>Kruskal's MST</td><td className="on">O(E log E)</td><td className="on">O(V)</td><td>Minimum spanning tree</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🌳 Tree Operations</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Operation</th><th>BST (balanced)</th><th>BST (unbalanced)</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>Search</td><td className="ologn">O(log n)</td><td className="on">O(n)</td><td>Compare & go left/right</td></tr>
            <tr><td>Insert</td><td className="ologn">O(log n)</td><td className="on">O(n)</td><td>Find position, insert leaf</td></tr>
            <tr><td>Delete</td><td className="ologn">O(log n)</td><td className="on">O(n)</td><td>Find inorder successor for 2-child</td></tr>
            <tr><td>Traversal</td><td className="on">O(n)</td><td className="on">O(n)</td><td>Always O(n) — visit all nodes</td></tr>
            <tr><td>Find Min/Max</td><td className="ologn">O(log n)</td><td className="on">O(n)</td><td>Leftmost/rightmost node</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🧠 Common Patterns & Their Complexities</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Pattern</th><th>Time</th><th>Space</th><th>Example Problems</th></tr>
          </thead>
          <tbody>
            <tr><td>Two Pointers</td><td className="on">O(n)</td><td className="o1">O(1)</td><td>Two Sum (sorted), Container with water</td></tr>
            <tr><td>Sliding Window</td><td className="on">O(n)</td><td className="o1">O(1)–O(k)</td><td>Longest substring, max sum subarray</td></tr>
            <tr><td>Binary Search</td><td className="ologn">O(log n)</td><td className="o1">O(1)</td><td>Search in sorted array, rotated array</td></tr>
            <tr><td>Hash Map</td><td className="on">O(n)</td><td className="on">O(n)</td><td>Two Sum, frequency count</td></tr>
            <tr><td>DFS/Backtracking</td><td className="on">O(2ⁿ) or O(n!)</td><td className="on">O(n)</td><td>Subsets, permutations, N-Queens</td></tr>
            <tr><td>Dynamic Programming</td><td className="on">O(n²) typical</td><td className="on">O(n) or O(n²)</td><td>LCS, Knapsack, Coin Change</td></tr>
            <tr><td>Heap / Priority Queue</td><td className="ologn">O(n log k)</td><td className="on">O(k)</td><td>Kth largest, merge k sorted lists</td></tr>
            <tr><td>Union-Find (DSU)</td><td className="ologn">O(α(n))</td><td className="on">O(n)</td><td>Connected components, cycle detection</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>📝 Interview Quick Reference</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12, marginTop: 8 }}>
          {[
            { title: 'Need O(1) lookup?', ans: 'Use Hash Map' },
            { title: 'Sorted + O(log n)?', ans: 'Binary Search' },
            { title: 'Subarray/substring?', ans: 'Sliding Window' },
            { title: 'Shortest path?', ans: 'BFS (unweighted)' },
            { title: 'Weighted shortest?', ans: 'Dijkstra' },
            { title: 'All combinations?', ans: 'Backtracking DFS' },
            { title: 'Overlapping subproblems?', ans: 'Dynamic Programming' },
            { title: 'Detect cycle (graph)?', ans: 'DFS with state' },
            { title: 'Detect cycle (linked list)?', ans: "Floyd's (slow/fast)" },
            { title: 'Top K elements?', ans: 'Heap (size k)' },
          ].map(item => (
            <div key={item.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.88rem' }}>→ {item.ans}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
