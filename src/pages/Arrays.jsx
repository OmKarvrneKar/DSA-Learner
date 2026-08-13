import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, ChevronRight } from 'lucide-react'
import TopicHeader from '../components/common/TopicHeader'
import { AlgorithmLesson } from '../components/visualizer/AlgorithmLesson'
import { VisualizerAPI } from '../engine/VisualizerAPI'
import { useAnimationEngine } from '../engine/useAnimationEngine'
import { ANIMATION_EVENTS } from '../engine/EventTypes'

// ==========================================
// BINARY SEARCH LOGIC & GENERATOR
// ==========================================
function generateBinarySearchTimeline(arr, target) {
  const api = new VisualizerAPI(arr);
  let lo = 0;
  let hi = arr.length - 1;
  let foundIdx = -1;

  api.customEvent(ANIMATION_EVENTS.START, { line: 2, vars: { lo, hi, mid: '-' } }, null, 
    `Initial search space: [0...${hi}]`,
    {
      what: "Setting up two pointers: 'lo' at the start and 'hi' at the end of the array.",
      why: "We need boundaries to define which part of the array we are currently searching.",
      tip: "Binary search ONLY works on sorted arrays. Always clarify if the array is sorted in an interview."
    }
  );

  while (lo <= hi) {
    let mid = Math.floor((lo + hi) / 2);
    api.customEvent(ANIMATION_EVENTS.UPDATE_VARIABLE, { line: 3, vars: { lo, hi, mid } }, null, 
      `Calculate mid = (${lo} + ${hi}) / 2 = ${mid}`,
      {
        what: `Calculated the midpoint index to be ${mid}.`,
        why: "By checking the middle element, we can immediately discard half of our remaining search space.",
        warning: "In languages like C++ or Java, (lo + hi) / 2 can cause integer overflow! Use lo + (hi - lo) / 2 instead."
      }
    );
    
    api.customEvent(ANIMATION_EVENTS.COMPARE, { line: 4, vars: { lo, hi, mid } }, null, 
      `Comparing arr[${mid}] (${arr[mid]}) with target ${target}`,
      {
        what: `Checking if our target ${target} is exactly at the middle index ${mid}.`,
        why: "If we're lucky, the middle element is exactly what we are looking for."
      }
    );
    
    if (arr[mid] === target) {
      api.customEvent(ANIMATION_EVENTS.COMPLETE, { line: 5, vars: { lo, hi, mid } }, null, 
        `✅ Found ${target} at index ${mid}!`,
        {
          what: `Match found! Returning the index ${mid}.`,
          why: "The algorithm successfully completed its objective.",
          tip: "O(log n) time complexity is achieved because we cut the problem size in half every step!"
        }
      );
      foundIdx = mid;
      break;
    } else if (arr[mid] < target) {
      api.customEvent(ANIMATION_EVENTS.UPDATE_VARIABLE, { line: 6, vars: { lo, hi, mid } }, null, 
        `arr[${mid}] < ${target}, searching RIGHT half.`,
        {
          what: `The middle value ${arr[mid]} is smaller than our target ${target}.`,
          why: "Because the array is sorted, everything to the left of 'mid' is also smaller. We can completely ignore the left half!"
        }
      );
      lo = mid + 1;
      api.customEvent(ANIMATION_EVENTS.MOVE_POINTER, { line: 7, vars: { lo, hi, mid } }, null, 
        `Updated lo to ${lo}`,
        {
          what: `Moved the 'lo' pointer to mid + 1 (index ${lo}).`,
          why: "We are now exclusively searching the right half of the remaining array."
        }
      );
    } else {
      api.customEvent(ANIMATION_EVENTS.UPDATE_VARIABLE, { line: 8, vars: { lo, hi, mid } }, null, 
        `arr[${mid}] > ${target}, searching LEFT half.`,
        {
          what: `The middle value ${arr[mid]} is greater than our target ${target}.`,
          why: "Because the array is sorted, everything to the right is also greater. We can ignore the right half."
        }
      );
      hi = mid - 1;
      api.customEvent(ANIMATION_EVENTS.MOVE_POINTER, { line: 9, vars: { lo, hi, mid } }, null, 
        `Updated hi to ${hi}`,
        {
          what: `Moved the 'hi' pointer to mid - 1 (index ${hi}).`,
          why: "We are now exclusively searching the left half of the remaining array."
        }
      );
    }
  }

  if (foundIdx === -1) {
    api.customEvent(ANIMATION_EVENTS.COMPLETE, { line: 10, vars: { lo, hi: hi, mid: '-' } }, null, 
      `❌ ${target} not found. Search space empty.`,
      {
        what: "The 'lo' pointer has crossed the 'hi' pointer (lo > hi). The loop terminates.",
        why: "A crossed pointer state means our search space has shrunk to 0 elements. The target does not exist.",
        tip: "Returning -1 is standard practice when an element is not found."
      }
    );
  }

  return api.getTimeline();
}

const BINARY_SEARCH_ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const BINARY_SEARCH_TARGET = 23;

function BinarySearchLesson() {
  const [arrayInput, setArrayInput] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [targetInput, setTargetInput] = useState('23');
  const [currentParams, setCurrentParams] = useState({
    array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
    target: 23
  });

  const timeline = useMemo(() => generateBinarySearchTimeline(currentParams.array, currentParams.target), [currentParams]);
  const engine = useAnimationEngine(timeline, 800);

  const handleApply = (e) => {
    e?.preventDefault();
    const arr = arrayInput
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(Number)
      .filter(x => !isNaN(x));
    
    // Sort array as binary search requires sorted array
    arr.sort((a, b) => a - b);
    
    // Update array input field to show sorted order
    setArrayInput(arr.join(', '));
    
    const tgt = Number(targetInput.trim());
    if (isNaN(tgt)) return;

    setCurrentParams({ array: arr, target: tgt });
  };

  const renderArray = (snapshot) => {
    if (!snapshot) return null;
    const { vars } = snapshot.payload;
    const isDone = snapshot.event === ANIMATION_EVENTS.COMPLETE;
    
    return (
      <div className="viz-boxes" style={{ position: 'relative', minHeight: '100px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', padding: '30px 0' }}>
        <AnimatePresence>
          {snapshot.state.map((val, i) => {
            const isMid = vars?.mid === i;
            const inRange = i >= vars?.lo && i <= vars?.hi;
            const isEliminated = !inRange && !isDone;
            const isFound = isDone && val === currentParams.target && isMid; // hacky check for found
            
            return (
              <motion.div 
                layout
                key={i} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: isEliminated ? 0.2 : 1 }}
                style={{ position: 'relative' }}
                className={`viz-box ${
                  isFound ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                  isMid ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50' :
                  inRange ? 'bg-indigo-500/10 text-white border border-indigo-500/30' :
                  'bg-white/5 text-[var(--text-muted)] border border-transparent'
                }`}
              >
                {val}
                
                {/* Pointers */}
                {vars?.lo === i && !isFound && (
                  <motion.div
                    layoutId="lo-ptr"
                    style={{
                      position: 'absolute',
                      bottom: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#818cf8',
                      lineHeight: '1'
                    }}
                  >
                    <ChevronRight style={{ transform: 'rotate(-90deg)' }} size={14} /> LO
                  </motion.div>
                )}
                {vars?.hi === i && !isFound && (
                  <motion.div
                    layoutId="hi-ptr"
                    style={{
                      position: 'absolute',
                      top: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#818cf8',
                      lineHeight: '1'
                    }}
                  >
                    HI <ChevronRight style={{ transform: 'rotate(90deg)' }} size={14} />
                  </motion.div>
                )}
                {isMid && !isFound && (
                  <motion.div
                    layoutId="mid-ptr"
                    style={{
                      position: 'absolute',
                      bottom: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      lineHeight: '1'
                    }}
                  >
                    <ChevronRight style={{ transform: 'rotate(-90deg)' }} size={14} /> MID
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    );
  };

  const customControls = (
    <form onSubmit={handleApply} style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Array (Sorted)</label>
        <input 
          type="text" 
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="e.g. 2, 5, 8, 12, 16"
          style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100px' }}>
        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target</label>
        <input 
          type="text" 
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          placeholder="23"
          style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', textAlign: 'center' }}
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-primary"
        style={{ padding: '10px 20px', alignSelf: 'flex-end', height: '40px' }}
      >
        Simulate
      </button>
    </form>
  );

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
      customControls={customControls}
    />
  )
}

// ==========================================
// TWO POINTERS (REVERSE STRING) LOGIC & GENERATOR
// ==========================================
function generateReverseStringTimeline(str) {
  const arr = str.split('');
  const api = new VisualizerAPI(arr);
  let left = 0;
  let right = arr.length - 1;

  api.customEvent(ANIMATION_EVENTS.START, { line: 2, vars: { left, right } }, null, 
    `Initial string: "${str}"`,
    {
      what: "Setting up two pointers: 'left' at the start and 'right' at the end.",
      why: "We swap characters from the outside inwards.",
      tip: "Two pointers is a common technique for array and string problems."
    }
  );

  while (left < right) {
    api.customEvent(ANIMATION_EVENTS.COMPARE, { line: 3, vars: { left, right } }, null, 
      `Preparing to swap '${arr[left]}' and '${arr[right]}'`,
      {
        what: `Looking at characters at index ${left} and ${right}.`
      }
    );
    
    // Swap using API
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    api.swap(left, right, 
      `Swapped! String is now: "${arr.join('')}"`,
      {
        what: "Characters swapped successfully."
      }
    );

    left++;
    right--;

    api.customEvent(ANIMATION_EVENTS.MOVE_POINTER, { line: 4, vars: { left, right } }, null, 
      `Moved left to ${left}, right to ${right}`,
      {
        what: "Moved pointers inwards."
      }
    );
  }

  api.customEvent(ANIMATION_EVENTS.COMPLETE, { line: 5, vars: { left, right } }, null, 
    `✅ Reversal complete! Result: "${arr.join('')}"`,
    {
      what: "Pointers have crossed. Reversal is finished.",
      tip: "Time complexity: O(n), Space complexity: O(1)."
    }
  );

  return api.getTimeline();
}

const REVERSE_STRING_INPUT = "ALGORITHM";

function ReverseStringLesson() {
  const [stringInput, setStringInput] = useState('ALGORITHM');
  const [currentStr, setCurrentStr] = useState('ALGORITHM');

  const timeline = useMemo(() => generateReverseStringTimeline(currentStr), [currentStr]);
  const engine = useAnimationEngine(timeline, 800);

  const handleApplyStr = (e) => {
    e?.preventDefault();
    const cleanStr = stringInput.trim();
    if (!cleanStr) return;
    setCurrentStr(cleanStr);
  };

  const renderArray = (snapshot) => {
    if (!snapshot) return null;
    const { vars } = snapshot.payload;
    const isDone = snapshot.event === ANIMATION_EVENTS.COMPLETE;
    
    return (
      <div className="viz-boxes" style={{ position: 'relative', minHeight: '100px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', padding: '30px 0' }}>
        <AnimatePresence>
          {snapshot.state.map((char, i) => {
            const isLeft = vars?.left === i;
            const isRight = vars?.right === i;
            const isSwapping = (snapshot.event === ANIMATION_EVENTS.SWAP || snapshot.event === ANIMATION_EVENTS.COMPARE) && (isLeft || isRight);
            
            return (
              <motion.div 
                layout
                key={i} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ position: 'relative' }}
                className={`viz-box ${
                  isDone ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50' :
                  isSwapping ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50' :
                  (isLeft || isRight) ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/50' :
                  'bg-white/5 text-[var(--text-muted)] border border-transparent'
                }`}
              >
                {char}
                
                {/* Pointers */}
                {isLeft && !isDone && (
                  <motion.div
                    layoutId="left-ptr"
                    style={{
                      position: 'absolute',
                      bottom: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#818cf8',
                      lineHeight: '1'
                    }}
                  >
                    <ChevronRight style={{ transform: 'rotate(-90deg)' }} size={14} /> L
                  </motion.div>
                )}
                {isRight && !isDone && (
                  <motion.div
                    layoutId="right-ptr"
                    style={{
                      position: 'absolute',
                      top: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#818cf8',
                      lineHeight: '1'
                    }}
                  >
                    R <ChevronRight style={{ transform: 'rotate(90deg)' }} size={14} />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    );
  };

  const customControls = (
    <form onSubmit={handleApplyStr} style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input String</label>
        <input 
          type="text" 
          value={stringInput}
          onChange={(e) => setStringInput(e.target.value)}
          placeholder="e.g. ALGORITHM"
          style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }}
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-primary"
        style={{ padding: '10px 20px', alignSelf: 'flex-end', height: '40px' }}
      >
        Simulate
      </button>
    </form>
  );

  return (
    <AlgorithmLesson 
      title="Reverse String (Two Pointers)"
      introduction="The Two Pointer technique is extremely useful for arrays and strings. A classic problem is reversing a string in-place."
      analogy="Imagine two people standing at opposite ends of a line. They swap places, then step one pace towards each other, and repeat until they meet in the middle."
      problemStatement="Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory."
      engine={engine}
      renderVisualization={renderArray}
      codeString={`def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`}
      variables={[
        {name: 'left', desc: 'Left pointer'},
        {name: 'right', desc: 'Right pointer'}
      ]}
      complexity={{time: 'O(n)', space: 'O(1)'}}
      quiz={[
        { question: 'Why is the space complexity O(1)?', options: ['It uses an extra array', 'It only uses two pointers for variables', 'Because strings are small', 'It modifies the DOM'], correct: 1 },
        { question: 'When does the loop terminate?', options: ['When left > right', 'When left >= right', 'When the string is empty', 'When left == right - 1'], correct: 1 }
      ]}
      summary="The two-pointer technique allows us to process elements from both ends simultaneously, reducing time and space complexity."
      customControls={customControls}
    />
  )
}

export default function Arrays() {
  return (
    <div className="content">
      <TopicHeader topic="arrays" title="Arrays & Strings" subtitle="Interactive Lessons Powered by Animation Engine" icon={Box} />
      <div className="flex flex-col gap-12">
        <BinarySearchLesson />
        <ReverseStringLesson />
      </div>
    </div>
  )
}
