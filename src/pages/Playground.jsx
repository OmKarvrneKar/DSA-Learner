import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

const TEMPLATES = {
  JavaScript: `// DSA Playground — JavaScript
// Output appears below after clicking Run ▶

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
# Python code cannot run in the browser.
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
// C++ code cannot run in the browser.
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
}`,
}

const REPLIT_URLS = {
  Python: 'https://replit.com/languages/python3',
  'C++': 'https://replit.com/languages/cpp',
}

export default function Playground() {
  const [lang, setLang] = useState('JavaScript')
  const [code, setCode] = useState(TEMPLATES.JavaScript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(false)

  function changeLanguage(l) {
    setLang(l)
    setCode(TEMPLATES[l])
    setOutput('')
    setError(false)
  }

  function runCode() {
    if (lang !== 'JavaScript') return
    setRunning(true)
    setOutput('')
    setError(false)

    const logs = []
    const fakeConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => logs.push('❌ ' + args.join(' ')),
      warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', code)
      fn(fakeConsole)
      setOutput(logs.join('\n') || '(no output)')
      setError(false)
    } catch (e) {
      setOutput(`Error: ${e.message}`)
      setError(true)
    }
    setRunning(false)
  }

  function copyCode() {
    navigator.clipboard?.writeText(code).catch(() => {})
  }

  function clearOutput() { setOutput(''); setError(false) }

  const monacoLang = { JavaScript: 'javascript', Python: 'python', 'C++': 'cpp' }[lang]

  return (
    <div className="content" style={{ maxWidth: 1100 }}>
      <div className="section-title">💻 Code Playground</div>
      <div className="section-subtitle">Write and run code directly in the browser. JavaScript executes instantly; Python/C++ opens in Replit.</div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.keys(TEMPLATES).map(l => (
            <button key={l} className={`code-tab${lang === l ? ' active' : ''}`}
              style={{ borderRadius: 6, borderBottom: lang === l ? 'none' : '1px solid var(--border)' }}
              onClick={() => changeLanguage(l)}>
              {l === 'JavaScript' ? '🟨' : l === 'Python' ? '🐍' : '⚙️'} {l}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={copyCode}>📋 Copy</button>
          {lang === 'JavaScript'
            ? <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={runCode} disabled={running}>▶ Run</button>
            : <a href={REPLIT_URLS[lang]} target="_blank" rel="noreferrer" className="btn btn-green" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>▶ Open in Replit</a>
          }
        </div>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <Editor
          height="420px"
          language={monacoLang}
          value={code}
          onChange={v => setCode(v || '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 12 },
            fontFamily: "'Consolas', 'Monaco', monospace",
          }}
        />
      </div>

      {/* Output */}
      <div style={{ marginTop: 12, background: '#0d1117', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Output</span>
          {output && <button onClick={clearOutput} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.75rem' }}>Clear ✕</button>}
        </div>
        <pre style={{
          fontFamily: "'Consolas', monospace", fontSize: '0.82rem', padding: '16px',
          color: error ? 'var(--accent)' : 'var(--green)', margin: 0,
          minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {output || <span style={{ color: 'var(--text2)' }}>{lang === 'JavaScript' ? '// Press ▶ Run to execute your code' : '// Click "Open in Replit" to run this language online'}</span>}
        </pre>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>💡 Playground Tips</h2>
        <ul>
          <li>Use <code style={{ color: 'var(--blue)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4 }}>console.log()</code> to print output in JavaScript</li>
          <li>All standard JS is supported — arrays, objects, classes, recursion</li>
          <li>For Python/C++, click "Open in Replit" to get a full online environment</li>
          <li>Paste any LeetCode solution here to test it locally</li>
          <li>Use <kbd style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: '0.78rem' }}>Ctrl+/</kbd> to comment/uncomment lines</li>
        </ul>
      </div>
    </div>
  )
}
