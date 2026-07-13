import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, ChevronRight } from 'lucide-react'
import TopicHeader from '../components/TopicHeader'
import { AlgorithmLesson } from '../components/AlgorithmLesson'
import { VisualizerAPI } from '../engine/VisualizerAPI'
  const engine = useAnimationEngine(timeline, 800);

  const renderArray = (snapshot) => {
    if (!snapshot) return null;
    const { vars } = snapshot.payload;
    const isDone = snapshot.event === ANIMATION_EVENTS.COMPLETE;
    
    return (
      <div className="flex flex-wrap justify-center gap-2 relative min-h-[80px]">
        <AnimatePresence>
          {snapshot.state.map((val, i) => {
            const isMid = vars?.mid === i;
            const inRange = i >= vars?.lo && i <= vars?.hi;
            const isEliminated = !inRange && !isDone;
            const isFound = isDone && val === target && isMid; // hacky check for found
            
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
                {vars?.lo === i && !isFound && (
                  <motion.div layoutId="lo-ptr" className="absolute -bottom-7 text-[10px] font-bold text-indigo-400 flex flex-col items-center">
                    <ChevronRight className="-rotate-90" size={14} /> LO
                  </motion.div>
                )}
                {vars?.hi === i && !isFound && (
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
    );
  };

  return (
    <AlgorithmLesson 
      title="Binary Search"
      introduction="Binary search is an extremely efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item."
      analogy="Imagine looking for the word 'Algorithm' in a dictionary. You don't read page by page from the start. You open the book in the middle, realize 'A' comes before 'M', and instantly discard the entire second half of the book. You repeat this until you find the page."
      problemStatement="Given a sorted array of unique integers and a target integer, return the index if the target is found. If not, return -1."
      engine={engine}
      renderVisualization={renderArray}
      codeString={`def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`}
      variables={[
        {name: 'lo', desc: 'Left boundary'},
        {name: 'hi', desc: 'Right boundary'},
        {name: 'mid', desc: 'Middle index'}
      ]}
      complexity={{time: 'O(log n)', space: 'O(1)'}}
      quiz={[
        { question: 'Why must the array be sorted for binary search to work?', options: ['It uses less memory', 'So we can definitively eliminate half the elements', 'It makes the array smaller', 'It is a requirement of Python'], correct: 1 },
        { question: 'What is the maximum number of steps required to find an element in an array of size 16?', options: ['16', '8', '4', '5'], correct: 3 }
      ]}
      summary="By continuously halving the search space, Binary Search achieves logarithmic time complexity. It is the gold standard for searching static, sorted data."
    />
  )
}

export default function Arrays() {
  return (
    <div className="content">
      <TopicHeader topic="arrays" title="Arrays & Strings" subtitle="Interactive Lessons Powered by Animation Engine" icon={Box} />
      <BinarySearchLesson />
    </div>
  )
}
