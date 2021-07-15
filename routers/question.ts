import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import questionController from "../controllers/question.ts";
import authMiddleware from "../middlewares/authMiddleware.ts"

router
  .get("/questions", questionController.getAllQuestion)
  .post("/questions", questionController.addQuestion)
  .get("/questions/:id", questionController.getQuestionById)
  .put("/questions/:id", questionController.updateQuestionById)
  .delete("/questions/:id", questionController.deleteQuestionById)
  .post("/questions/get-by-excercise",authMiddleware, questionController.getByExcerciseId)
  
export default router;