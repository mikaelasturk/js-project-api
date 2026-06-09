// POST
export { signupUser } from "./POST/userSignup.js";
export { loginUser } from "./POST/userLogin.js";
export { createThought } from "./POST/thoughtCreate.js";
export { likeThought } from "./POST/thoughtLike.js";

// GET
export { getAllUsers } from "./GET/userGetAll.js";
export { getAllThoughts } from "./GET/thoughtGetAll.js";
export { getDashboard } from "./GET/dashboardGet.js";
export { getThoughtById } from "./GET/thoughtGetOne.js";
export { getThoughtsLikedByUser } from "./GET/thoughtsLikedByUser.js";
export { getAllCategories } from "./GET/thoughtCategories.js";
export { getAllTags } from "./GET/thoughtTags.js";
export { getThoughtsByUser } from "./GET/thoughtsByUser.js";

// PUT
export { updateThought } from "./PUT/thoughtUpdate.js";

// PATCH
export { updateThought as patchThought } from "./PATCH/thoughtUpdate.js";
export { updateUser } from "./PATCH/userUpdate.js";

// DELETE
export { deleteThought } from "./DELETE/thoughtDelete.js";
