import bcrypt from "bcrypt";
import { User } from "../../models/index.js";
import { ERRORS } from "../../utils/index.js";

export const loginUser = async (request, response) => {
  try {
    const { email, username, identifier, password } = request.body;
    const loginIdentifier = (identifier || email || username || "").trim();

    if (!loginIdentifier || !password) {
      return response.status(400).json({
        success: false,
        status: 400,
        error: ERRORS.INVALID_LOGIN,
        details: "Email/anvandarnamn och losenord kravs",
      });
    }

    const isEmail = loginIdentifier.includes("@");
    const query = isEmail
      ? { email: loginIdentifier.toLowerCase() }
      : { username: loginIdentifier };

    const user = await User.findOne(query);

    if (user && user.emailVerified === false) {
      return response.status(403).json({
        success: false,
        status: 403,
        error: "E-posten är inte verifierad ännu",
        details: "Verifiera din e-post innan du loggar in",
      });
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      response.status(200).json({
        success: true,
        message: "Login successful",
        response: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          cityValue: user.city,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      response.status(401).json({
        success: false,
        status: 401,
        error: ERRORS.INVALID_LOGIN,
        details: null,
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      status: 500,
      error: ERRORS.INTERNAL_ERROR,
      details: error.message,
    });
  }
};