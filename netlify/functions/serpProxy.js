// netlify/functions/serpProxy.js

const axios = require("axios");

exports.handler = async (event, context) => {
  const { query, num = 10 } = event.queryStringParameters;
  const apiKey = process.env.SERPAPI_KEY;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_news",
        q: query,
        api_key: apiKey,
        num,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
