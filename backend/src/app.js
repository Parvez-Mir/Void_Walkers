import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.helper.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
connectDB();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// Route imports
import authRouter from "./routes/auth.routes.js";
import propertyRouter from "./routes/property.routes.js";

// Aggregate API router — single source of truth for every sub-route.
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/properties", propertyRouter);
apiRouter.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Backend is running flawlessly!" });
});

// Canonical versioned mount + unversioned alias for clients that omit the prefix.
const API_PREFIX = "/api/v1";
app.use(API_PREFIX, apiRouter);
app.use(apiRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`⚙️  Server is running at port : ${PORT}`);
});
