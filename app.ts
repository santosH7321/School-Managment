require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";

// Body parsing
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// Enable CORS => cross-origin resource sharing

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Testing api

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown roots

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});