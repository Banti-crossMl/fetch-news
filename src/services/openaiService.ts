import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { QueryResponse, NewsArticle } from "../types";

const model = new ChatGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  model: "llama3-70b-8192",
});

async function fetchRealNews(
  query: string,
  count = 10
): Promise<NewsArticle[]> {
  try {
    // const url = `/api/serp/search.json?engine=google_news&q=${encodeURIComponent(
    //   query
    // )}&api_key=${import.meta.env.VITE_SERPAPI_KEY}&num=${count}`;

    const url = `https://serpapi.com/search?engine=google_news&q=${encodeURIComponent(
      query
    )}&api_key=${import.meta.env.VITE_SERPAPI_KEY}&num=${count}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Error fetching news:", data.error);
      return [];
    }

    if (!data.news_results) {
      console.warn("No news results found");
      return [];
    }

    const articles: NewsArticle[] = [];

    data.news_results.forEach((result: any) => {
      if (result.highlight) {
        articles.push({
          title: result.highlight.title,
          url: result.highlight.link,
          source:
            result.highlight.source?.name ||
            result.highlight.source ||
            "Unknown",
          publishedAt: result.highlight.date || new Date().toISOString(),
          description: "",
          urlToImage: result.highlight.thumbnail || null,
        });
      }

      if (result.stories && Array.isArray(result.stories)) {
        result.stories.forEach((story: any) => {
          articles.push({
            title: story.title,
            url: story.link,
            source: story.source?.name || story.source || "Unknown",
            publishedAt: story.date || new Date().toISOString(),
            description: "",
            urlToImage: story.thumbnail || null,
          });
        });
      }

      if (result.title && result.link) {
        articles.push({
          title: result.title,
          url: result.link,
          source: result.source?.name || result.source || "Unknown",
          publishedAt: result.date || new Date().toISOString(),
          description: "",
          urlToImage: result.thumbnail || null,
        });
      }
    });

    const uniqueArticles = articles.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
    );

    return uniqueArticles.slice(0, count);
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
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
      limit: {
        type: "integer",
        description: "Maximum number of articles to return (1-10)",
        minimum: 1,
        maximum: 10,
      },
    },
    required: ["query"],
  },
  func: async ({ query, limit }: { query: string; limit?: number }) => {
    const articles = await fetchRealNews(query, limit || 5);
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
      const articles = await fetchRealNews(args.query, args.limit || 5);
      return {
        type: "news",
        text: content || "Here are the latest articles:",
        articles,
      };
    } else {
      // No tool call made
      const articles = await fetchRealNews(query, 2);
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
