import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";

describe("User API", () => {
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

  it("should not signup with invalid data", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({ username: "", password: "123" });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({ username: "testuser", password: "testpass123" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should not login with wrong password", async () => {
    await User.create({ username: "testuser2", password: "testpass123" });
    const res = await request(app)
      .post("/users/login")
      .send({ username: "testuser2", password: "wrongpass" });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
