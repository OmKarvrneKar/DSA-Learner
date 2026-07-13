import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

// Simple BST with 7 nodes for visualization
const tree = {
  val: 8,
  left: { val: 4, left: { val: 2, left: null, right: null }, right: { val: 6, left: null, right: null } },
  right: { val: 12, left: { val: 10, left: null, right: null }, right: { val: 14, left: null, right: null } }
}

function flatten(node, arr = []) {
  if (!node) return
  flatten(node.left, arr)
  arr.push(node.val)
  flatten(node.right, arr)
  return arr
}

function TreeNode({ x, y, val, highlight }) {
  return (
    <g>
      <circle cx={x} cy={y} r={22}
        fill={highlight ? 'rgba(233,69,96,0.3)' : 'var(--card)'}
        stroke={highlight ? 'var(--accent)' : 'var(--border)'} strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" fill={highlight ? 'var(--accent)' : 'var(--text)'}
        fontSize={13} fontWeight={700}>{val}</text>
    </g>
  )
}

function Edge({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1 + 22} x2={x2} y2={y2 - 22} stroke="var(--border)" strokeWidth={1.5} />
}

function TreeViz() {
  const [highlighted, setHighlighted] = useState([])
  const [status, setStatus] = useState('Choose a traversal to animate the BST')
  const [running, setRunning] = useState(false)

  function animate(order, label) {
    if (running) return
    setRunning(true)
    setHighlighted([])
    setStatus(`${label}: ${order.join(' → ')}`)
    order.forEach((val, i) => {
      setTimeout(() => {
        setHighlighted(prev => [...prev, val])
        if (i === order.length - 1) setRunning(false)
      }, i * 600)
    })
  }

  function inorder(node, arr = []) { if (!node) return; inorder(node.left, arr); arr.push(node.val); inorder(node.right, arr); return arr }
  function preorder(node, arr = []) { if (!node) return; arr.push(node.val); preorder(node.left, arr); preorder(node.right, arr); return arr }
  function postorder(node, arr = []) { if (!node) return; postorder(node.left, arr); postorder(node.right, arr); arr.push(node.val); return arr }
  function bfs() {
    const q = [tree], arr = []
    while (q.length) { const n = q.shift(); arr.push(n.val); if (n.left) q.push(n.left); if (n.right) q.push(n.right) }
    return arr
  }

  const W = 400, positions = {
    8: [200, 35], 4: [100, 95], 12: [300, 95],
    2: [50, 155], 6: [150, 155], 10: [250, 155], 14: [350, 155]
  }
  const edges = [[8,4],[8,12],[4,2],[4,6],[12,10],[12,14]]

  return (
    <div className="viz-container">
      <svg viewBox="0 0 400 190" style={{ width: '100%', maxWidth: 420, height: 190 }}>
        {edges.map(([p, c]) => {
          const [px, py] = positions[p], [cx, cy] = positions[c]
          return <Edge key={`${p}-${c}`} x1={px} y1={py} x2={cx} y2={cy} />
        })}
        {Object.entries(positions).map(([val, [x, y]]) => (
          <TreeNode key={val} x={x} y={y} val={val} highlight={highlighted.includes(Number(val))} />
        ))}
      </svg>
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={() => animate(inorder(tree, []), '🔵 Inorder (sorted)')}>Inorder</button>
        <button className="btn btn-secondary" onClick={() => animate(preorder(tree, []), '🟠 Preorder')}>Preorder</button>
        <button className="btn btn-secondary" onClick={() => animate(postorder(tree, []), '🟣 Postorder')}>Postorder</button>
        <button className="btn btn-green" onClick={() => animate(bfs(), '🟢 BFS (Level order)')}>BFS</button>
        <button className="btn btn-secondary" onClick={() => { setHighlighted([]); setStatus('Choose a traversal') }}>Reset</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder: Left → Root → Right  (gives sorted order for BST)
def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Preorder: Root → Left → Right  (useful for copying tree)
def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# BFS / Level order
from collections import deque
def bfs(root):
    if not root: return []
    q, result = deque([root]), []
    while q:
        node = q.popleft()
        result.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return result

# Height of tree
def height(root):
    if not root: return 0
    return 1 + max(height(root.left), height(root.right))

# BST Insert
def insert(root, val):
    if not root: return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root`,
  JavaScript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Inorder: Left → Root → Right
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// BFS / Level order
function bfs(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// Height of tree
function height(root) {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}`,
  'C++': `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// Inorder
void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}

// BFS
vector<int> bfs(TreeNode* root) {
    if (!root) return {};
    queue<TreeNode*> q;
    q.push(root);
    vector<int> res;
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        res.push_back(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return res;
}

// Height
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}`,
}

const problems = [
  { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', desc: 'Find the maximum depth (height) of a binary tree.', hint: 'Recursively compute: depth = 1 + max(depth(left), depth(right)). Base case: null node returns 0.', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { title: 'Validate BST', difficulty: 'Medium', desc: 'Determine if a binary tree is a valid binary search tree.', hint: 'Pass min/max bounds during recursion. Left subtree values must be < node val, right subtree > node val. Check bounds at each node.', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', desc: 'Find the lowest common ancestor of two nodes in a BST.', hint: 'In a BST: if both nodes are less than root, go left. If both are greater, go right. Otherwise root is the LCA.', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', desc: 'Return the level order traversal as a list of lists.', hint: 'BFS with a queue. At each level, know the queue size (= number of nodes at this level) and process exactly that many nodes.', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', desc: 'Design an algorithm to serialize and deserialize a binary tree.', hint: 'Use preorder traversal with null markers. Serialize to string, deserialize by splitting and rebuilding recursively using a queue/index.', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
]

export default function Trees() {
  return (
    <div className="content">
      <TopicHeader topic="trees" title="🌳 Trees" subtitle="Hierarchical structure with a root node and child nodes. BST gives O(log n) search in balanced trees." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>BST Property</strong> — Left child &lt; parent &lt; right child. Enables O(log n) operations.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Inorder</strong> — Left→Root→Right. Gives sorted output for BST.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Preorder</strong> — Root→Left→Right. Useful for copying trees.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Postorder</strong> — Left→Right→Root. Useful for deletion/evaluation.</li>
          <li><strong style={{ color: 'var(--blue)' }}>BFS (Level Order)</strong> — Visit nodes level by level using a queue.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Height/Depth</strong> — Height = longest path from root to leaf. Balanced tree has O(log n) height.</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Tree Traversal Animation</h2>
        <p style={{ marginBottom: 12 }}>BST with values: 2, 4, 6, 8, 10, 12, 14. Nodes highlight in traversal order.</p>
        <TreeViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity (Balanced BST)</h2>
        <table className="complexity-table">
          <thead><tr><th>Operation</th><th>Balanced</th><th>Unbalanced (worst)</th></tr></thead>
          <tbody>
            <tr><td>Search</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
            <tr><td>Insert</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
            <tr><td>Delete</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
            <tr><td>Traversal</td><td className="on">O(n)</td><td className="on">O(n)</td></tr>
            <tr><td>Height</td><td className="ologn">O(log n)</td><td className="on">O(n)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="trees" />
      </div>
    </div>
  )
}
