import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { QueryHistoryItem, QueryResponse } from "../types";
import { queryNewsAI } from "../services/openaiService";

interface NewsContextType {
  isLoading: boolean;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  currentResponse: QueryResponse | null;
  queryHistory: QueryHistoryItem[];
  submitQuery: (query: string) => Promise<void>;
  clearHistory: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function useNewsContext() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
}

interface NewsProviderProps {
  children: ReactNode;
}

export function NewsProvider({ children }: NewsProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentResponse, setCurrentResponse] = useState<QueryResponse | null>(
    null
  );
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem("newsQueryHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("newsQueryHistory", JSON.stringify(queryHistory));
  }, [queryHistory]);

  const submitQuery = async (query: string) => {
    try {
      setIsLoading(true);
      setCurrentQuery(query);
      setCurrentResponse(null);

      const response = await queryNewsAI(query);
      setCurrentResponse(response);

      // Add to history
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: Date.now(),
        response,
      };

      setQueryHistory((prev) => [historyItem, ...prev].slice(0, 10)); // Keep last 10 queries
    } catch (error) {
      console.error("Error submitting query:", error);
      setCurrentResponse({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
  };

  return (
    <NewsContext.Provider
      value={{
        isLoading,
        currentQuery,
        setCurrentQuery,
        currentResponse,
        queryHistory,
        submitQuery,
        clearHistory,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}
