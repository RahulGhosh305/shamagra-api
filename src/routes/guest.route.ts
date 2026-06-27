import { Router } from "express";
import { baseUrl } from "src/controllers/guest.controller";

const router = Router();

router.get("/", baseUrl);

export default router;