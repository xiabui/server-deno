import { Router } from "https://deno.land/x/oak/mod.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
const router = new Router();
// controller
import courseController from "../controllers/course.ts";

router
  .get("/courses", courseController.getAllCourses)
  .post("/courses", courseController.addCourse)
  .get("/courses/:id", courseController.getCourseById)
  .put("/courses/:id", courseController.updateCourseById)
  .delete("/courses/:id", courseController.deleteCourseById)
  .post("/courses/category", courseController.getCoursesByCategoryId)
  .post("/courses/item", courseController.getCourseItemByCourseId)
  .post("/courses/last_access", authMiddleware, courseController.getLastCourseAccess)
  .post("/courses/search", courseController.getCourseBySearch)
  .post("/courses/enroll", authMiddleware, courseController.enrollToCourse)
  .post("/courses/is-enroll", authMiddleware, courseController.isEnroll)
    
export default router;