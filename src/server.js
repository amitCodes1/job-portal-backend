import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRouter from "./routes/auth.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import savedJobRouter from "./routes/savedJob.route.js";

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://my-job-portal-sigma.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/auth",
  authRouter
);

app.use(
  "/api/jobs",
  jobRouter
);

app.use(
  "/api/applications",
  applicationRouter
);

app.use(
  "/api/saved-jobs",
  savedJobRouter
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is running"
  });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;