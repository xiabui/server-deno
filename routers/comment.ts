import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import commentController from "../controllers/comment.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

router
  .get("/comments", commentController.getAllComments)
  .post("/comments/add", authMiddleware,commentController.addComment)
  .get("/comments/:id", commentController.getCommentById)
  .put("/comments/:id", commentController.updateCommentById)
  .delete("/comments/:id", commentController.deleteCommentById)
  .post("/comments/user", authMiddleware, commentController.getCommentByUser)
  .post("/comments/item", authMiddleware, commentController.getCommentByItemId)
  .post("/comments/update", authMiddleware, commentController.updateCommentByUser)
  .post("/comments/liked", authMiddleware, commentController.addLike)
  .post("/comments/is-liked", authMiddleware, commentController.isLiked)
    
export default router;