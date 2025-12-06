import React from 'react';
import { IconBrain } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 sm:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-4">
        <IconBrain className="w-5 h-5 text-indigo-500" />
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
            NeuroLens <span className="text-indigo-500">SYS.01</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
         <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Online</span>
      </div>
    </header>
  );
};

export default Header;
