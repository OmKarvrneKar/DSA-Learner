import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, RotateCcw, Copy, Maximize2, Minimize2, Terminal, AlertCircle, 
  Settings2, Code2, Check, FileJson, Cpu
} from 'lucide-react'

const TEMPLATES = {
  JavaScript: `// DSA Playground — JavaScript
// Output appears below after clicking Run ▶

// You can access user input via the 'input' variable
const inputLines = input ? input.split('\\n') : [];
console.log("Received input:", inputLines);

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9));  // [0, 1]
console.log(twoSum([3, 2, 4], 6));        // [1, 2]`,
  Python: `# DSA Playground — Python
# Python code cannot run natively in the browser here.
# Click "Open in Replit" to run this code online.

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]`,
  'C++': `// DSA Playground — C++
// C++ code cannot run natively in the browser here.
// Click "Open in Replit" to run this code online.

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`
}

const PROBLEMS = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    input: '[2, 7, 11, 15]\n9',
    code: `// Two Sum
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

// Test
const nums = [2, 7, 11, 15];
const target = 9;
console.log("Result:", twoSum(nums, target));`
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    desc: 'Given a string s containing just the characters brackets, determine if the input string is valid.',
    input: '"()[]{}"',
    code: `// Valid Parentheses
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}

// Test
console.log("Is valid '()[]{}':", isValid("()[]{}"));
console.log("Is valid '(]':", isValid("(]"));`
  },
  {
    title: 'Maximum Subarray (Kadane)',
    difficulty: 'Medium',
    desc: 'Find the contiguous subarray which has the largest sum and return its sum.',
    input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    code: `// Maximum Subarray
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}

// Test
console.log("Max sum:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`
  }
]

const REPLIT_URLS = {
  Python: 'https://replit.com/languages/python3',
  'C++': 'https://replit.com/languages/cpp',
}

const THEMES = [
  { id: 'vs-dark', label: 'Dark (Default)' },
  { id: 'vs', label: 'Light' },
  { id: 'hc-black', label: 'High Contrast' }
]

function analyzeComplexity(codeString) {
  const lines = codeString.split('\n');
  let hasLoops = false;
  let maxNestLevel = 0;
  let currentNest = 0;
  let hasLogarithmic = false;
  let hasRecursion = false;
  let hasMapOrSet = false;
  let hasArrays = false;

  const funcMatch = codeString.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=]*)\s*=>)/g);
  const funcNames = [];
  if (funcMatch) {
    funcMatch.forEach(m => {
      const name = m.replace(/function\s+|const\s+|=.*/g, '').trim();
      if (name && name !== 'console') funcNames.push(name);
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;

    if (line.match(/\b(for|while)\b/)) {
      hasLoops = true;
      currentNest++;
      if (currentNest > maxNestLevel) maxNestLevel = currentNest;
    }
    
    if (line.includes('}') && currentNest > 0) {
      currentNest--;
    }

    if (line.match(/(\/\/\s*|log|\/=\s*2|\/=\s*2|lo\s*=\s*mid|hi\s*=\s*mid|>>=1)/)) {
      hasLogarithmic = true;
    }

    if (line.match(/\b(new\s+Map|new\s+Set|\[\]|\{\})\b/)) {
      hasMapOrSet = true;
    }
    if (line.match(/\bnew\s+Array|\[.*\]\b/)) {
      hasArrays = true;
    }

    funcNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\s*\\(`, 'g');
      const matches = line.match(regex);
      if (matches && (line.includes('return') || line.includes('=')) && !line.includes('function') && !line.includes('=>')) {
        hasRecursion = true;
      }
    });
  }

  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let explanation = [];

  if (hasRecursion) {
    timeComplexity = 'O(2ⁿ) or O(N)';
    spaceComplexity = 'O(N) (call stack depth)';
    explanation.push('Found recursive calls. Depending on branch factor, time complexity is exponential O(2^N) or linear O(N). Space complexity is O(N) due to the call stack.');
  } else if (maxNestLevel >= 2) {
    timeComplexity = 'O(N²)';
    explanation.push(`Detected nested loops (depth: ${maxNestLevel}). Each loop processes elements linearly, yielding quadratic O(N^2) time complexity.`);
  } else if (maxNestLevel === 1) {
    if (hasLogarithmic) {
      timeComplexity = 'O(log N)';
      explanation.push('Detected binary division logic within the loop structure. Time complexity is logarithmic O(log N).');
    } else {
      timeComplexity = 'O(N)';
      explanation.push('Detected a single loop. Time complexity is linear O(N).');
    }
  } else {
    explanation.push('No loops or recursion detected in key code blocks. Execution executes in constant time O(1).');
  }

  if (hasMapOrSet || hasArrays) {
    spaceComplexity = 'O(N)';
    explanation.push('Instantiates dynamic data structures (Map, Set, or Array) whose size grows with input, resulting in linear space O(N).');
  } else {
    explanation.push('Only auxiliary primitive variables used. Space complexity remains constant O(1).');
  }

  return { timeComplexity, spaceComplexity, explanation };
}

export default function Playground() {
  const [lang, setLang] = useState('JavaScript')
  const [code, setCode] = useState(TEMPLATES.JavaScript)
  const [input, setInput] = useState('10 20 30\\n40 50')
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('vs-dark')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('output')
  const [complexityResult, setComplexityResult] = useState(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isFullscreen])

  function changeLanguage(l) {
    setLang(l)
    setCode(TEMPLATES[l])
    setOutput('')
    setErrorMsg('')
    setComplexityResult(null)
    setActiveTab('output')
  }

  function resetCode() {
    setCode(TEMPLATES[lang])
    setOutput('')
    setErrorMsg('')
    setComplexityResult(null)
  }

  function runCode() {
    if (lang !== 'JavaScript') return
    setRunning(true)
    setOutput('')
    setErrorMsg('')
    setActiveTab('output')

    // Complexity analysis
    const analysis = analyzeComplexity(code)
    setComplexityResult(analysis)

    setTimeout(() => {
      const logs = []
      const fakeConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args) => logs.push('❌ ' + args.join(' ')),
        warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
      }

      try {
        const start = performance.now()
        // eslint-disable-next-line no-new-func
        const fn = new Function('console', 'input', code)
        fn(fakeConsole, input)
        const end = performance.now()
        
        let out = logs.join('\n') || '(no output)'
        out += `\n\n✨ Execution finished in ${(end - start).toFixed(2)}ms`
        setOutput(out)
      } catch (e) {
        setErrorMsg(`Error: ${e.message}\n${e.stack}`)
        setActiveTab('problems')
      }
      setRunning(false)
    }, 150)
  }

  function copyCode() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const monacoLang = { JavaScript: 'javascript', Python: 'python', 'C++': 'cpp' }[lang]

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[200] bg-[var(--bg-base)] flex flex-col p-4' : 'content'}`} style={!isFullscreen ? { maxWidth: 1200 } : {}}>
      
      {!isFullscreen && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Code2 size={20} />
            </div>
            <h1 className="text-2xl font-bold text-white brand-font">Code Playground</h1>
          </div>
          <p className="text-[var(--text-muted)] text-sm">Write, execute, analyze complexity, and debug your code in a fully featured environment.</p>
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-2 rounded-t-xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {Object.keys(TEMPLATES).map(l => (
            <button key={l} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${lang === l ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white border border-transparent'}`}
              onClick={() => changeLanguage(l)}
            >
              <Cpu size={14} /> {l}
            </button>
          ))}
          
          <select 
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const prob = PROBLEMS.find(p => p.title === val);
                if (prob) {
                  setCode(prob.code);
                  setInput(prob.input);
                  setOutput('');
                  setErrorMsg('');
                  setComplexityResult(null);
                  setLang('JavaScript');
                }
              }
            }}
            className="bg-black/20 border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] outline-none hover:border-[var(--border-strong)] transition-colors cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Problem Preset</option>
            {PROBLEMS.map(p => (
              <option key={p.title} value={p.title}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-black/20 border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] outline-none hover:border-[var(--border-strong)] transition-colors cursor-pointer"
          >
            {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>

          <div className="w-px h-6 bg-[var(--border-strong)] mx-1"></div>

          <button onClick={resetCode} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors tooltip-trigger" title="Reset Code">
            <RotateCcw size={16} />
          </button>
          
          <button onClick={copyCode} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors tooltip-trigger" title="Copy Code">
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors tooltip-trigger" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {lang === 'JavaScript' ? (
            <button 
              onClick={runCode} 
              disabled={running}
              className={`ml-2 flex items-center gap-2 px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${running ? 'bg-indigo-500/50 cursor-not-allowed text-white/50' : 'bg-[var(--accent-gradient)] text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5'}`}
            >
              <Play size={14} className={running ? 'animate-pulse' : ''} /> {running ? 'Running...' : 'Run Code'}
            </button>
          ) : (
            <a href={REPLIT_URLS[lang]} target="_blank" rel="noreferrer" className="ml-2 flex items-center gap-2 px-5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all no-underline">
              <Play size={14} /> Open Replit
            </a>
          )}
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-4 ${isFullscreen ? 'flex-1 overflow-hidden mt-4' : ''}`}>
        {/* Editor Container */}
        <div className={`border-x border-b border-[var(--border-subtle)] bg-[#0d1117] rounded-b-xl overflow-hidden ${isFullscreen ? 'flex-1 h-full' : 'h-[500px] lg:flex-[2]'}`}>
          <Editor
            language={monacoLang}
            value={code}
            onChange={v => setCode(v || '')}
            theme={theme}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              fontFamily: "'JetBrains Mono', 'Consolas', monospace",
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              formatOnPaste: true,
            }}
            loading={<div className="flex h-full items-center justify-center text-[var(--text-muted)] animate-pulse">Loading Editor...</div>}
          />
        </div>

        {/* Output/Input Panels */}
        <div className={`flex flex-col bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl overflow-hidden ${isFullscreen ? 'flex-1 h-full' : 'h-[500px] lg:flex-1'}`}>
          {/* Panel Tabs */}
          <div className="flex border-b border-[var(--border-subtle)] bg-black/20">
            {[
              { id: 'output', icon: Terminal, label: 'Output' },
              { id: 'input', icon: FileJson, label: 'Input' },
              { id: 'complexity', icon: Cpu, label: 'Big-O' },
              { id: 'problems', icon: AlertCircle, label: 'Problems', dot: !!errorMsg }
            ].map(t => (
              <button key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wide uppercase transition-colors relative ${activeTab === t.id ? 'text-[var(--accent-primary)] bg-white/5' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'}`}
              >
                <t.icon size={14} />
                {t.label}
                {t.dot && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                {activeTab === t.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4 relative bg-[#0a0a0f]">
            <AnimatePresence mode="wait">
              {activeTab === 'output' && (
                <motion.div key="out" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full font-mono text-[13px] leading-relaxed">
                  {errorMsg && !output ? (
                    <div className="text-rose-400">Execution failed. Check Problems tab.</div>
                  ) : output ? (
                    <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="text-[var(--text-muted)] flex flex-col items-center justify-center h-full gap-3 opacity-50">
                      <Terminal size={32} />
                      <p>Run code to see output</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'input' && (
                <motion.div key="in" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col">
                  <div className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-2">
                    <Settings2 size={14} /> Provide standard input for your script
                  </div>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 w-full bg-black/40 border border-[var(--border-subtle)] rounded-lg p-3 text-[13px] font-mono text-white outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                    placeholder="Enter input here...&#10;Accessible via the 'input' variable in JavaScript."
                    spellCheck="false"
                  />
                </motion.div>
              )}

              {activeTab === 'complexity' && (
                <motion.div key="comp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col gap-4 text-white">
                  {complexityResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Time Complexity</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>{complexityResult.timeComplexity}</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Space Complexity</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399' }}>{complexityResult.spaceComplexity}</div>
                        </div>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '13px', lineHeight: '1.6', color: '#93c5fd' }}>
                        <strong style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'white' }}>Analysis Breakdown:</strong>
                        <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {complexityResult.explanation.map((exp, i) => (
                            <li key={i}>{exp}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SVG Chart */}
                      <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Growth Curve Comparison</div>
                        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '120px', overflow: 'visible' }}>
                          {/* Grid lines */}
                          <line x1="10" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                          <line x1="10" y1="10" x2="10" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                          
                          {/* O(1) - Constant */}
                          <path d="M 10 45 L 95 45" fill="none" stroke={complexityResult.timeComplexity.includes('1') ? '#3b82f6' : 'rgba(255,255,255,0.15)'} strokeWidth={complexityResult.timeComplexity.includes('1') ? '2' : '0.8'} strokeDasharray={complexityResult.timeComplexity.includes('1') ? '0' : '2 2'} />
                          <text x="97" y="47" fill="rgba(255,255,255,0.4)" fontSize="3">O(1)</text>

                          {/* O(log N) - Logarithmic */}
                          <path d="M 10 50 Q 30 35 95 30" fill="none" stroke={complexityResult.timeComplexity.includes('log') ? '#3b82f6' : 'rgba(255,255,255,0.15)'} strokeWidth={complexityResult.timeComplexity.includes('log') ? '2' : '0.8'} strokeDasharray={complexityResult.timeComplexity.includes('log') ? '0' : '2 2'} />
                          <text x="97" y="32" fill="rgba(255,255,255,0.4)" fontSize="3">O(log N)</text>

                          {/* O(N) - Linear */}
                          <path d="M 10 50 L 95 15" fill="none" stroke={complexityResult.timeComplexity.includes('N') && !complexityResult.timeComplexity.includes('²') ? '#3b82f6' : 'rgba(255,255,255,0.15)'} strokeWidth={complexityResult.timeComplexity.includes('N') && !complexityResult.timeComplexity.includes('²') ? '2' : '0.8'} strokeDasharray={complexityResult.timeComplexity.includes('N') && !complexityResult.timeComplexity.includes('²') ? '0' : '2 2'} />
                          <text x="97" y="17" fill="rgba(255,255,255,0.4)" fontSize="3">O(N)</text>

                          {/* O(N^2) - Quadratic */}
                          <path d="M 10 50 Q 40 45 90 5" fill="none" stroke={complexityResult.timeComplexity.includes('²') ? '#3b82f6' : 'rgba(255,255,255,0.15)'} strokeWidth={complexityResult.timeComplexity.includes('²') ? '2' : '0.8'} strokeDasharray={complexityResult.timeComplexity.includes('²') ? '0' : '2 2'} />
                          <text x="92" y="7" fill="rgba(255,255,255,0.4)" fontSize="3">O(N²)</text>
                        </svg>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></span> Your Code
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                            <span style={{ width: '8px', height: '2px', background: 'rgba(255,255,255,0.15)', borderStyle: 'dashed' }}></span> Benchmarks
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[var(--text-muted)] flex flex-col items-center justify-center h-full gap-3 opacity-50">
                      <Cpu size={32} />
                      <p>Run code to calculate complexity</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'problems' && (
                <motion.div key="prob" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                  {errorMsg ? (
                    <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[13px] whitespace-pre-wrap break-words">
                      <div className="flex items-center gap-2 font-bold mb-2 pb-2 border-b border-rose-500/20">
                        <AlertCircle size={16} /> Runtime Error
                      </div>
                      {errorMsg}
                    </div>
                  ) : (
                    <div className="text-[var(--text-muted)] flex flex-col items-center justify-center h-full gap-3 opacity-50">
                      <Check size={32} className="text-emerald-500" />
                      <p>No problems found in workspace</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
