
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 border-b border-gray-700/50">
      <div className="max-w-4xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <LogoIcon className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-400" />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">SparkLearn</h1>
            <p className="text-xs text-gray-400">by Spark Sync</p>
          </div>
        </div>
      </div>
    </header>
  );
};