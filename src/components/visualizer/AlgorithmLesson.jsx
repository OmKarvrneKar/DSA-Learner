import React, { useState } from 'react';
import { BookOpen, Lightbulb, Code2, Cpu, CheckCircle2, Target, HelpCircle, Variable, Zap, MessageSquareWarning, AlertTriangle, GraduationCap, Flame, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationControls } from './AnimationControls';
import CodeBlock from '../common/CodeBlock';
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
  const { activeSnapshot, totalSteps, isPlaying } = engine;
  
  const [activeQuiz, setActiveQuiz] = useState(0);
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
    <div className="flex flex-col gap-8 mb-16 border-b border-[var(--border-subtle)] pb-16">
      
      {/* 1. Introduction & 2. Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
           <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
             <BookOpen className="text-indigo-400" /> {title}
           </h2>
           <p className="text-[var(--text-muted)] leading-relaxed">{introduction}</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
           <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
             <Lightbulb size={20} /> Real-World Analogy
           </h3>
           <p className="text-amber-100/70 leading-relaxed">{analogy}</p>
        </div>
      </div>

      {/* 3. Problem Statement */}
      <div className="card border-l-4 border-l-indigo-500">
        <h3 className="text-lg font-bold text-white mb-2">Problem Statement</h3>
        <p className="text-[var(--text-muted)]">{problemStatement}</p>
      </div>

      {/* Interactive Storytelling Experience Container */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Canvas */}
        <div className="xl:col-span-3 flex flex-col">
          {/* 4. Visualization & 5. Step-by-step animation */}
          <div className="card !p-0 overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-2xl flex-1 flex flex-col">
            
            <VisualizationCanvas>
               {totalSteps > 0 && renderVisualization(activeSnapshot)}
            </VisualizationCanvas>
            
            {/* Controls block */}
            <div className="p-4 bg-black/40 border-b border-t border-[var(--border-subtle)] flex flex-col gap-3">
               <AnimationControls engine={engine} />
               <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                 <span className="flex items-center gap-1"><Keyboard size={12}/> Shortcuts:</span>
                 <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">SPACE</kbd> Play/Pause</span>
                 <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">←</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">→</kbd> Step</span>
               </div>
            </div>

            {/* 6. Code walkthrough & 7. Variable explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
              <div className="lg:col-span-2 p-6 font-mono text-[13px] bg-[#0d1117] overflow-x-auto relative">
                 <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                    <Code2 size={14}/> Live Execution
                 </div>
                 <pre className="text-gray-300 leading-loose">
                   {codeString.split('\n').map((line, idx) => {
                     const isHighlighted = activeSnapshot?.payload?.line === idx + 1;
                     return (
                       <div key={idx} className={`px-4 py-0.5 -mx-4 rounded transition-colors ${isHighlighted ? 'bg-indigo-500/20 border-l-2 border-indigo-400 text-indigo-300' : 'border-l-2 border-transparent'}`}>
                         <span className="text-gray-600 mr-4 select-none">{idx + 1}</span>
                         {line}
                       </div>
                     )
                   })}
                 </pre>
              </div>
              <div className="p-6 bg-black/20">
                 <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                   <Variable size={16} className="text-pink-400"/> Variables Snapshot
                 </h4>
                 <div className="flex flex-col gap-3">
                   {variables.map((v, i) => (
                     <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                       <div>
                         <span className="font-mono text-pink-400 font-bold">{v.name}</span>
                         <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{v.desc}</p>
                       </div>
                       <div className="font-mono text-white text-lg font-bold bg-black/50 px-3 py-1 rounded">
                         {activeSnapshot?.payload?.vars?.[v.name] ?? '-'}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Instructor Panel (Storytelling Sidebar) */}
        <div className="xl:col-span-1">
           <div className="card h-full bg-gradient-to-b from-indigo-950/40 to-black/40 border-indigo-500/20 sticky top-24 flex flex-col gap-6">
             
             <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <GraduationCap className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Live Professor</h3>
                  <p className="text-xs text-indigo-300 font-medium">Synchronized Teaching</p>
                </div>
             </div>
             
             <AnimatePresence mode="wait">
               <motion.div 
                 key={engine.currentStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.2 }}
                 className="flex-1 flex flex-col gap-5"
               >
                 
                 {/* What & Why Bubble */}
                 <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 text-sm shadow-lg">
                    {/* Speech pointer */}
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-white/5 border-l border-t border-white/10 rotate-[-45deg]" />
                    <strong className="text-white block mb-1 text-base">{activeSnapshot?.message || "Standing by..."}</strong>
                    {instructor.what && (
                      <p className="text-indigo-200/80 mt-3 flex gap-2 items-start"><span className="text-indigo-400 font-bold">What:</span> {instructor.what}</p>
                    )}
                    {instructor.why && (
                      <p className="text-indigo-200/80 mt-2 flex gap-2 items-start"><span className="text-indigo-400 font-bold">Why:</span> {instructor.why}</p>
                    )}
                 </div>

                 {/* Warning / Common Mistake */}
                 {instructor.warning && (
                   <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm flex gap-3 items-start">
                     <AlertTriangle className="text-rose-400 shrink-0" size={18} />
                     <div>
                       <strong className="text-rose-200 block mb-1">Common Mistake</strong>
                       <p className="text-rose-200/70">{instructor.warning}</p>
                     </div>
                   </div>
                 )}

                 {/* Interview Tip / Optimization */}
                 {instructor.tip && (
                   <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm flex gap-3 items-start">
                     <Flame className="text-amber-400 shrink-0" size={18} />
                     <div>
                       <strong className="text-amber-200 block mb-1">Interview Tip</strong>
                       <p className="text-amber-200/70">{instructor.tip}</p>
                     </div>
                   </div>
                 )}
                 
               </motion.div>
             </AnimatePresence>
             
           </div>
        </div>

      </div>

      {/* 8. Complexity Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="card flex items-center gap-4 border-l-4 border-l-emerald-500">
           <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Zap size={24}/></div>
           <div>
             <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">Time Complexity</h4>
             <p className="text-2xl font-mono font-bold text-white">{complexity.time}</p>
           </div>
        </div>
        <div className="card flex items-center gap-4 border-l-4 border-l-blue-500">
           <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Cpu size={24}/></div>
           <div>
             <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">Space Complexity</h4>
             <p className="text-2xl font-mono font-bold text-white">{complexity.space}</p>
           </div>
        </div>
      </div>

      {/* 9. Interactive Practice */}
      {practiceProblems && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-rose-400" /> Practice Integration
          </h2>
          <ProblemList problems={practiceProblems} />
        </div>
      )}

      {/* 10. Quiz */}
      {quiz && (
        <div className="card bg-indigo-950/20 border-indigo-500/20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-400" /> Knowledge Check
          </h2>
          
          {quizScore !== null ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                <span className="text-3xl font-bold">{quizScore}/{quiz.length}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quiz Completed!</h3>
              <button onClick={() => {setQuizScore(null); setSelectedAnswers({});}} className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold mt-4 underline">Try Again</button>
            </div>
          ) : (
            <div className="space-y-6">
              {quiz.map((q, i) => (
                <div key={i} className="space-y-3">
                  <p className="font-medium text-white">{i + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, j) => (
                      <button 
                        key={j}
                        onClick={() => setSelectedAnswers(prev => ({...prev, [i]: j}))}
                        className={`p-3 text-left rounded-lg border transition-colors ${selectedAnswers[i] === j ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200' : 'bg-black/20 border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-white/5'}`}
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
                className="btn btn-primary w-full py-3 mt-4 disabled:opacity-50"
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      )}

      {/* 11. Summary */}
      <div className="card bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
          <CheckCircle2 /> Key Takeaways
        </h3>
        <p className="text-emerald-100/80 leading-relaxed font-medium">{summary}</p>
      </div>

    </div>
  );
}
