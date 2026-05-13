import { createNodeHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const handler = createNodeHTTPHandler({
  router: appRouter,
  createContext,
});

export default async (req: VercelRequest, res: VercelResponse) => {
  // Get the origin from the request
  const origin = req.headers.origin || req.headers.referer?.split("/").slice(0, 3).join("/") || "*";

  // Enable CORS for authenticated requests
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Disable caching for API responses
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    await handler(req, res);
  } catch (error) {
    console.error("[tRPC API Error]", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
