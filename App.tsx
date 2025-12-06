import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import ResultView from './components/ResultView';
import ProcessingView from './components/ProcessingView';
import { IconUpload, IconAlert } from './components/Icons';
import { analyzeContent } from './services/geminiService';
import { AppStatus, FileData, NeuroLensResponse } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<NeuroLensResponse | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, []);

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds limit (10MB).");
      return;
    }

    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      const mimeType = file.type || 'application/octet-stream';
      
      setFileData({
        file,
        previewUrl: file.type.startsWith('image/') ? result : undefined,
        base64,
        mimeType
      });

      startAnalysis(base64, mimeType);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async (base64: string, mimeType: string) => {
    setStatus(AppStatus.ANALYZING);
    try {
      const response = await analyzeContent(base64, mimeType);
      setResult(response);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Analysis sequence failed.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 pt-24 pb-12">
      <Header />
      
      <main className="container mx-auto px-6 max-w-5xl">
        
        {/* Idle / Landing State */}
        {status === AppStatus.IDLE && !result && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-enter">
                <div className="text-center space-y-6 max-w-2xl mb-12">
                   <div className="inline-block border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-xs font-mono text-indigo-300 mb-4">
                      V3.0 // REASONING_ENGINE_READY
                   </div>
                   <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                      Detect. Reason. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Resolve.</span>
                   </h2>
                   <p className="text-lg text-gray-500 font-light">
                      Drop screenshots, code logs, or documents. <br />
                      NeuroLens extracts intent and patches friction instantly.
                   </p>
                </div>

                {/* Minimalist Drop Zone */}
                <div 
                   onDrop={handleDrop}
                   onDragOver={handleDragOver}
                   onClick={triggerFileUpload}
                   className="group relative cursor-pointer"
                >
                   <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 group-hover:opacity-40 blur transition-opacity duration-500"></div>
                   <div className="relative bg-gray-950 border border-white/10 hover:border-white/20 rounded-full px-12 py-6 flex items-center gap-4 transition-all group-hover:scale-[1.02]">
                      <IconUpload className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">
                        INITIATE UPLOAD SEQUENCE
                      </span>
                   </div>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*,application/pdf,text/*,.csv,.json,.xml"
                   />
                </div>
                
                <p className="mt-8 text-[10px] text-gray-600 font-mono">
                   SUPPORTED: IMG, PDF, TXT, LOG, JSON, CODE
                </p>
            </div>
        )}

        {/* Processing State */}
        {status === AppStatus.ANALYZING && <ProcessingView />}

        {/* Error State */}
        {status === AppStatus.ERROR && (
            <div className="max-w-xl mx-auto mt-20 p-6 border border-red-500/20 bg-red-950/10 rounded-lg flex items-start gap-4 animate-enter">
                <IconAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-2">
                    <h3 className="text-red-400 font-mono text-sm uppercase tracking-wider">Analysis Terminated</h3>
                    <p className="text-red-200/60 text-sm font-light leading-relaxed">{errorMsg}</p>
                    <button 
                        onClick={() => setStatus(AppStatus.IDLE)}
                        className="mt-2 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:text-red-300 border-b border-red-500/30 hover:border-red-400 transition-colors"
                    >
                        Re-initialize
                    </button>
                </div>
            </div>
        )}

        {/* Success / Result State */}
        {status === AppStatus.SUCCESS && result && (
          <div className="relative">
             {/* Floating Reset Button */}
             <div className="fixed bottom-8 right-8 z-50">
                 <button 
                    onClick={() => {
                        setStatus(AppStatus.IDLE);
                        setFileData(null);
                        setResult(null);
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 border border-white/10 hover:border-indigo-500/50 hover:bg-gray-800 text-gray-400 hover:text-indigo-400 transition-all shadow-2xl"
                    title="New Analysis"
                 >
                    <IconUpload className="w-5 h-5" />
                 </button>
             </div>
             
             <ResultView data={result} fileInfo={fileData} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
