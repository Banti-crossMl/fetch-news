export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description?: string;
  urlToImage?: string;
}

export interface NewsResponse {
  type: 'news';
  articles: NewsArticle[];
}

export interface AnswerResponse {
  type: 'answer';
  text: string;
  sourceArticles?: NewsArticle[];
}

export interface ErrorResponse {
  type: 'error';
  message: string;
}

export type QueryResponse = NewsResponse | AnswerResponse | ErrorResponse;

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  response?: QueryResponse;
}