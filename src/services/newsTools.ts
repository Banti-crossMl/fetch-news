import { ChatCompletionTool } from "openai/resources/chat/completions";

export const newsToolDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "fetch_news",
    description: "Fetch news articles based on a query or topic",
    parameters: {
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
  },
};
