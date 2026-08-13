import React, { useState } from 'react';
import { BookOpen, Lightbulb, Code2, Cpu, CheckCircle2, Target, HelpCircle, Variable, Zap, AlertTriangle, GraduationCap, Flame, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationControls } from './AnimationControls';
import ProblemList from '../common/ProblemList';
import { VisualizationCanvas } from './VisualizationCanvas';

/**
 * A comprehensive, educational layout for any algorithm featuring a Live Instructor.
 */
export function AlgorithmLesson({ 
  title, 
  introduction, 
  analogy, 
  problemStatement,
  engine,
  renderVisualization,
  codeString,
  variables,
  complexity,
  practiceProblems,
  quiz,
  summary
}) {
  const { activeSnapshot, totalSteps } = engine;
  
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleQuizSubmit = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
  };

  const instructor = activeSnapshot?.instructor || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '64px' }}>
      
      {/* 1. Introduction & 2. Analogy */}
      <div className="lesson-intro-grid">
        <div className="card">
           <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
             <BookOpen style={{ color: '#818cf8' }} /> {title}
           </h2>
           <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{introduction}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.05))', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '12px' }}>
             <Lightbulb size={20} /> Real-World Analogy
           </h3>
           <p style={{ color: 'rgba(253, 230, 138, 0.7)', lineHeight: '1.6' }}>{analogy}</p>
        </div>
      </div>

      {/* 3. Problem Statement */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Problem Statement</h3>
        <p style={{ color: 'var(--text-muted)' }}>{problemStatement}</p>
      </div>

      {/* Interactive Storytelling Experience Container */}
      <div className="lesson-main-grid">
        
        {/* Main Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 4. Visualization & 5. Step-by-step animation */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            
            <VisualizationCanvas>
               {totalSteps > 0 && renderVisualization(activeSnapshot)}
            </VisualizationCanvas>
            
            {/* Controls block */}
            <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <AnimationControls engine={engine} />
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Keyboard size={12}/> Shortcuts:</span>
                 <span><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>SPACE</kbd> Play/Pause</span>
                 <span><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>←</kbd> <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>→</kbd> Step</span>
               </div>
            </div>

            {/* 6. Code walkthrough & 7. Variable explanation */}
            <div className="lesson-code-grid">
              <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '13px', backgroundColor: '#0d1117', overflowX: 'auto', position: 'relative', flex: 2 }}>
                 <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code2 size={14}/> Live Execution
                 </div>
                 <pre style={{ color: '#d1d5db', lineHeight: '2' }}>
                   {codeString.split('\n').map((line, idx) => {
                     const isHighlighted = activeSnapshot?.payload?.line === idx + 1;
                     return (
                       <div key={idx} style={{ padding: '2px 16px', marginLeft: '-16px', marginRight: '-16px', borderRadius: '4px', transition: 'background-color 0.2s', display: 'flex', backgroundColor: isHighlighted ? 'rgba(99, 102, 241, 0.2)' : 'transparent', borderLeft: isHighlighted ? '2px solid #818cf8' : '2px solid transparent', color: isHighlighted ? '#a5b4fc' : 'inherit' }}>
                         <span style={{ color: '#4b5563', marginRight: '16px', userSelect: 'none', width: '20px', textAlign: 'right' }}>{idx + 1}</span>
                         {line}
                       </div>
                     )
                   })}
                 </pre>
              </div>
              
              <div style={{ padding: '24px', backgroundColor: 'rgba(0, 0, 0, 0.2)', flex: 1 }}>
                 <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                   <Variable size={16} style={{ color: '#ec4899' }}/> Variables Snapshot
                 </h4>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {variables.map((v, i) => {
                     const val = activeSnapshot?.payload?.vars?.[v.name];
                     const hasValue = val !== undefined && val !== null;
                     
                     return (
                       <div key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                           <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#f472b6' }}>{v.name}</span>
                           <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold', color: hasValue ? '#38bdf8' : '#6b7280' }}>
                             {hasValue ? (typeof val === 'object' ? JSON.stringify(val) : String(val)) : '—'}
                           </span>
                         </div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.description}</div>
                       </div>
                     )
                   })}
                 </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Live Instructor Panel (Storytelling Sidebar) */}
        <div>
           <div className="card" style={{ height: '100%', background: 'linear-gradient(to bottom, rgba(49, 46, 129, 0.2), rgba(0, 0, 0, 0.4))', borderColor: 'rgba(99, 102, 241, 0.2)', position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <GraduationCap style={{ color: '#818cf8' }} size={24} />
                 </div>
                 <div>
                   <h3 style={{ fontWeight: 'bold', color: 'white', lineHeight: '1.2' }}>Live Professor</h3>
                   <p style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: '500' }}>Synchronized Teaching</p>
                 </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={engine.currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}
                >
                  
                  {/* What & Why Bubble */}
                  <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', fontSize: '14px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}>
                     {/* Speech pointer */}
                     <div style={{ position: 'absolute', left: '-8px', top: '16px', width: '16px', height: '16px', background: 'rgba(15, 23, 42, 0.8)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', transform: 'rotate(-45deg)' }} />
                     <strong style={{ color: 'white', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>{activeSnapshot?.message || "Standing by..."}</strong>
                     {instructor.what && (
                       <p style={{ color: 'rgba(199, 210, 254, 0.8)', marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#818cf8', fontWeight: 'bold' }}>What:</span> {instructor.what}</p>
                     )}
                     {instructor.why && (
                       <p style={{ color: 'rgba(199, 210, 254, 0.8)', marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#818cf8', fontWeight: 'bold' }}>Why:</span> {instructor.why}</p>
                     )}
                  </div>

                  {/* Warning / Common Mistake */}
                  {instructor.warning && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', fontSize: '14px' }}>
                      <AlertTriangle style={{ color: '#f87171', flexShrink: 0 }} size={18} />
                      <div>
                        <strong style={{ color: '#fecdd3', display: 'block', marginBottom: '4px' }}>Common Mistake</strong>
                        <p style={{ color: 'rgba(254, 205, 211, 0.7)' }}>{instructor.warning}</p>
                      </div>
                    </div>
                  )}

                  {/* Interview Tip / Optimization */}
                  {instructor.tip && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '16px', fontSize: '14px' }}>
                      <Flame style={{ color: '#fbbf24', flexShrink: 0 }} size={18} />
                      <div>
                        <strong style={{ color: '#fde68a', display: 'block', marginBottom: '4px' }}>Interview Tip</strong>
                        <p style={{ color: 'rgba(253, 230, 138, 0.7)' }}>{instructor.tip}</p>
                      </div>
                    </div>
                  )}
                  
                </motion.div>
              </AnimatePresence>
              
            </div>
         </div>

      </div>

      {/* 8. Complexity Analysis */}
      <div className="lesson-complexity-grid mt-6">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--success)' }}>
           <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#34d399' }}><Zap size={24}/></div>
           <div>
             <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>Time Complexity</h4>
             <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'white' }}>{complexity.time}</p>
           </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--info)' }}>
           <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#60a5fa' }}><Cpu size={24}/></div>
           <div>
             <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>Space Complexity</h4>
             <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'white' }}>{complexity.space}</p>
           </div>
        </div>
      </div>

      {/* 9. Interactive Practice */}
      {practiceProblems && (
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target style={{ color: '#f87171' }} /> Practice Integration
          </h2>
          <ProblemList problems={practiceProblems} />
        </div>
      )}

      {/* 10. Quiz */}
      {quiz && (
        <div className="card" style={{ background: 'rgba(49, 46, 129, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle style={{ color: '#818cf8' }} /> Knowledge Check
          </h2>
          
          {quizScore !== null ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{quizScore}/{quiz.length}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Quiz Completed!</h3>
              <button onClick={() => {setQuizScore(null); setSelectedAnswers({});}} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem', fontWeight: '600', marginTop: '16px' }}>Try Again</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {quiz.map((q, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontWeight: '500', color: 'white' }}>{i + 1}. {q.question}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {q.options.map((opt, j) => (
                      <button 
                        key={j}
                        onClick={() => setSelectedAnswers(prev => ({...prev, [i]: j}))}
                        className={`p-3 text-left rounded-lg border transition-colors ${selectedAnswers[i] === j ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200' : 'bg-black/20 border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-white/5'}`}
                        style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', transition: 'all 0.2s', cursor: 'pointer' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={handleQuizSubmit}
                disabled={Object.keys(selectedAnswers).length < quiz.length}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '16px', opacity: Object.keys(selectedAnswers).length < quiz.length ? 0.5 : 1 }}
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      )}

      {/* 11. Summary */}
      <div className="card" style={{ background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 /> Key Takeaways
        </h3>
        <p style={{ color: 'rgba(209, 250, 229, 0.8)', lineHeight: '1.6', fontWeight: '500' }}>{summary}</p>
      </div>

    </div>
  );
}
