import { createNodeHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const handler = createNodeHTTPHandler({
  router: appRouter,
  createContext,
});

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
