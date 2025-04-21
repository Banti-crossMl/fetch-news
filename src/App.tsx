import React from 'react';
import { NewsProvider } from './context/NewsContext';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import NewsResults from './components/NewsResults';
import QueryHistory from './components/QueryHistory';
import SuggestedQueries from './components/SuggestedQueries';
import LoadingIndicator from './components/LoadingIndicator';
import Footer from './components/Footer';
import { useNewsContext } from './context/NewsContext';

// Main content wrapper with context consumers
const MainContent: React.FC = () => {
  const { isLoading } = useNewsContext();
  
  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <QueryInput />
          <QueryHistory />
          <SuggestedQueries />
          
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <NewsResults />
          )}
        </div>
      </div>
    </main>
  );
};

// Main App component with context provider
function App() {
  return (
    <NewsProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </NewsProvider>
  );
}

export default App;