import React from 'react';
import { useNewsContext } from '../context/NewsContext';
import NewsCard from './NewsCard';
import { NewsArticle, NewsResponse, AnswerResponse, ErrorResponse } from '../types';
import { Newspaper, AlertCircle, InfoIcon } from 'lucide-react';

const NewsResults: React.FC = () => {
  const { currentResponse, currentQuery } = useNewsContext();
  
  if (!currentResponse) {
    return null;
  }
  
  // Error response
  if (currentResponse.type === 'error') {
    return <ErrorView message={(currentResponse as ErrorResponse).message} />;
  }
  
  // News articles response
  if (currentResponse.type === 'news') {
    const { articles } = currentResponse as NewsResponse;
    return <ArticlesGrid articles={articles} query={currentQuery} />;
  }
  
  // AI answer response
  if (currentResponse.type === 'answer') {
    const { text, sourceArticles } = currentResponse as AnswerResponse;
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-start">
            <InfoIcon className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                AI Response
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                {text.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {sourceArticles && sourceArticles.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Newspaper className="w-5 h-5 mr-2 text-blue-600" />
              Source Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sourceArticles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  return null;
};

const ArticlesGrid: React.FC<{ articles: NewsArticle[], query: string }> = ({ articles, query }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Newspaper className="w-5 h-5 mr-2 text-blue-600" />
        News Results for "{query}"
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

const ErrorView: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Retrieving News
          </h3>
          <p className="text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsResults;