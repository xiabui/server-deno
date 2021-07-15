import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import videoController from "../controllers/video.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

router
  .get("/videos", videoController.getAllVideo)
  .post("/videos", videoController.addVideo)
  .get("/videos/:id", videoController.getVideoById)
  .put("/videos/:id", videoController.updateVideoById)
  .delete("/videos/:id", videoController.deleteVideoById)
  .post("/videos/course", videoController.getVideoByCourseId)
  .post("/videos/detail", authMiddleware, videoController.getDetailByVideoId)
    
export default router;