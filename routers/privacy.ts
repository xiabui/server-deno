import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
// controller
import privacyController from "../controllers/privacy.ts";

router
  .get("/privacy", privacyController.getAllPrivacy)
  .post("/privacy", privacyController.addPrivacy)
  .get("/privacy/:id", privacyController.getPrivacyById)
  .put("/privacy/:id", privacyController.updatePrivacyById)
  .delete("/privacy/:id", privacyController.deletePrivacyById)
  
export default router;