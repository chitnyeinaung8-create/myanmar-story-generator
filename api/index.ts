import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import { registerOAuthRoutes } from '../server/_core/oauth';
import { registerStorageProxy } from '../server/_core/storageProxy';
import { serveStatic } from '../server/_core/vite';

// Create Express app once
const app = express();

// Configure body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register routes
registerStorageProxy(app);
registerOAuthRoutes(app);

// tRPC API
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files
serveStatic(app);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Export handler for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return new Promise<void>((resolve, reject) => {
    app(req as any, res as any);
    res.on('finish', () => resolve());
    res.on('error', reject);
  });
};
