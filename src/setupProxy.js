import { createProxyMiddleware } from 'http-proxy-middleware';
import rootAddress from './configuration/proxy';

export default app => {
  app.use(
    '**',
    createProxyMiddleware({
      target: rootAddress,
      changeOrigin: true,
    })
  );
};