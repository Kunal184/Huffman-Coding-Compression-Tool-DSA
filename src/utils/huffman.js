/**
 * Huffman Coding Logic - Custom Implementation for DSA Visualization
 */

export class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char; // null for internal nodes
    this.freq = freq;
    this.left = left;
    this.right = right;
    // Unique ID for stable React rendering during animations/steps
    this.id = char ? `leaf-${char}` : `internal-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(node) {
    this.heap.push(node);
    this.bubbleUp();
  }

  pop() {
    if (this.size() === 0) return null;
    if (this.size() === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return min;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].freq >= this.heap[parentIndex].freq) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < this.heap.length && this.heap[left].freq < this.heap[smallest].freq) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right].freq < this.heap[smallest].freq) {
        smallest = right;
      }
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  // Deep clone for state snapshots
  clone() {
    const newHeap = new MinHeap();
    newHeap.heap = [...this.heap];
    return newHeap;
  }
}

/**
 * Builds the Huffman Tree and returns both the root and the history of construction steps
 */
export function buildHuffmanTreeWithSteps(text) {
  if (!text) return { root: null, steps: [] };

  const freqs = {};
  for (const char of text) {
    freqs[char] = (freqs[char] || 0) + 1;
  }

  const heap = new MinHeap();
  Object.entries(freqs).forEach(([char, freq]) => {
    heap.push(new HuffmanNode(char, freq));
  });

  const steps = [];
  // Initial state step
  steps.push({
    type: 'INITIAL',
    heapState: heap.clone().heap,
    forest: [...heap.heap],
    description: 'Priority Queue initialized with character frequencies. Each character starts as a leaf node.'
  });

  while (heap.size() > 1) {
    const left = heap.pop();
    const right = heap.pop();

    const parent = new HuffmanNode(null, left.freq + right.freq, left, right);
    heap.push(parent);

    steps.push({
      type: 'MERGE',
      mergedNodes: [left, right],
      newNode: parent,
      heapState: heap.clone().heap,
      forest: [...heap.heap],
      description: `Extracted two nodes with smallest frequencies (${left.freq} and ${right.freq}). Combined them into a new internal node with frequency ${parent.freq}.`
    });
  }

  const root = heap.pop();
  steps.push({
    type: 'COMPLETED',
    root,
    heapState: [],
    forest: [root],
    description: 'Huffman Tree construction completed. All nodes merged into a single root.'
  });

  return { root, steps, frequencies: freqs };
}

/**
 * Generates Huffman Codes using recursive traversal
 */
export function generateCodes(node, prefix = '', codes = {}) {
  if (!node) return codes;

  if (node.char !== null) {
    codes[node.char] = prefix;
  }

  generateCodes(node.left, prefix + '0', codes);
  generateCodes(node.right, prefix + '1', codes);

  return codes;
}

export function encode(text, codes) {
  return text.split('').map(char => codes[char]).join('');
}

export function decode(binary, root) {
  let result = '';
  let current = root;
  
  if (!root) return '';

  for (const bit of binary) {
    if (bit === '0') {
      current = current.left;
    } else {
      current = current.right;
    }

    if (current.char !== null) {
      result += current.char;
      current = root;
    }
  }
  return result;
}
