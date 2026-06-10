import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import { userRoutes, dashboardRoutes, thoughtRoutes } from "./routes/index.js";
import { authenticateUser } from "./middleware/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// [1] DB connection & app setup
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Swagger UI setup (OpenAPI docs)
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// [2] Global middleware
app.use(cors());
app.use(express.json());

// [3] Routes
app.use("/users", userRoutes);
app.use("/dashboard", authenticateUser, dashboardRoutes);
app.use("/thoughts", thoughtRoutes);

// Root endpoint
app.get("/", (request, response) => {
  const endpoints = listEndpoints(app);
  response.json({
    message: "Welcome to HappyThoughts API",
    endpoints: endpoints,
  });
});

// [5] 404 handler (after all routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: "Not Found",
    details: `No endpoint matches ${req.method} ${req.originalUrl}`,
  });
});

// [6] Global error handler (last)
app.use(errorHandler);

// [7] Start server (unless test)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
