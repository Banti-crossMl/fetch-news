import React, { useState, FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useNewsContext } from '../context/NewsContext';

const QueryInput: React.FC = () => {
  const { isLoading, submitQuery } = useNewsContext();
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() === '' || isLoading) return;
    
    await submitQuery(query.trim());
    // Don't clear the input so users can modify their query if needed
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center w-full max-w-3xl bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus-within:shadow-lg border border-gray-200"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about any news topic..."
        className="flex-grow px-6 py-4 text-gray-700 placeholder-gray-400 bg-transparent outline-none rounded-l-xl"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={query.trim() === '' || isLoading}
        className={`flex items-center justify-center h-14 w-14 rounded-r-xl transition-colors duration-200 ${
          query.trim() === '' ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
        }`}
        aria-label="Submit query"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default QueryInput;