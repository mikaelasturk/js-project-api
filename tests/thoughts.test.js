import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Thought from "../models/Thought.js";

describe("Thoughts API", () => {
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
    await Thought.deleteMany();
  });

  it("should create a new thought", async () => {
    const res = await request(app)
      .post("/thoughts")
      .send({ message: "Test thought", name: "TestUser" })
      .set("Authorization", "testtoken");
    expect(res.statusCode).toBe(401); // Should require auth
  });

  it("should get all thoughts", async () => {
    await Thought.create({ message: "Hello", name: "Test" });
    const res = await request(app).get("/thoughts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
