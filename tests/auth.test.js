import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";

describe("Auth API", () => {
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
  });

  it("should redirect to Google OAuth", async () => {
    const res = await request(app).get("/auth/google");
    expect(res.statusCode).toBe(302); // Redirect
    expect(res.headers.location).toContain("accounts.google.com");
  });
});
