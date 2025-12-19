import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../../Site-Builder/server/routes";
import serverless from "serverless-http";

let app: Express | null = null;
let serverlessHandler: any = null;

async function createApp(): Promise<Express> {
  const expressApp = express();

  expressApp.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );

  expressApp.use(express.urlencoded({ extended: false }));

  // CORS middleware
  expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // Logging middleware
  expressApp.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        console.log(logLine);
      }
    });

    next();
  });

  // Register API routes
  const httpServer = {} as any; // Dummy server for Netlify
  await registerRoutes(httpServer, expressApp);

  // Error handler
  expressApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return expressApp;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Initialize app on first request
  if (!app) {
    app = await createApp();
    serverlessHandler = serverless(app);
  }

  return serverlessHandler(event, context);
};

