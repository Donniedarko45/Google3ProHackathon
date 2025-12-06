import React, { useEffect, useState } from 'react';

const LOG_MESSAGES = [
  "INITIALIZING_NEURAL_UPLINK...",
  "ALLOCATING_TENSOR_BUFFERS...",
  "PARSING_BINARY_STREAM::SECURE",
  "DECODING_VISUAL_VECTORS...",
  "DETECTING_ENTROPY_LEVELS...",
  "ISOLATING_USER_INTENT_NODES...",
  "CROSS_REFERENCING_UX_HEURISTICS...",
  "CALCULATING_FRICTION_COEFFICIENTS...",
  "SYNTHESIZING_OPTIMAL_PATHWAY...",
  "COMPILING_RESOLUTION_ARTIFACTS..."
];

const ProcessingView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < LOG_MESSAGES.length) {
        setLogs(prev => [...prev, LOG_MESSAGES[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400); // New line every 400ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-enter w-full max-w-2xl mx-auto">
      <div className="w-full bg-gray-950 border border-indigo-500/20 rounded-lg p-6 font-mono text-xs shadow-2xl relative overflow-hidden">
        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent animate-scan pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <span className="text-gray-600">SYS.PROCESS.PID.8492</span>
        </div>

        {/* Terminal Content */}
        <div className="space-y-2 h-64 overflow-hidden flex flex-col justify-end">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-indigo-400/80">
                    <span className="text-gray-700">[{new Date().toLocaleTimeString().split(' ')[0]}:{String(i * 14).padStart(3, '0')}]</span>
                    <span className="typing-cursor">{log}</span>
                </div>
            ))}
            <div className="animate-pulse text-indigo-500 font-bold mt-2">
                 _ PROCESSING_DATA_STREAM
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProcessingView;
