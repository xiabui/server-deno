import { Router } from "https://deno.land/x/oak/mod.ts";
const router = new Router();
import excerciseController from "../controllers/excercise.ts";
import authMiddleware from '../middlewares/authMiddleware.ts';

router
  .get("/excercises", excerciseController.getAll)
  .post("/excercises", excerciseController.addNew)
  .post("/excercises/id", authMiddleware, excerciseController.getById)
  .put("/excercises/:id", excerciseController.updateById)
  .delete("/excercises/:id", excerciseController.deleteById)
  .post("/excercises/get-by-course", authMiddleware, excerciseController.getByCourseId)
  .post("/excercises/marked", authMiddleware, excerciseController.addToExcerciseResult)
  .post("/excercises/marked-check", authMiddleware, excerciseController.doesUserDoExercise)
  .post("/excercises/get-marks", authMiddleware, excerciseController.getMarks)
  
export default router;