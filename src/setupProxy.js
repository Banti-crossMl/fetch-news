const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/serp",
    createProxyMiddleware({
      target: "https://serpapi.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api/serp": "",
      },
    })
  );
};
