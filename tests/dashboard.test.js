import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Thought from "../models/Thought.js";

describe("Dashboard API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost/happyThoughtsTest",
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
    await Thought.deleteMany();
  });

  it("should require auth for dashboard", async () => {
    const res = await request(app).get("/dashboard");
    expect(res.statusCode).toBe(401);
  });
});
