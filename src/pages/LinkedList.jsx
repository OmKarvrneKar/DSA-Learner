import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

function LLViz() {
  const [nodes, setNodes] = useState([10, 20, 30, 40])
  const [highlight, setHighlight] = useState(null)
  const [newNode, setNewNode] = useState(null)
  const [status, setStatus] = useState('Linked list ready. Try operations below.')
  const [input, setInput] = useState('')

  function prepend() {
    const val = Number(input) || Math.floor(Math.random() * 90 + 10)
    setNewNode(0)
    setStatus(`Inserting ${val} at HEAD — O(1)`)
    setTimeout(() => {
      setNodes(n => [val, ...n])
      setNewNode(null)
      setHighlight(0)
      setStatus(`✅ ${val} inserted at head`)
      setTimeout(() => setHighlight(null), 1000)
    }, 700)
    setInput('')
  }

  function append() {
    const val = Number(input) || Math.floor(Math.random() * 90 + 10)
    const idx = nodes.length
    setStatus(`Traversing to tail to insert ${val} — O(n)`)
    let i = 0
    const interval = setInterval(() => {
      setHighlight(i)
      i++
      if (i > nodes.length) {
        clearInterval(interval)
        setNodes(n => [...n, val])
        setNewNode(idx)
        setStatus(`✅ ${val} appended at tail`)
        setTimeout(() => { setNewNode(null); setHighlight(null) }, 800)
      }
    }, 300)
    setInput('')
  }

  function deleteHead() {
    if (nodes.length === 0) return
    const removed = nodes[0]
    setHighlight(0)
    setStatus(`Removing HEAD node ${removed} — O(1)`)
    setTimeout(() => {
      setNodes(n => n.slice(1))
      setHighlight(null)
      setStatus(`✅ Head node ${removed} removed`)
    }, 700)
  }

  function search() {
    const val = Number(input)
    if (!val) { setStatus('Enter a value to search'); return }
    setStatus(`Searching for ${val}...`)
    let i = 0
    const interval = setInterval(() => {
      setHighlight(i)
      if (nodes[i] === val) {
        clearInterval(interval)
        setStatus(`✅ Found ${val} at index ${i}`)
        setTimeout(() => setHighlight(null), 1200)
        return
      }
      i++
      if (i >= nodes.length) {
        clearInterval(interval)
        setStatus(`❌ ${val} not found`)
        setHighlight(null)
      }
    }, 350)
    setInput('')
  }

  return (
    <div className="viz-container">
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, justifyContent: 'center' }}>
        {nodes.map((v, i) => (
          <div className="ll-node" key={i}>
            <div className={`ll-box${i === highlight ? ' highlight' : i === newNode ? ' new-node' : ''}`}>{v}</div>
            {i < nodes.length - 1 && <span className="ll-arrow">→</span>}
          </div>
        ))}
        {nodes.length > 0 && <><span className="ll-arrow">→</span><div className="ll-null">NULL</div></>}
        {nodes.length === 0 && <div className="ll-null">NULL (empty list)</div>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Value (optional)"
          style={{ width: 130, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.85rem' }}
        />
        <button className="btn btn-primary" onClick={prepend}>Prepend</button>
        <button className="btn btn-secondary" onClick={append}>Append</button>
        <button className="btn btn-secondary" onClick={deleteHead}>Del Head</button>
        <button className="btn btn-green" onClick={search}>Search</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, val):        # O(1)
        node = Node(val)
        node.next = self.head
        self.head = node

    def append(self, val):         # O(n)
        node = Node(val)
        if not self.head:
            self.head = node; return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def delete(self, val):         # O(n)
        if not self.head: return
        if self.head.val == val:
            self.head = self.head.next; return
        cur = self.head
        while cur.next:
            if cur.next.val == val:
                cur.next = cur.next.next; return
            cur = cur.next

    def reverse(self):             # O(n)
        prev, cur = None, self.head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        self.head = prev`,
  JavaScript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  prepend(val) {          // O(1)
    const node = new Node(val);
    node.next = this.head;
    this.head = node;
  }

  append(val) {           // O(n)
    const node = new Node(val);
    if (!this.head) { this.head = node; return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  reverse() {             // O(n)
    let prev = null, cur = this.head;
    while (cur) {
      const nxt = cur.next;
      cur.next = prev;
      prev = cur; cur = nxt;
    }
    this.head = prev;
  }
}`,
  'C++': `struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void prepend(int val) {     // O(1)
        Node* node = new Node(val);
        node->next = head;
        head = node;
    }

    void append(int val) {      // O(n)
        Node* node = new Node(val);
        if (!head) { head = node; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = node;
    }

    void reverse() {            // O(n)
        Node *prev = nullptr, *cur = head;
        while (cur) {
            Node* nxt = cur->next;
            cur->next = prev;
            prev = cur; cur = nxt;
        }
        head = prev;
    }
};`,
}

const problems = [
  { title: 'Reverse Linked List', difficulty: 'Easy', desc: 'Reverse a singly linked list iteratively and recursively.', hint: 'Use three pointers: prev, curr, next. Reassign curr.next = prev, then advance all three pointers forward.', link: 'https://leetcode.com/problems/reverse-linked-list/' },
  { title: 'Detect Cycle in Linked List', difficulty: 'Easy', desc: 'Given head of a linked list, determine if it has a cycle.', hint: "Floyd's cycle detection: use two pointers — slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.", link: 'https://leetcode.com/problems/linked-list-cycle/' },
  { title: 'Merge Two Sorted Lists', difficulty: 'Easy', desc: 'Merge two sorted linked lists and return the merged list.', hint: 'Use a dummy head node. Compare heads of both lists, attach the smaller one, and advance that pointer.', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { title: 'Remove Nth Node From End', difficulty: 'Medium', desc: 'Remove the nth node from the end of the list in one pass.', hint: 'Use two pointers. Move fast pointer n steps ahead, then move both until fast reaches the end. Slow pointer is now at the node before the target.', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { title: 'LRU Cache', difficulty: 'Hard', desc: 'Design a data structure that follows LRU cache eviction policy.', hint: 'Combine a HashMap (for O(1) lookup) with a doubly linked list (for O(1) insertion/deletion). Move accessed nodes to front.', link: 'https://leetcode.com/problems/lru-cache/' },
]

export default function LinkedList() {
  return (
    <div className="content">
      <TopicHeader topic="linked-list" title="🔗 Linked Lists" subtitle="Dynamic data structure where each node points to the next. No index-based access — traversal is key." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>Node</strong> — Contains data + a pointer to the next node.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Singly Linked</strong> — Each node has one pointer (next). <strong style={{ color: 'var(--blue)' }}>Doubly Linked</strong> — Each node has next + prev.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Prepend</strong> — O(1). <strong style={{ color: 'var(--blue)' }}>Append</strong> — O(n) unless tail pointer maintained.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Fast & Slow Pointers</strong> — Detect cycles, find middle, nth from end.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Reverse</strong> — Three pointers: prev, curr, next. Rewire one node at a time.</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Linked List Animation</h2>
        <p style={{ marginBottom: 12 }}>Watch how nodes are prepended (head insert), appended (tail insert), and deleted. Search traverses one node at a time.</p>
        <LLViz />
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
            <tr><td>Access by index</td><td className="on">O(n)</td><td>Must traverse from head</td></tr>
            <tr><td>Search</td><td className="on">O(n)</td><td>Linear traversal</td></tr>
            <tr><td>Insert at head</td><td className="o1">O(1)</td><td>Rewire head pointer</td></tr>
            <tr><td>Insert at tail</td><td className="on">O(n)</td><td>O(1) with tail pointer</td></tr>
            <tr><td>Delete head</td><td className="o1">O(1)</td><td>Move head to next</td></tr>
            <tr><td>Reverse</td><td className="on">O(n)</td><td>Traverse once</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="linked-list" />
      </div>
    </div>
  )
}
