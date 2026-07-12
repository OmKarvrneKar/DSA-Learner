import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, 
  FastForward, Settings2, Shuffle, CheckCircle2, 
  AlertCircle, ChevronRight, Hash, Eye
} from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import ProblemList from '../components/ProblemList'
import TopicHeader from '../components/TopicHeader'

function BinarySearchViz() {
  const [arr, setArr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91])
  const [target, setTarget] = useState(23)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  
  // History of states for time travel
  const [history, setHistory] = useState([])
  const [stepIdx, setStepIdx] = useState(0)

  const timerRef = useRef(null)

  // Initialize search logic and generate history
  const initializeSearch = (searchTarget, searchArr) => {
    let lo = 0
    let hi = searchArr.length - 1
    const newHistory = []
    
    // Initial state
    newHistory.push({ lo, hi, mid: null, found: null, done: false, msg: `Looking for ${searchTarget} in array. Initial search space: [0...${hi}]`, line: 1 })
    
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      newHistory.push({ lo, hi, mid, found: null, done: false, msg: `Calculate mid = (${lo} + ${hi}) / 2 = ${mid}`, line: 3 })
      
      if (searchArr[mid] === searchTarget) {
        newHistory.push({ lo, hi, mid, found: mid, done: true, msg: `✅ Found ${searchTarget} at index ${mid}!`, line: 5 })
        break
      } else if (searchArr[mid] < searchTarget) {
        newHistory.push({ lo, hi, mid, found: null, done: false, msg: `arr[${mid}] (${searchArr[mid]}) < ${searchTarget}, so search RIGHT half.`, line: 7 })
        lo = mid + 1
      } else {
        newHistory.push({ lo, hi, mid, found: null, done: false, msg: `arr[${mid}] (${searchArr[mid]}) > ${searchTarget}, so search LEFT half.`, line: 9 })
        hi = mid - 1
      }
    }
    
    if (lo > hi) {
      newHistory.push({ lo, hi, mid: null, found: -1, done: true, msg: `❌ ${searchTarget} not found. Search space is empty.`, line: 10 })
    }
    
    setHistory(newHistory)
    setStepIdx(0)
    setIsPlaying(false)
  }

  // Run once on mount
  useEffect(() => {
    initializeSearch(target, arr)
  }, []) // eslint-disable-line

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIdx(prev => {
          if (prev >= history.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, speed, history.length])

  const handleRandomize = () => {
    const newArr = Array.from({length: 10}, () => Math.floor(Math.random() * 100)).sort((a,b) => a-b)
    setArr(newArr)
    const newTarget = newArr[Math.floor(Math.random() * newArr.length)]
    setTarget(newTarget)
    initializeSearch(newTarget, newArr)
  }

  const handleTargetChange = (e) => {
    const val = Number(e.target.value)
    setTarget(val)
    initializeSearch(val, arr)
  }

  const curr = history[stepIdx] || { lo: 0, hi: arr.length-1, mid: null, found: null, done: false, msg: '', line: 0 }

  const pseudoCode = [
    "def binary_search(arr, target):",
    "    lo, hi = 0, len(arr) - 1",
    "    while lo <= hi:",
    "        mid = (lo + hi) // 2",
    "        if arr[mid] == target:",
    "            return mid",
    "        elif arr[mid] < target:",
    "            lo = mid + 1",
    "        else:",
    "            hi = mid - 1",
    "    return -1"
  ]

  return (
    <div className="card !p-0 overflow-hidden bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
      <div className="p-6 border-b border-[var(--border-subtle)] bg-black/20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Search size={18} className="text-indigo-400" /> Binary Search
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-[var(--border-subtle)] rounded-lg">
                  <Hash size={14} className="text-[var(--text-muted)]" />
                  <input 
                    type="number" 
                    value={target}
                    onChange={handleTargetChange}
                    className="w-16 bg-transparent text-white font-bold outline-none"
                  />
                </div>
                <button onClick={handleRandomize} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors" title="Randomize Array">
                  <Shuffle size={16} />
                </button>
              </div>
            </div>

            {/* Visualizer Array */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 relative min-h-[80px]">
              <AnimatePresence>
                {arr.map((val, i) => {
                  const isMid = curr.mid === i
                  const isFound = curr.found === i
                  const inRange = i >= curr.lo && i <= curr.hi
                  const isEliminated = !inRange && !curr.done
                  
                  return (
                    <motion.div 
                      layout
                      key={i} 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: isEliminated ? 0.2 : 1 }}
                      className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                        isFound ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                        isMid ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50' :
                        inRange ? 'bg-indigo-500/10 text-white border border-indigo-500/30' :
                        'bg-white/5 text-[var(--text-muted)] border border-transparent'
                      }`}
                    >
                      {val}
                      
                      {/* Pointers */}
                      {curr.lo === i && !isFound && (
                        <motion.div layoutId="lo-ptr" className="absolute -bottom-7 text-[10px] font-bold text-indigo-400 flex flex-col items-center">
                          <ChevronRight className="-rotate-90" size={14} /> LO
                        </motion.div>
                      )}
                      {curr.hi === i && !isFound && (
                        <motion.div layoutId="hi-ptr" className="absolute -top-7 text-[10px] font-bold text-indigo-400 flex flex-col items-center">
                          HI <ChevronRight className="rotate-90" size={14} />
                        </motion.div>
                      )}
                      {isMid && !isFound && (
                        <motion.div layoutId="mid-ptr" className="absolute -bottom-7 text-[10px] font-bold text-amber-400 flex flex-col items-center">
                          <ChevronRight className="-rotate-90" size={14} /> MID
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Status Message */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${curr.found !== null ? (curr.found !== -1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-rose-500/10 border-rose-500/20 text-rose-100') : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100'}`}>
              {curr.found !== null ? (curr.found !== -1 ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />) : <Eye size={20} className="text-indigo-400 shrink-0 mt-0.5" />}
              <p className="font-medium text-sm">{curr.msg}</p>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="w-full lg:w-72 bg-black/40 rounded-xl border border-[var(--border-subtle)] p-4 font-mono text-[11px] leading-relaxed">
            <div className="text-[var(--text-muted)] mb-3 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
              <Code2 size={12} /> Execution Trace
            </div>
            {pseudoCode.map((line, idx) => (
              <div key={idx} className={`px-2 py-1 rounded transition-colors ${curr.line === idx ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-[var(--text-muted)] border-l-2 border-transparent'}`}>
                {line.replace(/ /g, '\\u00a0')}
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* Playback Controls */}
      <div className="p-4 bg-black/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setIsPlaying(false); setStepIdx(0) }}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={() => { setIsPlaying(false); setStepIdx(Math.max(0, stepIdx - 1)) }}
            disabled={stepIdx === 0}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <SkipBack size={18} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={stepIdx >= history.length - 1}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--accent-gradient)] text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-1" />}
          </button>
          
          <button 
            onClick={() => { setIsPlaying(false); setStepIdx(Math.min(history.length - 1, stepIdx + 1)) }}
            disabled={stepIdx >= history.length - 1}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex flex-1 max-w-xs items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] font-medium">Speed</span>
          <input 
            type="range" min="100" max="2000" step="100"
            value={2100 - speed} 
            onChange={(e) => setSpeed(2100 - Number(e.target.value))}
            className="w-full accent-indigo-500"
            style={{ direction: 'ltr' }}
          />
          <FastForward size={16} className="text-[var(--text-muted)]" />
        </div>
        
        <div className="text-xs font-mono text-[var(--text-muted)]">
          Step {stepIdx + 1} / {history.length}
        </div>
      </div>
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
      setStatus(`✅ Found! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${target}`)
      setFound(true); setDone(true)
    } else if (sum < target) {
      setStatus(`Sum ${sum} < ${target}, move LEFT pointer right to increase sum.`)
      setLeft(l => l + 1)
    } else {
      setStatus(`Sum ${sum} > ${target}, move RIGHT pointer left to decrease sum.`)
      setRight(r => r - 1)
    }
    if (left >= right - 1 && sum !== target) { setDone(true); setStatus(`No pair found`) }
  }

  function reset() { setLeft(0); setRight(arr.length - 1); setStatus(`Find two numbers that sum to ${target}`); setFound(false); setDone(false) }

  return (
    <div className="card !p-0 overflow-hidden bg-[var(--bg-elevated)] border-[var(--border-subtle)] mt-6">
       <div className="p-6 border-b border-[var(--border-subtle)] bg-black/20">
          <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-8">
            <ArrowDownUp size={18} className="text-indigo-400 rotate-90" /> Two Pointers (Target Sum)
          </h3>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12 relative min-h-[80px]">
            <AnimatePresence>
              {arr.map((v, i) => {
                const isL = i === left
                const isR = i === right
                const isF = found && (isL || isR)
                return (
                  <motion.div 
                    layout
                    key={i} 
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                      isF ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                      (isL || isR) ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/50' :
                      'bg-white/5 text-[var(--text-muted)] border border-transparent'
                    }`}
                  >
                    {v}
                    {isL && !isF && (
                      <motion.div layoutId="tp-l" className="absolute -bottom-7 text-[10px] font-bold text-indigo-400 flex flex-col items-center">
                        <ChevronRight className="-rotate-90" size={14} /> L
                      </motion.div>
                    )}
                    {isR && !isF && (
                      <motion.div layoutId="tp-r" className="absolute -bottom-7 text-[10px] font-bold text-indigo-400 flex flex-col items-center">
                        <ChevronRight className="-rotate-90" size={14} /> R
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          
          <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${found ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : done ? 'bg-rose-500/10 border-rose-500/20 text-rose-100' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100'}`}>
            {found ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" /> : done ? <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" /> : <Eye size={20} className="text-indigo-400 shrink-0 mt-0.5" />}
            <p className="font-medium text-sm">{status}</p>
          </div>
       </div>
       <div className="p-4 bg-black/40 flex items-center justify-center gap-4">
          <button className="btn btn-primary px-6" onClick={step} disabled={done}>Next Step <SkipForward size={16} className="ml-2" /></button>
          <button className="btn btn-secondary px-6" onClick={reset}><RotateCcw size={16} className="mr-2" /> Reset</button>
       </div>
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
      <TopicHeader topic="arrays" title="Arrays & Strings" subtitle="The most fundamental data structure — contiguous memory, O(1) index access." icon={Box} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="card h-full">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-400" /> Core Concepts
          </h2>
          <ul className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-white">Array</strong> — Fixed-size collection of elements stored at contiguous memory locations.</div></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-white">Access</strong> — O(1) by index. <strong className="text-white">Search</strong> — O(n) linear, O(log n) binary (sorted).</div></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-white">Two Pointers</strong> — Use left & right pointers that move inward. Useful for sorted arrays.</div></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-white">Sliding Window</strong> — A subarray that moves over data. Track window state as it slides.</div></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-white">Prefix Sum</strong> — Precompute cumulative sums for O(1) range queries.</div></li>
          </ul>
        </div>
        
        <div className="card h-full">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Settings2 size={20} className="text-amber-400" /> Complexity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Operation</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {[
                  { op: 'Access by index', time: 'O(1)', color: 'text-emerald-400', notes: 'Direct memory calculation' },
                  { op: 'Search (unsorted)', time: 'O(n)', color: 'text-amber-400', notes: 'Linear scan' },
                  { op: 'Search (sorted)', time: 'O(log n)', color: 'text-indigo-400', notes: 'Binary search' },
                  { op: 'Insert at end', time: 'O(1)', color: 'text-emerald-400', notes: 'Amortized for dynamic arrays' },
                  { op: 'Insert at start/mid', time: 'O(n)', color: 'text-rose-400', notes: 'Shift all elements' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-white font-medium">{row.op}</td>
                    <td className={`py-3 pr-4 font-mono font-bold ${row.color}`}>{row.time}</td>
                    <td className="py-3 text-[var(--text-muted)]">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Algorithm Visualizations</h2>
        <p className="text-[var(--text-muted)] text-sm mb-6">Interactive step-by-step execution to help you build an intuition for array algorithms.</p>
        
        <BinarySearchViz />
        <TwoPointerViz />
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Code2 size={20} className="text-emerald-400" /> Implementation Templates
        </h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target size={20} className="text-rose-400" /> Practice Problems
        </h2>
        <ProblemList problems={problems} topic="arrays" />
      </div>
    </div>
  )
}
