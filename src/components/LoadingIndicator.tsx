import React from 'react';
import { ScaleLoader } from 'react-spinners';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Fetching news data...' }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-12 flex flex-col items-center justify-center">
      <ScaleLoader color="#3B82F6" height={35} width={4} radius={2} margin={2} />
      <p className="mt-4 text-gray-600 text-center animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingIndicator;