const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '**',
    createProxyMiddleware({
      target: 'https://tetris-scramble-server.herokuapp.com',
      changeOrigin: true,
    })
  );
};
