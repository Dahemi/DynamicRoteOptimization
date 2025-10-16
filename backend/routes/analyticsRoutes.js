import express from "express";
import { getFleetManagerOverview } from "../controllers/analyticsController.js";
import { authenticateFleetManager } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/overview", authenticateFleetManager, getFleetManagerOverview);

export default router;
