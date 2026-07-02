import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import ProblemList from '../components/ProblemList'
import TopicHeader from '../components/TopicHeader'

// ─── Activity Selection Visualization ────────────────────────────────────────
// 6 activities: { name, start, finish }
const ACTIVITIES_RAW = [
  { name: 'A', start: 1, finish: 4 },
  { name: 'B', start: 3, finish: 5 },
  { name: 'C', start: 0, finish: 6 },
  { name: 'D', start: 5, finish: 7 },
  { name: 'E', start: 3, finish: 9 },
  { name: 'F', start: 6, finish: 10 },
  { name: 'G', start: 8, finish: 11 },
]

// Pre-sort by finish time (greedy criterion)
const ACTIVITIES = [...ACTIVITIES_RAW].sort((a, b) => a.finish - b.finish)

// Pre-compute which activities the greedy picks (so animation mirrors logic)
function computeGreedySteps(acts) {
  const steps = [] // each step: { selected: Set<name>, rejected: Set<name>, considering: name, lastFinish: number }
  const selected = new Set()
  const rejected = new Set()
  let lastFinish = -Infinity

  for (const act of acts) {
    if (act.start >= lastFinish) {
      selected.add(act.name)
      lastFinish = act.finish
      steps.push({
        considering: act.name,
        selected: new Set(selected),
        rejected: new Set(rejected),
        lastFinish,
        action: 'select',
      })
    } else {
      rejected.add(act.name)
      steps.push({
        considering: act.name,
        selected: new Set(selected),
        rejected: new Set(rejected),
        lastFinish,
        action: 'reject',
      })
    }
  }
  return steps
}

const GREEDY_STEPS = computeGreedySteps(ACTIVITIES)
const TIMELINE_MAX = 12
const COLORS = {
  idle: 'var(--bg2)',
  considering: 'var(--yellow)',
  selected: 'var(--green)',
  rejected: '#e55',
}

function ActivitySelectionViz() {
  const [stepIdx, setStepIdx] = useState(-1) // -1 = not started
  const [status, setStatus] = useState(
    'Activities are sorted by finish time. Press "Run Greedy" to select one by one.'
  )

  const current = stepIdx >= 0 ? GREEDY_STEPS[stepIdx] : null
  const isDone = stepIdx >= GREEDY_STEPS.length - 1

  function handleStep() {
    const next = stepIdx + 1
    if (next >= GREEDY_STEPS.length) return
    const s = GREEDY_STEPS[next]
    setStepIdx(next)
    if (s.action === 'select') {
      setStatus(
        `Selected activity ${s.considering} (${ACTIVITIES[next].start}–${ACTIVITIES[next].finish}): ` +
          `starts at ${ACTIVITIES[next].start} >= last finish ${stepIdx >= 0 ? GREEDY_STEPS[stepIdx].lastFinish : 0}, no conflict.`
      )
    } else {
      setStatus(
        `Skipped activity ${s.considering} (${ACTIVITIES[next].start}–${ACTIVITIES[next].finish}): ` +
          `starts at ${ACTIVITIES[next].start} < last finish ${GREEDY_STEPS[next - 1]?.lastFinish ?? 0}, conflict!`
      )
    }
    if (next === GREEDY_STEPS.length - 1) {
      const sel = [...GREEDY_STEPS[next].selected].join(', ')
      setStatus(
        `Done! Optimal selection: {${sel}} — ${GREEDY_STEPS[next].selected.size} non-overlapping activities.`
      )
    }
  }

  function handleReset() {
    setStepIdx(-1)
    setStatus('Activities are sorted by finish time. Press "Run Greedy" to select one by one.')
  }

  // Determine color for each activity bar
  function barColor(act) {
    if (!current) return COLORS.idle
    if (current.selected.has(act.name) && current.considering === act.name) return COLORS.selected
    if (current.rejected.has(act.name) && current.considering === act.name) return COLORS.rejected
    if (current.selected.has(act.name)) return COLORS.selected
    if (current.rejected.has(act.name)) return COLORS.rejected
    return COLORS.idle
  }

  function barBorder(act) {
    if (current && current.considering === act.name) return '2px solid var(--accent)'
    return '1px solid var(--border)'
  }

  // Width of timeline in pixels (relative units via %)
  const pct = (v) => `${(v / TIMELINE_MAX) * 100}%`

  return (
    <div className="viz-container">
      {/* Timeline header */}
      <div
        style={{
          position: 'relative',
          height: 20,
          marginBottom: 4,
          marginLeft: 28,
          marginRight: 4,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {Array.from({ length: TIMELINE_MAX + 1 }, (_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: pct(i),
              transform: 'translateX(-50%)',
              fontSize: '0.65rem',
              color: 'var(--text2)',
            }}
          >
            {i}
          </span>
        ))}
      </div>

      {/* Activity bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {ACTIVITIES.map((act) => (
          <div key={act.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Label */}
            <div
              style={{
                width: 22,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text)',
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {act.name}
            </div>
            {/* Track */}
            <div style={{ flex: 1, position: 'relative', height: 26, background: 'var(--bg)', borderRadius: 4 }}>
              {/* Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: pct(act.start),
                  width: `calc(${pct(act.finish - act.start)} - 2px)`,
                  height: '100%',
                  background: barColor(act),
                  border: barBorder(act),
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  transition: 'background 0.3s, border 0.3s',
                }}
              >
                {act.start}–{act.finish}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sorted-by-finish note */}
      <div
        style={{
          fontSize: '0.72rem',
          color: 'var(--text2)',
          textAlign: 'center',
          marginBottom: 8,
          fontStyle: 'italic',
        }}
      >
        Sorted by finish time: {ACTIVITIES.map((a) => `${a.name}(${a.finish})`).join(' → ')}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          justifyContent: 'center',
          fontSize: '0.75rem',
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: COLORS.selected, label: 'Selected' },
          { color: COLORS.rejected, label: 'Rejected (conflict)' },
          { color: COLORS.considering, label: 'Considering' },
          { color: COLORS.idle, label: 'Not yet visited' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                background: color,
                border: '1px solid var(--border)',
                borderRadius: 3,
              }}
            />
            {label}
          </span>
        ))}
      </div>

      <div className="viz-controls">
        <button className="btn btn-primary" onClick={handleStep} disabled={isDone && stepIdx >= 0}>
          {stepIdx < 0 ? 'Run Greedy ▶' : isDone ? 'Done!' : 'Next Activity →'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div
        className={`viz-status${isDone && stepIdx >= 0 ? ' success' : stepIdx >= 0 ? ' info' : ''}`}
      >
        {status}
      </div>

      {/* Selected count */}
      {current && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text2)',
            marginTop: 4,
          }}
        >
          Selected so far:{' '}
          <strong style={{ color: 'var(--green)' }}>
            {[...current.selected].join(', ') || 'none'}
          </strong>
          {' · '}Step {stepIdx + 1} / {GREEDY_STEPS.length}
        </div>
      )}
    </div>
  )
}

// ─── Code Examples ────────────────────────────────────────────────────────────
const codes = {
  Python: `# ── 1. Activity Selection — sort by finish time ───────
def activity_selection(activities):
    # Greedy choice: always pick the activity that finishes earliest
    # and does not conflict with the last selected one.
    sorted_acts = sorted(activities, key=lambda x: x[1])  # sort by finish
    selected = []
    last_finish = float('-inf')

    for start, finish, name in sorted_acts:
        if start >= last_finish:       # no conflict
            selected.append(name)
            last_finish = finish       # update last finish time
    return selected

acts = [(1,4,'A'),(3,5,'B'),(0,6,'C'),(5,7,'D'),(3,9,'E'),(6,10,'F'),(8,11,'G')]
print(activity_selection(acts))  # ['A', 'D', 'F', 'G']


# ── 2. Jump Game — greedy reach ────────────────────────
# Can you reach the last index?
# Greedy: track the farthest index reachable so far.
def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False          # position i is unreachable
        max_reach = max(max_reach, i + jump)
    return True

print(can_jump([2, 3, 1, 1, 4]))  # True
print(can_jump([3, 2, 1, 0, 4]))  # False


# ── 3. Fractional Knapsack ────────────────────────────
# Greedy: take items with highest value-per-weight first.
def fractional_knapsack(capacity, items):
    # items: list of (value, weight)
    # Sort by value/weight ratio descending
    items = sorted(items, key=lambda x: x[0] / x[1], reverse=True)
    total_value = 0.0

    for value, weight in items:
        if capacity <= 0:
            break
        take = min(weight, capacity)   # take all or fraction
        total_value += take * (value / weight)
        capacity -= take

    return total_value

items = [(60, 10), (100, 20), (120, 30)]  # (value, weight)
print(fractional_knapsack(50, items))  # 240.0`,

  JavaScript: `// ── 1. Activity Selection — sort by finish time ───────
function activitySelection(activities) {
  // Sort by finish time — the greedy criterion
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const selected = [];
  let lastFinish = -Infinity;

  for (const act of sorted) {
    if (act.start >= lastFinish) {   // no conflict
      selected.push(act.name);
      lastFinish = act.finish;
    }
  }
  return selected;
}

const acts = [
  { start: 1, finish: 4, name: 'A' }, { start: 3, finish: 5, name: 'B' },
  { start: 0, finish: 6, name: 'C' }, { start: 5, finish: 7, name: 'D' },
  { start: 3, finish: 9, name: 'E' }, { start: 6, finish: 10, name: 'F' },
  { start: 8, finish: 11, name: 'G' },
];
console.log(activitySelection(acts));  // ['A', 'D', 'F', 'G']


// ── 2. Jump Game — greedy reach ────────────────────────
// Track the farthest index reachable. If we walk past it, return false.
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;     // unreachable position
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}

console.log(canJump([2, 3, 1, 1, 4]));  // true
console.log(canJump([3, 2, 1, 0, 4]));  // false


// ── 3. Fractional Knapsack ────────────────────────────
// Take items by value-per-weight ratio (descending).
function fractionalKnapsack(capacity, items) {
  const sorted = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let totalValue = 0;

  for (const { value, weight } of sorted) {
    if (capacity <= 0) break;
    const take = Math.min(weight, capacity);
    totalValue += take * (value / weight);
    capacity -= take;
  }
  return totalValue;
}

const items = [{ value: 60, weight: 10 }, { value: 100, weight: 20 }, { value: 120, weight: 30 }];
console.log(fractionalKnapsack(50, items));  // 240`,

  'C++': `#include <vector>
#include <algorithm>
#include <string>
#include <tuple>
using namespace std;

// ── 1. Activity Selection — sort by finish time ───────
struct Activity { int start, finish; string name; };

vector<string> activitySelection(vector<Activity> acts) {
    sort(acts.begin(), acts.end(),
         [](const Activity& a, const Activity& b){ return a.finish < b.finish; });
    vector<string> selected;
    int lastFinish = INT_MIN;
    for (auto& act : acts) {
        if (act.start >= lastFinish) {
            selected.push_back(act.name);
            lastFinish = act.finish;
        }
    }
    return selected;
}


// ── 2. Jump Game — greedy reach ────────────────────────
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > maxReach) return false;   // unreachable
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}


// ── 3. Fractional Knapsack ────────────────────────────
struct Item { double value, weight; };

double fractionalKnapsack(double capacity, vector<Item> items) {
    sort(items.begin(), items.end(), [](const Item& a, const Item& b){
        return a.value / a.weight > b.value / b.weight;  // sort by ratio desc
    });
    double total = 0;
    for (auto& item : items) {
        if (capacity <= 0) break;
        double take = min(item.weight, capacity);
        total += take * (item.value / item.weight);
        capacity -= take;
    }
    return total;
}`,
}

// ─── Practice Problems ────────────────────────────────────────────────────────
const problems = [
  {
    title: 'Jump Game',
    difficulty: 'Medium',
    desc: 'Given an array where each element is your max jump length from that position, determine if you can reach the last index.',
    hint: 'Track the farthest index reachable so far (maxReach). Iterate through each position: if i > maxReach the position is unreachable, return false. Otherwise update maxReach = max(maxReach, i + nums[i]). O(n) time, O(1) space.',
    link: 'https://leetcode.com/problems/jump-game/',
  },
  {
    title: 'Jump Game II',
    difficulty: 'Medium',
    desc: 'Same setup as Jump Game, but now return the minimum number of jumps to reach the last index.',
    hint: 'Greedy with two windows: current jump range and next jump range. When you reach the end of the current range, you must jump — increment jumps, and the next range becomes the new current. Track currentEnd and farthest.',
    link: 'https://leetcode.com/problems/jump-game-ii/',
  },
  {
    title: 'Gas Station',
    difficulty: 'Medium',
    desc: 'There are n gas stations around a circular route. Given gas[i] (fuel gained) and cost[i] (fuel to travel to next), find the starting station to complete the circuit, or -1 if impossible.',
    hint: 'Key insight: if total gas >= total cost, a solution always exists. To find the start: keep a running tank. Whenever tank < 0, reset start to i+1 and tank to 0. The greedy works because we always try to extend from the current candidate start.',
    link: 'https://leetcode.com/problems/gas-station/',
  },
  {
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    desc: 'Given an array of meeting time intervals, find the minimum number of conference rooms required.',
    hint: 'Greedy with a min-heap of end times. Sort intervals by start. For each meeting, if the earliest-ending room is free (heap top <= start), reuse it (pop and push new end). Otherwise allocate a new room (just push). Answer = heap size.',
    link: 'https://leetcode.com/problems/meeting-rooms-ii/',
  },
  {
    title: 'Task Scheduler',
    difficulty: 'Medium',
    desc: 'Given tasks with a cooldown n (same task must wait n intervals before running again), find the minimum number of intervals to execute all tasks.',
    hint: 'Greedy: always execute the most frequent remaining task to minimise idle time. Formula: answer = max(taskCount, (maxFreq - 1) * (n + 1) + countOfMaxFreq). This avoids simulating every interval.',
    link: 'https://leetcode.com/problems/task-scheduler/',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Greedy() {
  return (
    <div className="content">
      <TopicHeader
        topic="greedy"
        title="💰 Greedy Algorithms"
        subtitle="Make the locally optimal choice at each step — no backtracking, no DP table. Fast and elegant when it works."
        hasQuiz={true}
      />

      {/* ── Core Concepts ── */}
      <div className="card">
        <h2>📖 Core Concepts</h2>
        <ul>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Greedy Choice Property</strong> — A globally
            optimal solution can be reached by always making a locally optimal (greedy) choice.
            This is the central question to prove before applying greedy: does the local choice
            lead to the global optimum?
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Optimal Substructure</strong> — Like DP,
            greedy also requires that the optimal solution contains optimal solutions to its
            sub-problems. The difference: greedy commits to one branch immediately; DP explores
            all branches.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>When Greedy Works</strong> — Problems where
            a local decision can never be undone or made worse by future choices. Classic examples:
            Activity Selection, Huffman Coding, Dijkstra's shortest path, Fractional Knapsack.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>When Greedy Fails</strong> — When a local
            optimum leads to a global sub-optimum. Example: 0/1 Knapsack — you cannot take
            fractions, so the highest-ratio item might not fit, wasting capacity. Coin change with
            arbitrary denominations (e.g., coins [1, 3, 4], amount 6 — greedy picks 4+1+1=3 coins
            but 3+3=2 coins is optimal). Use DP there.
          </li>
          <li>
            <strong style={{ color: 'var(--blue)' }}>Greedy vs DP</strong> — Greedy is O(n log n)
            or O(n) and commits immediately. DP is typically O(n²) or O(n×k) but considers all
            choices. If you can prove the greedy property, greedy is preferred. If not, fall back
            to DP.
          </li>
        </ul>

        <div
          style={{
            marginTop: 16,
            background: 'var(--bg2)',
            borderLeft: '3px solid var(--yellow)',
            padding: '10px 16px',
            borderRadius: 6,
            fontSize: '0.85rem',
            color: 'var(--text2)',
          }}
        >
          <strong style={{ color: 'var(--text)' }}>How to verify a greedy:</strong> Use an
          exchange argument — assume an optimal solution differs from the greedy solution at some
          step, then show you can swap the greedy choice in without making things worse. If you
          can, greedy is provably correct.
        </div>
      </div>

      {/* ── Visualization ── */}
      <div className="card">
        <h2>🎬 Activity Selection — Greedy Step-by-Step</h2>
        <p style={{ marginBottom: 4, fontSize: '0.88rem', color: 'var(--text2)' }}>
          7 activities on a timeline (0–12). The greedy picks activities sorted by{' '}
          <strong>finish time</strong> — always committing to the one that ends earliest and
          doesn't conflict with the last selection. Each click processes the next candidate.
        </p>
        <ActivitySelectionViz />
      </div>

      {/* ── Greedy Patterns ── */}
      <div className="card">
        <h2>🧠 Common Greedy Patterns</h2>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}
        >
          {[
            {
              icon: '📅',
              name: 'Sort by finish / deadline',
              desc: 'Activity selection, scheduling. Pick what ends earliest to leave room for more.',
            },
            {
              icon: '⚖️',
              name: 'Sort by ratio',
              desc: 'Fractional knapsack. Pick highest value-per-weight first.',
            },
            {
              icon: '🏃',
              name: 'Track reachable maximum',
              desc: 'Jump Game. Maintain the farthest index reachable and extend greedily.',
            },
            {
              icon: '🔢',
              name: 'Frequency-first',
              desc: 'Task Scheduler. Always schedule the most frequent remaining task to minimise idle time.',
            },
            {
              icon: '🌡️',
              name: 'Running difference',
              desc: 'Gas Station. Accumulate surplus; when negative, the start must be later.',
            },
            {
              icon: '📦',
              name: 'Interval merging',
              desc: 'Meeting Rooms. Sort by start, use a min-heap of end times to count overlapping intervals.',
            },
          ].map(({ icon, name, desc }) => (
            <div
              key={name}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>
                {icon}{' '}
                <strong style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{name}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Greedy vs DP side-by-side ── */}
      <div className="card">
        <h2>🔀 Greedy vs Dynamic Programming</h2>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th style={{ color: 'var(--yellow)' }}>Greedy</th>
              <th style={{ color: 'var(--blue)' }}>Dynamic Programming</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Decision</td>
              <td>Commit to local best immediately</td>
              <td>Explore all choices, pick best</td>
            </tr>
            <tr>
              <td>Backtracking</td>
              <td>Never — one pass</td>
              <td>Implicit — sub-problems cover all branches</td>
            </tr>
            <tr>
              <td>Correctness</td>
              <td>Must prove greedy choice property</td>
              <td>Always correct if recurrence is right</td>
            </tr>
            <tr>
              <td>Typical complexity</td>
              <td className="ologn">O(n log n) or O(n)</td>
              <td className="on2">O(n²) or O(n×k)</td>
            </tr>
            <tr>
              <td>Space</td>
              <td className="o1">O(1) or O(n)</td>
              <td className="on">O(n) to O(n²)</td>
            </tr>
            <tr>
              <td>Example: Knapsack</td>
              <td>Works for fractional version only</td>
              <td>Works for 0/1 version</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Code Examples ── */}
      <div className="card">
        <h2>💻 Code Examples</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 12 }}>
          Three classic greedy problems: Activity Selection (sort by finish), Jump Game (greedy
          reach), and Fractional Knapsack (sort by ratio).
        </p>
        <CodeBlock codes={codes} />
      </div>

      {/* ── Complexity Table ── */}
      <div className="card">
        <h2>⏱ Complexity</h2>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Time</th>
              <th>Space</th>
              <th>Greedy Criterion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Activity Selection</td>
              <td className="ologn">O(n log n)</td>
              <td className="o1">O(1)</td>
              <td>Sort by finish time, pick earliest non-conflicting</td>
            </tr>
            <tr>
              <td>Jump Game</td>
              <td className="on">O(n)</td>
              <td className="o1">O(1)</td>
              <td>Track max reachable index greedily</td>
            </tr>
            <tr>
              <td>Jump Game II (min jumps)</td>
              <td className="on">O(n)</td>
              <td className="o1">O(1)</td>
              <td>Jump when current range is exhausted</td>
            </tr>
            <tr>
              <td>Fractional Knapsack</td>
              <td className="ologn">O(n log n)</td>
              <td className="o1">O(1)</td>
              <td>Sort by value/weight ratio descending</td>
            </tr>
            <tr>
              <td>Gas Station</td>
              <td className="on">O(n)</td>
              <td className="o1">O(1)</td>
              <td>Reset candidate start when tank goes negative</td>
            </tr>
            <tr>
              <td>Task Scheduler</td>
              <td className="on">O(n)</td>
              <td className="o1">O(1)*</td>
              <td>*O(26) for fixed alphabet — always schedule most frequent task</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Practice Problems ── */}
      <div className="card">
        <h2>🏋️ Practice Problems</h2>
        <ProblemList problems={problems} />
      </div>
    </div>
  )
}
