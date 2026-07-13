import { useState } from 'react'
import CodeBlock from '../components/common/CodeBlock'
import ProblemList from '../components/common/ProblemList'
import TopicHeader from '../components/common/TopicHeader'

function StackViz() {
  const [stack, setStack] = useState([10, 20, 30])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('Stack ready. Push or Pop items!')
  const [newItem, setNewItem] = useState(null)

  function push() {
    const val = Number(input) || Math.floor(Math.random() * 90 + 10)
    setNewItem(val)
    setStatus(`Pushing ${val} onto stack (TOP) — O(1)`)
    setTimeout(() => {
      setStack(s => [...s, val])
      setNewItem(null)
      setStatus(`✅ ${val} pushed. Stack size: ${stack.length + 1}`)
    }, 500)
    setInput('')
  }

  function pop() {
    if (stack.length === 0) { setStatus('❌ Stack Underflow! Cannot pop from empty stack.'); return }
    const top = stack[stack.length - 1]
    setStack(s => s.slice(0, -1))
    setStatus(`✅ Popped ${top} from TOP — O(1)`)
  }

  function peek() {
    if (stack.length === 0) { setStatus('❌ Stack is empty!'); return }
    setStatus(`👀 Top element: ${stack[stack.length - 1]} (peek, no removal)`)
  }

  return (
    <div className="viz-container">
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 4, textAlign: 'center' }}>← TOP</div>
          <div className="stack-viz" style={{ minHeight: 120 }}>
            {stack.map((v, i) => (
              <div key={i} className={`stack-item${i === stack.length - 1 ? ' top' : ''}`}>{v}</div>
            ))}
            {newItem && <div className="stack-item new-item" style={{ opacity: 0.6 }}>{newItem} ←</div>}
          </div>
          {stack.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.8rem', padding: 16 }}>Empty Stack</div>}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 2 }}>
          <div>📌 Stack uses <strong style={{ color: 'var(--accent)' }}>LIFO</strong></div>
          <div>Last In, First Out</div>
          <div style={{ marginTop: 8 }}>Use Cases:</div>
          <div>• Undo/Redo</div>
          <div>• Call stack</div>
          <div>• Balanced brackets</div>
          <div>• Browser history</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Value"
          style={{ width: 100, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.85rem' }}
        />
        <button className="btn btn-primary" onClick={push}>Push</button>
        <button className="btn btn-secondary" onClick={pop}>Pop</button>
        <button className="btn btn-green" onClick={peek}>Peek</button>
      </div>
      <div className="viz-status info">{status}</div>
    </div>
  )
}

const codes = {
  Python: `# Stack using Python list
stack = []

stack.append(10)    # push  → O(1)
stack.append(20)
stack.append(30)
top = stack[-1]     # peek  → O(1) → 30
stack.pop()         # pop   → O(1) → removes 30

# Classic problem: Balanced Brackets
def is_balanced(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in ')]}':
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_balanced("({[]})"))  # True
print(is_balanced("([)]"))    # False`,
  JavaScript: `// Stack using array
const stack = [];
stack.push(10);        // push  → O(1)
stack.push(20);
stack.push(30);
const top = stack[stack.length - 1]; // peek → 30
stack.pop();           // pop   → O(1) → removes 30

// Classic: Balanced Brackets
function isBalanced(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else if (')]}'.includes(ch)) {
      if (!stack.length || stack[stack.length - 1] !== pairs[ch])
        return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}`,
  'C++': `#include <stack>
#include <string>
using namespace std;

// Stack operations
stack<int> st;
st.push(10);           // push  → O(1)
st.push(20);
st.push(30);
int top = st.top();    // peek  → O(1) → 30
st.pop();              // pop   → O(1)

// Classic: Balanced Brackets
bool isBalanced(string s) {
    stack<char> st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{')
            st.push(ch);
        else {
            if (st.empty()) return false;
            if ((ch==')' && st.top()!='(') ||
                (ch==']' && st.top()!='[') ||
                (ch=='}' && st.top()!='{')) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
}

const problems = [
  { title: 'Valid Parentheses', difficulty: 'Easy', desc: 'Given a string containing just brackets, determine if it is valid (balanced).', hint: 'Use a stack. Push opening brackets. For closing brackets, check if the top of the stack is the matching opener.', link: 'https://leetcode.com/problems/valid-parentheses/' },
  { title: 'Min Stack', difficulty: 'Medium', desc: 'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).', hint: 'Use two stacks: one main stack and one min stack. The min stack always tracks the minimum at each level.', link: 'https://leetcode.com/problems/min-stack/' },
  { title: 'Daily Temperatures', difficulty: 'Medium', desc: 'For each day, find how many days until a warmer temperature.', hint: 'Use a monotonic decreasing stack storing indices. When a warmer temp is found, pop all cooler temps from stack and record the difference in indices.', link: 'https://leetcode.com/problems/daily-temperatures/' },
  { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', desc: 'Find the largest rectangle that can be formed in a histogram.', hint: 'Use a monotonic increasing stack. When a bar shorter than the stack top is found, calculate area with popped bar as the height.', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
]

export default function Stacks() {
  return (
    <div className="content">
      <TopicHeader topic="stacks" title="📚 Stacks" subtitle="LIFO (Last In, First Out) — like a pile of plates. Push to top, pop from top." />

      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li><strong style={{ color: 'var(--blue)' }}>LIFO</strong> — Last element pushed is the first to be popped.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Push</strong> — Add to top. O(1). <strong style={{ color: 'var(--blue)' }}>Pop</strong> — Remove from top. O(1). <strong style={{ color: 'var(--blue)' }}>Peek</strong> — View top without removing. O(1).</li>
          <li><strong style={{ color: 'var(--blue)' }}>Monotonic Stack</strong> — A stack that's always increasing or decreasing. Key for "next greater element" problems.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Call Stack</strong> — How recursive function calls are managed internally.</li>
          <li><strong style={{ color: 'var(--blue)' }}>Use Cases</strong> — Undo operations, expression evaluation, DFS, balanced brackets.</li>
        </ul>
      </div>

      <div className="card">
        <h2>🎬 Stack Animation</h2>
        <p style={{ marginBottom: 12 }}>Push items onto the stack and pop them off. Notice how only the TOP element can be accessed.</p>
        <StackViz />
      </div>

      <div className="card">
        <h2>💻 Code Examples</h2>
        <CodeBlock codes={codes} />
      </div>

      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead><tr><th>Operation</th><th>Time</th><th>Space</th></tr></thead>
          <tbody>
            <tr><td>Push</td><td className="o1">O(1)</td><td className="on">O(n)</td></tr>
            <tr><td>Pop</td><td className="o1">O(1)</td><td>-</td></tr>
            <tr><td>Peek (Top)</td><td className="o1">O(1)</td><td>-</td></tr>
            <tr><td>Search</td><td className="on">O(n)</td><td>-</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} topic="stacks" />
      </div>
    </div>
  )
}
