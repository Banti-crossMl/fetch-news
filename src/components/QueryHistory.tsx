import React, { useState } from 'react';
import { Clock, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useNewsContext } from '../context/NewsContext';

const QueryHistory: React.FC = () => {
  const { queryHistory, submitQuery, clearHistory } = useNewsContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (queryHistory.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Recent Queries</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
            <ul className="max-h-64 overflow-y-auto">
              {queryHistory.map((item) => (
                <li 
                  key={item.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      submitQuery(item.query);
                      setIsExpanded(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-gray-800 font-medium">{item.query}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 p-2 flex justify-end">
              <button
                onClick={clearHistory}
                className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryHistory;