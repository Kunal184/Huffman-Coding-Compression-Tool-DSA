import React, { useState, useEffect, useMemo } from 'react';
import { buildHuffmanTreeWithSteps, generateCodes, encode, decode } from './utils/huffman';

// --- Sub-components ---

const TableHeader = ({ children }) => (
  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-huffman-accent border-b border-white/10">
    {children}
  </th>
);

const NodeDisplay = ({ x, y, node, isHighlighted }) => (
  <g className={`transition-all duration-500 ${isHighlighted ? 'scale-110' : ''}`}>
    <circle
      cx={x}
      cy={y}
      r="20"
      className={`node-circle ${isHighlighted ? 'fill-huffman-accent/20' : 'fill-huffman-panel'}`}
    />
    <text x={x} y={y - 2} textAnchor="middle" className="node-text font-bold" fontSize="12">
      {node.char === null ? 'Σ' : node.char === ' ' ? '␣' : node.char}
    </text>
    <text x={x} y={y + 12} textAnchor="middle" className="node-text text-[10px] opacity-70">
      f:{node.freq}
    </text>
  </g>
);

const EdgeDisplay = ({ x1, y1, x2, y2, label }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} className="edge-line" />
    <text
      x={(x1 + x2) / 2 + (x1 > x2 ? -10 : 10)}
      y={(y1 + y2) / 2}
      textAnchor="middle"
      className="edge-label font-bold"
    >
      {label}
    </text>
  </g>
);

function App() {
  const [inputText, setInputText] = useState('huffman example');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [binaryToDecode, setBinaryToDecode] = useState('');
  const [decodedText, setDecodedText] = useState('');

  const runAlgorithm = () => {
    const res = buildHuffmanTreeWithSteps(inputText);
    const codes = generateCodes(res.root);
    const encoded = encode(inputText, codes);
    
    setResult({ ...res, codes, encoded });
    setCurrentStep(0); 
    setIsPlaying(false);
    setBinaryToDecode(encoded);
    setDecodedText('');
  };

  useEffect(() => {
    let interval;
    if (isPlaying && result) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < result.steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1000); // 1 second per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, result]);

  useEffect(() => {
    if (inputText) runAlgorithm();
  }, [inputText]);

  useEffect(() => {
    if (result && binaryToDecode) {
      setDecodedText(decode(binaryToDecode, result.root));
    } else {
      setDecodedText('');
    }
  }, [binaryToDecode, result]);

  const treeLayout = useMemo(() => {
    if (!result) return { nodes: [], edges: [] };
    
    // Choose what to render based on mode
    const currentStepData = result.steps[currentStep];
    const forest = showSteps ? (currentStepData?.forest || []) : [result.root];
    
    if (forest.length === 0) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    
    const calculate = (node, x, y, level, spacing) => {
      if (!node) return;
      
      const nextY = y + 70;
      const hSpacing = spacing / Math.pow(1.8, level);

      if (node.left) {
        const lx = x - hSpacing;
        edges.push({ x1: x, y1: y, x2: lx, y2: nextY, label: '0' });
        calculate(node.left, lx, nextY, level + 1, spacing);
      }
      if (node.right) {
        const rx = x + hSpacing;
        edges.push({ x1: x, y1: y, x2: rx, y2: nextY, label: '1' });
        calculate(node.right, rx, nextY, level + 1, spacing);
      }

      nodes.push({ x, y, node });
    };

    // Distribute forest horizontally
    const totalWidth = 800;
    const treeSpacing = totalWidth / (forest.length + 1);
    
    forest.forEach((root, index) => {
      // For single tree, center it. For forest, distribute.
      const startX = forest.length === 1 ? 400 : treeSpacing * (index + 1);
      const startY = forest.length > 5 ? 40 + (index % 2) * 80 : 40; // Stagger if many trees
      calculate(root, startX, startY, 0, forest.length > 1 ? 40 : 200);
    });

    return { nodes, edges };
  }, [result, currentStep, showSteps]);

  const currentStepData = result?.steps[currentStep];

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-huffman-accent mb-2">
            <span className="px-2 py-0.5 bg-huffman-accent/20 rounded text-[10px] font-bold tracking-widest uppercase">Laboratory</span>
            <span className="h-[1px] w-8 bg-huffman-accent/30"></span>
            <span className="text-xs font-mono uppercase tracking-widest">DSA-2024</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            Huffman Visualizer
          </h1>
          <p className="mt-4 text-huffman-edge max-w-2xl font-mono text-sm leading-relaxed">
            An interactive environment for exploring character coding, bit-depth optimization, 
            and the construction of greedy prefix trees.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-white/50 uppercase">Step-by-Step Discovery</label>
            <button 
              onClick={() => setShowSteps(!showSteps)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showSteps ? 'bg-huffman-accent' : 'bg-white/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSteps ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Input Section */}
          <section className="panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-huffman-accent rounded-full animate-pulse"></span>
              Input Buffer
            </h2>
            <div className="space-y-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter string to compress..."
                className="input-field h-32 resize-none text-lg"
              />
              <button 
                onClick={runAlgorithm}
                className="btn-primary w-full"
              >
                Execute Algorithm
              </button>
            </div>
          </section>

          {/* Frequency Table */}
          {result && (
            <section className="panel overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest">Frequency Analysis</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-huffman-panel">
                    <tr>
                      <TableHeader>Symbol</TableHeader>
                      <TableHeader>Count</TableHeader>
                      <TableHeader>Code</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.frequencies).sort((a,b) => b[1] - a[1]).map(([char, freq]) => (
                      <tr key={char} className="hover:bg-white/5 transition-colors">
                        <td className="data-cell font-bold text-huffman-accent">
                          {char === ' ' ? 'SPACE' : char}
                        </td>
                        <td className="data-cell text-white/70">{freq}</td>
                        <td className="data-cell font-bold text-white">{result.codes[char]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Codec Section */}
          {result && (
            <section className="panel p-6">
              <h2 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Codec Operations</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase mb-2 block">Encoded stream (Bitstream)</label>
                  <div className="bg-huffman-bg/50 p-3 rounded border border-white/5 break-all font-mono text-xs text-huffman-accent leading-relaxed">
                    {result.encoded || '—'}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase mb-2 block">Interactive Decoder</label>
                  <input 
                    type="text" 
                    value={binaryToDecode}
                    onChange={(e) => setBinaryToDecode(e.target.value.replace(/[^01]/g, ''))}
                    className="input-field py-2 text-xs font-mono mb-2"
                    placeholder="Enter bits (0/1)..."
                  />
                  <div className="bg-black/20 p-3 rounded border border-huffman-accent/20 min-h-[40px] font-mono flex items-center">
                    <span className="text-white/40 text-[10px] mr-2">RESULT:</span>
                    <span className="text-white font-bold tracking-wider">{decodedText}</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Visualizations */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step-by-Step Navigator (Only if enabled) */}
          {showSteps && result && (
            <section className="panel p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">Tree Construction Trace</h3>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Step {currentStep + 1} of {result.steps.length}: {currentStepData?.type}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-huffman-accent text-huffman-bg'}`}
                  >
                    {isPlaying ? (
                      <><span className="text-sm">⏸</span> PAUSE</>
                    ) : (
                      <><span className="text-sm">▶</span> PLAY</>
                    )}
                  </button>
                  <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
                  <button 
                    disabled={currentStep === 0 || isPlaying}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    className="p-2 panel hover:bg-white/10 disabled:opacity-30"
                    title="Previous Step"
                  >
                    ←
                  </button>
                  <button 
                    disabled={currentStep === result.steps.length - 1 || isPlaying}
                    onClick={() => setCurrentStep(Math.min(result.steps.length - 1, currentStep + 1))}
                    className="p-2 panel hover:bg-white/10 disabled:opacity-30"
                    title="Next Step"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="bg-huffman-bg/40 p-4 rounded-lg font-mono text-sm border border-huffman-accent/10 mb-8 border-l-4 border-l-huffman-accent">
                {currentStepData?.description}
              </div>

              {/* Priority Queue (Heap) State Visualization */}
              <div className="mb-8">
                <h4 className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Priority Queue (Min-Heap Array)</h4>
                <div className="flex flex-wrap gap-3">
                  {currentStepData?.heapState.map((node, i) => (
                    <div key={`${i}-${node.id}`} className="group relative">
                      <div className="flex flex-col items-center justify-center w-14 h-14 panel bg-white/5 group-hover:border-huffman-accent transition-all">
                        <span className="text-xs font-bold text-huffman-accent">{node.char === null ? 'Σ' : node.char === ' ' ? 'SPACE' : node.char}</span>
                        <span className="text-[10px] opacity-60">f:{node.freq}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-huffman-accent text-huffman-bg text-[10px] font-bold rounded flex items-center justify-center">
                        {i}
                      </div>
                    </div>
                  ))}
                  {currentStepData?.heapState.length === 0 && (
                    <div className="text-white/20 italic text-sm">Heap is empty (Construction Complete)</div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Tree Visualization (Centerpiece) */}
          <section className="panel p-6 h-[600px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-6 left-6 z-10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white/40">Prefix Free Binary Tree View</h3>
            </div>
            
            <div className="flex-grow w-full h-full cursor-grab active:cursor-grabbing overflow-auto">
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Draw Edges first so they appear behind nodes */}
                {treeLayout.edges.map((edge, i) => (
                  <EdgeDisplay key={`edge-${i}`} {...edge} />
                ))}

                {/* Draw Nodes */}
                {treeLayout.nodes.map(({ x, y, node }, i) => (
                  <NodeDisplay 
                    key={node.id} 
                    x={x} 
                    y={y} 
                    node={node} 
                    isHighlighted={showSteps && currentStepData?.mergedNodes?.some(m => m.id === node.id) || currentStepData?.newNode?.id === node.id}
                  />
                ))}

                {treeLayout.nodes.length === 0 && (
                  <text x="400" y="300" textAnchor="middle" className="fill-white/10 italic text-xl">
                    Waiting for input...
                  </text>
                )}
              </svg>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-4 text-[10px] font-mono text-white/30 uppercase">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full border border-huffman-accent bg-huffman-panel"></span>
                <span>Leaf (Symbol)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full border border-huffman-edge/30"></span>
                <span>Internal Node (Σ Frequency)</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Algorithm: Huffman O(N log N) | Space: O(N) | Greedy Choice Property
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5 text-white/40 cursor-default">
            Built for Academic Integrity
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
