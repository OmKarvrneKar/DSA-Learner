import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

// ─── Subsets Visualization ───────────────────────────────────────────────────
function SubsetsViz() {
  const INPUT = [1, 2, 3]

  // Pre-compute all subsets in backtracking order (depth-first, left=include, right=skip)
  function generateAllSubsets() {
    const result = []
    function bt(index, current) {
      result.push([...current])
      for (let i = index; i < INPUT.length; i++) {
        current.push(INPUT[i])
        bt(i + 1, current)
        current.pop()
      }
    }
    bt(0, [])
    return result
  }

  const ALL_SUBSETS = generateAllSubsets()

  const [step, setStep] = useState(0)
  const [found, setFound] = useState([ALL_SUBSETS[0]])

  const currentSubset = ALL_SUBSETS[Math.min(step, ALL_SUBSETS.length - 1)]
  const isDone = step >= ALL_SUBSETS.length - 1

  function handleStep() {
    if (isDone) return
    const nextStep = step + 1
    setStep(nextStep)
    setFound(ALL_SUBSETS.slice(0, nextStep + 1))
  }

  function handleReset() {
    setStep(0)
    setFound([ALL_SUBSETS[0]])
  }

  return (
    <div className="viz-container">
      <p style={{ marginBottom: '0.75rem', color: 'var(--text2)', fontSize: '0.9rem' }}>
        Backtracking generates each subset by deciding — for each element — whether to <strong>include</strong> or <strong>skip</strong> it, then backtracking to explore both paths.
      </p>

      {/* Input array */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text2)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Input array:</span>
        <div className="viz-boxes">
          {INPUT.map((val, i) => (
            <div
              key={i}
              className={`viz-box ${currentSubset.includes(val) ? 'highlight' : ''}`}
              style={{ position: 'relative' }}
            >
              {val}
              <span style={{ fontSize: '0.65rem', color: 'var(--text2)', position: 'absolute', bottom: '-1.2rem', left: '50%', transform: 'translateX(-50%)' }}>
                [{i}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current subset being built */}
      <div style={{ margin: '1.8rem 0 1rem' }}>
        <span style={{ color: 'var(--text2)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
          Current subset (step {step + 1} / {ALL_SUBSETS.length}):
        </span>
        <div className="viz-boxes">
          {currentSubset.length === 0 ? (
            <div className="viz-box found" style={{ minWidth: '3rem' }}>∅</div>
          ) : (
            currentSubset.map((val, i) => (
              <div key={i} className="viz-box found">{val}</div>
            ))
          )}
        </div>
      </div>

      {/* Recursion tree hint */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.82rem',
        color: 'var(--text2)',
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}>
{`bt([], 0)
 ├─ include 1 → bt([1], 1)
 │   ├─ include 2 → bt([1,2], 2)
 │   │   ├─ include 3 → bt([1,2,3], 3) ✓
 │   │   └─ skip  3 → bt([1,2],  3) ✓
 │   └─ skip  2 → bt([1],  2)
 │       ├─ include 3 → bt([1,3], 3) ✓
 │       └─ skip  3 → bt([1],   3) ✓
 └─ skip  1 → bt([], 1)
     ├─ include 2 → bt([2], 2)  ...
     └─ skip  2 → bt([], 2)     ...`}
      </div>

      {/* Controls */}
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={handleStep} disabled={isDone}>
          Step →
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text2)' }}>
          {isDone ? '✅ All 8 subsets generated!' : `${ALL_SUBSETS.length - step - 1} subsets remaining`}
        </span>
      </div>

      {/* Subsets found so far */}
      <div style={{ marginTop: '1.25rem' }}>
        <span style={{ color: 'var(--text2)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
          Subsets found so far ({found.length}):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {found.map((subset, i) => (
            <span
              key={i}
              style={{
                background: i === found.length - 1 ? 'var(--accent)' : 'var(--bg2)',
                color: i === found.length - 1 ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                transition: 'background 0.3s',
              }}
            >
              [{subset.join(', ')}]
            </span>
          ))}
        </div>
      </div>

      {isDone && (
        <div className="viz-status success" style={{ marginTop: '1rem' }}>
          Power set complete! 2³ = 8 subsets generated via backtracking.
        </div>
      )}
    </div>
  )
}

// ─── Code snippets ────────────────────────────────────────────────────────────
const codes = {
  Python: `# ── Subsets (Power Set) ──────────────────────────────────
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])          # record every subset
        for i in range(start, len(nums)):
            current.append(nums[i])        # choose
            backtrack(i + 1, current)      # explore
            current.pop()                  # un-choose (backtrack)
    backtrack(0, [])
    return result

# ── Permutations ──────────────────────────────────────────
def permute(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, num in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(num)
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result

# ── N-Queens (compact) ────────────────────────────────────
def solveNQueens(n):
    result, cols, diag1, diag2 = [], set(), set(), set()
    board = [['.' ] * n for _ in range(n)]

    def bt(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue                   # prune invalid branches
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            board[row][col] = 'Q'
            bt(row + 1)
            board[row][col] = '.'
            cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)

    bt(0)
    return result`,

  JavaScript: `// ── Subsets (Power Set) ──────────────────────────────────
function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);             // record every subset
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);               // choose
      backtrack(i + 1, current);           // explore
      current.pop();                       // un-choose (backtrack)
    }
  }
  backtrack(0, []);
  return result;
}

// ── Permutations ──────────────────────────────────────────
function permute(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);
  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }
  backtrack([]);
  return result;
}

// ── N-Queens (compact) ────────────────────────────────────
function solveNQueens(n) {
  const result = [], cols = new Set(), d1 = new Set(), d2 = new Set();
  const board = Array.from({ length: n }, () => Array(n).fill('.'));

  function bt(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || d1.has(row - col) || d2.has(row + col)) continue;
      cols.add(col); d1.add(row - col); d2.add(row + col);
      board[row][col] = 'Q';
      bt(row + 1);
      board[row][col] = '.';
      cols.delete(col); d1.delete(row - col); d2.delete(row + col);
    }
  }
  bt(0);
  return result;
}`,

  'C++': `// ── Subsets (Power Set) ──────────────────────────────────
class Solution {
    void backtrack(vector<int>& nums, int start,
                   vector<int>& cur, vector<vector<int>>& res) {
        res.push_back(cur);                // record every subset
        for (int i = start; i < nums.size(); i++) {
            cur.push_back(nums[i]);        // choose
            backtrack(nums, i + 1, cur, res); // explore
            cur.pop_back();                // un-choose (backtrack)
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> cur;
        backtrack(nums, 0, cur, res);
        return res;
    }
};

// ── Permutations ──────────────────────────────────────────
class Solution {
    void bt(vector<int>& nums, vector<bool>& used,
            vector<int>& path, vector<vector<int>>& res) {
        if (path.size() == nums.size()) { res.push_back(path); return; }
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true; path.push_back(nums[i]);
            bt(nums, used, path, res);
            path.pop_back(); used[i] = false;
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> res; vector<int> path;
        vector<bool> used(nums.size(), false);
        bt(nums, used, path, res);
        return res;
    }
};

// ── N-Queens (compact) ────────────────────────────────────
class Solution {
    int n; vector<vector<string>> res;
    unordered_set<int> cols, d1, d2;
    void bt(vector<string>& board, int row) {
        if (row == n) { res.push_back(board); return; }
        for (int col = 0; col < n; col++) {
            if (cols.count(col) || d1.count(row-col) || d2.count(row+col)) continue;
            cols.insert(col); d1.insert(row-col); d2.insert(row+col);
            board[row][col] = 'Q';
            bt(board, row + 1);
            board[row][col] = '.';
            cols.erase(col); d1.erase(row-col); d2.erase(row+col);
        }
    }
public:
    vector<vector<string>> solveNQueens(int n) {
        this->n = n;
        vector<string> board(n, string(n, '.'));
        bt(board, 0);
        return res;
    }
};`,
}

// ─── Problems ─────────────────────────────────────────────────────────────────
const problems = [
  {
    title: 'Subsets',
    difficulty: 'Medium',
    desc: 'Return all possible subsets (the power set) of a given integer array with no duplicate subsets.',
    hint: 'Backtrack from each index, appending the current path to results at every call. No base-case check needed — every call state is a valid subset.',
    link: 'https://leetcode.com/problems/subsets/',
  },
  {
    title: 'Permutations',
    difficulty: 'Medium',
    desc: 'Given an array of distinct integers, return all possible permutations.',
    hint: 'Use a boolean "used" array to track which elements are already in the current path. When path length equals nums length, record it.',
    link: 'https://leetcode.com/problems/permutations/',
  },
  {
    title: 'Combination Sum',
    difficulty: 'Medium',
    desc: 'Find all unique combinations of candidates that sum to a target. Numbers may be reused.',
    hint: 'Pass the same index (not i+1) to allow reuse of the same element. Prune when the remaining target goes negative.',
    link: 'https://leetcode.com/problems/combination-sum/',
  },
  {
    title: 'N-Queens',
    difficulty: 'Hard',
    desc: 'Place n queens on an n×n chessboard so no two queens attack each other. Return all valid board configurations.',
    hint: 'Track occupied columns and both diagonal sets (row-col and row+col). Skip any column that would cause an attack — this is the pruning step.',
    link: 'https://leetcode.com/problems/n-queens/',
  },
  {
    title: 'Word Search',
    difficulty: 'Medium',
    desc: 'Given a 2-D board of letters, determine if a target word exists by traversing adjacent (up/down/left/right) cells without revisiting.',
    hint: 'Start DFS from every cell matching word[0]. Mark cells visited by temporarily overwriting them, then restore on backtrack.',
    link: 'https://leetcode.com/problems/word-search/',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Backtracking() {
  return (
    <div className="content">
      <TopicHeader
        topic="backtracking"
        title="🔙 Backtracking"
        subtitle="Explore all possibilities by building candidates incrementally and abandoning a path the moment it cannot lead to a valid solution."
        hasQuiz={true}
      />

      {/* Core Concepts */}
      <div className="card">
        <h2>Core Concepts</h2>
        <p>
          Backtracking is a refined brute-force strategy. Instead of blindly trying every combination, it
          builds the solution one step at a time and <strong>prunes</strong> (cuts off) any partial candidate
          that is already invalid — avoiding entire subtrees of the search space.
        </p>

        <h3 style={{ marginTop: '1.25rem' }}>Backtracking vs Brute Force</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Aspect</th><th>Brute Force</th><th>Backtracking</th></tr>
            </thead>
            <tbody>
              <tr><td>Strategy</td><td>Generate all, then filter</td><td>Build incrementally, prune early</td></tr>
              <tr><td>Wasted work</td><td>Evaluates invalid states fully</td><td>Abandons invalid branches immediately</td></tr>
              <tr><td>Space</td><td>Stores all candidates</td><td>O(depth) call stack only</td></tr>
              <tr><td>Example</td><td>All length-n strings → filter valid</td><td>Build string, prune on constraint violation</td></tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '1.25rem' }}>The Backtracking Template</h3>
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.88rem',
          lineHeight: '1.7',
        }}>
          <span style={{ color: 'var(--accent)' }}>function</span> backtrack(state, choices):<br />
          &nbsp;&nbsp;<span style={{ color: 'var(--green)' }}>if</span> isGoal(state): record(state); <span style={{ color: 'var(--green)' }}>return</span><br />
          &nbsp;&nbsp;<span style={{ color: 'var(--green)' }}>for</span> choice <span style={{ color: 'var(--green)' }}>in</span> choices:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--green)' }}>if</span> isValid(choice): <span style={{ color: 'var(--text2)' }}>// ← pruning</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;makeChoice(state, choice)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backtrack(newState, remainingChoices)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;undoChoice(state, choice) <span style={{ color: 'var(--text2)' }}>// ← backtrack</span>
        </div>

        <h3 style={{ marginTop: '1.25rem' }}>Key Ideas</h3>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Recursion tree:</strong> each node is a partial candidate; leaves are complete solutions or dead ends.</li>
          <li><strong>Pruning:</strong> the <code>isValid</code> check eliminates entire subtrees — this is what separates backtracking from brute force.</li>
          <li><strong>State restoration:</strong> always undo the choice after the recursive call so the state is clean for the next iteration.</li>
          <li><strong>Classic use cases:</strong> subsets, permutations, combinations, constraint satisfaction (N-Queens, Sudoku), and grid-path problems.</li>
        </ul>
      </div>

      {/* Visualization */}
      <div className="card">
        <h2>Visualization — Subsets of [1, 2, 3]</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
          Press <strong>Step</strong> to generate one subset at a time. Highlighted (blue) boxes are included in the current subset.
        </p>
        <SubsetsViz />
      </div>

      {/* Complexity */}
      <div className="card">
        <h2>Time Complexity</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="complexity-table">
            <thead>
              <tr><th>Problem</th><th>Time</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Subsets</td>
                <td><span className="on2">O(2ⁿ)</span></td>
                <td>Each of n elements is either included or not → 2ⁿ subsets</td>
              </tr>
              <tr>
                <td>Permutations</td>
                <td><span className="on2">O(n!)</span></td>
                <td>n choices for 1st position, n-1 for 2nd, … → n!</td>
              </tr>
              <tr>
                <td>N-Queens</td>
                <td><span className="on2">O(n!)</span></td>
                <td>At most n choices per row, pruned by column/diagonal constraints</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginTop: '0.75rem' }}>
          Space complexity is O(n) for the recursion call stack in all three cases (excluding the output).
        </p>
      </div>

      {/* Code */}
      <div className="card">
        <h2>Code Examples</h2>
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
