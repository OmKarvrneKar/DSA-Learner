import { useState } from 'react'

export default function CodeBlock({ codes }) {
  // codes: { Python: '...', JavaScript: '...', 'C++': '...' }
  const langs = Object.keys(codes)
  const [active, setActive] = useState(langs[0])

  // Simple syntax highlighter
  function highlight(code, lang) {
    const keywords = lang === 'Python'
      ? ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'None', 'True', 'False', 'import', 'from', 'pass', 'self', 'print', 'len', 'range', 'append', 'pop']
      : ['function', 'class', 'return', 'if', 'else', 'for', 'while', 'let', 'const', 'var', 'new', 'this', 'null', 'true', 'false', 'void', 'int', 'bool', 'string', 'public', 'private', 'struct', 'nullptr', 'push_back', 'cout', 'endl', 'include', 'using', 'namespace', 'std', 'vector', 'queue', 'stack', 'auto', 'size']

    // Escape HTML
    let result = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Comments
    result = result.replace(/(\/\/.*|#.*)/g, '<span class="cm">$1</span>')
    // Strings
    result = result.replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>')
    // Numbers
    result = result.replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
    // Keywords
    keywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="kw">$1</span>')
    })

    return result
  }

  return (
    <div>
      <div className="code-tabs">
        {langs.map(l => (
          <button key={l} className={`code-tab${active === l ? ' active' : ''}`} onClick={() => setActive(l)}>
            {l === 'Python' ? '🐍' : l === 'JavaScript' ? '🟨' : '⚙️'} {l}
          </button>
        ))}
      </div>
      <div className="code-block">
        <pre dangerouslySetInnerHTML={{ __html: highlight(codes[active], active) }} />
      </div>
    </div>
  )
}
