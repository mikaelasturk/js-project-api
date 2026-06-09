import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Thought from "../models/Thought.js";
import User from "../models/User.js";

describe("Thoughts API - extended", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost/happyThoughtsTest",
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    await User.deleteMany();
    await Thought.deleteMany();
    // Skapa en användare och hämta token (mock eller implementera auth-token om möjligt)
    // Här antas att /users/signup returnerar en token
    const res = await request(app)
      .post("/users/signup")
      .send({ username: "testuser", password: "testpass123" });
    token = res.body.token || "testtoken"; // fallback om ingen token returneras
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Thought.deleteMany();
  });


  it("should create a thought without auth", async () => {
    const res = await request(app)
      .post("/thoughts")
      .send({ message: "Public thought" });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("_id");
  });

  it("should not create a thought with too short message", async () => {
    const res = await request(app)
      .post("/thoughts")
      .set("Authorization", token)
      .send({ message: "Hi" });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("should like a thought", async () => {
    const thought = await Thought.create({ message: "Like me!", name: "Test" });
    const res = await request(app)
      .post(`/thoughts/${thought._id}/like`)
      .set("Authorization", token);
    expect([200, 201, 204]).toContain(res.statusCode);
  });

  it("should return 404 for non-existing thought", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/thoughts/${fakeId}/like`)
      .set("Authorization", token);
    expect(res.statusCode).toBe(404);
  });
});
