import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

// ─── Fibonacci DP Table Visualization ────────────────────────────────────────
function FibDPViz() {
  const N = 9 // dp[0..8]
  const fibValues = [0, 1, 1, 2, 3, 5, 8, 13, 21]

  const [step, setStep] = useState(-1) // -1 = not started, 0..N-1 = filled up to this index
  const [status, setStatus] = useState('Press "Step" to start filling the DP table.')

  function handleStep() {
    const next = step + 1
    if (next >= N) {
      setStatus('DP table fully filled! dp[8] = 21. All values computed bottom-up.')
      return
    }
    setStep(next)
    if (next === 0) {
      setStatus('Base case: dp[0] = 0 (0th Fibonacci number is 0)')
    } else if (next === 1) {
      setStatus('Base case: dp[1] = 1 (1st Fibonacci number is 1)')
    } else {
      setStatus(
        `dp[${next}] = dp[${next - 1}] + dp[${next - 2}] = ${fibValues[next - 1]} + ${fibValues[next - 2]} = ${fibValues[next]}`
      )
    }
  }

  function handleReset() {
    setStep(-1)
    setStatus('Press "Step" to start filling the DP table.')
  }

  const isDone = step >= N - 1

  return (
    <div className="viz-container">
      {/* Index labels */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 2 }}>
        {Array.from({ length: N }, (_, i) => (
          <div
            key={i}
            style={{
              width: 48,
              textAlign: 'center',
              fontSize: '0.7rem',
              color: 'var(--text2)',
              fontFamily: 'monospace',
            }}
          >
            n={i}
          </div>
        ))}
      </div>

      {/* DP boxes */}
      <div className="viz-boxes" style={{ gap: 6 }}>
        {Array.from({ length: N }, (_, i) => {
          const filled = i <= step
          const isCurrent = i === step
          let cls = ''
          if (isCurrent && !isDone) cls = 'highlight'
          else if (filled && isDone) cls = 'found'
          else if (filled) cls = 'comparing'
          return (
            <div key={i} className={`viz-box ${cls}`} style={{ width: 48, flexShrink: 0 }}>
              {filled ? fibValues[i] : '?'}
            </div>
          )
        })}
      </div>

      {/* dp[n] label */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 2, marginBottom: 8 }}>
        {Array.from({ length: N }, (_, i) => (
          <div
            key={i}
            style={{
              width: 48,
              textAlign: 'center',
              fontSize: '0.68rem',
              color: 'var(--text2)',
              fontFamily: 'monospace',
            }}
          >
            dp[{i}]
          </div>
        ))}
      </div>

      {/* Formula display */}
      {step >= 2 && (
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            color: 'var(--accent)',
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          Recurrence: dp[n] = dp[n-1] + dp[n-2]
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text2)',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <span>
          <span style={{ color: 'var(--accent)' }}>■</span> Current cell
        </span>
        <span>
          <span style={{ color: 'var(--yellow)' }}>■</span> Filled
        </span>
        <span>
          <span style={{ color: 'var(--green)' }}>■</span> Complete
        </span>
        <span style={{ color: 'var(--text2)' }}>? = not yet computed</span>
      </div>

      <div className="viz-controls">
        <button className="btn btn-primary" onClick={handleStep} disabled={isDone}>
          Step →
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className={`viz-status${isDone ? ' success' : ' info'}`}>{status}</div>
    </div>
  )
}

// ─── Code Examples ────────────────────────────────────────────────────────────
const codes = {
  Python: `# ── 1. Fibonacci ──────────────────────────────────────

# Naive recursion — O(2^n) time, lots of repeated work!
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# Top-down: Memoization — O(n) time, O(n) space
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]         # cache hit
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Bottom-up: Tabulation — O(n) time, O(n) space
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]   # recurrence
    return dp[n]

# Space-optimised — O(n) time, O(1) space
def fib_opt(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


# ── 2. Coin Change (bottom-up DP) ─────────────────────
# Minimum coins to make amount.  State: dp[i] = min coins for amount i
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0                             # base case: 0 coins for amount 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# Example
print(coin_change([1, 5, 6, 9], 11))  # 2  (5+6)


# ── 3. Longest Common Subsequence (2D DP) ─────────────
# State: dp[i][j] = LCS length for text1[:i] and text2[:j]
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1   # characters match
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"))  # 3`,

  JavaScript: `// ── 1. Fibonacci ──────────────────────────────────────

// Naive recursion — O(2^n) time
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-down: Memoization — O(n) time, O(n) space
function fibMemo(n, memo = new Map()) {
  if (memo.has(n)) return memo.get(n);  // cache hit
  if (n <= 1) return n;
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Bottom-up: Tabulation — O(n) time, O(n) space
function fibTab(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];   // recurrence relation
  }
  return dp[n];
}


// ── 2. Coin Change (bottom-up DP) ─────────────────────
// State: dp[i] = minimum coins to make amount i
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                           // base case
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 5, 6, 9], 11));  // 2  (5+6)


// ── 3. Longest Common Subsequence (2D DP) ─────────────
// State: dp[i][j] = LCS of text1.slice(0,i) and text2.slice(0,j)
function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;   // match
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

console.log(lcs("abcde", "ace"));  // 3`,

  'C++': `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <unordered_map>
using namespace std;

// ── 1. Fibonacci ──────────────────────────────────────

// Naive — O(2^n)
int fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoization — O(n) time, O(n) space
unordered_map<int, long long> memo;
long long fibMemo(int n) {
    if (memo.count(n)) return memo[n];
    if (n <= 1) return n;
    return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
}

// Tabulation — O(n) time, O(n) space
long long fibTab(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];  // recurrence
    return dp[n];
}


// ── 2. Coin Change (bottom-up DP) ─────────────────────
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;                          // base case
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] != INT_MAX)
                dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}


// ── 3. Longest Common Subsequence (2D DP) ─────────────
int lcs(string& text1, string& text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;   // match
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
}

// ─── Practice Problems ────────────────────────────────────────────────────────
const problems = [
  {
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    desc: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    hint: 'This is exactly Fibonacci! Let dp[i] = number of ways to reach step i. dp[i] = dp[i-1] + dp[i-2] because you can arrive from step i-1 (1 step) or step i-2 (2 steps). Base cases: dp[1]=1, dp[2]=2.',
    link: 'https://leetcode.com/problems/climbing-stairs/',
  },
  {
    title: 'Coin Change',
    difficulty: 'Medium',
    desc: 'Given an array of coin denominations and a target amount, return the fewest number of coins needed to make up that amount. Return -1 if it is not possible.',
    hint: 'Build dp[0..amount] where dp[i] = min coins for amount i. dp[0]=0 (base). For each amount i, try every coin: dp[i] = min(dp[i], dp[i-coin]+1). Process amounts in increasing order so sub-problems are ready.',
    link: 'https://leetcode.com/problems/coin-change/',
  },
  {
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    desc: 'Given two strings, return the length of their longest common subsequence. A subsequence does not need to be contiguous.',
    hint: 'Use a 2D dp table. dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If characters match: dp[i][j] = dp[i-1][j-1]+1. Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Fill row by row.',
    link: 'https://leetcode.com/problems/longest-common-subsequence/',
  },
  {
    title: 'House Robber',
    difficulty: 'Medium',
    desc: 'Rob houses along a street — adjacent houses have alarms. Maximise the amount you can rob without triggering alarms (cannot rob two adjacent houses).',
    hint: 'dp[i] = max money robbing up to house i. Two choices at each house: rob it (dp[i-2] + nums[i]) or skip it (dp[i-1]). dp[i] = max of both. Only need last two values, so O(1) space is possible.',
    link: 'https://leetcode.com/problems/house-robber/',
  },
  {
    title: '0/1 Knapsack',
    difficulty: 'Hard',
    desc: 'Given items with weights and values, fill a knapsack of capacity W to maximise total value. Each item can be used at most once.',
    hint: 'dp[i][w] = max value using first i items with capacity w. If item i fits: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]). Otherwise: dp[i][w] = dp[i-1][w]. Can optimise to 1D by iterating capacity backwards.',
    link: 'https://leetcode.com/problems/ones-and-zeroes/',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DynamicProgramming() {
  return (
    <div className="content">
      <TopicHeader
        topic="dp"
        title="🔄 Dynamic Programming"
        subtitle="Break hard problems into overlapping sub-problems. Solve each once, store the result, and build toward the answer."
        hasQuiz={true}
      />

      {/* ── Core Concepts ── */}
      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Overlapping Sub-problems</strong> — The same
            smaller problem is solved many times. DP caches each answer so we never repeat work.
            (e.g., fib(3) appears in fib(5) and fib(4).)
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Optimal Substructure</strong> — An optimal
            solution to the whole problem can be built from optimal solutions to its sub-problems.
            This is what makes DP correct, not just fast.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>State</strong> — The minimal information needed
            to describe a sub-problem. For Fibonacci: just the index n. For Coin Change: the remaining
            amount. Choosing state well is the core DP design skill.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Recurrence Relation</strong> — The equation that
            expresses a state in terms of smaller states. For Fibonacci:{' '}
            <code style={{ color: 'var(--accent)' }}>dp[n] = dp[n-1] + dp[n-2]</code>. Write the
            recurrence before writing any code.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Top-down (Memoization)</strong> — Recurse
            naturally but cache results in a hash map or array. Easy to write; uses call-stack space.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Bottom-up (Tabulation)</strong> — Fill a table
            from the smallest sub-problem upward. No recursion, no call-stack risk, often faster in
            practice.
          </li>
        </ul>

        <div
          style={{
            marginTop: 16,
            background: 'var(--bg2)',
            borderLeft: '3px solid var(--accent)',
            padding: '10px 16px',
            borderRadius: 6,
            fontSize: '0.85rem',
            color: 'var(--text2)',
          }}
        >
          <strong style={{ color: 'var(--text)' }}>DP Recipe:</strong> (1) Define the state.
          (2) Write the recurrence. (3) Identify base cases. (4) Decide top-down or bottom-up.
          (5) Optimise space if needed.
        </div>
      </div>

      {/* ── Visualization ── */}
      <div className="card">
        <h2>🎬 Fibonacci DP Table — Step Through It</h2>
        <p style={{ marginBottom: 4, fontSize: '0.88rem', color: 'var(--text2)' }}>
          Watch how bottom-up DP fills the table from left to right. Each cell uses the two cells
          before it — that is the recurrence{' '}
          <code style={{ color: 'var(--accent)' }}>dp[n] = dp[n-1] + dp[n-2]</code>. No cell is
          ever recomputed.
        </p>
        <FibDPViz />
      </div>

      {/* ── How to approach DP problems ── */}
      <div className="card">
        <h2>🧠 How to Think About DP Problems</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            {
              step: '1',
              label: 'Recognise DP',
              body: 'Problem asks for a count, maximum, minimum, or yes/no over a set of choices. Sub-problems repeat.',
            },
            {
              step: '2',
              label: 'Define State',
              body: 'Ask: "What changes between sub-problems?" Use index, remaining capacity, last choice, etc.',
            },
            {
              step: '3',
              label: 'Write Recurrence',
              body: 'Express dp[state] using smaller states. Think of the last decision made and branch on it.',
            },
            {
              step: '4',
              label: 'Base Cases',
              body: 'What are the smallest sub-problems you can answer directly without recursion?',
            },
            {
              step: '5',
              label: 'Code It Up',
              body: 'Start with top-down (memoization) — it is easier to get right. Convert to bottom-up for speed.',
            },
            {
              step: '6',
              label: 'Optimise Space',
              body: 'If dp[i] only depends on dp[i-1] and dp[i-2], you only need two variables, not an array.',
            },
          ].map(({ step, label, body }) => (
            <div
              key={step}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginBottom: 4,
                }}
              >
                Step {step}: {label}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Code Examples ── */}
      <div className="card">
        <h2>💻 Code Examples</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 12 }}>
          Three classic DP problems: Fibonacci (1D), Coin Change (1D unbounded), and LCS (2D).
        </p>
        <CodeBlock codes={codes} />
      </div>

      {/* ── Complexity Table ── */}
      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Approach</th>
              <th>Time</th>
              <th>Space</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fibonacci — naive</td>
              <td>Recursion</td>
              <td className="on2" style={{ color: 'var(--accent)' }}>
                O(2ⁿ)
              </td>
              <td className="on">O(n)</td>
              <td>Exponential — recomputes same values millions of times</td>
            </tr>
            <tr>
              <td>Fibonacci — memo</td>
              <td>Top-down DP</td>
              <td className="on">O(n)</td>
              <td className="on">O(n)</td>
              <td>Each sub-problem computed exactly once</td>
            </tr>
            <tr>
              <td>Fibonacci — tabulation</td>
              <td>Bottom-up DP</td>
              <td className="on">O(n)</td>
              <td className="o1">O(1)*</td>
              <td>*Space-optimised variant uses only two variables</td>
            </tr>
            <tr>
              <td>Coin Change</td>
              <td>Bottom-up DP</td>
              <td className="on2">O(n × k)</td>
              <td className="on">O(n)</td>
              <td>n = amount, k = number of coin types</td>
            </tr>
            <tr>
              <td>Longest Common Subsequence</td>
              <td>Bottom-up 2D DP</td>
              <td className="on2">O(n × m)</td>
              <td className="on2">O(n × m)</td>
              <td>n, m = lengths of the two strings</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Top-down vs Bottom-up ── */}
      <div className="card">
        <h2>🔀 Top-down vs Bottom-up</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--blue)', marginBottom: 8 }}>
              Top-down (Memoization)
            </div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text2)', paddingLeft: 16, margin: 0 }}>
              <li>Write a recursive function</li>
              <li>Add a cache (dict / array)</li>
              <li>Return cached value if already computed</li>
              <li>Easier to map from recurrence</li>
              <li>Uses call stack — risk of stack overflow for large n</li>
              <li>Only computes needed sub-problems</li>
            </ul>
          </div>
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>
              Bottom-up (Tabulation)
            </div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text2)', paddingLeft: 16, margin: 0 }}>
              <li>Fill a table from smallest sub-problem</li>
              <li>No recursion, no stack overhead</li>
              <li>Often faster due to cache locality</li>
              <li>Must determine the right iteration order</li>
              <li>Computes all sub-problems (even unused)</li>
              <li>Easier to optimise space</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Practice Problems ── */}
      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} />
      </div>
    </div>
  )
}
