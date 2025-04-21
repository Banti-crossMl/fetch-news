import Groq from "groq-sdk";
import { newsToolDefinition } from "./newsTools";
import { QueryResponse, NewsArticle } from "../types";

const DEMO_API_KEY = `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`;

const WORLD_NEWS_API_KEY = "ed144c499040c0c1260fea06f4b5be79";

// Initialize the Groq client
const groq = new Groq({
  apiKey: DEMO_API_KEY,
  dangerouslyAllowBrowser: true, // Only for testing. DO NOT use in production frontend.
});

// Fetch real news articles using newsdata.io API
async function fetchRealNews(query: string, count = 8): Promise<NewsArticle[]> {
  console.log("Fetching real news articles...", query);

  // Construct the GNews API URL
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&token=${WORLD_NEWS_API_KEY}&lang=en&max=${count}`;

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

  // Return the mapped articles
  return data.articles.map((article: any) => ({
    title: article.title,
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt,
    description: article.description,
    urlToImage: article.image,
  }));
}

// Function to handle query and return Groq-powered response
export async function queryNewsAI(query: string): Promise<QueryResponse> {
  try {
    // Simulate delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (query.toLowerCase().includes("error")) {
      return {
        type: "error",
        message: "An error occurred while fetching news data.",
      };
    }

    return await realQueryImplementation(query);
  } catch (error) {
    console.error("Error querying Groq:", error);
    return {
      type: "error",
      message: "Failed to process your request. Please try again later.",
    };
  }
}

// Handles AI function calling with real news
export async function realQueryImplementation(
  query: string
): Promise<QueryResponse> {
  const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
    newsToolDefinition,
  ];

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: query,
    },
  ];

  const initialResponse = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    tools,
    tool_choice: "auto",
  });

  const toolCall = initialResponse.choices[0]?.message?.tool_calls?.[0];

  if (!toolCall || toolCall.type !== "function") {
    return {
      type: "answer",
      text: initialResponse.choices[0].message.content || "No tool call made.",
      sourceArticles: await fetchRealNews(query, 2),
    };
  }

  const args = JSON.parse(toolCall.function.arguments) as { query: string };

  const toolResult: NewsArticle[] = await fetchRealNews(args.query || query);

  messages.push({
    role: "assistant",
    tool_calls: [toolCall],
  });

  messages.push({
    role: "tool",
    tool_call_id: toolCall.id,
    content: JSON.stringify(toolResult),
  });

  const finalResponse = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    tools,
  });

  const finalMessage = finalResponse.choices[0].message;

  return {
    type: "news",
    articles: toolResult,
    text: finalMessage.content || "",
  };
}
