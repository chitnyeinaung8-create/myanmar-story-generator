import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import { registerOAuthRoutes } from '../server/_core/oauth';
import { registerStorageProxy } from '../server/_core/storageProxy';
import path from 'path';

// Create Express app once
const app = express();

// Configure body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register routes
try {
  registerStorageProxy(app);
  registerOAuthRoutes(app);
} catch (error) {
  console.error('Error registering routes:', error);
}

// tRPC API
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files from dist/public
const publicDir = path.join(__dirname, '../dist/public');
app.use(express.static(publicDir, { maxAge: '1h' }));

// Serve index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export handler for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return new Promise<void>((resolve, reject) => {
    try {
      app(req as any, res as any);
      res.on('finish', () => resolve());
      res.on('error', reject);
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({ error: 'Internal server error' });
      resolve();
    }
  });
};
