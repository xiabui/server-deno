import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import caterogyController from "../controllers/category.ts";

router
  .get("/categories", caterogyController.getAllCaterogy)
  .post("/categories", caterogyController.addCategory)
  .get("/categories/:id", caterogyController.getCaterogyById)
  .put("/categories/:id", caterogyController.updateCaterogyById)
  .delete("/categories/:id", caterogyController.deleteCaterogyById)
  
export default router;