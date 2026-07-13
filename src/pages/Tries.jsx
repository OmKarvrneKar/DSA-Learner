import { useState, useCallback } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

// ─── Trie Data Structure (JS, used for viz) ───────────────────────────────────
function createNode() {
  return { children: {}, isEnd: false }
}

function trieInsert(root, word) {
  let node = root
  for (const ch of word) {
    if (!node.children[ch]) node.children[ch] = createNode()
    node = node.children[ch]
  }
  node.isEnd = true
}

function trieSearch(root, word) {
  let node = root
  for (const ch of word) {
    if (!node.children[ch]) return false
    node = node.children[ch]
  }
  return node.isEnd
}

function trieStartsWith(root, prefix) {
  let node = root
  for (const ch of prefix) {
    if (!node.children[ch]) return false
    node = node.children[ch]
  }
  return true
}

// ─── Build initial trie ───────────────────────────────────────────────────────
function buildInitialTrie(words) {
  const root = createNode()
  for (const w of words) trieInsert(root, w)
  return root
}

const INITIAL_WORDS = ['cat', 'car', 'cap', 'bat']

// ─── SVG Trie Layout ──────────────────────────────────────────────────────────
function layoutTrie(root) {
  // BFS to assign x,y positions; returns array of {id, x, y, char, isEnd, parentId}
  const nodes = []
  const edges = []
  let idCounter = 0

  function dfs(node, depth, slot, totalSlots, parentId, char) {
    const id = idCounter++
    // x spread: map slot to [50, 750] range
    const x = totalSlots === 1 ? 400 : 80 + (slot / (totalSlots - 1)) * 640
    const y = 60 + depth * 80
    nodes.push({ id, x, y, char, isEnd: node.isEnd, parentId })

    const childKeys = Object.keys(node.children).sort()
    const n = childKeys.length
    childKeys.forEach((ch, i) => {
      const childId = dfs(node.children[ch], depth + 1, i, Math.max(n, 1), id, ch)
      edges.push({ from: id, to: childId, char: ch })
    })
    return id
  }

  // Root
  const rootId = idCounter++
  nodes.push({ id: rootId, x: 400, y: 60, char: '', isEnd: false, parentId: null })
  const childKeys = Object.keys(root.children).sort()
  const n = childKeys.length

  // Give a wide spread to root's children
  const spreadX = [100, 250, 400, 550, 700]
  childKeys.forEach((ch, i) => {
    const childX = n === 1 ? 400 : spreadX[Math.floor((spreadX.length - 1) * i / (n - 1))]
    assignSubtree(root.children[ch], 2, childX, 60 + 80, rootId, ch, 200 / Math.max(n, 1))
  })

  function assignSubtree(node, depth, cx, cy, parentId, char, spread) {
    const id = idCounter++
    nodes.push({ id, x: cx, y: cy, char, isEnd: node.isEnd, parentId })
    edges.push({ from: parentId, to: id, char })
    const childKeys = Object.keys(node.children).sort()
    const nc = childKeys.length
    childKeys.forEach((ch, i) => {
      const childX = nc === 1 ? cx : cx + (i - (nc - 1) / 2) * (spread * 1.2)
      assignSubtree(node.children[ch], depth + 1, childX, cy + 80, id, ch, spread * 0.7)
    })
  }

  return { nodes, edges }
}

// ─── Trie SVG Component ───────────────────────────────────────────────────────
function TrieSVG({ root, highlightPath = [], searchResult = null }) {
  const { nodes, edges } = layoutTrie(root)

  // Map node ids to node objects for lookup
  const nodeMap = {}
  nodes.forEach(n => { nodeMap[n.id] = n })

  const highlightSet = new Set(highlightPath)

  return (
    <svg
      viewBox="0 60 800 340"
      width="100%"
      style={{ maxHeight: 340, display: 'block', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}
    >
      {/* Edges */}
      {edges.map((e, i) => {
        const from = nodeMap[e.from]
        const to = nodeMap[e.to]
        if (!from || !to) return null
        const isHighlighted = highlightSet.has(e.to)
        return (
          <g key={i}>
            <line
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
            />
            {/* Edge label (character) */}
            <text
              x={(from.x + to.x) / 2 + 8}
              y={(from.y + to.y) / 2}
              fill={isHighlighted ? 'var(--accent)' : 'var(--text2)'}
              fontSize="13"
              fontFamily="monospace"
              fontWeight={isHighlighted ? 'bold' : 'normal'}
            >
              {e.char}
            </text>
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map(n => {
        const isHighlighted = highlightSet.has(n.id)
        const isRoot = n.parentId === null
        const isFoundEnd = isHighlighted && n.isEnd && searchResult === 'found'
        const isNotFoundEnd = isHighlighted && searchResult === 'not_found' && n === nodes[nodes.length - 1]

        let fill = 'var(--card)'
        let stroke = 'var(--border)'
        if (isRoot) { fill = 'var(--bg2)'; stroke = 'var(--text2)' }
        if (isHighlighted) { fill = 'var(--accent)'; stroke = 'var(--accent)' }
        if (isFoundEnd) { fill = 'var(--green)'; stroke = 'var(--green)' }

        return (
          <g key={n.id}>
            <circle
              cx={n.x} cy={n.y} r={18}
              fill={fill}
              stroke={stroke}
              strokeWidth={n.isEnd ? 3 : 1.5}
              strokeDasharray={n.isEnd ? '4 2' : 'none'}
            />
            {isRoot && (
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="var(--text2)" fontSize="11" fontFamily="monospace">root</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Trie Visualization ───────────────────────────────────────────────────────
function TrieViz() {
  const [words, setWords] = useState([...INITIAL_WORDS])
  const [root, setRoot] = useState(() => buildInitialTrie(INITIAL_WORDS))
  const [inputWord, setInputWord] = useState('')
  const [highlightPath, setHighlightPath] = useState([])
  const [status, setStatus] = useState({ type: 'info', msg: `Pre-built trie with: ${INITIAL_WORDS.join(', ')}. Insert or search a word.` })
  const [searchResult, setSearchResult] = useState(null)
  const [mode, setMode] = useState('insert') // 'insert' | 'search' | 'prefix'

  const getPathIds = useCallback((trieRoot, word) => {
    // Returns array of node IDs along the path for `word`
    // We need to redo the layout to get ids — instead we'll return the characters found
    // Actually: highlight path is tracked by walking root and collecting node references
    let node = trieRoot
    const path = []
    // The SVG layout assigns id=0 to root
    // We'll just highlight by character depth match — simpler: return chars found
    return []
  }, [])

  function handleInsert() {
    const w = inputWord.trim().toLowerCase()
    if (!w || !/^[a-z]+$/.test(w)) {
      setStatus({ type: 'info', msg: 'Please enter a valid lowercase word.' })
      return
    }
    if (words.includes(w)) {
      setStatus({ type: 'info', msg: `"${w}" is already in the trie.` })
      return
    }
    const newRoot = buildInitialTrie([...words, w])
    setRoot(newRoot)
    setWords(prev => [...prev, w])
    setHighlightPath([])
    setSearchResult(null)
    setStatus({ type: 'success', msg: `✅ Inserted "${w}" into the trie. Each character becomes a node.` })
    setInputWord('')
  }

  function handleSearch() {
    const w = inputWord.trim().toLowerCase()
    if (!w) { setStatus({ type: 'info', msg: 'Enter a word to search.' }); return }
    const found = trieSearch(root, w)
    setSearchResult(found ? 'found' : 'not_found')
    setStatus({
      type: found ? 'success' : 'info',
      msg: found
        ? `✅ "${w}" found in the trie! (isEnd = true at last node)`
        : `❌ "${w}" not found. ${trieStartsWith(root, w) ? `But prefix "${w}" exists.` : `Prefix doesn't exist either.`}`,
    })
  }

  function handleStartsWith() {
    const w = inputWord.trim().toLowerCase()
    if (!w) { setStatus({ type: 'info', msg: 'Enter a prefix to check.' }); return }
    const has = trieStartsWith(root, w)
    setStatus({
      type: has ? 'success' : 'info',
      msg: has
        ? `✅ Prefix "${w}" exists. Words: ${words.filter(wd => wd.startsWith(w)).join(', ')}`
        : `❌ No words start with "${w}".`,
    })
  }

  function handleReset() {
    const r = buildInitialTrie(INITIAL_WORDS)
    setRoot(r)
    setWords([...INITIAL_WORDS])
    setHighlightPath([])
    setSearchResult(null)
    setInputWord('')
    setStatus({ type: 'info', msg: `Reset to initial trie with: ${INITIAL_WORDS.join(', ')}.` })
  }

  return (
    <div className="viz-container">
      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Each circle is a trie node. <strong>Dashed border</strong> = word ends here (<code>isEnd = true</code>). Characters live on the <strong>edges</strong>, not inside nodes.
      </p>

      <TrieSVG root={root} highlightPath={highlightPath} searchResult={searchResult} />

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', margin: '0.75rem 0', fontSize: '0.82rem', color: 'var(--text2)' }}>
        <span><svg width="16" height="16" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="8" cy="8" r="7" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" /></svg>Regular node</span>
        <span><svg width="16" height="16" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="8" cy="8" r="7" fill="var(--card)" stroke="var(--border)" strokeWidth="2.5" strokeDasharray="3 2" /></svg>Word end (isEnd=true)</span>
        <span><svg width="16" height="16" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="8" cy="8" r="7" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.5" /></svg>Highlighted path</span>
      </div>

      {/* Words in trie */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Words in trie: </span>
        {words.map((w, i) => (
          <span key={i} style={{
            display: 'inline-block', margin: '0.15rem 0.3rem',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '5px', padding: '0.1rem 0.45rem',
            fontFamily: 'monospace', fontSize: '0.82rem',
          }}>{w}</span>
        ))}
      </div>

      {/* Controls */}
      <div className="viz-controls" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputWord}
          onChange={e => setInputWord(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
          onKeyDown={e => { if (e.key === 'Enter') { if (mode === 'insert') handleInsert(); else if (mode === 'search') handleSearch(); else handleStartsWith() } }}
          placeholder="type a word..."
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            width: '160px',
          }}
        />
        <button className={`btn ${mode === 'insert' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('insert'); handleInsert() }}>
          Insert
        </button>
        <button className={`btn ${mode === 'search' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('search'); handleSearch() }}>
          Search
        </button>
        <button className={`btn ${mode === 'prefix' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('prefix'); handleStartsWith() }}>
          StartsWith
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
      </div>

      <div className={`viz-status ${status.type}`} style={{ marginTop: '0.75rem' }}>
        {status.msg}
      </div>
    </div>
  )
}

// ─── Code snippets ────────────────────────────────────────────────────────────
const codes = {
  Python: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False          # marks a complete word

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:                    # walk / create nodes
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True                 # mark end of word

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end                 # must be a complete word

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True                        # prefix exists (word may not)

# ── Usage ─────────────────────────────────────────────────
trie = Trie()
for word in ["apple", "app", "apt", "bat", "ball"]:
    trie.insert(word)

print(trie.search("app"))        # True
print(trie.search("ap"))         # False (not a complete word)
print(trie.startsWith("ap"))     # True`,

  JavaScript: `class TrieNode {
  constructor() {
    this.children = {};          // char → TrieNode
    this.isEnd = false;          // marks a complete word
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {     // walk / create nodes
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;           // mark end of word
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;           // must be a complete word
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;                 // prefix exists
  }
}

// ── Usage ─────────────────────────────────────────────────
const trie = new Trie();
["apple","app","apt","bat","ball"].forEach(w => trie.insert(w));

console.log(trie.search("app"));       // true
console.log(trie.search("ap"));        // false
console.log(trie.startsWith("ap"));    // true`,

  'C++': `struct TrieNode {
    TrieNode* children[26]{};      // fixed 26-child array (a-z)
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx])
                node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isEnd;
    }

    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }
};

// ── Usage ─────────────────────────────────────────────────
// Trie t;
// for (auto& w : {"apple","app","apt","bat","ball"}) t.insert(w);
// t.search("app")      → true
// t.startsWith("ap")   → true`,
}

// ─── Problems ─────────────────────────────────────────────────────────────────
const problems = [
  {
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    desc: 'Implement a Trie with insert, search, and startsWith methods.',
    hint: 'Each node holds a children map (or array of 26) and an isEnd flag. Walk character by character, creating nodes as needed.',
    link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
  },
  {
    title: 'Word Search II',
    difficulty: 'Hard',
    desc: 'Given a board of letters and a list of words, find all words on the board using DFS.',
    hint: 'Build a Trie from the word list, then DFS the board. Prune branches not in the Trie. Remove found words from the Trie to avoid duplicates.',
    link: 'https://leetcode.com/problems/word-search-ii/',
  },
  {
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    desc: 'Support addWord and search where "." matches any letter.',
    hint: 'Standard Trie insert. For search, when you hit ".", recursively try all 26 children.',
    link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
  },
  {
    title: 'Longest Word in Dictionary',
    difficulty: 'Medium',
    desc: 'Find the longest word in the dictionary that can be built one character at a time by other words in the dictionary.',
    hint: 'Insert all words into a Trie. BFS/DFS the Trie, only following edges where the current node is a word end — every prefix must exist.',
    link: 'https://leetcode.com/problems/longest-word-in-dictionary/',
  },
  {
    title: 'Replace Words',
    difficulty: 'Medium',
    desc: 'Given a dictionary of roots, replace words in a sentence with their shortest root.',
    hint: 'Insert all roots into a Trie. For each word in the sentence, walk the Trie and return the prefix as soon as you hit an isEnd node.',
    link: 'https://leetcode.com/problems/replace-words/',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tries() {
  return (
    <div className="content">
      <TopicHeader
        topic="tries"
        title="🌲 Tries (Prefix Trees)"
        subtitle="A tree where each path from root to a node spells out a string prefix — enabling O(k) insert, search, and prefix lookup regardless of dictionary size."
        hasQuiz={true}
      />

      {/* Core Concepts */}
      <div className="card">
        <h2>Core Concepts</h2>
        <p>
          A <strong>Trie</strong> (from re<em>trie</em>val) stores strings by sharing common prefixes.
          Each node represents one character, and each path from the root to a marked node spells a complete word.
        </p>

        <h3 style={{ marginTop: '1.25rem' }}>Anatomy of a Trie Node</h3>
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '1rem', fontFamily: 'monospace',
          fontSize: '0.88rem', lineHeight: '1.7',
        }}>
          <span style={{ color: 'var(--accent)' }}>TrieNode</span> {'{'}<br />
          &nbsp;&nbsp;children: <span style={{ color: 'var(--yellow)' }}>Map&lt;char, TrieNode&gt;</span> &nbsp;<span style={{ color: 'var(--text2)' }}>// up to 26 entries for a–z</span><br />
          &nbsp;&nbsp;isEnd: <span style={{ color: 'var(--yellow)' }}>bool</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--text2)' }}>// true if a word ends here</span><br />
          {'}'}
        </div>

        <h3 style={{ marginTop: '1.25rem' }}>Why Tries Beat Hash Maps for Prefix Queries</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Operation</th><th>Hash Map</th><th>Trie</th></tr>
            </thead>
            <tbody>
              <tr><td>Exact search</td><td>O(k) avg</td><td>O(k)</td></tr>
              <tr><td>Prefix search</td><td>O(n × k) scan all keys</td><td className="ologn">O(k) — just walk the path</td></tr>
              <tr><td>Autocomplete</td><td>O(n × k)</td><td className="ologn">O(k + output)</td></tr>
              <tr><td>Sorted iteration</td><td>O(n log n)</td><td className="ologn">O(n) — DFS gives sorted order</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: '0.5rem' }}>
          k = length of the word/prefix, n = number of words in the dictionary.
        </p>

        <h3 style={{ marginTop: '1.25rem' }}>Use Cases</h3>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Autocomplete:</strong> type a prefix, DFS to collect all words below that node.</li>
          <li><strong>Spell check:</strong> search for word; if not found, suggest nearby words.</li>
          <li><strong>Word dictionary:</strong> O(k) insert and lookup, no hash collisions.</li>
          <li><strong>IP routing:</strong> longest prefix match in routing tables.</li>
          <li><strong>Word games:</strong> Boggle, Scrabble — quickly prune invalid board paths.</li>
        </ul>

        <h3 style={{ marginTop: '1.25rem' }}>Array vs HashMap for children</h3>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Array[26]:</strong> O(1) child lookup, wastes space if alphabet is sparse.</li>
          <li><strong>HashMap:</strong> memory-efficient for large/variable alphabets (Unicode).</li>
        </ul>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>Visualization — Interactive Trie</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
          Type a word and press <strong>Insert</strong> to add it, <strong>Search</strong> to check exact match, or <strong>StartsWith</strong> to check a prefix.
        </p>
        <TrieViz />
      </div>

      {/* Complexity */}
      <div className="card">
        <h2>Time &amp; Space Complexity</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Operation</th><th>Time</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td>insert(word)</td><td><span className="ologn">O(k)</span></td><td>k = word length; one node per character</td></tr>
              <tr><td>search(word)</td><td><span className="ologn">O(k)</span></td><td>Walk k edges, check isEnd at last node</td></tr>
              <tr><td>startsWith(prefix)</td><td><span className="ologn">O(k)</span></td><td>Walk k edges — no isEnd check needed</td></tr>
              <tr><td>Space</td><td><span className="on">O(n × k)</span></td><td>n words, average length k; shared prefixes reduce actual usage</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code */}
      <div className="card">
        <h2>Code — TrieNode + insert / search / startsWith</h2>
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
