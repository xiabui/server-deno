import { Router } from "https://deno.land/x/oak/mod.ts";
const router = new Router();
import assetsController from '../controllers/assets.ts';

router
    .get("/assets/img/:name", assetsController.getImage)

export default router;