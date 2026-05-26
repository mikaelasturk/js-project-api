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
      email: "carolina.oldertz@gmail.com",
      password: bcrypt.hashSync("carolina", salt),
      city: "Stockholm",
      justifyMembership: "Hej på dig!!!!!!!!!!",
      isPremium: true,
      premiumStartDate: new Date(),
      premiumEndDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ),
    }).save();
  }

  // To check if Mikaela exists
  const mikaelaExists = await User.findOne({ email: "mikaelasturk@gmail.com" });
  if (!mikaelaExists) {
    await new User({
      firstName: "Mikaela",
      lastName: "Sturk",
      email: "mikaelasturk@gmail.com",
      password: bcrypt.hashSync("mikaela", salt),
      city: "Stockholm",
      justifyMembership: "Hej på digSAN!",
      isPremium: false,
    }).save();
  }
};
