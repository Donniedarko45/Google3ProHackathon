import React, { useState, useEffect } from 'react';
import { NeuroLensResponse, FileData } from '../types';
import { IconCheck, IconCopy } from './Icons';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  data: NeuroLensResponse;
  files: FileData[];
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    setDisplayCount(0);
    if (!text) return;

    const intervalId = setInterval(() => {
      setDisplayCount((prev) => {
        if (prev >= text.length) {
          clearInterval(intervalId);
          return prev;
        }
        const chunk = Math.max(1, Math.ceil(text.length / 150));
        return Math.min(prev + chunk, text.length);
      });
    }, 15); 
    
    return () => clearInterval(intervalId);
  }, [text]);

  return <ReactMarkdown>{text.slice(0, displayCount)}</ReactMarkdown>;
};

const ResultView: React.FC<ResultViewProps> = ({ data, files }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.action_output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Find the first image to display as visual target
  const visualTarget = files.find(f => f.previewUrl);

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-24 animate-enter">
      
      {/* Dossier Header / Metadata Block */}
      <div className="bg-white/5 border border-white/10 rounded-t-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border-b border-white/5">
              <div className="bg-gray-950 p-4">
                  <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Input Sources</span>
                  <span className="block text-sm text-indigo-300 font-mono">{files.length} File{files.length !== 1 ? 's' : ''} Uploaded</span>
              </div>
              <div className="bg-gray-950 p-4">
                  <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Total Payload</span>
                  <span className="block text-sm text-white font-mono">
                    {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
                  </span>
              </div>
              <div className="bg-gray-950 p-4">
                  <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Primary Type</span>
                  <span className="block text-sm text-cyan-300 font-mono truncate">
                    {files[0]?.mimeType || 'N/A'}
                  </span>
              </div>
          </div>
          {/* File List Detail */}
          <div className="bg-gray-900/50 p-3 flex flex-wrap gap-2">
             {files.map((f, i) => (
                 <div key={i} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500/50"></span>
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[150px]">{f.file.name}</span>
                 </div>
             ))}
          </div>
      </div>

      {/* Image Target View (if image exists) */}
      {visualTarget && (
        <div className="relative mb-16 group rounded-lg overflow-hidden border border-indigo-500/30 bg-gray-900/50">
           {/* HUD Overlay */}
           <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-indigo-500"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-indigo-500"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-indigo-500"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-indigo-500"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-indigo-500/20 rounded-full flex items-center justify-center">
                 <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute bottom-4 right-16 text-[10px] font-mono text-indigo-400 bg-black/50 px-2 py-1 rounded">
                 VISUAL_ANALYSIS_COMPLETE
              </div>
           </div>
           
           {/* If multiple images, we just show the first one as the 'prime' target */}
           {visualTarget.previewUrl && (
             <img 
               src={visualTarget.previewUrl} 
               alt="Analysis Target" 
               className="w-full max-h-[400px] object-contain opacity-60 grayscale-[50%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
             />
           )}
           {/* Scan Grid */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
      )}

      {/* Main Report Body */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent hidden md:block"></div>
        
        <div className="md:pl-12 space-y-16">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
            <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
                <span>REPORT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Certainty</span>
                <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[96%]"></div>
                </div>
                <span className="text-xs font-mono text-cyan-400">98.2%</span>
            </div>
          </div>

          {/* Section 1: Intent */}
          <section>
            <div className="flex items-center gap-3 mb-4">
               <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest border border-cyan-400/30 px-2 py-1 rounded">01. Intent Detected</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white leading-tight">
              {data.detected_task}
            </h2>
          </section>

          {/* Section 2: Friction */}
          <section className="relative">
             <div className="absolute -left-12 top-2 w-8 h-px bg-red-500/50 hidden md:block"></div>
             <div className="flex items-center gap-3 mb-4">
               <span className="text-red-500 font-mono text-xs font-bold uppercase tracking-widest border border-red-500/30 px-2 py-1 rounded">02. Friction Point</span>
             </div>
             <p className="text-xl md:text-2xl text-red-100/90 font-light leading-relaxed border-l-2 border-red-500/50 pl-6 py-1">
               {data.friction_point}
             </p>
          </section>

          {/* Section 3: Solution */}
          <section>
             <div className="flex items-center gap-3 mb-6">
               <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest border border-emerald-400/30 px-2 py-1 rounded">03. Resolution Protocol</span>
             </div>
             <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-7 prose-headings:text-white prose-code:text-indigo-300 max-w-none min-h-[100px]">
               <TypewriterText text={data.solution} />
             </div>
          </section>

          {/* Section 4: Action Artifact */}
          <section className="mt-12">
            <div className="bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden shadow-2xl relative group">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs font-mono text-gray-500 opacity-50 group-hover:opacity-100 transition-opacity">generated_artifact.lock</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider hover:text-white text-gray-500 transition-colors"
                >
                  {copied ? <span className="text-green-400">Copied</span> : <span>Copy Contents</span>}
                  {copied ? <IconCheck className="w-3 h-3 text-green-400" /> : <IconCopy className="w-3 h-3" />}
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{data.action_output}</pre>
              </div>
            </div>
          </section>

          {/* Footer: Reason Map */}
          <footer className="pt-12 mt-12 border-t border-white/5">
            <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Reasoning Engine Trace</h4>
            <p className="font-mono text-xs text-gray-600 leading-relaxed max-w-2xl">
              &gt; {data.reason_map}
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default ResultView;
