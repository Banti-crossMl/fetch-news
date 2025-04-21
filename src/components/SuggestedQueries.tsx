import React from "react";
import { Lightbulb } from "lucide-react";
import { useNewsContext } from "../context/NewsContext";

const suggestedQueries = [
  "What are the latest tech industry developments?",
  "latest news",
  "lates sports updates",
  "Major sports events this week",
  "Latest health and wellness trends",
];

const SuggestedQueries: React.FC = () => {
  const { submitQuery, currentResponse } = useNewsContext();

  // Don't show suggestions if we already have a response
  if (currentResponse) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center mb-3">
        <Lightbulb className="w-4 h-4 text-amber-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-700">
          Try asking about...
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestedQueries.map((query, index) => (
          <button
            key={index}
            onClick={() => submitQuery(query)}
            className="px-3 py-2 bg-white text-sm text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;
