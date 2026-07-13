import { ANIMATION_EVENTS } from './EventTypes';

/**
 * VisualizerAPI captures state snapshots and events during algorithm execution.
 * Instead of algorithms modifying the UI directly, they use this API to build a timeline.
 * This completely decouples algorithm logic from presentation.
 */
export class VisualizerAPI {
  constructor(initialState) {
    // Deep clone to avoid mutating references
    this.initialState = structuredClone(initialState);
    this.snapshots = [{
      step: 0,
      state: this.initialState,
      event: ANIMATION_EVENTS.START,
      payload: {},
      message: "Algorithm started"
    }];
    // Track the current working state during execution
    this.currentState = structuredClone(initialState);
  }

  /**
   * Generic method to record a snapshot
   * @param {string} event - The ANIMATION_EVENT type
   * @param {object} payload - Additional event data (e.g., indices, node ids)
   * @param {function} stateModifier - A callback to mutate this.currentState
   * @param {string} message - A description of the action for the UI
   */
  addSnapshot(event, payload, stateModifier, message = "") {
    if (stateModifier) {
      stateModifier(this.currentState);
    }
    
    this.snapshots.push({
      step: this.snapshots.length,
      state: structuredClone(this.currentState),
      event,
      payload,
      message
    });
  }

  // ==========================================
  // ARRAY EVENTS
  // ==========================================
  
  compare(index1, index2, message = `Comparing index ${index1} and ${index2}`) {
    this.addSnapshot(ANIMATION_EVENTS.COMPARE, { index1, index2 }, null, message);
  }

  swap(index1, index2, message = `Swapping index ${index1} and ${index2}`) {
    this.addSnapshot(ANIMATION_EVENTS.SWAP, { index1, index2 }, (state) => {
      // Assuming state is an array for this specific method
      const temp = state[index1];
      state[index1] = state[index2];
      state[index2] = temp;
    }, message);
  }

  overwrite(index, value, message = `Setting index ${index} to ${value}`) {
    this.addSnapshot(ANIMATION_EVENTS.OVERWRITE, { index, value }, (state) => {
      state[index] = value;
    }, message);
  }
  
  // ==========================================
  // GRAPH & TREE EVENTS
  // ==========================================

  visitNode(nodeId, message = `Visiting node ${nodeId}`) {
    this.addSnapshot(ANIMATION_EVENTS.VISIT_NODE, { nodeId }, null, message);
  }

  traverseEdge(fromNode, toNode, message = `Traversing from ${fromNode} to ${toNode}`) {
     this.addSnapshot(ANIMATION_EVENTS.TRAVERSE_EDGE, { fromNode, toNode }, null, message);
  }
  
  highlight(nodeIds, message = `Highlighting nodes`) {
    this.addSnapshot(ANIMATION_EVENTS.HIGHLIGHT, { nodeIds }, null, message);
  }

  // ==========================================
  // STACK & QUEUE EVENTS
  // ==========================================
  
  push(value, message = `Pushing ${value} to stack`) {
      this.addSnapshot(ANIMATION_EVENTS.PUSH, { value }, (state) => {
          state.push(value);
      }, message);
  }

  pop(message = `Popping element from stack`) {
      let poppedValue;
      this.addSnapshot(ANIMATION_EVENTS.POP, {}, (state) => {
          poppedValue = state.pop();
      }, message);
      return poppedValue; 
  }

  enqueue(value, message = `Enqueueing ${value}`) {
      this.addSnapshot(ANIMATION_EVENTS.ENQUEUE, { value }, (state) => {
          state.push(value);
      }, message);
  }

  dequeue(message = `Dequeueing element`) {
      let dequeuedValue;
      this.addSnapshot(ANIMATION_EVENTS.DEQUEUE, {}, (state) => {
          dequeuedValue = state.shift();
      }, message);
      return dequeuedValue;
  }

  // ==========================================
  // POINTERS & VARIABLES
  // ==========================================
  
  movePointer(name, target, message = `Pointer ${name} moved to ${target}`) {
    this.addSnapshot(ANIMATION_EVENTS.MOVE_POINTER, { name, target }, null, message);
  }

  // Marks the algorithm as finished
  complete(message = "Algorithm execution complete") {
    this.addSnapshot(ANIMATION_EVENTS.COMPLETE, {}, null, message);
  }

  // Generic custom event
  customEvent(event, payload, stateModifier, message) {
    this.addSnapshot(event, payload, stateModifier, message);
  }

  getTimeline() {
    return this.snapshots;
  }
}
