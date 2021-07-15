import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import userController from "../controllers/user.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

router
  .get("/users", userController.getAllUsers)
  .post("/users", userController.createUser)
  .post("/users/info", userController.getUserByUsername)
  .put("/users/:id", userController.updateUserById)
  .delete("/uses/:id", userController.deleteUserById)
  .post("/users/login", userController.login)
  .post("/users/register", userController.registerAccount)
  .post("/users/reset_password", authMiddleware, userController.resetPassword)
  .post("/users/valid_token", userController.verifyToken)
  .post("/users/fullname", authMiddleware, userController.getUserFullname)
  .post("/users/forgot_password", authMiddleware, userController.getTokenForForgotenPasswordUser)

export default router;