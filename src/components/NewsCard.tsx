import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { title, description, source, url, publishedAt, urlToImage } = article;
  
  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <article className="flex flex-col rounded-xl shadow-sm overflow-hidden bg-white border border-gray-100 transition-shadow hover:shadow-md">
      {urlToImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={urlToImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}
      
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span className="font-medium text-blue-600">{source}</span>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        <div className="mt-auto pt-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Read Full Article
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;