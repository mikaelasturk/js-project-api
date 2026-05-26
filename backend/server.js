import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRoutes from "./routes/userRoutes";
import { authenticateUser } from "./middleware/authMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";
import thoughtRoutes from "./routes/thoughtRoutes";

// [ ] Make new connection in compass!
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  const endpoints = listEndpoints(app);
  response.json({
    message: "Welcome to HappyThoughts API",
    endpoints: endpoints,
  });
});

app.use("/users", userRoutes);
app.use("/dashboard", authenticateUser, dashboardRoutes);
app.use("/thoughts", thoughtRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
