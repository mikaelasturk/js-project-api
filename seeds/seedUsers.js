import { User } from "../models/User";
import bcrypt from "bcrypt";

export const seedingUsers = async () => {
  const salt = 10;

  if (process.env.RESET_SEED_DB === "true") {
    console.log("Resetting seeding database...");
    await User.deleteMany();
  }

  // To check if Carolina exists
  const carolinaExists = await User.findOne({
    email: "carolina.oldertz@gmail.com",
  });
  if (!carolinaExists) {
    await new User({
      firstName: "Carolina",
      lastName: "Oldertz",
      username: "carolina",
      email: "carolina.oldertz@gmail.com",
      password: bcrypt.hashSync("carolina", salt),
      city: "Stockholm",
    }).save();
  }

  // To check if Mikaela exists
  const mikaelaExists = await User.findOne({ email: "mikaelasturk@gmail.com" });
  if (!mikaelaExists) {
    await new User({
      firstName: "Mikaela",
      lastName: "Sturk",
      username: "mikaela",
      email: "mikaelasturk@gmail.com",
      password: bcrypt.hashSync("mikaela", salt),
      city: "Stockholm",
    
    }).save();
  }
};
