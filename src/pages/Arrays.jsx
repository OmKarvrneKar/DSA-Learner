import { useState, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import ProblemList from '../components/ProblemList'
import TopicHeader from '../components/TopicHeader'

const INIT = [3, 7, 1, 9, 4, 6, 2, 8, 5]

function BinarySearchViz() {
  const [arr] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [target, setTarget] = useState(6)
  const [state, setState] = useState({ lo: null, hi: null, mid: null, found: null, done: false })
  const [status, setStatus] = useState('Enter a target number and press Search')
  const stepRef = useRef({ lo: 0, hi: 8, done: false })

  function reset() {
    stepRef.current = { lo: 0, hi: arr.length - 1, done: false }
    setState({ lo: null, hi: null, mid: null, found: null, done: false })
    setStatus('Press "Step" to step through binary search')
  }

  function step() {
    const s = stepRef.current
    if (s.done) { setStatus('Search complete. Press Reset to start again.'); return }
    if (s.lo > s.hi) {
      setState(prev => ({ ...prev, done: true, found: -1 }))
      setStatus(`❌ ${target} not found in array`)
      stepRef.current.done = true
      return
    }
    const mid = Math.floor((s.lo + s.hi) / 2)
    setState({ lo: s.lo, hi: s.hi, mid, found: null, done: false })
    if (arr[mid] === target) {
      setState({ lo: s.lo, hi: s.hi, mid, found: mid, done: true })
      setStatus(`✅ Found ${target} at index ${mid}!`)
      stepRef.current.done = true
    } else if (arr[mid] < target) {
      setStatus(`arr[${mid}]=${arr[mid]} < ${target}, search RIGHT half`)
      stepRef.current.lo = mid + 1
    } else {
      setStatus(`arr[${mid}]=${arr[mid]} > ${target}, search LEFT half`)
      stepRef.current.hi = mid - 1
    }
  }

  return (
    <div className="viz-container">
      <div className="viz-boxes">
        {arr.map((v, i) => {
          const { lo, hi, mid, found } = state
          let cls = ''
          if (found === i) cls = 'found'
          else if (mid === i) cls = 'highlight'
          else if (lo !== null && hi !== null && (i < lo || i > hi)) cls = ''
          else if (lo !== null && hi !== null) cls = 'comparing'
          return <div key={i} className={`viz-box ${cls}`}>{v}</div>
        })}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text2)', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>🔴 Mid</span><span>🟡 Search space</span><span>🟢 Found</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="number" min={1} max={9} value={target}
          onChange={e => { setTarget(Number(e.target.value)); reset() }}
          style={{ width: 60, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.9rem' }}
        />
        <button className="btn btn-primary" onClick={step}>Step →</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <div className={`viz-status${state.found !== null ? ' success' : state.done ? '' : ' info'}`}>{status}</div>
    </div>
  )
}

function TwoPointerViz() {
  const arr = [1, 2, 3, 4, 6, 8, 9]
  const target = 10
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(arr.length - 1)
  const [status, setStatus] = useState(`Find two numbers that sum to ${target}`)
  const [found, setFound] = useState(false)
  const [done, setDone] = useState(false)

  function step() {
    if (done) { setStatus('Press Reset to start again'); return }
    const sum = arr[left] + arr[right]
    if (sum === target) {
      setStatus(`✅ Found! arr[${left}]=${arr[left]} + arr[${right}]=${arr[right]} = ${target}`)
      setFound(true); setDone(true)
    } else if (sum < target) {
      setStatus(`Sum ${sum} < ${target}, move LEFT pointer right`)
      setLeft(l => l + 1)
    } else {
      setStatus(`Sum ${sum} > ${target}, move RIGHT pointer left`)
      setRight(r => r - 1)
    }
    if (left >= right - 1 && sum !== target) { setDone(true); setStatus(`No pair found`) }
  }

  function reset() { setLeft(0); setRight(arr.length - 1); setStatus(`Find two numbers that sum to ${target}`); setFound(false); setDone(false) }

  return (
    <div className="viz-container">
      <div className="viz-boxes">
        {arr.map((v, i) => (
          <div key={i} className={`viz-box${i === left ? ' highlight' : i === right ? ' highlight' : found && (i === left || i === right) ? ' found' : ''}`}>
            {v}
            {i === left && <div style={{ fontSize: '0.6rem', position: 'absolute', bottom: -18, color: 'var(--accent)' }}>L</div>}
            {i === right && <div style={{ fontSize: '0.6rem', position: 'absolute', bottom: -18, color: 'var(--accent)' }}>R</div>}
          </div>
        ))}
      </div>
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={step}>Step →</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <div className={`viz-status${found ? ' success' : ' info'}`}>{status}</div>
    </div>
  )
}

const codes = {
  Python: `# Binary Search
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid      # Found!
        elif arr[mid] < target:
            lo = mid + 1    # Search right
        else:
            hi = mid - 1    # Search left
    return -1               # Not found

# Two Pointers – find pair with given sum
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return None`,
  JavaScript: `// Binary Search
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;  // Found!
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;  // Not found
}

// Two Pointers – find pair with given sum
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return null;
}`,
  'C++': `#include <vector>
using namespace std;

// Binary Search
int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;  // Found!
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;  // Not found
}

// Two Pointers – find pair with given sum
pair<int,int> twoSumSorted(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}`,
}

const problems = [
  { title: 'Two Sum', difficulty: 'Easy', desc: 'Given an array of integers, return indices of two numbers that add up to a target.', hint: 'Use a hash map to store each number and its index. For each element, check if (target - element) exists in the map.', link: 'https://leetcode.com/problems/two-sum/' },
  { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', desc: 'Find the maximum profit from buying and selling one stock.', hint: 'Track the minimum price seen so far. At each step, update max profit as current price minus min price.', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { title: 'Container With Most Water', difficulty: 'Medium', desc: 'Find two lines that together with the x-axis forms a container holding the most water.', hint: 'Use two pointers starting from both ends. Always move the pointer with the smaller height inward.', link: 'https://leetcode.com/problems/container-with-most-water/' },
  { title: 'Sliding Window Maximum', difficulty: 'Hard', desc: 'Find the maximum in every window of size k in an array.', hint: 'Use a deque (monotonic queue) to keep track of useful elements in the window. Remove elements outside the window and elements smaller than current.', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', desc: 'Find the length of the longest substring without repeating characters.', hint: 'Use sliding window with a set. Expand right pointer; when a repeat is found, shrink from the left until the window is valid again.', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
]

export default function Arrays() {
  return (
    <div className="content">
      <TopicHeader topic="arrays" title="📦 Arrays & Strings" subtitle="The most fundamental data structure — contiguous memory, O(1) index access." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>Array</strong> — Fixed-size collection of elements stored at contiguous memory locations.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Access</strong> — O(1) by index. <strong style={{ color: 'var(--blue)' }}>Search</strong> — O(n) linear, O(log n) binary (sorted).</li>
          <li><strong style={{ color: 'var(--blue)' }}>Two Pointers</strong> — Use left & right pointers that move inward. Useful for sorted arrays.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Sliding Window</strong> — A subarray that moves over data. Track window state as it slides.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Prefix Sum</strong> — Precompute cumulative sums for O(1) range queries.</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Binary Search Animation</h2>
        <p style={{ marginBottom: 12 }}>Array: [1..9] sorted. Pick a target and step through binary search — watch how we eliminate half the search space each time.</p>
        <BinarySearchViz />
      </div>

      <div className="card">
        <h2>🎬 Two Pointers Animation</h2>
        <p style={{ marginBottom: 12 }}>Sorted array. Find a pair that sums to 10. Left pointer moves right when sum is too small, right pointer moves left when sum is too large.</p>
        <TwoPointerViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead><tr><th>Operation</th><th>Array</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Access by index</td><td className="o1">O(1)</td><td>Direct memory calculation</td></tr>
            <tr><td>Search (unsorted)</td><td className="on">O(n)</td><td>Linear scan</td></tr>
            <tr><td>Search (sorted)</td><td className="ologn">O(log n)</td><td>Binary search</td></tr>
            <tr><td>Insert at end</td><td className="o1">O(1)</td><td>Amortized for dynamic arrays</td></tr>
            <tr><td>Insert at beginning</td><td className="on">O(n)</td><td>Shift all elements</td></tr>
            <tr><td>Delete</td><td className="on">O(n)</td><td>Shift elements after deletion point</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="arrays" />
      </div>
    </div>
  )
}
