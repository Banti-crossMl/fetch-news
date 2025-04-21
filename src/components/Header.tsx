import React from 'react';
import { Newspaper, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-2">
            <Newspaper className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-bold">NewsIntelligence</h1>
          </div>
          <p className="text-blue-100 max-w-2xl mb-1">
            Ask any question about current events and get AI-powered insights
          </p>
          <div className="flex items-center text-xs text-blue-200">
            <Search className="w-3 h-3 mr-1" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
      <div className="h-5 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
    </header>
  );
};

export default Header;