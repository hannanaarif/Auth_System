import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { PORT } from "./constants/env";
import authRouter from "./routes/auth_route";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
    origin: process.env.APP_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  })
);


app.get("/health", (req, res, next) => {
  console.log("🔥 /health endpoint hit");
  try {
    throw new Error("Simulated error for testing");
    res.status(200).json({
      message: "Server is running",
    });
  } catch (error) {
    console.error("Error in /health endpoint:", error);
    next(error);
  }
});


app.use("/auth", authRouter)




app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});
