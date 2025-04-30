import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { QueryResponse, NewsArticle } from "../types";

const model = new ChatGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  model: "llama3-70b-8192",
});

async function fetchRealNews(query: string): Promise<NewsArticle[]> {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&token=${import.meta.env.VITE_WORLD_NEWS_API_KEY}&lang=en`;

  // Fetch data from GNews API
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error(
      "Error fetching news:",
      data.error.message || "Unknown error"
    );
    return [];
  }

  return data.articles.map((article: any) => ({
    title: article.title,
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt,
    description: article.description,
    urlToImage: article.image,
  }));
}

const fetchNewsTool = new DynamicStructuredTool({
  name: "fetch_news",
  description: "Fetch news articles based on a query or topic",
  schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query for news articles",
      },
      source: {
        type: "string",
        description: "Specific news source to filter by (optional)",
        enum: ["bbc-news", "cnn", "the-verge", "wired", "reuters", "any"],
      },
      category: {
        type: "string",
        description: "News category (optional)",
        enum: [
          "business",
          "entertainment",
          "general",
          "health",
          "science",
          "sports",
          "technology",
        ],
      },
    },
    required: ["query"],
  },
  func: async ({ query }: { query: string }) => {
    const articles = await fetchRealNews(query);
    return articles;
  },
});

export async function queryNewsAI(query: string): Promise<QueryResponse> {
  try {
    // Delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (query.toLowerCase().includes("error")) {
      return {
        type: "error",
        message: "An error occurred while fetching news data.",
      };
    }

    const messages = [new HumanMessage(query)];

    // Send to model with tool
    const response = await model.invoke(messages, {
      tools: [fetchNewsTool],
    });

    const content = response.content;
    const functionCall = (response.additional_kwargs as any)?.tool_calls?.[0];

    if (functionCall) {
      const args = JSON.parse(functionCall.function.arguments);
      const articles = await fetchRealNews(args.query);
      return {
        type: "news",
        text: content || "Here are the latest articles:",
        articles,
      };
    } else {
      // No tool call made
      const articles = await fetchRealNews(query);
      return {
        type: "answer",
        text: content || "No specific tool call made. Showing articles.",
        sourceArticles: articles,
      };
    }
  } catch (err) {
    console.error("LangChain Error:", err);
    return {
      type: "error",
      message: "Failed to process your request. Please try again later.",
    };
  }
}
