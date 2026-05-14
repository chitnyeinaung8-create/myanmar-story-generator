import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from 'http';
import { app } from '../server/_core/index';

// Create a single server instance
let server: any = null;

export default async (req: VercelRequest, res: VercelResponse) => {
  // Initialize server once
  if (!server) {
    server = createServer(app);
  }

  // Handle the request
  return new Promise((resolve) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
  });
};
