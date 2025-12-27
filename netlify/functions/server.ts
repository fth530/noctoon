import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../../server/routes";
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

  // CORS middleware - restrict to allowed origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5000", "http://localhost:3000"];

  expressApp.use((req, res, next) => {
    const origin = req.headers.origin as string;

    // In development, allow all origins
    if (process.env.NODE_ENV !== "production") {
      res.header("Access-Control-Allow-Origin", origin || "*");
    } else if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id");
    res.header("Access-Control-Allow-Credentials", "true");

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

