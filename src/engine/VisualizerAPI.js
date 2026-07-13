import { ANIMATION_EVENTS } from './EventTypes';

/**
 * VisualizerAPI captures state snapshots and events during algorithm execution.
 * Includes rich educational metadata for the storytelling engine.
 */
export class VisualizerAPI {
  constructor(initialState) {
    this.initialState = structuredClone(initialState);
    this.snapshots = [{
      step: 0,
      state: this.initialState,
      event: ANIMATION_EVENTS.START,
      payload: {},
      message: "Algorithm started",
      instructor: {
        what: "Initializing the data structure.",
        why: "Every algorithm needs a starting point.",
        tip: "Always ensure your base cases and initial boundaries are correct."
      }
    }];
    this.currentState = structuredClone(initialState);
  }

  /**
   * Generic method to record a snapshot
   */
  addSnapshot(event, payload, stateModifier, message = "", instructor = {}) {
    if (stateModifier) {
      stateModifier(this.currentState);
    }
    
    this.snapshots.push({
      step: this.snapshots.length,
      state: structuredClone(this.currentState),
      event,
      payload,
      message,
      instructor // { what, why, tip, warning }
    });
  }

  // ==========================================
  // ARRAY EVENTS
  // ==========================================
  
  compare(index1, index2, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.COMPARE, { index1, index2 }, null, message, instructor);
  }

  swap(index1, index2, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.SWAP, { index1, index2 }, (state) => {
      const temp = state[index1];
      state[index1] = state[index2];
      state[index2] = temp;
    }, message, instructor);
  }

  overwrite(index, value, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.OVERWRITE, { index, value }, (state) => {
      state[index] = value;
    }, message, instructor);
  }
  
  // ==========================================
  // GRAPH & TREE EVENTS
  // ==========================================

  visitNode(nodeId, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.VISIT_NODE, { nodeId }, null, message, instructor);
  }

  traverseEdge(fromNode, toNode, message, instructor) {
     this.addSnapshot(ANIMATION_EVENTS.TRAVERSE_EDGE, { fromNode, toNode }, null, message, instructor);
  }
  
  highlight(nodeIds, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.HIGHLIGHT, { nodeIds }, null, message, instructor);
  }

  // ==========================================
  // STACK & QUEUE EVENTS
  // ==========================================
  
  push(value, message, instructor) {
      this.addSnapshot(ANIMATION_EVENTS.PUSH, { value }, (state) => {
          state.push(value);
      }, message, instructor);
  }

  pop(message, instructor) {
      let poppedValue;
      this.addSnapshot(ANIMATION_EVENTS.POP, {}, (state) => {
          poppedValue = state.pop();
      }, message, instructor);
      return poppedValue; 
  }

  enqueue(value, message, instructor) {
      this.addSnapshot(ANIMATION_EVENTS.ENQUEUE, { value }, (state) => {
          state.push(value);
      }, message, instructor);
  }

  dequeue(message, instructor) {
      let dequeuedValue;
      this.addSnapshot(ANIMATION_EVENTS.DEQUEUE, {}, (state) => {
          dequeuedValue = state.shift();
      }, message, instructor);
      return dequeuedValue;
  }

  // ==========================================
  // POINTERS & VARIABLES
  // ==========================================
  
  movePointer(name, target, message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.MOVE_POINTER, { name, target }, null, message, instructor);
  }

  complete(message, instructor) {
    this.addSnapshot(ANIMATION_EVENTS.COMPLETE, {}, null, message, instructor);
  }

  customEvent(event, payload, stateModifier, message, instructor) {
    this.addSnapshot(event, payload, stateModifier, message, instructor);
  }

  getTimeline() {
    return this.snapshots;
  }
}
