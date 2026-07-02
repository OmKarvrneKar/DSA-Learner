import { useState, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import ProblemList from '../components/ProblemList'
import TopicHeader from '../components/TopicHeader'

const INIT = [64, 34, 25, 12, 22, 11, 90]

function SortViz() {
  const [arr, setArr] = useState([...INIT])
  const [comparing, setComparing] = useState([])
  const [sorted, setSorted] = useState([])
  const [status, setStatus] = useState('Pick a sorting algorithm to visualize')
  const [running, setRunning] = useState(false)
  const delayRef = useRef(300)

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

  async function bubbleSort() {
    if (running) return
    setRunning(true); setSorted([]); setStatus('Bubble Sort: comparing adjacent pairs...')
    const a = [...INIT]; setArr([...a])
    const n = a.length
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        setComparing([j, j + 1])
        setStatus(`Comparing a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`)
        await sleep(delayRef.current)
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]]
          setArr([...a])
          await sleep(delayRef.current)
        }
      }
      setSorted(prev => [...prev, n - 1 - i])
    }
    setSorted([...Array(n).keys()])
    setComparing([])
    setStatus('✅ Bubble Sort complete! O(n²) comparisons')
    setRunning(false)
  }

  async function selectionSort() {
    if (running) return
    setRunning(true); setSorted([]); setStatus('Selection Sort: finding minimum each pass...')
    const a = [...INIT]; setArr([...a])
    const n = a.length
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j])
        setStatus(`Pass ${i+1}: Checking if a[${j}]=${a[j]} < min=${a[minIdx]}`)
        await sleep(delayRef.current)
        if (a[j] < a[minIdx]) minIdx = j
      }
      if (minIdx !== i) { [a[i], a[minIdx]] = [a[minIdx], a[i]]; setArr([...a]) }
      setSorted(prev => [...prev, i])
      await sleep(delayRef.current / 2)
    }
    setSorted([...Array(n).keys()])
    setComparing([])
    setStatus('✅ Selection Sort complete! O(n²) — good for small arrays')
    setRunning(false)
  }

  async function mergeSort() {
    if (running) return
    setRunning(true); setSorted([]); setStatus('Merge Sort: divide and conquer...')
    const a = [...INIT]; setArr([...a])
    async function merge(arr, l, m, r) {
      const left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1)
      let i = 0, j = 0, k = l
      while (i < left.length && j < right.length) {
        setComparing([l + i, m + 1 + j])
        await sleep(delayRef.current)
        if (left[i] <= right[j]) arr[k++] = left[i++]
        else arr[k++] = right[j++]
        setArr([...arr])
      }
      while (i < left.length) arr[k++] = left[i++]
      while (j < right.length) arr[k++] = right[j++]
      setArr([...arr])
    }
    async function ms(arr, l, r) {
      if (l >= r) return
      const m = Math.floor((l + r) / 2)
      await ms(arr, l, m)
      await ms(arr, m + 1, r)
      await merge(arr, l, m, r)
    }
    await ms(a, 0, a.length - 1)
    setSorted([...Array(a.length).keys()])
    setComparing([])
    setStatus('✅ Merge Sort complete! O(n log n) — always efficient')
    setRunning(false)
  }

  function reset() { setArr([...INIT]); setComparing([]); setSorted([]); setStatus('Pick a sorting algorithm to visualize'); setRunning(false) }

  const maxVal = Math.max(...arr)
  const colors = ['#4da6ff', '#00d4aa', '#ffd700', '#ff9966', '#d2a8ff', '#ff7b72', '#79c0ff']

  return (
    <div className="viz-container" style={{ gap: 20 }}>
      <div className="viz-array" style={{ alignItems: 'flex-end', height: 120, padding: '0 10px' }}>
        {arr.map((v, i) => (
          <div key={i} className="viz-bar"
            style={{
              height: `${(v / maxVal) * 100}px`,
              background: sorted.includes(i) ? 'var(--green)' : comparing.includes(i) ? 'var(--yellow)' : colors[i % colors.length],
              transition: 'height 0.2s, background 0.2s'
            }}>
            <span style={{ position: 'absolute', top: -18, fontSize: '0.7rem', color: 'var(--text2)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>🟡 Comparing</span><span>🟢 Sorted</span>
      </div>
      <div className="viz-controls">
        <button className="btn btn-primary" onClick={bubbleSort} disabled={running}>Bubble Sort O(n²)</button>
        <button className="btn btn-secondary" onClick={selectionSort} disabled={running}>Selection Sort O(n²)</button>
        <button className="btn btn-green" onClick={mergeSort} disabled={running}>Merge Sort O(n log n)</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `# Bubble Sort – O(n²)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-1-i):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Merge Sort – O(n log n)
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

# Quick Sort – O(n log n) avg, O(n²) worst
def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo >= hi: return
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    p = i + 1
    quick_sort(arr, lo, p - 1)
    quick_sort(arr, p + 1, hi)

# Binary Search – O(log n)
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
  JavaScript: `// Merge Sort – O(n log n)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// Quick Sort – O(n log n) average
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++)
    if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  const p = i + 1;
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}`,
  'C++': `#include <vector>
#include <algorithm>
using namespace std;

// Merge Sort – O(n log n)
void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin()+l, arr.begin()+m+1);
    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);
    int i=0, j=0, k=l;
    while (i<left.size() && j<right.size())
        arr[k++] = left[i]<=right[j] ? left[i++] : right[j++];
    while (i<left.size()) arr[k++]=left[i++];
    while (j<right.size()) arr[k++]=right[j++];
}
void mergeSort(vector<int>& arr, int l, int r) {
    if (l>=r) return;
    int m=(l+r)/2;
    mergeSort(arr,l,m); mergeSort(arr,m+1,r);
    merge(arr,l,m,r);
}

// Quick Sort – O(n log n) average
int partition(vector<int>& arr, int lo, int hi) {
    int pivot=arr[hi], i=lo-1;
    for (int j=lo; j<hi; j++)
        if (arr[j]<=pivot) swap(arr[++i],arr[j]);
    swap(arr[i+1],arr[hi]);
    return i+1;
}
void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo>=hi) return;
    int p=partition(arr,lo,hi);
    quickSort(arr,lo,p-1); quickSort(arr,p+1,hi);
}`,
}

const problems = [
  { title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', desc: 'Sort an array containing only 0s, 1s, and 2s in one pass.', hint: 'Three pointers: lo, mid, hi. If arr[mid]=0, swap with lo and advance both. If 2, swap with hi and retreat hi. If 1, just advance mid.', link: 'https://leetcode.com/problems/sort-colors/' },
  { title: 'Merge Intervals', difficulty: 'Medium', desc: 'Merge all overlapping intervals.', hint: 'Sort by start time. Iterate: if current interval overlaps with last in result (start ≤ last end), merge by extending the end. Otherwise, add as new.', link: 'https://leetcode.com/problems/merge-intervals/' },
  { title: 'Kth Largest Element', difficulty: 'Medium', desc: 'Find the kth largest element in an unsorted array.', hint: 'QuickSelect (partition like quicksort) gives O(n) avg. Or use a min-heap of size k: O(n log k). The heap top is always the kth largest.', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', desc: 'Binary search in an array that was rotated at some pivot.', hint: 'Modified binary search: one half is always sorted. Determine which half, check if target is in that range, otherwise search the other half.', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
]

export default function Sorting() {
  return (
    <div className="content">
      <TopicHeader topic="sorting" title="🔢 Sorting & Searching" subtitle="Essential algorithms every developer must know — from O(n²) basics to O(n log n) divide-and-conquer." />

      <div className="card">
        <h2>📖 Core Algorithms</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>Bubble Sort</strong> — O(n²) — Compare adjacent pairs, bubble max to end. Simple but slow.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Selection Sort</strong> — O(n²) — Find minimum each pass, place at front. Minimal swaps.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Merge Sort</strong> — O(n log n) — Divide, sort halves, merge. Stable, consistent.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Quick Sort</strong> — O(n log n) avg — Partition around pivot. Fast in practice, O(n²) worst case.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Binary Search</strong> — O(log n) — Only works on sorted arrays. Halves search space each step.</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Sorting Animation</h2>
        <p style={{ marginBottom: 12 }}>Watch how different algorithms sort the same array. Notice the difference in number of operations.</p>
        <SortViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity Comparison</h2>
        <table className="complexity-table">
          <thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable?</th></tr></thead>
          <tbody>
            <tr><td>Bubble Sort</td><td className="on">O(n)</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="o1">O(1)</td><td>✅ Yes</td></tr>
            <tr><td>Selection Sort</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="on2">O(n²)</td><td className="o1">O(1)</td><td>❌ No</td></tr>
            <tr><td>Merge Sort</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="on">O(n)</td><td>✅ Yes</td></tr>
            <tr><td>Quick Sort</td><td className="onlogn">O(n log n)</td><td className="onlogn">O(n log n)</td><td className="on2">O(n²)</td><td className="ologn">O(log n)</td><td>❌ No</td></tr>
            <tr><td>Binary Search</td><td className="o1">O(1)</td><td className="ologn">O(log n)</td><td className="ologn">O(log n)</td><td className="o1">O(1)</td><td>N/A</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="sorting" />
      </div>
    </div>
  )
}
